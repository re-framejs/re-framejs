'use strict';

import _ from 'underscore';
import * as Immutable from 'immutable';

/**
 * Predicate to check if a potential is an immutable structure or not.
 * Override through `shouldComponentUpdate.withDefaults` to support different cursor
 * implementations.
 *
 * Compare by property has better performance than instanceof in some browsers.
 *
 *
 * @module shouldComponentUpdate.isImmutable
 * @returns {Boolean}
 * @api public
 * @param maybeImmutable
 */
export function isImmutable(maybeImmutable) {
    return Immutable.Iterable.isIterable(maybeImmutable);
}

export function isImmutableEqual(a, b) {
    return a === b;
}

export function isPrimitive(value) {
    return _.isNumber(value) || _.isBoolean(value) || _.isString(value) || _.isNull(value) || _.isUndefined(value);
}

export function isPrimitiveEqual(a, b) {
    return a === b;
}

export function compare(current, next, typeCheck, equalCheck) {
    let isCurrent = typeCheck(current);
    let isNext = typeCheck(next);

    if (isCurrent && isNext) {
        return equalCheck(current, next);
    }
    if (isCurrent || isNext) {
        return false;
    }
}
