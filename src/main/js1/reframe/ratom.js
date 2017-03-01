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

class Atom extends Observable {
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
        return 'a-' + this._id;
    }
}

class Ratom extends Atom {
    constructor(value) {
        super(value);
    }

    deref() {
        watchInCtx(this);
        return super.deref();
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
    return new Atom(value);
}

export function makeRatom(value) {
    return new Ratom(value);
}
