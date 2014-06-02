//angular.js example for factory vs service
var app = angular.module('myApp', ['ngResource']);

var API_URL = 'http://tool.bananamarket.eu';
    
app.factory('notificationFactory', function ($resource) {
  return $resource(API_URL+'/api/notification/:id', null, {
    'getAll': {method: 'GET', isArray: true},
  })
})
app.factory('memberFactory', function ($resource) {
  return $resource(API_URL+'/api/member/:id', null, {
    'getAll': {method: 'GET', isArray:true}
  })
})
app.factory('companyFactory', function ($resource) {
  return $resource(API_URL+'/api/company/:id', null, {
    'getAll': {method: 'GET', isArray:true}
  })
})
app.factory('speakerFactory', function ($resource) {
  return $resource(API_URL+'/api/speaker/:id', null, {
    'getAll': {method: 'GET', isArray:true}
  })
})
app.factory('topicFactory', function ($resource) {
  return $resource(API_URL+'/api/topic/:id', null, {
    'getAll': {method: 'GET', isArray:true}
  })
});


function PopupCtrl($scope, notificationFactory, memberFactory, companyFactory, speakerFactory, topicFactory)
{
  var factoriesReady = 0;

  memberFactory.get({id: "me"}, function (me) {
    $scope.me = me;
    console.log(me);
    callback(me.error);
  });

  memberFactory.getAll(function (members) {
    $scope.members = members;
    callback(members.error);
  });

  companyFactory.getAll(function (companies) {
    $scope.companies = companies;
    callback(companies.error);
  });

  speakerFactory.getAll(function (speakers) {
    $scope.speakers = speakers;
    callback(speakers.error);
  });

  topicFactory.getAll(function (topics) {
    $scope.topics = topics;
    callback(topics.error);
  });


  function callback(error) {
    if(error) {
      $scope.loggedOut = true;
    }

    if (++factoriesReady == 5) {
      $scope.ready = true;
      $scope.update();
    }
  }

  $scope.update = function() {
    notificationFactory.getAll(function (response) {
      $scope.notifications = response.filter(function(e){
        return e.unread.indexOf($scope.me.id) != -1;
      });

      console.log($scope.notifications);
    });
  }

  $scope.timeSince =function (date) {
    date = new Date(date);
    var seconds = Math.floor((Date.now() - date) / 1000);

    var suffix = 'ago';
    if(seconds < 0){
      seconds = Math.abs(seconds);
      suffix = 'to go';
    }

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years " + suffix;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months " + suffix;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days " + suffix;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours " + suffix;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes " + suffix;
    }
    return Math.floor(seconds) + " seconds " + suffix;
  };

  $scope.getMember = function (memberId) {
    var member = $scope.members.filter(function(o) {
      return o.id == memberId;
    });

    if(member.length>0) {
      return member[0];
    } else {
      return {
        name: "No one",
        facebook: "100000456335972"
      }
    }
  };

  $scope.getSpeaker = function (speakerId) {
    return $scope.speakers.filter(function(o) {
      return o.id == speakerId;
    })[0];
  };

  $scope.getCompany = function (companyId) {
    return $scope.companies.filter(function(o) {
      return o.id == companyId;
    })[0];
  };

  $scope.getTopic = function (topicId) {
    return $scope.topics.filter(function(o) {
      return o._id == topicId;
    })[0];
  };
}
