var View = require('ampersand-view');
var templates = require('client/js/templates');


module.exports = View.extend({
    template: templates.cards.company,
    bindings: {
        'model.name': '[data-hook~=name]',
        'model.status': {
            type: 'attribute',
            hook: 'status',
            name: 'src'
        },
        'model.img': {
            type: 'attribute',
            hook: 'img',
            name: 'src'
        },
        'model.background': {
            type: 'attribute',
            hook: 'background',
            name: 'style'
        },
        'model.editUrl': {
            type: 'attribute',
            hook: 'action-edit',
            name: 'href'
        },
        'model.viewUrl': {
            type: 'attribute',
            hook: 'name',
            name: 'href'
        }
    },
    events: {
        'click [data-hook~=action-delete]': 'handleRemoveClick'
    },
    handleRemoveClick: function () {
        this.model.destroy();
        return false;
    }
});
