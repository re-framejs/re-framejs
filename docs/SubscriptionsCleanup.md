## Subscriptions Cleanup 

There's a problem and we need to fix it. 


### The Problem 

The simple example, used in the earlier code walk through, is not idomatic re-frame. It has a flaw. 

It does not obey the re-frame rule:  **keep views as simple as possible**.
 
A view shouldn't do any computation on input data. Its job is just to compute jsx.
The subscriptions it uses should deliver the data already in the right 
structure, ready for use in jsx generation.

### Just Look 

Here be the horrors: 
```javascript
const Clock = reframe.view('Clock', function() {
   return <div class="example-clock" style={color: this.derefSub(['time-color'])}>
    { this.derefSub(['time']).toTimeString().split(" ")[0]}
   </div> 
});
```

That view obtains data from a `[time]` subscription and then it 
massages that data into the form it needs for use in the jsx.  We don't like that. 

### The Solution

Instead, we want to use a new `[time-str]` subscription which will deliver the data all ready to go, so 
the view is 100% concerned with jsx generation only. Like this:

```javascript
const Clock = reframe.view('Clock', function() {
    return <div class="example-clock" style={color: this.derefSub(['time-color'])}>
        { this.derefSub(['time-str']) }
    </div>
})
```

Which, in turn, means we must write this `time-str` subscription handler:
```javascript
regSub(
    'time-str',
    () => reframe.subscribe(['time']),
    (t) => t.toTimeString().split(" ")[0]
)
```

Much better. 

You'll notice this new subscription handler belongs to the "Level 3" 
layer of the reactive flow.  See the [Infographic](SubscriptionInfographic.md).

### Another Technique

Above, I suggested this:
```javascript
const Clock = reframe.view('Clock', function() {
    return <div class="example-clock" style={color: this.derefSub(['time-color'])}>
        { this.derefSub(['time-str']) }
    </div>
})
```
<!--
But that may offend your aesthetics. Too much noise with those `@`? 

To clean this up, we can define a new `listen` function: 
```clj
(defn listen 
  [query-v]
  @(rf/subscribe query-v))
```

And then rewrite: 
```clj
(defn clock
  []
  [:div.example-clock
   {:style {:color (listen [:time-color])}}
   (listen [:time-str])])
```
So, at the cost of writing your own function, `listen`, the code is now less noisy 
AND there's less chance of us forgetting an `@` (which can lead to odd problems).
-->
### Say It Again
So, if, in code review, you saw this view function:
```javascript

const ShowItems = reframe.view('ShowItems', function() {
    const items = this.derefSub(['items']).sort()
    return <div>{ items.map(item => ItemView(item)).toJS() }</div>
});
```
What would you (supportively) object to?

That `sort`, right?  Computation in the view. Instead, we want the right data 
delivered to the view - its job is to simply make `jsx`. 

The solution is to create a subscription that delivers items already sorted. 
```javascript
regSub(
    'sorted-items',
    () => subscribe([':items']),
    (items) => items.sort()
)
```

Now, in this case the computation is a bit trivial, but the moment it is
a little tricky, you'll want to test it.  So separating it out from the 
view will make that easier. 

To make it testable, you may structure like this:
```javascript
function itemSorter(items, _) {
    return items.sort();
}

regSub(
    'sorted-items',
    () => subscribe(['items']),
    itemSorter
)
```

Now it is easy to test `itemSorter` independently.  

### And There's Another Benefit

re-frame de-duplicates signal graph nodes.  

If, for example, two views wanted to `subscribe(['sorted-items'])` only the one node 
(in the signal graph) would be created.  Only one node would be doing that 
potentially expensive sorting operation (when items changed) and values from 
it would be flowing through to both views.

That sort of efficiency can't happen if this views themselves are doing the `sort`. 

 
### de-duplication

As I described above, two, or more, concurrent subscriptions for the same query will source 
reactive updates from the one executing handler - from the one node in the signal graph.

<!--
How do we know if two subscriptions are "the same"?  Answer: two subscriptions
are the same if their query vectors test `=` to each other.
-->
How do we know if two subscriptions are "the same"?  Answer: two subscriptions
are the same if their stringified query vectors test `=` to each other.

So, these two subscriptions are *not* "the same":  `[:some-event 42]`  `[:some-event "blah"]`. Even
though they involve the same event id, `:some-event`, the query vectors do not test `=`.

This feature shakes out nicely because re-frame has a data oriented design. 

### A Final FAQ

The following issue comes up a bit.

You will end up with a bunch of level 1 `reg-sub` which
look the same (they directly extract a path within `appDb`):
```javascript
regSub(
    'a',
    (db) => db.get('a')
);
```

```javascript
regSub(
    'b',
    (db) => db.getIn(['top', 'b'])
)
```
 
Now, you think and design abstractly for a living, and that repetition will feel uncomfortable. It will
call to you like a Siren: "refaaaaactoooor meeeee". "Maaaake it DRYYYY".
So here's my tip:  tie yourself to the mast and sail on. That repetition is good. It is serving a purpose.
Just sail on.

The WORST thing you can do is to flex your magnificent abstraction muscles 
and create something like this:
```javascript
regSub(
    'extract-any-path',
    (db, path) => 
        db.getIn(path)
)
```

"Genius!", you think to yourself.  "Now I only need one direct `reg-sub` and I supply a path to it. 
A read-only cursor of sorts.  Look at the code I can delete."
 
Neat and minimal it most certainly is, yes, but genius it isn't. You are now asking the 
code USING the subscription to provide the path.  You have traded some innocuous 
repetition for longer term fragility, and that's not a good trade.

What fragility? Well, the view which subscribes using, say, `subscribe(['extract-any-path', [:a]])` 
now "knows" about (depends on) the structure within `appDb`.

What happens when you inevitably restructure `appDb` and put that `:a` path under
another high level branch of `appDb`?  You will have to run around all the views,
looking for the paths supplied, knowing which to alter and which to leave alone. 
Fragile. 

We want our views to declaratively ask for data, but they should have 
no idea where it comes from. It is the job of a subscription to know where data comes from. 

Remember our rule at the top:  **keep views as simple as possible**. 
Don't give them knowledge or tasks outside their remit.


*** 

Previous:  [Infographic](SubscriptionInfographic.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Up:        [Index](README.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Next:      [Flow Mechanics](SubscriptionFlow.md) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->
