'use strict';

import _ from 'underscore';
import {isImmutable, isImmutableEqual, isPrimitive, isPrimitiveEqual, compare} from './utils';


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
        let filtered = _.filter(props, (v, k) => !_.contains(ignore, k));
        entries = _.map(filtered, (v, k) => [v, nextProps[k]]);
    } else {
        entries = _.map(props, (v, k) => [v, nextProps[k]]);
    }

    if (entries.length) {
        return _.some(entries, function ([value, nextValue]) {
            let immutableEqual = compare(value, nextValue, isImmutable, isImmutableEqual);

            if (!_.isUndefined(immutableEqual)) {
                if (!immutableEqual) {
                    console.debug('Immutable ', value, nextValue, ' not equal');
                }
                return !immutableEqual;
            }

            let primitiveEqual = compare(value, nextValue, isPrimitive, isPrimitiveEqual);
            if (!_.isUndefined(primitiveEqual)) {
                if (!primitiveEqual) {
                    console.debug('Primitive ', value, nextValue, ' not equal');
                }
                return !primitiveEqual;
            }

            console.warn('Props ', value, nextValue, ' are not immutable');
            return true;
        });
    }
    return false;
}
