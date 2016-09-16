/**
 * Takes a string of fields (eg: "id,name,img") and
 * transforms it in an options object to be used on
 * a mongoose query (eg: {id:1,name:1,img:1})
 *
 * @param  {String} fieldsStr  - string of fields (eg: "id,-name,img")
 * @return {Object} options    - options object to be used on a mongoose query (eg: {id:1,name:-1,img:1})
 */
module.exports = function (fieldsStr) {
  var options = {}

  if (fieldsStr && typeof (fieldsStr) === 'string' && fieldsStr !== '') {
    var fields = fieldsStr.replace(/\s+/g, '').split(',')
    for (var i in fields) {
      if (fields[i][0] === '-') {
        options[fields[i].substring(1)] = -1
      } else {
        options[fields[i]] = 1
      }
    }
  }

  return options
}
