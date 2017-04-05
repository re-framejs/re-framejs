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
	exports.pause$ = exports.render = exports.view = exports.viewSV = exports.viewSP = exports.viewV = exports.viewP = exports.injectCofx = exports.regCofx = exports.regFx = exports.clearSubscriptionCache = exports.subscribe = exports.regSub = exports.onChanges = exports.after = exports.trimv = exports.enrich = exports.path = exports.debug = exports.when = exports.assocCoeffect = exports.assocEffect = exports.getEffect = exports.getCoeffect = exports.enqueue = exports.toInterceptor = exports.dispatchSync = exports.dispatch = exports.db$ = exports.appDb = undefined;
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
	
	var _stdinterceptors = __webpack_require__(18);
	
	var stdinterceptors = _interopRequireWildcard(_stdinterceptors);
	
	var _subs = __webpack_require__(13);
	
	var subs = _interopRequireWildcard(_subs);
	
	var _subindex = __webpack_require__(23);
	
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
	
	function atom(value) {
	    return (0, _ratom.makeRatom)(value);
	}
	
	function reaction(f) {
	    return (0, _ratom.makeReaction)(f);
	}
	
	function cursor(atom, path) {
	    return (0, _ratom.makeCursor)(atom, path);
	}
	
	var appDb = exports.appDb = db.appDb;
	var db$ = exports.db$ = db.appDb.subject();
	var dispatch = exports.dispatch = router.dispatch;
	var dispatchSync = exports.dispatchSync = router.dispatchSync;
	
	var toInterceptor = exports.toInterceptor = interceptor.toInterceptor;
	var enqueue = exports.enqueue = interceptor.enqueue;
	var getCoeffect = exports.getCoeffect = interceptor.getCoeffect;
	var getEffect = exports.getEffect = interceptor.getEffect;
	var assocEffect = exports.assocEffect = interceptor.assocEffect;
	var assocCoeffect = exports.assocCoeffect = interceptor.assocCoeffect;
	
	var when = exports.when = stdinterceptors.when;
	var debug = exports.debug = stdinterceptors.debug;
	var path = exports.path = stdinterceptors.path;
	var enrich = exports.enrich = stdinterceptors.enrich;
	var trimv = exports.trimv = stdinterceptors.trimv;
	var after = exports.after = stdinterceptors.after;
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
	var render = exports.render = react.render;
	
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
	
	var pause$ = exports.pause$ = new Rx.BehaviorSubject(true);
	
	function togglePause(pause) {
	    if (pause) {
	        router.pause();
	    } else {
	        router.resume();
	    }
	}
	pause$.subscribe(function (run) {
	    return togglePause(!run);
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.injectDb = undefined;
	
	var _registrar = __webpack_require__(2);
	
	var _interceptor = __webpack_require__(4);
	
	var _db = __webpack_require__(5);
	
	var kind = 'cofx';
	
	function register(id, handlerFn) {
	    return (0, _registrar.registerHandler)(kind, id, handlerFn);
	}
	
	function injectCofx(id) {
	    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	
	    var handler = (0, _registrar.getHandler)(kind, id);
	    if (typeof value !== 'undefined') {
	        return (0, _interceptor.toInterceptor)({
	            id: 'coeffects',
	            before: function coeffectsBefore(ctx) {
	                return ctx.update('coeffects', handler);
	            }
	        });
	    } else {
	        return (0, _interceptor.toInterceptor)({
	            id: 'coeffects',
	            before: function coeffectsBefore(ctx) {
	                return ctx.update('coeffects', function (old) {
	                    return handler(old, value);
	                });
	            }
	        });
	    }
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
	
	var appDb = exports.appDb = (0, _ratom.makeRatom)(Immutable.Map());

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Observable = exports.db$ = undefined;
	
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
	
	var db$ = exports.db$ = new Rx.BehaviorSubject(Immutable.Map());
	
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
	
	function makeReaction(f) {
	    return new Reaction(f);
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
	 *
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
	    if (!Immutable.isList(value)) {
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
	    if (!Immutable.isSeq(values)) {
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
	    if (Immutable.isSeq(value)) {
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
	
	var laterFns = {
	    'flush-dom': function flushDom(f) {
	        return (0, _interop.afterRender)(function () {
	            return (0, _interop.nextTick)(f);
	        });
	    },
	    'yield': _interop.nextTick
	};
	
	function doTrigger(fsm, state, trigger, arg) {
	    if (trigger === 'pause') {
	        return ['paused', function (fsm) {
	            fsm._pause();
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
	                    fsm._pause();
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
	                } else if (state === 'paused' && trigger === 'resume') {
	                    return ['running', function (fsm) {
	                        fsm._resume(arg);
	                    }];
	                } else {
	                    throw new Error("re-frame: router state transition not found. " + state + " " + trigger);
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
	            (0, _interop.nextTick)(function runProcessEvents() {
	                return this.trigger("run-queue", null);
	            }.bind(this));
	        }
	    }, {
	        key: '_runQueue',
	        value: function _runQueue() {
	            for (var i = this._queue.length; i > 0; i--) {
	                // TODO add later-fns
	                this._process1stEventInQueue();
	            }
	            this.trigger('finish-run', null);
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
	            // console.log('pause');
	            // laterFn(() => this.trigger('resume', null));
	        }
	    }, {
	        key: '_callPostEventCallbacks',
	        value: function _callPostEventCallbacks(event) {
	            var _this = this;
	
	            Object.keys(this._postEventCallbacks).forEach(function (key) {
	                _this._postEventCallbacks[key](event, [].concat(_toConsumableArray(_this._queue)));
	            });
	        }
	    }, {
	        key: '_resume',
	        value: function _resume() {
	            // this._process1stEventInQueue();
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
	
	function afterRender() {
	    throw new Error('not implemented yet');
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
	
	var queryReaction = (0, _ratom.makeAtom)(Immutable.Map());
	
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
	    return Immutable.List([Immutable.List(query), Immutable.List(dynv)]);
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
	exports.SubscriptionMixin = exports.StatelessMixin = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.render = render;
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
	
	var StatelessMixin = exports.StatelessMixin = {
	    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	        return (0, _shouldupdate.shouldUpdate)(this.props, nextProps, ['argv', 'ctx']) || (0, _shouldupdate.shouldUpdate)(this.state, nextState) || (0, _shouldupdate.shouldUpdate)(this.props.argv, nextProps.argv);
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
	
	function S4() {
	    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
	}
	
	// Generate a pseudo-GUID by concatenating random hexadecimal.
	function guid() {
	    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
	}
	
	var MyDeref = function (_ratom$Observable) {
	    _inherits(MyDeref, _ratom$Observable);
	
	    function MyDeref(component, renderCycle, observable) {
	        _classCallCheck(this, MyDeref);
	
	        var _this = _possibleConstructorReturn(this, (MyDeref.__proto__ || Object.getPrototypeOf(MyDeref)).call(this, 'de'));
	
	        _this._componentId = component.id();
	        _this._renderCycle = renderCycle;
	        _this._observable = observable;
	        _this._lastValue = observable.peekValue();
	        return _this;
	    }
	
	    _createClass(MyDeref, [{
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
	            _get(MyDeref.prototype.__proto__ || Object.getPrototypeOf(MyDeref.prototype), 'dispose', this).call(this);
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
	
	    return MyDeref;
	}(ratom.Observable);
	
	var SubscriptionMixin = exports.SubscriptionMixin = {
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
	            var deref = new MyDeref(this, this.state.renderCycle, watch);
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
	        var updateByProps = (0, _shouldupdate.shouldUpdate)(this.props, nextProps, ['argv', 'ctx']) || (0, _shouldupdate.shouldUpdate)(this.props.argv, nextProps.argv),
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
	
	    var component = React.createClass(componentObj);
	    var factory = React.createFactory(component);
	    return function (props, context, updater) {
	        return factory(props, context);
	    };
	}
	
	function vectorView(mixin, args) {
	    var componentObj = createComponentObj(mixin, args);
	    var oldRender = componentObj.render;
	    componentObj.render = function () {
	        var _this4 = this;
	
	        this.traceReact('Render');
	        (0, _batching.markRendered)(this);
	        return ratom.runInCtx(this, function () {
	            return oldRender.apply(_this4, _this4.props.argv);
	        });
	    };
	    var component = React.createClass(componentObj);
	    var factory = React.createFactory(component);
	
	    return function () {
	        return factory({ argv: Array.prototype.slice.call(arguments) });
	    };
	}
	
	function viewP() {
	    return propsView([StatelessMixin], arguments);
	}
	
	function viewV() {
	    return vectorView([StatelessMixin], arguments);
	}
	
	function viewSP() {
	    return propsView([SubscriptionMixin], arguments);
	}
	
	function viewSV() {
	    return vectorView([SubscriptionMixin], arguments);
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
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.shouldUpdate = shouldUpdate;
	
	var _utils = __webpack_require__(17);
	
	function isChanged(entries) {
	    return !entries.every(function (_ref) {
	        var _ref2 = _slicedToArray(_ref, 2),
	            value = _ref2[0],
	            nextValue = _ref2[1];
	
	        if ((0, _utils.isObservable)(value) || (0, _utils.isObservable)(nextValue)) {
	            return true;
	        }
	
	        if ((0, _utils.isPrimitive)(value) && (0, _utils.isPrimitive)(nextValue) || (0, _utils.isImmutable)(value) && (0, _utils.isImmutable)(nextValue)) {
	
	            return value === nextValue;
	        }
	        return false;
	    });
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
	function shouldUpdate(props, nextProps, ignore) {
	    var entries = void 0;
	    if (nextProps === props || nextProps.length !== props.length) {
	        return false;
	    }
	    if (ignore && ignore.length > 0) {
	        entries = Object.keys(props).filter(function (k) {
	            return ignore.indexOf(k) === -1;
	        }).map(function (k) {
	            return [props[k], nextProps[k]];
	        });
	    } else {
	        entries = Object.keys(props).map(function (k) {
	            return [props[k], nextProps[k]];
	        });
	    }
	
	    if (entries.length) {
	        return isChanged(entries);
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
	    return obj instanceof _ratom.Observable || obj instanceof Rx.Observable;
	}

/***/ },
/* 18 */
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
	
	var _immutablediff = __webpack_require__(19);
	
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
	            newDb = (0, _interceptor.getEffect)(ctx, 'db', 'not-found');
	
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
	            return ctx.set('effects', handlerFn(ctx.get('coeffects'), event));
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Immutable = __webpack_require__(3);
	var utils = __webpack_require__(20);
	var lcs = __webpack_require__(21);
	var path = __webpack_require__(22);
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
/* 20 */
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
/* 21 */
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
/* 22 */
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
/* 23 */
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