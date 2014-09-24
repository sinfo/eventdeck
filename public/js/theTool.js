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
          $scope.company.notifications = getData;

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
          $scope.speaker.notifications = getData;

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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcRGlvZ29cXERlc2t0b3BcXHJvb3RcXGV2ZW50ZGVja1xcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2FwcC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvYWRtaW4vaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2F1dGgvaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2F1dGgvaW50ZXJjZXB0b3IuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2F1dGgvbG9naW4uanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NoYXQvY2hhdC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY2hhdC9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY2hhdC9saXN0LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tZW50L2FyZWEuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW1lbnQvZmlyc3QuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW1lbnQvaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW11bmljYXRpb24vYXJlYS5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbXVuaWNhdGlvbi9lbWJlZC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbXVuaWNhdGlvbi9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbXVuaWNhdGlvbi9saXN0LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21wYW55L2NvbXBhbnkuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvY29uZmlybS5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9jcmVhdGUuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvZW1iZWQuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvbGlzdC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21haW4vaG9tZS5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWFpbi9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWFpbi9tYWluLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZWV0aW5nL2VtYmVkLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZWV0aW5nL2luZGV4LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZWV0aW5nL2xpc3QuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lZXRpbmcvbWVldGluZy5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVtYmVyL2NyZWF0ZS5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVtYmVyL2VtYmVkLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lbWJlci9saXN0LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvbWVtYmVyLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2NvbmZpcm0uanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvY3JlYXRlLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2VtYmVkLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2luZGV4LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2xpc3QuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvc3BlYWtlci5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvc3Vic2NyaXB0aW9uL2VtYmVkLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zdWJzY3JpcHRpb24vaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3RhZy9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdGFnL21hbmFnZXIuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3RvcGljL2VtYmVkLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90b3BpYy9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdG9waWMvbGlzdC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdG9waWMvdG9waWMuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbWVudC9hcmVhLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbW1lbnQvZmlyc3QuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbWVudC9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9jb21tdW5pY2F0aW9uL2FyZWEuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbXVuaWNhdGlvbi9jb21tdW5pY2F0aW9uLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbW11bmljYXRpb24vaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tcGFueS9jYXJkLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbXBhbnkvaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvZGF0ZS9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9kYXRlL2lucHV0LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2luZGV4LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21hcmtkb3duL2NvbXBpbGUuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWFya2Rvd24vaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWFya2Rvd24vbWFya2Rvd24uanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWVldGluZy9lbWJlZC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9tZWV0aW5nL2luZGV4LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21lbWJlci9jYXJkLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21lbWJlci9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9zY3JvbGwvaW5kZXguanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvc2Nyb2xsL3Bvc2l0aW9uLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3NwZWFrZXIvY2FyZC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9zcGVha2VyL2luZGV4LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3N1YnNjcmlwdGlvbi9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9zdWJzY3JpcHRpb24vc3Vic2NyaXB0aW9uLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3RhZy9pbmRleC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy90YWcvbWFuYWdlci5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy90b3BpYy9jYXJkLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3RvcGljL2luZGV4LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3RvcGljL3RvcGljLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9maWx0ZXJzL2luZGV4LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9jaGF0LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9jb21tZW50LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9jb21tdW5pY2F0aW9uLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9jb21wYW55LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9lbWFpbC5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvZXZlbnQuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2luZGV4LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9pdGVtLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9tZWV0aW5nLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9tZW1iZXIuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL21lc3NhZ2UuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL25vdGlmaWNhdGlvbi5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvcm9sZS5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvc2Vzc2lvbi5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvc29ja2V0LmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9zcGVha2VyLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9zdWJzY3JpcHRpb24uanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL3RhZy5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvdG9waWMuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL2NsaWVudEFwcC9qcy90aGVUb29sLmpzIiwiQzovVXNlcnMvRGlvZ28vRGVza3RvcC9yb290L2V2ZW50ZGVjay9jb25maWcuanMiLCJDOi9Vc2Vycy9EaW9nby9EZXNrdG9wL3Jvb3QvZXZlbnRkZWNrL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIkM6L1VzZXJzL0Rpb2dvL0Rlc2t0b3Avcm9vdC9ldmVudGRlY2svcGFja2FnZS5qc29uIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUtBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3UUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBOztBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoXCJ0aGVUb29sXCIsIFtcclxuICBcIm5nXCIsXHJcbiAgXCJuZ1JvdXRlXCIsXHJcbiAgXCJuZ1Nhbml0aXplXCIsXHJcbiAgXCJuZ1RvdWNoXCIsXHJcbiAgXCJpbmZpbml0ZS1zY3JvbGxcIixcclxuICBcInVuc2F2ZWRDaGFuZ2VzXCIsXHJcbiAgXCJsdWVnZy5kaXJlY3RpdmVzXCIsXHJcbiAgXCJuZ0F1ZGlvXCIsXHJcbiAgXCJ0aGVUb29sLmZpbHRlcnNcIixcclxuICBcInRoZVRvb2wuc2VydmljZXNcIixcclxuICBcInRoZVRvb2wuZGlyZWN0aXZlc1wiLFxyXG4gIFwidGhlVG9vbC5jb250cm9sbGVyc1wiXHJcbl0pLlxyXG5jb25maWcoW1wiJHJvdXRlUHJvdmlkZXJcIiwgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL1wiICAgICAgICAgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jaGF0L3ZpZXcuaHRtbFwiLCAgICAgICAgICAgICBjb250cm9sbGVyOiBcIkNoYXRDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2FkbWluXCIgICAgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9pbmRleC5odG1sXCIsICAgICAgICAgICBjb250cm9sbGVyOiBcIkFkbWluQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9sb2dpblwiICAgICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvYXV0aC9sb2dpbi5odG1sXCIsICAgICAgICAgICAgY29udHJvbGxlcjogXCJMb2dpbkNvbnRyb2xsZXJcIn0pO1xyXG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbG9naW4vOmlkLzpjb2RlXCIgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2F1dGgvbG9naW4uaHRtbFwiLCAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTG9naW5Db250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbmllcy9cIiAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2xpc3QuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbmllc0NvbnRyb2xsZXJcIn0pO1xyXG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tcGFuaWVzL3RhYmxlL1wiICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbXBhbnkvdGFibGUuaHRtbFwiLCAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ29tcGFuaWVzQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW5pZXMvYnVkZ2V0L1wiICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tcGFueS9idWRnZXQuaHRtbFwiLCAgICAgICAgY29udHJvbGxlcjogXCJDb21wYW5pZXNDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvXCIgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2NyZWF0ZS5odG1sXCIsICAgICAgICBjb250cm9sbGVyOiBcIkNyZWF0ZUNvbXBhbnlDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvOmlkXCIgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L3ZpZXcuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbnlDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvOmlkL2VkaXRcIiAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2VkaXQuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbnlDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvOmlkL3BhcnRpY2lwYXRpb25zXCIsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L3BhcnRpY2lwYXRpb25zLmh0bWxcIixjb250cm9sbGVyOiBcIkNvbXBhbnlDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvOmlkL2NvbmZpcm1cIiAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2NvbmZpcm0uaHRtbFwiLCAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbnlFbWFpbENvbnRyb2xsZXJcIn0pO1xyXG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tbWVudC86aWQvZWRpdFwiICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbW1lbnQvZWRpdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ29tbWVudENvbnRyb2xsZXJcIn0pO1xyXG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvc3BlYWtlcnMvXCIgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3NwZWFrZXIvbGlzdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiU3BlYWtlcnNDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL3NwZWFrZXJzL3RhYmxlL1wiICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zcGVha2VyL3RhYmxlLmh0bWxcIiwgICAgICAgICBjb250cm9sbGVyOiBcIlNwZWFrZXJzQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyL1wiICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9jcmVhdGUuaHRtbFwiLCAgICAgICAgY29udHJvbGxlcjogXCJDcmVhdGVTcGVha2VyQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyLzppZFwiICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci92aWV3Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJTcGVha2VyQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyLzppZC9lZGl0XCIgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9lZGl0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJTcGVha2VyQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyLzppZC9wYXJ0aWNpcGF0aW9uc1wiLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9wYXJ0aWNpcGF0aW9ucy5odG1sXCIsY29udHJvbGxlcjogXCJTcGVha2VyQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyLzppZC9jb25maXJtXCIgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9jb25maXJtLmh0bWxcIiwgICAgICAgY29udHJvbGxlcjogXCJTcGVha2VyRW1haWxDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lbWJlcnMvXCIgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZW1iZXIvbGlzdC5odG1sXCIsICAgICAgICAgICBjb250cm9sbGVyOiBcIk1lbWJlcnNDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lbWJlci9cIiAgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZW1iZXIvY3JlYXRlLmh0bWxcIiwgICAgICAgICBjb250cm9sbGVyOiBcIkNyZWF0ZU1lbWJlckNvbnRyb2xsZXJcIn0pO1xyXG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVtYmVyLzppZFwiICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lbWJlci92aWV3Lmh0bWxcIiwgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVtYmVyQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZW1iZXIvOmlkL2VkaXRcIiAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVtYmVyL2VkaXQuaHRtbFwiLCAgICAgICAgICAgY29udHJvbGxlcjogXCJNZW1iZXJDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lZXRpbmdzXCIgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZWV0aW5nL2xpc3QuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIk1lZXRpbmdzQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZWV0aW5nLzppZFwiICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy92aWV3Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJNZWV0aW5nQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZWV0aW5nLzppZC90ZXh0XCIgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy90ZXh0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJNZWV0aW5nQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZWV0aW5nLzppZC9lZGl0XCIgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy9lZGl0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJNZWV0aW5nQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jaGF0c1wiICAgICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY2hhdC9saXN0Lmh0bWxcIiwgICAgICAgICAgICAgY29udHJvbGxlcjogXCJDaGF0c0NvbnRyb2xsZXJcIn0pO1xyXG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY2hhdC86aWRcIiAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NoYXQvdmlldy5odG1sXCIsICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ2hhdENvbnRyb2xsZXJcIn0pO1xyXG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvdG9waWNzXCIgICAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3RvcGljL2xpc3QuaHRtbFwiLCAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiVG9waWNzQ29udHJvbGxlclwifSk7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi90b3BpYy86aWRcIiAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvdG9waWMvdmlldy5odG1sXCIsICAgICAgICAgICAgY29udHJvbGxlcjogXCJUb3BpY0NvbnRyb2xsZXJcIn0pO1xyXG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tbXVuaWNhdGlvbnMvOmtpbmRcIiAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbW11bmljYXRpb24vbGlzdC5odG1sXCIsICAgIGNvbnRyb2xsZXI6IFwiQ29tbXVuaWNhdGlvbnNDb250cm9sbGVyXCJ9KTtcclxuICAkcm91dGVQcm92aWRlci5vdGhlcndpc2Uoe3JlZGlyZWN0VG86IFwiL1wifSk7XHJcbn1dKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiQWRtaW5Db250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIEV2ZW50RmFjdG9yeSwgSXRlbUZhY3RvcnkpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgIEV2ZW50RmFjdG9yeS5FdmVudC5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICRzY29wZS5ldmVudHMgPSByZXNwb25zZTtcclxuICAgIH0pO1xyXG5cclxuICAgIEl0ZW1GYWN0b3J5Lkl0ZW0uZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAkc2NvcGUuaXRlbXMgPSByZXNwb25zZTtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS5hZGRFdmVudCA9IGZ1bmN0aW9uKG5ld0V2ZW50KSB7XHJcbiAgICAgIEV2ZW50RmFjdG9yeS5FdmVudC5jcmVhdGUobmV3RXZlbnQsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgRXZlbnRGYWN0b3J5LkV2ZW50LmdldEFsbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICRzY29wZS5ldmVudHMgPSByZXNwb25zZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5hZGRJdGVtID0gZnVuY3Rpb24obmV3SXRlbSkge1xyXG4gICAgICBJdGVtRmFjdG9yeS5JdGVtLmNyZWF0ZShuZXdJdGVtLCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEl0ZW1GYWN0b3J5Lkl0ZW0uZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgJHNjb3BlLml0ZW1zID0gcmVzcG9uc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUudXBkYXRlRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgRXZlbnRGYWN0b3J5LkV2ZW50LnVwZGF0ZSh7aWQ6IGV2ZW50LmlkfSwgZXZlbnQsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlLmVycm9yKTtcclxuICAgICAgICAgIHJldHVybiAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZXZlbnQuZWRpdGluZyA9IGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnVwZGF0ZUl0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICBJdGVtRmFjdG9yeS5JdGVtLnVwZGF0ZSh7aWQ6IGl0ZW0uaWR9LCBpdGVtLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGl0ZW0uZWRpdGluZyA9IGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmRlbGV0ZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIEV2ZW50RmFjdG9yeS5FdmVudC5kZWxldGUoe2lkOiBldmVudC5pZH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEV2ZW50RmFjdG9yeS5FdmVudC5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAkc2NvcGUuZXZlbnRzID0gcmVzcG9uc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZGVsZXRlSXRlbSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgIEl0ZW1GYWN0b3J5Lkl0ZW0uZGVsZXRlKHtpZDogaXRlbS5pZH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEl0ZW1GYWN0b3J5Lkl0ZW0uZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgJHNjb3BlLml0ZW1zID0gcmVzcG9uc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgfVxyXG59KTtcclxuIiwicmVxdWlyZShcIi4vbG9naW5cIik7XHJcbnJlcXVpcmUoJy4vaW50ZXJjZXB0b3InKTtcclxuIiwidGhlVG9vbENvbnRyb2xsZXIuY29uZmlnKGZ1bmN0aW9uICgkaHR0cFByb3ZpZGVyKSB7XHJcbiAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChbJyRpbmplY3RvcicsIGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcclxuICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcclxuICB9XSk7XHJcbn0pO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXIuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRsb2NhdGlvbiwgJHdpbmRvdykge1xyXG4gIHJldHVybiB7XHJcbiAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAxKSB7XHJcbiAgICAgICAgJHJvb3RTY29wZS51cGRhdGUucnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmKCRsb2NhdGlvbi5wYXRoKCkuaW5kZXhPZignL2xvZ2luJykgPT0gLTEpIHtcclxuICAgICAgICAgICRyb290U2NvcGUubmV4dFBhdGggPSAnIycgKyAkbG9jYXRpb24ucGF0aCgpO1xyXG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcbn0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBmYWNlYm9va0NvbmZpZyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vLi4vLi4vY29uZmlnJykuZmFjZWJvb2s7XHJcblxyXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTG9naW5Db250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uLCAkaHR0cCwgJHdpbmRvdykge1xyXG5cclxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICQuYWpheFNldHVwKHtjYWNoZTogdHJ1ZX0pO1xyXG4gICQuZ2V0U2NyaXB0KFwiLy9jb25uZWN0LmZhY2Vib29rLm5ldC9wdF9QVC9hbGwuanNcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgRkIuaW5pdCh7YXBwSWQ6IGZhY2Vib29rQ29uZmlnLmFwcElkfSk7XHJcbiAgfSk7XHJcblxyXG4gICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgJHNjb3BlLnNob3dJZElucHV0ID0gdHJ1ZTtcclxuICAkc2NvcGUuc2hvd0NvZGVJbnB1dCA9IGZhbHNlO1xyXG5cclxuICBpZigkc2NvcGUubWUuaWQpIHtcclxuICAgIC8vJGxvY2F0aW9uLnBhdGgoJy8nKTtcclxuICAgICR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcvJyk7XHJcbiAgfVxyXG5cclxuICB2YXIgbG9jayA9IGZhbHNlO1xyXG5cclxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgJHNjb3BlLmZhY2Vib29rTG9naW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkc2NvcGUuYmFuYW5hID0gdHJ1ZTtcclxuXHJcbiAgXHRpZiAobG9jaykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbG9jayA9IHRydWU7XHJcblxyXG4gICAgRkIuZ2V0TG9naW5TdGF0dXMoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IFwiY29ubmVjdGVkXCIpIHtcclxuICAgICAgICBjb25uZWN0ZWQocmVzcG9uc2UpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIEZCLmxvZ2luKGZ1bmN0aW9uICgpIHt9LCB7ZGlzcGxheTogXCJwb3B1cFwifSk7XHJcbiAgICAgICAgRkIuRXZlbnQuc3Vic2NyaWJlKFwiYXV0aC5zdGF0dXNDaGFuZ2VcIiwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSBcImNvbm5lY3RlZFwiKSB7XHJcbiAgICAgICAgICAgIGNvbm5lY3RlZChyZXNwb25zZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxvY2sgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY29ubmVjdGVkKHJlc3BvbnNlKSB7XHJcbiAgICAgICRzY29wZS5jb25uZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICRzY29wZS5sb2dpbkluZm8gPSBcIkxvZ2dpbmcgaW4uLi5cIjtcclxuXHJcbiAgICAgICRodHRwLmdldCh1cmxfcHJlZml4ICsgJy9hcGkvbG9naW4vZmFjZWJvb2s/aWQ9JytyZXNwb25zZS5hdXRoUmVzcG9uc2UudXNlcklEKycmdG9rZW49JytyZXNwb25zZS5hdXRoUmVzcG9uc2UuYWNjZXNzVG9rZW4pLlxyXG4gICAgICAgIHN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgIC8vJGxvY2F0aW9uLnBhdGgoJy8nKTtcclxuICAgICAgICAgIGlmKHR5cGVvZiAkcm9vdFNjb3BlLm5leHRQYXRoID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcjJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmFzc2lnbigkcm9vdFNjb3BlLm5leHRQYXRoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICRyb290U2NvcGUudXBkYXRlLmFsbCgpO1xyXG4gICAgICAgIH0pLlxyXG4gICAgICAgIGVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkVSUk9SXCIsIGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gICRzY29wZS5zZW5kRW1haWwgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcclxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuICAgICRzY29wZS5sb2dpbkluZm8gPSBcIlNlbmRpbmcgZW1haWwuLi5cIjtcclxuICAgICRzY29wZS5zaG93SWRJbnB1dCA9IGZhbHNlO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcIlNlbmRpbmcgZW1haWwuLi5cIik7XHJcblxyXG4gICAgJGh0dHAuZ2V0KHVybF9wcmVmaXggKyAnL2FwaS9sb2dpbi8nICsgbWVtYmVySWQpLlxyXG4gICAgICBzdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgaWYoZGF0YS5lcnJvcikge1xyXG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgIHNldEluZm8oXCJUaGVyZSB3YXMgYW4gZXJyb3IuLi5cIik7XHJcbiAgICAgICAgICAkc2NvcGUuc2hvd0lkSW5wdXQgPSB0cnVlO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHNldEluZm8oXCJFbWFpbCBzZW50IVwiKTtcclxuICAgICAgICAkc2NvcGUuc2hvd0NvZGVJbnB1dCA9IHRydWU7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkVtYWlsIHNlbnQhXCIpXHJcbiAgICAgIH0pLlxyXG4gICAgICBlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgc2V0SW5mbyhcIlRoZXJlIHdhcyBhbiBlcnJvci4uLlwiKTtcclxuICAgICAgICAkc2NvcGUuc2hvd0lkSW5wdXQgPSB0cnVlO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJFUlJPUlwiLCBkYXRhKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICAkc2NvcGUuc3VibWl0Q29kZSA9IGZ1bmN0aW9uIChtZW1iZXJJZCwgbWVtYmVyQ29kZSkge1xyXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgJHNjb3BlLmxvZ2luSW5mbyA9IFwiVmVyaWZ5aW5nIGNvZGUuLi5cIjtcclxuICAgICRzY29wZS5zaG93Q29kZUlucHV0ID0gZmFsc2U7XHJcblxyXG4gICAgJGh0dHAuZ2V0KHVybF9wcmVmaXggKyAnL2FwaS9sb2dpbi8nICsgbWVtYmVySWQgKyAnLycgKyBtZW1iZXJDb2RlKS5cclxuICAgICAgc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgIGlmKGRhdGEuZXJyb3IpIHtcclxuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICBzZXRJbmZvKFwiVGhlcmUgd2FzIGFuIGVycm9yLi4uXCIpO1xyXG4gICAgICAgICAgJHNjb3BlLnNob3dJZElucHV0ID0gdHJ1ZTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAkc2NvcGUubG9naW5JbmZvID0gXCJTdWNjZXNzIVwiO1xyXG4gICAgICAgICR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcvJyk7XHJcbiAgICAgICAgLy8kbG9jYXRpb24ucGF0aCgnLycpO1xyXG4gICAgICB9KS5cclxuICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHNldEluZm8oXCJUaGVyZSB3YXMgYW4gZXJyb3IuLi5cIik7XHJcbiAgICAgICAgJHNjb3BlLnNob3dJZElucHV0ID0gdHJ1ZTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRJbmZvKG1lc3NhZ2UpIHtcclxuICAgICRzY29wZS5sb2dpbkluZm8gPSBtZXNzYWdlO1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpeyRzY29wZS5sb2dpbkluZm89XCJcIn0sIDIwMDApO1xyXG4gIH1cclxuXHJcbiAgaWYgKCRyb3V0ZVBhcmFtcy5pZCAmJiAkcm91dGVQYXJhbXMuY29kZSkge1xyXG4gICAgJHNjb3BlLnN1Ym1pdENvZGUoJHJvdXRlUGFyYW1zLmlkLCAkcm91dGVQYXJhbXMuY29kZSlcclxuICB9XHJcblxyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignQ2hhdENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCBuZ0F1ZGlvLCBTb2NrZXRGYWN0b3J5LCBNZXNzYWdlRmFjdG9yeSwgQ2hhdEZhY3RvcnksIE1lbWJlckZhY3RvcnkpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgICRzY29wZS5lcnJvciA9IHt9O1xyXG5cclxuICAgICRzY29wZS51cGRhdGluZyA9IGZhbHNlO1xyXG4gICAgJHNjb3BlLmxvYWRpbmcgID0gdHJ1ZTtcclxuICAgICRzY29wZS5hdXRoICAgICA9IGZhbHNlO1xyXG4gICAgJHNjb3BlLmNvbmVjdGVkID0gZmFsc2U7XHJcbiAgICAkc2NvcGUubWVzc2FnZXMgPSBbXTtcclxuICAgICRzY29wZS5vbmxpbmUgICA9IFtdO1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coXCJDb25uZWN0aW5nXCIpO1xyXG5cclxuICAgIFNvY2tldEZhY3RvcnkuY29ubmVjdCgnL2NoYXQnKTtcclxuXHJcbiAgICBTb2NrZXRGYWN0b3J5Lm9uKCdjb25uZWN0ZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRzY29wZS5jb25lY3RlZCA9IHRydWU7XHJcbiAgICAgIGlmKCEkc2NvcGUuYXV0aCl7XHJcbiAgICAgICAgU29ja2V0RmFjdG9yeS5lbWl0KCdhdXRoJywge2lkOiAoJHJvdXRlUGFyYW1zLmlkIHx8ICdnZXJhbCcpLCB1c2VyOiAkc2NvcGUubWUuaWR9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCdBdXRoIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgICRzY29wZS5hdXRoID0gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgU29ja2V0RmFjdG9yeS5vbigndmFsaWRhdGlvbicsIGZ1bmN0aW9uIChyZXNwb25zZSl7XHJcbiAgICAgIGlmKCFyZXNwb25zZS5lcnIpe1xyXG4gICAgICAgICRzY29wZS5jaGF0ICAgICA9IHJlc3BvbnNlLmNoYXREYXRhO1xyXG4gICAgICAgICRzY29wZS5tZXNzYWdlcyA9IHJlc3BvbnNlLm1lc3NhZ2VzO1xyXG4gICAgICAgICRzY29wZS5yb29tICAgICA9IHJlc3BvbnNlLnJvb207XHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUuY2hhdC5tZW1iZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICRzY29wZS5vbmxpbmUucHVzaCh7bWVtYmVyOiAkc2NvcGUuY2hhdC5tZW1iZXJzW2ldLCBvbjogZmFsc2V9KTtcclxuICAgICAgICAgIGlmKHJlc3BvbnNlLm9ubGluZS5pbmRleE9mKCRzY29wZS5jaGF0Lm1lbWJlcnNbaV0pICE9IC0xKXtcclxuICAgICAgICAgICAgJHNjb3BlLm9ubGluZVtpXS5vbiA9IHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAkc2NvcGUub25saW5lW2ldLm5hbWUgPSAkc2NvcGUuZ2V0TWVtYmVyKCRzY29wZS5vbmxpbmVbaV0ubWVtYmVyKS5uYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkc2NvcGUuaGlzdG9yeSA9IGhpc3Rvcnk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlLm1lc3NhZ2UpO1xyXG4gICAgICB9XHJcbiAgICAgICRzY29wZS5sb2FkaW5nICA9IGZhbHNlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgU29ja2V0RmFjdG9yeS5vbigndXNlci1jb25uZWN0ZWQnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZyhcIlVzZXIgY29ubmVjdGVkOiBcIiArIHJlc3BvbnNlLmlkKTtcclxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5vbmxpbmUubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIGlmKCRzY29wZS5vbmxpbmVbaV0ubWVtYmVyID09PSByZXNwb25zZS5pZCl7XHJcbiAgICAgICAgICAkc2NvcGUub25saW5lW2ldLm9uID0gdHJ1ZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgU29ja2V0RmFjdG9yeS5vbigndXNlci1kaXNjb25uZWN0ZWQnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZyhcIlVzZXIgY29ubmVjdGVkOiBcIiArIHJlc3BvbnNlLmlkKTtcclxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5vbmxpbmUubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIGlmKCRzY29wZS5vbmxpbmVbaV0ubWVtYmVyID09PSByZXNwb25zZS5pZCl7XHJcbiAgICAgICAgICAkc2NvcGUub25saW5lW2ldLm9uID0gZmFsc2U7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIFNvY2tldEZhY3Rvcnkub24oJ21lc3NhZ2UnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xyXG4gICAgICAkc2NvcGUubWVzc2FnZXMucHVzaChtZXNzYWdlKTtcclxuICAgICAgaWYobWVzc2FnZS5tZW1iZXIgIT0gJHNjb3BlLm1lLmlkKSB7XHJcbiAgICAgICAgbmdBdWRpby5wbGF5KFwiYXVkaW8vbWVzc2FnZS5tcDNcIik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIFNvY2tldEZhY3Rvcnkub24oJ2hpc3Rvcnktc2VuZCcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAkc2NvcGUubWVzc2FnZXMgPSAkc2NvcGUubWVzc2FnZXMuY29uY2F0KHJlc3BvbnNlLm1lc3NhZ2VzKTtcclxuICAgICAgJHNjb3BlLnVwZGF0aW5nID0gZmFsc2U7XHJcbiAgICAgICRzY29wZS5pbmZpbml0ZVNjcm9sbERpc2FibGVkID0gZmFsc2U7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkc2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgIFNvY2tldEZhY3RvcnkuZGlzY29ubmVjdCgpO1xyXG4gICAgICBkZWxldGUgU29ja2V0RmFjdG9yeS5zb2NrZXQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICgkc2NvcGUudGV4dCA9PSBcIlwiKXtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBtZXNzYWdlRGF0YSA9IHtcclxuICAgICAgICB0ZXh0ICAgOiAkc2NvcGUudGV4dCxcclxuICAgICAgICBjaGF0SWQgOiAoJHJvdXRlUGFyYW1zLmlkIHx8ICdnZXJhbCcpLFxyXG4gICAgICAgIG1lbWJlciA6ICRzY29wZS5tZS5pZCxcclxuICAgICAgfVxyXG5cclxuICAgICAgU29ja2V0RmFjdG9yeS5lbWl0KCdzZW5kJywge3Jvb206ICRzY29wZS5yb29tLCBtZXNzYWdlOiBtZXNzYWdlRGF0YSB9LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdNZXNzYWdlIHNlbnQnKTtcclxuICAgICAgICAkc2NvcGUudGV4dCA9IFwiXCI7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBoaXN0b3J5ICgpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZygnU3RhcnQgaGlzdG9yeSByZXF1ZXN0Jyk7XHJcbiAgICAgIGlmKCEkc2NvcGUudXBkYXRpbmcpe1xyXG4gICAgICAgICRzY29wZS5pbmZpbml0ZVNjcm9sbERpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAkc2NvcGUudXBkYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgIFNvY2tldEZhY3RvcnkuZW1pdCgnaGlzdG9yeS1nZXQnLCB7cm9vbTogJHNjb3BlLnJvb20sIGRhdGU6ICRzY29wZS5tZXNzYWdlc1skc2NvcGUubWVzc2FnZXMubGVuZ3RoLTFdLmRhdGUgfSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCdTZW50IGhpc3RvcnkgcmVxdWVzdCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuIiwicmVxdWlyZSgnLi9saXN0Jyk7XHJcbnJlcXVpcmUoJy4vY2hhdCcpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoJ0NoYXRzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIENoYXRGYWN0b3J5KSB7XHJcblxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgQ2hhdEZhY3RvcnkuQ2hhdC5nZXRBbGwoZnVuY3Rpb24oY2hhdHMpIHtcclxuICAgICAgJHNjb3BlLmNoYXRzID0gY2hhdHM7XHJcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59KTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiQ29tbWVudEFyZWFDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsIE1lbWJlckZhY3RvcnksIENvbW1lbnRGYWN0b3J5KSB7XHJcblxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgJHNjb3BlLmNvbW1lbnREYXRhID0ge1xyXG4gICAgICBtYXJrZG93bjogXCJcIlxyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkQ29tbWVudHMoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkQ29tbWVudHMoKSB7XHJcbiAgICAgIGlmICgkc2NvcGUudGhyZWFkLnNwbGl0KFwiLVwiKVsxXSA9PT0gXCJcIikge1xyXG4gICAgICAgIHNldFRpbWVvdXQobG9hZENvbW1lbnRzLCA1MDApO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHRocmVhZElkO1xyXG4gICAgICB2YXIgdGhyZWFkVHlwZTtcclxuXHJcbiAgICAgIGlmKCRzY29wZS5zdWJ0aHJlYWQgJiYgJHNjb3BlLnN1YnRocmVhZCAhPSAnJykge1xyXG4gICAgICAgIHRocmVhZFR5cGUgPSAkc2NvcGUuc3VidGhyZWFkLnNwbGl0KCctJylbMF07XHJcbiAgICAgICAgdGhyZWFkSWQgPSAkc2NvcGUuc3VidGhyZWFkLnN1YnN0cmluZygkc2NvcGUuc3VidGhyZWFkLmluZGV4T2YoXCItXCIpICsgMSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyZWFkVHlwZSA9ICRzY29wZS50aHJlYWQuc3BsaXQoJy0nKVswXTtcclxuICAgICAgICB0aHJlYWRJZCA9ICRzY29wZS50aHJlYWQuc3Vic3RyaW5nKCRzY29wZS50aHJlYWQuaW5kZXhPZihcIi1cIikgKyAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpdGNoKHRocmVhZFR5cGUpIHtcclxuICAgICAgICBjYXNlIFwiY29tcGFueVwiOiBcclxuICAgICAgICAgIENvbW1lbnRGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKHtpZDogdGhyZWFkSWR9LCBnb3RDb21tZW50cyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwic3BlYWtlclwiOiBcclxuICAgICAgICAgIENvbW1lbnRGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKHtpZDogdGhyZWFkSWR9LCBnb3RDb21tZW50cyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwidG9waWNcIjogXHJcbiAgICAgICAgICBDb21tZW50RmFjdG9yeS5Ub3BpYy5nZXRBbGwoe2lkOiB0aHJlYWRJZH0sIGdvdENvbW1lbnRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJjb21tdW5pY2F0aW9uXCI6IFxyXG4gICAgICAgICAgQ29tbWVudEZhY3RvcnkuQ29tbXVuaWNhdGlvbi5nZXRBbGwoe2lkOiB0aHJlYWRJZH0sIGdvdENvbW1lbnRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBnb3RDb21tZW50cyhjb21tZW50cykge1xyXG4gICAgICAgICRzY29wZS5jb21tZW50cyA9IGNvbW1lbnRzO1xyXG5cclxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnBvc3RDb21tZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duID09PSBcIlwiKXtcclxuICAgICAgICAkc2NvcGUuZW1wdHlDb21tZW50ID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBkYXRlID0gRGF0ZS5ub3coKTtcclxuICAgICAgQ29tbWVudEZhY3RvcnkuQ29tbWVudC5jcmVhdGUoe1xyXG4gICAgICAgIHRocmVhZDogJHNjb3BlLnRocmVhZCxcclxuICAgICAgICBzdWJ0aHJlYWQ6ICRzY29wZS5zdWJ0aHJlYWQsXHJcbiAgICAgICAgbWVtYmVyOiAkc2NvcGUubWUuaWQsXHJcbiAgICAgICAgbWFya2Rvd246ICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93bixcclxuICAgICAgICBodG1sOiAkc2NvcGUuY29udmVydE1hcmtkb3duVG9IdG1sKCRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biksXHJcbiAgICAgICAgcG9zdGVkOiBkYXRlLFxyXG4gICAgICAgIHVwZGF0ZWQ6IGRhdGVcclxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duID0gXCJcIjtcclxuICAgICAgICAkc2NvcGUuY29tbWVudEZvcm0uJHNldFByaXN0aW5lKCk7XHJcbiAgICAgICAgbG9hZENvbW1lbnRzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuc2F2ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xyXG4gICAgICBpZiAoY29tbWVudC5idWZmZXIgPT09IFwiXCIpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbW1lbnQubWFya2Rvd24gPSBjb21tZW50LmJ1ZmZlcjtcclxuICAgICAgY29tbWVudC5odG1sID0gJHNjb3BlLmNvbnZlcnRNYXJrZG93blRvSHRtbChjb21tZW50Lm1hcmtkb3duKTtcclxuICAgICAgY29tbWVudC51cGRhdGVkID0gRGF0ZS5ub3coKTtcclxuXHJcbiAgICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQudXBkYXRlKHtpZDogY29tbWVudC5faWR9LCBjb21tZW50LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICBjb21tZW50LmJ1ZmZlciA9IFwiXCI7XHJcbiAgICAgICAgY29tbWVudC5lZGl0aW5nID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5xdW90ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xyXG4gICAgICAkc2NvcGUuY29tbWVudERhdGEubWFya2Rvd24gPSBcIj4gKipcIiArICRzY29wZS5nZXRNZW1iZXIoY29tbWVudC5tZW1iZXIpLm5hbWUgKyBcIiBzYWlkOioqXFxuPiBcIiArIGNvbW1lbnQubWFya2Rvd24uc3BsaXQoXCJcXG5cIikuam9pbihcIlxcbj4gXCIpICsgXCJcXG5cXG5cIjtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmRlbGV0ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xyXG4gICAgICBpZiAoY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBjb21tZW50P1wiKSkge1xyXG4gICAgICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQuZGVsZXRlKHtpZDogY29tbWVudC5faWR9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBsb2FkQ29tbWVudHMoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XHJcbiAgICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xyXG4gICAgICB9KVswXTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNvbnZlcnRUZXh0VG9IdG1sID0gZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcclxuICAgICAgdmFyIG1haWxFeHAgPSAvW1xcd1xcLlxcLV0rXFxAKFtcXHdcXC1dK1xcLikrW1xcd117Miw0fSg/IVtePF0qPikvaWc7XHJcblxyXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIikucmVwbGFjZShtYWlsRXhwLFwiPGEgaHJlZj0nIy9jb21wYW55L1wiKyRyb3V0ZVBhcmFtcy5pZCtcIi9jb25maXJtP2VtYWlsPSQmJz4kJjwvYT5cIik7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jb252ZXJ0TmV3TGluZXNUb0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicrdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKSsnPC9kaXY+JztcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNvbnZlcnRNYXJrZG93blRvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcclxuICAgICAgcmV0dXJuICc8ZGl2IGRhdGEtbWFya2Rvd24+JyArIHRleHQgKyAnPC9kaXY+JztcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNoZWNrUGVybWlzc2lvbiA9IGZ1bmN0aW9uIChjb21tZW50KSB7XHJcbiAgICAgIGlmKCEkc2NvcGUubWUucm9sZXMpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblxyXG4gICAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZihyb2xlcy5sZW5ndGggPT0gMCAmJiBjb21tZW50Lm1lbWJlciAhPSAkc2NvcGUubWUuaWQpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcclxuXHJcbiAgICAgIHZhciBzdWZmaXggPSAnYWdvJztcclxuICAgICAgaWYoc2Vjb25kcyA8IDApe1xyXG4gICAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcclxuICAgICAgICBzdWZmaXggPSAndG8gZ28nO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XHJcblxyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uICh0aW1lKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lKS50b1VUQ1N0cmluZygpO1xyXG4gICAgfTtcclxuICB9XHJcbn0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJGaXJzdENvbW1lbnRDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsIE1lbWJlckZhY3RvcnksIENvbW1lbnRGYWN0b3J5KSB7XHJcblxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgJHNjb3BlLmNvbW1lbnREYXRhID0ge1xyXG4gICAgICBtYXJrZG93bjogXCJcIlxyXG4gICAgfTtcclxuXHJcbiAgICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXQoe2lkOiBcIm1lXCJ9LCBmdW5jdGlvbiAobWUpIHtcclxuICAgICAgJHNjb3BlLm1lID0gbWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXRBbGwoZnVuY3Rpb24gKG1lbWJlcnMpIHtcclxuICAgICAgJHNjb3BlLm1lbWJlcnMgPSBtZW1iZXJzO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbG9hZENvbW1lbnRzKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZENvbW1lbnRzKCkge1xyXG4gICAgICBpZiAoJHNjb3BlLnRocmVhZC5zcGxpdChcIi1cIilbMV0gPT09IFwiXCIpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KGxvYWRDb21tZW50cywgNTAwKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBwYWdlSWQgPSAkc2NvcGUudGhyZWFkLnN1YnN0cmluZygkc2NvcGUudGhyZWFkLmluZGV4T2YoXCItXCIpICsgMSk7XHJcblxyXG4gICAgICBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiY29tcGFueS1cIikgIT0gLTEpIHtcclxuICAgICAgICBDb21tZW50RmFjdG9yeS5Db21wYW55LmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJzcGVha2VyLVwiKSAhPSAtMSkge1xyXG4gICAgICAgIENvbW1lbnRGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKHtpZDogcGFnZUlkfSwgZ290Q29tbWVudHMpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKCRzY29wZS50aHJlYWQuaW5kZXhPZihcInRvcGljLVwiKSAhPSAtMSkge1xyXG4gICAgICAgIENvbW1lbnRGYWN0b3J5LlRvcGljLmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ290Q29tbWVudHMoY29tbWVudHMpIHtcclxuICAgICAgICAkc2NvcGUuY29tbWVudHMgPSBbXTtcclxuICAgICAgICB2YXIgZmlyc3RDb21tZW50ID0gY29tbWVudHMuc29ydChmdW5jdGlvbihhLGIpe1xyXG4gICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGEucG9zdGVkKSAtIG5ldyBEYXRlKGIucG9zdGVkKTtcclxuICAgICAgICB9KVswXTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5wb3N0Q29tbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biA9PT0gXCJcIil7XHJcbiAgICAgICAgJHNjb3BlLmVtcHR5Q29tbWVudCA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZGF0ZSA9IERhdGUubm93KCk7XHJcbiAgICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQuY3JlYXRlKHtcclxuICAgICAgICB0aHJlYWQ6ICRzY29wZS50aHJlYWQsXHJcbiAgICAgICAgbWVtYmVyOiAkc2NvcGUubWUuaWQsXHJcbiAgICAgICAgbWFya2Rvd246ICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93bixcclxuICAgICAgICBodG1sOiAkc2NvcGUuY29udmVydE1hcmtkb3duVG9IdG1sKCRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biksXHJcbiAgICAgICAgcG9zdGVkOiBkYXRlLFxyXG4gICAgICAgIHVwZGF0ZWQ6IGRhdGVcclxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duID0gXCJcIjtcclxuICAgICAgICBsb2FkQ29tbWVudHMoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnNhdmVDb21tZW50ID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcclxuICAgICAgaWYgKGNvbW1lbnQuYnVmZmVyID09PSBcIlwiKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb21tZW50Lm1hcmtkb3duID0gY29tbWVudC5idWZmZXI7XHJcbiAgICAgIGNvbW1lbnQuaHRtbCA9ICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwoY29tbWVudC5tYXJrZG93bik7XHJcbiAgICAgIGNvbW1lbnQudXBkYXRlZCA9IERhdGUubm93KCk7XHJcblxyXG4gICAgICBDb21tZW50RmFjdG9yeS5Db21tZW50LnVwZGF0ZSh7aWQ6IGNvbW1lbnQuX2lkfSwgY29tbWVudCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgY29tbWVudC5lZGl0aW5nID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5xdW90ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xyXG4gICAgICAkc2NvcGUuY29tbWVudERhdGEubWFya2Rvd24gPSBcIj4gKipcIiArICRzY29wZS5nZXRNZW1iZXIoY29tbWVudC5tZW1iZXIpLm5hbWUgKyBcIiBzYWlkOioqXFxuPiBcIiArIGNvbW1lbnQubWFya2Rvd24uc3BsaXQoXCJcXG5cIikuam9pbihcIlxcbj4gXCIpICsgXCJcXG5cXG5cIjtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmRlbGV0ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xyXG4gICAgICBpZiAoY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBjb21tZW50P1wiKSkge1xyXG4gICAgICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQuZGVsZXRlKHtpZDogY29tbWVudC5faWR9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBsb2FkQ29tbWVudHMoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XHJcbiAgICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xyXG4gICAgICB9KVswXTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNvbnZlcnRUZXh0VG9IdG1sID0gZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcclxuICAgICAgdmFyIG1haWxFeHAgPSAvW1xcd1xcLlxcLV0rXFxAKFtcXHdcXC1dK1xcLikrW1xcd117Miw0fSg/IVtePF0qPikvaWc7XHJcblxyXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIikucmVwbGFjZShtYWlsRXhwLFwiPGEgaHJlZj0nIy9jb21wYW55L1wiKyRyb3V0ZVBhcmFtcy5pZCtcIi9jb25maXJtP2VtYWlsPSQmJz4kJjwvYT5cIik7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jb252ZXJ0TmV3TGluZXNUb0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicrdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKSsnPC9kaXY+JztcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNvbnZlcnRNYXJrZG93blRvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcclxuICAgICAgcmV0dXJuICc8ZGl2IGRhdGEtbWFya2Rvd24+JyArIHRleHQgKyAnPC9kaXY+JztcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNoZWNrUGVybWlzc2lvbiA9IGZ1bmN0aW9uIChjb21tZW50KSB7XHJcbiAgICAgIGlmKCEkc2NvcGUubWUucm9sZXMpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblxyXG4gICAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZihyb2xlcy5sZW5ndGggPT0gMCAmJiBjb21tZW50Lm1lbWJlciAhPSAkc2NvcGUubWUuaWQpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcclxuXHJcbiAgICAgIHZhciBzdWZmaXggPSAnYWdvJztcclxuICAgICAgaWYoc2Vjb25kcyA8IDApe1xyXG4gICAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcclxuICAgICAgICBzdWZmaXggPSAndG8gZ28nO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XHJcblxyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uICh0aW1lKSB7XHJcbiAgICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lKS50b1VUQ1N0cmluZygpO1xyXG4gICAgfTtcclxuICB9XHJcbn0pO1xyXG4iLCJyZXF1aXJlKCcuL2FyZWEuanMnKTtcclxucmVxdWlyZSgnLi9maXJzdC5qcycpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJDb21tdW5pY2F0aW9uQXJlYUNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgQ29tbXVuaWNhdGlvbkZhY3RvcnkpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEgPSB7XHJcbiAgICAgIG1hcmtkb3duOiBcIlwiXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5tZSA9IEpTT04ucGFyc2UoJHNjb3BlLm1lSnNvbik7XHJcbiAgICAkc2NvcGUubWVtYmVycyA9IEpTT04ucGFyc2UoJHNjb3BlLm1lbWJlcnNKc29uKTtcclxuICAgICRzY29wZS5yb2xlcyA9IEpTT04ucGFyc2UoJHNjb3BlLnJvbGVzSnNvbik7XHJcblxyXG4gICAgbG9hZENvbW11bmljYXRpb25zKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZENvbW11bmljYXRpb25zKCkge1xyXG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICBpZiAoJHNjb3BlLnRocmVhZC5zcGxpdChcIi1cIilbMV0gPT09IFwiXCIpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KGxvYWRDb21tdW5pY2F0aW9ucywgNTAwKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBwYWdlSWQgPSAkc2NvcGUudGhyZWFkLnN1YnN0cmluZygkc2NvcGUudGhyZWFkLmluZGV4T2YoXCItXCIpICsgMSk7XHJcblxyXG4gICAgICBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiY29tcGFueS1cIikgIT0gLTEpIHtcclxuICAgICAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21wYW55LmdldEFsbCgge2lkOiBwYWdlSWR9LCBnb3RDb21tdW5pY2F0aW9ucyk7XHJcbiAgICAgICAgJHNjb3BlLmtpbmRzPVsnRW1haWwgVG8nLCAnRW1haWwgRnJvbScsICdNZWV0aW5nJywgJ1Bob25lIENhbGwnXTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJzcGVha2VyLVwiKSAhPSAtMSkge1xyXG4gICAgICAgIENvbW11bmljYXRpb25GYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKCB7aWQ6IHBhZ2VJZH0sIGdvdENvbW11bmljYXRpb25zKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ290Q29tbXVuaWNhdGlvbnMoY29tbXVuaWNhdGlvbnMpIHtcclxuICAgICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbnMgPSBjb21tdW5pY2F0aW9ucztcclxuXHJcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKCRzY29wZS50aHJlYWQuaW5kZXhPZihcInNwZWFrZXItXCIpICE9IC0xKSB7XHJcbiAgICAgICAgICBpZihjb21tdW5pY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgICAgICByZXR1cm4gby5raW5kLmluZGV4T2YoJ1BhcmFncmFwaCcpICE9IC0xO1xyXG4gICAgICAgICAgfSkubGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgJHNjb3BlLmtpbmRzPVsnRW1haWwgVG8nLCAnRW1haWwgRnJvbScsICdNZWV0aW5nJywgJ1Bob25lIENhbGwnXTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRzY29wZS5raW5kcz1bJ0luaXRhbCBFbWFpbCBQYXJhZ3JhcGgnLCdFbWFpbCBUbycsICdFbWFpbCBGcm9tJywgJ01lZXRpbmcnLCAnUGhvbmUgQ2FsbCddO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5wb3N0Q29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCEkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEua2luZCB8fCAkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEua2luZD09IFwiXCIpe1xyXG4gICAgICAgICRzY29wZS5lbXB0eUNvbW11bmljYXRpb24gPSB0cnVlO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpZiAoISRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0IHx8ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0PT0gXCJcIil7XHJcbiAgICAgICAgJHNjb3BlLmVtcHR5Q29tbXVuaWNhdGlvbiA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZGF0ZSA9IERhdGUubm93KCk7XHJcblxyXG4gICAgICAvL2NvbnNvbGUubG9nKCRzY29wZS5ldmVudCk7XHJcblxyXG4gICAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLmNyZWF0ZSh7XHJcbiAgICAgICAgdGhyZWFkOiAkc2NvcGUudGhyZWFkLFxyXG4gICAgICAgIG1lbWJlcjogJHNjb3BlLm1lLmlkLFxyXG4gICAgICAgIGtpbmQ6ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS5raW5kLFxyXG4gICAgICAgIHRleHQ6ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0LFxyXG4gICAgICAgIGV2ZW50OiAkc2NvcGUuZXZlbnQuaWQsXHJcbiAgICAgICAgcG9zdGVkOiBkYXRlLFxyXG4gICAgICAgIHVwZGF0ZWQ6IGRhdGVcclxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgJHNjb3BlLmNvbW11bmljYXRpb25EYXRhLnRleHQgPSBcIlwiO1xyXG4gICAgICAgICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS5raW5kID0gXCJcIjtcclxuICAgICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbkZvcm0uJHNldFByaXN0aW5lKCk7XHJcbiAgICAgICAgbG9hZENvbW11bmljYXRpb25zKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5zYXZlQ29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XHJcbiAgICAgIGlmIChjb21tdW5pY2F0aW9uLmJ1ZmZlciA9PT0gXCJcIikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29tbXVuaWNhdGlvbi50ZXh0ID0gY29tbXVuaWNhdGlvbi5idWZmZXI7XHJcbiAgICAgIGNvbW11bmljYXRpb24udXBkYXRlZCA9IERhdGUubm93KCk7XHJcblxyXG4gICAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLnVwZGF0ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgY29tbXVuaWNhdGlvbiwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgY29tbXVuaWNhdGlvbi5lZGl0aW5nID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5kZWxldGVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcclxuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5kZWxldGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsb2FkQ29tbXVuaWNhdGlvbnMoKTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5hcHByb3ZlQ29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XHJcbiAgICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uYXBwcm92ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgbnVsbCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgbG9hZENvbW11bmljYXRpb25zKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XHJcbiAgICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xyXG4gICAgICB9KVswXTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNoZWNrUGVybWlzc2lvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XHJcbiAgICAgIHZhciByb2xlcyA9ICRzY29wZS5tZS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmKHJvbGVzLmxlbmd0aCA9PSAwICYmIGNvbW11bmljYXRpb24ubWVtYmVyICE9ICRzY29wZS5tZS5pZCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xyXG5cclxuICAgICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xyXG4gICAgICBpZihzZWNvbmRzIDwgMCl7XHJcbiAgICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHNlY29uZHMpO1xyXG4gICAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcclxuXHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgZGF5cyBcIiArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jb252ZXJ0VVJMcyA9IGZ1bmN0aW9uKHRleHQpIHtcclxuICAgICAgdmFyIHVybEV4cCA9IC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWc7XHJcblxyXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNvbW11bmljYXRpb25FbWJlZENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgQ29tbXVuaWNhdGlvbkZhY3RvcnkpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgJHNjb3BlLnN1Y2Nlc3MgICAgID0gXCJcIjtcclxuICAgICRzY29wZS5lcnJvciAgICAgICA9IFwiXCI7XHJcblxyXG4gICAgJHNjb3BlLmNvbW11bmljYXRpb24uZWRpdGluZyA9IGZhbHNlO1xyXG4gICAgJHNjb3BlLmNvbW11bmljYXRpb24uZGVsZXRlZCA9IGZhbHNlO1xyXG5cclxuXHJcbiAgICAkc2NvcGUuc2F2ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xyXG4gICAgICBpZiAoY29tbXVuaWNhdGlvbi5idWZmZXIgPT09IFwiXCIpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbW11bmljYXRpb24udGV4dCA9IGNvbW11bmljYXRpb24uYnVmZmVyO1xyXG4gICAgICBjb21tdW5pY2F0aW9uLnVwZGF0ZWQgPSBEYXRlLm5vdygpO1xyXG5cclxuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi51cGRhdGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIGNvbW11bmljYXRpb24sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGNvbW11bmljYXRpb24uZWRpdGluZyA9IGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuZGVsZXRlQ29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XHJcbiAgICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uZGVsZXRlKHtpZDogY29tbXVuaWNhdGlvbi5faWR9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLmNvbW11bmljYXRpb24uZGVsZXRlZCA9IHRydWU7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuc2V0Q29tbXVuaWNhdGlvblN0YXR1cyA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uLCBzdGF0dXMpIHtcclxuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi51cGRhdGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIHtzdGF0dXM6IHN0YXR1c30sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICRzY29wZS5jb21tdW5pY2F0aW9uLnN0YXR1cyA9IHN0YXR1cztcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcclxuICAgICAgcmV0dXJuICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XHJcbiAgICAgIH0pWzBdO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcclxuICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgICAgcmV0dXJuIG8uaWQgPT0gJ2RldmVsb3BtZW50LXRlYW0nIHx8IG8uaWQgPT0gJ2Nvb3JkaW5hdGlvbic7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYocm9sZXMubGVuZ3RoID09IDAgJiYgY29tbXVuaWNhdGlvbi5tZW1iZXIgIT0gJHNjb3BlLm1lLmlkKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XHJcbiAgICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIGRhdGUpIC8gMTAwMCk7XHJcblxyXG4gICAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XHJcbiAgICAgIGlmKHNlY29uZHMgPCAwKXtcclxuICAgICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XHJcbiAgICAgICAgc3VmZml4ID0gJ3RvIGdvJztcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xyXG5cclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbW9udGhzIFwiICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtaW51dGVzIFwiICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAodGltZSkge1xyXG4gICAgICByZXR1cm4gbmV3IERhdGUodGltZSkudG9VVENTdHJpbmcoKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNvbnZlcnRVUkxzID0gZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcclxuXHJcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpLnJlcGxhY2UodXJsRXhwLFwiPGEgaHJlZj0nJDEnPiQxPC9hPlwiKTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG4iLCJyZXF1aXJlKCcuL2FyZWEuanMnKTtcclxucmVxdWlyZSgnLi9saXN0LmpzJyk7XHJcbnJlcXVpcmUoJy4vZW1iZWQuanMnKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXJcclxuICAuY29udHJvbGxlcignQ29tbXVuaWNhdGlvbnNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb3V0ZVBhcmFtcywgJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgQ29tbXVuaWNhdGlvbkZhY3RvcnkpIHtcclxuICAgICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG4gICAgICBcclxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5nZXRBbGwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICRzY29wZS5jb21tdW5pY2F0aW9ucyA9IHJlc3BvbnNlO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICRzY29wZS5zaG93T3BlbiA9IHRydWU7XHJcblxyXG4gICAgICAkc2NvcGUuc2hvd25Db21tdW5pY2F0aW9ucyA9IGZ1bmN0aW9uIChzaG93T3Blbikge1xyXG4gICAgICAgIHJldHVybiAkc2NvcGUuY29tbXVuaWNhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICAgIHJldHVybiAoc2hvd09wZW4gPyAhKG8uc3RhdHVzPT0nYXBwcm92ZWQnKSA6IG8uc3RhdHVzPT0nYXBwcm92ZWQnKSAmJiAkcm91dGVQYXJhbXMua2luZCA9PSBvLnRocmVhZC5zcGxpdCgnLScpWzBdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXJcclxuICAuY29udHJvbGxlcignQ29tcGFueUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJGxvY2F0aW9uLCAkcm91dGVQYXJhbXMsICRzY2UsIENvbXBhbnlGYWN0b3J5LCBNZW1iZXJGYWN0b3J5LCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XHJcblxyXG4gICAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XHJcblxyXG4gICAgICAkc2NvcGUudHJ1c3RTcmMgPSBmdW5jdGlvbihzcmMpIHtcclxuICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoc3JjKycjcGFnZS1ib2R5Jyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5jb252ZXJ0RW1haWxzID0gZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICAgIHZhciBtYWlsRXhwID0gL1tcXHdcXC5cXC1dK1xcQChbXFx3XFwtXStcXC4pK1tcXHddezIsNH0oPyFbXjxdKj4pL2lnO1xyXG4gICAgICAgIHZhciB0d2l0dGVyRXhwID0gLyhefFteQFxcd10pQChcXHd7MSwxNX0pXFxiL2c7XHJcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShtYWlsRXhwLFwiPGEgaHJlZj0nIy9jb21wYW55L1wiKyRyb3V0ZVBhcmFtcy5pZCtcIi9jb25maXJtP2VtYWlsPSQmJz4kJjwvYT5cIikucmVwbGFjZSh0d2l0dGVyRXhwLFwiJDE8YSBocmVmPSdodHRwOi8vdHdpdHRlci5jb20vJDInIHRhcmdldD0nX2JsYW5rJz4kMjwvYT5cIilcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjb21wYW55RGF0YSA9IHRoaXMuZm9ybURhdGE7XHJcblxyXG4gICAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkudXBkYXRlKHsgaWQ6Y29tcGFueURhdGEuaWQgfSwgY29tcGFueURhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2Uuc3VjY2VzcztcclxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ2NvbXBhbnkvJytjb21wYW55RGF0YS5pZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuZGVsZXRlQ29tcGFueSA9IGZ1bmN0aW9uKGNvbXBhbnkpIHtcclxuICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmRlbGV0ZSh7IGlkOmNvbXBhbnkuaWQgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ2NvbXBhbmllcy8nKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYocm9sZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zdGF0dXNlcyA9IFsnU3VnZ2VzdGlvbicsJ0NvbnRhY3RlZCcsJ0luIENvbnZlcnNhdGlvbnMnLCdJbiBOZWdvdGlhdGlvbnMnLCdDbG9zZWQgRGVhbCcsJ1JlamVjdGVkJywnR2l2ZSBVcCddO1xyXG4gICAgICAkc2NvcGUubG9nb1NpemVzID0gW251bGwsICdTJywnTScsJ0wnXTtcclxuICAgICAgJHNjb3BlLnN0YW5kRGF5cyA9IFtudWxsLCAxLDIsMyw0LDVdO1xyXG4gICAgICAkc2NvcGUucG9zdHNOdW1iZXJzID0gW251bGwsIDEsMiwzLDQsNV07XHJcblxyXG4gICAgICAkc2NvcGUuY29tcGFueSA9ICRzY29wZS5mb3JtRGF0YSA9ICRzY29wZS5nZXRDb21wYW55KCRyb3V0ZVBhcmFtcy5pZCk7XHJcblxyXG4gICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmdldCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSAkc2NvcGUuZm9ybURhdGEgPSByZXNwb25zZTtcclxuXHJcbiAgICAgICAgTm90aWZpY2F0aW9uRmFjdG9yeS5Db21wYW55LmdldEFsbCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKGdldERhdGEpIHtcclxuICAgICAgICAgICRzY29wZS5jb21wYW55Lm5vdGlmaWNhdGlvbnMgPSBnZXREYXRhO1xyXG5cclxuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sQ29udHJvbGxlclxyXG4gIC5jb250cm9sbGVyKCdDb21wYW55RW1haWxDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgJGxvY2F0aW9uLCBFbWFpbEZhY3RvcnkpIHtcclxuICAgICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgICAgJHNjb3BlLmVtYWlsID0gJGxvY2F0aW9uLnNlYXJjaCgpLmVtYWlsO1xyXG4gICAgICAkc2NvcGUuY29tcGFueUlkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xyXG4gICAgICAkc2NvcGUubWVzc2FnZSA9IG51bGw7XHJcblxyXG4gICAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XHJcbiAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBudWxsO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwic2VuZCBlbWFpbCB0byBcIiwgJHNjb3BlLmVtYWlsLCBcIiBmcm9tIFwiLCAkc2NvcGUuY29tcGFueUlkKTtcclxuXHJcbiAgICAgICAgRW1haWxGYWN0b3J5LkNvbXBhbnkuc2VuZCh7IGlkOiAkc2NvcGUuY29tcGFueUlkIH0sIHsgZW1haWw6ICRzY29wZS5lbWFpbCB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbiBcclxudGhlVG9vbENvbnRyb2xsZXJcclxuICAuY29udHJvbGxlcignQ3JlYXRlQ29tcGFueUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24sIENvbXBhbnlGYWN0b3J5KSB7XHJcbiAgICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuICAgICAgXHJcbiAgICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgY29tcGFueURhdGEgPSB0aGlzLmZvcm1EYXRhO1xyXG5cclxuICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmNyZWF0ZShjb21wYW55RGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS5nZXRBbGwoZnVuY3Rpb24gKGNvbXBhbmllcykge1xyXG4gICAgICAgICAgICAgICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvY29tcGFueS9cIiArIHJlc3BvbnNlLmlkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zdGF0dXNlcyA9IFsnU3VnZ2VzdGlvbicsJ0NvbnRhY3RlZCcsJ0luIENvbnZlcnNhdGlvbnMnLCdJbiBOZWdvdGlhdGlvbnMnLCdDbG9zZWQgRGVhbCcsJ1JlamVjdGVkJywnR2l2ZSBVcCddO1xyXG4gICAgfVxyXG4gIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoJ0NvbXBhbnlFbWJlZENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlKSB7XHJcblxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICBpZigkc2NvcGUuY29tbWVudHMpIHtcclxuICAgICAgJHNjb3BlLmNvbXBhbnkuY29tbWVudHMgPSAkc2NvcGUuY29tbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICByZXR1cm4gZS50aHJlYWQgPT0gJ2NvbXBhbnktJyskc2NvcGUuY29tcGFueS5pZDtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoJHNjb3BlLmV2ZW50KSB7XHJcbiAgICAgICRzY29wZS5wYXJ0aWNpcGF0aW9uID0gJHNjb3BlLmNvbXBhbnkucGFydGljaXBhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICByZXR1cm4gby5ldmVudCA9PSAkc2NvcGUuZXZlbnQuaWQ7XHJcbiAgICAgIH0pWzBdO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcclxuICAgICAgdmFyIG1lbWJlciA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYobWVtYmVyLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgcmV0dXJuIG1lbWJlclswXTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgbmFtZTogJ05vIG9uZScsXHJcbiAgICAgICAgICBmYWNlYm9vazogJzEwMDAwMDQ1NjMzNTk3MidcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5nZXRVbnJlYWROb3RpZmljYXRpb25zID0gZnVuY3Rpb24gKHRocmVhZCkge1xyXG4gICAgICB2YXIgbm90aWZpY2F0aW9ucyA9ICRzY29wZS5ub3RpZmljYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgICAgcmV0dXJuIG8udGhyZWFkID09IHRocmVhZDtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBub3RpZmljYXRpb25zO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY29tcGFueS51bnJlYWQgPSAkc2NvcGUuZ2V0VW5yZWFkTm90aWZpY2F0aW9ucygnY29tcGFueS0nICsgJHNjb3BlLmNvbXBhbnkuaWQpLmxlbmd0aCA+IDA7XHJcblxyXG4gICAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xyXG5cclxuICAgICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xyXG4gICAgICBpZihzZWNvbmRzIDwgMCl7XHJcbiAgICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHNlY29uZHMpO1xyXG4gICAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcclxuXHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArICcgeWVhcnMgJyArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyAnIG1vbnRocyAnICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyAnIGRheXMgJyArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyAnIGhvdXJzICcgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArICcgbWludXRlcyAnICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgJyBzZWNvbmRzICcgKyBzdWZmaXg7XHJcbiAgICB9O1xyXG4gIH1cclxufSk7XHJcbiIsInJlcXVpcmUoJy4vY29tcGFueS5qcycpO1xyXG5yZXF1aXJlKCcuL2xpc3QuanMnKTtcclxucmVxdWlyZSgnLi9jcmVhdGUuanMnKTtcclxucmVxdWlyZSgnLi9jb25maXJtLmpzJyk7XHJcbnJlcXVpcmUoJy4vZW1iZWQuanMnKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sQ29udHJvbGxlclxyXG4gIC5jb250cm9sbGVyKCdDb21wYW5pZXNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRzY2UsIENvbXBhbnlGYWN0b3J5KSB7XHJcblxyXG4gICAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XHJcbiAgICAgICRzY29wZS5zYXZlU3RhdHVzID0gZnVuY3Rpb24oY29tcGFueSkge1xyXG4gICAgICAgIHZhciBjb21wYW55RGF0YSA9IGNvbXBhbnk7XHJcblxyXG4gICAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkudXBkYXRlKHsgaWQ6Y29tcGFueS5pZCB9LCBjb21wYW55RGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLmdldENsYXNzRnJvbVBheW1lbnRTdGF0dXMgPSBmdW5jdGlvbihwYXJ0aWNpcGF0aW9uKSB7XHJcbiAgICAgICAgaWYoIXBhcnRpY2lwYXRpb24pIHsgcmV0dXJuICdncmV5JzsgfVxyXG4gICAgICAgIGlmKCFwYXJ0aWNpcGF0aW9uLnBheW1lbnQpIHsgcmV0dXJuICdncmV5JzsgfVxyXG4gICAgICAgIGlmKCFwYXJ0aWNpcGF0aW9uLnBheW1lbnQuc3RhdHVzKSB7IHJldHVybiAnZ3JleSc7IH1cclxuICAgICAgICB2YXIgc3RhdHVzID0gcGFydGljaXBhdGlvbi5wYXltZW50LnN0YXR1cy50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgICAgICBpZihzdGF0dXMuaW5kZXhPZigncGFnbycpICE9IC0xIHx8IHN0YXR1cy5pbmRleE9mKCdlbWl0aWRvJykgIT0gLTEgfHwgc3RhdHVzLmluZGV4T2YoJ3JlY2libyBlbnZpYWRvJykgIT0gLTEpIHsgcmV0dXJuICdsaW1lJzsgfVxyXG4gICAgICAgIGVsc2UgaWYoc3RhdHVzLmluZGV4T2YoJ2VudmlhZG8nKSAhPSAtMSkgeyByZXR1cm4gJ29yYW5nZSc7IH1cclxuICAgICAgICBlbHNlIHsgcmV0dXJuICdncmV5JzsgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnBheW1lbnRTdGF0dXNlcyA9IFsnRW1pdGlkbycsICdSZWNpYm8gRW52aWFkbycsICdQYWdvJywgJ0VudmlhZG8nXTtcclxuXHJcbiAgICAgICRzY29wZS5saW1pdCA9IDIwO1xyXG5cclxuICAgICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnQ29udGFjdGVkJywnSW4gQ29udmVyc2F0aW9ucycsJ0luIE5lZ290aWF0aW9ucycsJ0Nsb3NlZCBEZWFsJywnUmVqZWN0ZWQnLCdHaXZlIFVwJ107XHJcblxyXG4gICAgICAkc2NvcGUuY29tcGFueVByZWRpY2F0ZSA9ICd1cGRhdGVkJztcclxuICAgICAgJHNjb3BlLnJldmVyc2UgPSAndHJ1ZSc7XHJcbiAgICAgICRzY29wZS51bnJlYWRGaXJzdCA9IHRydWU7XHJcblxyXG4gICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmdldEFsbChmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICRzY29wZS5wcmVkaWNhdGUgPSAndXBkYXRlZCc7XHJcbiAgICAgICAgJHNjb3BlLnJldmVyc2UgPSB0cnVlO1xyXG4gICAgICAgICRzY29wZS5jb21wYW5pZXMgPSByZXNwb25zZTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkc2NvcGUuc2Nyb2xsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCRzY29wZS5saW1pdCA8PSAkc2NvcGUuY29tcGFuaWVzLmxlbmd0aClcclxuICAgICAgICAgICRzY29wZS5saW1pdCArPSA4O1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLmNoZWNrUGVybWlzc2lvbiA9IGZ1bmN0aW9uIChtZW1iZXIpIHtcclxuICAgICAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZihyb2xlcy5sZW5ndGggPT09IDAgJiYgbWVtYmVyLmlkICE9ICRzY29wZS5tZS5pZCkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuYWRkQ29tcGFueSA9IGZ1bmN0aW9uKG1lbWJlciwgbmV3Q29tcGFueSkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2cobmV3Q29tcGFueSk7XHJcbiAgICAgICAgdmFyIGNvbXBhbnlEYXRhID0gbmV3Q29tcGFueTtcclxuXHJcbiAgICAgICAgaWYobmV3Q29tcGFueS5pZCkge1xyXG4gICAgICAgICAgdmFyIHBhcnRpY2lwYXRpb24gPSAkc2NvcGUuZ2V0UGFydGljaXBhdGlvbihjb21wYW55RGF0YSwgJHNjb3BlLmN1cnJlbnRFdmVudC5pZCk7XHJcbiAgICAgICAgICBpZihwYXJ0aWNpcGF0aW9uKSB7XHJcbiAgICAgICAgICAgIHBhcnRpY2lwYXRpb24ubWVtYmVyID0gbWVtYmVyLmlkO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29tcGFueURhdGEucGFydGljaXBhdGlvbnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgZXZlbnQ6ICRzY29wZS5jdXJyZW50RXZlbnQuaWQsXHJcbiAgICAgICAgICAgICAgc3RhdHVzOiAnU2VsZWN0ZWQnLFxyXG4gICAgICAgICAgICAgIG1lbWJlcjogbWVtYmVyLmlkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS51cGRhdGUoeyBpZDogY29tcGFueURhdGEuaWQgfSwgeyBwYXJ0aWNpcGF0aW9uczogY29tcGFueURhdGEucGFydGljaXBhdGlvbnMgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLnN1Y2Nlc3M7XHJcblxyXG4gICAgICAgICAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKGZ1bmN0aW9uIChjb21wYW5pZXMpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb21wYW55RGF0YS5wYXJ0aWNpcGF0aW9ucyA9IFt7XHJcbiAgICAgICAgICAgIGV2ZW50OiAkc2NvcGUuY3VycmVudEV2ZW50LmlkLFxyXG4gICAgICAgICAgICBzdGF0dXM6ICdTZWxlY3RlZCcsXHJcbiAgICAgICAgICAgIG1lbWJlcjogbWVtYmVyLmlkXHJcbiAgICAgICAgICB9XTtcclxuXHJcbiAgICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmNyZWF0ZShjb21wYW55RGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XHJcblxyXG4gICAgICAgICAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKGZ1bmN0aW9uIChjb21wYW5pZXMpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG59KTtcclxuXHJcbiIsInRoZVRvb2xDb250cm9sbGVyID0gYW5ndWxhci5tb2R1bGUoJ3RoZVRvb2wuY29udHJvbGxlcnMnLCBbXSk7XHJcblxyXG5yZXF1aXJlKCcuL2F1dGgnKTtcclxucmVxdWlyZSgnLi9tYWluJyk7XHJcbnJlcXVpcmUoJy4vY29tcGFueScpO1xyXG5yZXF1aXJlKCcuL3NwZWFrZXInKTtcclxucmVxdWlyZSgnLi9tZW1iZXInKTtcclxucmVxdWlyZSgnLi9jb21tZW50Jyk7XHJcbnJlcXVpcmUoJy4vbWVldGluZycpO1xyXG5yZXF1aXJlKCcuL2NoYXQnKTtcclxucmVxdWlyZSgnLi90b3BpYycpO1xyXG5yZXF1aXJlKCcuL2NvbW11bmljYXRpb24nKTtcclxucmVxdWlyZSgnLi90YWcnKTtcclxucmVxdWlyZSgnLi9zdWJzY3JpcHRpb24nKTtcclxucmVxdWlyZSgnLi9hZG1pbicpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJob21lXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIE5vdGlmaWNhdGlvbkZhY3RvcnkpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuICAgICRzY29wZS5ub3RpZmljYXRpb25zID0gW107XHJcbiAgICAkc2NvcGUubGltaXQgPSAxMDtcclxuXHJcbiAgICBOb3RpZmljYXRpb25GYWN0b3J5Lk5vdGlmaWNhdGlvbi5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICRzY29wZS5ub3RpZmljYXRpb25zID0gcmVzcG9uc2U7XHJcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkc2NvcGUuc2Nyb2xsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoJHNjb3BlLmxpbWl0IDwgJHNjb3BlLm5vdGlmaWNhdGlvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgJHNjb3BlLmxpbWl0ICs9IDEwO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbn0pO1xyXG4iLCJyZXF1aXJlKCcuL21haW4uanMnKTtcclxucmVxdWlyZSgnLi9ob21lLmpzJyk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgJGxvY2F0aW9uLCAkd2luZG93LCAkcm9vdFNjb3BlLCBOb3RpZmljYXRpb25GYWN0b3J5LCBNZW1iZXJGYWN0b3J5LCBDb21wYW55RmFjdG9yeSwgU3BlYWtlckZhY3RvcnksIFRvcGljRmFjdG9yeSwgUm9sZUZhY3RvcnksIFRhZ0ZhY3RvcnksIENvbW1lbnRGYWN0b3J5LCBDaGF0RmFjdG9yeSwgRXZlbnRGYWN0b3J5LCBTZXNzaW9uRmFjdG9yeSwgSXRlbUZhY3RvcnkpIHtcclxuXHJcbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUlOSVRJQUxJWkFUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgJHNjb3BlLnJlYWR5ID0gZmFsc2U7XHJcblxyXG4gICRzY29wZS5kaXNwbGF5ID0gZmFsc2U7XHJcblxyXG4gICRzY29wZS5zZWFyY2ggPSB7fTtcclxuICAkc2NvcGUuc2VhcmNoVG9waWNzID0ge307XHJcbiAgJHNjb3BlLnNlYXJjaENvbXBhbmllcyA9IHt9O1xyXG4gICRzY29wZS5zZWFyY2hTcGVha2VycyA9IHt9O1xyXG4gICRzY29wZS5zZWFyY2hNZW1iZXJzID0ge307XHJcbiAgJHNjb3BlLmFjdGl2ZUV2ZW50ID0ge307XHJcblxyXG4gICRzY29wZS5tZSA9IHt9O1xyXG4gICRzY29wZS5tZW1iZXJzID0gW107XHJcbiAgJHNjb3BlLmNvbXBhbmllcyA9IFtdO1xyXG4gICRzY29wZS5zcGVha2VycyA9IFtdO1xyXG4gICRzY29wZS50b3BpY3MgPSBbXTtcclxuICAkc2NvcGUudGFyZ2V0Tm90aWZpY2F0aW9ucyA9IFtdO1xyXG4gICRzY29wZS51bnJlYWROb3RpZmljYXRpb25zID0gW107XHJcblxyXG4gICRzY29wZS50YXJnZXRJbmZvID0ge1xyXG4gICAgbnVtYmVyOiAwLFxyXG4gICAgdGV4dDogXCIgTG9hZGluZy4uLlwiXHJcbiAgfTtcclxuXHJcbiAgdmFyIGZhY3Rvcmllc1JlYWR5ID0gMDtcclxuXHJcbiAgJHNjb3BlLnNldEN1cnJlbnRFdmVudCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAkc2NvcGUuY3VycmVudEV2ZW50ID0ge307XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7JHNjb3BlLmN1cnJlbnRFdmVudCA9IGV2ZW50O30sMTApO1xyXG4gIH1cclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUgPSB7XHJcblxyXG4gICAgcnVubmluZzogZmFsc2UsXHJcblxyXG4gICAgdGltZW91dDogZnVuY3Rpb24oY2Ipe1xyXG4gICAgICBpZighJHNjb3BlLnJlYWR5KXtcclxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgaWYoISRyb290U2NvcGUudXBkYXRlLnJ1bm5pbmcpe1xyXG4gICAgICAgICAgJHJvb3RTY29wZS51cGRhdGUuYWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7ICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQoY2IpIH0sIDE1MDApO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgY2IoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbWU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIE1lbWJlckZhY3RvcnkuTWUuZ2V0KGZ1bmN0aW9uIChtZSkge1xyXG4gICAgICAgICRzY29wZS5tZSA9IG1lO1xyXG4gICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBtZW1iZXJzOiBmdW5jdGlvbigpe1xyXG4gICAgICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXRBbGwoZnVuY3Rpb24gKG1lbWJlcnMpIHtcclxuICAgICAgICAkc2NvcGUubWVtYmVycyA9IG1lbWJlcnM7XHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXBhbmllczogZnVuY3Rpb24oKXtcclxuICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS5nZXRBbGwoZnVuY3Rpb24gKGNvbXBhbmllcykge1xyXG4gICAgICAgICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNwZWFrZXJzOiBmdW5jdGlvbigpe1xyXG4gICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmdldEFsbChmdW5jdGlvbiAoc3BlYWtlcnMpIHtcclxuICAgICAgICAkc2NvcGUuc3BlYWtlcnMgPSBzcGVha2VycztcclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgdG9waWNzOiBmdW5jdGlvbigpe1xyXG4gICAgICBUb3BpY0ZhY3RvcnkuVG9waWMuZ2V0QWxsKGZ1bmN0aW9uICh0b3BpY3MpIHtcclxuICAgICAgICAkc2NvcGUudG9waWNzID0gdG9waWNzO1xyXG4gICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICByb2xlczogZnVuY3Rpb24oKXtcclxuICAgICAgUm9sZUZhY3RvcnkuUm9sZS5nZXRBbGwoZnVuY3Rpb24gKHJvbGVzKSB7XHJcbiAgICAgICAgJHNjb3BlLnJvbGVzID0gcm9sZXM7XHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHRhZ3M6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIFRhZ0ZhY3RvcnkuVGFnLmdldEFsbChmdW5jdGlvbiAodGFncykge1xyXG4gICAgICAgICRzY29wZS50b3BpY1RhZ3MgPSB0YWdzO1xyXG4gICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBjb21tZW50czogZnVuY3Rpb24oKXtcclxuICAgICAgQ29tbWVudEZhY3RvcnkuQ29tbWVudC5nZXRBbGwoZnVuY3Rpb24gKGNvbW1lbnRzKSB7XHJcbiAgICAgICAgJHNjb3BlLmNvbW1lbnRzID0gY29tbWVudHM7XHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNoYXRzOiBmdW5jdGlvbigpIHtcclxuICAgICAgQ2hhdEZhY3RvcnkuQ2hhdC5nZXRBbGwoZnVuY3Rpb24oY2hhdHMpIHtcclxuICAgICAgICAkc2NvcGUuY2hhdHMgPSBjaGF0cztcclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgZXZlbnRzOiBmdW5jdGlvbigpIHtcclxuICAgICAgRXZlbnRGYWN0b3J5LkV2ZW50LmdldEFsbChmdW5jdGlvbihldmVudHMpIHtcclxuICAgICAgICAkc2NvcGUuZXZlbnRzID0gZXZlbnRzO1xyXG4gICAgICAgICRzY29wZS5jdXJyZW50RXZlbnQgPSBldmVudHNbMF07XHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNlc3Npb25zOiBmdW5jdGlvbigpIHtcclxuICAgICAgU2Vzc2lvbkZhY3RvcnkuU2Vzc2lvbi5nZXRBbGwoZnVuY3Rpb24oc2Vzc2lvbnMpIHtcclxuICAgICAgICAkc2NvcGUuc2Vzc2lvbnMgPSBzZXNzaW9ucztcclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaXRlbXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBJdGVtRmFjdG9yeS5JdGVtLmdldEFsbChmdW5jdGlvbihpdGVtcykge1xyXG4gICAgICAgICRzY29wZS5pdGVtcyA9IGl0ZW1zO1xyXG4gICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBhbGw6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XHJcbiAgICAgIGZhY3Rvcmllc1JlYWR5ID0gMDtcclxuICAgICAgLy9jb25zb2xlLmxvZyhcIlVwZGF0aW5nIVwiKTtcclxuICAgICAgdGhpcy5tZSgpO1xyXG4gICAgICB0aGlzLm1lbWJlcnMoKTtcclxuICAgICAgdGhpcy5jb21wYW5pZXMoKTtcclxuICAgICAgdGhpcy5zcGVha2VycygpO1xyXG4gICAgICB0aGlzLnRvcGljcygpO1xyXG4gICAgICB0aGlzLnJvbGVzKCk7XHJcbiAgICAgIHRoaXMudGFncygpO1xyXG4gICAgICB0aGlzLmNvbW1lbnRzKCk7XHJcbiAgICAgIHRoaXMuY2hhdHMoKTtcclxuICAgICAgdGhpcy5ldmVudHMoKTtcclxuICAgICAgdGhpcy5zZXNzaW9ucygpO1xyXG4gICAgICB0aGlzLml0ZW1zKCk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUuYWxsKCk7XHJcblxyXG5cclxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgZnVuY3Rpb24gY2FsbGJhY2soKSB7XHJcbiAgICBpZiAoKytmYWN0b3JpZXNSZWFkeSA9PSAxMikge1xyXG4gICAgICAkcm9vdFNjb3BlLnVwZGF0ZS5ydW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICRzY29wZS5yZWFkeSA9IHRydWU7XHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlKCk7XHJcblxyXG4gICAgICBzZXRJbnRlcnZhbCgkc2NvcGUudXBkYXRlLCAxMDAwMCk7XHJcblxyXG4gICAgICAkcm9vdFNjb3BlLiRvbihcIiRsb2NhdGlvbkNoYW5nZVN0YXJ0XCIsIGZ1bmN0aW9uIChldmVudCwgbmV4dCwgY3VycmVudCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoJHNjb3BlLnVwZGF0ZSwgNTAwKTtcclxuICAgICAgICAkc2NvcGUuc2VhcmNoLm5hbWUgPSAnJztcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVNDT1BFIEZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIE5vdGlmaWNhdGlvbkZhY3RvcnkuTm90aWZpY2F0aW9uLmdldEFsbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgJHNjb3BlLnRhcmdldE5vdGlmaWNhdGlvbnMgPSBbXTtcclxuICAgICAgJHNjb3BlLnVucmVhZE5vdGlmaWNhdGlvbnMgPSBbXTtcclxuICAgICAgJHNjb3BlLnRhcmdldEluZm8ubnVtYmVyID0gMDtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAocmVzcG9uc2VbaV0udGFyZ2V0cy5pbmRleE9mKCRzY29wZS5tZS5pZCkgIT0gLTEpIHtcclxuICAgICAgICAgIGlmIChyZXNwb25zZVtpXS51bnJlYWQuaW5kZXhPZigkc2NvcGUubWUuaWQpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICRzY29wZS50YXJnZXRJbmZvLm51bWJlcisrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgJHNjb3BlLnRhcmdldE5vdGlmaWNhdGlvbnMudW5zaGlmdChyZXNwb25zZVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXNwb25zZVtpXS51bnJlYWQuaW5kZXhPZigkc2NvcGUubWUuaWQpICE9IC0xKSB7XHJcbiAgICAgICAgICAkc2NvcGUudW5yZWFkTm90aWZpY2F0aW9ucy51bnNoaWZ0KHJlc3BvbnNlW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICgkc2NvcGUudGFyZ2V0SW5mby5udW1iZXIgPT0gMCkge1xyXG4gICAgICAgICRzY29wZS50YXJnZXRJbmZvLnRleHQgPSBcIiBObyBOb3RpZmljYXRpb25zXCI7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgJHNjb3BlLnRhcmdldEluZm8udGV4dCA9IFwiIFwiICsgJHNjb3BlLnRhcmdldEluZm8ubnVtYmVyICsgXCIgTm90aWZpY2F0aW9uXCIgKyAoJHNjb3BlLnRhcmdldEluZm8ubnVtYmVyID4gMSA/IFwic1wiIDogXCJcIik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIGRhdGUpIC8gMTAwMCk7XHJcblxyXG4gICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xyXG4gICAgaWYoc2Vjb25kcyA8IDApe1xyXG4gICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XHJcbiAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xyXG5cclxuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcclxuICAgIH1cclxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XHJcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbW9udGhzIFwiICsgc3VmZml4O1xyXG4gICAgfVxyXG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XHJcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgZGF5cyBcIiArIHN1ZmZpeDtcclxuICAgIH1cclxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XHJcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XHJcbiAgICB9XHJcbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcclxuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtaW51dGVzIFwiICsgc3VmZml4O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xyXG4gIH07XHJcblxyXG4gICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24gKHRpbWUpIHtcclxuICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lKS50b1VUQ1N0cmluZygpO1xyXG4gIH07XHJcblxyXG4gICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcclxuICAgIHZhciBtZW1iZXIgPSAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmKG1lbWJlci5sZW5ndGg+MCkge1xyXG4gICAgICByZXR1cm4gbWVtYmVyWzBdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBuYW1lOiBcIk5vIG9uZVwiLFxyXG4gICAgICAgIGZhY2Vib29rOiBcIjEwMDAwMDQ1NjMzNTk3MlwiXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICAkc2NvcGUuZ2V0U3BlYWtlciA9IGZ1bmN0aW9uIChzcGVha2VySWQpIHtcclxuICAgIHJldHVybiAkc2NvcGUuc3BlYWtlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgcmV0dXJuIG8uaWQgPT0gc3BlYWtlcklkO1xyXG4gICAgfSlbMF07XHJcbiAgfTtcclxuXHJcbiAgJHNjb3BlLmdldENvbXBhbnkgPSBmdW5jdGlvbiAoY29tcGFueUlkKSB7XHJcbiAgICByZXR1cm4gJHNjb3BlLmNvbXBhbmllcy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICByZXR1cm4gby5pZCA9PSBjb21wYW55SWQ7XHJcbiAgICB9KVswXTtcclxuICB9O1xyXG5cclxuICAkc2NvcGUuZ2V0VG9waWMgPSBmdW5jdGlvbiAodG9waWNJZCkge1xyXG4gICAgcmV0dXJuICRzY29wZS50b3BpY3MuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgcmV0dXJuIG8uX2lkID09IHRvcGljSWQ7XHJcbiAgICB9KVswXTtcclxuICB9O1xyXG5cclxuICAkc2NvcGUuZ2V0Tm90aWZpY2F0aW9ucyA9IGZ1bmN0aW9uICh0aHJlYWQpIHtcclxuICAgIHJldHVybiAkc2NvcGUubm90aWZpY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICByZXR1cm4gby50aHJlYWQgPT0gdGhyZWFkO1xyXG4gICAgfSlbMF07XHJcbiAgfTtcclxuXHJcbiAgJHNjb3BlLmdldFVucmVhZE5vdGlmaWNhdGlvbnMgPSBmdW5jdGlvbiAodGhyZWFkKSB7XHJcbiAgICByZXR1cm4gJHNjb3BlLnVucmVhZE5vdGlmaWNhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgcmV0dXJuIG8udGhyZWFkID09IHRocmVhZDtcclxuICAgIH0pWzBdO1xyXG4gIH07XHJcblxyXG4gICRzY29wZS5nZXRFdmVudCA9IGZ1bmN0aW9uIChldmVudElkKSB7XHJcbiAgICByZXR1cm4gJHNjb3BlLmV2ZW50cy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICByZXR1cm4gby5pZCA9PSBldmVudElkO1xyXG4gICAgfSlbMF07XHJcbiAgfTtcclxuXHJcbiAgJHNjb3BlLmdldFNlc3Npb24gPSBmdW5jdGlvbiAoc2Vzc2lvbklkKSB7XHJcbiAgICByZXR1cm4gJHNjb3BlLnNlc3Npb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgIHJldHVybiBvLl9pZCA9PSBzZXNzaW9uSWQ7XHJcbiAgICB9KVswXTtcclxuICB9O1xyXG5cclxuICAkc2NvcGUuZ2V0SXRlbSA9IGZ1bmN0aW9uIChpdGVtSWQpIHtcclxuICAgIHJldHVybiAkc2NvcGUuaXRlbXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgcmV0dXJuIG8uaWQgPT0gaXRlbUlkO1xyXG4gICAgfSlbMF07XHJcbiAgfTtcclxuXHJcbiAgJHNjb3BlLmdldFBhcnRpY2lwYXRpb24gPSBmdW5jdGlvbiAodGhpbmcsIGV2ZW50SWQpIHtcclxuICAgIHJldHVybiB0aGluZy5wYXJ0aWNpcGF0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICByZXR1cm4gby5ldmVudCA9PSBldmVudElkO1xyXG4gICAgfSlbMF07XHJcbiAgfTtcclxuXHJcbiAgJHNjb3BlLnNob3cgPSBmdW5jdGlvbigpIHtcclxuICAgICRzY29wZS5kaXNwbGF5ID0gKCRzY29wZS5zZWFyY2gubmFtZSA/IHRydWUgOiBmYWxzZSk7XHJcbiAgfTtcclxuXHJcbiAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgICRzY29wZS5kaXNwbGF5ID0gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgJHNjb3BlLmNvbnZlcnRVUkxzID0gZnVuY3Rpb24odGV4dCkge1xyXG4gICAgdmFyIHVybEV4cCA9IC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWc7XHJcblxyXG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykucmVwbGFjZSh1cmxFeHAsXCI8YSBocmVmPSckMSc+JDE8L2E+XCIpO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLmNvbnZlcnROZXdMaW5lc1RvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcclxuICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicrdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKSsnPC9kaXY+JztcclxuICB9XHJcblxyXG4gICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICByZXR1cm4gJzxkaXYgZGF0YS1tYXJrZG93bj4nICsgdGV4dCArICc8L2Rpdj4nO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICRodHRwLmdldCh1cmxfcHJlZml4ICsgJy9hcGkvbG9nb3V0JykuXHJcbiAgICAgIHN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAkd2luZG93LmxvY2F0aW9uLmFzc2lnbignLycpO1xyXG4gICAgICB9KS5cclxuICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiRVJST1JcIiwgZGF0YSk7XHJcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oJy8nKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbn0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJNZWV0aW5nRW1iZWRDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIE1lZXRpbmdGYWN0b3J5KSB7XHJcblxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICBNZWV0aW5nRmFjdG9yeS5nZXQoe2lkOiAkc2NvcGUubWVldGluZ0lkfSwgZnVuY3Rpb24gKG1lZXRpbmcpIHtcclxuICAgICAgJHNjb3BlLm1lZXRpbmcgPSBtZWV0aW5nO1xyXG5cclxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XHJcbiAgICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICByZXR1cm4gby5pZCA9PT0gbWVtYmVySWQ7XHJcbiAgICAgIH0pWzBdO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG59KTtcclxuIiwicmVxdWlyZShcIi4vZW1iZWRcIik7XHJcbnJlcXVpcmUoXCIuL2xpc3RcIik7XHJcbnJlcXVpcmUoXCIuL21lZXRpbmdcIik7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoJ01lZXRpbmdzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRsb2NhdGlvbiwgTWVldGluZ0ZhY3RvcnkpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgIGluaXQoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICgkc2NvcGUubG9hZGluZykge1xyXG4gICAgICAgICAgaW5pdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgMTAwMCk7XHJcblxyXG4gICAgICBNZWV0aW5nRmFjdG9yeS5nZXRBbGwoZnVuY3Rpb24gKG1lZXRpbmdzKSB7XHJcbiAgICAgICAgJHNjb3BlLm1lZXRpbmdzID0gbWVldGluZ3M7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLm1lZXRpbmdzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xyXG4gICAgICAgICAgJHNjb3BlLm1lZXRpbmdzW2ldLmZhY2Vib29rID0gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICAgICAgcmV0dXJuICRzY29wZS5tZWV0aW5nc1tpXS5hdXRob3IgPT0gby5pZDtcclxuICAgICAgICAgIH0pWzBdLmZhY2Vib29rO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICRzY29wZS50aW1lID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICByZXR1cm4gJHNjb3BlLnRpbWVTaW5jZShuZXcgRGF0ZShkYXRlKSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jcmVhdGVNZWV0aW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICAgIE1lZXRpbmdGYWN0b3J5LmNyZWF0ZSh7XHJcbiAgICAgICAgYXV0aG9yOiAkc2NvcGUubWUuaWQsXHJcbiAgICAgICAgdGl0bGU6IGRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKFwicHQtUFRcIikgKyBcIiAtIE1lZXRpbmdcIixcclxuICAgICAgICBkYXRlOiBkYXRlXHJcbiAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL21lZXRpbmcvXCIgKyByZXNwb25zZS5pZCArIFwiL2VkaXRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgfVxyXG59KTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTWVldGluZ0NvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24sICR0aW1lb3V0LCBNZWV0aW5nRmFjdG9yeSwgVG9waWNGYWN0b3J5LCBUYWdGYWN0b3J5KSB7XHJcblxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAkc2NvcGUua2luZHMgPSBbXCJJbmZvXCIsIFwiVG8gZG9cIiwgXCJEZWNpc2lvblwiLCBcIklkZWFcIl07XHJcblxyXG4gICAgTWVldGluZ0ZhY3RvcnkuZ2V0KHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24gKG1lZXRpbmcpIHtcclxuICAgICAgJHNjb3BlLm1lZXRpbmcgPSBtZWV0aW5nO1xyXG5cclxuICAgICAgU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCA9IGZ1bmN0aW9uIChzdWZmaXgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleE9mKHN1ZmZpeCwgdGhpcy5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKSAhPT0gLTE7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAoJGxvY2F0aW9uLnBhdGgoKS5lbmRzV2l0aChcIi90ZXh0XCIpKSB7XHJcbiAgICAgICAgdmFyIHRleHQgPSBtZWV0aW5nLnRpdGxlICsgXCJcXG5cXG5cIiArIChtZWV0aW5nLmRlc2NyaXB0aW9uID8gbWVldGluZy5kZXNjcmlwdGlvbiArIFwiXFxuXFxuXCIgOiBcIlwiKTtcclxuXHJcbiAgICAgICAgaWYgKG1lZXRpbmcuYXR0ZW5kYW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICB0ZXh0ICs9IFwiQXR0ZW5kYW50czpcXG5cIjtcclxuXHJcbiAgICAgICAgICBtZWV0aW5nLmF0dGVuZGFudHMuc29ydCgpO1xyXG5cclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVldGluZy5hdHRlbmRhbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRleHQgKz0gJHNjb3BlLmdldE1lbWJlcihtZWV0aW5nLmF0dGVuZGFudHNbaV0pLm5hbWUgKyAoaSsxIDwgbWVldGluZy5hdHRlbmRhbnRzLmxlbmd0aCA/IFwiLCBcIiA6IFwiXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGV4dCArPSBcIlxcblxcblwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgVGFnRmFjdG9yeS5UYWcuZ2V0QWxsKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgIHZhciB0YWdzID0gW107XHJcblxyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGFncy5wdXNoKHJlc3VsdFtpXSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGFncy5zb3J0KGZ1bmN0aW9uIChvMSwgbzIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG8xLm5hbWUubG9jYWxlQ29tcGFyZShvMi5uYW1lKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgdG9waWNzID0gbWVldGluZy50b3BpY3MuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG8udGFncy5pbmRleE9mKHRhZ3NbaV0uaWQpICE9IC0xO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0b3BpY3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRleHQgKz0gdGFnc1tpXS5uYW1lICsgXCI6XFxuXCI7XHJcblxyXG4gICAgICAgICAgICB0b3BpY3Muc29ydChmdW5jdGlvbiAobzEsIG8yKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG8xLnBvc3RlZC50b1N0cmluZygpLmxvY2FsZUNvbXBhcmUobzIucG9zdGVkLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdG9waWNzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgdGV4dCArPSBcIiAgICAtIFwiICsgdG9waWNzW2pdLnRleHQucmVwbGFjZSgvXFxuL2csIFwiXFxuICAgICAgXCIpICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGV4dCArPSBcIlxcblwiO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICRzY29wZS5udW1iZXJPZkxpbmVzID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG4gPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICBpZiAodGV4dFtpXSA9PT0gXCJcXG5cIikge1xyXG4gICAgICAgICAgICAgICAgbisrO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbiArIDI7XHJcbiAgICAgICAgICB9KCkpO1xyXG5cclxuICAgICAgICAgICRzY29wZS50ZXh0ID0gdGV4dDtcclxuXHJcbiAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAkc2NvcGUudG9nZ2xlQXR0ZW5kYW50ID0gZnVuY3Rpb24gKG1lbWJlcikge1xyXG4gICAgICB2YXIgaW5kZXggPSAkc2NvcGUubWVldGluZy5hdHRlbmRhbnRzLmluZGV4T2YobWVtYmVyKTtcclxuXHJcbiAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAkc2NvcGUubWVldGluZy5hdHRlbmRhbnRzLnB1c2gobWVtYmVyKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICAkc2NvcGUubWVldGluZy5hdHRlbmRhbnRzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnRvZ2dsZUF0dGVuZGFudHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLm1lbWJlcnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XHJcbiAgICAgICAgJHNjb3BlLnRvZ2dsZUF0dGVuZGFudCgkc2NvcGUubWVtYmVyc1tpXS5pZCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmdldEF0dGVuZGFudHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiAkc2NvcGUubWVldGluZy5hdHRlbmRhbnRzLm1hcChmdW5jdGlvbiAobykge1xyXG4gICAgICAgIHJldHVybiAkc2NvcGUuZ2V0TWVtYmVyKG8pO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNyZWF0ZVRvcGljID0gZnVuY3Rpb24gKGtpbmQpIHtcclxuICAgICAgdmFyIHRvcGljID0ge1xyXG4gICAgICAgIGVkaXRpbmc6IHRydWUsXHJcbiAgICAgICAgYXV0aG9yOiAkc2NvcGUubWUuaWQsXHJcbiAgICAgICAgdGV4dDogXCJcIixcclxuICAgICAgICB0YXJnZXRzOiBbXSxcclxuICAgICAgICBraW5kOiBraW5kLFxyXG4gICAgICAgIGNsb3NlZDogZmFsc2UsXHJcbiAgICAgICAgcmVzdWx0OiBcIlwiLFxyXG4gICAgICAgIHBvbGw6IHtcclxuICAgICAgICAgIGtpbmQ6IFwidGV4dFwiLFxyXG4gICAgICAgICAgb3B0aW9uczogW11cclxuICAgICAgICB9LFxyXG4gICAgICAgIGR1ZWRhdGU6IG51bGwsXHJcbiAgICAgICAgbWVldGluZ3M6IFskc2NvcGUubWVldGluZy5faWRdLFxyXG4gICAgICAgIHJvb3Q6IG51bGwsXHJcbiAgICAgICAgdGFnczogW10sXHJcbiAgICAgICAgcG9zdGVkOiBuZXcgRGF0ZSgpXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBUb3BpY0ZhY3RvcnkuVG9waWMuY3JlYXRlKHRvcGljLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xyXG4gICAgICAgICAgdG9waWMuX2lkID0gcmVzcG9uc2UuaWQ7XHJcbiAgICAgICAgICAkc2NvcGUubWVldGluZy50b3BpY3MucHVzaCh0b3BpYyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmFkZFRvcGljID0gZnVuY3Rpb24gKHRvcGljSWQpIHtcclxuICAgICAgJHNjb3BlLmRpc3BsYXkgPSBmYWxzZTtcclxuXHJcbiAgICAgIHZhciB0b3BpYyA9ICRzY29wZS50b3BpY3MuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgcmV0dXJuIG8uX2lkID09PSB0b3BpY0lkO1xyXG4gICAgICB9KVswXTtcclxuXHJcbiAgICAgICRzY29wZS5tZWV0aW5nLnRvcGljcy5wdXNoKHRvcGljKTtcclxuXHJcbiAgICAgIHRvcGljLm1lZXRpbmdzLnB1c2goJHNjb3BlLm1lZXRpbmcuX2lkKTtcclxuICAgICAgVG9waWNGYWN0b3J5LlRvcGljLnVwZGF0ZSh7aWQ6IHRvcGljLl9pZH0sIHRvcGljKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnJlbW92ZVRvcGljID0gZnVuY3Rpb24gKHRvcGljKSB7XHJcbiAgICAgICRzY29wZS5tZWV0aW5nLnRvcGljcy5zcGxpY2UoJHNjb3BlLm1lZXRpbmcudG9waWNzLmluZGV4T2YodG9waWMpLCAxKTtcclxuXHJcbiAgICAgIHRvcGljLm1lZXRpbmdzLnNwbGljZSh0b3BpYy5tZWV0aW5ncy5pbmRleE9mKCRzY29wZS5tZWV0aW5nLl9pZCksIDEpO1xyXG4gICAgICBUb3BpY0ZhY3RvcnkuVG9waWMudXBkYXRlKHtpZDogdG9waWMuX2lkfSwgdG9waWMpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuc2F2ZU1lZXRpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRzY29wZS5zdWNjZXNzID0gXCJcIjtcclxuICAgICAgJHNjb3BlLmVycm9yICAgPSBcIlwiO1xyXG5cclxuICAgICAgaWYgKCEkc2NvcGUubWVldGluZy50aXRsZSl7XHJcbiAgICAgICAgJHNjb3BlLmVycm9yID0gXCJQbGVhc2UgZW50ZXIgYSB0aXRsZS5cIjtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIE1lZXRpbmdGYWN0b3J5LnVwZGF0ZSh7aWQ6ICRzY29wZS5tZWV0aW5nLl9pZH0sICRzY29wZS5tZWV0aW5nLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xyXG4gICAgICAgICAgJHNjb3BlLnN1Y2Nlc3MgPSBcIk1lZXRpbmcgc2F2ZWQuXCI7XHJcblxyXG4gICAgICAgICAgaWYgKCRzY29wZS50aW1lb3V0KSB7XHJcbiAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCgkc2NvcGUudGltZW91dCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgJHNjb3BlLnRpbWVvdXQgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5zdWNjZXNzID0gXCJcIjtcclxuICAgICAgICAgIH0sIDMwMDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICRzY29wZS5lcnJvciA9IFwiVGhlcmUgd2FzIGFuIGVycm9yLiBQbGVhc2UgY29udGFjdCB0aGUgRGV2IFRlYW0gYW5kIGdpdmUgdGhlbSB0aGUgZGV0YWlscyBhYm91dCB0aGUgZXJyb3IuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmRlbGV0ZU1lZXRpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIG1lZXRpbmc/XCIpKSB7XHJcbiAgICAgICAgTWVldGluZ0ZhY3RvcnkuZGVsZXRlKHtpZDogJHNjb3BlLm1lZXRpbmcuX2lkfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIlRoZXJlIHdhcyBhbiBlcnJvci4gUGxlYXNlIGNvbnRhY3QgdGhlIERldiBUZWFtIGFuZCBnaXZlIHRoZW0gdGhlIGRldGFpbHMgYWJvdXQgdGhlIGVycm9yLlwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL21lZXRpbmdzL1wiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJHNjb3BlLmRpc3BsYXkgPSAoJHNjb3BlLnNlYXJjaFRvcGljID8gdHJ1ZSA6IGZhbHNlKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmFscmVhZHlJbk1lZXRpbmdGaWx0ZXIgPSBmdW5jdGlvbiAodG9waWMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubWVldGluZy50b3BpY3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoJHNjb3BlLm1lZXRpbmcudG9waWNzW2ldLl9pZCA9PT0gdG9waWMuX2lkKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuICB9XHJcbn0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJDcmVhdGVNZW1iZXJDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcywgTWVtYmVyRmFjdG9yeSkge1xyXG5cclxuICAkcm9vdFNjb3BlLnVwZGF0ZS50aW1lb3V0KHJ1bkNvbnRyb2xsZXIpO1xyXG5cclxuICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XHJcblxyXG4gICAgJHNjb3BlLmZvcm1EYXRhID0ge307XHJcbiAgICAkc2NvcGUuZm9ybURhdGEucm9sZXMgPSBbXTtcclxuICAgICRzY29wZS5mb3JtRGF0YS5waG9uZXMgPSBbXTtcclxuXHJcbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBtZW1iZXJEYXRhID0gdGhpcy5mb3JtRGF0YTtcclxuXHJcbiAgICAgIE1lbWJlckZhY3RvcnkuTWVtYmVyLmNyZWF0ZShtZW1iZXJEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XHJcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9tZW1iZXIvXCIgKyByZXNwb25zZS5pZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxufSk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIk1lbWJlckVtYmVkQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlKSB7XHJcblxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgfVxyXG5cclxufSk7XHJcbiIsInJlcXVpcmUoJy4vbWVtYmVyLmpzJyk7XHJcbnJlcXVpcmUoJy4vbGlzdC5qcycpO1xyXG5yZXF1aXJlKCcuL2NyZWF0ZS5qcycpO1xyXG5yZXF1aXJlKCcuL2VtYmVkLmpzJyk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTWVtYmVyc0NvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgTWVtYmVyRmFjdG9yeSkge1xyXG4gIFxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuICAgIE1lbWJlckZhY3RvcnkuTWVtYmVyLmdldEFsbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgJHNjb3BlLm1lbWJlclByZWRpY2F0ZSA9IFwibmFtZVwiO1xyXG4gICAgICAkc2NvcGUucmV2ZXJzZSA9IGZhbHNlO1xyXG4gICAgICAkc2NvcGUubWVtYmVycyA9IHJlc3BvbnNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59KTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTWVtYmVyQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCAkbG9jYXRpb24sIE1lbWJlckZhY3RvcnkpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoJHJvdXRlUGFyYW1zLmlkID09PSBcIm1lXCIpIHtcclxuICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvbWVtYmVyL1wiICsgJHNjb3BlLm1lLmlkKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5tZW1iZXIgPSAkc2NvcGUuZm9ybURhdGEgPSAkc2NvcGUuZ2V0TWVtYmVyKCRyb3V0ZVBhcmFtcy5pZCk7XHJcblxyXG4gICAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuZ2V0KHtpZDokcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihyZXN1bHQpIHsgXHJcbiAgICAgIGlmKCFyZXN1bHQuZXJyb3IpIHtcclxuICAgICAgICAkc2NvcGUubWVtYmVyID0gJHNjb3BlLmZvcm1EYXRhID0gcmVzdWx0O1xyXG4gICAgICAgIGdldE1lbWJlclN0dWZmKCk7XHJcbiAgICAgIH0gXHJcbiAgICB9KTtcclxuXHJcbiAgICBnZXRNZW1iZXJTdHVmZigpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldE1lbWJlclN0dWZmKCkge1xyXG4gICAgICBpZigkc2NvcGUuY29tcGFuaWVzICYmICRzY29wZS5zcGVha2VycyAmJiAkc2NvcGUuY29tbWVudHMgJiYgJHNjb3BlLmNvbXBhbmllcy5sZW5ndGggPiAwICYmICRzY29wZS5zcGVha2Vycy5sZW5ndGggPiAwICYmICRzY29wZS5jb21tZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gc2V0VGltZW91dChnZXRNZW1iZXJTdHVmZiwgMTAwMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5tZW1iZXJTdHVmZiA9IHt9O1xyXG5cclxuICAgICAgJHNjb3BlLm1lbWJlclN0dWZmLmNvbXBhbmllcyA9ICRzY29wZS5jb21wYW5pZXMuZmlsdGVyKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICByZXR1cm4gZS5tZW1iZXIgPT0gJHNjb3BlLm1lbWJlci5pZDtcclxuICAgICAgfSlcclxuXHJcbiAgICAgICRzY29wZS5tZW1iZXJTdHVmZi5zcGVha2VycyA9ICRzY29wZS5zcGVha2Vycy5maWx0ZXIoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHJldHVybiBlLm1lbWJlciA9PSAkc2NvcGUubWVtYmVyLmlkO1xyXG4gICAgICB9KVxyXG5cclxuICAgICAgJHNjb3BlLm1lbWJlclN0dWZmLmNvbW1lbnRzID0gJHNjb3BlLmNvbW1lbnRzLmZpbHRlcihmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgcmV0dXJuIGUubWVtYmVyID09ICRzY29wZS5tZW1iZXIuaWQ7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIG1lbWJlckRhdGEgPSB0aGlzLmZvcm1EYXRhO1xyXG5cclxuICAgICAgTWVtYmVyRmFjdG9yeS5NZW1iZXIudXBkYXRlKHsgaWQ6bWVtYmVyRGF0YS5pZCB9LCBtZW1iZXJEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG4gIH1cclxufSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyXHJcbiAgLmNvbnRyb2xsZXIoJ1NwZWFrZXJFbWFpbENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCAkbG9jYXRpb24sIEVtYWlsRmFjdG9yeSkge1xyXG5cclxuICAgICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgICAgJHNjb3BlLmVtYWlsID0gJGxvY2F0aW9uLnNlYXJjaCgpLmVtYWlsO1xyXG4gICAgICAkc2NvcGUuc3BlYWtlcklkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xyXG4gICAgICAkc2NvcGUubWVzc2FnZSA9IG51bGw7XHJcblxyXG4gICAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XHJcbiAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBudWxsO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwic2VuZCBlbWFpbCB0byBcIiwgJHNjb3BlLmVtYWlsLCBcIiBmcm9tIFwiLCAkc2NvcGUuc3BlYWtlcklkKTtcclxuXHJcbiAgICAgICAgRW1haWxGYWN0b3J5LlNwZWFrZXIuc2VuZCh7IGlkOiAkc2NvcGUuc3BlYWtlcklkIH0sIHsgZW1haWw6ICRzY29wZS5lbWFpbCB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbiBcclxudGhlVG9vbENvbnRyb2xsZXJcclxuICAuY29udHJvbGxlcignQ3JlYXRlU3BlYWtlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24sIFNwZWFrZXJGYWN0b3J5KSB7XHJcbiAgICBcclxuICAgICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBzcGVha2VyRGF0YSA9IHRoaXMuZm9ybURhdGE7XHJcblxyXG4gICAgICAgIHNwZWFrZXJEYXRhLnN0YXR1cyA9ICdTdWdnZXN0aW9uJztcclxuXHJcbiAgICAgICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5jcmVhdGUoc3BlYWtlckRhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcclxuXHJcbiAgICAgICAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKGZ1bmN0aW9uIChzcGVha2Vycykge1xyXG4gICAgICAgICAgICAgICRzY29wZS5zcGVha2VycyA9IHNwZWFrZXJzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3NwZWFrZXIvXCIgKyByZXNwb25zZS5pZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignU3BlYWtlckVtYmVkQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgIGlmKCRzY29wZS5jb21tZW50cykge1xyXG4gICAgICAkc2NvcGUuc3BlYWtlci5jb21tZW50cyA9ICRzY29wZS5jb21tZW50cy5maWx0ZXIoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHJldHVybiBlLnRocmVhZCA9PSAnc3BlYWtlci0nKyRzY29wZS5zcGVha2VyLmlkO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZigkc2NvcGUuZXZlbnQpIHtcclxuICAgICAgJHNjb3BlLnBhcnRpY2lwYXRpb24gPSAkc2NvcGUuc3BlYWtlci5wYXJ0aWNpcGF0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgIHJldHVybiBvLmV2ZW50ID09ICRzY29wZS5ldmVudC5pZDtcclxuICAgICAgfSlbMF07XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLmdldFVucmVhZE5vdGlmaWNhdGlvbnMgPSBmdW5jdGlvbiAodGhyZWFkKSB7XHJcbiAgICAgIHZhciBub3RpZmljYXRpb25zID0gJHNjb3BlLm5vdGlmaWNhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcclxuICAgICAgICByZXR1cm4gby50aHJlYWQgPT0gdGhyZWFkO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIG5vdGlmaWNhdGlvbnM7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5zcGVha2VyLnVucmVhZCA9ICRzY29wZS5nZXRVbnJlYWROb3RpZmljYXRpb25zKCdzcGVha2VyLScgKyAkc2NvcGUuc3BlYWtlci5pZCkubGVuZ3RoID4gMDtcclxuXHJcbiAgICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XHJcbiAgICAgIHZhciBtZW1iZXIgPSAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmKG1lbWJlci5sZW5ndGg+MCkge1xyXG4gICAgICAgIHJldHVybiBtZW1iZXJbMF07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIG5hbWU6ICdObyBvbmUnLFxyXG4gICAgICAgICAgZmFjZWJvb2s6ICcxMDAwMDA0NTYzMzU5NzInXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XHJcbiAgICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIGRhdGUpIC8gMTAwMCk7XHJcblxyXG4gICAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XHJcbiAgICAgIGlmKHNlY29uZHMgPCAwKXtcclxuICAgICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XHJcbiAgICAgICAgc3VmZml4ID0gJ3RvIGdvJztcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xyXG5cclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgJyB5ZWFycyAnICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArICcgbW9udGhzICcgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArICcgZGF5cyAnICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArICcgaG91cnMgJyArIHN1ZmZpeDtcclxuICAgICAgfVxyXG4gICAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgJyBtaW51dGVzICcgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyAnIHNlY29uZHMgJyArIHN1ZmZpeDtcclxuICAgIH07XHJcbiAgfVxyXG5cclxufSk7XHJcbiIsInJlcXVpcmUoJy4vc3BlYWtlci5qcycpO1xyXG5yZXF1aXJlKCcuL2xpc3QuanMnKTtcclxucmVxdWlyZSgnLi9jcmVhdGUuanMnKTtcclxucmVxdWlyZSgnLi9jb25maXJtLmpzJyk7XHJcbnJlcXVpcmUoJy4vZW1iZWQuanMnKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXJcclxuICAuY29udHJvbGxlcignU3BlYWtlcnNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRzY2UsIFNwZWFrZXJGYWN0b3J5KSB7XHJcblxyXG4gICAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XHJcblxyXG4gICAgICAkc2NvcGUubGltaXQgPSAyMDtcclxuXHJcbiAgICAgICRzY29wZS5zdGF0dXNlcyA9IFsnU3VnZ2VzdGlvbicsJ1NlbGVjdGVkJywnQXBwcm92ZWQnLCdDb250YWN0ZWQnLCdJbiBDb252ZXJzYXRpb25zJywnQWNjZXB0ZWQnLCdSZWplY3RlZCcsJ0dpdmUgVXAnXTtcclxuXHJcbiAgICAgICRzY29wZS5zcGVha2VyUHJlZGljYXRlID0gJ3VwZGF0ZWQnO1xyXG4gICAgICAkc2NvcGUucmV2ZXJzZSA9ICd0cnVlJztcclxuICAgICAgJHNjb3BlLmZpbHRlcmVkU3BlYWtlcnMgPSBbXTtcclxuICAgICAgJHNjb3BlLnNlYXJjaFNwZWFrZXJzID0ge3VuYXNzaWduZWQ6IHRydWUsIHVuYXNzaWduZWRPbmx5OiBmYWxzZX07XHJcbiAgICAgICRzY29wZS51bnJlYWRGaXJzdCA9IHRydWU7XHJcblxyXG5cclxuXHJcbiAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgJHNjb3BlLnNwZWFrZXJzID0gcmVzcG9uc2U7XHJcbiAgICAgICAgLy8kc2NvcGUuZmlsdGVyZWRTcGVha2VycyA9ICRzY29wZS5zcGVha2VycztcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkc2NvcGUuc2Nyb2xsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCRzY29wZS5saW1pdCA8PSAkc2NvcGUuc3BlYWtlcnMubGVuZ3RoKVxyXG4gICAgICAgICAgJHNjb3BlLmxpbWl0ICs9IDg7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKG1lbWJlcikge1xyXG4gICAgICAgIHZhciByb2xlcyA9ICRzY29wZS5tZS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgICAgcmV0dXJuIG8uaWQgPT0gJ2RldmVsb3BtZW50LXRlYW0nIHx8IG8uaWQgPT0gJ2Nvb3JkaW5hdGlvbic7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKHJvbGVzLmxlbmd0aCA9PT0gMCAmJiBtZW1iZXIuaWQgIT0gJHNjb3BlLm1lLmlkKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5hZGRTcGVha2VyID0gZnVuY3Rpb24obWVtYmVyLCBuZXdTcGVha2VyKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhuZXdTcGVha2VyKTtcclxuICAgICAgICB2YXIgc3BlYWtlckRhdGEgPSBuZXdTcGVha2VyO1xyXG5cclxuICAgICAgICBpZihuZXdTcGVha2VyLmlkKSB7XHJcbiAgICAgICAgICB2YXIgcGFydGljaXBhdGlvbiA9ICRzY29wZS5nZXRQYXJ0aWNpcGF0aW9uKHNwZWFrZXJEYXRhLCAkc2NvcGUuY3VycmVudEV2ZW50LmlkKTtcclxuICAgICAgICAgIGlmKHBhcnRpY2lwYXRpb24pIHtcclxuICAgICAgICAgICAgcGFydGljaXBhdGlvbi5tZW1iZXIgPSBtZW1iZXIuaWQ7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzcGVha2VyRGF0YS5wYXJ0aWNpcGF0aW9ucy5wdXNoKHtcclxuICAgICAgICAgICAgICBldmVudDogJHNjb3BlLmN1cnJlbnRFdmVudC5pZCxcclxuICAgICAgICAgICAgICBzdGF0dXM6ICdTZWxlY3RlZCcsXHJcbiAgICAgICAgICAgICAgbWVtYmVyOiBtZW1iZXIuaWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLnVwZGF0ZSh7IGlkOiBzcGVha2VyRGF0YS5pZCB9LCB7IHBhcnRpY2lwYXRpb25zOiBzcGVha2VyRGF0YS5wYXJ0aWNpcGF0aW9ucyB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2Uuc3VjY2VzcztcclxuXHJcbiAgICAgICAgICAgICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXRBbGwoZnVuY3Rpb24gKHNwZWFrZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3BlYWtlcnMgPSBzcGVha2VycztcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNwZWFrZXJEYXRhLnBhcnRpY2lwYXRpb25zID0gW3tcclxuICAgICAgICAgICAgZXZlbnQ6ICRzY29wZS5jdXJyZW50RXZlbnQuaWQsXHJcbiAgICAgICAgICAgIHN0YXR1czogJ1NlbGVjdGVkJyxcclxuICAgICAgICAgICAgbWVtYmVyOiBtZW1iZXIuaWRcclxuICAgICAgICAgIH1dO1xyXG5cclxuICAgICAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuY3JlYXRlKHNwZWFrZXJEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcclxuXHJcbiAgICAgICAgICAgICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXRBbGwoZnVuY3Rpb24gKHNwZWFrZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3BlYWtlcnMgPSBzcGVha2VycztcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gJHNjb3BlLiR3YXRjaChbJ2N1cnJlbnRFdmVudCcsICdzZWFyY2hTdGF0dXMnXSwgZnVuY3Rpb24obmV3VmFsdWVzLCBvbGRWYWx1ZXMsIHNjb3BlKXtcclxuICAgICAgLy8gICAvL2NvbnNvbGUubG9nKCdmaWx0ZXJpbmcgc3BlYWtlcnMgYnknLCRzY29wZS5zZWFyY2hTdGF0dXMsJHNjb3BlLmN1cnJlbnRFdmVudCk7XHJcbiAgICAgIC8vICAgaWYoJHNjb3BlLnNwZWFrZXJzKXtcclxuICAgICAgLy8gICAgICRzY29wZS5maWx0ZXJlZFNwZWFrZXJzID0gJHNjb3BlLnNwZWFrZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgIC8vICAgICAgIHJldHVybiBvLnBhcnRpY2lwYXRpb25zLmZpbHRlcihmdW5jdGlvbihwKSB7XHJcbiAgICAgIC8vICAgICAgICAgaWYoJHNjb3BlLnNlYXJjaFN0YXR1cyAmJiAkc2NvcGUuc2VhcmNoU3RhdHVzICE9PSAnJykge1xyXG4gICAgICAvLyAgICAgICAgICAgcmV0dXJuIHAuZXZlbnQgPT09ICRzY29wZS5jdXJyZW50RXZlbnQuaWQgJiYgcC5zdGF0dXMgPT09ICRzY29wZS5zZWFyY2hTdGF0dXM7XHJcbiAgICAgIC8vICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgLy8gICAgICAgICAgIHJldHVybiBwLmV2ZW50ID09PSAkc2NvcGUuY3VycmVudEV2ZW50LmlkO1xyXG4gICAgICAvLyAgICAgICAgIH1cclxuICAgICAgLy8gICAgICAgfSk7XHJcbiAgICAgIC8vICAgICB9KTtcclxuICAgICAgLy8gICB9XHJcbiAgICAgIC8vIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXJcclxuICAuY29udHJvbGxlcignU3BlYWtlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkbG9jYXRpb24sICR3aW5kb3csICRyb3V0ZVBhcmFtcywgJHNjZSwgU3BlYWtlckZhY3RvcnksIE1lbWJlckZhY3RvcnksIE5vdGlmaWNhdGlvbkZhY3RvcnkpIHtcclxuICAgIFxyXG4gICAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBydW5Db250cm9sbGVyKCl7XHJcblxyXG4gICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbkV2ZW50ID0gJHNjb3BlLmN1cnJlbnRFdmVudDtcclxuXHJcbiAgICAgICRzY29wZS5zZXRDb21tdW5pY2F0aW9uRXZlbnQgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICRzY29wZS5jb21tdW5pY2F0aW9uRXZlbnQgPSBldmVudDtcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLnRydXN0U3JjID0gZnVuY3Rpb24oc3JjKSB7XHJcbiAgICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKHNyYysnI3BhZ2UtYm9keScpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLmNvbnZlcnRFbWFpbHMgPSBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICAgICAgdmFyIG1haWxFeHAgPSAvW1xcd1xcLlxcLV0rXFxAKFtcXHdcXC1dK1xcLikrW1xcd117Miw0fSg/IVtePF0qPikvaWc7XHJcbiAgICAgICAgdmFyIHR3aXR0ZXJFeHAgPSAvKF58W15AXFx3XSlAKFxcd3sxLDE1fSlcXGIvZztcclxuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKG1haWxFeHAsJzxhIGhyZWY9XCJtYWlsdG86JCZcIj4kJjwvYT4nKS5yZXBsYWNlKHR3aXR0ZXJFeHAsJyQxPGEgaHJlZj1cImh0dHA6Ly90d2l0dGVyLmNvbS8kMlwiIHRhcmdldD1cIl9ibGFua1wiPkAkMjwvYT4nKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc3BlYWtlckRhdGEgPSB0aGlzLmZvcm1EYXRhO1xyXG5cclxuICAgICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLnVwZGF0ZSh7IGlkOnNwZWFrZXJEYXRhLmlkIH0sIHNwZWFrZXJEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLnN1Y2Nlc3M7XHJcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCdzcGVha2VyLycrc3BlYWtlckRhdGEuaWQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLmRlbGV0ZVNwZWFrZXIgPSBmdW5jdGlvbihzcGVha2VyKSB7XHJcbiAgICAgICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5kZWxldGUoeyBpZDpzcGVha2VyLmlkIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2Uuc3VjY2VzcztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCdzcGVha2Vycy8nKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYocm9sZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zdGF0dXNlcyA9IFsnU3VnZ2VzdGlvbicsJ1NlbGVjdGVkJywnQXBwcm92ZWQnLCdDb250YWN0ZWQnLCdJbiBDb252ZXJzYXRpb25zJywnQWNjZXB0ZWQnLCdSZWplY3RlZCcsJ0dpdmUgVXAnXTtcclxuXHJcbiAgICAgICRzY29wZS5zcGVha2VyID0gJHNjb3BlLmZvcm1EYXRhID0gJHNjb3BlLmdldFNwZWFrZXIoJHJvdXRlUGFyYW1zLmlkKTtcclxuXHJcbiAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuZ2V0KHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAkc2NvcGUuc3BlYWtlciA9ICRzY29wZS5mb3JtRGF0YSA9IHJlc3BvbnNlO1xyXG5cclxuICAgICAgICBOb3RpZmljYXRpb25GYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24oZ2V0RGF0YSkge1xyXG4gICAgICAgICAgJHNjb3BlLnNwZWFrZXIubm90aWZpY2F0aW9ucyA9IGdldERhdGE7XHJcblxyXG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB2YXIgd2luID0gJHdpbmRvdztcclxuICAgICAgJHNjb3BlLiR3YXRjaCgnc3BlYWtlckZvcm0uJGRpcnR5JywgZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICBpZih2YWx1ZSkge1xyXG4gICAgICAgICAgd2luLm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuICdZb3UgaGF2ZSB1bnNhdmVkIGNoYW5nZXMnO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICB9KTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiU3Vic2NyaXB0aW9uQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCBTdWJzY3JpcHRpb25GYWN0b3J5KSB7XHJcblxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgdmFyIHRocmVhZElkID0gJHNjb3BlLnRocmVhZC5zdWJzdHJpbmcoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiLVwiKSArIDEpO1xyXG4gICAgdmFyIHRocmVhZEtpbmQgPSAkc2NvcGUudGhyZWFkLnNwbGl0KCctJylbMF07XHJcblxyXG4gICAgdmFyIEZhY3Rvcnk7XHJcblxyXG4gICAgc3dpdGNoKHRocmVhZEtpbmQpIHtcclxuICAgICAgY2FzZSAnY29tcGFueSc6XHJcbiAgICAgICAgRmFjdG9yeSA9IFN1YnNjcmlwdGlvbkZhY3RvcnkuQ29tcGFueTtcclxuICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ3NwZWFrZXInOlxyXG4gICAgICAgIEZhY3RvcnkgPSBTdWJzY3JpcHRpb25GYWN0b3J5LlNwZWFrZXI7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICd0b3BpYyc6XHJcbiAgICAgICAgRmFjdG9yeSA9IFN1YnNjcmlwdGlvbkZhY3RvcnkuVG9waWM7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIC8vY29uc29sZS5sb2coJ1RIUkVBRCcsICRzY29wZS50aHJlYWQsIHRocmVhZEtpbmQsIHRocmVhZElkKTtcclxuICAgIC8vY29uc29sZS5sb2coJ0ZBQ1RPUllZWScsIFN1YnNjcmlwdGlvbkZhY3RvcnkuQ29tcGFueSwgU3Vic2NyaXB0aW9uRmFjdG9yeS5TcGVha2VyLCBTdWJzY3JpcHRpb25GYWN0b3J5LlRvcGljLCBGYWN0b3J5KTtcclxuXHJcbiAgICAkc2NvcGUuaXNTdWJzY3JpYmVkID0gZmFsc2U7XHJcblxyXG4gICAgJHNjb3BlLmdldFN0YXR1cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgRmFjdG9yeS5nZXQoe2lkOiB0aHJlYWRJZH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnU1RBVFVTJyxyZXNwb25zZS5zdWNjZXNzKVxyXG4gICAgICAgIGlmKHJlc3BvbnNlLnN1Y2Nlc3MgPT0gJ3N1YnNjcmliZWQnKSB7XHJcbiAgICAgICAgICAkc2NvcGUuaXNTdWJzY3JpYmVkID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJHNjb3BlLmlzU3Vic2NyaWJlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZygnQURERCcsIHRocmVhZEtpbmQsIHRocmVhZElkKTtcclxuICAgICAgRmFjdG9yeS5hZGQoe2lkOiB0aHJlYWRJZH0sIHt9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICRzY29wZS5nZXRTdGF0dXMoKTtcclxuICAgICAgfSlcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKCdERUxFVEUnLCB0aHJlYWRLaW5kLCB0aHJlYWRJZCk7XHJcbiAgICAgIEZhY3RvcnkucmVtb3ZlKHtpZDogdGhyZWFkSWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICRzY29wZS5nZXRTdGF0dXMoKTtcclxuICAgICAgfSlcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmdldFN0YXR1cygpO1xyXG4gIH1cclxufSk7XHJcbiIsInJlcXVpcmUoJy4vZW1iZWQnKTsiLCJyZXF1aXJlKCcuL21hbmFnZXInKTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJUYWdNYW5hZ2VyQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCBUYWdGYWN0b3J5KSB7XHJcblxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgJHNjb3BlLnRhZyA9IHt9O1xyXG5cclxuICAgICRzY29wZS5saWdodENvbG9ycyA9IFtcIiNmN2M2YzdcIiwgXCIjZmFkOGM3XCIsIFwiI2ZlZjJjMFwiLCBcIiNiZmU1YmZcIiwgXCIjYmZkYWRjXCIsIFwiI2M3ZGVmOFwiLCBcIiNiZmQ0ZjJcIiwgXCIjZDRjNWY5XCJdO1xyXG4gICAgJHNjb3BlLmNvbG9ycyA9IFtcIiNlMTFkMjFcIiwgXCIjZWI2NDIwXCIsIFwiI2ZiY2EwNFwiLCBcIiMwMDk4MDBcIiwgXCIjMDA2Yjc1XCIsIFwiIzIwN2RlNVwiLCBcIiMwMDUyY2NcIiwgXCIjNTMxOWU3XCJdO1xyXG5cclxuICAgICRzY29wZS5jaGFuZ2VDb2xvciA9IGZ1bmN0aW9uIChjb2xvcikge1xyXG4gICAgICAkc2NvcGUudGFnLmNvbG9yID0gY29sb3I7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jcmVhdGVUYWcgPSBmdW5jdGlvbiAodGFnKSB7XHJcbiAgICAgIFRhZ0ZhY3RvcnkuVGFnLmNyZWF0ZSh0YWcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAkc2NvcGUudGFncy5wdXNoKHJlc3BvbnNlLnRhZyk7XHJcbiAgICAgICAgICAkc2NvcGUudGFnID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnNhdmVUYWcgPSBmdW5jdGlvbiAodGFnKSB7XHJcbiAgICAgIFRhZ0ZhY3RvcnkuVGFnLnVwZGF0ZSh7aWQ6IHRhZy5pZH0sIHRhZywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgIHRhZy5lZGl0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmRlbGV0ZVRhZyA9IGZ1bmN0aW9uICh0YWcpIHtcclxuICAgICAgVGFnRmFjdG9yeS5UYWcuZGVsZXRlKHtpZDogdGFnLmlkfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICRzY29wZS50YWdzLnNwbGljZSgkc2NvcGUudGFncy5pbmRleE9mKHRhZyksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG4gIH1cclxufSk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIlRvcGljRW1iZWRDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRsb2NhdGlvbiwgVG9waWNGYWN0b3J5LCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XHJcblxyXG4gICRyb290U2NvcGUudXBkYXRlLnRpbWVvdXQocnVuQ29udHJvbGxlcik7XHJcblxyXG4gIGZ1bmN0aW9uIHJ1bkNvbnRyb2xsZXIoKXtcclxuXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAkc2NvcGUuZXJyb3IgICAgICAgPSBcIlwiO1xyXG4gICAgJHNjb3BlLnNob3dUYXJnZXRzID0gZmFsc2U7XHJcblxyXG4gICAgJHNjb3BlLnBvbGxLaW5kcyA9IFtcInRleHRcIiwgXCJpbWFnZXNcIl07XHJcblxyXG4gICAgaWYgKCRzY29wZS5jb21tZW50cykge1xyXG4gICAgICAkc2NvcGUudG9waWMuY29tbWVudHMgPSAkc2NvcGUuY29tbWVudHMuZmlsdGVyKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIGUudGhyZWFkID09IFwidG9waWMtXCIgKyAkc2NvcGUudG9waWMuX2lkO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93KCRzY29wZS50b3BpYyk7XHJcblxyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09QVVYRlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGZ1bmN0aW9uIHNob3codG9waWMpIHtcclxuICAgICAgdG9waWMuc2hvdyA9IHtcclxuICAgICAgICB0ZXh0ICAgICA6IHRydWUsXHJcbiAgICAgICAgdGFyZ2V0cyAgOiB0cnVlLFxyXG4gICAgICAgIHBvbGwgICAgIDogZmFsc2UsXHJcbiAgICAgICAgZHVlZGF0ZSAgOiBmYWxzZSxcclxuICAgICAgICBtZWV0aW5nICA6IHRydWUsXHJcbiAgICAgICAgY2xvc2VkICAgOiBmYWxzZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgaWYgKHRvcGljLmtpbmQgPT09IFwiVG8gZG9cIikge1xyXG4gICAgICAgIHRvcGljLnNob3cuZHVlZGF0ZSA9IHRydWU7XHJcbiAgICAgICAgdG9waWMuc2hvdy5jbG9zZWQgID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmICh0b3BpYy5raW5kID09PSBcIkRlY2lzaW9uXCIpIHtcclxuICAgICAgICB0b3BpYy5zaG93LmR1ZWRhdGUgPSB0cnVlO1xyXG4gICAgICAgIHRvcGljLnNob3cuY2xvc2VkICA9IHRydWU7XHJcbiAgICAgICAgdG9waWMuc2hvdy5wb2xsID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKHRvcGljKSB7XHJcbiAgICAgIGlmICghJHNjb3BlLm1lLnJvbGVzKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cclxuICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbiAobykge1xyXG4gICAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmIChyb2xlcy5sZW5ndGggPT0gMCAmJiB0b3BpYy5hdXRob3IgIT0gJHNjb3BlLm1lLmlkKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgJHNjb3BlLmRlbGV0ZVRvcGljID0gZnVuY3Rpb24gKHRvcGljKSB7XHJcbiAgICAgIGlmIChjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIHRvcGljP1wiKSkge1xyXG4gICAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5kZWxldGUoe2lkOiB0b3BpYy5faWR9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB0b3BpYy5kZWxldGVkID0gdHJ1ZTtcclxuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvdG9waWNzJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnRvZ2dsZVRhZyA9IGZ1bmN0aW9uICh0YWcpIHtcclxuICAgICAgdmFyIGluZGV4ID0gJHNjb3BlLnRvcGljLnRhZ3MuaW5kZXhPZih0YWcpO1xyXG5cclxuICAgICAgaWYgKGluZGV4ID09IC0xKSB7XHJcbiAgICAgICAgJHNjb3BlLnRvcGljLnRhZ3MucHVzaCh0YWcpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgICRzY29wZS50b3BpYy50YWdzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmdldFRhZ0ljb24gPSBmdW5jdGlvbiAodGFnKSB7XHJcbiAgICAgIHJldHVybiAoJHNjb3BlLnRvcGljLnRhZ3MuaW5kZXhPZih0YWcuaWQpICE9PSAtMSA/IFwiY2hlY2tcIiA6IFwidGltZXNcIik7O1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUudG9nZ2xlVGFyZ2V0ID0gZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgICB2YXIgaW5kZXggPSAkc2NvcGUudG9waWMudGFyZ2V0cy5pbmRleE9mKHRhcmdldCk7XHJcblxyXG4gICAgICBpZiAoaW5kZXggPT0gLTEpIHtcclxuICAgICAgICAkc2NvcGUudG9waWMudGFyZ2V0cy5wdXNoKHRhcmdldCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgJHNjb3BlLnRvcGljLnRhcmdldHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUudG9nZ2xlQWxsVGFyZ2V0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUubWVtYmVycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcclxuICAgICAgICAkc2NvcGUudG9nZ2xlVGFyZ2V0KCRzY29wZS5tZW1iZXJzW2ldLmlkKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUudG9nZ2xlUm9sZVRhcmdldHMgPSBmdW5jdGlvbiAocm9sZUlkKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLm1lbWJlcnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XHJcbiAgICAgICAgZm9yKHZhciBvID0gMDsgbyA8ICRzY29wZS5tZW1iZXJzW2ldLnJvbGVzLmxlbmd0aDsgbysrKSB7XHJcbiAgICAgICAgICBpZiAoJHNjb3BlLm1lbWJlcnNbaV0ucm9sZXNbb10uaWQgPT0gcm9sZUlkKSB7XHJcbiAgICAgICAgICAgICRzY29wZS50b2dnbGVUYXJnZXQoJHNjb3BlLm1lbWJlcnNbaV0uaWQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUudG9nZ2xlVGFyZ2V0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJHNjb3BlLnNob3dUYXJnZXRzID0gISRzY29wZS5zaG93VGFyZ2V0cztcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmdldFRhcmdldENvbG9yID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XHJcbiAgICAgIHJldHVybiAoJHNjb3BlLnRvcGljLnRhcmdldHMuaW5kZXhPZihtZW1iZXJJZCkgIT09IC0xID8gXCJibHVlXCIgOiBcIlwiKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmZvY3VzT3B0aW9uID0gZnVuY3Rpb24gKG9wdGlvbikge1xyXG4gICAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XHJcbiAgICAgICAgJHNjb3BlLnRvcGljLnBvbGwub3B0aW9uc1tpXS5lZGl0aW5nID0gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9wdGlvbi5lZGl0aW5nID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmFkZE9wdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIG9wdGlvbiA9IHtcclxuICAgICAgICBvcHRpb25UeXBlOiBcIkluZm9cIixcclxuICAgICAgICB0YXJnZXRzOiBbXVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnRvcGljLnBvbGwub3B0aW9ucy5wdXNoKG9wdGlvbik7XHJcblxyXG4gICAgICAkc2NvcGUuZm9jdXNPcHRpb24ob3B0aW9uKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnJlbW92ZU9wdGlvbiA9IGZ1bmN0aW9uIChvcHRpb24pIHtcclxuICAgICAgJHNjb3BlLnRvcGljLnBvbGwub3B0aW9ucy5zcGxpY2UoJHNjb3BlLnRvcGljLnBvbGwub3B0aW9ucy5pbmRleE9mKG9wdGlvbiksIDEpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuc2VsZWN0T3B0aW9uID0gZnVuY3Rpb24gKHRvcGljLCBvcHRpb24pIHtcclxuICAgICAgdmFyIHVwZGF0ZWRUb3BpYyA9IHRvcGljO1xyXG5cclxuICAgICAgaWYgKG9wdGlvbi52b3Rlcy5pbmRleE9mKCRzY29wZS5tZS5pZCkgIT09IC0xKSB7XHJcbiAgICAgICAgdXBkYXRlZFRvcGljLnBvbGwub3B0aW9uc1t1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zLmluZGV4T2Yob3B0aW9uKV0udm90ZXMuc3BsaWNlKHVwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnNbdXBkYXRlZFRvcGljLnBvbGwub3B0aW9ucy5pbmRleE9mKG9wdGlvbildLnZvdGVzLmluZGV4T2YoJHNjb3BlLm1lLmlkKSwgMSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdXBkYXRlZFRvcGljLnBvbGwub3B0aW9uc1t1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zLmluZGV4T2Yob3B0aW9uKV0udm90ZXMucHVzaCgkc2NvcGUubWUuaWQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB1cGRhdGVkVG9waWMuX3ZvdGluZyA9IHRydWU7XHJcblxyXG4gICAgICBUb3BpY0ZhY3RvcnkuVG9waWMudXBkYXRlKHtpZDogdXBkYXRlZFRvcGljLl9pZH0sIHVwZGF0ZWRUb3BpYywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiVGhlcmUgd2FzIGFuIGVycm9yLiBQbGVhc2UgY29udGFjdCB0aGUgRGV2IFRlYW0gYW5kIGdpdmUgdGhlbSB0aGUgZGV0YWlscyBhYm91dCB0aGUgZXJyb3IuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAvLy8vY29uc29sZS5sb2cocmVzcG9uc2Uuc3VjY2Vzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAodG9waWMpIHtcclxuICAgICAgJHNjb3BlLmVycm9yID0gXCJcIjtcclxuXHJcbiAgICAgIC8vY29uc29sZS5sb2codG9waWMpO1xyXG5cclxuICAgICAgVG9waWNGYWN0b3J5LlRvcGljLnVwZGF0ZSh7aWQ6IHRvcGljLl9pZH0sIHRvcGljLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xyXG4gICAgICAgICAgdG9waWMuZWRpdGluZyA9ICF0b3BpYy5lZGl0aW5nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICRzY29wZS5lcnJvciA9IFwiVGhlcmUgd2FzIGFuIGVycm9yLiBQbGVhc2UgY29udGFjdCB0aGUgRGV2IFRlYW0gYW5kIGdpdmUgdGhlbSB0aGUgZGV0YWlscyBhYm91dCB0aGUgZXJyb3IuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnJlYWQgPSBmdW5jdGlvbiAodG9waWMpIHtcclxuICAgICAgaWYgKCEkc2NvcGUubm90aWZpY2F0aW9ucykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLm5vdGlmaWNhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgcmV0dXJuIG8udGhyZWFkID09PSBcInRvcGljLVwiICsgdG9waWMuX2lkO1xyXG4gICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcclxuICAgICAgICB2YXIgaW5kZXggPSBub3RpZmljYXRpb24udW5yZWFkLmluZGV4T2YoJHNjb3BlLm1lLmlkKTtcclxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICBub3RpZmljYXRpb24udW5yZWFkLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICBOb3RpZmljYXRpb25GYWN0b3J5Lk5vdGlmaWNhdGlvbi51cGRhdGUoe2lkOiBub3RpZmljYXRpb24uX2lkfSwgbm90aWZpY2F0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XHJcbiAgICAgIHZhciBtZW1iZXIgPSAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAobWVtYmVyICYmIG1lbWJlci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIG1lbWJlclswXTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgbmFtZTogXCJObyBvbmVcIixcclxuICAgICAgICAgIGZhY2Vib29rOiBcIjEwMDAwMDQ1NjMzNTk3MlwiXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZ2V0VW5yZWFkTm90aWZpY2F0aW9ucyA9IGZ1bmN0aW9uICh0aHJlYWQpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZyhub3RpZmljYXRpb25zKTtcclxuICAgICAgdmFyIG5vdGlmaWNhdGlvbnMgPSAkc2NvcGUubm90aWZpY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xyXG4gICAgICAgIHJldHVybiBvLnRocmVhZCA9PSB0aHJlYWQ7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIG5vdGlmaWNhdGlvbnM7XHJcbiAgICB9O1xyXG5cclxuICAgICAkc2NvcGUudG9waWMudW5yZWFkID0gJHNjb3BlLmdldFVucmVhZE5vdGlmaWNhdGlvbnMoJ3RvcGljLScrICRzY29wZS50b3BpYy5faWQpLmxlbmd0aCA+IDA7XHJcblxyXG4gICAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xyXG5cclxuICAgICAgdmFyIHN1ZmZpeCA9IFwiYWdvXCI7XHJcbiAgICAgIGlmIChzZWNvbmRzIDwgMCl7XHJcbiAgICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHNlY29uZHMpO1xyXG4gICAgICAgIHN1ZmZpeCA9IFwidG8gZ29cIjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xyXG5cclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XHJcbiAgICAgIH1cclxuICAgICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcclxuICAgICAgaWYgKGludGVydmFsID4gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbW9udGhzIFwiICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XHJcbiAgICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcclxuICAgICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xyXG4gICAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtaW51dGVzIFwiICsgc3VmZml4O1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAodGltZSkge1xyXG4gICAgICByZXR1cm4gbmV3IERhdGUodGltZSkudG9VVENTdHJpbmcoKTtcclxuICAgIH07XHJcbiAgfVxyXG59KTtcclxuIiwicmVxdWlyZSgnLi9saXN0Jyk7XHJcbnJlcXVpcmUoJy4vdG9waWMnKTtcclxucmVxdWlyZSgnLi9lbWJlZCcpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJUb3BpY3NDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCBUb3BpY0ZhY3RvcnkpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICRzY29wZS5raW5kcyA9IFtcIkluZm9cIiwgXCJUbyBkb1wiLCBcIkRlY2lzaW9uXCIsIFwiSWRlYVwiXTtcclxuXHJcbiAgICAkc2NvcGUuc2VhcmNoVG9waWNzID0ge307XHJcblxyXG4gICAgJHNjb3BlLnVucmVhZEZpcnN0ID0gdHJ1ZTtcclxuXHJcbiAgICBUb3BpY0ZhY3RvcnkuVG9waWMuZ2V0QWxsKGdvdFRvcGljcyk7XHJcblxyXG4gICAgZnVuY3Rpb24gZ290VG9waWNzICh0b3BpY3MpIHtcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCRzY29wZS5sb2FkaW5nKSB7XHJcbiAgICAgICAgICBnb3RUb3BpY3ModG9waWNzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDEwMDApO1xyXG5cclxuICAgICAgJHNjb3BlLnRvcGljcyA9IHRvcGljcztcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLnRvcGljcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcclxuICAgICAgICAkc2NvcGUudG9waWNzW2ldLmZhY2Vib29rID0gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgICByZXR1cm4gJHNjb3BlLnRvcGljc1tpXS5hdXRob3IgPT09IG8uaWQ7XHJcbiAgICAgICAgfSlbMF0uZmFjZWJvb2s7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnNob3dPcGVuID0gdHJ1ZTtcclxuICAgICRzY29wZS5saW1pdCA9IDEwO1xyXG5cclxuXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAkc2NvcGUudGltZSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgcmV0dXJuICRzY29wZS50aW1lU2luY2UobmV3IERhdGUoZGF0ZSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY3JlYXRlVG9waWMgPSBmdW5jdGlvbihraW5kKSB7XHJcbiAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgVG9waWNGYWN0b3J5LlRvcGljLmNyZWF0ZSh7XHJcbiAgICAgICAgYXV0aG9yOiAkc2NvcGUubWUuaWQsXHJcbiAgICAgICAga2luZDoga2luZCxcclxuICAgICAgICB0YWdzOiBbJHNjb3BlLnNlYXJjaFRvcGljcy50YWdzXVxyXG4gICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xyXG4gICAgICAgICAgVG9waWNGYWN0b3J5LlRvcGljLmdldEFsbChmdW5jdGlvbiAodG9waWNzKSB7XHJcbiAgICAgICAgICAgICRzY29wZS50b3BpY3MgPSB0b3BpY3M7XHJcbiAgICAgICAgICAgICRzY29wZS50b3BpY3MuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG8uX2lkID09IHJlc3BvbnNlLmlkO1xyXG4gICAgICAgICAgICB9KVswXS5lZGl0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ3RvcGljLycrcmVzcG9uc2UuaWQpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNvdW50ID0gZnVuY3Rpb24gKG9wZW4pIHtcclxuICAgICAgcmV0dXJuICRzY29wZS50b3BpY3MuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgcmV0dXJuIChvcGVuID8gIW8uY2xvc2VkIDogby5jbG9zZWQpO1xyXG4gICAgICB9KS5sZW5ndGg7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5zaG93blRvcGljcyA9IGZ1bmN0aW9uIChvcGVuKSB7XHJcbiAgICAgIHJldHVybiAkc2NvcGUudG9waWNzLmZpbHRlcihmdW5jdGlvbiAobykge1xyXG4gICAgICAgIHJldHVybiBvLmVkaXRpbmcgfHwgKG9wZW4gPyAhby5jbG9zZWQgOiBvLmNsb3NlZCkgJiYgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmICgkc2NvcGUuc2VhcmNoVG9waWNzLnRhZ3MgJiYgby50YWdzLmluZGV4T2YoJHNjb3BlLnNlYXJjaFRvcGljcy50YWdzKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKCRzY29wZS5zZWFyY2hUb3BpY3MudGFyZ2V0ICYmIG8udGFyZ2V0cy5pbmRleE9mKCRzY29wZS5zZWFyY2hUb3BpY3MudGFyZ2V0KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKCRzY29wZS5zZWFyY2hUb3BpY3Mua2luZCAmJiBvLmtpbmQgIT09ICRzY29wZS5zZWFyY2hUb3BpY3Mua2luZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAoJHNjb3BlLmxpbWl0IDwgJHNjb3BlLnRvcGljcy5sZW5ndGgpXHJcbiAgICAgICAgJHNjb3BlLmxpbWl0ICs9IDQ7XHJcbiAgICB9O1xyXG4gIH1cclxufSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoJ1RvcGljQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uLCAkd2luZG93LCBUb3BpY0ZhY3RvcnksIE5vdGlmaWNhdGlvbkZhY3RvcnkpIHtcclxuXHJcbiAgJHJvb3RTY29wZS51cGRhdGUudGltZW91dChydW5Db250cm9sbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gcnVuQ29udHJvbGxlcigpe1xyXG5cclxuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICBUb3BpY0ZhY3RvcnkuVG9waWMuZ2V0KHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgICRzY29wZS50b3BpYyA9IHJlc3VsdDtcclxuXHJcbiAgICAgIC8vY29uc29sZS5sb2coJGxvY2F0aW9uLnNlYXJjaCgpKTtcclxuICAgICAgaWYoJGxvY2F0aW9uLnNlYXJjaCgpLmVkaXRpbmcgPT0gdHJ1ZSkge1xyXG4gICAgICAgICRzY29wZS50b3BpYy5lZGl0aW5nPXRydWU7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnVFJVRUVFJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS50b3BpYy5zaG93Q29tbWVudHMgPSB0cnVlO1xyXG5cclxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sRGlyZWN0aXZlc1xyXG4gIC5kaXJlY3RpdmUoJ2NvbW1lbnRBcmVhJywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxyXG4gICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbW1lbnQvYXJlYS5odG1sJyxcclxuICAgICAgY29udHJvbGxlcjogJ0NvbW1lbnRBcmVhQ29udHJvbGxlcicsXHJcbiAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgdGhyZWFkOiAnQCcsXHJcbiAgICAgICAgc3VidGhyZWFkOiAnQCcsXHJcbiAgICAgICAgbWU6ICc9JyxcclxuICAgICAgICBtZW1iZXJzOiAnPSdcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sRGlyZWN0aXZlc1xyXG4gIC5kaXJlY3RpdmUoJ2ZpcnN0Q29tbWVudCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcclxuICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21tZW50L2ZpcnN0Lmh0bWwnLFxyXG4gICAgICBjb250cm9sbGVyOiAnRmlyc3RDb21tZW50Q29udHJvbGxlcicsXHJcbiAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgdGhyZWFkOiAnQCdcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9KSIsInJlcXVpcmUoJy4vYXJlYScpO1xyXG5yZXF1aXJlKCcuL2ZpcnN0Jyk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbERpcmVjdGl2ZXNcclxuICAuZGlyZWN0aXZlKCdjb21tdW5pY2F0aW9uQXJlYScsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcclxuICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21tdW5pY2F0aW9uL2FyZWEuaHRtbCcsXHJcbiAgICAgIGNvbnRyb2xsZXI6ICdDb21tdW5pY2F0aW9uQXJlYUNvbnRyb2xsZXInLFxyXG4gICAgICBzY29wZToge1xyXG4gICAgICAgIHRocmVhZDogJ0AnLFxyXG4gICAgICAgIGV2ZW50OiAnPScsXHJcbiAgICAgICAgbWVtYmVyc0pzb246ICdAbWVtYmVycycsXHJcbiAgICAgICAgbWVKc29uOiAnQG1lJyxcclxuICAgICAgICByb2xlc0pzb246ICdAcm9sZXMnXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSkiLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sRGlyZWN0aXZlc1xyXG4gIC5kaXJlY3RpdmUoJ2NvbW11bmljYXRpb24nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN0cmljdDogJ0VBQycsXHJcbiAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tbXVuaWNhdGlvbi9jb21tdW5pY2F0aW9uLmh0bWwnLFxyXG4gICAgICBjb250cm9sbGVyOiAnQ29tbXVuaWNhdGlvbkVtYmVkQ29udHJvbGxlcicsXHJcbiAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgY29tbXVuaWNhdGlvbjogJz1jb21tdW5pY2F0aW9uT2JqZWN0JyxcclxuICAgICAgICBtZW1iZXJzOiAnPScsXHJcbiAgICAgICAgbWU6ICc9J1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH0pIiwicmVxdWlyZSgnLi9hcmVhJyk7XHJcbnJlcXVpcmUoJy4vY29tbXVuaWNhdGlvbicpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xEaXJlY3RpdmVzXHJcbiAgLmRpcmVjdGl2ZSgnY29tcGFueUNhcmQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN0cmljdDogJ0VBQycsXHJcbiAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcGFueS9jYXJkLmh0bWwnLFxyXG4gICAgICBjb250cm9sbGVyOiAnQ29tcGFueUVtYmVkQ29udHJvbGxlcicsXHJcbiAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgY29tcGFueTogJz1jb21wYW55JyxcclxuICAgICAgICBldmVudDogJz1ldmVudCcsXHJcbiAgICAgICAgbm90aWZpY2F0aW9uczogJz1ub3RpZmljYXRpb25zJyxcclxuICAgICAgICBtZTogJz1tZScsXHJcbiAgICAgICAgbWVtYmVyczogJz1tZW1iZXJzJ1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH0pO1xyXG4iLCJyZXF1aXJlKCcuL2NhcmQnKTsiLCJyZXF1aXJlKCcuL2lucHV0JykiLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sRGlyZWN0aXZlc1xyXG4gIC5kaXJlY3RpdmUoXHJcbiAgICAnZGF0ZUlucHV0JyxcclxuICAgIGZ1bmN0aW9uKGRhdGVGaWx0ZXIpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGlucHV0IHR5cGU9XCJkYXRlXCI+PC9pbnB1dD4nLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxtLCBhdHRycywgbmdNb2RlbEN0cmwpIHtcclxuICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRmb3JtYXR0ZXJzLnVuc2hpZnQoZnVuY3Rpb24gKG1vZGVsVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZUZpbHRlcihtb2RlbFZhbHVlLCAneXl5eS1NTS1kZCcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHBhcnNlcnMudW5zaGlmdChmdW5jdGlvbih2aWV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUodmlld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgfSkiLCJ0aGVUb29sRGlyZWN0aXZlcyA9IGFuZ3VsYXIubW9kdWxlKFwidGhlVG9vbC5kaXJlY3RpdmVzXCIsIFtdKTtcclxuXHJcbnJlcXVpcmUoXCIuL2NvbW1lbnRcIik7XHJcbnJlcXVpcmUoXCIuL2NvbW11bmljYXRpb25cIik7XHJcbnJlcXVpcmUoXCIuL2NvbXBhbnlcIik7XHJcbnJlcXVpcmUoXCIuL2RhdGVcIik7XHJcbnJlcXVpcmUoXCIuL21hcmtkb3duXCIpO1xyXG5yZXF1aXJlKFwiLi9tZWV0aW5nXCIpO1xyXG5yZXF1aXJlKFwiLi9zcGVha2VyXCIpO1xyXG5yZXF1aXJlKFwiLi90YWdcIik7XHJcbnJlcXVpcmUoXCIuL3RvcGljXCIpO1xyXG5yZXF1aXJlKFwiLi9zY3JvbGxcIik7XHJcbnJlcXVpcmUoXCIuL3N1YnNjcmlwdGlvblwiKTtcclxucmVxdWlyZShcIi4vbWVtYmVyXCIpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xEaXJlY3RpdmVzXHJcbiAgLmRpcmVjdGl2ZSgnY29tcGlsZScsIFsnJGNvbXBpbGUnLCBmdW5jdGlvbiAoJGNvbXBpbGUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICBzY29wZS4kd2F0Y2goXHJcbiAgICAgICAgICBmdW5jdGlvbihzY29wZSkge1xyXG4gICAgICAgICAgICAgLy8gd2F0Y2ggdGhlICdjb21waWxlJyBleHByZXNzaW9uIGZvciBjaGFuZ2VzXHJcbiAgICAgICAgICAgIHJldHVybiBzY29wZS4kZXZhbChhdHRycy5jb21waWxlKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICAvLyB3aGVuIHRoZSAnY29tcGlsZScgZXhwcmVzc2lvbiBjaGFuZ2VzXHJcbiAgICAgICAgICAgIC8vIGFzc2lnbiBpdCBpbnRvIHRoZSBjdXJyZW50IERPTVxyXG4gICAgICAgICAgICBlbGVtZW50Lmh0bWwodmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgLy8gY29tcGlsZSB0aGUgbmV3IERPTSBhbmQgbGluayBpdCB0byB0aGUgY3VycmVudFxyXG4gICAgICAgICAgICAvLyBzY29wZS5cclxuICAgICAgICAgICAgLy8gTk9URTogd2Ugb25seSBjb21waWxlIC5jaGlsZE5vZGVzIHNvIHRoYXRcclxuICAgICAgICAgICAgLy8gd2UgZG9uJ3QgZ2V0IGludG8gaW5maW5pdGUgbG9vcCBjb21waWxpbmcgb3Vyc2VsdmVzXHJcbiAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoc2NvcGUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1dKSIsInJlcXVpcmUoJy4vY29tcGlsZScpO1xyXG5yZXF1aXJlKCcuL21hcmtkb3duJyk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbERpcmVjdGl2ZXNcclxuICAuZGlyZWN0aXZlKCdtYXJrZG93bicsIFsnJGNvbXBpbGUnLCBmdW5jdGlvbiAoJGNvbXBpbGUpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgIHZhciBodG1sVGV4dCA9IG1hcmtkb3duLnRvSFRNTChlbGVtZW50LnRleHQoKSk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuaHRtbChodG1sVGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICB9XSkiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnRoZVRvb2xEaXJlY3RpdmVzLmRpcmVjdGl2ZShcImVtYmVkTWVldGluZ1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHJlc3RyaWN0OiBcIkVcIixcclxuICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZWV0aW5nL2VtYmVkLmh0bWxcIixcclxuICAgIGNvbnRyb2xsZXI6IFwiTWVldGluZ0VtYmVkQ29udHJvbGxlclwiLFxyXG4gICAgc2NvcGU6IHtcclxuICAgICAgbWVldGluZ0lkOiBcIj1cIixcclxuICAgICAgbWVtYmVyczogXCI9XCJcclxuICAgIH1cclxuICB9O1xyXG59KTtcclxuIiwicmVxdWlyZShcIi4vZW1iZWRcIik7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xEaXJlY3RpdmVzXHJcbiAgLmRpcmVjdGl2ZSgnbWVtYmVyQ2FyZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcclxuICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9tZW1iZXIvY2FyZC5odG1sJyxcclxuICAgICAgY29udHJvbGxlcjogJ01lbWJlckVtYmVkQ29udHJvbGxlcicsXHJcbiAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgbWVtYmVyOiAnPW1lbWJlck9iamVjdCcsXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSlcclxuIiwicmVxdWlyZSgnLi9jYXJkLmpzJyk7IiwicmVxdWlyZShcIi4vcG9zaXRpb24uanNcIik7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG50aGVUb29sRGlyZWN0aXZlcy5kaXJlY3RpdmUoJ3doZW5TY3JvbGxlZCcsIFsnJHRpbWVvdXQnLCBmdW5jdGlvbigkdGltZW91dCkge1xyXG4gIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxtLCBhdHRyKSB7XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZyhcIk9uIGRpcmVjdGl2ZVwiKTtcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKGVsbSk7XHJcblxyXG4gICAgdmFyIHJhdyA9IGVsbVswXTtcclxuICAgIC8vY29uc29sZS5sb2cocmF3KTtcclxuXHJcbiAgICAkdGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZyhyYXcuc2Nyb2xsVG9wKTtcclxuICAgICAgLy9jb25zb2xlLmxvZyhyYXcuc2Nyb2xsSGVpZ2h0KTtcclxuICAgICAgcmF3LnNjcm9sbFRvcCA9IHJhdy5zY3JvbGxIZWlnaHQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICBlbG0uYmluZCgnc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmIChyYXcuc2Nyb2xsVG9wIDw9IDEwMCkgeyAvLyBsb2FkIG1vcmUgaXRlbXMgYmVmb3JlIHlvdSBoaXQgdGhlIHRvcFxyXG4gICAgICAgIHZhciBzaCA9IHJhdy5zY3JvbGxIZWlnaHRcclxuICAgICAgICBzY29wZS4kYXBwbHkoYXR0ci53aGVuU2Nyb2xsZWQpO1xyXG4gICAgICAgIHJhdy5zY3JvbGxUb3AgPSByYXcuc2Nyb2xsSGVpZ2h0IC0gc2g7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcbn1dKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbERpcmVjdGl2ZXNcclxuICAuZGlyZWN0aXZlKCdzcGVha2VyQ2FyZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3RyaWN0OiAnQUVDJyxcclxuICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9zcGVha2VyL2NhcmQuaHRtbCcsXHJcbiAgICAgIGNvbnRyb2xsZXI6ICdTcGVha2VyRW1iZWRDb250cm9sbGVyJyxcclxuICAgICAgc2NvcGU6IHtcclxuICAgICAgICBzcGVha2VyOiAnPXNwZWFrZXInLFxyXG4gICAgICAgIGV2ZW50OiAnPWV2ZW50JyxcclxuICAgICAgICBub3RpZmljYXRpb25zOiAnPW5vdGlmaWNhdGlvbnMnLFxyXG4gICAgICAgIG1lOiAnPW1lJyxcclxuICAgICAgICBtZW1iZXJzOiAnPW1lbWJlcnMnXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSk7XHJcbiIsImFyZ3VtZW50c1s0XVs1Nl1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpIiwicmVxdWlyZSgnLi9zdWJzY3JpcHRpb24nKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sRGlyZWN0aXZlc1xyXG4gIC5kaXJlY3RpdmUoJ3N1YnNjcmlwdGlvbicsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcclxuICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9zdWJzY3JpcHRpb24vYnV0dG9uLmh0bWwnLFxyXG4gICAgICBjb250cm9sbGVyOiAnU3Vic2NyaXB0aW9uQ29udHJvbGxlcicsXHJcbiAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgdGhyZWFkOiAnQCdcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9KSIsImFyZ3VtZW50c1s0XVs0M11bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG50aGVUb29sRGlyZWN0aXZlc1xyXG4gIC5kaXJlY3RpdmUoXCJ0YWdNYW5hZ2VyXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3RyaWN0OiBcIkVcIixcclxuICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdGFnL21hbmFnZXIuaHRtbFwiLFxyXG4gICAgICBjb250cm9sbGVyOiBcIlRhZ01hbmFnZXJDb250cm9sbGVyXCIsXHJcbiAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgdGFnczogXCI9dGFnc0FycmF5XCIsXHJcbiAgICAgICAgc2VhcmNoOiBcIj1cIlxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH0pXHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudGhlVG9vbERpcmVjdGl2ZXMuZGlyZWN0aXZlKFwidG9waWNDYXJkXCIsIGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4ge1xyXG4gICAgcmVzdHJpY3Q6IFwiRVwiLFxyXG4gICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3RvcGljL2NhcmQuaHRtbFwiLFxyXG4gICAgY29udHJvbGxlcjogXCJUb3BpY0VtYmVkQ29udHJvbGxlclwiLFxyXG4gICAgc2NvcGU6IHtcclxuICAgICAgdG9waWM6IFwiPVwiLFxyXG4gICAgICBtZW1iZXJzOiBcIj1cIixcclxuICAgICAgbWU6IFwiPVwiLFxyXG4gICAgICByb2xlczogXCI9XCIsXHJcbiAgICAgIHRhZ3M6IFwiPVwiLFxyXG4gICAgICBjb21tZW50czogXCI9XCIsXHJcbiAgICAgIG5vdGlmaWNhdGlvbnM6IFwiPVwiXHJcbiAgICB9XHJcbiAgfTtcclxufSk7XHJcbiIsInJlcXVpcmUoXCIuL3RvcGljXCIpO1xyXG5yZXF1aXJlKFwiLi9jYXJkXCIpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnRoZVRvb2xEaXJlY3RpdmVzLmRpcmVjdGl2ZShcInRvcGljXCIsIGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4ge1xyXG4gICAgcmVzdHJpY3Q6IFwiRVwiLFxyXG4gICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3RvcGljL3RvcGljLmh0bWxcIixcclxuICAgIGNvbnRyb2xsZXI6IFwiVG9waWNFbWJlZENvbnRyb2xsZXJcIixcclxuICAgIHNjb3BlOiB7XHJcbiAgICAgIHRvcGljOiBcIj1cIixcclxuICAgICAgbWVtYmVyczogXCI9XCIsXHJcbiAgICAgIG1lOiBcIj1cIixcclxuICAgICAgcm9sZXM6IFwiPVwiLFxyXG4gICAgICB0YWdzOiBcIj1cIixcclxuICAgICAgY29tbWVudHM6IFwiPVwiLFxyXG4gICAgICBub3RpZmljYXRpb25zOiBcIj1cIlxyXG4gICAgfVxyXG4gIH07XHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5maWx0ZXJzJywgW10pXHJcbiAgLmZpbHRlcignaW50ZXJwb2xhdGUnLCBbJ3ZlcnNpb24nLCBmdW5jdGlvbih2ZXJzaW9uKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICByZXR1cm4gU3RyaW5nKHRleHQpLnJlcGxhY2UoL1xcJVZFUlNJT05cXCUvbWcsIHZlcnNpb24pO1xyXG4gICAgfVxyXG4gIH1dKVxyXG4gIC5maWx0ZXIoJ2ZpbHRlckV2ZW50U3RhdHVzJywgZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBmdW5jdGlvbihvYmpzLCBldmVudCwgc2VhcmNoKSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSBvYmpzO1xyXG4gICAgICByZXN1bHQgPSBvYmpzLmZpbHRlcihmdW5jdGlvbihvKSB7XHJcbiAgICAgICAgaWYoby5wYXJ0aWNpcGF0aW9ucy5sZW5ndGggPD0gMCl7XHJcbiAgICAgICAgICByZXR1cm4gc2VhcmNoLnVuYXNzaWduZWQgfHwgc2VhcmNoLnVuYXNzaWduZWRPbmx5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihldmVudCAmJiAhc2VhcmNoLnVuYXNzaWduZWRPbmx5KSB7XHJcbiAgICAgICAgICByZXR1cm4gby5wYXJ0aWNpcGF0aW9ucy5maWx0ZXIoZnVuY3Rpb24ocCkge1xyXG4gICAgICAgICAgICBpZihzZWFyY2guc3RhdHVzICYmIHNlYXJjaC5zdGF0dXMgIT09ICcnICYmIHNlYXJjaC5tZW1iZXIgJiYgc2VhcmNoLm1lbWJlciAhPT0gJycpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gcC5ldmVudCA9PT0gZXZlbnQuaWQgJiYgcC5zdGF0dXMgPT09IHNlYXJjaC5zdGF0dXMgJiYgcC5tZW1iZXIgPT09IHNlYXJjaC5tZW1iZXI7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihzZWFyY2guc3RhdHVzICYmIHNlYXJjaC5zdGF0dXMgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHAuZXZlbnQgPT09IGV2ZW50LmlkICYmIHAuc3RhdHVzID09PSBzZWFyY2guc3RhdHVzO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoc2VhcmNoLm1lbWJlciAmJiBzZWFyY2gubWVtYmVyICE9PSAnJykge1xyXG4gICAgICAgICAgICAgIHJldHVybiBwLmV2ZW50ID09PSBldmVudC5pZCAmJiBwLm1lbWJlciA9PT0gc2VhcmNoLm1lbWJlcjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXR1cm4gcC5ldmVudCA9PT0gZXZlbnQuaWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgfSlcclxuICAuZmlsdGVyKCdmaWx0ZXJSb2xlJywgZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24obWVtYmVycywgcm9sZSkge1xyXG4gICAgICAgICAgdmFyIHJlc3VsdCA9IG1lbWJlcnM7XHJcbiAgICAgICAgICBpZihyb2xlKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IG1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHIuaWQgPT0gcm9sZTtcclxuICAgICAgICAgICAgICB9KS5sZW5ndGggPiAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgIH07XHJcbiAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbFNlcnZpY2VzXHJcbiAgLmZhY3RvcnkoJ0NoYXRGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgQ2hhdDogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY2hhdC86aWQnLCBudWxsLCB7XHJcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9XHJcbiAgICAgIH0pLFxyXG4gICAgICBNZXNzYWdlOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jaGF0LzppZC9tZXNzYWdlcycsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsaXNBcnJheTp0cnVlfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbFNlcnZpY2VzXHJcbiAgLmZhY3RvcnkoJ0NvbW1lbnRGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgQ29tbWVudDogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tbWVudC86aWQnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcclxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxyXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxyXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cclxuICAgICAgfSksXHJcbiAgICAgIENvbXBhbnk6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NvbXBhbnkvOmlkL2NvbW1lbnRzJywgbnVsbCwge1xyXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cclxuICAgICAgfSksXHJcbiAgICAgIFNwZWFrZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3NwZWFrZXIvOmlkL2NvbW1lbnRzJywgbnVsbCwge1xyXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cclxuICAgICAgfSksXHJcbiAgICAgIFRvcGljOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS90b3BpYy86aWQvY29tbWVudHMnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxyXG4gICAgICB9KSxcclxuICAgICAgQ29tbXVuaWNhdGlvbjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tbXVuaWNhdGlvbi86aWQvY29tbWVudHMnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbFNlcnZpY2VzXHJcbiAgLmZhY3RvcnkoJ0NvbW11bmljYXRpb25GYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgQ29tbXVuaWNhdGlvbjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tbXVuaWNhdGlvbi86aWQnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcclxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxyXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxyXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cclxuICAgICAgfSksXHJcbiAgICAgIENvbXBhbnk6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NvbXBhbnkvOmlkL2NvbW11bmljYXRpb25zJywgbnVsbCwge1xyXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cclxuICAgICAgfSksXHJcbiAgICAgIFNwZWFrZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3NwZWFrZXIvOmlkL2NvbW11bmljYXRpb25zJywgbnVsbCwge1xyXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cclxuICAgICAgfSlcclxuICAgIH07XHJcbiAgfSkiLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sU2VydmljZXNcclxuICAuZmFjdG9yeSgnQ29tcGFueUZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBDb21wYW55OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21wYW55LzppZCcsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6dHJ1ZX0sXHJcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcclxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcclxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XHJcbiAgICAgIH0pLFxyXG4gICAgICBNZW1iZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL21lbWJlci86aWQvY29tcGFuaWVzJywgbnVsbCwge1xyXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfVxyXG4gICAgICB9KVxyXG4gICAgfTtcclxuICB9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xTZXJ2aWNlc1xyXG4gIC5mYWN0b3J5KCdFbWFpbEZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBDb21wYW55OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21wYW55LzppZC9zZW5kSW5pdGlhbEVtYWlsJywgbnVsbCwge1xyXG4gICAgICAgICdzZW5kJzoge21ldGhvZDogJ1BPU1QnfVxyXG4gICAgICB9KSxcclxuICAgICAgU3BlYWtlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvc3BlYWtlci86aWQvc2VuZEluaXRpYWxFbWFpbCcsIG51bGwsIHtcclxuICAgICAgICAnc2VuZCc6IHttZXRob2Q6ICdQT1NUJ31cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xTZXJ2aWNlc1xyXG4gIC5mYWN0b3J5KCdFdmVudEZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBFdmVudDogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvZXZlbnQvOmlkJywgbnVsbCwge1xyXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXHJcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcclxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcclxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSkiLCJ0aGVUb29sU2VydmljZXMgPSBhbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5zZXJ2aWNlcycsIFsnbmdSZXNvdXJjZSddKTtcclxuXHJcbnJlcXVpcmUoJy4vY2hhdCcpO1xyXG5yZXF1aXJlKCcuL2NvbW1lbnQnKTtcclxucmVxdWlyZSgnLi9jb21tdW5pY2F0aW9uJyk7XHJcbnJlcXVpcmUoJy4vY29tcGFueScpO1xyXG5yZXF1aXJlKCcuL2VtYWlsJyk7XHJcbnJlcXVpcmUoJy4vbWVldGluZycpO1xyXG5yZXF1aXJlKCcuL21lbWJlcicpO1xyXG5yZXF1aXJlKCcuL21lc3NhZ2UnKTtcclxucmVxdWlyZSgnLi9ub3RpZmljYXRpb24nKTtcclxucmVxdWlyZSgnLi9yb2xlJyk7XHJcbnJlcXVpcmUoJy4vc2Vzc2lvbicpO1xyXG5yZXF1aXJlKCcuL3NvY2tldCcpO1xyXG5yZXF1aXJlKCcuL3NwZWFrZXInKTtcclxucmVxdWlyZSgnLi9zdWJzY3JpcHRpb24nKTtcclxucmVxdWlyZSgnLi90YWcnKTtcclxucmVxdWlyZSgnLi90b3BpYycpO1xyXG5yZXF1aXJlKCcuL2V2ZW50Jyk7XHJcbnJlcXVpcmUoJy4vaXRlbScpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sU2VydmljZXNcclxuICAuZmFjdG9yeSgnSXRlbUZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBJdGVtOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9pdGVtLzppZCcsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxyXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXHJcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXHJcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbFNlcnZpY2VzXHJcbiAgLmZhY3RvcnkoJ01lZXRpbmdGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL21lZXRpbmcvOmlkJywgbnVsbCwge1xyXG4gICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxyXG4gICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcclxuICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcclxuICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxyXG4gICAgfSk7XHJcbiAgfSlcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbFNlcnZpY2VzXHJcbiAgLmZhY3RvcnkoJ01lbWJlckZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBNZW1iZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL21lbWJlci86aWQnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9LFxyXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXHJcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXHJcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxyXG4gICAgICB9KSxcclxuICAgICAgUm9sZTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvcm9sZS86aWQvbWVtYmVycycsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XHJcbiAgICAgIH0pLFxyXG4gICAgICBNZTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvbXlzZWxmJywgbnVsbCwge1xyXG4gICAgICAgICdnZXQnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogZmFsc2V9XHJcbiAgICAgIH0pXHJcbiAgICB9O1xyXG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbFNlcnZpY2VzXHJcbiAgLmZhY3RvcnkoJ01lc3NhZ2VGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL21lc3NhZ2UvOmlkJywgbnVsbCwge1xyXG4gICAgICAgICdnZXRBbGwnOiAgICB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cclxuICAgICAgfSlcclxuICB9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xTZXJ2aWNlcy5mYWN0b3J5KCdOb3RpZmljYXRpb25GYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gIHJldHVybiB7XHJcbiAgICBOb3RpZmljYXRpb246ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL25vdGlmaWNhdGlvbi86aWQnLCBudWxsLCB7XHJcbiAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXHJcbiAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ31cclxuICAgIH0pLFxyXG4gICAgQ29tcGFueTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tcGFueS86aWQvbm90aWZpY2F0aW9ucycsIG51bGwsIHtcclxuICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxyXG4gICAgfSksXHJcbiAgICBTcGVha2VyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9zcGVha2VyLzppZC9ub3RpZmljYXRpb25zJywgbnVsbCwge1xyXG4gICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XHJcbiAgICB9KSxcclxuICAgIFRvcGljOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS90b3BpYy86aWQvbm90aWZpY2F0aW9ucycsIG51bGwsIHtcclxuICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxyXG4gICAgfSlcclxuICB9O1xyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudGhlVG9vbFNlcnZpY2VzXHJcbiAgLmZhY3RvcnkoJ1JvbGVGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgUm9sZTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvcm9sZS86aWQnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcclxuICAgICAgfSksXHJcbiAgICAgIE1lbWJlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvcm9sZS86aWQvbWVtYmVycycsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XHJcbiAgICAgIH0pXHJcbiAgICB9O1xyXG4gIH0pXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnRoZVRvb2xTZXJ2aWNlc1xyXG4gIC5mYWN0b3J5KCdTZXNzaW9uRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIFNlc3Npb246ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3Nlc3Npb24vOmlkJywgbnVsbCwge1xyXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXHJcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcclxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcclxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XHJcbiAgICAgIH0pLFxyXG4gICAgICBDb21wYW55OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21wYW55LzppZC9zZXNzaW9ucycsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XHJcbiAgICAgIH0pLFxyXG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9zcGVha2VyLzppZC9zZXNzaW9ucycsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSkiLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sU2VydmljZXNcclxuICAuZmFjdG9yeSgnU29ja2V0RmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UsICRsb2NhdGlvbiwgJHJvb3RTY29wZSkge1xyXG4gICAgdmFyIHNvY2tldDtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGNvbm5lY3Q6IGZ1bmN0aW9uKG5zcCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coc29ja2V0KTtcclxuICAgICAgICBzb2NrZXQgPSBpby5jb25uZWN0KG5zcCwge211bHRpcGxleDogZmFsc2V9KTtcclxuICAgICAgfSxcclxuICAgICAgb246IGZ1bmN0aW9uIChldmVudE5hbWUsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgc29ja2V0Lm9uKGV2ZW50TmFtZSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHNvY2tldCwgYXJncyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgZW1pdDogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZGF0YSwgY2FsbGJhY2spIHtcclxuICAgICAgICBzb2NrZXQuZW1pdChldmVudE5hbWUsIGRhdGEsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShzb2NrZXQsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgZGlzY29ubmVjdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNvY2tldC5kaXNjb25uZWN0KCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHNvY2tldDogc29ja2V0XHJcbiAgICB9O1xyXG4gIH0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sU2VydmljZXNcclxuICAuZmFjdG9yeSgnU3BlYWtlckZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9zcGVha2VyLzppZCcsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6dHJ1ZX0sXHJcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcclxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcclxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XHJcbiAgICAgIH0pLFxyXG4gICAgICBNZW1iZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL21lbWJlci86aWQvc3BlYWtlcnMnLCBudWxsLCB7XHJcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9XHJcbiAgICAgIH0pXHJcbiAgICB9O1xyXG4gIH0pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG50aGVUb29sU2VydmljZXMuZmFjdG9yeShcIlN1YnNjcmlwdGlvbkZhY3RvcnlcIiwgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gIHJldHVybiB7XHJcbiAgICBDb21wYW55OiAkcmVzb3VyY2UodXJsX3ByZWZpeCArIFwiL2FwaS9jb21wYW55LzppZC9zdWJzY3JpcHRpb25cIiwgbnVsbCwge1xyXG4gICAgICBcImdldFwiOiB7bWV0aG9kOiBcIkdFVFwifSxcclxuICAgICAgXCJhZGRcIjoge21ldGhvZDogXCJQT1NUXCJ9LFxyXG4gICAgICBcInJlbW92ZVwiOiB7bWV0aG9kOiBcIkRFTEVURVwifVxyXG4gICAgfSksXHJcbiAgICBTcGVha2VyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCArIFwiL2FwaS9zcGVha2VyLzppZC9zdWJzY3JpcHRpb25cIiwgbnVsbCwge1xyXG4gICAgICBcImdldFwiOiB7bWV0aG9kOiBcIkdFVFwifSxcclxuICAgICAgXCJhZGRcIjoge21ldGhvZDogXCJQT1NUXCJ9LFxyXG4gICAgICBcInJlbW92ZVwiOiB7bWV0aG9kOiBcIkRFTEVURVwifVxyXG4gICAgfSksXHJcbiAgICBUb3BpYzogJHJlc291cmNlKHVybF9wcmVmaXggKyBcIi9hcGkvdG9waWMvOmlkL3N1YnNjcmlwdGlvblwiLCBudWxsLCB7XHJcbiAgICAgIFwiZ2V0XCI6IHttZXRob2Q6IFwiR0VUXCJ9LFxyXG4gICAgICBcImFkZFwiOiB7bWV0aG9kOiBcIlBPU1RcIn0sXHJcbiAgICAgIFwicmVtb3ZlXCI6IHttZXRob2Q6IFwiREVMRVRFXCJ9XHJcbiAgICB9KVxyXG4gIH07XHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sU2VydmljZXNcclxuICAuZmFjdG9yeSgnVGFnRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIFRhZzogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvdGFnLzppZCcsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxyXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXHJcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXHJcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxyXG4gICAgICB9KSxcclxuICAgICAgVG9waWM6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3RhZy86aWQvdG9waWNzJywgbnVsbCwge1xyXG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cclxuICAgICAgfSlcclxuICAgIH07XHJcbiAgfSkiLCIndXNlIHN0cmljdCc7XHJcblxyXG50aGVUb29sU2VydmljZXNcclxuICAuZmFjdG9yeSgnVG9waWNGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgVG9waWM6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3RvcGljLzppZCcsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxyXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxyXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXHJcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxyXG4gICAgICB9KSxcclxuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9tZW1iZXIvOmlkL3RvcGljcycsIG51bGwsIHtcclxuICAgICAgICAnZ2V0QWxsJzogeyBtZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlIH1cclxuICAgICAgfSlcclxuICAgIH07XHJcbiAgfSlcclxuIiwidXJsX3ByZWZpeCA9IHJlcXVpcmUoJy4vLi4vLi4vY29uZmlnJykudXJsO1xyXG5cclxucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2FwcC5qcycpO1xyXG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMnKTtcclxucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMnKTtcclxucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2ZpbHRlcnMnKTtcclxucmVxdWlyZSgnLi9hbmd1bGFyQXBwL3NlcnZpY2VzJyk7IiwidmFyIHByb2Nlc3M9cmVxdWlyZShcIl9fYnJvd3NlcmlmeV9wcm9jZXNzXCIpO3ZhciBjb25maWcgPSB7XHJcbiAgdXJsOiBwcm9jZXNzLmVudi5FVkVOVERFQ0tfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjgwODAnLFxyXG4gIHBvcnQ6IHByb2Nlc3MuZW52LkVWRU5UREVDS19QT1JUIHx8IDgwODAsXHJcbn07XHJcblxyXG5jb25maWcubW9uZ28gPSB7XHJcbiAgdXJsOiBwcm9jZXNzLmVudi5FVkVOVERFQ0tfTU9OR09fVVJMIHx8ICdtb25nb2RiOi8vbG9jYWxob3N0L3NpbmZvJ1xyXG59O1xyXG5cclxuY29uZmlnLmNvb2tpZSA9IHtcclxuICBuYW1lOiBwcm9jZXNzLmVudi5FVkVOVERFQ0tfQ09PS0lFX05BTUUgfHwgJ2V2ZW50ZGVjaycsXHJcbiAgcGFzc3dvcmQ6IHByb2Nlc3MuZW52LkVWRU5UREVDS19DT09LSUVfUEFTU1dPUkQgfHwgJ1lPVVIgQ09PS0lFIFBBU1NXT1JEJ1xyXG59O1xyXG5cclxuY29uZmlnLm1haWxndW4gPSB7XHJcbiAgZW1haWw6IHByb2Nlc3MuZW52LkVWRU5UREVDS19NQUlMR1VOX0VNQUlMIHx8ICdkZWNrQHNpbmZvLm9yZycsXHJcbiAgYXBpOiBwcm9jZXNzLmVudi5FVkVOVERFQ0tfTUFJTEdVTl9BUEkgfHwgJ1lPVVIgTUFJTEdVTiBLRVknLFxyXG4gIHB1YmxpY0FwaTogcHJvY2Vzcy5lbnYuRVZFTlRERUNLX01BSUxHVU5fUFVCTElDX0FQSSB8fCAnWU9VUiBNQUlMR1VOIFBVQkxJQyBLRVknXHJcbn07XHJcblxyXG5jb25maWcuZmFjZWJvb2sgPSB7XHJcbiAgYXBwSWQ6IHByb2Nlc3MuZW52LkVWRU5UREVDS19GQUNFQk9PS19BUFBfSUQgfHwgJzQ1NzIwNzUwNzc0NDE1OScsXHJcbiAgYXBwU2VjcmV0OiBwcm9jZXNzLmVudi5FVkVOVERFQ0tfRkFDRUJPT0tfQVBQX1NFQ1JFVCB8fCAnOWYwMjdjNTJlMDBiYzNhZGJhYmNkOTI2YTNjOTViOTcnXHJcbn07XHJcblxyXG5jb25maWcuYnVueWFuID0ge1xyXG4gIG5hbWU6IHJlcXVpcmUoJy4vcGFja2FnZS5qc29uJykubmFtZSxcclxuICBsZXZlbDogcHJvY2Vzcy5lbnYuRVZFTlRERUNLX0xPR19MRVZFTCB8fCAndHJhY2UnXHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7XHJcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzPXtcclxuICBcIm5hbWVcIjogXCJldmVudGRlY2tcIixcclxuICBcInZlcnNpb25cIjogXCIwLjAuMFwiLFxyXG4gIFwiZGVzY3JpcHRpb25cIjogXCJldmVudGRlY2sgPT09PT09PT1cIixcclxuICBcIm1haW5cIjogXCJpbmRleC5qc1wiLFxyXG4gIFwic2NyaXB0c1wiOiB7XHJcbiAgICBcInN0YXJ0XCI6IFwibm9kZSBzZXJ2ZXJBcHAvaW5kZXguanMgfCBidW55YW5cIixcclxuICAgIFwibW9uXCI6IFwibm9kZV9tb2R1bGVzLy5iaW4vbm9kZW1vbiBzZXJ2ZXJBcHAvaW5kZXguanMgfCBidW55YW5cIixcclxuICAgIFwiZGlzdFwiOiBcIm5vZGVfbW9kdWxlcy8uYmluL2Jyb3dzZXJpZnkgLXQgYnJmcyAtLWRlYnVnIC1lIGNsaWVudEFwcC9qcy90aGVUb29sLmpzIC1vIHB1YmxpYy9qcy90aGVUb29sLmpzXCIsXHJcbiAgICBcInRlc3RcIjogXCJlY2hvIFxcXCJFcnJvcjogbm8gdGVzdCBzcGVjaWZpZWRcXFwiICYmIGV4aXQgMVwiXHJcbiAgfSxcclxuICBcInJlcG9zaXRvcnlcIjoge1xyXG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXHJcbiAgICBcInVybFwiOiBcImdpdDovL2dpdGh1Yi5jb20vU0lORk8vZXZlbnRkZWNrLmdpdFwiXHJcbiAgfSxcclxuICBcImF1dGhvclwiOiBcIkZyYW5jaXNjbyBEaWFzIDxmcmFuY2lzY29AYmFpb2RpYXMuY29tPiAoaHR0cDovL2ZyYW5jaXNjb2RpYXMubmV0LylcIixcclxuICBcImxpY2Vuc2VcIjogXCJCU0QtMi1DbGF1c2VcIixcclxuICBcImJ1Z3NcIjoge1xyXG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vU0lORk8vZXZlbnRkZWNrL2lzc3Vlc1wiXHJcbiAgfSxcclxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL1NJTkZPL2V2ZW50ZGVja1wiLFxyXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiY3JvblwiOiBcIn4xLjAuNFwiLFxyXG4gICAgXCJoYXBpXCI6IFwifjMuMC4wXCIsXHJcbiAgICBcImhhcGktYXV0aC1jb29raWVcIjogXCJ+MS4wLjJcIixcclxuICAgIFwiaGFuZGxlYmFyc1wiOiBcIn4yLjAuMC1hbHBoYS4yXCIsXHJcbiAgICBcImFzeW5jXCI6IFwifjAuMi45XCIsXHJcbiAgICBcIm1vbmdvb3NlXCI6IFwifjMuOC40XCIsXHJcbiAgICBcIm1hcmtkb3duXCI6IFwifjAuNS4wXCIsXHJcbiAgICBcImVtYWlsanNcIjogXCJ+MC4zLjhcIixcclxuICAgIFwic29ja2V0LmlvXCI6IFwifjEuMC4yXCIsXHJcbiAgICBcInNvY2tldC5pby1jbGllbnRcIjogXCJ+MS4wLjJcIixcclxuICAgIFwicmVxdWVzdFwiOiBcIn4yLjM2LjBcIixcclxuICAgIFwibWFpbGd1blwiOiBcIn4wLjQuMlwiLFxyXG4gICAgXCJtYWlsY29tcG9zZXJcIjogXCJ+MC4yLjEyXCIsXHJcbiAgICBcImJ1bnlhblwiOiBcIn4xLjAuMVwiXHJcbiAgfSxcclxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcIm5vZGVtb25cIjogXCJ+MC43LjEwXCIsXHJcbiAgICBcImNvbG9yc1wiOiBcIn4wLjYuMlwiLFxyXG4gICAgXCJnYXplXCI6IFwifjAuNC4zXCIsXHJcbiAgICBcImJyZnNcIjogXCIwLjAuOFwiLFxyXG4gICAgXCJicm93c2VyaWZ5XCI6IFwifjMuMjAuMFwiLFxyXG4gICAgXCJ0YWJsZXRvcFwiOiBcIn4xLjMuM1wiXHJcbiAgfVxyXG59XHJcbiJdfQ==
