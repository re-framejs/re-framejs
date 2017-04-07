import * as Immutable from 'immutable';
import {handle} from 'reframe/events';
import {nextTick, afterRender} from 'reframe/interop';
import {requestAnimationFrame$} from 'reframe/subs';
import {appDb} from 'reframe/db';

//  -- Router Loop ------------------------------------------------------------
//
//  A call to "re-frame.core/dispatch" places an event on a queue for processing.
//      A short time later, the handler registered to handle this event will be run.
//  What follows is the implementation of this process.
//
//  The task is to process queued events in a perpetual loop, one after
//  the other, FIFO, calling the registered event-handler for each, being idle when
//  there are no events, and firing up when one arrives.
//
//  But browsers only have a single thread of control and we must be
//  careful to not hog the CPU. When processing events one after another, we
//  must regularly hand back control to the browser, so it can redraw, process
//  websockets, etc. But not too regularly! If we are in a de-focused browser
//  tab, our app will be CPU throttled. Each time we get back control, we have
//  to process all queued events, or else something like a bursty websocket
//  (producing events) might overwhelm the queue. So there's a balance.
//
//  The processing/handling of an event happens "asynchronously" sometime after
//  that event was enqueued via "dispatch". The original implementation of this router loop
//  used `core.async`. As a result, it was fairly simple, and it mostly worked,
//  but it did not give enough control. So now we hand-roll our own,
//  finite-state-machine and all.
//
//  In what follows, the strategy is this:
//    - maintain a FIFO queue of `dispatched` events.
//    - when a new event arrives, "schedule" processing of this queue using
//      goog.async.nextTick, which means it will happen "very soon".
//    - when processing events, one after the other, do ALL the currently
//      queued events. Don't stop. Don't yield to the browser. Hog that CPU.
//    - but if any new events are dispatched during this cycle of processing,
//      don't do them immediately. Leave them queued. Yield first to the browser,
//      and do these new events in the next processing cycle. That way we drain
//      the queue up to a point, but we never hog the CPU forever. In
//      particular, we handle the case where handling one event will beget
//      another event. The freshly begotten event will be handled next cycle,
//      with yielding in-between.
//        - In some cases, an event should not be handled until after the GUI has been
//      updated, i.e., after the next Reagent animation frame. In such a case,
//      the event should be dispatched with :flush-dom metadata like this:
//        (dispatch ^:flush-dom [:event-id other params])
//      Such an event will temporarily block all further processing because
//      events are processed sequentially: we handle one event completely
//      before we handle the ones behind it.
//
//  Implementation notes:
//        - queue processing can be in a number of states: scheduled, running, paused
//      etc. So it is modeled as a Finite State Machine.
//      See "-fsm-trigger" (below) for the states and transitions.
//    - the scheduling is done via "goog.async.nextTick" which is pretty quick
//    - when the event has :flush-dom metadata we schedule via
//        "reagent.core.after-render"
//      which will run event processing after the next Reagent animation frame.
//

const laterFns = {
    'flush-dom': (f) => afterRender(() => nextTick(f)),
    'yield': nextTick
};

function doTrigger(fsm, state, trigger, arg) {
    if (trigger === 'pause') {
        return ['paused', (fsm) => {
            fsm._pause();
        }];
    }

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
    } else if (state === 'idle' && trigger === 'resume') {
        return ['idle', (fsm) => {}];
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
    } else if (state === 'scheduled' && trigger === 'resume') {
        return ['scheduled', (fsm) => {}];
    }

    /**
     * State: :running (the queue is being processed one event after another)
     */
    else if (state === 'running' && trigger === 'add-event') {
        return ['running', (fsm) => {
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
    } else if (state === 'paused' && trigger === 'run-queue') {
        return ['paused', (fsm) => {
        }];
    }
    else if (state === 'paused' && trigger === 'resume') {
        return ['running', (fsm) => {
            fsm._resume(arg);
        }];
    } else {
        throw new Error("re-frame: router state transition not found. State '" + state + "', trigger '" + trigger +"'");
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
        setTimeout(function runProcessEvents() {
            return this.trigger("run-queue", null);
        }.bind(this), 0);
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
        // console.log('pause');
        // laterFn(() => this.trigger('resume', null));
    }

    _callPostEventCallbacks(event) {
        Object.keys(this._postEventCallbacks).forEach(key => {
            this._postEventCallbacks[key](event, [...this._queue]);
        });
    }

    _resume() {
        // console.log('resume');
        // this._process1stEventInQueue();
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

    pause() {
        this._fsm.trigger('pause');
    }

    resume() {
        this._fsm.trigger('resume');
    }

    addPostEventCallback(id, callbackFn) {
        this._fsm.addPostEventCallback(id, callbackFn);
    }

    removePostEventCallback(id) {
        this._fsm.removePostEventCallback(id);
    }
}

const eventQueue = new EventQueue();

export function pause() {
    eventQueue.pause();
}

export function resume() {
    eventQueue.resume();
}

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
