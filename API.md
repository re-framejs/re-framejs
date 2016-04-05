
# re-framejs functions overview

This document gives an overview of the re-framejs API. It is **not yet complete**.

### SubscriptionMixin

A functionality (methods) of this class is merged with the React Component class providing wrappers to connect the component with the rest
if re-framejs.

### Dispatcher

Simple class where you can register (save) and lookup handlers according to their handeler_id.

## API

```sh
reframe.deref(rx, transform)
```
Retrieve the last value from the rx stream. Optionally you can supply a transform function which is applied to this value.

```sh
reframe.atom(value)
```
Initialise the top-level state in reframe

```sh
reframe.reset(atom, newValue)
```
Replace the top-level value in atom with newValue

```sh
SubscriptionMixin.derefSub([handeler_id, optional_args], transform)
```

Connects the calling React component to the Rx stream identified by the handler_id. Each time this stream receives a new value the React component is
forceUpdated. The method returns the new value from the stream and (optionally) you can transform this newly arrived value before being accessd by the React component
with the 'transform' function (second argument of *derefSub*).

```sh
reframe.subscribe([handeler_id, optional_args]) 
```

Subscribe executed the handler identified by the handeler_id and returns the resulting Rx.Observable which is produced by the handler

```sh
reframe.registerSub(handeler_id, (state, [handler_id, optional_args]) => {... Rx.Observable})
```
Register a state handler (where state is being processed). The first argument of the handler function is the current state, the second
argument is a vector with handeler_id and optional arguments (the same vector which is provided in the 'reframe.subscribe' method) and 
it must return a Rx.Observable.

```sh
reframe.registerHandler(handeler_id, middleware, [handler_id, optional_args] => any_value)
```

Register a handler for dispatching actions. The handler can change the global state and by this trigger a re-render. The handler can return 
anything (even unit) and usually causes side-effects like changing state. 

```sh
reframe.dispatch([handeler_id, optional_args])
```
Does the same as *reframe.subscribe*, it hands over its vector to the corresponding handler (identified by handler_id) and executes it asynchronously.
```sh
reframe.dispatchSync([handeler_id, optional_args])
```
The same as *reframe.dispatch* but synchronous.

```sh
reframe.viewSV('component display name', [mixins], () | x .. => React.DOM | {React Object} ) -> () | x .. => React.DOM | {React Object}
```
A function for creating a React component. The first argument is for informative purposes only. The second argument is a list
of mixins which will be added to the React component. The third argument can be either:

- a render function of a React Component taking any number of custom arguments and returning a React.DOM instance.
- an object defining React functions.

The call returns a function taking the same parameters as the ones provided in the third argument if you passed a render function with custom arguments.
These arguments are also passed to the React component and are accesible as *this.props.argv* from within the component.

```sh
reframe.viewV('component display name', [mixins], () | x .. => React.DOM | {React Object} ) -> () | x .. => React.DOM | {React Object}
```

The same as *reframe.viewSV* but without the ability to make a custom update of the React component (the component will only be updated through the parent React component)

```sh
reframe.viewSP('component display name', [mixins], {x, y ...} => React.DOM | {React Object} ) -> {x, y ...} => React.DOM | {React Object}
```

A function for creating a React component. The first argument is for informative purposes only. The second argument is a list
of mixins which will be added to the React component. The third argument can be either:

- a render function of a React Component taking a map with arguments and returning a React.DOM instance.
- an object defining React functions.

The call returns a function taking the same map as provided in the third argument if you passed a render function. The map argument is also
passed to the React component and is accesible as *this.props* from within the component.

```sh
reframe.viewP('component display name', [mixins], {x, y ...} => React.DOM | {React Object} ) -> {x, y ...} => React.DOM | {React Object}
```

The same as *reframe.viewSP* but without the ability to make a custom update of the React component (the component will only be updated through the parent React component)

```sh
reframe.view('component display name', [mixins], () | x .. => React.DOM | {React Object} ) -> () | x .. => React.DOM | {React Object}
```

Internally calls *reframe.viewSV*.

```sh
reframe.indexPath([node1, node2, ...], defaultValue) -> Rx.Observable 
```

Returns a Rx.Observable bound to the value on the path in the *reframe.atom* state. If path is not found the defaultValue is returned.














