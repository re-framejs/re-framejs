(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("rx"), require("immutable"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define("reframe", ["rx", "immutable", "react"], factory);
	else if(typeof exports === 'object')
		exports["reframe"] = factory(require("rx"), require("immutable"), require("react"));
	else
		root["reframe"] = factory(root["Rx"], root["Immutable"], root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_10__) {
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
	
	var _commands = __webpack_require__(1);
	
	var commands = _interopRequireWildcard(_commands);
	
	var _subs = __webpack_require__(5);
	
	var subs = _interopRequireWildcard(_subs);
	
	var _db = __webpack_require__(2);
	
	var db = _interopRequireWildcard(_db);
	
	var _atom = __webpack_require__(8);
	
	var atom = _interopRequireWildcard(_atom);
	
	var _react = __webpack_require__(9);
	
	var react = _interopRequireWildcard(_react);
	
	var _middleware = __webpack_require__(12);
	
	var middleware = _interopRequireWildcard(_middleware);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	module.exports.registerHandler = commands.registerHandler;
	module.exports.dispatch = commands.dispatch;
	module.exports.dispatchSync = commands.dispatchSync;
	module.exports.registerSub = subs.registerSub;
	module.exports.subscribe = subs.subscribe;
	module.exports.indexPath = subs.indexPath;
	module.exports.db$ = db.db$;
	module.exports.viewP = react.viewP;
	module.exports.viewV = react.viewV;
	module.exports.viewSP = react.viewSP;
	module.exports.viewSV = react.viewSV;
	module.exports.view = react.viewSV;
	module.exports.deref = react.deref;
	module.exports.atom = atom.atom;
	module.exports.swap = atom.swap;
	module.exports.reset = atom.reset;
	module.exports.render = react.render;
	module.exports.pause$ = react.pause$;
	module.exports.compMiddleware = commands.compMiddleware;
	
	/*********************
	 * Middleware
	 *********************/
	module.exports.debug = middleware.debug;
	module.exports.trimv = middleware.trimv;
	module.exports.path = middleware.path;
	module.exports.enrich = middleware.enrich;
	module.exports.after = middleware.after;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.compMiddleware = compMiddleware;
	exports.registerHandler = registerHandler;
	exports.dispatch = dispatch;
	exports.dispatchSync = dispatchSync;
	
	var _db = __webpack_require__(2);
	
	var _rx = __webpack_require__(3);
	
	var Rx = _interopRequireWildcard(_rx);
	
	var _subs = __webpack_require__(5);
	
	var _dispatcher = __webpack_require__(6);
	
	var _immutable = __webpack_require__(4);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var commandDispatcher = new _dispatcher.Dispatcher();
	var cmd$ = new Rx.Subject();
	
	function compMiddleware(middlewares) {
	    return function (handler) {
	        var compHandler = middlewares.reverse().filter(function (a) {
	            return a;
	        }).reduce(function (acc, middleware) {
	            return middleware(acc);
	        }, handler);
	
	        return compHandler;
	    };
	}
	
	function registerHandler() {
	    var eventId = void 0,
	        middleware = void 0,
	        handlerFn = void 0;
	
	    switch (arguments.length) {
	        case 2:
	            eventId = arguments[0];
	            middleware = function middleware(handler) {
	                return handler;
	            };
	            handlerFn = arguments[1];
	            break;
	        case 3:
	            eventId = arguments[0];
	            middleware = Array.isArray(arguments[1]) ? compMiddleware(arguments[1]) : arguments[1];
	            handlerFn = arguments[2];
	            break;
	        default:
	            throw new Error('Expected 2 or 3 arguments, got ' + arguments.length);
	    }
	
	    commandDispatcher.register(eventId, middleware(handlerFn));
	}
	
	function dispatch(cmd) {
	    cmd$.onNext([false, cmd]);
	}
	
	function dispatchSync(cmd) {
	    cmd$.onNext([true, cmd]);
	}
	
	cmd$.scan(function dbStateTransition(_ref, _ref2) {
	    var _ref4 = _slicedToArray(_ref, 2);
	
	    var version = _ref4[0];
	    var db = _ref4[1];
	
	    var _ref3 = _slicedToArray(_ref2, 2);
	
	    var sync = _ref3[0];
	    var cmd = _ref3[1];
	
	    var handler = commandDispatcher.lookup(cmd[0]);
	
	    if (!handler) {
	        throw new Error('Command handler for "' + cmd[0] + '" not found');
	    }
	
	    var newDb = void 0;
	
	    try {
	        newDb = handler(db, cmd);
	    } catch (err) {
	        console.log("Error in handler: ", err);
	        newDb = db;
	    }
	
	    if (newDb !== db) {
	        _db.db$.onNext(newDb);
	        var nextVersion = version + 1;
	        if (sync) {
	            _subs.sync$.onNext([nextVersion, newDb]);
	        } else {
	            _subs.animationFrame$.onNext([nextVersion, newDb]);
	        }
	
	        return [nextVersion, newDb];
	    }
	    return [version, db];
	}, [0, Immutable.Map()]).subscribe();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.db$ = undefined;
	
	var _rx = __webpack_require__(3);
	
	var Rx = _interopRequireWildcard(_rx);
	
	var _immutable = __webpack_require__(4);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var db$ = exports.db$ = new Rx.BehaviorSubject(Immutable.Map());

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.render$ = exports.sync$ = exports.animationFrame$ = undefined;
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.registerSub = registerSub;
	exports.subscribe = subscribe;
	exports.indexPath = indexPath;
	
	var _rx = __webpack_require__(3);
	
	var Rx = _interopRequireWildcard(_rx);
	
	var _dispatcher = __webpack_require__(6);
	
	var _subindex = __webpack_require__(7);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var animationFrame$ = exports.animationFrame$ = new Rx.BehaviorSubject();
	var animationFrame$1 = new Rx.Subject();
	var sync$ = exports.sync$ = new Rx.Subject();
	var requestRender$ = new Rx.BehaviorSubject();
	var render$ = exports.render$ = new Rx.Subject();
	
	var scheduled = false;
	animationFrame$.filter(Boolean).doOnNext(function (v) {
	    if (!scheduled) {
	        requestAnimationFrame(function onRequestAnimationFrame() {
	            animationFrame$1.onNext(animationFrame$.getValue());
	            scheduled = false;
	        });
	        scheduled = true;
	    }
	}).subscribe();
	
	Rx.Observable.merge(animationFrame$1, sync$).scan(function dbAnimationFrameTransition(_ref, _ref2) {
	    var _ref4 = _slicedToArray(_ref, 2);
	
	    var oldVersion = _ref4[0];
	    var oldDb = _ref4[1];
	
	    var _ref3 = _slicedToArray(_ref2, 2);
	
	    var newVersion = _ref3[0];
	    var newDb = _ref3[1];
	
	    if (newVersion > oldVersion) {
	        return [newVersion, newDb];
	    }
	    return [oldVersion, oldDb];
	}, [-1, null]).map(function (_ref5) {
	    var _ref6 = _slicedToArray(_ref5, 2);
	
	    var version = _ref6[0];
	    var db = _ref6[1];
	    return db;
	}).distinctUntilChanged(function (x) {
	    return x;
	}, function (x, y) {
	    return x === y;
	}).doOnNext(function fireRender(db) {
	    requestRender$.onNext(db);
	    render$.onNext(true);
	}).subscribe();
	
	var subDispatcher = new _dispatcher.Dispatcher();
	function registerSub(name, handler) {
	    subDispatcher.register(name, handler);
	}
	
	function subscribe(cmd) {
	    var handler = subDispatcher.lookup(cmd[0]);
	    if (!handler) {
	        throw new Error('Subscription handler for "' + cmd[0] + '" not found');
	    }
	    return handler(requestRender$, cmd);
	}
	
	var index = new _subindex.Index(function () {
	    return requestRender$;
	});
	function indexPath(path, def) {
	    return index.sub(path, def);
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Dispatcher = exports.Dispatcher = function () {
	    function Dispatcher() {
	        _classCallCheck(this, Dispatcher);
	
	        this.map = {};
	    }
	
	    _createClass(Dispatcher, [{
	        key: "register",
	        value: function register(name, handler) {
	            this.map[name] = handler;
	        }
	    }, {
	        key: "lookup",
	        value: function lookup(name) {
	            return this.map[name];
	        }
	    }]);

	    return Dispatcher;
	}();

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Index = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _immutable = __webpack_require__(4);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	var _rx = __webpack_require__(3);
	
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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.atom = atom;
	exports.swap = swap;
	exports.reset = reset;
	
	var _rx = __webpack_require__(3);
	
	var Rx = _interopRequireWildcard(_rx);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function atom(value) {
	    return new Rx.BehaviorSubject(value);
	}
	
	function swap(aAtom, update) {
	    aAtom.onNext(update(aAtom.getValue()));
	}
	
	function reset(aAtom, value) {
	    aAtom.onNext(value);
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SubscriptionMixin = exports.StatelessMixin = exports.pause$ = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.deref = deref;
	exports.render = render;
	exports.viewP = viewP;
	exports.viewV = viewV;
	exports.viewSP = viewSP;
	exports.viewSV = viewSV;
	
	var _subs = __webpack_require__(5);
	
	var subs = _interopRequireWildcard(_subs);
	
	var _react = __webpack_require__(10);
	
	var React = _interopRequireWildcard(_react);
	
	var _rx = __webpack_require__(3);
	
	var Rx = _interopRequireWildcard(_rx);
	
	var _immutable = __webpack_require__(4);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	var _shouldupdate = __webpack_require__(11);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var pause$ = exports.pause$ = new Rx.BehaviorSubject(true);
	
	function deref(rx, transform) {
	    var ttransform = transform || function (a) {
	        return a;
	    };
	    var subj = new Rx.BehaviorSubject();
	    rx.map(ttransform).subscribe(subj).dispose();
	    return subj.getValue();
	}
	
	var data = {
	    renderOrder: 0,
	    toUpdate: []
	};
	
	function shouldUpdateByDerefed(derefed) {
	    return derefed.map(function (derefed) {
	        return derefed.shouldUpdate();
	    }).reduce(function (acc, v) {
	        return acc || v;
	    }, false);
	}
	
	function needUpdate(obj) {
	    //console.log('Need update', obj.getDisplayName());
	    data.toUpdate.push([obj.state.renderOrder, function () {
	        if (shouldUpdateByDerefed(obj.state.derefed)) {
	            // console.log('Force update', obj.getDisplayName());
	            obj.forceUpdate();
	        }
	    }]);
	}
	
	function render() {
	    data.toUpdate.sort(function (_ref, _ref2) {
	        var _ref4 = _slicedToArray(_ref, 1);
	
	        var o1 = _ref4[0];
	
	        var _ref3 = _slicedToArray(_ref2, 1);
	
	        var o2 = _ref3[0];
	        return o1 - o2;
	    });
	
	    data.toUpdate.forEach(function (_ref5) {
	        var _ref6 = _slicedToArray(_ref5, 2);
	
	        var _ = _ref6[0];
	        var forceUpdate = _ref6[1];
	        return forceUpdate();
	    });
	    data.toUpdate = [];
	}
	subs.render$.pausable(pause$).subscribe(render);
	
	var StatelessMixin = exports.StatelessMixin = {
	    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	        return (0, _shouldupdate.shouldUpdate)(this.props, nextProps, ['argv', 'ctx']) || (0, _shouldupdate.shouldUpdate)(this.state, nextState) || (0, _shouldupdate.shouldUpdate)(this.props.argv, nextProps.argv);
	    },
	    getDisplayName: function getDisplayName() {
	        return this.constructor.displayName;
	    }
	};
	
	var DerefedSubscription = function () {
	    function DerefedSubscription(view, rx, aTransform, renderCycle) {
	        _classCallCheck(this, DerefedSubscription);
	
	        var transform = aTransform || function (a) {
	            return a;
	        },
	            replay = new Rx.ReplaySubject(1),
	            subj = new Rx.BehaviorSubject();
	        var disposable = new Rx.CompositeDisposable(rx.distinctUntilChanged(function (x) {
	            return x;
	        }, function (x, y) {
	            return x === y;
	        }).map(transform).subscribe(replay), replay.subscribe(subj), replay.skip(1).subscribe(function () {
	            needUpdate(view);
	        }));
	
	        this.disposable = disposable;
	        this.subject = subj;
	        this.renderCycle = null;
	    }
	
	    _createClass(DerefedSubscription, [{
	        key: 'getValue',
	        value: function getValue(renderCycle) {
	            this.renderCycle = renderCycle;
	            this.lastValue = this.subject.getValue();
	            return this.lastValue;
	        }
	    }, {
	        key: 'dispose',
	        value: function dispose() {
	            this.disposable.dispose();
	        }
	    }, {
	        key: 'shouldDispose',
	        value: function shouldDispose(renderCycle) {
	            return renderCycle > this.renderCycle;
	        }
	    }, {
	        key: 'shouldUpdate',
	        value: function shouldUpdate() {
	            return this.lastValue !== this.subject.getValue();
	        }
	    }]);
	
	    return DerefedSubscription;
	}();
	
	function S4() {
	    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
	};
	
	// Generate a pseudo-GUID by concatenating random hexadecimal.
	function guid() {
	    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
	};
	
	var SubscriptionMixin = exports.SubscriptionMixin = {
	    derefSub: function derefSub(subVec, transform) {
	        return this.deref(subs.subscribe(subVec), transform, Immutable.List(subVec));
	    },
	
	    getDisplayName: function getDisplayName() {
	        return this.constructor.displayName;
	    },
	    getInitialState: function getInitialState() {
	        return {
	            derefed: Immutable.Map(),
	            renderOrder: data.renderOrder++,
	            renderCycle: 0
	        };
	    },
	    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	        var updateByProps = (0, _shouldupdate.shouldUpdate)(this.props, nextProps, ['argv', 'ctx']) || (0, _shouldupdate.shouldUpdate)(this.props.argv, nextProps.argv),
	            updateByState = (0, _shouldupdate.shouldUpdate)(this.state, nextState, ['derefed', 'renderOrder', 'renderCycle']);
	
	        return updateByProps || updateByState;
	    },
	    deref: function deref(rx, aTransform, aId) {
	        var id = aId || guid();
	        if (this.state.derefed.get(id)) {
	            return this.state.derefed.get(id).getValue(this.state.renderCycle);
	        }
	        var derefed = new DerefedSubscription(this, rx, aTransform);
	
	        this.state.derefed = this.state.derefed.set(id, derefed);
	
	        return derefed.getValue(this.state.renderCycle);
	    },
	    unsubscribe: function unsubscribe() {
	        this.state.derefed.forEach(function (derefed) {
	            derefed.dispose();
	        });
	
	        this.state.derefed = Immutable.Map();
	    },
	    componentWillUpdate: function componentWillUpdate() {
	        // console.log('Rendering', this.getDisplayName());
	        this.state.renderCycle++;
	        //this.unsubscribe();
	    },
	    componentDidUpdate: function componentDidUpdate() {
	        var _this = this;
	
	        this.state.derefed.filter(function (derefed) {
	            return derefed.shouldDispose(_this.state.renderCycle);
	        }).forEach(function (item) {
	            return item.dispose();
	        });
	
	        this.state.derefed = this.state.derefed.filter(function (derefed) {
	            return !derefed.shouldDispose(_this.state.renderCycle);
	        });
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        this.unsubscribe();
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
	        return oldRender.call(this, this.props);
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
	        return oldRender.apply(this, this.props.argv);
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
/* 10 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_10__;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.shouldUpdate = shouldUpdate;
	
	var _immutable = __webpack_require__(4);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
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
	        return !entries.every(function (_ref) {
	            var _ref2 = _slicedToArray(_ref, 2);
	
	            var value = _ref2[0];
	            var nextValue = _ref2[1];
	
	            if (isPrimitive(value) && isPrimitive(nextValue) || isImmutable(value) && isImmutable(nextValue)) {
	
	                return value === nextValue;
	            }
	            return false;
	        });
	    }
	    return false;
	}
	function isImmutable(maybeImmutable) {
	    return Immutable.Iterable.isIterable(maybeImmutable);
	}
	
	function isPrimitive(value) {
	    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	    return type === 'number' || type === 'boolean' || type === 'string' || value === null || value === void 0;
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.debug = debug;
	exports.trimv = trimv;
	exports.path = path;
	exports.enrich = enrich;
	exports.after = after;
	
	var _immutableDiff = __webpack_require__(13);
	
	var _immutableDiff2 = _interopRequireDefault(_immutableDiff);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* eslint-disable no-console */
	function debug(handler) {
	    return function (db, cmd) {
	        console.log('-- New Event ----------------------------------------------------');
	        console.groupCollapsed('re-frame event: ', cmd.map(function (p) {
	            return p && p.toJS ? p.toJS() : p;
	        }));
	        var newDb = handler(db, cmd),
	            diff = (0, _immutableDiff2.default)(db, newDb);
	        diff.forEach(function (df) {
	            return console.log(df.toJS());
	        });
	        console.groupEnd();
	        return newDb;
	    };
	}
	/* eslint-enable no-console */
	
	function trimv(handler) {
	    return function (db, cmd) {
	        return handler(db, cmd.slice(1));
	    };
	}
	
	function path(p, dflt) {
	    return function (handler) {
	        return function (db, cmd) {
	            var newValue = handler(db.getIn(p, dflt), cmd);
	            return db.setIn(p, newValue);
	        };
	    };
	}
	
	function enrich(enrichHandler) {
	    return function (handler) {
	        return function (db, cmd) {
	            var newDb = handler(db, cmd);
	            return enrichHandler(newDb, cmd, db);
	        };
	    };
	}
	
	function after(afterHandler) {
	    return function (handler) {
	        return function (db, cmd) {
	            var newDb = handler(db, cmd);
	            afterHandler(newDb, cmd, db);
	            return newDb;
	        };
	    };
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = diff;
	
	var _immutable = __webpack_require__(4);
	
	var _lcs = __webpack_require__(14);
	
	var isMap = _immutable.Map.isMap;
	var isIndexed = _immutable.Iterable.isIndexed;
	
	function op(operation, path, value) {
	  if (operation === 'remove') {
	    return { op: operation, path: path };
	  }
	  return { op: operation, path: path, value: value };
	}
	
	function mapDiff(a, b) {
	  var path = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
	
	  var ops = [];
	
	  if ((0, _immutable.is)(a, b)) {
	    return ops;
	  }
	
	  var areIndexed = isIndexed(a) && isIndexed(b);
	  var lastKey = null;
	  var removeKey = null;
	
	  if (a.forEach) {
	    a.forEach(function (aValue, aKey) {
	      if (b.has(aKey)) {
	        if (isMap(aValue) && isMap(b.get(aKey))) {
	          ops = ops.concat(mapDiff(aValue, b.get(aKey), path.concat(aKey)));
	        } else if (isIndexed(b.get(aKey)) && isIndexed(aValue)) {
	          ops = ops.concat(sequenceDiff(aValue, b.get(aKey), path.concat(aKey)));
	        } else {
	          var bValue = b.get ? b.get(aKey) : b;
	          var areDifferentValues = aValue !== bValue;
	          if (areDifferentValues) {
	            ops.push(op('replace', path.concat(aKey), bValue));
	          }
	        }
	      } else if (areIndexed) {
	        removeKey = lastKey != null && lastKey + 1 === aKey ? removeKey : aKey;
	        ops.push(op('remove', path.concat(removeKey)));
	        lastKey = aKey;
	      } else {
	        ops.push(op('remove', path.concat(aKey)));
	      }
	    });
	  }
	
	  b.forEach(function (bValue, bKey) {
	    if (a.has && !a.has(bKey)) {
	      ops.push(op('add', path.concat(bKey), bValue));
	    }
	  });
	
	  return ops;
	}
	
	function sequenceDiff(a, b) {
	  var path = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
	
	  var ops = [];
	  if ((0, _immutable.is)(a, b)) {
	    return ops;
	  }
	  if (b.count() > 100) {
	    return mapDiff(a, b, path);
	  }
	
	  var lcsDiff = (0, _lcs.diff)(a, b);
	
	  var pathIndex = 0;
	
	  lcsDiff.forEach(function (diff) {
	    if (diff.op === '=') {
	      pathIndex++;
	    } else if (diff.op === '!=') {
	      if (isMap(diff.val) && isMap(diff.newVal)) {
	        var mapDiffs = mapDiff(diff.val, diff.newVal, path.concat(pathIndex));
	        ops = ops.concat(mapDiffs);
	      } else {
	        ops.push(op('replace', path.concat(pathIndex), diff.newVal));
	      }
	      pathIndex++;
	    } else if (diff.op === '+') {
	      ops.push(op('add', path.concat(pathIndex), diff.val));
	      pathIndex++;
	    } else if (diff.op === '-') {
	      ops.push(op('remove', path.concat(pathIndex)));
	    }
	  });
	
	  return ops;
	}
	
	function primitiveTypeDiff(a, b) {
	  var path = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
	
	  if (a === b) {
	    return [];
	  } else {
	    return [op('replace', path, b)];
	  }
	}
	
	function diff(a, b, path) {
	  if (isIndexed(a) && isIndexed(b)) {
	    return (0, _immutable.fromJS)(sequenceDiff(a, b));
	  }
	  if (isMap(a) && isMap(b)) {
	    return (0, _immutable.fromJS)(mapDiff(a, b));
	  }
	  return (0, _immutable.fromJS)(primitiveTypeDiff(a, b, path));
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.lcs = lcs;
	exports.diff = diff;
	exports.backtrackLcs = backtrackLcs;
	
	var _immutable = __webpack_require__(4);
	
	/**
	 * Returns a two-dimensional array (an array of arrays) with dimensions n by m.
	 * All the elements of this new matrix are initially equal to x
	 * @param n number of rows
	 * @param m number of columns
	 * @param x initial element for every item in matrix
	 */
	function makeMatrix(n, m, x) {
	  var matrix = [];
	  for (var i = 0; i < n; i++) {
	    matrix[i] = new Array(m);
	    for (var j = 0; j < m; j++) {
	      matrix[i][j] = x;
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
	function lcs(xs, ys) {
	  var matrix = computeLcsMatrix(xs, ys);
	
	  return backtrackLcs(xs, ys, matrix);
	};
	
	var DiffResult = (0, _immutable.Record)({ op: '=', val: null });
	var ReplaceResult = (0, _immutable.Record)({ op: '!=', val: null, newVal: null });
	
	/**
	 * Returns the resulting diff operations of LCS between two sequences
	 * @param xs Indexed Sequence 1
	 * @param ys Indexed Sequence 2
	 * @returns Array of DiffResult {op:'=' | '+' | '-', val:any}
	 */
	function diff(xs, ys) {
	  var matrix = computeLcsMatrix(xs, ys);
	
	  return printDiff(matrix, xs, ys, xs.size || 0, ys.size || 0);
	};
	
	function printDiff(matrix, xs, ys, i, j) {
	  if (i === 0 && j === 0) {
	    return [];
	  }
	  if (i > 0 && j > 0 && (0, _immutable.is)(xs.get(i - 1), ys.get(j - 1))) {
	    return printDiff(matrix, xs, ys, i - 1, j - 1).concat(new DiffResult({
	      op: '=',
	      val: xs.get(i - 1)
	    }));
	  } else if (i > 0 && j > 0 && i === j && !(0, _immutable.is)(xs.get(i - 1), ys.get(j - 1))) {
	    return printDiff(matrix, xs, ys, i - 1, j - 1).concat(new ReplaceResult({
	      val: xs.get(i - 1),
	      newVal: ys.get(i - 1)
	    }));
	  } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
	    return printDiff(matrix, xs, ys, i, j - 1).concat(new DiffResult({
	      op: '+',
	      val: ys.get(j - 1)
	    }));
	  } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
	    return printDiff(matrix, xs, ys, i - 1, j).concat(new DiffResult({
	      op: '-',
	      val: xs.get(i - 1)
	    }));
	  }
	};
	
	/**
	 * Computes the Longest Common Subsequence table
	 * @param xs Indexed Sequence 1
	 * @param ys Indexed Sequence 2
	 */
	function computeLcsMatrix(xs, ys) {
	  var n = xs.size || 0;
	  var m = ys.size || 0;
	  var a = makeMatrix(n + 1, m + 1, 0);
	
	  for (var i = 0; i < n; i++) {
	    for (var j = 0; j < m; j++) {
	      if ((0, _immutable.is)(xs.get(i), ys.get(j))) {
	        a[i + 1][j + 1] = a[i][j] + 1;
	      } else {
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
	function backtrackLcs(xs, ys, matrix) {
	  var lcs = [];
	  for (var i = xs.size, j = ys.size; i !== 0 && j !== 0;) {
	    if (matrix[i][j] === matrix[i - 1][j]) {
	      i--;
	    } else if (matrix[i][j] === matrix[i][j - 1]) {
	      j--;
	    } else if ((0, _immutable.is)(xs.get(i - 1), ys.get(j - 1))) {
	      lcs.push(xs.get(i - 1));
	      i--;
	      j--;
	    }
	  }
	  return lcs.reverse();
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=reframe.js.map