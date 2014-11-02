/*global me, app*/
var Router = require('ampersand-router');
var HomePage = require('./pages/home');

var Members = require('./pages/members/list');
var MemberAddPage = require('./pages/members/add');
var MemberEditPage = require('./pages/members/edit');
var MemberViewPage = require('./pages/members/view');

module.exports = Router.extend({
    routes: {
        '': 'home',
        'members': 'members',
        'members/add': 'memberAdd',
        'members/:id': 'memberView',
        'members/:id/edit': 'memberEdit',
        '(*path)': 'catchAll'
    },

    // ------- ROUTE HANDLERS ---------
    home: function () {
        this.trigger('page', new HomePage());
    },

    members: function () {
        this.trigger('page', new Members({
            collection: app.members
        }));
    },

    memberAdd: function () {
        this.trigger('page', new MemberAddPage());
    },

    memberEdit: function (id) {
        this.trigger('page', new MemberEditPage({
            id: id
        }));
    },

    memberView: function (id) {
        this.trigger('page', new MemberViewPage({
            id: id
        }));
    },

    catchAll: function () {
        this.redirectTo('');
    }
});
