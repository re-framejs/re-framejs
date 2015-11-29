(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Rx"), require("Immutable"), require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["Rx", "Immutable", "React"], factory);
	else if(typeof exports === 'object')
		exports["reframe"] = factory(require("Rx"), require("Immutable"), require("React"));
	else
		root["reframe"] = factory(root["Rx"], root["Immutable"], root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_12__) {
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
	
	var _subs = __webpack_require__(4);
	
	var subs = _interopRequireWildcard(_subs);
	
	var _db = __webpack_require__(2);
	
	var db = _interopRequireWildcard(_db);
	
	var _atom = __webpack_require__(10);
	
	var atom = _interopRequireWildcard(_atom);
	
	var _react = __webpack_require__(11);
	
	var react = _interopRequireWildcard(_react);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	module.exports.registerHandler = commands.registerHandler;
	module.exports.dispatch = commands.dispatch;
	module.exports.dispatchSync = commands.dispatchSync;
	module.exports.registerSub = subs.registerSub;
	module.exports.subscribe = subs.subscribe;
	module.exports.indexPath = subs.indexPath;
	module.exports.db$ = db.db$;
	module.exports.ReframeMixin = react.ReframeMixin;
	module.exports.viewP = react.viewP;
	module.exports.viewV = react.viewV;
	module.exports.viewSP = react.viewSP;
	module.exports.viewSV = react.viewSV;
	module.exports.deref = react.deref;
	module.exports.atom = atom.atom;
	module.exports.swap = atom.swap;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.registerHandler = registerHandler;
	exports.dispatch = dispatch;
	exports.dispatchSync = dispatchSync;
	exports.compMiddleware = compMiddleware;
	
	var _db = __webpack_require__(2);
	
	var _rx = __webpack_require__(3);
	
	var Rx = _interopRequireWildcard(_rx);
	
	var _subs = __webpack_require__(4);
	
	var _dispatcher = __webpack_require__(7);
	
	var _immutable = __webpack_require__(9);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var commandDispatcher = new _dispatcher.Dispatcher();
	var cmd$ = new Rx.Subject();
	
	function registerHandler() {
	    var eventId = undefined,
	        middleware = undefined,
	        handlerFn = undefined;
	
	    switch (arguments.length) {
	        case 2:
	            eventId = arguments[0];
	            middleware = function (handler) {
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
	
	cmd$.scan(function (_ref, _ref2) {
	    var _ref4 = _slicedToArray(_ref, 2);
	
	    var version = _ref4[0];
	    var db = _ref4[1];
	
	    var _ref3 = _slicedToArray(_ref2, 2);
	
	    var sync = _ref3[0];
	    var cmd = _ref3[1];
	
	    var handler = commandDispatcher.lookup(cmd[0]);
	
	    var newDb = handler(db, cmd);
	
	    if (newDb !== db) {
	        _db.db$.onNext(newDb);
	        if (sync) {
	            _subs.sync$.onNext([version, newDb]);
	        } else {
	            _subs.animationFrame$.onNext([version, newDb]);
	        }
	
	        return [version + 1, newDb];
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
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var db$ = exports.db$ = new Rx.BehaviorSubject();

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.render$ = exports.sync$ = exports.animationFrame$ = undefined;
	exports.registerSub = registerSub;
	exports.subscribe = subscribe;
	exports.indexPath = indexPath;
	
	var _rxDom = __webpack_require__(5);
	
	var Rx = _interopRequireWildcard(_rxDom);
	
	var _dispatcher = __webpack_require__(7);
	
	var _subindex = __webpack_require__(8);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var animationFrame$ = exports.animationFrame$ = new Rx.Subject();
	var sync$ = exports.sync$ = new Rx.Subject();
	var requestRender$ = new Rx.BehaviorSubject();
	var render$ = exports.render$ = new Rx.Subject();
	
	Rx.Observable.merge(animationFrame$.throttleLatest(1 / 60, Rx.Scheduler.requestAnimationFrame),
	//.observeOn(Rx.Scheduler.requestAnimationFrame),
	sync$).scan(function (_ref, _ref2) {
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
	}).doOnNext(function (db) {
	    requestRender$.onNext(db);
	    render$.onNext(true);
	}).subscribe();
	
	var subDispatcher = new _dispatcher.Dispatcher();
	function registerSub(name, handler) {
	    subDispatcher.register(name, handler);
	}
	
	function subscribe(cmd) {
	    var handler = subDispatcher.lookup(cmd[0]);
	    return handler(requestRender$, cmd);
	}
	
	var index = new _subindex.Index(function () {
	    return requestRender$;
	});
	function indexPath(path, def) {
	    return index.sub(path, def);
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {// Copyright (c) Microsoft, Inc. All rights reserved. See License.txt in the project root for license information.
	
	;(function (factory) {
	  var objectTypes = {
	    'function': true,
	    'object': true
	  };
	
	  function checkGlobal(value) {
	    return (value && value.Object === Object) ? value : null;
	  }
	
	  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType) ? exports : null;
	  var freeModule = (objectTypes[typeof module] && module && !module.nodeType) ? module : null;
	  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global === 'object' && global);
	  var freeSelf = checkGlobal(objectTypes[typeof self] && self);
	  var freeWindow = checkGlobal(objectTypes[typeof window] && window);
	  var moduleExports = (freeModule && freeModule.exports === freeExports) ? freeExports : null;
	  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);
	  var root = freeGlobal || ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) || freeSelf || thisGlobal || Function('return this')();
	
	  // Because of build optimizers
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Rx, exports) {
	      return factory(root, exports, Rx);
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof module === 'object' && module && module.exports === freeExports) {
	    module.exports = factory(root, module.exports, require('rx'));
	  } else {
	    root.Rx = factory(root, {}, root.Rx);
	  }
	}.call(this, function (root, exp, Rx, undefined) {
	
	  var Observable = Rx.Observable,
	    ObservableBase = Rx.ObservableBase,
	    AbstractObserver = Rx.internals.AbstractObserver,
	    observerCreate = Rx.Observer.create,
	    observableCreate = Rx.Observable.create,
	    disposableCreate = Rx.Disposable.create,
	    Disposable = Rx.Disposable,
	    CompositeDisposable = Rx.CompositeDisposable,
	    BinaryDisposable = Rx.BinaryDisposable,
	    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
	    Subject = Rx.Subject,
	    Scheduler = Rx.Scheduler,
	    dom = Rx.DOM = {},
	    hasOwnProperty = {}.hasOwnProperty,
	    noop = Rx.helpers.noop,
	    isFunction = Rx.helpers.isFunction,
	    inherits = Rx.internals.inherits;
	
	  var errorObj = {e: {}};
	
	  function tryCatcherGen(tryCatchTarget) {
	    return function tryCatcher() {
	      try {
	        return tryCatchTarget.apply(this, arguments);
	      } catch (e) {
	        errorObj.e = e;
	        return errorObj;
	      }
	    };
	  }
	
	  function tryCatch(fn) {
	    if (!isFunction(fn)) { throw new TypeError('fn must be a function'); }
	    return tryCatcherGen(fn);
	  }
	
	  function thrower(e) {
	    throw e;
	  }
	
	  function CreateListenerDisposable(element, name, handler, useCapture) {
	    this._e = element;
	    this._n = name;
	    this._fn = handler;
	    this._u = useCapture;
	    this._e.addEventListener(this._n, this._fn, this._u);
	    this.isDisposed = false;
	  }
	
	  CreateListenerDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      this._e.removeEventListener(this._n, this._fn, this._u);
	    }
	  };
	
	  function createListener (element, name, handler, useCapture) {
	    if (element.addEventListener) {
	      return new CreateListenerDisposable(element, name, handler, useCapture);
	    }
	    throw new Error('No listener found');
	  }
	
	  function createEventListener (el, eventName, handler, useCapture) {
	    var disposables = new CompositeDisposable();
	
	    // Asume NodeList or HTMLCollection
	    var toStr = Object.prototype.toString;
	    if (toStr.call(el) === '[object NodeList]' || toStr.call(el) === '[object HTMLCollection]') {
	      for (var i = 0, len = el.length; i < len; i++) {
	        disposables.add(createEventListener(el.item(i), eventName, handler, useCapture));
	      }
	    } else if (el) {
	      disposables.add(createListener(el, eventName, handler, useCapture));
	    }
	    return disposables;
	  }
	
	  var FromEventObservable = (function(__super__) {
	    inherits(FromEventObservable, __super__);
	    function FromEventObservable(element, eventName, selector, useCapture) {
	      this._e = element;
	      this._n = eventName;
	      this._fn = selector;
	      this._uc = useCapture;
	      __super__.call(this);
	    }
	
	    function createHandler(o, fn) {
	      return function handler() {
	        var results = arguments[0];
	        if (fn) {
	          results = tryCatch(fn).apply(null, arguments);
	          if (results === errorObj) { return o.onError(results.e); }
	        }
	        o.onNext(results);
	      };
	    }
	
	    FromEventObservable.prototype.subscribeCore = function (o) {
	      return createEventListener(
	        this._e,
	        this._n,
	        createHandler(o, this._fn),
	        this._uc);
	    };
	
	    return FromEventObservable;
	  }(ObservableBase));
	
	  /**
	   * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
	   * @param {Object} element The DOMElement or NodeList to attach a listener.
	   * @param {String} eventName The event name to attach the observable sequence.
	   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
	   * @param {Boolean} [useCapture] If true, useCapture indicates that the user wishes to initiate capture. After initiating capture, all events of the specified type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree. Events which are bubbling upward through the tree will not trigger a listener designated to use capture
	   * @returns {Observable} An observable sequence of events from the specified element and the specified event.
	   */
	  var fromEvent = dom.fromEvent = function (element, eventName, selector, useCapture) {
	    var selectorFn = isFunction(selector) ? selector : null;
	    typeof selector === 'boolean' && (useCapture = selector);
	    typeof useCapture === 'undefined' && (useCapture = false);
	    return new FromEventObservable(element, eventName, selectorFn, useCapture).publish().refCount();
	  };
	
	  (function () {
	    var events = 'blur focus focusin focusout load resize scroll unload click dblclick ' +
	      'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
	      'change select submit keydown keypress keyup error contextmenu input';
	
	    if (root.PointerEvent) {
	      events += ' pointerdown pointerup pointermove pointerover pointerout pointerenter pointerleave';
	    }
	
	    if (root.TouchEvent) {
	      events += ' touchstart touchend touchmove touchcancel';
	    }
	
	    events = events.split(' ');
	
	    for(var i = 0, len = events.length; i < len; i++) {
	      (function (e) {
	        dom[e] = function (element, selector, useCapture) {
	          return fromEvent(element, e, selector, useCapture);
	        };
	      }(events[i]))
	    }
	  }());
	
	  var ReadyObservable = (function (__super__) {
	    inherits(ReadyObservable, __super__);
	    function ReadyObservable() {
	      __super__.call(this);
	    }
	
	    function createHandler(o) {
	      return function handler() {
	        o.onNext();
	        o.onCompleted();
	      };
	    }
	
	    ReadyObservable.prototype.subscribeCore = function (o) {
	      return new ReadyDisposable(o, createHandler(o));
	    };
	
	    function ReadyDisposable(o, fn) {
	      this._o = o;
	      this._fn = fn;
	      this._addedHandlers = false;
	      this.isDisposed = false;
	
	      if (root.document.readyState === 'complete') {
	        setTimeout(this._fn, 0);
	      } else {
	        this._addedHandlers = true;
	        root.document.addEventListener( 'DOMContentLoaded', this._fn, false );
	      }
	    }
	
	    ReadyDisposable.prototype.dispose = function () {
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        root.document.removeEventListener( 'DOMContentLoaded', this._fn, false );
	      }
	    };
	
	    return ReadyObservable;
	  }(ObservableBase));
	
	  /**
	   * Creates an observable sequence when the DOM is loaded
	   * @returns {Observable} An observable sequence fired when the DOM is loaded
	   */
	  dom.ready = function () {
	    return new ReadyObservable();
	  };
	
	
	  // Gets the proper XMLHttpRequest for support for older IE
	  function getXMLHttpRequest() {
	    if (root.XMLHttpRequest) {
	      return new root.XMLHttpRequest();
	    } else {
	      var progId;
	      try {
	        var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
	        for(var i = 0; i < 3; i++) {
	          try {
	            progId = progIds[i];
	            if (new root.ActiveXObject(progId)) {
	              break;
	            }
	          } catch(e) { }
	        }
	        return new root.ActiveXObject(progId);
	      } catch (e) {
	        throw new Error('XMLHttpRequest is not supported by your browser');
	      }
	    }
	  }
	
	  // Get CORS support even for older IE
	  function getCORSRequest() {
	    var xhr = new root.XMLHttpRequest();
	    if ('withCredentials' in xhr) {
	      xhr.withCredentials = true;
	      return xhr;
	    } else if (!!root.XDomainRequest) {
	      return new XDomainRequest();
	    } else {
	      throw new Error('CORS is not supported by your browser');
	    }
	  }
	
	  function normalizeAjaxSuccessEvent(e, xhr, settings) {
	    var response = ('response' in xhr) ? xhr.response : xhr.responseText;
	    response = settings.responseType === 'json' ? JSON.parse(response) : response;
	    return {
	      response: response,
	      status: xhr.status,
	      responseType: xhr.responseType,
	      xhr: xhr,
	      originalEvent: e
	    };
	  }
	
	  function normalizeAjaxErrorEvent(e, xhr, type) {
	    return {
	      type: type,
	      status: xhr.status,
	      xhr: xhr,
	      originalEvent: e
	    };
	  }
	
	  var AjaxObservable = (function(__super__) {
	    inherits(AjaxObservable, __super__);
	    function AjaxObservable(settings) {
	      this._settings = settings;
	      __super__.call(this);
	    }
	
	    AjaxObservable.prototype.subscribeCore = function (o) {
	      var state = { isDone: false };
	      var xhr;
	
	      var settings = this._settings;
	      var normalizeError = settings.normalizeError;
	      var normalizeSuccess = settings.normalizeSuccess;
	
	      var processResponse = function(xhr, e){
	        var status = xhr.status === 1223 ? 204 : xhr.status;
	        if ((status >= 200 && status <= 300) || status === 0 || status === '') {
	          o.onNext(normalizeSuccess(e, xhr, settings));
	          o.onCompleted();
	        } else {
	          o.onError(settings.normalizeError(e, xhr, 'error'));
	        }
	        state.isDone = true;
	      };
	
	      try {
	        xhr = settings.createXHR();
	      } catch (err) {
	        return o.onError(err);
	      }
	
	      try {
	        if (settings.user) {
	          xhr.open(settings.method, settings.url, settings.async, settings.user, settings.password);
	        } else {
	          xhr.open(settings.method, settings.url, settings.async);
	        }
	
	        var headers = settings.headers;
	        for (var header in headers) {
	          if (hasOwnProperty.call(headers, header)) {
	            xhr.setRequestHeader(header, headers[header]);
	          }
	        }
	
	        xhr.timeout = settings.timeout;
	        xhr.ontimeout = function (e) {
	          settings.progressObserver && settings.progressObserver.onError(e);
	          o.onError(normalizeError(e, xhr, 'timeout'));
	        };
	
	        if(!!xhr.upload || (!('withCredentials' in xhr) && !!root.XDomainRequest)) {
	          xhr.onload = function(e) {
	            if(settings.progressObserver) {
	              settings.progressObserver.onNext(e);
	              settings.progressObserver.onCompleted();
	            }
	            processResponse(xhr, e);
	          };
	
	          if(settings.progressObserver) {
	            xhr.onprogress = function(e) {
	              settings.progressObserver.onNext(e);
	            };
	          }
	
	          xhr.onerror = function(e) {
	            settings.progressObserver && settings.progressObserver.onError(e);
	            o.onError(normalizeError(e, xhr, 'error'));
	            state.isDone = true;
	          };
	
	          xhr.onabort = function(e) {
	            settings.progressObserver && settings.progressObserver.onError(e);
	            o.onError(normalizeError(e, xhr, 'abort'));
	            state.isDone = true;
	          };
	        } else {
	          xhr.onreadystatechange = function (e) {
	            xhr.readyState === 4 && processResponse(xhr, e);
	          };
	        }
	
	        var contentType = settings.headers['Content-Type'] ||
	            settings.headers['Content-type'] ||
	            settings.headers['content-type'];
	        if (settings.hasContent && contentType === 'application/x-www-form-urlencoded' && typeof settings.body !== 'string') {
	          var newBody = [];
	          for (var prop in settings.body) {
	            if (hasOwnProperty.call(settings.body, prop)) {
	              newBody.push(prop + '=' + settings.body[prop]);
	            }
	          }
	          settings.body = newBody.join('&');
	        }
	
	        xhr.send(settings.hasContent && settings.body || null);
	      } catch (e) {
	        o.onError(e);
	      }
	
	      return new AjaxDisposable(state, xhr);
	    };
	
	    function AjaxDisposable(state, xhr) {
	      this._state = state;
	      this._xhr = xhr;
	      this.isDisposed = false;
	    }
	
	    AjaxDisposable.prototype.dispose = function () {
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        if (!this._state.isDone && this._xhr.readyState !== 4) { this._xhr.abort(); }
	      }
	    };
	
	    return AjaxObservable;
	  }(ObservableBase));
	
	  /**
	   * Creates an observable for an Ajax request with either a settings object with url, headers, etc or a string for a URL.
	   *
	   * @example
	   *   source = Rx.DOM.ajax('/products');
	   *   source = Rx.DOM.ajax( url: 'products', method: 'GET' });
	   *
	   * @param {Object} settings Can be one of the following:
	   *
	   *  A string of the URL to make the Ajax call.
	   *  An object with the following properties
	   *   - url: URL of the request
	   *   - body: The body of the request
	   *   - method: Method of the request, such as GET, POST, PUT, PATCH, DELETE
	   *   - async: Whether the request is async
	   *   - headers: Optional headers
	   *   - crossDomain: true if a cross domain request, else false
	   *
	   * @returns {Observable} An observable sequence containing the XMLHttpRequest.
	  */
	  var ajaxRequest = dom.ajax = function (options) {
	    var settings = {
	      method: 'GET',
	      crossDomain: false,
	      async: true,
	      headers: {},
	      responseType: 'text',
	      timeout: 0,
	      createXHR: function(){
	        return this.crossDomain ? getCORSRequest() : getXMLHttpRequest()
	      },
	      normalizeError: normalizeAjaxErrorEvent,
	      normalizeSuccess: normalizeAjaxSuccessEvent
	    };
	
	    if(typeof options === 'string') {
	      settings.url = options;
	    } else {
	      for(var prop in options) {
	        if(hasOwnProperty.call(options, prop)) {
	          settings[prop] = options[prop];
	        }
	      }
	    }
	
	    if (!settings.crossDomain && !settings.headers['X-Requested-With']) {
	      settings.headers['X-Requested-With'] = 'XMLHttpRequest';
	    }
	    settings.hasContent = settings.body !== undefined;
	
	    return new AjaxObservable(settings);
	  };
	
	  /**
	   * Creates an observable sequence from an Ajax POST Request with the body.
	   *
	   * @param {String} url The URL to POST
	   * @param {Object} body The body to POST
	   * @returns {Observable} The observable sequence which contains the response from the Ajax POST.
	   */
	  dom.post = function (url, body) {
	    var settings;
	    if (typeof url === 'string') {
	      settings = {url: url, body: body, method: 'POST' };
	    } else if (typeof url === 'object') {
	      settings = url;
	      settings.method = 'POST';
	    }
	    return ajaxRequest(settings);
	  };
	
	  /**
	   * Creates an observable sequence from an Ajax GET Request with the body.
	   *
	   * @param {String} url The URL to GET
	   * @returns {Observable} The observable sequence which contains the response from the Ajax GET.
	   */
	  dom.get = function (url) {
	    var settings;
	    if (typeof url === 'string') {
	      settings = {url: url };
	    } else if (typeof url === 'object') {
	      settings = url;
	    }
	    return ajaxRequest(settings);
	  };
	
	  /**
	   * Creates an observable sequence from JSON from an Ajax request
	   *
	   * @param {String} url The URL to GET
	   * @returns {Observable} The observable sequence which contains the parsed JSON.
	   */
	  dom.getJSON = function (url) {
	    if (!root.JSON && typeof root.JSON.parse !== 'function') { throw new TypeError('JSON is not supported in your runtime.'); }
	    return ajaxRequest({url: url, responseType: 'json'}).map(function (x) {
	      return x.response;
	    });
	  };
	
	  var destroy = (function () {
	    var trash = 'document' in root && root.document.createElement('div');
	    return function (element) {
	      trash.appendChild(element);
	      trash.innerHTML = '';
	    };
	  })();
	
	  var ScriptObservable = (function(__super__) {
	    inherits(ScriptObservable, __super__);
	    function ScriptObservable(settings) {
	      this._settings = settings;
	      __super__.call(this);
	    }
	
	    ScriptObservable.id = 0;
	
	    ScriptObservable.prototype.subscribeCore = function (o) {
	      var settings = {
	        jsonp: 'JSONPCallback',
	        async: true,
	        jsonpCallback: 'rxjsjsonpCallbacks' + 'callback_' + (ScriptObservable.id++).toString(36)
	      };
	
	      if(typeof this._settings === 'string') {
	        settings.url = this._settings;
	      } else {
	        for(var prop in this._settings) {
	          if(hasOwnProperty.call(this._settings, prop)) {
	            settings[prop] = this._settings[prop];
	          }
	        }
	      }
	
	      var script = root.document.createElement('script');
	      script.type = 'text/javascript';
	      script.async = settings.async;
	      script.src = settings.url.replace(settings.jsonp, settings.jsonpCallback);
	
	      root[settings.jsonpCallback] = function(data) {
	        root[settings.jsonpCallback].called = true;
	        root[settings.jsonpCallback].data = data;
	      };
	
	      var handler = function(e) {
	        if(e.type === 'load' && !root[settings.jsonpCallback].called) {
	          e = { type: 'error' };
	        }
	        var status = e.type === 'error' ? 400 : 200;
	        var data = root[settings.jsonpCallback].data;
	
	        if(status === 200) {
	          o.onNext({
	            status: status,
	            responseType: 'jsonp',
	            response: data,
	            originalEvent: e
	          });
	
	          o.onCompleted();
	        }
	        else {
	          o.onError({
	            type: 'error',
	            status: status,
	            originalEvent: e
	          });
	        }
	      };
	
	      script.onload = script.onreadystatechanged = script.onerror = handler;
	
	      var head = root.document.getElementsByTagName('head')[0] || root.document.documentElement;
	      head.insertBefore(script, head.firstChild);
	
	      return new ScriptDisposable(script);
	    };
	
	    function ScriptDisposable(script) {
	      this._script = script;
	      this.isDisposed = false;
	    }
	
	    ScriptDisposable.prototype.dispose = function () {
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        this._script.onload = this._script.onreadystatechanged = this._script.onerror = null;
	        destroy(this._script);
	        this._script = null;
	      }
	    };
	
	    return ScriptObservable;
	  }(ObservableBase));
	
	  /**
	   * Creates an observable JSONP Request with the specified settings.
	   * @param {Object} settings Can be one of the following:
	   *
	   *  A string of the URL to make the JSONP call with the JSONPCallback=? in the url.
	   *  An object with the following properties
	   *   - url: URL of the request
	   *   - jsonp: The named callback parameter for the JSONP call
	   *   - jsonpCallback: Callback to execute. For when the JSONP callback can't be changed
	   *
	   * @returns {Observable} A cold observable containing the results from the JSONP call.
	   */
	   dom.jsonpRequest = function (settings) {
	     return new ScriptObservable(settings);
	   };
	
	  function socketClose(socket, closingObserver, code, reason) {
	    if (socket) {
	      if (closingObserver) {
	        closingObserver.onNext();
	        closingObserver.onCompleted();
	      }
	      if (!code) {
	        socket.close();
	      } else {
	        socket.close(code, reason);
	      }
	    }
	  }
	
	  var SocketObservable = (function (__super__) {
	    inherits(SocketObservable, __super__);
	    function SocketObservable(state, url, protocol, open, close) {
	      this._state = state;
	      this._url = url;
	      this._protocol = protocol;
	      this._open = open;
	      this._close = close;
	      __super__.call(this);
	    }
	
	    function createOpenHandler(open, socket) {
	      return function openHandler(e) {
	        open.onNext(e);
	        open.onCompleted();
	        socket.removeEventListener('open', openHandler, false);
	      };
	    }
	    function createMsgHandler(o) { return function msgHandler(e) { o.onNext(e); }; }
	    function createErrHandler(o) { return function errHandler(e) { o.onError(e); }; }
	    function createCloseHandler(o) {
	      return function closeHandler(e) {
	        if (e.code !== 1000 || !e.wasClean) { return o.onError(e); }
	        o.onCompleted();
	      };
	    }
	
	    function SocketDisposable(socket, msgFn, errFn, closeFn, close) {
	      this._socket = socket;
	      this._msgFn = msgFn;
	      this._errFn = errFn;
	      this._closeFn = closeFn;
	      this._close = close;
	      this.isDisposed = false;
	    }
	
	    SocketDisposable.prototype.dispose = function () {
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        socketClose(this._socket, this._close);
	
	        this._socket.removeEventListener('message', this._msgFn, false);
	        this._socket.removeEventListener('error', this._errFn, false);
	        this._socket.removeEventListener('close', this._closeFn, false);
	      }
	    };
	
	    SocketObservable.prototype.subscribeCore = function (o) {
	      this._state.socket = this._protocol ? new WebSocket(this._url, this._protocol) : new WebSocket(this._url);
	
	      var openHandler = createOpenHandler(this._open, this._state.socket);
	      var msgHandler = createMsgHandler(o);
	      var errHandler = createErrHandler(o);
	      var closeHandler = createCloseHandler(o);
	
	      this._open && this._state.socket.addEventListener('open', openHandler, false);
	      this._state.socket.addEventListener('message', msgHandler, false);
	      this._state.socket.addEventListener('error', errHandler, false);
	      this._state.socket.addEventListener('close', closeHandler, false);
	
	      return new SocketDisposable(this._state.socket, msgHandler, errHandler, closeHandler, this._close);
	    };
	
	    return SocketObservable;
	  }(ObservableBase));
	
	  var SocketObserver = (function (__super__) {
	    inherits(SocketObserver, __super__);
	    function SocketObserver(state, close) {
	      this._state = state;
	      this._close = close;
	      __super__.call(this);
	    }
	
	    SocketObserver.prototype.next = function (x) {
	      this._state.socket && this._state.socket.readyState === WebSocket.OPEN && this._state.socket.send(x);
	    };
	
	    SocketObserver.prototype.error = function (e) {
	      if (!e.code) {
	        throw new Error('no code specified. be sure to pass { code: ###, reason: "" } to onError()');
	      }
	      socketClose(this._state.socket, this._close, e.code, e.reason || '');
	    };
	
	    SocketObserver.prototype.completed = function () {
	      socketClose(this._state.socket, this._close, 1000, '');
	    };
	
	    return SocketObserver;
	  }(AbstractObserver));
	
	   /**
	   * Creates a WebSocket Subject with a given URL, protocol and an optional observer for the open event.
	   *
	   * @example
	   *  var socket = Rx.DOM.fromWebSocket('http://localhost:8080', 'stock-protocol', openObserver, closingObserver);
	   *
	   * @param {String} url The URL of the WebSocket.
	   * @param {String} protocol The protocol of the WebSocket.
	   * @param {Observer} [openObserver] An optional Observer to capture the open event.
	   * @param {Observer} [closingObserver] An optional Observer to capture the moment before the underlying socket is closed.
	   * @returns {Subject} An observable sequence wrapping a WebSocket.
	   */
	  dom.fromWebSocket = function (url, protocol, openObserver, closingObserver) {
	    if (!WebSocket) { throw new TypeError('WebSocket not implemented in your runtime.'); }
	    var state = { socket: null };
	    return Subject.create(
	      new SocketObserver(state, closingObserver),
	      new SocketObservable(state, url, protocol, openObserver, closingObserver)
	    );
	  };
	
	  var WorkerObserver = (function (__super__) {
	    inherits(WorkerObserver, __super__);
	    function WorkerObserver(state) {
	      this._state = state;
	      __super__.call(this);
	    }
	
	    WorkerObserver.prototype.next = function (x) { this._state.worker && this._state.worker.postMessage(x); };
	    WorkerObserver.prototype.error = function (e) { throw e; };
	    WorkerObserver.prototype.completed = function () { };
	
	    return WorkerObserver;
	  }(AbstractObserver));
	
	  var WorkerObservable = (function (__super__) {
	    inherits(WorkerObservable, __super__);
	    function WorkerObservable(state, url) {
	      this._state = state;
	      this._url = url;
	      __super__.call(this);
	    }
	
	    function createMessageHandler(o) { return function messageHandler (e) { o.onNext(e); }; }
	    function createErrHandler(o) { return function errHandler(e) { o.onError(e); }; }
	
	    function WorkerDisposable(w, msgFn, errFn) {
	      this._w = w;
	      this._msgFn = msgFn;
	      this._errFn = errFn;
	      this.isDisposed = false;
	    }
	
	    WorkerDisposable.prototype.dispose = function () {
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        this._w.terminate();
	        this._w.removeEventListener('message', this._msgFn, false);
	        this._w.removeEventListener('error', this._errFn, false);
	      }
	    };
	
	    WorkerObservable.prototype.subscribeCore = function (o) {
	      this._state.worker = new root.Worker(this._url);
	
	      var messageHandler = createMessageHandler(o);
	      var errHandler = createErrHandler(o);
	
	      this._state.worker.addEventListener('message', messageHandler, false);
	      this._state.worker.addEventListener('error', errHandler, false);
	
	      return new WorkerDisposable(this._state.worker, messageHandler, errHandler);
	    };
	
	    return WorkerObservable;
	  }(ObservableBase));
	
	  /**
	   * Creates a Web Worker with a given URL as a Subject.
	   *
	   * @example
	   * var worker = Rx.DOM.fromWebWorker('worker.js');
	   *
	   * @param {String} url The URL of the Web Worker.
	   * @returns {Subject} A Subject wrapping the Web Worker.
	   */
	  dom.fromWorker = function (url) {
	    if (!root.Worker) { throw new TypeError('Worker not implemented in your runtime.'); }
	    var state = { worker: null };
	    return Subject.create(new WorkerObserver(state), new WorkerObservable(state, url));
	  };
	
	  function getMutationObserver(next) {
	    var M = root.MutationObserver || root.WebKitMutationObserver;
	    return new M(next);
	  }
	
	  var MutationObserverObservable = (function (__super__) {
	    inherits(MutationObserverObservable, __super__);
	    function MutationObserverObservable(target, options) {
	      this._target = target;
	      this._options = options;
	      __super__.call(this);
	    }
	
	    function InnerDisposable(mutationObserver) {
	      this._m = mutationObserver;
	      this.isDisposed = false;
	    }
	
	    InnerDisposable.prototype.dispose = function () {
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        this._m.disconnect();
	      }
	    };
	
	    MutationObserverObservable.prototype.subscribeCore = function (o) {
	      var mutationObserver = getMutationObserver(function (e) { o.onNext(e); });
	      mutationObserver.observe(this._target, this._options);
	      return new InnerDisposable(mutationObserver);
	    };
	
	    return MutationObserverObservable;
	  }(ObservableBase));
	
	  /**
	   * Creates an observable sequence from a Mutation Observer.
	   * MutationObserver provides developers a way to react to changes in a DOM.
	   * @example
	   *  Rx.DOM.fromMutationObserver(document.getElementById('foo'), { attributes: true, childList: true, characterData: true });
	   *
	   * @param {Object} target The Node on which to obserave DOM mutations.
	   * @param {Object} options A MutationObserverInit object, specifies which DOM mutations should be reported.
	   * @returns {Observable} An observable sequence which contains mutations on the given DOM target.
	   */
	  dom.fromMutationObserver = function (target, options) {
	    if (!(root.MutationObserver || root.WebKitMutationObserver)) { throw new TypeError('MutationObserver not implemented in your runtime.'); }
	    return new MutationObserverObservable(target, options);
	  };
	
	  var CurrentPositionObservable = (function (__super__) {
	    inherits(CurrentPositionObservable, __super__);
	    function CurrentPositionObservable(opts) {
	      this._opts = opts;
	      __super__.call(this);
	    }
	
	    CurrentPositionObservable.prototype.subscribeCore = function (o) {
	      root.navigator.geolocation.getCurrentPosition(
	        function (data) {
	          o.onNext(data);
	          o.onCompleted();
	        },
	        function (e) { o.onError(e); },
	        this._opts);
	    };
	
	    return CurrentPositionObservable;
	  }(ObservableBase));
	
	  var WatchPositionObservable = (function (__super__) {
	    inherits(WatchPositionObservable, __super__);
	    function WatchPositionObservable(opts) {
	      this._opts = opts;
	      __super__.call(this);
	    }
	
	    function WatchPositionDisposable(id) {
	      this._id = id;
	      this.isDisposed = false;
	    }
	
	    WatchPositionDisposable.prototype.dispose = function () {
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        root.navigator.geolocation.clearWatch(this._id);
	      }
	    };
	
	    WatchPositionObservable.prototype.subscribeCore = function (o) {
	      var watchId = root.navigator.geolocation.watchPosition(
	        function (x) { o.onNext(x); },
	        function (e) { o.onError(e); },
	        this._opts);
	
	      return new WatchPositionDisposable(watchId);
	    };
	
	    return WatchPositionObservable;
	  }(ObservableBase));
	
	  Rx.DOM.geolocation = {
	    /**
	    * Obtains the geographic position, in terms of latitude and longitude coordinates, of the device.
	    * @param {Object} [geolocationOptions] An object literal to specify one or more of the following attributes and desired values:
	    *   - enableHighAccuracy: Specify true to obtain the most accurate position possible, or false to optimize in favor of performance and power consumption.
	    *   - timeout: An Integer value that indicates the time, in milliseconds, allowed for obtaining the position.
	    *              If timeout is Infinity, (the default value) the location request will not time out.
	    *              If timeout is zero (0) or negative, the results depend on the behavior of the location provider.
	    *   - maximumAge: An Integer value indicating the maximum age, in milliseconds, of cached position information.
	    *                 If maximumAge is non-zero, and a cached position that is no older than maximumAge is available, the cached position is used instead of obtaining an updated location.
	    *                 If maximumAge is zero (0), watchPosition always tries to obtain an updated position, even if a cached position is already available.
	    *                 If maximumAge is Infinity, any cached position is used, regardless of its age, and watchPosition only tries to obtain an updated position if no cached position data exists.
	    * @returns {Observable} An observable sequence with the geographical location of the device running the client.
	    */
	    getCurrentPosition: function (geolocationOptions) {
	      if (!root.navigator && !root.navigation.geolocation) { throw new TypeError('geolocation not available'); }
	      return new CurrentPositionObservable(geolocationOptions);
	    },
	
	    /**
	    * Begins listening for updates to the current geographical location of the device running the client.
	    * @param {Object} [geolocationOptions] An object literal to specify one or more of the following attributes and desired values:
	    *   - enableHighAccuracy: Specify true to obtain the most accurate position possible, or false to optimize in favor of performance and power consumption.
	    *   - timeout: An Integer value that indicates the time, in milliseconds, allowed for obtaining the position.
	    *              If timeout is Infinity, (the default value) the location request will not time out.
	    *              If timeout is zero (0) or negative, the results depend on the behavior of the location provider.
	    *   - maximumAge: An Integer value indicating the maximum age, in milliseconds, of cached position information.
	    *                 If maximumAge is non-zero, and a cached position that is no older than maximumAge is available, the cached position is used instead of obtaining an updated location.
	    *                 If maximumAge is zero (0), watchPosition always tries to obtain an updated position, even if a cached position is already available.
	    *                 If maximumAge is Infinity, any cached position is used, regardless of its age, and watchPosition only tries to obtain an updated position if no cached position data exists.
	    * @returns {Observable} An observable sequence with the current geographical location of the device running the client.
	    */
	    watchPosition: function (geolocationOptions) {
	      if (!root.navigator && !root.navigation.geolocation) { throw new TypeError('geolocation not available'); }
	      return new WatchPositionObservable(geolocationOptions).publish().refCount();
	    }
	  };
	
	  var FromReaderObservable = (function (__super__) {
	    inherits(FromReaderObservable, __super__);
	    function FromReaderObservable(readerFn, file, progressObserver, encoding) {
	      this._readerFn  = readerFn;
	      this._file = file;
	      this._progressObserver = progressObserver;
	      this._encoding = encoding;
	      __super__.call(this);
	    }
	
	    function createLoadHandler(o, p) {
	      return function loadHandler(e) {
	        p && p.onCompleted();
	        o.onNext(e.target.result);
	        o.onCompleted();
	      };
	    }
	
	    function createErrorHandler(o) { return function errorHandler (e) { o.onError(e.target.error); }; }
	    function createProgressHandler(o) { return function progressHandler (e) { o.onNext(e); }; }
	
	    function FromReaderDisposable(reader, progressObserver, loadHandler, errorHandler, progressHandler) {
	      this._r = reader;
	      this._po = progressObserver;
	      this._lFn = loadHandler;
	      this._eFn = errorHandler;
	      this._pFn = progressHandler;
	      this.isDisposed = false;
	    }
	
	    FromReaderDisposable.prototype.dispose = function () {
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        this._r.readyState === root.FileReader.LOADING && this._r.abort();
	        this._r.removeEventListener('load', this._lFn, false);
	        this._r.removeEventListener('error', this._eFn, false);
	        this._po && this._r.removeEventListener('progress', this._pFn, false);
	      }
	    };
	
	    FromReaderObservable.prototype.subscribeCore = function (o) {
	      var reader = new root.FileReader();
	
	      var loadHandler = createLoadHandler(o, this._progressObserver);
	      var errorHandler = createErrorHandler(o);
	      var progressHandler = createProgressHandler(this._progressObserver);
	
	      reader.addEventListener('load', loadHandler, false);
	      reader.addEventListener('error', errorHandler, false);
	      this._progressObserver && reader.addEventListener('progress', progressHandler, false);
	
	      reader[this._readerFn](this._file, this._encoding);
	
	      return new FromReaderDisposable(reader, this._progressObserver, loadHandler, errorHandler, progressHandler);
	    };
	
	    return FromReaderObservable;
	  }(ObservableBase));
	
	  /**
	   * The FileReader object lets web applications asynchronously read the contents of
	   * files (or raw data buffers) stored on the user's computer, using File or Blob objects
	   * to specify the file or data to read as an observable sequence.
	   * @param {String} file The file to read.
	   * @param {Observer} An observer to watch for progress.
	   * @returns {Object} An object which contains methods for reading the data.
	   */
	  dom.fromReader = function(file, progressObserver) {
	    if (!root.FileReader) { throw new TypeError('FileReader not implemented in your runtime.'); }
	
	    return {
	      /**
	       * This method is used to read the file as an ArrayBuffer as an Observable stream.
	       * @returns {Observable} An observable stream of an ArrayBuffer
	       */
	      asArrayBuffer : function() {
	        return new FromReaderObservable('readAsArrayBuffer', file, progressObserver);
	      },
	      /**
	       * This method is used to read the file as a binary data string as an Observable stream.
	       * @returns {Observable} An observable stream of a binary data string.
	       */
	      asBinaryString : function() {
	        return new FromReaderObservable('readAsBinaryString', file, progressObserver);
	      },
	      /**
	       * This method is used to read the file as a URL of the file's data as an Observable stream.
	       * @returns {Observable} An observable stream of a URL representing the file's data.
	       */
	      asDataURL : function() {
	        return new FromReaderObservable('readAsDataURL', file, progressObserver);
	      },
	      /**
	       * This method is used to read the file as a string as an Observable stream.
	       * @returns {Observable} An observable stream of the string contents of the file.
	       */
	      asText : function(encoding) {
	        return new FromReaderObservable('readAsText', file, progressObserver, encoding);
	      }
	    };
	  };
	
	  var EventSourceObservable = (function(__super__) {
	    inherits(EventSourceObservable, __super__);
	    function EventSourceObservable(url, open) {
	      this._url = url;
	      this._open = open;
	      __super__.call(this);
	    }
	
	    function createOnOpen(o, source) {
	      return function onOpen(e) {
	        o.onNext(e);
	        o.onCompleted();
	        source.removeEventListener('open', onOpen, false);
	      };
	    }
	
	    function createOnError(o) {
	      return function onError(e) {
	        if (e.readyState === EventSource.CLOSED) {
	          o.onCompleted();
	        } else {
	          o.onError(e);
	        }
	      };
	    }
	
	    function createOnMessage(o) { return function onMessage(e) { o.onNext(e.data); }; }
	
	    function EventSourceDisposable(s, errFn, msgFn) {
	      this._s = s;
	      this._errFn = errFn;
	      this._msgFn = msgFn;
	      this.isDisposed = false;
	    }
	
	    EventSourceDisposable.prototype.dispose = function () {
	      if (!this.isDisposed) {
	        this._s.removeEventListener('error', this._errFn, false);
	        this._s.removeEventListener('message', this._msgFn, false);
	        this._s.close();
	      }
	    };
	
	    EventSourceObservable.prototype.subscribeCore = function (o) {
	      var source = new EventSource(this._url);
	      var onOpen = createOnOpen(this._open, source);
	      var onError = createOnError(o);
	      var onMessage = createOnMessage(o);
	
	      this._open && source.addEventListener('open', onOpen, false);
	      source.addEventListener('error', onError, false);
	      source.addEventListener('message', onMessage, false);
	
	      return new EventSourceDisposable(source, onError, onMessage);
	    };
	
	    return EventSourceObservable;
	  }(ObservableBase));
	
	  /**
	   * This method wraps an EventSource as an observable sequence.
	   * @param {String} url The url of the server-side script.
	   * @param {Observer} [openObserver] An optional observer for the 'open' event for the server side event.
	   * @returns {Observable} An observable sequence which represents the data from a server-side event.
	   */
	  dom.fromEventSource = function (url, openObserver) {
	    if (!root.EventSource) { throw new TypeError('EventSource not implemented in your runtime.'); }
	    return new EventSourceObservable(url, openObserver);
	  };
	
	  var requestAnimFrame, cancelAnimFrame;
	  if (root.requestAnimationFrame) {
	    requestAnimFrame = root.requestAnimationFrame;
	    cancelAnimFrame = root.cancelAnimationFrame;
	  } else if (root.mozRequestAnimationFrame) {
	    requestAnimFrame = root.mozRequestAnimationFrame;
	    cancelAnimFrame = root.mozCancelAnimationFrame;
	  } else if (root.webkitRequestAnimationFrame) {
	    requestAnimFrame = root.webkitRequestAnimationFrame;
	    cancelAnimFrame = root.webkitCancelAnimationFrame;
	  } else if (root.msRequestAnimationFrame) {
	    requestAnimFrame = root.msRequestAnimationFrame;
	    cancelAnimFrame = root.msCancelAnimationFrame;
	  } else if (root.oRequestAnimationFrame) {
	    requestAnimFrame = root.oRequestAnimationFrame;
	    cancelAnimFrame = root.oCancelAnimationFrame;
	  } else {
	    requestAnimFrame = function(cb) { root.setTimeout(cb, 1000 / 60); };
	    cancelAnimFrame = root.clearTimeout;
	  }
	
	  /**
	   * Gets a scheduler that schedules schedules work on the requestAnimationFrame for immediate actions.
	   */
	  Scheduler.requestAnimationFrame = (function () {
	    var RequestAnimationFrameScheduler = (function (__super__) {
	      inherits(RequestAnimationFrameScheduler, __super__);
	      function RequestAnimationFrameScheduler() {
	        __super__.call(this);
	      }
	
	      function scheduleAction(disposable, action, scheduler, state) {
	        return function schedule() {
	          !disposable.isDisposed && disposable.setDisposable(Disposable._fixup(action(scheduler, state)));
	        };
	      }
	
	      function ClearDisposable(method, id) {
	        this._id = id;
	        this._method = method;
	        this.isDisposed = false;
	      }
	
	      ClearDisposable.prototype.dispose = function () {
	        if (!this.isDisposed) {
	          this.isDisposed = true;
	          this._method.call(null, this._id);
	        }
	      };
	
	      RequestAnimationFrameScheduler.prototype.schedule = function (state, action) {
	        var disposable = new SingleAssignmentDisposable(),
	            id = requestAnimFrame(scheduleAction(disposable, action, this, state));
	        return new BinaryDisposable(disposable, new ClearDisposable(cancelAnimFrame, id));
	      };
	
	      RequestAnimationFrameScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
	        if (dueTime === 0) { return this.schedule(state, action); }
	        var disposable = new SingleAssignmentDisposable(),
	            id = root.setTimeout(scheduleAction(disposable, action, this, state), dueTime);
	        return new BinaryDisposable(disposable, new ClearDisposable(root.clearTimeout, id));
	      };
	
	      return RequestAnimationFrameScheduler;
	    }(Scheduler));
	
	    return new RequestAnimationFrameScheduler();
	  }());
	
	  /**
	   * Scheduler that uses a MutationObserver changes as the scheduling mechanism
	   */
	  Scheduler.microtask = (function () {
	
	    var nextHandle = 1, tasksByHandle = {}, currentlyRunning = false, scheduleMethod;
	
	    function clearMethod(handle) {
	      delete tasksByHandle[handle];
	    }
	
	    function runTask(handle) {
	      if (currentlyRunning) {
	        root.setTimeout(function () { runTask(handle) }, 0);
	      } else {
	        var task = tasksByHandle[handle];
	        if (task) {
	          currentlyRunning = true;
	          try {
	            task();
	          } catch (e) {
	            throw e;
	          } finally {
	            clearMethod(handle);
	            currentlyRunning = false;
	          }
	        }
	      }
	    }
	
	    function postMessageSupported () {
	      // Ensure not in a worker
	      if (!root.postMessage || root.importScripts) { return false; }
	      var isAsync = false, oldHandler = root.onmessage;
	      // Test for async
	      root.onmessage = function () { isAsync = true; };
	      root.postMessage('', '*');
	      root.onmessage = oldHandler;
	
	      return isAsync;
	    }
	
	    // Use in order, setImmediate, nextTick, postMessage, MessageChannel, script readystatechanged, setTimeout
	    var BrowserMutationObserver = root.MutationObserver || root.WebKitMutationObserver;
	    if (!!BrowserMutationObserver) {
	
	      var PREFIX = 'drainqueue_';
	
	      var observer = new BrowserMutationObserver(function(mutations) {
	        mutations.forEach(function (mutation) {
	          runTask(mutation.attributeName.substring(PREFIX.length));
	        })
	      });
	
	      var element = root.document.createElement('div');
	      observer.observe(element, { attributes: true });
	
	      // Prevent leaks
	      root.addEventListener('unload', function () {
	        observer.disconnect();
	        observer = null;
	      }, false);
	
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        element.setAttribute(PREFIX + id, 'drainQueue');
	        return id;
	      };
	    } else if (typeof root.setImmediate === 'function') {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        root.setImmediate(function () { runTask(id); });
	
	        return id;
	      };
	    } else if (postMessageSupported()) {
	      var MSG_PREFIX = 'ms.rx.schedule' + Math.random();
	
	      function onGlobalPostMessage(event) {
	        // Only if we're a match to avoid any other global events
	        if (typeof event.data === 'string' && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
	          runTask(event.data.substring(MSG_PREFIX.length));
	        }
	      }
	
	      if (root.addEventListener) {
	        root.addEventListener('message', onGlobalPostMessage, false);
	      } else if (root.attachEvent){
	        root.attachEvent('onmessage', onGlobalPostMessage);
	      }
	
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        root.postMessage(MSG_PREFIX + id, '*');
	        return id;
	      };
	    } else if (!!root.MessageChannel) {
	      var channel = new root.MessageChannel();
	
	      channel.port1.onmessage = function (event) {
	        runTask(event.data);
	      };
	
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        channel.port2.postMessage(id);
	        return id;
	      };
	    } else if ('document' in root && 'onreadystatechange' in root.document.createElement('script')) {
	
	      scheduleMethod = function (action) {
	        var scriptElement = root.document.createElement('script');
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	
	        scriptElement.onreadystatechange = function () {
	          runTask(id);
	          scriptElement.onreadystatechange = null;
	          scriptElement.parentNode.removeChild(scriptElement);
	          scriptElement = null;
	        };
	        root.document.documentElement.appendChild(scriptElement);
	
	        return id;
	      };
	
	    } else {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        root.setTimeout(function () {
	          runTask(id);
	        }, 0);
	
	        return id;
	      };
	    }
	
	    var MicroTaskScheduler = (function (__super__) {
	      inherits(MicroTaskScheduler, __super__);
	      function MicroTaskScheduler() {
	        __super__.call(this);
	      }
	
	      function scheduleAction(disposable, action, scheduler, state) {
	        return function schedule() {
	          !disposable.isDisposed && disposable.setDisposable(Disposable._fixup(action(scheduler, state)));
	        };
	      }
	
	      function ClearDisposable(method, id) {
	        this._id = id;
	        this._method = method;
	        this.isDisposed = false;
	      }
	
	      ClearDisposable.prototype.dispose = function () {
	        if (!this.isDisposed) {
	          this.isDisposed = true;
	          this._method.call(null, this._id);
	        }
	      };
	
	      MicroTaskScheduler.prototype.schedule = function (state, action) {
	        var disposable = new SingleAssignmentDisposable(),
	            id = scheduleMethod(scheduleAction(disposable, action, this, state));
	        return new BinaryDisposable(disposable, new ClearDisposable(clearMethod, id));
	      };
	
	      MicroTaskScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
	        if (dueTime === 0) { return this.schedule(state, action); }
	        var disposable = new SingleAssignmentDisposable(),
	            id = root.setTimeout(scheduleAction(disposable, action, this, state), dueTime);
	        return new BinaryDisposable(disposable, new ClearDisposable(root.clearTimeout, id));
	      };
	
	      return MicroTaskScheduler;
	    }(Scheduler));
	
	    return new MicroTaskScheduler();
	  }());
	
	  return Rx;
	}));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module), (function() { return this; }())))

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Dispatcher = exports.Dispatcher = (function () {
	    function Dispatcher() {
	        _classCallCheck(this, Dispatcher);
	
	        this.map = {};
	    }
	
	    _createClass(Dispatcher, [{
	        key: 'register',
	        value: function register(name, handler) {
	            if (this.map[name]) {
	                throw new Error(name + 'handler is already registered');
	            }
	            this.map[name] = handler;
	        }
	    }, {
	        key: 'lookup',
	        value: function lookup(name) {
	            return this.map[name];
	        }
	    }]);
	
	    return Dispatcher;
	})();

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Index = undefined;
	
	var _immutable = __webpack_require__(9);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	var _rx = __webpack_require__(3);
	
	var Rx = _interopRequireWildcard(_rx);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var LISTENER_SENTINEL = {};
	
	var Index = exports.Index = (function () {
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
	                    var subject = new Rx.ReplaySubject(1),
	                        subscription = parentRx.map(function (a) {
	                        if (a) {
	                            return a.get(lastFragment);
	                        }
	                        return def;
	                    }).distinctUntilChanged(function (x) {
	                        return x;
	                    }, function (x, y) {
	                        return x === y;
	                    })
	                    //.doOnNext(v => console.log('v', v.toJS()))
	                    .subscribe(subject);
	                    var oldSubscribe = subject.subscribe;
	                    subject.subscribe = function () {
	                        var sub = oldSubscribe.apply(this, arguments);
	
	                        return Rx.Disposable.create(function () {
	                            sub.dispose();
	                            if (!subject.hasObservers()) {
	                                subscription.dispose();
	                                self.listeners = self.listeners.removeIn(pathSlice);
	                            }
	                        });
	                    };
	                    return subject;
	                });
	            }, this.listeners);
	
	            return this.listeners.getIn(path.concat([LISTENER_SENTINEL]), new Rx.BehaviorSubject(Immutable.Map()));
	        }
	    }]);
	
	    return Index;
	})();

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.atom = atom;
	exports.swap = swap;
	
	var _rx = __webpack_require__(3);
	
	var Rx = _interopRequireWildcard(_rx);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function atom(value) {
	    return new Rx.BehaviorSubject(value);
	}
	
	function swap(aAtom, update) {
	    aAtom.onNext(update(aAtom.getValue()));
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SubscriptionMixin = exports.StatelessMixin = undefined;
	exports.deref = deref;
	exports.render = render;
	exports.viewP = viewP;
	exports.viewV = viewV;
	exports.viewSP = viewSP;
	exports.viewSV = viewSV;
	
	var _subs = __webpack_require__(4);
	
	var subs = _interopRequireWildcard(_subs);
	
	var _react = __webpack_require__(12);
	
	var React = _interopRequireWildcard(_react);
	
	var _rx = __webpack_require__(3);
	
	var Rx = _interopRequireWildcard(_rx);
	
	var _shouldupdate = __webpack_require__(13);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
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
	    return derefed.map(function (_ref) {
	        var _ref2 = _slicedToArray(_ref, 2);
	
	        var rx = _ref2[0];
	        var oldValue = _ref2[1];
	
	        return rx.getValue() !== oldValue;
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
	    data.toUpdate.sort(function (_ref3, _ref4) {
	        var _ref6 = _slicedToArray(_ref3, 1);
	
	        var o1 = _ref6[0];
	
	        var _ref5 = _slicedToArray(_ref4, 1);
	
	        var o2 = _ref5[0];
	        return o1 - o2;
	    });
	
	    data.toUpdate.forEach(function (_ref7) {
	        var _ref8 = _slicedToArray(_ref7, 2);
	
	        var _ = _ref8[0];
	        var forceUpdate = _ref8[1];
	        return forceUpdate();
	    });
	    data.toUpdate = [];
	}
	subs.render$.subscribe(render);
	window.render = render;
	
	var StatelessMixin = exports.StatelessMixin = {
	    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	        return (0, _shouldupdate.shouldUpdate)(this.props, nextProps, ['argv']) || (0, _shouldupdate.shouldUpdate)(this.state, nextState) || (0, _shouldupdate.shouldUpdate)(this.props.argv, nextProps.argv);
	    },
	    getDisplayName: function getDisplayName() {
	        return this.constructor.displayName;
	    }
	};
	
	var SubscriptionMixin = exports.SubscriptionMixin = {
	    derefSub: function derefSub(subVec) {
	        return this.deref(subs.subscribe(subVec));
	    },
	
	    getDisplayName: function getDisplayName() {
	        return this.constructor.displayName;
	    },
	    getInitialState: function getInitialState() {
	        return {
	            derefed: [],
	            renderOrder: data.renderOrder++
	        };
	    },
	    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	        var updateByProps = (0, _shouldupdate.shouldUpdate)(this.props, nextProps, ['argv']) || (0, _shouldupdate.shouldUpdate)(this.props.argv, nextProps.argv),
	            updateByState = (0, _shouldupdate.shouldUpdate)(this.state, nextState, ['derefed', 'renderOrder']);
	
	        return updateByProps || updateByState;
	    },
	    deref: function deref(rx, aTransform) {
	        var _this = this;
	
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
	            needUpdate(_this);
	        }));
	        this.state.derefed.push([subj, subj.getValue(), disposable]);
	        return subj.getValue();
	    },
	    unsubscribe: function unsubscribe() {
	        this.state.derefed.forEach(function (_ref9) {
	            var _ref10 = _slicedToArray(_ref9, 3);
	
	            var _1 = _ref10[0];
	            var _2 = _ref10[1];
	            var subscription = _ref10[2];
	
	            subscription.dispose();
	        });
	
	        this.state.derefed = [];
	    },
	    componentWillUpdate: function componentWillUpdate() {
	        // console.log('Rendering', this.getDisplayName());
	        this.unsubscribe();
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        this.unsubscribe();
	    }
	};
	
	function createComponentObj(mixins, args) {
	    var componentObj = undefined;
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
	
	    return React.createFactory(component);
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
/* 12 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.shouldUpdate = shouldUpdate;
	
	var _underscore = __webpack_require__(14);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _utils = __webpack_require__(15);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
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
	    var entries = undefined;
	    if (nextProps === props || nextProps.length !== props.length) {
	        return false;
	    }
	    if (ignore && ignore.length > 0) {
	        var filtered = _underscore2.default.filter(props, function (v, k) {
	            return !_underscore2.default.contains(ignore, k);
	        });
	        entries = _underscore2.default.map(filtered, function (v, k) {
	            return [v, nextProps[k]];
	        });
	    } else {
	        entries = _underscore2.default.map(props, function (v, k) {
	            return [v, nextProps[k]];
	        });
	    }
	
	    if (entries.length) {
	        return _underscore2.default.some(entries, function (_ref) {
	            var _ref2 = _slicedToArray(_ref, 2);
	
	            var value = _ref2[0];
	            var nextValue = _ref2[1];
	
	            var immutableEqual = (0, _utils.compare)(value, nextValue, _utils.isImmutable, _utils.isImmutableEqual);
	
	            if (!_underscore2.default.isUndefined(immutableEqual)) {
	                if (!immutableEqual) {
	                    console.debug('Immutable ', value, nextValue, ' not equal');
	                }
	                return !immutableEqual;
	            }
	
	            var primitiveEqual = (0, _utils.compare)(value, nextValue, _utils.isPrimitive, _utils.isPrimitiveEqual);
	            if (!_underscore2.default.isUndefined(primitiveEqual)) {
	                if (!primitiveEqual) {
	                    console.debug('Primitive ', value, nextValue, ' not equal');
	                }
	                return !primitiveEqual;
	            }
	
	            console.warn('Props ', value, nextValue, ' are not immutable');
	            return true;
	        });
	    }
	    return false;
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.
	
	(function() {
	
	  // Baseline setup
	  // --------------
	
	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;
	
	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;
	
	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
	
	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;
	
	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind,
	    nativeCreate       = Object.create;
	
	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};
	
	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };
	
	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }
	
	  // Current version.
	  _.VERSION = '1.8.3';
	
	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };
	
	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	  };
	  _.iteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };
	
	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };
	
	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };
	
	  var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };
	
	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };
	
	  // Collection Functions
	  // --------------------
	
	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };
	
	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };
	
	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Optimized iterator function as using arguments.length
	    // in the main function will deoptimize the, see #1991.
	    function iterator(obj, iteratee, memo, keys, index, length) {
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    }
	
	    return function(obj, iteratee, memo, context) {
	      iteratee = optimizeCb(iteratee, context, 4);
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      // Determine the initial value if none is provided.
	      if (arguments.length < 3) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      return iterator(obj, iteratee, memo, keys, index, length);
	    };
	  }
	
	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);
	
	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);
	
	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      key = _.findKey(obj, predicate, context);
	    }
	    if (key !== void 0 && key !== -1) return obj[key];
	  };
	
	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };
	
	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };
	
	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };
	
	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };
	
	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };
	
	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      var func = isFunc ? method : value[method];
	      return func == null ? func : func.apply(value, args);
	    });
	  };
	
	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };
	
	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };
	
	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };
	
	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };
	
	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };
	
	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = isArrayLike(obj) ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };
	
	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };
	
	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };
	
	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };
	
	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });
	
	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });
	
	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });
	
	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };
	
	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };
	
	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };
	
	  // Array Functions
	  // ---------------
	
	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };
	
	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };
	
	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };
	
	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };
	
	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };
	
	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        //flatten current level of array or arguments object
	        if (!shallow) value = flatten(value, shallow, strict);
	        var j = 0, len = value.length;
	        output.length += len;
	        while (j < len) {
	          output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };
	
	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };
	
	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };
	
	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };
	
	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true));
	  };
	
	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };
	
	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(arguments, true, true, 1);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };
	
	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    return _.unzip(arguments);
	  };
	
	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);
	
	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };
	
	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };
	
	  // Generator function to create the findIndex and findLastIndex functions
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }
	
	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);
	
	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };
	
	  // Generator function to create the indexOf and lastIndexOf functions
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	            i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }
	
	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
	
	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;
	
	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);
	
	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }
	
	    return range;
	  };
	
	  // Function (ahem) Functions
	  // ------------------
	
	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };
	
	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function() {
	      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	  };
	
	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  };
	
	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };
	
	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };
	
	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };
	
	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);
	
	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };
	
	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;
	
	    var later = function() {
	      var last = _.now() - timestamp;
	
	      if (last < wait && last >= 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };
	
	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }
	
	      return result;
	    };
	  };
	
	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };
	
	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };
	
	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };
	
	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };
	
	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };
	
	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);
	
	  // Object Functions
	  // ----------------
	
	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
	
	  function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;
	
	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
	
	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  }
	
	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };
	
	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };
	
	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };
	
	  // Returns the results of applying the iteratee to each element of the object
	  // In contrast to _.map it returns an object
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys =  _.keys(obj),
	          length = keys.length,
	          results = {},
	          currentKey;
	      for (var index = 0; index < length; index++) {
	        currentKey = keys[index];
	        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	      }
	      return results;
	  };
	
	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };
	
	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };
	
	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };
	
	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);
	
	  // Assigns a given object with all the own properties in the passed-in object(s)
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);
	
	  // Returns the first key on an object that passes a predicate test
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };
	
	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	      keys = _.allKeys(obj);
	      iteratee = optimizeCb(oiteratee, context);
	    } else {
	      keys = flatten(arguments, false, false, 1);
	      iteratee = function(value, key, obj) { return key in obj; };
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  };
	
	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(flatten(arguments, false, false, 1), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };
	
	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);
	
	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };
	
	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };
	
	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };
	
	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };
	
	
	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }
	
	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;
	
	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	
	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }
	
	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);
	
	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };
	
	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };
	
	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };
	
	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };
	
	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };
	
	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };
	
	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });
	
	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }
	
	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), and in Safari 8 (#1929).
	  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }
	
	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };
	
	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };
	
	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };
	
	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };
	
	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };
	
	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };
	
	  // Utility Functions
	  // -----------------
	
	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };
	
	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };
	
	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };
	
	  _.noop = function(){};
	
	  _.property = property;
	
	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    return obj == null ? function(){} : function(key) {
	      return obj[key];
	    };
	  };
	
	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };
	
	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };
	
	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };
	
	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };
	
	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);
	
	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);
	
	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	      value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	  };
	
	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };
	
	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };
	
	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;
	
	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };
	
	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
	
	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };
	
	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);
	
	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');
	
	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;
	
	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }
	
	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";
	
	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
	
	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';
	
	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }
	
	    var template = function(data) {
	      return render.call(this, data, _);
	    };
	
	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';
	
	    return template;
	  };
	
	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };
	
	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.
	
	  // Helper function to continue chaining intermediate results.
	  var result = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };
	
	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result(this, func.apply(_, args));
	      };
	    });
	  };
	
	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);
	
	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result(this, obj);
	    };
	  });
	
	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result(this, method.apply(this._wrapped, arguments));
	    };
	  });
	
	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };
	
	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
	
	  _.prototype.toString = function() {
	    return '' + this._wrapped;
	  };
	
	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.isImmutable = isImmutable;
	exports.isImmutableEqual = isImmutableEqual;
	exports.isPrimitive = isPrimitive;
	exports.isPrimitiveEqual = isPrimitiveEqual;
	exports.compare = compare;
	
	var _underscore = __webpack_require__(14);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _immutable = __webpack_require__(9);
	
	var Immutable = _interopRequireWildcard(_immutable);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Predicate to check if a potential is an immutable structure or not.
	 * Override through `shouldComponentUpdate.withDefaults` to support different cursor
	 * implementations.
	 *
	 * Compare by property has better performance than instanceof in some browsers.
	 *
	 *
	 * @module shouldComponentUpdate.isImmutable
	 * @returns {Boolean}
	 * @api public
	 * @param maybeImmutable
	 */
	function isImmutable(maybeImmutable) {
	    return Immutable.Iterable.isIterable(maybeImmutable);
	}
	
	function isImmutableEqual(a, b) {
	    return a === b;
	}
	
	function isPrimitive(value) {
	    return _underscore2.default.isNumber(value) || _underscore2.default.isBoolean(value) || _underscore2.default.isString(value) || _underscore2.default.isNull(value) || _underscore2.default.isUndefined(value);
	}
	
	function isPrimitiveEqual(a, b) {
	    return a === b;
	}
	
	function compare(current, next, typeCheck, equalCheck) {
	    var isCurrent = typeCheck(current);
	    var isNext = typeCheck(next);
	
	    if (isCurrent && isNext) {
	        return equalCheck(current, next);
	    }
	    if (isCurrent || isNext) {
	        return false;
	    }
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=reframe.js.map