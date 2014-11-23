var FormView = require('ampersand-form-view');
var SelectView = require('ampersand-select-view');


module.exports = FormView.extend({
  fields: function () {
    return [
      new SelectView({
        name: 'event',
        label: ' ',
        id: 'banana',
        parent: this,
        // first is the value, second is used for the label
        options: app.events,
        // and pick an item from the collection as the selected one
        value: app.events.at(0),
        // here you specify which attribute on the objects in the collection
        // to use for the value returned.
        idAttribute: 'id',
        // you can also specify which model attribute to use as the title
        textAttribute: 'name',
        // here you can specify if it should return the selected model from the
        // collection, or just the id attribute
        yieldModel: true
      })
    ];
  }
});