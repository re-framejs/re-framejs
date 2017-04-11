## Effectful Handlers

This tutorial shows you how to implement pure event handlers that side-effect. 
Yes, a surprising claim.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table Of Contents

- [Events Happen](#events-happen)
- [Handling The Happening](#handling-the-happening)
- [Your Handling](#your-handling)
- [90% Solution](#90%25-solution)
- [Bad, Why?](#bad-why)
- [The 2nd Kind Of Problem](#the-2nd-kind-of-problem)
- [Effects And Coeffects](#effects-and-coeffects)
- [Why Does This Happen?](#why-does-this-happen)
- [Doing vs Causing](#doing-vs-causing)
- [Et tu, React?](#et-tu-react)
- [Pattern Structure](#pattern-structure)
- [Effects: The Two Step Plan](#effects-the-two-step-plan)
- [Step 1 Of Plan](#step-1-of-plan)
- [Another Example](#another-example)
- [The Coeffects](#the-coeffects)
- [Variations On A Theme](#variations-on-a-theme)
- [Summary](#summary)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### Events Happen

Events "happen" when they are dispatched.

So, this makes an event happen: 
```javascript
reframe.dispatch(['repair-ming-vase', true]);
```

Events are normally triggered by an external agent: the user clicks a button, or a server-pushed 
message arrives on a websocket.   

### Handling The Happening

Once dispatched, an event must be "handled" - which means it must be processed or actioned. 

Events are mutative by nature. If your application is in one state before an 
event is processed, it will be in a different state afterwards.

And that state change is very desirable. Without the state change our 
application can't incorporate that button click, or the newly arrived 
websocket message. Without mutation, an app would just sit there, stuck. 

State change is how an application "moves forward" - how it does its job.  Useful!

On the other hand, control logic and state mutation tend to be the most 
complex and error prone part of an app.

### Your Handling

To help wrangle this potential complexity, re-frame's introduction 
provided you with a simple programming model.
 
It said you should call `regEventDb` to associate an event id, 
with a function to do the handling: 
```javascript
reframe.regEventDb(                 // <-- call this to register a handler
    'set-flag',                     // this is an event id 
    (db, [_, newValue]) =>          // this function does the handling
        db.set('flag', newValue))
```

The function you register, handles events with a given `id`.  

And that handler `fn` is expected to be pure. Given the 
value in `appDb` as the first argument, and the event (vector)
as the second argument, it is expected to provide a new value for `appDb`. 

Data in, a computation and data out. Pure.  

### 90% Solution 

This paradigm provides a lovely solution 90% of the time, but there are times 
when it isn't enough. 

Here's an example from the messy 10%. To get its job done, this handler has to side effect: 
```javascript
regEventDb('my-event', (db, [_, newValue]) => {
   dispatch(['do-something-else', 3]);              // oops, side-effect
   return db.set('send-spam', newValue);
});
```

That `dispatch` queues up another event to be processed. It changes the world.

Just to be clear, this code works.  The handler returns a new version of `db`, so tick,
and that `dispatch` will itself be "handled" asynchronously
very shortly after this handler finishes, double tick.

So, you can "get away with it".  But it ain't pure.

And here's more carnage:
```javascript
regEventDb(
    'my-event',
    (db, [_, a]) => {
        $.get('http://json.my-endpoint.com/blah')                   // dirty great big side-effect
            .done((res) => dispatch(['process-response', res]))
            .fail((res) => dispatch(['bad-response', res]));
        return db.set('flag', true);
    }
);
```

Again, this approach will work. But that dirty great big side-effect doesn't come 
for free. It's like a muddy monster truck has shown up in our field of white tulips.

### Bad, Why?

The moment we stop writing pure functions there are well documented 
consequences:
  
  1. Cognitive load for the function's later readers goes up because they can no longer reason locally.  
  2. Testing becomes more difficult and involves "mocking".  How do we test that the http GET above is 
     using the right URL?  "mocking" should be mocked. It is a bad omen.
  3. And event replay-ability is lost.
  
Regarding the 3rd point above, a re-frame application proceeds step by step, like a reduce. From the README: 

> at any one time, the value in app-db is the result of performing a reduce over the entire 
> collection of events dispatched in the app up until that time. The combining 
> function for this reduce is the set of registered event handlers.
  
Such a collection of events is replay-able which is a dream for debugging and testing. But only
when all the handlers are pure. Handlers with side-effects (like that HTTP GET, or the `dispatch`) pollute the 
replay, inserting extra events into it, etc., which ruins the process. 


### The 2nd Kind Of Problem

And there's the other kind of purity problem:
```javascript
regEventDb(
    'load-localstore',
    (db, _) => {
        const val = localStorage.getItem('defaults-key');       // <-- Problem
        return db.set('defaults', val);
    }
)
```

You'll notice the event handler obtains data from LocalStore.

Although this handler has no side effect - it doesn't need to change the world - that action of 
obtaining data from somewhere other than its arguments, means it isn't pure. 

### Effects And Coeffects

When striving for pure event handlers [there are two considerations](http://tomasp.net/blog/2014/why-coeffects-matter/):
  - **Effects** - what your event handler does to the world  (aka side-effects)
  - **Coeffects** - the data your event handler requires from the world in order 
    to do its computation (aka [side-causes](http://blog.jenkster.com/2015/12/what-is-functional-programming.html))

We'll need a solution for both.

### Why Does This Happen?

It is inevitable that, say, 10% of your event handlers have effects and coeffects.

They have to implement the control logic of your re-frame app, which 
means dealing with the outside, mutative world of servers, databases, 
window.location, LocalStore, cookies, etc.

There's just no getting away from living in a mutative world, which sounds pretty ominous. Is that it? Are we doomed to impurity?

Well, luckily a small twist in the tale makes a profound difference. We 
will look at side-effects first. Instead of creating event handlers
which *do side-effects*, we'll instead get them to *cause side-effects*.

### Doing vs Causing

I proudly claim that this event handler is pure:
```javascript
regEventDb(
    'my-event',
    (db, _) => 
        db.set('flag', true)
)
```

Takes a `db` value, computes and returns a `db` value. No coeffects or effects. Yep, that's Pure!

Yes, all true, but ... this purity is only possible because re-frame is doing 
the necessary side-effecting.

Wait on.  What "necessary side-effecting"?

Well, application state is stored in `appDb`, right?  And it is a ratom. And after 
each event handler runs, it must be `reset` to the newly returned 
value. Notice `reset`.   That, right there, is the "necessary side effecting". 

We get to live in our ascetic functional world because re-frame is 
looking after the "necessary side-effects" on `appDb`.

### Et tu, React?

Turns out it's the same pattern with React.

We get to write a nice pure component, like:
```javascript
function sayHi(name) {
    return <div>Hello { name }</div>;
}
```
and React mutates the DOM for us. The framework is looking 
after the "necessary side-effects".

### Pattern Structure

Pause and look back at `sayHi`. I'd like you to view it through the 
following lens:  it is a pure function which **returns a description 
of the side-effects required**. It says: add a div element to the DOM.

Notice that the description is declarative. We don't tell React how to do it.

Notice also that it is data. JSX is just html.

This is a big, important concept.  While we can't get away from certain side-effects, we can 
program using pure functions which **describe side-effects, declaratively, in data** and 
let the backing framework look after the "doing" of them. Efficiently. Discreetly.

Let's use this pattern to solve the side-effecting event-handler problem.

### Effects: The Two Step Plan

From here, two steps:
  1. Work out how event handlers can declaratively describe side-effects, in data.
  2. Work out how re-frame can do the "necessary side-effecting". Efficiently and discreetly.


### Step 1 Of Plan

So, how would it look if event handlers returned side-effects, declaratively, in data?

Here is an impure, side effecting handler:   
```javascript
regEventDb(
    'my-event', 
    (db, [_, value]) => {
       dispatch(['do-something-else', 3]);              // <-- Eeek, side-effect
       return db.set('flag', true);
    });
```

Here it is re-written so as to be pure: 
```javascript
regEventFx(                                             // <1>
    'my-event',
    (ctx, [_, value]) => {                              // <2>
        const db = ctx.get('db');                       // <2>
        return {
            db: db.set('flag', true),                   // <3>
            dispatch: ['do-something-else', 3]
        };
    });
```

Notes: <br>
*<1>* we're using `regEventFx` instead of `regEventDb` to register  (that's `Db` vs `Fx`) <br>
*<2>* the first parameter is no longer just `db`.  It is a map from which 
[we are destructuring db](http://clojure.org/guides/destructuring), i.e.
it is a map which contains a `:db` key. <br>
*<3>* The handler is returning a data structure (map) which describes two side-effects:
  - a change to application state, via the `:db` key
  - a further event, via the `:dispatch` key  
  
Above, the impure handler **did** a `dispatch` side-effect, while the pure handler **described** 
a `dispatch` side-effect.


### Another Example

The impure way:
```javascript
regEventDb(
    'my-event',
    (db, [_, a]) => {
        $.get('http://json.my-endpoint.com/blah')                   // dirty great big side-effect
            .done((res) => dispatch(['process-response', res]))
            .fail((res) => dispatch(['bad-response', res]));
        return db.set('flag', true);
    }
);
```

the pure, descriptive alternative:
```javascript
regEventDb(
    'my-event',
    (db, [_, a]) => {
        return {
            http: {
                method: 'get',
                url: 'http://json.my-endpoint.com/blah',
                onSuccess: ['process-response'],
                onError: ['bad-response']
            },
            db: db.set('flag', true)
        };
    }
);
```

Again, the old way **did** a side-effect (Booo!) and the new way **describes**, declaratively,
in data, the side-effects required (Yaaa!). 

More on side effects in a minute, but let's double back to coeffects.

### The Coeffects

So far we've written our new style `-fx` handlers like this:
```javascript
regEventFx(
    'my-event',
    (ctx, event) => {
        const db = ctx.get('db');                       // <--  destructuring to get db
        ...
    }
);
```


It is now time to name that first argument:
```javascript
regEventFx(
    'my-event',
    (cofx, event) => {
        const db = cofx.get('db');                       // <--- thy name be cofx
        ...
    }
);
```

When you use the `-fx` form of registration, the first argument 
of your handler will be a map of coeffects which we name `cofx`.  

In that map will be the complete set of "inputs" required by your function.  The complete 
set of computational resources (data) needed to perform its computation. But how?
This will be explained in an upcoming tutorial, I promise, but for the moment, 
take it as a magical given. 

One of the keys in `cofx` will likely be `db` and that will be the value of `appDb`. 

Remember this impure handler from before:
```javascript
regEventDb(
    'load-localstore',
    (db, _) => {
        const val = localStorage.getItem('defaults-key');       // <--  Eeek!!
        return db.set('defaults', val);
    }
)
```

It was impure because it obtained an input from other than its arguments. 
We'd now rewrite it as a pure handler, like this:
```javascript
regEventFx(                                                     // notice the -fx
    'load-localstore',
    (cofx, _) => {                                              // cofx is a map containing inputs
        const 
            db = cofx.get('db'),
            defaults = cofx.get('localstore');                 // <--  use it here
        
        return {
            db: db.set('defaults', defaults)                    // returns effects map
        };
    }
)
```

So, by some magic, not yet revealed, LocalStore will be queried before 
this handler runs and the required value from it will be placed into 
`cofx` under the key `localstore` for the handler to use.

That process leaves the handler itself pure because it only sources 
data from arguments.


### Variations On A Theme

`-db` handlers and `-fx` handlers are conceptually the same. They only differ numerically.

`-db` handlers take __one__ coeffect called `db`, and they return only __one__  effect (db again). 

Whereas `-fx` handlers take potentially __many__ coeffects (a map of them) and they return 
potentially __many__ effects (a map of them). So, One vs Many. 

Just to be clear, the following two handlers achieve the same thing:
```javascript
regEventDb(
    'set-flag', 
    (db, [_, newValue]) => 
        db.set('flag', newValue));
```
vs
```javascript
regEventFx(
    'set-flag',
    (cofx, [_, newValue]) => {
        return {
            db: db.set('flag', newValue);
        }
    }
);
```

Obviously the `-db` variation is simpler and you'd use it whenever you 
can. The `-fx` version is more flexible, so it will sometimes have its place.   


### Summary 

90% of the time, simple `-db` handlers are the right tool to use.

But about 10% of the time, our handlers need additional inputs (coeffects) or they need to 
cause additional side-effects (effects).  That's when you reach for `-fx` handlers. 

`-fx` handlers allow us to return effects, declaratively in data. 

In the next tutorial, we'll shine a light on `interceptors` which are
the mechanism by which  event handlers are executed. That knowledge will give us a springboard 
to then, as a next step, better understand coeffects and effects. We'll soon be writing our own.

***

Previous:  [Infographic Overview](EventHandlingInfographic.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Up:  [Index](README.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Next:  [Interceptors](Interceptors.md)  

