module.exports = function (path, id) {
  var thread;

  if (path.indexOf('/company/') != -1) {
    thread = 'company-' + id;
  }
  else if (path.indexOf('/speaker/') != -1) {
    thread = 'speaker-' + id;
  }
  else if (path.indexOf('/topic/') != -1) {
    thread = 'topic-' + id;
  }
  else if (path.indexOf('/communication/') != -1) {
    thread = 'communication-' + id;
  }

  return thread;
}