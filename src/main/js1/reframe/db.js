import * as Immutable from 'immutable';
import {Ratom} from 'reframe/ratom';

export const appDb = new Ratom(Immutable.Map());