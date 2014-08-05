'use strict';

theToolController.controller('MainController', function ($scope, $http, $routeParams, $sce, $location, $window, $rootScope, NotificationFactory, MemberFactory, CompanyFactory, SpeakerFactory, TopicFactory, RoleFactory, TagFactory, CommentFactory, ChatFactory, EventFactory, SessionFactory, ItemFactory) {

  //================================INITIALIZATION================================

  $scope.ready = false;

  $scope.display = false;

  $scope.search = {};
  $scope.searchTopics = {};
  $scope.searchCompanies = {};
  $scope.searchSpeakers = {};
  $scope.searchMembers = {};
  $scope.activeEvent = {};

  $scope.me = {};
  $scope.members = [];
  $scope.companies = [];
  $scope.speakers = [];
  $scope.topics = [];
  $scope.notifications = [];

  $scope.notificationsInfo = {
    number: 0,
    text: " Loading..."
  };

  var factoriesReady = 0;

  $rootScope.update = {

    running: false,

    timeout: function(cb){
      if(!$scope.ready){
        $scope.loading = true;
        if(!$rootScope.update.running){
          $rootScope.update.all();
        }
        setTimeout(function() { $rootScope.update.timeout(cb) }, 1500);
      }
      else{
        cb();
        return;
      }
    },

    me: function(){
      MemberFactory.Me.get(function (me) {
        $scope.me = me;
        callback();
      });
    },

    members: function(){
      MemberFactory.Member.getAll(function (members) {
        $scope.members = members;
        callback();
      });
    },

    companies: function(){    
      CompanyFactory.Company.getAll(function (companies) {
        $scope.companies = companies;
        callback();
      });
    },

    speakers: function(){
      SpeakerFactory.Speaker.getAll(function (speakers) {
        $scope.speakers = speakers;
        callback();
      });
    },

    topics: function(){
      TopicFactory.Topic.getAll(function (topics) {
        $scope.topics = topics;
        callback();
      });
    },

    roles: function(){
      RoleFactory.Role.getAll(function (roles) {
        $scope.roles = roles;
        callback();
      });
    },

    tags: function(){
      TagFactory.Tag.getAll(function (tags) {
        $scope.topicTags = tags;
        callback();
      });
    },

    comments: function(){
      CommentFactory.Comment.getAll(function (comments) {
        $scope.comments = comments;
        callback();
      });
    },

    chats: function() {
      ChatFactory.Chat.getAll(function(chats) {
        $scope.chats = chats;
        callback();
      });
    },

    events: function() {
      EventFactory.Event.getAll(function(events) {
        $scope.events = events;
        callback();
      });
    },

    sessions: function() {
      SessionFactory.Session.getAll(function(sessions) {
        $scope.sessions = sessions;
        callback();
      });
    },

    items: function() {
      ItemFactory.Item.getAll(function(items) {
        $scope.items = items;
        callback();
      });
    },

    all: function(){
      this.running = true;
      factoriesReady = 0;
      console.log("Updating!");
      this.me();
      this.members();
      this.companies();
      this.speakers();
      this.topics();
      this.roles();
      this.tags();
      this.comments();
      this.chats();
      this.events();
      this.sessions();
      this.items();
    }

  }

  $rootScope.update.all();


  //===================================FUNCTIONS===================================

  function callback() {
    if (++factoriesReady == 12) {
      $rootScope.update.running = false;
      $scope.ready = true;

      $scope.update();

      setInterval($scope.update, 10000);

      $rootScope.$on("$locationChangeStart", function (event, next, current) {
        setTimeout($scope.update, 500);
        $scope.search.name = '';
      });
    }
  }


  //================================SCOPE FUNCTIONS================================

  $scope.update = function() {
    NotificationFactory.Notification.getAll(function (response) {
      $scope.notifications = [];
      $scope.notificationsInfo.number = 0;

      for (var i = 0; i < response.length; i++) {
        if (response[i].targets.indexOf($scope.me.id) != -1) {
          if (response[i].unread.indexOf($scope.me.id) != -1) {
            $scope.notificationsInfo.number++;
          }
          $scope.notifications.unshift(response[i]);
        }
      }

      if ($scope.notificationsInfo.number == 0) {
        $scope.notificationsInfo.text = " No Notifications";
      }
      else {
        $scope.notificationsInfo.text = " " + $scope.notificationsInfo.number + " Notification" + ($scope.notificationsInfo.number > 1 ? "s" : "");
      }
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

  $scope.formatDate = function (time) {
    return new Date(time).toUTCString();
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

  $scope.getNotifications = function (thread) {
    return $scope.notifications.filter(function(o) {
      return o.thread == thread;
    })[0];
  };

  $scope.getUnreadNotifications = function (thread) {
    return $scope.notifications.filter(function(o) {
      return o.thread == thread && o.unread.indexOf($scope.me.id) != -1;
    })[0];
  };

  $scope.getEvent = function (eventId) {
    return $scope.events.filter(function(o) {
      return o.id == eventId;
    })[0];
  };

  $scope.getSession = function (sessionId) {
    return $scope.sessions.filter(function(o) {
      return o._id == sessionId;
    })[0];
  };

  $scope.getItem = function (itemId) {
    return $scope.items.filter(function(o) {
      return o.id == itemId;
    })[0];
  };

  $scope.show = function() {
    $scope.display = ($scope.search.name ? true : false);
  };

  $scope.hide = function() {
    $scope.display = false;
  };

  $scope.convertURLs = function(text) {
    var urlExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

    return text.replace(/\n/g, '<br>').replace(urlExp,"<a href='$1'>$1</a>");
  }

  $scope.convertNewLinesToHtml = function(text) {
    return '<div data-markdown>'+text.replace(/\n/g, '<br>')+'</div>';
  }

  $scope.convertMarkdownToHtml = function(text) {
    return '<div data-markdown>' + text + '</div>';
  }

  $scope.logout = function () {
    $http.get(url_prefix + '/api/logout').
      success(function(data, status, headers, config) {
        $window.location.assign('/');
      }).
      error(function(data, status, headers, config) {
        console.log("ERROR", data);
        $window.location.assign('/');
      });
  }


});
