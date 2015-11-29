import * as Rx from 'rx-dom';
import {Dispatcher} from 'reframe/dispatcher.js';
import {Index} from 'reframe/subindex.js';

export const animationFrame$ = new Rx.Subject();
export const sync$ = new Rx.Subject();
const requestRender$ = new Rx.BehaviorSubject();
export const render$ = new Rx.Subject();

Rx.Observable
    .merge(
        animationFrame$
        .throttleLatest(1/60, Rx.Scheduler.requestAnimationFrame),
        //.observeOn(Rx.Scheduler.requestAnimationFrame),
        sync$
    )
    .scan(([oldVersion, oldDb], [newVersion, newDb])=> {
        if (newVersion > oldVersion) {
            return [newVersion, newDb];
        }
        return [oldVersion, oldDb]
    }, [-1, null])
    .map(([version, db]) => db)
    .distinctUntilChanged(x => x, (x, y) => x === y)
    .doOnNext(db => {
        requestRender$.onNext(db);
        render$.onNext(true);
    })
    .subscribe();

const subDispatcher = new Dispatcher();
export function registerSub(name, handler) {
    subDispatcher.register(name, handler);
}

export function subscribe(cmd) {
    const handler = subDispatcher.lookup(cmd[0]);
    return handler(requestRender$, cmd);
}

let index = new Index(()=>requestRender$);
export function indexPath(path, def) {
    return index.sub(path, def);
}