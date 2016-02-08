import * as Rx from 'rx';
import * as Immutable from 'immutable';
export const db$ = new Rx.BehaviorSubject(Immutable.Map());
