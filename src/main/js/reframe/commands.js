'use strict';

import {db$} from 'reframe/db.js';
import * as Rx from 'rx';
import {animationFrame$, sync$} from 'reframe/subs.js';
import {Dispatcher} from 'reframe/dispatcher.js';
import * as Immutable from 'immutable';

const commandDispatcher = new Dispatcher();
const cmd$ = new Rx.Subject();

export function compMiddleware(middlewares) {
    return handler => {
        let compHandler = middlewares.reverse().filter(a => a).reduce(
            (acc, middleware) => middleware(acc),
            handler
        );

        return compHandler;
    };
}

export function registerHandler() {
    let eventId, middleware, handlerFn;

    switch (arguments.length) {
        case 2:
            eventId = arguments[0];
            middleware = handler => handler;
            handlerFn = arguments[1];
            break;
        case 3:
            eventId = arguments[0];
            middleware = Array.isArray(arguments[1]) ? compMiddleware(arguments[1]) : arguments[1];
            handlerFn = arguments[2];
            break;
        default:
            throw new Error('Expected 2 or 3 arguments, got ' + arguments.length);
    }

    commandDispatcher.register(eventId, middleware(handlerFn));
}

export function dispatch(cmd) {
    cmd$.onNext([false, cmd]);
}

export function dispatchSync(cmd) {
    cmd$.onNext([true, cmd]);
}

cmd$
    .scan(
        ([version, db], [sync, cmd]) => {
            const handler = commandDispatcher.lookup(cmd[0]);

            const newDb = handler(db, cmd);

            if (newDb !== db) {
                db$.onNext(newDb);
                const nextVersion = version + 1;
                if (sync) {
                    sync$.onNext([nextVersion, newDb]);
                } else {
                    animationFrame$.onNext([nextVersion, newDb]);
                }

                return [nextVersion, newDb];
            }
            return [version, db];
        },
        [0, Immutable.Map()]
    )
    .subscribe();