import * as reframe from 'reframe/core';
import * as Immutable from 'immutable';
import {render} from 'react-dom';
import {DOM} from 'react';
import {index} from 'reframe/subindex';

window.index = index;
let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function random(limit) {
    return Math.floor(Math.random() * limit);
}
function randomLetter() {
    return letters.charAt(random(letters.length));
}

let layout = [];
let size = 100;

for (let y = 0; y < size; y++) {
    layout[y] = [];
    for (let x = 0; x < size; x++) {
        layout[y][x] = {
            letter: randomLetter(),
            active: false
        };
    }
}
reframe.registerHandler('initDb', db => Immutable.fromJS({layout: layout}));
reframe.registerHandler('update', (db, [evtId, y, x]) => db.updateIn(['layout', y, x, 'active'], active => !active));

//reframe.registerSub('row', (rx, [rvtId, y]) => rx.map(db=>db.getIn(['layout', y], Immutable.List())));
//reframe.registerSub('cell', (rx, [evtId, y, x]) => {
//        return rx.map(db => db.getIn(['layout', y, x], Immutable.Map()));
//    }
//);
reframe.registerSub('cell', (rx, [evtId, y, x]) => reframe.indexPath(['layout', y, x]));

reframe.dispatchSync(['initDb']);

let rowCount = size,
    colCount = rowCount;
let Cell = reframe.viewSV('Cell', function (y, x) {
    let cell = this.derefSub(['cell', y, x]);
    //let cell = this.deref(this.props.row, r => r.get(this.props.x, Immutable.Map()));
    return DOM.td(
        {className: cell.get('active') ? 'active' : 'inactive'},
        cell.get('letter')
    );
});

let Row = reframe.viewP('Row', {
    getInitialState: function () {
        return {};
    },
    render: function () {
        let row = [];
        for (let x = 0; x < colCount; x++) {
            row.push(Cell(this.props.y, x));
        }
        return DOM.tr.apply(null, [null].concat(row));
    }
});

let TableView = reframe.viewP('Table', function () {

    let rows = [];
    for (let y = 0; y < rowCount; y++) {
        rows.push(Row({y: y}));
    }

    return DOM.table(null, DOM.tbody.apply(null, [null].concat(rows)));
});

render(TableView(), document.getElementById('app'));




window.updateRandom = function () {
    let x = random(size) + '';
    let y = random(size) + '';

    reframe.dispatch(['update', y, x]);
};

let start = performance.now(),
    count = 0,
    batchSize = 1;

/* eslint-disable no-console */
//let a = [];
function update(ms) {
    for (let i = 0; i < batchSize; i++) {
        window.updateRandom();
    }
    // setTimeout(update, ms);
    let end = performance.now();

    if (end - start > 2000) {
        console.log(count / ((end - start) / 1000), (end - start), count);
        start = performance.now();
        count = 0;
    }
    count += batchSize;
}
/* eslint-enable no-console */


window.start = function () {
    // update(0, 1);
    setInterval(update, 0);
};

//let o = Rx.Observable
//    .fromArray([1,2,3])
//    .observeOn(Rx.Scheduler.default)
//    .doOnNext(i => console.log(i))
//    .subscribe();
//console.log('after');

//let o = Rx.Observable
//    .fromArray([1,2,3])
//    .doOnNext(v => {
//        console.log('1:', v);
//    });
//
//let x = new Rx.ReplaySubject();
//o.subscribe(x);
//
//x.subscribe(v => {
//    console.log('2:', v);
//});
//x.subscribe(v => {
//    console.log('3:', v);
//});
