module.exports = function (path, id) {
  var thread;

  if (path.indexOf('/api/company/') != -1) {
    thread = 'company-' + id;
  }
  else if (path.indexOf('/api/speaker/') != -1) {
    thread = 'speaker-' + id;
  }
  else if (path.indexOf('/api/topic/') != -1) {
    thread = 'topic-' + id;
  }
  else if (path.indexOf('/api/communication/') != -1) {
    thread = 'communication-' + id;
  }

  return thread;
}