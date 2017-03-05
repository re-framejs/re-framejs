import * as Immutable from 'immutable';
import * as Rx from 'rx';

export const db$ = new Rx.BehaviorSubject(Immutable.Map());


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

export class Observable {
    constructor(type) {
        this._type = type;
        this._id = id++;
        this._observers = new Set();
        this._observables = new Set();
        this._onDispose = new Set();
    }

    id() {
        return this._type + '-' + this._id;
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
        if (this._observers.size === 0) {
            this._observables.forEach(observable => observable.unsubscribe(this));
            this._onDispose.forEach(f => f());
        }
    }

    map(f) {
        return makeReaction(() => f(this.deref()));
    }
}

class Atom extends Observable {
    constructor(value) {
        super('a');
        this._value = value;
        this._subject = new Rx.BehaviorSubject(value);
    }

    subject() {
        return this._subject;
    }

    _valueChanged(changed) {
        if (changed) {
            this._notifyObservers();
            this._subject.onNext(this._value);
        }
    }

    reset(value) {
        const oldValue = this._value;
        this._value = value;
        this._valueChanged(this._value !== oldValue);
        return this._value;
    }

    swap(f, ...args) {
        const oldValue = this._value;
        this._value = f(this._value, args);
        this._valueChanged(this._value !== oldValue);
        return this._value;
    }

    deref() {
        return this._value;
    }

    isChanged(value) {
        return this._value !== value;
    }

    peekValue() {
        return this._value;
    }

}

class Ratom extends Atom {
    constructor(value) {
        super(value);
        this._type = 'ra';
    }

    deref() {
        watchInCtx(this);
        return super.deref();
    }
}

class Reaction extends Observable {
    constructor(f) {
        super('rx');
        this._f = f;
        this._dirty = true;
    }

    _run() {
        this._state = runInCtx(this, this._f);
        this._dirty = false;
    }

    deref() {
        if (this._dirty) {
            this._run();
        }
        watchInCtx(this);
        return this._state;
    }

    isChanged(value) {
        return this._state !== value;
    }

    peekValue() {
        return this._state;
    }

    notify() {
            this._dirty = true;
            const oldState = this._state;
            this._run();
            if (oldState !== this._state) {
                this._notifyObservers();
            }
    }

    dispose() {
        super.dispose();
        this._dirty = true;
    }
}

class RxReaction extends Observable {
    constructor(rx) {
        super('rxjs');
        this._subj = new Rx.BehaviorSubject();
        this._rx = rx;
        if (!this._rx.distinctUntilChanged) {
            console.trace('no distinct', rx);
        }
    }

    deref() {
        if (!this._subscription) {
            this._subscription = this._rx
                .distinctUntilChanged(a => a, (a, b) => a === b)
                .doOnNext(() => {
                    this._notifyObservers();
                })
                .subscribe(this._subj);
        }
        watchInCtx(this);
        return this._subj.getValue();
    }

    isChanged(value) {
        return this._subj.getValue() !== value;
    }

    peekValue() {
        return this._subj.getValue();
    }

    dispose() {
        super.dispose();
        if (this._subscription) {
            this._subscription.dispose();
            delete this._subscription;
        }
    }

}

class Cursor extends Observable {
    constructor(atom, path) {
        super('cu');
        this._atom = atom;
        this._cursor = atom.map(() => atom.deref().getIn(path));
        this._path = path;
    }

    deref() {
        return this._cursor.deref();
    }

    dispose() {
        this._cursor.dispose();
    }

    isChanged(value) {
        return this._cursor.isChanged(value);
    }

    reset(value) {
        this._atom.swap(old => old.setIn(this._path, value));
    }

    swap(f, ...args) {
        this._atom.swap(old => old.updateIn(this._path, value => f(value, ...args)));
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

export function makeRxReaction(rx) {
    return new RxReaction(rx);
}

export function makeCursor(atom, path) {
    return new Cursor(atom, path);
}

export function deref(observable, transform) {
    if (observable instanceof Rx.Observable) {
        if (transform) {
            return makeRxReaction(observable).map(transform).deref();
        }
        return makeRxReaction(observable).deref();
    }
    if (transform) {
        return observable.map(transform).deref();
    }
    return observable.deref();
}
