import * as Immutable from 'immutable';
import {makeRatom} from 'reframe/ratom';

export const appDb = makeRatom(Immutable.Map());