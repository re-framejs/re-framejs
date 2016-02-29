'use strict';
import * as commands from 'reframe/commands';
import * as subs from 'reframe/subs';
import * as db from 'reframe/db';
import * as atom from 'reframe/atom';
import * as react from 'reframe/react';
import * as middleware from 'reframe/middleware';

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