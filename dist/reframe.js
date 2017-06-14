(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("immutable"), require("rx"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define("reframe", ["immutable", "rx", "react"], factory);
	else if(typeof exports === 'object')
		exports["reframe"] = factory(require("immutable"), require("rx"), require("react"));
	else
		root["reframe"] = factory(root["Immutable"], root["Rx"], root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_15__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.markFlushDom = exports.pause$ = exports.flush = exports.render = exports.uix = exports.ui = exports.view = exports.viewSV = exports.viewSP = exports.viewV = exports.viewP = exports.injectCofx = exports.regCofx = exports.regFx = exports.clearSubscriptionCache = exports.subscribe = exports.regSub = exports.onChanges = exports.after = exports.trimv = exports.enrich = exports.path = exports.debug = exports.when = exports.assocCoeffect = exports.assocEffect = exports.getEffect = exports.getCoeffect = exports.enqueue = exports.toInterceptor = exports.dispatchSync = exports.dispatch = exports.db$ = exports.appDb = undefined;
	exports.toggleDebug = toggleDebug;
	exports.toggleReactDebug = toggleReactDebug;
	exports.isDebug = isDebug;
	exports.atom = atom;
	exports.reaction = reaction;
	exports.cursor = cursor;
	exports.regSubRaw = regSubRaw;
	exports.clearSub = clearSub;
	exports.clearFx = clearFx;
	exports.clearCofx = clearCofx;
	exports.clearEvent = clearEvent;
	exports.regEventDb = regEventDb;
	exports.regEventFx = regEventFx;
	exports.regEventCtx = regEventCtx;
	exports.indexPath = indexPath;
	exports.registerSub = registerSub;
	exports.registerHandler = registerHandler;
	exports.compMiddleware = compMiddleware;
	exports.swap = swap;
	exports.reset = reset;
	exports.togglePause = togglePause;
	exports.deref = deref;
	
	var _cofx = __webpack_require__(1);
	
	var cofx = _interopRequireWildcard(_cofx);
	
	var _db = __webpack_require__(5);
	
	var db = _interopRequireWildcard(_db);
	
	var _events = __webpack_require__(8);
	
	var events = _interopRequireWildcard(_events);
	
	var _fx = __webpack_require__(9);
	
	var fx = _interopRequireWildcard(_fx);
	
	var _interceptor = __webpack_require__(4);
	
	var interceptor = _interopRequireWildcard(_interceptor);
	
	var _interop = __webpack_require__(11);
	
	var interop = _interopRequireWildcard(_interop);
	
	var _ratom = __webpack_require__(6);
	
	var _react = __webpack_require__(14);
	
	var react = _interopRequireWildcard(_react);
	
	var _registrar = __webpack_require__(2);
	
	var registrar = _interopRequireWildcard(_registrar);
	
	var _router = __webpack_require__(10);
	
	var router = _interopRequireWildcard(_router);
	
	var _stdinterceptors = __webpack_require__(26);
	
	var stdinterceptors = _interopRequireWildcard(_stdinterceptors);
	
	var _subs = __webpack_require__(13);
	
	var subs = _interopRequireWildcard(_subs);
	
	var _batching = __webpack_require__(12);
	
	var batching = _interopRequireWildcard(_batching);
	
	var _rx = __webpack_require__(7);
	
	var Rx = _interopRequireWildcard(_rx);
	
	var _subindex = __webpack_require__(31);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	// import * as _form from 'reframe/form/core';
	//
	// export const form = _form;
	function toggleDebug() {
	    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	
	    interop.toggleLog('debug', value);
	}
	
	function toggleReactDebug() {
	    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	
	    interop.toggleLog('traceReact', value);
	}
	
	function isDebug() {
	    return interop.isDebug();
	}
	
	/**
	 * Atom provides a way to manage shared, synchronous, independent state. Atom holds
	 * value which can be dereferenced (deref), changed (reset), updated (swap).
	 *
	 */
	function atom(value) {
	    return (0, _ratom.makeRatom)(value);
	}
	
	/**
	 * Reaction is functional transformation of the observable object (Atom, Reaction, Cursor).
	 *
	 * Reaction can be deref-ed.
	 */
	function reaction(f) {
	    return (0, _ratom.makeReaction)(f);
	}
	
	/**
	 * Cursor is reaction with "map" function transforming observable object.
	 */
	function cursor(atom, path) {
	    return (0, _ratom.makeCursor)(atom, path);
	}
	
	/**
	 * Re-frame state.
	 */
	var appDb = exports.appDb = db.appDb;
	/**
	 * RX stream for appDb changes.
	 */
	var db$ = exports.db$ = db.appDb.subject();
	/**
	 * Queue the given event for processing by the registered event handler.
	 * Just to be clear: the event handler is not run immediately - it is not run
	 * synchronously. It will likely be run 'very soon', although it may be
	 * added to the end of a FIFO queue which already contain events.
	 * Usage:
	 *  dispatch(['delete-item', 42])
	 */
	var dispatch = exports.dispatch = router.dispatch;
	/**
	 * Sychronously (immediately!) process the given event using the registered handler.
	 * Generally, you shouldn't use this - you should use `dispatch` instead.  It
	 * is an error to use `dispatch-sync` within an event handler.
	 * Usage:
	 *  dispatchSync(['delete-item', 42])
	 */
	var dispatchSync = exports.dispatchSync = router.dispatchSync;
	
	/**
	 * Transform ordinary js map to interceptor. Map can contain entries for:
	 *  - id
	 *  - before(ctx)
	 *  - update(ctx)
	 */
	var toInterceptor = exports.toInterceptor = interceptor.toInterceptor;
	/**
	 * Queue interceptor into processing. Should be called within interceptor.
	 */
	var enqueue = exports.enqueue = interceptor.enqueue;
	/**
	 * Helper function for obtaining coeffect from interceptor context.
	 */
	var getCoeffect = exports.getCoeffect = interceptor.getCoeffect;
	/**
	 * Helper function for obtaining effect from interceptor context.
	 */
	var getEffect = exports.getEffect = interceptor.getEffect;
	/**
	 * Helper function for setting effect to interceptor context.
	 */
	var assocEffect = exports.assocEffect = interceptor.assocEffect;
	/**
	 * Helper function for setting coeffect to interceptor context.
	 */
	var assocCoeffect = exports.assocCoeffect = interceptor.assocCoeffect;
	
	/**
	 * Conditional interceptor:
	 *
	 * Usage when(() => window.debug, reframe.debug)
	 */
	var when = exports.when = stdinterceptors.when;
	/**
	 * Debug log for commands and appDb diffs.
	 */
	var debug = exports.debug = stdinterceptors.debug;
	/**
	 * An interceptor factory which supplies a sub-path of `appDb` to the handler.
	 * It's action is somewhat analogous to `updateIn`. It grafts the return
	 * value from the handler back into db.
	 * Usage:
	 * path(['some', 'path'])
	 */
	var path = exports.path = stdinterceptors.path;
	/**
	 * Interceptor factory which runs the given function `f` in the `after handler`
	 * position.  `f` is called with two arguments: `db` and `v`, and is expected to
	 * return a modified `db`.
	 * Unlike the `after` inteceptor which is only about side effects, `enrich`
	 * expects `f` to process and alter the given `db` coeffect in some useful way,
	 * contributing to the derived data, flowing vibe.
	 * Example Use:
	 * ------------
	 * Imagine that todomvc needed to do duplicate detection - if any two todos had
	 * the same text, then highlight their background, and report them in a warning
	 * down the bottom of the panel.
	 * Almost any user action (edit text, add new todo, remove a todo) requires a
	 * complete reassesment of duplication errors and warnings. Eg: that edit
	 * just made might have introduced a new duplicate, or removed one. Same with
	 * any todo removal. So we need to re-calculate warnings after any CRUD events
	 * associated with the todos list.
	 * Unless we are careful, we might end up coding subtly different checks
	 * for each kind of CRUD operation.  The duplicates check made after
	 * 'delete todo' event might be subtly different to that done after an
	 * eddting operation. Nice and efficient, but fiddly. A bug generator
	 * approach.
	 * So, instead, we create an `f` which recalcualtes warnings from scratch
	 * every time there is ANY change. It will inspect all the todos, and
	 * reset ALL FLAGS every time (overwriting what was there previously)
	 * and fully recalculate the list of duplicates (displayed at the bottom?).
	 * By applying `f` in an `:enrich` interceptor, after every CRUD event,
	 * we keep the handlers simple and yet we ensure this important step
	 * (of getting warnings right) is not missed on any change.
	 * We can test `f` easily - it is a pure fucntions - independently of
	 * any CRUD operation.
	 * This brings huge simplicity at the expense of some re-computation
	 * each time. This may be a very satisfactory tradeoff in many cases.
	 */
	var enrich = exports.enrich = stdinterceptors.enrich;
	/**
	 * Remove command name from command.
	 *
	 * ['cmd-name', param1, param2] -> [param1, param2]
	 */
	var trimv = exports.trimv = stdinterceptors.trimv;
	/**
	 * Interceptor factory which runs a given function `f` in the \"after\"
	 * position, presumably for side effects.
	 * `f` is called with two arguments: the `effects` value of `:db`
	 * (or the `coeffect` value of db if no db effect is returned) and the event.
	 * Its return value is ignored so `f` can only side-effect.
	 * Example use:
	 * - `f` runs schema validation (reporting any errors found)
	 * - `f` writes some aspect of db to localstorage.
	 *
	 */
	var after = exports.after = stdinterceptors.after;
	/**
	 * Interceptor factory which acts a bit like `reaction`  (but it flows into `db`, rather than out)
	 * It observes N paths in `db` and if any of them test not === to their previous value
	 * (as a result of a handler being run) then it runs `f` to compute a new value, which is
	 * then assoced into the given `out-path` within `db`.
	 * Usage:
	 * function myF(aVal, bVal) {
	 *   ... some computation on a and b in here)
	 * }
	 * onChanges(myf, ['c'], ['a'], ['b'])
	 * Put this Interceptor on the right handlers (ones which might change 'a' or 'b').
	 * It will:
	 * - call `f` each time the value at path ['a'] or ['b'] changes
	 * - call `f` with the values extracted from ['a'] ['b']
	 * - assoc the return value from `f` into the path  ['c']
	 */
	var onChanges = exports.onChanges = stdinterceptors.onChanges;
	
	/**
	 * Associate a given `query id` with a given subscription handler function `handler-fn`
	 * which is expected to take two arguments: app-db and query vector, and return
	 * a `reaction`.
	 * This is a low level, advanced function.  You should probably be using reg-sub
	 * instead.
	 */
	function regSubRaw(queryId, handlerFn) {
	    return registrar.registerHandler(subs.kind, queryId, queryId, handlerFn);
	}
	
	/**
	 * Associate the given `query id` with a handler function and an optional signal function.
	 *
	 * There's 2 ways this function can be called
	 *
	 * 1. regSub('test-sub', (db, [_]) => db)
	 * The value in app-db is passed to the computation function as the 1st argument.
	 *
	 * 2. regSub('a-b-sub',
	 * (q-vec, d-vec) => [subscribe(['a-sub']), subscribe(['b-sub'])],
	 * ([a, b], q-vec) => {a: a, b: b})
	 *
	 * Two functions provided. The 2nd is computation function, as before. The 1st
	 * is returns what `input signals` should be provided to the computation. The
	 * `input signals` function is called with two arguments: the query vector
	 * and the dynamic vector. The return value can be singleton reaction or
	 * a sequence of reactions.
	 *
	 */
	var regSub = exports.regSub = subs.regSub;
	var subscribe = exports.subscribe = subs.subscribe;
	
	function clearSub(id) {
	    registrar.clearHandlers(subs.kind, id);
	}
	var clearSubscriptionCache = exports.clearSubscriptionCache = subs.clearSubscriptionCache;
	
	// effects
	var regFx = exports.regFx = fx.register;
	function clearFx(id) {
	    registrar.clearHandlers(fx.kind, id);
	}
	
	// coeffects
	var regCofx = exports.regCofx = cofx.register;
	/**
	 *   Returns an interceptor which adds to a `context's` `:coeffects`.
	 * `coeffects` are the input resources required by an event handler
	 * to perform its job. The two most obvious ones are `db` and `event`.
	 * But sometimes a handler might need other resources.
	 * Perhaps a handler needs a random number or a GUID or the current datetime.
	 * Perhaps it needs access to the connection to a DataScript database.
	 * If the handler directly access these resources, it stops being as
	 * pure. It immedaitely becomes harder to test, etc.
	 * So the necessary resources are \"injected\" into the `coeffect` (map)
	 * given the handler.
	 * Given an `id`, and an optional value, lookup the registered coeffect
	 * handler (previously registered via `reg-cofx`) and it with two arguments:
	 * the current value of `:coeffects` and, optionally, the value. The registered handler
	 * is expected to return a modified coeffect.
	 */
	var injectCofx = exports.injectCofx = cofx.injectCofx;
	function clearCofx(id) {
	    registrar.clearHandlers(cofx.kind, id);
	}
	
	// Events
	function clearEvent(id) {
	    registrar.clearHandlers(events.kind, id);
	}
	
	/**
	 * Register the given `id`, typically a keyword, with the combination of
	 * `db-handler` and an interceptor chain.
	 * `db-handler` is a function: (db event) -> db
	 * `interceptors` is a collection of interceptors, possibly nested (needs flattening).
	 * `db-handler` is wrapped in an interceptor and added to the end of the chain, so in the end
	 * there is only a chain.
	 * The necessary effects and coeffects handler are added to the front of the
	 * interceptor chain.  These interceptors ensure that app-db is available and updated.
	 */
	function regEventDb(id, interceptors, dbHandler) {
	    if (typeof dbHandler === 'undefined') {
	        dbHandler = interceptors;
	        interceptors = null;
	    }
	    return events.register(id, [cofx.injectDb, fx.doFx, interceptors, stdinterceptors.dbHandlerToInterceptor(dbHandler)]);
	}
	
	function regEventFx(id, interceptors, fxHandler) {
	    if (typeof fxHandler === 'undefined') {
	        fxHandler = interceptors;
	        interceptors = null;
	    }
	    return events.register(id, [cofx.injectDb, fx.doFx, interceptors, stdinterceptors.fxHandlerToInterceptor(fxHandler)]);
	}
	
	function regEventCtx(id, interceptors, ctxHandler) {
	    if (typeof ctxHandler === 'undefined') {
	        ctxHandler = interceptors;
	        interceptors = null;
	    }
	    return events.register(id, [cofx.injectDb, fx.doFx, interceptors, stdinterceptors.ctxHandlerToInterceptor(ctxHandler)]);
	}
	
	// react
	var viewP = exports.viewP = react.viewP;
	var viewV = exports.viewV = react.viewV;
	var viewSP = exports.viewSP = react.viewSP;
	var viewSV = exports.viewSV = react.viewSV;
	var view = exports.view = react.viewSV;
	/**
	 * Create react view suitable for use with reframe.
	 *
	 * Usage:
	 *
	 * const MyView = reframe.ui('MyView', function renderMyView(props) {
	 * });
	 *
	 * const MyView = reframe.ui('MyView', [mixins], function renderMyView(props) {
	 * });
	 *
	 * const MyView = reframe.ui('MyView', [mixins], {
	 *  componentWillUpdate(nextProps, nextState) {
	 *  },
	 *  render(props) {
	 *  }
	 * });
	 */
	var ui = exports.ui = react.ui;
	var uix = exports.uix = react.uix;
	var render = exports.render = batching.flush;
	var flush = exports.flush = batching.flush;
	
	// deprecated
	
	var index = new _subindex.Index(function () {
	    return subs.requestAnimationFrame$;
	});
	function indexPath(path, def) {
	    return index.sub(path, def);
	}
	
	function registerSub(name, handler) {
	    return subs.registerSub(name, handler);
	}
	
	function registerHandler(id, interceptors, handler) {
	    return regEventDb(id, interceptors, handler);
	}
	
	function compMiddleware(interceptors) {
	    return interceptors;
	}
	
	function swap(atom, f) {
	    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	        args[_key - 2] = arguments[_key];
	    }
	
	    return atom.swap.apply(atom, [f].concat(args));
	}
	
	function reset(atom, value) {
	    return atom.reset(value);
	}
	
	module.exports.default = module.exports;
	
	var pause$ = exports.pause$ = new Rx.Subject();
	
	function togglePause(pause) {
	    if (pause) {
	        router.pause();
	    } else {
	        router.resume();
	    }
	}
	pause$.subscribe(function (pause) {
	    return togglePause(pause);
	});
	
	var markFlushDom = exports.markFlushDom = router.markFlushDom;
	
	function deref(observable) {
	    return observable.deref();
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.injectDb = undefined;
	exports.register = register;
	exports.injectCofx = injectCofx;
	
	var _registrar = __webpack_require__(2);
	
	var _interceptor = __webpack_require__(4);
	
	var _db = __webpack_require__(5);
	
	var kind = 'cofx';
	
	function register(id, handlerFn) {
	    return (0, _registrar.registerHandler)(kind, id, handlerFn);
	}
	
	/**
	 *   Returns an interceptor which adds to a `context's` `:coeffects`.
	 * `coeffects` are the input resources required by an event handler
	 * to perform its job. The two most obvious ones are `db` and `event`.
	 * But sometimes a handler might need other resources.
	 * Perhaps a handler needs a random number or a GUID or the current datetime.
	 * Perhaps it needs access to the connection to a DataScript database.
	 * If the handler directly access these resources, it stops being as
	 * pure. It immedaitely becomes harder to test, etc.
	 * So the necessary resources are \"injected\" into the `coeffect` (map)
	 * given the handler.
	 * Given an `id`, and an optional value, lookup the registered coeffect
	 * handler (previously registered via `reg-cofx`) and it with two arguments:
	 * the current value of `:coeffects` and, optionally, the value. The registered handler
	 * is expected to return a modified coeffect.
	 * @param id
	 * @param value
	 * @returns {*}
	 */
	function injectCofx(id) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	    }
	
	    var handler = (0, _registrar.getHandler)(kind, id);
	    return (0, _interceptor.toInterceptor)({
	        id: 'coeffects',
	        before: function coeffectsBefore(ctx) {
	            return ctx.update('coeffects', function (old) {
	                return handler.apply(undefined, [old].concat(args));
	            });
	        }
	    });
	}
	
	register('db', function doCoeffectsHandler(coeffects) {
	    return coeffects.set('db', _db.appDb.deref());
	});
	
	var injectDb = exports.injectDb = injectCofx('db');

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getHandler = getHandler;
	exports.registerHandler = registerHandler;
	exports.clearHandlers = clearHandlers;
	
	var _immutable = __webpack_require__(3);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var kindIdHandlerMap = Immutable.Map();
	
	function getHandler(kind) {
	    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	    var required = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	    if (typeof id !== 'undefined') {
	        var handler = kindIdHandlerMap.getIn([kind, id]);
	        if (required && !handler) {
	            console.error('re-frame: no', kind, 'handler registered for:', id);
	        }
	        return handler;
	    }
	    return kindIdHandlerMap.get(kind, Immutable.Map());
	}
	
	function registerHandler(kind, id, handlerFn) {
	    kindIdHandlerMap = kindIdHandlerMap.setIn([kind, id], handlerFn);
	    return handlerFn;
	}
	
	function clearHandlers() {
	    var kind = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	
	    if (typeof kind !== 'undefined' && typeof id !== 'undefined') {
	        kindIdHandlerMap = kindIdHandlerMap.deleteIn([kind, id]);
	    } else if (kind !== 'undefined') {
	        kindIdHandlerMap = kindIdHandlerMap.delete(kind);
	    } else {
	        kindIdHandlerMap = Immutable.Map();
	    }
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.toInterceptor = toInterceptor;
	exports.getEffect = getEffect;
	exports.assocEffect = assocEffect;
	exports.getCoeffect = getCoeffect;
	exports.assocCoeffect = assocCoeffect;
	exports.enqueue = enqueue;
	exports.nextInterceptor = nextInterceptor;
	exports.execute = execute;
	
	var _immutable = __webpack_require__(3);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var mandatoryInterceptorFields = Immutable.Set(["id", "before", "after"]);
	
	function isInterceptor(m) {
	    return Immutable.isMap(m) && Immutable.is(m.keysSeq().toSet(), mandatoryInterceptorFields);
	}
	
	function toInterceptor(_ref) {
	    var id = _ref.id,
	        before = _ref.before,
	        after = _ref.after;
	
	    return Immutable.Map({
	        id: id || 'unnamed',
	        before: before,
	        after: after
	    });
	}
	
	// effect helpers
	function getEffect(ctx) {
	    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	    var notFound = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	
	    if (key) {
	        return ctx.getIn(['effects', key], notFound);
	    }
	    return ctx.get('effects');
	}
	
	function assocEffect(ctx, key, effect) {
	    return ctx.setIn(['effects', key], effect);
	}
	
	// coeffect helpers
	function getCoeffect(ctx) {
	    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	    var notFound = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	
	    if (key) {
	        return ctx.getIn(['coeffects', key], notFound);
	    }
	    return ctx.get('coeffects');
	}
	
	function assocCoeffect(ctx, key, coeffect) {
	    return ctx.setIn(['coeffects', key], coeffect);
	}
	
	function updateCoeffect(ctx, key, f) {
	    for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
	        args[_key - 3] = arguments[_key];
	    }
	
	    return ctx.updateIn(['coeffects', key], function (old) {
	        return f.apply(undefined, [old].concat(args));
	    });
	}
	
	// Execute Interceptor Chain
	
	function invokeInterceptorFn(ctx, interceptor, direction) {
	    var f = interceptor.get(direction);
	    if (f) {
	        return f(ctx);
	    }
	    return ctx;
	}
	
	function invokeInterceptors(initialCtx, direction) {
	    var ctx = initialCtx;
	    do {
	        var queue = ctx.get('queue');
	
	        if (queue.isEmpty()) {
	            return ctx;
	        } else {
	            var interceptor = queue.first(),
	                stack = ctx.get('stack', Immutable.List());
	
	            ctx = invokeInterceptorFn(ctx.set('queue', queue.shift()).set('stack', stack.unshift(interceptor)), interceptor, direction);
	        }
	    } while (ctx && !ctx.get('queue').isEmpty());
	    return ctx;
	}
	
	function enqueue(ctx, interceptors) {
	    return ctx.update('queue', Immutable.List(), function (old) {
	        return old.concat(Immutable.List(interceptors));
	    });
	}
	
	function nextInterceptor(ctx, interceptor) {
	    return ctx.update('queue', Immutable.List(), function (queue) {
	        return queue.unshift(interceptor);
	    });
	}
	
	function context(event, interceptors) {
	    var db = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
	
	    var ctx = Immutable.Map();
	    ctx = assocCoeffect(ctx, 'event', event);
	    if (typeof db !== 'undefined') {
	        ctx = assocCoeffect(ctx, 'db', db);
	    }
	    ctx = enqueue(ctx, interceptors);
	
	    return ctx;
	}
	
	function changeDirection(ctx) {
	    return enqueue(ctx.delete('queue'), ctx.get('stack'));
	}
	
	function execute(event, interceptors) {
	    var ctx = context(event, interceptors);
	    ctx = invokeInterceptors(ctx, "before");
	    ctx = changeDirection(ctx);
	    ctx = invokeInterceptors(ctx, "after");
	    return ctx;
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.appDb = undefined;
	
	var _immutable = __webpack_require__(3);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	var _ratom = __webpack_require__(6);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	// -- Application State  --------------------------------------------------------------------------
	//
	// Should not be accessed directly by application code.
	// Read access goes through subscriptions.
	// Updates via event handlers.
	var appDb = exports.appDb = (0, _ratom.makeRatom)(Immutable.Map());

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Observable = undefined;
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.runInCtx = runInCtx;
	exports.makeReaction = makeReaction;
	exports.makeAtom = makeAtom;
	exports.makeRatom = makeRatom;
	exports.makeRxReaction = makeRxReaction;
	exports.makeCursor = makeCursor;
	exports.pluck = pluck;
	exports.deref = deref;
	
	var _immutable = __webpack_require__(3);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	var _rx = __webpack_require__(7);
	
	var Rx = _interopRequireWildcard(_rx);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ratomCtx = [];
	var id = 1;
	function runInCtx(obj, f) {
	    try {
	        ratomCtx.push(obj);
	        return f();
	    } finally {
	        ratomCtx.pop();
	    }
	}
	
	function watchInCtx(obj) {
	    var observer = ratomCtx[ratomCtx.length - 1];
	    if (typeof observer !== 'undefined') {
	        obj.subscribe(observer);
	    }
	}
	
	var Observable = exports.Observable = function () {
	    function Observable(type) {
	        _classCallCheck(this, Observable);
	
	        this._type = type;
	        this._id = id++;
	        this._observers = new Set();
	        this._observables = new Set();
	        this._onDispose = new Set();
	    }
	
	    _createClass(Observable, [{
	        key: 'id',
	        value: function id() {
	            return this._type + '-' + this._id;
	        }
	    }, {
	        key: 'equals',
	        value: function equals(other) {
	            return this === other;
	        }
	    }, {
	        key: 'hashCode',
	        value: function hashCode() {
	            return this._id;
	        }
	    }, {
	        key: 'subscribe',
	        value: function subscribe(observer) {
	            if (!observer.notify) {
	                console.warn(observer, observer && observer.id && observer.id(), 'has no callback notify');
	            }
	            this._observers.add(observer);
	            if (observer.observe) {
	                observer.observe(this);
	            }
	        }
	    }, {
	        key: 'unsubscribe',
	        value: function unsubscribe(observer) {
	            this._observers.delete(observer);
	            if (observer.unobserve) {
	                observer.unobserve(this);
	            }
	            if (this._observers.size === 0) {
	                this.dispose();
	            }
	        }
	    }, {
	        key: 'observe',
	        value: function observe(observable) {
	            this._observables.add(observable);
	        }
	    }, {
	        key: 'unobserve',
	        value: function unobserve(observable) {
	            this._observables.delete(observable);
	        }
	    }, {
	        key: '_notifyObservers',
	        value: function _notifyObservers() {
	            this._observers.forEach(function (observer) {
	                observer.notify();
	            });
	        }
	    }, {
	        key: 'addOnDispose',
	        value: function addOnDispose(f) {
	            this._onDispose.add(f);
	        }
	    }, {
	        key: 'dispose',
	        value: function dispose() {
	            var _this = this;
	
	            if (this._observers.size === 0) {
	                this._observables.forEach(function (observable) {
	                    return observable.unsubscribe(_this);
	                });
	                this._onDispose.forEach(function (f) {
	                    return f();
	                });
	            }
	        }
	    }, {
	        key: 'map',
	        value: function map(f) {
	            var _this2 = this;
	
	            return makeReaction(function () {
	                return f(_this2.deref());
	            });
	        }
	    }]);
	
	    return Observable;
	}();
	
	var Atom = function (_Observable) {
	    _inherits(Atom, _Observable);
	
	    function Atom(value) {
	        _classCallCheck(this, Atom);
	
	        var _this3 = _possibleConstructorReturn(this, (Atom.__proto__ || Object.getPrototypeOf(Atom)).call(this, 'a'));
	
	        _this3._value = value;
	        _this3._subject = new Rx.BehaviorSubject(value);
	        return _this3;
	    }
	
	    _createClass(Atom, [{
	        key: 'subject',
	        value: function subject() {
	            return this._subject;
	        }
	    }, {
	        key: '_valueChanged',
	        value: function _valueChanged(changed) {
	            if (changed) {
	                this._notifyObservers();
	                this._subject.onNext(this._value);
	            }
	        }
	    }, {
	        key: 'reset',
	        value: function reset(value) {
	            var oldValue = this._value;
	            this._value = value;
	            this._valueChanged(this._value !== oldValue);
	            return this._value;
	        }
	    }, {
	        key: 'swap',
	        value: function swap(f) {
	            var oldValue = this._value;
	
	            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                args[_key - 1] = arguments[_key];
	            }
	
	            this._value = f(this._value, args);
	            this._valueChanged(this._value !== oldValue);
	            return this._value;
	        }
	    }, {
	        key: 'deref',
	        value: function deref() {
	            return this._value;
	        }
	    }, {
	        key: 'isChanged',
	        value: function isChanged(value) {
	            return this._value !== value;
	        }
	    }, {
	        key: 'peekValue',
	        value: function peekValue() {
	            return this._value;
	        }
	    }]);
	
	    return Atom;
	}(Observable);
	
	var Ratom = function (_Atom) {
	    _inherits(Ratom, _Atom);
	
	    function Ratom(value) {
	        _classCallCheck(this, Ratom);
	
	        var _this4 = _possibleConstructorReturn(this, (Ratom.__proto__ || Object.getPrototypeOf(Ratom)).call(this, value));
	
	        _this4._type = 'ra';
	        return _this4;
	    }
	
	    _createClass(Ratom, [{
	        key: 'deref',
	        value: function deref() {
	            watchInCtx(this);
	            return _get(Ratom.prototype.__proto__ || Object.getPrototypeOf(Ratom.prototype), 'deref', this).call(this);
	        }
	    }]);
	
	    return Ratom;
	}(Atom);
	
	var Reaction = function (_Observable2) {
	    _inherits(Reaction, _Observable2);
	
	    function Reaction(f) {
	        _classCallCheck(this, Reaction);
	
	        var _this5 = _possibleConstructorReturn(this, (Reaction.__proto__ || Object.getPrototypeOf(Reaction)).call(this, 'rx'));
	
	        _this5._f = f;
	        _this5._dirty = true;
	        return _this5;
	    }
	
	    _createClass(Reaction, [{
	        key: '_run',
	        value: function _run() {
	            this._state = runInCtx(this, this._f);
	            this._dirty = false;
	        }
	    }, {
	        key: 'deref',
	        value: function deref() {
	            if (this._dirty) {
	                this._run();
	            }
	            watchInCtx(this);
	            return this._state;
	        }
	    }, {
	        key: 'isChanged',
	        value: function isChanged(value) {
	            return this._state !== value;
	        }
	    }, {
	        key: 'peekValue',
	        value: function peekValue() {
	            return this._state;
	        }
	    }, {
	        key: 'notify',
	        value: function notify() {
	            this._dirty = true;
	            var oldState = this._state;
	            this._run();
	            if (oldState !== this._state) {
	                this._notifyObservers();
	            }
	        }
	    }, {
	        key: 'dispose',
	        value: function dispose() {
	            _get(Reaction.prototype.__proto__ || Object.getPrototypeOf(Reaction.prototype), 'dispose', this).call(this);
	            this._dirty = true;
	        }
	    }]);
	
	    return Reaction;
	}(Observable);
	
	var RxReaction = function (_Observable3) {
	    _inherits(RxReaction, _Observable3);
	
	    function RxReaction(rx) {
	        _classCallCheck(this, RxReaction);
	
	        // this._subj = new Rx.BehaviorSubject();
	        var _this6 = _possibleConstructorReturn(this, (RxReaction.__proto__ || Object.getPrototypeOf(RxReaction)).call(this, 'rxjs'));
	
	        _this6._value = undefined;
	        _this6._rx = rx;
	        if (!_this6._rx.distinctUntilChanged) {
	            console.trace('no distinct', rx);
	        }
	        return _this6;
	    }
	
	    _createClass(RxReaction, [{
	        key: 'deref',
	        value: function deref() {
	            var _this7 = this;
	
	            if (!this._subscription) {
	                this._subscription = this._rx.distinctUntilChanged(function (a) {
	                    return a;
	                }, function (a, b) {
	                    return a === b;
	                }).subscribe(function (v) {
	                    _this7._value = v;
	                    _this7._notifyObservers();
	                    // this._subj.onNext(v)
	                });
	            }
	            watchInCtx(this);
	            return this._value; //this._subj.getValue();
	        }
	    }, {
	        key: 'isChanged',
	        value: function isChanged(value) {
	            return this._value !== value;
	        }
	    }, {
	        key: 'peekValue',
	        value: function peekValue() {
	            return this._value;
	        }
	    }, {
	        key: 'dispose',
	        value: function dispose() {
	            _get(RxReaction.prototype.__proto__ || Object.getPrototypeOf(RxReaction.prototype), 'dispose', this).call(this);
	            if (this._observers.size === 0 && this._subscription) {
	                this._subscription.dispose();
	                delete this._subscription;
	            }
	        }
	    }]);
	
	    return RxReaction;
	}(Observable);
	
	var Cursor = function (_Observable4) {
	    _inherits(Cursor, _Observable4);
	
	    function Cursor(atom, path) {
	        _classCallCheck(this, Cursor);
	
	        var _this8 = _possibleConstructorReturn(this, (Cursor.__proto__ || Object.getPrototypeOf(Cursor)).call(this, 'cu'));
	
	        _this8._atom = atom;
	        _this8._cursor = atom.map(function () {
	            return atom.deref().getIn(path);
	        });
	        _this8._path = path;
	        return _this8;
	    }
	
	    _createClass(Cursor, [{
	        key: 'deref',
	        value: function deref() {
	            return this._cursor.deref();
	        }
	    }, {
	        key: 'dispose',
	        value: function dispose() {
	            this._cursor.dispose();
	        }
	    }, {
	        key: 'isChanged',
	        value: function isChanged(value) {
	            return this._cursor.isChanged(value);
	        }
	    }, {
	        key: 'reset',
	        value: function reset(value) {
	            var _this9 = this;
	
	            this._atom.swap(function (old) {
	                return old.setIn(_this9._path, value);
	            });
	        }
	    }, {
	        key: 'swap',
	        value: function swap(f) {
	            var _this10 = this;
	
	            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	                args[_key2 - 1] = arguments[_key2];
	            }
	
	            this._atom.swap(function (old) {
	                return old.updateIn(_this10._path, function (value) {
	                    return f.apply(undefined, [value].concat(args));
	                });
	            });
	        }
	    }]);
	
	    return Cursor;
	}(Observable);
	
	function makeReaction(f, options) {
	    var reaction = new Reaction(f);
	    if (options) {
	        if (options.onDispose) {
	            reaction.addOnDispose(options.onDispose);
	        }
	    }
	    return reaction;
	}
	
	function makeAtom(value) {
	    return new Atom(value);
	}
	
	function makeRatom(value) {
	    return new Ratom(value);
	}
	
	function makeRxReaction(rx) {
	    return new RxReaction(rx);
	}
	
	function makeCursor(atom, path) {
	    return new Cursor(atom, path);
	}
	
	function pluck(atom, path) {
	    return atom.map(function (val) {
	        return val && val.getIn(path);
	    });
	}
	
	function deref(observable, transform) {
	    if (observable instanceof Rx.Observable) {
	        if (transform) {
	            return makeRxReaction(observable).map(transform).deref();
	        }
	        return makeRxReaction(observable).deref();
	    }
	    if (transform) {
	        return observable.map(transform).deref();
	    }
	    return observable.deref();
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.register = register;
	exports.handle = handle;
	
	var _immutable = __webpack_require__(3);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	var _registrar = __webpack_require__(2);
	
	var _interceptor = __webpack_require__(4);
	
	var interceptor = _interopRequireWildcard(_interceptor);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }
	
	var kind = 'event';
	
	function flattenAndRemoveNulls(id, interceptors) {
	    return Immutable.fromJS(interceptors).flatMap(function (interceptor) {
	        if (Immutable.Map.isMap(interceptor)) {
	            return Immutable.List([interceptor]);
	        } else if (interceptor) {
	            return flattenAndRemoveNulls(id, interceptor);
	        }
	        return Immutable.List();
	    }).filter(Boolean).toList();
	}
	
	function register(id, interceptors) {
	    return (0, _registrar.registerHandler)(kind, id, flattenAndRemoveNulls(id, interceptors));
	}
	
	var handling = null;
	function handle(event) {
	    var _event = _toArray(event),
	        eventId = _event[0],
	        rest = _event.slice(1),
	        interceptors = (0, _registrar.getHandler)(kind, eventId, true);
	
	    if (handling) {
	        console.error("re-frame: while handling \"", handling, "\", dispatch-sync was called for \"", event, "\". You can't call dispatch-sync within an event handler.");
	    } else {
	        try {
	            handling = event;
	            return interceptor.execute(event, interceptors);
	        } finally {
	            handling = null;
	        }
	    }
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.doFx = undefined;
	exports.register = register;
	
	var _immutable = __webpack_require__(3);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	var _registrar = __webpack_require__(2);
	
	var _interceptor = __webpack_require__(4);
	
	var _router = __webpack_require__(10);
	
	var router = _interopRequireWildcard(_router);
	
	var _db = __webpack_require__(5);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var kind = 'fx';
	
	function register(id, handlerFn) {
	    return (0, _registrar.registerHandler)(kind, id, handlerFn);
	}
	
	var doFx = exports.doFx = (0, _interceptor.toInterceptor)({
	    id: 'do-fx',
	    after: function doFxAfter(ctx) {
	        ctx.get('effects').forEach(function (value, effect) {
	            var effectFn = (0, _registrar.getHandler)(kind, effect, true);
	
	            if (effectFn) {
	                effectFn(value);
	            }
	        });
	    }
	});
	
	// Builtin Effect Handlers
	
	/**
	 *
	 * :dispatch-later
	 *f
	 * `dispatch` one or more events after given delays. Expects a collection
	 * of maps with two keys:  :`ms` and `:dispatch`
	 *
	 * usage:
	 *
	 *    {:dispatch-later [{:ms 200 :dispatch [:event-id "param"]}
	 *  in 200ms do this: (dispatch [:event-id "param"])
	 *                      {:ms 100 :dispatch [:also :this :in :100ms]}]}
	 *
	 */
	register('dispatch-later', function (values) {
	    values.forEach(function (value) {
	        var ms = value.get(0),
	            dispatch = value.get(1);
	
	        if (!dispatch || !ms >= 0) {
	            console.error('re-frame: ignoring bad "dispatch-later" value:', value);
	        } else {
	            setTimeout(function () {
	                return router.dispatch(dispatch);
	            }, ms);
	        }
	    });
	});
	
	/**
	 * :dispatch
	 *
	 * `dispatch` one event. Excepts a single vector.
	 *
	 * usage:
	 *   {:dispatch [:event-id "param"] }
	 */
	register('dispatch', function (value) {
	    if (!Array.isArray(value)) {
	        console.error('re-frame: ignoring bad :dispatch value. Expected a vector, but got:', value);
	    } else {
	        router.dispatch(value);
	    }
	});
	
	/**
	 * :dispatch-n
	 *
	 * `dispatch` more than one event. Expects a list or vector of events. Something for which
	 * sequential? returns true.
	 *
	 * usage:
	 *   {:dispatch-n (list [:do :all] [:three :of] [:these])}
	 *
	 */
	register('dispatch-n', function (values) {
	    if (!Array.isArray(values) && values.map(function (v) {
	        return !Array.isArray(v);
	    }).filter(Boolean).length > 0) {
	        console.error('re-frame: ignoring bad :dispatch-n value. Expected a collection, got got:', values);
	    } else {
	        values.forEach(function (value) {
	            return router.dispatch(value);
	        });
	    }
	});
	
	/**
	 * :deregister-event-handler
	 *
	 * removes a previously registered event handler. Expects either a single id (
	 * typically a keyword), or a seq of ids.
	 *
	 * usage:
	 *   {:deregister-event-handler :my-id)}
	 * or:
	 *   {:deregister-event-handler [:one-id :another-id]}
	 *
	 */
	register('deregister-event-handler', function (value) {
	    if (Immutable.isSeq(value) || Array.isArray(value)) {
	        value.forEach(function (v) {
	            return (0, _registrar.clearHandlers)(kind, v);
	        });
	    } else {
	        (0, _registrar.clearHandlers)(kind, value);
	    }
	});
	
	/**
	 * :db
	 *
	 * reset! app-db with a new value. Expects a map.
	 *
	 * usage:
	 *   {:db  {:key1 value1 key2 value2}}
	 *
	 */
	register('db', function (value) {
	    _db.appDb.reset(value);
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.markFlushDom = markFlushDom;
	exports.pause = pause;
	exports.resume = resume;
	exports.dispatch = dispatch;
	exports.dispatchSync = dispatchSync;
	
	var _immutable = __webpack_require__(3);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	var _events = __webpack_require__(8);
	
	var _interop = __webpack_require__(11);
	
	var _subs = __webpack_require__(13);
	
	var _db = __webpack_require__(5);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	//  -- Router Loop ------------------------------------------------------------
	//
	//  A call to "re-frame.core/dispatch" places an event on a queue for processing.
	//      A short time later, the handler registered to handle this event will be run.
	//  What follows is the implementation of this process.
	//
	//  The task is to process queued events in a perpetual loop, one after
	//  the other, FIFO, calling the registered event-handler for each, being idle when
	//  there are no events, and firing up when one arrives.
	//
	//  But browsers only have a single thread of control and we must be
	//  careful to not hog the CPU. When processing events one after another, we
	//  must regularly hand back control to the browser, so it can redraw, process
	//  websockets, etc. But not too regularly! If we are in a de-focused browser
	//  tab, our app will be CPU throttled. Each time we get back control, we have
	//  to process all queued events, or else something like a bursty websocket
	//  (producing events) might overwhelm the queue. So there's a balance.
	//
	//  The processing/handling of an event happens "asynchronously" sometime after
	//  that event was enqueued via "dispatch". The original implementation of this router loop
	//  used `core.async`. As a result, it was fairly simple, and it mostly worked,
	//  but it did not give enough control. So now we hand-roll our own,
	//  finite-state-machine and all.
	//
	//  In what follows, the strategy is this:
	//    - maintain a FIFO queue of `dispatched` events.
	//    - when a new event arrives, "schedule" processing of this queue using
	//      goog.async.nextTick, which means it will happen "very soon".
	//    - when processing events, one after the other, do ALL the currently
	//      queued events. Don't stop. Don't yield to the browser. Hog that CPU.
	//    - but if any new events are dispatched during this cycle of processing,
	//      don't do them immediately. Leave them queued. Yield first to the browser,
	//      and do these new events in the next processing cycle. That way we drain
	//      the queue up to a point, but we never hog the CPU forever. In
	//      particular, we handle the case where handling one event will beget
	//      another event. The freshly begotten event will be handled next cycle,
	//      with yielding in-between.
	//        - In some cases, an event should not be handled until after the GUI has been
	//      updated, i.e., after the next Reagent animation frame. In such a case,
	//      the event should be dispatched with :flush-dom metadata like this:
	//        (dispatch ^:flush-dom [:event-id other params])
	//      Such an event will temporarily block all further processing because
	//      events are processed sequentially: we handle one event completely
	//      before we handle the ones behind it.
	//
	//  Implementation notes:
	//        - queue processing can be in a number of states: scheduled, running, paused
	//      etc. So it is modeled as a Finite State Machine.
	//      See "-fsm-trigger" (below) for the states and transitions.
	//    - the scheduling is done via "goog.async.nextTick" which is pretty quick
	//    - when the event has :flush-dom metadata we schedule via
	//        "reagent.core.after-render"
	//      which will run event processing after the next Reagent animation frame.
	//
	
	function markFlushDom(event) {
	    event._flushDom = true;
	    return event;
	}
	
	var laterFns = {
	    '_flushDom': function _flushDom(f) {
	        return (0, _interop.afterRender)(function () {
	            return setTimeout(f, 0);
	        });
	    },
	    'yield': _interop.nextTick
	};
	
	function doTrigger(fsm, state, trigger, arg) {
	    if (trigger === 'pause') {
	        return ['paused', function (fsm) {
	            fsm._pause(arg);
	        }];
	    }
	
	    /**
	     * if you are in state ":idle" and a trigger ":add-event"
	     * happens, then move the FSM to state ":scheduled" and execute
	     * that two-part "do" function.
	     */
	    if (state === 'idle' && trigger === 'add-event') {
	        return ['scheduled', function (fsm) {
	            fsm._addEvent(arg);
	            fsm._runNextTick();
	        }];
	    } else if (state === 'idle' && trigger === 'resume') {
	        return ['idle', function (fsm) {}];
	    }
	    /**
	     * State: :scheduled  (the queue is scheduled to run, soon)
	     */
	    else if (state === 'scheduled' && trigger === 'add-event') {
	            return ['scheduled', function (fsm) {
	                fsm._addEvent(arg);
	            }];
	        } else if (state === 'scheduled' && trigger === 'run-queue') {
	            return ['running', function (fsm) {
	                fsm._runQueue();
	            }];
	        } else if (state === 'scheduled' && trigger === 'resume') {
	            return ['scheduled', function (fsm) {}];
	        }
	
	        /**
	         * State: :running (the queue is being processed one event after another)
	         */
	        else if (state === 'running' && trigger === 'add-event') {
	                return ['running', function (fsm) {
	                    fsm._addEvent(arg);
	                }];
	            } else if (state === 'running' && trigger === 'pause') {
	                return ['paused', function (fsm) {
	                    fsm._pause(arg);
	                }];
	            } else if (state === 'running' && trigger === 'exception') {
	                return ['idle', function (fsm) {
	                    fsm._exception(arg);
	                }];
	            } else if (state === 'running' && trigger === 'finish-run') {
	                return fsm._queue.length === 0 ? ['idle', function () {
	                    _subs.requestAnimationFrame$.onNext(_db.appDb.peekValue());
	                }] : ['scheduled', function (fsm) {
	                    _subs.requestAnimationFrame$.onNext(_db.appDb.peekValue());
	                    fsm._runNextTick();
	                }];
	            }
	            /**
	             * State: :paused (:flush-dom metadata on an event has caused a temporary pause in processing)
	             */
	            else if (state === 'paused' && trigger === 'add-event') {
	                    return ['paused', function (fsm) {
	                        fsm._addEvent(arg);
	                    }];
	                } else if (state === 'paused' && trigger === 'run-queue') {
	                    return ['paused', function (fsm) {}];
	                } else if (state === 'paused' && trigger === 'resume') {
	                    return ['running', function (fsm) {
	                        fsm._resume(arg);
	                    }];
	                } else {
	                    throw new Error("re-frame: router state transition not found. State '" + state + "', trigger '" + trigger + "'");
	                }
	}
	
	var Fsm = function () {
	    function Fsm() {
	        _classCallCheck(this, Fsm);
	
	        this._postEventCallbacks = {};
	        this._state = 'idle';
	        this._queue = [];
	    }
	
	    _createClass(Fsm, [{
	        key: 'addPostEventCallback',
	        value: function addPostEventCallback(id, callbackFn) {
	            if (this._postEventCallbacks[id]) {
	                console.warn('re-frame: overwriting existing post event call back with id:', id);
	            }
	            this._postEventCallbacks[id] = callbackFn;
	        }
	    }, {
	        key: 'removePostEventCallback',
	        value: function removePostEventCallback(id) {
	            if (!this._postEventCallbacks[id]) {
	                console.warn('re-frame: could not remove post event call back with id:', id);
	            }
	            delete this._postEventCallbacks[id];
	        }
	    }, {
	        key: 'trigger',
	        value: function trigger(_trigger, arg) {
	            var _doTrigger = doTrigger(this, this._state, _trigger, arg),
	                _doTrigger2 = _slicedToArray(_doTrigger, 2),
	                newState = _doTrigger2[0],
	                actionFn = _doTrigger2[1];
	
	            this._state = newState;
	            if (actionFn) {
	                actionFn(this);
	            }
	        }
	    }, {
	        key: '_addEvent',
	        value: function _addEvent(arg) {
	            this._queue.push(arg);
	        }
	    }, {
	        key: '_process1stEventInQueue',
	        value: function _process1stEventInQueue() {
	            var event = this._queue[0];
	            try {
	
	                (0, _events.handle)(event);
	                this._queue.shift();
	                this._callPostEventCallbacks(event);
	            } catch (error) {
	                this.trigger("exception", error);
	            }
	        }
	    }, {
	        key: '_runNextTick',
	        value: function _runNextTick() {
	            setTimeout(function runProcessEvents() {
	                return this.trigger("run-queue", null);
	            }.bind(this), 0);
	        }
	    }, {
	        key: '_runQueue',
	        value: function _runQueue() {
	            var _this = this;
	
	            var paused = false;
	
	            var _loop = function _loop(i) {
	                // TODO add later-fns
	                var event = _this._queue[0];
	                var later = Object.keys(laterFns).map(function (fn) {
	                    return event[fn] ? laterFns[fn] : false;
	                }).filter(Boolean)[0];
	                if (later) {
	                    _this.trigger('pause', later);
	                    paused = true;
	                    return 'break';
	                } else {
	                    _this._process1stEventInQueue();
	                }
	            };
	
	            for (var i = this._queue.length; i > 0; i--) {
	                var _ret = _loop(i);
	
	                if (_ret === 'break') break;
	            }
	            if (!paused) {
	                this.trigger('finish-run', null);
	            }
	        }
	    }, {
	        key: '_exception',
	        value: function _exception(ex) {
	            this._queue = [];
	            throw ex;
	        }
	    }, {
	        key: '_pause',
	        value: function _pause(laterFn) {
	            var _this2 = this;
	
	            // console.log('pause', laterFn);
	            if (laterFn) {
	                laterFn(function () {
	                    return _this2.trigger('resume', null);
	                });
	            }
	        }
	    }, {
	        key: '_callPostEventCallbacks',
	        value: function _callPostEventCallbacks(event) {
	            var _this3 = this;
	
	            Object.keys(this._postEventCallbacks).forEach(function (key) {
	                _this3._postEventCallbacks[key](event, [].concat(_toConsumableArray(_this3._queue)));
	            });
	        }
	    }, {
	        key: '_resume',
	        value: function _resume() {
	            // console.log('resume');
	            if (this._queue[0]) {
	                this._process1stEventInQueue();
	            }
	            this._runQueue();
	        }
	    }]);
	
	    return Fsm;
	}();
	
	var EventQueue = function () {
	    function EventQueue() {
	        _classCallCheck(this, EventQueue);
	
	        this._fsm = new Fsm();
	    }
	
	    _createClass(EventQueue, [{
	        key: 'push',
	        value: function push(event) {
	            this._fsm.trigger('add-event', event);
	        }
	    }, {
	        key: 'pause',
	        value: function pause() {
	            this._fsm.trigger('pause');
	        }
	    }, {
	        key: 'resume',
	        value: function resume() {
	            this._fsm.trigger('resume');
	        }
	    }, {
	        key: 'addPostEventCallback',
	        value: function addPostEventCallback(id, callbackFn) {
	            this._fsm.addPostEventCallback(id, callbackFn);
	        }
	    }, {
	        key: 'removePostEventCallback',
	        value: function removePostEventCallback(id) {
	            this._fsm.removePostEventCallback(id);
	        }
	    }]);
	
	    return EventQueue;
	}();
	
	var eventQueue = new EventQueue();
	
	function pause() {
	    eventQueue.pause();
	}
	
	function resume() {
	    eventQueue.resume();
	}
	
	/**
	 * Queue the given event for processing by the registered event handler.
	 * Just to be clear: the event handler is not run immediately - it is not run
	 * synchronously. It will likely be run 'very soon', although it may be
	 * added to the end of a FIFO queue which already contain events.
	 * Usage:
	 *  (dispatch [:delete-item 42])
	 */
	function dispatch(event) {
	    if (!event) {
	        throw new Error("re-frame: you called \"dispatch\" without an event vector.");
	    } else {
	        eventQueue.push(event);
	    }
	}
	
	/**
	 * Sychronously (immediately!) process the given event using the registered handler.
	 * Generally, you shouldn't use this - you should use `dispatch` instead.  It
	 * is an error to use `dispatch-sync` within an event handler.
	 * Usage:
	 *  (dispatch-sync [:delete-item 42])
	 */
	function dispatchSync(event) {
	    (0, _events.handle)(event);
	    eventQueue._fsm._callPostEventCallbacks(event);
	    _subs.requestAnimationFrame$.onNext(_db.appDb.peekValue());
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.log = exports.nextTick = undefined;
	exports.afterRender = afterRender;
	exports.reagentId = reagentId;
	exports.isDebug = isDebug;
	exports.isTraceReact = isTraceReact;
	exports.toggleLog = toggleLog;
	
	var _batching = __webpack_require__(12);
	
	var batching = _interopRequireWildcard(_batching);
	
	var _ratom = __webpack_require__(6);
	
	var ratom = _interopRequireWildcard(_ratom);
	
	var _immutable = __webpack_require__(3);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var nextTick = exports.nextTick = batching.nextTick;
	
	function afterRender(f) {
	    batching.doAfterRender(f);
	}
	
	function reagentId(value) {
	    return value.id();
	}
	
	var log = exports.log = ratom.makeAtom(Immutable.Map({
	    debug: false,
	    traceReact: false,
	    traceSub: false
	}));
	
	function isEnabled(value) {
	    return log.deref().get(value);
	}
	function isDebug() {
	    return isEnabled('debug');
	}
	
	function isTraceReact() {
	    return isEnabled('traceReact');
	}
	
	function toggleLog(name, value) {
	    log.swap(function (container) {
	        return container.update(name, function (old) {
	            return typeof value !== 'undefined' ? value : !old;
	        });
	    });
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.nextTick = nextTick;
	exports.flush = flush;
	exports.flushAfterRender = flushAfterRender;
	exports.queueRender = queueRender;
	exports.doBeforeFlush = doBeforeFlush;
	exports.doAfterRender = doAfterRender;
	exports.schedule = schedule;
	exports.markRendered = markRendered;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function nextTick(f) {
	    if (requestAnimationFrame) {
	        requestAnimationFrame(f);
	    } else {
	        setTimeout(f, 16);
	    }
	}
	
	function runQueue(components) {
	    var s = [].concat(_toConsumableArray(new Set(components)));
	    s.sort(function (o1, o2) {
	        return o1.state.renderOrder - o2.state.renderOrder;
	    });
	
	    s.forEach(function (component) {
	        if (!component.__reframe_rendered) {
	            component.tryForceUpdate();
	        }
	    });
	}
	
	var RenderQueue = function () {
	    function RenderQueue() {
	        _classCallCheck(this, RenderQueue);
	
	        this._isScheduled = false;
	    }
	
	    _createClass(RenderQueue, [{
	        key: 'enqueue',
	        value: function enqueue(k, f) {
	            if (!this[k]) {
	                this[k] = [];
	            }
	            this[k].push(f);
	            this.schedule();
	        }
	    }, {
	        key: 'runFuns',
	        value: function runFuns(k) {
	            var fns = this[k];
	
	            delete this[k];
	            if (fns) {
	                fns.forEach(function (f) {
	                    return f();
	                });
	            }
	        }
	    }, {
	        key: 'schedule',
	        value: function schedule() {
	            if (!this._isScheduled) {
	                this._isScheduled = true;
	                nextTick(function runRenderQueue() {
	                    return this.runQueues();
	                }.bind(this));
	            }
	        }
	    }, {
	        key: 'queueRender',
	        value: function queueRender(c) {
	            this.enqueue('componentQueue', c);
	        }
	    }, {
	        key: 'addBeforeFlush',
	        value: function addBeforeFlush(f) {
	            this.enqueue('beforeFlush', f);
	        }
	    }, {
	        key: 'addAfterRender',
	        value: function addAfterRender(f) {
	            this.enqueue('afterRender', f);
	        }
	    }, {
	        key: 'runQueues',
	        value: function runQueues() {
	            this._isScheduled = false;
	            this.flushQueues();
	        }
	    }, {
	        key: 'flushAfterRender',
	        value: function flushAfterRender() {
	            this.runFuns('afterRender');
	        }
	    }, {
	        key: 'flushQueues',
	        value: function flushQueues() {
	            this.runFuns('beforeFlush');
	            // TODO ratom-flush
	            if (this['componentQueue']) {
	                runQueue(this['componentQueue']);
	                delete this['componentQueue'];
	            }
	            this.flushAfterRender();
	        }
	    }]);
	
	    return RenderQueue;
	}();
	
	if (!window.__reframe_render_queue) {
	    window.__reframe_render_queue = new RenderQueue();
	}
	var renderQueue = window.__reframe_render_queue;
	
	function flush() {
	    renderQueue.flushQueues();
	}
	
	function flushAfterRender() {
	    renderQueue.flushAfterRender();
	}
	
	function queueRender(component) {
	    component.__reframe_rendered = false;
	    renderQueue.queueRender(component);
	}
	
	function doBeforeFlush(f) {
	    renderQueue.addBeforeFlush(f);
	}
	
	function doAfterRender(f) {
	    renderQueue.addAfterRender(f);
	}
	
	function schedule() {
	    renderQueue.schedule();
	}
	
	function markRendered(component) {
	    component.__reframe_rendered = true;
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.requestAnimationFrame$ = exports.kind = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.clearSubscriptionCache = clearSubscriptionCache;
	exports.clearAllHandlers = clearAllHandlers;
	exports.subscribe = subscribe;
	exports.regSub = regSub;
	exports.registerSub = registerSub;
	
	var _immutable = __webpack_require__(3);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	var _rx = __webpack_require__(7);
	
	var Rx = _interopRequireWildcard(_rx);
	
	var _ratom = __webpack_require__(6);
	
	var _registrar = __webpack_require__(2);
	
	var _db = __webpack_require__(5);
	
	var _interop = __webpack_require__(11);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var kind = exports.kind = 'sub';
	
	// -- cache -------------------------------------------------------------------
	//
	// De-duplicate subscriptions. If two or more equal subscriptions
	// are concurrently active, we want only one handler running.
	// Two subscriptions are "equal" if their query vectors serialized to string equals.
	var queryReaction = (0, _ratom.makeAtom)(Immutable.Map());
	// window.queryReaction = queryReaction;
	
	/**
	 * Runs on-dispose for all subscriptions we have in the subscription cache.
	 Used to force recreation of new subscriptions. Should only be necessary
	 in development.
	 The on-dispose functions for the subscriptions will remove themselves from the
	 cache.
	 Useful when reloading Figwheel code after a React exception, as React components
	 aren't cleaned up properly. This means a subscription's on-dispose function isn't
	 run when the components are destroyed. If a bad subscription caused your exception,
	 then you can't fix it without reloading your browser.
	 */
	function clearSubscriptionCache() {
	    queryReaction.deref().forEach(function (reaction) {
	        return reaction.dispose();
	    });
	
	    if (!queryReaction.deref().isEmpty()) {
	        console.warn("Subscription cache should be empty after clearing it.");
	    }
	}
	
	function makeCacheKey(query, dynv) {
	    // cache key should be created either recursively or serializing by string, string is faster (?? safer ??)
	    return (query || []).join("|") + "|" + (dynv || []).join("|");
	    // return Immutable.List([Immutable.List(query), Immutable.List(dynv)]);
	}
	
	function clearAllHandlers() {
	    (0, _registrar.clearHandlers)(kind);
	    clearSubscriptionCache();
	}
	
	function cacheAndReturn(query, dynv, r) {
	    var cacheKey = makeCacheKey(query, dynv);
	    r.addOnDispose(function () {
	        queryReaction.swap(function (cache) {
	            return cache.delete(cacheKey);
	        });
	    });
	
	    queryReaction.swap(function (cache) {
	        return cache.set(cacheKey, r);
	    });
	    return r;
	}
	
	function cacheLookup(query) {
	    var dynv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Immutable.List();
	
	    return queryReaction.deref().get(makeCacheKey(query, dynv));
	}
	
	function subscribe(query) {
	    var dynv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	
	    if (typeof dynv === 'undefined') {
	
	        var cached = cacheLookup(query);
	        if (cached) {
	            return cached;
	        }
	
	        var _query = _slicedToArray(query, 1),
	            queryId = _query[0],
	            handlerFn = (0, _registrar.getHandler)(kind, queryId);
	
	        if (!handlerFn) {
	            console.error("re-frame: no subscription handler registered for: \"", queryId, "\". Returning a nil subscription.");
	        } else {
	            return cacheAndReturn(query, [], handlerFn(_db.appDb, query));
	        }
	    } else {
	        var _ret = function () {
	            var cached = cacheLookup(query, dynv);
	            if (cached) {
	                return {
	                    v: cached
	                };
	            }
	
	            var _query2 = _slicedToArray(query, 1),
	                queryId = _query2[0],
	                handlerFn = (0, _registrar.getHandler)(kind, queryId);
	
	            if (!handlerFn) {
	                console.error("re-frame: no subscription handler registered for: \"", queryId, "\". Returning a nil subscription.");
	            } else {
	                var _ret2 = function () {
	                    var dynVals = (0, _ratom.makeReaction)(function () {
	                        return dynv.map(function (v) {
	                            return v.deref();
	                        });
	                    }),
	                        sub = (0, _ratom.makeReaction)(function () {
	                        return handlerFn(_db.appDb, dynVals.deref());
	                    });
	
	                    return {
	                        v: {
	                            v: cacheAndReturn(query, [], (0, _ratom.makeReaction)(function () {
	                                return sub.deref().deref();
	                            }))
	                        }
	                    };
	                }();
	
	                if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
	            }
	        }();
	
	        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    }
	}
	
	function derefInputSignals(signals, queryId) {
	    if (Array.isArray(signals)) {
	        return signals.map(function (v) {
	            return v.deref();
	        });
	    } else if (signals instanceof Immutable.Map) {
	        return signals.map(function (v) {
	            return v.deref();
	        });
	    } else if (signals instanceof Immutable.Seq) {
	        return signals.map(function (v) {
	            return v.deref();
	        });
	    } else if (signals && signals.deref) {
	        return signals.deref();
	    } else {
	        console.error("re-frame: in the reg-sub for ", query - id, ", the input-signals function returns: ", signals);
	    }
	}
	
	function partition(input, spacing) {
	    var output = [];
	
	    for (var i = 0; i < input.length; i += spacing) {
	        output[output.length] = input.slice(i, i + spacing);
	    }
	
	    return output;
	}
	
	function makeMultiInputPairsFn(inputArgs) {
	    var pairs = partition(inputArgs, 2),
	        vecs = pairs.map(function (p) {
	        return p[1];
	    });
	
	    return function inpFn() {
	        return vecs.map(subscribe);
	    };
	}
	
	function makeInputsFn(inputArgs) {
	    switch (inputArgs.length) {
	        // no `inputs` function provided - give the default
	        case 0:
	            return function () {
	                return _db.appDb;
	            };
	
	        // a single `inputs` fn
	        case 1:
	            return inputArgs[0];
	
	        // one sugar pair
	        case 2:
	            return function inpFn() {
	                return subscribe(inputArgs[1]);
	            };
	
	        // multiple sugar pairs
	        default:
	            return makeMultiInputPairsFn(inputArgs);
	
	    }
	}
	
	function checkRx(reaction) {
	    if (reaction instanceof Rx.Observable) {
	        return (0, _ratom.makeRxReaction)(reaction);
	    }
	    return reaction;
	}
	
	/**
	 *   "Associate the given `query id` with a handler function and an optional signal function.
	
	 There's 2 ways this function can be called
	
	 1. regSub('test-sub', (db, [_]) => db)
	 The value in app-db is passed to the computation function as the 1st argument.
	
	 2. regSub('a-b-sub',
	        (q-vec, d-vec) => [subscribe(['a-sub']), subscribe(['b-sub'])],
	        ([a, b], q-vec) => {a: a, b: b})
	
	 Two functions provided. The 2nd is computation function, as before. The 1st
	 is returns what `input signals` should be provided to the computation. The
	 `input signals` function is called with two arguments: the query vector
	 and the dynamic vector. The return value can be singleton reaction or
	 a sequence of reactions.
	
	 "
	 */
	function regSub(queryId) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	    }
	
	    var computationFn = args[args.length - 1],
	        inputArgs = args.slice(0, args.length - 1),
	        errHeader = "re-frame: reg-sub for " + queryId + ", ",
	        inputsFn = makeInputsFn(inputArgs);
	
	    return (0, _registrar.registerHandler)(kind, queryId, function subsHandlerFn(db, queryVec) {
	        var dynVec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
	
	        if (typeof dynVec === 'undefined') {
	            var _ret3 = function () {
	                var subscriptions = inputsFn(queryVec),
	                    reaction = (0, _ratom.makeReaction)(function () {
	                    return computationFn(derefInputSignals(subscriptions, queryId), queryVec);
	                });
	
	                return {
	                    v: reaction
	                };
	            }();
	
	            if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
	        } else {
	            var _ret4 = function () {
	                var subscriptions = inputsFn(queryVec, dynVec),
	                    reaction = (0, _ratom.makeReaction)(function () {
	                    return computationFn(derefInputSignals(subscriptions, queryId), queryVec, dynVec);
	                });
	
	                return {
	                    v: reaction
	                };
	            }();
	
	            if ((typeof _ret4 === 'undefined' ? 'undefined' : _typeof(_ret4)) === "object") return _ret4.v;
	        }
	    });
	}
	
	var requestAnimationFrame$ = exports.requestAnimationFrame$ = new Rx.BehaviorSubject();
	
	function registerSub(queryId, computationFn) {
	    return (0, _registrar.registerHandler)(kind, queryId, function subsRxHandlerFn(db, queryVec) {
	        var dynVec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
	
	        return (0, _ratom.makeRxReaction)(computationFn(requestAnimationFrame$, queryVec));
	    });
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.render = render;
	exports.StatelessMixin = StatelessMixin;
	exports.SubscriptionMixin = SubscriptionMixin;
	exports.uix = uix;
	exports.ui = ui;
	exports.viewP = viewP;
	exports.viewV = viewV;
	exports.viewSP = viewSP;
	exports.viewSV = viewSV;
	
	var _subs = __webpack_require__(13);
	
	var subs = _interopRequireWildcard(_subs);
	
	var _react = __webpack_require__(15);
	
	var React = _interopRequireWildcard(_react);
	
	var _shouldupdate = __webpack_require__(16);
	
	var _ratom = __webpack_require__(6);
	
	var ratom = _interopRequireWildcard(_ratom);
	
	var _batching = __webpack_require__(12);
	
	var batching = _interopRequireWildcard(_batching);
	
	var _interop = __webpack_require__(11);
	
	var _createReactClass = __webpack_require__(18);
	
	var _createReactClass2 = _interopRequireDefault(_createReactClass);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// export const pause$ = new Rx.BehaviorSubject(true);
	
	// export function deref(rx, transform) {
	//     let ttransform = transform || (a => a);
	//     let subj = new Rx.BehaviorSubject();
	//     rx.map(ttransform).subscribe(subj).dispose();
	//     return subj.getValue();
	// }
	
	var data = {
	    renderOrder: 0,
	    toUpdate: []
	};
	
	function shouldUpdateByDerefed(watching) {
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;
	
	    try {
	        for (var _iterator = watching[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var watch = _step.value;
	
	            if (watch.shouldUpdate()) {
	                return true;
	            }
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }
	
	    return false;
	}
	
	function render() {
	    data.toUpdate.sort(function (_ref, _ref2) {
	        var _ref4 = _slicedToArray(_ref, 1),
	            o1 = _ref4[0];
	
	        var _ref3 = _slicedToArray(_ref2, 1),
	            o2 = _ref3[0];
	
	        return o1 - o2;
	    });
	
	    data.toUpdate.forEach(function (_ref5) {
	        var _ref6 = _slicedToArray(_ref5, 2),
	            _ = _ref6[0],
	            forceUpdate = _ref6[1];
	
	        return forceUpdate();
	    });
	    data.toUpdate = [];
	}
	// subs.render$
	//     .pausable(pause$)
	//     .subscribe(render);
	
	function StatelessMixin(isArgv) {
	    return {
	        shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	            var propsUpdate = isArgv ? (0, _shouldupdate.shouldUpdateArgv)(this.props.argv, nextProps.argv) : (0, _shouldupdate.shouldUpdate)(this.props, nextProps, ['ctx']);
	            var stateUpdate = (0, _shouldupdate.shouldUpdate)(this.state, nextState);
	            return propsUpdate || stateUpdate;
	        },
	        getDisplayName: function getDisplayName() {
	            return this.constructor.displayName;
	        },
	        traceReact: function traceReact(message) {
	            if ((0, _interop.isTraceReact)()) {
	                console.debug(message, this.getDisplayName(), {
	                    order: this.state.renderOrder,
	                    render: this.state.renderCycle,
	                    props: this.props, state: this.state
	                });
	            }
	        },
	        id: function id() {
	            return this.getDisplayName();
	        }
	    };
	}
	
	function S4() {
	    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
	}
	
	// Generate a pseudo-GUID by concatenating random hexadecimal.
	function guid() {
	    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
	}
	
	var ReactViewDeref = function (_ratom$Observable) {
	    _inherits(ReactViewDeref, _ratom$Observable);
	
	    function ReactViewDeref(component, renderCycle, observable) {
	        _classCallCheck(this, ReactViewDeref);
	
	        var _this = _possibleConstructorReturn(this, (ReactViewDeref.__proto__ || Object.getPrototypeOf(ReactViewDeref)).call(this, 'de'));
	
	        _this._componentId = component.id();
	        _this._renderCycle = renderCycle;
	        _this._observable = observable;
	        _this._lastValue = observable.peekValue();
	        return _this;
	    }
	
	    _createClass(ReactViewDeref, [{
	        key: 'notify',
	        value: function notify() {
	            this._notifyObservers();
	        }
	    }, {
	        key: 'shouldDispose',
	        value: function shouldDispose(renderCycle) {
	            return renderCycle > this._renderCycle;
	        }
	    }, {
	        key: 'dispose',
	        value: function dispose() {
	            _get(ReactViewDeref.prototype.__proto__ || Object.getPrototypeOf(ReactViewDeref.prototype), 'dispose', this).call(this);
	            this._observable.dispose();
	        }
	    }, {
	        key: 'deref',
	        value: function deref() {
	            return this._lastValue;
	        }
	    }, {
	        key: 'shouldUpdate',
	        value: function shouldUpdate() {
	            return this._observable.isChanged(this._lastValue);
	        }
	    }]);
	
	    return ReactViewDeref;
	}(ratom.Observable);
	
	function SubscriptionMixin(isArgv) {
	    return {
	        derefSub: function derefSub(subVec, transform) {
	            return ratom.deref(subs.subscribe(subVec), transform);
	        },
	
	        getDisplayName: function getDisplayName() {
	            return this.constructor.displayName;
	        },
	        getInitialState: function getInitialState() {
	            return {
	                watching: new Set(),
	                renderOrder: data.renderOrder++,
	                renderCycle: 0
	            };
	        },
	        observe: function observe(watch) {
	            if (!this.state.watching.has(watch)) {
	                var deref = new ReactViewDeref(this, this.state.renderCycle, watch);
	                this.state.watching.add(deref);
	                watch.subscribe(deref);
	                deref.subscribe(this);
	                watch.unsubscribe(this);
	            }
	        },
	        id: function id() {
	            return this.getDisplayName();
	        },
	
	        // unobserve: function(observable) {
	        //     this.state.watching.delete(observable);
	        // },
	        notify: function notify(dispose) {
	            this.traceReact('Notify');
	            batching.queueRender(this);
	        },
	        tryForceUpdate: function tryForceUpdate() {
	            if (shouldUpdateByDerefed(this.state.watching)) {
	                this.traceReact('Force update');
	                // console.log('Force update', obj.getDisplayName());
	                this.forceUpdate();
	            }
	        },
	        shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	            var updateByProps = isArgv ? (0, _shouldupdate.shouldUpdateArgv)(this.props.argv, nextProps.argv) : (0, _shouldupdate.shouldUpdate)(this.props, nextProps, ['ctx']),
	                updateByState = (0, _shouldupdate.shouldUpdate)(this.state, nextState, ['watching', 'renderOrder', 'renderCycle']);
	
	            return updateByProps || updateByState;
	        },
	        deref: function deref(rx, aTransform, aId) {
	            return ratom.deref(rx, aTransform);
	        },
	        unsubscribe: function unsubscribe() {
	            var _this2 = this;
	
	            this.state.watching.forEach(function (watch) {
	                watch.unsubscribe(_this2);
	                watch.dispose();
	            });
	        },
	        componentWillUpdate: function componentWillUpdate() {
	            // console.log('Rendering', this.getDisplayName());
	            this.state.renderCycle++;
	            // this.unsubscribe();
	        },
	        componentDidUpdate: function componentDidUpdate() {
	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;
	
	            try {
	                for (var _iterator2 = this.state.watching[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    var watch = _step2.value;
	
	                    // console.log(watch._observable.id(), this.state.renderCycle, watch.shouldDispose(this.state.renderCycle), watch);
	                    if (watch.shouldDispose(this.state.renderCycle)) {
	                        this.state.watching.delete(watch);
	                        watch.unsubscribe(this);
	                        watch.dispose();
	                    }
	                }
	            } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                        _iterator2.return();
	                    }
	                } finally {
	                    if (_didIteratorError2) {
	                        throw _iteratorError2;
	                    }
	                }
	            }
	        },
	        componentWillUnmount: function componentWillUnmount() {
	            (0, _batching.markRendered)(this);
	            this.unsubscribe();
	        },
	        traceReact: function traceReact(message) {
	            if ((0, _interop.isTraceReact)()) {
	                console.debug(message, this.getDisplayName(), {
	                    order: this.state.renderOrder,
	                    render: this.state.renderCycle,
	                    props: this.props, state: this.state
	                });
	            }
	        }
	    };
	}
	
	function createComponentObj(mixins, args) {
	    var componentObj = void 0;
	    switch (args.length) {
	        case 2:
	            if (typeof args[1].prototype === 'undefined') {
	                args[1].mixins = mixins;
	                componentObj = args[1];
	            } else {
	                componentObj = {
	                    mixins: mixins,
	                    render: args[1]
	                };
	            }
	            break;
	        case 3:
	            if (typeof args[2].prototype === 'undefined') {
	                // it's an object
	                args[2].mixins = mixins.concat(args[1]);
	                componentObj = args[2];
	            } else {
	                // it's a render function
	                componentObj = {
	                    mixins: mixins.concat(args[1]),
	                    render: args[2]
	                };
	            }
	            break;
	        default:
	            throw new Error('Expected 2 or 3 arguments, got ' + args.length);
	    }
	    componentObj.displayName = args[0];
	    return componentObj;
	}
	
	function propsView(mixin, args) {
	    var componentObj = createComponentObj(mixin, args);
	    var oldRender = componentObj.render;
	    componentObj.render = function () {
	        var _this3 = this;
	
	        this.traceReact('Render');
	        (0, _batching.markRendered)(this);
	        return ratom.runInCtx(this, function () {
	            return oldRender.call(_this3, _this3.props);
	        });
	    };
	
	    var component = (0, _createReactClass2.default)(componentObj);
	    var factory = React.createFactory(component);
	    return function (props) {
	        return factory(props);
	    };
	}
	
	function createComponent(mixin, args) {
	    var componentObj = createComponentObj(mixin, args);
	    var oldRender = componentObj.render;
	    componentObj.render = function () {
	        var _this4 = this;
	
	        this.traceReact('Render');
	        (0, _batching.markRendered)(this);
	        return ratom.runInCtx(this, function () {
	            return oldRender.call(_this4, _this4.props);
	        });
	    };
	
	    return (0, _createReactClass2.default)(componentObj);
	}
	
	function createFactory(mixin, args) {
	    var component = createComponent(mixin, args);
	    var factory = React.createFactory(component);
	    return factory;
	}
	
	function uix(name, mixin, clazz) {
	    return createComponent([SubscriptionMixin(false)], arguments);
	}
	
	function ui(name, mixin, clazz) {
	    return createFactory([SubscriptionMixin(false)], arguments);
	}
	
	function vectorView(mixin, args) {
	    var componentObj = createComponentObj(mixin, args);
	    var oldRender = componentObj.render;
	    componentObj.render = function () {
	        var _this5 = this;
	
	        this.traceReact('Render');
	        (0, _batching.markRendered)(this);
	        return ratom.runInCtx(this, function () {
	            return oldRender.apply(_this5, _this5.props.argv);
	        });
	    };
	    var component = (0, _createReactClass2.default)(componentObj);
	    var factory = React.createFactory(component);
	
	    return function () {
	        return factory({ argv: Array.prototype.slice.call(arguments) });
	    };
	}
	
	function viewP() {
	    return propsView([StatelessMixin(false)], arguments);
	}
	
	function viewV() {
	    return vectorView([StatelessMixin(true)], arguments);
	}
	
	function viewSP() {
	    return propsView([SubscriptionMixin(false)], arguments);
	}
	
	function viewSV() {
	    return vectorView([SubscriptionMixin(true)], arguments);
	}

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_15__;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.shouldUpdateArgv = shouldUpdateArgv;
	exports.shouldUpdate = shouldUpdate;
	
	var _utils = __webpack_require__(17);
	
	var _immutable = __webpack_require__(3);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function isSameType(a, b, predicate) {
	    return predicate(a) && predicate(b);
	}
	
	function equals(a, b) {
	    if (isSameType(a, b, _utils.isPrimitive) || isSameType(a, b, _utils.isImmutable) || isSameType(a, b, _utils.isObservable)) {
	        return Immutable.is(a, b);
	    } else if ((0, _utils.isRxObservable)(a, b)) {
	        return a === b;
	    }
	    return false;
	}
	
	function shouldUpdateArgv(props, nextProps) {
	    if (props.length !== nextProps.length) {
	        return true;
	    }
	
	    var maxLength = Math.max(props.length, nextProps.length);
	    for (var i = 0; i < maxLength; i++) {
	        if (!equals(props[i], nextProps[i])) {
	            return true;
	        }
	    }
	    return false;
	}
	
	/**
	 * If props does not exist return false - Pure render mixin. If props exists and it contains mutable entries,
	 * return false. If props contains only immutable entries compare them by type.
	 *
	 * @param {object} props current props
	 * @param {object} nextProps new props
	 * @param {array} ignore ignore these keys
	 * @returns {boolean} true if component should be rerendered
	 */
	function shouldUpdate(props, nextProps) {
	    var ignore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
	
	    var keys1 = props ? Object.keys(props) : [];
	    var keys2 = nextProps ? Object.keys(nextProps) : [];
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;
	
	    try {
	        for (var _iterator = new Set(keys1.concat(keys2))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var prop = _step.value;
	
	            if (ignore.length > 0 && ignore.indexOf(prop) >= 0) {
	                continue;
	            }
	            if (!equals(props[prop], nextProps[prop])) {
	                return true;
	            }
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }
	
	    return false;
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	exports.isImmutable = isImmutable;
	exports.isPrimitive = isPrimitive;
	exports.isFunction = isFunction;
	exports.isObject = isObject;
	exports.isObservable = isObservable;
	exports.isRxObservable = isRxObservable;
	
	var _immutable = __webpack_require__(3);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	var _ratom = __webpack_require__(6);
	
	var _rx = __webpack_require__(7);
	
	var Rx = _interopRequireWildcard(_rx);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function isImmutable(maybeImmutable) {
	    return maybeImmutable instanceof Immutable.Iterable;
	}
	
	function isPrimitive(value) {
	    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	    return type === 'number' || type === 'boolean' || type === 'string' || value === null || value === void 0;
	}
	
	function isFunction(obj) {
	    return typeof obj === 'function';
	}
	
	function isObject(obj) {
	    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
	}
	
	function isObservable(obj) {
	    return obj instanceof _ratom.Observable;
	}
	
	function isRxObservable(obj) {
	    return obj instanceof Rx.Observable;
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */
	
	'use strict';
	
	var React = __webpack_require__(15);
	var factory = __webpack_require__(19);
	
	// Hack to grab NoopUpdateQueue from isomorphic React
	var ReactNoopUpdateQueue = new React.Component().updater;
	
	module.exports = factory(
	  React.Component,
	  React.isValidElement,
	  ReactNoopUpdateQueue
	);


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */
	
	'use strict';
	
	var _assign = __webpack_require__(21);
	
	var emptyObject = __webpack_require__(22);
	var _invariant = __webpack_require__(23);
	
	if (process.env.NODE_ENV !== 'production') {
	  var warning = __webpack_require__(24);
	}
	
	var MIXINS_KEY = 'mixins';
	
	// Helper function to allow the creation of anonymous functions which do not
	// have .name set to the name of the variable being assigned to.
	function identity(fn) {
	  return fn;
	}
	
	var ReactPropTypeLocationNames;
	if (process.env.NODE_ENV !== 'production') {
	  ReactPropTypeLocationNames = {
	    prop: 'prop',
	    context: 'context',
	    childContext: 'child context',
	  };
	} else {
	  ReactPropTypeLocationNames = {};
	}
	
	function factory(ReactComponent, isValidElement, ReactNoopUpdateQueue) {
	  /**
	   * Policies that describe methods in `ReactClassInterface`.
	   */
	
	
	  var injectedMixins = [];
	
	  /**
	   * Composite components are higher-level components that compose other composite
	   * or host components.
	   *
	   * To create a new type of `ReactClass`, pass a specification of
	   * your new class to `React.createClass`. The only requirement of your class
	   * specification is that you implement a `render` method.
	   *
	   *   var MyComponent = React.createClass({
	   *     render: function() {
	   *       return <div>Hello World</div>;
	   *     }
	   *   });
	   *
	   * The class specification supports a specific protocol of methods that have
	   * special meaning (e.g. `render`). See `ReactClassInterface` for
	   * more the comprehensive protocol. Any other properties and methods in the
	   * class specification will be available on the prototype.
	   *
	   * @interface ReactClassInterface
	   * @internal
	   */
	  var ReactClassInterface = {
	
	    /**
	     * An array of Mixin objects to include when defining your component.
	     *
	     * @type {array}
	     * @optional
	     */
	    mixins: 'DEFINE_MANY',
	
	    /**
	     * An object containing properties and methods that should be defined on
	     * the component's constructor instead of its prototype (static methods).
	     *
	     * @type {object}
	     * @optional
	     */
	    statics: 'DEFINE_MANY',
	
	    /**
	     * Definition of prop types for this component.
	     *
	     * @type {object}
	     * @optional
	     */
	    propTypes: 'DEFINE_MANY',
	
	    /**
	     * Definition of context types for this component.
	     *
	     * @type {object}
	     * @optional
	     */
	    contextTypes: 'DEFINE_MANY',
	
	    /**
	     * Definition of context types this component sets for its children.
	     *
	     * @type {object}
	     * @optional
	     */
	    childContextTypes: 'DEFINE_MANY',
	
	    // ==== Definition methods ====
	
	    /**
	     * Invoked when the component is mounted. Values in the mapping will be set on
	     * `this.props` if that prop is not specified (i.e. using an `in` check).
	     *
	     * This method is invoked before `getInitialState` and therefore cannot rely
	     * on `this.state` or use `this.setState`.
	     *
	     * @return {object}
	     * @optional
	     */
	    getDefaultProps: 'DEFINE_MANY_MERGED',
	
	    /**
	     * Invoked once before the component is mounted. The return value will be used
	     * as the initial value of `this.state`.
	     *
	     *   getInitialState: function() {
	     *     return {
	     *       isOn: false,
	     *       fooBaz: new BazFoo()
	     *     }
	     *   }
	     *
	     * @return {object}
	     * @optional
	     */
	    getInitialState: 'DEFINE_MANY_MERGED',
	
	    /**
	     * @return {object}
	     * @optional
	     */
	    getChildContext: 'DEFINE_MANY_MERGED',
	
	    /**
	     * Uses props from `this.props` and state from `this.state` to render the
	     * structure of the component.
	     *
	     * No guarantees are made about when or how often this method is invoked, so
	     * it must not have side effects.
	     *
	     *   render: function() {
	     *     var name = this.props.name;
	     *     return <div>Hello, {name}!</div>;
	     *   }
	     *
	     * @return {ReactComponent}
	     * @nosideeffects
	     * @required
	     */
	    render: 'DEFINE_ONCE',
	
	    // ==== Delegate methods ====
	
	    /**
	     * Invoked when the component is initially created and about to be mounted.
	     * This may have side effects, but any external subscriptions or data created
	     * by this method must be cleaned up in `componentWillUnmount`.
	     *
	     * @optional
	     */
	    componentWillMount: 'DEFINE_MANY',
	
	    /**
	     * Invoked when the component has been mounted and has a DOM representation.
	     * However, there is no guarantee that the DOM node is in the document.
	     *
	     * Use this as an opportunity to operate on the DOM when the component has
	     * been mounted (initialized and rendered) for the first time.
	     *
	     * @param {DOMElement} rootNode DOM element representing the component.
	     * @optional
	     */
	    componentDidMount: 'DEFINE_MANY',
	
	    /**
	     * Invoked before the component receives new props.
	     *
	     * Use this as an opportunity to react to a prop transition by updating the
	     * state using `this.setState`. Current props are accessed via `this.props`.
	     *
	     *   componentWillReceiveProps: function(nextProps, nextContext) {
	     *     this.setState({
	     *       likesIncreasing: nextProps.likeCount > this.props.likeCount
	     *     });
	     *   }
	     *
	     * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
	     * transition may cause a state change, but the opposite is not true. If you
	     * need it, you are probably looking for `componentWillUpdate`.
	     *
	     * @param {object} nextProps
	     * @optional
	     */
	    componentWillReceiveProps: 'DEFINE_MANY',
	
	    /**
	     * Invoked while deciding if the component should be updated as a result of
	     * receiving new props, state and/or context.
	     *
	     * Use this as an opportunity to `return false` when you're certain that the
	     * transition to the new props/state/context will not require a component
	     * update.
	     *
	     *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
	     *     return !equal(nextProps, this.props) ||
	     *       !equal(nextState, this.state) ||
	     *       !equal(nextContext, this.context);
	     *   }
	     *
	     * @param {object} nextProps
	     * @param {?object} nextState
	     * @param {?object} nextContext
	     * @return {boolean} True if the component should update.
	     * @optional
	     */
	    shouldComponentUpdate: 'DEFINE_ONCE',
	
	    /**
	     * Invoked when the component is about to update due to a transition from
	     * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
	     * and `nextContext`.
	     *
	     * Use this as an opportunity to perform preparation before an update occurs.
	     *
	     * NOTE: You **cannot** use `this.setState()` in this method.
	     *
	     * @param {object} nextProps
	     * @param {?object} nextState
	     * @param {?object} nextContext
	     * @param {ReactReconcileTransaction} transaction
	     * @optional
	     */
	    componentWillUpdate: 'DEFINE_MANY',
	
	    /**
	     * Invoked when the component's DOM representation has been updated.
	     *
	     * Use this as an opportunity to operate on the DOM when the component has
	     * been updated.
	     *
	     * @param {object} prevProps
	     * @param {?object} prevState
	     * @param {?object} prevContext
	     * @param {DOMElement} rootNode DOM element representing the component.
	     * @optional
	     */
	    componentDidUpdate: 'DEFINE_MANY',
	
	    /**
	     * Invoked when the component is about to be removed from its parent and have
	     * its DOM representation destroyed.
	     *
	     * Use this as an opportunity to deallocate any external resources.
	     *
	     * NOTE: There is no `componentDidUnmount` since your component will have been
	     * destroyed by that point.
	     *
	     * @optional
	     */
	    componentWillUnmount: 'DEFINE_MANY',
	
	    // ==== Advanced methods ====
	
	    /**
	     * Updates the component's currently mounted DOM representation.
	     *
	     * By default, this implements React's rendering and reconciliation algorithm.
	     * Sophisticated clients may wish to override this.
	     *
	     * @param {ReactReconcileTransaction} transaction
	     * @internal
	     * @overridable
	     */
	    updateComponent: 'OVERRIDE_BASE'
	
	  };
	
	  /**
	   * Mapping from class specification keys to special processing functions.
	   *
	   * Although these are declared like instance properties in the specification
	   * when defining classes using `React.createClass`, they are actually static
	   * and are accessible on the constructor instead of the prototype. Despite
	   * being static, they must be defined outside of the "statics" key under
	   * which all other static methods are defined.
	   */
	  var RESERVED_SPEC_KEYS = {
	    displayName: function (Constructor, displayName) {
	      Constructor.displayName = displayName;
	    },
	    mixins: function (Constructor, mixins) {
	      if (mixins) {
	        for (var i = 0; i < mixins.length; i++) {
	          mixSpecIntoComponent(Constructor, mixins[i]);
	        }
	      }
	    },
	    childContextTypes: function (Constructor, childContextTypes) {
	      if (process.env.NODE_ENV !== 'production') {
	        validateTypeDef(Constructor, childContextTypes, 'childContext');
	      }
	      Constructor.childContextTypes = _assign({}, Constructor.childContextTypes, childContextTypes);
	    },
	    contextTypes: function (Constructor, contextTypes) {
	      if (process.env.NODE_ENV !== 'production') {
	        validateTypeDef(Constructor, contextTypes, 'context');
	      }
	      Constructor.contextTypes = _assign({}, Constructor.contextTypes, contextTypes);
	    },
	    /**
	     * Special case getDefaultProps which should move into statics but requires
	     * automatic merging.
	     */
	    getDefaultProps: function (Constructor, getDefaultProps) {
	      if (Constructor.getDefaultProps) {
	        Constructor.getDefaultProps = createMergedResultFunction(Constructor.getDefaultProps, getDefaultProps);
	      } else {
	        Constructor.getDefaultProps = getDefaultProps;
	      }
	    },
	    propTypes: function (Constructor, propTypes) {
	      if (process.env.NODE_ENV !== 'production') {
	        validateTypeDef(Constructor, propTypes, 'prop');
	      }
	      Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
	    },
	    statics: function (Constructor, statics) {
	      mixStaticSpecIntoComponent(Constructor, statics);
	    },
	    autobind: function () {} };
	
	  function validateTypeDef(Constructor, typeDef, location) {
	    for (var propName in typeDef) {
	      if (typeDef.hasOwnProperty(propName)) {
	        // use a warning instead of an _invariant so components
	        // don't show up in prod but only in __DEV__
	        process.env.NODE_ENV !== 'production' ? warning(typeof typeDef[propName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', Constructor.displayName || 'ReactClass', ReactPropTypeLocationNames[location], propName) : void 0;
	      }
	    }
	  }
	
	  function validateMethodOverride(isAlreadyDefined, name) {
	    var specPolicy = ReactClassInterface.hasOwnProperty(name) ? ReactClassInterface[name] : null;
	
	    // Disallow overriding of base class methods unless explicitly allowed.
	    if (ReactClassMixin.hasOwnProperty(name)) {
	      _invariant(specPolicy === 'OVERRIDE_BASE', 'ReactClassInterface: You are attempting to override ' + '`%s` from your class specification. Ensure that your method names ' + 'do not overlap with React methods.', name);
	    }
	
	    // Disallow defining methods more than once unless explicitly allowed.
	    if (isAlreadyDefined) {
	      _invariant(specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED', 'ReactClassInterface: You are attempting to define ' + '`%s` on your component more than once. This conflict may be due ' + 'to a mixin.', name);
	    }
	  }
	
	  /**
	   * Mixin helper which handles policy validation and reserved
	   * specification keys when building React classes.
	   */
	  function mixSpecIntoComponent(Constructor, spec) {
	    if (!spec) {
	      if (process.env.NODE_ENV !== 'production') {
	        var typeofSpec = typeof spec;
	        var isMixinValid = typeofSpec === 'object' && spec !== null;
	
	        process.env.NODE_ENV !== 'production' ? warning(isMixinValid, '%s: You\'re attempting to include a mixin that is either null ' + 'or not an object. Check the mixins included by the component, ' + 'as well as any mixins they include themselves. ' + 'Expected object but got %s.', Constructor.displayName || 'ReactClass', spec === null ? null : typeofSpec) : void 0;
	      }
	
	      return;
	    }
	
	    _invariant(typeof spec !== 'function', 'ReactClass: You\'re attempting to ' + 'use a component class or function as a mixin. Instead, just use a ' + 'regular object.');
	    _invariant(!isValidElement(spec), 'ReactClass: You\'re attempting to ' + 'use a component as a mixin. Instead, just use a regular object.');
	
	    var proto = Constructor.prototype;
	    var autoBindPairs = proto.__reactAutoBindPairs;
	
	    // By handling mixins before any other properties, we ensure the same
	    // chaining order is applied to methods with DEFINE_MANY policy, whether
	    // mixins are listed before or after these methods in the spec.
	    if (spec.hasOwnProperty(MIXINS_KEY)) {
	      RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
	    }
	
	    for (var name in spec) {
	      if (!spec.hasOwnProperty(name)) {
	        continue;
	      }
	
	      if (name === MIXINS_KEY) {
	        // We have already handled mixins in a special case above.
	        continue;
	      }
	
	      var property = spec[name];
	      var isAlreadyDefined = proto.hasOwnProperty(name);
	      validateMethodOverride(isAlreadyDefined, name);
	
	      if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
	        RESERVED_SPEC_KEYS[name](Constructor, property);
	      } else {
	        // Setup methods on prototype:
	        // The following member methods should not be automatically bound:
	        // 1. Expected ReactClass methods (in the "interface").
	        // 2. Overridden methods (that were mixed in).
	        var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
	        var isFunction = typeof property === 'function';
	        var shouldAutoBind = isFunction && !isReactClassMethod && !isAlreadyDefined && spec.autobind !== false;
	
	        if (shouldAutoBind) {
	          autoBindPairs.push(name, property);
	          proto[name] = property;
	        } else {
	          if (isAlreadyDefined) {
	            var specPolicy = ReactClassInterface[name];
	
	            // These cases should already be caught by validateMethodOverride.
	            _invariant(isReactClassMethod && (specPolicy === 'DEFINE_MANY_MERGED' || specPolicy === 'DEFINE_MANY'), 'ReactClass: Unexpected spec policy %s for key %s ' + 'when mixing in component specs.', specPolicy, name);
	
	            // For methods which are defined more than once, call the existing
	            // methods before calling the new property, merging if appropriate.
	            if (specPolicy === 'DEFINE_MANY_MERGED') {
	              proto[name] = createMergedResultFunction(proto[name], property);
	            } else if (specPolicy === 'DEFINE_MANY') {
	              proto[name] = createChainedFunction(proto[name], property);
	            }
	          } else {
	            proto[name] = property;
	            if (process.env.NODE_ENV !== 'production') {
	              // Add verbose displayName to the function, which helps when looking
	              // at profiling tools.
	              if (typeof property === 'function' && spec.displayName) {
	                proto[name].displayName = spec.displayName + '_' + name;
	              }
	            }
	          }
	        }
	      }
	    }
	  }
	
	  function mixStaticSpecIntoComponent(Constructor, statics) {
	    if (!statics) {
	      return;
	    }
	    for (var name in statics) {
	      var property = statics[name];
	      if (!statics.hasOwnProperty(name)) {
	        continue;
	      }
	
	      var isReserved = name in RESERVED_SPEC_KEYS;
	      _invariant(!isReserved, 'ReactClass: You are attempting to define a reserved ' + 'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' + 'as an instance property instead; it will still be accessible on the ' + 'constructor.', name);
	
	      var isInherited = name in Constructor;
	      _invariant(!isInherited, 'ReactClass: You are attempting to define ' + '`%s` on your component more than once. This conflict may be ' + 'due to a mixin.', name);
	      Constructor[name] = property;
	    }
	  }
	
	  /**
	   * Merge two objects, but throw if both contain the same key.
	   *
	   * @param {object} one The first object, which is mutated.
	   * @param {object} two The second object
	   * @return {object} one after it has been mutated to contain everything in two.
	   */
	  function mergeIntoWithNoDuplicateKeys(one, two) {
	    _invariant(one && two && typeof one === 'object' && typeof two === 'object', 'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.');
	
	    for (var key in two) {
	      if (two.hasOwnProperty(key)) {
	        _invariant(one[key] === undefined, 'mergeIntoWithNoDuplicateKeys(): ' + 'Tried to merge two objects with the same key: `%s`. This conflict ' + 'may be due to a mixin; in particular, this may be caused by two ' + 'getInitialState() or getDefaultProps() methods returning objects ' + 'with clashing keys.', key);
	        one[key] = two[key];
	      }
	    }
	    return one;
	  }
	
	  /**
	   * Creates a function that invokes two functions and merges their return values.
	   *
	   * @param {function} one Function to invoke first.
	   * @param {function} two Function to invoke second.
	   * @return {function} Function that invokes the two argument functions.
	   * @private
	   */
	  function createMergedResultFunction(one, two) {
	    return function mergedResult() {
	      var a = one.apply(this, arguments);
	      var b = two.apply(this, arguments);
	      if (a == null) {
	        return b;
	      } else if (b == null) {
	        return a;
	      }
	      var c = {};
	      mergeIntoWithNoDuplicateKeys(c, a);
	      mergeIntoWithNoDuplicateKeys(c, b);
	      return c;
	    };
	  }
	
	  /**
	   * Creates a function that invokes two functions and ignores their return vales.
	   *
	   * @param {function} one Function to invoke first.
	   * @param {function} two Function to invoke second.
	   * @return {function} Function that invokes the two argument functions.
	   * @private
	   */
	  function createChainedFunction(one, two) {
	    return function chainedFunction() {
	      one.apply(this, arguments);
	      two.apply(this, arguments);
	    };
	  }
	
	  /**
	   * Binds a method to the component.
	   *
	   * @param {object} component Component whose method is going to be bound.
	   * @param {function} method Method to be bound.
	   * @return {function} The bound method.
	   */
	  function bindAutoBindMethod(component, method) {
	    var boundMethod = method.bind(component);
	    if (process.env.NODE_ENV !== 'production') {
	      boundMethod.__reactBoundContext = component;
	      boundMethod.__reactBoundMethod = method;
	      boundMethod.__reactBoundArguments = null;
	      var componentName = component.constructor.displayName;
	      var _bind = boundMethod.bind;
	      boundMethod.bind = function (newThis) {
	        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	          args[_key - 1] = arguments[_key];
	        }
	
	        // User is trying to bind() an autobound method; we effectively will
	        // ignore the value of "this" that the user is trying to use, so
	        // let's warn.
	        if (newThis !== component && newThis !== null) {
	          process.env.NODE_ENV !== 'production' ? warning(false, 'bind(): React component methods may only be bound to the ' + 'component instance. See %s', componentName) : void 0;
	        } else if (!args.length) {
	          process.env.NODE_ENV !== 'production' ? warning(false, 'bind(): You are binding a component method to the component. ' + 'React does this for you automatically in a high-performance ' + 'way, so you can safely remove this call. See %s', componentName) : void 0;
	          return boundMethod;
	        }
	        var reboundMethod = _bind.apply(boundMethod, arguments);
	        reboundMethod.__reactBoundContext = component;
	        reboundMethod.__reactBoundMethod = method;
	        reboundMethod.__reactBoundArguments = args;
	        return reboundMethod;
	      };
	    }
	    return boundMethod;
	  }
	
	  /**
	   * Binds all auto-bound methods in a component.
	   *
	   * @param {object} component Component whose method is going to be bound.
	   */
	  function bindAutoBindMethods(component) {
	    var pairs = component.__reactAutoBindPairs;
	    for (var i = 0; i < pairs.length; i += 2) {
	      var autoBindKey = pairs[i];
	      var method = pairs[i + 1];
	      component[autoBindKey] = bindAutoBindMethod(component, method);
	    }
	  }
	
	  var IsMountedMixin = {
	    componentDidMount: function () {
	      this.__isMounted = true;
	    },
	    componentWillUnmount: function () {
	      this.__isMounted = false;
	    }
	  };
	
	  /**
	   * Add more to the ReactClass base class. These are all legacy features and
	   * therefore not already part of the modern ReactComponent.
	   */
	  var ReactClassMixin = {
	
	    /**
	     * TODO: This will be deprecated because state should always keep a consistent
	     * type signature and the only use case for this, is to avoid that.
	     */
	    replaceState: function (newState, callback) {
	      this.updater.enqueueReplaceState(this, newState, callback);
	    },
	
	    /**
	     * Checks whether or not this composite component is mounted.
	     * @return {boolean} True if mounted, false otherwise.
	     * @protected
	     * @final
	     */
	    isMounted: function () {
	      if (process.env.NODE_ENV !== 'production') {
	        process.env.NODE_ENV !== 'production' ? warning(this.__didWarnIsMounted, '%s: isMounted is deprecated. Instead, make sure to clean up ' + 'subscriptions and pending requests in componentWillUnmount to ' + 'prevent memory leaks.', this.constructor && this.constructor.displayName || this.name || 'Component') : void 0;
	        this.__didWarnIsMounted = true;
	      }
	      return !!this.__isMounted;
	    }
	  };
	
	  var ReactClassComponent = function () {};
	  _assign(ReactClassComponent.prototype, ReactComponent.prototype, ReactClassMixin);
	
	  /**
	   * Creates a composite component class given a class specification.
	   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
	   *
	   * @param {object} spec Class specification (which must define `render`).
	   * @return {function} Component constructor function.
	   * @public
	   */
	  function createClass(spec) {
	    // To keep our warnings more understandable, we'll use a little hack here to
	    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
	    // unnecessarily identify a class without displayName as 'Constructor'.
	    var Constructor = identity(function (props, context, updater) {
	      // This constructor gets overridden by mocks. The argument is used
	      // by mocks to assert on what gets mounted.
	
	      if (process.env.NODE_ENV !== 'production') {
	        process.env.NODE_ENV !== 'production' ? warning(this instanceof Constructor, 'Something is calling a React component directly. Use a factory or ' + 'JSX instead. See: https://fb.me/react-legacyfactory') : void 0;
	      }
	
	      // Wire up auto-binding
	      if (this.__reactAutoBindPairs.length) {
	        bindAutoBindMethods(this);
	      }
	
	      this.props = props;
	      this.context = context;
	      this.refs = emptyObject;
	      this.updater = updater || ReactNoopUpdateQueue;
	
	      this.state = null;
	
	      // ReactClasses doesn't have constructors. Instead, they use the
	      // getInitialState and componentWillMount methods for initialization.
	
	      var initialState = this.getInitialState ? this.getInitialState() : null;
	      if (process.env.NODE_ENV !== 'production') {
	        // We allow auto-mocks to proceed as if they're returning null.
	        if (initialState === undefined && this.getInitialState._isMockFunction) {
	          // This is probably bad practice. Consider warning here and
	          // deprecating this convenience.
	          initialState = null;
	        }
	      }
	      _invariant(typeof initialState === 'object' && !Array.isArray(initialState), '%s.getInitialState(): must return an object or null', Constructor.displayName || 'ReactCompositeComponent');
	
	      this.state = initialState;
	    });
	    Constructor.prototype = new ReactClassComponent();
	    Constructor.prototype.constructor = Constructor;
	    Constructor.prototype.__reactAutoBindPairs = [];
	
	    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));
	
	    mixSpecIntoComponent(Constructor, IsMountedMixin);
	    mixSpecIntoComponent(Constructor, spec);
	
	    // Initialize the defaultProps property after all mixins have been merged.
	    if (Constructor.getDefaultProps) {
	      Constructor.defaultProps = Constructor.getDefaultProps();
	    }
	
	    if (process.env.NODE_ENV !== 'production') {
	      // This is a tag to indicate that the use of these method names is ok,
	      // since it's used with createClass. If it's not, then it's likely a
	      // mistake so we'll warn you to use the static property, property
	      // initializer or constructor respectively.
	      if (Constructor.getDefaultProps) {
	        Constructor.getDefaultProps.isReactClassApproved = {};
	      }
	      if (Constructor.prototype.getInitialState) {
	        Constructor.prototype.getInitialState.isReactClassApproved = {};
	      }
	    }
	
	    _invariant(Constructor.prototype.render, 'createClass(...): Class specification must implement a `render` method.');
	
	    if (process.env.NODE_ENV !== 'production') {
	      process.env.NODE_ENV !== 'production' ? warning(!Constructor.prototype.componentShouldUpdate, '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', spec.displayName || 'A component') : void 0;
	      process.env.NODE_ENV !== 'production' ? warning(!Constructor.prototype.componentWillRecieveProps, '%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', spec.displayName || 'A component') : void 0;
	    }
	
	    // Reduce time spent doing lookups by setting these on the prototype.
	    for (var methodName in ReactClassInterface) {
	      if (!Constructor.prototype[methodName]) {
	        Constructor.prototype[methodName] = null;
	      }
	    }
	
	    return Constructor;
	  }
	
	  return createClass;
	}
	
	module.exports = factory;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20)))

/***/ },
/* 20 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 21 */
/***/ function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/
	
	'use strict';
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	
	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}
	
			// Detect buggy property enumeration order in older V8 versions.
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}
	
			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}
	
	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;
	
		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);
	
			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}
	
			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}
	
		return to;
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */
	
	'use strict';
	
	var emptyObject = {};
	
	if (process.env.NODE_ENV !== 'production') {
	  Object.freeze(emptyObject);
	}
	
	module.exports = emptyObject;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20)))

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */
	
	'use strict';
	
	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */
	
	var validateFormat = function validateFormat(format) {};
	
	if (process.env.NODE_ENV !== 'production') {
	  validateFormat = function validateFormat(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}
	
	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);
	
	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }
	
	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}
	
	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20)))

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */
	
	'use strict';
	
	var emptyFunction = __webpack_require__(25);
	
	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */
	
	var warning = emptyFunction;
	
	if (process.env.NODE_ENV !== 'production') {
	  (function () {
	    var printWarning = function printWarning(format) {
	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }
	
	      var argIndex = 0;
	      var message = 'Warning: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      });
	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }
	      try {
	        // --- Welcome to debugging React ---
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch (x) {}
	    };
	
	    warning = function warning(condition, format) {
	      if (format === undefined) {
	        throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	      }
	
	      if (format.indexOf('Failed Composite propType: ') === 0) {
	        return; // Ignore CompositeComponent proptype check.
	      }
	
	      if (!condition) {
	        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	          args[_key2 - 2] = arguments[_key2];
	        }
	
	        printWarning.apply(undefined, [format].concat(args));
	      }
	    };
	  })();
	}
	
	module.exports = warning;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20)))

/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */
	
	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}
	
	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	var emptyFunction = function emptyFunction() {};
	
	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};
	
	module.exports = emptyFunction;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.trimv = exports.debug = undefined;
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.dbHandlerToInterceptor = dbHandlerToInterceptor;
	exports.fxHandlerToInterceptor = fxHandlerToInterceptor;
	exports.ctxHandlerToInterceptor = ctxHandlerToInterceptor;
	exports.path = path;
	exports.enrich = enrich;
	exports.after = after;
	exports.onChanges = onChanges;
	exports.when = when;
	
	var _interceptor = __webpack_require__(4);
	
	var _immutablediff = __webpack_require__(27);
	
	var _immutablediff2 = _interopRequireDefault(_immutablediff);
	
	var _immutable = __webpack_require__(3);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var debug = exports.debug = (0, _interceptor.toInterceptor)({
	    id: 'debug',
	    before: function debugBefore(ctx) {
	        console.log('Handling re-frame event:', (0, _interceptor.getCoeffect)(ctx, 'event'));
	        return ctx;
	    },
	    after: function debugAfter(ctx) {
	        var event = (0, _interceptor.getCoeffect)(ctx, 'event'),
	            origDb = (0, _interceptor.getCoeffect)(ctx, 'db'),
	            newDb = (0, _interceptor.getEffect)(ctx, 'db', 'not-found'),
	            effectsWithoutDb = ctx.getIn(['effects'], Immutable.Map()).delete('db');
	
	        if (newDb === 'not-found') {
	            console.log('No :db changes caused by:', event);
	        } else {
	            var diff = (0, _immutablediff2.default)(origDb, newDb);
	            if (diff.length === 0) {
	                console.log('No :db changes caused by:', event);
	            } else {
	                console.groupCollapsed('db diff for: ', event);
	                try {
	                    diff.forEach(function (df) {
	                        console.log(df.get('op'), df.get('path'), df.get('value'));
	                    });
	                } finally {
	                    console.groupEnd();
	                }
	            }
	        }
	
	        if (effectsWithoutDb.size > 0) {
	            console.log('Effects caused by ', event, effectsWithoutDb);
	        }
	
	        return ctx;
	    }
	});
	
	var trimv = exports.trimv = (0, _interceptor.toInterceptor)({
	    id: 'trim-v',
	    before: function trimvBefore(ctx) {
	        return ctx.updateIn(['coeffects', 'event'], function (event) {
	            return event.slice(1);
	        }).setIn(['coeffects', 'untrimmed-event'], (0, _interceptor.getCoeffect)(ctx, 'event'));
	    },
	    after: function trimvAfter(ctx) {
	        return ctx.deleteIn(['coeffects', 'untrimmed-event']).setIn(['coeffects', 'event'], (0, _interceptor.getCoeffect)(ctx, 'untrimmed-event'));
	    }
	});
	
	// Interceptor Factories - PART 1
	
	/**
	 * Returns an interceptor which wraps the kind of event handler given to `reg-event-db`.
	 * These handlers take two arguments;  `db` and `event`, and they return `db`.
	 * (fn [db event]
	 * ....)
	 * So, the interceptor wraps the given handler:
	 * 1. extracts two `:coeffects` keys: db and event
	 * 2. calls handler-fn
	 * 3. stores the db result back into context's `:effects`
	 * @param db
	 * @param event
	 */
	function dbHandlerToInterceptor(handlerFn) {
	    return (0, _interceptor.toInterceptor)({
	        id: 'db-handler',
	        before: function dbHandlerBefore(ctx) {
	            var db = (0, _interceptor.getCoeffect)(ctx, 'db'),
	                event = (0, _interceptor.getCoeffect)(ctx, 'event');
	
	            return (0, _interceptor.assocEffect)(ctx, 'db', handlerFn(db, event));
	        }
	    });
	}
	
	/**
	 * Returns an interceptor which wraps the kind of event handler given to `reg-event-fx`.
	 * These handlers take two arguments;  `coeffects` and `event`, and they return `effects`.
	 * (fn [coeffects event]
	 * {:db ...
	 *  :dispatch ...})
	 * Wrap handler in an interceptor so it can be added to (the RHS) of a chain:
	 * 1. extracts `:coeffects`
	 * 2. call handler-fn giving coeffects
	 * 3. stores the result back into the `:effects`
	 */
	function fxHandlerToInterceptor(handlerFn) {
	    return (0, _interceptor.toInterceptor)({
	        id: 'fx-handler',
	        before: function fxHandlerBefore(ctx) {
	            var event = (0, _interceptor.getCoeffect)(ctx, 'event');
	            return ctx.set('effects', Immutable.Map(handlerFn(ctx.get('coeffects').toObject(), event)));
	        }
	    });
	}
	
	/**
	 * Returns an interceptor which wraps the kind of event handler given to `reg-event-ctx`.
	 * These advanced handlers take one argument: `context` and they return a modified `context`.
	 * Example:
	 * (fn [context]
	 * (enqueue context [more interceptors]))
	 */
	function ctxHandlerToInterceptor(handlerFn) {
	    return (0, _interceptor.toInterceptor)({
	        id: 'ctx-handler',
	        before: handlerFn
	    });
	}
	
	// Interceptors Factories -  PART 2
	
	/**
	 * An interceptor factory which supplies a sub-path of `:db` to the handler.
	 * It's action is somewhat analogous to `update-in`. It grafts the return
	 * value from the handler back into db.
	 * Usage:
	 * (path :some :path)
	 * (path [:some :path])
	 * (path [:some :path] :to :here)
	 * (path [:some :path] [:to] :here)
	 * Notes:
	 * 1. cater for `path` appearing more than once in an interceptor chain.
	 * 2. `:effects` may not contain `:db` effect. Which means no change to
	 * `:db` should be made.
	 */
	function path(path) {
	    var dbStoreKey = 'reframe-path/db-store';
	    return (0, _interceptor.toInterceptor)({
	        id: 'path',
	        before: function pathBefore(ctx) {
	            var originalDb = (0, _interceptor.getCoeffect)(ctx, 'db');
	
	            ctx = ctx.update(dbStoreKey, Immutable.List(), function (old) {
	                return old.push(originalDb);
	            });
	            ctx = (0, _interceptor.assocCoeffect)(ctx, 'db', originalDb.getIn(path, Immutable.Map()));
	            return ctx;
	        },
	        after: function pathAfter(ctx) {
	            var dbStore = ctx.get(dbStoreKey),
	                originalDb = dbStore.last(),
	                newDbStore = dbStore.pop(),
	                ctx1 = (0, _interceptor.assocCoeffect)(ctx.set(dbStoreKey, newDbStore), 'db', originalDb),
	                db = (0, _interceptor.getEffect)(ctx, 'db', 'not-found');
	
	            if (db === 'not-found') {
	                return ctx1;
	            } else {
	                return (0, _interceptor.assocEffect)(ctx1, 'db', originalDb.setIn(path, db));
	            }
	        }
	    });
	}
	
	/**
	 * Interceptor factory which runs the given function `f` in the `after handler`
	 * position.  `f` is called with two arguments: `db` and `v`, and is expected to
	 * return a modified `db`.
	 * Unlike the `after` inteceptor which is only about side effects, `enrich`
	 * expects `f` to process and alter the given `db` coeffect in some useful way,
	 * contributing to the derived data, flowing vibe.
	 * Example Use:
	 * ------------
	 * Imagine that todomvc needed to do duplicate detection - if any two todos had
	 * the same text, then highlight their background, and report them in a warning
	 * down the bottom of the panel.
	 * Almost any user action (edit text, add new todo, remove a todo) requires a
	 * complete reassesment of duplication errors and warnings. Eg: that edit
	 * just made might have introduced a new duplicate, or removed one. Same with
	 * any todo removal. So we need to re-calculate warnings after any CRUD events
	 * associated with the todos list.
	 * Unless we are careful, we might end up coding subtly different checks
	 * for each kind of CRUD operation.  The duplicates check made after
	 * 'delete todo' event might be subtly different to that done after an
	 * eddting operation. Nice and efficient, but fiddly. A bug generator
	 * approach.
	 * So, instead, we create an `f` which recalcualtes warnings from scratch
	 * every time there is ANY change. It will inspect all the todos, and
	 * reset ALL FLAGS every time (overwriting what was there previously)
	 * and fully recalculate the list of duplicates (displayed at the bottom?).
	 * By applying `f` in an `:enrich` interceptor, after every CRUD event,
	 * we keep the handlers simple and yet we ensure this important step
	 * (of getting warnings right) is not missed on any change.
	 * We can test `f` easily - it is a pure fucntions - independently of
	 * any CRUD operation.
	 * This brings huge simplicity at the expense of some re-computation
	 * each time. This may be a very satisfactory tradeoff in many cases.
	 */
	function enrich(f) {
	    return (0, _interceptor.toInterceptor)({
	        id: 'enrich',
	        after: function enrichAfter(ctx) {
	            var event = (0, _interceptor.getCoeffect)(ctx, 'event'),
	                db = (0, _interceptor.getEffect)(ctx, 'db') || (0, _interceptor.getCoeffect)(ctx, 'db');
	
	            return (0, _interceptor.assocEffect)(ctx, 'db', f(db, event, (0, _interceptor.getCoeffect)(ctx, 'db')));
	        }
	    });
	}
	
	/**
	 * Interceptor factory which runs a given function `f` in the \"after\"
	 * position, presumably for side effects.
	 * `f` is called with two arguments: the `effects` value of `:db`
	 * (or the `coeffect` value of db if no db effect is returned) and the event.
	 * Its return value is ignored so `f` can only side-effect.
	 * Example use:
	 * - `f` runs schema validation (reporting any errors found)
	 * - `f` writes some aspect of db to localstorage.
	 *
	 */
	function after(f) {
	    return (0, _interceptor.toInterceptor)({
	        id: 'after',
	        after: function afterAfter(ctx) {
	            var event = (0, _interceptor.getCoeffect)(ctx, 'event'),
	                db = (0, _interceptor.getEffect)(ctx, 'db') || (0, _interceptor.getCoeffect)(ctx, 'db');
	            f(db, event, (0, _interceptor.getCoeffect)(ctx, 'db'));
	            return ctx;
	        }
	    });
	}
	
	/**
	 * Interceptor factory which acts a bit like `reaction`  (but it flows into `db`, rather than out)
	 * It observes N paths in `db` and if any of them test not indentical? to their previous value
	 * (as a result of a handler being run) then it runs `f` to compute a new value, which is
	 * then assoced into the given `out-path` within `db`.
	 * Usage:
	 * (defn my-f
	 * [a-val b-val]
	 * ... some computation on a and b in here)
	 * (on-changes my-f [:c]  [:a] [:b])
	 * Put this Interceptor on the right handlers (ones which might change :a or :b).
	 * It will:
	 * - call `f` each time the value at path [:a] or [:b] changes
	 * - call `f` with the values extracted from [:a] [:b]
	 * - assoc the return value from `f` into the path  [:c]
	 */
	function onChanges(f, outPath) {
	    for (var _len = arguments.length, inPaths = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	        inPaths[_key - 2] = arguments[_key];
	    }
	
	    return (0, _interceptor.toInterceptor)({
	        id: 'on-changes',
	        after: function onChangesAfter(ctx) {
	            var oldDb = (0, _interceptor.getCoeffect)(ctx, 'db'),
	                newDb = (0, _interceptor.getEffect)(ctx, 'db'),
	                newIns = inPaths.map(function (path) {
	                return newDb.getIn(path);
	            }),
	                oldIns = inPaths.map(function (path) {
	                return oldDb.getIn(path);
	            }),
	                changedIns = newIns.zip(oldIns).map(function (_ref) {
	                var _ref2 = _slicedToArray(_ref, 2),
	                    a = _ref2[0],
	                    b = _ref2[1];
	
	                return a === b;
	            }).contains(false);
	
	            if (changedIns) {
	                return (0, _interceptor.assocEffect)(ctx, 'db', newDb.setIn(outPath, f(newIns)));
	            }
	            return ctx;
	
	            return ctx;
	        }
	    });
	}
	
	function when(booleanProvider, interceptor) {
	    return (0, _interceptor.toInterceptor)({
	        id: 'when',
	        before: function whenBefore(ctx) {
	            if (booleanProvider()) {
	                return (0, _interceptor.nextInterceptor)(ctx, interceptor);
	            }
	            return ctx;
	        }
	    });
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Immutable = __webpack_require__(3);
	var utils = __webpack_require__(28);
	var lcs = __webpack_require__(29);
	var path = __webpack_require__(30);
	var concatPath = path.concat,
	                  escape = path.escape,
	                  op = utils.op,
	                  isMap = utils.isMap,
	                  isIndexed = utils.isIndexed;
	
	var mapDiff = function(a, b, p){
	  var ops = [];
	  var path = p || '';
	
	  if(Immutable.is(a, b) || (a == b == null)){ return ops; }
	
	  var areLists = isIndexed(a) && isIndexed(b);
	  var lastKey = null;
	  var removeKey = null
	
	  if(a.forEach){
	    a.forEach(function(aValue, aKey){
	      if(b.has(aKey)){
	        if(isMap(aValue) && isMap(b.get(aKey))){
	          ops = ops.concat(mapDiff(aValue, b.get(aKey), concatPath(path, escape(aKey))));
	        }
	        else if(isIndexed(b.get(aKey)) && isIndexed(aValue)){
	          ops = ops.concat(sequenceDiff(aValue, b.get(aKey), concatPath(path, escape(aKey))));
	        }
	        else {
	          var bValue = b.get ? b.get(aKey) : b;
	          var areDifferentValues = (aValue !== bValue);
	          if (areDifferentValues) {
	            ops.push(op('replace', concatPath(path, escape(aKey)), bValue));
	          }
	        }
	      }
	      else {
	        if(areLists){
	          removeKey = (lastKey != null && (lastKey+1) === aKey) ? removeKey : aKey;
	          ops.push( op('remove', concatPath(path, escape(removeKey))) );
	          lastKey = aKey;
	        }
	        else{
	          ops.push( op('remove', concatPath(path, escape(aKey))) );
	        }
	
	      }
	    });
	  }
	
	  b.forEach(function(bValue, bKey){
	    if(a.has && !a.has(bKey)){
	      ops.push( op('add', concatPath(path, escape(bKey)), bValue) );
	    }
	  });
	
	  return ops;
	};
	
	var sequenceDiff = function (a, b, p) {
	  var ops = [];
	  var path = p || '';
	  if(Immutable.is(a, b) || (a == b == null)){ return ops; }
	  if((a.count() + 1) * (b.count() + 1) >= 10000 ) { return mapDiff(a, b, p); }
	
	  var lcsDiff = lcs.diff(a, b);
	
	  var pathIndex = 0;
	
	  lcsDiff.forEach(function (diff) {
	    if(diff.op === '='){ pathIndex++; }
	    else if(diff.op === '!='){
	      if(isMap(diff.val) && isMap(diff.newVal)){
	        var mapDiffs = mapDiff(diff.val, diff.newVal, concatPath(path, pathIndex));
	        ops = ops.concat(mapDiffs);
	      }
	      else{
	        ops.push(op('replace', concatPath(path, pathIndex), diff.newVal));
	      }
	      pathIndex++;
	    }
	    else if(diff.op === '+'){
	      ops.push(op('add', concatPath(path, pathIndex), diff.val));
	      pathIndex++;
	    }
	    else if(diff.op === '-'){ ops.push(op('remove', concatPath(path, pathIndex))); }
	  });
	
	  return ops;
	};
	
	var primitiveTypeDiff = function (a, b, p) {
	  var path = p || '';
	  if(a === b){ return []; }
	  else{
	    return [ op('replace', concatPath(path, ''), b) ];
	  }
	};
	
	var diff = function(a, b, p){
	  if(Immutable.is(a, b)){ return Immutable.List(); }
	  if(a != b && (a == null || b == null)){ return Immutable.fromJS([op('replace', '/', b)]); }
	  if(isIndexed(a) && isIndexed(b)){
	    return Immutable.fromJS(sequenceDiff(a, b));
	  }
	  else if(isMap(a) && isMap(b)){
	    return Immutable.fromJS(mapDiff(a, b));
	  }
	  else{
	    return Immutable.fromJS(primitiveTypeDiff(a, b, p));
	  }
	};
	
	module.exports = diff;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Immutable = __webpack_require__(3);
	
	var isMap = function(obj){ return Immutable.Iterable.isKeyed(obj); };
	var isIndexed = function(obj) { return Immutable.Iterable.isIndexed(obj); };
	
	var op = function(operation, path, value){
	  if(operation === 'remove') { return { op: operation, path: path }; }
	
	  return { op: operation, path: path, value: value };
	};
	
	module.exports = {
	  isMap: isMap,
	  isIndexed: isIndexed,
	  op: op
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Immutable = __webpack_require__(3);
	
	/**
	 * Returns a two-dimensional array (an array of arrays) with dimensions n by m.
	 * All the elements of this new matrix are initially equal to x
	 * @param n number of rows
	 * @param m number of columns
	 * @param x initial element for every item in matrix
	 */
	var makeMatrix = function(n, m, x){
	  var matrix = [];
	  for(var i = 0; i < n; i++) {
	    matrix[i] = new Array(m);
	
	    if(x != null){
	      for(var j = 0; j < m; j++){
	        matrix[i][j] = x;
	      }
	    }
	  }
	
	  return matrix;
	};
	
	/**
	 * Computes Longest Common Subsequence between two Immutable.JS Indexed Iterables
	 * Based on Dynamic Programming http://rosettacode.org/wiki/Longest_common_subsequence#Java
	 * @param xs ImmutableJS Indexed Sequence 1
	 * @param ys ImmutableJS Indexed Sequence 2
	 */
	var lcs = function(xs, ys){
	  var matrix = computeLcsMatrix(xs, ys);
	
	  return backtrackLcs(xs, ys, matrix);
	};
	
	var DiffResult = Immutable.Record({op: '=', val: null});
	var ReplaceResult = Immutable.Record({op: '!=', val: null, newVal: null});
	
	/**
	 * Returns the resulting diff operations of LCS between two sequences
	 * @param xs Indexed Sequence 1
	 * @param ys Indexed Sequence 2
	 * @returns Array of DiffResult {op:'=' | '+' | '-', val:any}
	 */
	var diff = function(xs, ys){
	  var matrix = computeLcsMatrix(xs, ys);
	
	  return printDiff(matrix, xs, ys, xs.size||0, ys.size||0);
	};
	
	var printDiff = function(matrix, xs, ys, xSize, ySize) {
	  var diffArray = [];
	  var i = xSize - 1;
	  var j = ySize - 1;
	  while (i >= 0 || j >= 0) {
	    if (i >= 0 && j >= 0 && Immutable.is(xs.get(i), ys.get(j))) {
	      diffArray.push(new DiffResult({
	        op: '=',
	        val: xs.get(i)
	      }));
	      i -= 1;
	      j -= 1;
	    }
	    else if (i >= 0 && j >= 0 && i === j && !Immutable.is(xs.get(i), ys.get(j))) {
	      diffArray.push(new ReplaceResult({
	      val: xs.get(i),
	      newVal: ys.get(i)
	      }));
	      i -= 1;
	      j -= 1;
	    }
	    else {
	      if (j >= 0 && (i === -1 || matrix[i+1][j] >= matrix[i][j+1])) {
	        diffArray.push(new DiffResult({
	          op: '+',
	          val: ys.get(j)
	        }));
	        j -= 1;
	      }
	      else if (i >= 0 && (j === -1 || matrix[i+1][j] < matrix[i][j+1])){
	        diffArray.push(new DiffResult({
	          op: '-',
	          val: xs.get(i)
	        }));
	        i -= 1;
	      }
	    }
	  }
	  return diffArray.reverse();
	};
	
	/**
	 * Computes the Longest Common Subsequence table
	 * @param xs Indexed Sequence 1
	 * @param ys Indexed Sequence 2
	 */
	function computeLcsMatrix(xs, ys) {
	  var n = xs.size||0;
	  var m = ys.size||0;
	  var a = makeMatrix(n + 1, m + 1, 0);
	
	  for (var i = 0; i < n; i++) {
	    for (var j = 0; j < m; j++) {
	      if (Immutable.is(xs.get(i), ys.get(j))) {
	        a[i + 1][j + 1] = a[i][j] + 1;
	      }
	      else {
	        a[i + 1][j + 1] = Math.max(a[i + 1][j], a[i][j + 1]);
	      }
	    }
	  }
	
	  return a;
	}
	
	/**
	 * Extracts a LCS from matrix M
	 * @param xs Indexed Sequence 1
	 * @param ys Indexed Sequence 2
	 * @param matrix LCS Matrix
	 * @returns {Array.<T>} Longest Common Subsequence
	 */
	var backtrackLcs = function(xs, ys, matrix){
	  var lcs = [];
	  for(var i = xs.size, j = ys.size; i !== 0 && j !== 0;){
	    if (matrix[i][j] === matrix[i-1][j]){ i--; }
	    else if (matrix[i][j] === matrix[i][j-1]){ j--; }
	    else{
	      if(Immutable.is(xs.get(i-1), ys.get(j-1))){
	        lcs.push(xs.get(i-1));
	        i--;
	        j--;
	      }
	    }
	  }
	  return lcs.reverse();
	};
	
	module.exports = {
	  lcs: lcs,
	  computeLcsMatrix: computeLcsMatrix,
	  diff: diff
	};


/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';
	
	var slashRe = new RegExp('/', 'g');
	var escapedSlashRe = new RegExp('~1', 'g');
	var tildeRe = /~/g;
	var escapedTildeRe = /~0/g;
	
	var Path = {
	  escape: function (str) {
	    if(typeof(str) === 'number'){
	      return str.toString();
	    }
	    if(typeof(str) !== 'string'){
	      throw 'param str (' + str + ') is not a string';
	    }
	
	    return str.replace(tildeRe, '~0').replace(slashRe, '~1');
	  },
	
	  unescape: function (str) {
	    if(typeof(str) == 'string') {
	      return str.replace(escapedSlashRe, '/').replace(escapedTildeRe, '~');
	    }
	    else {
	      return str;
	    }
	  },
	  concat: function(path, key){
	    return path + '/' + key;
	  }
	};
	
	module.exports = Path;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Index = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _immutable = __webpack_require__(3);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	var _rx = __webpack_require__(7);
	
	var Rx = _interopRequireWildcard(_rx);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var LISTENER_SENTINEL = {};
	
	var Index = exports.Index = function () {
	    function Index(rx) {
	        _classCallCheck(this, Index);
	
	        this.listeners = Immutable.Map();
	        this.rx = rx;
	    }
	
	    _createClass(Index, [{
	        key: 'sub',
	        value: function sub(path, def) {
	            var _this = this;
	
	            var self = this;
	
	            var slices = [];
	            for (var i = 0; i < path.length; i++) {
	                slices.push(Array.prototype.slice.call(path.slice(0, i + 1)));
	            }
	            this.listeners = slices.reduce(function (acc, pathSlice) {
	                var parentPath = pathSlice.slice(0, pathSlice.length - 1);
	                var parentRx = parentPath.length === 0 ? _this.rx() : acc.getIn(parentPath.concat(LISTENER_SENTINEL));
	                var lastFragment = pathSlice[pathSlice.length - 1];
	                return acc.updateIn(pathSlice.concat(LISTENER_SENTINEL), function (old) {
	                    if (old) {
	                        return old;
	                    }
	                    var subject = parentRx.map(function (a) {
	                        if (a && a.get) {
	                            return a.get(lastFragment);
	                        }
	                    }).distinctUntilChanged(function (x) {
	                        return x;
	                    }, function (x, y) {
	                        return x === y;
	                    }).shareReplay(1);
	                    var oldSubscribe = subject.subscribe;
	                    subject.subscribe = function () {
	                        var sub = oldSubscribe.apply(this, arguments),
	                            s = this;
	
	                        return Rx.Disposable.create(function () {
	                            sub.dispose();
	                            if (s._count === 0) {
	                                self.listeners = self.listeners.removeIn(pathSlice);
	                            }
	                        });
	                    };
	                    return subject;
	                });
	            }, this.listeners);
	
	            return this.listeners.getIn(path.concat([LISTENER_SENTINEL])).map(function (a) {
	                return typeof a !== 'undefined' ? a : def;
	            });
	        }
	    }]);

	    return Index;
	}();

/***/ }
/******/ ])
});
;
//# sourceMappingURL=reframe.js.map