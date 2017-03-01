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
                    const subject = parentRx
                        .map(a => {
                            if (a && a.get) {
                                return a.get(lastFragment);
                            }
                        })
                        .distinctUntilChanged(x => x, (x, y) => x === y)
                        .shareReplay(1);
                    let oldSubscribe = subject.subscribe;
                    subject.subscribe = function () {
                        const sub = oldSubscribe.apply(this, arguments),
                            s = this;

                        return Rx.Disposable.create(function () {
                            sub.dispose();
                            if (s._count === 0) {
                                self.listeners = self.listeners.removeIn(pathSlice);
                            }
                        });
                    };
                    return subject;
                });
            },
            this.listeners
        );

        return this.listeners.getIn(path.concat([LISTENER_SENTINEL])).map(a => typeof a !== 'undefined' ? a : def);
    }
}


