const mongoose = require('mongoose')

const Member = require('../db/member')
const Company = require('../db/company')
const Topic = require('../db/topic')
const Speaker = require('../db/speaker')
const Subscription = require('../db/subscription')

mongoose.connect('mongodb://localhost/deck')

let coordinators

// TODO creating for all coordinators
Member.find({
  participations: {
    $elemMatch: {
      role: 'coordination'
    }
  }
}, gotCoordinators)

function gotCoordinators (error, _coordinators) {
  if (error) throw error
  coordinators = _coordinators
  Company.find({}, gotCompanies)
  Topic.find({}, gotTopics)
  Speaker.find({}, gotSpeakers)
}

function gotCompanies (error, companies) {
  if (error) throw error
  companies.forEach(function (company) {
    Subscription.find({thread: 'company-' + company.id}, function (error, subscriptions) {
      if (error) throw error
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
  if (error) throw error
  topics.forEach(function (topic) {
    Subscription.find({thread: 'topic-' + topic.id}, function (error, subscriptions) {
      if (error) throw error
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
  if (error) throw error
  speakers.forEach(function (speaker) {
    Subscription.find({thread: 'speaker-' + speaker.id}, function (error, subscriptions) {
      if (error) throw error
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
