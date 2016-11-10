'use strict';

import immutablediff from 'immutable-diff';
import {isImmutable, isPrimitive, isFunction, isObject} from 'reframe/utils';


function serialize(obj) {
    if (obj === null || typeof obj === 'undefined') {
        return obj;
    } else if (isImmutable(obj)) {
        return JSON.stringify(obj.toJS());
    } else if (isObject(obj)) {
        return JSON.stringify(obj);
    }
    return obj;
}

/* eslint-disable no-console */
export function debug(handler) {
    return (db, cmd) => {
        console.log('-- New Event ----------------------------------------------------');
        console.groupCollapsed('re-frame event: ', cmd.map(serialize));
        console.log('Event: ', cmd.map(p => p && p.toJS ? p.toJS() : p));
        try {
            let newDb = handler(db, cmd),
                diff = immutablediff(db, newDb);
            diff.forEach(df => {
                const {op, path, value} = df.toJS();
                console.log(op, path, value);
            });
            return newDb;
        } finally {
            console.groupEnd();
        }
    };
}
/* eslint-enable no-console */

export function trimv(handler) {
    return (db, cmd) => handler(db, cmd.slice(1));
}

export function path(p, dflt) {
    return handler => (db, cmd) => {
        let newValue = handler(db.getIn(p, dflt), cmd);
        return db.setIn(p, newValue);
    };
}

export function enrich(enrichHandler) {
    return handler => (db, cmd) => {
        let newDb = handler(db, cmd);
        return enrichHandler(newDb, cmd, db);
    };
}

export function after(afterHandler) {
    return handler => (db, cmd) => {
        let newDb = handler(db, cmd);
        afterHandler(newDb, cmd, db);
        return newDb;
    };
}
