var routes = [
  { path: '/', controller: 'home', name: 'index' },
  { path: '/about', controller: 'home', name: 'about' },
  { path: '/signup', controller: 'authentication', name: 'signup', middleware: ['login_required', 'post'] },
  { path: '/login', controller: 'authentication', name: 'signup', middleware: ['login_required', 'post'] },
];

router.route('/about')

module.exports = routes;
