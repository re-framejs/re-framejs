import * as batching from 'reframe/batching';

export const nextTick = batching.nextTick;

export function afterRender() {
    throw new Error('not implemented yet');
}

export function reagentId(value) {
    return value.id();
}