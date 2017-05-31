import * as cofx from 'reframe/cofx';
import * as db from 'reframe/db';
import * as events from 'reframe/events';
import * as fx from 'reframe/fx';
import * as interceptor from 'reframe/interceptor';
import * as interop from 'reframe/interop';
import {makeRatom, makeReaction, makeCursor} from 'reframe/ratom';
import * as react from 'reframe/react';
import * as registrar from 'reframe/registrar';
import * as router from 'reframe/router';
import * as stdinterceptors from 'reframe/stdinterceptors';
import * as subs from 'reframe/subs';
import * as batching from 'reframe/batching';
import * as Rx from 'rx';

// import * as _form from 'reframe/form/core';
//
// export const form = _form;
export function toggleDebug(value = undefined) {
    interop.toggleLog('debug', value);
}

export function toggleReactDebug(value = undefined) {
    interop.toggleLog('traceReact', value);
}

export function isDebug() {
    return interop.isDebug();
}

export function atom(value) {
    return makeRatom(value);
}

export function reaction(f) {
    return makeReaction(f);
}

export function cursor(atom, path) {
    return makeCursor(atom, path);
}

export const appDb = db.appDb;
export const db$ = db.appDb.subject();
export const dispatch = router.dispatch;
export const dispatchSync = router.dispatchSync;

export const toInterceptor = interceptor.toInterceptor;
export const enqueue = interceptor.enqueue;
export const getCoeffect = interceptor.getCoeffect;
export const getEffect = interceptor.getEffect;
export const assocEffect = interceptor.assocEffect;
export const assocCoeffect = interceptor.assocCoeffect;

export const when = stdinterceptors.when;
export const debug = stdinterceptors.debug;
export const path = stdinterceptors.path;
export const enrich = stdinterceptors.enrich;
export const trimv = stdinterceptors.trimv;
export const after = stdinterceptors.after;
export const onChanges = stdinterceptors.onChanges;

/**
 * Associate a given `query id` with a given subscription handler function `handler-fn`
 * which is expected to take two arguments: app-db and query vector, and return
 * a `reaction`.
 * This is a low level, advanced function.  You should probably be using reg-sub
 * instead.
 */
export function regSubRaw(queryId, handlerFn) {
    return registrar.registerHandler(subs.kind, queryId, queryId, handlerFn)
}

export const regSub = subs.regSub;
export const subscribe = subs.subscribe;

export function clearSub(id) {
    registrar.clearHandlers(subs.kind, id);
}
export const clearSubscriptionCache = subs.clearSubscriptionCache;

// effects
export const regFx = fx.register;
export function clearFx(id) {
    registrar.clearHandlers(fx.kind, id);
}

// coeffects
export const regCofx = cofx.register;
export const injectCofx = cofx.injectCofx;
export function clearCofx(id) {
    registrar.clearHandlers(cofx.kind, id);
}


// Events
export function clearEvent(id) {
    registrar.clearHandlers(events.kind, id);
}

/**
 * Register the given `id`, typically a keyword, with the combination of
 * `db-handler` and an interceptor chain.
 * `db-handler` is a function: (db event) -> db
 * `interceptors` is a collection of interceptors, possibly nested (needs flattening).
 * `db-handler` is wrapped in an interceptor and added to the end of the chain, so in the end
 * there is only a chain.
 * The necessary effects and coeffects handler are added to the front of the
 * interceptor chain.  These interceptors ensure that app-db is available and updated.
 */
export function regEventDb(id, interceptors, dbHandler) {
    if (typeof dbHandler === 'undefined') {
        dbHandler = interceptors;
        interceptors = null;
    }
    return events.register(id, [cofx.injectDb, fx.doFx, interceptors, stdinterceptors.dbHandlerToInterceptor(dbHandler)]);
}

export function regEventFx(id, interceptors, fxHandler) {
    if (typeof fxHandler === 'undefined') {
        fxHandler = interceptors;
        interceptors = null;
    }
    return events.register(id, [cofx.injectDb, fx.doFx, interceptors, stdinterceptors.fxHandlerToInterceptor(fxHandler)]);
}

export function regEventCtx(id, interceptors, ctxHandler) {
    if (typeof ctxHandler === 'undefined') {
        ctxHandler = interceptors;
        interceptors = null;
    }
    return events.register(id, [cofx.injectDb, fx.doFx, interceptors, stdinterceptors.ctxHandlerToInterceptor(ctxHandler)]);
}

// react
export const viewP = react.viewP;
export const viewV = react.viewV;
export const viewSP = react.viewSP;
export const viewSV = react.viewSV;
export const view = react.viewSV;
export const ui = react.ui;
export const uix = react.uix;
export const render = batching.flush;
export const flush = batching.flush;


// deprecated
import {Index} from 'reframe/subindex.js';
let index = new Index(()=>subs.requestAnimationFrame$);
export function indexPath(path, def) {
    return index.sub(path, def);
}

export function registerSub(name, handler) {
    return subs.registerSub(name, handler);
}

export function registerHandler(id, interceptors, handler) {
    return regEventDb(id, interceptors, handler);
}

export function compMiddleware(interceptors) {
    return interceptors;
}

export function swap(atom, f, ...args) {
    return atom.swap(f, ...args);
}

export function reset(atom, value) {
    return atom.reset(value);
}

module.exports.default = module.exports;

export const pause$ = new Rx.Subject();

export function togglePause(pause) {
    if (pause) {
        router.pause();
    } else {
        router.resume();
    }
}
pause$.subscribe(pause => togglePause(pause));

export const markFlushDom = router.markFlushDom;

export function deref(observable) {
    return observable.deref();
}