import * as Immutable from 'immutable';
import {Observable} from 'reframe/ratom';
import * as Rx from 'rx';

export function isImmutable(maybeImmutable) {
    return maybeImmutable instanceof Immutable.Iterable;
}

export function isPrimitive(value) {
    var type = typeof value;
    return type === 'number' || type === 'boolean' || type === 'string' || value === null || value === void 0;
}

export function isFunction(obj) {
    return typeof obj === 'function';
}

export function isObject(obj) {
    return typeof obj === 'object';
}

export function isObservable(obj) {
    return obj instanceof Observable;
}

export function isRxObservable(obj) {
    return obj instanceof Rx.Observable;
}