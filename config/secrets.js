var routes = require('./routes');
var len = routes.length;

// ban usernames to not conflict with routes
var banUsernames = [];

while(len--) {
  banUsernames.push(routes[len].path.substr(1));
}

module.exports = {

  db: process.env.MONGODB || 'mongodb://localhost:27017/test',

  session: process.env.SESSION || 'Session secret',

  sendgrid: {
    user: process.env.SENDGRID_USER || 'hslogin',
    password: process.env.SENDGRID_PASSWORD || 'hspassword00'
  },

  banUsernames: banUsernames

};
