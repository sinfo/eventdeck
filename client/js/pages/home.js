var PageView = require('./base');
var templates = require('client/js/templates');


module.exports = PageView.extend({
    pageTitle: 'home',
    template: templates.pages.home
});
