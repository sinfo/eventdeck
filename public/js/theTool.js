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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9hcHAuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9hZG1pbi9pbmRleC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2F1dGgvaW5kZXguanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9hdXRoL2ludGVyY2VwdG9yLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvYXV0aC9sb2dpbi5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NoYXQvY2hhdC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NoYXQvaW5kZXguanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jaGF0L2xpc3QuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tZW50L2FyZWEuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tZW50L2ZpcnN0LmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbWVudC9pbmRleC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW11bmljYXRpb24vYXJlYS5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW11bmljYXRpb24vZW1iZWQuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tdW5pY2F0aW9uL2luZGV4LmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbXVuaWNhdGlvbi9saXN0LmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9jb21wYW55LmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9jb25maXJtLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9jcmVhdGUuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21wYW55L2VtYmVkLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9pbmRleC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvbGlzdC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2luZGV4LmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWFpbi9ob21lLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWFpbi9pbmRleC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21haW4vbWFpbi5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lZXRpbmcvZW1iZWQuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZWV0aW5nL2luZGV4LmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVldGluZy9saXN0LmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVldGluZy9tZWV0aW5nLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVtYmVyL2NyZWF0ZS5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lbWJlci9lbWJlZC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lbWJlci9pbmRleC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lbWJlci9saXN0LmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVtYmVyL21lbWJlci5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvY29uZmlybS5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvY3JlYXRlLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvc3BlYWtlci9lbWJlZC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvaW5kZXguanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2xpc3QuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL3NwZWFrZXIuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zdWJzY3JpcHRpb24vZW1iZWQuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zdWJzY3JpcHRpb24vaW5kZXguanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90YWcvaW5kZXguanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90YWcvbWFuYWdlci5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3RvcGljL2VtYmVkLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdG9waWMvaW5kZXguanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90b3BpYy9saXN0LmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdG9waWMvdG9waWMuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbW1lbnQvYXJlYS5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbWVudC9maXJzdC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbWVudC9pbmRleC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbXVuaWNhdGlvbi9hcmVhLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9jb21tdW5pY2F0aW9uL2NvbW11bmljYXRpb24uanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbW11bmljYXRpb24vaW5kZXguanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbXBhbnkvY2FyZC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tcGFueS9pbmRleC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvZGF0ZS9pbmRleC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvZGF0ZS9pbnB1dC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvaW5kZXguanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21hcmtkb3duL2NvbXBpbGUuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21hcmtkb3duL2luZGV4LmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9tYXJrZG93bi9tYXJrZG93bi5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWVldGluZy9lbWJlZC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWVldGluZy9pbmRleC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWVtYmVyL2NhcmQuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21lbWJlci9pbmRleC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvc2Nyb2xsL2luZGV4LmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9zY3JvbGwvcG9zaXRpb24uanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3NwZWFrZXIvY2FyZC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvc3BlYWtlci9pbmRleC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvc3Vic2NyaXB0aW9uL2luZGV4LmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9zdWJzY3JpcHRpb24vc3Vic2NyaXB0aW9uLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy90YWcvaW5kZXguanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3RhZy9tYW5hZ2VyLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy90b3BpYy9jYXJkLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy90b3BpYy9pbmRleC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvdG9waWMvdG9waWMuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9maWx0ZXJzL2luZGV4LmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvY2hhdC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2NvbW1lbnQuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9jb21tdW5pY2F0aW9uLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvY29tcGFueS5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2VtYWlsLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvZXZlbnQuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9pbmRleC5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2l0ZW0uanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9tZWV0aW5nLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvbWVtYmVyLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvbWVzc2FnZS5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL25vdGlmaWNhdGlvbi5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL3JvbGUuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9zZXNzaW9uLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvc29ja2V0LmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvc3BlYWtlci5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL3N1YnNjcmlwdGlvbi5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL3RhZy5qcyIsIi9Vc2Vycy90b3JyZS9Eb2N1bWVudHMvRGV2ZWxvcG1lbnQvU0lORk8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL3RvcGljLmpzIiwiL1VzZXJzL3RvcnJlL0RvY3VtZW50cy9EZXZlbG9wbWVudC9TSU5GTy9ldmVudGRlY2svY2xpZW50QXBwL2pzL3RoZVRvb2wuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9jb25maWcuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvVXNlcnMvdG9ycmUvRG9jdW1lbnRzL0RldmVsb3BtZW50L1NJTkZPL2V2ZW50ZGVjay9wYWNrYWdlLmpzb24iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1S0E7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaldBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTs7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdRQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTs7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTs7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyLm1vZHVsZShcInRoZVRvb2xcIiwgW1xuICBcIm5nXCIsXG4gIFwibmdSb3V0ZVwiLFxuICBcIm5nU2FuaXRpemVcIixcbiAgXCJuZ1RvdWNoXCIsXG4gIFwiaW5maW5pdGUtc2Nyb2xsXCIsXG4gIFwidW5zYXZlZENoYW5nZXNcIixcbiAgXCJsdWVnZy5kaXJlY3RpdmVzXCIsXG4gIFwibmdBdWRpb1wiLFxuICBcInRoZVRvb2wuZmlsdGVyc1wiLFxuICBcInRoZVRvb2wuc2VydmljZXNcIixcbiAgXCJ0aGVUb29sLmRpcmVjdGl2ZXNcIixcbiAgXCJ0aGVUb29sLmNvbnRyb2xsZXJzXCJcbl0pLlxuY29uZmlnKFtcIiRyb3V0ZVByb3ZpZGVyXCIsIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvXCIgICAgICAgICAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NoYXQvdmlldy5odG1sXCIsICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ2hhdENvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2FkbWluXCIgICAgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9pbmRleC5odG1sXCIsICAgICAgICAgICBjb250cm9sbGVyOiBcIkFkbWluQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbG9naW5cIiAgICAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2F1dGgvbG9naW4uaHRtbFwiLCAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTG9naW5Db250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9sb2dpbi86aWQvOmNvZGVcIiAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvYXV0aC9sb2dpbi5odG1sXCIsICAgICAgICAgICAgY29udHJvbGxlcjogXCJMb2dpbkNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbmllcy9cIiAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2xpc3QuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbmllc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbmllcy90YWJsZS9cIiAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L3RhYmxlLmh0bWxcIiwgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbmllc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbmllcy9idWRnZXQvXCIgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2J1ZGdldC5odG1sXCIsICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbmllc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvXCIgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2NyZWF0ZS5odG1sXCIsICAgICAgICBjb250cm9sbGVyOiBcIkNyZWF0ZUNvbXBhbnlDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW55LzppZFwiICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tcGFueS92aWV3Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJDb21wYW55Q29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tcGFueS86aWQvZWRpdFwiICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbXBhbnkvZWRpdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ29tcGFueUNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvOmlkL3BhcnRpY2lwYXRpb25zXCIsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L3BhcnRpY2lwYXRpb25zLmh0bWxcIixjb250cm9sbGVyOiBcIkNvbXBhbnlDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW55LzppZC9jb25maXJtXCIgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tcGFueS9jb25maXJtLmh0bWxcIiwgICAgICAgY29udHJvbGxlcjogXCJDb21wYW55RW1haWxDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21tZW50LzppZC9lZGl0XCIgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tbWVudC9lZGl0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJDb21tZW50Q29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvc3BlYWtlcnMvXCIgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3NwZWFrZXIvbGlzdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiU3BlYWtlcnNDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2Vycy90YWJsZS9cIiAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci90YWJsZS5odG1sXCIsICAgICAgICAgY29udHJvbGxlcjogXCJTcGVha2Vyc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL3NwZWFrZXIvXCIgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zcGVha2VyL2NyZWF0ZS5odG1sXCIsICAgICAgICBjb250cm9sbGVyOiBcIkNyZWF0ZVNwZWFrZXJDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyLzppZFwiICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci92aWV3Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJTcGVha2VyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvc3BlYWtlci86aWQvZWRpdFwiICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3NwZWFrZXIvZWRpdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiU3BlYWtlckNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL3NwZWFrZXIvOmlkL3BhcnRpY2lwYXRpb25zXCIsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zcGVha2VyL3BhcnRpY2lwYXRpb25zLmh0bWxcIixjb250cm9sbGVyOiBcIlNwZWFrZXJDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyLzppZC9jb25maXJtXCIgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9jb25maXJtLmh0bWxcIiwgICAgICAgY29udHJvbGxlcjogXCJTcGVha2VyRW1haWxDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZW1iZXJzL1wiICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVtYmVyL2xpc3QuaHRtbFwiLCAgICAgICAgICAgY29udHJvbGxlcjogXCJNZW1iZXJzQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVtYmVyL1wiICAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lbWJlci9jcmVhdGUuaHRtbFwiLCAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ3JlYXRlTWVtYmVyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVtYmVyLzppZFwiICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lbWJlci92aWV3Lmh0bWxcIiwgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVtYmVyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVtYmVyLzppZC9lZGl0XCIgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lbWJlci9lZGl0Lmh0bWxcIiwgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVtYmVyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVldGluZ3NcIiAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lZXRpbmcvbGlzdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVldGluZ3NDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZWV0aW5nLzppZFwiICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy92aWV3Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJNZWV0aW5nQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVldGluZy86aWQvdGV4dFwiICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lZXRpbmcvdGV4dC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVldGluZ0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lZXRpbmcvOmlkL2VkaXRcIiAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZWV0aW5nL2VkaXQuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIk1lZXRpbmdDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jaGF0c1wiICAgICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY2hhdC9saXN0Lmh0bWxcIiwgICAgICAgICAgICAgY29udHJvbGxlcjogXCJDaGF0c0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NoYXQvOmlkXCIgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jaGF0L3ZpZXcuaHRtbFwiLCAgICAgICAgICAgICBjb250cm9sbGVyOiBcIkNoYXRDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi90b3BpY3NcIiAgICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvdG9waWMvbGlzdC5odG1sXCIsICAgICAgICAgICAgY29udHJvbGxlcjogXCJUb3BpY3NDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi90b3BpYy86aWRcIiAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvdG9waWMvdmlldy5odG1sXCIsICAgICAgICAgICAgY29udHJvbGxlcjogXCJUb3BpY0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbW11bmljYXRpb25zLzpraW5kXCIgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21tdW5pY2F0aW9uL2xpc3QuaHRtbFwiLCAgICBjb250cm9sbGVyOiBcIkNvbW11bmljYXRpb25zQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLm90aGVyd2lzZSh7cmVkaXJlY3RUbzogXCIvXCJ9KTtcbn1dKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiQWRtaW5Db250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIEV2ZW50RmFjdG9yeSwgSXRlbUZhY3RvcnkpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgIEV2ZW50RmFjdG9yeS5FdmVudC5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuZXZlbnRzID0gcmVzcG9uc2U7XG4gICAgfSk7XG5cbiAgICBJdGVtRmFjdG9yeS5JdGVtLmdldEFsbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5pdGVtcyA9IHJlc3BvbnNlO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLmFkZEV2ZW50ID0gZnVuY3Rpb24obmV3RXZlbnQpIHtcbiAgICAgIEV2ZW50RmFjdG9yeS5FdmVudC5jcmVhdGUobmV3RXZlbnQsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBFdmVudEZhY3RvcnkuRXZlbnQuZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICRzY29wZS5ldmVudHMgPSByZXNwb25zZTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmFkZEl0ZW0gPSBmdW5jdGlvbihuZXdJdGVtKSB7XG4gICAgICBJdGVtRmFjdG9yeS5JdGVtLmNyZWF0ZShuZXdJdGVtLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgSXRlbUZhY3RvcnkuSXRlbS5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgJHNjb3BlLml0ZW1zID0gcmVzcG9uc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS51cGRhdGVFdmVudCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgRXZlbnRGYWN0b3J5LkV2ZW50LnVwZGF0ZSh7aWQ6IGV2ZW50LmlkfSwgZXZlbnQsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgIHJldHVybiAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5lZGl0aW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnVwZGF0ZUl0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgSXRlbUZhY3RvcnkuSXRlbS51cGRhdGUoe2lkOiBpdGVtLmlkfSwgaXRlbSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgaXRlbS5lZGl0aW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmRlbGV0ZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBFdmVudEZhY3RvcnkuRXZlbnQuZGVsZXRlKHtpZDogZXZlbnQuaWR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIEV2ZW50RmFjdG9yeS5FdmVudC5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgJHNjb3BlLmV2ZW50cyA9IHJlc3BvbnNlO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuZGVsZXRlSXRlbSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICBJdGVtRmFjdG9yeS5JdGVtLmRlbGV0ZSh7aWQ6IGl0ZW0uaWR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIEl0ZW1GYWN0b3J5Lkl0ZW0uZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICRzY29wZS5pdGVtcyA9IHJlc3BvbnNlO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgfVxufSk7XG4iLCJyZXF1aXJlKFwiLi9sb2dpblwiKTtcbnJlcXVpcmUoJy4vaW50ZXJjZXB0b3InKTtcbiIsInRoZVRvb2xDb250cm9sbGVyLmNvbmZpZyhmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xuICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFsnJGluamVjdG9yJywgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xuICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcbiAgfV0pO1xufSk7XG5cbnRoZVRvb2xDb250cm9sbGVyLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkbG9jYXRpb24sICR3aW5kb3cpIHtcbiAgcmV0dXJuIHtcbiAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAkcm9vdFNjb3BlLnVwZGF0ZS5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIGlmKCRsb2NhdGlvbi5wYXRoKCkuaW5kZXhPZignL2xvZ2luJykgPT0gLTEpIHtcbiAgICAgICAgICAkcm9vdFNjb3BlLm5leHRQYXRoID0gJyMnICsgJGxvY2F0aW9uLnBhdGgoKTtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2xvZ2luJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZmFjZWJvb2tDb25maWcgPSByZXF1aXJlKCcuLy4uLy4uLy4uLy4uLy4uL2NvbmZpZycpLmZhY2Vib29rO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTG9naW5Db250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uLCAkaHR0cCwgJHdpbmRvdykge1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICQuYWpheFNldHVwKHtjYWNoZTogdHJ1ZX0pO1xuICAkLmdldFNjcmlwdChcIi8vY29ubmVjdC5mYWNlYm9vay5uZXQvcHRfUFQvYWxsLmpzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBGQi5pbml0KHthcHBJZDogZmFjZWJvb2tDb25maWcuYXBwSWR9KTtcbiAgfSk7XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgJHNjb3BlLnNob3dJZElucHV0ID0gdHJ1ZTtcbiAgJHNjb3BlLnNob3dDb2RlSW5wdXQgPSBmYWxzZTtcblxuICBpZigkc2NvcGUubWUuaWQpIHtcbiAgICAvLyRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgJHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oJy8nKTtcbiAgfVxuXG4gIHZhciBsb2NrID0gZmFsc2U7XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLmZhY2Vib29rTG9naW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLmJhbmFuYSA9IHRydWU7XG5cbiAgXHRpZiAobG9jaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvY2sgPSB0cnVlO1xuXG4gICAgRkIuZ2V0TG9naW5TdGF0dXMoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSBcImNvbm5lY3RlZFwiKSB7XG4gICAgICAgIGNvbm5lY3RlZChyZXNwb25zZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgRkIubG9naW4oZnVuY3Rpb24gKCkge30sIHtkaXNwbGF5OiBcInBvcHVwXCJ9KTtcbiAgICAgICAgRkIuRXZlbnQuc3Vic2NyaWJlKFwiYXV0aC5zdGF0dXNDaGFuZ2VcIiwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gXCJjb25uZWN0ZWRcIikge1xuICAgICAgICAgICAgY29ubmVjdGVkKHJlc3BvbnNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxvY2sgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGNvbm5lY3RlZChyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmNvbm5lY3RlZCA9IHRydWU7XG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAkc2NvcGUubG9naW5JbmZvID0gXCJMb2dnaW5nIGluLi4uXCI7XG5cbiAgICAgICRodHRwLmdldCh1cmxfcHJlZml4ICsgJy9hcGkvbG9naW4vZmFjZWJvb2s/aWQ9JytyZXNwb25zZS5hdXRoUmVzcG9uc2UudXNlcklEKycmdG9rZW49JytyZXNwb25zZS5hdXRoUmVzcG9uc2UuYWNjZXNzVG9rZW4pLlxuICAgICAgICBzdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgLy8kbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgICAgIGlmKHR5cGVvZiAkcm9vdFNjb3BlLm5leHRQYXRoID09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmFzc2lnbignIycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oJHJvb3RTY29wZS5uZXh0UGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICAgICRyb290U2NvcGUudXBkYXRlLmFsbCgpO1xuICAgICAgICB9KS5cbiAgICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJFUlJPUlwiLCBkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5zZW5kRW1haWwgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgJHNjb3BlLmxvZ2luSW5mbyA9IFwiU2VuZGluZyBlbWFpbC4uLlwiO1xuICAgICRzY29wZS5zaG93SWRJbnB1dCA9IGZhbHNlO1xuICAgIC8vY29uc29sZS5sb2coXCJTZW5kaW5nIGVtYWlsLi4uXCIpO1xuXG4gICAgJGh0dHAuZ2V0KHVybF9wcmVmaXggKyAnL2FwaS9sb2dpbi8nICsgbWVtYmVySWQpLlxuICAgICAgc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICBpZihkYXRhLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBzZXRJbmZvKFwiVGhlcmUgd2FzIGFuIGVycm9yLi4uXCIpO1xuICAgICAgICAgICRzY29wZS5zaG93SWRJbnB1dCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHNldEluZm8oXCJFbWFpbCBzZW50IVwiKTtcbiAgICAgICAgJHNjb3BlLnNob3dDb2RlSW5wdXQgPSB0cnVlO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiRW1haWwgc2VudCFcIilcbiAgICAgIH0pLlxuICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgc2V0SW5mbyhcIlRoZXJlIHdhcyBhbiBlcnJvci4uLlwiKTtcbiAgICAgICAgJHNjb3BlLnNob3dJZElucHV0ID0gdHJ1ZTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkVSUk9SXCIsIGRhdGEpO1xuICAgICAgfSk7XG4gIH1cblxuICAkc2NvcGUuc3VibWl0Q29kZSA9IGZ1bmN0aW9uIChtZW1iZXJJZCwgbWVtYmVyQ29kZSkge1xuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAkc2NvcGUubG9naW5JbmZvID0gXCJWZXJpZnlpbmcgY29kZS4uLlwiO1xuICAgICRzY29wZS5zaG93Q29kZUlucHV0ID0gZmFsc2U7XG5cbiAgICAkaHR0cC5nZXQodXJsX3ByZWZpeCArICcvYXBpL2xvZ2luLycgKyBtZW1iZXJJZCArICcvJyArIG1lbWJlckNvZGUpLlxuICAgICAgc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICBpZihkYXRhLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBzZXRJbmZvKFwiVGhlcmUgd2FzIGFuIGVycm9yLi4uXCIpO1xuICAgICAgICAgICRzY29wZS5zaG93SWRJbnB1dCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5sb2dpbkluZm8gPSBcIlN1Y2Nlc3MhXCI7XG4gICAgICAgICR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcvJyk7XG4gICAgICAgIC8vJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgIH0pLlxuICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgc2V0SW5mbyhcIlRoZXJlIHdhcyBhbiBlcnJvci4uLlwiKTtcbiAgICAgICAgJHNjb3BlLnNob3dJZElucHV0ID0gdHJ1ZTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0SW5mbyhtZXNzYWdlKSB7XG4gICAgJHNjb3BlLmxvZ2luSW5mbyA9IG1lc3NhZ2U7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpeyRzY29wZS5sb2dpbkluZm89XCJcIn0sIDIwMDApO1xuICB9XG5cbiAgaWYgKCRyb3V0ZVBhcmFtcy5pZCAmJiAkcm91dGVQYXJhbXMuY29kZSkge1xuICAgICRzY29wZS5zdWJtaXRDb2RlKCRyb3V0ZVBhcmFtcy5pZCwgJHJvdXRlUGFyYW1zLmNvZGUpXG4gIH1cblxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoJ0NoYXRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgbmdBdWRpbywgU29ja2V0RmFjdG9yeSwgTWVzc2FnZUZhY3RvcnksIENoYXRGYWN0b3J5LCBNZW1iZXJGYWN0b3J5KSB7XG5cbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcblxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG5cbiAgICAkc2NvcGUuZXJyb3IgPSB7fTtcblxuICAgICRzY29wZS51cGRhdGluZyA9IGZhbHNlO1xuICAgICRzY29wZS5sb2FkaW5nICA9IHRydWU7XG4gICAgJHNjb3BlLmF1dGggICAgID0gZmFsc2U7XG4gICAgJHNjb3BlLmNvbmVjdGVkID0gZmFsc2U7XG4gICAgJHNjb3BlLm1lc3NhZ2VzID0gW107XG4gICAgJHNjb3BlLm9ubGluZSAgID0gW107XG5cbiAgICAvL2NvbnNvbGUubG9nKFwiQ29ubmVjdGluZ1wiKTtcblxuICAgIFNvY2tldEZhY3RvcnkuY29ubmVjdCgnL2NoYXQnKTtcblxuICAgIFNvY2tldEZhY3Rvcnkub24oJ2Nvbm5lY3RlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5jb25lY3RlZCA9IHRydWU7XG4gICAgICBpZighJHNjb3BlLmF1dGgpe1xuICAgICAgICBTb2NrZXRGYWN0b3J5LmVtaXQoJ2F1dGgnLCB7aWQ6ICgkcm91dGVQYXJhbXMuaWQgfHwgJ2dlcmFsJyksIHVzZXI6ICRzY29wZS5tZS5pZH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCdBdXRoIHN1Y2Nlc3MnKTtcbiAgICAgICAgICAkc2NvcGUuYXV0aCA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgU29ja2V0RmFjdG9yeS5vbigndmFsaWRhdGlvbicsIGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICBpZighcmVzcG9uc2UuZXJyKXtcbiAgICAgICAgJHNjb3BlLmNoYXQgICAgID0gcmVzcG9uc2UuY2hhdERhdGE7XG4gICAgICAgICRzY29wZS5tZXNzYWdlcyA9IHJlc3BvbnNlLm1lc3NhZ2VzO1xuICAgICAgICAkc2NvcGUucm9vbSAgICAgPSByZXNwb25zZS5yb29tO1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUuY2hhdC5tZW1iZXJzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAkc2NvcGUub25saW5lLnB1c2goe21lbWJlcjogJHNjb3BlLmNoYXQubWVtYmVyc1tpXSwgb246IGZhbHNlfSk7XG4gICAgICAgICAgaWYocmVzcG9uc2Uub25saW5lLmluZGV4T2YoJHNjb3BlLmNoYXQubWVtYmVyc1tpXSkgIT0gLTEpe1xuICAgICAgICAgICAgJHNjb3BlLm9ubGluZVtpXS5vbiA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5vbmxpbmVbaV0ubmFtZSA9ICRzY29wZS5nZXRNZW1iZXIoJHNjb3BlLm9ubGluZVtpXS5tZW1iZXIpLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLmhpc3RvcnkgPSBoaXN0b3J5O1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhyZXNwb25zZS5tZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgICRzY29wZS5sb2FkaW5nICA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgU29ja2V0RmFjdG9yeS5vbigndXNlci1jb25uZWN0ZWQnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJVc2VyIGNvbm5lY3RlZDogXCIgKyByZXNwb25zZS5pZCk7XG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLm9ubGluZS5sZW5ndGg7IGkrKyl7XG4gICAgICAgIGlmKCRzY29wZS5vbmxpbmVbaV0ubWVtYmVyID09PSByZXNwb25zZS5pZCl7XG4gICAgICAgICAgJHNjb3BlLm9ubGluZVtpXS5vbiA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFNvY2tldEZhY3Rvcnkub24oJ3VzZXItZGlzY29ubmVjdGVkJywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiVXNlciBjb25uZWN0ZWQ6IFwiICsgcmVzcG9uc2UuaWQpO1xuICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5vbmxpbmUubGVuZ3RoOyBpKyspe1xuICAgICAgICBpZigkc2NvcGUub25saW5lW2ldLm1lbWJlciA9PT0gcmVzcG9uc2UuaWQpe1xuICAgICAgICAgICRzY29wZS5vbmxpbmVbaV0ub24gPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgU29ja2V0RmFjdG9yeS5vbignbWVzc2FnZScsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgdmFyIG1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuICAgICAgJHNjb3BlLm1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG4gICAgICBpZihtZXNzYWdlLm1lbWJlciAhPSAkc2NvcGUubWUuaWQpIHtcbiAgICAgICAgbmdBdWRpby5wbGF5KFwiYXVkaW8vbWVzc2FnZS5tcDNcIik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBTb2NrZXRGYWN0b3J5Lm9uKCdoaXN0b3J5LXNlbmQnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5tZXNzYWdlcyA9ICRzY29wZS5tZXNzYWdlcy5jb25jYXQocmVzcG9uc2UubWVzc2FnZXMpO1xuICAgICAgJHNjb3BlLnVwZGF0aW5nID0gZmFsc2U7XG4gICAgICAkc2NvcGUuaW5maW5pdGVTY3JvbGxEaXNhYmxlZCA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbigpe1xuICAgICAgU29ja2V0RmFjdG9yeS5kaXNjb25uZWN0KCk7XG4gICAgICBkZWxldGUgU29ja2V0RmFjdG9yeS5zb2NrZXQ7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJHNjb3BlLnRleHQgPT0gXCJcIil7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIG1lc3NhZ2VEYXRhID0ge1xuICAgICAgICB0ZXh0ICAgOiAkc2NvcGUudGV4dCxcbiAgICAgICAgY2hhdElkIDogKCRyb3V0ZVBhcmFtcy5pZCB8fCAnZ2VyYWwnKSxcbiAgICAgICAgbWVtYmVyIDogJHNjb3BlLm1lLmlkLFxuICAgICAgfVxuXG4gICAgICBTb2NrZXRGYWN0b3J5LmVtaXQoJ3NlbmQnLCB7cm9vbTogJHNjb3BlLnJvb20sIG1lc3NhZ2U6IG1lc3NhZ2VEYXRhIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdNZXNzYWdlIHNlbnQnKTtcbiAgICAgICAgJHNjb3BlLnRleHQgPSBcIlwiO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGhpc3RvcnkgKCkge1xuICAgICAgLy9jb25zb2xlLmxvZygnU3RhcnQgaGlzdG9yeSByZXF1ZXN0Jyk7XG4gICAgICBpZighJHNjb3BlLnVwZGF0aW5nKXtcbiAgICAgICAgJHNjb3BlLmluZmluaXRlU2Nyb2xsRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAkc2NvcGUudXBkYXRpbmcgPSB0cnVlO1xuICAgICAgICBTb2NrZXRGYWN0b3J5LmVtaXQoJ2hpc3RvcnktZ2V0Jywge3Jvb206ICRzY29wZS5yb29tLCBkYXRlOiAkc2NvcGUubWVzc2FnZXNbJHNjb3BlLm1lc3NhZ2VzLmxlbmd0aC0xXS5kYXRlIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coJ1NlbnQgaGlzdG9yeSByZXF1ZXN0Jyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iLCJyZXF1aXJlKCcuL2xpc3QnKTtcbnJlcXVpcmUoJy4vY2hhdCcpOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignQ2hhdHNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgQ2hhdEZhY3RvcnkpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgIENoYXRGYWN0b3J5LkNoYXQuZ2V0QWxsKGZ1bmN0aW9uKGNoYXRzKSB7XG4gICAgICAkc2NvcGUuY2hhdHMgPSBjaGF0cztcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNvbW1lbnRBcmVhQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCBNZW1iZXJGYWN0b3J5LCBDb21tZW50RmFjdG9yeSkge1xuXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgJHNjb3BlLmNvbW1lbnREYXRhID0ge1xuICAgICAgbWFya2Rvd246IFwiXCJcbiAgICB9O1xuXG4gICAgbG9hZENvbW1lbnRzKCk7XG5cbiAgICBmdW5jdGlvbiBsb2FkQ29tbWVudHMoKSB7XG4gICAgICBpZiAoJHNjb3BlLnRocmVhZC5zcGxpdChcIi1cIilbMV0gPT09IFwiXCIpIHtcbiAgICAgICAgc2V0VGltZW91dChsb2FkQ29tbWVudHMsIDUwMCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHRocmVhZElkO1xuICAgICAgdmFyIHRocmVhZFR5cGU7XG5cbiAgICAgIGlmKCRzY29wZS5zdWJ0aHJlYWQgJiYgJHNjb3BlLnN1YnRocmVhZCAhPSAnJykge1xuICAgICAgICB0aHJlYWRUeXBlID0gJHNjb3BlLnN1YnRocmVhZC5zcGxpdCgnLScpWzBdO1xuICAgICAgICB0aHJlYWRJZCA9ICRzY29wZS5zdWJ0aHJlYWQuc3Vic3RyaW5nKCRzY29wZS5zdWJ0aHJlYWQuaW5kZXhPZihcIi1cIikgKyAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocmVhZFR5cGUgPSAkc2NvcGUudGhyZWFkLnNwbGl0KCctJylbMF07XG4gICAgICAgIHRocmVhZElkID0gJHNjb3BlLnRocmVhZC5zdWJzdHJpbmcoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiLVwiKSArIDEpO1xuICAgICAgfVxuXG4gICAgICBzd2l0Y2godGhyZWFkVHlwZSkge1xuICAgICAgICBjYXNlIFwiY29tcGFueVwiOiBcbiAgICAgICAgICBDb21tZW50RmFjdG9yeS5Db21wYW55LmdldEFsbCh7aWQ6IHRocmVhZElkfSwgZ290Q29tbWVudHMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3BlYWtlclwiOiBcbiAgICAgICAgICBDb21tZW50RmFjdG9yeS5TcGVha2VyLmdldEFsbCh7aWQ6IHRocmVhZElkfSwgZ290Q29tbWVudHMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwidG9waWNcIjogXG4gICAgICAgICAgQ29tbWVudEZhY3RvcnkuVG9waWMuZ2V0QWxsKHtpZDogdGhyZWFkSWR9LCBnb3RDb21tZW50cyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb21tdW5pY2F0aW9uXCI6IFxuICAgICAgICAgIENvbW1lbnRGYWN0b3J5LkNvbW11bmljYXRpb24uZ2V0QWxsKHtpZDogdGhyZWFkSWR9LCBnb3RDb21tZW50cyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdvdENvbW1lbnRzKGNvbW1lbnRzKSB7XG4gICAgICAgICRzY29wZS5jb21tZW50cyA9IGNvbW1lbnRzO1xuXG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJHNjb3BlLnBvc3RDb21tZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biA9PT0gXCJcIil7XG4gICAgICAgICRzY29wZS5lbXB0eUNvbW1lbnQgPSB0cnVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRlID0gRGF0ZS5ub3coKTtcbiAgICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQuY3JlYXRlKHtcbiAgICAgICAgdGhyZWFkOiAkc2NvcGUudGhyZWFkLFxuICAgICAgICBzdWJ0aHJlYWQ6ICRzY29wZS5zdWJ0aHJlYWQsXG4gICAgICAgIG1lbWJlcjogJHNjb3BlLm1lLmlkLFxuICAgICAgICBtYXJrZG93bjogJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duLFxuICAgICAgICBodG1sOiAkc2NvcGUuY29udmVydE1hcmtkb3duVG9IdG1sKCRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biksXG4gICAgICAgIHBvc3RlZDogZGF0ZSxcbiAgICAgICAgdXBkYXRlZDogZGF0ZVxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biA9IFwiXCI7XG4gICAgICAgICRzY29wZS5jb21tZW50Rm9ybS4kc2V0UHJpc3RpbmUoKTtcbiAgICAgICAgbG9hZENvbW1lbnRzKCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNhdmVDb21tZW50ID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgICAgIGlmIChjb21tZW50LmJ1ZmZlciA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbW1lbnQubWFya2Rvd24gPSBjb21tZW50LmJ1ZmZlcjtcbiAgICAgIGNvbW1lbnQuaHRtbCA9ICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwoY29tbWVudC5tYXJrZG93bik7XG4gICAgICBjb21tZW50LnVwZGF0ZWQgPSBEYXRlLm5vdygpO1xuXG4gICAgICBDb21tZW50RmFjdG9yeS5Db21tZW50LnVwZGF0ZSh7aWQ6IGNvbW1lbnQuX2lkfSwgY29tbWVudCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbW1lbnQuYnVmZmVyID0gXCJcIjtcbiAgICAgICAgY29tbWVudC5lZGl0aW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkc2NvcGUucXVvdGVDb21tZW50ID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgICAgICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biA9IFwiPiAqKlwiICsgJHNjb3BlLmdldE1lbWJlcihjb21tZW50Lm1lbWJlcikubmFtZSArIFwiIHNhaWQ6KipcXG4+IFwiICsgY29tbWVudC5tYXJrZG93bi5zcGxpdChcIlxcblwiKS5qb2luKFwiXFxuPiBcIikgKyBcIlxcblxcblwiO1xuICAgIH07XG5cbiAgICAkc2NvcGUuZGVsZXRlQ29tbWVudCA9IGZ1bmN0aW9uIChjb21tZW50KSB7XG4gICAgICBpZiAoY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBjb21tZW50P1wiKSkge1xuICAgICAgICBDb21tZW50RmFjdG9yeS5Db21tZW50LmRlbGV0ZSh7aWQ6IGNvbW1lbnQuX2lkfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGxvYWRDb21tZW50cygpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgICAgcmV0dXJuICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xuICAgICAgfSlbMF07XG4gICAgfTtcblxuICAgICRzY29wZS5jb252ZXJ0VGV4dFRvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHZhciB1cmxFeHAgPSAvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2lnO1xuICAgICAgdmFyIG1haWxFeHAgPSAvW1xcd1xcLlxcLV0rXFxAKFtcXHdcXC1dK1xcLikrW1xcd117Miw0fSg/IVtePF0qPikvaWc7XG5cbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpLnJlcGxhY2UodXJsRXhwLFwiPGEgaHJlZj0nJDEnPiQxPC9hPlwiKS5yZXBsYWNlKG1haWxFeHAsXCI8YSBocmVmPScjL2NvbXBhbnkvXCIrJHJvdXRlUGFyYW1zLmlkK1wiL2NvbmZpcm0/ZW1haWw9JCYnPiQmPC9hPlwiKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNvbnZlcnROZXdMaW5lc1RvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicrdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKSsnPC9kaXY+JztcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNvbnZlcnRNYXJrZG93blRvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicgKyB0ZXh0ICsgJzwvZGl2Pic7XG4gICAgfTtcblxuICAgICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAoY29tbWVudCkge1xuICAgICAgaWYoISRzY29wZS5tZS5yb2xlcykgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgICAgfSk7XG5cbiAgICAgIGlmKHJvbGVzLmxlbmd0aCA9PSAwICYmIGNvbW1lbnQubWVtYmVyICE9ICRzY29wZS5tZS5pZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XG4gICAgICBpZihzZWNvbmRzIDwgMCl7XG4gICAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgICAgc3VmZml4ID0gJ3RvIGdvJztcbiAgICAgIH1cblxuICAgICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAodGltZSkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKHRpbWUpLnRvVVRDU3RyaW5nKCk7XG4gICAgfTtcbiAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkZpcnN0Q29tbWVudENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgTWVtYmVyRmFjdG9yeSwgQ29tbWVudEZhY3RvcnkpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICRzY29wZS5jb21tZW50RGF0YSA9IHtcbiAgICAgIG1hcmtkb3duOiBcIlwiXG4gICAgfTtcblxuICAgIE1lbWJlckZhY3RvcnkuTWVtYmVyLmdldCh7aWQ6IFwibWVcIn0sIGZ1bmN0aW9uIChtZSkge1xuICAgICAgJHNjb3BlLm1lID0gbWU7XG4gICAgfSk7XG5cbiAgICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXRBbGwoZnVuY3Rpb24gKG1lbWJlcnMpIHtcbiAgICAgICRzY29wZS5tZW1iZXJzID0gbWVtYmVycztcbiAgICB9KTtcblxuICAgIGxvYWRDb21tZW50cygpO1xuXG4gICAgZnVuY3Rpb24gbG9hZENvbW1lbnRzKCkge1xuICAgICAgaWYgKCRzY29wZS50aHJlYWQuc3BsaXQoXCItXCIpWzFdID09PSBcIlwiKSB7XG4gICAgICAgIHNldFRpbWVvdXQobG9hZENvbW1lbnRzLCA1MDApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBwYWdlSWQgPSAkc2NvcGUudGhyZWFkLnN1YnN0cmluZygkc2NvcGUudGhyZWFkLmluZGV4T2YoXCItXCIpICsgMSk7XG5cbiAgICAgIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJjb21wYW55LVwiKSAhPSAtMSkge1xuICAgICAgICBDb21tZW50RmFjdG9yeS5Db21wYW55LmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCRzY29wZS50aHJlYWQuaW5kZXhPZihcInNwZWFrZXItXCIpICE9IC0xKSB7XG4gICAgICAgIENvbW1lbnRGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKHtpZDogcGFnZUlkfSwgZ290Q29tbWVudHMpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwidG9waWMtXCIpICE9IC0xKSB7XG4gICAgICAgIENvbW1lbnRGYWN0b3J5LlRvcGljLmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ290Q29tbWVudHMoY29tbWVudHMpIHtcbiAgICAgICAgJHNjb3BlLmNvbW1lbnRzID0gW107XG4gICAgICAgIHZhciBmaXJzdENvbW1lbnQgPSBjb21tZW50cy5zb3J0KGZ1bmN0aW9uKGEsYil7XG4gICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGEucG9zdGVkKSAtIG5ldyBEYXRlKGIucG9zdGVkKTtcbiAgICAgICAgfSlbMF07XG5cbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkc2NvcGUucG9zdENvbW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duID09PSBcIlwiKXtcbiAgICAgICAgJHNjb3BlLmVtcHR5Q29tbWVudCA9IHRydWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGRhdGUgPSBEYXRlLm5vdygpO1xuICAgICAgQ29tbWVudEZhY3RvcnkuQ29tbWVudC5jcmVhdGUoe1xuICAgICAgICB0aHJlYWQ6ICRzY29wZS50aHJlYWQsXG4gICAgICAgIG1lbWJlcjogJHNjb3BlLm1lLmlkLFxuICAgICAgICBtYXJrZG93bjogJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duLFxuICAgICAgICBodG1sOiAkc2NvcGUuY29udmVydE1hcmtkb3duVG9IdG1sKCRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biksXG4gICAgICAgIHBvc3RlZDogZGF0ZSxcbiAgICAgICAgdXBkYXRlZDogZGF0ZVxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biA9IFwiXCI7XG4gICAgICAgIGxvYWRDb21tZW50cygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLnNhdmVDb21tZW50ID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgICAgIGlmIChjb21tZW50LmJ1ZmZlciA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbW1lbnQubWFya2Rvd24gPSBjb21tZW50LmJ1ZmZlcjtcbiAgICAgIGNvbW1lbnQuaHRtbCA9ICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwoY29tbWVudC5tYXJrZG93bik7XG4gICAgICBjb21tZW50LnVwZGF0ZWQgPSBEYXRlLm5vdygpO1xuXG4gICAgICBDb21tZW50RmFjdG9yeS5Db21tZW50LnVwZGF0ZSh7aWQ6IGNvbW1lbnQuX2lkfSwgY29tbWVudCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbW1lbnQuZWRpdGluZyA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLnF1b3RlQ29tbWVudCA9IGZ1bmN0aW9uIChjb21tZW50KSB7XG4gICAgICAkc2NvcGUuY29tbWVudERhdGEubWFya2Rvd24gPSBcIj4gKipcIiArICRzY29wZS5nZXRNZW1iZXIoY29tbWVudC5tZW1iZXIpLm5hbWUgKyBcIiBzYWlkOioqXFxuPiBcIiArIGNvbW1lbnQubWFya2Rvd24uc3BsaXQoXCJcXG5cIikuam9pbihcIlxcbj4gXCIpICsgXCJcXG5cXG5cIjtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmRlbGV0ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xuICAgICAgaWYgKGNvbmZpcm0oXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgY29tbWVudD9cIikpIHtcbiAgICAgICAgQ29tbWVudEZhY3RvcnkuQ29tbWVudC5kZWxldGUoe2lkOiBjb21tZW50Ll9pZH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBsb2FkQ29tbWVudHMoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICAgIH0pWzBdO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY29udmVydFRleHRUb0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcbiAgICAgIHZhciBtYWlsRXhwID0gL1tcXHdcXC5cXC1dK1xcQChbXFx3XFwtXStcXC4pK1tcXHddezIsNH0oPyFbXjxdKj4pL2lnO1xuXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIikucmVwbGFjZShtYWlsRXhwLFwiPGEgaHJlZj0nIy9jb21wYW55L1wiKyRyb3V0ZVBhcmFtcy5pZCtcIi9jb25maXJtP2VtYWlsPSQmJz4kJjwvYT5cIik7XG4gICAgfTtcblxuICAgICRzY29wZS5jb252ZXJ0TmV3TGluZXNUb0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICByZXR1cm4gJzxkaXYgZGF0YS1tYXJrZG93bj4nK3RleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykrJzwvZGl2Pic7XG4gICAgfTtcblxuICAgICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICByZXR1cm4gJzxkaXYgZGF0YS1tYXJrZG93bj4nICsgdGV4dCArICc8L2Rpdj4nO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgICAgIGlmKCEkc2NvcGUubWUucm9sZXMpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAgIHZhciByb2xlcyA9ICRzY29wZS5tZS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcbiAgICAgIH0pO1xuXG4gICAgICBpZihyb2xlcy5sZW5ndGggPT0gMCAmJiBjb21tZW50Lm1lbWJlciAhPSAkc2NvcGUubWUuaWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgICAgaWYoc2Vjb25kcyA8IDApe1xuICAgICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcblxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XG4gICAgfTtcblxuICAgICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lKS50b1VUQ1N0cmluZygpO1xuICAgIH07XG4gIH1cbn0pO1xuIiwicmVxdWlyZSgnLi9hcmVhLmpzJyk7XG5yZXF1aXJlKCcuL2ZpcnN0LmpzJyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNvbW11bmljYXRpb25BcmVhQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCBDb21tdW5pY2F0aW9uRmFjdG9yeSkge1xuXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgJHNjb3BlLmNvbW11bmljYXRpb25EYXRhID0ge1xuICAgICAgbWFya2Rvd246IFwiXCJcbiAgICB9O1xuXG4gICAgJHNjb3BlLm1lID0gSlNPTi5wYXJzZSgkc2NvcGUubWVKc29uKTtcbiAgICAkc2NvcGUubWVtYmVycyA9IEpTT04ucGFyc2UoJHNjb3BlLm1lbWJlcnNKc29uKTtcbiAgICAkc2NvcGUucm9sZXMgPSBKU09OLnBhcnNlKCRzY29wZS5yb2xlc0pzb24pO1xuXG4gICAgbG9hZENvbW11bmljYXRpb25zKCk7XG5cbiAgICBmdW5jdGlvbiBsb2FkQ29tbXVuaWNhdGlvbnMoKSB7XG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAgIGlmICgkc2NvcGUudGhyZWFkLnNwbGl0KFwiLVwiKVsxXSA9PT0gXCJcIikge1xuICAgICAgICBzZXRUaW1lb3V0KGxvYWRDb21tdW5pY2F0aW9ucywgNTAwKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcGFnZUlkID0gJHNjb3BlLnRocmVhZC5zdWJzdHJpbmcoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiLVwiKSArIDEpO1xuXG4gICAgICBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiY29tcGFueS1cIikgIT0gLTEpIHtcbiAgICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tcGFueS5nZXRBbGwoIHtpZDogcGFnZUlkfSwgZ290Q29tbXVuaWNhdGlvbnMpO1xuICAgICAgICAkc2NvcGUua2luZHM9WydFbWFpbCBUbycsICdFbWFpbCBGcm9tJywgJ01lZXRpbmcnLCAnUGhvbmUgQ2FsbCddO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwic3BlYWtlci1cIikgIT0gLTEpIHtcbiAgICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuU3BlYWtlci5nZXRBbGwoIHtpZDogcGFnZUlkfSwgZ290Q29tbXVuaWNhdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnb3RDb21tdW5pY2F0aW9ucyhjb21tdW5pY2F0aW9ucykge1xuICAgICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbnMgPSBjb21tdW5pY2F0aW9ucztcblxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJzcGVha2VyLVwiKSAhPSAtMSkge1xuICAgICAgICAgIGlmKGNvbW11bmljYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgICAgICByZXR1cm4gby5raW5kLmluZGV4T2YoJ1BhcmFncmFwaCcpICE9IC0xO1xuICAgICAgICAgIH0pLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICAkc2NvcGUua2luZHM9WydFbWFpbCBUbycsICdFbWFpbCBGcm9tJywgJ01lZXRpbmcnLCAnUGhvbmUgQ2FsbCddO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUua2luZHM9WydJbml0YWwgRW1haWwgUGFyYWdyYXBoJywnRW1haWwgVG8nLCAnRW1haWwgRnJvbScsICdNZWV0aW5nJywgJ1Bob25lIENhbGwnXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAkc2NvcGUucG9zdENvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoISRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS5raW5kIHx8ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS5raW5kPT0gXCJcIil7XG4gICAgICAgICRzY29wZS5lbXB0eUNvbW11bmljYXRpb24gPSB0cnVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoISRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0IHx8ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0PT0gXCJcIil7XG4gICAgICAgICRzY29wZS5lbXB0eUNvbW11bmljYXRpb24gPSB0cnVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRlID0gRGF0ZS5ub3coKTtcblxuICAgICAgLy9jb25zb2xlLmxvZygkc2NvcGUuZXZlbnQpO1xuXG4gICAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLmNyZWF0ZSh7XG4gICAgICAgIHRocmVhZDogJHNjb3BlLnRocmVhZCxcbiAgICAgICAgbWVtYmVyOiAkc2NvcGUubWUuaWQsXG4gICAgICAgIGtpbmQ6ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS5raW5kLFxuICAgICAgICB0ZXh0OiAkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEudGV4dCxcbiAgICAgICAgZXZlbnQ6ICRzY29wZS5ldmVudC5pZCxcbiAgICAgICAgcG9zdGVkOiBkYXRlLFxuICAgICAgICB1cGRhdGVkOiBkYXRlXG4gICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLmNvbW11bmljYXRpb25EYXRhLnRleHQgPSBcIlwiO1xuICAgICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEua2luZCA9IFwiXCI7XG4gICAgICAgICRzY29wZS5jb21tdW5pY2F0aW9uRm9ybS4kc2V0UHJpc3RpbmUoKTtcbiAgICAgICAgbG9hZENvbW11bmljYXRpb25zKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2F2ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgICAgaWYgKGNvbW11bmljYXRpb24uYnVmZmVyID09PSBcIlwiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29tbXVuaWNhdGlvbi50ZXh0ID0gY29tbXVuaWNhdGlvbi5idWZmZXI7XG4gICAgICBjb21tdW5pY2F0aW9uLnVwZGF0ZWQgPSBEYXRlLm5vdygpO1xuXG4gICAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLnVwZGF0ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgY29tbXVuaWNhdGlvbiwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbW11bmljYXRpb24uZWRpdGluZyA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmRlbGV0ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5kZWxldGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG9hZENvbW11bmljYXRpb25zKCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmFwcHJvdmVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uYXBwcm92ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgbnVsbCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGxvYWRDb21tdW5pY2F0aW9ucygpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICAgIH0pWzBdO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICAgIHZhciByb2xlcyA9ICRzY29wZS5tZS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcbiAgICAgIH0pO1xuXG4gICAgICBpZihyb2xlcy5sZW5ndGggPT0gMCAmJiBjb21tdW5pY2F0aW9uLm1lbWJlciAhPSAkc2NvcGUubWUuaWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgICAgaWYoc2Vjb25kcyA8IDApe1xuICAgICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcblxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XG4gICAgfTtcblxuICAgICRzY29wZS5jb252ZXJ0VVJMcyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHZhciB1cmxFeHAgPSAvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2lnO1xuXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIik7XG4gICAgfVxuICB9XG5cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJDb21tdW5pY2F0aW9uRW1iZWRDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIENvbW11bmljYXRpb25GYWN0b3J5KSB7XG5cbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcblxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgJHNjb3BlLnN1Y2Nlc3MgICAgID0gXCJcIjtcbiAgICAkc2NvcGUuZXJyb3IgICAgICAgPSBcIlwiO1xuXG4gICAgJHNjb3BlLmNvbW11bmljYXRpb24uZWRpdGluZyA9IGZhbHNlO1xuICAgICRzY29wZS5jb21tdW5pY2F0aW9uLmRlbGV0ZWQgPSBmYWxzZTtcblxuXG4gICAgJHNjb3BlLnNhdmVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICAgIGlmIChjb21tdW5pY2F0aW9uLmJ1ZmZlciA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbW11bmljYXRpb24udGV4dCA9IGNvbW11bmljYXRpb24uYnVmZmVyO1xuICAgICAgY29tbXVuaWNhdGlvbi51cGRhdGVkID0gRGF0ZS5ub3coKTtcblxuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi51cGRhdGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIGNvbW11bmljYXRpb24sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBjb21tdW5pY2F0aW9uLmVkaXRpbmcgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgICRzY29wZS5kZWxldGVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uZGVsZXRlKHtpZDogY29tbXVuaWNhdGlvbi5faWR9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5jb21tdW5pY2F0aW9uLmRlbGV0ZWQgPSB0cnVlO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zZXRDb21tdW5pY2F0aW9uU3RhdHVzID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24sIHN0YXR1cykge1xuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi51cGRhdGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIHtzdGF0dXM6IHN0YXR1c30sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbi5zdGF0dXMgPSBzdGF0dXM7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgICAgcmV0dXJuICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xuICAgICAgfSlbMF07XG4gICAgfTtcblxuICAgICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgICAgfSk7XG5cbiAgICAgIGlmKHJvbGVzLmxlbmd0aCA9PSAwICYmIGNvbW11bmljYXRpb24ubWVtYmVyICE9ICRzY29wZS5tZS5pZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XG4gICAgICBpZihzZWNvbmRzIDwgMCl7XG4gICAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgICAgc3VmZml4ID0gJ3RvIGdvJztcbiAgICAgIH1cblxuICAgICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAodGltZSkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKHRpbWUpLnRvVVRDU3RyaW5nKCk7XG4gICAgfTtcblxuICAgICRzY29wZS5jb252ZXJ0VVJMcyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHZhciB1cmxFeHAgPSAvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2lnO1xuXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIik7XG4gICAgfVxuICB9XG59KTtcbiIsInJlcXVpcmUoJy4vYXJlYS5qcycpO1xucmVxdWlyZSgnLi9saXN0LmpzJyk7XG5yZXF1aXJlKCcuL2VtYmVkLmpzJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDb21tdW5pY2F0aW9uc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvdXRlUGFyYW1zLCAkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCBDb21tdW5pY2F0aW9uRmFjdG9yeSkge1xuICAgICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG4gICAgICBcbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5nZXRBbGwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmNvbW11bmljYXRpb25zID0gcmVzcG9uc2U7XG4gICAgICB9KTtcblxuICAgICAgJHNjb3BlLnNob3dPcGVuID0gdHJ1ZTtcblxuICAgICAgJHNjb3BlLnNob3duQ29tbXVuaWNhdGlvbnMgPSBmdW5jdGlvbiAoc2hvd09wZW4pIHtcbiAgICAgICAgcmV0dXJuICRzY29wZS5jb21tdW5pY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICAgIHJldHVybiAoc2hvd09wZW4gPyAhKG8uc3RhdHVzPT0nYXBwcm92ZWQnKSA6IG8uc3RhdHVzPT0nYXBwcm92ZWQnKSAmJiAkcm91dGVQYXJhbXMua2luZCA9PSBvLnRocmVhZC5zcGxpdCgnLScpWzBdO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignQ29tcGFueUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJGxvY2F0aW9uLCAkcm91dGVQYXJhbXMsICRzY2UsIENvbXBhbnlGYWN0b3J5LCBNZW1iZXJGYWN0b3J5LCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XG5cbiAgICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgICAkc2NvcGUudHJ1c3RTcmMgPSBmdW5jdGlvbihzcmMpIHtcbiAgICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKHNyYysnI3BhZ2UtYm9keScpO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUuY29udmVydEVtYWlscyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgdmFyIG1haWxFeHAgPSAvW1xcd1xcLlxcLV0rXFxAKFtcXHdcXC1dK1xcLikrW1xcd117Miw0fSg/IVtePF0qPikvaWc7XG4gICAgICAgIHZhciB0d2l0dGVyRXhwID0gLyhefFteQFxcd10pQChcXHd7MSwxNX0pXFxiL2c7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UobWFpbEV4cCxcIjxhIGhyZWY9JyMvY29tcGFueS9cIiskcm91dGVQYXJhbXMuaWQrXCIvY29uZmlybT9lbWFpbD0kJic+JCY8L2E+XCIpLnJlcGxhY2UodHdpdHRlckV4cCxcIiQxPGEgaHJlZj0naHR0cDovL3R3aXR0ZXIuY29tLyQyJyB0YXJnZXQ9J19ibGFuayc+JDI8L2E+XCIpXG4gICAgICB9XG5cbiAgICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNvbXBhbnlEYXRhID0gdGhpcy5mb3JtRGF0YTtcblxuICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LnVwZGF0ZSh7IGlkOmNvbXBhbnlEYXRhLmlkIH0sIGNvbXBhbnlEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ2NvbXBhbnkvJytjb21wYW55RGF0YS5pZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5kZWxldGVDb21wYW55ID0gZnVuY3Rpb24oY29tcGFueSkge1xuICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmRlbGV0ZSh7IGlkOmNvbXBhbnkuaWQgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2Uuc3VjY2VzcztcbiAgICAgICAgICB9XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ2NvbXBhbmllcy8nKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYocm9sZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc3RhdHVzZXMgPSBbJ1N1Z2dlc3Rpb24nLCdDb250YWN0ZWQnLCdJbiBDb252ZXJzYXRpb25zJywnSW4gTmVnb3RpYXRpb25zJywnQ2xvc2VkIERlYWwnLCdSZWplY3RlZCcsJ0dpdmUgVXAnXTtcbiAgICAgICRzY29wZS5sb2dvU2l6ZXMgPSBbbnVsbCwgJ1MnLCdNJywnTCddO1xuICAgICAgJHNjb3BlLnN0YW5kRGF5cyA9IFtudWxsLCAxLDIsMyw0LDVdO1xuICAgICAgJHNjb3BlLnBvc3RzTnVtYmVycyA9IFtudWxsLCAxLDIsMyw0LDVdO1xuXG4gICAgICAkc2NvcGUuY29tcGFueSA9ICRzY29wZS5mb3JtRGF0YSA9ICRzY29wZS5nZXRDb21wYW55KCRyb3V0ZVBhcmFtcy5pZCk7XG5cbiAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0KHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSAkc2NvcGUuZm9ybURhdGEgPSByZXNwb25zZTtcblxuICAgICAgICBOb3RpZmljYXRpb25GYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24oZ2V0RGF0YSkge1xuICAgICAgICAgICRzY29wZS5jb21wYW55Tm90aWZpY2F0aW9ucyA9IGdldERhdGE7XG5cbiAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDb21wYW55RW1haWxDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgJGxvY2F0aW9uLCBFbWFpbEZhY3RvcnkpIHtcbiAgICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgICAkc2NvcGUuZW1haWwgPSAkbG9jYXRpb24uc2VhcmNoKCkuZW1haWw7XG4gICAgICAkc2NvcGUuY29tcGFueUlkID0gJHJvdXRlUGFyYW1zLmlkO1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgICAkc2NvcGUubWVzc2FnZSA9IG51bGw7XG5cbiAgICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuICAgICAgICAkc2NvcGUubWVzc2FnZSA9IG51bGw7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInNlbmQgZW1haWwgdG8gXCIsICRzY29wZS5lbWFpbCwgXCIgZnJvbSBcIiwgJHNjb3BlLmNvbXBhbnlJZCk7XG5cbiAgICAgICAgRW1haWxGYWN0b3J5LkNvbXBhbnkuc2VuZCh7IGlkOiAkc2NvcGUuY29tcGFueUlkIH0sIHsgZW1haWw6ICRzY29wZS5lbWFpbCB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbiBcbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDcmVhdGVDb21wYW55Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgQ29tcGFueUZhY3RvcnkpIHtcbiAgICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuICAgICAgXG4gICAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb21wYW55RGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS5jcmVhdGUoY29tcGFueURhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKGZ1bmN0aW9uIChjb21wYW5pZXMpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IGNvbXBhbmllcztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9jb21wYW55L1wiICsgcmVzcG9uc2UuaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc3RhdHVzZXMgPSBbJ1N1Z2dlc3Rpb24nLCdDb250YWN0ZWQnLCdJbiBDb252ZXJzYXRpb25zJywnSW4gTmVnb3RpYXRpb25zJywnQ2xvc2VkIERlYWwnLCdSZWplY3RlZCcsJ0dpdmUgVXAnXTtcbiAgICB9XG4gIH0pOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignQ29tcGFueUVtYmVkQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgIGlmKCRzY29wZS5jb21tZW50cykge1xuICAgICAgJHNjb3BlLmNvbXBhbnkuY29tbWVudHMgPSAkc2NvcGUuY29tbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcmV0dXJuIGUudGhyZWFkID09ICdjb21wYW55LScrJHNjb3BlLmNvbXBhbnkuaWQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZigkc2NvcGUuZXZlbnQpIHtcbiAgICAgICRzY29wZS5wYXJ0aWNpcGF0aW9uID0gJHNjb3BlLmNvbXBhbnkucGFydGljaXBhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgcmV0dXJuIG8uZXZlbnQgPT0gJHNjb3BlLmV2ZW50LmlkO1xuICAgICAgfSlbMF07XG4gICAgfVxuXG4gICAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgICAgdmFyIG1lbWJlciA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xuICAgICAgfSk7XG5cbiAgICAgIGlmKG1lbWJlci5sZW5ndGg+MCkge1xuICAgICAgICByZXR1cm4gbWVtYmVyWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiAnTm8gb25lJyxcbiAgICAgICAgICBmYWNlYm9vazogJzEwMDAwMDQ1NjMzNTk3MidcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLmdldFVucmVhZE5vdGlmaWNhdGlvbnMgPSBmdW5jdGlvbiAodGhyZWFkKSB7XG4gICAgICB2YXIgbm90aWZpY2F0aW9ucyA9ICRzY29wZS5ub3RpZmljYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLnRocmVhZCA9PSB0aHJlYWQ7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBub3RpZmljYXRpb25zO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY29tcGFueS51bnJlYWQgPSAkc2NvcGUuZ2V0VW5yZWFkTm90aWZpY2F0aW9ucygnY29tcGFueS0nICsgJHNjb3BlLmNvbXBhbnkuaWQpLmxlbmd0aCA+IDA7XG5cbiAgICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgICAgaWYoc2Vjb25kcyA8IDApe1xuICAgICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcblxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArICcgeWVhcnMgJyArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgJyBtb250aHMgJyArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArICcgZGF5cyAnICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyAnIGhvdXJzICcgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyAnIG1pbnV0ZXMgJyArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgJyBzZWNvbmRzICcgKyBzdWZmaXg7XG4gICAgfTtcbiAgfVxufSk7XG4iLCJyZXF1aXJlKCcuL2NvbXBhbnkuanMnKTtcbnJlcXVpcmUoJy4vbGlzdC5qcycpO1xucmVxdWlyZSgnLi9jcmVhdGUuanMnKTtcbnJlcXVpcmUoJy4vY29uZmlybS5qcycpO1xucmVxdWlyZSgnLi9lbWJlZC5qcycpOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXJcbiAgLmNvbnRyb2xsZXIoJ0NvbXBhbmllc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHNjZSwgQ29tcGFueUZhY3RvcnkpIHtcblxuICAgICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG4gICAgICAkc2NvcGUuc2F2ZVN0YXR1cyA9IGZ1bmN0aW9uKGNvbXBhbnkpIHtcbiAgICAgICAgdmFyIGNvbXBhbnlEYXRhID0gY29tcGFueTtcblxuICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LnVwZGF0ZSh7IGlkOmNvbXBhbnkuaWQgfSwgY29tcGFueURhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5nZXRDbGFzc0Zyb21QYXltZW50U3RhdHVzID0gZnVuY3Rpb24ocGFydGljaXBhdGlvbikge1xuICAgICAgICBpZighcGFydGljaXBhdGlvbikgeyByZXR1cm4gJ2dyZXknOyB9XG4gICAgICAgIGlmKCFwYXJ0aWNpcGF0aW9uLnBheW1lbnQpIHsgcmV0dXJuICdncmV5JzsgfVxuICAgICAgICBpZighcGFydGljaXBhdGlvbi5wYXltZW50LnN0YXR1cykgeyByZXR1cm4gJ2dyZXknOyB9XG4gICAgICAgIHZhciBzdGF0dXMgPSBwYXJ0aWNpcGF0aW9uLnBheW1lbnQuc3RhdHVzLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgaWYoc3RhdHVzLmluZGV4T2YoJ3BhZ28nKSAhPSAtMSB8fCBzdGF0dXMuaW5kZXhPZignZW1pdGlkbycpICE9IC0xIHx8IHN0YXR1cy5pbmRleE9mKCdyZWNpYm8gZW52aWFkbycpICE9IC0xKSB7IHJldHVybiAnbGltZSc7IH1cbiAgICAgICAgZWxzZSBpZihzdGF0dXMuaW5kZXhPZignZW52aWFkbycpICE9IC0xKSB7IHJldHVybiAnb3JhbmdlJzsgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuICdncmV5JzsgfVxuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnBheW1lbnRTdGF0dXNlcyA9IFsnRW1pdGlkbycsICdSZWNpYm8gRW52aWFkbycsICdQYWdvJywgJ0VudmlhZG8nXTtcblxuICAgICAgJHNjb3BlLmxpbWl0ID0gMjA7XG5cbiAgICAgICRzY29wZS5zdGF0dXNlcyA9IFsnU3VnZ2VzdGlvbicsJ0NvbnRhY3RlZCcsJ0luIENvbnZlcnNhdGlvbnMnLCdJbiBOZWdvdGlhdGlvbnMnLCdDbG9zZWQgRGVhbCcsJ1JlamVjdGVkJywnR2l2ZSBVcCddO1xuXG4gICAgICAkc2NvcGUuY29tcGFueVByZWRpY2F0ZSA9ICd1cGRhdGVkJztcbiAgICAgICRzY29wZS5yZXZlcnNlID0gJ3RydWUnO1xuICAgICAgJHNjb3BlLnVucmVhZEZpcnN0ID0gdHJ1ZTtcblxuICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS5nZXRBbGwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLnByZWRpY2F0ZSA9ICd1cGRhdGVkJztcbiAgICAgICAgJHNjb3BlLnJldmVyc2UgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuY29tcGFuaWVzID0gcmVzcG9uc2U7XG4gICAgICB9KTtcblxuICAgICAgJHNjb3BlLnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJHNjb3BlLmxpbWl0IDw9ICRzY29wZS5jb21wYW5pZXMubGVuZ3RoKVxuICAgICAgICAgICRzY29wZS5saW1pdCArPSA4O1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLmNoZWNrUGVybWlzc2lvbiA9IGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgICAgcmV0dXJuIG8uaWQgPT0gJ2RldmVsb3BtZW50LXRlYW0nIHx8IG8uaWQgPT0gJ2Nvb3JkaW5hdGlvbic7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmKHJvbGVzLmxlbmd0aCA9PT0gMCAmJiBtZW1iZXIuaWQgIT0gJHNjb3BlLm1lLmlkKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuYWRkQ29tcGFueSA9IGZ1bmN0aW9uKG1lbWJlciwgbmV3Q29tcGFueSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKG5ld0NvbXBhbnkpO1xuICAgICAgICB2YXIgY29tcGFueURhdGEgPSBuZXdDb21wYW55O1xuXG4gICAgICAgIGlmKG5ld0NvbXBhbnkuaWQpIHtcbiAgICAgICAgICB2YXIgcGFydGljaXBhdGlvbiA9ICRzY29wZS5nZXRQYXJ0aWNpcGF0aW9uKGNvbXBhbnlEYXRhLCAkc2NvcGUuY3VycmVudEV2ZW50LmlkKTtcbiAgICAgICAgICBpZihwYXJ0aWNpcGF0aW9uKSB7XG4gICAgICAgICAgICBwYXJ0aWNpcGF0aW9uLm1lbWJlciA9IG1lbWJlci5pZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29tcGFueURhdGEucGFydGljaXBhdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGV2ZW50OiAkc2NvcGUuY3VycmVudEV2ZW50LmlkLFxuICAgICAgICAgICAgICBzdGF0dXM6ICdTZWxlY3RlZCcsXG4gICAgICAgICAgICAgIG1lbWJlcjogbWVtYmVyLmlkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS51cGRhdGUoeyBpZDogY29tcGFueURhdGEuaWQgfSwgeyBwYXJ0aWNpcGF0aW9uczogY29tcGFueURhdGEucGFydGljaXBhdGlvbnMgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2Uuc3VjY2VzcztcblxuICAgICAgICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmdldEFsbChmdW5jdGlvbiAoY29tcGFuaWVzKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IGNvbXBhbmllcztcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tcGFueURhdGEucGFydGljaXBhdGlvbnMgPSBbe1xuICAgICAgICAgICAgZXZlbnQ6ICRzY29wZS5jdXJyZW50RXZlbnQuaWQsXG4gICAgICAgICAgICBzdGF0dXM6ICdTZWxlY3RlZCcsXG4gICAgICAgICAgICBtZW1iZXI6IG1lbWJlci5pZFxuICAgICAgICAgIH1dO1xuXG4gICAgICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS5jcmVhdGUoY29tcGFueURhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcblxuICAgICAgICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmdldEFsbChmdW5jdGlvbiAoY29tcGFuaWVzKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IGNvbXBhbmllcztcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG5cbn0pO1xuXG4iLCJ0aGVUb29sQ29udHJvbGxlciA9IGFuZ3VsYXIubW9kdWxlKCd0aGVUb29sLmNvbnRyb2xsZXJzJywgW10pO1xuXG5yZXF1aXJlKCcuL2F1dGgnKTtcbnJlcXVpcmUoJy4vbWFpbicpO1xucmVxdWlyZSgnLi9jb21wYW55Jyk7XG5yZXF1aXJlKCcuL3NwZWFrZXInKTtcbnJlcXVpcmUoJy4vbWVtYmVyJyk7XG5yZXF1aXJlKCcuL2NvbW1lbnQnKTtcbnJlcXVpcmUoJy4vbWVldGluZycpO1xucmVxdWlyZSgnLi9jaGF0Jyk7XG5yZXF1aXJlKCcuL3RvcGljJyk7XG5yZXF1aXJlKCcuL2NvbW11bmljYXRpb24nKTtcbnJlcXVpcmUoJy4vdGFnJyk7XG5yZXF1aXJlKCcuL3N1YnNjcmlwdGlvbicpO1xucmVxdWlyZSgnLi9hZG1pbicpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJob21lXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIE5vdGlmaWNhdGlvbkZhY3RvcnkpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAkc2NvcGUubm90aWZpY2F0aW9ucyA9IFtdO1xuICAgICRzY29wZS5saW1pdCA9IDEwO1xuXG4gICAgTm90aWZpY2F0aW9uRmFjdG9yeS5Ob3RpZmljYXRpb24uZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLm5vdGlmaWNhdGlvbnMgPSByZXNwb25zZTtcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc2Nyb2xsID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCRzY29wZS5saW1pdCA8ICRzY29wZS5ub3RpZmljYXRpb25zLmxlbmd0aCkge1xuICAgICAgICAkc2NvcGUubGltaXQgKz0gMTA7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG59KTtcbiIsInJlcXVpcmUoJy4vbWFpbi5qcycpO1xucmVxdWlyZSgnLi9ob21lLmpzJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgJGxvY2F0aW9uLCAkd2luZG93LCAkcm9vdFNjb3BlLCBOb3RpZmljYXRpb25GYWN0b3J5LCBNZW1iZXJGYWN0b3J5LCBDb21wYW55RmFjdG9yeSwgU3BlYWtlckZhY3RvcnksIFRvcGljRmFjdG9yeSwgUm9sZUZhY3RvcnksIFRhZ0ZhY3RvcnksIENvbW1lbnRGYWN0b3J5LCBDaGF0RmFjdG9yeSwgRXZlbnRGYWN0b3J5LCBTZXNzaW9uRmFjdG9yeSwgSXRlbUZhY3RvcnkpIHtcblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5yZWFkeSA9IGZhbHNlO1xuXG4gICRzY29wZS5kaXNwbGF5ID0gZmFsc2U7XG5cbiAgJHNjb3BlLnNlYXJjaCA9IHt9O1xuICAkc2NvcGUuc2VhcmNoVG9waWNzID0ge307XG4gICRzY29wZS5zZWFyY2hDb21wYW5pZXMgPSB7fTtcbiAgJHNjb3BlLnNlYXJjaFNwZWFrZXJzID0ge307XG4gICRzY29wZS5zZWFyY2hNZW1iZXJzID0ge307XG4gICRzY29wZS5hY3RpdmVFdmVudCA9IHt9O1xuXG4gICRzY29wZS5tZSA9IHt9O1xuICAkc2NvcGUubWVtYmVycyA9IFtdO1xuICAkc2NvcGUuY29tcGFuaWVzID0gW107XG4gICRzY29wZS5zcGVha2VycyA9IFtdO1xuICAkc2NvcGUudG9waWNzID0gW107XG4gICRzY29wZS50YXJnZXROb3RpZmljYXRpb25zID0gW107XG4gICRzY29wZS51bnJlYWROb3RpZmljYXRpb25zID0gW107XG5cbiAgJHNjb3BlLnRhcmdldEluZm8gPSB7XG4gICAgbnVtYmVyOiAwLFxuICAgIHRleHQ6IFwiIExvYWRpbmcuLi5cIlxuICB9O1xuXG4gIHZhciBmYWN0b3JpZXNSZWFkeSA9IDA7XG5cbiAgJHNjb3BlLnNldEN1cnJlbnRFdmVudCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgJHNjb3BlLmN1cnJlbnRFdmVudCA9IHt9O1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXskc2NvcGUuY3VycmVudEV2ZW50ID0gZXZlbnQ7fSwxMCk7XG4gIH1cblxuICAkcm9vdFNjb3BlLnVwZGF0ZSA9IHtcblxuICAgIHJ1bm5pbmc6IGZhbHNlLFxuXG4gICAgdGltZW91dDogZnVuY3Rpb24oY2Ipe1xuICAgICAgaWYoISRzY29wZS5yZWFkeSl7XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgaWYoISRyb290U2NvcGUudXBkYXRlLnJ1bm5pbmcpe1xuICAgICAgICAgICRyb290U2NvcGUudXBkYXRlLmFsbCgpO1xuICAgICAgICB9XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7ICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQoY2IpIH0sIDE1MDApO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgY2IoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBtZTogZnVuY3Rpb24oKXtcbiAgICAgIE1lbWJlckZhY3RvcnkuTWUuZ2V0KGZ1bmN0aW9uIChtZSkge1xuICAgICAgICAkc2NvcGUubWUgPSBtZTtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBtZW1iZXJzOiBmdW5jdGlvbigpe1xuICAgICAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuZ2V0QWxsKGZ1bmN0aW9uIChtZW1iZXJzKSB7XG4gICAgICAgICRzY29wZS5tZW1iZXJzID0gbWVtYmVycztcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjb21wYW5pZXM6IGZ1bmN0aW9uKCl7XG4gICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmdldEFsbChmdW5jdGlvbiAoY29tcGFuaWVzKSB7XG4gICAgICAgICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgc3BlYWtlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmdldEFsbChmdW5jdGlvbiAoc3BlYWtlcnMpIHtcbiAgICAgICAgJHNjb3BlLnNwZWFrZXJzID0gc3BlYWtlcnM7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgdG9waWNzOiBmdW5jdGlvbigpe1xuICAgICAgVG9waWNGYWN0b3J5LlRvcGljLmdldEFsbChmdW5jdGlvbiAodG9waWNzKSB7XG4gICAgICAgICRzY29wZS50b3BpY3MgPSB0b3BpY3M7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgcm9sZXM6IGZ1bmN0aW9uKCl7XG4gICAgICBSb2xlRmFjdG9yeS5Sb2xlLmdldEFsbChmdW5jdGlvbiAocm9sZXMpIHtcbiAgICAgICAgJHNjb3BlLnJvbGVzID0gcm9sZXM7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgdGFnczogZnVuY3Rpb24oKXtcbiAgICAgIFRhZ0ZhY3RvcnkuVGFnLmdldEFsbChmdW5jdGlvbiAodGFncykge1xuICAgICAgICAkc2NvcGUudG9waWNUYWdzID0gdGFncztcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjb21tZW50czogZnVuY3Rpb24oKXtcbiAgICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQuZ2V0QWxsKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgICAkc2NvcGUuY29tbWVudHMgPSBjb21tZW50cztcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjaGF0czogZnVuY3Rpb24oKSB7XG4gICAgICBDaGF0RmFjdG9yeS5DaGF0LmdldEFsbChmdW5jdGlvbihjaGF0cykge1xuICAgICAgICAkc2NvcGUuY2hhdHMgPSBjaGF0cztcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBldmVudHM6IGZ1bmN0aW9uKCkge1xuICAgICAgRXZlbnRGYWN0b3J5LkV2ZW50LmdldEFsbChmdW5jdGlvbihldmVudHMpIHtcbiAgICAgICAgJHNjb3BlLmV2ZW50cyA9IGV2ZW50cztcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRFdmVudCA9IGV2ZW50c1swXTtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzZXNzaW9uczogZnVuY3Rpb24oKSB7XG4gICAgICBTZXNzaW9uRmFjdG9yeS5TZXNzaW9uLmdldEFsbChmdW5jdGlvbihzZXNzaW9ucykge1xuICAgICAgICAkc2NvcGUuc2Vzc2lvbnMgPSBzZXNzaW9ucztcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBpdGVtczogZnVuY3Rpb24oKSB7XG4gICAgICBJdGVtRmFjdG9yeS5JdGVtLmdldEFsbChmdW5jdGlvbihpdGVtcykge1xuICAgICAgICAkc2NvcGUuaXRlbXMgPSBpdGVtcztcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBhbGw6IGZ1bmN0aW9uKCl7XG4gICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgICAgZmFjdG9yaWVzUmVhZHkgPSAwO1xuICAgICAgLy9jb25zb2xlLmxvZyhcIlVwZGF0aW5nIVwiKTtcbiAgICAgIHRoaXMubWUoKTtcbiAgICAgIHRoaXMubWVtYmVycygpO1xuICAgICAgdGhpcy5jb21wYW5pZXMoKTtcbiAgICAgIHRoaXMuc3BlYWtlcnMoKTtcbiAgICAgIHRoaXMudG9waWNzKCk7XG4gICAgICB0aGlzLnJvbGVzKCk7XG4gICAgICB0aGlzLnRhZ3MoKTtcbiAgICAgIHRoaXMuY29tbWVudHMoKTtcbiAgICAgIHRoaXMuY2hhdHMoKTtcbiAgICAgIHRoaXMuZXZlbnRzKCk7XG4gICAgICB0aGlzLnNlc3Npb25zKCk7XG4gICAgICB0aGlzLml0ZW1zKCk7XG4gICAgfVxuXG4gIH1cblxuICAkcm9vdFNjb3BlLnVwZGF0ZS5hbGwoKTtcblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIGNhbGxiYWNrKCkge1xuICAgIGlmICgrK2ZhY3Rvcmllc1JlYWR5ID09IDEyKSB7XG4gICAgICAkcm9vdFNjb3BlLnVwZGF0ZS5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAkc2NvcGUucmVhZHkgPSB0cnVlO1xuXG4gICAgICAkc2NvcGUudXBkYXRlKCk7XG5cbiAgICAgIHNldEludGVydmFsKCRzY29wZS51cGRhdGUsIDEwMDAwKTtcblxuICAgICAgJHJvb3RTY29wZS4kb24oXCIkbG9jYXRpb25DaGFuZ2VTdGFydFwiLCBmdW5jdGlvbiAoZXZlbnQsIG5leHQsIGN1cnJlbnQpIHtcbiAgICAgICAgc2V0VGltZW91dCgkc2NvcGUudXBkYXRlLCA1MDApO1xuICAgICAgICAkc2NvcGUuc2VhcmNoLm5hbWUgPSAnJztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVNDT1BFIEZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIE5vdGlmaWNhdGlvbkZhY3RvcnkuTm90aWZpY2F0aW9uLmdldEFsbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS50YXJnZXROb3RpZmljYXRpb25zID0gW107XG4gICAgICAkc2NvcGUudW5yZWFkTm90aWZpY2F0aW9ucyA9IFtdO1xuICAgICAgJHNjb3BlLnRhcmdldEluZm8ubnVtYmVyID0gMDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb25zZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocmVzcG9uc2VbaV0udGFyZ2V0cy5pbmRleE9mKCRzY29wZS5tZS5pZCkgIT0gLTEpIHtcbiAgICAgICAgICBpZiAocmVzcG9uc2VbaV0udW5yZWFkLmluZGV4T2YoJHNjb3BlLm1lLmlkKSAhPSAtMSkge1xuICAgICAgICAgICAgJHNjb3BlLnRhcmdldEluZm8ubnVtYmVyKys7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS50YXJnZXROb3RpZmljYXRpb25zLnVuc2hpZnQocmVzcG9uc2VbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNwb25zZVtpXS51bnJlYWQuaW5kZXhPZigkc2NvcGUubWUuaWQpICE9IC0xKSB7XG4gICAgICAgICAgJHNjb3BlLnVucmVhZE5vdGlmaWNhdGlvbnMudW5zaGlmdChyZXNwb25zZVtpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCRzY29wZS50YXJnZXRJbmZvLm51bWJlciA9PSAwKSB7XG4gICAgICAgICRzY29wZS50YXJnZXRJbmZvLnRleHQgPSBcIiBObyBOb3RpZmljYXRpb25zXCI7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgJHNjb3BlLnRhcmdldEluZm8udGV4dCA9IFwiIFwiICsgJHNjb3BlLnRhcmdldEluZm8ubnVtYmVyICsgXCIgTm90aWZpY2F0aW9uXCIgKyAoJHNjb3BlLnRhcmdldEluZm8ubnVtYmVyID4gMSA/IFwic1wiIDogXCJcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG4gICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgICByZXR1cm4gbmV3IERhdGUodGltZSkudG9VVENTdHJpbmcoKTtcbiAgfTtcblxuICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgdmFyIG1lbWJlciA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICB9KTtcblxuICAgIGlmKG1lbWJlci5sZW5ndGg+MCkge1xuICAgICAgcmV0dXJuIG1lbWJlclswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogXCJObyBvbmVcIixcbiAgICAgICAgZmFjZWJvb2s6IFwiMTAwMDAwNDU2MzM1OTcyXCJcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLmdldFNwZWFrZXIgPSBmdW5jdGlvbiAoc3BlYWtlcklkKSB7XG4gICAgcmV0dXJuICRzY29wZS5zcGVha2Vycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gc3BlYWtlcklkO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gICRzY29wZS5nZXRDb21wYW55ID0gZnVuY3Rpb24gKGNvbXBhbnlJZCkge1xuICAgIHJldHVybiAkc2NvcGUuY29tcGFuaWVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBjb21wYW55SWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmdldFRvcGljID0gZnVuY3Rpb24gKHRvcGljSWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uX2lkID09IHRvcGljSWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmdldE5vdGlmaWNhdGlvbnMgPSBmdW5jdGlvbiAodGhyZWFkKSB7XG4gICAgcmV0dXJuICRzY29wZS5ub3RpZmljYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby50aHJlYWQgPT0gdGhyZWFkO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gICRzY29wZS5nZXRVbnJlYWROb3RpZmljYXRpb25zID0gZnVuY3Rpb24gKHRocmVhZCkge1xuICAgIHJldHVybiAkc2NvcGUudW5yZWFkTm90aWZpY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8udGhyZWFkID09IHRocmVhZDtcbiAgICB9KVswXTtcbiAgfTtcblxuICAkc2NvcGUuZ2V0RXZlbnQgPSBmdW5jdGlvbiAoZXZlbnRJZCkge1xuICAgIHJldHVybiAkc2NvcGUuZXZlbnRzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBldmVudElkO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gICRzY29wZS5nZXRTZXNzaW9uID0gZnVuY3Rpb24gKHNlc3Npb25JZCkge1xuICAgIHJldHVybiAkc2NvcGUuc2Vzc2lvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLl9pZCA9PSBzZXNzaW9uSWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmdldEl0ZW0gPSBmdW5jdGlvbiAoaXRlbUlkKSB7XG4gICAgcmV0dXJuICRzY29wZS5pdGVtcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gaXRlbUlkO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gICRzY29wZS5nZXRQYXJ0aWNpcGF0aW9uID0gZnVuY3Rpb24gKHRoaW5nLCBldmVudElkKSB7XG4gICAgcmV0dXJuIHRoaW5nLnBhcnRpY2lwYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5ldmVudCA9PSBldmVudElkO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gICRzY29wZS5zaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLmRpc3BsYXkgPSAoJHNjb3BlLnNlYXJjaC5uYW1lID8gdHJ1ZSA6IGZhbHNlKTtcbiAgfTtcblxuICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5kaXNwbGF5ID0gZmFsc2U7XG4gIH07XG5cbiAgJHNjb3BlLmNvbnZlcnRVUkxzID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciB1cmxFeHAgPSAvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2lnO1xuXG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykucmVwbGFjZSh1cmxFeHAsXCI8YSBocmVmPSckMSc+JDE8L2E+XCIpO1xuICB9XG5cbiAgJHNjb3BlLmNvbnZlcnROZXdMaW5lc1RvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICByZXR1cm4gJzxkaXYgZGF0YS1tYXJrZG93bj4nK3RleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykrJzwvZGl2Pic7XG4gIH1cblxuICAkc2NvcGUuY29udmVydE1hcmtkb3duVG9IdG1sID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicgKyB0ZXh0ICsgJzwvZGl2Pic7XG4gIH1cblxuICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICRodHRwLmdldCh1cmxfcHJlZml4ICsgJy9hcGkvbG9nb3V0JykuXG4gICAgICBzdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcvJyk7XG4gICAgICB9KS5cbiAgICAgIGVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJFUlJPUlwiLCBkYXRhKTtcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oJy8nKTtcbiAgICAgIH0pO1xuICB9XG5cblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIk1lZXRpbmdFbWJlZENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgTWVldGluZ0ZhY3RvcnkpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICBNZWV0aW5nRmFjdG9yeS5nZXQoe2lkOiAkc2NvcGUubWVldGluZ0lkfSwgZnVuY3Rpb24gKG1lZXRpbmcpIHtcbiAgICAgICRzY29wZS5tZWV0aW5nID0gbWVldGluZztcblxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB9KTtcblxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgICByZXR1cm4gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgICAgIHJldHVybiBvLmlkID09PSBtZW1iZXJJZDtcbiAgICAgIH0pWzBdO1xuICAgIH07XG4gIH1cblxufSk7XG4iLCJyZXF1aXJlKFwiLi9lbWJlZFwiKTtcbnJlcXVpcmUoXCIuL2xpc3RcIik7XG5yZXF1aXJlKFwiLi9tZWV0aW5nXCIpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKCdNZWV0aW5nc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkbG9jYXRpb24sIE1lZXRpbmdGYWN0b3J5KSB7XG5cbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcblxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgaW5pdCgpO1xuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkc2NvcGUubG9hZGluZykge1xuICAgICAgICAgIGluaXQoKTtcbiAgICAgICAgfVxuICAgICAgfSwgMTAwMCk7XG5cbiAgICAgIE1lZXRpbmdGYWN0b3J5LmdldEFsbChmdW5jdGlvbiAobWVldGluZ3MpIHtcbiAgICAgICAgJHNjb3BlLm1lZXRpbmdzID0gbWVldGluZ3M7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUubWVldGluZ3MubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLm1lZXRpbmdzW2ldLmZhY2Vib29rID0gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUubWVldGluZ3NbaV0uYXV0aG9yID09IG8uaWQ7XG4gICAgICAgICAgfSlbMF0uZmFjZWJvb2s7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICRzY29wZS50aW1lID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgcmV0dXJuICRzY29wZS50aW1lU2luY2UobmV3IERhdGUoZGF0ZSkpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY3JlYXRlTWVldGluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICBNZWV0aW5nRmFjdG9yeS5jcmVhdGUoe1xuICAgICAgICBhdXRob3I6ICRzY29wZS5tZS5pZCxcbiAgICAgICAgdGl0bGU6IGRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKFwicHQtUFRcIikgKyBcIiAtIE1lZXRpbmdcIixcbiAgICAgICAgZGF0ZTogZGF0ZVxuICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9tZWV0aW5nL1wiICsgcmVzcG9uc2UuaWQgKyBcIi9lZGl0XCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTWVldGluZ0NvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24sICR0aW1lb3V0LCBNZWV0aW5nRmFjdG9yeSwgVG9waWNGYWN0b3J5LCBUYWdGYWN0b3J5KSB7XG5cbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcblxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgJHNjb3BlLmtpbmRzID0gW1wiSW5mb1wiLCBcIlRvIGRvXCIsIFwiRGVjaXNpb25cIiwgXCJJZGVhXCJdO1xuXG4gICAgTWVldGluZ0ZhY3RvcnkuZ2V0KHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24gKG1lZXRpbmcpIHtcbiAgICAgICRzY29wZS5tZWV0aW5nID0gbWVldGluZztcblxuICAgICAgU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCA9IGZ1bmN0aW9uIChzdWZmaXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXhPZihzdWZmaXgsIHRoaXMubGVuZ3RoIC0gc3VmZml4Lmxlbmd0aCkgIT09IC0xO1xuICAgICAgfTtcblxuICAgICAgaWYgKCRsb2NhdGlvbi5wYXRoKCkuZW5kc1dpdGgoXCIvdGV4dFwiKSkge1xuICAgICAgICB2YXIgdGV4dCA9IG1lZXRpbmcudGl0bGUgKyBcIlxcblxcblwiICsgKG1lZXRpbmcuZGVzY3JpcHRpb24gPyBtZWV0aW5nLmRlc2NyaXB0aW9uICsgXCJcXG5cXG5cIiA6IFwiXCIpO1xuXG4gICAgICAgIGlmIChtZWV0aW5nLmF0dGVuZGFudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRleHQgKz0gXCJBdHRlbmRhbnRzOlxcblwiO1xuXG4gICAgICAgICAgbWVldGluZy5hdHRlbmRhbnRzLnNvcnQoKTtcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVldGluZy5hdHRlbmRhbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0ZXh0ICs9ICRzY29wZS5nZXRNZW1iZXIobWVldGluZy5hdHRlbmRhbnRzW2ldKS5uYW1lICsgKGkrMSA8IG1lZXRpbmcuYXR0ZW5kYW50cy5sZW5ndGggPyBcIiwgXCIgOiBcIlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGV4dCArPSBcIlxcblxcblwiO1xuICAgICAgICB9XG5cbiAgICAgICAgVGFnRmFjdG9yeS5UYWcuZ2V0QWxsKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICB2YXIgdGFncyA9IFtdO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRhZ3MucHVzaChyZXN1bHRbaV0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRhZ3Muc29ydChmdW5jdGlvbiAobzEsIG8yKSB7XG4gICAgICAgICAgICByZXR1cm4gbzEubmFtZS5sb2NhbGVDb21wYXJlKG8yLm5hbWUpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdG9waWNzID0gbWVldGluZy50b3BpY3MuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvLnRhZ3MuaW5kZXhPZih0YWdzW2ldLmlkKSAhPSAtMTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodG9waWNzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGV4dCArPSB0YWdzW2ldLm5hbWUgKyBcIjpcXG5cIjtcblxuICAgICAgICAgICAgdG9waWNzLnNvcnQoZnVuY3Rpb24gKG8xLCBvMikge1xuICAgICAgICAgICAgICByZXR1cm4gbzEucG9zdGVkLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZShvMi5wb3N0ZWQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0b3BpY3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgdGV4dCArPSBcIiAgICAtIFwiICsgdG9waWNzW2pdLnRleHQucmVwbGFjZSgvXFxuL2csIFwiXFxuICAgICAgXCIpICsgXCJcXG5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGV4dCArPSBcIlxcblwiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICRzY29wZS5udW1iZXJPZkxpbmVzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBpZiAodGV4dFtpXSA9PT0gXCJcXG5cIikge1xuICAgICAgICAgICAgICAgIG4rKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG4gKyAyO1xuICAgICAgICAgIH0oKSk7XG5cbiAgICAgICAgICAkc2NvcGUudGV4dCA9IHRleHQ7XG5cbiAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICRzY29wZS50b2dnbGVBdHRlbmRhbnQgPSBmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgICB2YXIgaW5kZXggPSAkc2NvcGUubWVldGluZy5hdHRlbmRhbnRzLmluZGV4T2YobWVtYmVyKTtcblxuICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAkc2NvcGUubWVldGluZy5hdHRlbmRhbnRzLnB1c2gobWVtYmVyKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAkc2NvcGUubWVldGluZy5hdHRlbmRhbnRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS50b2dnbGVBdHRlbmRhbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUubWVtYmVycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgJHNjb3BlLnRvZ2dsZUF0dGVuZGFudCgkc2NvcGUubWVtYmVyc1tpXS5pZCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5nZXRBdHRlbmRhbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICRzY29wZS5tZWV0aW5nLmF0dGVuZGFudHMubWFwKGZ1bmN0aW9uIChvKSB7XG4gICAgICAgIHJldHVybiAkc2NvcGUuZ2V0TWVtYmVyKG8pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5jcmVhdGVUb3BpYyA9IGZ1bmN0aW9uIChraW5kKSB7XG4gICAgICB2YXIgdG9waWMgPSB7XG4gICAgICAgIGVkaXRpbmc6IHRydWUsXG4gICAgICAgIGF1dGhvcjogJHNjb3BlLm1lLmlkLFxuICAgICAgICB0ZXh0OiBcIlwiLFxuICAgICAgICB0YXJnZXRzOiBbXSxcbiAgICAgICAga2luZDoga2luZCxcbiAgICAgICAgY2xvc2VkOiBmYWxzZSxcbiAgICAgICAgcmVzdWx0OiBcIlwiLFxuICAgICAgICBwb2xsOiB7XG4gICAgICAgICAga2luZDogXCJ0ZXh0XCIsXG4gICAgICAgICAgb3B0aW9uczogW11cbiAgICAgICAgfSxcbiAgICAgICAgZHVlZGF0ZTogbnVsbCxcbiAgICAgICAgbWVldGluZ3M6IFskc2NvcGUubWVldGluZy5faWRdLFxuICAgICAgICByb290OiBudWxsLFxuICAgICAgICB0YWdzOiBbXSxcbiAgICAgICAgcG9zdGVkOiBuZXcgRGF0ZSgpXG4gICAgICB9O1xuXG4gICAgICBUb3BpY0ZhY3RvcnkuVG9waWMuY3JlYXRlKHRvcGljLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICB0b3BpYy5faWQgPSByZXNwb25zZS5pZDtcbiAgICAgICAgICAkc2NvcGUubWVldGluZy50b3BpY3MucHVzaCh0b3BpYyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuYWRkVG9waWMgPSBmdW5jdGlvbiAodG9waWNJZCkge1xuICAgICAgJHNjb3BlLmRpc3BsYXkgPSBmYWxzZTtcblxuICAgICAgdmFyIHRvcGljID0gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgcmV0dXJuIG8uX2lkID09PSB0b3BpY0lkO1xuICAgICAgfSlbMF07XG5cbiAgICAgICRzY29wZS5tZWV0aW5nLnRvcGljcy5wdXNoKHRvcGljKTtcblxuICAgICAgdG9waWMubWVldGluZ3MucHVzaCgkc2NvcGUubWVldGluZy5faWQpO1xuICAgICAgVG9waWNGYWN0b3J5LlRvcGljLnVwZGF0ZSh7aWQ6IHRvcGljLl9pZH0sIHRvcGljKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnJlbW92ZVRvcGljID0gZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgICAkc2NvcGUubWVldGluZy50b3BpY3Muc3BsaWNlKCRzY29wZS5tZWV0aW5nLnRvcGljcy5pbmRleE9mKHRvcGljKSwgMSk7XG5cbiAgICAgIHRvcGljLm1lZXRpbmdzLnNwbGljZSh0b3BpYy5tZWV0aW5ncy5pbmRleE9mKCRzY29wZS5tZWV0aW5nLl9pZCksIDEpO1xuICAgICAgVG9waWNGYWN0b3J5LlRvcGljLnVwZGF0ZSh7aWQ6IHRvcGljLl9pZH0sIHRvcGljKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNhdmVNZWV0aW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLnN1Y2Nlc3MgPSBcIlwiO1xuICAgICAgJHNjb3BlLmVycm9yICAgPSBcIlwiO1xuXG4gICAgICBpZiAoISRzY29wZS5tZWV0aW5nLnRpdGxlKXtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gXCJQbGVhc2UgZW50ZXIgYSB0aXRsZS5cIjtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBNZWV0aW5nRmFjdG9yeS51cGRhdGUoe2lkOiAkc2NvcGUubWVldGluZy5faWR9LCAkc2NvcGUubWVldGluZywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgJHNjb3BlLnN1Y2Nlc3MgPSBcIk1lZXRpbmcgc2F2ZWQuXCI7XG5cbiAgICAgICAgICBpZiAoJHNjb3BlLnRpbWVvdXQpIHtcbiAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCgkc2NvcGUudGltZW91dCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJHNjb3BlLnRpbWVvdXQgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VjY2VzcyA9IFwiXCI7XG4gICAgICAgICAgfSwgMzAwMCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5kZWxldGVNZWV0aW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGNvbmZpcm0oXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgbWVldGluZz9cIikpIHtcbiAgICAgICAgTWVldGluZ0ZhY3RvcnkuZGVsZXRlKHtpZDogJHNjb3BlLm1lZXRpbmcuX2lkfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IFwiVGhlcmUgd2FzIGFuIGVycm9yLiBQbGVhc2UgY29udGFjdCB0aGUgRGV2IFRlYW0gYW5kIGdpdmUgdGhlbSB0aGUgZGV0YWlscyBhYm91dCB0aGUgZXJyb3IuXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvbWVldGluZ3MvXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLmRpc3BsYXkgPSAoJHNjb3BlLnNlYXJjaFRvcGljID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmFscmVhZHlJbk1lZXRpbmdGaWx0ZXIgPSBmdW5jdGlvbiAodG9waWMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLm1lZXRpbmcudG9waWNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICgkc2NvcGUubWVldGluZy50b3BpY3NbaV0uX2lkID09PSB0b3BpYy5faWQpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJDcmVhdGVNZW1iZXJDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcywgTWVtYmVyRmFjdG9yeSkge1xuXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgJHNjb3BlLmZvcm1EYXRhID0ge307XG4gICAgJHNjb3BlLmZvcm1EYXRhLnJvbGVzID0gW107XG4gICAgJHNjb3BlLmZvcm1EYXRhLnBob25lcyA9IFtdO1xuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG1lbWJlckRhdGEgPSB0aGlzLmZvcm1EYXRhO1xuXG4gICAgICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5jcmVhdGUobWVtYmVyRGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvbWVtYmVyL1wiICsgcmVzcG9uc2UuaWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG5cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJNZW1iZXJFbWJlZENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSkge1xuXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gIH1cblxufSk7XG4iLCJyZXF1aXJlKCcuL21lbWJlci5qcycpO1xucmVxdWlyZSgnLi9saXN0LmpzJyk7XG5yZXF1aXJlKCcuL2NyZWF0ZS5qcycpO1xucmVxdWlyZSgnLi9lbWJlZC5qcycpOyIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTWVtYmVyc0NvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgTWVtYmVyRmFjdG9yeSkge1xuICBcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcblxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG4gICAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLm1lbWJlclByZWRpY2F0ZSA9IFwibmFtZVwiO1xuICAgICAgJHNjb3BlLnJldmVyc2UgPSBmYWxzZTtcbiAgICAgICRzY29wZS5tZW1iZXJzID0gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJNZW1iZXJDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsICRsb2NhdGlvbiwgTWVtYmVyRmFjdG9yeSkge1xuXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgaWYgKCRyb3V0ZVBhcmFtcy5pZCA9PT0gXCJtZVwiKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aChcIi9tZW1iZXIvXCIgKyAkc2NvcGUubWUuaWQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgICRzY29wZS5tZW1iZXIgPSAkc2NvcGUuZm9ybURhdGEgPSAkc2NvcGUuZ2V0TWVtYmVyKCRyb3V0ZVBhcmFtcy5pZCk7XG5cbiAgICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXQoe2lkOiRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKHJlc3VsdCkgeyBcbiAgICAgIGlmKCFyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgJHNjb3BlLm1lbWJlciA9ICRzY29wZS5mb3JtRGF0YSA9IHJlc3VsdDtcbiAgICAgICAgZ2V0TWVtYmVyU3R1ZmYoKTtcbiAgICAgIH0gXG4gICAgfSk7XG5cbiAgICBnZXRNZW1iZXJTdHVmZigpO1xuXG4gICAgZnVuY3Rpb24gZ2V0TWVtYmVyU3R1ZmYoKSB7XG4gICAgICBpZigkc2NvcGUuY29tcGFuaWVzICYmICRzY29wZS5zcGVha2VycyAmJiAkc2NvcGUuY29tbWVudHMgJiYgJHNjb3BlLmNvbXBhbmllcy5sZW5ndGggPiAwICYmICRzY29wZS5zcGVha2Vycy5sZW5ndGggPiAwICYmICRzY29wZS5jb21tZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChnZXRNZW1iZXJTdHVmZiwgMTAwMCk7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5tZW1iZXJTdHVmZiA9IHt9O1xuXG4gICAgICAkc2NvcGUubWVtYmVyU3R1ZmYuY29tcGFuaWVzID0gJHNjb3BlLmNvbXBhbmllcy5maWx0ZXIoZnVuY3Rpb24oZSkge1xuICAgICAgICByZXR1cm4gZS5tZW1iZXIgPT0gJHNjb3BlLm1lbWJlci5pZDtcbiAgICAgIH0pXG5cbiAgICAgICRzY29wZS5tZW1iZXJTdHVmZi5zcGVha2VycyA9ICRzY29wZS5zcGVha2Vycy5maWx0ZXIoZnVuY3Rpb24oZSkge1xuICAgICAgICByZXR1cm4gZS5tZW1iZXIgPT0gJHNjb3BlLm1lbWJlci5pZDtcbiAgICAgIH0pXG5cbiAgICAgICRzY29wZS5tZW1iZXJTdHVmZi5jb21tZW50cyA9ICRzY29wZS5jb21tZW50cy5maWx0ZXIoZnVuY3Rpb24oZSkge1xuICAgICAgICByZXR1cm4gZS5tZW1iZXIgPT0gJHNjb3BlLm1lbWJlci5pZDtcbiAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbWVtYmVyRGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICAgIE1lbWJlckZhY3RvcnkuTWVtYmVyLnVwZGF0ZSh7IGlkOm1lbWJlckRhdGEuaWQgfSwgbWVtYmVyRGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLnN1Y2Nlc3M7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignU3BlYWtlckVtYWlsQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsICRsb2NhdGlvbiwgRW1haWxGYWN0b3J5KSB7XG5cbiAgICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgICAkc2NvcGUuZW1haWwgPSAkbG9jYXRpb24uc2VhcmNoKCkuZW1haWw7XG4gICAgICAkc2NvcGUuc3BlYWtlcklkID0gJHJvdXRlUGFyYW1zLmlkO1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgICAkc2NvcGUubWVzc2FnZSA9IG51bGw7XG5cbiAgICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuICAgICAgICAkc2NvcGUubWVzc2FnZSA9IG51bGw7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInNlbmQgZW1haWwgdG8gXCIsICRzY29wZS5lbWFpbCwgXCIgZnJvbSBcIiwgJHNjb3BlLnNwZWFrZXJJZCk7XG5cbiAgICAgICAgRW1haWxGYWN0b3J5LlNwZWFrZXIuc2VuZCh7IGlkOiAkc2NvcGUuc3BlYWtlcklkIH0sIHsgZW1haWw6ICRzY29wZS5lbWFpbCB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbiBcbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDcmVhdGVTcGVha2VyQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgU3BlYWtlckZhY3RvcnkpIHtcbiAgICBcbiAgICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzcGVha2VyRGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICAgICAgc3BlYWtlckRhdGEuc3RhdHVzID0gJ1N1Z2dlc3Rpb24nO1xuXG4gICAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuY3JlYXRlKHNwZWFrZXJEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuXG4gICAgICAgICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmdldEFsbChmdW5jdGlvbiAoc3BlYWtlcnMpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLnNwZWFrZXJzID0gc3BlYWtlcnM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvc3BlYWtlci9cIiArIHJlc3BvbnNlLmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9XG4gIH0pOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignU3BlYWtlckVtYmVkQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgIGlmKCRzY29wZS5jb21tZW50cykge1xuICAgICAgJHNjb3BlLnNwZWFrZXIuY29tbWVudHMgPSAkc2NvcGUuY29tbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcmV0dXJuIGUudGhyZWFkID09ICdzcGVha2VyLScrJHNjb3BlLnNwZWFrZXIuaWQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZigkc2NvcGUuZXZlbnQpIHtcbiAgICAgICRzY29wZS5wYXJ0aWNpcGF0aW9uID0gJHNjb3BlLnNwZWFrZXIucGFydGljaXBhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgcmV0dXJuIG8uZXZlbnQgPT0gJHNjb3BlLmV2ZW50LmlkO1xuICAgICAgfSlbMF07XG4gICAgfVxuXG4gICAgJHNjb3BlLmdldFVucmVhZE5vdGlmaWNhdGlvbnMgPSBmdW5jdGlvbiAodGhyZWFkKSB7XG4gICAgICB2YXIgbm90aWZpY2F0aW9ucyA9ICRzY29wZS5ub3RpZmljYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLnRocmVhZCA9PSB0aHJlYWQ7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBub3RpZmljYXRpb25zO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc3BlYWtlci51bnJlYWQgPSAkc2NvcGUuZ2V0VW5yZWFkTm90aWZpY2F0aW9ucygnc3BlYWtlci0nICsgJHNjb3BlLnNwZWFrZXIuaWQpLmxlbmd0aCA+IDA7XG5cbiAgICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgICB2YXIgbWVtYmVyID0gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XG4gICAgICB9KTtcblxuICAgICAgaWYobWVtYmVyLmxlbmd0aD4wKSB7XG4gICAgICAgIHJldHVybiBtZW1iZXJbMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6ICdObyBvbmUnLFxuICAgICAgICAgIGZhY2Vib29rOiAnMTAwMDAwNDU2MzM1OTcyJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgICAgaWYoc2Vjb25kcyA8IDApe1xuICAgICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcblxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArICcgeWVhcnMgJyArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgJyBtb250aHMgJyArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArICcgZGF5cyAnICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyAnIGhvdXJzICcgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyAnIG1pbnV0ZXMgJyArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgJyBzZWNvbmRzICcgKyBzdWZmaXg7XG4gICAgfTtcbiAgfVxuXG59KTtcbiIsInJlcXVpcmUoJy4vc3BlYWtlci5qcycpO1xucmVxdWlyZSgnLi9saXN0LmpzJyk7XG5yZXF1aXJlKCcuL2NyZWF0ZS5qcycpO1xucmVxdWlyZSgnLi9jb25maXJtLmpzJyk7XG5yZXF1aXJlKCcuL2VtYmVkLmpzJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdTcGVha2Vyc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHNjZSwgU3BlYWtlckZhY3RvcnkpIHtcblxuICAgICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG5cbiAgICAgICRzY29wZS5saW1pdCA9IDIwO1xuXG4gICAgICAkc2NvcGUuc3RhdHVzZXMgPSBbJ1N1Z2dlc3Rpb24nLCdTZWxlY3RlZCcsJ0FwcHJvdmVkJywnQ29udGFjdGVkJywnSW4gQ29udmVyc2F0aW9ucycsJ0FjY2VwdGVkJywnUmVqZWN0ZWQnLCdHaXZlIFVwJ107XG5cbiAgICAgICRzY29wZS5zcGVha2VyUHJlZGljYXRlID0gJ3VwZGF0ZWQnO1xuICAgICAgJHNjb3BlLnJldmVyc2UgPSAndHJ1ZSc7XG4gICAgICAkc2NvcGUuZmlsdGVyZWRTcGVha2VycyA9IFtdO1xuICAgICAgJHNjb3BlLnNlYXJjaFNwZWFrZXJzID0ge3VuYXNzaWduZWQ6IHRydWUsIHVuYXNzaWduZWRPbmx5OiBmYWxzZX07XG4gICAgICAkc2NvcGUudW5yZWFkRmlyc3QgPSB0cnVlO1xuXG5cblxuICAgICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXRBbGwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLnNwZWFrZXJzID0gcmVzcG9uc2U7XG4gICAgICAgIC8vJHNjb3BlLmZpbHRlcmVkU3BlYWtlcnMgPSAkc2NvcGUuc3BlYWtlcnM7XG4gICAgICB9KTtcblxuICAgICAgJHNjb3BlLnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJHNjb3BlLmxpbWl0IDw9ICRzY29wZS5zcGVha2Vycy5sZW5ndGgpXG4gICAgICAgICAgJHNjb3BlLmxpbWl0ICs9IDg7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKG1lbWJlcikge1xuICAgICAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYocm9sZXMubGVuZ3RoID09PSAwICYmIG1lbWJlci5pZCAhPSAkc2NvcGUubWUuaWQpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5hZGRTcGVha2VyID0gZnVuY3Rpb24obWVtYmVyLCBuZXdTcGVha2VyKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2cobmV3U3BlYWtlcik7XG4gICAgICAgIHZhciBzcGVha2VyRGF0YSA9IG5ld1NwZWFrZXI7XG5cbiAgICAgICAgaWYobmV3U3BlYWtlci5pZCkge1xuICAgICAgICAgIHZhciBwYXJ0aWNpcGF0aW9uID0gJHNjb3BlLmdldFBhcnRpY2lwYXRpb24oc3BlYWtlckRhdGEsICRzY29wZS5jdXJyZW50RXZlbnQuaWQpO1xuICAgICAgICAgIGlmKHBhcnRpY2lwYXRpb24pIHtcbiAgICAgICAgICAgIHBhcnRpY2lwYXRpb24ubWVtYmVyID0gbWVtYmVyLmlkO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzcGVha2VyRGF0YS5wYXJ0aWNpcGF0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgZXZlbnQ6ICRzY29wZS5jdXJyZW50RXZlbnQuaWQsXG4gICAgICAgICAgICAgIHN0YXR1czogJ1NlbGVjdGVkJyxcbiAgICAgICAgICAgICAgbWVtYmVyOiBtZW1iZXIuaWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLnVwZGF0ZSh7IGlkOiBzcGVha2VyRGF0YS5pZCB9LCB7IHBhcnRpY2lwYXRpb25zOiBzcGVha2VyRGF0YS5wYXJ0aWNpcGF0aW9ucyB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xuXG4gICAgICAgICAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKGZ1bmN0aW9uIChzcGVha2Vycykge1xuICAgICAgICAgICAgICAgICRzY29wZS5zcGVha2VycyA9IHNwZWFrZXJzO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGVha2VyRGF0YS5wYXJ0aWNpcGF0aW9ucyA9IFt7XG4gICAgICAgICAgICBldmVudDogJHNjb3BlLmN1cnJlbnRFdmVudC5pZCxcbiAgICAgICAgICAgIHN0YXR1czogJ1NlbGVjdGVkJyxcbiAgICAgICAgICAgIG1lbWJlcjogbWVtYmVyLmlkXG4gICAgICAgICAgfV07XG5cbiAgICAgICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmNyZWF0ZShzcGVha2VyRGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuXG4gICAgICAgICAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKGZ1bmN0aW9uIChzcGVha2Vycykge1xuICAgICAgICAgICAgICAgICRzY29wZS5zcGVha2VycyA9IHNwZWFrZXJzO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8gJHNjb3BlLiR3YXRjaChbJ2N1cnJlbnRFdmVudCcsICdzZWFyY2hTdGF0dXMnXSwgZnVuY3Rpb24obmV3VmFsdWVzLCBvbGRWYWx1ZXMsIHNjb3BlKXtcbiAgICAgIC8vICAgLy9jb25zb2xlLmxvZygnZmlsdGVyaW5nIHNwZWFrZXJzIGJ5Jywkc2NvcGUuc2VhcmNoU3RhdHVzLCRzY29wZS5jdXJyZW50RXZlbnQpO1xuICAgICAgLy8gICBpZigkc2NvcGUuc3BlYWtlcnMpe1xuICAgICAgLy8gICAgICRzY29wZS5maWx0ZXJlZFNwZWFrZXJzID0gJHNjb3BlLnNwZWFrZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAvLyAgICAgICByZXR1cm4gby5wYXJ0aWNpcGF0aW9ucy5maWx0ZXIoZnVuY3Rpb24ocCkge1xuICAgICAgLy8gICAgICAgICBpZigkc2NvcGUuc2VhcmNoU3RhdHVzICYmICRzY29wZS5zZWFyY2hTdGF0dXMgIT09ICcnKSB7XG4gICAgICAvLyAgICAgICAgICAgcmV0dXJuIHAuZXZlbnQgPT09ICRzY29wZS5jdXJyZW50RXZlbnQuaWQgJiYgcC5zdGF0dXMgPT09ICRzY29wZS5zZWFyY2hTdGF0dXM7XG4gICAgICAvLyAgICAgICAgIH0gZWxzZSB7XG4gICAgICAvLyAgICAgICAgICAgcmV0dXJuIHAuZXZlbnQgPT09ICRzY29wZS5jdXJyZW50RXZlbnQuaWQ7XG4gICAgICAvLyAgICAgICAgIH1cbiAgICAgIC8vICAgICAgIH0pO1xuICAgICAgLy8gICAgIH0pO1xuICAgICAgLy8gICB9XG4gICAgICAvLyB9KTtcbiAgICB9XG4gIH0pO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdTcGVha2VyQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRsb2NhdGlvbiwgJHdpbmRvdywgJHJvdXRlUGFyYW1zLCAkc2NlLCBTcGVha2VyRmFjdG9yeSwgTWVtYmVyRmFjdG9yeSwgTm90aWZpY2F0aW9uRmFjdG9yeSkge1xuICAgIFxuICAgICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG5cbiAgICAgICRzY29wZS5jb21tdW5pY2F0aW9uRXZlbnQgPSAkc2NvcGUuY3VycmVudEV2ZW50O1xuXG4gICAgICAkc2NvcGUuc2V0Q29tbXVuaWNhdGlvbkV2ZW50ID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgJHNjb3BlLmNvbW11bmljYXRpb25FdmVudCA9IGV2ZW50O1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUudHJ1c3RTcmMgPSBmdW5jdGlvbihzcmMpIHtcbiAgICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKHNyYysnI3BhZ2UtYm9keScpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLmNvbnZlcnRFbWFpbHMgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgIHZhciBtYWlsRXhwID0gL1tcXHdcXC5cXC1dK1xcQChbXFx3XFwtXStcXC4pK1tcXHddezIsNH0oPyFbXjxdKj4pL2lnO1xuICAgICAgICB2YXIgdHdpdHRlckV4cCA9IC8oXnxbXkBcXHddKUAoXFx3ezEsMTV9KVxcYi9nO1xuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKG1haWxFeHAsJzxhIGhyZWY9XCJtYWlsdG86JCZcIj4kJjwvYT4nKS5yZXBsYWNlKHR3aXR0ZXJFeHAsJyQxPGEgaHJlZj1cImh0dHA6Ly90d2l0dGVyLmNvbS8kMlwiIHRhcmdldD1cIl9ibGFua1wiPkAkMjwvYT4nKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNwZWFrZXJEYXRhID0gdGhpcy5mb3JtRGF0YTtcblxuICAgICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLnVwZGF0ZSh7IGlkOnNwZWFrZXJEYXRhLmlkIH0sIHNwZWFrZXJEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ3NwZWFrZXIvJytzcGVha2VyRGF0YS5pZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5kZWxldGVTcGVha2VyID0gZnVuY3Rpb24oc3BlYWtlcikge1xuICAgICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmRlbGV0ZSh7IGlkOnNwZWFrZXIuaWQgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2Uuc3VjY2VzcztcbiAgICAgICAgICB9XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ3NwZWFrZXJzLycpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByb2xlcyA9ICRzY29wZS5tZS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZihyb2xlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zdGF0dXNlcyA9IFsnU3VnZ2VzdGlvbicsJ1NlbGVjdGVkJywnQXBwcm92ZWQnLCdDb250YWN0ZWQnLCdJbiBDb252ZXJzYXRpb25zJywnQWNjZXB0ZWQnLCdSZWplY3RlZCcsJ0dpdmUgVXAnXTtcblxuICAgICAgJHNjb3BlLnNwZWFrZXIgPSAkc2NvcGUuZm9ybURhdGEgPSAkc2NvcGUuZ2V0U3BlYWtlcigkcm91dGVQYXJhbXMuaWQpO1xuXG4gICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmdldCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5zcGVha2VyID0gJHNjb3BlLmZvcm1EYXRhID0gcmVzcG9uc2U7XG5cbiAgICAgICAgTm90aWZpY2F0aW9uRmFjdG9yeS5TcGVha2VyLmdldEFsbCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKGdldERhdGEpIHtcbiAgICAgICAgICAkc2NvcGUuc3BlYWtlck5vdGlmaWNhdGlvbnMgPSBnZXREYXRhO1xuXG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdmFyIHdpbiA9ICR3aW5kb3c7XG4gICAgICAkc2NvcGUuJHdhdGNoKCdzcGVha2VyRm9ybS4kZGlydHknLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZih2YWx1ZSkge1xuICAgICAgICAgIHdpbi5vbmJlZm9yZXVubG9hZCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJ1lvdSBoYXZlIHVuc2F2ZWQgY2hhbmdlcyc7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gIH0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJTdWJzY3JpcHRpb25Db250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIFN1YnNjcmlwdGlvbkZhY3RvcnkpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgIHZhciB0aHJlYWRJZCA9ICRzY29wZS50aHJlYWQuc3Vic3RyaW5nKCRzY29wZS50aHJlYWQuaW5kZXhPZihcIi1cIikgKyAxKTtcbiAgICB2YXIgdGhyZWFkS2luZCA9ICRzY29wZS50aHJlYWQuc3BsaXQoJy0nKVswXTtcblxuICAgIHZhciBGYWN0b3J5O1xuXG4gICAgc3dpdGNoKHRocmVhZEtpbmQpIHtcbiAgICAgIGNhc2UgJ2NvbXBhbnknOlxuICAgICAgICBGYWN0b3J5ID0gU3Vic2NyaXB0aW9uRmFjdG9yeS5Db21wYW55O1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzcGVha2VyJzpcbiAgICAgICAgRmFjdG9yeSA9IFN1YnNjcmlwdGlvbkZhY3RvcnkuU3BlYWtlcjtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndG9waWMnOlxuICAgICAgICBGYWN0b3J5ID0gU3Vic2NyaXB0aW9uRmFjdG9yeS5Ub3BpYztcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vY29uc29sZS5sb2coJ1RIUkVBRCcsICRzY29wZS50aHJlYWQsIHRocmVhZEtpbmQsIHRocmVhZElkKTtcbiAgICAvL2NvbnNvbGUubG9nKCdGQUNUT1JZWVknLCBTdWJzY3JpcHRpb25GYWN0b3J5LkNvbXBhbnksIFN1YnNjcmlwdGlvbkZhY3RvcnkuU3BlYWtlciwgU3Vic2NyaXB0aW9uRmFjdG9yeS5Ub3BpYywgRmFjdG9yeSk7XG5cbiAgICAkc2NvcGUuaXNTdWJzY3JpYmVkID0gZmFsc2U7XG5cbiAgICAkc2NvcGUuZ2V0U3RhdHVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgRmFjdG9yeS5nZXQoe2lkOiB0aHJlYWRJZH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ1NUQVRVUycscmVzcG9uc2Uuc3VjY2VzcylcbiAgICAgICAgaWYocmVzcG9uc2Uuc3VjY2VzcyA9PSAnc3Vic2NyaWJlZCcpIHtcbiAgICAgICAgICAkc2NvcGUuaXNTdWJzY3JpYmVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUuaXNTdWJzY3JpYmVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfTtcblxuICAgICRzY29wZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKCdBREREJywgdGhyZWFkS2luZCwgdGhyZWFkSWQpO1xuICAgICAgRmFjdG9yeS5hZGQoe2lkOiB0aHJlYWRJZH0sIHt9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUuZ2V0U3RhdHVzKCk7XG4gICAgICB9KVxuICAgIH07XG5cbiAgICAkc2NvcGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKCdERUxFVEUnLCB0aHJlYWRLaW5kLCB0aHJlYWRJZCk7XG4gICAgICBGYWN0b3J5LnJlbW92ZSh7aWQ6IHRocmVhZElkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLmdldFN0YXR1cygpO1xuICAgICAgfSlcbiAgICB9O1xuXG4gICAgJHNjb3BlLmdldFN0YXR1cygpO1xuICB9XG59KTtcbiIsInJlcXVpcmUoJy4vZW1iZWQnKTsiLCJyZXF1aXJlKCcuL21hbmFnZXInKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIlRhZ01hbmFnZXJDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIFRhZ0ZhY3RvcnkpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICRzY29wZS50YWcgPSB7fTtcblxuICAgICRzY29wZS5saWdodENvbG9ycyA9IFtcIiNmN2M2YzdcIiwgXCIjZmFkOGM3XCIsIFwiI2ZlZjJjMFwiLCBcIiNiZmU1YmZcIiwgXCIjYmZkYWRjXCIsIFwiI2M3ZGVmOFwiLCBcIiNiZmQ0ZjJcIiwgXCIjZDRjNWY5XCJdO1xuICAgICRzY29wZS5jb2xvcnMgPSBbXCIjZTExZDIxXCIsIFwiI2ViNjQyMFwiLCBcIiNmYmNhMDRcIiwgXCIjMDA5ODAwXCIsIFwiIzAwNmI3NVwiLCBcIiMyMDdkZTVcIiwgXCIjMDA1MmNjXCIsIFwiIzUzMTllN1wiXTtcblxuICAgICRzY29wZS5jaGFuZ2VDb2xvciA9IGZ1bmN0aW9uIChjb2xvcikge1xuICAgICAgJHNjb3BlLnRhZy5jb2xvciA9IGNvbG9yO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY3JlYXRlVGFnID0gZnVuY3Rpb24gKHRhZykge1xuICAgICAgVGFnRmFjdG9yeS5UYWcuY3JlYXRlKHRhZywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgJHNjb3BlLnRhZ3MucHVzaChyZXNwb25zZS50YWcpO1xuICAgICAgICAgICRzY29wZS50YWcgPSB7fTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zYXZlVGFnID0gZnVuY3Rpb24gKHRhZykge1xuICAgICAgVGFnRmFjdG9yeS5UYWcudXBkYXRlKHtpZDogdGFnLmlkfSwgdGFnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICB0YWcuZWRpdGluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmRlbGV0ZVRhZyA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgIFRhZ0ZhY3RvcnkuVGFnLmRlbGV0ZSh7aWQ6IHRhZy5pZH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICRzY29wZS50YWdzLnNwbGljZSgkc2NvcGUudGFncy5pbmRleE9mKHRhZyksIDEpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiVG9waWNFbWJlZENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGxvY2F0aW9uLCBUb3BpY0ZhY3RvcnksIE5vdGlmaWNhdGlvbkZhY3RvcnkpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAkc2NvcGUuZXJyb3IgICAgICAgPSBcIlwiO1xuICAgICRzY29wZS5zaG93VGFyZ2V0cyA9IGZhbHNlO1xuXG4gICAgJHNjb3BlLnBvbGxLaW5kcyA9IFtcInRleHRcIiwgXCJpbWFnZXNcIl07XG5cbiAgICBpZiAoJHNjb3BlLmNvbW1lbnRzKSB7XG4gICAgICAkc2NvcGUudG9waWMuY29tbWVudHMgPSAkc2NvcGUuY29tbWVudHMuZmlsdGVyKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBlLnRocmVhZCA9PSBcInRvcGljLVwiICsgJHNjb3BlLnRvcGljLl9pZDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNob3coJHNjb3BlLnRvcGljKTtcblxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1BVVhGVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBmdW5jdGlvbiBzaG93KHRvcGljKSB7XG4gICAgICB0b3BpYy5zaG93ID0ge1xuICAgICAgICB0ZXh0ICAgICA6IHRydWUsXG4gICAgICAgIHRhcmdldHMgIDogdHJ1ZSxcbiAgICAgICAgcG9sbCAgICAgOiBmYWxzZSxcbiAgICAgICAgZHVlZGF0ZSAgOiBmYWxzZSxcbiAgICAgICAgbWVldGluZyAgOiB0cnVlLFxuICAgICAgICBjbG9zZWQgICA6IGZhbHNlXG4gICAgICB9O1xuXG4gICAgICBpZiAodG9waWMua2luZCA9PT0gXCJUbyBkb1wiKSB7XG4gICAgICAgIHRvcGljLnNob3cuZHVlZGF0ZSA9IHRydWU7XG4gICAgICAgIHRvcGljLnNob3cuY2xvc2VkICA9IHRydWU7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0b3BpYy5raW5kID09PSBcIkRlY2lzaW9uXCIpIHtcbiAgICAgICAgdG9waWMuc2hvdy5kdWVkYXRlID0gdHJ1ZTtcbiAgICAgICAgdG9waWMuc2hvdy5jbG9zZWQgID0gdHJ1ZTtcbiAgICAgICAgdG9waWMuc2hvdy5wb2xsID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgICBpZiAoISRzY29wZS5tZS5yb2xlcykgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbiAobykge1xuICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocm9sZXMubGVuZ3RoID09IDAgJiYgdG9waWMuYXV0aG9yICE9ICRzY29wZS5tZS5pZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAkc2NvcGUuZGVsZXRlVG9waWMgPSBmdW5jdGlvbiAodG9waWMpIHtcbiAgICAgIGlmIChjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIHRvcGljP1wiKSkge1xuICAgICAgICBUb3BpY0ZhY3RvcnkuVG9waWMuZGVsZXRlKHtpZDogdG9waWMuX2lkfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRvcGljLmRlbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvdG9waWNzJyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUudG9nZ2xlVGFnID0gZnVuY3Rpb24gKHRhZykge1xuICAgICAgdmFyIGluZGV4ID0gJHNjb3BlLnRvcGljLnRhZ3MuaW5kZXhPZih0YWcpO1xuXG4gICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgJHNjb3BlLnRvcGljLnRhZ3MucHVzaCh0YWcpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICRzY29wZS50b3BpYy50YWdzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5nZXRUYWdJY29uID0gZnVuY3Rpb24gKHRhZykge1xuICAgICAgcmV0dXJuICgkc2NvcGUudG9waWMudGFncy5pbmRleE9mKHRhZy5pZCkgIT09IC0xID8gXCJjaGVja1wiIDogXCJ0aW1lc1wiKTs7XG4gICAgfTtcblxuICAgICRzY29wZS50b2dnbGVUYXJnZXQgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICB2YXIgaW5kZXggPSAkc2NvcGUudG9waWMudGFyZ2V0cy5pbmRleE9mKHRhcmdldCk7XG5cbiAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAkc2NvcGUudG9waWMudGFyZ2V0cy5wdXNoKHRhcmdldCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgJHNjb3BlLnRvcGljLnRhcmdldHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLnRvZ2dsZUFsbFRhcmdldHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS5tZW1iZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAkc2NvcGUudG9nZ2xlVGFyZ2V0KCRzY29wZS5tZW1iZXJzW2ldLmlkKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLnRvZ2dsZVJvbGVUYXJnZXRzID0gZnVuY3Rpb24gKHJvbGVJZCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUubWVtYmVycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgZm9yKHZhciBvID0gMDsgbyA8ICRzY29wZS5tZW1iZXJzW2ldLnJvbGVzLmxlbmd0aDsgbysrKSB7XG4gICAgICAgICAgaWYgKCRzY29wZS5tZW1iZXJzW2ldLnJvbGVzW29dLmlkID09IHJvbGVJZCkge1xuICAgICAgICAgICAgJHNjb3BlLnRvZ2dsZVRhcmdldCgkc2NvcGUubWVtYmVyc1tpXS5pZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS50b2dnbGVUYXJnZXRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLnNob3dUYXJnZXRzID0gISRzY29wZS5zaG93VGFyZ2V0cztcbiAgICB9O1xuXG4gICAgJHNjb3BlLmdldFRhcmdldENvbG9yID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgICByZXR1cm4gKCRzY29wZS50b3BpYy50YXJnZXRzLmluZGV4T2YobWVtYmVySWQpICE9PSAtMSA/IFwiYmx1ZVwiIDogXCJcIik7XG4gICAgfTtcblxuICAgICRzY29wZS5mb2N1c09wdGlvbiA9IGZ1bmN0aW9uIChvcHRpb24pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLnRvcGljLnBvbGwub3B0aW9ucy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgJHNjb3BlLnRvcGljLnBvbGwub3B0aW9uc1tpXS5lZGl0aW5nID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbi5lZGl0aW5nID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmFkZE9wdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvcHRpb24gPSB7XG4gICAgICAgIG9wdGlvblR5cGU6IFwiSW5mb1wiLFxuICAgICAgICB0YXJnZXRzOiBbXVxuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnRvcGljLnBvbGwub3B0aW9ucy5wdXNoKG9wdGlvbik7XG5cbiAgICAgICRzY29wZS5mb2N1c09wdGlvbihvcHRpb24pO1xuICAgIH07XG5cbiAgICAkc2NvcGUucmVtb3ZlT3B0aW9uID0gZnVuY3Rpb24gKG9wdGlvbikge1xuICAgICAgJHNjb3BlLnRvcGljLnBvbGwub3B0aW9ucy5zcGxpY2UoJHNjb3BlLnRvcGljLnBvbGwub3B0aW9ucy5pbmRleE9mKG9wdGlvbiksIDEpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc2VsZWN0T3B0aW9uID0gZnVuY3Rpb24gKHRvcGljLCBvcHRpb24pIHtcbiAgICAgIHZhciB1cGRhdGVkVG9waWMgPSB0b3BpYztcblxuICAgICAgaWYgKG9wdGlvbi52b3Rlcy5pbmRleE9mKCRzY29wZS5tZS5pZCkgIT09IC0xKSB7XG4gICAgICAgIHVwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnNbdXBkYXRlZFRvcGljLnBvbGwub3B0aW9ucy5pbmRleE9mKG9wdGlvbildLnZvdGVzLnNwbGljZSh1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zW3VwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnMuaW5kZXhPZihvcHRpb24pXS52b3Rlcy5pbmRleE9mKCRzY29wZS5tZS5pZCksIDEpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHVwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnNbdXBkYXRlZFRvcGljLnBvbGwub3B0aW9ucy5pbmRleE9mKG9wdGlvbildLnZvdGVzLnB1c2goJHNjb3BlLm1lLmlkKTtcbiAgICAgIH1cblxuICAgICAgdXBkYXRlZFRvcGljLl92b3RpbmcgPSB0cnVlO1xuXG4gICAgICBUb3BpY0ZhY3RvcnkuVG9waWMudXBkYXRlKHtpZDogdXBkYXRlZFRvcGljLl9pZH0sIHVwZGF0ZWRUb3BpYywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgIC8vLy9jb25zb2xlLmxvZyhyZXNwb25zZS5zdWNjZXNzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgICAkc2NvcGUuZXJyb3IgPSBcIlwiO1xuXG4gICAgICAvL2NvbnNvbGUubG9nKHRvcGljKTtcblxuICAgICAgVG9waWNGYWN0b3J5LlRvcGljLnVwZGF0ZSh7aWQ6IHRvcGljLl9pZH0sIHRvcGljLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICB0b3BpYy5lZGl0aW5nID0gIXRvcGljLmVkaXRpbmc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5yZWFkID0gZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgICBpZiAoISRzY29wZS5ub3RpZmljYXRpb25zKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLm5vdGlmaWNhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgICAgIHJldHVybiBvLnRocmVhZCA9PT0gXCJ0b3BpYy1cIiArIHRvcGljLl9pZDtcbiAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKG5vdGlmaWNhdGlvbikge1xuICAgICAgICB2YXIgaW5kZXggPSBub3RpZmljYXRpb24udW5yZWFkLmluZGV4T2YoJHNjb3BlLm1lLmlkKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIG5vdGlmaWNhdGlvbi51bnJlYWQuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICBOb3RpZmljYXRpb25GYWN0b3J5Lk5vdGlmaWNhdGlvbi51cGRhdGUoe2lkOiBub3RpZmljYXRpb24uX2lkfSwgbm90aWZpY2F0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICAgIHZhciBtZW1iZXIgPSAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XG4gICAgICB9KTtcblxuICAgICAgaWYgKG1lbWJlciAmJiBtZW1iZXIubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gbWVtYmVyWzBdO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZTogXCJObyBvbmVcIixcbiAgICAgICAgICBmYWNlYm9vazogXCIxMDAwMDA0NTYzMzU5NzJcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUuZ2V0VW5yZWFkTm90aWZpY2F0aW9ucyA9IGZ1bmN0aW9uICh0aHJlYWQpIHtcbiAgICAgIC8vY29uc29sZS5sb2cobm90aWZpY2F0aW9ucyk7XG4gICAgICB2YXIgbm90aWZpY2F0aW9ucyA9ICRzY29wZS5ub3RpZmljYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLnRocmVhZCA9PSB0aHJlYWQ7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIG5vdGlmaWNhdGlvbnM7XG4gICAgfTtcblxuICAgICAkc2NvcGUudG9waWMudW5yZWFkID0gJHNjb3BlLmdldFVucmVhZE5vdGlmaWNhdGlvbnMoJ3RvcGljLScrICRzY29wZS50b3BpYy5faWQpLmxlbmd0aCA+IDA7XG5cbiAgICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgICAgdmFyIHN1ZmZpeCA9IFwiYWdvXCI7XG4gICAgICBpZiAoc2Vjb25kcyA8IDApe1xuICAgICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICAgIHN1ZmZpeCA9IFwidG8gZ29cIjtcbiAgICAgIH1cblxuICAgICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAodGltZSkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKHRpbWUpLnRvVVRDU3RyaW5nKCk7XG4gICAgfTtcbiAgfVxufSk7XG4iLCJyZXF1aXJlKCcuL2xpc3QnKTtcbnJlcXVpcmUoJy4vdG9waWMnKTtcbnJlcXVpcmUoJy4vZW1iZWQnKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiVG9waWNzQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcywgVG9waWNGYWN0b3J5KSB7XG5cbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcblxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgJHNjb3BlLmtpbmRzID0gW1wiSW5mb1wiLCBcIlRvIGRvXCIsIFwiRGVjaXNpb25cIiwgXCJJZGVhXCJdO1xuXG4gICAgJHNjb3BlLnNlYXJjaFRvcGljcyA9IHt9O1xuXG4gICAgJHNjb3BlLnVucmVhZEZpcnN0ID0gdHJ1ZTtcblxuICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5nZXRBbGwoZ290VG9waWNzKTtcblxuICAgIGZ1bmN0aW9uIGdvdFRvcGljcyAodG9waWNzKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCRzY29wZS5sb2FkaW5nKSB7XG4gICAgICAgICAgZ290VG9waWNzKHRvcGljcyk7XG4gICAgICAgIH1cbiAgICAgIH0sIDEwMDApO1xuXG4gICAgICAkc2NvcGUudG9waWNzID0gdG9waWNzO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS50b3BpY3MubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICRzY29wZS50b3BpY3NbaV0uZmFjZWJvb2sgPSAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgICByZXR1cm4gJHNjb3BlLnRvcGljc1tpXS5hdXRob3IgPT09IG8uaWQ7XG4gICAgICAgIH0pWzBdLmZhY2Vib29rO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgICRzY29wZS5zaG93T3BlbiA9IHRydWU7XG4gICAgJHNjb3BlLmxpbWl0ID0gMTA7XG5cblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgJHNjb3BlLnRpbWUgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgICByZXR1cm4gJHNjb3BlLnRpbWVTaW5jZShuZXcgRGF0ZShkYXRlKSk7XG4gICAgfTtcblxuICAgICRzY29wZS5jcmVhdGVUb3BpYyA9IGZ1bmN0aW9uKGtpbmQpIHtcbiAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5jcmVhdGUoe1xuICAgICAgICBhdXRob3I6ICRzY29wZS5tZS5pZCxcbiAgICAgICAga2luZDoga2luZCxcbiAgICAgICAgdGFnczogWyRzY29wZS5zZWFyY2hUb3BpY3MudGFnc11cbiAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5nZXRBbGwoZnVuY3Rpb24gKHRvcGljcykge1xuICAgICAgICAgICAgJHNjb3BlLnRvcGljcyA9IHRvcGljcztcbiAgICAgICAgICAgICRzY29wZS50b3BpY3MuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvLl9pZCA9PSByZXNwb25zZS5pZDtcbiAgICAgICAgICAgIH0pWzBdLmVkaXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ3RvcGljLycrcmVzcG9uc2UuaWQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNvdW50ID0gZnVuY3Rpb24gKG9wZW4pIHtcbiAgICAgIHJldHVybiAkc2NvcGUudG9waWNzLmZpbHRlcihmdW5jdGlvbiAobykge1xuICAgICAgICByZXR1cm4gKG9wZW4gPyAhby5jbG9zZWQgOiBvLmNsb3NlZCk7XG4gICAgICB9KS5sZW5ndGg7XG4gICAgfTtcblxuICAgICRzY29wZS5zaG93blRvcGljcyA9IGZ1bmN0aW9uIChvcGVuKSB7XG4gICAgICByZXR1cm4gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgcmV0dXJuIG8uZWRpdGluZyB8fCAob3BlbiA/ICFvLmNsb3NlZCA6IG8uY2xvc2VkKSAmJiAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICgkc2NvcGUuc2VhcmNoVG9waWNzLnRhZ3MgJiYgby50YWdzLmluZGV4T2YoJHNjb3BlLnNlYXJjaFRvcGljcy50YWdzKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCRzY29wZS5zZWFyY2hUb3BpY3MudGFyZ2V0ICYmIG8udGFyZ2V0cy5pbmRleE9mKCRzY29wZS5zZWFyY2hUb3BpY3MudGFyZ2V0KSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCRzY29wZS5zZWFyY2hUb3BpY3Mua2luZCAmJiBvLmtpbmQgIT09ICRzY29wZS5zZWFyY2hUb3BpY3Mua2luZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSgpKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc2Nyb2xsID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJHNjb3BlLmxpbWl0IDwgJHNjb3BlLnRvcGljcy5sZW5ndGgpXG4gICAgICAgICRzY29wZS5saW1pdCArPSA0O1xuICAgIH07XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKCdUb3BpY0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgJHdpbmRvdywgVG9waWNGYWN0b3J5LCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XG5cbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcblxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG5cbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICBUb3BpY0ZhY3RvcnkuVG9waWMuZ2V0KHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAkc2NvcGUudG9waWMgPSByZXN1bHQ7XG5cbiAgICAgIC8vY29uc29sZS5sb2coJGxvY2F0aW9uLnNlYXJjaCgpKTtcbiAgICAgIGlmKCRsb2NhdGlvbi5zZWFyY2goKS5lZGl0aW5nID09IHRydWUpIHtcbiAgICAgICAgJHNjb3BlLnRvcGljLmVkaXRpbmc9dHJ1ZTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnVFJVRUVFJyk7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS50b3BpYy5zaG93Q29tbWVudHMgPSB0cnVlO1xuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdjb21tZW50QXJlYScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tbWVudC9hcmVhLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0NvbW1lbnRBcmVhQ29udHJvbGxlcicsXG4gICAgICBzY29wZToge1xuICAgICAgICB0aHJlYWQ6ICdAJyxcbiAgICAgICAgc3VidGhyZWFkOiAnQCcsXG4gICAgICAgIG1lOiAnPScsXG4gICAgICAgIG1lbWJlcnM6ICc9J1xuICAgICAgfVxuICAgIH07XG4gIH0pOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgnZmlyc3RDb21tZW50JywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21tZW50L2ZpcnN0Lmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0ZpcnN0Q29tbWVudENvbnRyb2xsZXInLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgdGhyZWFkOiAnQCdcbiAgICAgIH1cbiAgICB9O1xuICB9KSIsInJlcXVpcmUoJy4vYXJlYScpO1xucmVxdWlyZSgnLi9maXJzdCcpOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgnY29tbXVuaWNhdGlvbkFyZWEnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbW11bmljYXRpb24vYXJlYS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDb21tdW5pY2F0aW9uQXJlYUNvbnRyb2xsZXInLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgdGhyZWFkOiAnQCcsXG4gICAgICAgIGV2ZW50OiAnPScsXG4gICAgICAgIG1lbWJlcnNKc29uOiAnQG1lbWJlcnMnLFxuICAgICAgICBtZUpzb246ICdAbWUnLFxuICAgICAgICByb2xlc0pzb246ICdAcm9sZXMnXG4gICAgICB9XG4gICAgfTtcbiAgfSkiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoJ2NvbW11bmljYXRpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbW11bmljYXRpb24vY29tbXVuaWNhdGlvbi5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDb21tdW5pY2F0aW9uRW1iZWRDb250cm9sbGVyJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIGNvbW11bmljYXRpb246ICc9Y29tbXVuaWNhdGlvbk9iamVjdCcsXG4gICAgICAgIG1lbWJlcnM6ICc9JyxcbiAgICAgICAgbWU6ICc9J1xuICAgICAgfVxuICAgIH07XG4gIH0pIiwicmVxdWlyZSgnLi9hcmVhJyk7XG5yZXF1aXJlKCcuL2NvbW11bmljYXRpb24nKTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoJ2NvbXBhbnlDYXJkJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wYW55L2NhcmQuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQ29tcGFueUVtYmVkQ29udHJvbGxlcicsXG4gICAgICBzY29wZToge1xuICAgICAgICBjb21wYW55OiAnPWNvbXBhbnknLFxuICAgICAgICBldmVudDogJz1ldmVudCcsXG4gICAgICAgIG5vdGlmaWNhdGlvbnM6ICc9bm90aWZpY2F0aW9ucycsXG4gICAgICAgIG1lOiAnPW1lJyxcbiAgICAgICAgbWVtYmVyczogJz1tZW1iZXJzJ1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuIiwicmVxdWlyZSgnLi9jYXJkJyk7IiwicmVxdWlyZSgnLi9pbnB1dCcpIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKFxuICAgICdkYXRlSW5wdXQnLFxuICAgIGZ1bmN0aW9uKGRhdGVGaWx0ZXIpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGlucHV0IHR5cGU9XCJkYXRlXCI+PC9pbnB1dD4nLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbG0sIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRmb3JtYXR0ZXJzLnVuc2hpZnQoZnVuY3Rpb24gKG1vZGVsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGVGaWx0ZXIobW9kZWxWYWx1ZSwgJ3l5eXktTU0tZGQnKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRwYXJzZXJzLnVuc2hpZnQoZnVuY3Rpb24odmlld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh2aWV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgfSkiLCJ0aGVUb29sRGlyZWN0aXZlcyA9IGFuZ3VsYXIubW9kdWxlKFwidGhlVG9vbC5kaXJlY3RpdmVzXCIsIFtdKTtcblxucmVxdWlyZShcIi4vY29tbWVudFwiKTtcbnJlcXVpcmUoXCIuL2NvbW11bmljYXRpb25cIik7XG5yZXF1aXJlKFwiLi9jb21wYW55XCIpO1xucmVxdWlyZShcIi4vZGF0ZVwiKTtcbnJlcXVpcmUoXCIuL21hcmtkb3duXCIpO1xucmVxdWlyZShcIi4vbWVldGluZ1wiKTtcbnJlcXVpcmUoXCIuL3NwZWFrZXJcIik7XG5yZXF1aXJlKFwiLi90YWdcIik7XG5yZXF1aXJlKFwiLi90b3BpY1wiKTtcbnJlcXVpcmUoXCIuL3Njcm9sbFwiKTtcbnJlcXVpcmUoXCIuL3N1YnNjcmlwdGlvblwiKTtcbnJlcXVpcmUoXCIuL21lbWJlclwiKTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoJ2NvbXBpbGUnLCBbJyRjb21waWxlJywgZnVuY3Rpb24gKCRjb21waWxlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICBzY29wZS4kd2F0Y2goXG4gICAgICAgICAgZnVuY3Rpb24oc2NvcGUpIHtcbiAgICAgICAgICAgICAvLyB3YXRjaCB0aGUgJ2NvbXBpbGUnIGV4cHJlc3Npb24gZm9yIGNoYW5nZXNcbiAgICAgICAgICAgIHJldHVybiBzY29wZS4kZXZhbChhdHRycy5jb21waWxlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAvLyB3aGVuIHRoZSAnY29tcGlsZScgZXhwcmVzc2lvbiBjaGFuZ2VzXG4gICAgICAgICAgICAvLyBhc3NpZ24gaXQgaW50byB0aGUgY3VycmVudCBET01cbiAgICAgICAgICAgIGVsZW1lbnQuaHRtbCh2YWx1ZSk7XG5cbiAgICAgICAgICAgIC8vIGNvbXBpbGUgdGhlIG5ldyBET00gYW5kIGxpbmsgaXQgdG8gdGhlIGN1cnJlbnRcbiAgICAgICAgICAgIC8vIHNjb3BlLlxuICAgICAgICAgICAgLy8gTk9URTogd2Ugb25seSBjb21waWxlIC5jaGlsZE5vZGVzIHNvIHRoYXRcbiAgICAgICAgICAgIC8vIHdlIGRvbid0IGdldCBpbnRvIGluZmluaXRlIGxvb3AgY29tcGlsaW5nIG91cnNlbHZlc1xuICAgICAgICAgICAgJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKShzY29wZSk7XG4gICAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gIH1dKSIsInJlcXVpcmUoJy4vY29tcGlsZScpO1xucmVxdWlyZSgnLi9tYXJrZG93bicpOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgnbWFya2Rvd24nLCBbJyRjb21waWxlJywgZnVuY3Rpb24gKCRjb21waWxlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgdmFyIGh0bWxUZXh0ID0gbWFya2Rvd24udG9IVE1MKGVsZW1lbnQudGV4dCgpKTtcbiAgICAgICAgICAgIGVsZW1lbnQuaHRtbChodG1sVGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICB9XSkiLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbERpcmVjdGl2ZXMuZGlyZWN0aXZlKFwiZW1iZWRNZWV0aW5nXCIsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogXCJFXCIsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZWV0aW5nL2VtYmVkLmh0bWxcIixcbiAgICBjb250cm9sbGVyOiBcIk1lZXRpbmdFbWJlZENvbnRyb2xsZXJcIixcbiAgICBzY29wZToge1xuICAgICAgbWVldGluZ0lkOiBcIj1cIixcbiAgICAgIG1lbWJlcnM6IFwiPVwiXG4gICAgfVxuICB9O1xufSk7XG4iLCJyZXF1aXJlKFwiLi9lbWJlZFwiKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgnbWVtYmVyQ2FyZCcsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvbWVtYmVyL2NhcmQuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnTWVtYmVyRW1iZWRDb250cm9sbGVyJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIG1lbWJlcjogJz1tZW1iZXJPYmplY3QnLFxuICAgICAgfVxuICAgIH07XG4gIH0pXG4iLCJyZXF1aXJlKCcuL2NhcmQuanMnKTsiLCJyZXF1aXJlKFwiLi9wb3NpdGlvbi5qc1wiKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbERpcmVjdGl2ZXMuZGlyZWN0aXZlKCd3aGVuU2Nyb2xsZWQnLCBbJyR0aW1lb3V0JywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbG0sIGF0dHIpIHtcblxuICAgIC8vY29uc29sZS5sb2coXCJPbiBkaXJlY3RpdmVcIik7XG5cbiAgICAvL2NvbnNvbGUubG9nKGVsbSk7XG5cbiAgICB2YXIgcmF3ID0gZWxtWzBdO1xuICAgIC8vY29uc29sZS5sb2cocmF3KTtcblxuICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgLy9jb25zb2xlLmxvZyhyYXcuc2Nyb2xsVG9wKTtcbiAgICAgIC8vY29uc29sZS5sb2cocmF3LnNjcm9sbEhlaWdodCk7XG4gICAgICByYXcuc2Nyb2xsVG9wID0gcmF3LnNjcm9sbEhlaWdodDtcbiAgICB9KTtcblxuICAgIGVsbS5iaW5kKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChyYXcuc2Nyb2xsVG9wIDw9IDEwMCkgeyAvLyBsb2FkIG1vcmUgaXRlbXMgYmVmb3JlIHlvdSBoaXQgdGhlIHRvcFxuICAgICAgICB2YXIgc2ggPSByYXcuc2Nyb2xsSGVpZ2h0XG4gICAgICAgIHNjb3BlLiRhcHBseShhdHRyLndoZW5TY3JvbGxlZCk7XG4gICAgICAgIHJhdy5zY3JvbGxUb3AgPSByYXcuc2Nyb2xsSGVpZ2h0IC0gc2g7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoJ3NwZWFrZXJDYXJkJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0FFQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9zcGVha2VyL2NhcmQuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnU3BlYWtlckVtYmVkQ29udHJvbGxlcicsXG4gICAgICBzY29wZToge1xuICAgICAgICBzcGVha2VyOiAnPXNwZWFrZXInLFxuICAgICAgICBldmVudDogJz1ldmVudCcsXG4gICAgICAgIG5vdGlmaWNhdGlvbnM6ICc9bm90aWZpY2F0aW9ucycsXG4gICAgICAgIG1lOiAnPW1lJyxcbiAgICAgICAgbWVtYmVyczogJz1tZW1iZXJzJ1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuIiwiYXJndW1lbnRzWzRdWzU2XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cykiLCJyZXF1aXJlKCcuL3N1YnNjcmlwdGlvbicpOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgnc3Vic2NyaXB0aW9uJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9zdWJzY3JpcHRpb24vYnV0dG9uLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1N1YnNjcmlwdGlvbkNvbnRyb2xsZXInLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgdGhyZWFkOiAnQCdcbiAgICAgIH1cbiAgICB9O1xuICB9KSIsImFyZ3VtZW50c1s0XVs0M11bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoXCJ0YWdNYW5hZ2VyXCIsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3RhZy9tYW5hZ2VyLmh0bWxcIixcbiAgICAgIGNvbnRyb2xsZXI6IFwiVGFnTWFuYWdlckNvbnRyb2xsZXJcIixcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHRhZ3M6IFwiPXRhZ3NBcnJheVwiLFxuICAgICAgICBzZWFyY2g6IFwiPVwiXG4gICAgICB9XG4gICAgfTtcbiAgfSlcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sRGlyZWN0aXZlcy5kaXJlY3RpdmUoXCJ0b3BpY0NhcmRcIiwgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiBcIkVcIixcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3RvcGljL2NhcmQuaHRtbFwiLFxuICAgIGNvbnRyb2xsZXI6IFwiVG9waWNFbWJlZENvbnRyb2xsZXJcIixcbiAgICBzY29wZToge1xuICAgICAgdG9waWM6IFwiPVwiLFxuICAgICAgbWVtYmVyczogXCI9XCIsXG4gICAgICBtZTogXCI9XCIsXG4gICAgICByb2xlczogXCI9XCIsXG4gICAgICB0YWdzOiBcIj1cIixcbiAgICAgIGNvbW1lbnRzOiBcIj1cIixcbiAgICAgIG5vdGlmaWNhdGlvbnM6IFwiPVwiXG4gICAgfVxuICB9O1xufSk7XG4iLCJyZXF1aXJlKFwiLi90b3BpY1wiKTtcbnJlcXVpcmUoXCIuL2NhcmRcIik7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbERpcmVjdGl2ZXMuZGlyZWN0aXZlKFwidG9waWNcIiwgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiBcIkVcIixcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3RvcGljL3RvcGljLmh0bWxcIixcbiAgICBjb250cm9sbGVyOiBcIlRvcGljRW1iZWRDb250cm9sbGVyXCIsXG4gICAgc2NvcGU6IHtcbiAgICAgIHRvcGljOiBcIj1cIixcbiAgICAgIG1lbWJlcnM6IFwiPVwiLFxuICAgICAgbWU6IFwiPVwiLFxuICAgICAgcm9sZXM6IFwiPVwiLFxuICAgICAgdGFnczogXCI9XCIsXG4gICAgICBjb21tZW50czogXCI9XCIsXG4gICAgICBub3RpZmljYXRpb25zOiBcIj1cIlxuICAgIH1cbiAgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5maWx0ZXJzJywgW10pXG4gIC5maWx0ZXIoJ2ludGVycG9sYXRlJywgWyd2ZXJzaW9uJywgZnVuY3Rpb24odmVyc2lvbikge1xuICAgIHJldHVybiBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nKHRleHQpLnJlcGxhY2UoL1xcJVZFUlNJT05cXCUvbWcsIHZlcnNpb24pO1xuICAgIH1cbiAgfV0pXG4gIC5maWx0ZXIoJ2ZpbHRlckV2ZW50U3RhdHVzJywgZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqcywgZXZlbnQsIHNlYXJjaCkge1xuICAgICAgdmFyIHJlc3VsdCA9IG9ianM7XG4gICAgICByZXN1bHQgPSBvYmpzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIGlmKG8ucGFydGljaXBhdGlvbnMubGVuZ3RoIDw9IDApe1xuICAgICAgICAgIHJldHVybiBzZWFyY2gudW5hc3NpZ25lZCB8fCBzZWFyY2gudW5hc3NpZ25lZE9ubHk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoZXZlbnQgJiYgIXNlYXJjaC51bmFzc2lnbmVkT25seSkge1xuICAgICAgICAgIHJldHVybiBvLnBhcnRpY2lwYXRpb25zLmZpbHRlcihmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICBpZihzZWFyY2guc3RhdHVzICYmIHNlYXJjaC5zdGF0dXMgIT09ICcnICYmIHNlYXJjaC5tZW1iZXIgJiYgc2VhcmNoLm1lbWJlciAhPT0gJycpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHAuZXZlbnQgPT09IGV2ZW50LmlkICYmIHAuc3RhdHVzID09PSBzZWFyY2guc3RhdHVzICYmIHAubWVtYmVyID09PSBzZWFyY2gubWVtYmVyO1xuICAgICAgICAgICAgfSBlbHNlIGlmKHNlYXJjaC5zdGF0dXMgJiYgc2VhcmNoLnN0YXR1cyAhPT0gJycpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHAuZXZlbnQgPT09IGV2ZW50LmlkICYmIHAuc3RhdHVzID09PSBzZWFyY2guc3RhdHVzO1xuICAgICAgICAgICAgfSBlbHNlIGlmKHNlYXJjaC5tZW1iZXIgJiYgc2VhcmNoLm1lbWJlciAhPT0gJycpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHAuZXZlbnQgPT09IGV2ZW50LmlkICYmIHAubWVtYmVyID09PSBzZWFyY2gubWVtYmVyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHAuZXZlbnQgPT09IGV2ZW50LmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLmxlbmd0aCA+IDA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9KVxuICAuZmlsdGVyKCdmaWx0ZXJSb2xlJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG1lbWJlcnMsIHJvbGUpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gbWVtYmVycztcbiAgICAgICAgICBpZihyb2xlKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBtZW1iZXJzLmZpbHRlcihmdW5jdGlvbihtKSB7XG4gICAgICAgICAgICAgIHJldHVybiBtLnJvbGVzLmZpbHRlcihmdW5jdGlvbihyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHIuaWQgPT0gcm9sZTtcbiAgICAgICAgICAgICAgfSkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfTtcbiAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ0NoYXRGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBDaGF0OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jaGF0LzppZCcsIG51bGwsIHtcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfVxuICAgICAgfSksXG4gICAgICBNZXNzYWdlOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jaGF0LzppZC9tZXNzYWdlcycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLGlzQXJyYXk6dHJ1ZX1cbiAgICAgIH0pXG4gICAgfVxuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdDb21tZW50RmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgQ29tbWVudDogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tbWVudC86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KSxcbiAgICAgIENvbXBhbnk6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NvbXBhbnkvOmlkL2NvbW1lbnRzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KSxcbiAgICAgIFNwZWFrZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3NwZWFrZXIvOmlkL2NvbW1lbnRzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KSxcbiAgICAgIFRvcGljOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS90b3BpYy86aWQvY29tbWVudHMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgQ29tbXVuaWNhdGlvbjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tbXVuaWNhdGlvbi86aWQvY29tbWVudHMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gICAgfVxuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdDb21tdW5pY2F0aW9uRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgQ29tbXVuaWNhdGlvbjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tbXVuaWNhdGlvbi86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KSxcbiAgICAgIENvbXBhbnk6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NvbXBhbnkvOmlkL2NvbW11bmljYXRpb25zJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KSxcbiAgICAgIFNwZWFrZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3NwZWFrZXIvOmlkL2NvbW11bmljYXRpb25zJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KVxuICAgIH07XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ0NvbXBhbnlGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBDb21wYW55OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21wYW55LzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9LFxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfSksXG4gICAgICBNZW1iZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL21lbWJlci86aWQvY29tcGFuaWVzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6dHJ1ZX1cbiAgICAgIH0pXG4gICAgfTtcbiAgfSkiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnRW1haWxGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBDb21wYW55OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21wYW55LzppZC9zZW5kSW5pdGlhbEVtYWlsJywgbnVsbCwge1xuICAgICAgICAnc2VuZCc6IHttZXRob2Q6ICdQT1NUJ31cbiAgICAgIH0pLFxuICAgICAgU3BlYWtlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvc3BlYWtlci86aWQvc2VuZEluaXRpYWxFbWFpbCcsIG51bGwsIHtcbiAgICAgICAgJ3NlbmQnOiB7bWV0aG9kOiAnUE9TVCd9XG4gICAgICB9KVxuICAgIH1cbiAgfSkiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnRXZlbnRGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBFdmVudDogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvZXZlbnQvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfSlcbiAgICB9XG4gIH0pIiwidGhlVG9vbFNlcnZpY2VzID0gYW5ndWxhci5tb2R1bGUoJ3RoZVRvb2wuc2VydmljZXMnLCBbJ25nUmVzb3VyY2UnXSk7XG5cbnJlcXVpcmUoJy4vY2hhdCcpO1xucmVxdWlyZSgnLi9jb21tZW50Jyk7XG5yZXF1aXJlKCcuL2NvbW11bmljYXRpb24nKTtcbnJlcXVpcmUoJy4vY29tcGFueScpO1xucmVxdWlyZSgnLi9lbWFpbCcpO1xucmVxdWlyZSgnLi9tZWV0aW5nJyk7XG5yZXF1aXJlKCcuL21lbWJlcicpO1xucmVxdWlyZSgnLi9tZXNzYWdlJyk7XG5yZXF1aXJlKCcuL25vdGlmaWNhdGlvbicpO1xucmVxdWlyZSgnLi9yb2xlJyk7XG5yZXF1aXJlKCcuL3Nlc3Npb24nKTtcbnJlcXVpcmUoJy4vc29ja2V0Jyk7XG5yZXF1aXJlKCcuL3NwZWFrZXInKTtcbnJlcXVpcmUoJy4vc3Vic2NyaXB0aW9uJyk7XG5yZXF1aXJlKCcuL3RhZycpO1xucmVxdWlyZSgnLi90b3BpYycpO1xucmVxdWlyZSgnLi9ldmVudCcpO1xucmVxdWlyZSgnLi9pdGVtJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnSXRlbUZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIEl0ZW06ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2l0ZW0vOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfSlcbiAgICB9XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ01lZXRpbmdGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9tZWV0aW5nLzppZCcsIG51bGwsIHtcbiAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgfSk7XG4gIH0pXG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnTWVtYmVyRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9tZW1iZXIvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6dHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KSxcbiAgICAgIFJvbGU6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3JvbGUvOmlkL21lbWJlcnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgTWU6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL215c2VsZicsIG51bGwsIHtcbiAgICAgICAgJ2dldCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiBmYWxzZX1cbiAgICAgIH0pXG4gICAgfTtcbiAgfSkiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnTWVzc2FnZUZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL21lc3NhZ2UvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzogICAge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KVxuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzLmZhY3RvcnkoJ05vdGlmaWNhdGlvbkZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gIHJldHVybiB7XG4gICAgTm90aWZpY2F0aW9uOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9ub3RpZmljYXRpb24vOmlkJywgbnVsbCwge1xuICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ31cbiAgICB9KSxcbiAgICBDb21wYW55OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21wYW55LzppZC9ub3RpZmljYXRpb25zJywgbnVsbCwge1xuICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgIH0pLFxuICAgIFNwZWFrZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3NwZWFrZXIvOmlkL25vdGlmaWNhdGlvbnMnLCBudWxsLCB7XG4gICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgfSksXG4gICAgVG9waWM6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3RvcGljLzppZC9ub3RpZmljYXRpb25zJywgbnVsbCwge1xuICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgIH0pXG4gIH07XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdSb2xlRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgUm9sZTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvcm9sZS86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICB9KSxcbiAgICAgIE1lbWJlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvcm9sZS86aWQvbWVtYmVycycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSlcbiAgICB9O1xuICB9KVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ1Nlc3Npb25GYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBTZXNzaW9uOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9zZXNzaW9uLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgQ29tcGFueTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tcGFueS86aWQvc2Vzc2lvbnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgU3BlYWtlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvc3BlYWtlci86aWQvc2Vzc2lvbnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gICAgfVxuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdTb2NrZXRGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSwgJGxvY2F0aW9uLCAkcm9vdFNjb3BlKSB7XG4gICAgdmFyIHNvY2tldDtcbiAgICByZXR1cm4ge1xuICAgICAgY29ubmVjdDogZnVuY3Rpb24obnNwKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coc29ja2V0KTtcbiAgICAgICAgc29ja2V0ID0gaW8uY29ubmVjdChuc3AsIHttdWx0aXBsZXg6IGZhbHNlfSk7XG4gICAgICB9LFxuICAgICAgb246IGZ1bmN0aW9uIChldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHNvY2tldC5vbihldmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseShzb2NrZXQsIGFyZ3MpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBlbWl0OiBmdW5jdGlvbiAoZXZlbnROYW1lLCBkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICBzb2NrZXQuZW1pdChldmVudE5hbWUsIGRhdGEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoc29ja2V0LCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZGlzY29ubmVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBzb2NrZXQuZGlzY29ubmVjdCgpO1xuICAgICAgfSxcbiAgICAgIHNvY2tldDogc29ja2V0XG4gICAgfTtcbiAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnU3BlYWtlckZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFNwZWFrZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3NwZWFrZXIvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6dHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KSxcbiAgICAgIE1lbWJlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvbWVtYmVyLzppZC9zcGVha2VycycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9XG4gICAgICB9KVxuICAgIH07XG4gIH0pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xTZXJ2aWNlcy5mYWN0b3J5KFwiU3Vic2NyaXB0aW9uRmFjdG9yeVwiLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gIHJldHVybiB7XG4gICAgQ29tcGFueTogJHJlc291cmNlKHVybF9wcmVmaXggKyBcIi9hcGkvY29tcGFueS86aWQvc3Vic2NyaXB0aW9uXCIsIG51bGwsIHtcbiAgICAgIFwiZ2V0XCI6IHttZXRob2Q6IFwiR0VUXCJ9LFxuICAgICAgXCJhZGRcIjoge21ldGhvZDogXCJQT1NUXCJ9LFxuICAgICAgXCJyZW1vdmVcIjoge21ldGhvZDogXCJERUxFVEVcIn1cbiAgICB9KSxcbiAgICBTcGVha2VyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCArIFwiL2FwaS9zcGVha2VyLzppZC9zdWJzY3JpcHRpb25cIiwgbnVsbCwge1xuICAgICAgXCJnZXRcIjoge21ldGhvZDogXCJHRVRcIn0sXG4gICAgICBcImFkZFwiOiB7bWV0aG9kOiBcIlBPU1RcIn0sXG4gICAgICBcInJlbW92ZVwiOiB7bWV0aG9kOiBcIkRFTEVURVwifVxuICAgIH0pLFxuICAgIFRvcGljOiAkcmVzb3VyY2UodXJsX3ByZWZpeCArIFwiL2FwaS90b3BpYy86aWQvc3Vic2NyaXB0aW9uXCIsIG51bGwsIHtcbiAgICAgIFwiZ2V0XCI6IHttZXRob2Q6IFwiR0VUXCJ9LFxuICAgICAgXCJhZGRcIjoge21ldGhvZDogXCJQT1NUXCJ9LFxuICAgICAgXCJyZW1vdmVcIjoge21ldGhvZDogXCJERUxFVEVcIn1cbiAgICB9KVxuICB9O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnVGFnRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgVGFnOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS90YWcvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfSksXG4gICAgICBUb3BpYzogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvdGFnLzppZC90b3BpY3MnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gICAgfTtcbiAgfSkiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnVG9waWNGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBUb3BpYzogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvdG9waWMvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfSksXG4gICAgICBNZW1iZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL21lbWJlci86aWQvdG9waWNzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzogeyBtZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlIH1cbiAgICAgIH0pXG4gICAgfTtcbiAgfSlcbiIsInVybF9wcmVmaXggPSByZXF1aXJlKCcuLy4uLy4uL2NvbmZpZycpLnVybDtcblxucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2FwcC5qcycpO1xucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzJyk7XG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcycpO1xucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2ZpbHRlcnMnKTtcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9zZXJ2aWNlcycpOyIsInZhciBwcm9jZXNzPXJlcXVpcmUoXCJfX2Jyb3dzZXJpZnlfcHJvY2Vzc1wiKTt2YXIgY29uZmlnID0ge1xuICB1cmw6IHByb2Nlc3MuZW52LkVWRU5UREVDS19VUkwgfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXG4gIHBvcnQ6IHByb2Nlc3MuZW52LkVWRU5UREVDS19QT1JUIHx8IDgwODAsXG59O1xuXG5jb25maWcubW9uZ28gPSB7XG4gIHVybDogcHJvY2Vzcy5lbnYuRVZFTlRERUNLX01PTkdPX1VSTCB8fCAnbW9uZ29kYjovL2xvY2FsaG9zdC9zaW5mbydcbn07XG5cbmNvbmZpZy5jb29raWUgPSB7XG4gIG5hbWU6IHByb2Nlc3MuZW52LkVWRU5UREVDS19DT09LSUVfTkFNRSB8fCAnZXZlbnRkZWNrJyxcbiAgcGFzc3dvcmQ6IHByb2Nlc3MuZW52LkVWRU5UREVDS19DT09LSUVfUEFTU1dPUkQgfHwgJ1lPVVIgQ09PS0lFIFBBU1NXT1JEJ1xufTtcblxuY29uZmlnLm1haWxndW4gPSB7XG4gIGVtYWlsOiBwcm9jZXNzLmVudi5FVkVOVERFQ0tfTUFJTEdVTl9FTUFJTCB8fCAnZGVja0BzaW5mby5vcmcnLFxuICBhcGk6IHByb2Nlc3MuZW52LkVWRU5UREVDS19NQUlMR1VOX0FQSSB8fCAnWU9VUiBNQUlMR1VOIEtFWScsXG4gIHB1YmxpY0FwaTogcHJvY2Vzcy5lbnYuRVZFTlRERUNLX01BSUxHVU5fUFVCTElDX0FQSSB8fCAnWU9VUiBNQUlMR1VOIFBVQkxJQyBLRVknXG59O1xuXG5jb25maWcuZmFjZWJvb2sgPSB7XG4gIGFwcElkOiBwcm9jZXNzLmVudi5FVkVOVERFQ0tfRkFDRUJPT0tfQVBQX0lEIHx8ICc0NTcyMDc1MDc3NDQxNTknLFxuICBhcHBTZWNyZXQ6IHByb2Nlc3MuZW52LkVWRU5UREVDS19GQUNFQk9PS19BUFBfU0VDUkVUIHx8ICc5ZjAyN2M1MmUwMGJjM2FkYmFiY2Q5MjZhM2M5NWI5Nydcbn07XG5cbmNvbmZpZy5idW55YW4gPSB7XG4gIG5hbWU6IHJlcXVpcmUoJy4vcGFja2FnZS5qc29uJykubmFtZSxcbiAgbGV2ZWw6IHByb2Nlc3MuZW52LkVWRU5UREVDS19MT0dfTEVWRUwgfHwgJ3RyYWNlJ1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZzsiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwibmFtZVwiOiBcImV2ZW50ZGVja1wiLFxuICBcInZlcnNpb25cIjogXCIwLjAuMFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiZXZlbnRkZWNrID09PT09PT09XCIsXG4gIFwibWFpblwiOiBcImluZGV4LmpzXCIsXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJzdGFydFwiOiBcIm5vZGUgc2VydmVyQXBwL2luZGV4LmpzIHwgYnVueWFuXCIsXG4gICAgXCJtb25cIjogXCJub2RlX21vZHVsZXMvLmJpbi9ub2RlbW9uIHNlcnZlckFwcC9pbmRleC5qcyB8IGJ1bnlhblwiLFxuICAgIFwiZGlzdFwiOiBcIm5vZGVfbW9kdWxlcy8uYmluL2Jyb3dzZXJpZnkgLXQgYnJmcyAtLWRlYnVnIC1lIGNsaWVudEFwcC9qcy90aGVUb29sLmpzIC1vIHB1YmxpYy9qcy90aGVUb29sLmpzXCIsXG4gICAgXCJ0ZXN0XCI6IFwiZWNobyBcXFwiRXJyb3I6IG5vIHRlc3Qgc3BlY2lmaWVkXFxcIiAmJiBleGl0IDFcIlxuICB9LFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0Oi8vZ2l0aHViLmNvbS9TSU5GTy9ldmVudGRlY2suZ2l0XCJcbiAgfSxcbiAgXCJhdXRob3JcIjogXCJGcmFuY2lzY28gRGlhcyA8ZnJhbmNpc2NvQGJhaW9kaWFzLmNvbT4gKGh0dHA6Ly9mcmFuY2lzY29kaWFzLm5ldC8pXCIsXG4gIFwibGljZW5zZVwiOiBcIkJTRC0yLUNsYXVzZVwiLFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL1NJTkZPL2V2ZW50ZGVjay9pc3N1ZXNcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL1NJTkZPL2V2ZW50ZGVja1wiLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJjcm9uXCI6IFwifjEuMC40XCIsXG4gICAgXCJoYXBpXCI6IFwifjMuMC4wXCIsXG4gICAgXCJoYXBpLWF1dGgtY29va2llXCI6IFwifjEuMC4yXCIsXG4gICAgXCJoYW5kbGViYXJzXCI6IFwifjIuMC4wLWFscGhhLjJcIixcbiAgICBcImFzeW5jXCI6IFwifjAuMi45XCIsXG4gICAgXCJtb25nb29zZVwiOiBcIn4zLjguNFwiLFxuICAgIFwibWFya2Rvd25cIjogXCJ+MC41LjBcIixcbiAgICBcImVtYWlsanNcIjogXCJ+MC4zLjhcIixcbiAgICBcInNvY2tldC5pb1wiOiBcIn4xLjAuMlwiLFxuICAgIFwic29ja2V0LmlvLWNsaWVudFwiOiBcIn4xLjAuMlwiLFxuICAgIFwicmVxdWVzdFwiOiBcIn4yLjM2LjBcIixcbiAgICBcIm1haWxndW5cIjogXCJ+MC40LjJcIixcbiAgICBcIm1haWxjb21wb3NlclwiOiBcIn4wLjIuMTJcIixcbiAgICBcImJ1bnlhblwiOiBcIn4xLjAuMVwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIm5vZGVtb25cIjogXCJ+MC43LjEwXCIsXG4gICAgXCJjb2xvcnNcIjogXCJ+MC42LjJcIixcbiAgICBcImdhemVcIjogXCJ+MC40LjNcIixcbiAgICBcImJyZnNcIjogXCIwLjAuOFwiLFxuICAgIFwiYnJvd3NlcmlmeVwiOiBcIn4zLjIwLjBcIixcbiAgICBcInRhYmxldG9wXCI6IFwifjEuMy4zXCJcbiAgfVxufVxuIl19
