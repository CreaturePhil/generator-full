var express = require('express');

var routes = require('./config/routes');
var homeController = require('./app/controllers/homeController');

var login_required = require('./config/passport').isAuthenticated;

var controllers = {
  'home': homeController
};

var pre = {
  'login_required': login_required
};

/**
 * routing_ops: Routing operations mapping routes to application.
 * @app: {object} Express' application
 */
function routing_ops(app) {
  for (var path = 0, len = routes.length; path < len; path++) {
    var route = routes[path];
    var name = route.controller;
    var controller = controllers[name];
    var controller_property = controller[route.name];

    if (controller && controller_property) {
      var controller_component = controller_property();

      if (route.pre) {

        if (typeof route.pre === typeof 'String') {
          controller_component.get && app.get(route.path, pre[route.pre], controller_component.get);
          controller_component.post && app.post(route.path, pre[route.pre], controller_component.post);
          controller_component.put && app.put(route.path, pre[route.pre], controller_component.put);
          controller_component.delete && app.delete(route.path, pre[route.pre], controller_component.delete);
        } else if (typeof route.pre === typeof ['Array']) {

          if (route.pre.indexOf('get') >= 0) {
            controller_component.get && app.get(route.path, pre[route.pre], controller_component.get);
          } else {
            controller_component.get && app.get(route.path, controller_component.get);
          }

          if (route.pre.indexof('post') >= 0) {
            controller_component.post && app.post(route.path, pre[route.pre], controller_component.post);
          } else {
            controller_component.post && app.post(route.path, controller_component.post);
          }

          if (route.pre.indexof('put') >= 0) {
            controller_component.put && app.put(route.path, pre[route.pre], controller_component.put);
          } else {
            controller_component.put && app.put(route.path, controller_component.put);
          }

          if (route.pre.indexof('put') >= 0) {
            controller_component.delete && app.delete(route.path, pre[route.pre], controller_component.delete);
          } else {
            controller_component.delete && app.delete(route.path, controller_component.delete);
          }
        }
      } else {
        controller_component.get && app.get(route.path, controller_component.get);
        controller_component.post && app.post(route.path, controller_component.post);
        controller_component.put && app.put(route.path, controller_component.put);
        controller_component.delete && app.delete(route.path, controller_component.delete);
      }
    }
  }
}

module.exports = routing_ops;
