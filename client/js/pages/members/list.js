/* global app */
var log = require('bows')('members')
var Member = require('client/js/models/member')
var PageView = require('ampersand-infinite-scroll')
var templates = require('client/js/templates')
var MemberView = require('client/js/views/member')
var AmpersandCollection = require('ampersand-collection')

var selectedFilter = 'showall'

function filtering (page, filter) {
  log('Fetching Selected Members')

  var aux = page.collection.filter(function (member) {
    var ids = member.participations.map(function (participation) {
      return participation.role
    }
    )

    return member && ids.indexOf(filter) !== -1
  })

  return new AmpersandCollection(aux, {model: Member})
}
function rerender (page, collection, filter) {
  page.renderWithTemplate()
  page.renderCollection(collection, MemberView, page.queryByHook('members-list'))

  page.queryByHook(selectedFilter).classList.remove('selected')
  page.queryByHook(filter).classList.add('selected')
  selectedFilter = filter

  return false
}

module.exports = PageView.extend({
  pageTitle: 'Members',
  template: templates.pages.members.list,
  events: {
    'click [data-hook~=shuffle]': 'shuffle',
    'click [data-hook~=fetch]': 'fetchCollection',
    'click [data-hook~=reset]': 'resetCollection',

    'click [data-hook~=coordination]': 'coordination',
    'click [data-hook~=design]': 'design',
    'click [data-hook~=devteam]': 'devteam',
    'click [data-hook~=events]': 'ev',
    'click [data-hook~=extrelations]': 'extrelations',
    'click [data-hook~=ia]': 'ia',
    'click [data-hook~=internalrelations]': 'internalrelations',
    'click [data-hook~=marketing]': 'marketing',
    'click [data-hook~=marketingManager]': 'marketingManager',
    'click [data-hook~=pr]': 'pr',
    'click [data-hook~=partnerships]': 'partnerships',
    'click [data-hook~=sysadmin]': 'sysadmin',
    'click [data-hook~=treasury]': 'treasury',

    'click [data-hook~=me]': 'me',
    'click [data-hook~=showall]': 'showall',

    'click [data-hook~=hide]': 'hide'

  },
  render: function () {
    this.collection.sortBy('name')
    this.renderWithTemplate()
    this.renderCollection(this.collection, MemberView, this.queryByHook('members-list'))
    if (this.collection.length < this.collection.data.limit) {
      this.fetchCollection()
    }
  },
  fetchCollection: function () {
    this.collection.fetchPage({reset: true})
    return false
  },
  resetCollection: function () {
    this.collection.reset()
  },
  shuffle: function () {
    this.collection.comparator = function () {
      return !Math.round(Math.random())
    }
    this.collection.sort()
    delete this.collection.comparator
    return false
  },
  hide: function () {
    if (!this.hidden) {
      this.queryByHook('awesome-sidebar').style.display = 'none'
      this.hidden = true
    } else {
      this.queryByHook('awesome-sidebar').style.display = 'block'
      this.hidden = false
    }
  },
  showall: function () {
    rerender(this, this.collection, 'showall')
    return false
  },
  me: function () {
    log('Fetching Selected Companies')
    var aux = this.collection.filter(function (member) {
      return member && member.id === app.me.id
    })

    aux = new AmpersandCollection(aux, {model: Member})

    rerender(this, aux, 'me')

    return false
  },
  coordination: function () {
    var aux = filtering(this, 'coordination')
    rerender(this, aux, 'coordination')

    return false
  },
  design: function () {
    var aux = filtering(this, 'design')
    rerender(this, aux, 'design')

    return false
  },
  devteam: function () {
    var aux = filtering(this, 'development-team')
    rerender(this, aux, 'devteam')

    return false
  },
  ev: function () {
    var aux = filtering(this, 'events')
    rerender(this, aux, 'events')

    return false
  },
  extrelations: function () {
    var aux = filtering(this, 'external-relations')
    rerender(this, aux, 'extrelations')

    return false
  },
  ia: function () {
    var aux = filtering(this, 'innovation-awards')
    rerender(this, aux, 'ia')

    return false
  },
  internalrelations: function () {
    var aux = filtering(this, 'internal-relations')
    rerender(this, aux, 'internalrelations')

    return false
  },
  marketing: function () {
    var aux = filtering(this, 'marketing')
    rerender(this, aux, 'marketing')

    return false
  },
  marketingManager: function () {
    var aux = filtering(this, 'marketing-manager')
    rerender(this, aux, 'marketingManager')

    return false
  },
  pr: function () {
    var aux = filtering(this, 'public-relations')
    rerender(this, aux, 'pr')

    return false
  },
  partnerships: function () {
    var aux = filtering(this, 'strategic-partnerships')
    rerender(this, aux, 'partnerships')

    return false
  },
  sysadmin: function () {
    var aux = filtering(this, 'sys-admin')
    rerender(this, aux, 'sysadmin')

    return false
  },
  treasury: function () {
    var aux = filtering(this, 'treasury')
    rerender(this, aux, 'treasury')

    return false
  }
})
