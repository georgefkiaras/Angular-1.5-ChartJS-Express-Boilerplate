var basicAuth = require('basic-auth')
var config    = require('../config/config')

var authenticate = (req, res, next) => {
  let permittedUser = config.app_login.username
  let password = config.app_login.password
  let user = basicAuth(req);

  if (user && user.name && user.pass && user.name == permittedUser && user.pass == password) {
    next();
  } 
  else {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    res.sendStatus(401);
    return;
  }    
}

module.exports = authenticate
