module.exports = logout;

function logout(request, reply) {
  request.auth.session.clear();
  reply({success: "Your session is cleared."});
};
