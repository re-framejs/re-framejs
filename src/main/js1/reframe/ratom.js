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
        ratomContext.addWatch(derefed)
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
        Object.keys(this._watches).forEach(watch => {
            watch(oldValue, newValue);
        });
    }

    addWatch(key, f) {
        this._watches[key] = f;
    }

    removeWatch(key) {
        delete this._watches[key];
    }
}

export class Ratom extends WatchedDisposable {
    constructor(value) {
        super();
        this._value = value;
    }

    deref() {

        return this._value;
    }

    reset(value) {
        this._value = value;
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
        const oldState = this._state;
        this._state = derefCapture(this._f, this);
        this._dirty = false;

        if (oldState !== this._state) {
            this._notifyWatches(oldState, this._state);
        }
    }


    deref() {
        if (this._dirty) {
            this._run(false);
        }
        return this._f();
    }
}

export function makeReaction(f) {
    return new Reaction(f);
}
