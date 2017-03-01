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
    const observer = ratomCtx[ratomCtx.length - 1];
    if (typeof observer !== 'undefined') {
        obj.subscribe(observer);
    }
}

class Observable {
    constructor() {
        this._observers = new Set();
        this._observables = new Set();
        this._onDispose = new Set();
    }

    subscribe(observer) {
        this._observers.add(observer);
        if (observer.observe) {
            observer.observe(this);
        }
    }

    unsubscribe(observer) {
        this._observers.delete(observer);
        if (observer.unobserve) {
            observer.unobserve(this);
        }
        console.log('unsubscribe', observer.id(), 'from', this.id());
        if (this._observers.size === 0) {
            this.dispose();
        }
    }

    observe(observable) {
        this._observables.add(observable);
    }

    unobserve(observable) {
        this._observables.delete(observable);
    }

    _notifyObservers() {
        this._observers.forEach(observer => {
            observer.notify();
        });
    }

    addOnDispose(f) {
        this._onDispose.add(f);
    }

    dispose() {
        console.log('dispose', this.id(), this._observers);
        if (this._observers.size === 0) {
            this._observables.forEach(observable => observable.unsubscribe(this));
            this._onDispose.forEach(f => f());
        }
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

class Ratom extends Observable {
    constructor(value) {
        super();
        this._value = value;
        this._id = id++;
        this._changed = true;
    }

    reset(value) {
        this._changed = this._value !== value;
        this._value = value;
        this._notifyObservers();
        return this._value;
    }

    swap(f, ...args) {
        const oldValue = this._value;
        this._value = f(this._value, args);
        this._changed = this._value !== oldValue;
        this._notifyObservers();
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

class Reaction extends Observable {
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
        watchInCtx(this);
        if (this._dirty) {
            this._run();
        }
        this._changed = false;
        return this._state;
    }

    notify() {
        this._dirty = true;
        const oldState = this._state;
        this._run();
        this._changed = oldState !== this._state;
        if (oldState !== this._state) {
            this._notifyObservers();
        }
    }

    map(f) {
        return makeReaction(() => f(this.deref()));
    }

    isChanged() {
        return this._changed;
    }

    dispose() {
        super.dispose();
        this._dirty = true;
    }
}

export function makeReaction(f) {
    return new Reaction(f);
}

export function makeAtom(value) {
    return new Ratom(value);
}