'use strict';
import * as Rx from 'rx';

export function atom(value) {
    return new Rx.BehaviorSubject(value);
}

export function swap(aAtom, update) {
    aAtom.onNext(update(aAtom.getValue()));
}
