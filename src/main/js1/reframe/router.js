import * as Immutable from 'immutable';
import {handle} from 'reframe/events';
import {nextTick, afterRender} from 'reframe/interop';
import {requestAnimationFrame$} from 'reframe/subs';
import {appDb} from 'reframe/db';

const laterFns = {
    'flush-dom': (f) => afterRender(() => nextTick(f)),
    'yield': nextTick
};

function doTrigger(fsm, state, trigger, arg) {
    /**
     * if you are in state ":idle" and a trigger ":add-event"
     * happens, then move the FSM to state ":scheduled" and execute
     * that two-part "do" function.
     */
    if (state === 'idle' && trigger === 'add-event') {
        return ['scheduled', (fsm) => {
            fsm._addEvent(arg);
            fsm._runNextTick();
        }];
    }
    /**
     * State: :scheduled  (the queue is scheduled to run, soon)
     */
    else if (state === 'scheduled' && trigger === 'add-event') {
        return ['scheduled', (fsm) => {
            fsm._addEvent(arg);
        }];

    }
    else if (state === 'scheduled' && trigger === 'run-queue') {
        return ['running', (fsm) => {
            fsm._runQueue();
        }];
    }

    /**
     * State: :running (the queue is being processed one event after another)
     */
    else if (state === 'running' && trigger === 'add-event') {
        return ['scheduled', (fsm) => {
            fsm._addEvent(arg);
        }];
    }
    else if (state === 'running' && trigger === 'pause') {
        return ['paused', (fsm) => {
            fsm._pause();
        }];
    }
    else if (state === 'running' && trigger === 'exception') {
        return ['idle', (fsm) => {
            fsm._exception(arg);
        }];
    }
    else if (state === 'running' && trigger === 'finish-run') {
        return fsm._queue.length === 0 ?
            ['idle', () => {
                requestAnimationFrame$.onNext(appDb.peekValue())
            }] :
            ['scheduled', (fsm) => {
                requestAnimationFrame$.onNext(appDb.peekValue());
                fsm._runNextTick()
            }];
    }
    /**
     * State: :paused (:flush-dom metadata on an event has caused a temporary pause in processing)
     */
    else if (state === 'paused' && trigger === 'add-event') {
        return ['paused', (fsm) => {
            fsm._addEvent(arg);
        }];
    }
    else if (state === 'paused' && trigger === 'resume') {
        return ['paused', (fsm) => {
            fsm._resume(arg);
        }];
    } else {
        throw new Error("re-frame: router state transition not found. " + state + " " + trigger)
    }
}


class Fsm {
    constructor() {
        this._postEventCallbacks = {};
        this._state = 'idle';
        this._queue = [];
    }

    addPostEventCallback(id, callbackFn) {
        if (this._postEventCallbacks[id]) {
            console.warn('re-frame: overwriting existing post event call back with id:', id);
        }
        this._postEventCallbacks[id] = callbackFn;
    }

    removePostEventCallback(id) {
        if (!this._postEventCallbacks[id]) {
            console.warn('re-frame: could not remove post event call back with id:', id);
        }
        delete this._postEventCallbacks[id];
    }

    trigger(trigger, arg) {
        const [newState, actionFn] = doTrigger(this, this._state, trigger, arg);

        this._state = newState;
        if (actionFn) {
            actionFn(this);
        }
    }

    _addEvent(arg) {
        this._queue.push(arg);
    }

    _process1stEventInQueue() {
        const event = this._queue[0];
        try {

            handle(event);
            this._queue.shift();
            this._callPostEventCallbacks(event);
        } catch (error) {
            this.trigger("exception", error);
        }
    }

    _runNextTick() {
        nextTick(function runProcessEvents() {
            return this.trigger("run-queue", null);
        }.bind(this));
    }

    _runQueue() {
        for (let i = this._queue.length; i > 0; i--) {
            // TODO add later-fns
            this._process1stEventInQueue();
        }
        this.trigger('finish-run', null);
    }

    _exception(ex) {
        this._queue = [];
        throw ex;
    }

    _pause(laterFn) {
        laterFn(() => this.trigger('resume', null));
    }

    _callPostEventCallbacks(event) {
        Object.keys(this._postEventCallbacks).forEach(key => {
            this._postEventCallbacks[key](event, [...this._queue]);
        });
    }

    _resume() {
        this._process1stEventInQueue();
        this._runQueue();
    }
}
class EventQueue {
    constructor() {
        this._fsm = new Fsm();
    }

    push(event) {
        this._fsm.trigger('add-event', event);
    }

    addPostEventCallback(id, callbackFn) {
        this._fsm.addPostEventCallback(id, callbackFn);
    }

    removePostEventCallback(id) {
        this._fsm.removePostEventCallback(id);
    }
}

const eventQueue = new EventQueue();

/**
 * Queue the given event for processing by the registered event handler.
 * Just to be clear: the event handler is not run immediately - it is not run
 * synchronously. It will likely be run 'very soon', although it may be
 * added to the end of a FIFO queue which already contain events.
 * Usage:
 *  (dispatch [:delete-item 42])
 */
export function dispatch(event) {
    if (!event) {
        throw new Error("re-frame: you called \"dispatch\" without an event vector.")
    } else {
        eventQueue.push(event);
    }
}

/**
 * Sychronously (immediately!) process the given event using the registered handler.
 * Generally, you shouldn't use this - you should use `dispatch` instead.  It
 * is an error to use `dispatch-sync` within an event handler.
 * Usage:
 *  (dispatch-sync [:delete-item 42])
 */
export function dispatchSync(event) {
    handle(event);
    eventQueue._fsm._callPostEventCallbacks(event);
    requestAnimationFrame$.onNext(appDb.peekValue());
}
