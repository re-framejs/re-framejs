<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table Of Contents

- [Bootstrapping Application State](#bootstrapping-application-state)
- [1. Register Handlers](#1-register-handlers)
- [2. Kick Start Reagent](#2-kick-start-reagent)
- [3. Loading Initial Data](#3-loading-initial-data)
  - [Getting Data Into `appDb`](#getting-data-into-app-db)
- [The Pattern](#the-pattern)
- [Scales Up](#scales-up)
- [Cheating - Synchronous Dispatch](#cheating---synchronous-dispatch)
- [Loading Initial Data From Services](#loading-initial-data-from-services)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Bootstrapping Application State

To bootstrap a re-frame application, you need to:
  1. register handlers
   - subscription  (via `regSub`)
   - events (via `regEventDb` or `regEventFx`)
   - effects (via `regFx`)
   - coeffects (via `regCofx`)
  2. kickstart react (views)
  3. Load the right initial data into `appDb` which might be a `merge` of:
   - Some default values
   - Values stored in LocalStorage
   - Values obtained via service calls to server
   - etc, etc

Point 3 is the interesting bit and will be the main focus of this page, but let's work our way through them ...

## 1. Register Handlers 

re-frame's various handlers all work in the same way.  You declare 
and register your handlers in the one step, like this "event handler" example: 
```javascript
reframe.regEventDb(                 // event handler will be registered automatically
    'some-id',
    (db, [_, value]) => {
        // ...  do some state change based on db and value
    }
)
```

As a result, there's nothing further you need to do because 
handler registration happens as a direct result of loading the code (presumably via a `<script>` tag in your HTML file).

## 2. Kick Start React 

Create a function `main` which does a `ReactDOM.render` of your root reagent component `MainPanel`:
```javascript
const MainPanel = reframe.view('MainPanel', function () { // my top level react component
    return <div>Hello DDATWD</div>;
})

export function main() {
    ReactDOM.render(MainPanel(), document.getElementById('app'));
}
```

Mounting the top level component `MainPanel` will trigger a cascade of child 
component creation.  The full DOM tree will be rendered.

## 3. Loading Initial Data 

Let's rewrite our `MainPanel` component to use a subscription. In effect, 
we want it to source and render some data held in `appDb`.  

First, we'll create the subscription handler:
```javascript
reframe.regSub(                             // a new subscription handler
    'name',                                 // usage reframe.subscribe(['name'])
    (db, _) => db.get('display-name')       // extracts `display-name` from appDb 
)
```

And now we use that subscription:
```javascript
const MainPanel = reframe.view('MainPanel', function() {
    const name = this.derefSub(['name']);   // <--- a subscription  <---
    return <div>Hello { name }</div>;       // <--- use the result of the subscription
})
```
    
The user of our app will see funny things 
if that `subscribe(['name'])` doesn't deliver good data. But how do we ensure "good data"?

That will require: 
  1. getting data into `appDb`; and
  2. not get into trouble if that data isn't yet in `appDb`.  For example, 
  the data may have to come from a server and there's latency.

**Note: `appDb` initially contains `{}`**

### Getting Data Into `appDb`

Only event handlers can change `appDb`. Those are the rules!! Indeed, even initial 
values must be put in `appDb` via an event handler. 

Here's an event handler for that purpose:
```javascript
reframe.regEventDb(
    'initialise-db',                    // usage: dispatch(['initialise-db'])
    () => {                             // Ignore both params (db and event)
        return Immutable.Map({
            'display-name': 'DDATWD',   // return a new value for app-db
            'items': [1,2,3,4]
        })
    }
)
```

You'll notice that this handler does nothing other than to return a ` map`. That map 
will become the new value within `appDb`.

We'll need to dispatch an `initialise-db` event to get it to execute. `main` seems like the natural place: 
```javascript
export function main() {
    reframe.dispatch(['initialise-db']);; // this is new
    ReactDOM.render(MainPanel(), document.getElementById('app'));
}
```

But remember, event handlers execute async. So although there's 
a `dispatch` within `main`, the event is simply queued, and the 
handler for `initialise-db` 
will not be run until sometime after `main` has finished.

But how long after?  And is there a race condition?  The 
component `main-panel` (which assumes good data) might be 
rendered before the `initialise-db` event handler has 
put good data into `appDb`. 

We don't want any rendering (of `main-panel`) until after `appDb` 
has been correctly initialised. 

Okay, so that's enough of teasing-out the issues. Let's see a 
quick sketch of the entire pattern. It is very straight-forward.

## The Pattern

```javascript
reframe.regSub(                         // the means by which main-panel gets data
    'name',                             // usage: this.derefSub(['name'])
    (db, _) => db.get('display-name')
);

reframe.regSub(                         // we can check if there is data
    'initialised?',                     // usage: this.derefSub(['initialised?'])
    (db, _) => !db.isEmpty()            // do we have data?
)

reframe.regEventDb(
    'initialise-db',
    (db, _) => db.set('display-name', 'Jane Doe')
)

const MainPanel = reframe.view('MainPanel', function() {
    const name = this.derefSub(['name']);
    return <div>Hello { name }</div>
});

const TopPanel = reframe.view('TopPanel', function() {
    const isReady = this.drefSub(['initialised?']);
    if (!isReady) {
        return <div>Initialising...</div>
    } 
    return MainPanel();
})

export function main() {
    reframe.dispatch(['initialise-db']);; // this is new
    ReactDOM.render(TopPanel(), document.getElementById('app'));
}
```

## Scales Up

This pattern scales up easily.

For example, imagine a more complicated scenario in which your app 
is not fully initialised until 2 backend services supply data.

Your `main` might look like this:
```javascript
export function main() {                                            // call this to bootstrap your app
    reframe.dispatch(['initialise-db']);                            // basics
    reframe.dispatch(['load-from-service-1']);                      // ask for data from service-1
    reframe.dispatch(['load-from-service-2']);                      // ask for data from service-2
    ReactDOM.render(TopPanel(), document.getElementById('app'));
}
```

Your `initialised?` test then becomes more like this sketch: 

```javascript
regSub(
    'initialised?',
    (db, _) => {
        return !db.isEmpty() && db.get('service1-answered?') && db.get('service2-answered?');
    }
)
```
This assumes boolean flags are set in `appDb` when data was loaded from these services.

## Cheating - Synchronous Dispatch

In simple cases, you can simplify matters by using `dispatchSync` (instead of `dispatch`) in 
the main function.  

This technique can be seen in the [TodoMVC Example](https://github.com/Day8/re-frame/blob/master/examples/todomvc/src/todomvc/core.cljs#L35).

`dispatch` queues an event for later processing, but `dispatchSync` acts 
like a function call and handles an event immediately. That's useful for initial data 
load we are considering, particularly for simple apps. Using `dispatchSync` guarantees 
that initial state will be in place before any views are mounted, so we know they'll 
subscribe to sensible values.  We don't need a guard like `top-panel` (introduced above). 

But don't get into the habit of using `dispatchSync` everywhere. It is the right 
tool in this context and, sometimes, when writing tests, but 
`dispatch` is the staple you should use everywhere else.

## Loading Initial Data From Services 

Above,  in our example `main`, we imagined using `reframe.dispatch(['load-from-service-1'])`  to request data
from a backend services.  How would we write the handler for this event?
 
The next Tutorial will show you how.



***

Previous:  [Namespaced Keywords](Namespaced-Keywords.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Up:  [Index](README.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Next:  [Talking To Servers](Talking-To-Servers.md)  

 
