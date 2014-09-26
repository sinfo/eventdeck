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
          $scope.limit += 1;
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

var statuses = require('../../../../../options').statuses.speaker;

theToolController
  .controller('SpeakersController', function ($rootScope, $scope, $http, $sce, SpeakerFactory) {

    $rootScope.update.timeout(runController);

    function runController(){

      $scope.limit = 20;

      console.log(statuses);

      $scope.statuses = statuses;
      
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
          $scope.limit += 1;
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


},{"../../../../../options":100}],40:[function(require,module,exports){
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
module.exports={
  "url": "https://tool.bananamarket.eu",
  "port": 8765,
  "mailgun": {
    "email": "tool@bananamarket.eu",
    "api": "key-7jm1c009ezjv85pkm1rqfxevufeovb43",
    "public-api": "pubkey-0blv6drs63745oxru3itvfg1urp662y8"
  },
  "mongo": {
    "url": "mongodb://localhost/sinfo"
  },
  "cookie": {
    "name": "login",
    "password": "44oJ1EoP0fR5BKoAmtDD6C1mCZzHTFYq9LDxt0EgaRQFEP6jkEix1Xa51Wq591nVOQ5d3XAjZWzIKlEYFZf5V7Rr52ilKPHxcZEDvupEoPY4JG0reyYSKHR2056VDMvDUFCH2sn55uNAKgGhWfQrOtnIexfO63feCYSdcxGcdCGZz86vT3bfJCbNZgFgVIkTg2gm3YFUxzzgUmDqkiNfv2nQcVfNaQP0UanEbLKiEedq5o1B6WzLYNvc37eycMsB"
  },
  "facebook": {
    "appId": "457207507744159",
    "appSecret": "9f027c52e00bc3adbabcd926a3c95b97"
  }
}
},{}],100:[function(require,module,exports){
var options = {};

options.statuses = {
  speaker: [
    { name: 'Selected', color: '#5319e7', default: true},
    { name: 'Approved', color: '#0052cc'},
    { name: 'Contacted', color: '#fbca04'},
    { name: 'In Conversations', color: '#207de5'},
    { name: 'Accepted', color: '#009800'},
    { name: 'Rejected', color: '#e11d21'},
    { name: 'Give Up', color: '#333'}
  ],
  company: [
    { name: 'Contacted', color: '#fbca04', default: true},
    { name: 'In Conversations', color: '#207de5'},
    { name: 'In Negotiations', color: '#006b75'},
    { name: 'Closed Deal', color: '#009800'},
    { name: 'Rejected', color: '#e11d21'},
    { name: 'Give Up', color: '#333'} 
  ]
};

options.roles = [
  { name: 'Public Relations', id: 'public-relations' },
  { name: 'Marketing', id: 'marketing' },
  { name: 'Internal Relations', id: 'internal-relations' },
  { name: 'Events', id: 'events' },
  { name: 'Innovation Awards', id: 'innovation-awards' },
  { name: 'Design', id: 'design' },
  { name: 'Audiovisuals', id: 'audiovisuals' },
  { name: 'Development Team', id: 'development-team' },
  { name: 'Coordination', id: 'coordination' },
  { name: 'Treasury', id: 'treasury' },
  { name: 'External Relations', id: 'external-relations' },
  { name: 'Strategic Partnerships', id: 'strategic-partnerships' },
  { name: 'Sys Admin', id: 'sys-admin' },
  { name: 'Marketing Manager', id: 'marketing-manager' }
];

module.exports = options;
},{}]},{},[98])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9hcHAuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9hZG1pbi9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2F1dGgvaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9hdXRoL2ludGVyY2VwdG9yLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvYXV0aC9sb2dpbi5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NoYXQvY2hhdC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NoYXQvaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jaGF0L2xpc3QuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tZW50L2FyZWEuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tZW50L2ZpcnN0LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbWVudC9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW11bmljYXRpb24vYXJlYS5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW11bmljYXRpb24vZW1iZWQuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tdW5pY2F0aW9uL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbXVuaWNhdGlvbi9saXN0LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9jb21wYW55LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9jb25maXJtLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9jcmVhdGUuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21wYW55L2VtYmVkLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvbGlzdC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWFpbi9ob21lLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWFpbi9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21haW4vbWFpbi5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lZXRpbmcvZW1iZWQuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZWV0aW5nL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVldGluZy9saXN0LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVldGluZy9tZWV0aW5nLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVtYmVyL2NyZWF0ZS5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lbWJlci9lbWJlZC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lbWJlci9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lbWJlci9saXN0LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVtYmVyL21lbWJlci5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvY29uZmlybS5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvY3JlYXRlLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvc3BlYWtlci9lbWJlZC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2xpc3QuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL3NwZWFrZXIuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zdWJzY3JpcHRpb24vZW1iZWQuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zdWJzY3JpcHRpb24vaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90YWcvaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90YWcvbWFuYWdlci5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3RvcGljL2VtYmVkLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdG9waWMvaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90b3BpYy9saXN0LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdG9waWMvdG9waWMuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbW1lbnQvYXJlYS5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbWVudC9maXJzdC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbWVudC9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbXVuaWNhdGlvbi9hcmVhLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9jb21tdW5pY2F0aW9uL2NvbW11bmljYXRpb24uanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbW11bmljYXRpb24vaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbXBhbnkvY2FyZC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tcGFueS9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvZGF0ZS9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvZGF0ZS9pbnB1dC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21hcmtkb3duL2NvbXBpbGUuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21hcmtkb3duL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9tYXJrZG93bi9tYXJrZG93bi5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWVldGluZy9lbWJlZC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWVldGluZy9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWVtYmVyL2NhcmQuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21lbWJlci9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvc2Nyb2xsL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9zY3JvbGwvcG9zaXRpb24uanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3NwZWFrZXIvY2FyZC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvc3BlYWtlci9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvc3Vic2NyaXB0aW9uL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9zdWJzY3JpcHRpb24vc3Vic2NyaXB0aW9uLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy90YWcvaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3RhZy9tYW5hZ2VyLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy90b3BpYy9jYXJkLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy90b3BpYy9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvdG9waWMvdG9waWMuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9maWx0ZXJzL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvY2hhdC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2NvbW1lbnQuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9jb21tdW5pY2F0aW9uLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvY29tcGFueS5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2VtYWlsLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvZXZlbnQuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2l0ZW0uanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9tZWV0aW5nLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvbWVtYmVyLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvbWVzc2FnZS5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL25vdGlmaWNhdGlvbi5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL3JvbGUuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9zZXNzaW9uLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvc29ja2V0LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvc3BlYWtlci5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL3N1YnNjcmlwdGlvbi5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL3RhZy5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL3RvcGljLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby9ldmVudGRlY2svY2xpZW50QXBwL2pzL3RoZVRvb2wuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL2V2ZW50ZGVjay9jb25maWcuanNvbiIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vZXZlbnRkZWNrL29wdGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1S0E7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaldBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3UUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBOztBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyLm1vZHVsZShcInRoZVRvb2xcIiwgW1xuICBcIm5nXCIsXG4gIFwibmdSb3V0ZVwiLFxuICBcIm5nU2FuaXRpemVcIixcbiAgXCJuZ1RvdWNoXCIsXG4gIFwiaW5maW5pdGUtc2Nyb2xsXCIsXG4gIFwidW5zYXZlZENoYW5nZXNcIixcbiAgXCJsdWVnZy5kaXJlY3RpdmVzXCIsXG4gIFwibmdBdWRpb1wiLFxuICBcInRoZVRvb2wuZmlsdGVyc1wiLFxuICBcInRoZVRvb2wuc2VydmljZXNcIixcbiAgXCJ0aGVUb29sLmRpcmVjdGl2ZXNcIixcbiAgXCJ0aGVUb29sLmNvbnRyb2xsZXJzXCJcbl0pLlxuY29uZmlnKFtcIiRyb3V0ZVByb3ZpZGVyXCIsIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvXCIgICAgICAgICAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NoYXQvdmlldy5odG1sXCIsICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ2hhdENvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2FkbWluXCIgICAgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9pbmRleC5odG1sXCIsICAgICAgICAgICBjb250cm9sbGVyOiBcIkFkbWluQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbG9naW5cIiAgICAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2F1dGgvbG9naW4uaHRtbFwiLCAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTG9naW5Db250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9sb2dpbi86aWQvOmNvZGVcIiAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvYXV0aC9sb2dpbi5odG1sXCIsICAgICAgICAgICAgY29udHJvbGxlcjogXCJMb2dpbkNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbmllcy9cIiAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2xpc3QuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbmllc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbmllcy90YWJsZS9cIiAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L3RhYmxlLmh0bWxcIiwgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbmllc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbmllcy9idWRnZXQvXCIgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2J1ZGdldC5odG1sXCIsICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbmllc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvXCIgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2NyZWF0ZS5odG1sXCIsICAgICAgICBjb250cm9sbGVyOiBcIkNyZWF0ZUNvbXBhbnlDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW55LzppZFwiICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tcGFueS92aWV3Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJDb21wYW55Q29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tcGFueS86aWQvZWRpdFwiICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbXBhbnkvZWRpdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ29tcGFueUNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvOmlkL3BhcnRpY2lwYXRpb25zXCIsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L3BhcnRpY2lwYXRpb25zLmh0bWxcIixjb250cm9sbGVyOiBcIkNvbXBhbnlDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW55LzppZC9jb25maXJtXCIgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tcGFueS9jb25maXJtLmh0bWxcIiwgICAgICAgY29udHJvbGxlcjogXCJDb21wYW55RW1haWxDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21tZW50LzppZC9lZGl0XCIgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tbWVudC9lZGl0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJDb21tZW50Q29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvc3BlYWtlcnMvXCIgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3NwZWFrZXIvbGlzdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiU3BlYWtlcnNDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2Vycy90YWJsZS9cIiAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci90YWJsZS5odG1sXCIsICAgICAgICAgY29udHJvbGxlcjogXCJTcGVha2Vyc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL3NwZWFrZXIvXCIgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zcGVha2VyL2NyZWF0ZS5odG1sXCIsICAgICAgICBjb250cm9sbGVyOiBcIkNyZWF0ZVNwZWFrZXJDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyLzppZFwiICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci92aWV3Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJTcGVha2VyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvc3BlYWtlci86aWQvZWRpdFwiICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3NwZWFrZXIvZWRpdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiU3BlYWtlckNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL3NwZWFrZXIvOmlkL3BhcnRpY2lwYXRpb25zXCIsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zcGVha2VyL3BhcnRpY2lwYXRpb25zLmh0bWxcIixjb250cm9sbGVyOiBcIlNwZWFrZXJDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyLzppZC9jb25maXJtXCIgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9jb25maXJtLmh0bWxcIiwgICAgICAgY29udHJvbGxlcjogXCJTcGVha2VyRW1haWxDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZW1iZXJzL1wiICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVtYmVyL2xpc3QuaHRtbFwiLCAgICAgICAgICAgY29udHJvbGxlcjogXCJNZW1iZXJzQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVtYmVyL1wiICAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lbWJlci9jcmVhdGUuaHRtbFwiLCAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ3JlYXRlTWVtYmVyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVtYmVyLzppZFwiICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lbWJlci92aWV3Lmh0bWxcIiwgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVtYmVyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVtYmVyLzppZC9lZGl0XCIgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lbWJlci9lZGl0Lmh0bWxcIiwgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVtYmVyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVldGluZ3NcIiAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lZXRpbmcvbGlzdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVldGluZ3NDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZWV0aW5nLzppZFwiICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy92aWV3Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJNZWV0aW5nQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVldGluZy86aWQvdGV4dFwiICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lZXRpbmcvdGV4dC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVldGluZ0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lZXRpbmcvOmlkL2VkaXRcIiAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZWV0aW5nL2VkaXQuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIk1lZXRpbmdDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jaGF0c1wiICAgICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY2hhdC9saXN0Lmh0bWxcIiwgICAgICAgICAgICAgY29udHJvbGxlcjogXCJDaGF0c0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NoYXQvOmlkXCIgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jaGF0L3ZpZXcuaHRtbFwiLCAgICAgICAgICAgICBjb250cm9sbGVyOiBcIkNoYXRDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi90b3BpY3NcIiAgICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvdG9waWMvbGlzdC5odG1sXCIsICAgICAgICAgICAgY29udHJvbGxlcjogXCJUb3BpY3NDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi90b3BpYy86aWRcIiAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvdG9waWMvdmlldy5odG1sXCIsICAgICAgICAgICAgY29udHJvbGxlcjogXCJUb3BpY0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbW11bmljYXRpb25zLzpraW5kXCIgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21tdW5pY2F0aW9uL2xpc3QuaHRtbFwiLCAgICBjb250cm9sbGVyOiBcIkNvbW11bmljYXRpb25zQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLm90aGVyd2lzZSh7cmVkaXJlY3RUbzogXCIvXCJ9KTtcbn1dKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiQWRtaW5Db250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIEV2ZW50RmFjdG9yeSwgSXRlbUZhY3RvcnkpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgIEV2ZW50RmFjdG9yeS5FdmVudC5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuZXZlbnRzID0gcmVzcG9uc2U7XG4gICAgfSk7XG5cbiAgICBJdGVtRmFjdG9yeS5JdGVtLmdldEFsbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5pdGVtcyA9IHJlc3BvbnNlO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLmFkZEV2ZW50ID0gZnVuY3Rpb24obmV3RXZlbnQpIHtcbiAgICAgIEV2ZW50RmFjdG9yeS5FdmVudC5jcmVhdGUobmV3RXZlbnQsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBFdmVudEZhY3RvcnkuRXZlbnQuZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICRzY29wZS5ldmVudHMgPSByZXNwb25zZTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmFkZEl0ZW0gPSBmdW5jdGlvbihuZXdJdGVtKSB7XG4gICAgICBJdGVtRmFjdG9yeS5JdGVtLmNyZWF0ZShuZXdJdGVtLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgSXRlbUZhY3RvcnkuSXRlbS5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgJHNjb3BlLml0ZW1zID0gcmVzcG9uc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS51cGRhdGVFdmVudCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgRXZlbnRGYWN0b3J5LkV2ZW50LnVwZGF0ZSh7aWQ6IGV2ZW50LmlkfSwgZXZlbnQsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgIHJldHVybiAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5lZGl0aW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnVwZGF0ZUl0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgSXRlbUZhY3RvcnkuSXRlbS51cGRhdGUoe2lkOiBpdGVtLmlkfSwgaXRlbSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgaXRlbS5lZGl0aW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmRlbGV0ZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBFdmVudEZhY3RvcnkuRXZlbnQuZGVsZXRlKHtpZDogZXZlbnQuaWR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIEV2ZW50RmFjdG9yeS5FdmVudC5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgJHNjb3BlLmV2ZW50cyA9IHJlc3BvbnNlO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuZGVsZXRlSXRlbSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICBJdGVtRmFjdG9yeS5JdGVtLmRlbGV0ZSh7aWQ6IGl0ZW0uaWR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIEl0ZW1GYWN0b3J5Lkl0ZW0uZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICRzY29wZS5pdGVtcyA9IHJlc3BvbnNlO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgfVxufSk7XG4iLCJyZXF1aXJlKFwiLi9sb2dpblwiKTtcbnJlcXVpcmUoJy4vaW50ZXJjZXB0b3InKTtcbiIsInRoZVRvb2xDb250cm9sbGVyLmNvbmZpZyhmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xuICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFsnJGluamVjdG9yJywgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xuICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcbiAgfV0pO1xufSk7XG5cbnRoZVRvb2xDb250cm9sbGVyLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkbG9jYXRpb24sICR3aW5kb3cpIHtcbiAgcmV0dXJuIHtcbiAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAkcm9vdFNjb3BlLnVwZGF0ZS5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIGlmKCRsb2NhdGlvbi5wYXRoKCkuaW5kZXhPZignL2xvZ2luJykgPT0gLTEpIHtcbiAgICAgICAgICAkcm9vdFNjb3BlLm5leHRQYXRoID0gJyMnICsgJGxvY2F0aW9uLnBhdGgoKTtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2xvZ2luJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZmFjZWJvb2tDb25maWcgPSByZXF1aXJlKCcuLy4uLy4uLy4uLy4uLy4uL2NvbmZpZycpLmZhY2Vib29rO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTG9naW5Db250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uLCAkaHR0cCwgJHdpbmRvdykge1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICQuYWpheFNldHVwKHtjYWNoZTogdHJ1ZX0pO1xuICAkLmdldFNjcmlwdChcIi8vY29ubmVjdC5mYWNlYm9vay5uZXQvcHRfUFQvYWxsLmpzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBGQi5pbml0KHthcHBJZDogZmFjZWJvb2tDb25maWcuYXBwSWR9KTtcbiAgfSk7XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgJHNjb3BlLnNob3dJZElucHV0ID0gdHJ1ZTtcbiAgJHNjb3BlLnNob3dDb2RlSW5wdXQgPSBmYWxzZTtcblxuICBpZigkc2NvcGUubWUuaWQpIHtcbiAgICAvLyRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgJHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oJy8nKTtcbiAgfVxuXG4gIHZhciBsb2NrID0gZmFsc2U7XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLmZhY2Vib29rTG9naW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLmJhbmFuYSA9IHRydWU7XG5cbiAgXHRpZiAobG9jaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvY2sgPSB0cnVlO1xuXG4gICAgRkIuZ2V0TG9naW5TdGF0dXMoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSBcImNvbm5lY3RlZFwiKSB7XG4gICAgICAgIGNvbm5lY3RlZChyZXNwb25zZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgRkIubG9naW4oZnVuY3Rpb24gKCkge30sIHtkaXNwbGF5OiBcInBvcHVwXCJ9KTtcbiAgICAgICAgRkIuRXZlbnQuc3Vic2NyaWJlKFwiYXV0aC5zdGF0dXNDaGFuZ2VcIiwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gXCJjb25uZWN0ZWRcIikge1xuICAgICAgICAgICAgY29ubmVjdGVkKHJlc3BvbnNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxvY2sgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGNvbm5lY3RlZChyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmNvbm5lY3RlZCA9IHRydWU7XG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAkc2NvcGUubG9naW5JbmZvID0gXCJMb2dnaW5nIGluLi4uXCI7XG5cbiAgICAgICRodHRwLmdldCh1cmxfcHJlZml4ICsgJy9hcGkvbG9naW4vZmFjZWJvb2s/aWQ9JytyZXNwb25zZS5hdXRoUmVzcG9uc2UudXNlcklEKycmdG9rZW49JytyZXNwb25zZS5hdXRoUmVzcG9uc2UuYWNjZXNzVG9rZW4pLlxuICAgICAgICBzdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgLy8kbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgICAgIGlmKHR5cGVvZiAkcm9vdFNjb3BlLm5leHRQYXRoID09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmFzc2lnbignIycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oJHJvb3RTY29wZS5uZXh0UGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICAgICRyb290U2NvcGUudXBkYXRlLmFsbCgpO1xuICAgICAgICB9KS5cbiAgICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJFUlJPUlwiLCBkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5zZW5kRW1haWwgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgJHNjb3BlLmxvZ2luSW5mbyA9IFwiU2VuZGluZyBlbWFpbC4uLlwiO1xuICAgICRzY29wZS5zaG93SWRJbnB1dCA9IGZhbHNlO1xuICAgIC8vY29uc29sZS5sb2coXCJTZW5kaW5nIGVtYWlsLi4uXCIpO1xuXG4gICAgJGh0dHAuZ2V0KHVybF9wcmVmaXggKyAnL2FwaS9sb2dpbi8nICsgbWVtYmVySWQpLlxuICAgICAgc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICBpZihkYXRhLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBzZXRJbmZvKFwiVGhlcmUgd2FzIGFuIGVycm9yLi4uXCIpO1xuICAgICAgICAgICRzY29wZS5zaG93SWRJbnB1dCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHNldEluZm8oXCJFbWFpbCBzZW50IVwiKTtcbiAgICAgICAgJHNjb3BlLnNob3dDb2RlSW5wdXQgPSB0cnVlO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiRW1haWwgc2VudCFcIilcbiAgICAgIH0pLlxuICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgc2V0SW5mbyhcIlRoZXJlIHdhcyBhbiBlcnJvci4uLlwiKTtcbiAgICAgICAgJHNjb3BlLnNob3dJZElucHV0ID0gdHJ1ZTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkVSUk9SXCIsIGRhdGEpO1xuICAgICAgfSk7XG4gIH1cblxuICAkc2NvcGUuc3VibWl0Q29kZSA9IGZ1bmN0aW9uIChtZW1iZXJJZCwgbWVtYmVyQ29kZSkge1xuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAkc2NvcGUubG9naW5JbmZvID0gXCJWZXJpZnlpbmcgY29kZS4uLlwiO1xuICAgICRzY29wZS5zaG93Q29kZUlucHV0ID0gZmFsc2U7XG5cbiAgICAkaHR0cC5nZXQodXJsX3ByZWZpeCArICcvYXBpL2xvZ2luLycgKyBtZW1iZXJJZCArICcvJyArIG1lbWJlckNvZGUpLlxuICAgICAgc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICBpZihkYXRhLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBzZXRJbmZvKFwiVGhlcmUgd2FzIGFuIGVycm9yLi4uXCIpO1xuICAgICAgICAgICRzY29wZS5zaG93SWRJbnB1dCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5sb2dpbkluZm8gPSBcIlN1Y2Nlc3MhXCI7XG4gICAgICAgICR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcvJyk7XG4gICAgICAgIC8vJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgIH0pLlxuICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgc2V0SW5mbyhcIlRoZXJlIHdhcyBhbiBlcnJvci4uLlwiKTtcbiAgICAgICAgJHNjb3BlLnNob3dJZElucHV0ID0gdHJ1ZTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0SW5mbyhtZXNzYWdlKSB7XG4gICAgJHNjb3BlLmxvZ2luSW5mbyA9IG1lc3NhZ2U7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpeyRzY29wZS5sb2dpbkluZm89XCJcIn0sIDIwMDApO1xuICB9XG5cbiAgaWYgKCRyb3V0ZVBhcmFtcy5pZCAmJiAkcm91dGVQYXJhbXMuY29kZSkge1xuICAgICRzY29wZS5zdWJtaXRDb2RlKCRyb3V0ZVBhcmFtcy5pZCwgJHJvdXRlUGFyYW1zLmNvZGUpXG4gIH1cblxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoJ0NoYXRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgbmdBdWRpbywgU29ja2V0RmFjdG9yeSwgTWVzc2FnZUZhY3RvcnksIENoYXRGYWN0b3J5LCBNZW1iZXJGYWN0b3J5KSB7XG5cbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcblxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG5cbiAgICAkc2NvcGUuZXJyb3IgPSB7fTtcblxuICAgICRzY29wZS51cGRhdGluZyA9IGZhbHNlO1xuICAgICRzY29wZS5sb2FkaW5nICA9IHRydWU7XG4gICAgJHNjb3BlLmF1dGggICAgID0gZmFsc2U7XG4gICAgJHNjb3BlLmNvbmVjdGVkID0gZmFsc2U7XG4gICAgJHNjb3BlLm1lc3NhZ2VzID0gW107XG4gICAgJHNjb3BlLm9ubGluZSAgID0gW107XG5cbiAgICAvL2NvbnNvbGUubG9nKFwiQ29ubmVjdGluZ1wiKTtcblxuICAgIFNvY2tldEZhY3RvcnkuY29ubmVjdCgnL2NoYXQnKTtcblxuICAgIFNvY2tldEZhY3Rvcnkub24oJ2Nvbm5lY3RlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5jb25lY3RlZCA9IHRydWU7XG4gICAgICBpZighJHNjb3BlLmF1dGgpe1xuICAgICAgICBTb2NrZXRGYWN0b3J5LmVtaXQoJ2F1dGgnLCB7aWQ6ICgkcm91dGVQYXJhbXMuaWQgfHwgJ2dlcmFsJyksIHVzZXI6ICRzY29wZS5tZS5pZH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCdBdXRoIHN1Y2Nlc3MnKTtcbiAgICAgICAgICAkc2NvcGUuYXV0aCA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgU29ja2V0RmFjdG9yeS5vbigndmFsaWRhdGlvbicsIGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICBpZighcmVzcG9uc2UuZXJyKXtcbiAgICAgICAgJHNjb3BlLmNoYXQgICAgID0gcmVzcG9uc2UuY2hhdERhdGE7XG4gICAgICAgICRzY29wZS5tZXNzYWdlcyA9IHJlc3BvbnNlLm1lc3NhZ2VzO1xuICAgICAgICAkc2NvcGUucm9vbSAgICAgPSByZXNwb25zZS5yb29tO1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUuY2hhdC5tZW1iZXJzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAkc2NvcGUub25saW5lLnB1c2goe21lbWJlcjogJHNjb3BlLmNoYXQubWVtYmVyc1tpXSwgb246IGZhbHNlfSk7XG4gICAgICAgICAgaWYocmVzcG9uc2Uub25saW5lLmluZGV4T2YoJHNjb3BlLmNoYXQubWVtYmVyc1tpXSkgIT0gLTEpe1xuICAgICAgICAgICAgJHNjb3BlLm9ubGluZVtpXS5vbiA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5vbmxpbmVbaV0ubmFtZSA9ICRzY29wZS5nZXRNZW1iZXIoJHNjb3BlLm9ubGluZVtpXS5tZW1iZXIpLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLmhpc3RvcnkgPSBoaXN0b3J5O1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhyZXNwb25zZS5tZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgICRzY29wZS5sb2FkaW5nICA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgU29ja2V0RmFjdG9yeS5vbigndXNlci1jb25uZWN0ZWQnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJVc2VyIGNvbm5lY3RlZDogXCIgKyByZXNwb25zZS5pZCk7XG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLm9ubGluZS5sZW5ndGg7IGkrKyl7XG4gICAgICAgIGlmKCRzY29wZS5vbmxpbmVbaV0ubWVtYmVyID09PSByZXNwb25zZS5pZCl7XG4gICAgICAgICAgJHNjb3BlLm9ubGluZVtpXS5vbiA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFNvY2tldEZhY3Rvcnkub24oJ3VzZXItZGlzY29ubmVjdGVkJywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiVXNlciBjb25uZWN0ZWQ6IFwiICsgcmVzcG9uc2UuaWQpO1xuICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5vbmxpbmUubGVuZ3RoOyBpKyspe1xuICAgICAgICBpZigkc2NvcGUub25saW5lW2ldLm1lbWJlciA9PT0gcmVzcG9uc2UuaWQpe1xuICAgICAgICAgICRzY29wZS5vbmxpbmVbaV0ub24gPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgU29ja2V0RmFjdG9yeS5vbignbWVzc2FnZScsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgdmFyIG1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuICAgICAgJHNjb3BlLm1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG4gICAgICBpZihtZXNzYWdlLm1lbWJlciAhPSAkc2NvcGUubWUuaWQpIHtcbiAgICAgICAgbmdBdWRpby5wbGF5KFwiYXVkaW8vbWVzc2FnZS5tcDNcIik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBTb2NrZXRGYWN0b3J5Lm9uKCdoaXN0b3J5LXNlbmQnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5tZXNzYWdlcyA9ICRzY29wZS5tZXNzYWdlcy5jb25jYXQocmVzcG9uc2UubWVzc2FnZXMpO1xuICAgICAgJHNjb3BlLnVwZGF0aW5nID0gZmFsc2U7XG4gICAgICAkc2NvcGUuaW5maW5pdGVTY3JvbGxEaXNhYmxlZCA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbigpe1xuICAgICAgU29ja2V0RmFjdG9yeS5kaXNjb25uZWN0KCk7XG4gICAgICBkZWxldGUgU29ja2V0RmFjdG9yeS5zb2NrZXQ7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJHNjb3BlLnRleHQgPT0gXCJcIil7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIG1lc3NhZ2VEYXRhID0ge1xuICAgICAgICB0ZXh0ICAgOiAkc2NvcGUudGV4dCxcbiAgICAgICAgY2hhdElkIDogKCRyb3V0ZVBhcmFtcy5pZCB8fCAnZ2VyYWwnKSxcbiAgICAgICAgbWVtYmVyIDogJHNjb3BlLm1lLmlkLFxuICAgICAgfVxuXG4gICAgICBTb2NrZXRGYWN0b3J5LmVtaXQoJ3NlbmQnLCB7cm9vbTogJHNjb3BlLnJvb20sIG1lc3NhZ2U6IG1lc3NhZ2VEYXRhIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdNZXNzYWdlIHNlbnQnKTtcbiAgICAgICAgJHNjb3BlLnRleHQgPSBcIlwiO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGhpc3RvcnkgKCkge1xuICAgICAgLy9jb25zb2xlLmxvZygnU3RhcnQgaGlzdG9yeSByZXF1ZXN0Jyk7XG4gICAgICBpZighJHNjb3BlLnVwZGF0aW5nKXtcbiAgICAgICAgJHNjb3BlLmluZmluaXRlU2Nyb2xsRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAkc2NvcGUudXBkYXRpbmcgPSB0cnVlO1xuICAgICAgICBTb2NrZXRGYWN0b3J5LmVtaXQoJ2hpc3RvcnktZ2V0Jywge3Jvb206ICRzY29wZS5yb29tLCBkYXRlOiAkc2NvcGUubWVzc2FnZXNbJHNjb3BlLm1lc3NhZ2VzLmxlbmd0aC0xXS5kYXRlIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coJ1NlbnQgaGlzdG9yeSByZXF1ZXN0Jyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iLCJyZXF1aXJlKCcuL2xpc3QnKTtcbnJlcXVpcmUoJy4vY2hhdCcpOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignQ2hhdHNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgQ2hhdEZhY3RvcnkpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgIENoYXRGYWN0b3J5LkNoYXQuZ2V0QWxsKGZ1bmN0aW9uKGNoYXRzKSB7XG4gICAgICAkc2NvcGUuY2hhdHMgPSBjaGF0cztcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNvbW1lbnRBcmVhQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCBNZW1iZXJGYWN0b3J5LCBDb21tZW50RmFjdG9yeSkge1xuXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgJHNjb3BlLmNvbW1lbnREYXRhID0ge1xuICAgICAgbWFya2Rvd246IFwiXCJcbiAgICB9O1xuXG4gICAgbG9hZENvbW1lbnRzKCk7XG5cbiAgICBmdW5jdGlvbiBsb2FkQ29tbWVudHMoKSB7XG4gICAgICBpZiAoJHNjb3BlLnRocmVhZC5zcGxpdChcIi1cIilbMV0gPT09IFwiXCIpIHtcbiAgICAgICAgc2V0VGltZW91dChsb2FkQ29tbWVudHMsIDUwMCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHRocmVhZElkO1xuICAgICAgdmFyIHRocmVhZFR5cGU7XG5cbiAgICAgIGlmKCRzY29wZS5zdWJ0aHJlYWQgJiYgJHNjb3BlLnN1YnRocmVhZCAhPSAnJykge1xuICAgICAgICB0aHJlYWRUeXBlID0gJHNjb3BlLnN1YnRocmVhZC5zcGxpdCgnLScpWzBdO1xuICAgICAgICB0aHJlYWRJZCA9ICRzY29wZS5zdWJ0aHJlYWQuc3Vic3RyaW5nKCRzY29wZS5zdWJ0aHJlYWQuaW5kZXhPZihcIi1cIikgKyAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocmVhZFR5cGUgPSAkc2NvcGUudGhyZWFkLnNwbGl0KCctJylbMF07XG4gICAgICAgIHRocmVhZElkID0gJHNjb3BlLnRocmVhZC5zdWJzdHJpbmcoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiLVwiKSArIDEpO1xuICAgICAgfVxuXG4gICAgICBzd2l0Y2godGhyZWFkVHlwZSkge1xuICAgICAgICBjYXNlIFwiY29tcGFueVwiOiBcbiAgICAgICAgICBDb21tZW50RmFjdG9yeS5Db21wYW55LmdldEFsbCh7aWQ6IHRocmVhZElkfSwgZ290Q29tbWVudHMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3BlYWtlclwiOiBcbiAgICAgICAgICBDb21tZW50RmFjdG9yeS5TcGVha2VyLmdldEFsbCh7aWQ6IHRocmVhZElkfSwgZ290Q29tbWVudHMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwidG9waWNcIjogXG4gICAgICAgICAgQ29tbWVudEZhY3RvcnkuVG9waWMuZ2V0QWxsKHtpZDogdGhyZWFkSWR9LCBnb3RDb21tZW50cyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjb21tdW5pY2F0aW9uXCI6IFxuICAgICAgICAgIENvbW1lbnRGYWN0b3J5LkNvbW11bmljYXRpb24uZ2V0QWxsKHtpZDogdGhyZWFkSWR9LCBnb3RDb21tZW50cyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdvdENvbW1lbnRzKGNvbW1lbnRzKSB7XG4gICAgICAgICRzY29wZS5jb21tZW50cyA9IGNvbW1lbnRzO1xuXG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJHNjb3BlLnBvc3RDb21tZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biA9PT0gXCJcIil7XG4gICAgICAgICRzY29wZS5lbXB0eUNvbW1lbnQgPSB0cnVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRlID0gRGF0ZS5ub3coKTtcbiAgICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQuY3JlYXRlKHtcbiAgICAgICAgdGhyZWFkOiAkc2NvcGUudGhyZWFkLFxuICAgICAgICBzdWJ0aHJlYWQ6ICRzY29wZS5zdWJ0aHJlYWQsXG4gICAgICAgIG1lbWJlcjogJHNjb3BlLm1lLmlkLFxuICAgICAgICBtYXJrZG93bjogJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duLFxuICAgICAgICBodG1sOiAkc2NvcGUuY29udmVydE1hcmtkb3duVG9IdG1sKCRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biksXG4gICAgICAgIHBvc3RlZDogZGF0ZSxcbiAgICAgICAgdXBkYXRlZDogZGF0ZVxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biA9IFwiXCI7XG4gICAgICAgICRzY29wZS5jb21tZW50Rm9ybS4kc2V0UHJpc3RpbmUoKTtcbiAgICAgICAgbG9hZENvbW1lbnRzKCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNhdmVDb21tZW50ID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgICAgIGlmIChjb21tZW50LmJ1ZmZlciA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbW1lbnQubWFya2Rvd24gPSBjb21tZW50LmJ1ZmZlcjtcbiAgICAgIGNvbW1lbnQuaHRtbCA9ICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwoY29tbWVudC5tYXJrZG93bik7XG4gICAgICBjb21tZW50LnVwZGF0ZWQgPSBEYXRlLm5vdygpO1xuXG4gICAgICBDb21tZW50RmFjdG9yeS5Db21tZW50LnVwZGF0ZSh7aWQ6IGNvbW1lbnQuX2lkfSwgY29tbWVudCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbW1lbnQuYnVmZmVyID0gXCJcIjtcbiAgICAgICAgY29tbWVudC5lZGl0aW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkc2NvcGUucXVvdGVDb21tZW50ID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgICAgICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biA9IFwiPiAqKlwiICsgJHNjb3BlLmdldE1lbWJlcihjb21tZW50Lm1lbWJlcikubmFtZSArIFwiIHNhaWQ6KipcXG4+IFwiICsgY29tbWVudC5tYXJrZG93bi5zcGxpdChcIlxcblwiKS5qb2luKFwiXFxuPiBcIikgKyBcIlxcblxcblwiO1xuICAgIH07XG5cbiAgICAkc2NvcGUuZGVsZXRlQ29tbWVudCA9IGZ1bmN0aW9uIChjb21tZW50KSB7XG4gICAgICBpZiAoY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBjb21tZW50P1wiKSkge1xuICAgICAgICBDb21tZW50RmFjdG9yeS5Db21tZW50LmRlbGV0ZSh7aWQ6IGNvbW1lbnQuX2lkfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGxvYWRDb21tZW50cygpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgICAgcmV0dXJuICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xuICAgICAgfSlbMF07XG4gICAgfTtcblxuICAgICRzY29wZS5jb252ZXJ0VGV4dFRvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHZhciB1cmxFeHAgPSAvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2lnO1xuICAgICAgdmFyIG1haWxFeHAgPSAvW1xcd1xcLlxcLV0rXFxAKFtcXHdcXC1dK1xcLikrW1xcd117Miw0fSg/IVtePF0qPikvaWc7XG5cbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpLnJlcGxhY2UodXJsRXhwLFwiPGEgaHJlZj0nJDEnPiQxPC9hPlwiKS5yZXBsYWNlKG1haWxFeHAsXCI8YSBocmVmPScjL2NvbXBhbnkvXCIrJHJvdXRlUGFyYW1zLmlkK1wiL2NvbmZpcm0/ZW1haWw9JCYnPiQmPC9hPlwiKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNvbnZlcnROZXdMaW5lc1RvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicrdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKSsnPC9kaXY+JztcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNvbnZlcnRNYXJrZG93blRvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicgKyB0ZXh0ICsgJzwvZGl2Pic7XG4gICAgfTtcblxuICAgICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAoY29tbWVudCkge1xuICAgICAgaWYoISRzY29wZS5tZS5yb2xlcykgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgICAgfSk7XG5cbiAgICAgIGlmKHJvbGVzLmxlbmd0aCA9PSAwICYmIGNvbW1lbnQubWVtYmVyICE9ICRzY29wZS5tZS5pZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XG4gICAgICBpZihzZWNvbmRzIDwgMCl7XG4gICAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgICAgc3VmZml4ID0gJ3RvIGdvJztcbiAgICAgIH1cblxuICAgICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAodGltZSkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKHRpbWUpLnRvVVRDU3RyaW5nKCk7XG4gICAgfTtcbiAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkZpcnN0Q29tbWVudENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgTWVtYmVyRmFjdG9yeSwgQ29tbWVudEZhY3RvcnkpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICRzY29wZS5jb21tZW50RGF0YSA9IHtcbiAgICAgIG1hcmtkb3duOiBcIlwiXG4gICAgfTtcblxuICAgIE1lbWJlckZhY3RvcnkuTWVtYmVyLmdldCh7aWQ6IFwibWVcIn0sIGZ1bmN0aW9uIChtZSkge1xuICAgICAgJHNjb3BlLm1lID0gbWU7XG4gICAgfSk7XG5cbiAgICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXRBbGwoZnVuY3Rpb24gKG1lbWJlcnMpIHtcbiAgICAgICRzY29wZS5tZW1iZXJzID0gbWVtYmVycztcbiAgICB9KTtcblxuICAgIGxvYWRDb21tZW50cygpO1xuXG4gICAgZnVuY3Rpb24gbG9hZENvbW1lbnRzKCkge1xuICAgICAgaWYgKCRzY29wZS50aHJlYWQuc3BsaXQoXCItXCIpWzFdID09PSBcIlwiKSB7XG4gICAgICAgIHNldFRpbWVvdXQobG9hZENvbW1lbnRzLCA1MDApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBwYWdlSWQgPSAkc2NvcGUudGhyZWFkLnN1YnN0cmluZygkc2NvcGUudGhyZWFkLmluZGV4T2YoXCItXCIpICsgMSk7XG5cbiAgICAgIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJjb21wYW55LVwiKSAhPSAtMSkge1xuICAgICAgICBDb21tZW50RmFjdG9yeS5Db21wYW55LmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCRzY29wZS50aHJlYWQuaW5kZXhPZihcInNwZWFrZXItXCIpICE9IC0xKSB7XG4gICAgICAgIENvbW1lbnRGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKHtpZDogcGFnZUlkfSwgZ290Q29tbWVudHMpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwidG9waWMtXCIpICE9IC0xKSB7XG4gICAgICAgIENvbW1lbnRGYWN0b3J5LlRvcGljLmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ290Q29tbWVudHMoY29tbWVudHMpIHtcbiAgICAgICAgJHNjb3BlLmNvbW1lbnRzID0gW107XG4gICAgICAgIHZhciBmaXJzdENvbW1lbnQgPSBjb21tZW50cy5zb3J0KGZ1bmN0aW9uKGEsYil7XG4gICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGEucG9zdGVkKSAtIG5ldyBEYXRlKGIucG9zdGVkKTtcbiAgICAgICAgfSlbMF07XG5cbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkc2NvcGUucG9zdENvbW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duID09PSBcIlwiKXtcbiAgICAgICAgJHNjb3BlLmVtcHR5Q29tbWVudCA9IHRydWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGRhdGUgPSBEYXRlLm5vdygpO1xuICAgICAgQ29tbWVudEZhY3RvcnkuQ29tbWVudC5jcmVhdGUoe1xuICAgICAgICB0aHJlYWQ6ICRzY29wZS50aHJlYWQsXG4gICAgICAgIG1lbWJlcjogJHNjb3BlLm1lLmlkLFxuICAgICAgICBtYXJrZG93bjogJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duLFxuICAgICAgICBodG1sOiAkc2NvcGUuY29udmVydE1hcmtkb3duVG9IdG1sKCRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biksXG4gICAgICAgIHBvc3RlZDogZGF0ZSxcbiAgICAgICAgdXBkYXRlZDogZGF0ZVxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biA9IFwiXCI7XG4gICAgICAgIGxvYWRDb21tZW50cygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLnNhdmVDb21tZW50ID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgICAgIGlmIChjb21tZW50LmJ1ZmZlciA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbW1lbnQubWFya2Rvd24gPSBjb21tZW50LmJ1ZmZlcjtcbiAgICAgIGNvbW1lbnQuaHRtbCA9ICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwoY29tbWVudC5tYXJrZG93bik7XG4gICAgICBjb21tZW50LnVwZGF0ZWQgPSBEYXRlLm5vdygpO1xuXG4gICAgICBDb21tZW50RmFjdG9yeS5Db21tZW50LnVwZGF0ZSh7aWQ6IGNvbW1lbnQuX2lkfSwgY29tbWVudCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbW1lbnQuZWRpdGluZyA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLnF1b3RlQ29tbWVudCA9IGZ1bmN0aW9uIChjb21tZW50KSB7XG4gICAgICAkc2NvcGUuY29tbWVudERhdGEubWFya2Rvd24gPSBcIj4gKipcIiArICRzY29wZS5nZXRNZW1iZXIoY29tbWVudC5tZW1iZXIpLm5hbWUgKyBcIiBzYWlkOioqXFxuPiBcIiArIGNvbW1lbnQubWFya2Rvd24uc3BsaXQoXCJcXG5cIikuam9pbihcIlxcbj4gXCIpICsgXCJcXG5cXG5cIjtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmRlbGV0ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xuICAgICAgaWYgKGNvbmZpcm0oXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgY29tbWVudD9cIikpIHtcbiAgICAgICAgQ29tbWVudEZhY3RvcnkuQ29tbWVudC5kZWxldGUoe2lkOiBjb21tZW50Ll9pZH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBsb2FkQ29tbWVudHMoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICAgIH0pWzBdO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY29udmVydFRleHRUb0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcbiAgICAgIHZhciBtYWlsRXhwID0gL1tcXHdcXC5cXC1dK1xcQChbXFx3XFwtXStcXC4pK1tcXHddezIsNH0oPyFbXjxdKj4pL2lnO1xuXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIikucmVwbGFjZShtYWlsRXhwLFwiPGEgaHJlZj0nIy9jb21wYW55L1wiKyRyb3V0ZVBhcmFtcy5pZCtcIi9jb25maXJtP2VtYWlsPSQmJz4kJjwvYT5cIik7XG4gICAgfTtcblxuICAgICRzY29wZS5jb252ZXJ0TmV3TGluZXNUb0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICByZXR1cm4gJzxkaXYgZGF0YS1tYXJrZG93bj4nK3RleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykrJzwvZGl2Pic7XG4gICAgfTtcblxuICAgICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICByZXR1cm4gJzxkaXYgZGF0YS1tYXJrZG93bj4nICsgdGV4dCArICc8L2Rpdj4nO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgICAgIGlmKCEkc2NvcGUubWUucm9sZXMpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAgIHZhciByb2xlcyA9ICRzY29wZS5tZS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcbiAgICAgIH0pO1xuXG4gICAgICBpZihyb2xlcy5sZW5ndGggPT0gMCAmJiBjb21tZW50Lm1lbWJlciAhPSAkc2NvcGUubWUuaWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgICAgaWYoc2Vjb25kcyA8IDApe1xuICAgICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcblxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XG4gICAgfTtcblxuICAgICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lKS50b1VUQ1N0cmluZygpO1xuICAgIH07XG4gIH1cbn0pO1xuIiwicmVxdWlyZSgnLi9hcmVhLmpzJyk7XG5yZXF1aXJlKCcuL2ZpcnN0LmpzJyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNvbW11bmljYXRpb25BcmVhQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCBDb21tdW5pY2F0aW9uRmFjdG9yeSkge1xuXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgJHNjb3BlLmNvbW11bmljYXRpb25EYXRhID0ge1xuICAgICAgbWFya2Rvd246IFwiXCJcbiAgICB9O1xuXG4gICAgJHNjb3BlLm1lID0gSlNPTi5wYXJzZSgkc2NvcGUubWVKc29uKTtcbiAgICAkc2NvcGUubWVtYmVycyA9IEpTT04ucGFyc2UoJHNjb3BlLm1lbWJlcnNKc29uKTtcbiAgICAkc2NvcGUucm9sZXMgPSBKU09OLnBhcnNlKCRzY29wZS5yb2xlc0pzb24pO1xuXG4gICAgbG9hZENvbW11bmljYXRpb25zKCk7XG5cbiAgICBmdW5jdGlvbiBsb2FkQ29tbXVuaWNhdGlvbnMoKSB7XG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAgIGlmICgkc2NvcGUudGhyZWFkLnNwbGl0KFwiLVwiKVsxXSA9PT0gXCJcIikge1xuICAgICAgICBzZXRUaW1lb3V0KGxvYWRDb21tdW5pY2F0aW9ucywgNTAwKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcGFnZUlkID0gJHNjb3BlLnRocmVhZC5zdWJzdHJpbmcoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiLVwiKSArIDEpO1xuXG4gICAgICBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiY29tcGFueS1cIikgIT0gLTEpIHtcbiAgICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tcGFueS5nZXRBbGwoIHtpZDogcGFnZUlkfSwgZ290Q29tbXVuaWNhdGlvbnMpO1xuICAgICAgICAkc2NvcGUua2luZHM9WydFbWFpbCBUbycsICdFbWFpbCBGcm9tJywgJ01lZXRpbmcnLCAnUGhvbmUgQ2FsbCddO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwic3BlYWtlci1cIikgIT0gLTEpIHtcbiAgICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuU3BlYWtlci5nZXRBbGwoIHtpZDogcGFnZUlkfSwgZ290Q29tbXVuaWNhdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnb3RDb21tdW5pY2F0aW9ucyhjb21tdW5pY2F0aW9ucykge1xuICAgICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbnMgPSBjb21tdW5pY2F0aW9ucztcblxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJzcGVha2VyLVwiKSAhPSAtMSkge1xuICAgICAgICAgIGlmKGNvbW11bmljYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgICAgICByZXR1cm4gby5raW5kLmluZGV4T2YoJ1BhcmFncmFwaCcpICE9IC0xO1xuICAgICAgICAgIH0pLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICAkc2NvcGUua2luZHM9WydFbWFpbCBUbycsICdFbWFpbCBGcm9tJywgJ01lZXRpbmcnLCAnUGhvbmUgQ2FsbCddO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUua2luZHM9WydJbml0YWwgRW1haWwgUGFyYWdyYXBoJywnRW1haWwgVG8nLCAnRW1haWwgRnJvbScsICdNZWV0aW5nJywgJ1Bob25lIENhbGwnXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAkc2NvcGUucG9zdENvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoISRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS5raW5kIHx8ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS5raW5kPT0gXCJcIil7XG4gICAgICAgICRzY29wZS5lbXB0eUNvbW11bmljYXRpb24gPSB0cnVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoISRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0IHx8ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0PT0gXCJcIil7XG4gICAgICAgICRzY29wZS5lbXB0eUNvbW11bmljYXRpb24gPSB0cnVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRlID0gRGF0ZS5ub3coKTtcblxuICAgICAgLy9jb25zb2xlLmxvZygkc2NvcGUuZXZlbnQpO1xuXG4gICAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLmNyZWF0ZSh7XG4gICAgICAgIHRocmVhZDogJHNjb3BlLnRocmVhZCxcbiAgICAgICAgbWVtYmVyOiAkc2NvcGUubWUuaWQsXG4gICAgICAgIGtpbmQ6ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS5raW5kLFxuICAgICAgICB0ZXh0OiAkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEudGV4dCxcbiAgICAgICAgZXZlbnQ6ICRzY29wZS5ldmVudC5pZCxcbiAgICAgICAgcG9zdGVkOiBkYXRlLFxuICAgICAgICB1cGRhdGVkOiBkYXRlXG4gICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLmNvbW11bmljYXRpb25EYXRhLnRleHQgPSBcIlwiO1xuICAgICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEua2luZCA9IFwiXCI7XG4gICAgICAgICRzY29wZS5jb21tdW5pY2F0aW9uRm9ybS4kc2V0UHJpc3RpbmUoKTtcbiAgICAgICAgbG9hZENvbW11bmljYXRpb25zKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2F2ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgICAgaWYgKGNvbW11bmljYXRpb24uYnVmZmVyID09PSBcIlwiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29tbXVuaWNhdGlvbi50ZXh0ID0gY29tbXVuaWNhdGlvbi5idWZmZXI7XG4gICAgICBjb21tdW5pY2F0aW9uLnVwZGF0ZWQgPSBEYXRlLm5vdygpO1xuXG4gICAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLnVwZGF0ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgY29tbXVuaWNhdGlvbiwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbW11bmljYXRpb24uZWRpdGluZyA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmRlbGV0ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5kZWxldGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG9hZENvbW11bmljYXRpb25zKCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmFwcHJvdmVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uYXBwcm92ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgbnVsbCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGxvYWRDb21tdW5pY2F0aW9ucygpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICAgIH0pWzBdO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICAgIHZhciByb2xlcyA9ICRzY29wZS5tZS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcbiAgICAgIH0pO1xuXG4gICAgICBpZihyb2xlcy5sZW5ndGggPT0gMCAmJiBjb21tdW5pY2F0aW9uLm1lbWJlciAhPSAkc2NvcGUubWUuaWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgICAgaWYoc2Vjb25kcyA8IDApe1xuICAgICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcblxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XG4gICAgfTtcblxuICAgICRzY29wZS5jb252ZXJ0VVJMcyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHZhciB1cmxFeHAgPSAvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2lnO1xuXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIik7XG4gICAgfVxuICB9XG5cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJDb21tdW5pY2F0aW9uRW1iZWRDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIENvbW11bmljYXRpb25GYWN0b3J5KSB7XG5cbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcblxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgJHNjb3BlLnN1Y2Nlc3MgICAgID0gXCJcIjtcbiAgICAkc2NvcGUuZXJyb3IgICAgICAgPSBcIlwiO1xuXG4gICAgJHNjb3BlLmNvbW11bmljYXRpb24uZWRpdGluZyA9IGZhbHNlO1xuICAgICRzY29wZS5jb21tdW5pY2F0aW9uLmRlbGV0ZWQgPSBmYWxzZTtcblxuXG4gICAgJHNjb3BlLnNhdmVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICAgIGlmIChjb21tdW5pY2F0aW9uLmJ1ZmZlciA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbW11bmljYXRpb24udGV4dCA9IGNvbW11bmljYXRpb24uYnVmZmVyO1xuICAgICAgY29tbXVuaWNhdGlvbi51cGRhdGVkID0gRGF0ZS5ub3coKTtcblxuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi51cGRhdGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIGNvbW11bmljYXRpb24sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBjb21tdW5pY2F0aW9uLmVkaXRpbmcgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgICRzY29wZS5kZWxldGVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uZGVsZXRlKHtpZDogY29tbXVuaWNhdGlvbi5faWR9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5jb21tdW5pY2F0aW9uLmRlbGV0ZWQgPSB0cnVlO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zZXRDb21tdW5pY2F0aW9uU3RhdHVzID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24sIHN0YXR1cykge1xuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi51cGRhdGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIHtzdGF0dXM6IHN0YXR1c30sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbi5zdGF0dXMgPSBzdGF0dXM7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgICAgcmV0dXJuICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xuICAgICAgfSlbMF07XG4gICAgfTtcblxuICAgICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgICAgfSk7XG5cbiAgICAgIGlmKHJvbGVzLmxlbmd0aCA9PSAwICYmIGNvbW11bmljYXRpb24ubWVtYmVyICE9ICRzY29wZS5tZS5pZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XG4gICAgICBpZihzZWNvbmRzIDwgMCl7XG4gICAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgICAgc3VmZml4ID0gJ3RvIGdvJztcbiAgICAgIH1cblxuICAgICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAodGltZSkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKHRpbWUpLnRvVVRDU3RyaW5nKCk7XG4gICAgfTtcblxuICAgICRzY29wZS5jb252ZXJ0VVJMcyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHZhciB1cmxFeHAgPSAvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2lnO1xuXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIik7XG4gICAgfVxuICB9XG59KTtcbiIsInJlcXVpcmUoJy4vYXJlYS5qcycpO1xucmVxdWlyZSgnLi9saXN0LmpzJyk7XG5yZXF1aXJlKCcuL2VtYmVkLmpzJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDb21tdW5pY2F0aW9uc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvdXRlUGFyYW1zLCAkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCBDb21tdW5pY2F0aW9uRmFjdG9yeSkge1xuICAgICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG4gICAgICBcbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5nZXRBbGwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmNvbW11bmljYXRpb25zID0gcmVzcG9uc2U7XG4gICAgICB9KTtcblxuICAgICAgJHNjb3BlLnNob3dPcGVuID0gdHJ1ZTtcblxuICAgICAgJHNjb3BlLnNob3duQ29tbXVuaWNhdGlvbnMgPSBmdW5jdGlvbiAoc2hvd09wZW4pIHtcbiAgICAgICAgcmV0dXJuICRzY29wZS5jb21tdW5pY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICAgIHJldHVybiAoc2hvd09wZW4gPyAhKG8uc3RhdHVzPT0nYXBwcm92ZWQnKSA6IG8uc3RhdHVzPT0nYXBwcm92ZWQnKSAmJiAkcm91dGVQYXJhbXMua2luZCA9PSBvLnRocmVhZC5zcGxpdCgnLScpWzBdO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignQ29tcGFueUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJGxvY2F0aW9uLCAkcm91dGVQYXJhbXMsICRzY2UsIENvbXBhbnlGYWN0b3J5LCBNZW1iZXJGYWN0b3J5LCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XG5cbiAgICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgICAkc2NvcGUudHJ1c3RTcmMgPSBmdW5jdGlvbihzcmMpIHtcbiAgICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKHNyYysnI3BhZ2UtYm9keScpO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUuY29udmVydEVtYWlscyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgdmFyIG1haWxFeHAgPSAvW1xcd1xcLlxcLV0rXFxAKFtcXHdcXC1dK1xcLikrW1xcd117Miw0fSg/IVtePF0qPikvaWc7XG4gICAgICAgIHZhciB0d2l0dGVyRXhwID0gLyhefFteQFxcd10pQChcXHd7MSwxNX0pXFxiL2c7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UobWFpbEV4cCxcIjxhIGhyZWY9JyMvY29tcGFueS9cIiskcm91dGVQYXJhbXMuaWQrXCIvY29uZmlybT9lbWFpbD0kJic+JCY8L2E+XCIpLnJlcGxhY2UodHdpdHRlckV4cCxcIiQxPGEgaHJlZj0naHR0cDovL3R3aXR0ZXIuY29tLyQyJyB0YXJnZXQ9J19ibGFuayc+JDI8L2E+XCIpXG4gICAgICB9XG5cbiAgICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNvbXBhbnlEYXRhID0gdGhpcy5mb3JtRGF0YTtcblxuICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LnVwZGF0ZSh7IGlkOmNvbXBhbnlEYXRhLmlkIH0sIGNvbXBhbnlEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ2NvbXBhbnkvJytjb21wYW55RGF0YS5pZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5kZWxldGVDb21wYW55ID0gZnVuY3Rpb24oY29tcGFueSkge1xuICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmRlbGV0ZSh7IGlkOmNvbXBhbnkuaWQgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2Uuc3VjY2VzcztcbiAgICAgICAgICB9XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ2NvbXBhbmllcy8nKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYocm9sZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc3RhdHVzZXMgPSBbJ1N1Z2dlc3Rpb24nLCdDb250YWN0ZWQnLCdJbiBDb252ZXJzYXRpb25zJywnSW4gTmVnb3RpYXRpb25zJywnQ2xvc2VkIERlYWwnLCdSZWplY3RlZCcsJ0dpdmUgVXAnXTtcbiAgICAgICRzY29wZS5sb2dvU2l6ZXMgPSBbbnVsbCwgJ1MnLCdNJywnTCddO1xuICAgICAgJHNjb3BlLnN0YW5kRGF5cyA9IFtudWxsLCAxLDIsMyw0LDVdO1xuICAgICAgJHNjb3BlLnBvc3RzTnVtYmVycyA9IFtudWxsLCAxLDIsMyw0LDVdO1xuXG4gICAgICAkc2NvcGUuY29tcGFueSA9ICRzY29wZS5mb3JtRGF0YSA9ICRzY29wZS5nZXRDb21wYW55KCRyb3V0ZVBhcmFtcy5pZCk7XG5cbiAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0KHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSAkc2NvcGUuZm9ybURhdGEgPSByZXNwb25zZTtcblxuICAgICAgICBOb3RpZmljYXRpb25GYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24oZ2V0RGF0YSkge1xuICAgICAgICAgICRzY29wZS5jb21wYW55Tm90aWZpY2F0aW9ucyA9IGdldERhdGE7XG5cbiAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDb21wYW55RW1haWxDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgJGxvY2F0aW9uLCBFbWFpbEZhY3RvcnkpIHtcbiAgICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgICAkc2NvcGUuZW1haWwgPSAkbG9jYXRpb24uc2VhcmNoKCkuZW1haWw7XG4gICAgICAkc2NvcGUuY29tcGFueUlkID0gJHJvdXRlUGFyYW1zLmlkO1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgICAkc2NvcGUubWVzc2FnZSA9IG51bGw7XG5cbiAgICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuICAgICAgICAkc2NvcGUubWVzc2FnZSA9IG51bGw7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInNlbmQgZW1haWwgdG8gXCIsICRzY29wZS5lbWFpbCwgXCIgZnJvbSBcIiwgJHNjb3BlLmNvbXBhbnlJZCk7XG5cbiAgICAgICAgRW1haWxGYWN0b3J5LkNvbXBhbnkuc2VuZCh7IGlkOiAkc2NvcGUuY29tcGFueUlkIH0sIHsgZW1haWw6ICRzY29wZS5lbWFpbCB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbiBcbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDcmVhdGVDb21wYW55Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgQ29tcGFueUZhY3RvcnkpIHtcbiAgICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuICAgICAgXG4gICAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb21wYW55RGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS5jcmVhdGUoY29tcGFueURhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKGZ1bmN0aW9uIChjb21wYW5pZXMpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IGNvbXBhbmllcztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9jb21wYW55L1wiICsgcmVzcG9uc2UuaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc3RhdHVzZXMgPSBbJ1N1Z2dlc3Rpb24nLCdDb250YWN0ZWQnLCdJbiBDb252ZXJzYXRpb25zJywnSW4gTmVnb3RpYXRpb25zJywnQ2xvc2VkIERlYWwnLCdSZWplY3RlZCcsJ0dpdmUgVXAnXTtcbiAgICB9XG4gIH0pOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignQ29tcGFueUVtYmVkQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgIGlmKCRzY29wZS5ldmVudCkge1xuICAgICAgJHNjb3BlLnBhcnRpY2lwYXRpb24gPSAkc2NvcGUuY29tcGFueS5wYXJ0aWNpcGF0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICByZXR1cm4gby5ldmVudCA9PSAkc2NvcGUuZXZlbnQuaWQ7XG4gICAgICB9KVswXTtcbiAgICB9XG5cbiAgICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgICB2YXIgbWVtYmVyID0gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XG4gICAgICB9KTtcblxuICAgICAgaWYobWVtYmVyLmxlbmd0aD4wKSB7XG4gICAgICAgIHJldHVybiBtZW1iZXJbMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6ICdObyBvbmUnLFxuICAgICAgICAgIGZhY2Vib29rOiAnMTAwMDAwNDU2MzM1OTcyJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUuZ2V0VW5yZWFkTm90aWZpY2F0aW9ucyA9IGZ1bmN0aW9uICh0aHJlYWQpIHtcbiAgICAgIHZhciBub3RpZmljYXRpb25zID0gJHNjb3BlLm5vdGlmaWNhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgcmV0dXJuIG8udGhyZWFkID09IHRocmVhZDtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG5vdGlmaWNhdGlvbnM7XG4gICAgfTtcblxuICAgICRzY29wZS5jb21wYW55LnVucmVhZCA9ICRzY29wZS5nZXRVbnJlYWROb3RpZmljYXRpb25zKCdjb21wYW55LScgKyAkc2NvcGUuY29tcGFueS5pZCkubGVuZ3RoID4gMDtcblxuICAgICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XG4gICAgICBpZihzZWNvbmRzIDwgMCl7XG4gICAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgICAgc3VmZml4ID0gJ3RvIGdvJztcbiAgICAgIH1cblxuICAgICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgJyB5ZWFycyAnICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyAnIG1vbnRocyAnICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgJyBkYXlzICcgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArICcgaG91cnMgJyArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArICcgbWludXRlcyAnICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyAnIHNlY29uZHMgJyArIHN1ZmZpeDtcbiAgICB9O1xuICB9XG59KTtcbiIsInJlcXVpcmUoJy4vY29tcGFueS5qcycpO1xucmVxdWlyZSgnLi9saXN0LmpzJyk7XG5yZXF1aXJlKCcuL2NyZWF0ZS5qcycpO1xucmVxdWlyZSgnLi9jb25maXJtLmpzJyk7XG5yZXF1aXJlKCcuL2VtYmVkLmpzJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignQ29tcGFuaWVzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkc2NlLCBDb21wYW55RmFjdG9yeSkge1xuXG4gICAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcbiAgICAgICRzY29wZS5zYXZlU3RhdHVzID0gZnVuY3Rpb24oY29tcGFueSkge1xuICAgICAgICB2YXIgY29tcGFueURhdGEgPSBjb21wYW55O1xuXG4gICAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkudXBkYXRlKHsgaWQ6Y29tcGFueS5pZCB9LCBjb21wYW55RGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLmdldENsYXNzRnJvbVBheW1lbnRTdGF0dXMgPSBmdW5jdGlvbihwYXJ0aWNpcGF0aW9uKSB7XG4gICAgICAgIGlmKCFwYXJ0aWNpcGF0aW9uKSB7IHJldHVybiAnZ3JleSc7IH1cbiAgICAgICAgaWYoIXBhcnRpY2lwYXRpb24ucGF5bWVudCkgeyByZXR1cm4gJ2dyZXknOyB9XG4gICAgICAgIGlmKCFwYXJ0aWNpcGF0aW9uLnBheW1lbnQuc3RhdHVzKSB7IHJldHVybiAnZ3JleSc7IH1cbiAgICAgICAgdmFyIHN0YXR1cyA9IHBhcnRpY2lwYXRpb24ucGF5bWVudC5zdGF0dXMudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBpZihzdGF0dXMuaW5kZXhPZigncGFnbycpICE9IC0xIHx8IHN0YXR1cy5pbmRleE9mKCdlbWl0aWRvJykgIT0gLTEgfHwgc3RhdHVzLmluZGV4T2YoJ3JlY2libyBlbnZpYWRvJykgIT0gLTEpIHsgcmV0dXJuICdsaW1lJzsgfVxuICAgICAgICBlbHNlIGlmKHN0YXR1cy5pbmRleE9mKCdlbnZpYWRvJykgIT0gLTEpIHsgcmV0dXJuICdvcmFuZ2UnOyB9XG4gICAgICAgIGVsc2UgeyByZXR1cm4gJ2dyZXknOyB9XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUucGF5bWVudFN0YXR1c2VzID0gWydFbWl0aWRvJywgJ1JlY2libyBFbnZpYWRvJywgJ1BhZ28nLCAnRW52aWFkbyddO1xuXG4gICAgICAkc2NvcGUubGltaXQgPSAyMDtcblxuICAgICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnQ29udGFjdGVkJywnSW4gQ29udmVyc2F0aW9ucycsJ0luIE5lZ290aWF0aW9ucycsJ0Nsb3NlZCBEZWFsJywnUmVqZWN0ZWQnLCdHaXZlIFVwJ107XG5cbiAgICAgICRzY29wZS5jb21wYW55UHJlZGljYXRlID0gJ3VwZGF0ZWQnO1xuICAgICAgJHNjb3BlLnJldmVyc2UgPSAndHJ1ZSc7XG4gICAgICAkc2NvcGUudW5yZWFkRmlyc3QgPSB0cnVlO1xuXG4gICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmdldEFsbChmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUucHJlZGljYXRlID0gJ3VwZGF0ZWQnO1xuICAgICAgICAkc2NvcGUucmV2ZXJzZSA9IHRydWU7XG4gICAgICAgICRzY29wZS5jb21wYW5pZXMgPSByZXNwb25zZTtcbiAgICAgIH0pO1xuXG4gICAgICAkc2NvcGUuc2Nyb2xsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkc2NvcGUubGltaXQgPD0gJHNjb3BlLmNvbXBhbmllcy5sZW5ndGgpXG4gICAgICAgICAgJHNjb3BlLmxpbWl0ICs9IDE7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKG1lbWJlcikge1xuICAgICAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYocm9sZXMubGVuZ3RoID09PSAwICYmIG1lbWJlci5pZCAhPSAkc2NvcGUubWUuaWQpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5hZGRDb21wYW55ID0gZnVuY3Rpb24obWVtYmVyLCBuZXdDb21wYW55KSB7XG4gICAgICAgIC8vY29uc29sZS5sb2cobmV3Q29tcGFueSk7XG4gICAgICAgIHZhciBjb21wYW55RGF0YSA9IG5ld0NvbXBhbnk7XG5cbiAgICAgICAgaWYobmV3Q29tcGFueS5pZCkge1xuICAgICAgICAgIHZhciBwYXJ0aWNpcGF0aW9uID0gJHNjb3BlLmdldFBhcnRpY2lwYXRpb24oY29tcGFueURhdGEsICRzY29wZS5jdXJyZW50RXZlbnQuaWQpO1xuICAgICAgICAgIGlmKHBhcnRpY2lwYXRpb24pIHtcbiAgICAgICAgICAgIHBhcnRpY2lwYXRpb24ubWVtYmVyID0gbWVtYmVyLmlkO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb21wYW55RGF0YS5wYXJ0aWNpcGF0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgZXZlbnQ6ICRzY29wZS5jdXJyZW50RXZlbnQuaWQsXG4gICAgICAgICAgICAgIHN0YXR1czogJ1NlbGVjdGVkJyxcbiAgICAgICAgICAgICAgbWVtYmVyOiBtZW1iZXIuaWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LnVwZGF0ZSh7IGlkOiBjb21wYW55RGF0YS5pZCB9LCB7IHBhcnRpY2lwYXRpb25zOiBjb21wYW55RGF0YS5wYXJ0aWNpcGF0aW9ucyB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xuXG4gICAgICAgICAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKGZ1bmN0aW9uIChjb21wYW5pZXMpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY29tcGFuaWVzID0gY29tcGFuaWVzO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21wYW55RGF0YS5wYXJ0aWNpcGF0aW9ucyA9IFt7XG4gICAgICAgICAgICBldmVudDogJHNjb3BlLmN1cnJlbnRFdmVudC5pZCxcbiAgICAgICAgICAgIHN0YXR1czogJ1NlbGVjdGVkJyxcbiAgICAgICAgICAgIG1lbWJlcjogbWVtYmVyLmlkXG4gICAgICAgICAgfV07XG5cbiAgICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmNyZWF0ZShjb21wYW55RGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuXG4gICAgICAgICAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKGZ1bmN0aW9uIChjb21wYW5pZXMpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY29tcGFuaWVzID0gY29tcGFuaWVzO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cblxufSk7XG5cbiIsInRoZVRvb2xDb250cm9sbGVyID0gYW5ndWxhci5tb2R1bGUoJ3RoZVRvb2wuY29udHJvbGxlcnMnLCBbXSk7XG5cbnJlcXVpcmUoJy4vYXV0aCcpO1xucmVxdWlyZSgnLi9tYWluJyk7XG5yZXF1aXJlKCcuL2NvbXBhbnknKTtcbnJlcXVpcmUoJy4vc3BlYWtlcicpO1xucmVxdWlyZSgnLi9tZW1iZXInKTtcbnJlcXVpcmUoJy4vY29tbWVudCcpO1xucmVxdWlyZSgnLi9tZWV0aW5nJyk7XG5yZXF1aXJlKCcuL2NoYXQnKTtcbnJlcXVpcmUoJy4vdG9waWMnKTtcbnJlcXVpcmUoJy4vY29tbXVuaWNhdGlvbicpO1xucmVxdWlyZSgnLi90YWcnKTtcbnJlcXVpcmUoJy4vc3Vic2NyaXB0aW9uJyk7XG5yZXF1aXJlKCcuL2FkbWluJyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcImhvbWVcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgTm90aWZpY2F0aW9uRmFjdG9yeSkge1xuXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICRzY29wZS5ub3RpZmljYXRpb25zID0gW107XG4gICAgJHNjb3BlLmxpbWl0ID0gMTA7XG5cbiAgICBOb3RpZmljYXRpb25GYWN0b3J5Lk5vdGlmaWNhdGlvbi5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUubm90aWZpY2F0aW9ucyA9IHJlc3BvbnNlO1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgICRzY29wZS5zY3JvbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoJHNjb3BlLmxpbWl0IDwgJHNjb3BlLm5vdGlmaWNhdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICRzY29wZS5saW1pdCArPSAxMDtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbn0pO1xuIiwicmVxdWlyZSgnLi9tYWluLmpzJyk7XG5yZXF1aXJlKCcuL2hvbWUuanMnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCAkbG9jYXRpb24sICR3aW5kb3csICRyb290U2NvcGUsIE5vdGlmaWNhdGlvbkZhY3RvcnksIE1lbWJlckZhY3RvcnksIENvbXBhbnlGYWN0b3J5LCBTcGVha2VyRmFjdG9yeSwgVG9waWNGYWN0b3J5LCBSb2xlRmFjdG9yeSwgVGFnRmFjdG9yeSwgQ29tbWVudEZhY3RvcnksIENoYXRGYWN0b3J5LCBFdmVudEZhY3RvcnksIFNlc3Npb25GYWN0b3J5LCBJdGVtRmFjdG9yeSkge1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLnJlYWR5ID0gZmFsc2U7XG5cbiAgJHNjb3BlLmRpc3BsYXkgPSBmYWxzZTtcblxuICAkc2NvcGUuc2VhcmNoID0ge307XG4gICRzY29wZS5zZWFyY2hUb3BpY3MgPSB7fTtcbiAgJHNjb3BlLnNlYXJjaENvbXBhbmllcyA9IHt9O1xuICAkc2NvcGUuc2VhcmNoU3BlYWtlcnMgPSB7fTtcbiAgJHNjb3BlLnNlYXJjaE1lbWJlcnMgPSB7fTtcbiAgJHNjb3BlLmFjdGl2ZUV2ZW50ID0ge307XG5cbiAgJHNjb3BlLm1lID0ge307XG4gICRzY29wZS5tZW1iZXJzID0gW107XG4gICRzY29wZS5jb21wYW5pZXMgPSBbXTtcbiAgJHNjb3BlLnNwZWFrZXJzID0gW107XG4gICRzY29wZS50b3BpY3MgPSBbXTtcbiAgJHNjb3BlLnRhcmdldE5vdGlmaWNhdGlvbnMgPSBbXTtcbiAgJHNjb3BlLnVucmVhZE5vdGlmaWNhdGlvbnMgPSBbXTtcblxuICAkc2NvcGUudGFyZ2V0SW5mbyA9IHtcbiAgICBudW1iZXI6IDAsXG4gICAgdGV4dDogXCIgTG9hZGluZy4uLlwiXG4gIH07XG5cbiAgdmFyIGZhY3Rvcmllc1JlYWR5ID0gMDtcblxuICAkc2NvcGUuc2V0Q3VycmVudEV2ZW50ID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAkc2NvcGUuY3VycmVudEV2ZW50ID0ge307XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpeyRzY29wZS5jdXJyZW50RXZlbnQgPSBldmVudDt9LDEwKTtcbiAgfVxuXG4gICRyb290U2NvcGUudXBkYXRlID0ge1xuXG4gICAgcnVubmluZzogZmFsc2UsXG5cbiAgICB0aW1lb3V0OiBmdW5jdGlvbihjYil7XG4gICAgICBpZighJHNjb3BlLnJlYWR5KXtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICBpZighJHJvb3RTY29wZS51cGRhdGUucnVubmluZyl7XG4gICAgICAgICAgJHJvb3RTY29wZS51cGRhdGUuYWxsKCk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChjYikgfSwgMTUwMCk7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICBjYigpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSxcblxuICAgIG1lOiBmdW5jdGlvbigpe1xuICAgICAgTWVtYmVyRmFjdG9yeS5NZS5nZXQoZnVuY3Rpb24gKG1lKSB7XG4gICAgICAgICRzY29wZS5tZSA9IG1lO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIG1lbWJlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXRBbGwoZnVuY3Rpb24gKG1lbWJlcnMpIHtcbiAgICAgICAgJHNjb3BlLm1lbWJlcnMgPSBtZW1iZXJzO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNvbXBhbmllczogZnVuY3Rpb24oKXtcbiAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKGZ1bmN0aW9uIChjb21wYW5pZXMpIHtcbiAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IGNvbXBhbmllcztcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzcGVha2VyczogZnVuY3Rpb24oKXtcbiAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKGZ1bmN0aW9uIChzcGVha2Vycykge1xuICAgICAgICAkc2NvcGUuc3BlYWtlcnMgPSBzcGVha2VycztcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICB0b3BpY3M6IGZ1bmN0aW9uKCl7XG4gICAgICBUb3BpY0ZhY3RvcnkuVG9waWMuZ2V0QWxsKGZ1bmN0aW9uICh0b3BpY3MpIHtcbiAgICAgICAgJHNjb3BlLnRvcGljcyA9IHRvcGljcztcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByb2xlczogZnVuY3Rpb24oKXtcbiAgICAgIFJvbGVGYWN0b3J5LlJvbGUuZ2V0QWxsKGZ1bmN0aW9uIChyb2xlcykge1xuICAgICAgICAkc2NvcGUucm9sZXMgPSByb2xlcztcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICB0YWdzOiBmdW5jdGlvbigpe1xuICAgICAgVGFnRmFjdG9yeS5UYWcuZ2V0QWxsKGZ1bmN0aW9uICh0YWdzKSB7XG4gICAgICAgICRzY29wZS50b3BpY1RhZ3MgPSB0YWdzO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNvbW1lbnRzOiBmdW5jdGlvbigpe1xuICAgICAgQ29tbWVudEZhY3RvcnkuQ29tbWVudC5nZXRBbGwoZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAgICRzY29wZS5jb21tZW50cyA9IGNvbW1lbnRzO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNoYXRzOiBmdW5jdGlvbigpIHtcbiAgICAgIENoYXRGYWN0b3J5LkNoYXQuZ2V0QWxsKGZ1bmN0aW9uKGNoYXRzKSB7XG4gICAgICAgICRzY29wZS5jaGF0cyA9IGNoYXRzO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGV2ZW50czogZnVuY3Rpb24oKSB7XG4gICAgICBFdmVudEZhY3RvcnkuRXZlbnQuZ2V0QWxsKGZ1bmN0aW9uKGV2ZW50cykge1xuICAgICAgICAkc2NvcGUuZXZlbnRzID0gZXZlbnRzO1xuICAgICAgICAkc2NvcGUuY3VycmVudEV2ZW50ID0gZXZlbnRzWzBdO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNlc3Npb25zOiBmdW5jdGlvbigpIHtcbiAgICAgIFNlc3Npb25GYWN0b3J5LlNlc3Npb24uZ2V0QWxsKGZ1bmN0aW9uKHNlc3Npb25zKSB7XG4gICAgICAgICRzY29wZS5zZXNzaW9ucyA9IHNlc3Npb25zO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGl0ZW1zOiBmdW5jdGlvbigpIHtcbiAgICAgIEl0ZW1GYWN0b3J5Lkl0ZW0uZ2V0QWxsKGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgICAgICRzY29wZS5pdGVtcyA9IGl0ZW1zO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGFsbDogZnVuY3Rpb24oKXtcbiAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgICBmYWN0b3JpZXNSZWFkeSA9IDA7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiVXBkYXRpbmchXCIpO1xuICAgICAgdGhpcy5tZSgpO1xuICAgICAgdGhpcy5tZW1iZXJzKCk7XG4gICAgICB0aGlzLmNvbXBhbmllcygpO1xuICAgICAgdGhpcy5zcGVha2VycygpO1xuICAgICAgdGhpcy50b3BpY3MoKTtcbiAgICAgIHRoaXMucm9sZXMoKTtcbiAgICAgIHRoaXMudGFncygpO1xuICAgICAgdGhpcy5jb21tZW50cygpO1xuICAgICAgdGhpcy5jaGF0cygpO1xuICAgICAgdGhpcy5ldmVudHMoKTtcbiAgICAgIHRoaXMuc2Vzc2lvbnMoKTtcbiAgICAgIHRoaXMuaXRlbXMoKTtcbiAgICB9XG5cbiAgfVxuXG4gICRyb290U2NvcGUudXBkYXRlLmFsbCgpO1xuXG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gY2FsbGJhY2soKSB7XG4gICAgaWYgKCsrZmFjdG9yaWVzUmVhZHkgPT0gMTIpIHtcbiAgICAgICRyb290U2NvcGUudXBkYXRlLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICRzY29wZS5yZWFkeSA9IHRydWU7XG5cbiAgICAgICRzY29wZS51cGRhdGUoKTtcblxuICAgICAgc2V0SW50ZXJ2YWwoJHNjb3BlLnVwZGF0ZSwgMTAwMDApO1xuXG4gICAgICAkcm9vdFNjb3BlLiRvbihcIiRsb2NhdGlvbkNoYW5nZVN0YXJ0XCIsIGZ1bmN0aW9uIChldmVudCwgbmV4dCwgY3VycmVudCkge1xuICAgICAgICBzZXRUaW1lb3V0KCRzY29wZS51cGRhdGUsIDUwMCk7XG4gICAgICAgICRzY29wZS5zZWFyY2gubmFtZSA9ICcnO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U0NPUEUgRlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgTm90aWZpY2F0aW9uRmFjdG9yeS5Ob3RpZmljYXRpb24uZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLnRhcmdldE5vdGlmaWNhdGlvbnMgPSBbXTtcbiAgICAgICRzY29wZS51bnJlYWROb3RpZmljYXRpb25zID0gW107XG4gICAgICAkc2NvcGUudGFyZ2V0SW5mby5udW1iZXIgPSAwO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChyZXNwb25zZVtpXS50YXJnZXRzLmluZGV4T2YoJHNjb3BlLm1lLmlkKSAhPSAtMSkge1xuICAgICAgICAgIGlmIChyZXNwb25zZVtpXS51bnJlYWQuaW5kZXhPZigkc2NvcGUubWUuaWQpICE9IC0xKSB7XG4gICAgICAgICAgICAkc2NvcGUudGFyZ2V0SW5mby5udW1iZXIrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgJHNjb3BlLnRhcmdldE5vdGlmaWNhdGlvbnMudW5zaGlmdChyZXNwb25zZVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3BvbnNlW2ldLnVucmVhZC5pbmRleE9mKCRzY29wZS5tZS5pZCkgIT0gLTEpIHtcbiAgICAgICAgICAkc2NvcGUudW5yZWFkTm90aWZpY2F0aW9ucy51bnNoaWZ0KHJlc3BvbnNlW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoJHNjb3BlLnRhcmdldEluZm8ubnVtYmVyID09IDApIHtcbiAgICAgICAgJHNjb3BlLnRhcmdldEluZm8udGV4dCA9IFwiIE5vIE5vdGlmaWNhdGlvbnNcIjtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAkc2NvcGUudGFyZ2V0SW5mby50ZXh0ID0gXCIgXCIgKyAkc2NvcGUudGFyZ2V0SW5mby5udW1iZXIgKyBcIiBOb3RpZmljYXRpb25cIiArICgkc2NvcGUudGFyZ2V0SW5mby5udW1iZXIgPiAxID8gXCJzXCIgOiBcIlwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIGRhdGUpIC8gMTAwMCk7XG5cbiAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XG4gICAgaWYoc2Vjb25kcyA8IDApe1xuICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHNlY29uZHMpO1xuICAgICAgc3VmZml4ID0gJ3RvIGdvJztcbiAgICB9XG5cbiAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XG5cbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbW9udGhzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtaW51dGVzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XG4gIH07XG5cbiAgJHNjb3BlLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAodGltZSkge1xuICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lKS50b1VUQ1N0cmluZygpO1xuICB9O1xuXG4gICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICB2YXIgbWVtYmVyID0gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xuICAgIH0pO1xuXG4gICAgaWYobWVtYmVyLmxlbmd0aD4wKSB7XG4gICAgICByZXR1cm4gbWVtYmVyWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBcIk5vIG9uZVwiLFxuICAgICAgICBmYWNlYm9vazogXCIxMDAwMDA0NTYzMzU5NzJcIlxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuZ2V0U3BlYWtlciA9IGZ1bmN0aW9uIChzcGVha2VySWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLnNwZWFrZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBzcGVha2VySWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmdldENvbXBhbnkgPSBmdW5jdGlvbiAoY29tcGFueUlkKSB7XG4gICAgcmV0dXJuICRzY29wZS5jb21wYW5pZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09IGNvbXBhbnlJZDtcbiAgICB9KVswXTtcbiAgfTtcblxuICAkc2NvcGUuZ2V0VG9waWMgPSBmdW5jdGlvbiAodG9waWNJZCkge1xuICAgIHJldHVybiAkc2NvcGUudG9waWNzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5faWQgPT0gdG9waWNJZDtcbiAgICB9KVswXTtcbiAgfTtcblxuICAkc2NvcGUuZ2V0Tm90aWZpY2F0aW9ucyA9IGZ1bmN0aW9uICh0aHJlYWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLm5vdGlmaWNhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLnRocmVhZCA9PSB0aHJlYWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmdldFVucmVhZE5vdGlmaWNhdGlvbnMgPSBmdW5jdGlvbiAodGhyZWFkKSB7XG4gICAgcmV0dXJuICRzY29wZS51bnJlYWROb3RpZmljYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby50aHJlYWQgPT0gdGhyZWFkO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gICRzY29wZS5nZXRFdmVudCA9IGZ1bmN0aW9uIChldmVudElkKSB7XG4gICAgcmV0dXJuICRzY29wZS5ldmVudHMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09IGV2ZW50SWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmdldFNlc3Npb24gPSBmdW5jdGlvbiAoc2Vzc2lvbklkKSB7XG4gICAgcmV0dXJuICRzY29wZS5zZXNzaW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uX2lkID09IHNlc3Npb25JZDtcbiAgICB9KVswXTtcbiAgfTtcblxuICAkc2NvcGUuZ2V0SXRlbSA9IGZ1bmN0aW9uIChpdGVtSWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLml0ZW1zLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBpdGVtSWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmdldFBhcnRpY2lwYXRpb24gPSBmdW5jdGlvbiAodGhpbmcsIGV2ZW50SWQpIHtcbiAgICByZXR1cm4gdGhpbmcucGFydGljaXBhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmV2ZW50ID09IGV2ZW50SWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLnNob3cgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuZGlzcGxheSA9ICgkc2NvcGUuc2VhcmNoLm5hbWUgPyB0cnVlIDogZmFsc2UpO1xuICB9O1xuXG4gICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLmRpc3BsYXkgPSBmYWxzZTtcbiAgfTtcblxuICAkc2NvcGUuY29udmVydFVSTHMgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIHVybEV4cCA9IC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWc7XG5cbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIik7XG4gIH1cblxuICAkc2NvcGUuY29udmVydE5ld0xpbmVzVG9IdG1sID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicrdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKSsnPC9kaXY+JztcbiAgfVxuXG4gICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgcmV0dXJuICc8ZGl2IGRhdGEtbWFya2Rvd24+JyArIHRleHQgKyAnPC9kaXY+JztcbiAgfVxuXG4gICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgJGh0dHAuZ2V0KHVybF9wcmVmaXggKyAnL2FwaS9sb2dvdXQnKS5cbiAgICAgIHN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oJy8nKTtcbiAgICAgIH0pLlxuICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkVSUk9SXCIsIGRhdGEpO1xuICAgICAgICAkd2luZG93LmxvY2F0aW9uLmFzc2lnbignLycpO1xuICAgICAgfSk7XG4gIH1cblxuXG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTWVldGluZ0VtYmVkQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCBNZWV0aW5nRmFjdG9yeSkge1xuXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUlOSVRJQUxJWkFUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgIE1lZXRpbmdGYWN0b3J5LmdldCh7aWQ6ICRzY29wZS5tZWV0aW5nSWR9LCBmdW5jdGlvbiAobWVldGluZykge1xuICAgICAgJHNjb3BlLm1lZXRpbmcgPSBtZWV0aW5nO1xuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgIH0pO1xuXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgcmV0dXJuIG8uaWQgPT09IG1lbWJlcklkO1xuICAgICAgfSlbMF07XG4gICAgfTtcbiAgfVxuXG59KTtcbiIsInJlcXVpcmUoXCIuL2VtYmVkXCIpO1xucmVxdWlyZShcIi4vbGlzdFwiKTtcbnJlcXVpcmUoXCIuL21lZXRpbmdcIik7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoJ01lZXRpbmdzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRsb2NhdGlvbiwgTWVldGluZ0ZhY3RvcnkpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICBpbml0KCk7XG5cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCRzY29wZS5sb2FkaW5nKSB7XG4gICAgICAgICAgaW5pdCgpO1xuICAgICAgICB9XG4gICAgICB9LCAxMDAwKTtcblxuICAgICAgTWVldGluZ0ZhY3RvcnkuZ2V0QWxsKGZ1bmN0aW9uIChtZWV0aW5ncykge1xuICAgICAgICAkc2NvcGUubWVldGluZ3MgPSBtZWV0aW5ncztcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS5tZWV0aW5ncy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUubWVldGluZ3NbaV0uZmFjZWJvb2sgPSAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICAgICAgcmV0dXJuICRzY29wZS5tZWV0aW5nc1tpXS5hdXRob3IgPT0gby5pZDtcbiAgICAgICAgICB9KVswXS5mYWNlYm9vaztcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgJHNjb3BlLnRpbWUgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgICByZXR1cm4gJHNjb3BlLnRpbWVTaW5jZShuZXcgRGF0ZShkYXRlKSk7XG4gICAgfTtcblxuICAgICRzY29wZS5jcmVhdGVNZWV0aW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG5cbiAgICAgIE1lZXRpbmdGYWN0b3J5LmNyZWF0ZSh7XG4gICAgICAgIGF1dGhvcjogJHNjb3BlLm1lLmlkLFxuICAgICAgICB0aXRsZTogZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoXCJwdC1QVFwiKSArIFwiIC0gTWVldGluZ1wiLFxuICAgICAgICBkYXRlOiBkYXRlXG4gICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL21lZXRpbmcvXCIgKyByZXNwb25zZS5pZCArIFwiL2VkaXRcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJNZWV0aW5nQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgJHRpbWVvdXQsIE1lZXRpbmdGYWN0b3J5LCBUb3BpY0ZhY3RvcnksIFRhZ0ZhY3RvcnkpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAkc2NvcGUua2luZHMgPSBbXCJJbmZvXCIsIFwiVG8gZG9cIiwgXCJEZWNpc2lvblwiLCBcIklkZWFcIl07XG5cbiAgICBNZWV0aW5nRmFjdG9yeS5nZXQoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbiAobWVldGluZykge1xuICAgICAgJHNjb3BlLm1lZXRpbmcgPSBtZWV0aW5nO1xuXG4gICAgICBTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoID0gZnVuY3Rpb24gKHN1ZmZpeCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbmRleE9mKHN1ZmZpeCwgdGhpcy5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKSAhPT0gLTE7XG4gICAgICB9O1xuXG4gICAgICBpZiAoJGxvY2F0aW9uLnBhdGgoKS5lbmRzV2l0aChcIi90ZXh0XCIpKSB7XG4gICAgICAgIHZhciB0ZXh0ID0gbWVldGluZy50aXRsZSArIFwiXFxuXFxuXCIgKyAobWVldGluZy5kZXNjcmlwdGlvbiA/IG1lZXRpbmcuZGVzY3JpcHRpb24gKyBcIlxcblxcblwiIDogXCJcIik7XG5cbiAgICAgICAgaWYgKG1lZXRpbmcuYXR0ZW5kYW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGV4dCArPSBcIkF0dGVuZGFudHM6XFxuXCI7XG5cbiAgICAgICAgICBtZWV0aW5nLmF0dGVuZGFudHMuc29ydCgpO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZWV0aW5nLmF0dGVuZGFudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRleHQgKz0gJHNjb3BlLmdldE1lbWJlcihtZWV0aW5nLmF0dGVuZGFudHNbaV0pLm5hbWUgKyAoaSsxIDwgbWVldGluZy5hdHRlbmRhbnRzLmxlbmd0aCA/IFwiLCBcIiA6IFwiXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0ZXh0ICs9IFwiXFxuXFxuXCI7XG4gICAgICAgIH1cblxuICAgICAgICBUYWdGYWN0b3J5LlRhZy5nZXRBbGwoZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIHZhciB0YWdzID0gW107XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGFncy5wdXNoKHJlc3VsdFtpXSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGFncy5zb3J0KGZ1bmN0aW9uIChvMSwgbzIpIHtcbiAgICAgICAgICAgIHJldHVybiBvMS5uYW1lLmxvY2FsZUNvbXBhcmUobzIubmFtZSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0b3BpY3MgPSBtZWV0aW5nLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG8udGFncy5pbmRleE9mKHRhZ3NbaV0uaWQpICE9IC0xO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh0b3BpY3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0ZXh0ICs9IHRhZ3NbaV0ubmFtZSArIFwiOlxcblwiO1xuXG4gICAgICAgICAgICB0b3BpY3Muc29ydChmdW5jdGlvbiAobzEsIG8yKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvMS5wb3N0ZWQudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlKG8yLnBvc3RlZC50b1N0cmluZygpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRvcGljcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICB0ZXh0ICs9IFwiICAgIC0gXCIgKyB0b3BpY3Nbal0udGV4dC5yZXBsYWNlKC9cXG4vZywgXCJcXG4gICAgICBcIikgKyBcIlxcblwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0ZXh0ICs9IFwiXFxuXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJHNjb3BlLm51bWJlck9mTGluZXMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG4gPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmICh0ZXh0W2ldID09PSBcIlxcblwiKSB7XG4gICAgICAgICAgICAgICAgbisrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbiArIDI7XG4gICAgICAgICAgfSgpKTtcblxuICAgICAgICAgICRzY29wZS50ZXh0ID0gdGV4dDtcblxuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgJHNjb3BlLnRvZ2dsZUF0dGVuZGFudCA9IGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICAgIHZhciBpbmRleCA9ICRzY29wZS5tZWV0aW5nLmF0dGVuZGFudHMuaW5kZXhPZihtZW1iZXIpO1xuXG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICRzY29wZS5tZWV0aW5nLmF0dGVuZGFudHMucHVzaChtZW1iZXIpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICRzY29wZS5tZWV0aW5nLmF0dGVuZGFudHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLnRvZ2dsZUF0dGVuZGFudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS5tZW1iZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAkc2NvcGUudG9nZ2xlQXR0ZW5kYW50KCRzY29wZS5tZW1iZXJzW2ldLmlkKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLmdldEF0dGVuZGFudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJHNjb3BlLm1lZXRpbmcuYXR0ZW5kYW50cy5tYXAoZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgcmV0dXJuICRzY29wZS5nZXRNZW1iZXIobyk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNyZWF0ZVRvcGljID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICAgIHZhciB0b3BpYyA9IHtcbiAgICAgICAgZWRpdGluZzogdHJ1ZSxcbiAgICAgICAgYXV0aG9yOiAkc2NvcGUubWUuaWQsXG4gICAgICAgIHRleHQ6IFwiXCIsXG4gICAgICAgIHRhcmdldHM6IFtdLFxuICAgICAgICBraW5kOiBraW5kLFxuICAgICAgICBjbG9zZWQ6IGZhbHNlLFxuICAgICAgICByZXN1bHQ6IFwiXCIsXG4gICAgICAgIHBvbGw6IHtcbiAgICAgICAgICBraW5kOiBcInRleHRcIixcbiAgICAgICAgICBvcHRpb25zOiBbXVxuICAgICAgICB9LFxuICAgICAgICBkdWVkYXRlOiBudWxsLFxuICAgICAgICBtZWV0aW5nczogWyRzY29wZS5tZWV0aW5nLl9pZF0sXG4gICAgICAgIHJvb3Q6IG51bGwsXG4gICAgICAgIHRhZ3M6IFtdLFxuICAgICAgICBwb3N0ZWQ6IG5ldyBEYXRlKClcbiAgICAgIH07XG5cbiAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5jcmVhdGUodG9waWMsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgIHRvcGljLl9pZCA9IHJlc3BvbnNlLmlkO1xuICAgICAgICAgICRzY29wZS5tZWV0aW5nLnRvcGljcy5wdXNoKHRvcGljKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5hZGRUb3BpYyA9IGZ1bmN0aW9uICh0b3BpY0lkKSB7XG4gICAgICAkc2NvcGUuZGlzcGxheSA9IGZhbHNlO1xuXG4gICAgICB2YXIgdG9waWMgPSAkc2NvcGUudG9waWNzLmZpbHRlcihmdW5jdGlvbiAobykge1xuICAgICAgICByZXR1cm4gby5faWQgPT09IHRvcGljSWQ7XG4gICAgICB9KVswXTtcblxuICAgICAgJHNjb3BlLm1lZXRpbmcudG9waWNzLnB1c2godG9waWMpO1xuXG4gICAgICB0b3BpYy5tZWV0aW5ncy5wdXNoKCRzY29wZS5tZWV0aW5nLl9pZCk7XG4gICAgICBUb3BpY0ZhY3RvcnkuVG9waWMudXBkYXRlKHtpZDogdG9waWMuX2lkfSwgdG9waWMpO1xuICAgIH07XG5cbiAgICAkc2NvcGUucmVtb3ZlVG9waWMgPSBmdW5jdGlvbiAodG9waWMpIHtcbiAgICAgICRzY29wZS5tZWV0aW5nLnRvcGljcy5zcGxpY2UoJHNjb3BlLm1lZXRpbmcudG9waWNzLmluZGV4T2YodG9waWMpLCAxKTtcblxuICAgICAgdG9waWMubWVldGluZ3Muc3BsaWNlKHRvcGljLm1lZXRpbmdzLmluZGV4T2YoJHNjb3BlLm1lZXRpbmcuX2lkKSwgMSk7XG4gICAgICBUb3BpY0ZhY3RvcnkuVG9waWMudXBkYXRlKHtpZDogdG9waWMuX2lkfSwgdG9waWMpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc2F2ZU1lZXRpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuc3VjY2VzcyA9IFwiXCI7XG4gICAgICAkc2NvcGUuZXJyb3IgICA9IFwiXCI7XG5cbiAgICAgIGlmICghJHNjb3BlLm1lZXRpbmcudGl0bGUpe1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIlBsZWFzZSBlbnRlciBhIHRpdGxlLlwiO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIE1lZXRpbmdGYWN0b3J5LnVwZGF0ZSh7aWQ6ICRzY29wZS5tZWV0aW5nLl9pZH0sICRzY29wZS5tZWV0aW5nLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAkc2NvcGUuc3VjY2VzcyA9IFwiTWVldGluZyBzYXZlZC5cIjtcblxuICAgICAgICAgIGlmICgkc2NvcGUudGltZW91dCkge1xuICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKCRzY29wZS50aW1lb3V0KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkc2NvcGUudGltZW91dCA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzY29wZS5zdWNjZXNzID0gXCJcIjtcbiAgICAgICAgICB9LCAzMDAwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIlRoZXJlIHdhcyBhbiBlcnJvci4gUGxlYXNlIGNvbnRhY3QgdGhlIERldiBUZWFtIGFuZCBnaXZlIHRoZW0gdGhlIGRldGFpbHMgYWJvdXQgdGhlIGVycm9yLlwiO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmRlbGV0ZU1lZXRpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBtZWV0aW5nP1wiKSkge1xuICAgICAgICBNZWV0aW5nRmFjdG9yeS5kZWxldGUoe2lkOiAkc2NvcGUubWVldGluZy5faWR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9tZWV0aW5ncy9cIik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuZGlzcGxheSA9ICgkc2NvcGUuc2VhcmNoVG9waWMgPyB0cnVlIDogZmFsc2UpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuYWxyZWFkeUluTWVldGluZ0ZpbHRlciA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubWVldGluZy50b3BpY3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKCRzY29wZS5tZWV0aW5nLnRvcGljc1tpXS5faWQgPT09IHRvcGljLl9pZCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNyZWF0ZU1lbWJlckNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCBNZW1iZXJGYWN0b3J5KSB7XG5cbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcblxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG5cbiAgICAkc2NvcGUuZm9ybURhdGEgPSB7fTtcbiAgICAkc2NvcGUuZm9ybURhdGEucm9sZXMgPSBbXTtcbiAgICAkc2NvcGUuZm9ybURhdGEucGhvbmVzID0gW107XG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbWVtYmVyRGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICAgIE1lbWJlckZhY3RvcnkuTWVtYmVyLmNyZWF0ZShtZW1iZXJEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlKVxuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9tZW1iZXIvXCIgKyByZXNwb25zZS5pZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIk1lbWJlckVtYmVkQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlKSB7XG5cbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcblxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG5cbiAgfVxuXG59KTtcbiIsInJlcXVpcmUoJy4vbWVtYmVyLmpzJyk7XG5yZXF1aXJlKCcuL2xpc3QuanMnKTtcbnJlcXVpcmUoJy4vY3JlYXRlLmpzJyk7XG5yZXF1aXJlKCcuL2VtYmVkLmpzJyk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJNZW1iZXJzQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCBNZW1iZXJGYWN0b3J5KSB7XG4gIFxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcbiAgICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUubWVtYmVyUHJlZGljYXRlID0gXCJuYW1lXCI7XG4gICAgICAkc2NvcGUucmV2ZXJzZSA9IGZhbHNlO1xuICAgICAgJHNjb3BlLm1lbWJlcnMgPSByZXNwb25zZTtcbiAgICB9KTtcbiAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIk1lbWJlckNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgJGxvY2F0aW9uLCBNZW1iZXJGYWN0b3J5KSB7XG5cbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcblxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG5cbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICBpZiAoJHJvdXRlUGFyYW1zLmlkID09PSBcIm1lXCIpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKFwiL21lbWJlci9cIiArICRzY29wZS5tZS5pZCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJHNjb3BlLm1lbWJlciA9ICRzY29wZS5mb3JtRGF0YSA9ICRzY29wZS5nZXRNZW1iZXIoJHJvdXRlUGFyYW1zLmlkKTtcblxuICAgIE1lbWJlckZhY3RvcnkuTWVtYmVyLmdldCh7aWQ6JHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24ocmVzdWx0KSB7IFxuICAgICAgaWYoIXJlc3VsdC5lcnJvcikge1xuICAgICAgICAkc2NvcGUubWVtYmVyID0gJHNjb3BlLmZvcm1EYXRhID0gcmVzdWx0O1xuICAgICAgICBnZXRNZW1iZXJTdHVmZigpO1xuICAgICAgfSBcbiAgICB9KTtcblxuICAgIGdldE1lbWJlclN0dWZmKCk7XG5cbiAgICBmdW5jdGlvbiBnZXRNZW1iZXJTdHVmZigpIHtcbiAgICAgIGlmKCRzY29wZS5jb21wYW5pZXMgJiYgJHNjb3BlLnNwZWFrZXJzICYmICRzY29wZS5jb21tZW50cyAmJiAkc2NvcGUuY29tcGFuaWVzLmxlbmd0aCA+IDAgJiYgJHNjb3BlLnNwZWFrZXJzLmxlbmd0aCA+IDAgJiYgJHNjb3BlLmNvbW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGdldE1lbWJlclN0dWZmLCAxMDAwKTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLm1lbWJlclN0dWZmID0ge307XG5cbiAgICAgICRzY29wZS5tZW1iZXJTdHVmZi5jb21wYW5pZXMgPSAkc2NvcGUuY29tcGFuaWVzLmZpbHRlcihmdW5jdGlvbihlKSB7XG4gICAgICAgIHJldHVybiBlLm1lbWJlciA9PSAkc2NvcGUubWVtYmVyLmlkO1xuICAgICAgfSlcblxuICAgICAgJHNjb3BlLm1lbWJlclN0dWZmLnNwZWFrZXJzID0gJHNjb3BlLnNwZWFrZXJzLmZpbHRlcihmdW5jdGlvbihlKSB7XG4gICAgICAgIHJldHVybiBlLm1lbWJlciA9PSAkc2NvcGUubWVtYmVyLmlkO1xuICAgICAgfSlcblxuICAgICAgJHNjb3BlLm1lbWJlclN0dWZmLmNvbW1lbnRzID0gJHNjb3BlLmNvbW1lbnRzLmZpbHRlcihmdW5jdGlvbihlKSB7XG4gICAgICAgIHJldHVybiBlLm1lbWJlciA9PSAkc2NvcGUubWVtYmVyLmlkO1xuICAgICAgfSlcbiAgICB9XG5cblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBtZW1iZXJEYXRhID0gdGhpcy5mb3JtRGF0YTtcblxuICAgICAgTWVtYmVyRmFjdG9yeS5NZW1iZXIudXBkYXRlKHsgaWQ6bWVtYmVyRGF0YS5pZCB9LCBtZW1iZXJEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2Uuc3VjY2VzcztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdTcGVha2VyRW1haWxDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgJGxvY2F0aW9uLCBFbWFpbEZhY3RvcnkpIHtcblxuICAgICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG5cbiAgICAgICRzY29wZS5lbWFpbCA9ICRsb2NhdGlvbi5zZWFyY2goKS5lbWFpbDtcbiAgICAgICRzY29wZS5zcGVha2VySWQgPSAkcm91dGVQYXJhbXMuaWQ7XG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAgICRzY29wZS5tZXNzYWdlID0gbnVsbDtcblxuICAgICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgICAgICRzY29wZS5tZXNzYWdlID0gbnVsbDtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKFwic2VuZCBlbWFpbCB0byBcIiwgJHNjb3BlLmVtYWlsLCBcIiBmcm9tIFwiLCAkc2NvcGUuc3BlYWtlcklkKTtcblxuICAgICAgICBFbWFpbEZhY3RvcnkuU3BlYWtlci5zZW5kKHsgaWQ6ICRzY29wZS5zcGVha2VySWQgfSwgeyBlbWFpbDogJHNjb3BlLmVtYWlsIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuIFxudGhlVG9vbENvbnRyb2xsZXJcbiAgLmNvbnRyb2xsZXIoJ0NyZWF0ZVNwZWFrZXJDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uLCBTcGVha2VyRmFjdG9yeSkge1xuICAgIFxuICAgICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XG5cbiAgICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNwZWFrZXJEYXRhID0gdGhpcy5mb3JtRGF0YTtcblxuICAgICAgICBzcGVha2VyRGF0YS5zdGF0dXMgPSAnU3VnZ2VzdGlvbic7XG5cbiAgICAgICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5jcmVhdGUoc3BlYWtlckRhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG5cbiAgICAgICAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKGZ1bmN0aW9uIChzcGVha2Vycykge1xuICAgICAgICAgICAgICAkc2NvcGUuc3BlYWtlcnMgPSBzcGVha2VycztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9zcGVha2VyL1wiICsgcmVzcG9uc2UuaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKCdTcGVha2VyRW1iZWRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSkge1xuXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgaWYoJHNjb3BlLmV2ZW50KSB7XG4gICAgICAkc2NvcGUucGFydGljaXBhdGlvbiA9ICRzY29wZS5zcGVha2VyLnBhcnRpY2lwYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLmV2ZW50ID09ICRzY29wZS5ldmVudC5pZDtcbiAgICAgIH0pWzBdO1xuICAgIH1cblxuICAgICRzY29wZS5nZXRVbnJlYWROb3RpZmljYXRpb25zID0gZnVuY3Rpb24gKHRocmVhZCkge1xuICAgICAgdmFyIG5vdGlmaWNhdGlvbnMgPSAkc2NvcGUubm90aWZpY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICByZXR1cm4gby50aHJlYWQgPT0gdGhyZWFkO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbm90aWZpY2F0aW9ucztcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNwZWFrZXIudW5yZWFkID0gJHNjb3BlLmdldFVucmVhZE5vdGlmaWNhdGlvbnMoJ3NwZWFrZXItJyArICRzY29wZS5zcGVha2VyLmlkKS5sZW5ndGggPiAwO1xuXG4gICAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgICAgdmFyIG1lbWJlciA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xuICAgICAgfSk7XG5cbiAgICAgIGlmKG1lbWJlci5sZW5ndGg+MCkge1xuICAgICAgICByZXR1cm4gbWVtYmVyWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiAnTm8gb25lJyxcbiAgICAgICAgICBmYWNlYm9vazogJzEwMDAwMDQ1NjMzNTk3MidcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIGRhdGUpIC8gMTAwMCk7XG5cbiAgICAgIHZhciBzdWZmaXggPSAnYWdvJztcbiAgICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHNlY29uZHMpO1xuICAgICAgICBzdWZmaXggPSAndG8gZ28nO1xuICAgICAgfVxuXG4gICAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XG5cbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyAnIHllYXJzICcgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xuICAgICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArICcgbW9udGhzICcgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyAnIGRheXMgJyArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgJyBob3VycyAnICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgJyBtaW51dGVzICcgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArICcgc2Vjb25kcyAnICsgc3VmZml4O1xuICAgIH07XG4gIH1cblxufSk7XG4iLCJyZXF1aXJlKCcuL3NwZWFrZXIuanMnKTtcbnJlcXVpcmUoJy4vbGlzdC5qcycpO1xucmVxdWlyZSgnLi9jcmVhdGUuanMnKTtcbnJlcXVpcmUoJy4vY29uZmlybS5qcycpO1xucmVxdWlyZSgnLi9lbWJlZC5qcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RhdHVzZXMgPSByZXF1aXJlKCcuLi8uLi8uLi8uLi8uLi9vcHRpb25zJykuc3RhdHVzZXMuc3BlYWtlcjtcblxudGhlVG9vbENvbnRyb2xsZXJcbiAgLmNvbnRyb2xsZXIoJ1NwZWFrZXJzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkc2NlLCBTcGVha2VyRmFjdG9yeSkge1xuXG4gICAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgICAgJHNjb3BlLmxpbWl0ID0gMjA7XG5cbiAgICAgIGNvbnNvbGUubG9nKHN0YXR1c2VzKTtcblxuICAgICAgJHNjb3BlLnN0YXR1c2VzID0gc3RhdHVzZXM7XG4gICAgICBcbiAgICAgICRzY29wZS5zcGVha2VyUHJlZGljYXRlID0gJ3VwZGF0ZWQnO1xuICAgICAgJHNjb3BlLnJldmVyc2UgPSAndHJ1ZSc7XG4gICAgICAkc2NvcGUuZmlsdGVyZWRTcGVha2VycyA9IFtdO1xuICAgICAgJHNjb3BlLnNlYXJjaFNwZWFrZXJzID0ge3VuYXNzaWduZWQ6IHRydWUsIHVuYXNzaWduZWRPbmx5OiBmYWxzZX07XG4gICAgICAkc2NvcGUudW5yZWFkRmlyc3QgPSB0cnVlO1xuXG4gICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmdldEFsbChmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUuc3BlYWtlcnMgPSByZXNwb25zZTtcbiAgICAgICAgLy8kc2NvcGUuZmlsdGVyZWRTcGVha2VycyA9ICRzY29wZS5zcGVha2VycztcbiAgICAgIH0pO1xuXG4gICAgICAkc2NvcGUuc2Nyb2xsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkc2NvcGUubGltaXQgPD0gJHNjb3BlLnNwZWFrZXJzLmxlbmd0aClcbiAgICAgICAgICAkc2NvcGUubGltaXQgKz0gMTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgICAgIHZhciByb2xlcyA9ICRzY29wZS5tZS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZihyb2xlcy5sZW5ndGggPT09IDAgJiYgbWVtYmVyLmlkICE9ICRzY29wZS5tZS5pZCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLmFkZFNwZWFrZXIgPSBmdW5jdGlvbihtZW1iZXIsIG5ld1NwZWFrZXIpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhuZXdTcGVha2VyKTtcbiAgICAgICAgdmFyIHNwZWFrZXJEYXRhID0gbmV3U3BlYWtlcjtcblxuICAgICAgICBpZihuZXdTcGVha2VyLmlkKSB7XG4gICAgICAgICAgdmFyIHBhcnRpY2lwYXRpb24gPSAkc2NvcGUuZ2V0UGFydGljaXBhdGlvbihzcGVha2VyRGF0YSwgJHNjb3BlLmN1cnJlbnRFdmVudC5pZCk7XG4gICAgICAgICAgaWYocGFydGljaXBhdGlvbikge1xuICAgICAgICAgICAgcGFydGljaXBhdGlvbi5tZW1iZXIgPSBtZW1iZXIuaWQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNwZWFrZXJEYXRhLnBhcnRpY2lwYXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBldmVudDogJHNjb3BlLmN1cnJlbnRFdmVudC5pZCxcbiAgICAgICAgICAgICAgc3RhdHVzOiAnU2VsZWN0ZWQnLFxuICAgICAgICAgICAgICBtZW1iZXI6IG1lbWJlci5pZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIudXBkYXRlKHsgaWQ6IHNwZWFrZXJEYXRhLmlkIH0sIHsgcGFydGljaXBhdGlvbnM6IHNwZWFrZXJEYXRhLnBhcnRpY2lwYXRpb25zIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLnN1Y2Nlc3M7XG5cbiAgICAgICAgICAgICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXRBbGwoZnVuY3Rpb24gKHNwZWFrZXJzKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnNwZWFrZXJzID0gc3BlYWtlcnM7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwZWFrZXJEYXRhLnBhcnRpY2lwYXRpb25zID0gW3tcbiAgICAgICAgICAgIGV2ZW50OiAkc2NvcGUuY3VycmVudEV2ZW50LmlkLFxuICAgICAgICAgICAgc3RhdHVzOiAnU2VsZWN0ZWQnLFxuICAgICAgICAgICAgbWVtYmVyOiBtZW1iZXIuaWRcbiAgICAgICAgICB9XTtcblxuICAgICAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuY3JlYXRlKHNwZWFrZXJEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG5cbiAgICAgICAgICAgICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXRBbGwoZnVuY3Rpb24gKHNwZWFrZXJzKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnNwZWFrZXJzID0gc3BlYWtlcnM7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvLyAkc2NvcGUuJHdhdGNoKFsnY3VycmVudEV2ZW50JywgJ3NlYXJjaFN0YXR1cyddLCBmdW5jdGlvbihuZXdWYWx1ZXMsIG9sZFZhbHVlcywgc2NvcGUpe1xuICAgICAgLy8gICAvL2NvbnNvbGUubG9nKCdmaWx0ZXJpbmcgc3BlYWtlcnMgYnknLCRzY29wZS5zZWFyY2hTdGF0dXMsJHNjb3BlLmN1cnJlbnRFdmVudCk7XG4gICAgICAvLyAgIGlmKCRzY29wZS5zcGVha2Vycyl7XG4gICAgICAvLyAgICAgJHNjb3BlLmZpbHRlcmVkU3BlYWtlcnMgPSAkc2NvcGUuc3BlYWtlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIC8vICAgICAgIHJldHVybiBvLnBhcnRpY2lwYXRpb25zLmZpbHRlcihmdW5jdGlvbihwKSB7XG4gICAgICAvLyAgICAgICAgIGlmKCRzY29wZS5zZWFyY2hTdGF0dXMgJiYgJHNjb3BlLnNlYXJjaFN0YXR1cyAhPT0gJycpIHtcbiAgICAgIC8vICAgICAgICAgICByZXR1cm4gcC5ldmVudCA9PT0gJHNjb3BlLmN1cnJlbnRFdmVudC5pZCAmJiBwLnN0YXR1cyA9PT0gJHNjb3BlLnNlYXJjaFN0YXR1cztcbiAgICAgIC8vICAgICAgICAgfSBlbHNlIHtcbiAgICAgIC8vICAgICAgICAgICByZXR1cm4gcC5ldmVudCA9PT0gJHNjb3BlLmN1cnJlbnRFdmVudC5pZDtcbiAgICAgIC8vICAgICAgICAgfVxuICAgICAgLy8gICAgICAgfSk7XG4gICAgICAvLyAgICAgfSk7XG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH0pO1xuICAgIH1cbiAgfSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXJcbiAgLmNvbnRyb2xsZXIoJ1NwZWFrZXJDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGxvY2F0aW9uLCAkd2luZG93LCAkcm91dGVQYXJhbXMsICRzY2UsIFNwZWFrZXJGYWN0b3J5LCBNZW1iZXJGYWN0b3J5LCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XG4gICAgXG4gICAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgICAgJHNjb3BlLmNvbW11bmljYXRpb25FdmVudCA9ICRzY29wZS5jdXJyZW50RXZlbnQ7XG5cbiAgICAgICRzY29wZS5zZXRDb21tdW5pY2F0aW9uRXZlbnQgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbkV2ZW50ID0gZXZlbnQ7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS50cnVzdFNyYyA9IGZ1bmN0aW9uKHNyYykge1xuICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoc3JjKycjcGFnZS1ib2R5Jyk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuY29udmVydEVtYWlscyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgdmFyIG1haWxFeHAgPSAvW1xcd1xcLlxcLV0rXFxAKFtcXHdcXC1dK1xcLikrW1xcd117Miw0fSg/IVtePF0qPikvaWc7XG4gICAgICAgIHZhciB0d2l0dGVyRXhwID0gLyhefFteQFxcd10pQChcXHd7MSwxNX0pXFxiL2c7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UobWFpbEV4cCwnPGEgaHJlZj1cIm1haWx0bzokJlwiPiQmPC9hPicpLnJlcGxhY2UodHdpdHRlckV4cCwnJDE8YSBocmVmPVwiaHR0cDovL3R3aXR0ZXIuY29tLyQyXCIgdGFyZ2V0PVwiX2JsYW5rXCI+QCQyPC9hPicpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3BlYWtlckRhdGEgPSB0aGlzLmZvcm1EYXRhO1xuXG4gICAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIudXBkYXRlKHsgaWQ6c3BlYWtlckRhdGEuaWQgfSwgc3BlYWtlckRhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLnN1Y2Nlc3M7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnc3BlYWtlci8nK3NwZWFrZXJEYXRhLmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLmRlbGV0ZVNwZWFrZXIgPSBmdW5jdGlvbihzcGVha2VyKSB7XG4gICAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuZGVsZXRlKHsgaWQ6c3BlYWtlci5pZCB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnc3BlYWtlcnMvJyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLmNoZWNrUGVybWlzc2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgICAgcmV0dXJuIG8uaWQgPT0gJ2RldmVsb3BtZW50LXRlYW0nIHx8IG8uaWQgPT0gJ2Nvb3JkaW5hdGlvbic7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmKHJvbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnU2VsZWN0ZWQnLCdBcHByb3ZlZCcsJ0NvbnRhY3RlZCcsJ0luIENvbnZlcnNhdGlvbnMnLCdBY2NlcHRlZCcsJ1JlamVjdGVkJywnR2l2ZSBVcCddO1xuXG4gICAgICAkc2NvcGUuc3BlYWtlciA9ICRzY29wZS5mb3JtRGF0YSA9ICRzY29wZS5nZXRTcGVha2VyKCRyb3V0ZVBhcmFtcy5pZCk7XG5cbiAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuZ2V0KHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLnNwZWFrZXIgPSAkc2NvcGUuZm9ybURhdGEgPSByZXNwb25zZTtcblxuICAgICAgICBOb3RpZmljYXRpb25GYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24oZ2V0RGF0YSkge1xuICAgICAgICAgICRzY29wZS5zcGVha2VyTm90aWZpY2F0aW9ucyA9IGdldERhdGE7XG5cbiAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgd2luID0gJHdpbmRvdztcbiAgICAgICRzY29wZS4kd2F0Y2goJ3NwZWFrZXJGb3JtLiRkaXJ0eScsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGlmKHZhbHVlKSB7XG4gICAgICAgICAgd2luLm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAnWW91IGhhdmUgdW5zYXZlZCBjaGFuZ2VzJztcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgfSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIlN1YnNjcmlwdGlvbkNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgU3Vic2NyaXB0aW9uRmFjdG9yeSkge1xuXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgdmFyIHRocmVhZElkID0gJHNjb3BlLnRocmVhZC5zdWJzdHJpbmcoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiLVwiKSArIDEpO1xuICAgIHZhciB0aHJlYWRLaW5kID0gJHNjb3BlLnRocmVhZC5zcGxpdCgnLScpWzBdO1xuXG4gICAgdmFyIEZhY3Rvcnk7XG5cbiAgICBzd2l0Y2godGhyZWFkS2luZCkge1xuICAgICAgY2FzZSAnY29tcGFueSc6XG4gICAgICAgIEZhY3RvcnkgPSBTdWJzY3JpcHRpb25GYWN0b3J5LkNvbXBhbnk7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NwZWFrZXInOlxuICAgICAgICBGYWN0b3J5ID0gU3Vic2NyaXB0aW9uRmFjdG9yeS5TcGVha2VyO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0b3BpYyc6XG4gICAgICAgIEZhY3RvcnkgPSBTdWJzY3JpcHRpb25GYWN0b3J5LlRvcGljO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy9jb25zb2xlLmxvZygnVEhSRUFEJywgJHNjb3BlLnRocmVhZCwgdGhyZWFkS2luZCwgdGhyZWFkSWQpO1xuICAgIC8vY29uc29sZS5sb2coJ0ZBQ1RPUllZWScsIFN1YnNjcmlwdGlvbkZhY3RvcnkuQ29tcGFueSwgU3Vic2NyaXB0aW9uRmFjdG9yeS5TcGVha2VyLCBTdWJzY3JpcHRpb25GYWN0b3J5LlRvcGljLCBGYWN0b3J5KTtcblxuICAgICRzY29wZS5pc1N1YnNjcmliZWQgPSBmYWxzZTtcblxuICAgICRzY29wZS5nZXRTdGF0dXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBGYWN0b3J5LmdldCh7aWQ6IHRocmVhZElkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnU1RBVFVTJyxyZXNwb25zZS5zdWNjZXNzKVxuICAgICAgICBpZihyZXNwb25zZS5zdWNjZXNzID09ICdzdWJzY3JpYmVkJykge1xuICAgICAgICAgICRzY29wZS5pc1N1YnNjcmliZWQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5pc1N1YnNjcmliZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9O1xuXG4gICAgJHNjb3BlLnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vY29uc29sZS5sb2coJ0FEREQnLCB0aHJlYWRLaW5kLCB0aHJlYWRJZCk7XG4gICAgICBGYWN0b3J5LmFkZCh7aWQ6IHRocmVhZElkfSwge30sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5nZXRTdGF0dXMoKTtcbiAgICAgIH0pXG4gICAgfTtcblxuICAgICRzY29wZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vY29uc29sZS5sb2coJ0RFTEVURScsIHRocmVhZEtpbmQsIHRocmVhZElkKTtcbiAgICAgIEZhY3RvcnkucmVtb3ZlKHtpZDogdGhyZWFkSWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUuZ2V0U3RhdHVzKCk7XG4gICAgICB9KVxuICAgIH07XG5cbiAgICAkc2NvcGUuZ2V0U3RhdHVzKCk7XG4gIH1cbn0pO1xuIiwicmVxdWlyZSgnLi9lbWJlZCcpOyIsInJlcXVpcmUoJy4vbWFuYWdlcicpOyIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiVGFnTWFuYWdlckNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgVGFnRmFjdG9yeSkge1xuXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgJHNjb3BlLnRhZyA9IHt9O1xuXG4gICAgJHNjb3BlLmxpZ2h0Q29sb3JzID0gW1wiI2Y3YzZjN1wiLCBcIiNmYWQ4YzdcIiwgXCIjZmVmMmMwXCIsIFwiI2JmZTViZlwiLCBcIiNiZmRhZGNcIiwgXCIjYzdkZWY4XCIsIFwiI2JmZDRmMlwiLCBcIiNkNGM1ZjlcIl07XG4gICAgJHNjb3BlLmNvbG9ycyA9IFtcIiNlMTFkMjFcIiwgXCIjZWI2NDIwXCIsIFwiI2ZiY2EwNFwiLCBcIiMwMDk4MDBcIiwgXCIjMDA2Yjc1XCIsIFwiIzIwN2RlNVwiLCBcIiMwMDUyY2NcIiwgXCIjNTMxOWU3XCJdO1xuXG4gICAgJHNjb3BlLmNoYW5nZUNvbG9yID0gZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgICAkc2NvcGUudGFnLmNvbG9yID0gY29sb3I7XG4gICAgfTtcblxuICAgICRzY29wZS5jcmVhdGVUYWcgPSBmdW5jdGlvbiAodGFnKSB7XG4gICAgICBUYWdGYWN0b3J5LlRhZy5jcmVhdGUodGFnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAkc2NvcGUudGFncy5wdXNoKHJlc3BvbnNlLnRhZyk7XG4gICAgICAgICAgJHNjb3BlLnRhZyA9IHt9O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNhdmVUYWcgPSBmdW5jdGlvbiAodGFnKSB7XG4gICAgICBUYWdGYWN0b3J5LlRhZy51cGRhdGUoe2lkOiB0YWcuaWR9LCB0YWcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgIHRhZy5lZGl0aW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuZGVsZXRlVGFnID0gZnVuY3Rpb24gKHRhZykge1xuICAgICAgVGFnRmFjdG9yeS5UYWcuZGVsZXRlKHtpZDogdGFnLmlkfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgJHNjb3BlLnRhZ3Muc3BsaWNlKCRzY29wZS50YWdzLmluZGV4T2YodGFnKSwgMSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJUb3BpY0VtYmVkQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkbG9jYXRpb24sIFRvcGljRmFjdG9yeSwgTm90aWZpY2F0aW9uRmFjdG9yeSkge1xuXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUlOSVRJQUxJWkFUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICRzY29wZS5lcnJvciAgICAgICA9IFwiXCI7XG4gICAgJHNjb3BlLnNob3dUYXJnZXRzID0gZmFsc2U7XG5cbiAgICAkc2NvcGUucG9sbEtpbmRzID0gW1widGV4dFwiLCBcImltYWdlc1wiXTtcblxuICAgIGlmICgkc2NvcGUuY29tbWVudHMpIHtcbiAgICAgICRzY29wZS50b3BpYy5jb21tZW50cyA9ICRzY29wZS5jb21tZW50cy5maWx0ZXIoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmV0dXJuIGUudGhyZWFkID09IFwidG9waWMtXCIgKyAkc2NvcGUudG9waWMuX2lkO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2hvdygkc2NvcGUudG9waWMpO1xuXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUFVWEZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGZ1bmN0aW9uIHNob3codG9waWMpIHtcbiAgICAgIHRvcGljLnNob3cgPSB7XG4gICAgICAgIHRleHQgICAgIDogdHJ1ZSxcbiAgICAgICAgdGFyZ2V0cyAgOiB0cnVlLFxuICAgICAgICBwb2xsICAgICA6IGZhbHNlLFxuICAgICAgICBkdWVkYXRlICA6IGZhbHNlLFxuICAgICAgICBtZWV0aW5nICA6IHRydWUsXG4gICAgICAgIGNsb3NlZCAgIDogZmFsc2VcbiAgICAgIH07XG5cbiAgICAgIGlmICh0b3BpYy5raW5kID09PSBcIlRvIGRvXCIpIHtcbiAgICAgICAgdG9waWMuc2hvdy5kdWVkYXRlID0gdHJ1ZTtcbiAgICAgICAgdG9waWMuc2hvdy5jbG9zZWQgID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHRvcGljLmtpbmQgPT09IFwiRGVjaXNpb25cIikge1xuICAgICAgICB0b3BpYy5zaG93LmR1ZWRhdGUgPSB0cnVlO1xuICAgICAgICB0b3BpYy5zaG93LmNsb3NlZCAgPSB0cnVlO1xuICAgICAgICB0b3BpYy5zaG93LnBvbGwgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAodG9waWMpIHtcbiAgICAgIGlmICghJHNjb3BlLm1lLnJvbGVzKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChyb2xlcy5sZW5ndGggPT0gMCAmJiB0b3BpYy5hdXRob3IgIT0gJHNjb3BlLm1lLmlkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICRzY29wZS5kZWxldGVUb3BpYyA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgICAgaWYgKGNvbmZpcm0oXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgdG9waWM/XCIpKSB7XG4gICAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5kZWxldGUoe2lkOiB0b3BpYy5faWR9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdG9waWMuZGVsZXRlZCA9IHRydWU7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy90b3BpY3MnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS50b2dnbGVUYWcgPSBmdW5jdGlvbiAodGFnKSB7XG4gICAgICB2YXIgaW5kZXggPSAkc2NvcGUudG9waWMudGFncy5pbmRleE9mKHRhZyk7XG5cbiAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAkc2NvcGUudG9waWMudGFncy5wdXNoKHRhZyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgJHNjb3BlLnRvcGljLnRhZ3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLmdldFRhZ0ljb24gPSBmdW5jdGlvbiAodGFnKSB7XG4gICAgICByZXR1cm4gKCRzY29wZS50b3BpYy50YWdzLmluZGV4T2YodGFnLmlkKSAhPT0gLTEgPyBcImNoZWNrXCIgOiBcInRpbWVzXCIpOztcbiAgICB9O1xuXG4gICAgJHNjb3BlLnRvZ2dsZVRhcmdldCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgIHZhciBpbmRleCA9ICRzY29wZS50b3BpYy50YXJnZXRzLmluZGV4T2YodGFyZ2V0KTtcblxuICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICRzY29wZS50b3BpYy50YXJnZXRzLnB1c2godGFyZ2V0KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAkc2NvcGUudG9waWMudGFyZ2V0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUudG9nZ2xlQWxsVGFyZ2V0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLm1lbWJlcnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICRzY29wZS50b2dnbGVUYXJnZXQoJHNjb3BlLm1lbWJlcnNbaV0uaWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUudG9nZ2xlUm9sZVRhcmdldHMgPSBmdW5jdGlvbiAocm9sZUlkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS5tZW1iZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICBmb3IodmFyIG8gPSAwOyBvIDwgJHNjb3BlLm1lbWJlcnNbaV0ucm9sZXMubGVuZ3RoOyBvKyspIHtcbiAgICAgICAgICBpZiAoJHNjb3BlLm1lbWJlcnNbaV0ucm9sZXNbb10uaWQgPT0gcm9sZUlkKSB7XG4gICAgICAgICAgICAkc2NvcGUudG9nZ2xlVGFyZ2V0KCRzY29wZS5tZW1iZXJzW2ldLmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLnRvZ2dsZVRhcmdldHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuc2hvd1RhcmdldHMgPSAhJHNjb3BlLnNob3dUYXJnZXRzO1xuICAgIH07XG5cbiAgICAkc2NvcGUuZ2V0VGFyZ2V0Q29sb3IgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICAgIHJldHVybiAoJHNjb3BlLnRvcGljLnRhcmdldHMuaW5kZXhPZihtZW1iZXJJZCkgIT09IC0xID8gXCJibHVlXCIgOiBcIlwiKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmZvY3VzT3B0aW9uID0gZnVuY3Rpb24gKG9wdGlvbikge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUudG9waWMucG9sbC5vcHRpb25zLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAkc2NvcGUudG9waWMucG9sbC5vcHRpb25zW2ldLmVkaXRpbmcgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgb3B0aW9uLmVkaXRpbmcgPSB0cnVlO1xuICAgIH07XG5cbiAgICAkc2NvcGUuYWRkT3B0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9wdGlvbiA9IHtcbiAgICAgICAgb3B0aW9uVHlwZTogXCJJbmZvXCIsXG4gICAgICAgIHRhcmdldHM6IFtdXG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUudG9waWMucG9sbC5vcHRpb25zLnB1c2gob3B0aW9uKTtcblxuICAgICAgJHNjb3BlLmZvY3VzT3B0aW9uKG9wdGlvbik7XG4gICAgfTtcblxuICAgICRzY29wZS5yZW1vdmVPcHRpb24gPSBmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgICAkc2NvcGUudG9waWMucG9sbC5vcHRpb25zLnNwbGljZSgkc2NvcGUudG9waWMucG9sbC5vcHRpb25zLmluZGV4T2Yob3B0aW9uKSwgMSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zZWxlY3RPcHRpb24gPSBmdW5jdGlvbiAodG9waWMsIG9wdGlvbikge1xuICAgICAgdmFyIHVwZGF0ZWRUb3BpYyA9IHRvcGljO1xuXG4gICAgICBpZiAob3B0aW9uLnZvdGVzLmluZGV4T2YoJHNjb3BlLm1lLmlkKSAhPT0gLTEpIHtcbiAgICAgICAgdXBkYXRlZFRvcGljLnBvbGwub3B0aW9uc1t1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zLmluZGV4T2Yob3B0aW9uKV0udm90ZXMuc3BsaWNlKHVwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnNbdXBkYXRlZFRvcGljLnBvbGwub3B0aW9ucy5pbmRleE9mKG9wdGlvbildLnZvdGVzLmluZGV4T2YoJHNjb3BlLm1lLmlkKSwgMSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdXBkYXRlZFRvcGljLnBvbGwub3B0aW9uc1t1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zLmluZGV4T2Yob3B0aW9uKV0udm90ZXMucHVzaCgkc2NvcGUubWUuaWQpO1xuICAgICAgfVxuXG4gICAgICB1cGRhdGVkVG9waWMuX3ZvdGluZyA9IHRydWU7XG5cbiAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy51cGRhdGUoe2lkOiB1cGRhdGVkVG9waWMuX2lkfSwgdXBkYXRlZFRvcGljLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlRoZXJlIHdhcyBhbiBlcnJvci4gUGxlYXNlIGNvbnRhY3QgdGhlIERldiBUZWFtIGFuZCBnaXZlIHRoZW0gdGhlIGRldGFpbHMgYWJvdXQgdGhlIGVycm9yLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgLy8vL2NvbnNvbGUubG9nKHJlc3BvbnNlLnN1Y2Nlc3MpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAodG9waWMpIHtcbiAgICAgICRzY29wZS5lcnJvciA9IFwiXCI7XG5cbiAgICAgIC8vY29uc29sZS5sb2codG9waWMpO1xuXG4gICAgICBUb3BpY0ZhY3RvcnkuVG9waWMudXBkYXRlKHtpZDogdG9waWMuX2lkfSwgdG9waWMsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgIHRvcGljLmVkaXRpbmcgPSAhdG9waWMuZWRpdGluZztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIlRoZXJlIHdhcyBhbiBlcnJvci4gUGxlYXNlIGNvbnRhY3QgdGhlIERldiBUZWFtIGFuZCBnaXZlIHRoZW0gdGhlIGRldGFpbHMgYWJvdXQgdGhlIGVycm9yLlwiO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnJlYWQgPSBmdW5jdGlvbiAodG9waWMpIHtcbiAgICAgIGlmICghJHNjb3BlLm5vdGlmaWNhdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUubm90aWZpY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgcmV0dXJuIG8udGhyZWFkID09PSBcInRvcGljLVwiICsgdG9waWMuX2lkO1xuICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICAgIHZhciBpbmRleCA9IG5vdGlmaWNhdGlvbi51bnJlYWQuaW5kZXhPZigkc2NvcGUubWUuaWQpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgbm90aWZpY2F0aW9uLnVucmVhZC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIE5vdGlmaWNhdGlvbkZhY3RvcnkuTm90aWZpY2F0aW9uLnVwZGF0ZSh7aWQ6IG5vdGlmaWNhdGlvbi5faWR9LCBub3RpZmljYXRpb24pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgICAgdmFyIG1lbWJlciA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbiAobykge1xuICAgICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAobWVtYmVyICYmIG1lbWJlci5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBtZW1iZXJbMF07XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiBcIk5vIG9uZVwiLFxuICAgICAgICAgIGZhY2Vib29rOiBcIjEwMDAwMDQ1NjMzNTk3MlwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5nZXRVbnJlYWROb3RpZmljYXRpb25zID0gZnVuY3Rpb24gKHRocmVhZCkge1xuICAgICAgLy9jb25zb2xlLmxvZyhub3RpZmljYXRpb25zKTtcbiAgICAgIHZhciBub3RpZmljYXRpb25zID0gJHNjb3BlLm5vdGlmaWNhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgcmV0dXJuIG8udGhyZWFkID09IHRocmVhZDtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gbm90aWZpY2F0aW9ucztcbiAgICB9O1xuXG4gICAgICRzY29wZS50b3BpYy51bnJlYWQgPSAkc2NvcGUuZ2V0VW5yZWFkTm90aWZpY2F0aW9ucygndG9waWMtJysgJHNjb3BlLnRvcGljLl9pZCkubGVuZ3RoID4gMDtcblxuICAgICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgICB2YXIgc3VmZml4ID0gXCJhZ29cIjtcbiAgICAgIGlmIChzZWNvbmRzIDwgMCl7XG4gICAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgICAgc3VmZml4ID0gXCJ0byBnb1wiO1xuICAgICAgfVxuXG4gICAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XG5cbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbW9udGhzIFwiICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgZGF5cyBcIiArIHN1ZmZpeDtcbiAgICAgIH1cbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgICB9XG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtaW51dGVzIFwiICsgc3VmZml4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICAgIH07XG5cbiAgICAkc2NvcGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uICh0aW1lKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUodGltZSkudG9VVENTdHJpbmcoKTtcbiAgICB9O1xuICB9XG59KTtcbiIsInJlcXVpcmUoJy4vbGlzdCcpO1xucmVxdWlyZSgnLi90b3BpYycpO1xucmVxdWlyZSgnLi9lbWJlZCcpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJUb3BpY3NDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCBUb3BpY0ZhY3RvcnkpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAkc2NvcGUua2luZHMgPSBbXCJJbmZvXCIsIFwiVG8gZG9cIiwgXCJEZWNpc2lvblwiLCBcIklkZWFcIl07XG5cbiAgICAkc2NvcGUuc2VhcmNoVG9waWNzID0ge307XG5cbiAgICAkc2NvcGUudW5yZWFkRmlyc3QgPSB0cnVlO1xuXG4gICAgVG9waWNGYWN0b3J5LlRvcGljLmdldEFsbChnb3RUb3BpY3MpO1xuXG4gICAgZnVuY3Rpb24gZ290VG9waWNzICh0b3BpY3MpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJHNjb3BlLmxvYWRpbmcpIHtcbiAgICAgICAgICBnb3RUb3BpY3ModG9waWNzKTtcbiAgICAgICAgfVxuICAgICAgfSwgMTAwMCk7XG5cbiAgICAgICRzY29wZS50b3BpY3MgPSB0b3BpY3M7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLnRvcGljcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgJHNjb3BlLnRvcGljc1tpXS5mYWNlYm9vayA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbiAobykge1xuICAgICAgICAgIHJldHVybiAkc2NvcGUudG9waWNzW2ldLmF1dGhvciA9PT0gby5pZDtcbiAgICAgICAgfSlbMF0uZmFjZWJvb2s7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgJHNjb3BlLnNob3dPcGVuID0gdHJ1ZTtcbiAgICAkc2NvcGUubGltaXQgPSAxMDtcblxuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAkc2NvcGUudGltZSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIHJldHVybiAkc2NvcGUudGltZVNpbmNlKG5ldyBEYXRlKGRhdGUpKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNyZWF0ZVRvcGljID0gZnVuY3Rpb24oa2luZCkge1xuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgVG9waWNGYWN0b3J5LlRvcGljLmNyZWF0ZSh7XG4gICAgICAgIGF1dGhvcjogJHNjb3BlLm1lLmlkLFxuICAgICAgICBraW5kOiBraW5kLFxuICAgICAgICB0YWdzOiBbJHNjb3BlLnNlYXJjaFRvcGljcy50YWdzXVxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgVG9waWNGYWN0b3J5LlRvcGljLmdldEFsbChmdW5jdGlvbiAodG9waWNzKSB7XG4gICAgICAgICAgICAkc2NvcGUudG9waWNzID0gdG9waWNzO1xuICAgICAgICAgICAgJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG8uX2lkID09IHJlc3BvbnNlLmlkO1xuICAgICAgICAgICAgfSlbMF0uZWRpdGluZyA9IHRydWU7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgndG9waWMvJytyZXNwb25zZS5pZCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY291bnQgPSBmdW5jdGlvbiAob3Blbikge1xuICAgICAgcmV0dXJuICRzY29wZS50b3BpY3MuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgICAgIHJldHVybiAob3BlbiA/ICFvLmNsb3NlZCA6IG8uY2xvc2VkKTtcbiAgICAgIH0pLmxlbmd0aDtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNob3duVG9waWNzID0gZnVuY3Rpb24gKG9wZW4pIHtcbiAgICAgIHJldHVybiAkc2NvcGUudG9waWNzLmZpbHRlcihmdW5jdGlvbiAobykge1xuICAgICAgICByZXR1cm4gby5lZGl0aW5nIHx8IChvcGVuID8gIW8uY2xvc2VkIDogby5jbG9zZWQpICYmIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCRzY29wZS5zZWFyY2hUb3BpY3MudGFncyAmJiBvLnRhZ3MuaW5kZXhPZigkc2NvcGUuc2VhcmNoVG9waWNzLnRhZ3MpID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoJHNjb3BlLnNlYXJjaFRvcGljcy50YXJnZXQgJiYgby50YXJnZXRzLmluZGV4T2YoJHNjb3BlLnNlYXJjaFRvcGljcy50YXJnZXQpID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoJHNjb3BlLnNlYXJjaFRvcGljcy5raW5kICYmIG8ua2luZCAhPT0gJHNjb3BlLnNlYXJjaFRvcGljcy5raW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KCkpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zY3JvbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgkc2NvcGUubGltaXQgPCAkc2NvcGUudG9waWNzLmxlbmd0aClcbiAgICAgICAgJHNjb3BlLmxpbWl0ICs9IDQ7XG4gICAgfTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoJ1RvcGljQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uLCAkd2luZG93LCBUb3BpY0ZhY3RvcnksIE5vdGlmaWNhdGlvbkZhY3RvcnkpIHtcblxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xuXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcblxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5nZXQoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICRzY29wZS50b3BpYyA9IHJlc3VsdDtcblxuICAgICAgLy9jb25zb2xlLmxvZygkbG9jYXRpb24uc2VhcmNoKCkpO1xuICAgICAgaWYoJGxvY2F0aW9uLnNlYXJjaCgpLmVkaXRpbmcgPT0gdHJ1ZSkge1xuICAgICAgICAkc2NvcGUudG9waWMuZWRpdGluZz10cnVlO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdUUlVFRUUnKTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLnRvcGljLnNob3dDb21tZW50cyA9IHRydWU7XG5cbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoJ2NvbW1lbnRBcmVhJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21tZW50L2FyZWEuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQ29tbWVudEFyZWFDb250cm9sbGVyJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHRocmVhZDogJ0AnLFxuICAgICAgICBzdWJ0aHJlYWQ6ICdAJyxcbiAgICAgICAgbWU6ICc9JyxcbiAgICAgICAgbWVtYmVyczogJz0nXG4gICAgICB9XG4gICAgfTtcbiAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdmaXJzdENvbW1lbnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbW1lbnQvZmlyc3QuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnRmlyc3RDb21tZW50Q29udHJvbGxlcicsXG4gICAgICBzY29wZToge1xuICAgICAgICB0aHJlYWQ6ICdAJ1xuICAgICAgfVxuICAgIH07XG4gIH0pIiwicmVxdWlyZSgnLi9hcmVhJyk7XG5yZXF1aXJlKCcuL2ZpcnN0Jyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdjb21tdW5pY2F0aW9uQXJlYScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tbXVuaWNhdGlvbi9hcmVhLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0NvbW11bmljYXRpb25BcmVhQ29udHJvbGxlcicsXG4gICAgICBzY29wZToge1xuICAgICAgICB0aHJlYWQ6ICdAJyxcbiAgICAgICAgZXZlbnQ6ICc9JyxcbiAgICAgICAgbWVtYmVyc0pzb246ICdAbWVtYmVycycsXG4gICAgICAgIG1lSnNvbjogJ0BtZScsXG4gICAgICAgIHJvbGVzSnNvbjogJ0Byb2xlcydcbiAgICAgIH1cbiAgICB9O1xuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgnY29tbXVuaWNhdGlvbicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tbXVuaWNhdGlvbi9jb21tdW5pY2F0aW9uLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0NvbW11bmljYXRpb25FbWJlZENvbnRyb2xsZXInLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgY29tbXVuaWNhdGlvbjogJz1jb21tdW5pY2F0aW9uT2JqZWN0JyxcbiAgICAgICAgbWVtYmVyczogJz0nLFxuICAgICAgICBtZTogJz0nXG4gICAgICB9XG4gICAgfTtcbiAgfSkiLCJyZXF1aXJlKCcuL2FyZWEnKTtcbnJlcXVpcmUoJy4vY29tbXVuaWNhdGlvbicpOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgnY29tcGFueUNhcmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBhbnkvY2FyZC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW55RW1iZWRDb250cm9sbGVyJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIGNvbXBhbnk6ICc9Y29tcGFueScsXG4gICAgICAgIGV2ZW50OiAnPWV2ZW50JyxcbiAgICAgICAgbm90aWZpY2F0aW9uczogJz1ub3RpZmljYXRpb25zJyxcbiAgICAgICAgbWU6ICc9bWUnLFxuICAgICAgICBtZW1iZXJzOiAnPW1lbWJlcnMnXG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4iLCJyZXF1aXJlKCcuL2NhcmQnKTsiLCJyZXF1aXJlKCcuL2lucHV0JykiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoXG4gICAgJ2RhdGVJbnB1dCcsXG4gICAgZnVuY3Rpb24oZGF0ZUZpbHRlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8aW5wdXQgdHlwZT1cImRhdGVcIj48L2lucHV0PicsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsbSwgYXR0cnMsIG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJGZvcm1hdHRlcnMudW5zaGlmdChmdW5jdGlvbiAobW9kZWxWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZUZpbHRlcihtb2RlbFZhbHVlLCAneXl5eS1NTS1kZCcpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHBhcnNlcnMudW5zaGlmdChmdW5jdGlvbih2aWV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHZpZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICB9KSIsInRoZVRvb2xEaXJlY3RpdmVzID0gYW5ndWxhci5tb2R1bGUoXCJ0aGVUb29sLmRpcmVjdGl2ZXNcIiwgW10pO1xuXG5yZXF1aXJlKFwiLi9jb21tZW50XCIpO1xucmVxdWlyZShcIi4vY29tbXVuaWNhdGlvblwiKTtcbnJlcXVpcmUoXCIuL2NvbXBhbnlcIik7XG5yZXF1aXJlKFwiLi9kYXRlXCIpO1xucmVxdWlyZShcIi4vbWFya2Rvd25cIik7XG5yZXF1aXJlKFwiLi9tZWV0aW5nXCIpO1xucmVxdWlyZShcIi4vc3BlYWtlclwiKTtcbnJlcXVpcmUoXCIuL3RhZ1wiKTtcbnJlcXVpcmUoXCIuL3RvcGljXCIpO1xucmVxdWlyZShcIi4vc2Nyb2xsXCIpO1xucmVxdWlyZShcIi4vc3Vic2NyaXB0aW9uXCIpO1xucmVxdWlyZShcIi4vbWVtYmVyXCIpOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgnY29tcGlsZScsIFsnJGNvbXBpbGUnLCBmdW5jdGlvbiAoJGNvbXBpbGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIHNjb3BlLiR3YXRjaChcbiAgICAgICAgICBmdW5jdGlvbihzY29wZSkge1xuICAgICAgICAgICAgIC8vIHdhdGNoIHRoZSAnY29tcGlsZScgZXhwcmVzc2lvbiBmb3IgY2hhbmdlc1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlLiRldmFsKGF0dHJzLmNvbXBpbGUpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIC8vIHdoZW4gdGhlICdjb21waWxlJyBleHByZXNzaW9uIGNoYW5nZXNcbiAgICAgICAgICAgIC8vIGFzc2lnbiBpdCBpbnRvIHRoZSBjdXJyZW50IERPTVxuICAgICAgICAgICAgZWxlbWVudC5odG1sKHZhbHVlKTtcblxuICAgICAgICAgICAgLy8gY29tcGlsZSB0aGUgbmV3IERPTSBhbmQgbGluayBpdCB0byB0aGUgY3VycmVudFxuICAgICAgICAgICAgLy8gc2NvcGUuXG4gICAgICAgICAgICAvLyBOT1RFOiB3ZSBvbmx5IGNvbXBpbGUgLmNoaWxkTm9kZXMgc28gdGhhdFxuICAgICAgICAgICAgLy8gd2UgZG9uJ3QgZ2V0IGludG8gaW5maW5pdGUgbG9vcCBjb21waWxpbmcgb3Vyc2VsdmVzXG4gICAgICAgICAgICAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpKHNjb3BlKTtcbiAgICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgfV0pIiwicmVxdWlyZSgnLi9jb21waWxlJyk7XG5yZXF1aXJlKCcuL21hcmtkb3duJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdtYXJrZG93bicsIFsnJGNvbXBpbGUnLCBmdW5jdGlvbiAoJGNvbXBpbGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICB2YXIgaHRtbFRleHQgPSBtYXJrZG93bi50b0hUTUwoZWxlbWVudC50ZXh0KCkpO1xuICAgICAgICAgICAgZWxlbWVudC5odG1sKGh0bWxUZXh0LnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpKTtcbiAgICAgICAgfVxuICAgIH07XG4gIH1dKSIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sRGlyZWN0aXZlcy5kaXJlY3RpdmUoXCJlbWJlZE1lZXRpbmdcIiwgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiBcIkVcIixcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL21lZXRpbmcvZW1iZWQuaHRtbFwiLFxuICAgIGNvbnRyb2xsZXI6IFwiTWVldGluZ0VtYmVkQ29udHJvbGxlclwiLFxuICAgIHNjb3BlOiB7XG4gICAgICBtZWV0aW5nSWQ6IFwiPVwiLFxuICAgICAgbWVtYmVyczogXCI9XCJcbiAgICB9XG4gIH07XG59KTtcbiIsInJlcXVpcmUoXCIuL2VtYmVkXCIpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdtZW1iZXJDYXJkJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9tZW1iZXIvY2FyZC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdNZW1iZXJFbWJlZENvbnRyb2xsZXInLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgbWVtYmVyOiAnPW1lbWJlck9iamVjdCcsXG4gICAgICB9XG4gICAgfTtcbiAgfSlcbiIsInJlcXVpcmUoJy4vY2FyZC5qcycpOyIsInJlcXVpcmUoXCIuL3Bvc2l0aW9uLmpzXCIpOyIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sRGlyZWN0aXZlcy5kaXJlY3RpdmUoJ3doZW5TY3JvbGxlZCcsIFsnJHRpbWVvdXQnLCBmdW5jdGlvbigkdGltZW91dCkge1xuICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsbSwgYXR0cikge1xuXG4gICAgLy9jb25zb2xlLmxvZyhcIk9uIGRpcmVjdGl2ZVwiKTtcblxuICAgIC8vY29uc29sZS5sb2coZWxtKTtcblxuICAgIHZhciByYXcgPSBlbG1bMF07XG4gICAgLy9jb25zb2xlLmxvZyhyYXcpO1xuXG4gICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKHJhdy5zY3JvbGxUb3ApO1xuICAgICAgLy9jb25zb2xlLmxvZyhyYXcuc2Nyb2xsSGVpZ2h0KTtcbiAgICAgIHJhdy5zY3JvbGxUb3AgPSByYXcuc2Nyb2xsSGVpZ2h0O1xuICAgIH0pO1xuXG4gICAgZWxtLmJpbmQoJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHJhdy5zY3JvbGxUb3AgPD0gMTAwKSB7IC8vIGxvYWQgbW9yZSBpdGVtcyBiZWZvcmUgeW91IGhpdCB0aGUgdG9wXG4gICAgICAgIHZhciBzaCA9IHJhdy5zY3JvbGxIZWlnaHRcbiAgICAgICAgc2NvcGUuJGFwcGx5KGF0dHIud2hlblNjcm9sbGVkKTtcbiAgICAgICAgcmF3LnNjcm9sbFRvcCA9IHJhdy5zY3JvbGxIZWlnaHQgLSBzaDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn1dKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgnc3BlYWtlckNhcmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQUVDJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3NwZWFrZXIvY2FyZC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdTcGVha2VyRW1iZWRDb250cm9sbGVyJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHNwZWFrZXI6ICc9c3BlYWtlcicsXG4gICAgICAgIGV2ZW50OiAnPWV2ZW50JyxcbiAgICAgICAgbm90aWZpY2F0aW9uczogJz1ub3RpZmljYXRpb25zJyxcbiAgICAgICAgbWU6ICc9bWUnLFxuICAgICAgICBtZW1iZXJzOiAnPW1lbWJlcnMnXG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4iLCJhcmd1bWVudHNbNF1bNTZdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKSIsInJlcXVpcmUoJy4vc3Vic2NyaXB0aW9uJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdzdWJzY3JpcHRpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3N1YnNjcmlwdGlvbi9idXR0b24uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnU3Vic2NyaXB0aW9uQ29udHJvbGxlcicsXG4gICAgICBzY29wZToge1xuICAgICAgICB0aHJlYWQ6ICdAJ1xuICAgICAgfVxuICAgIH07XG4gIH0pIiwiYXJndW1lbnRzWzRdWzQzXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cykiLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZShcInRhZ01hbmFnZXJcIiwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogXCJFXCIsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdGFnL21hbmFnZXIuaHRtbFwiLFxuICAgICAgY29udHJvbGxlcjogXCJUYWdNYW5hZ2VyQ29udHJvbGxlclwiLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgdGFnczogXCI9dGFnc0FycmF5XCIsXG4gICAgICAgIHNlYXJjaDogXCI9XCJcbiAgICAgIH1cbiAgICB9O1xuICB9KVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xEaXJlY3RpdmVzLmRpcmVjdGl2ZShcInRvcGljQ2FyZFwiLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdG9waWMvY2FyZC5odG1sXCIsXG4gICAgY29udHJvbGxlcjogXCJUb3BpY0VtYmVkQ29udHJvbGxlclwiLFxuICAgIHNjb3BlOiB7XG4gICAgICB0b3BpYzogXCI9XCIsXG4gICAgICBtZW1iZXJzOiBcIj1cIixcbiAgICAgIG1lOiBcIj1cIixcbiAgICAgIHJvbGVzOiBcIj1cIixcbiAgICAgIHRhZ3M6IFwiPVwiLFxuICAgICAgY29tbWVudHM6IFwiPVwiLFxuICAgICAgbm90aWZpY2F0aW9uczogXCI9XCJcbiAgICB9XG4gIH07XG59KTtcbiIsInJlcXVpcmUoXCIuL3RvcGljXCIpO1xucmVxdWlyZShcIi4vY2FyZFwiKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sRGlyZWN0aXZlcy5kaXJlY3RpdmUoXCJ0b3BpY1wiLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdG9waWMvdG9waWMuaHRtbFwiLFxuICAgIGNvbnRyb2xsZXI6IFwiVG9waWNFbWJlZENvbnRyb2xsZXJcIixcbiAgICBzY29wZToge1xuICAgICAgdG9waWM6IFwiPVwiLFxuICAgICAgbWVtYmVyczogXCI9XCIsXG4gICAgICBtZTogXCI9XCIsXG4gICAgICByb2xlczogXCI9XCIsXG4gICAgICB0YWdzOiBcIj1cIixcbiAgICAgIGNvbW1lbnRzOiBcIj1cIixcbiAgICAgIG5vdGlmaWNhdGlvbnM6IFwiPVwiXG4gICAgfVxuICB9O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCd0aGVUb29sLmZpbHRlcnMnLCBbXSlcbiAgLmZpbHRlcignaW50ZXJwb2xhdGUnLCBbJ3ZlcnNpb24nLCBmdW5jdGlvbih2ZXJzaW9uKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHJldHVybiBTdHJpbmcodGV4dCkucmVwbGFjZSgvXFwlVkVSU0lPTlxcJS9tZywgdmVyc2lvbik7XG4gICAgfVxuICB9XSlcbiAgLmZpbHRlcignZmlsdGVyRXZlbnRTdGF0dXMnLCBmdW5jdGlvbigpe1xuICAgIHJldHVybiBmdW5jdGlvbihvYmpzLCBldmVudCwgc2VhcmNoKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gb2JqcztcbiAgICAgIHJlc3VsdCA9IG9ianMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgaWYoby5wYXJ0aWNpcGF0aW9ucy5sZW5ndGggPD0gMCl7XG4gICAgICAgICAgcmV0dXJuIHNlYXJjaC51bmFzc2lnbmVkIHx8IHNlYXJjaC51bmFzc2lnbmVkT25seTtcbiAgICAgICAgfVxuICAgICAgICBpZihldmVudCAmJiAhc2VhcmNoLnVuYXNzaWduZWRPbmx5KSB7XG4gICAgICAgICAgcmV0dXJuIG8ucGFydGljaXBhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgIGlmKHNlYXJjaC5zdGF0dXMgJiYgc2VhcmNoLnN0YXR1cyAhPT0gJycgJiYgc2VhcmNoLm1lbWJlciAmJiBzZWFyY2gubWVtYmVyICE9PSAnJykge1xuICAgICAgICAgICAgICByZXR1cm4gcC5ldmVudCA9PT0gZXZlbnQuaWQgJiYgcC5zdGF0dXMgPT09IHNlYXJjaC5zdGF0dXMgJiYgcC5tZW1iZXIgPT09IHNlYXJjaC5tZW1iZXI7XG4gICAgICAgICAgICB9IGVsc2UgaWYoc2VhcmNoLnN0YXR1cyAmJiBzZWFyY2guc3RhdHVzICE9PSAnJykge1xuICAgICAgICAgICAgICByZXR1cm4gcC5ldmVudCA9PT0gZXZlbnQuaWQgJiYgcC5zdGF0dXMgPT09IHNlYXJjaC5zdGF0dXM7XG4gICAgICAgICAgICB9IGVsc2UgaWYoc2VhcmNoLm1lbWJlciAmJiBzZWFyY2gubWVtYmVyICE9PSAnJykge1xuICAgICAgICAgICAgICByZXR1cm4gcC5ldmVudCA9PT0gZXZlbnQuaWQgJiYgcC5tZW1iZXIgPT09IHNlYXJjaC5tZW1iZXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gcC5ldmVudCA9PT0gZXZlbnQuaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkubGVuZ3RoID4gMDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH0pXG4gIC5maWx0ZXIoJ2ZpbHRlclJvbGUnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obWVtYmVycywgcm9sZSkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSBtZW1iZXJzO1xuICAgICAgICAgIGlmKHJvbGUpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IG1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG0ucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gci5pZCA9PSByb2xlO1xuICAgICAgICAgICAgICB9KS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuICB9KTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnQ2hhdEZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIENoYXQ6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NoYXQvOmlkJywgbnVsbCwge1xuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9XG4gICAgICB9KSxcbiAgICAgIE1lc3NhZ2U6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NoYXQvOmlkL21lc3NhZ2VzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsaXNBcnJheTp0cnVlfVxuICAgICAgfSlcbiAgICB9XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ0NvbW1lbnRGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBDb21tZW50OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21tZW50LzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgQ29tcGFueTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tcGFueS86aWQvY29tbWVudHMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgU3BlYWtlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvc3BlYWtlci86aWQvY29tbWVudHMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgVG9waWM6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3RvcGljLzppZC9jb21tZW50cycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSksXG4gICAgICBDb21tdW5pY2F0aW9uOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21tdW5pY2F0aW9uLzppZC9jb21tZW50cycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSlcbiAgICB9XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ0NvbW11bmljYXRpb25GYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBDb21tdW5pY2F0aW9uOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21tdW5pY2F0aW9uLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgQ29tcGFueTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tcGFueS86aWQvY29tbXVuaWNhdGlvbnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgU3BlYWtlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvc3BlYWtlci86aWQvY29tbXVuaWNhdGlvbnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gICAgfTtcbiAgfSkiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnQ29tcGFueUZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIENvbXBhbnk6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NvbXBhbnkvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6dHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KSxcbiAgICAgIE1lbWJlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvbWVtYmVyLzppZC9jb21wYW5pZXMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfVxuICAgICAgfSlcbiAgICB9O1xuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdFbWFpbEZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIENvbXBhbnk6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NvbXBhbnkvOmlkL3NlbmRJbml0aWFsRW1haWwnLCBudWxsLCB7XG4gICAgICAgICdzZW5kJzoge21ldGhvZDogJ1BPU1QnfVxuICAgICAgfSksXG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9zcGVha2VyLzppZC9zZW5kSW5pdGlhbEVtYWlsJywgbnVsbCwge1xuICAgICAgICAnc2VuZCc6IHttZXRob2Q6ICdQT1NUJ31cbiAgICAgIH0pXG4gICAgfVxuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdFdmVudEZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIEV2ZW50OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9ldmVudC86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KVxuICAgIH1cbiAgfSkiLCJ0aGVUb29sU2VydmljZXMgPSBhbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5zZXJ2aWNlcycsIFsnbmdSZXNvdXJjZSddKTtcblxucmVxdWlyZSgnLi9jaGF0Jyk7XG5yZXF1aXJlKCcuL2NvbW1lbnQnKTtcbnJlcXVpcmUoJy4vY29tbXVuaWNhdGlvbicpO1xucmVxdWlyZSgnLi9jb21wYW55Jyk7XG5yZXF1aXJlKCcuL2VtYWlsJyk7XG5yZXF1aXJlKCcuL21lZXRpbmcnKTtcbnJlcXVpcmUoJy4vbWVtYmVyJyk7XG5yZXF1aXJlKCcuL21lc3NhZ2UnKTtcbnJlcXVpcmUoJy4vbm90aWZpY2F0aW9uJyk7XG5yZXF1aXJlKCcuL3JvbGUnKTtcbnJlcXVpcmUoJy4vc2Vzc2lvbicpO1xucmVxdWlyZSgnLi9zb2NrZXQnKTtcbnJlcXVpcmUoJy4vc3BlYWtlcicpO1xucmVxdWlyZSgnLi9zdWJzY3JpcHRpb24nKTtcbnJlcXVpcmUoJy4vdGFnJyk7XG5yZXF1aXJlKCcuL3RvcGljJyk7XG5yZXF1aXJlKCcuL2V2ZW50Jyk7XG5yZXF1aXJlKCcuL2l0ZW0nKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdJdGVtRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgSXRlbTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvaXRlbS86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KVxuICAgIH1cbiAgfSkiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnTWVldGluZ0ZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL21lZXRpbmcvOmlkJywgbnVsbCwge1xuICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICB9KTtcbiAgfSlcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdNZW1iZXJGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBNZW1iZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL21lbWJlci86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgUm9sZTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvcm9sZS86aWQvbWVtYmVycycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSksXG4gICAgICBNZTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvbXlzZWxmJywgbnVsbCwge1xuICAgICAgICAnZ2V0Jzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IGZhbHNlfVxuICAgICAgfSlcbiAgICB9O1xuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdNZXNzYWdlRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4gJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvbWVzc2FnZS86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiAgICB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXMuZmFjdG9yeSgnTm90aWZpY2F0aW9uRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgcmV0dXJuIHtcbiAgICBOb3RpZmljYXRpb246ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL25vdGlmaWNhdGlvbi86aWQnLCBudWxsLCB7XG4gICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxuICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfVxuICAgIH0pLFxuICAgIENvbXBhbnk6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NvbXBhbnkvOmlkL25vdGlmaWNhdGlvbnMnLCBudWxsLCB7XG4gICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgfSksXG4gICAgU3BlYWtlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvc3BlYWtlci86aWQvbm90aWZpY2F0aW9ucycsIG51bGwsIHtcbiAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICB9KSxcbiAgICBUb3BpYzogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvdG9waWMvOmlkL25vdGlmaWNhdGlvbnMnLCBudWxsLCB7XG4gICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgfSlcbiAgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ1JvbGVGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBSb2xlOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9yb2xlLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgIH0pLFxuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9yb2xlLzppZC9tZW1iZXJzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KVxuICAgIH07XG4gIH0pXG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnU2Vzc2lvbkZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFNlc3Npb246ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3Nlc3Npb24vOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfSksXG4gICAgICBDb21wYW55OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21wYW55LzppZC9zZXNzaW9ucycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSksXG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9zcGVha2VyLzppZC9zZXNzaW9ucycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSlcbiAgICB9XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ1NvY2tldEZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlLCAkbG9jYXRpb24sICRyb290U2NvcGUpIHtcbiAgICB2YXIgc29ja2V0O1xuICAgIHJldHVybiB7XG4gICAgICBjb25uZWN0OiBmdW5jdGlvbihuc3ApIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzb2NrZXQpO1xuICAgICAgICBzb2NrZXQgPSBpby5jb25uZWN0KG5zcCwge211bHRpcGxleDogZmFsc2V9KTtcbiAgICAgIH0sXG4gICAgICBvbjogZnVuY3Rpb24gKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgc29ja2V0Lm9uKGV2ZW50TmFtZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHNvY2tldCwgYXJncyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGVtaXQ6IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgIHNvY2tldC5lbWl0KGV2ZW50TmFtZSwgZGF0YSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShzb2NrZXQsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBkaXNjb25uZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNvY2tldC5kaXNjb25uZWN0KCk7XG4gICAgICB9LFxuICAgICAgc29ja2V0OiBzb2NrZXRcbiAgICB9O1xuICB9KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdTcGVha2VyRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgU3BlYWtlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvc3BlYWtlci86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9tZW1iZXIvOmlkL3NwZWFrZXJzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6dHJ1ZX1cbiAgICAgIH0pXG4gICAgfTtcbiAgfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbFNlcnZpY2VzLmZhY3RvcnkoXCJTdWJzY3JpcHRpb25GYWN0b3J5XCIsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgcmV0dXJuIHtcbiAgICBDb21wYW55OiAkcmVzb3VyY2UodXJsX3ByZWZpeCArIFwiL2FwaS9jb21wYW55LzppZC9zdWJzY3JpcHRpb25cIiwgbnVsbCwge1xuICAgICAgXCJnZXRcIjoge21ldGhvZDogXCJHRVRcIn0sXG4gICAgICBcImFkZFwiOiB7bWV0aG9kOiBcIlBPU1RcIn0sXG4gICAgICBcInJlbW92ZVwiOiB7bWV0aG9kOiBcIkRFTEVURVwifVxuICAgIH0pLFxuICAgIFNwZWFrZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4ICsgXCIvYXBpL3NwZWFrZXIvOmlkL3N1YnNjcmlwdGlvblwiLCBudWxsLCB7XG4gICAgICBcImdldFwiOiB7bWV0aG9kOiBcIkdFVFwifSxcbiAgICAgIFwiYWRkXCI6IHttZXRob2Q6IFwiUE9TVFwifSxcbiAgICAgIFwicmVtb3ZlXCI6IHttZXRob2Q6IFwiREVMRVRFXCJ9XG4gICAgfSksXG4gICAgVG9waWM6ICRyZXNvdXJjZSh1cmxfcHJlZml4ICsgXCIvYXBpL3RvcGljLzppZC9zdWJzY3JpcHRpb25cIiwgbnVsbCwge1xuICAgICAgXCJnZXRcIjoge21ldGhvZDogXCJHRVRcIn0sXG4gICAgICBcImFkZFwiOiB7bWV0aG9kOiBcIlBPU1RcIn0sXG4gICAgICBcInJlbW92ZVwiOiB7bWV0aG9kOiBcIkRFTEVURVwifVxuICAgIH0pXG4gIH07XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdUYWdGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBUYWc6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3RhZy86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KSxcbiAgICAgIFRvcGljOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS90YWcvOmlkL3RvcGljcycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSlcbiAgICB9O1xuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdUb3BpY0ZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFRvcGljOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS90b3BpYy86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KSxcbiAgICAgIE1lbWJlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvbWVtYmVyLzppZC90b3BpY3MnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7IG1ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWUgfVxuICAgICAgfSlcbiAgICB9O1xuICB9KVxuIiwidXJsX3ByZWZpeCA9IHJlcXVpcmUoJy4vLi4vLi4vY29uZmlnJykudXJsO1xuXG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvYXBwLmpzJyk7XG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMnKTtcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9kaXJlY3RpdmVzJyk7XG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvZmlsdGVycycpO1xucmVxdWlyZSgnLi9hbmd1bGFyQXBwL3NlcnZpY2VzJyk7IiwibW9kdWxlLmV4cG9ydHM9e1xuICBcInVybFwiOiBcImh0dHBzOi8vdG9vbC5iYW5hbmFtYXJrZXQuZXVcIixcbiAgXCJwb3J0XCI6IDg3NjUsXG4gIFwibWFpbGd1blwiOiB7XG4gICAgXCJlbWFpbFwiOiBcInRvb2xAYmFuYW5hbWFya2V0LmV1XCIsXG4gICAgXCJhcGlcIjogXCJrZXktN2ptMWMwMDllemp2ODVwa20xcnFmeGV2dWZlb3ZiNDNcIixcbiAgICBcInB1YmxpYy1hcGlcIjogXCJwdWJrZXktMGJsdjZkcnM2Mzc0NW94cnUzaXR2ZmcxdXJwNjYyeThcIlxuICB9LFxuICBcIm1vbmdvXCI6IHtcbiAgICBcInVybFwiOiBcIm1vbmdvZGI6Ly9sb2NhbGhvc3Qvc2luZm9cIlxuICB9LFxuICBcImNvb2tpZVwiOiB7XG4gICAgXCJuYW1lXCI6IFwibG9naW5cIixcbiAgICBcInBhc3N3b3JkXCI6IFwiNDRvSjFFb1AwZlI1QktvQW10REQ2QzFtQ1p6SFRGWXE5TER4dDBFZ2FSUUZFUDZqa0VpeDFYYTUxV3E1OTFuVk9RNWQzWEFqWld6SUtsRVlGWmY1VjdScjUyaWxLUEh4Y1pFRHZ1cEVvUFk0SkcwcmV5WVNLSFIyMDU2VkRNdkRVRkNIMnNuNTV1TkFLZ0doV2ZRck90bklleGZPNjNmZUNZU2RjeEdjZENHWno4NnZUM2JmSkNiTlpnRmdWSWtUZzJnbTNZRlV4enpnVW1EcWtpTmZ2Mm5RY1ZmTmFRUDBVYW5FYkxLaUVlZHE1bzFCNld6TFlOdmMzN2V5Y01zQlwiXG4gIH0sXG4gIFwiZmFjZWJvb2tcIjoge1xuICAgIFwiYXBwSWRcIjogXCI0NTcyMDc1MDc3NDQxNTlcIixcbiAgICBcImFwcFNlY3JldFwiOiBcIjlmMDI3YzUyZTAwYmMzYWRiYWJjZDkyNmEzYzk1Yjk3XCJcbiAgfVxufSIsInZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3RhdHVzZXMgPSB7XG4gIHNwZWFrZXI6IFtcbiAgICB7IG5hbWU6ICdTZWxlY3RlZCcsIGNvbG9yOiAnIzUzMTllNycsIGRlZmF1bHQ6IHRydWV9LFxuICAgIHsgbmFtZTogJ0FwcHJvdmVkJywgY29sb3I6ICcjMDA1MmNjJ30sXG4gICAgeyBuYW1lOiAnQ29udGFjdGVkJywgY29sb3I6ICcjZmJjYTA0J30sXG4gICAgeyBuYW1lOiAnSW4gQ29udmVyc2F0aW9ucycsIGNvbG9yOiAnIzIwN2RlNSd9LFxuICAgIHsgbmFtZTogJ0FjY2VwdGVkJywgY29sb3I6ICcjMDA5ODAwJ30sXG4gICAgeyBuYW1lOiAnUmVqZWN0ZWQnLCBjb2xvcjogJyNlMTFkMjEnfSxcbiAgICB7IG5hbWU6ICdHaXZlIFVwJywgY29sb3I6ICcjMzMzJ31cbiAgXSxcbiAgY29tcGFueTogW1xuICAgIHsgbmFtZTogJ0NvbnRhY3RlZCcsIGNvbG9yOiAnI2ZiY2EwNCcsIGRlZmF1bHQ6IHRydWV9LFxuICAgIHsgbmFtZTogJ0luIENvbnZlcnNhdGlvbnMnLCBjb2xvcjogJyMyMDdkZTUnfSxcbiAgICB7IG5hbWU6ICdJbiBOZWdvdGlhdGlvbnMnLCBjb2xvcjogJyMwMDZiNzUnfSxcbiAgICB7IG5hbWU6ICdDbG9zZWQgRGVhbCcsIGNvbG9yOiAnIzAwOTgwMCd9LFxuICAgIHsgbmFtZTogJ1JlamVjdGVkJywgY29sb3I6ICcjZTExZDIxJ30sXG4gICAgeyBuYW1lOiAnR2l2ZSBVcCcsIGNvbG9yOiAnIzMzMyd9IFxuICBdXG59O1xuXG5vcHRpb25zLnJvbGVzID0gW1xuICB7IG5hbWU6ICdQdWJsaWMgUmVsYXRpb25zJywgaWQ6ICdwdWJsaWMtcmVsYXRpb25zJyB9LFxuICB7IG5hbWU6ICdNYXJrZXRpbmcnLCBpZDogJ21hcmtldGluZycgfSxcbiAgeyBuYW1lOiAnSW50ZXJuYWwgUmVsYXRpb25zJywgaWQ6ICdpbnRlcm5hbC1yZWxhdGlvbnMnIH0sXG4gIHsgbmFtZTogJ0V2ZW50cycsIGlkOiAnZXZlbnRzJyB9LFxuICB7IG5hbWU6ICdJbm5vdmF0aW9uIEF3YXJkcycsIGlkOiAnaW5ub3ZhdGlvbi1hd2FyZHMnIH0sXG4gIHsgbmFtZTogJ0Rlc2lnbicsIGlkOiAnZGVzaWduJyB9LFxuICB7IG5hbWU6ICdBdWRpb3Zpc3VhbHMnLCBpZDogJ2F1ZGlvdmlzdWFscycgfSxcbiAgeyBuYW1lOiAnRGV2ZWxvcG1lbnQgVGVhbScsIGlkOiAnZGV2ZWxvcG1lbnQtdGVhbScgfSxcbiAgeyBuYW1lOiAnQ29vcmRpbmF0aW9uJywgaWQ6ICdjb29yZGluYXRpb24nIH0sXG4gIHsgbmFtZTogJ1RyZWFzdXJ5JywgaWQ6ICd0cmVhc3VyeScgfSxcbiAgeyBuYW1lOiAnRXh0ZXJuYWwgUmVsYXRpb25zJywgaWQ6ICdleHRlcm5hbC1yZWxhdGlvbnMnIH0sXG4gIHsgbmFtZTogJ1N0cmF0ZWdpYyBQYXJ0bmVyc2hpcHMnLCBpZDogJ3N0cmF0ZWdpYy1wYXJ0bmVyc2hpcHMnIH0sXG4gIHsgbmFtZTogJ1N5cyBBZG1pbicsIGlkOiAnc3lzLWFkbWluJyB9LFxuICB7IG5hbWU6ICdNYXJrZXRpbmcgTWFuYWdlcicsIGlkOiAnbWFya2V0aW5nLW1hbmFnZXInIH1cbl07XG5cbm1vZHVsZS5leHBvcnRzID0gb3B0aW9uczsiXX0=
