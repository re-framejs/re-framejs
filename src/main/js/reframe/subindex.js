'use strict';
import * as Immutable from 'immutable';
import * as Rx from 'rx';
const LISTENER_SENTINEL = {};

export class Index {
    constructor(rx) {
        this.listeners = Immutable.Map();
        this.rx = rx;
    }

    sub(path, def) {
        const self = this;

        let slices = [];
        for (let i = 0; i < path.length; i++) {
            slices.push(Array.prototype.slice.call(path.slice(0, i + 1)));
        }
        this.listeners = slices.reduce(
            (acc, pathSlice) => {
                let parentPath = pathSlice.slice(0, pathSlice.length - 1);
                let parentRx = parentPath.length === 0 ? this.rx() : acc.getIn(parentPath.concat(LISTENER_SENTINEL));
                let lastFragment = pathSlice[pathSlice.length - 1];
                return acc.updateIn(pathSlice.concat(LISTENER_SENTINEL), old => {
                    if (old) {
                        return old;
                    }
                    let subject = new Rx.ReplaySubject(1),
                        subscription = parentRx
                            .map(a => {
                                if (a) {
                                    return a.get(lastFragment);
                                }
                                return def;
                            })
                            .distinctUntilChanged(x => x, (x, y) => x === y)
                            //.doOnNext(v => console.log('v', v.toJS()))
                            .subscribe(subject);
                    let oldSubscribe = subject.subscribe;
                    subject.subscribe = function () {
                        const sub = oldSubscribe.apply(this, arguments);

                        return Rx.Disposable.create(function () {
                            sub.dispose();
                            if (!subject.hasObservers()) {
                                subscription.dispose();
                                self.listeners = self.listeners.removeIn(pathSlice);
                            }
                        });
                    };
                    return subject;
                });
            },
            this.listeners
        );

        return this.listeners.getIn(path.concat([LISTENER_SENTINEL]), new Rx.BehaviorSubject(Immutable.Map()));
    }
}


