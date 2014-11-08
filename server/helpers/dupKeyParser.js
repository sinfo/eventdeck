module.exports = function(err) {
  // this example is showing how to get the field `email` out of the err message 
  var field = err.split('index: deck.')[1].split('.$')[1];
  // now we have `email_1 dup key`
  field = field.split(' dup key')[0];
  field = field.substring(0, field.lastIndexOf('_')); // returns email

  return field;
};