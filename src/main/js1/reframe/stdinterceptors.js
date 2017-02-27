import {toInterceptor, getEffect, getCoeffect, assocEffect, assocCoeffect} from 'reframe/interceptor';
import immutablediff from 'immutablediff';


export const debug = toInterceptor({
    id: 'debug',
    before: function debugBefore(ctx) {
        console.log('Handling re-frame event:', getCoeffect(ctx, 'event'));
        return ctx;
    },
    after: function debugAfter(ctx) {
        const
            event = getCoeffect(ctx, 'event'),
            origDb = getCoeffect(ctx, 'db'),
            newDb = getEffect(ctx, 'db', 'not-found');

        if (newDb === 'not-found') {
            console.log('No :db changes caused by:', event);
        } else {
            const diff = immutablediff(origDb, newDb);
            if (diff.length === 0) {
                console.log('No :db changes caused by:', event);
            } else {
                console.groupCollapsed('db diff for: ', event);
                try {
                    diff.forEach(df => {
                        console.log(df.get('op'), df.get('path'), df.get('value'));
                    });
                } finally {
                    console.groupEnd();
                }
            }
        }

        return ctx;
    }
});

export const trimv = toInterceptor({
    id: 'trim-v',
    before: function trimvBefore(ctx) {
        return ctx
            .updateIn(['coeffects', 'event'], event => event.slice(1))
            .setIn(['coeffects', 'untrimmed-event'], getCoeffect(ctx, 'event'));
    },
    after: function trimvAfter(ctx) {
        return ctx
            .deleteIn(['coeffects', 'untrimmed-event'])
            .setIn(['coeffects', 'event'], getCoeffect(ctx, 'untrimmed-event'));
    }
});

// Interceptor Factories - PART 1

/**
 * Returns an interceptor which wraps the kind of event handler given to `reg-event-db`.
 * These handlers take two arguments;  `db` and `event`, and they return `db`.
 * (fn [db event]
 * ....)
 * So, the interceptor wraps the given handler:
 * 1. extracts two `:coeffects` keys: db and event
 * 2. calls handler-fn
 * 3. stores the db result back into context's `:effects`
 * @param db
 * @param event
 */
export function dbHandlerToInterceptor(handlerFn) {
    return toInterceptor({
        id: 'db-handler',
        before: function dbHandlerBefore(ctx) {
            const
                db = getCoeffect(ctx, 'db'),
                event = getCoeffect(ctx, 'event');

            return assocEffect(ctx, 'db', handlerFn(db, event));
        }
    });
}

/**
 * Returns an interceptor which wraps the kind of event handler given to `reg-event-fx`.
 * These handlers take two arguments;  `coeffects` and `event`, and they return `effects`.
 * (fn [coeffects event]
 * {:db ...
 *  :dispatch ...})
 * Wrap handler in an interceptor so it can be added to (the RHS) of a chain:
 * 1. extracts `:coeffects`
 * 2. call handler-fn giving coeffects
 * 3. stores the result back into the `:effects`
 */
export function fxHandlerToInterceptor(handlerFn) {
    return toInterceptor({
        id: 'fx-handler',
        before: function fxHandlerBefore(ctx) {
            const event = getCoeffect(ctx, 'event');
            return ctx.set('effects', handlerFn(ctx.get('coeffects'), event));
        }
    });
}

/**
 * Returns an interceptor which wraps the kind of event handler given to `reg-event-ctx`.
 * These advanced handlers take one argument: `context` and they return a modified `context`.
 * Example:
 * (fn [context]
 * (enqueue context [more interceptors]))
 */
export function ctxHandlerToInterceptor(handlerFn) {
    return toInterceptor({
        id: 'ctx-handler',
        before: handlerFn
    });
}

// Interceptors Factories -  PART 2

/**
 * An interceptor factory which supplies a sub-path of `:db` to the handler.
 * It's action is somewhat analogous to `update-in`. It grafts the return
 * value from the handler back into db.
 * Usage:
 * (path :some :path)
 * (path [:some :path])
 * (path [:some :path] :to :here)
 * (path [:some :path] [:to] :here)
 * Notes:
 * 1. cater for `path` appearing more than once in an interceptor chain.
 * 2. `:effects` may not contain `:db` effect. Which means no change to
 * `:db` should be made.
 */
export function path(path) {
    const dbStoreKey = 'reframe-path/db-store';
    return toInterceptor({
        id: 'path',
        before: function pathBefore(ctx) {
            const originalDb = getCoeffect(ctx, 'db');

            ctx = ctx.update(dbStoreKey, Immutable.List(), old => old.push(originalDb));
            ctx = assocCoeffect(ctx, 'db', originalDb.getIn(path));
            return ctx;
        },
        after: function pathAfter(ctx) {
            const
                dbStore = ctx.get(dbStoreKey),
                originalDb = dbStore.last(),
                newDbStore = dbStore.pop(),
                ctx1 = assocCoeffect(ctx.set(dbStoreKey, newDbStore), 'db', originalDb),
                db = getEffect(ctx, 'db', 'not-found');

            if (db === 'not-found') {
                return ctx1;
            } else {
                return assocEffect(ctx1, 'db', originalDb.setIn(path, db));
            }
        }
    });
}

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
export function enrich(f) {
    return toInterceptor({
        id: 'enrich',
        after: function enrichAfter(ctx) {
            const
                event = getCoeffect(ctx, 'event'),
                db = getEffect(ctx, 'db') || getCoeffect(ctx, 'db');

            return assocEffect(ctx, 'db', f(db, event));
        }
    });
}

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
export function after(f) {
    return toInterceptor({
        id: 'after',
        after: function afterAfter(ctx) {
            const
                event = getCoeffect(ctx, 'event'),
                db = getEffect(ctx, 'db') || getCoeffect(ctx, 'db');
            f(db, event);
            return ctx;
        }
    });
}

/**
 * Interceptor factory which acts a bit like `reaction`  (but it flows into `db`, rather than out)
 * It observes N paths in `db` and if any of them test not indentical? to their previous value
 * (as a result of a handler being run) then it runs `f` to compute a new value, which is
 * then assoced into the given `out-path` within `db`.
 * Usage:
 * (defn my-f
 * [a-val b-val]
 * ... some computation on a and b in here)
 * (on-changes my-f [:c]  [:a] [:b])
 * Put this Interceptor on the right handlers (ones which might change :a or :b).
 * It will:
 * - call `f` each time the value at path [:a] or [:b] changes
 * - call `f` with the values extracted from [:a] [:b]
 * - assoc the return value from `f` into the path  [:c]
 */
export function onChanges(f, outPath, ...inPaths) {
    return toInterceptor({
        id: 'on-changes',
        after: function onChangesAfter(ctx) {
            const
                oldDb = getCoeffect(ctx, 'db'),
                newDb = getEffect(ctx, 'db'),
                newIns = inPaths.map(path => newDb.getIn(path)),
                oldIns = inPaths.map(path => oldDb.getIn(path)),
                changedIns = newIns.zip(oldIns).map(([a, b]) => a === b).contains(false);

            if (changedIns) {
                return assocEffect(ctx, 'db', newDb.setIn(outPath, f(newIns)));
            }
            return ctx;


            return ctx;
        }
    });
}
