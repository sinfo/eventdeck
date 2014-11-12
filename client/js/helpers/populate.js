var _ = require('underscore');

module.exports = function(data, model, properties){
	var childs;
	_.each(properties, function(property, index){
		if(data[property]){
			childs = property.split('.');
			data[childs[0]] = model[childs[0]];
			data[childs[0]][childs[1]] = data[childs[0] + '.' + childs[1]] || data[childs[0]][childs[1]];
			delete data[childs[0] + '.' + childs[1]];
		}
	});
	return data;
};