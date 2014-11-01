var homeController = (function() {
  var controller = {};

  controller.index = index;

  function index() {
    var index = {};

    index.get = function(req, res, next) {
      res.render('index');
    };
    
    return index;
  }

  return controller;
})();

module.exports = homeController;
