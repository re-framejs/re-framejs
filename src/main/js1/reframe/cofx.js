import {registerHandler, getHandler} from 'reframe/registrar';
import {toInterceptor} from 'reframe/interceptor';
import {appDb} from 'reframe/db';
const kind = 'cofx';

function register(id, handlerFn) {
    return registerHandler(kind, id, handlerFn);
}

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
