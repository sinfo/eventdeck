module.exports = function (path, id) {
  var thread;

  if (path.indexOf('/companies') != -1) {
    thread = 'company-' + id;
  }
  else if (path.indexOf('/speakers') != -1) {
    thread = 'speaker-' + id;
  }
  else if (path.indexOf('/topics') != -1) {
    thread = 'topic-' + id;
  }
  else if (path.indexOf('/communications') != -1) {
    thread = 'communication-' + id;
  }
  else if (path.indexOf('/chats') != -1) {
    thread = 'chat-' + id;
  }
  else if (path.indexOf('/events') != -1) {
    thread = 'event-' + id;
  }
  else if (path.indexOf('/meeting') != -1) {
    thread = 'meeting-' + id;
  }
  else if (path.indexOf('/members') != -1) {
    thread = 'member-' + id;
  }
  else if (path.indexOf('/sessions') != -1) {
    thread = 'session-' + id;
  }

  return thread;
};