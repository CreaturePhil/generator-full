var routes = [
  { path: '/', controller: 'home', name: 'index' },
  { path: '/about', controller: 'home', name: 'about' },
  { path: '/signup', controller: 'authentication', name: 'signup', pre: ['login_required', 'post'] },
];

router.route('/about')

module.exports = routes;
