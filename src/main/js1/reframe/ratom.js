const ratomCtx = [];
let id = 1;
function runInCtx(obj, f) {
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
}

export class Ratom extends Watchable {
    constructor(value) {
        super();
        this._value = value;
        this._id = id++;
    }

    reset(value) {
        this._value = value;
        this.notifyWatches(false);
        return this._value;
    }

    swap(f, ...args) {
        this._value = f(this._value, args);
        this.notifyWatches(false);
        return this._value;
    }

    deref() {
        watchInCtx(this);
        return this._value;
    }

    map(f) {
        return makeReaction(() => f(this.deref()));
    }
}

class Reaction extends Watchable {
    constructor(f) {
        super();
        this._f = f;
        this._dirty = true;
        this._id = id++;
        this._disposed = false;
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
        return this._state;
    }

    notify(dispose) {
        if (dispose) {
            this._dirty = true;
            this._disposed = true;
            this.notifyWatches(true);
        } else {
            this._dirty = true;
            const oldState = this._state;
            this._run();
            if (oldState !== this._state) {
                this.notifyWatches(false);
            }
        }
    }

    dispose() {
        this._disposed = true;
        this.notifyWatches(true);
        this.dispaseWatches();
        this._dirty = true;
    }

    map(f) {
        return makeReaction(() => f(this.deref()));
    }
}

export function makeReaction(f) {
    return new Reaction(f);
}
