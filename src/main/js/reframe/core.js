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

/**
 * Atom provides a way to manage shared, synchronous, independent state. Atom holds
 * value which can be dereferenced (deref), changed (reset), updated (swap).
 *
 */
export function atom(value) {
    return makeRatom(value);
}

/**
 * Reaction is functional transformation of the observable object (Atom, Reaction, Cursor).
 *
 * Reaction can be deref-ed.
 */
export function reaction(f) {
    return makeReaction(f);
}

/**
 * Cursor is reaction with "map" function transforming observable object.
 */
export function cursor(atom, path) {
    return makeCursor(atom, path);
}

/**
 * Re-frame state.
 */
export const appDb = db.appDb;
/**
 * RX stream for appDb changes.
 */
export const db$ = db.appDb.subject();
/**
 * Queue the given event for processing by the registered event handler.
 * Just to be clear: the event handler is not run immediately - it is not run
 * synchronously. It will likely be run 'very soon', although it may be
 * added to the end of a FIFO queue which already contain events.
 * Usage:
 *  dispatch(['delete-item', 42])
 */
export const dispatch = router.dispatch;
/**
 * Sychronously (immediately!) process the given event using the registered handler.
 * Generally, you shouldn't use this - you should use `dispatch` instead.  It
 * is an error to use `dispatch-sync` within an event handler.
 * Usage:
 *  dispatchSync(['delete-item', 42])
 */
export const dispatchSync = router.dispatchSync;

/**
 * Transform ordinary js map to interceptor. Map can contain entries for:
 *  - id
 *  - before(ctx)
 *  - update(ctx)
 */
export const toInterceptor = interceptor.toInterceptor;
/**
 * Queue interceptor into processing. Should be called within interceptor.
 */
export const enqueue = interceptor.enqueue;
/**
 * Helper function for obtaining coeffect from interceptor context.
 */
export const getCoeffect = interceptor.getCoeffect;
/**
 * Helper function for obtaining effect from interceptor context.
 */
export const getEffect = interceptor.getEffect;
/**
 * Helper function for setting effect to interceptor context.
 */
export const assocEffect = interceptor.assocEffect;
/**
 * Helper function for setting coeffect to interceptor context.
 */
export const assocCoeffect = interceptor.assocCoeffect;

/**
 * Conditional interceptor:
 *
 * Usage when(() => window.debug, reframe.debug)
 */
export const when = stdinterceptors.when;
/**
 * Debug log for commands and appDb diffs.
 */
export const debug = stdinterceptors.debug;
/**
 * An interceptor factory which supplies a sub-path of `appDb` to the handler.
 * It's action is somewhat analogous to `updateIn`. It grafts the return
 * value from the handler back into db.
 * Usage:
 * path(['some', 'path'])
 */
export const path = stdinterceptors.path;
/**
 * Interceptor factory which runs the given function `f` in the `after handler`
 * position.  `f` is called with two arguments: `db` and `v`, and is expected to
 * return a modified `db`.
 * Unlike the `after` inteceptor which is only about side effects, `enrich`
 * expects `f` to process and alter the given `db` coeffect in some useful way,
 * contributing to the derived data, flowing vibe.
 * Example Use:
 * ------------
 * Imagine that todomvc needed to do duplicate detection - if any two todos had
 * the same text, then highlight their background, and report them in a warning
 * down the bottom of the panel.
 * Almost any user action (edit text, add new todo, remove a todo) requires a
 * complete reassesment of duplication errors and warnings. Eg: that edit
 * just made might have introduced a new duplicate, or removed one. Same with
 * any todo removal. So we need to re-calculate warnings after any CRUD events
 * associated with the todos list.
 * Unless we are careful, we might end up coding subtly different checks
 * for each kind of CRUD operation.  The duplicates check made after
 * 'delete todo' event might be subtly different to that done after an
 * eddting operation. Nice and efficient, but fiddly. A bug generator
 * approach.
 * So, instead, we create an `f` which recalcualtes warnings from scratch
 * every time there is ANY change. It will inspect all the todos, and
 * reset ALL FLAGS every time (overwriting what was there previously)
 * and fully recalculate the list of duplicates (displayed at the bottom?).
 * By applying `f` in an `:enrich` interceptor, after every CRUD event,
 * we keep the handlers simple and yet we ensure this important step
 * (of getting warnings right) is not missed on any change.
 * We can test `f` easily - it is a pure fucntions - independently of
 * any CRUD operation.
 * This brings huge simplicity at the expense of some re-computation
 * each time. This may be a very satisfactory tradeoff in many cases.
 */
export const enrich = stdinterceptors.enrich;
/**
 * Remove command name from command.
 *
 * ['cmd-name', param1, param2] -> [param1, param2]
 */
export const trimv = stdinterceptors.trimv;
/**
 * Interceptor factory which runs a given function `f` in the \"after\"
 * position, presumably for side effects.
 * `f` is called with two arguments: the `effects` value of `:db`
 * (or the `coeffect` value of db if no db effect is returned) and the event.
 * Its return value is ignored so `f` can only side-effect.
 * Example use:
 * - `f` runs schema validation (reporting any errors found)
 * - `f` writes some aspect of db to localstorage.
 *
 */
export const after = stdinterceptors.after;
/**
 * Interceptor factory which acts a bit like `reaction`  (but it flows into `db`, rather than out)
 * It observes N paths in `db` and if any of them test not === to their previous value
 * (as a result of a handler being run) then it runs `f` to compute a new value, which is
 * then assoced into the given `out-path` within `db`.
 * Usage:
 * function myF(aVal, bVal) {
 *   ... some computation on a and b in here)
 * }
 * onChanges(myf, ['c'], ['a'], ['b'])
 * Put this Interceptor on the right handlers (ones which might change 'a' or 'b').
 * It will:
 * - call `f` each time the value at path ['a'] or ['b'] changes
 * - call `f` with the values extracted from ['a'] ['b']
 * - assoc the return value from `f` into the path  ['c']
 */
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

/**
 * Associate the given `query id` with a handler function and an optional signal function.
 *
 * There's 2 ways this function can be called
 *
 * 1. regSub('test-sub', (db, [_]) => db)
 * The value in app-db is passed to the computation function as the 1st argument.
 *
 * 2. regSub('a-b-sub',
 * (q-vec, d-vec) => [subscribe(['a-sub']), subscribe(['b-sub'])],
 * ([a, b], q-vec) => {a: a, b: b})
 *
 * Two functions provided. The 2nd is computation function, as before. The 1st
 * is returns what `input signals` should be provided to the computation. The
 * `input signals` function is called with two arguments: the query vector
 * and the dynamic vector. The return value can be singleton reaction or
 * a sequence of reactions.
 *
 */
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
/**
 *   Returns an interceptor which adds to a `context's` `:coeffects`.
 * `coeffects` are the input resources required by an event handler
 * to perform its job. The two most obvious ones are `db` and `event`.
 * But sometimes a handler might need other resources.
 * Perhaps a handler needs a random number or a GUID or the current datetime.
 * Perhaps it needs access to the connection to a DataScript database.
 * If the handler directly access these resources, it stops being as
 * pure. It immedaitely becomes harder to test, etc.
 * So the necessary resources are \"injected\" into the `coeffect` (map)
 * given the handler.
 * Given an `id`, and an optional value, lookup the registered coeffect
 * handler (previously registered via `reg-cofx`) and it with two arguments:
 * the current value of `:coeffects` and, optionally, the value. The registered handler
 * is expected to return a modified coeffect.
 */
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
/**
 * Create react view suitable for use with reframe.
 *
 * Usage:
 *
 * const MyView = reframe.ui('MyView', function renderMyView(props) {
 * });
 *
 * const MyView = reframe.ui('MyView', [mixins], function renderMyView(props) {
 * });
 *
 * const MyView = reframe.ui('MyView', [mixins], {
 *  componentWillUpdate(nextProps, nextState) {
 *  },
 *  render(props) {
 *  }
 * });
 */
export const ui = react.ui;
export const uix = react.uix;
export const render = batching.flush;
export const flush = batching.flush;


// deprecated
import {Index} from 'reframe/subindex.js';
let index = new Index(() => subs.requestAnimationFrame$);
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