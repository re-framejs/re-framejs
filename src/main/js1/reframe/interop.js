import * as batching from 'reframe/batching';
import * as ratom from 'reframe/ratom';
import * as Immutable from 'immutable';

export const nextTick = batching.nextTick;

export function afterRender() {
    throw new Error('not implemented yet');
}

export function reagentId(value) {
    return value.id();
}

export const log = ratom.makeAtom(Immutable.Map({
    debug: false,
    traceReact: false,
    traceSub: false,
}));

function isEnabled(value) {
    return log.deref().get(value);
}
export function isDebug() {
    return isEnabled('debug');
}

export function isTraceReact() {
    return isEnabled('traceReact');
}

export function toggleLog(name, value) {
    log.swap(container => container.update(name, old => typeof value !== 'undefined' ? value : !old));
}