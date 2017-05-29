import {registerHandler, getHandler} from 'reframe/registrar';
import {toInterceptor} from 'reframe/interceptor';
import {appDb} from 'reframe/db';
const kind = 'cofx';

export function register(id, handlerFn) {
    return registerHandler(kind, id, handlerFn);
}

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
 * @param id
 * @param value
 * @returns {*}
 */
function injectCofx(id, value = undefined) {
    const handler = getHandler(kind, id);
    if (typeof value !== 'undefined') {
        return toInterceptor({
            id: 'coeffects',
            before: function coeffectsBefore(ctx) {
                return ctx.update('coeffects', handler)
            }
        });
    } else {
        return toInterceptor({
            id: 'coeffects',
            before: function coeffectsBefore(ctx) {
                return ctx.update('coeffects', old => handler(old, value))
            }
        });

    }
}

register('db', function doCoeffectsHandler(coeffects) {
    return coeffects.set('db', appDb.deref());
});

export const injectDb = injectCofx('db');
