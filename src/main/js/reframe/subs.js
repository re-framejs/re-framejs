import * as Rx from 'rx';
import {Dispatcher} from 'reframe/dispatcher.js';
import {Index} from 'reframe/subindex.js';

export const animationFrame$ = new Rx.BehaviorSubject();
const animationFrame$1 = new Rx.Subject();
export const sync$ = new Rx.Subject();
const requestRender$ = new Rx.BehaviorSubject();
export const render$ = new Rx.Subject();

var scheduled = false;
animationFrame$
    .filter(Boolean)
    .doOnNext(v => {
    if (!scheduled) {
        requestAnimationFrame(function onRequestAnimationFrame() {
            animationFrame$1.onNext(animationFrame$.getValue());
            scheduled = false;
        });
        scheduled = true;
    }
}).subscribe();

Rx.Observable
    .merge(animationFrame$1, sync$)
    .scan(function dbAnimationFrameTransition([oldVersion, oldDb], [newVersion, newDb]) {
        if (newVersion > oldVersion) {
            return [newVersion, newDb];
        }
        return [oldVersion, oldDb]
    }, [-1, null])
    .map(([version, db]) => db)
    .distinctUntilChanged(x => x, (x, y) => x === y)
    .doOnNext(function fireRender(db) {
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
    if (!handler) {
        throw new Error('Subscription handler for "' + cmd[0] + '" not found');
    }
    return handler(requestRender$, cmd);
}

let index = new Index(()=>requestRender$);
export function indexPath(path, def) {
    return index.sub(path, def);
}