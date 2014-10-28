var homeController = (function() {
  var controller = {};

  controller.index = index;

  function index() {
    _self = {};

    _self.get = function(req, res, next) {
      res.render('index');
    };
    
    return _self;
  }

  return controller;
})();

module.exports = homeController;
