import * as Immutable from 'immutable';
import {makeAtom} from 'reframe/ratom';

export const appDb = makeAtom(Immutable.Map());