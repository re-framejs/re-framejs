'use strict';

const immutablediff = require('immutablediff');

/* eslint-disable no-console */
export function debug(handler) {
    return (db, cmd) => {
        console.log('-- New Event ----------------------------------------------------');
        console.groupCollapsed('re-frame event: ', cmd.map(p => p && p.toJS ? p.toJS() : p));
        let newDb = handler(db, cmd),
            diff = immutablediff(db, newDb);
        diff.forEach(df => console.log(df.toJS()));
        console.groupEnd();
        return newDb;
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
