
export function nextTick(f) {
    if (requestAnimationFrame) {
        requestAnimationFrame(f);
    } else {
        setTimeout(f, 16);
    }
}

function runQueue(components) {
    const s = [...new Set(components)];
    s.sort((o1, o2) => o1.state.renderOrder - o2.state.renderOrder);

    s.forEach((component) => component.tryForceUpdate());
}
class RenderQueue {
    constructor() {
        this._isScheduled = false;
    }

    enqueue(k, f) {
        if (!this[k]) {
            this[k] = [];
        }
        this[k].push(f);
        this.schedule();
    }

    runFuns(k) {
        const fns = this[k];

        delete this[k];
        if (fns) {
            fns.forEach(f => f());
        }
    }

    schedule() {
        if (!this._isScheduled) {
            this._isScheduled = true;
            nextTick(() => this.runQueues());
        }
    }

    queueRender(c) {
        this.enqueue('componentQueue', c);
    }

    addBeforeFlush(f) {
        this.enqueue('beforeFlush', f);
    }

    addAfterRender(f) {
        this.enqueue('afterRender', f);
    }

    runQueues() {
        this._isScheduled = false;
        this.flushQueues();
    }

    flushAfterRender() {
        this.runFuns('afterRender');
    }

    flushQueues() {
        this.runFuns('beforeFlush');
        // TODO ratom-flush
        if (this['componentQueue']) {
            runQueue(this['componentQueue']);
            delete this['componentQueue'];
        }
        this.flushAfterRender();
    }
}

if (!window.__reframe_render_queue) {
    window.__reframe_render_queue = new RenderQueue();
}
const renderQueue = window.__reframe_render_queue;

export function flush() {
    renderQueue.flushQueues();
}

export function flushAfterRender() {
    renderQueue.flushAfterRender();
}

export function queueRender(component) {
    renderQueue.queueRender(component);
}

export function doBeforeFlush(f) {
    renderQueue.addBeforeFlush(f);
}

export function doAfterRender(f) {
    renderQueue.addAfterRender(f);
}

export function schedule() {
    renderQueue.schedule();
}