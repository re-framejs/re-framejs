> In a rush? You can get away with skipping this page on the first pass. <br>
> Next page: [Basic App Structure](Basic-App-Structure.md)

## Flow Mechanics

This tutorial explains the underlying reactive mechanism used in dominoes 4-5-6. It goes on to introduce `re-frame.core/reg-sub-raw`.

## On Flow

Arguments from authority ...

> Everything flows, nothing stands still.   (Panta rhei)

> No man ever steps in the same river twice for it's not the same river and he's not the same man.

[Heraclitus 500 BC](http://en.wikiquote.org/wiki/Heraclitus). Who, being Greek, had never seen a frozen river. [alt version](http://farm6.static.flickr.com/5213/5477602206_ecb78559ed.jpg).


> Think of an experience from your childhood. Something you remember clearly, something you can see,
feel, maybe even smell, as if you were really there. After all you really were there at the time,
weren’t you? How else could you remember it? But here is the bombshell: you weren’t there. Not a
single atom that is in your body today was there when that event took place .... Matter flows
from place to place and momentarily comes together to be you. Whatever you are, therefore, you
are not the stuff of which you are made. If that does not make the hair stand up on the back of
your neck, read it again until it does, because it is important.

Steve Grand


### How Flow Happens In Reagent

To implement a reactive flow, Reagent provides a `ratom` and a `reaction`.
re-frame uses both of these building blocks, so let's now make sure we understand them.

`ratoms` behave just like normal ClojureScript atoms. You can `swap` and `reset` them, `watch` them, etc.

From a ClojureScript perspective, the purpose of an atom is to hold mutable data.  From a re-frame
perspective, we'll tweak that paradigm slightly and **view a `ratom` as having a value that
changes over time.**  Seems like a subtle distinction, I know, but because of it, re-frame sees a
`ratom` as a Signal. 

A Signal is a value that changes over time.  So it is a stream of values. Each time a ratom gets
`reset` that's a new value in the stream. 

The 2nd building block, `reaction`, acts a bit like a function. It's a macro which wraps some
`computation` (a block of code) and returns a `ratom` holding the result of that `computation`.

The magic thing about a `reaction` is that the `computation` it wraps will be automatically
re-run  whenever 'its inputs' change, producing a new output (return) value.

Eh, how?

Well, the `computation` is just a block of code, and if that code dereferences one or
more `ratoms`, it will be automatically re-run (recomputing a new return value) whenever any
of these dereferenced `ratoms` change.

To put that yet another way, a `reaction` detects a `computation's` input Signals (aka input `ratoms`)
and it will `watch` them, and when, later, it detects a change in one of them,  it will re-run that
computation, and it will `reset` the new result of that computation into the `ratom` originally returned.

So, the `ratom` returned by a `reaction` is itself a Signal. Its value will change over time when
the `computation` is re-run.

So, via the interplay between `ratoms` and `reactions`,  values 'flow' into computations and out
again, and then into further computations, etc.  "Values" flow (propagate) through the Signal graph.

But this Signal graph must be without cycles, because cycles cause mayhem!  re-frame achieves
a unidirectional flow.

Right, so that was a lot of words. Some code to clarify:

```javascript
const appDb = reframe.atom(Immutable.Map());                    // our root ratom  (signal)
const ratom2 = reframe.reaction(()=> Immutable.fromJS({         // reaction wraps a computation, returns a signal
    b: appDb.deref().get('a')
}));
const ratom3 = reframe.reaction(() => {                         // reaction wraps another computation
    const b = ratom2.deref().get('b');
    if (b === 0) {
        return 'World';
    } else if (b === 1) {
        return 'Hello'
    }
});

// Notice that both computations above involve de-referencing a ratom:
//   - app-db in one case
//   - ratom2 in the other
// Notice that both reactions above return a ratom.
// Those returned ratoms hold the (time varying) value of the computations.
println(ratom2.deref())    // ==>  {:b 1}       ;; a computed result, involving @app-db
println(ratom3.deref())    // ==> "Hello"       ;; a computed result, involving @ratom2

appDb.reset(Immutable.Map({a: 0}));              // this change to app-db, triggers re-computation
                                                 // of ratom2
                                                 // which, in turn, causes a re-computation of ratom3

println(ratom2.deref())    // ==>  {:b 0}    ;; ratom2 is result of {:b (:a @app-db)}
println(ratom3.deref())    // ==> "World"    ;; ratom3 is automatically updated too.
```

So, in FRP-ish terms, a `reaction` will produce a "stream" of values over time (it is a Signal),
accessible via the `ratom` it returns.

## Components  (view functions)

When using Reagent, your primary job is to write one or more `components`. 
This is the view layer.

Think about `components` as `pure functions` - data in, Hiccup out.  `Hiccup` is
ClojureScript data structures which represent DOM. Here's a trivial component:

```javascript
const Greet = reframe.view('Greet', function() {
   return <div>Hello ratoms and reactions</div>;
});
```

And if we call it:
```javascript
Greet() // => {type: Greet, <div>Hello ratoms and reactions</div>}
```

You'll notice that our component is a regular Clojure function, nothing special. In this case, it takes
no parameters and it returns a ClojureScript vector (formatted as Hiccup).

Here is a slightly more interesting (parameterised) component (function):
```javascript
const Greet = reframe.view('Greet', function(name) { // greet has a parameter now, 'name' is a ratom  holding a string
    return <div>Hello { name.deref() }</div>;        // dereference 'name' to extract the contained value
});
```

```javascript
// create a ratom, containing a string
const n = reagent.atom('re-frame');
// call our `component` function, passing in a ratom
Greet(n); // => {type: Greet, <div>Hello re-frame</div>}
```

So components are easy - at core they are a render function which turns data into
jsx (which will later become DOM).

Now, let's introduce `reaction` into this mix.  On the one hand, I'm complicating things
by doing this, because React/Reframe allows you to be ignorant of the mechanics I'm about to show
you. (It invisibly wraps your components in a `reaction` allowing you to be blissfully
ignorant of how the magic happens.)

On the other hand, it is useful to understand exactly how the Reagent Signal graph is wired. 

```javascript
const Greet = reframe.view('Greet', function(name) { // a component - data in, jsx out.
    return <div>Hello { name.deref() }</div>;        // dereference 'name' to extract the contained value
});

const n = reagent.atom('re-frame');

Greet(n); // => {type: Greet, <div>Hello re-frame</div>}
// now change 'n'
// 'n' is an input Signal for the reaction above.
// Warning: 'n' is not an input signal because it is a parameter. Rather, it is
// because 'n' is dereferenced within the execution of the reaction's computation.
// reaction notices what ratoms are dereferenced in its computation, and watches
// them for changes.
n.reset('blah');

Greet(n); // => {type: Greet, <div>Hello blah</div>}

```

So, as `n` changes value over time (via a `reset`), the output of the computation `(greet n)`
changes, which in turn means that the value in `hiccup-ratom` changes. Both `n` and
`hiccup-ratom` are FRP Signals. The Signal graph we created causes data to flow from
`n` into `hiccup-ratom`.

Derived Data, flowing.


### Truth Interlude

I haven't been entirely straight with you:

 1. Reframe re-runs `reactions` (re-computations) via requestAnimationFrame. So a
re-computation happens about 16ms after an input Signals change is detected, or after the
current thread of processing finishes, whichever is the greater. So if you are in a bREPL
and you run the lines of code above one after the other too quickly,  you might not see the
re-computation done immediately after `n` gets reset, because the next animationFrame
hasn't run (yet).  But you could add a `(reframe/flush)` after the reset! to force
re-computation to happen straight away.

 2. `reaction` doesn't actually return a `ratom`.  But it returns something that has
ratom-nature, so we'll happily continue believing it is a `ratom` and no harm will come to us.

On with the rest of my lies and distortions...


### reg-sub-raw

This low level part of the API provides a way to register a subscription handler - so 
the intent is similar to `reg-sub`.

You use it like other registration functions: 
```javascript
reframe.regSubRaw(              // it is part of the API
    'query-id',                 // later use (subscribe [:query-id])
    someFn                      // this function provides the reactive stream
)
```

The interesting bit is how `someFn` is written. Here's an example:
```javascript
function someFn(appDb, event) { // app-db is not a value, it is a reagent/atom
    return reframe.reaction(() => appDb.deref().getIn(['some', 'path'])); // returns a reaction
}
```
Notice:
  1. `appDb` is a reframe/atom. It is not a value like `regSub` gets.
  2. it returns a `reaction` which does a computation. It does not return a value like `regSub` does.
  3. Within that `reaction` `appDb` is deref-ed (see use of `deref()`) 
  
As a result of point 3, each time `appDb` changes, the wrapped `reaction` will rerun.
`appDb` is an input signal to that `reaction`. 

Unlike `regSub`, there is no 3-arity version of `reg-sub-raw`, so there's no way for you to provide an input signals function.
Instead, even simpler, you can just use `subscribe` within the `reaction` itself. For example:
```javascript
function someFn(appDb, event) {
    return reframe.reaction(() => {
       const pathElement = reframe.subscribe(['get-path-part']).deref();    // <-- subscribe used here
        return appDb.deref().getIn(['some', pathElement]);
    });
})
```
As you can see, this `reaction` has two input signals: `appDb` and `subscribe([:get-path-part])`.  If either changes, 
the `reaction` will rerun.

In some cases, the returned `reaction` might not even
use `appDb` and, instead, it might only use `subscribe` to provide input signals. In that case, the 
registered subscription would belong to "Level 3" of the signal graph (discussed in earlier tutorials).

Remember to deref any use of `appDb` and `subscribe`.  It is a rookie mistake to forget. I do it regularly.

You can use `reframe/reaction` (a utility function) which gives you the additional 
ability to attach an `onDispose` handler to the returned reaction, allowing you to do cleanup work when the subscription is no longer needed. 
[See an example of using `onDispose` here](Subscribing-To-External-Data.md)

### Example reg-sub-raw 

The following use of `reg-sub` can be found in [the todomvc example](https://github.com/Day8/re-frame/blob/develop/examples/todomvc/src/todomvc/subs.cljs):
```javascript
regSub(
    'visible-todos',
    //  signal function - returns a vector of two input signals
    ([query]) => [
        subscribe(['todos']),
        subscribe(['showing'])
    ],
    // the computation function - 1st arg is a 2-vector of values
    ([todos showing], query) => {
        let filterFn;
        if (showing === 'active') {
            filterFn = (todo) => !todo.get('done');
        } else (showing === 'done') {
            filterFn = (todo) => todo.get('donw');
        } else (showing === 'all') {
            filterFn = (todo) => true
        }
        return todos.filter(filterFn);
    }
    
)
```

we could rewrite this use of `reg-sub` using `reg-sub-raw` like this:
```javascript
regSubRaw(
    'visible-todos',
    (appDb, event) => {
        return reframe.reaction(() => {
           const 
                todos = subscribe(['todos']).deref(),
                showing = subscribe(['showing']).deref();
           
           let filterFn;
           if (showing === 'active') {
               filterFn = (todo) => !todo.get('done');
           } else (showing === 'done') {
               filterFn = (todo) => todo.get('donw');
           } else (showing === 'all') {
               filterFn = (todo) => true
           }
            return todos.filter(filterFn);                
        });
    }
)
```

A view could do `(subscribe [:visible-todos])` and never know which of 
the two variations above was used. Same result delivered.



*** 

Previous: [Correcting a wrong](SubscriptionsCleanup.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Up:       [Index](README.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Next:     [Basic App Structure](Basic-App-Structure.md) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->
