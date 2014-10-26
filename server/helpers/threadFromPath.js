module.exports = function (path, id) {
  var thread;

  if (path.indexOf('/companies/') != -1) {
    thread = 'company-' + id;
  }
  else if (path.indexOf('/speakers/') != -1) {
    thread = 'speaker-' + id;
  }
  else if (path.indexOf('/topics/') != -1) {
    thread = 'topic-' + id;
  }
  else if (path.indexOf('/communications/') != -1) {
    thread = 'communication-' + id;
  }

  return thread;
}