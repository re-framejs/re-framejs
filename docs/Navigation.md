<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table Of Contents

- [What About Navigation?](#what-about-navigation)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## What About Navigation?

How do I switch between different panels of a larger app?

Your `appDb` could have an `active-panel` key containing an id for the panel being displayed.


When the user does something navigation-ish (selects a tab, a dropdown or something which changes the active panel), then the associated event and dispatch look like this:

```javascript
reframe.regEventDb(
    'set-active-panel',
    (db, [_, value]) => db.set('active-panel', value)
)

reframe.dispatch(['set-active-panel', 'panel1'])
```

A high level react view has a subscription to active-panel and will switch to the associated panel.

```javascript
reframe.regSub(
    'active-panel',
    (db, _) => db.get('active-panel')
)

const Panel1 = reframe.view('Panel1', function() {
    return <div onClick={() => reframe.dispatch(['set-active-panel', 'panel2'])}>Here</div>
})

const Panel2 = reframe.view('Panel2', function() {
    return <div>There</div>
})

const HighLevelView = reframe.view('HighLevelView', function() {
    const active = this.derefSub(['active-panel']);
    let panel = <div/>;
    if (active === 'panel1') {
        panel = Panel1();
    } else if (active === 'panel2') {
        panel = Panel2();
    }
    return <div>
        <div class="title">Heading</div>
        {panel}
    </div>
})
```

Continue to [Namespaced Keywords](Namespaced-Keywords.md) to reduce clashes on ids.

***

Previous:  [Basic App Structure](Basic-App-Structure.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Up:  [Index](README.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Next:  [Namespaced Keywords](Namespaced-Keywords.md)
