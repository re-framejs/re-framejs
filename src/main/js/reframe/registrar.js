import * as Immutable from 'immutable';

let kindIdHandlerMap = Immutable.Map();

export function getHandler(kind, id=undefined, required=false) {
    if (typeof id !== 'undefined') {
        const handler = kindIdHandlerMap.getIn([kind, id]);
        if (required && !handler) {
            console.error('re-frame: no',  kind, 'handler registered for:', id);
        }
        return handler;
    }
    return kindIdHandlerMap.get(kind, Immutable.Map());
}

export function registerHandler(kind, id, handlerFn) {
    kindIdHandlerMap = kindIdHandlerMap.setIn([kind, id], handlerFn);
    return handlerFn;
}

export function clearHandlers(kind=undefined, id=undefined) {
    if (typeof kind !== 'undefined' && typeof id !== 'undefined') {
        kindIdHandlerMap = kindIdHandlerMap.deleteIn([kind, id]);
    } else if (kind !== 'undefined') {
        kindIdHandlerMap = kindIdHandlerMap.delete(kind);
    } else {
        kindIdHandlerMap = Immutable.Map();
    }
}
