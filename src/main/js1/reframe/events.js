import * as Immutable from 'immutable';
import {registerHandler, getHandler} from 'reframe/registrar';
import * as interceptor from 'reframe/interceptor';

const kind = 'event';

function flattenAndRemoveNulls(id, interceptors) {
    return Immutable.fromJS(interceptors).flatMap(interceptor => {
        if (Immutable.Map.isMap(interceptor)) {
            return Immutable.List([interceptor]);
        } else if (interceptor) {
            return flattenAndRemoveNulls(id, interceptor);
        }
        return Immutable.List();
    }).filter(Boolean).toList();
}


export function register(id, interceptors) {
    return registerHandler(kind, id, flattenAndRemoveNulls(id, interceptors));
}

let handling = null;
export function handle(event) {
    const
        [eventId, ...rest] = event,
        interceptors = getHandler(kind, eventId, true);

    if (handling) {
        console.error("re-frame: while handling \"", handling, "\", dispatch-sync was called for \"", event, "\". You can't call dispatch-sync within an event handler.")
    } else {
        try {
            handling = event;
            return interceptor.execute(event, interceptors);
        } finally {
            handling = null;
        }
    }
}