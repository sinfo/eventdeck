/* global app */
var log = require('bows')('speakers')
var PageView = require('ampersand-infinite-scroll')
var templates = require('../../templates')
var SpeakerView = require('../../views/speaker')
var Speaker = require('../../models/speaker')
var AmpersandCollection = require('ampersand-collection')
var speakerStatuses = require('../../../../options').statuses.speaker
var _ = require('../../helpers/underscore')
var $ = require('../../helpers/jquery')

var selectedFilter = 'showall'

// var filterTypes = {
//   me: ['noMember', 'showall'],
//   noMember: ['me', 'showall'],
//   showall: ['noMember', 'me', 'thisEvent', 'noParticipation'],
//   thisEvent: ['noParticipation', 'showall'],
//   noParticipation: ['thisEvent', 'showall']
// }

function filtering (collection, filter) {
  return collection.filter(function (speaker) {
    return speaker.participation && speaker.participation.status === filter
  })
}

function rerender (page, collection, filter, options) {
  page.renderWithTemplate()
  page.renderCollection(collection, SpeakerView, page.queryByHook('speakers-list'), options)

  page.renderStatusFilters()
  page.queryByHook(filter).classList.add('selected')

  return false
}

module.exports = PageView.extend({
  pageTitle: 'Speakers',
  template: templates.pages.speakers.list,
  events: {
    'click [data-hook~=fetch]': 'fetchCollection',
    'click [data-hook~=status-filters]': 'handleStatusFilter',

    'click [data-hook~=showall]': 'showall',
    'click [data-hook~=me]': 'me',
    'click [data-hook~=noMember]': 'noMember',

    'click [data-hook~=thisEvent]': 'thisEvent',
    'click [data-hook~=noParticipation]': 'noParticipation',

    'click [data-hook~=hide]': 'hide'
  },
  hidden: false,
  render: function () {
    selectedFilter = 'showall'

    this.renderWithTemplate()
    this.renderCollection(this.collection, SpeakerView, this.queryByHook('speakers-list'))
    if (this.collection.length < this.collection.data.limit) {
      this.fetchCollection()
    }
    this.renderStatusFilters()
    this.queryByHook(selectedFilter).classList.add('selected')
  },
  fetchCollection: function () {
    log('Fetching speakers')
    this.collection.fetchPage({reset: true})

    return false
  },
  renderStatusFilters: function () {
    var self = this
    var filterContainer = $(self.queryByHook('status-filters')) // $.hook('status-filters')
    _.each(speakerStatuses, function (status) {
      filterContainer.append("<li><div class='ink-button' data-hook='" + status.id + "'>" + status.name + '</div></li>')
    })
  },
  handleStatusFilter: function (ev) {
    var status = ev.target.getAttribute('data-hook')
    log('filtering by status', status)

    var aux = filtering(this.collection, status)
    aux = new AmpersandCollection(aux, {model: Speaker})

    rerender(this, aux, status)
    return false
  },
  me: function () {
    log('Fetching Selected Speakers')
    var self = this

    self.collection.data.member = app.me.id
    self.collection.data.skip = 0
    self.collection.data.limit = 30
    self.collection.data.sort = '-updated'

    self.collection.fetchPage({
      success: function (collection, response, options) {
        rerender(self, self.collection, 'me')

        return false
      },
      error: function (collection, response, options) {
        log('Error fetching user speakers', {response: response})
      }
    })
  },
  noMember: function () {
    log('Fetching Selected Speakers')
    var self = this

    self.collection.data.member = 'false'
    self.collection.data.skip = 0
    self.collection.data.limit = 30
    self.collection.data.sort = '-updated'

    self.collection.fetchPage({
      success: function (collection, response, options) {
        rerender(self, self.collection, 'noMember')

        return false
      },
      error: function (collection, response, options) {
        log('Error fetching user speakers', {response: response})
      }
    })
  },
  thisEvent: function () {
    log('Fetching Selected Speakers')
    var self = this

    delete self.collection.data.participations

    self.collection.data.event = app.me.selectedEvent
    self.collection.data.skip = 0
    self.collection.data.limit = 30
    self.collection.data.sort = '-updated'

    self.collection.fetchPage({
      success: function (collection, response, options) {
        rerender(self, self.collection, 'thisEvent')

        return false
      },
      error: function (collection, response, options) {
        log('Error fetching user speakers', {response: response})
      }
    })
  },
  noParticipation: function () {
    log('Fetching Selected Speakers')
    var self = this

    self.collection.data.event = app.me.selectedEvent
    self.collection.data.participations = 'false'
    self.collection.data.skip = 0
    self.collection.data.limit = 30
    self.collection.data.sort = '-updated'

    self.collection.fetchPage({
      success: function (collection, response, options) {
        rerender(self, self.collection, 'noParticipation')
        return false
      },
      error: function (collection, response, options) {
        log('Error fetching user speakers', {response: response})
      }
    })
  },
  showall: function () {
    var self = this

    self.collection.data = {limit: 30, skip: 0, sort: '-updated'}

    self.collection.fetchPage({
      success: function (collection, response, options) {
        rerender(self, self.collection, 'thisEvent')

        return false
      },
      error: function (collection, response, options) {
        log('Error fetching user speakers', {response: response})
      }
    })
  },
  hide: function () {
    if (!this.hidden) {
      this.queryByHook('awesome-sidebar').style.display = 'none'
      this.hidden = true
    } else {
      this.queryByHook('awesome-sidebar').style.display = 'block'
      this.hidden = false
    }
  }
})
