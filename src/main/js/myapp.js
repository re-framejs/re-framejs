'use strict';
import * as reframe from 'reframe/core.js';
import * as Rx from 'rx-dom';
import {render}  from 'react-dom';
import * as React from 'react';
import * as Immutable from 'immutable';
window.Immutable = Immutable;

reframe.registerHandler(
    'myhandler',
    (db, [_, param]) => db.set('param', param)
);
reframe.registerSub(
    'value',
    (rx) => reframe.indexPath(['param'])
);

module.hot.accept();

//reframe.db$.subscribe(db => console.log('db: ', db && db.toJS()));
//reframe.subscribe(['value'])
//    .subscribe(value => console.log('value$: ', value));
//
window.Rx = Rx;
window.db$ = reframe.db$;

const MyView = reframe.viewSV('MyView', function () {
    const value = this.derefSub(['value']);
    console.log('value', value);
    return React.DOM.div(null, 'it works', ' value: ', value);
});
render(MyView(), document.getElementById('app'));

reframe.dispatch(['myhandler', '1']);
reframe.dispatch(['myhandler', '2']);
reframe.dispatch(['myhandler', '3']);
reframe.dispatchSync(['myhandler', '4']);

window.change = function(v) {
    reframe.dispatchSync(['myhandler', v]);
};