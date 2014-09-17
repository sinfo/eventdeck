var log = require('../../helpers/logger');

module.exports = logout;

function logout(request, reply) {
  log.info(request.auth.credentials.id, 'logged out');
  request.auth.session.clear();
  reply({success: 'Your session is cleared.'});
}
