/*global app*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var TopicForm = require('client/js/forms/topic');
var _ = require('client/js/helpers/underscore');


module.exports = PageView.extend({
  pageTitle: 'Add topic',
  template: templates.pages.topics.add,
  initialize: function (spec) {
    var self = this;
    if (!app.members.length) {
      app.members.fetch();
    }
    if (!app.tags.length) {
      app.tags.fetch();
    }
  },
  subviews: {
    form: {
      container: 'form',
      prepareView: function (el) {
        return new TopicForm({
          el: el,
          submitCallback: function (data) {
            data = _.compactObject(data);

            app.topics.create(data, {
              wait: true,
              success: function (model, response, options) {
                app.navigate('/topics/'+model.id);
              },
            });
          }
        });
      }
    }
  }
});
