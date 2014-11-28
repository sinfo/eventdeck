/*global app*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var TopicForm = require('client/js/forms/topic');


module.exports = PageView.extend({
  pageTitle: 'Add topic',
  template: templates.pages.topics.add,
  subviews: {
    form: {
      container: 'form',
      prepareView: function (el) {
        return new TopicForm({
          el: el,
          submitCallback: function (data) {
            app.topics.create(data, {
              wait: true,
              success: function () {
                app.navigate('/topics');
                app.topics.fetch();
              }
            });
          }
        });
      }
    }
  }
});
