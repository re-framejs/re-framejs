<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table Of Contents

- [Talking To Servers](#talking-to-servers)
- [Triggering The Request](#triggering-the-request)
- [The Event Handler](#the-event-handler)
  - [Version 1](#version-1)
  - [Successful GET](#successful-get)
  - [Problems In Paradise?](#problems-in-paradise)
  - [Version 2](#version-2)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Talking To Servers 

This page describes how a re-frame app might "talk" to a backend HTTP server.

We'll assume there's a json-returning server endpoint 
at "http://json.my-endpoint.com/blah". We want to GET from that 
endpoint and put a processed version of the returned json into `appDb`. 

## Triggering The Request

The user often does something to trigger the process. 

Here's a button which the user could click: 
```javascript
const RequestItButton = reframe.view('RequestItButton', function() {
    return <div class="button-class" on-click={() => dispatch(['request-it'])}  // get data from the server
        I want it, now!</div>
})
```

Notice the `on-click` handler - it `dispatch`es the event `[request-it]`.

## The Event Handler

That `request-it` event will need to be "handled", which means an event handler must be registered for it.

We want this handler to:
  1. Initiate the HTTP GET
  2. Update a flag in `appDb` which will trigger a modal "Loading ..." message for the user to see
  
We're going to create two versions of this event handler.  First, we'll create a
problematic version of the event handler and then, realising our sins, we'll write
a second version which is a soaring paragon of virtue. Both versions 
will teach us something.


### Version 1

We're going to use the [jquery library](https://jquery.com/) as the HTTP workhorse.

Here's the event handler: 
```javascript
regEventDb(                 // <-- register an event handler
    'requestId',            // <-- the event id
    (db) => {               // <-- the handler function
        // kick off the GET, making sure to supply a callback for success and failure
        $
            .get('http://json.my-endpoint.com/blah')
            .done(res => dispatch(['process-response', res]))    // <2> further dispatch !!
            .fail(res => dispatch(['bad-response', res]));       // <2> further dispatch !!
        // update a flag in `appDb` ... presumably to cause a "Loading..." UI 
        return db.set('loading', true);                          // <3> return an updated db
    }
)
```

Further Notes:
  1. Event handlers are normally put into an `events.js` namespace
  2. Notice that the GET callbacks issue a further `dispatch`. Such callbacks 
   should never attempt to close over `db` themselves, or make
   any changes to it because, by the time these callbacks happen, the value 
   in `appDb` may have changed.  Whereas, if they `dispatch`, then the event 
   handlers looking after the event they dispatch will be given the latest copy of the db.
  3. event handlers registered using `regEventDb` must return a new value for 
   `appDb`.  In our case, we set a flag which will presumably cause a "Loading ..."
   UI to show.

### Successful GET

As we noted above, the on-success handler itself is just
`dispatch(['process-response' RESPONSE])`.  So we'll need to register a handler
for this event too.

Like this:
```javascript
regEventDb(
    'process-response',
    (db, [_, response]) => {                    // destructure the response from the event vector
        return db.set('loading', false)         // take away that "Loading ..." UI
                    .set('data', response)      // fairly lame processing
    }
)
```

A normal handler would have more complex processing of the response. But we're 
just sketching here, so we've left it easy.

There'd also need to be a handler for the `bad-response` event too.  Left as an exercise.

### Problems In Paradise? 

This approach will work, and it is useful to take time to understand why it 
would work, but it has a problem:  the event handler isn't pure.  

That `GET` is a side effect, and side effecting functions are like a 
well salted paper cut. We try hard to avoid them.

### Version 2 

The better solution is, of course, to use an effectful handler. This 
is explained in detail in the previous tutorials: [Effectful Handlers](EffectfulHandlers.md) 
and [Effects](Effects.md).  

In the 2nd version, we use the alternative registration function, `regEventFx` , and we'll use an 
"Effect Handler" supplied by this library 
[https://github.com/Day8/re-frame-http-fx](https://github.com/Day8/re-frame-http-fx).
You may soon feel confident enough to write your own.
 
Here's our rewrite:

```javascript
regEventFx(
    'request-it',
    (cofx, _) => {
        const db = cofx.get('loading');
        return {
            'http-xhrio': {
                method: 'get',
                uri: 'http://json.my-endpoint.com/blah',
                format: 'json',
                responseFormat: 'json',
                onSuccess: ['process-response'],
                onFailure: ['badResponse']
            },
            db: db.set('loading', true)
        }
    }
)
```

Notes:
  1. Our event handler "describes" side effects, it does not "do" side effects
  2. The event handler we wrote for `process-response` stays as it was
  
  
  
***

Previous:  [Loading Initial Data](Loading-Initial-Data.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Up:  [Index](README.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Next:  [Subscribing to External Data](Subscribing-To-External-Data.md)  
