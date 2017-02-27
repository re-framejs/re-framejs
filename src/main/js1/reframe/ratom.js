let ratomContext = null;
function inContext(obj, f) {
    try {
        ratomContext = obj;
        return f();
    } finally {
        ratomContext = null;
    }
}

function notifyDerefWatcher(derefed) {
    if (ratomContext) {
        const ctx = ratomContext;
        derefed.addWatch(ctx, (oldValue, newValue) => {
            ctx.markDirty();
            derefed.removeWatch(ctx);
        });
    }
}

function derefCapture(f, r) {
    return inContext(r, f);
}

class WatchedDisposable {
    constructor() {
        this._watches = new Map();
    }

    _notifyWatches(oldValue, newValue) {
        this._watches.forEach(watch => {
            watch(oldValue, newValue);
        });
    }

    addWatch(key, f) {
        this._watches.set(key, f);
    }

    removeWatch(key) {
        this._watches.delete(key);
    }
}

export class Ratom extends WatchedDisposable {
    constructor(value) {
        super();
        this._value = value;
    }

    deref() {
        notifyDerefWatcher(this);
        return this._value;
    }

    reset(value) {
        const oldValue = this._value;
        this._value = value;
        this._notifyWatches(oldValue, this._value);

        return value;
    }

    swap(fn, ...args) {
        const oldValue = this._value;
        this._value = fn(oldValue, ...args);

        if (oldValue !== this._value) {
            this._notifyWatches(oldValue, this._value);
        }

        return this._value;
    }

}

class Reaction extends WatchedDisposable {
    constructor(f) {
        super();
        this._f = f;
        this._dirty = true;
        this._state = undefined;
    }

    _run(check) {
        console.log('run');
        const oldState = this._state;
        this._state = derefCapture(this._f, this);
        this._dirty = false;

        if (oldState !== this._state) {
            this._notifyWatches(oldState, this._state);
        }
    }

    markDirty() {
        if (!this._dirty) {
            this._dirty = true;
        }
    }

    deref() {
        notifyDerefWatcher(this);
        if (this._dirty) {
            this._run(false);
        }
        return this._f();
    }
}

export function makeReaction(f) {
    return new Reaction(f);
}
