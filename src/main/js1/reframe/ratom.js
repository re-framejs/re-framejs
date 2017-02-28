const ratomCtx = [];
let id = 1;
export function runInCtx(obj, f) {
    try {
        ratomCtx.push(obj);
        return f();
    } finally {
        ratomCtx.pop();
    }
}

function watchInCtx(obj) {
    const ctx = ratomCtx[ratomCtx.length - 1];
    if (typeof ctx !== 'undefined') {
        obj.addWatch(ctx);
    }
}

class Watchable {
    constructor() {
        this._watches = new Set();
        this._watching = new Set();
        this._disposed = false;
        this._onDispose = [];
    }

    addWatch(obj) {
        this._watches.add(obj);
        obj.watching(this);
    }

    watching(obj) {
        this._watching.add(obj);
    }

    dispaseWatches() {
        this._watching.forEach(watch => {
            watch.removeWatch(this);
        });
        this._watches.clear();
    }

    removeWatch(obj) {
        this._watches.delete(obj);
    }

    notifyWatches(dispose) {
        this._watches.forEach(watch => watch.notify(dispose));
    }

    dispose() {
        this._disposed = true;
        this.notifyWatches(true);
        this.dispaseWatches();
        this._dirty = true;

        this._onDispose.forEach(f => f());
    }

    disposeInternal() {
        this._disposed = true;
        this.notifyWatches(true);
    }

    addOnDispose(f) {
        this._onDispose.push(f);
    }
}

export class Ratom extends Watchable {
    constructor(value) {
        super();
        this._value = value;
        this._id = id++;
        this._changed = true;
    }

    reset(value) {
        this._changed = this._value !== value;
        this._value = value;
        this.notifyWatches(false);
        return this._value;
    }

    swap(f, ...args) {
        const oldValue = this._value;
        this._value = f(this._value, args);
        this._changed = this._value !== oldValue;
        this.notifyWatches(false);
        return this._value;
    }

    deref() {
        watchInCtx(this);
        this._changed = false;
        return this._value;
    }

    map(f) {
        return makeReaction(() => f(this.deref()));
    }

    isChanged() {
        return this._changed;
    }

    id() {
        return 'ra-' + this._id;
    }
}

class Reaction extends Watchable {
    constructor(f) {
        super();
        this._f = f;
        this._dirty = true;
        this._id = id++;
        this._changed = true;

    }

    id() {
        return 'rx-' + this._id;
    }

    _run() {
        this._state = runInCtx(this, this._f);
        this._dirty = false;
    }

    deref() {
        if (this._disposed) {
            throw new Error('Reaction already disposed');
        }
        watchInCtx(this);
        if (this._dirty) {
            this._run();
        }
        this._changed = false;
        return this._state;
    }

    notify(dispose) {
        if (dispose) {
            this.disposeInternal();
            this._dirty = true;
        } else {
            this._dirty = true;
            const oldState = this._state;
            this._run();
            this._changed = oldState !== this._state;
            if (oldState !== this._state) {
                this.notifyWatches(false);
            }
        }
    }

    map(f) {
        return makeReaction(() => f(this.deref()));
    }

    isChanged() {
        return this._changed;
    }
}

export function makeReaction(f) {
    return new Reaction(f);
}
