var mongoose = require('mongoose')

var Member = require('../db/member')
var Company = require('../db/company')
var Topic = require('../db/topic')
var Speaker = require('../db/speaker')
var Subscription = require('../db/subscription')

mongoose.connect('mongodb://localhost/deck')

var coordinators

// TODO creating for all coordinators
Member.find({
  participations: {
    $elemMatch: {
      role: 'coordination'
    }
  }
}, gotCoordinators)

function gotCoordinators (error, _coordinators) {
  coordinators = _coordinators
  Company.find({}, gotCompanies)
  Topic.find({}, gotTopics)
  Speaker.find({}, gotSpeakers)
}

function gotCompanies (error, companies) {
  companies.forEach(function (company) {
    Subscription.find({thread: 'company-' + company.id}, function (error, subscriptions) {
      coordinators.forEach(function (coordinator) {
        var subscribed = false

        subscriptions.forEach(function (subscription) {
          if (subscription.member === coordinator.id) {
            subscribed = true
          }
        })

        if (!subscribed) {
          var subscription = {
            thread: 'company-' + company.id,
            member: coordinator.id
          }

          Subscription.create(subscription, function (err, _subscription) {
            if (err) {
              console.error({err: err, subscription: subscription}, 'error creating subscription')
            }
          })
        }
      })
    })
  })

  console.log('Companies finished!')
}

function gotTopics (error, topics) {
  topics.forEach(function (topic) {
    Subscription.find({thread: 'topic-' + topic.id}, function (error, subscriptions) {
      coordinators.forEach(function (coordinator) {
        var subscribed = false

        subscriptions.forEach(function (subscription) {
          if (subscription.member === coordinator.id) {
            subscribed = true
          }
        })

        if (!subscribed) {
          var subscription = {
            thread: 'topic-' + topic.id,
            member: coordinator.id
          }

          Subscription.create(subscription, function (err, _subscription) {
            if (err) {
              console.error({err: err, subscription: subscription}, 'error creating subscription')
            }
          })
        }
      })
    })
  })

  console.log('Topics finished!')
}

function gotSpeakers (error, speakers) {
  speakers.forEach(function (speaker) {
    Subscription.find({thread: 'speaker-' + speaker.id}, function (error, subscriptions) {
      coordinators.forEach(function (coordinator) {
        var subscribed = false

        subscriptions.forEach(function (subscription) {
          if (subscription.member === coordinator.id) {
            subscribed = true
          }
        })

        if (!subscribed) {
          var subscription = {
            thread: 'speaker-' + speaker.id,
            member: coordinator.id
          }

          Subscription.create(subscription, function (err, _subscription) {
            if (err) {
              console.error({err: err, subscription: subscription}, 'error creating subscription')
            }
          })
        }
      })
    })
  })

  console.log('Speakers finished!')
}
