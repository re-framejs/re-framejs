'use strict';
import {isImmutable, isPrimitive, isObservable} from 'reframe/utils';

function isChanged(entries) {
    return !entries.every(function ([value, nextValue]) {
        if (isObservable(value) || isObservable(nextValue)) {
            return true;
        }

        if ((isPrimitive(value) && isPrimitive(nextValue))
            ||
            (isImmutable(value) && isImmutable(nextValue))) {

            return value === nextValue;
        }
        return false;
    });
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
export function shouldUpdate(props, nextProps, ignore) {
    let entries;
    if (nextProps === props || nextProps.length !== props.length) {
        return false;
    }
    if (ignore && ignore.length > 0) {
        entries = Object.keys(props)
            .filter(k => ignore.indexOf(k) === -1)
            .map(k => [props[k], nextProps[k]]);
    } else {
        entries = Object.keys(props).map(k => [props[k], nextProps[k]]);
    }

    if (entries.length) {
       return isChanged(entries);
    }
    return false;
}
