# re-framejs: Derived Values, Flowing


> This, milord, is my family's axe. We have owned it for almost nine hundred years, see. Of course,
sometimes it needed a new blade. And sometimes it has required a new handle, new designs on the
metalwork, a little refreshing of the ornamentation . . . but is this not the nine hundred-year-old
axe of my family? And because it has changed gently over time, it is still a pretty good axe,
y'know. Pretty good.

> -- Terry Pratchett, The Fifth Elephant

## Why Should You Care About re-framejs?

Either:

1.  You like re-framejs for ClojureScript
2.  You want to develop an [SPA] in JavaScript, and you are looking for a framework; or
3.  You believe that, by early 2015, ReactJS had won the JavaScript framework wars and
    you are curious about the bigger implications. Is the combination of
    `reactive programming`, `functional programming` and `immutable data` going to
    **completely change everything**?  And, if so, what would that look like in a language
    that embraces those paradigms?


## re-framejs

re-framejs is a pattern for writing [SPAs] in JavaScript, using [React].

This repo contains both a **description of this pattern** and a **reference implementation**.

To quote McCoy: "It's MVC, Jim, but not as we know it".

To build a re-framejs app, you:
 - design your app's data structure (data layer)
 - write and register subscription functions (query layer)
 - write React component functions  (view layer)
 - write and register event handler functions  (control layer and/or state transition layer)

Features:

1. The functions you write are pure, so the computational pieces of your app can
   be described, understood and tested independently.
   You won't need sophisticated Dependency Injection to test. So much
   incidental complexity evaporates.
2. These computational parts are composed via reactive data flows - a dynamic,
   unidirectional Signal graph.
3. The resulting architecture involves "derived data" flowing in a two-stage, reactive loop.
   Without realising it, you will be explicitly modelling time.
4. It is fast, straight out of the box. You won't have to go through [this sort of pain](http://blog.scalyr.com/2013/10/angularjs-1200ms-to-35ms/).
5. The surprising thing about re-framejs is how simple it is. Beautifully simple! Our reference
   implementation is little more than 500 lines of (JavaScript) code. Learn it in an afternoon.
6. But it scales up nicely to more complex apps.  Frameworks are just pesky overhead at small
   scale - measure them instead by how they help you tame the complexity of bigger apps.
7. re-framejs is impressively buzzword compliant: it has FRP-nature,
   unidirectional data flow, pristinely pure functions, conveyor belts, statechart-friendliness (FSM)
   and claims an immaculate hammock conception.
   It also has a charming xkcd reference (soon)
   and a hilarious, insiders-joke T-shirt, ideal for conferences (in design).
   What could possibly go wrong?

## Using re-framejs


[![Build Status](https://travis-ci.org/Day8/re-framejs.png?branch=master)](https://travis-ci.org/Day8/re-framejs)

re-framejs is available from clojars. Add the following to your project dependencies:
[![Clojars Project](http://clojars.org/re-framejs/latest-version.svg)](http://clojars.org/re-framejs)

__Warning__:  That was the summary. What follows is a long-ish tutorial/explanation.


## Tutorial Table of Contents


 - [What Problem Does It Solve?](#what-problem-does-it-solve)
 - [Guiding Philosophy](#guiding-philosophy)
 - [FRP Clarifications](#frp-clarifications)
 - [Explaining re-framejs](#explaining-re-framejs)
 - [On Data](#on-data)
 - [The Big Ratom](#the-big-ratom)
 - [The Benefits Of Data-In-The-One-Place](#the-benefits-of-data-in-the-one-place)
 - [Flow](#flow)
 - [How Flow Happens In Reagent](#how-flow-happens-in-reagent)
 - [Components](#components)
 - [Truth Interlude](#truth-interlude)
 - [Components Like Templates?](#components-like-templates)
 - [React etc.](#react-etc)
 - [Subscribe](#subscribe)
 - [Just A Read-Only Cursor?](#just-a-read-only-cursor)
 - [The Signal Graph](#the-signal-graph)
 - [A More Efficient Signal Graph](#a-more-efficient-signal-graph)
 - [The 2nd Flow](#the-2nd-flow)
 - [Event Flow](#event-flow)
 - [What are events?](#what-are-events)
 - [Dispatching Events](#dispatching-events)
 - [Event Handlers](#event-handlers)
 - [Routing](#routing)
 - [Control Via FSM](#control-via-fsm)
 - [As A Reduce](#as-a-reduce)
 - [Derived Data, Everywhere, flowing](#derived-data-everywhere-flowing)
 - [Logging And Debugging](#logging-and-debugging)
 - [Talking To A Server](#talking-to-a-server)
 - [The CPU Hog Problem](#the-cpu-hog-problem)
 - [In Summary](#in-summary)
 - [Where Do I Go Next](#where-do-i-go-next)
 - [Licence](#licence)

## What Problem Does It Solve?

First, we decided to build our SPA apps with JavaScript, then we
choose [React], then we had a problem.

For all its considerable brilliance,  React
delivers only the 'V' part of a traditional MVC framework.

But apps involve much more than V. Where
does the control logic go? How is state stored & manipulated? etc.

We read up on [Flux], [Pedestal App],
[Hoplon], [OM], [Elm], etc and re-framejs is the architecture that emerged.

re-framejs does have M, V, and C parts but they aren't objects, they
are pure functions (or pure data),
and they are wired together via reactive data flows.  It is sufficiently different in nature
from (traditional, Smalltalk) MVC that calling it MVC would be confusing.  I'd
love an alternative.

Perhaps it is a RACES framework - Reactive-Atom Component Event
Subscription framework (I love the smell of acronym in the morning).

Or, if we distill to pure essence, `DDATWD` - Derived Data All The Way Down.

*TODO:* get acronym down to 3 chars! Get an image of stacked Turtles for `DDATWD`
insider's joke, conference T-Shirt.


## Guiding Philosophy

__First__, above all we believe in the one true [Dan Holmsand], creator of Reagent, and
his divine instrument the `ratom`.  We genuflect towards Sweden once a day.

__Second__, we believe in immutable data and the process of building
a system out of pure functions.

__Third__, we believe that [FRP] is one honking great idea. You might be tempted to see
Reagent as simply another of the React wrappers - a sibling to [OM] and
[omniscient](http://omniscientjs.github.io/).
But you'll only really "get"
Reagent when you view it as an FRP-ish library. To put that another way, I think
that Reagent, at its best, is closer in nature to [Hoplon] or [Elm] than it is OM.

__Finally__, we believe in one-way data flow. No two way data binding. We don't
like read/write `cursors` which
promote the two way flow of data. As programs get bigger, we've found that their
use seems to encourage control logic into all the wrong places.

## FRP Clarifications

We'll get to the meat in a second, I promise, but first one final, useful diversion ...

Terminology in the FRP world seems to get people hot under the collar. Those who believe in continuous-time
semantics might object to me describing re-framejs as having FRP-nature. They'd claim that it does something
different from pure FRP, which is true.

But, these days, FRP seems to have become a
["big tent"](http://soft.vub.ac.be/Publications/2012/vub-soft-tr-12-13.pdf)
(a broad church?).
Broad enough perhaps that re-framejs can be in the far, top, left paddock of the tent, via a series of
qualifications: re-framejs has "discrete, dynamic, asynchronous, push FRP-ish-nature" without "glitch free" guarantees.
(Surprisingly, "glitch" has specific meaning in FRP).

**If you are new to FRP, or reactive programming generally**, browse these resources before
going further (certainly read the first two):
- [Creative Explanation](http://paulstovell.com/blog/reactive-programming)
- [Reactive Programming Backgrounder](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
- [presentation (video)](http://www.infoq.com/presentations/ClojureScript-Javelin) by Alan Dipert (co-author of Hoplon)
- [serious pants Elm thesis](https://www.seas.harvard.edu/sites/default/files/files/archived/Czaplicki.pdf)

And for the love of all that is good, please watch this terrific
[StrangeLoop presentation ](https://www.youtube.com/watch?v=fU9hR3kiOK0) (40 mins). Watch what happens
when you re-imagine a database as a stream!! Look at all the problems that are solved.
Think about that: shared mutable state (the root of all evil),
re-imagined as a stream!!  Blew my socks off.

re-framejs tries to be `Derived Data everywhere, flowing`. Or perhaps,
`Derived Data All The Way Down` (an infinite loop of Derived Data).
More explanation on all these claims soon.

## Explaining re-framejs

To explain re-framejs, I'll incrementally develop a diagram, describing each part as it is added.

Initially, I'll be using [Reagent] at an intermediate to advanced level.  But this is no introductory
reagent tutorial and you will need to have done one of those before continuing here. Try
[The Introductory Tutorial](http://reagent-project.github.io/) or
[this one](https://github.com/jonase/reagent-tutorial) or
[Building Single Page Apps with Reagent](http://yogthos.net/posts/2014-07-15-Building-Single-Page-Apps-with-Reagent.html).

### On Data

<blockquote class="twitter-tweet" lang="en"><p>Well-formed Data at rest is as close to perfection in programming as it gets. All the crap that had to happen to put it there however...</p>&mdash; Fogus (@fogus) <a href="https://twitter.com/fogus/status/454582953067438080">April 11, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

### The Big Ratom

Our re-framejs diagram starts (very modestly) with  Fogus' ***well-formed data at rest*** bit:

```
db$
```

re-framejs says that you put your data into one place which we'll call `db$`. Structure
the data in that place, of course, and [give it a schema](https://github.com/Prismatic/schema).

Now, this advice is not the slightest bit controversial for 'real' databases, right?
You'd happily put all your well-formed data into PostgreSQL or MySQL.

But within a running
application (in memory), it is different. If you have a background in OO, this data-in-one-place
business is a really, really hard one to swallow.  You've
spent your life breaking systems into pieces, organised around behaviour and trying
to hide the data.  I still wake up in a sweat some nights thinking about all
that JSON data lying around exposed and passive.

But, as Fogus reminds us, data at rest is the easy bit. Believe.

From here on in this document, we'll assume `db$` is one of these:

```javascript
const db$ = reframe.atom(Immutable.Map()); ;; atom, containing an immutable map
```

Atom in re-framejs is mutable wrappper of immutable data. I'd encourage you to think of it as an in-memory database.
It will contain structured data. You will need to query that data. You will perform CRUD
and other transformations on it. You'll often want to transact on this
database atomically, etc.  So "in-memory database"
seems a more useful paradigm than plain old map-in-atom.

A clarification:  `db$` doesn't actually have to be a atom containing
a map.  It could, for example, be a [datascript] database.  In fact, any database which is reactive
(can tell you when it changes) would do.  (We'd love! to be using [datascript] - so damn cool -
but we had too much
data in our apps. If you were to use it, you'd have to tweak the reference implementation a bit,
[perhaps using this inspiration](https://gist.github.com/allgress/11348685)).  The reference implementation already creates and manages an internal `db$` for you, you don't need to declare one yourself.


### The Benefits Of Data-In-The-One-Place

I'm going to quote verbatim from Elm's website:

1. There is a single source of truth. Traditional approaches force you to write a decent amount
of custom and error prone code to synchronize state between many different stateful components.
(The state of this widget needs to be synced with the application state, which needs to be
synced with some other widget, etc.) By placing all of your state in one location, you
eliminate an entire class of bugs in which two components get into inconsistent states. We
also think you will end up writing much less code. That has been our observation in Elm so far.

2. Save and Undo become quite easy. Many applications would benefit from the ability to save
all application state and send it off to the server so it can be reloaded at some later date.
This is extremely difficult when your application state is spread all over the place and
potentially tied to objects that cannot be serialized. With a central store, this becomes
very simple. Many applications would also benefit from the ability to easily undo user's
actions. For example, a painting app is better with Undo. Since everything is immutable in Elm,
this is also very easy. Saving past states is trivial, and you will automatically get pretty
good sharing guarantees to keep the size of the snapshots down.


To this list, I would briefly add two:  the ability to genuinely model control via FSMs
and the ability to do time travel debugging, even in a production setting. More on both soon.

[Hoplon] takes the same approach via what they called `stem cells`, which is a root source of data.

## Flow

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


### How Flow Happens In re-framejs

To implement FRP, re-framejs provides an `atom`. Atom is `BehaviorSubject` from RxJS.

From Rx's perspective `atom` just holds the last value of the stream. Let's tweak that paradigm slightly and **view an
`atom` as haviang a value that changes over time.** Seems like a subtle distinction, I know, but because of it, re-framejs sees an
`atom` as a Signal. [Pause and read this](http://elm-lang.org/learn/What-is-FRP.elm).

re-framejs adds `swap` and `reset` functions for changing value of the `atom`.

Now let's focus on signal transformation. You can use Rx `map` operator for computation of derived values. This operator
takes function accepting current stream value, returning new value. This new value is wrapped inside Rx stream, so you can chain
transformation like you want. The magic thing about Rx operators is that they will be re-run whenever 'they input' change,
producing a new output value.

You can chain rx operators arbitrary producing as many streams as you want. You can view each stream as a kind of
'materialized view' from database terminology.

We call this chains Signal graph. "Values" flow (propagate) through the Signal graph.

But this Signal graph must be without cycles, because cycles cause mayhem!  re-framejs achieves
a unidirectional flow.

While the mechanics are different, rx `operator` has the intent of `lift` in [Elm] and `defc=` in [Hoplon].

Right, so that was a lot of words. Some code to clarify:

```javascript
import * as reframe from 'reframe';
import * as Immutable from 'immutable';

const db$ = reframe.atom(Immutable.Map({a: 1})); //  our root atom  (signal)
const atom2 = db$.map(db => Immutable.Map({b: db.get('a')})); map wraps a computation, returns a signal
const atom3 = atom2.map(db => {
    if (db.get('b') === 0) {
       return 'World';
    } else if (db.get('b') === 1) {
       return 'Hello';
    }
  }); // map wraps another computation


// Notice that both transformations above return a new stream.
// Those new streams hold the (time varying) value of the computations.

console.log(reframe.deref(atom2).toJS());     // ==>  {:b 1}       ;; a computed result, involving db$
console.log(reframe.deref(atom3).toJS());     // ==> "Hello"       ;; a computed result, involving atom2


reframe.reset(db$, Immutable.Map({a: 0}));    // this change to db$, triggers re-computation
                               // of atom2
                               // which, in turn, causes a re-computation of atom3

console.log(reframe.deref(atom2).toJS());     // ==>  {:b 0}       ;; atom2 is a computed result, involving db$
console.log(reframe.deref(atom3).toJS());     // ==> "World"       ;; atom3 is automatically updated too
```

So, in FRP-ish terms, an `operator` will produce a "stream" of values over time (it is a Signal),
accessible via the `stream` it returns.


Okay, that was all important background information for what is to follow. Back to the diagram ...

## Components

Extending the diagram, we introduce `components`:

```
db$  -->  components  -->  ReactDOM
```

When using React, your primary job is to write one or more `components`. This is the view layer.

Think about `components` as `pure functions` - data in, ReactDOM out.  `ReactDOM` is
data structures which represent DOM. Here's a trivial component:

```javascript
const greet = () => React.DOM.div(null, 'Hello ratoms and reactions');
```

And if we call it:

```javascript
React.renderToStaticMarkup(greet());
// ==> "<div>Hello ratoms and reactions</div>"
```

You'll notice that our component is a regular Javascript function, nothing special.

Here is a slightly more interesting (parameterised) component (function) using re-framejs react view function:

```javascript
const greet = (name$) => { // greet has a parameter name$ holding a string
   return React.DOM.div(null, 'Hello ' + reframe.deref(name$)); // deref name$ returns current value from the stream
};

// create an atom, containing a string
const n = reframe.atom('re-framejs');

// call our `component` function, passing in an atom
React.renderToStaticMarkup(greet(n));
// ==>  "<div>Hello re-framejs</div>"
```

So components are easy - at core they are a render function which turns data into
ReactDOM (which will later become DOM).

Now, let's introduce `component reaction` into this mix. If want component to be re-renderd we need to call `forceUpdate`
on the react component. As we need to wire up stream with react component and also get current value for render, we can
use re-framejs built-in function `view`:

```
// our view function is now wrapped with reframe.view
const greet = reframe.view('Greet', function(name$) {
   return React.DOM.div(null, 'Hello ' + this.deref(name$)); // we call deref directly on react component to bind it to stream
});

const greet = reframe.view('Greet', (name$) => {
   return React.DOM.div(null, 'Hello ' + this.deref(name$)); // we call deref directly on react component to bind it to stream
});

const n = reframe.atom('re-framejs');

// create react component, fix it to current n value
const component = greet(n);

React.renderToStaticMarkup(component);
// ==>  "<div>Hello re-framejs</div>"

// change current name
reframe.reset(n, 'blah');

// rerender the same component, should render current changed value
React.renderToStaticMarkup(component);
// ==>  "<div>Hello blah</div>"
```

So, as `n` changes value over time (via a `reset`), changes are subscribed (by `this.deref call`) in the component,
which in turn rerenders itself on stream changes. This is FRP.

Derived Data, flowing.

### Components Like Templates?

A `component` such as `greet` is like the templates you'd find in
Django, Rails, Handlebars or Mustache -- it maps data to HTML -- except for two massive differences:

  1. you have the full power of JavaScript available to you (generating a React DOM data structure). The
     downside is that these are not "designer friendly" HTML templates.
  2. these templates are reactive.  When their input Signals change, they
     are automatically rerun, producing new DOM. re-framejs adroitly shields you from the details.
     If any of the the "inputs" to that render change, the render is rerun.

### React etc.

Okay, so we have some unidirectional, dynamic, async, discrete FRP-ish data flow happening here.

Question: To which ocean does this river of data flow?  Answer: The DOM ocean.

The full picture:
```
db$  -->  components  -->  VDOM (ReactDOM) -->  React  --> DOM
```

Best to imagine this process as a pipeline of 2 functions.  Each
function takes data from the
previous step, and produces (derived!) data for the next step.  In the next
diagram, the three functions are marked (f1, f2). The unmarked nodes are derived data,
produced by one step, to be input to the following step.  Hiccup,
VDOM and DOM are all various forms of HTML markup (in our world that's data).

```
db$  -->  components  -->   VDOM  -->  React  -->  DOM
               f1                           f2
```

Derived Data, flowing.  Every step is acting like a pure function and turning data into new data.

All well and good, and nice to know, but we don't have to bother ourselves with most of the pipeline.
We just write the `components`
part and re-framejs/React will look after the rest.  So back we go to that part of the picture ...


## Subscribe

`components` render the app's state as ReactDOM.

```
db$  -->  components
```


`components` (view layer) need to query aspects of `db$` (data layer).

But how?

Let's pause to consider **our dream solution** for this part of the flow. `components` would:
  * obtain data from `db$`  (their job is to turn this data into ReactDOM).
  * obtain this data via a (possibly parameterised) query over `db$`. Think database kind of  query.
  * automatically recompute their ReactDOM output, as the data returned by the query changes, over time
  * use declarative queries. Components should know as little as possible about the structure of `db$`. SQL?  Datalog?

re-framejs's `subscriptions` are an attempt to live this dream. As you'll see, they fall short on the declarative
query part, but they comfortably meet the other requirements.

As a re-framejs app developer, your job will be to write and register one or more
"subscription handlers" - functions that do a named query.

Your subscription functions must return a value that changes over time (a Signal). I.e. they'll
be returning an Rx stream.

Rules:
 - `components` never source data directly from `db$`, and instead, they use a subscription.
 - subscriptions are only ever used by components  (they are never used in, say, event handlers).

Here's a component using a subscription:

```javascript
const greet = reframe.view('Greet', (name$) => {
   const value = this.derefSub(['name-query']); // <---- subscribing happens here
   return React.DOM.div(null, 'Hello ' + value);
});
```

`subscribe` is always called like this:

```javascript
   reframe.subscribe([query-id, some optional query parameters...])
```

There is only one (global) `subscribe` function and it takes one parameter, assumed to be a vector.

The first element in the vector (shown as `query-id` above) identifies/names the query and the other elements are optional
query parameters. With a traditional database a query might be:

```
select * from customers where name="blah"
```

In re-framejs, that would be done as follows:
    reframe.subscribe(['customer-query', 'blah']);
which would return an `atom` holding the customer state (a value which might change over time!).

So let's now look at how to write and register the subscription handler for `customer-query`

```javascript
// a query over 'app-db' which returns a customer
function customerQuery(db$, [sid, cid]) {               // query fns are given 'db$', plus vector given to subscribe
    assert(sid === 'customer-query')                    // subscription id was the first element in the vector
    return db$.map(db => db.getIn(['path', 'to', 'map', cid])); // re-runs each time db changes
};

reframe.registerSub(
    'customer-query', // the id (the name of the query()
    customerQuery // the function which will perform the query
);
```

Notice how the handler is registered to handle `customer-query` subscriptions.

**Rules and Notes**:
 - you'll be writing one or more handlers, and you will need to register each one.
 - handlers are functions which take two parameters:  the db$ atom, and the vector given to subscribe.
 - `components` tend to be organised into a hierarchy, often with data flowing from parent to child via
parameters. So not every component needs a subscription. Very often the values passed in from a parent component
are sufficient.
 - subscriptions can only be used in reframe.view wrapped components correctly.

### Just A Read-Only Cursor?

Subscriptions are different to read-only cursors.

Yes, `subscriptions` abstract away (hide) the data source, like a Cursor, but they also allow
for computation. To put that another way, they can create
derived data from `db$` (a Materialised View of  `db$`).

Imagine that our `db$` contained `items` - a vector of maps. And imagine that we wanted to
display these items sorted by one of their attributes.  And that we only want to display the top 20 items.

This is the sort of "derived data" which a subscription can deliver.
(And as we'll see, more efficiently than a Cursor).

## The Signal Graph

Let's sketch out the situation described above ...


`db$` would be a bit like this (`items` is a vector of maps):
```javascript
const L = [{:name "a" :val 23 :flag "y"},
           {:name "b" :val 81 :flag "n"},
           {:name "c" :val 23 :flag "y"}];

const db$ = reframe.atom(Immutable.Map({items: L,
                            'sort-by': 'name'}));     // sorted by the `name` attribute
```
*CONTINUE HERE*
The subscription-handler might be written:

```Clojure
(register-sub
 :sorted-items      ;; the query id  (the name of the query)
 (fn [db [_]]       ;; the handler for the subscription
   (reaction
      (let [items      (get-in @db [:items])     ;; extract items from db
            sort-attr  (get-in @db [:sort-by])]  ;; extract sort key from db
          (sort-by sort-attr items)))))          ;; return them sorted
```


Subscription handlers are given two parameters:

  1. `app-db` - that's a reagent/atom which holds ALL the app's state. This is the "database"
     on which we perform the "query".
  2. the vector originally supplied to `subscribe`.  In our case, we ignore it.

In the example above, notice that the `reaction` depends on the input Signal:  `db`.
If `db` changes, the query is re-run.

In a component, we could use this query via `subscribe`:

```Clojure
(defn items-list         ;; Form-2 component - outer, setup function, called once
  []
  (let [items   (subscribe [:sorted-items])   ;; <--   subscribe called with name
        num     (reaction (count @items))     ;; Woh! a reaction based on the subscription
        top-20  (reaction (take 20 @items))]  ;; Another dependent reaction
     (fn []
       [:div
           (str "there's " @num " of these suckers. Here's top 20")     ;; rookie mistake to leave off the @
           (into [:div ] (map item-render @top-20))])))   ;; item-render is another component, not shown
```

There's a bit going on in that `let`, most of it tortuously contrived, just so I can show off chained
reactions. Okay, okay, all I wanted really was an excuse to use the phrase "chained reactions".

The calculation of `num` is done by a `reaction` which has `items` as an input Signal. And,
as we saw, `items` is itself a reaction over two other signals (one of them the `app-db`).

So this is a Signal Graph. Data is flowing through computation into renderer, which produce Hiccup, etc.

## A More Efficient Signal Graph

But there is a small problem. The approach above might get inefficient, if `:items` gets long.

Every time `app-db` changes, the `:sorted-items` query is
going to be re-run and it's going to re-sort `:items`.  But `:items` might not have changed. Some other
part of `app-db` may have changed.

We don't want to perform this computationally expensive re-sort
each time something unrelated in `app-db` changes.

Luckily, we can easily fix that up by tweaking our subscription function so
that it chains `reactions`:

```Clojure
(register-sub
 :sorted-items             ;; the query id
 (fn [db [_]]
   (let [items      (reaction (get-in @db [:some :path :to :items]))]  ;; reaction #1
         sort-attr  (reaction (get-in @db [:sort-by]))]                ;; reaction #2
       (reaction (sort-by @sort-attr @items)))))                       ;; reaction #3
```

The original version had only one `reaction` which would be re-run completely each time `app-db` changed.
This new version, has chained reactions.
The 1st and 2nd reactions just extract from `db`.  They will run each time `app-db` changes.
But they are cheap. The 3rd one does the expensive
computation using the result from the first two.

That 3rd, expensive reaction will be re-run when either one of its two input Signals change, right?  Not quite.
`reaction` will only re-run the computation when one of the inputs has **changed in value**.

`reaction` compares the old input Signal value with the new Signal value using `identical?`. Because we're
using immutable data structures
(thank you ClojureScript), `reaction` can perform near instant checks for change on even
deeply nested and complex
input Signals. And `reaction` will then stop unneeded propagation of `identical?` values through the
Signal graph.

In the example above, reaction #3 won't re-run until `:items` or `:sort-by` are different
(do not test `identical?`
to their previous value), even though `app-db` itself has changed (presumably somewhere else).

Hideously contrived example, but I hope you get the idea. It is all screamingly efficient.

Summary:
 - you can chain reactions.
 - a reaction will only be re-run when its input Signals test not identical? to previous value.
 - As a result, unnecessary Signal propagation is eliminated using highly efficient  checks,
   even for large, deep nested data structures.


## The 2nd Flow

At the top, I said that re-framejs had two data flows.

The data flow from `app-db` to the DOM is the first half of the story. We now need to consider
the 2nd part of the story: the flow in the opposite direction.

While the first flow has FRP-nature, the 2nd flow does not.  Well, not at first glance anyway.

When I think about these two flows, I imagine [one of those school diagrams](http://thumbnails-visually.netdna-ssl.com/water-cycle_521f29b8b6271_w1500.png) showing the water cycle. Rivers taking water down to the oceans, and evaporation/clouds/wind taking water back over the mountains to fall again as rain or snow. Repeat.

There is a cycle, but it is handled by two independent flows.

*With re-framejs, it is not water that is flowing, it is data.*

## Event Flow

Events are what flow in the opposite direction.

In response to user interaction, a DOM will generate
events like "clicked delete button on item 42" or
"unticked the checkbox for 'send me spam'".

These events have to be "handled".  The code doing this handling might
mutate app state (in `app-db`), or request more data from the server, or POST somewhere and wait for a response, etc.

In fact, all these actions ultimately result in changes to the `app-db`.

An application has many handlers, and collectively
they represent the **control layer of the application**.

In re-framejs, the backwards data flow of events happens via a conveyor belt:

```
app-db  -->  components  -->  Hiccup  -->  Reagent  -->  VDOM  -->  React  -->  DOM
 ^                                                                              |
 |                                                                              v
 handlers <-------------------  events  -----------------------------------------
                          a "conveyor belt" takes events
                          from the DOM to the handlers
```

Generally, when the user manipulates the GUI, the state of the application changes. In our case,
that means the `app-db` will change.  After all, it **is** the state.  And the DOM presented to
the user is a function of that state.

So that tends to be the cycle:

1. the user clicks something which causes an event to be dispatched
2. a handler manages the event
3. and causes `app-db` to change   (mutation happens here!)
4. which then causes a re-render
5. the user sees something different
6. goto #1

That's our water cycle.

Because handlers are that part of the system which does `app-db` mutation, you
could almost imagine them as a "stored procedures" on a
database. Almost. Stretching it?  We do like our in-memory
database analogies.

### What are events?

Events are data. You choose the format.

In our reference implementation we choose a vector format. For example:

   [:delete-item 42]

The first item in the vector identifies the event and
the rest of the vector is the optional parameters -- in the example above, the id (42) of the item to delete.

Here are some other example events:

```Clojure
   [:yes-button-clicked]
   [:set-spam-wanted false]
   [[:complicated :multi :part :key] "a parameter" "another one"  45.6]
```

**Rule**:  events are pure data. No dirty tricks like putting callback functions on the wire.
You know who you are.

### Dispatching Events

Events tend to start in the DOM in response to user actions.  They are `dispatched`.

For example, a button component might be like this:

```Clojure
   (defn yes-button
       []
       [:div  {:class "button-class"
               :on-click  #(dispatch [:yes-button-clicked])}
               "Yes"])
```

Notice the `on-click` DOM handler:

```Clojure
   #(dispatch [:yes-button-clicked])
```

With re-framejs, we try to keep the DOM as passive as possible. We do not
want our views containing any control logic. That "on-click" is as simple as we can make it.

There's a single `dispatch` function in the entire framework, and it takes one parameter:
the event (vector) to be
dispatched (which is pure simple, lovely data, flowing).

Let's update our diagram to show `dispatch`:

```
app-db  -->  components  -->  Hiccup  -->  Reagent  -->  VDOM  -->  React  -->  DOM
 ^                                                                              |
 |                                                                              v
 handlers <----------------------------------------  (dispatch [event-id  event params])
```

**Rule**:  `components` are as passive and minimal as possible when it comes to handling events.
They `dispatch` pure data and nothing more.

### Event Handlers

Collectively, event handlers provide the control logic in a re-framejs application.

An event handler is a pure function of two parameters:

 1. current value in `app-db`.  Note: that's the map **in** `app-db`, not the atom itself.
 2. an event (represented as a vector)

It returns the new value which should be reset! into `app-db`.

An example handler:
```Clojure
(defn handle-delete
   [app-state [_ item-id]]          ;; notice how event vector is destructured -- 2nd parameter
   (dissoc-in app-state [:some :path item-id]))     ;; return a modified version of 'app-state'
```

Handling an event invariably involves mutating the value in `app-db`
(which is provided as the first parameter).
An item is added here, or one is deleted there.  So, often simple CRUD, but sometimes much more,
and sometimes with async results.

But the `app-db` mutation is ultimately handled by re-framejs (it does the `reset!`). That leaves your event
handlers pure. As a result, they tend to be easy to test and understand.  Many are almost trivial.

There's more to event handlers than can be covered here in this introductory tutorial. Read up on
issues like Middleware [in the Wiki](https://github.com/Day8/re-framejs/wiki#handler-middleware).

### Routing

When `dispatch` is passed an event vector, it just puts that event onto a conveyor belt.

The consumer on the end of the conveyor is a `router` which will organise for that
event to be processed by the right handler.


```
app-db  -->  components  -->  Hiccup  -->  Reagent  -->  VDOM  -->  React  -->  DOM
 ^                                                                              |
 |                                                                              v
 handlers <-----  router  <-----------------------  (dispatch [event-id  event params])
```

The `router` will:

1. inspect the 1st element of the arriving vector
2. look in its registry for the handler which is registered for this kind of event
3. call that handler with two parameters: (1) the current value in `app-db` and (2) the event vector
4. reset! the returned value back into `app-db`.

As a re-framejs app developer, your job is to write handlers for each kind of event, and
then to register those handlers with the router.

Here's how we would register our event handler:

```Clojure
(register-handler
  :delete-item         ;; the event id (name)
  handle-delete)       ;; the handler function for that event
```

Any arriving event vector which has `:delete-item` as the first element will now be routed to our handler.

### Control Via FSM

Above, I commented that event handlers collectively represent the "control layer" of the
application.  They contain
logic which interprets arriving events and they "step" the application "forward"
via mutations to `app-db`.

Our `delete-handler` above is trivial, but as an application grows more features, the logic in many
handlers will become more complicated, and they will have to query BOTH the current state of the app
AND the arriving event vector to determine what action to take.

If the app is in logical State A, and event X arrives, then the handler will move the app to logical state B
(by changing values in `app-db`).

Sound like anything you learned in those [Theory Of Computation](https://www.youtube.com/watch?v=Pt6GBVIifZA)
lectures?

That's right - as an app becomes more complex, the handlers are likely to be  collectively implementing a
[Finite State Machine](http://en.wikipedia.org/wiki/Finite-state_machine):
  - your app is in a certain logical state (defined by the current values in `app-db`)
  - the arriving event vector represents a `trigger`.
  - the event handler implements "a transition", subject to BOTH the current logical state and the arriving trigger.
  - after the handler has run, the transition may have moved the app into a new logical state.
  - Repeat.

Not every app has lots of logical `states`, but many do, and if you are implementing one of them, then formally
recognising it and using a technique like
[state charts](http://www.amazon.com/Constructing-User-Interface-Statecharts-Horrocks/dp/0201342782) will help
greatly in getting a clean design and a nice datamodel.

The beauty of re-framejs from a FSM point of view is that all the data is in one place - unlike OO systems where
the data is distributed (and synchronized) across many objects. So implementing your control logic as a FSM is
both possible and natural in re-framejs, whereas it is often difficult and contrived to do so in other
kinds of architecture (in my experience).

### As A Reduce

So here's another way of thinking about what's happening with this data flow - another useful mental model.

First, imagine that all the events ever dispatched by a certain running  app were stored in a collection.
So, if when the app started, the user clicked on button X then the first item in this collection
would be the event generated
by that button, and then, if next the user moved a slider, the associated event would be the
next item in the collection, and so on and so on. We'd end up with a collection of event vectors.


Second, remind yourself that the `combining function` of a `reduce` takes two parameters:

1. the current state of the reduction and
2. the next collection member to fold in.

Then notice that event handlers take two parameters too:

1. the current state of `app-db`
2. the next item to fold in.

Which is the same as a `combining function` in a `reduce`!!

So now we can introduce the new mental model:  at any point in time, the value in `app-db` is the result of
performing a `reduce` over
the entire `collection` of events dispatched in the app up until that time. The combining function
for this reduce is the set of handlers.

It is almost like `app-db` is the temporary place where this imagined `perpetual reduce` stores
its on-going reduction.

### Derived Data, Everywhere, flowing

Have you watched that
[StrangeLoop presentation ](https://www.youtube.com/watch?v=fU9hR3kiOK0) yet?
I hope so. Database as a stream, right?

If you have then, given the explanation above, you might twig to the idea that `app-db` is
really a derived value (of the `perpetual reduce`).

And yet, it acts as the authoritative source of state in the app. And yet, it isn't, it is simply
a piece of derived state.  And
yet, it is the source.

Hmm. This is an infinite loop of sorts. **Derived data is flowing around the
loop, reactively, through pure functions.**  There is a pause in the loop whenever we wait
for a new event, but the moment we get it, it's another iteration of the "derived data" FRP loop.

Derived values, all the way down, forever.

Good news.  If you've read this far,
your insiders T-shirt will be arriving soon - it
will feature turtles
and [xkcd](http://xkcd.com/1416/). We're still working on the hilarious caption bit. Open a
repo issue with a suggestion.

Back to the more pragmatic world ...

### Logging And Debugging

How did that exception happen, you wonder, shaking your head?  What did the user do immediately prior
to the exception?  What state was the app in that this event was so disastrous?

To debug it, you need to know this information:
 1. the state of the app immediately before the exception
 2. What final event then caused your app to fall in a screaming mess.

Well, with re-framejs you need to record (have available):
 1. A recent checkpoint of the app state in `app-db` (perhaps the initial state)
 2. all the events `dispatch`ed since the last checkpoint, up to the point where the exception occurred.

Note: that's all just data. **Pure, lovely loggable data.**

If you have that data, then you can reproduce the exception.

re-framejs allows you to time travel. Install the "checkpoint" state into `app-db`
and then "play forward" through the collection dispatched events.

The only way the app "moves forwards" is via events. "Replaying events" moves you
step by step towards the exception causing problem.

This is utterly, utterly perfect for debugging assuming, of course, you are in a position to capture
a checkpoint, and the events since then.

### Talking To A Server

Some events handlers will need to initiate an async server connection (e.g. GET or POST something).

The initiating event handlers should organise that the `on-success` or `on-fail` handlers for
these HTTP requests themselves simply dispatch a new event.  They should never attempt to
modify `app-db` themselves.  That is always done in a handler.

**Notes**:
 - all events are handled via a call to `dispatch`. GUI events, async HTTP events, everything.
 - `dispatch` will cause a handler function to be called. But the process is async. The call is queued.
 - if you (further) dispatch in a handler, then that will be async too. The associated handler is
   queued for later processing.  Why?  Partially because handlers are given a snapshot of
   the `app-db` and can't be nested.
 - if you kick off an HTTP request in a handler, then organise for the on-success or on-fail handlers
   to dispatch their outcome.  All events are handled via dispatch. on-success should never ever change
   `app-db`.

The [wiki](https://github.com/Day8/re-framejs/wiki/Talking-To-Servers) has more on the subject.

## The CPU Hog Problem

Sometimes a handler has a lot of CPU intensive work to do, and getting through it will take a while.

When a handler hogs the CPU, nothing else can happen. Browsers only give us one thread of
execution and that CPU-hogging handler owns it, and it isn't giving it up. The UI will be
frozen and there will be
no processing of any other handlers (e.g. on-success of POSTs), etc., etc. Nothing.

And a frozen UI is a problem.  GUI repaints are not happening. And user interactions are not being processed.

How are we to show progress updates like "Hey, X% completed"?  Or how can we handle the
user clicking on that "Cancel" button trying to stop this long running process?

We need a means by which long running handlers can hand control
back for "other" processing every so often, while still continuing on with their
computation.

Luckily, [re-framejs has a solution](https://github.com/Day8/re-framejs/wiki/Solve-the-CPU-hog-problem).


### In Summary

re-framejs has two distinct flows, and I claim they are BOTH FRP in nature.  The first is clearly FRP.
The second one is conceptually FRP, but you do have to squint.

All the parts are simple. The parts are easy to understand in isolation. The parts are composed so that
derived data flows in a perpetual reactive loop, through pure functions.


To build an app using re-framejs, you'll have to:
 - design your app's data structure.
 - write and register subscription functions (query layer).
 - write component functions  (view layer).
 - write and register event handler functions  (control layer and/or state transition layer).


### Where Do I Go Next?

Your next steps with re-framejs should be:
  - look at the examples:  https://github.com/Day8/re-framejs/tree/master/examples
  - use the lein template:  https://github.com/Day8/re-framejs-template
  - read more in the Wiki:  https://github.com/Day8/re-framejs/wiki

You might also be interested in James MacAulay's excellent work (not re-framejs!):
https://github.com/jamesmacaulay/zelkova

If you want reusable layout and widget components, consider this sister project:
https://github.com/Day8/re-com

Here are some open source re-framejs apps you can look at for more inspiration:

- https://github.com/madvas/fractalify/

### Licence

Copyright © 2015 Michael Thompson

Distributed under The MIT License (MIT) - See LICENSE.txt

[SPAs]:http://en.wikipedia.org/wiki/Single-page_application
[SPA]:http://en.wikipedia.org/wiki/Single-page_application
[Reagent]:http://reagent-project.github.io/
[Dan Holmsand]:https://twitter.com/holmsand
[Flux]:http://facebook.github.io/flux/docs/overview.html#content
[Hiccup]:https://github.com/weavejester/hiccup
[FRP]:https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
[Elm]:http://elm-lang.org/
[OM]:https://github.com/swannodette/om
[Prismatic Schema]:https://github.com/Prismatic/schema
[datascript]:https://github.com/tonsky/datascript
[Hoplon]:http://hoplon.io/
[Pedestal App]:https://github.com/pedestal/pedestal-app
