var express = require('express');

var routes = require('./config/routes');
var homeController = require('./app/controllers/homeController');

var login_required = 'PUT PASSPORT CONFIGURATION HERE!';

var controllers = {
  'home': homeController
};

function routing_ops(app) {
  for (var path = 0, len = routes.length; path < len; path++) {
    var route = routes[path];
    var name = route.controller;
    var controller = controllers[name];
    var controller_property = controller[route.name];
    var controller_component = controller_property();

    if (controller && controller_property && controller_component) {

      if (route.login_required) {
        controller_component.get && app.get(route.path, login_required, controller_component.get);
        controller_component.post && app.post(route.path, login_required, controller_component.post);
        controller_component.put && app.put(route.path, login_required, controller_component.put);
        controller_component.delete && app.delete(route.path, login_required, controller_component.get);
      } else {
        controller_component.get && app.get(route.path, controller_component.get);
        controller_component.post && app.post(route.path, controller_component.post);
        controller_component.put && app.put(route.path, controller_component.put);
        controller_component.delete && app.delete(route.path, controller_component.get);
      }
    }
  }
}

module.exports = routing_ops;
