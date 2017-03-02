import * as Immutable from 'immutable';

const mandatoryInterceptorFields = Immutable.Set(["id", "before", "after"]);

function isInterceptor(m) {
    return Immutable.isMap(m) && Immutable.is(m.keysSeq().toSet(), mandatoryInterceptorFields);
}

export function toInterceptor({id, before, after}) {
    return Immutable.Map({
        id: id || 'unnamed',
        before: before,
        after: after
    });
}

// effect helpers
export function getEffect(ctx, key = null, notFound = null) {
    if (key) {
        return ctx.getIn(['effects', key], notFound);
    }
    return ctx.get('effects');
}

export function assocEffect(ctx, key, effect) {
    return ctx.setIn(['effects', key], effect);
}

// coeffect helpers
export function getCoeffect(ctx, key = null, notFound = null) {
    if (key) {
        return ctx.getIn(['coeffects', key], notFound);
    }
    return ctx.get('coeffects');
}

export function assocCoeffect(ctx, key, coeffect) {
    return ctx.setIn(['coeffects', key], coeffect);
}

function updateCoeffect(ctx, key, f, ...args) {
    return ctx.updateIn(['coeffects', key], (old) => f(old, ...args));
}

// Execute Interceptor Chain

function invokeInterceptorFn(ctx, interceptor, direction) {
    const f = interceptor.get(direction);
    if (f) {
        return f(ctx);
    }
    return ctx;
}

function invokeInterceptors(initialCtx, direction) {
    let ctx = initialCtx;
    do {
        const queue = ctx.get('queue');

        if (queue.isEmpty()) {
            return ctx;
        } else {
            const
                interceptor = queue.first(),
                stack = ctx.get('stack', Immutable.List());

            ctx = invokeInterceptorFn(
                ctx
                    .set('queue', queue.shift())
                    .set('stack', stack.unshift(interceptor)),
                interceptor, direction
            );
        }
    } while (ctx && !ctx.get('queue').isEmpty());
    return ctx;
}

export function enqueue(ctx, interceptors) {
    return ctx.update('queue', Immutable.List(), old => old.concat(Immutable.List(interceptors)))
}

export function nextInterceptor(ctx, interceptor) {
    return ctx.update('queue', Immutable.List(), queue => queue.unshift(interceptor));
}

function context(event, interceptors, db = undefined) {
    let ctx = Immutable.Map();
    ctx = assocCoeffect(ctx, 'event', event);
    if (typeof db !== 'undefined') {
        ctx = assocCoeffect(ctx, 'db', db);
    }
    ctx = enqueue(ctx, interceptors);

    return ctx;
}

function changeDirection(ctx) {
    return enqueue(ctx.delete('queue'), ctx.get('stack'))
}

export function execute(event, interceptors) {
    let ctx = context(event, interceptors);
    ctx = invokeInterceptors(ctx, "before");
    ctx = changeDirection(ctx);
    ctx = invokeInterceptors(ctx, "after");
    return ctx;
}
