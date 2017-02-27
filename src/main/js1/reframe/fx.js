import * as Immutable from 'immutable';
import {registerHandler, getHandler, clearHandlers} from 'reframe/registrar';
import {toInterceptor} from 'reframe/interceptor';
import * as router from 'reframe/router';
import {appDb} from 'reframe/db';


const kind = 'fx';

function register(id, handlerFn) {
    return registerHandler(kind, id, handlerFn);
}

const doFx = toInterceptor({
    id: 'do-fx',
    after: function doFxAfter(ctx) {
        ctx.get('effects').forEach((value, effect) => {
            const effectFn = getHandler(kind, effect, true);

            if (effectFn) {
                effectFn(value);
            }
        });
    }
});

// Builtin Effect Handlers

/**
 *
 * :dispatch-later
 *
 * `dispatch` one or more events after given delays. Expects a collection
 * of maps with two keys:  :`ms` and `:dispatch`
 *
 * usage:
 *
 *    {:dispatch-later [{:ms 200 :dispatch [:event-id "param"]}
 *  in 200ms do this: (dispatch [:event-id "param"])
 *                      {:ms 100 :dispatch [:also :this :in :100ms]}]}
 *
 */
register('dispatch-later', values => {
    values.forEach(value => {
        const
            ms = value.get(0),
            dispatch = value.get(1);

        if (!dispatch || !ms >= 0) {
            console.error('re-frame: ignoring bad "dispatch-later" value:', value);
        } else {
            setTimeout(() => router.dispatch(dispatch), ms);
        }
    });
});

/**
 * :dispatch
 *
 * `dispatch` one event. Excepts a single vector.
 *
 * usage:
 *   {:dispatch [:event-id "param"] }
 */
register('dispatch', value => {
    if (!Immutable.isList(value)) {
        console.error('re-frame: ignoring bad :dispatch value. Expected a vector, but got:', value);
    } else {
        router.dispatch(value);
    }
});

/**
 * :dispatch-n
 *
 * `dispatch` more than one event. Expects a list or vector of events. Something for which
 * sequential? returns true.
 *
 * usage:
 *   {:dispatch-n (list [:do :all] [:three :of] [:these])}
 *
 */
register('dispatch-n', values => {
    if (!Immutable.isSeq(values)) {
        console.error('re-frame: ignoring bad :dispatch-n value. Expected a collection, got got:', values);
    } else {
        values.forEach(value => router.dispatch(value));
    }
});

/**
 * :deregister-event-handler
 *
 * removes a previously registered event handler. Expects either a single id (
 * typically a keyword), or a seq of ids.
 *
 * usage:
 *   {:deregister-event-handler :my-id)}
 * or:
 *   {:deregister-event-handler [:one-id :another-id]}
 *
 */
register('deregister-event-handler', value => {
    if (Immutable.isSeq(value)) {
        value.forEach(v => clearHandlers(kind, v));
    } else {
        clearHandlers(kind, value);
    }
});

/**
 * :db
 *
 * reset! app-db with a new value. Expects a map.
 *
 * usage:
 *   {:db  {:key1 value1 key2 value2}}
 *
 */
register('db', value => {
    appDb.reset(value);
});