/**
 * Takes a string of fields (eg: "id,name,img") and 
 * transforms it in an options object to be used on 
 * a mongoose query (eg: {id:1,name:1,img:1})
 * 
 * @param  {String} fieldsStr  - string of fields (eg: "id,name,img")
 * @return {Object} options    - options object to be used on a mongoose query (eg: {id:1,name:1,img:1})
 */
module.exports = function(fieldsStr) {
  var options = {
    _id: 0, // don't show _id by default
  };

  if(fieldsStr && typeof(fieldsStr) == 'string' && fieldsStr != '') {
    var fields = fieldsStr.split(',');
    for (var i in fields) {
      options[fields[i]] = 1;
    };
  }

  return options;
}