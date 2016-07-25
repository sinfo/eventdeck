/*global app, alert*/
var log = require('bows')('companies')
var PageView = require('ampersand-infinite-scroll')
var templates = require('client/js/templates')
var CompanyView = require('client/js/views/company')
var Company = require('client/js/models/company')
var AmpersandCollection = require('ampersand-collection')
var companyStatuses = require('options').statuses.company
var _ = require('client/js/helpers/underscore')
var $ = require('client/js/helpers/jquery')

var selectedFilter = 'showall'

function filtering (collection, filter) {
  return collection.filter(function (company) {
    return company.participation && company.participation.status == filter
  })
}
function rerender (page, collection, filter) {
  page.renderWithTemplate()
  page.renderCollection(collection, CompanyView, page.queryByHook('companies-list'))

  page.renderStatusFilters()

  page.queryByHook(selectedFilter).classList.remove('selected')
  page.queryByHook(filter).classList.add('selected')
  selectedFilter = filter

  return false
}

module.exports = PageView.extend({
  pageTitle: 'Companies',
  template: templates.pages.companies.list,
  events: {
    'click [data-hook~=fetch]': 'fetchCollection',

    'click [data-hook~=status-filters]': 'handleStatusFilter',

    'click [data-hook~=me]': 'me',
    'click [data-hook~=noMember]': 'noMember',
    'click [data-hook~=noParticipation]': 'noParticipation',

    'click [data-hook~=hide]': 'hide'
  },
  hidden: false,
  render: function () {
    selectedFilter = 'showall'

    this.renderWithTemplate()
    this.renderCollection(this.collection, CompanyView, this.queryByHook('companies-list'))
    if (this.collection.length < this.collection.data.limit) {
      this.fetchCollection()
    }

    this.renderStatusFilters()
    this.queryByHook(selectedFilter).classList.add('selected')
  },
  fetchCollection: function () {
    log('Fetching companies')
    this.collection.fetchPage({reset: true})

    return false
  },
  renderStatusFilters: function () {
    var self = this
    var filterContainer = $(self.queryByHook('status-filters')); // $.hook('status-filters')
    _.each(companyStatuses, function (status) {
      filterContainer.append("<li><div class='ink-button' data-hook='" + status.id + "'>" + status.name + '</div></li>')
    })
  },
  handleStatusFilter: function (ev) {
    var status = ev.target.getAttribute('data-hook')
    log('filtering by status', status)

    var aux = filtering(this.collection, status)
    aux = new AmpersandCollection(aux, {model: Company})

    rerender(this, aux, status)
    return false
  },
  me: function () {
    log('Fetching Selected Companies')
    var aux = this.collection.filter(function (company) {
      return company.participation && company.participation.member == app.me.id
    })

    aux = new AmpersandCollection(aux, {model: Company})

    rerender(this, aux, 'me')

    return false
  },
  noMember: function () {
    log('Fetching Selected Companies')
    var aux = this.collection.filter(function (company) {
      return company.participation && !company.participation.member
    })

    aux = new AmpersandCollection(aux, {model: Company})

    rerender(this, aux, 'noMember')

    return false
  },
  noParticipation: function () {
    log('Fetching Selected Companies')
    var aux = this.collection.filter(function (company) {
      return !company.participation
    })

    aux = new AmpersandCollection(aux, {model: Company})

    rerender(this, aux, 'noParticipation')
    return false
  },
  showall: function () {
    rerender(this, this.collection, 'showall')
    return false
  },
  hide: function () {
    if (!this.hidden) {
      this.queryByHook('awesome-sidebar').style.display = 'none'
      this.hidden = true
    }else {
      this.queryByHook('awesome-sidebar').style.display = 'block'
      this.hidden = false
    }
  }
})
