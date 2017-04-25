import * as Immutable from 'immutable';
import {makeRatom} from 'reframe/ratom';

// -- Application State  --------------------------------------------------------------------------
//
// Should not be accessed directly by application code.
// Read access goes through subscriptions.
// Updates via event handlers.
export const appDb = makeRatom(Immutable.Map());