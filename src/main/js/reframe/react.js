'use strict';

import * as subs from 'reframe/subs.js';
import * as React from 'react';
import * as Rx from 'rx';
import {shouldUpdate} from 'reframe/shouldupdate';

export function deref(rx, transform) {
    let ttransform = transform || (a=>a);
    let subj = new Rx.BehaviorSubject();
    rx.map(ttransform).subscribe(subj).dispose();
    return subj.getValue();
}

let data = {
    renderOrder: 0,
    toUpdate: []
};

function shouldUpdateByDerefed(derefed) {
    return derefed
        .map(([rx, oldValue])=> {
            return rx.getValue() !== oldValue;
        })
        .reduce((acc, v) => acc || v, false);
}

function needUpdate(obj) {
     //console.log('Need update', obj.getDisplayName());
    data.toUpdate.push([obj.state.renderOrder, ()=> {
        if (shouldUpdateByDerefed(obj.state.derefed)) {
            // console.log('Force update', obj.getDisplayName());
            obj.forceUpdate();
        }
    }]);
}

export function render() {
    data.toUpdate.sort(([o1], [o2]) => o1 - o2);

    data.toUpdate.forEach(([_, forceUpdate]) => forceUpdate());
    data.toUpdate = [];
}
subs.render$.subscribe(render);
window.render = render;

export let StatelessMixin = {
    shouldComponentUpdate: function (nextProps, nextState) {
        return shouldUpdate(this.props, nextProps, ['argv']) || shouldUpdate(this.state, nextState) || shouldUpdate(this.props.argv, nextProps.argv);
    },
    getDisplayName: function () {
        return this.constructor.displayName;
    }
};

export let SubscriptionMixin = {
    derefSub(subVec) {
        return this.deref(subs.subscribe(subVec));
    },
    getDisplayName: function () {
        return this.constructor.displayName;
    },
    getInitialState: function () {
        return {
            derefed: [],
            renderOrder: data.renderOrder++
        };
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        let updateByProps = shouldUpdate(this.props, nextProps, ['argv']) || shouldUpdate(this.props.argv, nextProps.argv),
            updateByState = shouldUpdate(this.state, nextState, ['derefed', 'renderOrder']);

        return updateByProps || updateByState;
    },
    deref: function (rx, aTransform) {
        let transform = aTransform || (a=>a),
            replay = new Rx.ReplaySubject(1),
            subj = new Rx.BehaviorSubject();
        let disposable = new Rx.CompositeDisposable(
            rx
                .distinctUntilChanged(x=>x, (x, y) => x === y)
                .map(transform)
                .subscribe(replay),
            replay
                .subscribe(subj),
            replay
                .skip(1)
                .subscribe(() => {
                    needUpdate(this);
                }));
        this.state.derefed.push([
            subj,
            subj.getValue(),
            disposable
        ]);
        return subj.getValue();
    },
    unsubscribe: function () {
        this.state.derefed.forEach(([_1, _2, subscription]) => {
            subscription.dispose();
        });

        this.state.derefed = [];
    },
    componentWillUpdate: function () {
        // console.log('Rendering', this.getDisplayName());
        this.unsubscribe();
    },
    componentWillUnmount: function () {
        this.unsubscribe();
    }
};

function createComponentObj(mixins, args) {
    let componentObj;
    switch (args.length) {
        case 2:
            if (typeof args[1].prototype === 'undefined') {
                args[1].mixins = mixins;
                componentObj = args[1];
            } else {
                componentObj = {
                    mixins: mixins,
                    render: args[1]
                };
            }
            break;
        case 3:
            if (typeof args[2].prototype === 'undefined') {
                // it's an object
                args[2].mixins = mixins.concat(args[1]);
                componentObj = args[2];
            } else {
                // it's a render function
                componentObj = {
                    mixins: mixins.concat(args[1]),
                    render: args[2]
                };
            }
            break;
        default :
            throw new Error('Expected 2 or 3 arguments, got ' + args.length);
    }
    componentObj.displayName = args[0];
    return componentObj;
}

function propsView(mixin, args) {
    let componentObj = createComponentObj(mixin, args);
    let oldRender = componentObj.render;
    componentObj.render = function () {
        return oldRender.call(this, this.props);
    };

    let component = React.createClass(componentObj);

    return React.createFactory(component);
}

function vectorView(mixin, args) {
    let componentObj = createComponentObj(mixin, args);
    let oldRender = componentObj.render;
    componentObj.render = function () {
        return oldRender.apply(this, this.props.argv);
    };
    let component = React.createClass(componentObj);
    let factory = React.createFactory(component);

    return function () {
        return factory({argv: Array.prototype.slice.call(arguments)});
    };
}

export function viewP() {
    return propsView([StatelessMixin], arguments);
}

export function viewV() {
    return vectorView([StatelessMixin], arguments);
}

export function viewSP() {
    return propsView([SubscriptionMixin], arguments);
}

export function viewSV() {
    return vectorView([SubscriptionMixin], arguments);
}
