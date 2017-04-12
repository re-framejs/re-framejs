'use strict';
import {isImmutable, isPrimitive, isObservable, isRxObservable} from 'reframe/utils';
import * as Immutable from 'immutable';

function isSameType(a, b, predicate) {
    return predicate(a) && predicate(b);
}

function equals(a, b) {
    if (isSameType(a, b, isPrimitive)
        || isSameType(a, b, isImmutable)
        || isSameType(a, b, isObservable)) {
        return Immutable.is(a, b);
    } else if (isRxObservable(a, b)) {
        return a === b;
    }
    return false;
}

export function shouldUpdateArgv(props, nextProps) {
    if (props.length !== nextProps.length) {
        return true;
    }

    const maxLength = Math.max(props.length, nextProps.length);
    for (let i = 0; i < maxLength; i++) {
        if (!equals(props[i], nextProps[i])) {
            return true;
        }
    }
    return false;
}

/**
 * If props does not exist return false - Pure render mixin. If props exists and it contains mutable entries,
 * return false. If props contains only immutable entries compare them by type.
 *
 * @param {object} props current props
 * @param {object} nextProps new props
 * @param {array} ignore ignore these keys
 * @returns {boolean} true if component should be rerendered
 */
export function shouldUpdate(props, nextProps, ignore = []) {
    const keys1 = props ? Object.keys(props) : [];
    const keys2 = nextProps ? Object.keys(nextProps) : [];
    for (let prop of new Set(keys1.concat(keys2))) {
        if (ignore.length > 0 && ignore.indexOf(prop) >= 0) {
            continue;
        }
        if (!equals(props[prop], nextProps[prop])) {
            return true;
        }
    }
    return false;
}
