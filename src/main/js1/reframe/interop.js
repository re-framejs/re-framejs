export function nextTick(f) {
    setTimeout(f, 0);
}


export function afterRender() {
    throw new Error('not implemented yet');
}
