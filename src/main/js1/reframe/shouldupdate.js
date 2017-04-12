'use strict';
import {isImmutable, isPrimitive, isObservable} from 'reframe/utils';

export function shouldUpdateArgv(props, nextProps) {
    if (props.length !== nextProps.length) {
        return true;
    }

    const maxLength = Math.max(props.length, nextProps.length);
    for (let i=0; i< maxLength; i++) {
        if (!Immutable.is(props[i], nextProps[i])) {
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
export function shouldUpdate(props, nextProps, ignore=[]) {
    const keys1 = props? Object.keys(props) : [];
    const keys2 = nextProps?Object.keys(nextProps) : [];
    for (let prop of new Set(keys1.concat(keys2))) {
        if (ignore.length > 0 && ignore.indexOf(prop) >= 0) {
            continue;
        }
        if (!Immutable.is(props[prop], nextProps[prop])) {
            return true;
        }
    }
    return false;
}
