/*global me, app*/
var Router = require('ampersand-router');
var HomePage = require('./pages/home');

var Members = require('./pages/members/list');

module.exports = Router.extend({
    routes: {
        '': 'home',
        'members': 'members',
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

    catchAll: function () {
        this.redirectTo('');
    }
});
