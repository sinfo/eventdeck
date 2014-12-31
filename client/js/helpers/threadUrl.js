module.exports = function (thread) {
  var split = thread.split(/-(.+)?/);
  var result = '/';
  if (thread.indexOf('company') != -1) {
    result += 'companies';
  }
  else {
  	result += split[0] + 's';
  }

  result += '/' + split[1];

  return result;
};