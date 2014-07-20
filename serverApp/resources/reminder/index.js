var topicDudeDates = require('./topicDueDates');

module.exports = reminder;

function reminder(request, reply) {

  topicDudeDates(function(err) {
    if(err) { return reply({error: 'noooo'}); };
    reply({ success: 'yeap'});
  })
}
