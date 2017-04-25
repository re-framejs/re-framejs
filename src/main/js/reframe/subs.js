import * as  Immutable from 'immutable';
import * as Rx from 'rx';
import {makeAtom, makeReaction, makeRxReaction} from 'reframe/ratom';
import {registerHandler, getHandler, clearHandlers} from 'reframe/registrar';
import {appDb} from 'reframe/db';
import {reagentId} from 'reframe/interop';

export const kind = 'sub';

// -- cache -------------------------------------------------------------------
//
// De-duplicate subscriptions. If two or more equal subscriptions
// are concurrently active, we want only one handler running.
// Two subscriptions are "equal" if their query vectors serialized to string equals.
const queryReaction = makeAtom(Immutable.Map());
// window.queryReaction = queryReaction;

/**
 * Runs on-dispose for all subscriptions we have in the subscription cache.
 Used to force recreation of new subscriptions. Should only be necessary
 in development.
 The on-dispose functions for the subscriptions will remove themselves from the
 cache.
 Useful when reloading Figwheel code after a React exception, as React components
 aren't cleaned up properly. This means a subscription's on-dispose function isn't
 run when the components are destroyed. If a bad subscription caused your exception,
 then you can't fix it without reloading your browser.
 */
export function clearSubscriptionCache() {
    queryReaction.deref().forEach((reaction) => reaction.dispose());

    if (!queryReaction.deref().isEmpty()) {
        console.warn("Subscription cache should be empty after clearing it.");
    }
}

function makeCacheKey(query, dynv) {
    // cache key should be created either recursively or serializing by string, string is faster (?? safer ??)
    return (query || []).join("|") + "|" + (dynv || []).join("|");
    // return Immutable.List([Immutable.List(query), Immutable.List(dynv)]);
}

export function clearAllHandlers() {
    clearHandlers(kind);
    clearSubscriptionCache();
}

function cacheAndReturn(query, dynv, r) {
    const cacheKey = makeCacheKey(query, dynv);
    r.addOnDispose(() => {
        queryReaction.swap((cache) => cache.delete(cacheKey));
    });

    queryReaction.swap((cache) => cache.set(cacheKey, r));
    return r;
}

function cacheLookup(query, dynv = Immutable.List()) {
    return queryReaction.deref().get(makeCacheKey(query, dynv));
}

export function subscribe(query, dynv = undefined) {
    if (typeof dynv === 'undefined') {

        const cached = cacheLookup(query);
        if (cached) {
            return cached;
        }

        const
            [queryId] = query,
            handlerFn = getHandler(kind, queryId);

        if (!handlerFn) {
            console.error("re-frame: no subscription handler registered for: \"", queryId, "\". Returning a nil subscription.");
        } else {
            return cacheAndReturn(query, [], handlerFn(appDb, query))
        }
    } else {
        const cached = cacheLookup(query, dynv);
        if (cached) {
            return cached;
        }

        const
            [queryId] = query,
            handlerFn = getHandler(kind, queryId);

        if (!handlerFn) {
            console.error("re-frame: no subscription handler registered for: \"", queryId, "\". Returning a nil subscription.");
        } else {
            const
                dynVals = makeReaction(() => dynv.map(v => v.deref())),
                sub = makeReaction(() => handlerFn(appDb, dynVals.deref()));

            return cacheAndReturn(query, [], makeReaction(() => sub.deref().deref()));
        }
    }
}

function derefInputSignals(signals, queryId) {
    if (Array.isArray(signals)) {
        return signals.map(v => v.deref());
    }
    else if (signals instanceof Immutable.Map) {
        return signals.map(v => v.deref());
    }
    else if (signals instanceof Immutable.Seq) {
        return signals.map(v => v.deref());
    }
    else if (signals && signals.deref) {
        return signals.deref();
    } else {
        console.error("re-frame: in the reg-sub for ", query - id, ", the input-signals function returns: ", signals);
    }
}

function partition(input, spacing) {
    var output = [];

    for (var i = 0; i < input.length; i += spacing) {
        output[output.length] = input.slice(i, i + spacing);
    }

    return output;
}

function makeMultiInputPairsFn(inputArgs) {
    const
        pairs = partition(inputArgs, 2),
        vecs = pairs.map(p => p[1]);

    return function inpFn() {
        return vecs.map(subscribe);
    };
}

function makeInputsFn(inputArgs) {
    switch (inputArgs.length) {
        // no `inputs` function provided - give the default
        case 0:
            return () => appDb;

        // a single `inputs` fn
        case 1:
            return inputArgs[0];

        // one sugar pair
        case 2:
            return function inpFn() {
                return subscribe(inputArgs[1]);
            };

        // multiple sugar pairs
        default:
            return makeMultiInputPairsFn(inputArgs);

    }
}

function checkRx(reaction) {
    if (reaction instanceof Rx.Observable) {
        return makeRxReaction(reaction);
    }
    return reaction;
}

/**
 *   "Associate the given `query id` with a handler function and an optional signal function.

 There's 2 ways this function can be called

 1. regSub('test-sub', (db, [_]) => db)
 The value in app-db is passed to the computation function as the 1st argument.

 2. regSub('a-b-sub',
        (q-vec, d-vec) => [subscribe(['a-sub']), subscribe(['b-sub'])],
        ([a, b], q-vec) => {a: a, b: b})

 Two functions provided. The 2nd is computation function, as before. The 1st
 is returns what `input signals` should be provided to the computation. The
 `input signals` function is called with two arguments: the query vector
 and the dynamic vector. The return value can be singleton reaction or
 a sequence of reactions.

 "
 */
export function regSub(queryId, ...args) {
    const
        computationFn = args[args.length - 1],
        inputArgs = args.slice(0, args.length - 1),
        errHeader = "re-frame: reg-sub for " + queryId + ", ",
        inputsFn = makeInputsFn(inputArgs);

    return registerHandler(kind, queryId, function subsHandlerFn(db, queryVec, dynVec = undefined) {
        if (typeof  dynVec === 'undefined') {
            const
                subscriptions = inputsFn(queryVec),
                reaction = makeReaction(() => computationFn(derefInputSignals(subscriptions, queryId), queryVec));

            return reaction;
        } else {
            const
                subscriptions = inputsFn(queryVec, dynVec),
                reaction = makeReaction(() => computationFn(derefInputSignals(subscriptions, queryId), queryVec, dynVec));

            return reaction;
        }
    });
}

export const requestAnimationFrame$ = new Rx.BehaviorSubject();

export function registerSub(queryId, computationFn) {
    return registerHandler(kind, queryId, function subsRxHandlerFn(db, queryVec, dynVec = undefined) {
        return makeRxReaction(computationFn(requestAnimationFrame$, queryVec));
    });
}
