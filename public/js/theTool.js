(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

angular.module("theTool", [
  "ng",
  "ngRoute",
  "ngSanitize",
  "ngTouch",
  "infinite-scroll",
  "unsavedChanges",
  "luegg.directives",
  "ngAudio",
  "theTool.filters",
  "theTool.services",
  "theTool.directives",
  "theTool.controllers"
]).
config(["$routeProvider", function($routeProvider) {
  $routeProvider.when("/"                          , {templateUrl: "views/chat/view.html",             controller: "ChatController"});
  $routeProvider.when("/admin"                     , {templateUrl: "views/admin/index.html",           controller: "AdminController"});
  $routeProvider.when("/login"                     , {templateUrl: "views/auth/login.html",            controller: "LoginController"});
  $routeProvider.when("/login/:id/:code"           , {templateUrl: "views/auth/login.html",            controller: "LoginController"});
  $routeProvider.when("/companies/"                , {templateUrl: "views/company/list.html",          controller: "CompaniesController"});
  $routeProvider.when("/companies/table/"          , {templateUrl: "views/company/table.html",         controller: "CompaniesController"});
  $routeProvider.when("/companies/budget/"         , {templateUrl: "views/company/budget.html",        controller: "CompaniesController"});
  $routeProvider.when("/company/"                  , {templateUrl: "views/company/create.html",        controller: "CreateCompanyController"});
  $routeProvider.when("/company/:id"               , {templateUrl: "views/company/view.html",          controller: "CompanyController"});
  $routeProvider.when("/company/:id/edit"          , {templateUrl: "views/company/edit.html",          controller: "CompanyController"});
  $routeProvider.when("/company/:id/participations", {templateUrl: "views/company/participations.html",controller: "CompanyController"});
  $routeProvider.when("/company/:id/confirm"       , {templateUrl: "views/company/confirm.html",       controller: "CompanyEmailController"});
  $routeProvider.when("/comment/:id/edit"          , {templateUrl: "views/comment/edit.html",          controller: "CommentController"});
  $routeProvider.when("/speakers/"                 , {templateUrl: "views/speaker/list.html",          controller: "SpeakersController"});
  $routeProvider.when("/speakers/table/"           , {templateUrl: "views/speaker/table.html",         controller: "SpeakersController"});
  $routeProvider.when("/speaker/"                  , {templateUrl: "views/speaker/create.html",        controller: "CreateSpeakerController"});
  $routeProvider.when("/speaker/:id"               , {templateUrl: "views/speaker/view.html",          controller: "SpeakerController"});
  $routeProvider.when("/speaker/:id/edit"          , {templateUrl: "views/speaker/edit.html",          controller: "SpeakerController"});
  $routeProvider.when("/speaker/:id/participations", {templateUrl: "views/speaker/participations.html",controller: "SpeakerController"});
  $routeProvider.when("/speaker/:id/confirm"       , {templateUrl: "views/speaker/confirm.html",       controller: "SpeakerEmailController"});
  $routeProvider.when("/members/"                  , {templateUrl: "views/member/list.html",           controller: "MembersController"});
  $routeProvider.when("/member/"                   , {templateUrl: "views/member/create.html",         controller: "CreateMemberController"});
  $routeProvider.when("/member/:id"                , {templateUrl: "views/member/view.html",           controller: "MemberController"});
  $routeProvider.when("/member/:id/edit"           , {templateUrl: "views/member/edit.html",           controller: "MemberController"});
  $routeProvider.when("/meetings"                  , {templateUrl: "views/meeting/list.html",          controller: "MeetingsController"});
  $routeProvider.when("/meeting/:id"               , {templateUrl: "views/meeting/view.html",          controller: "MeetingController"});
  $routeProvider.when("/meeting/:id/text"          , {templateUrl: "views/meeting/text.html",          controller: "MeetingController"});
  $routeProvider.when("/meeting/:id/edit"          , {templateUrl: "views/meeting/edit.html",          controller: "MeetingController"});
  $routeProvider.when("/chats"                     , {templateUrl: "views/chat/list.html",             controller: "ChatsController"});
  $routeProvider.when("/chat/:id"                  , {templateUrl: "views/chat/view.html",             controller: "ChatController"});
  $routeProvider.when("/topics"                    , {templateUrl: "views/topic/list.html",            controller: "TopicsController"});
  $routeProvider.when("/topic/:id"                 , {templateUrl: "views/topic/view.html",            controller: "TopicController"});
  $routeProvider.when("/communications/:kind"      , {templateUrl: "views/communication/list.html",    controller: "CommunicationsController"});
  $routeProvider.otherwise({redirectTo: "/"});
}]);

},{}],2:[function(require,module,exports){
"use strict";

theToolController.controller("AdminController", function ($rootScope, $scope, EventFactory, ItemFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    EventFactory.Event.getAll(function (response) {
      $scope.events = response;
    });

    ItemFactory.Item.getAll(function (response) {
      $scope.items = response;
    });

    $scope.addEvent = function(newEvent) {
      EventFactory.Event.create(newEvent, function(response) {
        if(response.error) {
          $scope.error = response.error;
        }

        EventFactory.Event.getAll(function (response) {
          $scope.events = response;
        });
      });
    };

    $scope.addItem = function(newItem) {
      ItemFactory.Item.create(newItem, function(response) {
        if(response.error) {
          $scope.error = response.error;
        }

        ItemFactory.Item.getAll(function (response) {
          $scope.items = response;
        });
      });
    };

    $scope.updateEvent = function (event) {
      EventFactory.Event.update({id: event.id}, event, function (response) {
        if(response.error) {
          //console.log(response.error);
          return $scope.error = response.error;
        }
        event.editing = false;
      });
    };

    $scope.updateItem = function (item) {
      ItemFactory.Item.update({id: item.id}, item, function (response) {
        if(response.error) {
          $scope.error = response.error;
        }
        item.editing = false;
      });
    };

    $scope.deleteEvent = function (event) {
      EventFactory.Event.delete({id: event.id}, function (response) {
        if(response.error) {
          $scope.error = response.error;
        }

        EventFactory.Event.getAll(function (response) {
          $scope.events = response;
        });
      });
    };

    $scope.deleteItem = function (item) {
      ItemFactory.Item.delete({id: item.id}, function (response) {
        if(response.error) {
          $scope.error = response.error;
        }

        ItemFactory.Item.getAll(function (response) {
          $scope.items = response;
        });
      });
    };

  }
});

},{}],3:[function(require,module,exports){
require("./login");
require('./interceptor');

},{"./interceptor":4,"./login":5}],4:[function(require,module,exports){
theToolController.config(function ($httpProvider) {
  $httpProvider.interceptors.push(['$injector', function ($injector) {
    return $injector.get('AuthInterceptor');
  }]);
});

theToolController.factory('AuthInterceptor', function ($rootScope, $location, $window) {
  return {
    responseError: function (response) {
      if (response.status === 401) {
        $rootScope.update.running = false;
        if($location.path().indexOf('/login') == -1) {
          $rootScope.nextPath = '#' + $location.path();
          $location.path('/login');
        }
      }
    }
  };
});

},{}],5:[function(require,module,exports){
"use strict";

var facebookConfig = require('./../../../../../config').facebook;

theToolController.controller("LoginController", function ($rootScope, $scope, $routeParams, $location, $http, $window) {

  //================================INITIALIZATION================================
  $.ajaxSetup({cache: true});
  $.getScript("//connect.facebook.net/pt_PT/all.js", function () {
    FB.init({appId: facebookConfig.appId});
  });

  $scope.loading = false;
  $scope.showIdInput = true;
  $scope.showCodeInput = false;

  if($scope.me.id) {
    //$location.path('/');
    $window.location.assign('/');
  }

  var lock = false;

  //===================================FUNCTIONS===================================

  $scope.facebookLogin = function () {
    $scope.banana = true;

  	if (lock) {
      return;
    }

    lock = true;

    FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        connected(response);
      }
      else {
        FB.login(function () {}, {display: "popup"});
        FB.Event.subscribe("auth.statusChange", function (response) {
          if (response.status === "connected") {
            connected(response);
          }
        });

        lock = false;
      }
    });

    function connected(response) {
      $scope.connected = true;
      $scope.loading = true;
      $scope.loginInfo = "Logging in...";

      $http.get(url_prefix + '/api/login/facebook?id='+response.authResponse.userID+'&token='+response.authResponse.accessToken).
        success(function(data, status, headers, config) {
          //$location.path('/');
          if(typeof $rootScope.nextPath == undefined){
            $window.location.assign('#');
          }
          else{
            $window.location.assign($rootScope.nextPath);
          }
          $rootScope.update.all();
        }).
        error(function(data, status, headers, config) {
          $scope.loading = false;
          //console.log("ERROR", data);
        });
    }
  };

  $scope.sendEmail = function (memberId) {
    $scope.loading = true;
    $scope.loginInfo = "Sending email...";
    $scope.showIdInput = false;
    //console.log("Sending email...");

    $http.get(url_prefix + '/api/login/' + memberId).
      success(function(data, status, headers, config) {
        if(data.error) {
          $scope.loading = false;
          setInfo("There was an error...");
          $scope.showIdInput = true;
          return;
        }
        $scope.loading = false;
        setInfo("Email sent!");
        $scope.showCodeInput = true;
        //console.log("Email sent!")
      }).
      error(function(data, status, headers, config) {
        $scope.loading = false;
        setInfo("There was an error...");
        $scope.showIdInput = true;
        //console.log("ERROR", data);
      });
  }

  $scope.submitCode = function (memberId, memberCode) {
    $scope.loading = true;
    $scope.loginInfo = "Verifying code...";
    $scope.showCodeInput = false;

    $http.get(url_prefix + '/api/login/' + memberId + '/' + memberCode).
      success(function(data, status, headers, config) {
        if(data.error) {
          $scope.loading = false;
          setInfo("There was an error...");
          $scope.showIdInput = true;
          return;
        }
        $scope.loading = false;
        $scope.loginInfo = "Success!";
        $window.location.assign('/');
        //$location.path('/');
      }).
      error(function(data, status, headers, config) {
        $scope.loading = false;
        setInfo("There was an error...");
        $scope.showIdInput = true;
      });
  }

  function setInfo(message) {
    $scope.loginInfo = message;
    setTimeout(function(){$scope.loginInfo=""}, 2000);
  }

  if ($routeParams.id && $routeParams.code) {
    $scope.submitCode($routeParams.id, $routeParams.code)
  }

});

},{"./../../../../../config":99}],6:[function(require,module,exports){
'use strict';

theToolController.controller('ChatController', function ($rootScope, $scope, $http, $routeParams, $sce, ngAudio, SocketFactory, MessageFactory, ChatFactory, MemberFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    $scope.error = {};

    $scope.updating = false;
    $scope.loading  = true;
    $scope.auth     = false;
    $scope.conected = false;
    $scope.messages = [];
    $scope.online   = [];

    //console.log("Connecting");

    SocketFactory.connect('/chat');

    SocketFactory.on('connected', function () {
      $scope.conected = true;
      if(!$scope.auth){
        SocketFactory.emit('auth', {id: ($routeParams.id || 'geral'), user: $scope.me.id}, function () {
          //console.log('Auth success');
          $scope.auth = true;
        });
      }
    });

    SocketFactory.on('validation', function (response){
      if(!response.err){
        $scope.chat     = response.chatData;
        $scope.messages = response.messages;
        $scope.room     = response.room;

        for(var i = 0; i < $scope.chat.members.length; i++){
          $scope.online.push({member: $scope.chat.members[i], on: false});
          if(response.online.indexOf($scope.chat.members[i]) != -1){
            $scope.online[i].on = true;
          }
          $scope.online[i].name = $scope.getMember($scope.online[i].member).name;
        }
        $scope.history = history;
      }
      else{
        //console.log(response.message);
      }
      $scope.loading  = false;
    });

    SocketFactory.on('user-connected', function (response) {
      //console.log("User connected: " + response.id);
      for(var i = 0; i < $scope.online.length; i++){
        if($scope.online[i].member === response.id){
          $scope.online[i].on = true;
          break;
        }
      }
    });

    SocketFactory.on('user-disconnected', function (response) {
      //console.log("User connected: " + response.id);
      for(var i = 0; i < $scope.online.length; i++){
        if($scope.online[i].member === response.id){
          $scope.online[i].on = false;
          break;
        }
      }
    });

    SocketFactory.on('message', function (response) {
      var message = response.message;
      $scope.messages.push(message);
      if(message.member != $scope.me.id) {
        ngAudio.play("audio/message.mp3");
      }
    });

    SocketFactory.on('history-send', function (response) {
      $scope.messages = $scope.messages.concat(response.messages);
      $scope.updating = false;
      $scope.infiniteScrollDisabled = false;
    });

    $scope.$on('$locationChangeStart', function(){
      SocketFactory.disconnect();
      delete SocketFactory.socket;
    });

    $scope.submit = function() {
      if ($scope.text == ""){
        return;
      }

      var messageData = {
        text   : $scope.text,
        chatId : ($routeParams.id || 'geral'),
        member : $scope.me.id,
      }

      SocketFactory.emit('send', {room: $scope.room, message: messageData }, function() {
        //console.log('Message sent');
        $scope.text = "";
      });
    };

    function history () {
      //console.log('Start history request');
      if(!$scope.updating){
        $scope.infiniteScrollDisabled = true;
        $scope.updating = true;
        SocketFactory.emit('history-get', {room: $scope.room, date: $scope.messages[$scope.messages.length-1].date }, function() {
          //console.log('Sent history request');
        });
      }
    }
  }
});

},{}],7:[function(require,module,exports){
require('./list');
require('./chat');
},{"./chat":6,"./list":8}],8:[function(require,module,exports){
'use strict';

theToolController.controller('ChatsController', function ($rootScope, $scope, ChatFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    $scope.loading = true;

    ChatFactory.Chat.getAll(function(chats) {
      $scope.chats = chats;
      $scope.loading = false;
    });
  }

});

},{}],9:[function(require,module,exports){
"use strict";

theToolController.controller("CommentAreaController", function ($rootScope, $scope, $http, $routeParams, MemberFactory, CommentFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    $scope.loading = true;

    $scope.commentData = {
      markdown: ""
    };

    loadComments();

    function loadComments() {
      if ($scope.thread.split("-")[1] === "") {
        setTimeout(loadComments, 500);
        return;
      }

      var threadId;
      var threadType;

      if($scope.subthread && $scope.subthread != '') {
        threadType = $scope.subthread.split('-')[0];
        threadId = $scope.subthread.substring($scope.subthread.indexOf("-") + 1);
      } else {
        threadType = $scope.thread.split('-')[0];
        threadId = $scope.thread.substring($scope.thread.indexOf("-") + 1);
      }

      switch(threadType) {
        case "company": 
          CommentFactory.Company.getAll({id: threadId}, gotComments);
          break;
        case "speaker": 
          CommentFactory.Speaker.getAll({id: threadId}, gotComments);
          break;
        case "topic": 
          CommentFactory.Topic.getAll({id: threadId}, gotComments);
          break;
        case "communication": 
          CommentFactory.Communication.getAll({id: threadId}, gotComments);
          break;
      }

      function gotComments(comments) {
        $scope.comments = comments;

        $scope.loading = false;
      }
    }

    $scope.postComment = function () {
      if ($scope.commentData.markdown === ""){
        $scope.emptyComment = true;
        return;
      }

      var date = Date.now();
      CommentFactory.Comment.create({
        thread: $scope.thread,
        subthread: $scope.subthread,
        member: $scope.me.id,
        markdown: $scope.commentData.markdown,
        html: $scope.convertMarkdownToHtml($scope.commentData.markdown),
        posted: date,
        updated: date
      }, function (response) {
        $scope.commentData.markdown = "";
        $scope.commentForm.$setPristine();
        loadComments();
      });
    };

    $scope.saveComment = function (comment) {
      if (comment.buffer === "") {
        return;
      }

      comment.markdown = comment.buffer;
      comment.html = $scope.convertMarkdownToHtml(comment.markdown);
      comment.updated = Date.now();

      CommentFactory.Comment.update({id: comment._id}, comment, function (response) {
        comment.buffer = "";
        comment.editing = false;
      });
    }

    $scope.quoteComment = function (comment) {
      $scope.commentData.markdown = "> **" + $scope.getMember(comment.member).name + " said:**\n> " + comment.markdown.split("\n").join("\n> ") + "\n\n";
    };

    $scope.deleteComment = function (comment) {
      if (confirm("Are you sure you want to delete this comment?")) {
        CommentFactory.Comment.delete({id: comment._id}, function () {
          loadComments();
        });
      }
    };

    $scope.getMember = function (memberId) {
      return $scope.members.filter(function(o) {
        return o.id == memberId;
      })[0];
    };

    $scope.convertTextToHtml = function(text) {
      var urlExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      var mailExp = /[\w\.\-]+\@([\w\-]+\.)+[\w]{2,4}(?![^<]*>)/ig;

      return text.replace(/\n/g, '<br>').replace(urlExp,"<a href='$1'>$1</a>").replace(mailExp,"<a href='#/company/"+$routeParams.id+"/confirm?email=$&'>$&</a>");
    };

    $scope.convertNewLinesToHtml = function(text) {
      return '<div data-markdown>'+text.replace(/\n/g, '<br>')+'</div>';
    };

    $scope.convertMarkdownToHtml = function(text) {
      return '<div data-markdown>' + text + '</div>';
    };

    $scope.checkPermission = function (comment) {
      if(!$scope.me.roles) { return false; }

      var roles = $scope.me.roles.filter(function(o) {
        return o.id == 'development-team' || o.id == 'coordination';
      });

      if(roles.length == 0 && comment.member != $scope.me.id) {
        return false;
      }

      return true;
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
  }
});

},{}],10:[function(require,module,exports){
"use strict";

theToolController.controller("FirstCommentController", function ($rootScope, $scope, $http, $routeParams, MemberFactory, CommentFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    $scope.loading = true;

    $scope.commentData = {
      markdown: ""
    };

    MemberFactory.Member.get({id: "me"}, function (me) {
      $scope.me = me;
    });

    MemberFactory.Member.getAll(function (members) {
      $scope.members = members;
    });

    loadComments();

    function loadComments() {
      if ($scope.thread.split("-")[1] === "") {
        setTimeout(loadComments, 500);
        return;
      }

      var pageId = $scope.thread.substring($scope.thread.indexOf("-") + 1);

      if ($scope.thread.indexOf("company-") != -1) {
        CommentFactory.Company.getAll({id: pageId}, gotComments);
      }
      else if ($scope.thread.indexOf("speaker-") != -1) {
        CommentFactory.Speaker.getAll({id: pageId}, gotComments);
      }
      else if ($scope.thread.indexOf("topic-") != -1) {
        CommentFactory.Topic.getAll({id: pageId}, gotComments);
      }

      function gotComments(comments) {
        $scope.comments = [];
        var firstComment = comments.sort(function(a,b){
          return new Date(a.posted) - new Date(b.posted);
        })[0];

        $scope.loading = false;
      }
    }

    $scope.postComment = function () {
      if ($scope.commentData.markdown === ""){
        $scope.emptyComment = true;
        return;
      }

      var date = Date.now();
      CommentFactory.Comment.create({
        thread: $scope.thread,
        member: $scope.me.id,
        markdown: $scope.commentData.markdown,
        html: $scope.convertMarkdownToHtml($scope.commentData.markdown),
        posted: date,
        updated: date
      }, function (response) {
        $scope.commentData.markdown = "";
        loadComments();
      });
    }

    $scope.saveComment = function (comment) {
      if (comment.buffer === "") {
        return;
      }

      comment.markdown = comment.buffer;
      comment.html = $scope.convertMarkdownToHtml(comment.markdown);
      comment.updated = Date.now();

      CommentFactory.Comment.update({id: comment._id}, comment, function (response) {
        comment.editing = false;
      });
    }

    $scope.quoteComment = function (comment) {
      $scope.commentData.markdown = "> **" + $scope.getMember(comment.member).name + " said:**\n> " + comment.markdown.split("\n").join("\n> ") + "\n\n";
    };

    $scope.deleteComment = function (comment) {
      if (confirm("Are you sure you want to delete this comment?")) {
        CommentFactory.Comment.delete({id: comment._id}, function () {
          loadComments();
        });
      }
    };

    $scope.getMember = function (memberId) {
      return $scope.members.filter(function(o) {
        return o.id == memberId;
      })[0];
    };

    $scope.convertTextToHtml = function(text) {
      var urlExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      var mailExp = /[\w\.\-]+\@([\w\-]+\.)+[\w]{2,4}(?![^<]*>)/ig;

      return text.replace(/\n/g, '<br>').replace(urlExp,"<a href='$1'>$1</a>").replace(mailExp,"<a href='#/company/"+$routeParams.id+"/confirm?email=$&'>$&</a>");
    };

    $scope.convertNewLinesToHtml = function(text) {
      return '<div data-markdown>'+text.replace(/\n/g, '<br>')+'</div>';
    };

    $scope.convertMarkdownToHtml = function(text) {
      return '<div data-markdown>' + text + '</div>';
    };

    $scope.checkPermission = function (comment) {
      if(!$scope.me.roles) { return false; }

      var roles = $scope.me.roles.filter(function(o) {
        return o.id == 'development-team' || o.id == 'coordination';
      });

      if(roles.length == 0 && comment.member != $scope.me.id) {
        return false;
      }

      return true;
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
  }
});

},{}],11:[function(require,module,exports){
require('./area.js');
require('./first.js');

},{"./area.js":9,"./first.js":10}],12:[function(require,module,exports){
"use strict";

theToolController.controller("CommunicationAreaController", function ($rootScope, $scope, $http, $routeParams, CommunicationFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    $scope.loading = true;

    $scope.communicationData = {
      markdown: ""
    };

    $scope.me = JSON.parse($scope.meJson);
    $scope.members = JSON.parse($scope.membersJson);
    $scope.roles = JSON.parse($scope.rolesJson);

    loadCommunications();

    function loadCommunications() {
      $scope.loading = true;

      if ($scope.thread.split("-")[1] === "") {
        setTimeout(loadCommunications, 500);
        return;
      }

      var pageId = $scope.thread.substring($scope.thread.indexOf("-") + 1);

      if ($scope.thread.indexOf("company-") != -1) {
        CommunicationFactory.Company.getAll( {id: pageId}, gotCommunications);
        $scope.kinds=['Email To', 'Email From', 'Meeting', 'Phone Call'];
      }
      else if ($scope.thread.indexOf("speaker-") != -1) {
        CommunicationFactory.Speaker.getAll( {id: pageId}, gotCommunications);
      }

      function gotCommunications(communications) {
        $scope.communications = communications;

        $scope.loading = false;

        if ($scope.thread.indexOf("speaker-") != -1) {
          if(communications.filter(function(o) {
            return o.kind.indexOf('Paragraph') != -1;
          }).length != 0) {
            $scope.kinds=['Email To', 'Email From', 'Meeting', 'Phone Call'];
          } else {
            $scope.kinds=['Inital Email Paragraph','Email To', 'Email From', 'Meeting', 'Phone Call'];
          }
        }
      }
    }

    $scope.postCommunication = function () {
      if (!$scope.communicationData.kind || $scope.communicationData.kind== ""){
        $scope.emptyCommunication = true;
        return;
      }
      if (!$scope.communicationData.text || $scope.communicationData.text== ""){
        $scope.emptyCommunication = true;
        return;
      }

      var date = Date.now();

      //console.log($scope.event);

      CommunicationFactory.Communication.create({
        thread: $scope.thread,
        member: $scope.me.id,
        kind: $scope.communicationData.kind,
        text: $scope.communicationData.text,
        event: $scope.event.id,
        posted: date,
        updated: date
      }, function (response) {
        $scope.communicationData.text = "";
        $scope.communicationData.kind = "";
        $scope.communicationForm.$setPristine();
        loadCommunications();
      });
    }

    $scope.saveCommunication = function (communication) {
      if (communication.buffer === "") {
        return;
      }

      communication.text = communication.buffer;
      communication.updated = Date.now();

      CommunicationFactory.Communication.update({id: communication._id}, communication, function (response) {
        communication.editing = false;
      });
    }

    $scope.deleteCommunication = function (communication) {
      CommunicationFactory.Communication.delete({id: communication._id}, function () {
        loadCommunications();
      });
    };

    $scope.approveCommunication = function (communication) {
      CommunicationFactory.Communication.approve({id: communication._id}, null, function (response) {
        loadCommunications();
      });
    };

    $scope.getMember = function (memberId) {
      return $scope.members.filter(function(o) {
        return o.id == memberId;
      })[0];
    };

    $scope.checkPermission = function (communication) {
      var roles = $scope.me.roles.filter(function(o) {
        return o.id == 'development-team' || o.id == 'coordination';
      });

      if(roles.length == 0 && communication.member != $scope.me.id) {
        return false;
      }

      return true;
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

    $scope.convertURLs = function(text) {
      var urlExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

      return text.replace(/\n/g, '<br>').replace(urlExp,"<a href='$1'>$1</a>");
    }
  }

});

},{}],13:[function(require,module,exports){
"use strict";

theToolController.controller("CommunicationEmbedController", function ($rootScope, $scope, CommunicationFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    //================================INITIALIZATION================================

    $scope.success     = "";
    $scope.error       = "";

    $scope.communication.editing = false;
    $scope.communication.deleted = false;


    $scope.saveCommunication = function (communication) {
      if (communication.buffer === "") {
        return;
      }

      communication.text = communication.buffer;
      communication.updated = Date.now();

      CommunicationFactory.Communication.update({id: communication._id}, communication, function (response) {
        communication.editing = false;
      });
    }

    $scope.deleteCommunication = function (communication) {
      CommunicationFactory.Communication.delete({id: communication._id}, function () {
        $scope.communication.deleted = true;
      });
    };

    $scope.setCommunicationStatus = function (communication, status) {
      CommunicationFactory.Communication.update({id: communication._id}, {status: status}, function (response) {
        $scope.communication.status = status;
      });
    };

    $scope.getMember = function (memberId) {
      return $scope.members.filter(function(o) {
        return o.id == memberId;
      })[0];
    };

    $scope.checkPermission = function (communication) {
      var roles = $scope.me.roles.filter(function(o) {
        return o.id == 'development-team' || o.id == 'coordination';
      });

      if(roles.length == 0 && communication.member != $scope.me.id) {
        return false;
      }

      return true;
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

    $scope.convertURLs = function(text) {
      var urlExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

      return text.replace(/\n/g, '<br>').replace(urlExp,"<a href='$1'>$1</a>");
    }
  }
});

},{}],14:[function(require,module,exports){
require('./area.js');
require('./list.js');
require('./embed.js');

},{"./area.js":12,"./embed.js":13,"./list.js":15}],15:[function(require,module,exports){
'use strict';

theToolController
  .controller('CommunicationsController', function ($routeParams, $rootScope, $scope, $http, CommunicationFactory) {
    $rootScope.update.timeout(runController);

    function runController(){
      
      $scope.loading = true;

      CommunicationFactory.Communication.getAll(function(response) {
        $scope.loading = false;
        $scope.communications = response;
      });

      $scope.showOpen = true;

      $scope.shownCommunications = function (showOpen) {
        return $scope.communications.filter(function(o) {
          return (showOpen ? !(o.status=='approved') : o.status=='approved') && $routeParams.kind == o.thread.split('-')[0];
        });
      };
    }
  });


},{}],16:[function(require,module,exports){
'use strict';

theToolController
  .controller('CompanyController', function ($rootScope, $scope, $http, $location, $routeParams, $sce, CompanyFactory, MemberFactory, NotificationFactory) {

    $rootScope.update.timeout(runController);

    function runController(){

      $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src+'#page-body');
      }

      $scope.convertEmails = function(text) {
        var mailExp = /[\w\.\-]+\@([\w\-]+\.)+[\w]{2,4}(?![^<]*>)/ig;
        var twitterExp = /(^|[^@\w])@(\w{1,15})\b/g;
        return text.replace(mailExp,"<a href='#/company/"+$routeParams.id+"/confirm?email=$&'>$&</a>").replace(twitterExp,"$1<a href='http://twitter.com/$2' target='_blank'>$2</a>")
      }

      $scope.submit = function() {
        var companyData = this.formData;

        CompanyFactory.Company.update({ id:companyData.id }, companyData, function(response) {
          if(response.error) {
            $scope.error = response.error;
          } else {
            $scope.message = response.success;
            $location.path('company/'+companyData.id);
          }
        });
      };

      $scope.deleteCompany = function(company) {
        CompanyFactory.Company.delete({ id:company.id }, function(response) {
          if(response.error) {
            $scope.error = response.error;
          } else {
            $scope.message = response.success;
          }
          $location.path('companies/');
        });
      };

      $scope.checkPermission = function () {
        var roles = $scope.me.roles.filter(function(o) {
          return o.id == 'development-team' || o.id == 'coordination';
        });

        if(roles.length === 0) {
          return false;
        }

        return true;
      };

      $scope.statuses = ['Suggestion','Contacted','In Conversations','In Negotiations','Closed Deal','Rejected','Give Up'];
      $scope.logoSizes = [null, 'S','M','L'];
      $scope.standDays = [null, 1,2,3,4,5];
      $scope.postsNumbers = [null, 1,2,3,4,5];

      $scope.company = $scope.formData = $scope.getCompany($routeParams.id);

      CompanyFactory.Company.get({id: $routeParams.id}, function(response) {
        $scope.company = $scope.formData = response;

        NotificationFactory.Company.getAll({id: $routeParams.id}, function(getData) {
          $scope.companyNotifications = getData;

          $scope.loading = false;
        });
      });
    }
  });

},{}],17:[function(require,module,exports){
'use strict';

theToolController
  .controller('CompanyEmailController', function ($rootScope, $scope, $http, $routeParams, $sce, $location, EmailFactory) {
    $rootScope.update.timeout(runController);

    function runController(){

      $scope.email = $location.search().email;
      $scope.companyId = $routeParams.id;
      $scope.loading = false;
      $scope.error = null;
      $scope.message = null;

      $scope.submit = function() {
        $scope.loading = true;
        $scope.error = null;
        $scope.message = null;

        //console.log("send email to ", $scope.email, " from ", $scope.companyId);

        EmailFactory.Company.send({ id: $scope.companyId }, { email: $scope.email }, function(response) {
          $scope.loading = false;
          if(response.error) {
            $scope.error = response.error;
          } else {
            $scope.message = response.message;
          }
        });
      };
    }
  });

},{}],18:[function(require,module,exports){
'use strict';
 
theToolController
  .controller('CreateCompanyController', function ($rootScope, $scope, $http, $routeParams, $location, CompanyFactory) {
    $rootScope.update.timeout(runController);

    function runController(){
      
      $scope.submit = function() {
        var companyData = this.formData;

        CompanyFactory.Company.create(companyData, function(response) {
          if(response.error) {
            $scope.error = response.error;
          } else {
            $scope.message = response.message;
            
            CompanyFactory.Company.getAll(function (companies) {
              $scope.companies = companies;
            });

            $location.path("/company/" + response.id);
          }
        });
      };

      $scope.statuses = ['Suggestion','Contacted','In Conversations','In Negotiations','Closed Deal','Rejected','Give Up'];
    }
  });
},{}],19:[function(require,module,exports){
'use strict';

theToolController.controller('CompanyEmbedController', function ($rootScope, $scope) {

  $rootScope.update.timeout(runController);

  function runController(){

    if($scope.comments) {
      $scope.company.comments = $scope.comments.filter(function(e) {
        return e.thread == 'company-'+$scope.company.id;
      });
    }

    if($scope.event) {
      $scope.participation = $scope.company.participations.filter(function(o) {
        return o.event == $scope.event.id;
      })[0];
    }

    $scope.getMember = function (memberId) {
      var member = $scope.members.filter(function(o) {
        return o.id == memberId;
      });

      if(member.length>0) {
        return member[0];
      } else {
        return {
          name: 'No one',
          facebook: '100000456335972'
        };
      }
    };

    $scope.getUnreadNotifications = function (thread) {
      var notifications = $scope.notifications.filter(function(o) {
        return o.thread == thread;
      });
      return notifications;
    };

    $scope.company.unread = $scope.getUnreadNotifications('company-' + $scope.company.id).length > 0;

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
          return interval + ' years ' + suffix;
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
          return interval + ' months ' + suffix;
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
          return interval + ' days ' + suffix;
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
          return interval + ' hours ' + suffix;
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
          return interval + ' minutes ' + suffix;
      }
      return Math.floor(seconds) + ' seconds ' + suffix;
    };
  }
});

},{}],20:[function(require,module,exports){
require('./company.js');
require('./list.js');
require('./create.js');
require('./confirm.js');
require('./embed.js');
},{"./company.js":16,"./confirm.js":17,"./create.js":18,"./embed.js":19,"./list.js":21}],21:[function(require,module,exports){
'use strict';

theToolController
  .controller('CompaniesController', function ($rootScope, $scope, $http, $sce, CompanyFactory) {

    $rootScope.update.timeout(runController);

    function runController(){
      $scope.saveStatus = function(company) {
        var companyData = company;

        CompanyFactory.Company.update({ id:company.id }, companyData, function(response) {
          if(response.error) {
            $scope.error = response.error;
          } else {
            $scope.message = response.message;
          }
        });
      };

      $scope.getClassFromPaymentStatus = function(participation) {
        if(!participation) { return 'grey'; }
        if(!participation.payment) { return 'grey'; }
        if(!participation.payment.status) { return 'grey'; }
        var status = participation.payment.status.toLowerCase();

        if(status.indexOf('pago') != -1 || status.indexOf('emitido') != -1 || status.indexOf('recibo enviado') != -1) { return 'lime'; }
        else if(status.indexOf('enviado') != -1) { return 'orange'; }
        else { return 'grey'; }
      };

      $scope.paymentStatuses = ['Emitido', 'Recibo Enviado', 'Pago', 'Enviado'];

      $scope.limit = 20;

      $scope.statuses = ['Suggestion','Contacted','In Conversations','In Negotiations','Closed Deal','Rejected','Give Up'];

      $scope.companyPredicate = 'updated';
      $scope.reverse = 'true';
      $scope.unreadFirst = true;

      CompanyFactory.Company.getAll(function(response) {
        $scope.predicate = 'updated';
        $scope.reverse = true;
        $scope.companies = response;
      });

      $scope.scroll = function() {
        if ($scope.limit <= $scope.companies.length)
          $scope.limit += 8;
      };

      $scope.checkPermission = function (member) {
        var roles = $scope.me.roles.filter(function(o) {
          return o.id == 'development-team' || o.id == 'coordination';
        });

        if(roles.length === 0 && member.id != $scope.me.id) {
          return false;
        }

        return true;
      };

      $scope.addCompany = function(member, newCompany) {
        //console.log(newCompany);
        var companyData = newCompany;

        if(newCompany.id) {
          var participation = $scope.getParticipation(companyData, $scope.currentEvent.id);
          if(participation) {
            participation.member = member.id;
          } else {
            companyData.participations.push({
              event: $scope.currentEvent.id,
              status: 'Selected',
              member: member.id
            });
          }
          CompanyFactory.Company.update({ id: companyData.id }, { participations: companyData.participations }, function(response) {
            if(response.error) {
              //console.log(response);
              $scope.error = response.error;
            } else {
              $scope.message = response.success;

              CompanyFactory.Company.getAll(function (companies) {
                $scope.companies = companies;
              });
            }
          });
        } else {
          companyData.participations = [{
            event: $scope.currentEvent.id,
            status: 'Selected',
            member: member.id
          }];

          CompanyFactory.Company.create(companyData, function(response) {
            if(response.error) {
              $scope.error = response.error;
            } else {
              $scope.message = response.message;

              CompanyFactory.Company.getAll(function (companies) {
                $scope.companies = companies;
              });
            }
          });
        }
      };
    }


});


},{}],22:[function(require,module,exports){
theToolController = angular.module('theTool.controllers', []);

require('./auth');
require('./main');
require('./company');
require('./speaker');
require('./member');
require('./comment');
require('./meeting');
require('./chat');
require('./topic');
require('./communication');
require('./tag');
require('./subscription');
require('./admin');

},{"./admin":2,"./auth":3,"./chat":7,"./comment":11,"./communication":14,"./company":20,"./main":24,"./meeting":27,"./member":32,"./speaker":38,"./subscription":42,"./tag":43,"./topic":46}],23:[function(require,module,exports){
"use strict";

theToolController.controller("home", function ($rootScope, $scope, NotificationFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    $scope.loading = true;
    $scope.notifications = [];
    $scope.limit = 10;

    NotificationFactory.Notification.getAll(function (response) {
      $scope.notifications = response;
      $scope.loading = false;
    });

    $scope.scroll = function () {
      if ($scope.limit < $scope.notifications.length) {
        $scope.limit += 10;
      }
    };
  }

});

},{}],24:[function(require,module,exports){
require('./main.js');
require('./home.js');

},{"./home.js":23,"./main.js":25}],25:[function(require,module,exports){
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
  $scope.targetNotifications = [];
  $scope.unreadNotifications = [];

  $scope.targetInfo = {
    number: 0,
    text: " Loading..."
  };

  var factoriesReady = 0;

  $scope.setCurrentEvent = function(event) {
    $scope.currentEvent = {};
    setTimeout(function(){$scope.currentEvent = event;},10);
  }

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
        $scope.currentEvent = events[0];
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
      //console.log("Updating!");
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
      $scope.targetNotifications = [];
      $scope.unreadNotifications = [];
      $scope.targetInfo.number = 0;

      for (var i = 0; i < response.length; i++) {
        if (response[i].targets.indexOf($scope.me.id) != -1) {
          if (response[i].unread.indexOf($scope.me.id) != -1) {
            $scope.targetInfo.number++;
          }
          $scope.targetNotifications.unshift(response[i]);
        }
        if (response[i].unread.indexOf($scope.me.id) != -1) {
          $scope.unreadNotifications.unshift(response[i]);
        }
      }

      if ($scope.targetInfo.number == 0) {
        $scope.targetInfo.text = " No Notifications";
      }
      else {
        $scope.targetInfo.text = " " + $scope.targetInfo.number + " Notification" + ($scope.targetInfo.number > 1 ? "s" : "");
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
    return $scope.unreadNotifications.filter(function(o) {
      return o.thread == thread;
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

  $scope.getParticipation = function (thing, eventId) {
    return thing.participations.filter(function(o) {
      return o.event == eventId;
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
        //console.log("ERROR", data);
        $window.location.assign('/');
      });
  }


});

},{}],26:[function(require,module,exports){
"use strict";

theToolController.controller("MeetingEmbedController", function ($rootScope, $scope, MeetingFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    //================================INITIALIZATION================================

    $scope.loading = true;

    MeetingFactory.get({id: $scope.meetingId}, function (meeting) {
      $scope.meeting = meeting;

      $scope.loading = false;
    });


    //===================================FUNCTIONS===================================

    $scope.getMember = function (memberId) {
      return $scope.members.filter(function (o) {
        return o.id === memberId;
      })[0];
    };
  }

});

},{}],27:[function(require,module,exports){
require("./embed");
require("./list");
require("./meeting");

},{"./embed":26,"./list":28,"./meeting":29}],28:[function(require,module,exports){
'use strict';

theToolController.controller('MeetingsController', function ($rootScope, $scope, $location, MeetingFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    //================================INITIALIZATION================================

    $scope.loading = true;

    init();

    function init() {
      setTimeout(function() {
        if ($scope.loading) {
          init();
        }
      }, 1000);

      MeetingFactory.getAll(function (meetings) {
        $scope.meetings = meetings;

        for (var i = 0, j = $scope.meetings.length; i < j; i++) {
          $scope.meetings[i].facebook = $scope.members.filter(function(o) {
            return $scope.meetings[i].author == o.id;
          })[0].facebook;
        }

        $scope.loading = false;
      });
    }


    //===================================FUNCTIONS===================================

    $scope.time = function(date) {
      return $scope.timeSince(new Date(date));
    };

    $scope.createMeeting = function() {
      var date = new Date();

      MeetingFactory.create({
        author: $scope.me.id,
        title: date.toLocaleDateString("pt-PT") + " - Meeting",
        date: date
      }, function(response) {
        if (response.success) {
          $location.path("/meeting/" + response.id + "/edit");
        }
      });
    };
  }
});

},{}],29:[function(require,module,exports){
"use strict";

theToolController.controller("MeetingController", function ($rootScope, $scope, $routeParams, $location, $timeout, MeetingFactory, TopicFactory, TagFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    //================================INITIALIZATION================================

    $scope.loading = true;

    $scope.kinds = ["Info", "To do", "Decision", "Idea"];

    MeetingFactory.get({id: $routeParams.id}, function (meeting) {
      $scope.meeting = meeting;

      String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
      };

      if ($location.path().endsWith("/text")) {
        var text = meeting.title + "\n\n" + (meeting.description ? meeting.description + "\n\n" : "");

        if (meeting.attendants.length > 0) {
          text += "Attendants:\n";

          meeting.attendants.sort();

          for (var i = 0; i < meeting.attendants.length; i++) {
            text += $scope.getMember(meeting.attendants[i]).name + (i+1 < meeting.attendants.length ? ", " : "");
          }
          text += "\n\n";
        }

        TagFactory.Tag.getAll(function (result) {
          var tags = [];

          for (var i = 0; i < result.length; i++) {
            tags.push(result[i]);
          }

          tags.sort(function (o1, o2) {
            return o1.name.localeCompare(o2.name);
          });

          for (var i = 0; i < tags.length; i++) {
            var topics = meeting.topics.filter(function (o) {
              return o.tags.indexOf(tags[i].id) != -1;
            });

            if (topics.length === 0) {
              continue;
            }

            text += tags[i].name + ":\n";

            topics.sort(function (o1, o2) {
              return o1.posted.toString().localeCompare(o2.posted.toString());
            });

            for (var j = 0; j < topics.length; j++) {
              text += "    - " + topics[j].text.replace(/\n/g, "\n      ") + "\n";
            }

            text += "\n";
          }

          $scope.numberOfLines = (function () {
            var n = 0;
            for (var i = 0; i < text.length; i++) {
              if (text[i] === "\n") {
                n++;
              }
            }
            return n + 2;
          }());

          $scope.text = text;

          $scope.loading = false;
        });
      }
      else {
        $scope.loading = false;
      }
    });


    //===================================FUNCTIONS===================================

    $scope.toggleAttendant = function (member) {
      var index = $scope.meeting.attendants.indexOf(member);

      if (index === -1) {
        $scope.meeting.attendants.push(member);
      }
      else {
        $scope.meeting.attendants.splice(index, 1);
      }
    };

    $scope.toggleAttendants = function () {
      for (var i = 0, j = $scope.members.length; i < j; i++) {
        $scope.toggleAttendant($scope.members[i].id);
      }
    };

    $scope.getAttendants = function () {
      return $scope.meeting.attendants.map(function (o) {
        return $scope.getMember(o);
      });
    };

    $scope.createTopic = function (kind) {
      var topic = {
        editing: true,
        author: $scope.me.id,
        text: "",
        targets: [],
        kind: kind,
        closed: false,
        result: "",
        poll: {
          kind: "text",
          options: []
        },
        duedate: null,
        meetings: [$scope.meeting._id],
        root: null,
        tags: [],
        posted: new Date()
      };

      TopicFactory.Topic.create(topic, function (response) {
        if (response.success) {
          topic._id = response.id;
          $scope.meeting.topics.push(topic);
        }
      });
    };

    $scope.addTopic = function (topicId) {
      $scope.display = false;

      var topic = $scope.topics.filter(function (o) {
        return o._id === topicId;
      })[0];

      $scope.meeting.topics.push(topic);

      topic.meetings.push($scope.meeting._id);
      TopicFactory.Topic.update({id: topic._id}, topic);
    };

    $scope.removeTopic = function (topic) {
      $scope.meeting.topics.splice($scope.meeting.topics.indexOf(topic), 1);

      topic.meetings.splice(topic.meetings.indexOf($scope.meeting._id), 1);
      TopicFactory.Topic.update({id: topic._id}, topic);
    };

    $scope.saveMeeting = function () {
      $scope.success = "";
      $scope.error   = "";

      if (!$scope.meeting.title){
        $scope.error = "Please enter a title.";
        return;
      }

      MeetingFactory.update({id: $scope.meeting._id}, $scope.meeting, function (response) {
        if (response.success) {
          $scope.success = "Meeting saved.";

          if ($scope.timeout) {
            $timeout.cancel($scope.timeout);
          }

          $scope.timeout = $timeout(function () {
            $scope.success = "";
          }, 3000);
        }
        else {
          $scope.error = "There was an error. Please contact the Dev Team and give them the details about the error.";
        }
      });
    };

    $scope.deleteMeeting = function () {
      if (confirm("Are you sure you want to delete this meeting?")) {
        MeetingFactory.delete({id: $scope.meeting._id}, function (response) {
          if(response.error) {
            $scope.error = "There was an error. Please contact the Dev Team and give them the details about the error.";
          }
          else {
            $location.path("/meetings/");
          }
        });
      }
    };

    $scope.show = function () {
      $scope.display = ($scope.searchTopic ? true : false);
    };

    $scope.alreadyInMeetingFilter = function (topic) {
      for (var i = 0; i < $scope.meeting.topics.length; i++) {
        if ($scope.meeting.topics[i]._id === topic._id) {
          return false;
        }
      }
      return true;
    };
  }
});

},{}],30:[function(require,module,exports){
"use strict";

theToolController.controller("CreateMemberController", function ($rootScope, $scope, $http, $location, $routeParams, MemberFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    $scope.formData = {};
    $scope.formData.roles = [];
    $scope.formData.phones = [];

    $scope.submit = function() {
      var memberData = this.formData;

      MemberFactory.Member.create(memberData, function(response) {
        //console.log(response)
        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.message;
          $location.path("/member/" + response.id);
        }
      });
    };
  }

});

},{}],31:[function(require,module,exports){
"use strict";

theToolController.controller("MemberEmbedController", function ($rootScope, $scope) {

  $rootScope.update.timeout(runController);

  function runController(){

  }

});

},{}],32:[function(require,module,exports){
require('./member.js');
require('./list.js');
require('./create.js');
require('./embed.js');
},{"./create.js":30,"./embed.js":31,"./list.js":33,"./member.js":34}],33:[function(require,module,exports){
"use strict";

theToolController.controller("MembersController", function ($rootScope, $scope, MemberFactory) {
  
  $rootScope.update.timeout(runController);

  function runController(){
    MemberFactory.Member.getAll(function (response) {
      $scope.memberPredicate = "name";
      $scope.reverse = false;
      $scope.members = response;
    });
  }
});

},{}],34:[function(require,module,exports){
"use strict";

theToolController.controller("MemberController", function ($rootScope, $scope, $http, $routeParams, $sce, $location, MemberFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    $scope.loading = true;

    if ($routeParams.id === "me") {
      $location.path("/member/" + $scope.me.id);
      return;
    }

    $scope.member = $scope.formData = $scope.getMember($routeParams.id);

    MemberFactory.Member.get({id:$routeParams.id}, function(result) { 
      if(!result.error) {
        $scope.member = $scope.formData = result;
        getMemberStuff();
      } 
    });

    getMemberStuff();

    function getMemberStuff() {
      if($scope.companies && $scope.speakers && $scope.comments && $scope.companies.length > 0 && $scope.speakers.length > 0 && $scope.comments.length > 0) {
        $scope.loading = false;
      } else {
        return setTimeout(getMemberStuff, 1000);
      }

      $scope.memberStuff = {};

      $scope.memberStuff.companies = $scope.companies.filter(function(e) {
        return e.member == $scope.member.id;
      })

      $scope.memberStuff.speakers = $scope.speakers.filter(function(e) {
        return e.member == $scope.member.id;
      })

      $scope.memberStuff.comments = $scope.comments.filter(function(e) {
        return e.member == $scope.member.id;
      })
    }


    $scope.submit = function() {
      var memberData = this.formData;

      MemberFactory.Member.update({ id:memberData.id }, memberData, function(response) {
        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.success;
        }
      });
    };
  }
});

},{}],35:[function(require,module,exports){
'use strict';

theToolController
  .controller('SpeakerEmailController', function ($rootScope, $scope, $http, $routeParams, $sce, $location, EmailFactory) {

    $rootScope.update.timeout(runController);

    function runController(){

      $scope.email = $location.search().email;
      $scope.speakerId = $routeParams.id;
      $scope.loading = false;
      $scope.error = null;
      $scope.message = null;

      $scope.submit = function() {
        $scope.loading = true;
        $scope.error = null;
        $scope.message = null;

        //console.log("send email to ", $scope.email, " from ", $scope.speakerId);

        EmailFactory.Speaker.send({ id: $scope.speakerId }, { email: $scope.email }, function(response) {
          $scope.loading = false;
          if(response.error) {
            $scope.error = response.error;
          } else {
            $scope.message = response.message;
          }
        });
      };
    }
  });

},{}],36:[function(require,module,exports){
'use strict';
 
theToolController
  .controller('CreateSpeakerController', function ($rootScope, $scope, $http, $routeParams, $location, SpeakerFactory) {
    
    $rootScope.update.timeout(runController);

    function runController(){

      $scope.submit = function() {
        var speakerData = this.formData;

        speakerData.status = 'Suggestion';

        SpeakerFactory.Speaker.create(speakerData, function(response) {
          if(response.error) {
            $scope.error = response.error;
          } else {
            $scope.message = response.message;

            SpeakerFactory.Speaker.getAll(function (speakers) {
              $scope.speakers = speakers;
            });
            
            $location.path("/speaker/" + response.id);
          }
        });
      };
    }
  });
},{}],37:[function(require,module,exports){
'use strict';

theToolController.controller('SpeakerEmbedController', function ($rootScope, $scope) {

  $rootScope.update.timeout(runController);

  function runController(){

    if($scope.comments) {
      $scope.speaker.comments = $scope.comments.filter(function(e) {
        return e.thread == 'speaker-'+$scope.speaker.id;
      });
    }

    if($scope.event) {
      $scope.participation = $scope.speaker.participations.filter(function(o) {
        return o.event == $scope.event.id;
      })[0];
    }

    $scope.getUnreadNotifications = function (thread) {
      var notifications = $scope.notifications.filter(function(o) {
        return o.thread == thread;
      });
      return notifications;
    };

    $scope.speaker.unread = $scope.getUnreadNotifications('speaker-' + $scope.speaker.id).length > 0;

    $scope.getMember = function (memberId) {
      var member = $scope.members.filter(function(o) {
        return o.id == memberId;
      });

      if(member.length>0) {
        return member[0];
      } else {
        return {
          name: 'No one',
          facebook: '100000456335972'
        };
      }
    };

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
          return interval + ' years ' + suffix;
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
          return interval + ' months ' + suffix;
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
          return interval + ' days ' + suffix;
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
          return interval + ' hours ' + suffix;
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
          return interval + ' minutes ' + suffix;
      }
      return Math.floor(seconds) + ' seconds ' + suffix;
    };
  }

});

},{}],38:[function(require,module,exports){
require('./speaker.js');
require('./list.js');
require('./create.js');
require('./confirm.js');
require('./embed.js');

},{"./confirm.js":35,"./create.js":36,"./embed.js":37,"./list.js":39,"./speaker.js":40}],39:[function(require,module,exports){
'use strict';

theToolController
  .controller('SpeakersController', function ($rootScope, $scope, $http, $sce, SpeakerFactory) {

    $rootScope.update.timeout(runController);

    function runController(){

      $scope.limit = 20;

      $scope.statuses = ['Suggestion','Selected','Approved','Contacted','In Conversations','Accepted','Rejected','Give Up'];

      $scope.speakerPredicate = 'updated';
      $scope.reverse = 'true';
      $scope.filteredSpeakers = [];
      $scope.searchSpeakers = {unassigned: true, unassignedOnly: false};
      $scope.unreadFirst = true;



      SpeakerFactory.Speaker.getAll(function(response) {
        $scope.speakers = response;
        //$scope.filteredSpeakers = $scope.speakers;
      });

      $scope.scroll = function() {
        if ($scope.limit <= $scope.speakers.length)
          $scope.limit += 8;
      };

      $scope.checkPermission = function (member) {
        var roles = $scope.me.roles.filter(function(o) {
          return o.id == 'development-team' || o.id == 'coordination';
        });

        if(roles.length === 0 && member.id != $scope.me.id) {
          return false;
        }

        return true;
      };

      $scope.addSpeaker = function(member, newSpeaker) {
        //console.log(newSpeaker);
        var speakerData = newSpeaker;

        if(newSpeaker.id) {
          var participation = $scope.getParticipation(speakerData, $scope.currentEvent.id);
          if(participation) {
            participation.member = member.id;
          } else {
            speakerData.participations.push({
              event: $scope.currentEvent.id,
              status: 'Selected',
              member: member.id
            });
          }
          SpeakerFactory.Speaker.update({ id: speakerData.id }, { participations: speakerData.participations }, function(response) {
            if(response.error) {
              //console.log(response);
              $scope.error = response.error;
            } else {
              $scope.message = response.success;

              SpeakerFactory.Speaker.getAll(function (speakers) {
                $scope.speakers = speakers;
              });
            }
          });
        } else {
          speakerData.participations = [{
            event: $scope.currentEvent.id,
            status: 'Selected',
            member: member.id
          }];

          SpeakerFactory.Speaker.create(speakerData, function(response) {
            if(response.error) {
              $scope.error = response.error;
            } else {
              $scope.message = response.message;

              SpeakerFactory.Speaker.getAll(function (speakers) {
                $scope.speakers = speakers;
              });
            }
          });
        }
      };

      // $scope.$watch(['currentEvent', 'searchStatus'], function(newValues, oldValues, scope){
      //   //console.log('filtering speakers by',$scope.searchStatus,$scope.currentEvent);
      //   if($scope.speakers){
      //     $scope.filteredSpeakers = $scope.speakers.filter(function(o) {
      //       return o.participations.filter(function(p) {
      //         if($scope.searchStatus && $scope.searchStatus !== '') {
      //           return p.event === $scope.currentEvent.id && p.status === $scope.searchStatus;
      //         } else {
      //           return p.event === $scope.currentEvent.id;
      //         }
      //       });
      //     });
      //   }
      // });
    }
  });


},{}],40:[function(require,module,exports){
'use strict';

theToolController
  .controller('SpeakerController', function ($rootScope, $scope, $location, $window, $routeParams, $sce, SpeakerFactory, MemberFactory, NotificationFactory) {
    
    $rootScope.update.timeout(runController);

    function runController(){

      $scope.communicationEvent = $scope.currentEvent;

      $scope.setCommunicationEvent = function(event) {
        $scope.communicationEvent = event;
      }

      $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src+'#page-body');
      };

      $scope.convertEmails = function(text) {
        var mailExp = /[\w\.\-]+\@([\w\-]+\.)+[\w]{2,4}(?![^<]*>)/ig;
        var twitterExp = /(^|[^@\w])@(\w{1,15})\b/g;
        return text.replace(mailExp,'<a href="mailto:$&">$&</a>').replace(twitterExp,'$1<a href="http://twitter.com/$2" target="_blank">@$2</a>');
      };

      $scope.submit = function() {
        var speakerData = this.formData;

        SpeakerFactory.Speaker.update({ id:speakerData.id }, speakerData, function(response) {
          if(response.error) {
            $scope.error = response.error;
          } else {
            $scope.message = response.success;
            $location.path('speaker/'+speakerData.id);
          }
        });
      };

      $scope.deleteSpeaker = function(speaker) {
        SpeakerFactory.Speaker.delete({ id:speaker.id }, function(response) {
          if(response.error) {
            $scope.error = response.error;
          } else {
            $scope.message = response.success;
          }
          $location.path('speakers/');
        });
      };

      $scope.checkPermission = function () {
        var roles = $scope.me.roles.filter(function(o) {
          return o.id == 'development-team' || o.id == 'coordination';
        });

        if(roles.length === 0) {
          return false;
        }

        return true;
      };

      $scope.statuses = ['Suggestion','Selected','Approved','Contacted','In Conversations','Accepted','Rejected','Give Up'];

      $scope.speaker = $scope.formData = $scope.getSpeaker($routeParams.id);

      SpeakerFactory.Speaker.get({id: $routeParams.id}, function(response) {
        $scope.speaker = $scope.formData = response;

        NotificationFactory.Speaker.getAll({id: $routeParams.id}, function(getData) {
          $scope.speakerNotifications = getData;

          $scope.loading = false;
        });
      });

      var win = $window;
      $scope.$watch('speakerForm.$dirty', function(value) {
        if(value) {
          win.onbeforeunload = function(){
            return 'You have unsaved changes';
          };
        }
      });
    }

  });

},{}],41:[function(require,module,exports){
"use strict";

theToolController.controller("SubscriptionController", function ($rootScope, $scope, SubscriptionFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    $scope.loading = true;

    var threadId = $scope.thread.substring($scope.thread.indexOf("-") + 1);
    var threadKind = $scope.thread.split('-')[0];

    var Factory;

    switch(threadKind) {
      case 'company':
        Factory = SubscriptionFactory.Company;
      break;
      case 'speaker':
        Factory = SubscriptionFactory.Speaker;
      break;
      case 'topic':
        Factory = SubscriptionFactory.Topic;
      break;
    }

    //console.log('THREAD', $scope.thread, threadKind, threadId);
    //console.log('FACTORYYY', SubscriptionFactory.Company, SubscriptionFactory.Speaker, SubscriptionFactory.Topic, Factory);

    $scope.isSubscribed = false;

    $scope.getStatus = function () {
      Factory.get({id: threadId}, function(response) {
        //console.log('STATUS',response.success)
        if(response.success == 'subscribed') {
          $scope.isSubscribed = true;
        } else {
          $scope.isSubscribed = false;
        }
      })
    };

    $scope.subscribe = function () {
      //console.log('ADDD', threadKind, threadId);
      Factory.add({id: threadId}, {}, function(response) {
        $scope.getStatus();
      })
    };

    $scope.unsubscribe = function () {
      //console.log('DELETE', threadKind, threadId);
      Factory.remove({id: threadId}, function(response) {
        $scope.getStatus();
      })
    };

    $scope.getStatus();
  }
});

},{}],42:[function(require,module,exports){
require('./embed');
},{"./embed":41}],43:[function(require,module,exports){
require('./manager');
},{"./manager":44}],44:[function(require,module,exports){
"use strict";

theToolController.controller("TagManagerController", function ($rootScope, $scope, TagFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    $scope.loading = true;

    $scope.tag = {};

    $scope.lightColors = ["#f7c6c7", "#fad8c7", "#fef2c0", "#bfe5bf", "#bfdadc", "#c7def8", "#bfd4f2", "#d4c5f9"];
    $scope.colors = ["#e11d21", "#eb6420", "#fbca04", "#009800", "#006b75", "#207de5", "#0052cc", "#5319e7"];

    $scope.changeColor = function (color) {
      $scope.tag.color = color;
    };

    $scope.createTag = function (tag) {
      TagFactory.Tag.create(tag, function (response) {
        if (response.success) {
          $scope.tags.push(response.tag);
          $scope.tag = {};
        }
      });
    };

    $scope.saveTag = function (tag) {
      TagFactory.Tag.update({id: tag.id}, tag, function (response) {
        if (response.success) {
          tag.editing = false;
        }
      });
    };

    $scope.deleteTag = function (tag) {
      TagFactory.Tag.delete({id: tag.id}, function (response) {
        if (response.success) {
          $scope.tags.splice($scope.tags.indexOf(tag), 1);
        }
      });
    };
  }
});

},{}],45:[function(require,module,exports){
"use strict";

theToolController.controller("TopicEmbedController", function ($rootScope, $scope, $location, TopicFactory, NotificationFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    //================================INITIALIZATION================================

    $scope.loading = true;

    $scope.error       = "";
    $scope.showTargets = false;

    $scope.pollKinds = ["text", "images"];

    if ($scope.comments) {
      $scope.topic.comments = $scope.comments.filter(function (e) {
        return e.thread == "topic-" + $scope.topic._id;
      });
    }

    show($scope.topic);


    //=================================AUXFUNCTIONS==================================

    function show(topic) {
      topic.show = {
        text     : true,
        targets  : true,
        poll     : false,
        duedate  : false,
        meeting  : true,
        closed   : false
      };

      if (topic.kind === "To do") {
        topic.show.duedate = true;
        topic.show.closed  = true;
      }
      else if (topic.kind === "Decision") {
        topic.show.duedate = true;
        topic.show.closed  = true;
        topic.show.poll = true;
      }

      $scope.loading = false;
    }

    $scope.checkPermission = function (topic) {
      if (!$scope.me.roles) { return false; }

      var roles = $scope.me.roles.filter(function (o) {
        return o.id == 'development-team' || o.id == 'coordination';
      });

      if (roles.length == 0 && topic.author != $scope.me.id) {
        return false;
      }

      return true;
    }


    //===================================FUNCTIONS===================================

    $scope.deleteTopic = function (topic) {
      if (confirm("Are you sure you want to delete this topic?")) {
        TopicFactory.Topic.delete({id: topic._id}, function () {
          topic.deleted = true;
          $location.path('/topics');
        });
      }
    };

    $scope.toggleTag = function (tag) {
      var index = $scope.topic.tags.indexOf(tag);

      if (index == -1) {
        $scope.topic.tags.push(tag);
      }
      else {
        $scope.topic.tags.splice(index, 1);
      }
    };

    $scope.getTagIcon = function (tag) {
      return ($scope.topic.tags.indexOf(tag.id) !== -1 ? "check" : "times");;
    };

    $scope.toggleTarget = function (target) {
      var index = $scope.topic.targets.indexOf(target);

      if (index == -1) {
        $scope.topic.targets.push(target);
      }
      else {
        $scope.topic.targets.splice(index, 1);
      }
    };

    $scope.toggleAllTargets = function () {
      for (var i = 0, j = $scope.members.length; i < j; i++) {
        $scope.toggleTarget($scope.members[i].id);
      }
    };

    $scope.toggleRoleTargets = function (roleId) {
      for (var i = 0, j = $scope.members.length; i < j; i++) {
        for(var o = 0; o < $scope.members[i].roles.length; o++) {
          if ($scope.members[i].roles[o].id == roleId) {
            $scope.toggleTarget($scope.members[i].id);
          }
        }
      }
    };

    $scope.toggleTargets = function () {
      $scope.showTargets = !$scope.showTargets;
    };

    $scope.getTargetColor = function (memberId) {
      return ($scope.topic.targets.indexOf(memberId) !== -1 ? "blue" : "");
    };

    $scope.focusOption = function (option) {
      for (var i = 0, j = $scope.topic.poll.options.length; i < j; i++) {
        $scope.topic.poll.options[i].editing = false;
      }

      option.editing = true;
    };

    $scope.addOption = function () {
      var option = {
        optionType: "Info",
        targets: []
      };

      $scope.topic.poll.options.push(option);

      $scope.focusOption(option);
    };

    $scope.removeOption = function (option) {
      $scope.topic.poll.options.splice($scope.topic.poll.options.indexOf(option), 1);
    };

    $scope.selectOption = function (topic, option) {
      var updatedTopic = topic;

      if (option.votes.indexOf($scope.me.id) !== -1) {
        updatedTopic.poll.options[updatedTopic.poll.options.indexOf(option)].votes.splice(updatedTopic.poll.options[updatedTopic.poll.options.indexOf(option)].votes.indexOf($scope.me.id), 1);
      }
      else {
        updatedTopic.poll.options[updatedTopic.poll.options.indexOf(option)].votes.push($scope.me.id);
      }

      updatedTopic._voting = true;

      TopicFactory.Topic.update({id: updatedTopic._id}, updatedTopic, function (response) {
        if (response.error) {
          //console.log("There was an error. Please contact the Dev Team and give them the details about the error.");
        }
        else if (response.success) {
          ////console.log(response.success);
        }
      });
    };

    $scope.save = function (topic) {
      $scope.error = "";

      //console.log(topic);

      TopicFactory.Topic.update({id: topic._id}, topic, function (response) {
        if (response.success) {
          topic.editing = !topic.editing;
        }
        else {
          $scope.error = "There was an error. Please contact the Dev Team and give them the details about the error.";
        }
      });
    };

    $scope.read = function (topic) {
      if (!$scope.notifications) {
        return;
      }

      $scope.notifications.filter(function (o) {
        return o.thread === "topic-" + topic._id;
      }).forEach(function (notification) {
        var index = notification.unread.indexOf($scope.me.id);
        if (index !== -1) {
          notification.unread.splice(index, 1);
          NotificationFactory.Notification.update({id: notification._id}, notification);
        }
      });
    };

    $scope.getMember = function (memberId) {
      var member = $scope.members.filter(function (o) {
        return o.id == memberId;
      });

      if (member && member.length > 0) {
        return member[0];
      }
      else {
        return {
          name: "No one",
          facebook: "100000456335972"
        };
      }
    };

    $scope.getUnreadNotifications = function (thread) {
      //console.log(notifications);
      var notifications = $scope.notifications.filter(function(o) {
        return o.thread == thread;
      });

      return notifications;
    };

     $scope.topic.unread = $scope.getUnreadNotifications('topic-'+ $scope.topic._id).length > 0;

    $scope.timeSince =function (date) {
      date = new Date(date);
      var seconds = Math.floor((Date.now() - date) / 1000);

      var suffix = "ago";
      if (seconds < 0){
        seconds = Math.abs(seconds);
        suffix = "to go";
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
  }
});

},{}],46:[function(require,module,exports){
require('./list');
require('./topic');
require('./embed');

},{"./embed":45,"./list":47,"./topic":48}],47:[function(require,module,exports){
"use strict";

theToolController.controller("TopicsController", function ($rootScope, $scope, $location, $routeParams, TopicFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    //================================INITIALIZATION================================

    $scope.loading = true;

    $scope.kinds = ["Info", "To do", "Decision", "Idea"];

    $scope.searchTopics = {};

    $scope.unreadFirst = true;

    TopicFactory.Topic.getAll(gotTopics);

    function gotTopics (topics) {
      setTimeout(function () {
        if ($scope.loading) {
          gotTopics(topics);
        }
      }, 1000);

      $scope.topics = topics;

      for (var i = 0, j = $scope.topics.length; i < j; i++) {
        $scope.topics[i].facebook = $scope.members.filter(function (o) {
          return $scope.topics[i].author === o.id;
        })[0].facebook;
      }

      $scope.loading = false;
    }

    $scope.showOpen = true;
    $scope.limit = 10;


    //===================================FUNCTIONS===================================

    $scope.time = function(date) {
      return $scope.timeSince(new Date(date));
    };

    $scope.createTopic = function(kind) {
      var date = new Date();
      TopicFactory.Topic.create({
        author: $scope.me.id,
        kind: kind,
        tags: [$scope.searchTopics.tags]
      }, function (response) {
        if (response.success) {
          TopicFactory.Topic.getAll(function (topics) {
            $scope.topics = topics;
            $scope.topics.filter(function (o) {
              return o._id == response.id;
            })[0].editing = true;
            $location.path('topic/'+response.id);
          });
        }
      });
    };

    $scope.count = function (open) {
      return $scope.topics.filter(function (o) {
        return (open ? !o.closed : o.closed);
      }).length;
    };

    $scope.shownTopics = function (open) {
      return $scope.topics.filter(function (o) {
        return o.editing || (open ? !o.closed : o.closed) && (function () {
          if ($scope.searchTopics.tags && o.tags.indexOf($scope.searchTopics.tags) === -1) {
            return false;
          }
          if ($scope.searchTopics.target && o.targets.indexOf($scope.searchTopics.target) === -1) {
            return false;
          }
          if ($scope.searchTopics.kind && o.kind !== $scope.searchTopics.kind) {
            return false;
          }
          return true;
        }());
      });
    };

    $scope.scroll = function() {
      if ($scope.limit < $scope.topics.length)
        $scope.limit += 4;
    };
  }
});

},{}],48:[function(require,module,exports){
'use strict';

theToolController.controller('TopicController', function ($rootScope, $scope, $routeParams, $location, $window, TopicFactory, NotificationFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    $scope.loading = true;

    TopicFactory.Topic.get({id: $routeParams.id}, function(result) {
      $scope.topic = result;

      //console.log($location.search());
      if($location.search().editing == true) {
        $scope.topic.editing=true;
        //console.log('TRUEEE');
      }

      $scope.topic.showComments = true;

      $scope.loading = false;
    });
  }

});

},{}],49:[function(require,module,exports){
'use strict';

theToolDirectives
  .directive('commentArea', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/comment/area.html',
      controller: 'CommentAreaController',
      scope: {
        thread: '@',
        subthread: '@',
        me: '=',
        members: '='
      }
    };
  });
},{}],50:[function(require,module,exports){
'use strict';

theToolDirectives
  .directive('firstComment', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/comment/first.html',
      controller: 'FirstCommentController',
      scope: {
        thread: '@'
      }
    };
  })
},{}],51:[function(require,module,exports){
require('./area');
require('./first');
},{"./area":49,"./first":50}],52:[function(require,module,exports){
'use strict';

theToolDirectives
  .directive('communicationArea', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/communication/area.html',
      controller: 'CommunicationAreaController',
      scope: {
        thread: '@',
        event: '=',
        membersJson: '@members',
        meJson: '@me',
        rolesJson: '@roles'
      }
    };
  })
},{}],53:[function(require,module,exports){
'use strict';

theToolDirectives
  .directive('communication', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/communication/communication.html',
      controller: 'CommunicationEmbedController',
      scope: {
        communication: '=communicationObject',
        members: '=',
        me: '='
      }
    };
  })
},{}],54:[function(require,module,exports){
require('./area');
require('./communication');
},{"./area":52,"./communication":53}],55:[function(require,module,exports){
'use strict';

theToolDirectives
  .directive('companyCard', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/company/card.html',
      controller: 'CompanyEmbedController',
      scope: {
        company: '=company',
        event: '=event',
        notifications: '=notifications',
        me: '=me',
        members: '=members'
      }
    };
  });

},{}],56:[function(require,module,exports){
require('./card');
},{"./card":55}],57:[function(require,module,exports){
require('./input')
},{"./input":58}],58:[function(require,module,exports){
'use strict';

theToolDirectives
  .directive(
    'dateInput',
    function(dateFilter) {
        return {
            require: 'ngModel',
            template: '<input type="date"></input>',
            replace: true,
            link: function(scope, elm, attrs, ngModelCtrl) {
                ngModelCtrl.$formatters.unshift(function (modelValue) {
                    return dateFilter(modelValue, 'yyyy-MM-dd');
                });

                ngModelCtrl.$parsers.unshift(function(viewValue) {
                    return new Date(viewValue);
                });
            },
        };
  })
},{}],59:[function(require,module,exports){
theToolDirectives = angular.module("theTool.directives", []);

require("./comment");
require("./communication");
require("./company");
require("./date");
require("./markdown");
require("./meeting");
require("./speaker");
require("./tag");
require("./topic");
require("./scroll");
require("./subscription");
require("./member");
},{"./comment":51,"./communication":54,"./company":56,"./date":57,"./markdown":61,"./meeting":64,"./member":66,"./scroll":67,"./speaker":70,"./subscription":71,"./tag":73,"./topic":76}],60:[function(require,module,exports){
'use strict';

theToolDirectives
  .directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
          function(scope) {
             // watch the 'compile' expression for changes
            return scope.$eval(attrs.compile);
          },
          function(value) {
            // when the 'compile' expression changes
            // assign it into the current DOM
            element.html(value);

            // compile the new DOM and link it to the current
            // scope.
            // NOTE: we only compile .childNodes so that
            // we don't get into infinite loop compiling ourselves
            $compile(element.contents())(scope);
          }
      );
    }
  }])
},{}],61:[function(require,module,exports){
require('./compile');
require('./markdown');
},{"./compile":60,"./markdown":62}],62:[function(require,module,exports){
'use strict';

theToolDirectives
  .directive('markdown', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var htmlText = markdown.toHTML(element.text());
            element.html(htmlText.replace(/\n/g, '<br>'));
        }
    };
  }])
},{}],63:[function(require,module,exports){
"use strict";

theToolDirectives.directive("embedMeeting", function () {
  return {
    restrict: "E",
    replace: true,
    templateUrl: "views/meeting/embed.html",
    controller: "MeetingEmbedController",
    scope: {
      meetingId: "=",
      members: "="
    }
  };
});

},{}],64:[function(require,module,exports){
require("./embed");

},{"./embed":63}],65:[function(require,module,exports){
'use strict';

theToolDirectives
  .directive('memberCard', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/member/card.html',
      controller: 'MemberEmbedController',
      scope: {
        member: '=memberObject',
      }
    };
  })

},{}],66:[function(require,module,exports){
require('./card.js');
},{"./card.js":65}],67:[function(require,module,exports){
require("./position.js");
},{"./position.js":68}],68:[function(require,module,exports){
"use strict";

theToolDirectives.directive('whenScrolled', ['$timeout', function($timeout) {
  return function(scope, elm, attr) {

    //console.log("On directive");

    //console.log(elm);

    var raw = elm[0];
    //console.log(raw);

    $timeout(function() {
      //console.log(raw.scrollTop);
      //console.log(raw.scrollHeight);
      raw.scrollTop = raw.scrollHeight;
    });

    elm.bind('scroll', function() {
      if (raw.scrollTop <= 100) { // load more items before you hit the top
        var sh = raw.scrollHeight
        scope.$apply(attr.whenScrolled);
        raw.scrollTop = raw.scrollHeight - sh;
      }
    });
  };
}]);

},{}],69:[function(require,module,exports){
'use strict';

theToolDirectives
  .directive('speakerCard', function () {
    return {
      restrict: 'AEC',
      replace: true,
      templateUrl: 'views/speaker/card.html',
      controller: 'SpeakerEmbedController',
      scope: {
        speaker: '=speaker',
        event: '=event',
        notifications: '=notifications',
        me: '=me',
        members: '=members'
      }
    };
  });

},{}],70:[function(require,module,exports){
arguments[4][56][0].apply(exports,arguments)
},{"./card":69}],71:[function(require,module,exports){
require('./subscription');
},{"./subscription":72}],72:[function(require,module,exports){
'use strict';

theToolDirectives
  .directive('subscription', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/subscription/button.html',
      controller: 'SubscriptionController',
      scope: {
        thread: '@'
      }
    };
  })
},{}],73:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"./manager":74}],74:[function(require,module,exports){
"use strict";

theToolDirectives
  .directive("tagManager", function () {
    return {
      restrict: "E",
      replace: true,
      templateUrl: "views/tag/manager.html",
      controller: "TagManagerController",
      scope: {
        tags: "=tagsArray",
        search: "="
      }
    };
  })

},{}],75:[function(require,module,exports){
"use strict";

theToolDirectives.directive("topicCard", function () {
  return {
    restrict: "E",
    replace: true,
    templateUrl: "views/topic/card.html",
    controller: "TopicEmbedController",
    scope: {
      topic: "=",
      members: "=",
      me: "=",
      roles: "=",
      tags: "=",
      comments: "=",
      notifications: "="
    }
  };
});

},{}],76:[function(require,module,exports){
require("./topic");
require("./card");

},{"./card":75,"./topic":77}],77:[function(require,module,exports){
"use strict";

theToolDirectives.directive("topic", function () {
  return {
    restrict: "E",
    replace: true,
    templateUrl: "views/topic/topic.html",
    controller: "TopicEmbedController",
    scope: {
      topic: "=",
      members: "=",
      me: "=",
      roles: "=",
      tags: "=",
      comments: "=",
      notifications: "="
    }
  };
});

},{}],78:[function(require,module,exports){
'use strict';

angular.module('theTool.filters', [])
  .filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
  .filter('filterEventStatus', function(){
    return function(objs, event, search) {
      var result = objs;
      result = objs.filter(function(o) {
        if(o.participations.length <= 0){
          return search.unassigned || search.unassignedOnly;
        }
        if(event && !search.unassignedOnly) {
          return o.participations.filter(function(p) {
            if(search.status && search.status !== '' && search.member && search.member !== '') {
              return p.event === event.id && p.status === search.status && p.member === search.member;
            } else if(search.status && search.status !== '') {
              return p.event === event.id && p.status === search.status;
            } else if(search.member && search.member !== '') {
              return p.event === event.id && p.member === search.member;
            } else {
              return p.event === event.id;
            }
          }).length > 0;
        }
      });
      return result;
    };
  })
  .filter('filterRole', function() {
    return function(members, role) {
          var result = members;
          if(role) {
            result = members.filter(function(m) {
              return m.roles.filter(function(r) {
                return r.id == role;
              }).length > 0;
            });
          }
          return result;
      };
  });
},{}],79:[function(require,module,exports){
'use strict';

theToolServices
  .factory('ChatFactory', function ($resource) {
    return {
      Chat: $resource(url_prefix+'/api/chat/:id', null, {
        'update': {method: 'POST'},
        'getAll': {method: 'GET', isArray:true}
      }),
      Message: $resource(url_prefix+'/api/chat/:id/messages', null, {
        'getAll': {method: 'GET',isArray:true}
      })
    }
  })
},{}],80:[function(require,module,exports){
'use strict';

theToolServices
  .factory('CommentFactory', function ($resource) {
    return {
      Comment: $resource(url_prefix+'/api/comment/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Company: $resource(url_prefix+'/api/company/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Speaker: $resource(url_prefix+'/api/speaker/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Topic: $resource(url_prefix+'/api/topic/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Communication: $resource(url_prefix+'/api/communication/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    }
  })
},{}],81:[function(require,module,exports){
'use strict';

theToolServices
  .factory('CommunicationFactory', function ($resource) {
    return {
      Communication: $resource(url_prefix+'/api/communication/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Company: $resource(url_prefix+'/api/company/:id/communications', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Speaker: $resource(url_prefix+'/api/speaker/:id/communications', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    };
  })
},{}],82:[function(require,module,exports){
'use strict';

theToolServices
  .factory('CompanyFactory', function ($resource) {
    return {
      Company: $resource(url_prefix+'/api/company/:id', null, {
        'getAll': {method: 'GET', isArray:true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Member: $resource(url_prefix+'/api/member/:id/companies', null, {
        'getAll': {method: 'GET', isArray:true}
      })
    };
  })
},{}],83:[function(require,module,exports){
'use strict';

theToolServices
  .factory('EmailFactory', function ($resource) {
    return {
      Company: $resource(url_prefix+'/api/company/:id/sendInitialEmail', null, {
        'send': {method: 'POST'}
      }),
      Speaker: $resource(url_prefix+'/api/speaker/:id/sendInitialEmail', null, {
        'send': {method: 'POST'}
      })
    }
  })
},{}],84:[function(require,module,exports){
'use strict';

theToolServices
  .factory('EventFactory', function ($resource) {
    return {
      Event: $resource(url_prefix+'/api/event/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      })
    }
  })
},{}],85:[function(require,module,exports){
theToolServices = angular.module('theTool.services', ['ngResource']);

require('./chat');
require('./comment');
require('./communication');
require('./company');
require('./email');
require('./meeting');
require('./member');
require('./message');
require('./notification');
require('./role');
require('./session');
require('./socket');
require('./speaker');
require('./subscription');
require('./tag');
require('./topic');
require('./event');
require('./item');

},{"./chat":79,"./comment":80,"./communication":81,"./company":82,"./email":83,"./event":84,"./item":86,"./meeting":87,"./member":88,"./message":89,"./notification":90,"./role":91,"./session":92,"./socket":93,"./speaker":94,"./subscription":95,"./tag":96,"./topic":97}],86:[function(require,module,exports){
'use strict';

theToolServices
  .factory('ItemFactory', function ($resource) {
    return {
      Item: $resource(url_prefix+'/api/item/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      })
    }
  })
},{}],87:[function(require,module,exports){
'use strict';

theToolServices
  .factory('MeetingFactory', function ($resource) {
    return $resource(url_prefix+'/api/meeting/:id', null, {
      'getAll': {method: 'GET', isArray: true},
      'create': {method: 'POST'},
      'update': {method: 'PUT'},
      'delete': {method: 'DELETE'}
    });
  })

},{}],88:[function(require,module,exports){
'use strict';

theToolServices
  .factory('MemberFactory', function ($resource) {
    return {
      Member: $resource(url_prefix+'/api/member/:id', null, {
        'getAll': {method: 'GET', isArray:true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Role: $resource(url_prefix+'/api/role/:id/members', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Me: $resource(url_prefix+'/api/myself', null, {
        'get': {method: 'GET', isArray: false}
      })
    };
  })
},{}],89:[function(require,module,exports){
'use strict';

theToolServices
  .factory('MessageFactory', function ($resource) {
    return $resource(url_prefix+'/api/message/:id', null, {
        'getAll':    {method: 'GET', isArray: true}
      })
  })
},{}],90:[function(require,module,exports){
'use strict';

theToolServices.factory('NotificationFactory', function ($resource) {
  return {
    Notification: $resource(url_prefix+'/api/notification/:id', null, {
      'getAll': {method: 'GET', isArray: true},
      'update': {method: 'PUT'}
    }),
    Company: $resource(url_prefix+'/api/company/:id/notifications', null, {
      'getAll': {method: 'GET', isArray: true}
    }),
    Speaker: $resource(url_prefix+'/api/speaker/:id/notifications', null, {
      'getAll': {method: 'GET', isArray: true}
    }),
    Topic: $resource(url_prefix+'/api/topic/:id/notifications', null, {
      'getAll': {method: 'GET', isArray: true}
    })
  };
});

},{}],91:[function(require,module,exports){
'use strict';

theToolServices
  .factory('RoleFactory', function ($resource) {
    return {
      Role: $resource(url_prefix+'/api/role/:id', null, {
        'getAll': {method: 'GET', isArray: true},
      }),
      Member: $resource(url_prefix+'/api/role/:id/members', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    };
  })

},{}],92:[function(require,module,exports){
'use strict';

theToolServices
  .factory('SessionFactory', function ($resource) {
    return {
      Session: $resource(url_prefix+'/api/session/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Company: $resource(url_prefix+'/api/company/:id/sessions', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Speaker: $resource(url_prefix+'/api/speaker/:id/sessions', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    }
  })
},{}],93:[function(require,module,exports){
'use strict';

theToolServices
  .factory('SocketFactory', function ($resource, $location, $rootScope) {
    var socket;
    return {
      connect: function(nsp) {
        //console.log(socket);
        socket = io.connect(nsp, {multiplex: false});
      },
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      },
      disconnect: function () {
        socket.disconnect();
      },
      socket: socket
    };
  });

},{}],94:[function(require,module,exports){
'use strict';

theToolServices
  .factory('SpeakerFactory', function ($resource) {
    return {
      Speaker: $resource(url_prefix+'/api/speaker/:id', null, {
        'getAll': {method: 'GET', isArray:true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Member: $resource(url_prefix+'/api/member/:id/speakers', null, {
        'getAll': {method: 'GET', isArray:true}
      })
    };
  })
},{}],95:[function(require,module,exports){
"use strict";

theToolServices.factory("SubscriptionFactory", function ($resource) {
  return {
    Company: $resource(url_prefix + "/api/company/:id/subscription", null, {
      "get": {method: "GET"},
      "add": {method: "POST"},
      "remove": {method: "DELETE"}
    }),
    Speaker: $resource(url_prefix + "/api/speaker/:id/subscription", null, {
      "get": {method: "GET"},
      "add": {method: "POST"},
      "remove": {method: "DELETE"}
    }),
    Topic: $resource(url_prefix + "/api/topic/:id/subscription", null, {
      "get": {method: "GET"},
      "add": {method: "POST"},
      "remove": {method: "DELETE"}
    })
  };
});

},{}],96:[function(require,module,exports){
'use strict';

theToolServices
  .factory('TagFactory', function ($resource) {
    return {
      Tag: $resource(url_prefix+'/api/tag/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Topic: $resource(url_prefix+'/api/tag/:id/topics', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    };
  })
},{}],97:[function(require,module,exports){
'use strict';

theToolServices
  .factory('TopicFactory', function ($resource) {
    return {
      Topic: $resource(url_prefix+'/api/topic/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'create': {method: 'POST'},
        'update': {method: 'PUT'},
        'delete': {method: 'DELETE'}
      }),
      Member: $resource(url_prefix+'/api/member/:id/topics', null, {
        'getAll': { method: 'GET', isArray: true }
      })
    };
  })

},{}],98:[function(require,module,exports){
url_prefix = require('./../../config').url;

require('./angularApp/app.js');
require('./angularApp/controllers');
require('./angularApp/directives');
require('./angularApp/filters');
require('./angularApp/services');
},{"./../../config":99,"./angularApp/app.js":1,"./angularApp/controllers":22,"./angularApp/directives":59,"./angularApp/filters":78,"./angularApp/services":85}],99:[function(require,module,exports){
var process=require("__browserify_process");var config = {
  url: process.env.EVENTDECK_URL || 'http://localhost:8080',
  port: process.env.EVENTDECK_PORT || 8080,
};

config.mongo = {
  url: process.env.EVENTDECK_MONGO_URL || 'mongodb://localhost/sinfo'
};

config.cookie = {
  name: process.env.EVENTDECK_COOKIE_NAME || 'eventdeck',
  password: process.env.EVENTDECK_COOKIE_PASSWORD || 'YOUR COOKIE PASSWORD'
};

config.mailgun = {
  email: process.env.EVENTDECK_MAILGUN_EMAIL || 'deck@sinfo.org',
  api: process.env.EVENTDECK_MAILGUN_API || 'YOUR MAILGUN KEY',
  publicApi: process.env.EVENTDECK_MAILGUN_PUBLIC_API || 'YOUR MAILGUN PUBLIC KEY'
};

config.facebook = {
  appId: process.env.EVENTDECK_FACEBOOK_APP_ID || '457207507744159',
  appSecret: process.env.EVENTDECK_FACEBOOK_APP_SECRET || '9f027c52e00bc3adbabcd926a3c95b97'
};

config.bunyan = {
  name: require('./package.json').name,
  level: process.env.EVENTDECK_LOG_LEVEL || 'trace'
};


module.exports = config;

},{"./package.json":101,"__browserify_process":100}],100:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],101:[function(require,module,exports){
module.exports={
  "name": "eventdeck",
  "version": "0.0.0",
  "description": "eventdeck ========",
  "main": "index.js",
  "scripts": {
    "start": "node serverApp/index.js | bunyan",
    "mon": "node_modules/.bin/nodemon serverApp/index.js | bunyan",
    "dist": "node_modules/.bin/browserify -t brfs --debug -e clientApp/js/theTool.js -o public/js/theTool.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/SINFO/eventdeck.git"
  },
  "author": "Francisco Dias <francisco@baiodias.com> (http://franciscodias.net/)",
  "license": "BSD-2-Clause",
  "bugs": {
    "url": "https://github.com/SINFO/eventdeck/issues"
  },
  "homepage": "https://github.com/SINFO/eventdeck",
  "dependencies": {
    "cron": "~1.0.4",
    "hapi": "~3.0.0",
    "hapi-auth-cookie": "~1.0.2",
    "handlebars": "~2.0.0-alpha.2",
    "async": "~0.2.9",
    "mongoose": "~3.8.4",
    "markdown": "~0.5.0",
    "emailjs": "~0.3.8",
    "socket.io": "~1.0.2",
    "socket.io-client": "~1.0.2",
    "request": "~2.36.0",
    "mailgun": "~0.4.2",
    "mailcomposer": "~0.2.12",
    "bunyan": "~1.0.1"
  },
  "devDependencies": {
    "nodemon": "~0.7.10",
    "colors": "~0.6.2",
    "gaze": "~0.4.3",
    "brfs": "0.0.8",
    "browserify": "~3.20.0",
    "tabletop": "~1.3.3"
  }
}

},{}]},{},[98])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcRGlvZ29cXERlc2t0b3BcXHJvb3RcXGV2ZW50ZGVja1xcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2FwcC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvYWRtaW4vaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2F1dGgvaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2F1dGgvaW50ZXJjZXB0b3IuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2F1dGgvbG9naW4uanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NoYXQvY2hhdC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY2hhdC9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY2hhdC9saXN0LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tZW50L2FyZWEuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW1lbnQvZmlyc3QuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW1lbnQvaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW11bmljYXRpb24vYXJlYS5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbXVuaWNhdGlvbi9lbWJlZC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbXVuaWNhdGlvbi9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbXVuaWNhdGlvbi9saXN0LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21wYW55L2NvbXBhbnkuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvY29uZmlybS5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9jcmVhdGUuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvZW1iZWQuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvbGlzdC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21haW4vaG9tZS5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWFpbi9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWFpbi9tYWluLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZWV0aW5nL2VtYmVkLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZWV0aW5nL2luZGV4LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZWV0aW5nL2xpc3QuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lZXRpbmcvbWVldGluZy5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVtYmVyL2NyZWF0ZS5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVtYmVyL2VtYmVkLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lbWJlci9saXN0LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvbWVtYmVyLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2NvbmZpcm0uanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvY3JlYXRlLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2VtYmVkLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2luZGV4LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2xpc3QuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvc3BlYWtlci5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvc3Vic2NyaXB0aW9uL2VtYmVkLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zdWJzY3JpcHRpb24vaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3RhZy9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdGFnL21hbmFnZXIuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3RvcGljL2VtYmVkLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90b3BpYy9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdG9waWMvbGlzdC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdG9waWMvdG9waWMuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbWVudC9hcmVhLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbW1lbnQvZmlyc3QuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbWVudC9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9jb21tdW5pY2F0aW9uL2FyZWEuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbXVuaWNhdGlvbi9jb21tdW5pY2F0aW9uLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbW11bmljYXRpb24vaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tcGFueS9jYXJkLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbXBhbnkvaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvZGF0ZS9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9kYXRlL2lucHV0LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2luZGV4LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21hcmtkb3duL2NvbXBpbGUuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWFya2Rvd24vaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWFya2Rvd24vbWFya2Rvd24uanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWVldGluZy9lbWJlZC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9tZWV0aW5nL2luZGV4LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21lbWJlci9jYXJkLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21lbWJlci9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9zY3JvbGwvaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvc2Nyb2xsL3Bvc2l0aW9uLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3NwZWFrZXIvY2FyZC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9zcGVha2VyL2luZGV4LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3N1YnNjcmlwdGlvbi9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9zdWJzY3JpcHRpb24vc3Vic2NyaXB0aW9uLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3RhZy9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy90YWcvbWFuYWdlci5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy90b3BpYy9jYXJkLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3RvcGljL2luZGV4LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3RvcGljL3RvcGljLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9maWx0ZXJzL2luZGV4LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9jaGF0LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9jb21tZW50LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9jb21tdW5pY2F0aW9uLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9jb21wYW55LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9lbWFpbC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvZXZlbnQuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2luZGV4LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9pdGVtLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9tZWV0aW5nLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9tZW1iZXIuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL21lc3NhZ2UuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL25vdGlmaWNhdGlvbi5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvcm9sZS5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvc2Vzc2lvbi5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvc29ja2V0LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9zcGVha2VyLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9zdWJzY3JpcHRpb24uanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL3RhZy5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvdG9waWMuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy90aGVUb29sLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jb25maWcuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svcGFja2FnZS5qc29uIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUtBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3UUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBOztBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoXCJ0aGVUb29sXCIsIFtcclxuICBcIm5nXCIsXHJcbiAgXCJuZ1JvdXRlXCIsXHJcbiAgXCJuZ1Nhbml0aXplXCIsXHJcbiAgXCJuZ1RvdWNoXCIsXHJcbiAgXCJpbmZpbml0ZS1zY3JvbGxcIixcclxuICBcInVuc2F2ZWRDaGFuZ2VzXCIsXHJcbiAgXCJsdWVnZy5kaXJlY3RpdmVzXCIsXHJcbiAgXCJuZ0F1ZGlvXCIsXHJcbiAgXCJ0aGVUb29sLmZpbHRlcnNcIixcclxuICBcInRoZVRvb2wuc2VydmljZXNcIixcclxuICBcInRoZVRvb2wuZGlyZWN0aXZlc1wiLFxyXG4gIFwidGhlVG9vbC5jb250cm9sbGVyc1wiXHJcbl0pLlxyXG5jb25maWcoW1wiJHJvdXRlUHJvdmlkZXJcIiwgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL1wiICAgICAgICAgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jaGF0L3ZpZXcuaHRtbFwiLCAgICAgICAgICAgICBjb250cm9sbGVyOiBcIkNoYXRDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2FkbWluXCIgICAgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9pbmRleC5odG1sXCIsICAgICAgICAgICBjb250cm9sbGVyOiBcIkFkbWluQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9sb2dpblwiICAgICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvYXV0aC9sb2dpbi5odG1sXCIsICAgICAgICAgICAgY29udHJvbGxlcjogXCJMb2dpbkNvbnRyb2xsZXJcIn0pO1xyXG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbG9naW4vOmlkLzpjb2RlXCIgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2F1dGgvbG9naW4uaHRtbFwiLCAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTG9naW5Db250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbmllcy9cIiAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2xpc3QuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbmllc0NvbnRyb2xsZXJcIn0pO1xyXG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tcGFuaWVzL3RhYmxlL1wiICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbXBhbnkvdGFibGUuaHRtbFwiLCAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ29tcGFuaWVzQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW5pZXMvYnVkZ2V0L1wiICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tcGFueS9idWRnZXQuaHRtbFwiLCAgICAgICAgY29udHJvbGxlcjogXCJDb21wYW5pZXNDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvXCIgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2NyZWF0ZS5odG1sXCIsICAgICAgICBjb250cm9sbGVyOiBcIkNyZWF0ZUNvbXBhbnlDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvOmlkXCIgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L3ZpZXcuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbnlDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvOmlkL2VkaXRcIiAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2VkaXQuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbnlDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvOmlkL3BhcnRpY2lwYXRpb25zXCIsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L3BhcnRpY2lwYXRpb25zLmh0bWxcIixjb250cm9sbGVyOiBcIkNvbXBhbnlDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvOmlkL2NvbmZpcm1cIiAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2NvbmZpcm0uaHRtbFwiLCAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbnlFbWFpbENvbnRyb2xsZXJcIn0pO1xyXG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tbWVudC86aWQvZWRpdFwiICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbW1lbnQvZWRpdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ29tbWVudENvbnRyb2xsZXJcIn0pO1xyXG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvc3BlYWtlcnMvXCIgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3NwZWFrZXIvbGlzdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiU3BlYWtlcnNDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL3NwZWFrZXJzL3RhYmxlL1wiICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zcGVha2VyL3RhYmxlLmh0bWxcIiwgICAgICAgICBjb250cm9sbGVyOiBcIlNwZWFrZXJzQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyL1wiICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9jcmVhdGUuaHRtbFwiLCAgICAgICAgY29udHJvbGxlcjogXCJDcmVhdGVTcGVha2VyQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyLzppZFwiICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci92aWV3Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJTcGVha2VyQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyLzppZC9lZGl0XCIgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9lZGl0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJTcGVha2VyQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyLzppZC9wYXJ0aWNpcGF0aW9uc1wiLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9wYXJ0aWNpcGF0aW9ucy5odG1sXCIsY29udHJvbGxlcjogXCJTcGVha2VyQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyLzppZC9jb25maXJtXCIgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9jb25maXJtLmh0bWxcIiwgICAgICAgY29udHJvbGxlcjogXCJTcGVha2VyRW1haWxDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lbWJlcnMvXCIgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZW1iZXIvbGlzdC5odG1sXCIsICAgICAgICAgICBjb250cm9sbGVyOiBcIk1lbWJlcnNDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lbWJlci9cIiAgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZW1iZXIvY3JlYXRlLmh0bWxcIiwgICAgICAgICBjb250cm9sbGVyOiBcIkNyZWF0ZU1lbWJlckNvbnRyb2xsZXJcIn0pO1xyXG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVtYmVyLzppZFwiICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lbWJlci92aWV3Lmh0bWxcIiwgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVtYmVyQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZW1iZXIvOmlkL2VkaXRcIiAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVtYmVyL2VkaXQuaHRtbFwiLCAgICAgICAgICAgY29udHJvbGxlcjogXCJNZW1iZXJDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lZXRpbmdzXCIgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZWV0aW5nL2xpc3QuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIk1lZXRpbmdzQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZWV0aW5nLzppZFwiICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy92aWV3Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJNZWV0aW5nQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZWV0aW5nLzppZC90ZXh0XCIgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy90ZXh0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJNZWV0aW5nQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZWV0aW5nLzppZC9lZGl0XCIgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy9lZGl0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJNZWV0aW5nQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jaGF0c1wiICAgICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY2hhdC9saXN0Lmh0bWxcIiwgICAgICAgICAgICAgY29udHJvbGxlcjogXCJDaGF0c0NvbnRyb2xsZXJcIn0pO1xyXG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY2hhdC86aWRcIiAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NoYXQvdmlldy5odG1sXCIsICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ2hhdENvbnRyb2xsZXJcIn0pO1xyXG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvdG9waWNzXCIgICAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3RvcGljL2xpc3QuaHRtbFwiLCAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiVG9waWNzQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi90b3BpYy86aWRcIiAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvdG9waWMvdmlldy5odG1sXCIsICAgICAgICAgICAgY29udHJvbGxlcjogXCJUb3BpY0NvbnRyb2xsZXJcIn0pO1xyXG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tbXVuaWNhdGlvbnMvOmtpbmRcIiAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbW11bmljYXRpb24vbGlzdC5odG1sXCIsICAgIGNvbnRyb2xsZXI6IFwiQ29tbXVuaWNhdGlvbnNDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci5vdGhlcndpc2Uoe3JlZGlyZWN0VG86IFwiL1wifSk7XHJcbn1dKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiQWRtaW5Db250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIEV2ZW50RmFjdG9yeSwgSXRlbUZhY3RvcnkpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgIEV2ZW50RmFjdG9yeS5FdmVudC5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICRzY29wZS5ldmVudHMgPSByZXNwb25zZTtcclxuICAgIH0pO1xyXG5cclxuICAgIEl0ZW1GYWN0b3J5Lkl0ZW0uZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAkc2NvcGUuaXRlbXMgPSByZXNwb25zZTtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS5hZGRFdmVudCA9IGZ1bmN0aW9uKG5ld0V2ZW50KSB7XHJcbiAgICAgIEV2ZW50RmFjdG9yeS5FdmVudC5jcmVhdGUobmV3RXZlbnQsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgRXZlbnRGYWN0b3J5LkV2ZW50LmdldEFsbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICRzY29wZS5ldmVudHMgPSByZXNwb25zZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5hZGRJdGVtID0gZnVuY3Rpb24obmV3SXRlbSkge1xyXG4gICAgICBJdGVtRmFjdG9yeS5JdGVtLmNyZWF0ZShuZXdJdGVtLCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEl0ZW1GYWN0b3J5Lkl0ZW0uZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgJHNjb3BlLml0ZW1zID0gcmVzcG9uc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUudXBkYXRlRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgRXZlbnRGYWN0b3J5LkV2ZW50LnVwZGF0ZSh7aWQ6IGV2ZW50LmlkfSwgZXZlbnQsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlLmVycm9yKTtcclxuICAgICAgICAgIHJldHVybiAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZXZlbnQuZWRpdGluZyA9IGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnVwZGF0ZUl0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICBJdGVtRmFjdG9yeS5JdGVtLnVwZGF0ZSh7aWQ6IGl0ZW0uaWR9LCBpdGVtLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGl0ZW0uZWRpdGluZyA9IGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmRlbGV0ZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIEV2ZW50RmFjdG9yeS5FdmVudC5kZWxldGUoe2lkOiBldmVudC5pZH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEV2ZW50RmFjdG9yeS5FdmVudC5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAkc2NvcGUuZXZlbnRzID0gcmVzcG9uc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZGVsZXRlSXRlbSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgIEl0ZW1GYWN0b3J5Lkl0ZW0uZGVsZXRlKHtpZDogaXRlbS5pZH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEl0ZW1GYWN0b3J5Lkl0ZW0uZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgJHNjb3BlLml0ZW1zID0gcmVzcG9uc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgfVxyXG59KTtcclxuIiwicmVxdWlyZShcIi4vbG9naW5cIik7XHJcbnJlcXVpcmUoJy4vaW50ZXJjZXB0b3InKTtcclxuIiwidGhlVG9vbENvbnRyb2xsZXIuY29uZmlnKGZ1bmN0aW9uICgkaHR0cFByb3ZpZGVyKSB7XHJcbiAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChbJyRpbmplY3RvcicsIGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcclxuICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcclxuICB9XSk7XHJcbn0pO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXIuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRsb2NhdGlvbiwgJHdpbmRvdykge1xyXG4gIHJldHVybiB7XHJcbiAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAxKSB7XHJcbiAgICAgICAgJHJvb3RTY29wZS51cGRhdGUucnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmKCRsb2NhdGlvbi5wYXRoKCkuaW5kZXhPZignL2xvZ2luJykgPT0gLTEpIHtcclxuICAgICAgICAgICRyb290U2NvcGUubmV4dFBhdGggPSAnIycgKyAkbG9jYXRpb24ucGF0aCgpO1xyXG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcbn0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBmYWNlYm9va0NvbmZpZyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vLi4vLi4vY29uZmlnJykuZmFjZWJvb2s7XHJcblxyXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTG9naW5Db250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uLCAkaHR0cCwgJHdpbmRvdykge1xyXG5cclxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICQuYWpheFNldHVwKHtjYWNoZTogdHJ1ZX0pO1xyXG4gICQuZ2V0U2NyaXB0KFwiLy9jb25uZWN0LmZhY2Vib29rLm5ldC9wdF9QVC9hbGwuanNcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgRkIuaW5pdCh7YXBwSWQ6IGZhY2Vib29rQ29uZmlnLmFwcElkfSk7XHJcbiAgfSk7XHJcblxyXG4gICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgJHNjb3BlLnNob3dJZElucHV0ID0gdHJ1ZTtcclxuICAkc2NvcGUuc2hvd0NvZGVJbnB1dCA9IGZhbHNlO1xyXG5cclxuICBpZigkc2NvcGUubWUuaWQpIHtcclxuICAgIC8vJGxvY2F0aW9uLnBhdGgoJy8nKTtcclxuICAgICR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcvJyk7XHJcbiAgfVxyXG5cclxuICB2YXIgbG9jayA9IGZhbHNlO1xyXG5cclxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgJHNjb3BlLmZhY2Vib29rTG9naW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkc2NvcGUuYmFuYW5hID0gdHJ1ZTtcclxuXHJcbiAgXHRpZiAobG9jaykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbG9jayA9IHRydWU7XHJcblxyXG4gICAgRkIuZ2V0TG9naW5TdGF0dXMoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IFwiY29ubmVjdGVkXCIpIHtcclxuICAgICAgICBjb25uZWN0ZWQocmVzcG9uc2UpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIEZCLmxvZ2luKGZ1bmN0aW9uICgpIHt9LCB7ZGlzcGxheTogXCJwb3B1cFwifSk7XHJcbiAgICAgICAgRkIuRXZlbnQuc3Vic2NyaWJlKFwiYXV0aC5zdGF0dXNDaGFuZ2VcIiwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSBcImNvbm5lY3RlZFwiKSB7XHJcbiAgICAgICAgICAgIGNvbm5lY3RlZChyZXNwb25zZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxvY2sgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY29ubmVjdGVkKHJlc3BvbnNlKSB7XHJcbiAgICAgICRzY29wZS5jb25uZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICRzY29wZS5sb2dpbkluZm8gPSBcIkxvZ2dpbmcgaW4uLi5cIjtcclxuXHJcbiAgICAgICRodHRwLmdldCh1cmxfcHJlZml4ICsgJy9hcGkvbG9naW4vZmFjZWJvb2s/aWQ9JytyZXNwb25zZS5hdXRoUmVzcG9uc2UudXNlcklEKycmdG9rZW49JytyZXNwb25zZS5hdXRoUmVzcG9uc2UuYWNjZXNzVG9rZW4pLlxyXG4gICAgICAgIHN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgIC8vJGxvY2F0aW9uLnBhdGgoJy8nKTtcclxuICAgICAgICAgIGlmKHR5cGVvZiAkcm9vdFNjb3BlLm5leHRQYXRoID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcjJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmFzc2lnbigkcm9vdFNjb3BlLm5leHRQYXRoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICRyb290U2NvcGUudXBkYXRlLmFsbCgpO1xyXG4gICAgICAgIH0pLlxyXG4gICAgICAgIGVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkVSUk9SXCIsIGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gICRzY29wZS5zZW5kRW1haWwgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcclxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuICAgICRzY29wZS5sb2dpbkluZm8gPSBcIlNlbmRpbmcgZW1haWwuLi5cIjtcclxuICAgICRzY29wZS5zaG93SWRJbnB1dCA9IGZhbHNlO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcIlNlbmRpbmcgZW1haWwuLi5cIik7XHJcblxyXG4gICAgJGh0dHAuZ2V0KHVybF9wcmVmaXggKyAnL2FwaS9sb2dpbi8nICsgbWVtYmVySWQpLlxyXG4gICAgICBzdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgaWYoZGF0YS5lcnJvcikge1xyXG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgIHNldEluZm8oXCJUaGVyZSB3YXMgYW4gZXJyb3IuLi5cIik7XHJcbiAgICAgICAgICAkc2NvcGUuc2hvd0lkSW5wdXQgPSB0cnVlO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHNldEluZm8oXCJFbWFpbCBzZW50IVwiKTtcclxuICAgICAgICAkc2NvcGUuc2hvd0NvZGVJbnB1dCA9IHRydWU7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkVtYWlsIHNlbnQhXCIpXHJcbiAgICAgIH0pLlxyXG4gICAgICBlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgc2V0SW5mbyhcIlRoZXJlIHdhcyBhbiBlcnJvci4uLlwiKTtcclxuICAgICAgICAkc2NvcGUuc2hvd0lkSW5wdXQgPSB0cnVlO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJFUlJPUlwiLCBkYXRhKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICAkc2NvcGUuc3VibWl0Q29kZSA9IGZ1bmN0aW9uIChtZW1iZXJJZCwgbWVtYmVyQ29kZSkge1xyXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgJHNjb3BlLmxvZ2luSW5mbyA9IFwiVmVyaWZ5aW5nIGNvZGUuLi5cIjtcclxuICAgICRzY29wZS5zaG93Q29kZUlucHV0ID0gZmFsc2U7XHJcblxyXG4gICAgJGh0dHAuZ2V0KHVybF9wcmVmaXggKyAnL2FwaS9sb2dpbi8nICsgbWVtYmVySWQgKyAnLycgKyBtZW1iZXJDb2RlKS5cclxuICAgICAgc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgIGlmKGRhdGEuZXJyb3IpIHtcclxuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICBzZXRJbmZvKFwiVGhlcmUgd2FzIGFuIGVycm9yLi4uXCIpO1xyXG4gICAgICAgICAgJHNjb3BlLnNob3dJZElucHV0ID0gdHJ1ZTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAkc2NvcGUubG9naW5JbmZvID0gXCJTdWNjZXNzIVwiO1xyXG4gICAgICAgICR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcvJyk7XHJcbiAgICAgICAgLy8kbG9jYXRpb24ucGF0aCgnLycpO1xyXG4gICAgICB9KS5cclxuICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHNldEluZm8oXCJUaGVyZSB3YXMgYW4gZXJyb3IuLi5cIik7XHJcbiAgICAgICAgJHNjb3BlLnNob3dJZElucHV0ID0gdHJ1ZTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRJbmZvKG1lc3NhZ2UpIHtcclxuICAgICRzY29wZS5sb2dpbkluZm8gPSBtZXNzYWdlO1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpeyRzY29wZS5sb2dpbkluZm89XCJcIn0sIDIwMDApO1xyXG4gIH1cclxuXHJcbiAgaWYgKCRyb3V0ZVBhcmFtcy5pZCAmJiAkcm91dGVQYXJhbXMuY29kZSkge1xyXG4gICAgJHNjb3BlLnN1Ym1pdENvZGUoJHJvdXRlUGFyYW1zLmlkLCAkcm91dGVQYXJhbXMuY29kZSlcclxuICB9XHJcblxyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignQ2hhdENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCBuZ0F1ZGlvLCBTb2NrZXRGYWN0b3J5LCBNZXNzYWdlRmFjdG9yeSwgQ2hhdEZhY3RvcnksIE1lbWJlckZhY3RvcnkpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgICRzY29wZS5lcnJvciA9IHt9O1xyXG5cclxuICAgICRzY29wZS51cGRhdGluZyA9IGZhbHNlO1xyXG4gICAgJHNjb3BlLmxvYWRpbmcgID0gdHJ1ZTtcclxuICAgICRzY29wZS5hdXRoICAgICA9IGZhbHNlO1xyXG4gICAgJHNjb3BlLmNvbmVjdGVkID0gZmFsc2U7XHJcbiAgICAkc2NvcGUubWVzc2FnZXMgPSBbXTtcclxuICAgICRzY29wZS5vbmxpbmUgICA9IFtdO1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coXCJDb25uZWN0aW5nXCIpO1xyXG5cclxuICAgIFNvY2tldEZhY3RvcnkuY29ubmVjdCgnL2NoYXQnKTtcclxuXHJcbiAgICBTb2NrZXRGYWN0b3J5Lm9uKCdjb25uZWN0ZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRzY29wZS5jb25lY3RlZCA9IHRydWU7XHJcbiAgICAgIGlmKCEkc2NvcGUuYXV0aCl7XHJcbiAgICAgICAgU29ja2V0RmFjdG9yeS5lbWl0KCdhdXRoJywge2lkOiAoJHJvdXRlUGFyYW1zLmlkIHx8ICdnZXJhbCcpLCB1c2VyOiAkc2NvcGUubWUuaWR9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCdBdXRoIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgICRzY29wZS5hdXRoID0gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgU29ja2V0RmFjdG9yeS5vbigndmFsaWRhdGlvbicsIGZ1bmN0aW9uIChyZXNwb25zZSl7XHJcbiAgICAgIGlmKCFyZXNwb25zZS5lcnIpe1xyXG4gICAgICAgICRzY29wZS5jaGF0ICAgICA9IHJlc3BvbnNlLmNoYXREYXRhO1xyXG4gICAgICAgICRzY29wZS5tZXNzYWdlcyA9IHJlc3BvbnNlLm1lc3NhZ2VzO1xyXG4gICAgICAgICRzY29wZS5yb29tICAgICA9IHJlc3BvbnNlLnJvb207XHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUuY2hhdC5tZW1iZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICRzY29wZS5vbmxpbmUucHVzaCh7bWVtYmVyOiAkc2NvcGUuY2hhdC5tZW1iZXJzW2ldLCBvbjogZmFsc2V9KTtcclxuICAgICAgICAgIGlmKHJlc3BvbnNlLm9ubGluZS5pbmRleE9mKCRzY29wZS5jaGF0Lm1lbWJlcnNbaV0pICE9IC0xKXtcclxuICAgICAgICAgICAgJHNjb3BlLm9ubGluZVtpXS5vbiA9IHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAkc2NvcGUub25saW5lW2ldLm5hbWUgPSAkc2NvcGUuZ2V0TWVtYmVyKCRzY29wZS5vbmxpbmVbaV0ubWVtYmVyKS5uYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkc2NvcGUuaGlzdG9yeSA9IGhpc3Rvcnk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlLm1lc3NhZ2UpO1xyXG4gICAgICB9XHJcbiAgICAgICRzY29wZS5sb2FkaW5nICA9IGZhbHNlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgU29ja2V0RmFjdG9yeS5vbigndXNlci1jb25uZWN0ZWQnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZyhcIlVzZXIgY29ubmVjdGVkOiBcIiArIHJlc3BvbnNlLmlkKTtcclxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5vbmxpbmUubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIGlmKCRzY29wZS5vbmxpbmVbaV0ubWVtYmVyID09PSByZXNwb25zZS5pZCl7XHJcbiAgICAgICAgICAkc2NvcGUub25saW5lW2ldLm9uID0gdHJ1ZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgU29ja2V0RmFjdG9yeS5vbigndXNlci1kaXNjb25uZWN0ZWQnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZyhcIlVzZXIgY29ubmVjdGVkOiBcIiArIHJlc3BvbnNlLmlkKTtcclxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5vbmxpbmUubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIGlmKCRzY29wZS5vbmxpbmVbaV0ubWVtYmVyID09PSByZXNwb25zZS5pZCl7XHJcbiAgICAgICAgICAkc2NvcGUub25saW5lW2ldLm9uID0gZmFsc2U7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIFNvY2tldEZhY3Rvcnkub24oJ21lc3NhZ2UnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xyXG4gICAgICAkc2NvcGUubWVzc2FnZXMucHVzaChtZXNzYWdlKTtcclxuICAgICAgaWYobWVzc2FnZS5tZW1iZXIgIT0gJHNjb3BlLm1lLmlkKSB7XHJcbiAgICAgICAgbmdBdWRpby5wbGF5KFwiYXVkaW8vbWVzc2FnZS5tcDNcIik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIFNvY2tldEZhY3Rvcnkub24oJ2hpc3Rvcnktc2VuZCcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAkc2NvcGUubWVzc2FnZXMgPSAkc2NvcGUubWVzc2FnZXMuY29uY2F0KHJlc3BvbnNlLm1lc3NhZ2VzKTtcclxuICAgICAgJHNjb3BlLnVwZGF0aW5nID0gZmFsc2U7XHJcbiAgICAgICRzY29wZS5pbmZpbml0ZVNjcm9sbERpc2FibGVkID0gZmFsc2U7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkc2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgIFNvY2tldEZhY3RvcnkuZGlzY29ubmVjdCgpO1xyXG4gICAgICBkZWxldGUgU29ja2V0RmFjdG9yeS5zb2NrZXQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICgkc2NvcGUudGV4dCA9PSBcIlwiKXtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBtZXNzYWdlRGF0YSA9IHtcclxuICAgICAgICB0ZXh0ICAgOiAkc2NvcGUudGV4dCxcclxuICAgICAgICBjaGF0SWQgOiAoJHJvdXRlUGFyYW1zLmlkIHx8ICdnZXJhbCcpLFxyXG4gICAgICAgIG1lbWJlciA6ICRzY29wZS5tZS5pZCxcclxuICAgICAgfVxyXG5cclxuICAgICAgU29ja2V0RmFjdG9yeS5lbWl0KCdzZW5kJywge3Jvb206ICRzY29wZS5yb29tLCBtZXNzYWdlOiBtZXNzYWdlRGF0YSB9LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdNZXNzYWdlIHNlbnQnKTtcclxuICAgICAgICAkc2NvcGUudGV4dCA9IFwiXCI7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBoaXN0b3J5ICgpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZygnU3RhcnQgaGlzdG9yeSByZXF1ZXN0Jyk7XHJcbiAgICAgIGlmKCEkc2NvcGUudXBkYXRpbmcpe1xyXG4gICAgICAgICRzY29wZS5pbmZpbml0ZVNjcm9sbERpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAkc2NvcGUudXBkYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgIFNvY2tldEZhY3RvcnkuZW1pdCgnaGlzdG9yeS1nZXQnLCB7cm9vbTogJHNjb3BlLnJvb20sIGRhdGU6ICRzY29wZS5tZXNzYWdlc1skc2NvcGUubWVzc2FnZXMubGVuZ3RoLTFdLmRhdGUgfSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCdTZW50IGhpc3RvcnkgcmVxdWVzdCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuIiwicmVxdWlyZSgnLi9saXN0Jyk7XHJcbnJlcXVpcmUoJy4vY2hhdCcpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoJ0NoYXRzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIENoYXRGYWN0b3J5KSB7XHJcblxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgQ2hhdEZhY3RvcnkuQ2hhdC5nZXRBbGwoZnVuY3Rpb24oY2hhdHMpIHtcclxuICAgICAgJHNjb3BlLmNoYXRzID0gY2hhdHM7XHJcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59KTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiQ29tbWVudEFyZWFDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsIE1lbWJlckZhY3RvcnksIENvbW1lbnRGYWN0b3J5KSB7XHJcblxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgJHNjb3BlLmNvbW1lbnREYXRhID0ge1xyXG4gICAgICBtYXJrZG93bjogXCJcIlxyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkQ29tbWVudHMoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkQ29tbWVudHMoKSB7XHJcbiAgICAgIGlmICgkc2NvcGUudGhyZWFkLnNwbGl0KFwiLVwiKVsxXSA9PT0gXCJcIikge1xyXG4gICAgICAgIHNldFRpbWVvdXQobG9hZENvbW1lbnRzLCA1MDApO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHRocmVhZElkO1xyXG4gICAgICB2YXIgdGhyZWFkVHlwZTtcclxuXHJcbiAgICAgIGlmKCRzY29wZS5zdWJ0aHJlYWQgJiYgJHNjb3BlLnN1YnRocmVhZCAhPSAnJykge1xyXG4gICAgICAgIHRocmVhZFR5cGUgPSAkc2NvcGUuc3VidGhyZWFkLnNwbGl0KCctJylbMF07XHJcbiAgICAgICAgdGhyZWFkSWQgPSAkc2NvcGUuc3VidGhyZWFkLnN1YnN0cmluZygkc2NvcGUuc3VidGhyZWFkLmluZGV4T2YoXCItXCIpICsgMSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyZWFkVHlwZSA9ICRzY29wZS50aHJlYWQuc3BsaXQoJy0nKVswXTtcclxuICAgICAgICB0aHJlYWRJZCA9ICRzY29wZS50aHJlYWQuc3Vic3RyaW5nKCRzY29wZS50aHJlYWQuaW5kZXhPZihcIi1cIikgKyAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpdGNoKHRocmVhZFR5cGUpIHtcclxuICAgICAgICBjYXNlIFwiY29tcGFueVwiOiBcclxuICAgICAgICAgIENvbW1lbnRGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKHtpZDogdGhyZWFkSWR9LCBnb3RDb21tZW50cyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwic3BlYWtlclwiOiBcclxuICAgICAgICAgIENvbW1lbnRGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKHtpZDogdGhyZWFkSWR9LCBnb3RDb21tZW50cyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwidG9waWNcIjogXHJcbiAgICAgICAgICBDb21tZW50RmFjdG9yeS5Ub3BpYy5nZXRBbGwoe2lkOiB0aHJlYWRJZH0sIGdvdENvbW1lbnRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJjb21tdW5pY2F0aW9uXCI6IFxyXG4gICAgICAgICAgQ29tbWVudEZhY3RvcnkuQ29tbXVuaWNhdGlvbi5nZXRBbGwoe2lkOiB0aHJlYWRJZH0sIGdvdENvbW1lbnRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBnb3RDb21tZW50cyhjb21tZW50cykge1xyXG4gICAgICAgICRzY29wZS5jb21tZW50cyA9IGNvbW1lbnRzO1xyXG5cclxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnBvc3RDb21tZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duID09PSBcIlwiKXtcclxuICAgICAgICAkc2NvcGUuZW1wdHlDb21tZW50ID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBkYXRlID0gRGF0ZS5ub3coKTtcclxuICAgICAgQ29tbWVudEZhY3RvcnkuQ29tbWVudC5jcmVhdGUoe1xyXG4gICAgICAgIHRocmVhZDogJHNjb3BlLnRocmVhZCxcclxuICAgICAgICBzdWJ0aHJlYWQ6ICRzY29wZS5zdWJ0aHJlYWQsXHJcbiAgICAgICAgbWVtYmVyOiAkc2NvcGUubWUuaWQsXHJcbiAgICAgICAgbWFya2Rvd246ICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93bixcclxuICAgICAgICBodG1sOiAkc2NvcGUuY29udmVydE1hcmtkb3duVG9IdG1sKCRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biksXHJcbiAgICAgICAgcG9zdGVkOiBkYXRlLFxyXG4gICAgICAgIHVwZGF0ZWQ6IGRhdGVcclxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duID0gXCJcIjtcclxuICAgICAgICAkc2NvcGUuY29tbWVudEZvcm0uJHNldFByaXN0aW5lKCk7XHJcbiAgICAgICAgbG9hZENvbW1lbnRzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuc2F2ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xyXG4gICAgICBpZiAoY29tbWVudC5idWZmZXIgPT09IFwiXCIpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbW1lbnQubWFya2Rvd24gPSBjb21tZW50LmJ1ZmZlcjtcclxuICAgICAgY29tbWVudC5odG1sID0gJHNjb3BlLmNvbnZlcnRNYXJrZG93blRvSHRtbChjb21tZW50Lm1hcmtkb3duKTtcclxuICAgICAgY29tbWVudC51cGRhdGVkID0gRGF0ZS5ub3coKTtcclxuXHJcbiAgICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQudXBkYXRlKHtpZDogY29tbWVudC5faWR9LCBjb21tZW50LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICBjb21tZW50LmJ1ZmZlciA9IFwiXCI7XHJcbiAgICAgICAgY29tbWVudC5lZGl0aW5nID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5xdW90ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xyXG4gICAgICAkc2NvcGUuY29tbWVudERhdGEubWFya2Rvd24gPSBcIj4gKipcIiArICRzY29wZS5nZXRNZW1iZXIoY29tbWVudC5tZW1iZXIpLm5hbWUgKyBcIiBzYWlkOioqXFxuPiBcIiArIGNvbW1lbnQubWFya2Rvd24uc3BsaXQoXCJcXG5cIikuam9pbihcIlxcbj4gXCIpICsgXCJcXG5cXG5cIjtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmRlbGV0ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xyXG4gICAgICBpZiAoY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBjb21tZW50P1wiKSkge1xyXG4gICAgICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQuZGVsZXRlKHtpZDogY29tbWVudC5faWR9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBsb2FkQ29tbWVudHMoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XHJcbiAgICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xyXG4gICAgICB9KVswXTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNvbnZlcnRUZXh0VG9IdG1sID0gZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcclxuICAgICAgdmFyIG1haWxFeHAgPSAvW1xcd1xcLlxcLV0rXFxAKFtcXHdcXC1dK1xcLikrW1xcd117Miw0fSg/IVtePF0qPikvaWc7XHJcblxyXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIikucmVwbGFjZShtYWlsRXhwLFwiPGEgaHJlZj0nIy9jb21wYW55L1wiKyRyb3V0ZVBhcmFtcy5pZCtcIi9jb25maXJtP2VtYWlsPSQmJz4kJjwvYT5cIik7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jb252ZXJ0TmV3TGluZXNUb0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicrdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKSsnPC9kaXY+JztcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNvbnZlcnRNYXJrZG93blRvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcclxuICAgICAgcmV0dXJuICc8ZGl2IGRhdGEtbWFya2Rvd24+JyArIHRleHQgKyAnPC9kaXY+JztcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNoZWNrUGVybWlzc2lvbiA9IGZ1bmN0aW9uIChjb21tZW50KSB7XHJcbiAgICAgIGlmKCEkc2NvcGUubWUucm9sZXMpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblxyXG4gICAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZihyb2xlcy5sZW5ndGggPT0gMCAmJiBjb21tZW50Lm1lbWJlciAhPSAkc2NvcGUubWUuaWQpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcclxuXHJcbiAgICAgIHZhciBzdWZmaXggPSAnYWdvJztcclxuICAgICAgaWYoc2Vjb25kcyA8IDApe1xyXG4gICAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcclxuICAgICAgICBzdWZmaXggPSAndG8gZ28nO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XHJcblxyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uICh0aW1lKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lKS50b1VUQ1N0cmluZygpO1xyXG4gICAgfTtcclxuICB9XHJcbn0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJGaXJzdENvbW1lbnRDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsIE1lbWJlckZhY3RvcnksIENvbW1lbnRGYWN0b3J5KSB7XHJcblxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgJHNjb3BlLmNvbW1lbnREYXRhID0ge1xyXG4gICAgICBtYXJrZG93bjogXCJcIlxyXG4gICAgfTtcclxuXHJcbiAgICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXQoe2lkOiBcIm1lXCJ9LCBmdW5jdGlvbiAobWUpIHtcclxuICAgICAgJHNjb3BlLm1lID0gbWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXRBbGwoZnVuY3Rpb24gKG1lbWJlcnMpIHtcclxuICAgICAgJHNjb3BlLm1lbWJlcnMgPSBtZW1iZXJzO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbG9hZENvbW1lbnRzKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZENvbW1lbnRzKCkge1xyXG4gICAgICBpZiAoJHNjb3BlLnRocmVhZC5zcGxpdChcIi1cIilbMV0gPT09IFwiXCIpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KGxvYWRDb21tZW50cywgNTAwKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBwYWdlSWQgPSAkc2NvcGUudGhyZWFkLnN1YnN0cmluZygkc2NvcGUudGhyZWFkLmluZGV4T2YoXCItXCIpICsgMSk7XHJcblxyXG4gICAgICBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiY29tcGFueS1cIikgIT0gLTEpIHtcclxuICAgICAgICBDb21tZW50RmFjdG9yeS5Db21wYW55LmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJzcGVha2VyLVwiKSAhPSAtMSkge1xyXG4gICAgICAgIENvbW1lbnRGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKHtpZDogcGFnZUlkfSwgZ290Q29tbWVudHMpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKCRzY29wZS50aHJlYWQuaW5kZXhPZihcInRvcGljLVwiKSAhPSAtMSkge1xyXG4gICAgICAgIENvbW1lbnRGYWN0b3J5LlRvcGljLmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ290Q29tbWVudHMoY29tbWVudHMpIHtcclxuICAgICAgICAkc2NvcGUuY29tbWVudHMgPSBbXTtcclxuICAgICAgICB2YXIgZmlyc3RDb21tZW50ID0gY29tbWVudHMuc29ydChmdW5jdGlvbihhLGIpe1xyXG4gICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGEucG9zdGVkKSAtIG5ldyBEYXRlKGIucG9zdGVkKTtcclxuICAgICAgICB9KVswXTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5wb3N0Q29tbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biA9PT0gXCJcIil7XHJcbiAgICAgICAgJHNjb3BlLmVtcHR5Q29tbWVudCA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZGF0ZSA9IERhdGUubm93KCk7XHJcbiAgICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQuY3JlYXRlKHtcclxuICAgICAgICB0aHJlYWQ6ICRzY29wZS50aHJlYWQsXHJcbiAgICAgICAgbWVtYmVyOiAkc2NvcGUubWUuaWQsXHJcbiAgICAgICAgbWFya2Rvd246ICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93bixcclxuICAgICAgICBodG1sOiAkc2NvcGUuY29udmVydE1hcmtkb3duVG9IdG1sKCRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biksXHJcbiAgICAgICAgcG9zdGVkOiBkYXRlLFxyXG4gICAgICAgIHVwZGF0ZWQ6IGRhdGVcclxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duID0gXCJcIjtcclxuICAgICAgICBsb2FkQ29tbWVudHMoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnNhdmVDb21tZW50ID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcclxuICAgICAgaWYgKGNvbW1lbnQuYnVmZmVyID09PSBcIlwiKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb21tZW50Lm1hcmtkb3duID0gY29tbWVudC5idWZmZXI7XHJcbiAgICAgIGNvbW1lbnQuaHRtbCA9ICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwoY29tbWVudC5tYXJrZG93bik7XHJcbiAgICAgIGNvbW1lbnQudXBkYXRlZCA9IERhdGUubm93KCk7XHJcblxyXG4gICAgICBDb21tZW50RmFjdG9yeS5Db21tZW50LnVwZGF0ZSh7aWQ6IGNvbW1lbnQuX2lkfSwgY29tbWVudCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgY29tbWVudC5lZGl0aW5nID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5xdW90ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xyXG4gICAgICAkc2NvcGUuY29tbWVudERhdGEubWFya2Rvd24gPSBcIj4gKipcIiArICRzY29wZS5nZXRNZW1iZXIoY29tbWVudC5tZW1iZXIpLm5hbWUgKyBcIiBzYWlkOioqXFxuPiBcIiArIGNvbW1lbnQubWFya2Rvd24uc3BsaXQoXCJcXG5cIikuam9pbihcIlxcbj4gXCIpICsgXCJcXG5cXG5cIjtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmRlbGV0ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xyXG4gICAgICBpZiAoY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBjb21tZW50P1wiKSkge1xyXG4gICAgICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQuZGVsZXRlKHtpZDogY29tbWVudC5faWR9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBsb2FkQ29tbWVudHMoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XHJcbiAgICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xyXG4gICAgICB9KVswXTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNvbnZlcnRUZXh0VG9IdG1sID0gZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcclxuICAgICAgdmFyIG1haWxFeHAgPSAvW1xcd1xcLlxcLV0rXFxAKFtcXHdcXC1dK1xcLikrW1xcd117Miw0fSg/IVtePF0qPikvaWc7XHJcblxyXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIikucmVwbGFjZShtYWlsRXhwLFwiPGEgaHJlZj0nIy9jb21wYW55L1wiKyRyb3V0ZVBhcmFtcy5pZCtcIi9jb25maXJtP2VtYWlsPSQmJz4kJjwvYT5cIik7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jb252ZXJ0TmV3TGluZXNUb0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicrdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKSsnPC9kaXY+JztcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNvbnZlcnRNYXJrZG93blRvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcclxuICAgICAgcmV0dXJuICc8ZGl2IGRhdGEtbWFya2Rvd24+JyArIHRleHQgKyAnPC9kaXY+JztcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNoZWNrUGVybWlzc2lvbiA9IGZ1bmN0aW9uIChjb21tZW50KSB7XHJcbiAgICAgIGlmKCEkc2NvcGUubWUucm9sZXMpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblxyXG4gICAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZihyb2xlcy5sZW5ndGggPT0gMCAmJiBjb21tZW50Lm1lbWJlciAhPSAkc2NvcGUubWUuaWQpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcclxuXHJcbiAgICAgIHZhciBzdWZmaXggPSAnYWdvJztcclxuICAgICAgaWYoc2Vjb25kcyA8IDApe1xyXG4gICAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcclxuICAgICAgICBzdWZmaXggPSAndG8gZ28nO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XHJcblxyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uICh0aW1lKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lKS50b1VUQ1N0cmluZygpO1xyXG4gICAgfTtcclxuICB9XHJcbn0pO1xyXG4iLCJyZXF1aXJlKCcuL2FyZWEuanMnKTtcclxucmVxdWlyZSgnLi9maXJzdC5qcycpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJDb21tdW5pY2F0aW9uQXJlYUNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgQ29tbXVuaWNhdGlvbkZhY3RvcnkpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEgPSB7XHJcbiAgICAgIG1hcmtkb3duOiBcIlwiXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5tZSA9IEpTT04ucGFyc2UoJHNjb3BlLm1lSnNvbik7XHJcbiAgICAkc2NvcGUubWVtYmVycyA9IEpTT04ucGFyc2UoJHNjb3BlLm1lbWJlcnNKc29uKTtcclxuICAgICRzY29wZS5yb2xlcyA9IEpTT04ucGFyc2UoJHNjb3BlLnJvbGVzSnNvbik7XHJcblxyXG4gICAgbG9hZENvbW11bmljYXRpb25zKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZENvbW11bmljYXRpb25zKCkge1xyXG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICBpZiAoJHNjb3BlLnRocmVhZC5zcGxpdChcIi1cIilbMV0gPT09IFwiXCIpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KGxvYWRDb21tdW5pY2F0aW9ucywgNTAwKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBwYWdlSWQgPSAkc2NvcGUudGhyZWFkLnN1YnN0cmluZygkc2NvcGUudGhyZWFkLmluZGV4T2YoXCItXCIpICsgMSk7XHJcblxyXG4gICAgICBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiY29tcGFueS1cIikgIT0gLTEpIHtcclxuICAgICAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21wYW55LmdldEFsbCgge2lkOiBwYWdlSWR9LCBnb3RDb21tdW5pY2F0aW9ucyk7XHJcbiAgICAgICAgJHNjb3BlLmtpbmRzPVsnRW1haWwgVG8nLCAnRW1haWwgRnJvbScsICdNZWV0aW5nJywgJ1Bob25lIENhbGwnXTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJzcGVha2VyLVwiKSAhPSAtMSkge1xyXG4gICAgICAgIENvbW11bmljYXRpb25GYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKCB7aWQ6IHBhZ2VJZH0sIGdvdENvbW11bmljYXRpb25zKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ290Q29tbXVuaWNhdGlvbnMoY29tbXVuaWNhdGlvbnMpIHtcclxuICAgICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbnMgPSBjb21tdW5pY2F0aW9ucztcclxuXHJcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKCRzY29wZS50aHJlYWQuaW5kZXhPZihcInNwZWFrZXItXCIpICE9IC0xKSB7XHJcbiAgICAgICAgICBpZihjb21tdW5pY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgICAgICByZXR1cm4gby5raW5kLmluZGV4T2YoJ1BhcmFncmFwaCcpICE9IC0xO1xyXG4gICAgICAgICAgfSkubGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgJHNjb3BlLmtpbmRzPVsnRW1haWwgVG8nLCAnRW1haWwgRnJvbScsICdNZWV0aW5nJywgJ1Bob25lIENhbGwnXTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRzY29wZS5raW5kcz1bJ0luaXRhbCBFbWFpbCBQYXJhZ3JhcGgnLCdFbWFpbCBUbycsICdFbWFpbCBGcm9tJywgJ01lZXRpbmcnLCAnUGhvbmUgQ2FsbCddO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5wb3N0Q29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCEkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEua2luZCB8fCAkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEua2luZD09IFwiXCIpe1xyXG4gICAgICAgICRzY29wZS5lbXB0eUNvbW11bmljYXRpb24gPSB0cnVlO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpZiAoISRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0IHx8ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0PT0gXCJcIil7XHJcbiAgICAgICAgJHNjb3BlLmVtcHR5Q29tbXVuaWNhdGlvbiA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZGF0ZSA9IERhdGUubm93KCk7XHJcblxyXG4gICAgICAvL2NvbnNvbGUubG9nKCRzY29wZS5ldmVudCk7XHJcblxyXG4gICAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLmNyZWF0ZSh7XHJcbiAgICAgICAgdGhyZWFkOiAkc2NvcGUudGhyZWFkLFxyXG4gICAgICAgIG1lbWJlcjogJHNjb3BlLm1lLmlkLFxyXG4gICAgICAgIGtpbmQ6ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS5raW5kLFxyXG4gICAgICAgIHRleHQ6ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0LFxyXG4gICAgICAgIGV2ZW50OiAkc2NvcGUuZXZlbnQuaWQsXHJcbiAgICAgICAgcG9zdGVkOiBkYXRlLFxyXG4gICAgICAgIHVwZGF0ZWQ6IGRhdGVcclxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgJHNjb3BlLmNvbW11bmljYXRpb25EYXRhLnRleHQgPSBcIlwiO1xyXG4gICAgICAgICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS5raW5kID0gXCJcIjtcclxuICAgICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbkZvcm0uJHNldFByaXN0aW5lKCk7XHJcbiAgICAgICAgbG9hZENvbW11bmljYXRpb25zKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5zYXZlQ29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XHJcbiAgICAgIGlmIChjb21tdW5pY2F0aW9uLmJ1ZmZlciA9PT0gXCJcIikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29tbXVuaWNhdGlvbi50ZXh0ID0gY29tbXVuaWNhdGlvbi5idWZmZXI7XHJcbiAgICAgIGNvbW11bmljYXRpb24udXBkYXRlZCA9IERhdGUubm93KCk7XHJcblxyXG4gICAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLnVwZGF0ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgY29tbXVuaWNhdGlvbiwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgY29tbXVuaWNhdGlvbi5lZGl0aW5nID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5kZWxldGVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcclxuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5kZWxldGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsb2FkQ29tbXVuaWNhdGlvbnMoKTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5hcHByb3ZlQ29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XHJcbiAgICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uYXBwcm92ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgbnVsbCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgbG9hZENvbW11bmljYXRpb25zKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XHJcbiAgICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xyXG4gICAgICB9KVswXTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNoZWNrUGVybWlzc2lvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XHJcbiAgICAgIHZhciByb2xlcyA9ICRzY29wZS5tZS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmKHJvbGVzLmxlbmd0aCA9PSAwICYmIGNvbW11bmljYXRpb24ubWVtYmVyICE9ICRzY29wZS5tZS5pZCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xyXG5cclxuICAgICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xyXG4gICAgICBpZihzZWNvbmRzIDwgMCl7XHJcbiAgICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHNlY29uZHMpO1xyXG4gICAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcclxuXHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgZGF5cyBcIiArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jb252ZXJ0VVJMcyA9IGZ1bmN0aW9uKHRleHQpIHtcclxuICAgICAgdmFyIHVybEV4cCA9IC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWc7XHJcblxyXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNvbW11bmljYXRpb25FbWJlZENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgQ29tbXVuaWNhdGlvbkZhY3RvcnkpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgJHNjb3BlLnN1Y2Nlc3MgICAgID0gXCJcIjtcclxuICAgICRzY29wZS5lcnJvciAgICAgICA9IFwiXCI7XHJcblxyXG4gICAgJHNjb3BlLmNvbW11bmljYXRpb24uZWRpdGluZyA9IGZhbHNlO1xyXG4gICAgJHNjb3BlLmNvbW11bmljYXRpb24uZGVsZXRlZCA9IGZhbHNlO1xyXG5cclxuXHJcbiAgICAkc2NvcGUuc2F2ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xyXG4gICAgICBpZiAoY29tbXVuaWNhdGlvbi5idWZmZXIgPT09IFwiXCIpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbW11bmljYXRpb24udGV4dCA9IGNvbW11bmljYXRpb24uYnVmZmVyO1xyXG4gICAgICBjb21tdW5pY2F0aW9uLnVwZGF0ZWQgPSBEYXRlLm5vdygpO1xyXG5cclxuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi51cGRhdGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIGNvbW11bmljYXRpb24sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGNvbW11bmljYXRpb24uZWRpdGluZyA9IGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuZGVsZXRlQ29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XHJcbiAgICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uZGVsZXRlKHtpZDogY29tbXVuaWNhdGlvbi5faWR9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLmNvbW11bmljYXRpb24uZGVsZXRlZCA9IHRydWU7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuc2V0Q29tbXVuaWNhdGlvblN0YXR1cyA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uLCBzdGF0dXMpIHtcclxuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi51cGRhdGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIHtzdGF0dXM6IHN0YXR1c30sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICRzY29wZS5jb21tdW5pY2F0aW9uLnN0YXR1cyA9IHN0YXR1cztcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcclxuICAgICAgcmV0dXJuICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XHJcbiAgICAgIH0pWzBdO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcclxuICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgICAgcmV0dXJuIG8uaWQgPT0gJ2RldmVsb3BtZW50LXRlYW0nIHx8IG8uaWQgPT0gJ2Nvb3JkaW5hdGlvbic7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYocm9sZXMubGVuZ3RoID09IDAgJiYgY29tbXVuaWNhdGlvbi5tZW1iZXIgIT0gJHNjb3BlLm1lLmlkKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XHJcbiAgICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIGRhdGUpIC8gMTAwMCk7XHJcblxyXG4gICAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XHJcbiAgICAgIGlmKHNlY29uZHMgPCAwKXtcclxuICAgICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XHJcbiAgICAgICAgc3VmZml4ID0gJ3RvIGdvJztcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xyXG5cclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbW9udGhzIFwiICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtaW51dGVzIFwiICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAodGltZSkge1xyXG4gICAgICByZXR1cm4gbmV3IERhdGUodGltZSkudG9VVENTdHJpbmcoKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNvbnZlcnRVUkxzID0gZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcclxuXHJcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpLnJlcGxhY2UodXJsRXhwLFwiPGEgaHJlZj0nJDEnPiQxPC9hPlwiKTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG4iLCJyZXF1aXJlKCcuL2FyZWEuanMnKTtcclxucmVxdWlyZSgnLi9saXN0LmpzJyk7XHJcbnJlcXVpcmUoJy4vZW1iZWQuanMnKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXJcclxuICAuY29udHJvbGxlcignQ29tbXVuaWNhdGlvbnNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb3V0ZVBhcmFtcywgJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgQ29tbXVuaWNhdGlvbkZhY3RvcnkpIHtcclxuICAgICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG4gICAgICBcclxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5nZXRBbGwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICRzY29wZS5jb21tdW5pY2F0aW9ucyA9IHJlc3BvbnNlO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICRzY29wZS5zaG93T3BlbiA9IHRydWU7XHJcblxyXG4gICAgICAkc2NvcGUuc2hvd25Db21tdW5pY2F0aW9ucyA9IGZ1bmN0aW9uIChzaG93T3Blbikge1xyXG4gICAgICAgIHJldHVybiAkc2NvcGUuY29tbXVuaWNhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICAgIHJldHVybiAoc2hvd09wZW4gPyAhKG8uc3RhdHVzPT0nYXBwcm92ZWQnKSA6IG8uc3RhdHVzPT0nYXBwcm92ZWQnKSAmJiAkcm91dGVQYXJhbXMua2luZCA9PSBvLnRocmVhZC5zcGxpdCgnLScpWzBdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXJcclxuICAuY29udHJvbGxlcignQ29tcGFueUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJGxvY2F0aW9uLCAkcm91dGVQYXJhbXMsICRzY2UsIENvbXBhbnlGYWN0b3J5LCBNZW1iZXJGYWN0b3J5LCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XHJcblxyXG4gICAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XHJcblxyXG4gICAgICAkc2NvcGUudHJ1c3RTcmMgPSBmdW5jdGlvbihzcmMpIHtcclxuICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoc3JjKycjcGFnZS1ib2R5Jyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5jb252ZXJ0RW1haWxzID0gZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICAgIHZhciBtYWlsRXhwID0gL1tcXHdcXC5cXC1dK1xcQChbXFx3XFwtXStcXC4pK1tcXHddezIsNH0oPyFbXjxdKj4pL2lnO1xyXG4gICAgICAgIHZhciB0d2l0dGVyRXhwID0gLyhefFteQFxcd10pQChcXHd7MSwxNX0pXFxiL2c7XHJcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShtYWlsRXhwLFwiPGEgaHJlZj0nIy9jb21wYW55L1wiKyRyb3V0ZVBhcmFtcy5pZCtcIi9jb25maXJtP2VtYWlsPSQmJz4kJjwvYT5cIikucmVwbGFjZSh0d2l0dGVyRXhwLFwiJDE8YSBocmVmPSdodHRwOi8vdHdpdHRlci5jb20vJDInIHRhcmdldD0nX2JsYW5rJz4kMjwvYT5cIilcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjb21wYW55RGF0YSA9IHRoaXMuZm9ybURhdGE7XHJcblxyXG4gICAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkudXBkYXRlKHsgaWQ6Y29tcGFueURhdGEuaWQgfSwgY29tcGFueURhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2Uuc3VjY2VzcztcclxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ2NvbXBhbnkvJytjb21wYW55RGF0YS5pZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuZGVsZXRlQ29tcGFueSA9IGZ1bmN0aW9uKGNvbXBhbnkpIHtcclxuICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmRlbGV0ZSh7IGlkOmNvbXBhbnkuaWQgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ2NvbXBhbmllcy8nKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYocm9sZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zdGF0dXNlcyA9IFsnU3VnZ2VzdGlvbicsJ0NvbnRhY3RlZCcsJ0luIENvbnZlcnNhdGlvbnMnLCdJbiBOZWdvdGlhdGlvbnMnLCdDbG9zZWQgRGVhbCcsJ1JlamVjdGVkJywnR2l2ZSBVcCddO1xyXG4gICAgICAkc2NvcGUubG9nb1NpemVzID0gW251bGwsICdTJywnTScsJ0wnXTtcclxuICAgICAgJHNjb3BlLnN0YW5kRGF5cyA9IFtudWxsLCAxLDIsMyw0LDVdO1xyXG4gICAgICAkc2NvcGUucG9zdHNOdW1iZXJzID0gW251bGwsIDEsMiwzLDQsNV07XHJcblxyXG4gICAgICAkc2NvcGUuY29tcGFueSA9ICRzY29wZS5mb3JtRGF0YSA9ICRzY29wZS5nZXRDb21wYW55KCRyb3V0ZVBhcmFtcy5pZCk7XHJcblxyXG4gICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmdldCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSAkc2NvcGUuZm9ybURhdGEgPSByZXNwb25zZTtcclxuXHJcbiAgICAgICAgTm90aWZpY2F0aW9uRmFjdG9yeS5Db21wYW55LmdldEFsbCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKGdldERhdGEpIHtcclxuICAgICAgICAgICRzY29wZS5jb21wYW55Tm90aWZpY2F0aW9ucyA9IGdldERhdGE7XHJcblxyXG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyXHJcbiAgLmNvbnRyb2xsZXIoJ0NvbXBhbnlFbWFpbENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCAkbG9jYXRpb24sIEVtYWlsRmFjdG9yeSkge1xyXG4gICAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XHJcblxyXG4gICAgICAkc2NvcGUuZW1haWwgPSAkbG9jYXRpb24uc2VhcmNoKCkuZW1haWw7XHJcbiAgICAgICRzY29wZS5jb21wYW55SWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XHJcbiAgICAgICRzY29wZS5tZXNzYWdlID0gbnVsbDtcclxuXHJcbiAgICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcclxuICAgICAgICAkc2NvcGUubWVzc2FnZSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJzZW5kIGVtYWlsIHRvIFwiLCAkc2NvcGUuZW1haWwsIFwiIGZyb20gXCIsICRzY29wZS5jb21wYW55SWQpO1xyXG5cclxuICAgICAgICBFbWFpbEZhY3RvcnkuQ29tcGFueS5zZW5kKHsgaWQ6ICRzY29wZS5jb21wYW55SWQgfSwgeyBlbWFpbDogJHNjb3BlLmVtYWlsIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuIFxyXG50aGVUb29sQ29udHJvbGxlclxyXG4gIC5jb250cm9sbGVyKCdDcmVhdGVDb21wYW55Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgQ29tcGFueUZhY3RvcnkpIHtcclxuICAgICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG4gICAgICBcclxuICAgICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjb21wYW55RGF0YSA9IHRoaXMuZm9ybURhdGE7XHJcblxyXG4gICAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuY3JlYXRlKGNvbXBhbnlEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmdldEFsbChmdW5jdGlvbiAoY29tcGFuaWVzKSB7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IGNvbXBhbmllcztcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9jb21wYW55L1wiICsgcmVzcG9uc2UuaWQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnQ29udGFjdGVkJywnSW4gQ29udmVyc2F0aW9ucycsJ0luIE5lZ290aWF0aW9ucycsJ0Nsb3NlZCBEZWFsJywnUmVqZWN0ZWQnLCdHaXZlIFVwJ107XHJcbiAgICB9XHJcbiAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignQ29tcGFueUVtYmVkQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgIGlmKCRzY29wZS5jb21tZW50cykge1xyXG4gICAgICAkc2NvcGUuY29tcGFueS5jb21tZW50cyA9ICRzY29wZS5jb21tZW50cy5maWx0ZXIoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHJldHVybiBlLnRocmVhZCA9PSAnY29tcGFueS0nKyRzY29wZS5jb21wYW55LmlkO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZigkc2NvcGUuZXZlbnQpIHtcclxuICAgICAgJHNjb3BlLnBhcnRpY2lwYXRpb24gPSAkc2NvcGUuY29tcGFueS5wYXJ0aWNpcGF0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgIHJldHVybiBvLmV2ZW50ID09ICRzY29wZS5ldmVudC5pZDtcclxuICAgICAgfSlbMF07XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xyXG4gICAgICB2YXIgbWVtYmVyID0gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZihtZW1iZXIubGVuZ3RoPjApIHtcclxuICAgICAgICByZXR1cm4gbWVtYmVyWzBdO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBuYW1lOiAnTm8gb25lJyxcclxuICAgICAgICAgIGZhY2Vib29rOiAnMTAwMDAwNDU2MzM1OTcyJ1xyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmdldFVucmVhZE5vdGlmaWNhdGlvbnMgPSBmdW5jdGlvbiAodGhyZWFkKSB7XHJcbiAgICAgIHZhciBub3RpZmljYXRpb25zID0gJHNjb3BlLm5vdGlmaWNhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICByZXR1cm4gby50aHJlYWQgPT0gdGhyZWFkO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIG5vdGlmaWNhdGlvbnM7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jb21wYW55LnVucmVhZCA9ICRzY29wZS5nZXRVbnJlYWROb3RpZmljYXRpb25zKCdjb21wYW55LScgKyAkc2NvcGUuY29tcGFueS5pZCkubGVuZ3RoID4gMDtcclxuXHJcbiAgICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XHJcbiAgICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIGRhdGUpIC8gMTAwMCk7XHJcblxyXG4gICAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XHJcbiAgICAgIGlmKHNlY29uZHMgPCAwKXtcclxuICAgICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XHJcbiAgICAgICAgc3VmZml4ID0gJ3RvIGdvJztcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xyXG5cclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgJyB5ZWFycyAnICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArICcgbW9udGhzICcgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArICcgZGF5cyAnICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArICcgaG91cnMgJyArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgJyBtaW51dGVzICcgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyAnIHNlY29uZHMgJyArIHN1ZmZpeDtcclxuICAgIH07XHJcbiAgfVxyXG59KTtcclxuIiwicmVxdWlyZSgnLi9jb21wYW55LmpzJyk7XHJcbnJlcXVpcmUoJy4vbGlzdC5qcycpO1xyXG5yZXF1aXJlKCcuL2NyZWF0ZS5qcycpO1xyXG5yZXF1aXJlKCcuL2NvbmZpcm0uanMnKTtcclxucmVxdWlyZSgnLi9lbWJlZC5qcycpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyXHJcbiAgLmNvbnRyb2xsZXIoJ0NvbXBhbmllc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHNjZSwgQ29tcGFueUZhY3RvcnkpIHtcclxuXHJcbiAgICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuICAgICAgJHNjb3BlLnNhdmVTdGF0dXMgPSBmdW5jdGlvbihjb21wYW55KSB7XHJcbiAgICAgICAgdmFyIGNvbXBhbnlEYXRhID0gY29tcGFueTtcclxuXHJcbiAgICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS51cGRhdGUoeyBpZDpjb21wYW55LmlkIH0sIGNvbXBhbnlEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuZ2V0Q2xhc3NGcm9tUGF5bWVudFN0YXR1cyA9IGZ1bmN0aW9uKHBhcnRpY2lwYXRpb24pIHtcclxuICAgICAgICBpZighcGFydGljaXBhdGlvbikgeyByZXR1cm4gJ2dyZXknOyB9XHJcbiAgICAgICAgaWYoIXBhcnRpY2lwYXRpb24ucGF5bWVudCkgeyByZXR1cm4gJ2dyZXknOyB9XHJcbiAgICAgICAgaWYoIXBhcnRpY2lwYXRpb24ucGF5bWVudC5zdGF0dXMpIHsgcmV0dXJuICdncmV5JzsgfVxyXG4gICAgICAgIHZhciBzdGF0dXMgPSBwYXJ0aWNpcGF0aW9uLnBheW1lbnQuc3RhdHVzLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIGlmKHN0YXR1cy5pbmRleE9mKCdwYWdvJykgIT0gLTEgfHwgc3RhdHVzLmluZGV4T2YoJ2VtaXRpZG8nKSAhPSAtMSB8fCBzdGF0dXMuaW5kZXhPZigncmVjaWJvIGVudmlhZG8nKSAhPSAtMSkgeyByZXR1cm4gJ2xpbWUnOyB9XHJcbiAgICAgICAgZWxzZSBpZihzdGF0dXMuaW5kZXhPZignZW52aWFkbycpICE9IC0xKSB7IHJldHVybiAnb3JhbmdlJzsgfVxyXG4gICAgICAgIGVsc2UgeyByZXR1cm4gJ2dyZXknOyB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUucGF5bWVudFN0YXR1c2VzID0gWydFbWl0aWRvJywgJ1JlY2libyBFbnZpYWRvJywgJ1BhZ28nLCAnRW52aWFkbyddO1xyXG5cclxuICAgICAgJHNjb3BlLmxpbWl0ID0gMjA7XHJcblxyXG4gICAgICAkc2NvcGUuc3RhdHVzZXMgPSBbJ1N1Z2dlc3Rpb24nLCdDb250YWN0ZWQnLCdJbiBDb252ZXJzYXRpb25zJywnSW4gTmVnb3RpYXRpb25zJywnQ2xvc2VkIERlYWwnLCdSZWplY3RlZCcsJ0dpdmUgVXAnXTtcclxuXHJcbiAgICAgICRzY29wZS5jb21wYW55UHJlZGljYXRlID0gJ3VwZGF0ZWQnO1xyXG4gICAgICAkc2NvcGUucmV2ZXJzZSA9ICd0cnVlJztcclxuICAgICAgJHNjb3BlLnVucmVhZEZpcnN0ID0gdHJ1ZTtcclxuXHJcbiAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgJHNjb3BlLnByZWRpY2F0ZSA9ICd1cGRhdGVkJztcclxuICAgICAgICAkc2NvcGUucmV2ZXJzZSA9IHRydWU7XHJcbiAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IHJlc3BvbnNlO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICRzY29wZS5zY3JvbGwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoJHNjb3BlLmxpbWl0IDw9ICRzY29wZS5jb21wYW5pZXMubGVuZ3RoKVxyXG4gICAgICAgICAgJHNjb3BlLmxpbWl0ICs9IDg7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKG1lbWJlcikge1xyXG4gICAgICAgIHZhciByb2xlcyA9ICRzY29wZS5tZS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgICAgcmV0dXJuIG8uaWQgPT0gJ2RldmVsb3BtZW50LXRlYW0nIHx8IG8uaWQgPT0gJ2Nvb3JkaW5hdGlvbic7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKHJvbGVzLmxlbmd0aCA9PT0gMCAmJiBtZW1iZXIuaWQgIT0gJHNjb3BlLm1lLmlkKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5hZGRDb21wYW55ID0gZnVuY3Rpb24obWVtYmVyLCBuZXdDb21wYW55KSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhuZXdDb21wYW55KTtcclxuICAgICAgICB2YXIgY29tcGFueURhdGEgPSBuZXdDb21wYW55O1xyXG5cclxuICAgICAgICBpZihuZXdDb21wYW55LmlkKSB7XHJcbiAgICAgICAgICB2YXIgcGFydGljaXBhdGlvbiA9ICRzY29wZS5nZXRQYXJ0aWNpcGF0aW9uKGNvbXBhbnlEYXRhLCAkc2NvcGUuY3VycmVudEV2ZW50LmlkKTtcclxuICAgICAgICAgIGlmKHBhcnRpY2lwYXRpb24pIHtcclxuICAgICAgICAgICAgcGFydGljaXBhdGlvbi5tZW1iZXIgPSBtZW1iZXIuaWQ7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb21wYW55RGF0YS5wYXJ0aWNpcGF0aW9ucy5wdXNoKHtcclxuICAgICAgICAgICAgICBldmVudDogJHNjb3BlLmN1cnJlbnRFdmVudC5pZCxcclxuICAgICAgICAgICAgICBzdGF0dXM6ICdTZWxlY3RlZCcsXHJcbiAgICAgICAgICAgICAgbWVtYmVyOiBtZW1iZXIuaWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LnVwZGF0ZSh7IGlkOiBjb21wYW55RGF0YS5pZCB9LCB7IHBhcnRpY2lwYXRpb25zOiBjb21wYW55RGF0YS5wYXJ0aWNpcGF0aW9ucyB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2Uuc3VjY2VzcztcclxuXHJcbiAgICAgICAgICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS5nZXRBbGwoZnVuY3Rpb24gKGNvbXBhbmllcykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IGNvbXBhbmllcztcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbXBhbnlEYXRhLnBhcnRpY2lwYXRpb25zID0gW3tcclxuICAgICAgICAgICAgZXZlbnQ6ICRzY29wZS5jdXJyZW50RXZlbnQuaWQsXHJcbiAgICAgICAgICAgIHN0YXR1czogJ1NlbGVjdGVkJyxcclxuICAgICAgICAgICAgbWVtYmVyOiBtZW1iZXIuaWRcclxuICAgICAgICAgIH1dO1xyXG5cclxuICAgICAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuY3JlYXRlKGNvbXBhbnlEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcclxuXHJcbiAgICAgICAgICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS5nZXRBbGwoZnVuY3Rpb24gKGNvbXBhbmllcykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IGNvbXBhbmllcztcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuXHJcbn0pO1xyXG5cclxuIiwidGhlVG9vbENvbnRyb2xsZXIgPSBhbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5jb250cm9sbGVycycsIFtdKTtcclxuXHJcbnJlcXVpcmUoJy4vYXV0aCcpO1xyXG5yZXF1aXJlKCcuL21haW4nKTtcclxucmVxdWlyZSgnLi9jb21wYW55Jyk7XHJcbnJlcXVpcmUoJy4vc3BlYWtlcicpO1xyXG5yZXF1aXJlKCcuL21lbWJlcicpO1xyXG5yZXF1aXJlKCcuL2NvbW1lbnQnKTtcclxucmVxdWlyZSgnLi9tZWV0aW5nJyk7XHJcbnJlcXVpcmUoJy4vY2hhdCcpO1xyXG5yZXF1aXJlKCcuL3RvcGljJyk7XHJcbnJlcXVpcmUoJy4vY29tbXVuaWNhdGlvbicpO1xyXG5yZXF1aXJlKCcuL3RhZycpO1xyXG5yZXF1aXJlKCcuL3N1YnNjcmlwdGlvbicpO1xyXG5yZXF1aXJlKCcuL2FkbWluJyk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcImhvbWVcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgTm90aWZpY2F0aW9uRmFjdG9yeSkge1xyXG5cclxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xyXG5cclxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XHJcblxyXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgJHNjb3BlLm5vdGlmaWNhdGlvbnMgPSBbXTtcclxuICAgICRzY29wZS5saW1pdCA9IDEwO1xyXG5cclxuICAgIE5vdGlmaWNhdGlvbkZhY3RvcnkuTm90aWZpY2F0aW9uLmdldEFsbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgJHNjb3BlLm5vdGlmaWNhdGlvbnMgPSByZXNwb25zZTtcclxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS5zY3JvbGwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICgkc2NvcGUubGltaXQgPCAkc2NvcGUubm90aWZpY2F0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgICAkc2NvcGUubGltaXQgKz0gMTA7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxufSk7XHJcbiIsInJlcXVpcmUoJy4vbWFpbi5qcycpO1xyXG5yZXF1aXJlKCcuL2hvbWUuanMnKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCAkbG9jYXRpb24sICR3aW5kb3csICRyb290U2NvcGUsIE5vdGlmaWNhdGlvbkZhY3RvcnksIE1lbWJlckZhY3RvcnksIENvbXBhbnlGYWN0b3J5LCBTcGVha2VyRmFjdG9yeSwgVG9waWNGYWN0b3J5LCBSb2xlRmFjdG9yeSwgVGFnRmFjdG9yeSwgQ29tbWVudEZhY3RvcnksIENoYXRGYWN0b3J5LCBFdmVudEZhY3RvcnksIFNlc3Npb25GYWN0b3J5LCBJdGVtRmFjdG9yeSkge1xyXG5cclxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAkc2NvcGUucmVhZHkgPSBmYWxzZTtcclxuXHJcbiAgJHNjb3BlLmRpc3BsYXkgPSBmYWxzZTtcclxuXHJcbiAgJHNjb3BlLnNlYXJjaCA9IHt9O1xyXG4gICRzY29wZS5zZWFyY2hUb3BpY3MgPSB7fTtcclxuICAkc2NvcGUuc2VhcmNoQ29tcGFuaWVzID0ge307XHJcbiAgJHNjb3BlLnNlYXJjaFNwZWFrZXJzID0ge307XHJcbiAgJHNjb3BlLnNlYXJjaE1lbWJlcnMgPSB7fTtcclxuICAkc2NvcGUuYWN0aXZlRXZlbnQgPSB7fTtcclxuXHJcbiAgJHNjb3BlLm1lID0ge307XHJcbiAgJHNjb3BlLm1lbWJlcnMgPSBbXTtcclxuICAkc2NvcGUuY29tcGFuaWVzID0gW107XHJcbiAgJHNjb3BlLnNwZWFrZXJzID0gW107XHJcbiAgJHNjb3BlLnRvcGljcyA9IFtdO1xyXG4gICRzY29wZS50YXJnZXROb3RpZmljYXRpb25zID0gW107XHJcbiAgJHNjb3BlLnVucmVhZE5vdGlmaWNhdGlvbnMgPSBbXTtcclxuXHJcbiAgJHNjb3BlLnRhcmdldEluZm8gPSB7XHJcbiAgICBudW1iZXI6IDAsXHJcbiAgICB0ZXh0OiBcIiBMb2FkaW5nLi4uXCJcclxuICB9O1xyXG5cclxuICB2YXIgZmFjdG9yaWVzUmVhZHkgPSAwO1xyXG5cclxuICAkc2NvcGUuc2V0Q3VycmVudEV2ZW50ID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICRzY29wZS5jdXJyZW50RXZlbnQgPSB7fTtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXskc2NvcGUuY3VycmVudEV2ZW50ID0gZXZlbnQ7fSwxMCk7XHJcbiAgfVxyXG5cclxuICAkcm9vdFNjb3BlLnVwZGF0ZSA9IHtcclxuXHJcbiAgICBydW5uaW5nOiBmYWxzZSxcclxuXHJcbiAgICB0aW1lb3V0OiBmdW5jdGlvbihjYil7XHJcbiAgICAgIGlmKCEkc2NvcGUucmVhZHkpe1xyXG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICBpZighJHJvb3RTY29wZS51cGRhdGUucnVubmluZyl7XHJcbiAgICAgICAgICAkcm9vdFNjb3BlLnVwZGF0ZS5hbGwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChjYikgfSwgMTUwMCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICBjYigpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtZTogZnVuY3Rpb24oKXtcclxuICAgICAgTWVtYmVyRmFjdG9yeS5NZS5nZXQoZnVuY3Rpb24gKG1lKSB7XHJcbiAgICAgICAgJHNjb3BlLm1lID0gbWU7XHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIG1lbWJlcnM6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIE1lbWJlckZhY3RvcnkuTWVtYmVyLmdldEFsbChmdW5jdGlvbiAobWVtYmVycykge1xyXG4gICAgICAgICRzY29wZS5tZW1iZXJzID0gbWVtYmVycztcclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgY29tcGFuaWVzOiBmdW5jdGlvbigpe1xyXG4gICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmdldEFsbChmdW5jdGlvbiAoY29tcGFuaWVzKSB7XHJcbiAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IGNvbXBhbmllcztcclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgc3BlYWtlcnM6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKGZ1bmN0aW9uIChzcGVha2Vycykge1xyXG4gICAgICAgICRzY29wZS5zcGVha2VycyA9IHNwZWFrZXJzO1xyXG4gICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICB0b3BpY3M6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5nZXRBbGwoZnVuY3Rpb24gKHRvcGljcykge1xyXG4gICAgICAgICRzY29wZS50b3BpY3MgPSB0b3BpY3M7XHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJvbGVzOiBmdW5jdGlvbigpe1xyXG4gICAgICBSb2xlRmFjdG9yeS5Sb2xlLmdldEFsbChmdW5jdGlvbiAocm9sZXMpIHtcclxuICAgICAgICAkc2NvcGUucm9sZXMgPSByb2xlcztcclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgdGFnczogZnVuY3Rpb24oKXtcclxuICAgICAgVGFnRmFjdG9yeS5UYWcuZ2V0QWxsKGZ1bmN0aW9uICh0YWdzKSB7XHJcbiAgICAgICAgJHNjb3BlLnRvcGljVGFncyA9IHRhZ3M7XHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbW1lbnRzOiBmdW5jdGlvbigpe1xyXG4gICAgICBDb21tZW50RmFjdG9yeS5Db21tZW50LmdldEFsbChmdW5jdGlvbiAoY29tbWVudHMpIHtcclxuICAgICAgICAkc2NvcGUuY29tbWVudHMgPSBjb21tZW50cztcclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgY2hhdHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBDaGF0RmFjdG9yeS5DaGF0LmdldEFsbChmdW5jdGlvbihjaGF0cykge1xyXG4gICAgICAgICRzY29wZS5jaGF0cyA9IGNoYXRzO1xyXG4gICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBldmVudHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBFdmVudEZhY3RvcnkuRXZlbnQuZ2V0QWxsKGZ1bmN0aW9uKGV2ZW50cykge1xyXG4gICAgICAgICRzY29wZS5ldmVudHMgPSBldmVudHM7XHJcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRFdmVudCA9IGV2ZW50c1swXTtcclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgc2Vzc2lvbnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBTZXNzaW9uRmFjdG9yeS5TZXNzaW9uLmdldEFsbChmdW5jdGlvbihzZXNzaW9ucykge1xyXG4gICAgICAgICRzY29wZS5zZXNzaW9ucyA9IHNlc3Npb25zO1xyXG4gICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpdGVtczogZnVuY3Rpb24oKSB7XHJcbiAgICAgIEl0ZW1GYWN0b3J5Lkl0ZW0uZ2V0QWxsKGZ1bmN0aW9uKGl0ZW1zKSB7XHJcbiAgICAgICAgJHNjb3BlLml0ZW1zID0gaXRlbXM7XHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGFsbDogZnVuY3Rpb24oKXtcclxuICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcclxuICAgICAgZmFjdG9yaWVzUmVhZHkgPSAwO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKFwiVXBkYXRpbmchXCIpO1xyXG4gICAgICB0aGlzLm1lKCk7XHJcbiAgICAgIHRoaXMubWVtYmVycygpO1xyXG4gICAgICB0aGlzLmNvbXBhbmllcygpO1xyXG4gICAgICB0aGlzLnNwZWFrZXJzKCk7XHJcbiAgICAgIHRoaXMudG9waWNzKCk7XHJcbiAgICAgIHRoaXMucm9sZXMoKTtcclxuICAgICAgdGhpcy50YWdzKCk7XHJcbiAgICAgIHRoaXMuY29tbWVudHMoKTtcclxuICAgICAgdGhpcy5jaGF0cygpO1xyXG4gICAgICB0aGlzLmV2ZW50cygpO1xyXG4gICAgICB0aGlzLnNlc3Npb25zKCk7XHJcbiAgICAgIHRoaXMuaXRlbXMoKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICAkcm9vdFNjb3BlLnVwZGF0ZS5hbGwoKTtcclxuXHJcblxyXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICBmdW5jdGlvbiBjYWxsYmFjaygpIHtcclxuICAgIGlmICgrK2ZhY3Rvcmllc1JlYWR5ID09IDEyKSB7XHJcbiAgICAgICRyb290U2NvcGUudXBkYXRlLnJ1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgJHNjb3BlLnJlYWR5ID0gdHJ1ZTtcclxuXHJcbiAgICAgICRzY29wZS51cGRhdGUoKTtcclxuXHJcbiAgICAgIHNldEludGVydmFsKCRzY29wZS51cGRhdGUsIDEwMDAwKTtcclxuXHJcbiAgICAgICRyb290U2NvcGUuJG9uKFwiJGxvY2F0aW9uQ2hhbmdlU3RhcnRcIiwgZnVuY3Rpb24gKGV2ZW50LCBuZXh0LCBjdXJyZW50KSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgkc2NvcGUudXBkYXRlLCA1MDApO1xyXG4gICAgICAgICRzY29wZS5zZWFyY2gubmFtZSA9ICcnO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U0NPUEUgRlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgTm90aWZpY2F0aW9uRmFjdG9yeS5Ob3RpZmljYXRpb24uZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAkc2NvcGUudGFyZ2V0Tm90aWZpY2F0aW9ucyA9IFtdO1xyXG4gICAgICAkc2NvcGUudW5yZWFkTm90aWZpY2F0aW9ucyA9IFtdO1xyXG4gICAgICAkc2NvcGUudGFyZ2V0SW5mby5udW1iZXIgPSAwO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb25zZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChyZXNwb25zZVtpXS50YXJnZXRzLmluZGV4T2YoJHNjb3BlLm1lLmlkKSAhPSAtMSkge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbnNlW2ldLnVucmVhZC5pbmRleE9mKCRzY29wZS5tZS5pZCkgIT0gLTEpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnRhcmdldEluZm8ubnVtYmVyKys7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAkc2NvcGUudGFyZ2V0Tm90aWZpY2F0aW9ucy51bnNoaWZ0KHJlc3BvbnNlW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlW2ldLnVucmVhZC5pbmRleE9mKCRzY29wZS5tZS5pZCkgIT0gLTEpIHtcclxuICAgICAgICAgICRzY29wZS51bnJlYWROb3RpZmljYXRpb25zLnVuc2hpZnQocmVzcG9uc2VbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCRzY29wZS50YXJnZXRJbmZvLm51bWJlciA9PSAwKSB7XHJcbiAgICAgICAgJHNjb3BlLnRhcmdldEluZm8udGV4dCA9IFwiIE5vIE5vdGlmaWNhdGlvbnNcIjtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICAkc2NvcGUudGFyZ2V0SW5mby50ZXh0ID0gXCIgXCIgKyAkc2NvcGUudGFyZ2V0SW5mby5udW1iZXIgKyBcIiBOb3RpZmljYXRpb25cIiArICgkc2NvcGUudGFyZ2V0SW5mby5udW1iZXIgPiAxID8gXCJzXCIgOiBcIlwiKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcclxuXHJcbiAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XHJcbiAgICBpZihzZWNvbmRzIDwgMCl7XHJcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcclxuICAgICAgc3VmZml4ID0gJ3RvIGdvJztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XHJcblxyXG4gICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xyXG4gICAgfVxyXG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcclxuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XHJcbiAgICB9XHJcbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcclxuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xyXG4gICAgfVxyXG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcclxuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcclxuICAgIH1cclxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xyXG4gICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XHJcbiAgfTtcclxuXHJcbiAgJHNjb3BlLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAodGltZSkge1xyXG4gICAgcmV0dXJuIG5ldyBEYXRlKHRpbWUpLnRvVVRDU3RyaW5nKCk7XHJcbiAgfTtcclxuXHJcbiAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xyXG4gICAgdmFyIG1lbWJlciA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYobWVtYmVyLmxlbmd0aD4wKSB7XHJcbiAgICAgIHJldHVybiBtZW1iZXJbMF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG5hbWU6IFwiTm8gb25lXCIsXHJcbiAgICAgICAgZmFjZWJvb2s6IFwiMTAwMDAwNDU2MzM1OTcyXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gICRzY29wZS5nZXRTcGVha2VyID0gZnVuY3Rpb24gKHNwZWFrZXJJZCkge1xyXG4gICAgcmV0dXJuICRzY29wZS5zcGVha2Vycy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICByZXR1cm4gby5pZCA9PSBzcGVha2VySWQ7XHJcbiAgICB9KVswXTtcclxuICB9O1xyXG5cclxuICAkc2NvcGUuZ2V0Q29tcGFueSA9IGZ1bmN0aW9uIChjb21wYW55SWQpIHtcclxuICAgIHJldHVybiAkc2NvcGUuY29tcGFuaWVzLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgIHJldHVybiBvLmlkID09IGNvbXBhbnlJZDtcclxuICAgIH0pWzBdO1xyXG4gIH07XHJcblxyXG4gICRzY29wZS5nZXRUb3BpYyA9IGZ1bmN0aW9uICh0b3BpY0lkKSB7XHJcbiAgICByZXR1cm4gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICByZXR1cm4gby5faWQgPT0gdG9waWNJZDtcclxuICAgIH0pWzBdO1xyXG4gIH07XHJcblxyXG4gICRzY29wZS5nZXROb3RpZmljYXRpb25zID0gZnVuY3Rpb24gKHRocmVhZCkge1xyXG4gICAgcmV0dXJuICRzY29wZS5ub3RpZmljYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgIHJldHVybiBvLnRocmVhZCA9PSB0aHJlYWQ7XHJcbiAgICB9KVswXTtcclxuICB9O1xyXG5cclxuICAkc2NvcGUuZ2V0VW5yZWFkTm90aWZpY2F0aW9ucyA9IGZ1bmN0aW9uICh0aHJlYWQpIHtcclxuICAgIHJldHVybiAkc2NvcGUudW5yZWFkTm90aWZpY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICByZXR1cm4gby50aHJlYWQgPT0gdGhyZWFkO1xyXG4gICAgfSlbMF07XHJcbiAgfTtcclxuXHJcbiAgJHNjb3BlLmdldEV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50SWQpIHtcclxuICAgIHJldHVybiAkc2NvcGUuZXZlbnRzLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgIHJldHVybiBvLmlkID09IGV2ZW50SWQ7XHJcbiAgICB9KVswXTtcclxuICB9O1xyXG5cclxuICAkc2NvcGUuZ2V0U2Vzc2lvbiA9IGZ1bmN0aW9uIChzZXNzaW9uSWQpIHtcclxuICAgIHJldHVybiAkc2NvcGUuc2Vzc2lvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgcmV0dXJuIG8uX2lkID09IHNlc3Npb25JZDtcclxuICAgIH0pWzBdO1xyXG4gIH07XHJcblxyXG4gICRzY29wZS5nZXRJdGVtID0gZnVuY3Rpb24gKGl0ZW1JZCkge1xyXG4gICAgcmV0dXJuICRzY29wZS5pdGVtcy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICByZXR1cm4gby5pZCA9PSBpdGVtSWQ7XHJcbiAgICB9KVswXTtcclxuICB9O1xyXG5cclxuICAkc2NvcGUuZ2V0UGFydGljaXBhdGlvbiA9IGZ1bmN0aW9uICh0aGluZywgZXZlbnRJZCkge1xyXG4gICAgcmV0dXJuIHRoaW5nLnBhcnRpY2lwYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgIHJldHVybiBvLmV2ZW50ID09IGV2ZW50SWQ7XHJcbiAgICB9KVswXTtcclxuICB9O1xyXG5cclxuICAkc2NvcGUuc2hvdyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgJHNjb3BlLmRpc3BsYXkgPSAoJHNjb3BlLnNlYXJjaC5uYW1lID8gdHJ1ZSA6IGZhbHNlKTtcclxuICB9O1xyXG5cclxuICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgJHNjb3BlLmRpc3BsYXkgPSBmYWxzZTtcclxuICB9O1xyXG5cclxuICAkc2NvcGUuY29udmVydFVSTHMgPSBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcclxuXHJcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIik7XHJcbiAgfVxyXG5cclxuICAkc2NvcGUuY29udmVydE5ld0xpbmVzVG9IdG1sID0gZnVuY3Rpb24odGV4dCkge1xyXG4gICAgcmV0dXJuICc8ZGl2IGRhdGEtbWFya2Rvd24+Jyt0ZXh0LnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpKyc8L2Rpdj4nO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLmNvbnZlcnRNYXJrZG93blRvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcclxuICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicgKyB0ZXh0ICsgJzwvZGl2Pic7XHJcbiAgfVxyXG5cclxuICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJGh0dHAuZ2V0KHVybF9wcmVmaXggKyAnL2FwaS9sb2dvdXQnKS5cclxuICAgICAgc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcvJyk7XHJcbiAgICAgIH0pLlxyXG4gICAgICBlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJFUlJPUlwiLCBkYXRhKTtcclxuICAgICAgICAkd2luZG93LmxvY2F0aW9uLmFzc2lnbignLycpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG5cclxufSk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIk1lZXRpbmdFbWJlZENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgTWVldGluZ0ZhY3RvcnkpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgIE1lZXRpbmdGYWN0b3J5LmdldCh7aWQ6ICRzY29wZS5tZWV0aW5nSWR9LCBmdW5jdGlvbiAobWVldGluZykge1xyXG4gICAgICAkc2NvcGUubWVldGluZyA9IG1lZXRpbmc7XHJcblxyXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcclxuICAgICAgcmV0dXJuICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbiAobykge1xyXG4gICAgICAgIHJldHVybiBvLmlkID09PSBtZW1iZXJJZDtcclxuICAgICAgfSlbMF07XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbn0pO1xyXG4iLCJyZXF1aXJlKFwiLi9lbWJlZFwiKTtcclxucmVxdWlyZShcIi4vbGlzdFwiKTtcclxucmVxdWlyZShcIi4vbWVldGluZ1wiKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignTWVldGluZ3NDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGxvY2F0aW9uLCBNZWV0aW5nRmFjdG9yeSkge1xyXG5cclxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xyXG5cclxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XHJcblxyXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUlOSVRJQUxJWkFUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgaW5pdCgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCRzY29wZS5sb2FkaW5nKSB7XHJcbiAgICAgICAgICBpbml0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAxMDAwKTtcclxuXHJcbiAgICAgIE1lZXRpbmdGYWN0b3J5LmdldEFsbChmdW5jdGlvbiAobWVldGluZ3MpIHtcclxuICAgICAgICAkc2NvcGUubWVldGluZ3MgPSBtZWV0aW5ncztcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUubWVldGluZ3MubGVuZ3RoOyBpIDwgajsgaSsrKSB7XHJcbiAgICAgICAgICAkc2NvcGUubWVldGluZ3NbaV0uZmFjZWJvb2sgPSAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLm1lZXRpbmdzW2ldLmF1dGhvciA9PSBvLmlkO1xyXG4gICAgICAgICAgfSlbMF0uZmFjZWJvb2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgJHNjb3BlLnRpbWUgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgIHJldHVybiAkc2NvcGUudGltZVNpbmNlKG5ldyBEYXRlKGRhdGUpKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNyZWF0ZU1lZXRpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG5cclxuICAgICAgTWVldGluZ0ZhY3RvcnkuY3JlYXRlKHtcclxuICAgICAgICBhdXRob3I6ICRzY29wZS5tZS5pZCxcclxuICAgICAgICB0aXRsZTogZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoXCJwdC1QVFwiKSArIFwiIC0gTWVldGluZ1wiLFxyXG4gICAgICAgIGRhdGU6IGRhdGVcclxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xyXG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvbWVldGluZy9cIiArIHJlc3BvbnNlLmlkICsgXCIvZWRpdFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICB9XHJcbn0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJNZWV0aW5nQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgJHRpbWVvdXQsIE1lZXRpbmdGYWN0b3J5LCBUb3BpY0ZhY3RvcnksIFRhZ0ZhY3RvcnkpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICRzY29wZS5raW5kcyA9IFtcIkluZm9cIiwgXCJUbyBkb1wiLCBcIkRlY2lzaW9uXCIsIFwiSWRlYVwiXTtcclxuXHJcbiAgICBNZWV0aW5nRmFjdG9yeS5nZXQoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbiAobWVldGluZykge1xyXG4gICAgICAkc2NvcGUubWVldGluZyA9IG1lZXRpbmc7XHJcblxyXG4gICAgICBTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoID0gZnVuY3Rpb24gKHN1ZmZpeCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4T2Yoc3VmZml4LCB0aGlzLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpICE9PSAtMTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGlmICgkbG9jYXRpb24ucGF0aCgpLmVuZHNXaXRoKFwiL3RleHRcIikpIHtcclxuICAgICAgICB2YXIgdGV4dCA9IG1lZXRpbmcudGl0bGUgKyBcIlxcblxcblwiICsgKG1lZXRpbmcuZGVzY3JpcHRpb24gPyBtZWV0aW5nLmRlc2NyaXB0aW9uICsgXCJcXG5cXG5cIiA6IFwiXCIpO1xyXG5cclxuICAgICAgICBpZiAobWVldGluZy5hdHRlbmRhbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHRleHQgKz0gXCJBdHRlbmRhbnRzOlxcblwiO1xyXG5cclxuICAgICAgICAgIG1lZXRpbmcuYXR0ZW5kYW50cy5zb3J0KCk7XHJcblxyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZWV0aW5nLmF0dGVuZGFudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGV4dCArPSAkc2NvcGUuZ2V0TWVtYmVyKG1lZXRpbmcuYXR0ZW5kYW50c1tpXSkubmFtZSArIChpKzEgPCBtZWV0aW5nLmF0dGVuZGFudHMubGVuZ3RoID8gXCIsIFwiIDogXCJcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0ZXh0ICs9IFwiXFxuXFxuXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBUYWdGYWN0b3J5LlRhZy5nZXRBbGwoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgdmFyIHRhZ3MgPSBbXTtcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0YWdzLnB1c2gocmVzdWx0W2ldKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0YWdzLnNvcnQoZnVuY3Rpb24gKG8xLCBvMikge1xyXG4gICAgICAgICAgICByZXR1cm4gbzEubmFtZS5sb2NhbGVDb21wYXJlKG8yLm5hbWUpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB0b3BpY3MgPSBtZWV0aW5nLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gby50YWdzLmluZGV4T2YodGFnc1tpXS5pZCkgIT0gLTE7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRvcGljcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGV4dCArPSB0YWdzW2ldLm5hbWUgKyBcIjpcXG5cIjtcclxuXHJcbiAgICAgICAgICAgIHRvcGljcy5zb3J0KGZ1bmN0aW9uIChvMSwgbzIpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbzEucG9zdGVkLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZShvMi5wb3N0ZWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0b3BpY3MubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICB0ZXh0ICs9IFwiICAgIC0gXCIgKyB0b3BpY3Nbal0udGV4dC5yZXBsYWNlKC9cXG4vZywgXCJcXG4gICAgICBcIikgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0ZXh0ICs9IFwiXFxuXCI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgJHNjb3BlLm51bWJlck9mTGluZXMgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbiA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIGlmICh0ZXh0W2ldID09PSBcIlxcblwiKSB7XHJcbiAgICAgICAgICAgICAgICBuKys7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuICsgMjtcclxuICAgICAgICAgIH0oKSk7XHJcblxyXG4gICAgICAgICAgJHNjb3BlLnRleHQgPSB0ZXh0O1xyXG5cclxuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICRzY29wZS50b2dnbGVBdHRlbmRhbnQgPSBmdW5jdGlvbiAobWVtYmVyKSB7XHJcbiAgICAgIHZhciBpbmRleCA9ICRzY29wZS5tZWV0aW5nLmF0dGVuZGFudHMuaW5kZXhPZihtZW1iZXIpO1xyXG5cclxuICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICRzY29wZS5tZWV0aW5nLmF0dGVuZGFudHMucHVzaChtZW1iZXIpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgICRzY29wZS5tZWV0aW5nLmF0dGVuZGFudHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUudG9nZ2xlQXR0ZW5kYW50cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUubWVtYmVycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcclxuICAgICAgICAkc2NvcGUudG9nZ2xlQXR0ZW5kYW50KCRzY29wZS5tZW1iZXJzW2ldLmlkKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZ2V0QXR0ZW5kYW50cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuICRzY29wZS5tZWV0aW5nLmF0dGVuZGFudHMubWFwKGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgcmV0dXJuICRzY29wZS5nZXRNZW1iZXIobyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY3JlYXRlVG9waWMgPSBmdW5jdGlvbiAoa2luZCkge1xyXG4gICAgICB2YXIgdG9waWMgPSB7XHJcbiAgICAgICAgZWRpdGluZzogdHJ1ZSxcclxuICAgICAgICBhdXRob3I6ICRzY29wZS5tZS5pZCxcclxuICAgICAgICB0ZXh0OiBcIlwiLFxyXG4gICAgICAgIHRhcmdldHM6IFtdLFxyXG4gICAgICAgIGtpbmQ6IGtpbmQsXHJcbiAgICAgICAgY2xvc2VkOiBmYWxzZSxcclxuICAgICAgICByZXN1bHQ6IFwiXCIsXHJcbiAgICAgICAgcG9sbDoge1xyXG4gICAgICAgICAga2luZDogXCJ0ZXh0XCIsXHJcbiAgICAgICAgICBvcHRpb25zOiBbXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZHVlZGF0ZTogbnVsbCxcclxuICAgICAgICBtZWV0aW5nczogWyRzY29wZS5tZWV0aW5nLl9pZF0sXHJcbiAgICAgICAgcm9vdDogbnVsbCxcclxuICAgICAgICB0YWdzOiBbXSxcclxuICAgICAgICBwb3N0ZWQ6IG5ldyBEYXRlKClcclxuICAgICAgfTtcclxuXHJcbiAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5jcmVhdGUodG9waWMsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICB0b3BpYy5faWQgPSByZXNwb25zZS5pZDtcclxuICAgICAgICAgICRzY29wZS5tZWV0aW5nLnRvcGljcy5wdXNoKHRvcGljKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuYWRkVG9waWMgPSBmdW5jdGlvbiAodG9waWNJZCkge1xyXG4gICAgICAkc2NvcGUuZGlzcGxheSA9IGZhbHNlO1xyXG5cclxuICAgICAgdmFyIHRvcGljID0gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICByZXR1cm4gby5faWQgPT09IHRvcGljSWQ7XHJcbiAgICAgIH0pWzBdO1xyXG5cclxuICAgICAgJHNjb3BlLm1lZXRpbmcudG9waWNzLnB1c2godG9waWMpO1xyXG5cclxuICAgICAgdG9waWMubWVldGluZ3MucHVzaCgkc2NvcGUubWVldGluZy5faWQpO1xyXG4gICAgICBUb3BpY0ZhY3RvcnkuVG9waWMudXBkYXRlKHtpZDogdG9waWMuX2lkfSwgdG9waWMpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUucmVtb3ZlVG9waWMgPSBmdW5jdGlvbiAodG9waWMpIHtcclxuICAgICAgJHNjb3BlLm1lZXRpbmcudG9waWNzLnNwbGljZSgkc2NvcGUubWVldGluZy50b3BpY3MuaW5kZXhPZih0b3BpYyksIDEpO1xyXG5cclxuICAgICAgdG9waWMubWVldGluZ3Muc3BsaWNlKHRvcGljLm1lZXRpbmdzLmluZGV4T2YoJHNjb3BlLm1lZXRpbmcuX2lkKSwgMSk7XHJcbiAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy51cGRhdGUoe2lkOiB0b3BpYy5faWR9LCB0b3BpYyk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5zYXZlTWVldGluZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJHNjb3BlLnN1Y2Nlc3MgPSBcIlwiO1xyXG4gICAgICAkc2NvcGUuZXJyb3IgICA9IFwiXCI7XHJcblxyXG4gICAgICBpZiAoISRzY29wZS5tZWV0aW5nLnRpdGxlKXtcclxuICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIlBsZWFzZSBlbnRlciBhIHRpdGxlLlwiO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgTWVldGluZ0ZhY3RvcnkudXBkYXRlKHtpZDogJHNjb3BlLm1lZXRpbmcuX2lkfSwgJHNjb3BlLm1lZXRpbmcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAkc2NvcGUuc3VjY2VzcyA9IFwiTWVldGluZyBzYXZlZC5cIjtcclxuXHJcbiAgICAgICAgICBpZiAoJHNjb3BlLnRpbWVvdXQpIHtcclxuICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKCRzY29wZS50aW1lb3V0KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkc2NvcGUudGltZW91dCA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnN1Y2Nlc3MgPSBcIlwiO1xyXG4gICAgICAgICAgfSwgMzAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIjtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZGVsZXRlTWVldGluZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKGNvbmZpcm0oXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgbWVldGluZz9cIikpIHtcclxuICAgICAgICBNZWV0aW5nRmFjdG9yeS5kZWxldGUoe2lkOiAkc2NvcGUubWVldGluZy5faWR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IFwiVGhlcmUgd2FzIGFuIGVycm9yLiBQbGVhc2UgY29udGFjdCB0aGUgRGV2IFRlYW0gYW5kIGdpdmUgdGhlbSB0aGUgZGV0YWlscyBhYm91dCB0aGUgZXJyb3IuXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvbWVldGluZ3MvXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAkc2NvcGUuZGlzcGxheSA9ICgkc2NvcGUuc2VhcmNoVG9waWMgPyB0cnVlIDogZmFsc2UpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuYWxyZWFkeUluTWVldGluZ0ZpbHRlciA9IGZ1bmN0aW9uICh0b3BpYykge1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5tZWV0aW5nLnRvcGljcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICgkc2NvcGUubWVldGluZy50b3BpY3NbaV0uX2lkID09PSB0b3BpYy5faWQpIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9O1xyXG4gIH1cclxufSk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNyZWF0ZU1lbWJlckNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCBNZW1iZXJGYWN0b3J5KSB7XHJcblxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICAkc2NvcGUuZm9ybURhdGEgPSB7fTtcclxuICAgICRzY29wZS5mb3JtRGF0YS5yb2xlcyA9IFtdO1xyXG4gICAgJHNjb3BlLmZvcm1EYXRhLnBob25lcyA9IFtdO1xyXG5cclxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIG1lbWJlckRhdGEgPSB0aGlzLmZvcm1EYXRhO1xyXG5cclxuICAgICAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuY3JlYXRlKG1lbWJlckRhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcclxuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL21lbWJlci9cIiArIHJlc3BvbnNlLmlkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG59KTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTWVtYmVyRW1iZWRDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICB9XHJcblxyXG59KTtcclxuIiwicmVxdWlyZSgnLi9tZW1iZXIuanMnKTtcclxucmVxdWlyZSgnLi9saXN0LmpzJyk7XHJcbnJlcXVpcmUoJy4vY3JlYXRlLmpzJyk7XHJcbnJlcXVpcmUoJy4vZW1iZWQuanMnKTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJNZW1iZXJzQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCBNZW1iZXJGYWN0b3J5KSB7XHJcbiAgXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG4gICAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAkc2NvcGUubWVtYmVyUHJlZGljYXRlID0gXCJuYW1lXCI7XHJcbiAgICAgICRzY29wZS5yZXZlcnNlID0gZmFsc2U7XHJcbiAgICAgICRzY29wZS5tZW1iZXJzID0gcmVzcG9uc2U7XHJcbiAgICB9KTtcclxuICB9XHJcbn0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJNZW1iZXJDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsICRsb2NhdGlvbiwgTWVtYmVyRmFjdG9yeSkge1xyXG5cclxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xyXG5cclxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XHJcblxyXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgIGlmICgkcm91dGVQYXJhbXMuaWQgPT09IFwibWVcIikge1xyXG4gICAgICAkbG9jYXRpb24ucGF0aChcIi9tZW1iZXIvXCIgKyAkc2NvcGUubWUuaWQpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLm1lbWJlciA9ICRzY29wZS5mb3JtRGF0YSA9ICRzY29wZS5nZXRNZW1iZXIoJHJvdXRlUGFyYW1zLmlkKTtcclxuXHJcbiAgICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXQoe2lkOiRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKHJlc3VsdCkgeyBcclxuICAgICAgaWYoIXJlc3VsdC5lcnJvcikge1xyXG4gICAgICAgICRzY29wZS5tZW1iZXIgPSAkc2NvcGUuZm9ybURhdGEgPSByZXN1bHQ7XHJcbiAgICAgICAgZ2V0TWVtYmVyU3R1ZmYoKTtcclxuICAgICAgfSBcclxuICAgIH0pO1xyXG5cclxuICAgIGdldE1lbWJlclN0dWZmKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TWVtYmVyU3R1ZmYoKSB7XHJcbiAgICAgIGlmKCRzY29wZS5jb21wYW5pZXMgJiYgJHNjb3BlLnNwZWFrZXJzICYmICRzY29wZS5jb21tZW50cyAmJiAkc2NvcGUuY29tcGFuaWVzLmxlbmd0aCA+IDAgJiYgJHNjb3BlLnNwZWFrZXJzLmxlbmd0aCA+IDAgJiYgJHNjb3BlLmNvbW1lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGdldE1lbWJlclN0dWZmLCAxMDAwKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLm1lbWJlclN0dWZmID0ge307XHJcblxyXG4gICAgICAkc2NvcGUubWVtYmVyU3R1ZmYuY29tcGFuaWVzID0gJHNjb3BlLmNvbXBhbmllcy5maWx0ZXIoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHJldHVybiBlLm1lbWJlciA9PSAkc2NvcGUubWVtYmVyLmlkO1xyXG4gICAgICB9KVxyXG5cclxuICAgICAgJHNjb3BlLm1lbWJlclN0dWZmLnNwZWFrZXJzID0gJHNjb3BlLnNwZWFrZXJzLmZpbHRlcihmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgcmV0dXJuIGUubWVtYmVyID09ICRzY29wZS5tZW1iZXIuaWQ7XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAkc2NvcGUubWVtYmVyU3R1ZmYuY29tbWVudHMgPSAkc2NvcGUuY29tbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICByZXR1cm4gZS5tZW1iZXIgPT0gJHNjb3BlLm1lbWJlci5pZDtcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgbWVtYmVyRGF0YSA9IHRoaXMuZm9ybURhdGE7XHJcblxyXG4gICAgICBNZW1iZXJGYWN0b3J5Lk1lbWJlci51cGRhdGUoeyBpZDptZW1iZXJEYXRhLmlkIH0sIG1lbWJlckRhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLnN1Y2Nlc3M7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgfVxyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXJcclxuICAuY29udHJvbGxlcignU3BlYWtlckVtYWlsQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsICRsb2NhdGlvbiwgRW1haWxGYWN0b3J5KSB7XHJcblxyXG4gICAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XHJcblxyXG4gICAgICAkc2NvcGUuZW1haWwgPSAkbG9jYXRpb24uc2VhcmNoKCkuZW1haWw7XHJcbiAgICAgICRzY29wZS5zcGVha2VySWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XHJcbiAgICAgICRzY29wZS5tZXNzYWdlID0gbnVsbDtcclxuXHJcbiAgICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcclxuICAgICAgICAkc2NvcGUubWVzc2FnZSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJzZW5kIGVtYWlsIHRvIFwiLCAkc2NvcGUuZW1haWwsIFwiIGZyb20gXCIsICRzY29wZS5zcGVha2VySWQpO1xyXG5cclxuICAgICAgICBFbWFpbEZhY3RvcnkuU3BlYWtlci5zZW5kKHsgaWQ6ICRzY29wZS5zcGVha2VySWQgfSwgeyBlbWFpbDogJHNjb3BlLmVtYWlsIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuIFxyXG50aGVUb29sQ29udHJvbGxlclxyXG4gIC5jb250cm9sbGVyKCdDcmVhdGVTcGVha2VyQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgU3BlYWtlckZhY3RvcnkpIHtcclxuICAgIFxyXG4gICAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XHJcblxyXG4gICAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNwZWFrZXJEYXRhID0gdGhpcy5mb3JtRGF0YTtcclxuXHJcbiAgICAgICAgc3BlYWtlckRhdGEuc3RhdHVzID0gJ1N1Z2dlc3Rpb24nO1xyXG5cclxuICAgICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmNyZWF0ZShzcGVha2VyRGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xyXG5cclxuICAgICAgICAgICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXRBbGwoZnVuY3Rpb24gKHNwZWFrZXJzKSB7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLnNwZWFrZXJzID0gc3BlYWtlcnM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvc3BlYWtlci9cIiArIHJlc3BvbnNlLmlkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKCdTcGVha2VyRW1iZWRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSkge1xyXG5cclxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xyXG5cclxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XHJcblxyXG4gICAgaWYoJHNjb3BlLmNvbW1lbnRzKSB7XHJcbiAgICAgICRzY29wZS5zcGVha2VyLmNvbW1lbnRzID0gJHNjb3BlLmNvbW1lbnRzLmZpbHRlcihmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgcmV0dXJuIGUudGhyZWFkID09ICdzcGVha2VyLScrJHNjb3BlLnNwZWFrZXIuaWQ7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCRzY29wZS5ldmVudCkge1xyXG4gICAgICAkc2NvcGUucGFydGljaXBhdGlvbiA9ICRzY29wZS5zcGVha2VyLnBhcnRpY2lwYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgICAgcmV0dXJuIG8uZXZlbnQgPT0gJHNjb3BlLmV2ZW50LmlkO1xyXG4gICAgICB9KVswXTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuZ2V0VW5yZWFkTm90aWZpY2F0aW9ucyA9IGZ1bmN0aW9uICh0aHJlYWQpIHtcclxuICAgICAgdmFyIG5vdGlmaWNhdGlvbnMgPSAkc2NvcGUubm90aWZpY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgIHJldHVybiBvLnRocmVhZCA9PSB0aHJlYWQ7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gbm90aWZpY2F0aW9ucztcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnNwZWFrZXIudW5yZWFkID0gJHNjb3BlLmdldFVucmVhZE5vdGlmaWNhdGlvbnMoJ3NwZWFrZXItJyArICRzY29wZS5zcGVha2VyLmlkKS5sZW5ndGggPiAwO1xyXG5cclxuICAgICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcclxuICAgICAgdmFyIG1lbWJlciA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYobWVtYmVyLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgcmV0dXJuIG1lbWJlclswXTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgbmFtZTogJ05vIG9uZScsXHJcbiAgICAgICAgICBmYWNlYm9vazogJzEwMDAwMDQ1NjMzNTk3MidcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcclxuXHJcbiAgICAgIHZhciBzdWZmaXggPSAnYWdvJztcclxuICAgICAgaWYoc2Vjb25kcyA8IDApe1xyXG4gICAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcclxuICAgICAgICBzdWZmaXggPSAndG8gZ28nO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XHJcblxyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyAnIHllYXJzICcgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgJyBtb250aHMgJyArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgJyBkYXlzICcgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgJyBob3VycyAnICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyAnIG1pbnV0ZXMgJyArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArICcgc2Vjb25kcyAnICsgc3VmZml4O1xyXG4gICAgfTtcclxuICB9XHJcblxyXG59KTtcclxuIiwicmVxdWlyZSgnLi9zcGVha2VyLmpzJyk7XHJcbnJlcXVpcmUoJy4vbGlzdC5qcycpO1xyXG5yZXF1aXJlKCcuL2NyZWF0ZS5qcycpO1xyXG5yZXF1aXJlKCcuL2NvbmZpcm0uanMnKTtcclxucmVxdWlyZSgnLi9lbWJlZC5qcycpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sQ29udHJvbGxlclxyXG4gIC5jb250cm9sbGVyKCdTcGVha2Vyc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHNjZSwgU3BlYWtlckZhY3RvcnkpIHtcclxuXHJcbiAgICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICAgICRzY29wZS5saW1pdCA9IDIwO1xyXG5cclxuICAgICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnU2VsZWN0ZWQnLCdBcHByb3ZlZCcsJ0NvbnRhY3RlZCcsJ0luIENvbnZlcnNhdGlvbnMnLCdBY2NlcHRlZCcsJ1JlamVjdGVkJywnR2l2ZSBVcCddO1xyXG5cclxuICAgICAgJHNjb3BlLnNwZWFrZXJQcmVkaWNhdGUgPSAndXBkYXRlZCc7XHJcbiAgICAgICRzY29wZS5yZXZlcnNlID0gJ3RydWUnO1xyXG4gICAgICAkc2NvcGUuZmlsdGVyZWRTcGVha2VycyA9IFtdO1xyXG4gICAgICAkc2NvcGUuc2VhcmNoU3BlYWtlcnMgPSB7dW5hc3NpZ25lZDogdHJ1ZSwgdW5hc3NpZ25lZE9ubHk6IGZhbHNlfTtcclxuICAgICAgJHNjb3BlLnVucmVhZEZpcnN0ID0gdHJ1ZTtcclxuXHJcblxyXG5cclxuICAgICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXRBbGwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAkc2NvcGUuc3BlYWtlcnMgPSByZXNwb25zZTtcclxuICAgICAgICAvLyRzY29wZS5maWx0ZXJlZFNwZWFrZXJzID0gJHNjb3BlLnNwZWFrZXJzO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICRzY29wZS5zY3JvbGwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoJHNjb3BlLmxpbWl0IDw9ICRzY29wZS5zcGVha2Vycy5sZW5ndGgpXHJcbiAgICAgICAgICAkc2NvcGUubGltaXQgKz0gODtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAobWVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYocm9sZXMubGVuZ3RoID09PSAwICYmIG1lbWJlci5pZCAhPSAkc2NvcGUubWUuaWQpIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLmFkZFNwZWFrZXIgPSBmdW5jdGlvbihtZW1iZXIsIG5ld1NwZWFrZXIpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKG5ld1NwZWFrZXIpO1xyXG4gICAgICAgIHZhciBzcGVha2VyRGF0YSA9IG5ld1NwZWFrZXI7XHJcblxyXG4gICAgICAgIGlmKG5ld1NwZWFrZXIuaWQpIHtcclxuICAgICAgICAgIHZhciBwYXJ0aWNpcGF0aW9uID0gJHNjb3BlLmdldFBhcnRpY2lwYXRpb24oc3BlYWtlckRhdGEsICRzY29wZS5jdXJyZW50RXZlbnQuaWQpO1xyXG4gICAgICAgICAgaWYocGFydGljaXBhdGlvbikge1xyXG4gICAgICAgICAgICBwYXJ0aWNpcGF0aW9uLm1lbWJlciA9IG1lbWJlci5pZDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNwZWFrZXJEYXRhLnBhcnRpY2lwYXRpb25zLnB1c2goe1xyXG4gICAgICAgICAgICAgIGV2ZW50OiAkc2NvcGUuY3VycmVudEV2ZW50LmlkLFxyXG4gICAgICAgICAgICAgIHN0YXR1czogJ1NlbGVjdGVkJyxcclxuICAgICAgICAgICAgICBtZW1iZXI6IG1lbWJlci5pZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIudXBkYXRlKHsgaWQ6IHNwZWFrZXJEYXRhLmlkIH0sIHsgcGFydGljaXBhdGlvbnM6IHNwZWFrZXJEYXRhLnBhcnRpY2lwYXRpb25zIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xyXG5cclxuICAgICAgICAgICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmdldEFsbChmdW5jdGlvbiAoc3BlYWtlcnMpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5zcGVha2VycyA9IHNwZWFrZXJzO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3BlYWtlckRhdGEucGFydGljaXBhdGlvbnMgPSBbe1xyXG4gICAgICAgICAgICBldmVudDogJHNjb3BlLmN1cnJlbnRFdmVudC5pZCxcclxuICAgICAgICAgICAgc3RhdHVzOiAnU2VsZWN0ZWQnLFxyXG4gICAgICAgICAgICBtZW1iZXI6IG1lbWJlci5pZFxyXG4gICAgICAgICAgfV07XHJcblxyXG4gICAgICAgICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5jcmVhdGUoc3BlYWtlckRhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xyXG5cclxuICAgICAgICAgICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmdldEFsbChmdW5jdGlvbiAoc3BlYWtlcnMpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5zcGVha2VycyA9IHNwZWFrZXJzO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyAkc2NvcGUuJHdhdGNoKFsnY3VycmVudEV2ZW50JywgJ3NlYXJjaFN0YXR1cyddLCBmdW5jdGlvbihuZXdWYWx1ZXMsIG9sZFZhbHVlcywgc2NvcGUpe1xyXG4gICAgICAvLyAgIC8vY29uc29sZS5sb2coJ2ZpbHRlcmluZyBzcGVha2VycyBieScsJHNjb3BlLnNlYXJjaFN0YXR1cywkc2NvcGUuY3VycmVudEV2ZW50KTtcclxuICAgICAgLy8gICBpZigkc2NvcGUuc3BlYWtlcnMpe1xyXG4gICAgICAvLyAgICAgJHNjb3BlLmZpbHRlcmVkU3BlYWtlcnMgPSAkc2NvcGUuc3BlYWtlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgLy8gICAgICAgcmV0dXJuIG8ucGFydGljaXBhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKHApIHtcclxuICAgICAgLy8gICAgICAgICBpZigkc2NvcGUuc2VhcmNoU3RhdHVzICYmICRzY29wZS5zZWFyY2hTdGF0dXMgIT09ICcnKSB7XHJcbiAgICAgIC8vICAgICAgICAgICByZXR1cm4gcC5ldmVudCA9PT0gJHNjb3BlLmN1cnJlbnRFdmVudC5pZCAmJiBwLnN0YXR1cyA9PT0gJHNjb3BlLnNlYXJjaFN0YXR1cztcclxuICAgICAgLy8gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAvLyAgICAgICAgICAgcmV0dXJuIHAuZXZlbnQgPT09ICRzY29wZS5jdXJyZW50RXZlbnQuaWQ7XHJcbiAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAvLyAgICAgICB9KTtcclxuICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAvLyAgIH1cclxuICAgICAgLy8gfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sQ29udHJvbGxlclxyXG4gIC5jb250cm9sbGVyKCdTcGVha2VyQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRsb2NhdGlvbiwgJHdpbmRvdywgJHJvdXRlUGFyYW1zLCAkc2NlLCBTcGVha2VyRmFjdG9yeSwgTWVtYmVyRmFjdG9yeSwgTm90aWZpY2F0aW9uRmFjdG9yeSkge1xyXG4gICAgXHJcbiAgICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICAgICRzY29wZS5jb21tdW5pY2F0aW9uRXZlbnQgPSAkc2NvcGUuY3VycmVudEV2ZW50O1xyXG5cclxuICAgICAgJHNjb3BlLnNldENvbW11bmljYXRpb25FdmVudCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgJHNjb3BlLmNvbW11bmljYXRpb25FdmVudCA9IGV2ZW50O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUudHJ1c3RTcmMgPSBmdW5jdGlvbihzcmMpIHtcclxuICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoc3JjKycjcGFnZS1ib2R5Jyk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuY29udmVydEVtYWlscyA9IGZ1bmN0aW9uKHRleHQpIHtcclxuICAgICAgICB2YXIgbWFpbEV4cCA9IC9bXFx3XFwuXFwtXStcXEAoW1xcd1xcLV0rXFwuKStbXFx3XXsyLDR9KD8hW148XSo+KS9pZztcclxuICAgICAgICB2YXIgdHdpdHRlckV4cCA9IC8oXnxbXkBcXHddKUAoXFx3ezEsMTV9KVxcYi9nO1xyXG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UobWFpbEV4cCwnPGEgaHJlZj1cIm1haWx0bzokJlwiPiQmPC9hPicpLnJlcGxhY2UodHdpdHRlckV4cCwnJDE8YSBocmVmPVwiaHR0cDovL3R3aXR0ZXIuY29tLyQyXCIgdGFyZ2V0PVwiX2JsYW5rXCI+QCQyPC9hPicpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBzcGVha2VyRGF0YSA9IHRoaXMuZm9ybURhdGE7XHJcblxyXG4gICAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIudXBkYXRlKHsgaWQ6c3BlYWtlckRhdGEuaWQgfSwgc3BlYWtlckRhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2Uuc3VjY2VzcztcclxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ3NwZWFrZXIvJytzcGVha2VyRGF0YS5pZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuZGVsZXRlU3BlYWtlciA9IGZ1bmN0aW9uKHNwZWFrZXIpIHtcclxuICAgICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmRlbGV0ZSh7IGlkOnNwZWFrZXIuaWQgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ3NwZWFrZXJzLycpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLmNoZWNrUGVybWlzc2lvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZihyb2xlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnU2VsZWN0ZWQnLCdBcHByb3ZlZCcsJ0NvbnRhY3RlZCcsJ0luIENvbnZlcnNhdGlvbnMnLCdBY2NlcHRlZCcsJ1JlamVjdGVkJywnR2l2ZSBVcCddO1xyXG5cclxuICAgICAgJHNjb3BlLnNwZWFrZXIgPSAkc2NvcGUuZm9ybURhdGEgPSAkc2NvcGUuZ2V0U3BlYWtlcigkcm91dGVQYXJhbXMuaWQpO1xyXG5cclxuICAgICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXQoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICRzY29wZS5zcGVha2VyID0gJHNjb3BlLmZvcm1EYXRhID0gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIE5vdGlmaWNhdGlvbkZhY3RvcnkuU3BlYWtlci5nZXRBbGwoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihnZXREYXRhKSB7XHJcbiAgICAgICAgICAkc2NvcGUuc3BlYWtlck5vdGlmaWNhdGlvbnMgPSBnZXREYXRhO1xyXG5cclxuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdmFyIHdpbiA9ICR3aW5kb3c7XHJcbiAgICAgICRzY29wZS4kd2F0Y2goJ3NwZWFrZXJGb3JtLiRkaXJ0eScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgaWYodmFsdWUpIHtcclxuICAgICAgICAgIHdpbi5vbmJlZm9yZXVubG9hZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiAnWW91IGhhdmUgdW5zYXZlZCBjaGFuZ2VzJztcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgfSk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIlN1YnNjcmlwdGlvbkNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgU3Vic2NyaXB0aW9uRmFjdG9yeSkge1xyXG5cclxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xyXG5cclxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XHJcblxyXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgIHZhciB0aHJlYWRJZCA9ICRzY29wZS50aHJlYWQuc3Vic3RyaW5nKCRzY29wZS50aHJlYWQuaW5kZXhPZihcIi1cIikgKyAxKTtcclxuICAgIHZhciB0aHJlYWRLaW5kID0gJHNjb3BlLnRocmVhZC5zcGxpdCgnLScpWzBdO1xyXG5cclxuICAgIHZhciBGYWN0b3J5O1xyXG5cclxuICAgIHN3aXRjaCh0aHJlYWRLaW5kKSB7XHJcbiAgICAgIGNhc2UgJ2NvbXBhbnknOlxyXG4gICAgICAgIEZhY3RvcnkgPSBTdWJzY3JpcHRpb25GYWN0b3J5LkNvbXBhbnk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdzcGVha2VyJzpcclxuICAgICAgICBGYWN0b3J5ID0gU3Vic2NyaXB0aW9uRmFjdG9yeS5TcGVha2VyO1xyXG4gICAgICBicmVhaztcclxuICAgICAgY2FzZSAndG9waWMnOlxyXG4gICAgICAgIEZhY3RvcnkgPSBTdWJzY3JpcHRpb25GYWN0b3J5LlRvcGljO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKCdUSFJFQUQnLCAkc2NvcGUudGhyZWFkLCB0aHJlYWRLaW5kLCB0aHJlYWRJZCk7XHJcbiAgICAvL2NvbnNvbGUubG9nKCdGQUNUT1JZWVknLCBTdWJzY3JpcHRpb25GYWN0b3J5LkNvbXBhbnksIFN1YnNjcmlwdGlvbkZhY3RvcnkuU3BlYWtlciwgU3Vic2NyaXB0aW9uRmFjdG9yeS5Ub3BpYywgRmFjdG9yeSk7XHJcblxyXG4gICAgJHNjb3BlLmlzU3Vic2NyaWJlZCA9IGZhbHNlO1xyXG5cclxuICAgICRzY29wZS5nZXRTdGF0dXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIEZhY3RvcnkuZ2V0KHtpZDogdGhyZWFkSWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ1NUQVRVUycscmVzcG9uc2Uuc3VjY2VzcylcclxuICAgICAgICBpZihyZXNwb25zZS5zdWNjZXNzID09ICdzdWJzY3JpYmVkJykge1xyXG4gICAgICAgICAgJHNjb3BlLmlzU3Vic2NyaWJlZCA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICRzY29wZS5pc1N1YnNjcmliZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vY29uc29sZS5sb2coJ0FEREQnLCB0aHJlYWRLaW5kLCB0aHJlYWRJZCk7XHJcbiAgICAgIEZhY3RvcnkuYWRkKHtpZDogdGhyZWFkSWR9LCB7fSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAkc2NvcGUuZ2V0U3RhdHVzKCk7XHJcbiAgICAgIH0pXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZygnREVMRVRFJywgdGhyZWFkS2luZCwgdGhyZWFkSWQpO1xyXG4gICAgICBGYWN0b3J5LnJlbW92ZSh7aWQ6IHRocmVhZElkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAkc2NvcGUuZ2V0U3RhdHVzKCk7XHJcbiAgICAgIH0pXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5nZXRTdGF0dXMoKTtcclxuICB9XHJcbn0pO1xyXG4iLCJyZXF1aXJlKCcuL2VtYmVkJyk7IiwicmVxdWlyZSgnLi9tYW5hZ2VyJyk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiVGFnTWFuYWdlckNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgVGFnRmFjdG9yeSkge1xyXG5cclxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xyXG5cclxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XHJcblxyXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICRzY29wZS50YWcgPSB7fTtcclxuXHJcbiAgICAkc2NvcGUubGlnaHRDb2xvcnMgPSBbXCIjZjdjNmM3XCIsIFwiI2ZhZDhjN1wiLCBcIiNmZWYyYzBcIiwgXCIjYmZlNWJmXCIsIFwiI2JmZGFkY1wiLCBcIiNjN2RlZjhcIiwgXCIjYmZkNGYyXCIsIFwiI2Q0YzVmOVwiXTtcclxuICAgICRzY29wZS5jb2xvcnMgPSBbXCIjZTExZDIxXCIsIFwiI2ViNjQyMFwiLCBcIiNmYmNhMDRcIiwgXCIjMDA5ODAwXCIsIFwiIzAwNmI3NVwiLCBcIiMyMDdkZTVcIiwgXCIjMDA1MmNjXCIsIFwiIzUzMTllN1wiXTtcclxuXHJcbiAgICAkc2NvcGUuY2hhbmdlQ29sb3IgPSBmdW5jdGlvbiAoY29sb3IpIHtcclxuICAgICAgJHNjb3BlLnRhZy5jb2xvciA9IGNvbG9yO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY3JlYXRlVGFnID0gZnVuY3Rpb24gKHRhZykge1xyXG4gICAgICBUYWdGYWN0b3J5LlRhZy5jcmVhdGUodGFnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xyXG4gICAgICAgICAgJHNjb3BlLnRhZ3MucHVzaChyZXNwb25zZS50YWcpO1xyXG4gICAgICAgICAgJHNjb3BlLnRhZyA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5zYXZlVGFnID0gZnVuY3Rpb24gKHRhZykge1xyXG4gICAgICBUYWdGYWN0b3J5LlRhZy51cGRhdGUoe2lkOiB0YWcuaWR9LCB0YWcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICB0YWcuZWRpdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5kZWxldGVUYWcgPSBmdW5jdGlvbiAodGFnKSB7XHJcbiAgICAgIFRhZ0ZhY3RvcnkuVGFnLmRlbGV0ZSh7aWQ6IHRhZy5pZH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAkc2NvcGUudGFncy5zcGxpY2UoJHNjb3BlLnRhZ3MuaW5kZXhPZih0YWcpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICB9XHJcbn0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJUb3BpY0VtYmVkQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkbG9jYXRpb24sIFRvcGljRmFjdG9yeSwgTm90aWZpY2F0aW9uRmFjdG9yeSkge1xyXG5cclxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xyXG5cclxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XHJcblxyXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUlOSVRJQUxJWkFUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgJHNjb3BlLmVycm9yICAgICAgID0gXCJcIjtcclxuICAgICRzY29wZS5zaG93VGFyZ2V0cyA9IGZhbHNlO1xyXG5cclxuICAgICRzY29wZS5wb2xsS2luZHMgPSBbXCJ0ZXh0XCIsIFwiaW1hZ2VzXCJdO1xyXG5cclxuICAgIGlmICgkc2NvcGUuY29tbWVudHMpIHtcclxuICAgICAgJHNjb3BlLnRvcGljLmNvbW1lbnRzID0gJHNjb3BlLmNvbW1lbnRzLmZpbHRlcihmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHJldHVybiBlLnRocmVhZCA9PSBcInRvcGljLVwiICsgJHNjb3BlLnRvcGljLl9pZDtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdygkc2NvcGUudG9waWMpO1xyXG5cclxuXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUFVWEZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICBmdW5jdGlvbiBzaG93KHRvcGljKSB7XHJcbiAgICAgIHRvcGljLnNob3cgPSB7XHJcbiAgICAgICAgdGV4dCAgICAgOiB0cnVlLFxyXG4gICAgICAgIHRhcmdldHMgIDogdHJ1ZSxcclxuICAgICAgICBwb2xsICAgICA6IGZhbHNlLFxyXG4gICAgICAgIGR1ZWRhdGUgIDogZmFsc2UsXHJcbiAgICAgICAgbWVldGluZyAgOiB0cnVlLFxyXG4gICAgICAgIGNsb3NlZCAgIDogZmFsc2VcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGlmICh0b3BpYy5raW5kID09PSBcIlRvIGRvXCIpIHtcclxuICAgICAgICB0b3BpYy5zaG93LmR1ZWRhdGUgPSB0cnVlO1xyXG4gICAgICAgIHRvcGljLnNob3cuY2xvc2VkICA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAodG9waWMua2luZCA9PT0gXCJEZWNpc2lvblwiKSB7XHJcbiAgICAgICAgdG9waWMuc2hvdy5kdWVkYXRlID0gdHJ1ZTtcclxuICAgICAgICB0b3BpYy5zaG93LmNsb3NlZCAgPSB0cnVlO1xyXG4gICAgICAgIHRvcGljLnNob3cucG9sbCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLmNoZWNrUGVybWlzc2lvbiA9IGZ1bmN0aW9uICh0b3BpYykge1xyXG4gICAgICBpZiAoISRzY29wZS5tZS5yb2xlcykgeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcbiAgICAgIHZhciByb2xlcyA9ICRzY29wZS5tZS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAocm9sZXMubGVuZ3RoID09IDAgJiYgdG9waWMuYXV0aG9yICE9ICRzY29wZS5tZS5pZCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICRzY29wZS5kZWxldGVUb3BpYyA9IGZ1bmN0aW9uICh0b3BpYykge1xyXG4gICAgICBpZiAoY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyB0b3BpYz9cIikpIHtcclxuICAgICAgICBUb3BpY0ZhY3RvcnkuVG9waWMuZGVsZXRlKHtpZDogdG9waWMuX2lkfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdG9waWMuZGVsZXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3RvcGljcycpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS50b2dnbGVUYWcgPSBmdW5jdGlvbiAodGFnKSB7XHJcbiAgICAgIHZhciBpbmRleCA9ICRzY29wZS50b3BpYy50YWdzLmluZGV4T2YodGFnKTtcclxuXHJcbiAgICAgIGlmIChpbmRleCA9PSAtMSkge1xyXG4gICAgICAgICRzY29wZS50b3BpYy50YWdzLnB1c2godGFnKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICAkc2NvcGUudG9waWMudGFncy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5nZXRUYWdJY29uID0gZnVuY3Rpb24gKHRhZykge1xyXG4gICAgICByZXR1cm4gKCRzY29wZS50b3BpYy50YWdzLmluZGV4T2YodGFnLmlkKSAhPT0gLTEgPyBcImNoZWNrXCIgOiBcInRpbWVzXCIpOztcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnRvZ2dsZVRhcmdldCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgICAgdmFyIGluZGV4ID0gJHNjb3BlLnRvcGljLnRhcmdldHMuaW5kZXhPZih0YXJnZXQpO1xyXG5cclxuICAgICAgaWYgKGluZGV4ID09IC0xKSB7XHJcbiAgICAgICAgJHNjb3BlLnRvcGljLnRhcmdldHMucHVzaCh0YXJnZXQpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgICRzY29wZS50b3BpYy50YXJnZXRzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnRvZ2dsZUFsbFRhcmdldHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLm1lbWJlcnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XHJcbiAgICAgICAgJHNjb3BlLnRvZ2dsZVRhcmdldCgkc2NvcGUubWVtYmVyc1tpXS5pZCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnRvZ2dsZVJvbGVUYXJnZXRzID0gZnVuY3Rpb24gKHJvbGVJZCkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS5tZW1iZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xyXG4gICAgICAgIGZvcih2YXIgbyA9IDA7IG8gPCAkc2NvcGUubWVtYmVyc1tpXS5yb2xlcy5sZW5ndGg7IG8rKykge1xyXG4gICAgICAgICAgaWYgKCRzY29wZS5tZW1iZXJzW2ldLnJvbGVzW29dLmlkID09IHJvbGVJZCkge1xyXG4gICAgICAgICAgICAkc2NvcGUudG9nZ2xlVGFyZ2V0KCRzY29wZS5tZW1iZXJzW2ldLmlkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnRvZ2dsZVRhcmdldHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRzY29wZS5zaG93VGFyZ2V0cyA9ICEkc2NvcGUuc2hvd1RhcmdldHM7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5nZXRUYXJnZXRDb2xvciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xyXG4gICAgICByZXR1cm4gKCRzY29wZS50b3BpYy50YXJnZXRzLmluZGV4T2YobWVtYmVySWQpICE9PSAtMSA/IFwiYmx1ZVwiIDogXCJcIik7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5mb2N1c09wdGlvbiA9IGZ1bmN0aW9uIChvcHRpb24pIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUudG9waWMucG9sbC5vcHRpb25zLmxlbmd0aDsgaSA8IGo7IGkrKykge1xyXG4gICAgICAgICRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnNbaV0uZWRpdGluZyA9IGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBvcHRpb24uZWRpdGluZyA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5hZGRPcHRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBvcHRpb24gPSB7XHJcbiAgICAgICAgb3B0aW9uVHlwZTogXCJJbmZvXCIsXHJcbiAgICAgICAgdGFyZ2V0czogW11cclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnMucHVzaChvcHRpb24pO1xyXG5cclxuICAgICAgJHNjb3BlLmZvY3VzT3B0aW9uKG9wdGlvbik7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5yZW1vdmVPcHRpb24gPSBmdW5jdGlvbiAob3B0aW9uKSB7XHJcbiAgICAgICRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnMuc3BsaWNlKCRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnMuaW5kZXhPZihvcHRpb24pLCAxKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnNlbGVjdE9wdGlvbiA9IGZ1bmN0aW9uICh0b3BpYywgb3B0aW9uKSB7XHJcbiAgICAgIHZhciB1cGRhdGVkVG9waWMgPSB0b3BpYztcclxuXHJcbiAgICAgIGlmIChvcHRpb24udm90ZXMuaW5kZXhPZigkc2NvcGUubWUuaWQpICE9PSAtMSkge1xyXG4gICAgICAgIHVwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnNbdXBkYXRlZFRvcGljLnBvbGwub3B0aW9ucy5pbmRleE9mKG9wdGlvbildLnZvdGVzLnNwbGljZSh1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zW3VwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnMuaW5kZXhPZihvcHRpb24pXS52b3Rlcy5pbmRleE9mKCRzY29wZS5tZS5pZCksIDEpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHVwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnNbdXBkYXRlZFRvcGljLnBvbGwub3B0aW9ucy5pbmRleE9mKG9wdGlvbildLnZvdGVzLnB1c2goJHNjb3BlLm1lLmlkKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdXBkYXRlZFRvcGljLl92b3RpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgVG9waWNGYWN0b3J5LlRvcGljLnVwZGF0ZSh7aWQ6IHVwZGF0ZWRUb3BpYy5faWR9LCB1cGRhdGVkVG9waWMsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlRoZXJlIHdhcyBhbiBlcnJvci4gUGxlYXNlIGNvbnRhY3QgdGhlIERldiBUZWFtIGFuZCBnaXZlIHRoZW0gdGhlIGRldGFpbHMgYWJvdXQgdGhlIGVycm9yLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xyXG4gICAgICAgICAgLy8vL2NvbnNvbGUubG9nKHJlc3BvbnNlLnN1Y2Nlc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24gKHRvcGljKSB7XHJcbiAgICAgICRzY29wZS5lcnJvciA9IFwiXCI7XHJcblxyXG4gICAgICAvL2NvbnNvbGUubG9nKHRvcGljKTtcclxuXHJcbiAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy51cGRhdGUoe2lkOiB0b3BpYy5faWR9LCB0b3BpYywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgIHRvcGljLmVkaXRpbmcgPSAhdG9waWMuZWRpdGluZztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIlRoZXJlIHdhcyBhbiBlcnJvci4gUGxlYXNlIGNvbnRhY3QgdGhlIERldiBUZWFtIGFuZCBnaXZlIHRoZW0gdGhlIGRldGFpbHMgYWJvdXQgdGhlIGVycm9yLlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5yZWFkID0gZnVuY3Rpb24gKHRvcGljKSB7XHJcbiAgICAgIGlmICghJHNjb3BlLm5vdGlmaWNhdGlvbnMpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5ub3RpZmljYXRpb25zLmZpbHRlcihmdW5jdGlvbiAobykge1xyXG4gICAgICAgIHJldHVybiBvLnRocmVhZCA9PT0gXCJ0b3BpYy1cIiArIHRvcGljLl9pZDtcclxuICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gbm90aWZpY2F0aW9uLnVucmVhZC5pbmRleE9mKCRzY29wZS5tZS5pZCk7XHJcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgbm90aWZpY2F0aW9uLnVucmVhZC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgTm90aWZpY2F0aW9uRmFjdG9yeS5Ob3RpZmljYXRpb24udXBkYXRlKHtpZDogbm90aWZpY2F0aW9uLl9pZH0sIG5vdGlmaWNhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xyXG4gICAgICB2YXIgbWVtYmVyID0gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKG1lbWJlciAmJiBtZW1iZXIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJldHVybiBtZW1iZXJbMF07XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIG5hbWU6IFwiTm8gb25lXCIsXHJcbiAgICAgICAgICBmYWNlYm9vazogXCIxMDAwMDA0NTYzMzU5NzJcIlxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmdldFVucmVhZE5vdGlmaWNhdGlvbnMgPSBmdW5jdGlvbiAodGhyZWFkKSB7XHJcbiAgICAgIC8vY29uc29sZS5sb2cobm90aWZpY2F0aW9ucyk7XHJcbiAgICAgIHZhciBub3RpZmljYXRpb25zID0gJHNjb3BlLm5vdGlmaWNhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICByZXR1cm4gby50aHJlYWQgPT0gdGhyZWFkO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBub3RpZmljYXRpb25zO1xyXG4gICAgfTtcclxuXHJcbiAgICAgJHNjb3BlLnRvcGljLnVucmVhZCA9ICRzY29wZS5nZXRVbnJlYWROb3RpZmljYXRpb25zKCd0b3BpYy0nKyAkc2NvcGUudG9waWMuX2lkKS5sZW5ndGggPiAwO1xyXG5cclxuICAgICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcclxuXHJcbiAgICAgIHZhciBzdWZmaXggPSBcImFnb1wiO1xyXG4gICAgICBpZiAoc2Vjb25kcyA8IDApe1xyXG4gICAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcclxuICAgICAgICBzdWZmaXggPSBcInRvIGdvXCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcclxuXHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgZGF5cyBcIiArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24gKHRpbWUpIHtcclxuICAgICAgcmV0dXJuIG5ldyBEYXRlKHRpbWUpLnRvVVRDU3RyaW5nKCk7XHJcbiAgICB9O1xyXG4gIH1cclxufSk7XHJcbiIsInJlcXVpcmUoJy4vbGlzdCcpO1xyXG5yZXF1aXJlKCcuL3RvcGljJyk7XHJcbnJlcXVpcmUoJy4vZW1iZWQnKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiVG9waWNzQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcywgVG9waWNGYWN0b3J5KSB7XHJcblxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAkc2NvcGUua2luZHMgPSBbXCJJbmZvXCIsIFwiVG8gZG9cIiwgXCJEZWNpc2lvblwiLCBcIklkZWFcIl07XHJcblxyXG4gICAgJHNjb3BlLnNlYXJjaFRvcGljcyA9IHt9O1xyXG5cclxuICAgICRzY29wZS51bnJlYWRGaXJzdCA9IHRydWU7XHJcblxyXG4gICAgVG9waWNGYWN0b3J5LlRvcGljLmdldEFsbChnb3RUb3BpY3MpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdvdFRvcGljcyAodG9waWNzKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkc2NvcGUubG9hZGluZykge1xyXG4gICAgICAgICAgZ290VG9waWNzKHRvcGljcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAxMDAwKTtcclxuXHJcbiAgICAgICRzY29wZS50b3BpY3MgPSB0b3BpY3M7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS50b3BpY3MubGVuZ3RoOyBpIDwgajsgaSsrKSB7XHJcbiAgICAgICAgJHNjb3BlLnRvcGljc1tpXS5mYWNlYm9vayA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbiAobykge1xyXG4gICAgICAgICAgcmV0dXJuICRzY29wZS50b3BpY3NbaV0uYXV0aG9yID09PSBvLmlkO1xyXG4gICAgICAgIH0pWzBdLmZhY2Vib29rO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5zaG93T3BlbiA9IHRydWU7XHJcbiAgICAkc2NvcGUubGltaXQgPSAxMDtcclxuXHJcblxyXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgJHNjb3BlLnRpbWUgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgIHJldHVybiAkc2NvcGUudGltZVNpbmNlKG5ldyBEYXRlKGRhdGUpKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNyZWF0ZVRvcGljID0gZnVuY3Rpb24oa2luZCkge1xyXG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5jcmVhdGUoe1xyXG4gICAgICAgIGF1dGhvcjogJHNjb3BlLm1lLmlkLFxyXG4gICAgICAgIGtpbmQ6IGtpbmQsXHJcbiAgICAgICAgdGFnczogWyRzY29wZS5zZWFyY2hUb3BpY3MudGFnc11cclxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5nZXRBbGwoZnVuY3Rpb24gKHRvcGljcykge1xyXG4gICAgICAgICAgICAkc2NvcGUudG9waWNzID0gdG9waWNzO1xyXG4gICAgICAgICAgICAkc2NvcGUudG9waWNzLmZpbHRlcihmdW5jdGlvbiAobykge1xyXG4gICAgICAgICAgICAgIHJldHVybiBvLl9pZCA9PSByZXNwb25zZS5pZDtcclxuICAgICAgICAgICAgfSlbMF0uZWRpdGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCd0b3BpYy8nK3Jlc3BvbnNlLmlkKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jb3VudCA9IGZ1bmN0aW9uIChvcGVuKSB7XHJcbiAgICAgIHJldHVybiAkc2NvcGUudG9waWNzLmZpbHRlcihmdW5jdGlvbiAobykge1xyXG4gICAgICAgIHJldHVybiAob3BlbiA/ICFvLmNsb3NlZCA6IG8uY2xvc2VkKTtcclxuICAgICAgfSkubGVuZ3RoO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuc2hvd25Ub3BpY3MgPSBmdW5jdGlvbiAob3Blbikge1xyXG4gICAgICByZXR1cm4gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICByZXR1cm4gby5lZGl0aW5nIHx8IChvcGVuID8gIW8uY2xvc2VkIDogby5jbG9zZWQpICYmIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAoJHNjb3BlLnNlYXJjaFRvcGljcy50YWdzICYmIG8udGFncy5pbmRleE9mKCRzY29wZS5zZWFyY2hUb3BpY3MudGFncykgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICgkc2NvcGUuc2VhcmNoVG9waWNzLnRhcmdldCAmJiBvLnRhcmdldHMuaW5kZXhPZigkc2NvcGUuc2VhcmNoVG9waWNzLnRhcmdldCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICgkc2NvcGUuc2VhcmNoVG9waWNzLmtpbmQgJiYgby5raW5kICE9PSAkc2NvcGUuc2VhcmNoVG9waWNzLmtpbmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSgpKTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5zY3JvbGwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKCRzY29wZS5saW1pdCA8ICRzY29wZS50b3BpY3MubGVuZ3RoKVxyXG4gICAgICAgICRzY29wZS5saW1pdCArPSA0O1xyXG4gICAgfTtcclxuICB9XHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKCdUb3BpY0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgJHdpbmRvdywgVG9waWNGYWN0b3J5LCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XHJcblxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgVG9waWNGYWN0b3J5LlRvcGljLmdldCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICAkc2NvcGUudG9waWMgPSByZXN1bHQ7XHJcblxyXG4gICAgICAvL2NvbnNvbGUubG9nKCRsb2NhdGlvbi5zZWFyY2goKSk7XHJcbiAgICAgIGlmKCRsb2NhdGlvbi5zZWFyY2goKS5lZGl0aW5nID09IHRydWUpIHtcclxuICAgICAgICAkc2NvcGUudG9waWMuZWRpdGluZz10cnVlO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ1RSVUVFRScpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUudG9waWMuc2hvd0NvbW1lbnRzID0gdHJ1ZTtcclxuXHJcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbERpcmVjdGl2ZXNcclxuICAuZGlyZWN0aXZlKCdjb21tZW50QXJlYScsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcclxuICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21tZW50L2FyZWEuaHRtbCcsXHJcbiAgICAgIGNvbnRyb2xsZXI6ICdDb21tZW50QXJlYUNvbnRyb2xsZXInLFxyXG4gICAgICBzY29wZToge1xyXG4gICAgICAgIHRocmVhZDogJ0AnLFxyXG4gICAgICAgIHN1YnRocmVhZDogJ0AnLFxyXG4gICAgICAgIG1lOiAnPScsXHJcbiAgICAgICAgbWVtYmVyczogJz0nXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbERpcmVjdGl2ZXNcclxuICAuZGlyZWN0aXZlKCdmaXJzdENvbW1lbnQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN0cmljdDogJ0VBQycsXHJcbiAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tbWVudC9maXJzdC5odG1sJyxcclxuICAgICAgY29udHJvbGxlcjogJ0ZpcnN0Q29tbWVudENvbnRyb2xsZXInLFxyXG4gICAgICBzY29wZToge1xyXG4gICAgICAgIHRocmVhZDogJ0AnXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSkiLCJyZXF1aXJlKCcuL2FyZWEnKTtcclxucmVxdWlyZSgnLi9maXJzdCcpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xEaXJlY3RpdmVzXHJcbiAgLmRpcmVjdGl2ZSgnY29tbXVuaWNhdGlvbkFyZWEnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN0cmljdDogJ0VBQycsXHJcbiAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tbXVuaWNhdGlvbi9hcmVhLmh0bWwnLFxyXG4gICAgICBjb250cm9sbGVyOiAnQ29tbXVuaWNhdGlvbkFyZWFDb250cm9sbGVyJyxcclxuICAgICAgc2NvcGU6IHtcclxuICAgICAgICB0aHJlYWQ6ICdAJyxcclxuICAgICAgICBldmVudDogJz0nLFxyXG4gICAgICAgIG1lbWJlcnNKc29uOiAnQG1lbWJlcnMnLFxyXG4gICAgICAgIG1lSnNvbjogJ0BtZScsXHJcbiAgICAgICAgcm9sZXNKc29uOiAnQHJvbGVzJ1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbERpcmVjdGl2ZXNcclxuICAuZGlyZWN0aXZlKCdjb21tdW5pY2F0aW9uJywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxyXG4gICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbW11bmljYXRpb24vY29tbXVuaWNhdGlvbi5odG1sJyxcclxuICAgICAgY29udHJvbGxlcjogJ0NvbW11bmljYXRpb25FbWJlZENvbnRyb2xsZXInLFxyXG4gICAgICBzY29wZToge1xyXG4gICAgICAgIGNvbW11bmljYXRpb246ICc9Y29tbXVuaWNhdGlvbk9iamVjdCcsXHJcbiAgICAgICAgbWVtYmVyczogJz0nLFxyXG4gICAgICAgIG1lOiAnPSdcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9KSIsInJlcXVpcmUoJy4vYXJlYScpO1xyXG5yZXF1aXJlKCcuL2NvbW11bmljYXRpb24nKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sRGlyZWN0aXZlc1xyXG4gIC5kaXJlY3RpdmUoJ2NvbXBhbnlDYXJkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxyXG4gICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBhbnkvY2FyZC5odG1sJyxcclxuICAgICAgY29udHJvbGxlcjogJ0NvbXBhbnlFbWJlZENvbnRyb2xsZXInLFxyXG4gICAgICBzY29wZToge1xyXG4gICAgICAgIGNvbXBhbnk6ICc9Y29tcGFueScsXHJcbiAgICAgICAgZXZlbnQ6ICc9ZXZlbnQnLFxyXG4gICAgICAgIG5vdGlmaWNhdGlvbnM6ICc9bm90aWZpY2F0aW9ucycsXHJcbiAgICAgICAgbWU6ICc9bWUnLFxyXG4gICAgICAgIG1lbWJlcnM6ICc9bWVtYmVycydcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9KTtcclxuIiwicmVxdWlyZSgnLi9jYXJkJyk7IiwicmVxdWlyZSgnLi9pbnB1dCcpIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbERpcmVjdGl2ZXNcclxuICAuZGlyZWN0aXZlKFxyXG4gICAgJ2RhdGVJbnB1dCcsXHJcbiAgICBmdW5jdGlvbihkYXRlRmlsdGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxpbnB1dCB0eXBlPVwiZGF0ZVwiPjwvaW5wdXQ+JyxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsbSwgYXR0cnMsIG5nTW9kZWxDdHJsKSB7XHJcbiAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kZm9ybWF0dGVycy51bnNoaWZ0KGZ1bmN0aW9uIChtb2RlbFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGVGaWx0ZXIobW9kZWxWYWx1ZSwgJ3l5eXktTU0tZGQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRwYXJzZXJzLnVuc2hpZnQoZnVuY3Rpb24odmlld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHZpZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gIH0pIiwidGhlVG9vbERpcmVjdGl2ZXMgPSBhbmd1bGFyLm1vZHVsZShcInRoZVRvb2wuZGlyZWN0aXZlc1wiLCBbXSk7XHJcblxyXG5yZXF1aXJlKFwiLi9jb21tZW50XCIpO1xyXG5yZXF1aXJlKFwiLi9jb21tdW5pY2F0aW9uXCIpO1xyXG5yZXF1aXJlKFwiLi9jb21wYW55XCIpO1xyXG5yZXF1aXJlKFwiLi9kYXRlXCIpO1xyXG5yZXF1aXJlKFwiLi9tYXJrZG93blwiKTtcclxucmVxdWlyZShcIi4vbWVldGluZ1wiKTtcclxucmVxdWlyZShcIi4vc3BlYWtlclwiKTtcclxucmVxdWlyZShcIi4vdGFnXCIpO1xyXG5yZXF1aXJlKFwiLi90b3BpY1wiKTtcclxucmVxdWlyZShcIi4vc2Nyb2xsXCIpO1xyXG5yZXF1aXJlKFwiLi9zdWJzY3JpcHRpb25cIik7XHJcbnJlcXVpcmUoXCIuL21lbWJlclwiKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sRGlyZWN0aXZlc1xyXG4gIC5kaXJlY3RpdmUoJ2NvbXBpbGUnLCBbJyRjb21waWxlJywgZnVuY3Rpb24gKCRjb21waWxlKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgc2NvcGUuJHdhdGNoKFxyXG4gICAgICAgICAgZnVuY3Rpb24oc2NvcGUpIHtcclxuICAgICAgICAgICAgIC8vIHdhdGNoIHRoZSAnY29tcGlsZScgZXhwcmVzc2lvbiBmb3IgY2hhbmdlc1xyXG4gICAgICAgICAgICByZXR1cm4gc2NvcGUuJGV2YWwoYXR0cnMuY29tcGlsZSk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgLy8gd2hlbiB0aGUgJ2NvbXBpbGUnIGV4cHJlc3Npb24gY2hhbmdlc1xyXG4gICAgICAgICAgICAvLyBhc3NpZ24gaXQgaW50byB0aGUgY3VycmVudCBET01cclxuICAgICAgICAgICAgZWxlbWVudC5odG1sKHZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbXBpbGUgdGhlIG5ldyBET00gYW5kIGxpbmsgaXQgdG8gdGhlIGN1cnJlbnRcclxuICAgICAgICAgICAgLy8gc2NvcGUuXHJcbiAgICAgICAgICAgIC8vIE5PVEU6IHdlIG9ubHkgY29tcGlsZSAuY2hpbGROb2RlcyBzbyB0aGF0XHJcbiAgICAgICAgICAgIC8vIHdlIGRvbid0IGdldCBpbnRvIGluZmluaXRlIGxvb3AgY29tcGlsaW5nIG91cnNlbHZlc1xyXG4gICAgICAgICAgICAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpKHNjb3BlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XSkiLCJyZXF1aXJlKCcuL2NvbXBpbGUnKTtcclxucmVxdWlyZSgnLi9tYXJrZG93bicpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xEaXJlY3RpdmVzXHJcbiAgLmRpcmVjdGl2ZSgnbWFya2Rvd24nLCBbJyRjb21waWxlJywgZnVuY3Rpb24gKCRjb21waWxlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgICAgICB2YXIgaHRtbFRleHQgPSBtYXJrZG93bi50b0hUTUwoZWxlbWVudC50ZXh0KCkpO1xyXG4gICAgICAgICAgICBlbGVtZW50Lmh0bWwoaHRtbFRleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgfV0pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG50aGVUb29sRGlyZWN0aXZlcy5kaXJlY3RpdmUoXCJlbWJlZE1lZXRpbmdcIiwgZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB7XHJcbiAgICByZXN0cmljdDogXCJFXCIsXHJcbiAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy9lbWJlZC5odG1sXCIsXHJcbiAgICBjb250cm9sbGVyOiBcIk1lZXRpbmdFbWJlZENvbnRyb2xsZXJcIixcclxuICAgIHNjb3BlOiB7XHJcbiAgICAgIG1lZXRpbmdJZDogXCI9XCIsXHJcbiAgICAgIG1lbWJlcnM6IFwiPVwiXHJcbiAgICB9XHJcbiAgfTtcclxufSk7XHJcbiIsInJlcXVpcmUoXCIuL2VtYmVkXCIpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sRGlyZWN0aXZlc1xyXG4gIC5kaXJlY3RpdmUoJ21lbWJlckNhcmQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN0cmljdDogJ0VBQycsXHJcbiAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvbWVtYmVyL2NhcmQuaHRtbCcsXHJcbiAgICAgIGNvbnRyb2xsZXI6ICdNZW1iZXJFbWJlZENvbnRyb2xsZXInLFxyXG4gICAgICBzY29wZToge1xyXG4gICAgICAgIG1lbWJlcjogJz1tZW1iZXJPYmplY3QnLFxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH0pXHJcbiIsInJlcXVpcmUoJy4vY2FyZC5qcycpOyIsInJlcXVpcmUoXCIuL3Bvc2l0aW9uLmpzXCIpOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudGhlVG9vbERpcmVjdGl2ZXMuZGlyZWN0aXZlKCd3aGVuU2Nyb2xsZWQnLCBbJyR0aW1lb3V0JywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcclxuICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsbSwgYXR0cikge1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coXCJPbiBkaXJlY3RpdmVcIik7XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZyhlbG0pO1xyXG5cclxuICAgIHZhciByYXcgPSBlbG1bMF07XHJcbiAgICAvL2NvbnNvbGUubG9nKHJhdyk7XHJcblxyXG4gICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgIC8vY29uc29sZS5sb2cocmF3LnNjcm9sbFRvcCk7XHJcbiAgICAgIC8vY29uc29sZS5sb2cocmF3LnNjcm9sbEhlaWdodCk7XHJcbiAgICAgIHJhdy5zY3JvbGxUb3AgPSByYXcuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgfSk7XHJcblxyXG4gICAgZWxtLmJpbmQoJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAocmF3LnNjcm9sbFRvcCA8PSAxMDApIHsgLy8gbG9hZCBtb3JlIGl0ZW1zIGJlZm9yZSB5b3UgaGl0IHRoZSB0b3BcclxuICAgICAgICB2YXIgc2ggPSByYXcuc2Nyb2xsSGVpZ2h0XHJcbiAgICAgICAgc2NvcGUuJGFwcGx5KGF0dHIud2hlblNjcm9sbGVkKTtcclxuICAgICAgICByYXcuc2Nyb2xsVG9wID0gcmF3LnNjcm9sbEhlaWdodCAtIHNoO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG59XSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xEaXJlY3RpdmVzXHJcbiAgLmRpcmVjdGl2ZSgnc3BlYWtlckNhcmQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN0cmljdDogJ0FFQycsXHJcbiAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3Mvc3BlYWtlci9jYXJkLmh0bWwnLFxyXG4gICAgICBjb250cm9sbGVyOiAnU3BlYWtlckVtYmVkQ29udHJvbGxlcicsXHJcbiAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgc3BlYWtlcjogJz1zcGVha2VyJyxcclxuICAgICAgICBldmVudDogJz1ldmVudCcsXHJcbiAgICAgICAgbm90aWZpY2F0aW9uczogJz1ub3RpZmljYXRpb25zJyxcclxuICAgICAgICBtZTogJz1tZScsXHJcbiAgICAgICAgbWVtYmVyczogJz1tZW1iZXJzJ1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH0pO1xyXG4iLCJhcmd1bWVudHNbNF1bNTZdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKSIsInJlcXVpcmUoJy4vc3Vic2NyaXB0aW9uJyk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbERpcmVjdGl2ZXNcclxuICAuZGlyZWN0aXZlKCdzdWJzY3JpcHRpb24nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN0cmljdDogJ0VBQycsXHJcbiAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3Mvc3Vic2NyaXB0aW9uL2J1dHRvbi5odG1sJyxcclxuICAgICAgY29udHJvbGxlcjogJ1N1YnNjcmlwdGlvbkNvbnRyb2xsZXInLFxyXG4gICAgICBzY29wZToge1xyXG4gICAgICAgIHRocmVhZDogJ0AnXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSkiLCJhcmd1bWVudHNbNF1bNDNdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudGhlVG9vbERpcmVjdGl2ZXNcclxuICAuZGlyZWN0aXZlKFwidGFnTWFuYWdlclwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN0cmljdDogXCJFXCIsXHJcbiAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3RhZy9tYW5hZ2VyLmh0bWxcIixcclxuICAgICAgY29udHJvbGxlcjogXCJUYWdNYW5hZ2VyQ29udHJvbGxlclwiLFxyXG4gICAgICBzY29wZToge1xyXG4gICAgICAgIHRhZ3M6IFwiPXRhZ3NBcnJheVwiLFxyXG4gICAgICAgIHNlYXJjaDogXCI9XCJcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9KVxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnRoZVRvb2xEaXJlY3RpdmVzLmRpcmVjdGl2ZShcInRvcGljQ2FyZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHJlc3RyaWN0OiBcIkVcIixcclxuICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy90b3BpYy9jYXJkLmh0bWxcIixcclxuICAgIGNvbnRyb2xsZXI6IFwiVG9waWNFbWJlZENvbnRyb2xsZXJcIixcclxuICAgIHNjb3BlOiB7XHJcbiAgICAgIHRvcGljOiBcIj1cIixcclxuICAgICAgbWVtYmVyczogXCI9XCIsXHJcbiAgICAgIG1lOiBcIj1cIixcclxuICAgICAgcm9sZXM6IFwiPVwiLFxyXG4gICAgICB0YWdzOiBcIj1cIixcclxuICAgICAgY29tbWVudHM6IFwiPVwiLFxyXG4gICAgICBub3RpZmljYXRpb25zOiBcIj1cIlxyXG4gICAgfVxyXG4gIH07XHJcbn0pO1xyXG4iLCJyZXF1aXJlKFwiLi90b3BpY1wiKTtcclxucmVxdWlyZShcIi4vY2FyZFwiKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG50aGVUb29sRGlyZWN0aXZlcy5kaXJlY3RpdmUoXCJ0b3BpY1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHJlc3RyaWN0OiBcIkVcIixcclxuICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy90b3BpYy90b3BpYy5odG1sXCIsXHJcbiAgICBjb250cm9sbGVyOiBcIlRvcGljRW1iZWRDb250cm9sbGVyXCIsXHJcbiAgICBzY29wZToge1xyXG4gICAgICB0b3BpYzogXCI9XCIsXHJcbiAgICAgIG1lbWJlcnM6IFwiPVwiLFxyXG4gICAgICBtZTogXCI9XCIsXHJcbiAgICAgIHJvbGVzOiBcIj1cIixcclxuICAgICAgdGFnczogXCI9XCIsXHJcbiAgICAgIGNvbW1lbnRzOiBcIj1cIixcclxuICAgICAgbm90aWZpY2F0aW9uczogXCI9XCJcclxuICAgIH1cclxuICB9O1xyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3RoZVRvb2wuZmlsdGVycycsIFtdKVxyXG4gIC5maWx0ZXIoJ2ludGVycG9sYXRlJywgWyd2ZXJzaW9uJywgZnVuY3Rpb24odmVyc2lvbikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRleHQpIHtcclxuICAgICAgcmV0dXJuIFN0cmluZyh0ZXh0KS5yZXBsYWNlKC9cXCVWRVJTSU9OXFwlL21nLCB2ZXJzaW9uKTtcclxuICAgIH1cclxuICB9XSlcclxuICAuZmlsdGVyKCdmaWx0ZXJFdmVudFN0YXR1cycsIGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqcywgZXZlbnQsIHNlYXJjaCkge1xyXG4gICAgICB2YXIgcmVzdWx0ID0gb2JqcztcclxuICAgICAgcmVzdWx0ID0gb2Jqcy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgIGlmKG8ucGFydGljaXBhdGlvbnMubGVuZ3RoIDw9IDApe1xyXG4gICAgICAgICAgcmV0dXJuIHNlYXJjaC51bmFzc2lnbmVkIHx8IHNlYXJjaC51bmFzc2lnbmVkT25seTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoZXZlbnQgJiYgIXNlYXJjaC51bmFzc2lnbmVkT25seSkge1xyXG4gICAgICAgICAgcmV0dXJuIG8ucGFydGljaXBhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKHApIHtcclxuICAgICAgICAgICAgaWYoc2VhcmNoLnN0YXR1cyAmJiBzZWFyY2guc3RhdHVzICE9PSAnJyAmJiBzZWFyY2gubWVtYmVyICYmIHNlYXJjaC5tZW1iZXIgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHAuZXZlbnQgPT09IGV2ZW50LmlkICYmIHAuc3RhdHVzID09PSBzZWFyY2guc3RhdHVzICYmIHAubWVtYmVyID09PSBzZWFyY2gubWVtYmVyO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoc2VhcmNoLnN0YXR1cyAmJiBzZWFyY2guc3RhdHVzICE9PSAnJykge1xyXG4gICAgICAgICAgICAgIHJldHVybiBwLmV2ZW50ID09PSBldmVudC5pZCAmJiBwLnN0YXR1cyA9PT0gc2VhcmNoLnN0YXR1cztcclxuICAgICAgICAgICAgfSBlbHNlIGlmKHNlYXJjaC5tZW1iZXIgJiYgc2VhcmNoLm1lbWJlciAhPT0gJycpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gcC5ldmVudCA9PT0gZXZlbnQuaWQgJiYgcC5tZW1iZXIgPT09IHNlYXJjaC5tZW1iZXI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHAuZXZlbnQgPT09IGV2ZW50LmlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KS5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gIH0pXHJcbiAgLmZpbHRlcignZmlsdGVyUm9sZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG1lbWJlcnMsIHJvbGUpIHtcclxuICAgICAgICAgIHZhciByZXN1bHQgPSBtZW1iZXJzO1xyXG4gICAgICAgICAgaWYocm9sZSkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBtZW1iZXJzLmZpbHRlcihmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG0ucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByLmlkID09IHJvbGU7XHJcbiAgICAgICAgICAgICAgfSkubGVuZ3RoID4gMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9O1xyXG4gIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xTZXJ2aWNlc1xyXG4gIC5mYWN0b3J5KCdDaGF0RmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIENoYXQ6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NoYXQvOmlkJywgbnVsbCwge1xyXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxyXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfVxyXG4gICAgICB9KSxcclxuICAgICAgTWVzc2FnZTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY2hhdC86aWQvbWVzc2FnZXMnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLGlzQXJyYXk6dHJ1ZX1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xTZXJ2aWNlc1xyXG4gIC5mYWN0b3J5KCdDb21tZW50RmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIENvbW1lbnQ6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NvbW1lbnQvOmlkJywgbnVsbCwge1xyXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXHJcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcclxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcclxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XHJcbiAgICAgIH0pLFxyXG4gICAgICBDb21wYW55OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21wYW55LzppZC9jb21tZW50cycsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XHJcbiAgICAgIH0pLFxyXG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9zcGVha2VyLzppZC9jb21tZW50cycsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XHJcbiAgICAgIH0pLFxyXG4gICAgICBUb3BpYzogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvdG9waWMvOmlkL2NvbW1lbnRzJywgbnVsbCwge1xyXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cclxuICAgICAgfSksXHJcbiAgICAgIENvbW11bmljYXRpb246ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NvbW11bmljYXRpb24vOmlkL2NvbW1lbnRzJywgbnVsbCwge1xyXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xTZXJ2aWNlc1xyXG4gIC5mYWN0b3J5KCdDb21tdW5pY2F0aW9uRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIENvbW11bmljYXRpb246ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NvbW11bmljYXRpb24vOmlkJywgbnVsbCwge1xyXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXHJcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcclxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcclxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XHJcbiAgICAgIH0pLFxyXG4gICAgICBDb21wYW55OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21wYW55LzppZC9jb21tdW5pY2F0aW9ucycsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XHJcbiAgICAgIH0pLFxyXG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9zcGVha2VyLzppZC9jb21tdW5pY2F0aW9ucycsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XHJcbiAgICAgIH0pXHJcbiAgICB9O1xyXG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbFNlcnZpY2VzXHJcbiAgLmZhY3RvcnkoJ0NvbXBhbnlGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgQ29tcGFueTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tcGFueS86aWQnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9LFxyXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXHJcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXHJcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxyXG4gICAgICB9KSxcclxuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9tZW1iZXIvOmlkL2NvbXBhbmllcycsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6dHJ1ZX1cclxuICAgICAgfSlcclxuICAgIH07XHJcbiAgfSkiLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sU2VydmljZXNcclxuICAuZmFjdG9yeSgnRW1haWxGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgQ29tcGFueTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tcGFueS86aWQvc2VuZEluaXRpYWxFbWFpbCcsIG51bGwsIHtcclxuICAgICAgICAnc2VuZCc6IHttZXRob2Q6ICdQT1NUJ31cclxuICAgICAgfSksXHJcbiAgICAgIFNwZWFrZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3NwZWFrZXIvOmlkL3NlbmRJbml0aWFsRW1haWwnLCBudWxsLCB7XHJcbiAgICAgICAgJ3NlbmQnOiB7bWV0aG9kOiAnUE9TVCd9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSkiLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sU2VydmljZXNcclxuICAuZmFjdG9yeSgnRXZlbnRGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgRXZlbnQ6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2V2ZW50LzppZCcsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxyXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXHJcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXHJcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pIiwidGhlVG9vbFNlcnZpY2VzID0gYW5ndWxhci5tb2R1bGUoJ3RoZVRvb2wuc2VydmljZXMnLCBbJ25nUmVzb3VyY2UnXSk7XHJcblxyXG5yZXF1aXJlKCcuL2NoYXQnKTtcclxucmVxdWlyZSgnLi9jb21tZW50Jyk7XHJcbnJlcXVpcmUoJy4vY29tbXVuaWNhdGlvbicpO1xyXG5yZXF1aXJlKCcuL2NvbXBhbnknKTtcclxucmVxdWlyZSgnLi9lbWFpbCcpO1xyXG5yZXF1aXJlKCcuL21lZXRpbmcnKTtcclxucmVxdWlyZSgnLi9tZW1iZXInKTtcclxucmVxdWlyZSgnLi9tZXNzYWdlJyk7XHJcbnJlcXVpcmUoJy4vbm90aWZpY2F0aW9uJyk7XHJcbnJlcXVpcmUoJy4vcm9sZScpO1xyXG5yZXF1aXJlKCcuL3Nlc3Npb24nKTtcclxucmVxdWlyZSgnLi9zb2NrZXQnKTtcclxucmVxdWlyZSgnLi9zcGVha2VyJyk7XHJcbnJlcXVpcmUoJy4vc3Vic2NyaXB0aW9uJyk7XHJcbnJlcXVpcmUoJy4vdGFnJyk7XHJcbnJlcXVpcmUoJy4vdG9waWMnKTtcclxucmVxdWlyZSgnLi9ldmVudCcpO1xyXG5yZXF1aXJlKCcuL2l0ZW0nKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbFNlcnZpY2VzXHJcbiAgLmZhY3RvcnkoJ0l0ZW1GYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgSXRlbTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvaXRlbS86aWQnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcclxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxyXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxyXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xTZXJ2aWNlc1xyXG4gIC5mYWN0b3J5KCdNZWV0aW5nRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgIHJldHVybiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9tZWV0aW5nLzppZCcsIG51bGwsIHtcclxuICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcclxuICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXHJcbiAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXHJcbiAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cclxuICAgIH0pO1xyXG4gIH0pXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xTZXJ2aWNlc1xyXG4gIC5mYWN0b3J5KCdNZW1iZXJGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9tZW1iZXIvOmlkJywgbnVsbCwge1xyXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfSxcclxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxyXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxyXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cclxuICAgICAgfSksXHJcbiAgICAgIFJvbGU6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3JvbGUvOmlkL21lbWJlcnMnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxyXG4gICAgICB9KSxcclxuICAgICAgTWU6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL215c2VsZicsIG51bGwsIHtcclxuICAgICAgICAnZ2V0Jzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IGZhbHNlfVxyXG4gICAgICB9KVxyXG4gICAgfTtcclxuICB9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xTZXJ2aWNlc1xyXG4gIC5mYWN0b3J5KCdNZXNzYWdlRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgIHJldHVybiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9tZXNzYWdlLzppZCcsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzogICAge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XHJcbiAgICAgIH0pXHJcbiAgfSkiLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sU2VydmljZXMuZmFjdG9yeSgnTm90aWZpY2F0aW9uRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICByZXR1cm4ge1xyXG4gICAgTm90aWZpY2F0aW9uOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9ub3RpZmljYXRpb24vOmlkJywgbnVsbCwge1xyXG4gICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxyXG4gICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9XHJcbiAgICB9KSxcclxuICAgIENvbXBhbnk6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NvbXBhbnkvOmlkL25vdGlmaWNhdGlvbnMnLCBudWxsLCB7XHJcbiAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cclxuICAgIH0pLFxyXG4gICAgU3BlYWtlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvc3BlYWtlci86aWQvbm90aWZpY2F0aW9ucycsIG51bGwsIHtcclxuICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxyXG4gICAgfSksXHJcbiAgICBUb3BpYzogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvdG9waWMvOmlkL25vdGlmaWNhdGlvbnMnLCBudWxsLCB7XHJcbiAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cclxuICAgIH0pXHJcbiAgfTtcclxufSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xTZXJ2aWNlc1xyXG4gIC5mYWN0b3J5KCdSb2xlRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIFJvbGU6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3JvbGUvOmlkJywgbnVsbCwge1xyXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXHJcbiAgICAgIH0pLFxyXG4gICAgICBNZW1iZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3JvbGUvOmlkL21lbWJlcnMnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxyXG4gICAgICB9KVxyXG4gICAgfTtcclxuICB9KVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sU2VydmljZXNcclxuICAuZmFjdG9yeSgnU2Vzc2lvbkZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBTZXNzaW9uOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9zZXNzaW9uLzppZCcsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxyXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXHJcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXHJcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxyXG4gICAgICB9KSxcclxuICAgICAgQ29tcGFueTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tcGFueS86aWQvc2Vzc2lvbnMnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxyXG4gICAgICB9KSxcclxuICAgICAgU3BlYWtlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvc3BlYWtlci86aWQvc2Vzc2lvbnMnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbFNlcnZpY2VzXHJcbiAgLmZhY3RvcnkoJ1NvY2tldEZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlLCAkbG9jYXRpb24sICRyb290U2NvcGUpIHtcclxuICAgIHZhciBzb2NrZXQ7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBjb25uZWN0OiBmdW5jdGlvbihuc3ApIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHNvY2tldCk7XHJcbiAgICAgICAgc29ja2V0ID0gaW8uY29ubmVjdChuc3AsIHttdWx0aXBsZXg6IGZhbHNlfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIG9uOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHNvY2tldC5vbihldmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseShzb2NrZXQsIGFyZ3MpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVtaXQ6IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgc29ja2V0LmVtaXQoZXZlbnROYW1lLCBkYXRhLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoc29ja2V0LCBhcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGRpc2Nvbm5lY3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzb2NrZXQuZGlzY29ubmVjdCgpO1xyXG4gICAgICB9LFxyXG4gICAgICBzb2NrZXQ6IHNvY2tldFxyXG4gICAgfTtcclxuICB9KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbFNlcnZpY2VzXHJcbiAgLmZhY3RvcnkoJ1NwZWFrZXJGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgU3BlYWtlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvc3BlYWtlci86aWQnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9LFxyXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXHJcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXHJcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxyXG4gICAgICB9KSxcclxuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9tZW1iZXIvOmlkL3NwZWFrZXJzJywgbnVsbCwge1xyXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfVxyXG4gICAgICB9KVxyXG4gICAgfTtcclxuICB9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudGhlVG9vbFNlcnZpY2VzLmZhY3RvcnkoXCJTdWJzY3JpcHRpb25GYWN0b3J5XCIsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICByZXR1cm4ge1xyXG4gICAgQ29tcGFueTogJHJlc291cmNlKHVybF9wcmVmaXggKyBcIi9hcGkvY29tcGFueS86aWQvc3Vic2NyaXB0aW9uXCIsIG51bGwsIHtcclxuICAgICAgXCJnZXRcIjoge21ldGhvZDogXCJHRVRcIn0sXHJcbiAgICAgIFwiYWRkXCI6IHttZXRob2Q6IFwiUE9TVFwifSxcclxuICAgICAgXCJyZW1vdmVcIjoge21ldGhvZDogXCJERUxFVEVcIn1cclxuICAgIH0pLFxyXG4gICAgU3BlYWtlcjogJHJlc291cmNlKHVybF9wcmVmaXggKyBcIi9hcGkvc3BlYWtlci86aWQvc3Vic2NyaXB0aW9uXCIsIG51bGwsIHtcclxuICAgICAgXCJnZXRcIjoge21ldGhvZDogXCJHRVRcIn0sXHJcbiAgICAgIFwiYWRkXCI6IHttZXRob2Q6IFwiUE9TVFwifSxcclxuICAgICAgXCJyZW1vdmVcIjoge21ldGhvZDogXCJERUxFVEVcIn1cclxuICAgIH0pLFxyXG4gICAgVG9waWM6ICRyZXNvdXJjZSh1cmxfcHJlZml4ICsgXCIvYXBpL3RvcGljLzppZC9zdWJzY3JpcHRpb25cIiwgbnVsbCwge1xyXG4gICAgICBcImdldFwiOiB7bWV0aG9kOiBcIkdFVFwifSxcclxuICAgICAgXCJhZGRcIjoge21ldGhvZDogXCJQT1NUXCJ9LFxyXG4gICAgICBcInJlbW92ZVwiOiB7bWV0aG9kOiBcIkRFTEVURVwifVxyXG4gICAgfSlcclxuICB9O1xyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbFNlcnZpY2VzXHJcbiAgLmZhY3RvcnkoJ1RhZ0ZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBUYWc6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3RhZy86aWQnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcclxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxyXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxyXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cclxuICAgICAgfSksXHJcbiAgICAgIFRvcGljOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS90YWcvOmlkL3RvcGljcycsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XHJcbiAgICAgIH0pXHJcbiAgICB9O1xyXG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbFNlcnZpY2VzXHJcbiAgLmZhY3RvcnkoJ1RvcGljRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIFRvcGljOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS90b3BpYy86aWQnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcclxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcclxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxyXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cclxuICAgICAgfSksXHJcbiAgICAgIE1lbWJlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvbWVtYmVyLzppZC90b3BpY3MnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHsgbWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZSB9XHJcbiAgICAgIH0pXHJcbiAgICB9O1xyXG4gIH0pXHJcbiIsInVybF9wcmVmaXggPSByZXF1aXJlKCcuLy4uLy4uL2NvbmZpZycpLnVybDtcclxuXHJcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9hcHAuanMnKTtcclxucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzJyk7XHJcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9kaXJlY3RpdmVzJyk7XHJcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9maWx0ZXJzJyk7XHJcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9zZXJ2aWNlcycpOyIsInZhciBwcm9jZXNzPXJlcXVpcmUoXCJfX2Jyb3dzZXJpZnlfcHJvY2Vzc1wiKTt2YXIgY29uZmlnID0ge1xyXG4gIHVybDogcHJvY2Vzcy5lbnYuRVZFTlRERUNLX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcclxuICBwb3J0OiBwcm9jZXNzLmVudi5FVkVOVERFQ0tfUE9SVCB8fCA4MDgwLFxyXG59O1xyXG5cclxuY29uZmlnLm1vbmdvID0ge1xyXG4gIHVybDogcHJvY2Vzcy5lbnYuRVZFTlRERUNLX01PTkdPX1VSTCB8fCAnbW9uZ29kYjovL2xvY2FsaG9zdC9zaW5mbydcclxufTtcclxuXHJcbmNvbmZpZy5jb29raWUgPSB7XHJcbiAgbmFtZTogcHJvY2Vzcy5lbnYuRVZFTlRERUNLX0NPT0tJRV9OQU1FIHx8ICdldmVudGRlY2snLFxyXG4gIHBhc3N3b3JkOiBwcm9jZXNzLmVudi5FVkVOVERFQ0tfQ09PS0lFX1BBU1NXT1JEIHx8ICdZT1VSIENPT0tJRSBQQVNTV09SRCdcclxufTtcclxuXHJcbmNvbmZpZy5tYWlsZ3VuID0ge1xyXG4gIGVtYWlsOiBwcm9jZXNzLmVudi5FVkVOVERFQ0tfTUFJTEdVTl9FTUFJTCB8fCAnZGVja0BzaW5mby5vcmcnLFxyXG4gIGFwaTogcHJvY2Vzcy5lbnYuRVZFTlRERUNLX01BSUxHVU5fQVBJIHx8ICdZT1VSIE1BSUxHVU4gS0VZJyxcclxuICBwdWJsaWNBcGk6IHByb2Nlc3MuZW52LkVWRU5UREVDS19NQUlMR1VOX1BVQkxJQ19BUEkgfHwgJ1lPVVIgTUFJTEdVTiBQVUJMSUMgS0VZJ1xyXG59O1xyXG5cclxuY29uZmlnLmZhY2Vib29rID0ge1xyXG4gIGFwcElkOiBwcm9jZXNzLmVudi5FVkVOVERFQ0tfRkFDRUJPT0tfQVBQX0lEIHx8ICc0NTcyMDc1MDc3NDQxNTknLFxyXG4gIGFwcFNlY3JldDogcHJvY2Vzcy5lbnYuRVZFTlRERUNLX0ZBQ0VCT09LX0FQUF9TRUNSRVQgfHwgJzlmMDI3YzUyZTAwYmMzYWRiYWJjZDkyNmEzYzk1Yjk3J1xyXG59O1xyXG5cclxuY29uZmlnLmJ1bnlhbiA9IHtcclxuICBuYW1lOiByZXF1aXJlKCcuL3BhY2thZ2UuanNvbicpLm5hbWUsXHJcbiAgbGV2ZWw6IHByb2Nlc3MuZW52LkVWRU5UREVDS19MT0dfTEVWRUwgfHwgJ3RyYWNlJ1xyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY29uZmlnO1xyXG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cz17XHJcbiAgXCJuYW1lXCI6IFwiZXZlbnRkZWNrXCIsXHJcbiAgXCJ2ZXJzaW9uXCI6IFwiMC4wLjBcIixcclxuICBcImRlc2NyaXB0aW9uXCI6IFwiZXZlbnRkZWNrID09PT09PT09XCIsXHJcbiAgXCJtYWluXCI6IFwiaW5kZXguanNcIixcclxuICBcInNjcmlwdHNcIjoge1xyXG4gICAgXCJzdGFydFwiOiBcIm5vZGUgc2VydmVyQXBwL2luZGV4LmpzIHwgYnVueWFuXCIsXHJcbiAgICBcIm1vblwiOiBcIm5vZGVfbW9kdWxlcy8uYmluL25vZGVtb24gc2VydmVyQXBwL2luZGV4LmpzIHwgYnVueWFuXCIsXHJcbiAgICBcImRpc3RcIjogXCJub2RlX21vZHVsZXMvLmJpbi9icm93c2VyaWZ5IC10IGJyZnMgLS1kZWJ1ZyAtZSBjbGllbnRBcHAvanMvdGhlVG9vbC5qcyAtbyBwdWJsaWMvanMvdGhlVG9vbC5qc1wiLFxyXG4gICAgXCJ0ZXN0XCI6IFwiZWNobyBcXFwiRXJyb3I6IG5vIHRlc3Qgc3BlY2lmaWVkXFxcIiAmJiBleGl0IDFcIlxyXG4gIH0sXHJcbiAgXCJyZXBvc2l0b3J5XCI6IHtcclxuICAgIFwidHlwZVwiOiBcImdpdFwiLFxyXG4gICAgXCJ1cmxcIjogXCJnaXQ6Ly9naXRodWIuY29tL1NJTkZPL2V2ZW50ZGVjay5naXRcIlxyXG4gIH0sXHJcbiAgXCJhdXRob3JcIjogXCJGcmFuY2lzY28gRGlhcyA8ZnJhbmNpc2NvQGJhaW9kaWFzLmNvbT4gKGh0dHA6Ly9mcmFuY2lzY29kaWFzLm5ldC8pXCIsXHJcbiAgXCJsaWNlbnNlXCI6IFwiQlNELTItQ2xhdXNlXCIsXHJcbiAgXCJidWdzXCI6IHtcclxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL1NJTkZPL2V2ZW50ZGVjay9pc3N1ZXNcIlxyXG4gIH0sXHJcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9TSU5GTy9ldmVudGRlY2tcIixcclxuICBcImRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcImNyb25cIjogXCJ+MS4wLjRcIixcclxuICAgIFwiaGFwaVwiOiBcIn4zLjAuMFwiLFxyXG4gICAgXCJoYXBpLWF1dGgtY29va2llXCI6IFwifjEuMC4yXCIsXHJcbiAgICBcImhhbmRsZWJhcnNcIjogXCJ+Mi4wLjAtYWxwaGEuMlwiLFxyXG4gICAgXCJhc3luY1wiOiBcIn4wLjIuOVwiLFxyXG4gICAgXCJtb25nb29zZVwiOiBcIn4zLjguNFwiLFxyXG4gICAgXCJtYXJrZG93blwiOiBcIn4wLjUuMFwiLFxyXG4gICAgXCJlbWFpbGpzXCI6IFwifjAuMy44XCIsXHJcbiAgICBcInNvY2tldC5pb1wiOiBcIn4xLjAuMlwiLFxyXG4gICAgXCJzb2NrZXQuaW8tY2xpZW50XCI6IFwifjEuMC4yXCIsXHJcbiAgICBcInJlcXVlc3RcIjogXCJ+Mi4zNi4wXCIsXHJcbiAgICBcIm1haWxndW5cIjogXCJ+MC40LjJcIixcclxuICAgIFwibWFpbGNvbXBvc2VyXCI6IFwifjAuMi4xMlwiLFxyXG4gICAgXCJidW55YW5cIjogXCJ+MS4wLjFcIlxyXG4gIH0sXHJcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJub2RlbW9uXCI6IFwifjAuNy4xMFwiLFxyXG4gICAgXCJjb2xvcnNcIjogXCJ+MC42LjJcIixcclxuICAgIFwiZ2F6ZVwiOiBcIn4wLjQuM1wiLFxyXG4gICAgXCJicmZzXCI6IFwiMC4wLjhcIixcclxuICAgIFwiYnJvd3NlcmlmeVwiOiBcIn4zLjIwLjBcIixcclxuICAgIFwidGFibGV0b3BcIjogXCJ+MS4zLjNcIlxyXG4gIH1cclxufVxyXG4iXX0=
