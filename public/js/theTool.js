(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

angular.module("theTool", [
  "ng",
  "ngRoute",
  "ngSanitize",
  "ngTouch",
  "infinite-scroll",
  "luegg.directives",
  "ngAudio",
  "theTool.filters",
  "theTool.services",
  "theTool.directives",
  "theTool.controllers"
]).
config(["$routeProvider", function($routeProvider) {
  $routeProvider.when("/"                         , {templateUrl: "views/home.html",                  controller: "home"});
  $routeProvider.when("/login"                    , {templateUrl: "views/auth/login.html",            controller: "LoginController"});
  $routeProvider.when("/login/:id/:code"          , {templateUrl: "views/auth/login.html",            controller: "LoginController"});
  $routeProvider.when("/companies/"               , {templateUrl: "views/company/list.html",          controller: "CompaniesController"});
  $routeProvider.when("/companies/table/"         , {templateUrl: "views/company/table.html",         controller: "CompaniesController"});
  $routeProvider.when("/companies/budget/"        , {templateUrl: "views/company/budget.html",        controller: "CompaniesController"});
  $routeProvider.when("/company/"                 , {templateUrl: "views/company/create.html",        controller: "CreateCompanyController"});
  $routeProvider.when("/company/:id"              , {templateUrl: "views/company/view.html",          controller: "CompanyController"});
  $routeProvider.when("/company/:id/edit"         , {templateUrl: "views/company/edit.html",          controller: "CompanyController"});
  $routeProvider.when("/company/:id/participation", {templateUrl: "views/company/participation.html", controller: "CompanyController"});
  $routeProvider.when("/company/:id/confirm"      , {templateUrl: "views/company/confirm.html",       controller: "CompanyEmailController"});
  $routeProvider.when("/comment/:id/edit"         , {templateUrl: "views/comment/edit.html",          controller: "CommentController"});
  $routeProvider.when("/speakers/"                , {templateUrl: "views/speaker/list.html",          controller: "SpeakersController"});
  $routeProvider.when("/speakers/table/"          , {templateUrl: "views/speaker/table.html",         controller: "SpeakersController"});
  $routeProvider.when("/speaker/"                 , {templateUrl: "views/speaker/create.html",        controller: "CreateSpeakerController"});
  $routeProvider.when("/speaker/:id"              , {templateUrl: "views/speaker/view.html",          controller: "SpeakerController"});
  $routeProvider.when("/speaker/:id/edit"         , {templateUrl: "views/speaker/edit.html",          controller: "SpeakerController"});
  $routeProvider.when("/speaker/:id/confirm"      , {templateUrl: "views/speaker/confirm.html",       controller: "SpeakerEmailController"});
  $routeProvider.when("/members/"                 , {templateUrl: "views/member/list.html",           controller: "MembersController"});
  $routeProvider.when("/member/"                  , {templateUrl: "views/member/create.html",         controller: "CreateMemberController"});
  $routeProvider.when("/member/:id"               , {templateUrl: "views/member/view.html",           controller: "MemberController"});
  $routeProvider.when("/member/:id/edit"          , {templateUrl: "views/member/edit.html",           controller: "MemberController"});
  $routeProvider.when("/meetings"                 , {templateUrl: "views/meeting/list.html",          controller: "MeetingsController"});
  $routeProvider.when("/meeting/:id"              , {templateUrl: "views/meeting/view.html",          controller: "MeetingController"});
  $routeProvider.when("/meeting/:id/text"         , {templateUrl: "views/meeting/text.html",          controller: "MeetingController"});
  $routeProvider.when("/meeting/:id/edit"         , {templateUrl: "views/meeting/edit.html",          controller: "MeetingController"});
  $routeProvider.when("/chats"                    , {templateUrl: "views/chat/list.html",             controller: "ChatsController"});
  $routeProvider.when("/chat/:id"                 , {templateUrl: "views/chat/view.html",             controller: "ChatController"});
  $routeProvider.when("/topics"                   , {templateUrl: "views/topic/list.html",            controller: "TopicsController"});
  $routeProvider.when("/topic/:id"                , {templateUrl: "views/topic/view.html",            controller: "TopicController"});
  $routeProvider.when("/communications"           , {templateUrl: "views/communication/list.html",    controller: "CommunicationsController"});
  $routeProvider.otherwise({redirectTo: "/"});
}]);

},{}],2:[function(require,module,exports){
require("./login");
require('./interceptor');

},{"./interceptor":3,"./login":4}],3:[function(require,module,exports){
theToolController.config(function ($httpProvider) {
  $httpProvider.interceptors.push(['$injector', function ($injector) {
    return $injector.get('AuthInterceptor');
  }]);
});

theToolController.factory('AuthInterceptor', function ($rootScope, $location, $window) {
  return {
    responseError: function (response) {
      if (response.status === 401) {
        if($location.path().indexOf('/login') == -1) {
          $rootScope.nextPath = '#';
          console.log($location.path());
          if($location.path() !== '/login'){
            $rootScope.nextPath += $location.path();
          }
          $location.path('/login');
        }
      }
    }
  };
});

},{}],4:[function(require,module,exports){
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
          $window.location.assign($rootScope.nextPath);
        }).
        error(function(data, status, headers, config) {
          $scope.loading = false;
          console.log("ERROR", data);
        });
    }
  };

  $scope.sendEmail = function (memberId) {
    $scope.loading = true;
    $scope.loginInfo = "Sending email...";  
    $scope.showIdInput = false;
    console.log("Sending email...");

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
        console.log("Email sent!")
      }).
      error(function(data, status, headers, config) {
        $scope.loading = false;
        setInfo("There was an error...");
        $scope.showIdInput = true;
        console.log("ERROR", data);
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

},{"./../../../../../config":92}],5:[function(require,module,exports){
'use strict';

theToolController.controller('ChatController', function ($rootScope, $scope, $http, $routeParams, $sce, ngAudio, SocketFactory, MessageFactory, ChatFactory, MemberFactory) {

  $scope.error = {};

  $scope.updating = false;
  $scope.loading  = true;
  $scope.messages = [];
  $scope.online   = [];
 /* $scope.history  = function () {
    setTimeout(function() {$scope.history()}, 3000);
  }*/

  console.log($scope.scroll);

  console.log("Connecting");

  SocketFactory.connect('/chat');

  SocketFactory.on('connected', function () {
    console.log(SocketFactory.socket);
    SocketFactory.emit('auth', {id: $routeParams.id, user: $scope.me.id}, function () {
      console.log('Auth success');
    });
  });

  SocketFactory.on('validation', function (response){
    console.log(response);
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
      console.log($scope.online);
      $scope.history = history;
/*      $scope.$watch('scroll', function(newValue, oldValue, scope) {
        if (!newValue) {history();}
      });*/
    }
    else{
      console.log(response.message);
    }
    $scope.loading  = false;
  });

  SocketFactory.on('user:connected', function (response) {
    console.log("User connected: " + response.id);
    for(var i = 0; i < $scope.online.length; i++){
      if($scope.online[i].member === response.id){
        $scope.online[i].on = true;
        break;
      }
    }
  });

  SocketFactory.on('user:disconnected', function (response) {
    console.log("User connected: " + response.id);
    for(var i = 0; i < $scope.online.length; i++){
      if($scope.online[i].member === response.id){
        $scope.online[i].on = false;
        break;
      }
    }
  });

  SocketFactory.on('message', function (response) {
    var message = response.message
    $scope.messages.push(message);
    if(message.member != $scope.me.id) {
      ngAudio.play("audio/message.mp3");
    }
  });

  SocketFactory.on('history-send', function (response) {
    $scope.messages = $scope.messages.concat(response.messages);
    $scope.updating = false;
  });

  $scope.$on('$locationChangeStart', function(){
    console.log("On location change");
    console.log(SocketFactory);
    SocketFactory.disconnect();
    delete SocketFactory.socket;
  });

  $scope.submit = function() {
    if ($scope.text == ""){
      return;
    }

    var messageData = {
      text   : $scope.text,
      chatId : $routeParams.id,
      member : $scope.me.id,
    }
    console.log(messageData);

    SocketFactory.emit('send', {room: $scope.room, message: messageData }, function() {
      console.log('Message sent');
      $scope.text = "";
    });
  };

  function history () {
    console.log('Start history request');
    if(!$scope.updating){
      $scope.updating = true;
      SocketFactory.emit('history-get', {room: $scope.room, date: $scope.messages[$scope.messages.length-1].date }, function() {
        console.log('Sent history request');
      });
    }
  }
});
},{}],6:[function(require,module,exports){
require('./list');
require('./chat');
},{"./chat":5,"./list":7}],7:[function(require,module,exports){
'use strict';

theToolController.controller('ChatsController', function ($scope, ChatFactory) {

  $scope.loading = true;

  ChatFactory.Chat.getAll(function(chats) {
    $scope.chats = chats;
    $scope.loading = false;
  });

});

},{}],8:[function(require,module,exports){
"use strict";

theToolController.controller("CommentAreaController", function ($scope, $http, $routeParams, MemberFactory, CommentFactory) {

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

});

},{}],9:[function(require,module,exports){
"use strict";

theToolController.controller("FirstCommentController", function ($scope, $http, $routeParams, MemberFactory, CommentFactory) {

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

});

},{}],10:[function(require,module,exports){
require('./area.js');
require('./first.js');

},{"./area.js":8,"./first.js":9}],11:[function(require,module,exports){
"use strict";

theToolController.controller("CommunicationAreaController", function ($scope, $http, $routeParams, CommunicationFactory) {

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
      CommunicationFactory.Company.getAll({id: pageId}, gotCommunications);
      $scope.kinds=['Email To', 'Email From', 'Meeting', 'Phone Call'];
    }
    else if ($scope.thread.indexOf("speaker-") != -1) {
      CommunicationFactory.Speaker.getAll({id: pageId}, gotCommunications);
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

    CommunicationFactory.Communication.create({
      thread: $scope.thread,
      member: $scope.me.id,
      kind: $scope.communicationData.kind,
      text: $scope.communicationData.text,
      posted: date,
      updated: date
    }, function (response) {
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

});

},{}],12:[function(require,module,exports){
"use strict";

theToolController.controller("CommunicationEmbedController", function ($scope, CommunicationFactory) {

  //================================INITIALIZATION================================

  $scope.success     = "";
  $scope.error       = "";

  $scope.communication = JSON.parse($scope.communicationJson);
  $scope.communication.editing = false;
  $scope.communication.deleted = false;

  $scope.me = JSON.parse($scope.meJson);
  $scope.members = JSON.parse($scope.membersJson);
  $scope.roles = JSON.parse($scope.rolesJson);


  $scope.saveCommunication = function (communication) {
    if (communication.buffer === "") {
      return;
    }

    communication.text = communication.buffer;
    communication.updated = Date.now();

    CommunicationFactory.Communication.update({id: communication._id}, communication, function (response) {
      communication.editing = false;
      communication.approved = false;
    });
  }

  $scope.deleteCommunication = function (communication) {
    CommunicationFactory.Communication.delete({id: communication._id}, function () {
      $scope.communication.deleted = true;
    });
  };

  $scope.approveCommunication = function (communication) {
    CommunicationFactory.Communication.approve({id: communication._id}, null, function (response) {
      $scope.communication.approved = true;
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
});

},{}],13:[function(require,module,exports){
require('./area.js');
require('./list.js');
require('./embed.js');

},{"./area.js":11,"./embed.js":12,"./list.js":14}],14:[function(require,module,exports){
'use strict';

theToolController
  .controller('CommunicationsController', function ($scope, $http, CommunicationFactory) {
    $scope.loading = true;

    CommunicationFactory.Communication.getAll(function(response) {
      $scope.loading = false;
      $scope.communications = response;
    });

    $scope.showOpen = true;

    $scope.shownCommunications = function (showOpen) {
      return $scope.communications.filter(function(o) {
        return (showOpen ? !o.approved : o.approved);
      });
    };
  });


},{}],15:[function(require,module,exports){
'use strict';

theToolController
  .controller('CompanyController', function ($scope, $http, $routeParams, $sce, CompanyFactory, MemberFactory, NotificationFactory) {

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
        }
      });
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
  });

},{}],16:[function(require,module,exports){
'use strict';

theToolController
  .controller('CompanyEmailController', function ($scope, $http, $routeParams, $sce, $location, EmailFactory) {
    $scope.email = $location.search().email;
    $scope.companyId = $routeParams.id;
    $scope.loading = false;
    $scope.error = null;
    $scope.message = null;

    $scope.submit = function() {
      $scope.loading = true;
      $scope.error = null;
      $scope.message = null;

      console.log("send email to ", $scope.email, " from ", $scope.companyId);

      EmailFactory.Company.send({ id: $scope.companyId }, { email: $scope.email }, function(response) {
        $scope.loading = false;
        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.message;
        }
      });
    };
  });

},{}],17:[function(require,module,exports){
'use strict';
 
theToolController
  .controller('CreateCompanyController', function ($scope, $http, $routeParams, $location, CompanyFactory) {
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
  });
},{}],18:[function(require,module,exports){
"use strict";

theToolController.controller("CompanyEmbedController", function ($scope) {

  $scope.me = JSON.parse($scope.meJson);
  $scope.members = JSON.parse($scope.membersJson);
  $scope.roles = JSON.parse($scope.rolesJson);

  if($scope.comments) {
    $scope.company.comments = $scope.comments.filter(function(e) {
      return e.thread == 'company-'+$scope.company.id;
    })
  }

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

});

},{}],19:[function(require,module,exports){
require('./company.js');
require('./list.js');
require('./create.js');
require('./confirm.js');
require('./embed.js');
},{"./company.js":15,"./confirm.js":16,"./create.js":17,"./embed.js":18,"./list.js":20}],20:[function(require,module,exports){
'use strict';

theToolController
  .controller('CompaniesController', function ($scope, $http, $sce, CompanyFactory, MemberFactory) {
    $scope.saveStatus = function(company) {
      var companyData = company;

      CompanyFactory.Company.update({ id:company.id }, companyData, function(response) {
        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.message;
        }
      });
    }

    $scope.getClassFromPaymentStatus = function(participation) {
      if(!participation) { return "grey"; }
      if(!participation.payment) { return "grey"; }
      if(!participation.payment.status) { return "grey"; }
      var status = participation.payment.status.toLowerCase();

      if(status.indexOf("pago") != -1 || status.indexOf("emitido") != -1 || status.indexOf("recibo enviado") != -1) { return "lime"; } 
      else if(status.indexOf("enviado") != -1) { return "orange"; }
      else { return "grey"; }
    }

    $scope.paymentStatuses = ['Emitido', 'Recibo Enviado', 'Pago', 'Enviado'];
  
    $scope.limit = 6;

    $scope.statuses = ['Suggestion','Contacted','In Conversations','In Negotiations','Closed Deal','Rejected','Give Up'];
    
    $scope.companyPredicate = 'updated';
    $scope.reverse = 'true';

    CompanyFactory.Company.getAll(function(response) {
      $scope.predicate = 'updated';
      $scope.reverse = true;
      $scope.companies = response;
    });

    $scope.scroll = function() {
      if ($scope.limit <= $scope.companies.length)
        $scope.limit += 2;
    };
    
    $scope.checkPermission = function (member) {
      var roles = $scope.me.roles.filter(function(o) {
        return o.id == 'development-team' || o.id == 'coordination';
      });

      if(roles.length == 0 && member.id != $scope.me.id) {
        return false;
      }

      return true;
    };

    $scope.addCompany = function(member, newCompany) {
      console.log(newCompany);
      var companyData = newCompany;
      
      if(newCompany.id) {
        CompanyFactory.Company.update({ id: companyData.id }, { member: member.id }, function(response) {
          if(response.error) {
            console.log(response);
            $scope.error = response.error;
          } else {
            $scope.message = response.success;

            CompanyFactory.Company.getAll(function (companies) {
              $scope.companies = companies;
            });
          }
        });
      } else {
        companyData.status = 'Selected';
        companyData.member = member.id;

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
});
  
},{}],21:[function(require,module,exports){
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

},{"./auth":2,"./chat":6,"./comment":10,"./communication":13,"./company":19,"./main":23,"./meeting":26,"./member":30,"./speaker":36,"./subscription":40,"./tag":41,"./topic":44}],22:[function(require,module,exports){
"use strict";

theToolController.controller("home", function ($scope, NotificationFactory) {

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

});

},{}],23:[function(require,module,exports){
require('./main.js');
require('./home.js');

},{"./home.js":22,"./main.js":24}],24:[function(require,module,exports){
'use strict';

theToolController.controller('MainController', function ($scope, $http, $routeParams, $sce, $location, $window, $rootScope, NotificationFactory, MemberFactory, CompanyFactory, SpeakerFactory, TopicFactory, RoleFactory, TagFactory, CommentFactory) {

  //================================INITIALIZATION================================

  $scope.ready = false;

  $scope.display = false;

  $scope.search = {};
  $scope.searchTopics = {};
  $scope.searchCompanies = {};
  $scope.searchSpeakers = {};
  $scope.searchMembers = {};

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

  MemberFactory.Me.get(function (me) {
    $scope.me = me;
    callback();
  });

  MemberFactory.Member.getAll(function (members) {
    $scope.members = members;
    callback();
  });

  CompanyFactory.Company.getAll(function (companies) {
    $scope.companies = companies;
    callback();
  });

  SpeakerFactory.Speaker.getAll(function (speakers) {
    $scope.speakers = speakers;
    callback();
  });

  TopicFactory.Topic.getAll(function (topics) {
    $scope.topics = topics;
    callback();
  });

  RoleFactory.Role.getAll(function (roles) {
    $scope.roles = roles;
    callback();
  });

  TagFactory.Tag.getAll(function (tags) {
    $scope.topicTags = tags;
    callback();
  });

  CommentFactory.Comment.getAll(function (comments) {
    $scope.comments = comments;
    callback();
  });


  //===================================FUNCTIONS===================================

  function callback() {
    if (++factoriesReady == 8) {
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

},{}],25:[function(require,module,exports){
"use strict";

theToolController.controller("MeetingEmbedController", function ($scope, MeetingFactory) {

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

});

},{}],26:[function(require,module,exports){
require("./embed");
require("./list");
require("./meeting");

},{"./embed":25,"./list":27,"./meeting":28}],27:[function(require,module,exports){
'use strict';

theToolController.controller('MeetingsController', function ($scope, $location, MeetingFactory) {

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

});

},{}],28:[function(require,module,exports){
"use strict";

theToolController.controller("MeetingController", function ($scope, $routeParams, $location, $timeout, MeetingFactory, TopicFactory, TagFactory) {

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

});

},{}],29:[function(require,module,exports){
"use strict";

theToolController.controller("CreateMemberController", function ($scope, $http, $location, $routeParams, MemberFactory) {
  
  $scope.formData = {};
  $scope.formData.roles = [];
  $scope.formData.phones = [];

  $scope.submit = function() {
    var memberData = this.formData;

    MemberFactory.Member.create(memberData, function(response) {
      console.log(response)
      if(response.error) {
        $scope.error = response.error;
      } else {
        $scope.message = response.message;
        $location.path("/member/" + response.id);
      }
    });
  };

});

},{}],30:[function(require,module,exports){
require('./member.js');
require('./list.js');
require('./create.js');
},{"./create.js":29,"./list.js":31,"./member.js":32}],31:[function(require,module,exports){
"use strict";

theToolController.controller("MembersController", function ($scope, MemberFactory) {
  $scope.setSearchRole = function (roleId) {
    $scope.searchRoles=roleId;
  };

  MemberFactory.Member.getAll(function (response) {
    $scope.memberPredicate = "name";
    $scope.reverse = false;
    $scope.members = response;
  });
});

},{}],32:[function(require,module,exports){
"use strict";

theToolController.controller("MemberController", function ($scope, $http, $routeParams, $sce, $location, MemberFactory) {

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

    $scope.member.companies = $scope.companies.filter(function(e) {
      return e.member == $scope.member.id;
    })

    $scope.member.speakers = $scope.speakers.filter(function(e) {
      return e.member == $scope.member.id;
    })

    $scope.member.comments = $scope.comments.filter(function(e) {
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

});

},{}],33:[function(require,module,exports){
'use strict';

theToolController
  .controller('SpeakerEmailController', function ($scope, $http, $routeParams, $sce, $location, EmailFactory) {
    $scope.email = $location.search().email;
    $scope.speakerId = $routeParams.id;
    $scope.loading = false;
    $scope.error = null;
    $scope.message = null;

    $scope.submit = function() {
      $scope.loading = true;
      $scope.error = null;
      $scope.message = null;

      console.log("send email to ", $scope.email, " from ", $scope.speakerId);

      EmailFactory.Speaker.send({ id: $scope.speakerId }, { email: $scope.email }, function(response) {
        $scope.loading = false;
        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.message;
        }
      });
    };
  });

},{}],34:[function(require,module,exports){
'use strict';
 
theToolController
  .controller('CreateSpeakerController', function ($scope, $http, $routeParams, $location, SpeakerFactory) {
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
  });
},{}],35:[function(require,module,exports){
"use strict";

theToolController.controller("SpeakerEmbedController", function ($scope) {

  $scope.me = JSON.parse($scope.meJson);
  $scope.members = JSON.parse($scope.membersJson);
  $scope.roles = JSON.parse($scope.rolesJson);

  if($scope.comments) {
    $scope.speaker.comments = $scope.comments.filter(function(e) {
      return e.thread == 'speaker-'+$scope.speaker.id;
    })
  }

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

});

},{}],36:[function(require,module,exports){
require('./speaker.js');
require('./list.js');
require('./create.js');
require('./confirm.js');
require('./embed.js');

},{"./confirm.js":33,"./create.js":34,"./embed.js":35,"./list.js":37,"./speaker.js":38}],37:[function(require,module,exports){
'use strict';

theToolController
  .controller('SpeakersController', function ($scope, $http, $sce, SpeakerFactory, MemberFactory) {
  
    $scope.limit = 10;

    $scope.statuses = ['Suggestion','Selected','Approved','Contacted','In Conversations','Accepted','Rejected','Give Up'];

    $scope.speakerPredicate = 'updated';
    $scope.reverse = 'true';
    
    SpeakerFactory.Speaker.getAll(function(response) {
      $scope.speakers = response;
    });

    $scope.scroll = function() {
      if ($scope.limit <= $scope.speakers.length)
        $scope.limit += 10;
    };

    $scope.checkPermission = function (member) {
      var roles = $scope.me.roles.filter(function(o) {
        return o.id == 'development-team' || o.id == 'coordination';
      });

      if(roles.length == 0 && member.id != $scope.me.id) {
        return false;
      }

      return true;
    };

    $scope.addSpeaker = function(member, newSpeaker) {
      console.log(newSpeaker);
      var speakerData = newSpeaker;
      
      if(newSpeaker.id) {
        SpeakerFactory.Speaker.update({ id: speakerData.id }, { member: member.id }, function(response) {
          if(response.error) {
            console.log(response);
            $scope.error = response.error;
          } else {
            $scope.message = response.success;

            SpeakerFactory.Speaker.getAll(function (speakers) {
              $scope.speakers = speakers;
            });
          }
        });
      } else {
        speakerData.status = 'Selected';
        speakerData.member = member.id;

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
  });
  
},{}],38:[function(require,module,exports){
'use strict';

theToolController
  .controller('SpeakerController', function ($scope, $window, $routeParams, $sce, SpeakerFactory, MemberFactory, NotificationFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src+'#page-body');
    }

    $scope.convertEmails = function(text) {
      var mailExp = /[\w\.\-]+\@([\w\-]+\.)+[\w]{2,4}(?![^<]*>)/ig;
      var twitterExp = /(^|[^@\w])@(\w{1,15})\b/g;
      return text.replace(mailExp,"<a href='#/company/"+$routeParams.id+"/confirm?email=$&'>$&</a>").replace(twitterExp,"$1<a href='http://twitter.com/$2' target='_blank'>@$2</a>")
    }

    $scope.submit = function() {
      var speakerData = this.formData;

      SpeakerFactory.Speaker.update({ id:speakerData.id }, speakerData, function(response) {
        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.success;
        }
      });
    };

    $scope.checkPermission = function (speaker) {
      var roles = $scope.me.roles.filter(function(o) {
        return o.id == 'development-team' || o.id == 'coordination';
      });

      if(roles.length == 0 && (speaker.status == 'Suggestion' || speaker.status == 'Selected')) {
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

  });

},{}],39:[function(require,module,exports){
"use strict";

theToolController.controller("SubscriptionController", function ($scope, SubscriptionFactory) {

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

  console.log('THREAD', $scope.thread, threadKind, threadId);
  console.log('FACTORYYY', SubscriptionFactory.Company, SubscriptionFactory.Speaker, SubscriptionFactory.Topic, Factory);

  $scope.isSubscribed = false;

  $scope.getStatus = function () {
    Factory.get({id: threadId}, function(response) {
      console.log('STATUS',response.success)
      if(response.success == 'subscribed') {
        $scope.isSubscribed = true;
      } else {
        $scope.isSubscribed = false;
      }
    })
  };

  $scope.subscribe = function () {
    console.log('ADDD', threadKind, threadId);
    Factory.add({id: threadId}, {}, function(response) {
      $scope.getStatus();
    })
  };

  $scope.unsubscribe = function () {
    console.log('DELETE', threadKind, threadId);
    Factory.remove({id: threadId}, function(response) {
      $scope.getStatus();
    })
  };

  $scope.getStatus();
});

},{}],40:[function(require,module,exports){
require('./embed');
},{"./embed":39}],41:[function(require,module,exports){
require('./manager');
},{"./manager":42}],42:[function(require,module,exports){
"use strict";

theToolController.controller("TagManagerController", function ($scope, TagFactory) {

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

});

},{}],43:[function(require,module,exports){
"use strict";

theToolController.controller("TopicEmbedController", function ($scope, TopicFactory, NotificationFactory) {

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
        console.log("There was an error. Please contact the Dev Team and give them the details about the error.");
      }
      else if (response.success) {
        //console.log(response.success);
      }
    });
  };

  $scope.save = function (topic) {
    $scope.error = "";

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
    var notifications = $scope.notifications.filter(function(o) {
      return o.thread == thread && o.unread.indexOf($scope.me.id) != -1;
    });

    return notifications;
  };

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

});

},{}],44:[function(require,module,exports){
require('./list');
require('./topic');
require('./embed');

},{"./embed":43,"./list":45,"./topic":46}],45:[function(require,module,exports){
"use strict";

theToolController.controller("TopicsController", function ($scope, $location, $routeParams, TopicFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.kinds = ["Info", "To do", "Decision", "Idea"];

  $scope.searchTopics = {};

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
  $scope.limit = 6;


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
      $scope.limit += 3;
  };

});

},{}],46:[function(require,module,exports){
'use strict';

theToolController.controller('TopicController', function ($scope, $routeParams, $location, $window, TopicFactory, NotificationFactory) {

  $scope.loading = true;

  TopicFactory.Topic.get({id: $routeParams.id}, function(result) {
    $scope.topic = result;

    $scope.topic.showComments = true;

    NotificationFactory.Topic.getAll({id: $routeParams.id}, function(getData) {
      $scope.topic.notifications = getData;

      $scope.loading = false;
    });
  });

});

},{}],47:[function(require,module,exports){
'use strict';

theToolDirectives
  .directive('commentArea', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/comment/area.html',
      controller: 'CommentAreaController',
      scope: {
        thread: '@'
      }
    };
  })
},{}],48:[function(require,module,exports){
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
},{}],49:[function(require,module,exports){
require('./area');
require('./first');
},{"./area":47,"./first":48}],50:[function(require,module,exports){
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
        membersJson: '@members',
        meJson: '@me',
        rolesJson: '@roles'
      }
    };
  })
},{}],51:[function(require,module,exports){
'use strict';

theToolDirectives
  .directive('communication', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/communication/communication.html',
      controller: 'CommunicationEmbedController',
      scope: {
        communicationJson: '@communicationObject',
        membersJson: '@members',
        meJson: '@me',
        rolesJson: '@roles'
      }
    };
  })
},{}],52:[function(require,module,exports){
require('./area');
require('./communication');
},{"./area":50,"./communication":51}],53:[function(require,module,exports){
'use strict';

theToolDirectives
  .directive('company', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/company/company.html',
      controller: 'CompanyEmbedController',
      scope: {
        company: '=companyObject',
        membersJson: '@members',
        meJson: '@me',
        rolesJson: '@roles',
        comments: '=commentsArray'
      }
    };
  })

},{}],54:[function(require,module,exports){
require('./company')
},{"./company":53}],55:[function(require,module,exports){
require('./input')
},{"./input":56}],56:[function(require,module,exports){
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
},{}],57:[function(require,module,exports){
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
},{"./comment":49,"./communication":52,"./company":54,"./date":55,"./markdown":59,"./meeting":62,"./scroll":63,"./speaker":65,"./subscription":67,"./tag":69,"./topic":71}],58:[function(require,module,exports){
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
},{}],59:[function(require,module,exports){
require('./compile');
require('./markdown');
},{"./compile":58,"./markdown":60}],60:[function(require,module,exports){
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
},{}],61:[function(require,module,exports){
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

},{}],62:[function(require,module,exports){
require("./embed");

},{"./embed":61}],63:[function(require,module,exports){
require("./position.js");
},{"./position.js":64}],64:[function(require,module,exports){
"use strict";

theToolDirectives.directive("scrollPosition", function () {
  return {
    scope: {
      scroll: '=scrollPosition'
    },
    link: function(scope, elem, attrs) {
      var handler = function() {
        scope.scroll = elem.scrollTop();
      }
      elem.on('scroll', scope.$apply.bind(scope, handler));
      handler();
    }
  };
});
},{}],65:[function(require,module,exports){
require('./speaker');
},{"./speaker":66}],66:[function(require,module,exports){
'use strict';

theToolDirectives
  .directive('speaker', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/speaker/speaker.html',
      controller: 'SpeakerEmbedController',
      scope: {
        speaker: '=speakerObject',
        membersJson: '@members',
        meJson: '@me',
        rolesJson: '@roles',
        comments: '=commentsArray'
      }
    };
  })

},{}],67:[function(require,module,exports){
require('./subscription');
},{"./subscription":68}],68:[function(require,module,exports){
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
},{}],69:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"./manager":70}],70:[function(require,module,exports){
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

},{}],71:[function(require,module,exports){
require("./topic");

},{"./topic":72}],72:[function(require,module,exports){
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

},{}],73:[function(require,module,exports){
'use strict';

angular.module('theTool.filters', [])
  .filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
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
},{}],74:[function(require,module,exports){
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
},{}],75:[function(require,module,exports){
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
      })
    }
  })
},{}],76:[function(require,module,exports){
'use strict';

theToolServices
  .factory('CommunicationFactory', function ($resource) {
    return {
      Communication: $resource(url_prefix+'/api/communication/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'},
        'approve': {method: 'POST'}
      }),
      Company: $resource(url_prefix+'/api/company/:id/communications', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Speaker: $resource(url_prefix+'/api/speaker/:id/communications', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    };
  })
},{}],77:[function(require,module,exports){
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
},{}],78:[function(require,module,exports){
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
},{}],79:[function(require,module,exports){
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

},{"./chat":74,"./comment":75,"./communication":76,"./company":77,"./email":78,"./meeting":80,"./member":81,"./message":82,"./notification":83,"./role":84,"./session":85,"./socket":86,"./speaker":87,"./subscription":88,"./tag":89,"./topic":90}],80:[function(require,module,exports){
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

},{}],81:[function(require,module,exports){
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
},{}],82:[function(require,module,exports){
'use strict';

theToolServices
  .factory('MessageFactory', function ($resource) {
    return $resource(url_prefix+'/api/message/:id', null, {
        'getAll':    {method: 'GET', isArray: true}
      })
  })
},{}],83:[function(require,module,exports){
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

},{}],84:[function(require,module,exports){
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

},{}],85:[function(require,module,exports){
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
},{}],86:[function(require,module,exports){
'use strict';

theToolServices
  .factory('SocketFactory', function ($resource, $location, $rootScope) {
    var socket;
    return {
      connect: function(nsp) {
        console.log(socket);
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

},{}],87:[function(require,module,exports){
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
},{}],88:[function(require,module,exports){
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

},{}],89:[function(require,module,exports){
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
},{}],90:[function(require,module,exports){
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

},{}],91:[function(require,module,exports){
url_prefix = require('./../../config').url;

require('./angularApp/app.js');
require('./angularApp/controllers');
require('./angularApp/directives');
require('./angularApp/filters');
require('./angularApp/services');
},{"./../../config":92,"./angularApp/app.js":1,"./angularApp/controllers":21,"./angularApp/directives":57,"./angularApp/filters":73,"./angularApp/services":79}],92:[function(require,module,exports){
module.exports={
  "url": "https://tool.bananamarket.eu",
  "email" : {
    "user": "thetoolsinfo",
    "password": "devteamftw",
    "host": "smtp.gmail.com",
    "ssl": true
  },
  "mailgun": {
    "api": "key-7jm1c009ezjv85pkm1rqfxevufeovb43",
    "public-api": "pubkey-0blv6drs63745oxru3itvfg1urp662y8"
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
},{}]},{},[91])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvcm9vdC90aGUtdG9vbC9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvYXBwLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvYXV0aC9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2F1dGgvaW50ZXJjZXB0b3IuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9hdXRoL2xvZ2luLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY2hhdC9jaGF0LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY2hhdC9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NoYXQvbGlzdC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW1lbnQvYXJlYS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW1lbnQvZmlyc3QuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tZW50L2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbXVuaWNhdGlvbi9hcmVhLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbXVuaWNhdGlvbi9lbWJlZC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW11bmljYXRpb24vaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tdW5pY2F0aW9uL2xpc3QuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21wYW55L2NvbXBhbnkuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21wYW55L2NvbmZpcm0uanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21wYW55L2NyZWF0ZS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvZW1iZWQuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21wYW55L2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9saXN0LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tYWluL2hvbWUuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tYWluL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWFpbi9tYWluLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVldGluZy9lbWJlZC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lZXRpbmcvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZWV0aW5nL2xpc3QuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZWV0aW5nL21lZXRpbmcuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvY3JlYXRlLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVtYmVyL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVtYmVyL2xpc3QuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvbWVtYmVyLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvc3BlYWtlci9jb25maXJtLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvc3BlYWtlci9jcmVhdGUuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2VtYmVkLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvc3BlYWtlci9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvbGlzdC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvc3BlYWtlci5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3N1YnNjcmlwdGlvbi9lbWJlZC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3N1YnNjcmlwdGlvbi9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3RhZy9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3RhZy9tYW5hZ2VyLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdG9waWMvZW1iZWQuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90b3BpYy9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3RvcGljL2xpc3QuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90b3BpYy90b3BpYy5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbWVudC9hcmVhLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9jb21tZW50L2ZpcnN0LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9jb21tZW50L2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9jb21tdW5pY2F0aW9uL2FyZWEuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbW11bmljYXRpb24vY29tbXVuaWNhdGlvbi5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbXVuaWNhdGlvbi9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tcGFueS9jb21wYW55LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9jb21wYW55L2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9kYXRlL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9kYXRlL2lucHV0LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWFya2Rvd24vY29tcGlsZS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWFya2Rvd24vaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21hcmtkb3duL21hcmtkb3duLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9tZWV0aW5nL2VtYmVkLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9tZWV0aW5nL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9zY3JvbGwvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3Njcm9sbC9wb3NpdGlvbi5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvc3BlYWtlci9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvc3BlYWtlci9zcGVha2VyLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9zdWJzY3JpcHRpb24vaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3N1YnNjcmlwdGlvbi9zdWJzY3JpcHRpb24uanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3RhZy9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvdGFnL21hbmFnZXIuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3RvcGljL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy90b3BpYy90b3BpYy5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2ZpbHRlcnMvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9jaGF0LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvY29tbWVudC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2NvbW11bmljYXRpb24uanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9jb21wYW55LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvZW1haWwuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL21lZXRpbmcuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9tZW1iZXIuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9tZXNzYWdlLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvbm90aWZpY2F0aW9uLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvcm9sZS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL3Nlc3Npb24uanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9zb2NrZXQuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9zcGVha2VyLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvc3Vic2NyaXB0aW9uLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvdGFnLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvdG9waWMuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvdGhlVG9vbC5qcyIsIi9yb290L3RoZS10b29sL2NvbmZpZy5qc29uIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEtBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBOztBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTs7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7O0FDREE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmFuZ3VsYXIubW9kdWxlKFwidGhlVG9vbFwiLCBbXG4gIFwibmdcIixcbiAgXCJuZ1JvdXRlXCIsXG4gIFwibmdTYW5pdGl6ZVwiLFxuICBcIm5nVG91Y2hcIixcbiAgXCJpbmZpbml0ZS1zY3JvbGxcIixcbiAgXCJsdWVnZy5kaXJlY3RpdmVzXCIsXG4gIFwibmdBdWRpb1wiLFxuICBcInRoZVRvb2wuZmlsdGVyc1wiLFxuICBcInRoZVRvb2wuc2VydmljZXNcIixcbiAgXCJ0aGVUb29sLmRpcmVjdGl2ZXNcIixcbiAgXCJ0aGVUb29sLmNvbnRyb2xsZXJzXCJcbl0pLlxuY29uZmlnKFtcIiRyb3V0ZVByb3ZpZGVyXCIsIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvXCIgICAgICAgICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvaG9tZS5odG1sXCIsICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJob21lXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9sb2dpblwiICAgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hdXRoL2xvZ2luLmh0bWxcIiwgICAgICAgICAgICBjb250cm9sbGVyOiBcIkxvZ2luQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbG9naW4vOmlkLzpjb2RlXCIgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvYXV0aC9sb2dpbi5odG1sXCIsICAgICAgICAgICAgY29udHJvbGxlcjogXCJMb2dpbkNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbmllcy9cIiAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbXBhbnkvbGlzdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ29tcGFuaWVzQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tcGFuaWVzL3RhYmxlL1wiICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tcGFueS90YWJsZS5odG1sXCIsICAgICAgICAgY29udHJvbGxlcjogXCJDb21wYW5pZXNDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW5pZXMvYnVkZ2V0L1wiICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2J1ZGdldC5odG1sXCIsICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbmllc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvXCIgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbXBhbnkvY3JlYXRlLmh0bWxcIiwgICAgICAgIGNvbnRyb2xsZXI6IFwiQ3JlYXRlQ29tcGFueUNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvOmlkXCIgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbXBhbnkvdmlldy5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ29tcGFueUNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvOmlkL2VkaXRcIiAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbXBhbnkvZWRpdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ29tcGFueUNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvOmlkL3BhcnRpY2lwYXRpb25cIiwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbXBhbnkvcGFydGljaXBhdGlvbi5odG1sXCIsIGNvbnRyb2xsZXI6IFwiQ29tcGFueUNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbnkvOmlkL2NvbmZpcm1cIiAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbXBhbnkvY29uZmlybS5odG1sXCIsICAgICAgIGNvbnRyb2xsZXI6IFwiQ29tcGFueUVtYWlsQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tbWVudC86aWQvZWRpdFwiICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tbWVudC9lZGl0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJDb21tZW50Q29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvc3BlYWtlcnMvXCIgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9saXN0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJTcGVha2Vyc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL3NwZWFrZXJzL3RhYmxlL1wiICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3NwZWFrZXIvdGFibGUuaHRtbFwiLCAgICAgICAgIGNvbnRyb2xsZXI6IFwiU3BlYWtlcnNDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyL1wiICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zcGVha2VyL2NyZWF0ZS5odG1sXCIsICAgICAgICBjb250cm9sbGVyOiBcIkNyZWF0ZVNwZWFrZXJDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyLzppZFwiICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zcGVha2VyL3ZpZXcuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIlNwZWFrZXJDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyLzppZC9lZGl0XCIgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zcGVha2VyL2VkaXQuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIlNwZWFrZXJDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2VyLzppZC9jb25maXJtXCIgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zcGVha2VyL2NvbmZpcm0uaHRtbFwiLCAgICAgICBjb250cm9sbGVyOiBcIlNwZWFrZXJFbWFpbENvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lbWJlcnMvXCIgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lbWJlci9saXN0Lmh0bWxcIiwgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVtYmVyc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lbWJlci9cIiAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lbWJlci9jcmVhdGUuaHRtbFwiLCAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ3JlYXRlTWVtYmVyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVtYmVyLzppZFwiICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVtYmVyL3ZpZXcuaHRtbFwiLCAgICAgICAgICAgY29udHJvbGxlcjogXCJNZW1iZXJDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZW1iZXIvOmlkL2VkaXRcIiAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZW1iZXIvZWRpdC5odG1sXCIsICAgICAgICAgICBjb250cm9sbGVyOiBcIk1lbWJlckNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lZXRpbmdzXCIgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lZXRpbmcvbGlzdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVldGluZ3NDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZWV0aW5nLzppZFwiICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZWV0aW5nL3ZpZXcuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIk1lZXRpbmdDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZWV0aW5nLzppZC90ZXh0XCIgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZWV0aW5nL3RleHQuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIk1lZXRpbmdDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZWV0aW5nLzppZC9lZGl0XCIgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZWV0aW5nL2VkaXQuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIk1lZXRpbmdDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jaGF0c1wiICAgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jaGF0L2xpc3QuaHRtbFwiLCAgICAgICAgICAgICBjb250cm9sbGVyOiBcIkNoYXRzQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY2hhdC86aWRcIiAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY2hhdC92aWV3Lmh0bWxcIiwgICAgICAgICAgICAgY29udHJvbGxlcjogXCJDaGF0Q29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvdG9waWNzXCIgICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvdG9waWMvbGlzdC5odG1sXCIsICAgICAgICAgICAgY29udHJvbGxlcjogXCJUb3BpY3NDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi90b3BpYy86aWRcIiAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy90b3BpYy92aWV3Lmh0bWxcIiwgICAgICAgICAgICBjb250cm9sbGVyOiBcIlRvcGljQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tbXVuaWNhdGlvbnNcIiAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tbXVuaWNhdGlvbi9saXN0Lmh0bWxcIiwgICAgY29udHJvbGxlcjogXCJDb21tdW5pY2F0aW9uc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci5vdGhlcndpc2Uoe3JlZGlyZWN0VG86IFwiL1wifSk7XG59XSk7XG4iLCJyZXF1aXJlKFwiLi9sb2dpblwiKTtcbnJlcXVpcmUoJy4vaW50ZXJjZXB0b3InKTtcbiIsInRoZVRvb2xDb250cm9sbGVyLmNvbmZpZyhmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xuICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFsnJGluamVjdG9yJywgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xuICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcbiAgfV0pO1xufSk7XG5cbnRoZVRvb2xDb250cm9sbGVyLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkbG9jYXRpb24sICR3aW5kb3cpIHtcbiAgcmV0dXJuIHtcbiAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICBpZigkbG9jYXRpb24ucGF0aCgpLmluZGV4T2YoJy9sb2dpbicpID09IC0xKSB7XG4gICAgICAgICAgJHJvb3RTY29wZS5uZXh0UGF0aCA9ICcjJztcbiAgICAgICAgICBjb25zb2xlLmxvZygkbG9jYXRpb24ucGF0aCgpKTtcbiAgICAgICAgICBpZigkbG9jYXRpb24ucGF0aCgpICE9PSAnL2xvZ2luJyl7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLm5leHRQYXRoICs9ICRsb2NhdGlvbi5wYXRoKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBmYWNlYm9va0NvbmZpZyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vLi4vLi4vY29uZmlnJykuZmFjZWJvb2s7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJMb2dpbkNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24sICRodHRwLCAkd2luZG93KSB7XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUlOSVRJQUxJWkFUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgJC5hamF4U2V0dXAoe2NhY2hlOiB0cnVlfSk7XG4gICQuZ2V0U2NyaXB0KFwiLy9jb25uZWN0LmZhY2Vib29rLm5ldC9wdF9QVC9hbGwuanNcIiwgZnVuY3Rpb24gKCkge1xuICAgIEZCLmluaXQoe2FwcElkOiBmYWNlYm9va0NvbmZpZy5hcHBJZH0pO1xuICB9KTtcblxuICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAkc2NvcGUuc2hvd0lkSW5wdXQgPSB0cnVlO1xuICAkc2NvcGUuc2hvd0NvZGVJbnB1dCA9IGZhbHNlO1xuICBcbiAgaWYoJHNjb3BlLm1lLmlkKSB7XG4gICAgLy8kbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcvJyk7XG4gIH1cblxuICB2YXIgbG9jayA9IGZhbHNlO1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5mYWNlYm9va0xvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5iYW5hbmEgPSB0cnVlO1xuXG4gIFx0aWYgKGxvY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsb2NrID0gdHJ1ZTtcblxuICAgIEZCLmdldExvZ2luU3RhdHVzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gXCJjb25uZWN0ZWRcIikge1xuICAgICAgICBjb25uZWN0ZWQocmVzcG9uc2UpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIEZCLmxvZ2luKGZ1bmN0aW9uICgpIHt9LCB7ZGlzcGxheTogXCJwb3B1cFwifSk7XG4gICAgICAgIEZCLkV2ZW50LnN1YnNjcmliZShcImF1dGguc3RhdHVzQ2hhbmdlXCIsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IFwiY29ubmVjdGVkXCIpIHtcbiAgICAgICAgICAgIGNvbm5lY3RlZChyZXNwb25zZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBsb2NrID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBjb25uZWN0ZWQocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5jb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgJHNjb3BlLmxvZ2luSW5mbyA9IFwiTG9nZ2luZyBpbi4uLlwiO1xuXG4gICAgICAkaHR0cC5nZXQodXJsX3ByZWZpeCArICcvYXBpL2xvZ2luL2ZhY2Vib29rP2lkPScrcmVzcG9uc2UuYXV0aFJlc3BvbnNlLnVzZXJJRCsnJnRva2VuPScrcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmFjY2Vzc1Rva2VuKS5cbiAgICAgICAgc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgIC8vJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmFzc2lnbigkcm9vdFNjb3BlLm5leHRQYXRoKTtcbiAgICAgICAgfSkuXG4gICAgICAgIGVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SXCIsIGRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnNlbmRFbWFpbCA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAkc2NvcGUubG9naW5JbmZvID0gXCJTZW5kaW5nIGVtYWlsLi4uXCI7ICBcbiAgICAkc2NvcGUuc2hvd0lkSW5wdXQgPSBmYWxzZTtcbiAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgZW1haWwuLi5cIik7XG5cbiAgICAkaHR0cC5nZXQodXJsX3ByZWZpeCArICcvYXBpL2xvZ2luLycgKyBtZW1iZXJJZCkuXG4gICAgICBzdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgIGlmKGRhdGEuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIHNldEluZm8oXCJUaGVyZSB3YXMgYW4gZXJyb3IuLi5cIik7XG4gICAgICAgICAgJHNjb3BlLnNob3dJZElucHV0ID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgc2V0SW5mbyhcIkVtYWlsIHNlbnQhXCIpO1xuICAgICAgICAkc2NvcGUuc2hvd0NvZGVJbnB1dCA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRW1haWwgc2VudCFcIilcbiAgICAgIH0pLlxuICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgc2V0SW5mbyhcIlRoZXJlIHdhcyBhbiBlcnJvci4uLlwiKTtcbiAgICAgICAgJHNjb3BlLnNob3dJZElucHV0ID0gdHJ1ZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUlwiLCBkYXRhKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLnN1Ym1pdENvZGUgPSBmdW5jdGlvbiAobWVtYmVySWQsIG1lbWJlckNvZGUpIHtcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgJHNjb3BlLmxvZ2luSW5mbyA9IFwiVmVyaWZ5aW5nIGNvZGUuLi5cIjsgIFxuICAgICRzY29wZS5zaG93Q29kZUlucHV0ID0gZmFsc2U7XG5cbiAgICAkaHR0cC5nZXQodXJsX3ByZWZpeCArICcvYXBpL2xvZ2luLycgKyBtZW1iZXJJZCArICcvJyArIG1lbWJlckNvZGUpLlxuICAgICAgc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICBpZihkYXRhLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBzZXRJbmZvKFwiVGhlcmUgd2FzIGFuIGVycm9yLi4uXCIpO1xuICAgICAgICAgICRzY29wZS5zaG93SWRJbnB1dCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5sb2dpbkluZm8gPSBcIlN1Y2Nlc3MhXCI7XG4gICAgICAgICR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcvJyk7XG4gICAgICAgIC8vJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgIH0pLlxuICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgc2V0SW5mbyhcIlRoZXJlIHdhcyBhbiBlcnJvci4uLlwiKTtcbiAgICAgICAgJHNjb3BlLnNob3dJZElucHV0ID0gdHJ1ZTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0SW5mbyhtZXNzYWdlKSB7XG4gICAgJHNjb3BlLmxvZ2luSW5mbyA9IG1lc3NhZ2U7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpeyRzY29wZS5sb2dpbkluZm89XCJcIn0sIDIwMDApO1xuICB9XG5cbiAgaWYgKCRyb3V0ZVBhcmFtcy5pZCAmJiAkcm91dGVQYXJhbXMuY29kZSkge1xuICAgICRzY29wZS5zdWJtaXRDb2RlKCRyb3V0ZVBhcmFtcy5pZCwgJHJvdXRlUGFyYW1zLmNvZGUpXG4gIH1cblxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoJ0NoYXRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgbmdBdWRpbywgU29ja2V0RmFjdG9yeSwgTWVzc2FnZUZhY3RvcnksIENoYXRGYWN0b3J5LCBNZW1iZXJGYWN0b3J5KSB7XG5cbiAgJHNjb3BlLmVycm9yID0ge307XG5cbiAgJHNjb3BlLnVwZGF0aW5nID0gZmFsc2U7XG4gICRzY29wZS5sb2FkaW5nICA9IHRydWU7XG4gICRzY29wZS5tZXNzYWdlcyA9IFtdO1xuICAkc2NvcGUub25saW5lICAgPSBbXTtcbiAvKiAkc2NvcGUuaGlzdG9yeSAgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHskc2NvcGUuaGlzdG9yeSgpfSwgMzAwMCk7XG4gIH0qL1xuXG4gIGNvbnNvbGUubG9nKCRzY29wZS5zY3JvbGwpO1xuXG4gIGNvbnNvbGUubG9nKFwiQ29ubmVjdGluZ1wiKTtcblxuICBTb2NrZXRGYWN0b3J5LmNvbm5lY3QoJy9jaGF0Jyk7XG5cbiAgU29ja2V0RmFjdG9yeS5vbignY29ubmVjdGVkJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKFNvY2tldEZhY3Rvcnkuc29ja2V0KTtcbiAgICBTb2NrZXRGYWN0b3J5LmVtaXQoJ2F1dGgnLCB7aWQ6ICRyb3V0ZVBhcmFtcy5pZCwgdXNlcjogJHNjb3BlLm1lLmlkfSwgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc29sZS5sb2coJ0F1dGggc3VjY2VzcycpO1xuICAgIH0pO1xuICB9KTtcblxuICBTb2NrZXRGYWN0b3J5Lm9uKCd2YWxpZGF0aW9uJywgZnVuY3Rpb24gKHJlc3BvbnNlKXtcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgaWYoIXJlc3BvbnNlLmVycil7XG4gICAgICAkc2NvcGUuY2hhdCAgICAgPSByZXNwb25zZS5jaGF0RGF0YTtcbiAgICAgICRzY29wZS5tZXNzYWdlcyA9IHJlc3BvbnNlLm1lc3NhZ2VzO1xuICAgICAgJHNjb3BlLnJvb20gICAgID0gcmVzcG9uc2Uucm9vbTtcblxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5jaGF0Lm1lbWJlcnMubGVuZ3RoOyBpKyspe1xuICAgICAgICAkc2NvcGUub25saW5lLnB1c2goe21lbWJlcjogJHNjb3BlLmNoYXQubWVtYmVyc1tpXSwgb246IGZhbHNlfSk7XG4gICAgICAgIGlmKHJlc3BvbnNlLm9ubGluZS5pbmRleE9mKCRzY29wZS5jaGF0Lm1lbWJlcnNbaV0pICE9IC0xKXtcbiAgICAgICAgICAkc2NvcGUub25saW5lW2ldLm9uID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUub25saW5lW2ldLm5hbWUgPSAkc2NvcGUuZ2V0TWVtYmVyKCRzY29wZS5vbmxpbmVbaV0ubWVtYmVyKS5uYW1lO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coJHNjb3BlLm9ubGluZSk7XG4gICAgICAkc2NvcGUuaGlzdG9yeSA9IGhpc3Rvcnk7XG4vKiAgICAgICRzY29wZS4kd2F0Y2goJ3Njcm9sbCcsIGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSwgc2NvcGUpIHtcbiAgICAgICAgaWYgKCFuZXdWYWx1ZSkge2hpc3RvcnkoKTt9XG4gICAgICB9KTsqL1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UubWVzc2FnZSk7XG4gICAgfVxuICAgICRzY29wZS5sb2FkaW5nICA9IGZhbHNlO1xuICB9KTtcblxuICBTb2NrZXRGYWN0b3J5Lm9uKCd1c2VyOmNvbm5lY3RlZCcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIGNvbnNvbGUubG9nKFwiVXNlciBjb25uZWN0ZWQ6IFwiICsgcmVzcG9uc2UuaWQpO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUub25saW5lLmxlbmd0aDsgaSsrKXtcbiAgICAgIGlmKCRzY29wZS5vbmxpbmVbaV0ubWVtYmVyID09PSByZXNwb25zZS5pZCl7XG4gICAgICAgICRzY29wZS5vbmxpbmVbaV0ub24gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIFNvY2tldEZhY3Rvcnkub24oJ3VzZXI6ZGlzY29ubmVjdGVkJywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgY29uc29sZS5sb2coXCJVc2VyIGNvbm5lY3RlZDogXCIgKyByZXNwb25zZS5pZCk7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5vbmxpbmUubGVuZ3RoOyBpKyspe1xuICAgICAgaWYoJHNjb3BlLm9ubGluZVtpXS5tZW1iZXIgPT09IHJlc3BvbnNlLmlkKXtcbiAgICAgICAgJHNjb3BlLm9ubGluZVtpXS5vbiA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIFNvY2tldEZhY3Rvcnkub24oJ21lc3NhZ2UnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICB2YXIgbWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2VcbiAgICAkc2NvcGUubWVzc2FnZXMucHVzaChtZXNzYWdlKTtcbiAgICBpZihtZXNzYWdlLm1lbWJlciAhPSAkc2NvcGUubWUuaWQpIHtcbiAgICAgIG5nQXVkaW8ucGxheShcImF1ZGlvL21lc3NhZ2UubXAzXCIpO1xuICAgIH1cbiAgfSk7XG5cbiAgU29ja2V0RmFjdG9yeS5vbignaGlzdG9yeS1zZW5kJywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgJHNjb3BlLm1lc3NhZ2VzID0gJHNjb3BlLm1lc3NhZ2VzLmNvbmNhdChyZXNwb25zZS5tZXNzYWdlcyk7XG4gICAgJHNjb3BlLnVwZGF0aW5nID0gZmFsc2U7XG4gIH0pO1xuXG4gICRzY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZyhcIk9uIGxvY2F0aW9uIGNoYW5nZVwiKTtcbiAgICBjb25zb2xlLmxvZyhTb2NrZXRGYWN0b3J5KTtcbiAgICBTb2NrZXRGYWN0b3J5LmRpc2Nvbm5lY3QoKTtcbiAgICBkZWxldGUgU29ja2V0RmFjdG9yeS5zb2NrZXQ7XG4gIH0pO1xuXG4gICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoJHNjb3BlLnRleHQgPT0gXCJcIil7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG1lc3NhZ2VEYXRhID0ge1xuICAgICAgdGV4dCAgIDogJHNjb3BlLnRleHQsXG4gICAgICBjaGF0SWQgOiAkcm91dGVQYXJhbXMuaWQsXG4gICAgICBtZW1iZXIgOiAkc2NvcGUubWUuaWQsXG4gICAgfVxuICAgIGNvbnNvbGUubG9nKG1lc3NhZ2VEYXRhKTtcblxuICAgIFNvY2tldEZhY3RvcnkuZW1pdCgnc2VuZCcsIHtyb29tOiAkc2NvcGUucm9vbSwgbWVzc2FnZTogbWVzc2FnZURhdGEgfSwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZygnTWVzc2FnZSBzZW50Jyk7XG4gICAgICAkc2NvcGUudGV4dCA9IFwiXCI7XG4gICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gaGlzdG9yeSAoKSB7XG4gICAgY29uc29sZS5sb2coJ1N0YXJ0IGhpc3RvcnkgcmVxdWVzdCcpO1xuICAgIGlmKCEkc2NvcGUudXBkYXRpbmcpe1xuICAgICAgJHNjb3BlLnVwZGF0aW5nID0gdHJ1ZTtcbiAgICAgIFNvY2tldEZhY3RvcnkuZW1pdCgnaGlzdG9yeS1nZXQnLCB7cm9vbTogJHNjb3BlLnJvb20sIGRhdGU6ICRzY29wZS5tZXNzYWdlc1skc2NvcGUubWVzc2FnZXMubGVuZ3RoLTFdLmRhdGUgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTZW50IGhpc3RvcnkgcmVxdWVzdCcpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KTsiLCJyZXF1aXJlKCcuL2xpc3QnKTtcbnJlcXVpcmUoJy4vY2hhdCcpOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignQ2hhdHNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgQ2hhdEZhY3RvcnkpIHtcblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgQ2hhdEZhY3RvcnkuQ2hhdC5nZXRBbGwoZnVuY3Rpb24oY2hhdHMpIHtcbiAgICAkc2NvcGUuY2hhdHMgPSBjaGF0cztcbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICB9KTtcblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNvbW1lbnRBcmVhQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCBNZW1iZXJGYWN0b3J5LCBDb21tZW50RmFjdG9yeSkge1xuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAkc2NvcGUuY29tbWVudERhdGEgPSB7XG4gICAgbWFya2Rvd246IFwiXCJcbiAgfTtcblxuICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXQoe2lkOiBcIm1lXCJ9LCBmdW5jdGlvbiAobWUpIHtcbiAgICAkc2NvcGUubWUgPSBtZTtcbiAgfSk7XG5cbiAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuZ2V0QWxsKGZ1bmN0aW9uIChtZW1iZXJzKSB7XG4gICAgJHNjb3BlLm1lbWJlcnMgPSBtZW1iZXJzO1xuICB9KTtcblxuICBsb2FkQ29tbWVudHMoKTtcblxuICBmdW5jdGlvbiBsb2FkQ29tbWVudHMoKSB7XG4gICAgaWYgKCRzY29wZS50aHJlYWQuc3BsaXQoXCItXCIpWzFdID09PSBcIlwiKSB7XG4gICAgICBzZXRUaW1lb3V0KGxvYWRDb21tZW50cywgNTAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcGFnZUlkID0gJHNjb3BlLnRocmVhZC5zdWJzdHJpbmcoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiLVwiKSArIDEpO1xuXG4gICAgaWYgKCRzY29wZS50aHJlYWQuaW5kZXhPZihcImNvbXBhbnktXCIpICE9IC0xKSB7XG4gICAgICBDb21tZW50RmFjdG9yeS5Db21wYW55LmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwic3BlYWtlci1cIikgIT0gLTEpIHtcbiAgICAgIENvbW1lbnRGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKHtpZDogcGFnZUlkfSwgZ290Q29tbWVudHMpO1xuICAgIH1cbiAgICBlbHNlIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJ0b3BpYy1cIikgIT0gLTEpIHtcbiAgICAgIENvbW1lbnRGYWN0b3J5LlRvcGljLmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnb3RDb21tZW50cyhjb21tZW50cykge1xuICAgICAgJHNjb3BlLmNvbW1lbnRzID0gY29tbWVudHM7XG5cbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgJHNjb3BlLnBvc3RDb21tZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICgkc2NvcGUuY29tbWVudERhdGEubWFya2Rvd24gPT09IFwiXCIpe1xuICAgICAgJHNjb3BlLmVtcHR5Q29tbWVudCA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGRhdGUgPSBEYXRlLm5vdygpO1xuICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQuY3JlYXRlKHtcbiAgICAgIHRocmVhZDogJHNjb3BlLnRocmVhZCxcbiAgICAgIG1lbWJlcjogJHNjb3BlLm1lLmlkLFxuICAgICAgbWFya2Rvd246ICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93bixcbiAgICAgIGh0bWw6ICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwoJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duKSxcbiAgICAgIHBvc3RlZDogZGF0ZSxcbiAgICAgIHVwZGF0ZWQ6IGRhdGVcbiAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biA9IFwiXCI7XG4gICAgICBsb2FkQ29tbWVudHMoKTtcbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS5zYXZlQ29tbWVudCA9IGZ1bmN0aW9uIChjb21tZW50KSB7XG4gICAgaWYgKGNvbW1lbnQuYnVmZmVyID09PSBcIlwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29tbWVudC5tYXJrZG93biA9IGNvbW1lbnQuYnVmZmVyO1xuICAgIGNvbW1lbnQuaHRtbCA9ICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwoY29tbWVudC5tYXJrZG93bik7XG4gICAgY29tbWVudC51cGRhdGVkID0gRGF0ZS5ub3coKTtcblxuICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQudXBkYXRlKHtpZDogY29tbWVudC5faWR9LCBjb21tZW50LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGNvbW1lbnQuZWRpdGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLnF1b3RlQ29tbWVudCA9IGZ1bmN0aW9uIChjb21tZW50KSB7XG4gICAgJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duID0gXCI+ICoqXCIgKyAkc2NvcGUuZ2V0TWVtYmVyKGNvbW1lbnQubWVtYmVyKS5uYW1lICsgXCIgc2FpZDoqKlxcbj4gXCIgKyBjb21tZW50Lm1hcmtkb3duLnNwbGl0KFwiXFxuXCIpLmpvaW4oXCJcXG4+IFwiKSArIFwiXFxuXFxuXCI7XG4gIH07XG5cbiAgJHNjb3BlLmRlbGV0ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xuICAgIGlmIChjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGNvbW1lbnQ/XCIpKSB7XG4gICAgICBDb21tZW50RmFjdG9yeS5Db21tZW50LmRlbGV0ZSh7aWQ6IGNvbW1lbnQuX2lkfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICBsb2FkQ29tbWVudHMoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgcmV0dXJuICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICB9KVswXTtcbiAgfTtcblxuICAkc2NvcGUuY29udmVydFRleHRUb0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIHVybEV4cCA9IC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWc7XG4gICAgdmFyIG1haWxFeHAgPSAvW1xcd1xcLlxcLV0rXFxAKFtcXHdcXC1dK1xcLikrW1xcd117Miw0fSg/IVtePF0qPikvaWc7XG5cbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIikucmVwbGFjZShtYWlsRXhwLFwiPGEgaHJlZj0nIy9jb21wYW55L1wiKyRyb3V0ZVBhcmFtcy5pZCtcIi9jb25maXJtP2VtYWlsPSQmJz4kJjwvYT5cIik7XG4gIH07XG5cbiAgJHNjb3BlLmNvbnZlcnROZXdMaW5lc1RvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICByZXR1cm4gJzxkaXYgZGF0YS1tYXJrZG93bj4nK3RleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykrJzwvZGl2Pic7XG4gIH07XG5cbiAgJHNjb3BlLmNvbnZlcnRNYXJrZG93blRvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICByZXR1cm4gJzxkaXYgZGF0YS1tYXJrZG93bj4nICsgdGV4dCArICc8L2Rpdj4nO1xuICB9O1xuXG4gICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAoY29tbWVudCkge1xuICAgIGlmKCEkc2NvcGUubWUucm9sZXMpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgIH0pO1xuXG4gICAgaWYocm9sZXMubGVuZ3RoID09IDAgJiYgY29tbWVudC5tZW1iZXIgIT0gJHNjb3BlLm1lLmlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG4gICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgICByZXR1cm4gbmV3IERhdGUodGltZSkudG9VVENTdHJpbmcoKTtcbiAgfTtcblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkZpcnN0Q29tbWVudENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgTWVtYmVyRmFjdG9yeSwgQ29tbWVudEZhY3RvcnkpIHtcblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgJHNjb3BlLmNvbW1lbnREYXRhID0ge1xuICAgIG1hcmtkb3duOiBcIlwiXG4gIH07XG5cbiAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuZ2V0KHtpZDogXCJtZVwifSwgZnVuY3Rpb24gKG1lKSB7XG4gICAgJHNjb3BlLm1lID0gbWU7XG4gIH0pO1xuXG4gIE1lbWJlckZhY3RvcnkuTWVtYmVyLmdldEFsbChmdW5jdGlvbiAobWVtYmVycykge1xuICAgICRzY29wZS5tZW1iZXJzID0gbWVtYmVycztcbiAgfSk7XG5cbiAgbG9hZENvbW1lbnRzKCk7XG5cbiAgZnVuY3Rpb24gbG9hZENvbW1lbnRzKCkge1xuICAgIGlmICgkc2NvcGUudGhyZWFkLnNwbGl0KFwiLVwiKVsxXSA9PT0gXCJcIikge1xuICAgICAgc2V0VGltZW91dChsb2FkQ29tbWVudHMsIDUwMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHBhZ2VJZCA9ICRzY29wZS50aHJlYWQuc3Vic3RyaW5nKCRzY29wZS50aHJlYWQuaW5kZXhPZihcIi1cIikgKyAxKTtcblxuICAgIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJjb21wYW55LVwiKSAhPSAtMSkge1xuICAgICAgQ29tbWVudEZhY3RvcnkuQ29tcGFueS5nZXRBbGwoe2lkOiBwYWdlSWR9LCBnb3RDb21tZW50cyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCRzY29wZS50aHJlYWQuaW5kZXhPZihcInNwZWFrZXItXCIpICE9IC0xKSB7XG4gICAgICBDb21tZW50RmFjdG9yeS5TcGVha2VyLmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwidG9waWMtXCIpICE9IC0xKSB7XG4gICAgICBDb21tZW50RmFjdG9yeS5Ub3BpYy5nZXRBbGwoe2lkOiBwYWdlSWR9LCBnb3RDb21tZW50cyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ290Q29tbWVudHMoY29tbWVudHMpIHtcbiAgICAgICRzY29wZS5jb21tZW50cyA9IFtdO1xuICAgICAgdmFyIGZpcnN0Q29tbWVudCA9IGNvbW1lbnRzLnNvcnQoZnVuY3Rpb24oYSxiKXtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGEucG9zdGVkKSAtIG5ldyBEYXRlKGIucG9zdGVkKTtcbiAgICAgIH0pWzBdO1xuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gICRzY29wZS5wb3N0Q29tbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duID09PSBcIlwiKXtcbiAgICAgICRzY29wZS5lbXB0eUNvbW1lbnQgPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBkYXRlID0gRGF0ZS5ub3coKTtcbiAgICBDb21tZW50RmFjdG9yeS5Db21tZW50LmNyZWF0ZSh7XG4gICAgICB0aHJlYWQ6ICRzY29wZS50aHJlYWQsXG4gICAgICBtZW1iZXI6ICRzY29wZS5tZS5pZCxcbiAgICAgIG1hcmtkb3duOiAkc2NvcGUuY29tbWVudERhdGEubWFya2Rvd24sXG4gICAgICBodG1sOiAkc2NvcGUuY29udmVydE1hcmtkb3duVG9IdG1sKCRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biksXG4gICAgICBwb3N0ZWQ6IGRhdGUsXG4gICAgICB1cGRhdGVkOiBkYXRlXG4gICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuY29tbWVudERhdGEubWFya2Rvd24gPSBcIlwiO1xuICAgICAgbG9hZENvbW1lbnRzKCk7XG4gICAgfSk7XG4gIH1cblxuICAkc2NvcGUuc2F2ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xuICAgIGlmIChjb21tZW50LmJ1ZmZlciA9PT0gXCJcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbW1lbnQubWFya2Rvd24gPSBjb21tZW50LmJ1ZmZlcjtcbiAgICBjb21tZW50Lmh0bWwgPSAkc2NvcGUuY29udmVydE1hcmtkb3duVG9IdG1sKGNvbW1lbnQubWFya2Rvd24pO1xuICAgIGNvbW1lbnQudXBkYXRlZCA9IERhdGUubm93KCk7XG5cbiAgICBDb21tZW50RmFjdG9yeS5Db21tZW50LnVwZGF0ZSh7aWQ6IGNvbW1lbnQuX2lkfSwgY29tbWVudCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBjb21tZW50LmVkaXRpbmcgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS5xdW90ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xuICAgICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biA9IFwiPiAqKlwiICsgJHNjb3BlLmdldE1lbWJlcihjb21tZW50Lm1lbWJlcikubmFtZSArIFwiIHNhaWQ6KipcXG4+IFwiICsgY29tbWVudC5tYXJrZG93bi5zcGxpdChcIlxcblwiKS5qb2luKFwiXFxuPiBcIikgKyBcIlxcblxcblwiO1xuICB9O1xuXG4gICRzY29wZS5kZWxldGVDb21tZW50ID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgICBpZiAoY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBjb21tZW50P1wiKSkge1xuICAgICAgQ29tbWVudEZhY3RvcnkuQ29tbWVudC5kZWxldGUoe2lkOiBjb21tZW50Ll9pZH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG9hZENvbW1lbnRzKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmNvbnZlcnRUZXh0VG9IdG1sID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciB1cmxFeHAgPSAvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2lnO1xuICAgIHZhciBtYWlsRXhwID0gL1tcXHdcXC5cXC1dK1xcQChbXFx3XFwtXStcXC4pK1tcXHddezIsNH0oPyFbXjxdKj4pL2lnO1xuXG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykucmVwbGFjZSh1cmxFeHAsXCI8YSBocmVmPSckMSc+JDE8L2E+XCIpLnJlcGxhY2UobWFpbEV4cCxcIjxhIGhyZWY9JyMvY29tcGFueS9cIiskcm91dGVQYXJhbXMuaWQrXCIvY29uZmlybT9lbWFpbD0kJic+JCY8L2E+XCIpO1xuICB9O1xuXG4gICRzY29wZS5jb252ZXJ0TmV3TGluZXNUb0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgcmV0dXJuICc8ZGl2IGRhdGEtbWFya2Rvd24+Jyt0ZXh0LnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpKyc8L2Rpdj4nO1xuICB9O1xuXG4gICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgcmV0dXJuICc8ZGl2IGRhdGEtbWFya2Rvd24+JyArIHRleHQgKyAnPC9kaXY+JztcbiAgfTtcblxuICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgICBpZighJHNjb3BlLm1lLnJvbGVzKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcbiAgICB9KTtcblxuICAgIGlmKHJvbGVzLmxlbmd0aCA9PSAwICYmIGNvbW1lbnQubWVtYmVyICE9ICRzY29wZS5tZS5pZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcbiAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgIHZhciBzdWZmaXggPSAnYWdvJztcbiAgICBpZihzZWNvbmRzIDwgMCl7XG4gICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICBzdWZmaXggPSAndG8gZ28nO1xuICAgIH1cblxuICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcblxuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgZGF5cyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcbiAgfTtcblxuICAkc2NvcGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uICh0aW1lKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHRpbWUpLnRvVVRDU3RyaW5nKCk7XG4gIH07XG5cbn0pO1xuIiwicmVxdWlyZSgnLi9hcmVhLmpzJyk7XG5yZXF1aXJlKCcuL2ZpcnN0LmpzJyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNvbW11bmljYXRpb25BcmVhQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCBDb21tdW5pY2F0aW9uRmFjdG9yeSkge1xuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEgPSB7XG4gICAgbWFya2Rvd246IFwiXCJcbiAgfTtcblxuICAkc2NvcGUubWUgPSBKU09OLnBhcnNlKCRzY29wZS5tZUpzb24pO1xuICAkc2NvcGUubWVtYmVycyA9IEpTT04ucGFyc2UoJHNjb3BlLm1lbWJlcnNKc29uKTtcbiAgJHNjb3BlLnJvbGVzID0gSlNPTi5wYXJzZSgkc2NvcGUucm9sZXNKc29uKTtcblxuICBsb2FkQ29tbXVuaWNhdGlvbnMoKTtcblxuICBmdW5jdGlvbiBsb2FkQ29tbXVuaWNhdGlvbnMoKSB7XG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgaWYgKCRzY29wZS50aHJlYWQuc3BsaXQoXCItXCIpWzFdID09PSBcIlwiKSB7XG4gICAgICBzZXRUaW1lb3V0KGxvYWRDb21tdW5pY2F0aW9ucywgNTAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcGFnZUlkID0gJHNjb3BlLnRocmVhZC5zdWJzdHJpbmcoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiLVwiKSArIDEpO1xuXG4gICAgaWYgKCRzY29wZS50aHJlYWQuaW5kZXhPZihcImNvbXBhbnktXCIpICE9IC0xKSB7XG4gICAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21wYW55LmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW11bmljYXRpb25zKTtcbiAgICAgICRzY29wZS5raW5kcz1bJ0VtYWlsIFRvJywgJ0VtYWlsIEZyb20nLCAnTWVldGluZycsICdQaG9uZSBDYWxsJ107XG4gICAgfVxuICAgIGVsc2UgaWYgKCRzY29wZS50aHJlYWQuaW5kZXhPZihcInNwZWFrZXItXCIpICE9IC0xKSB7XG4gICAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5TcGVha2VyLmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW11bmljYXRpb25zKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnb3RDb21tdW5pY2F0aW9ucyhjb21tdW5pY2F0aW9ucykge1xuICAgICAgJHNjb3BlLmNvbW11bmljYXRpb25zID0gY29tbXVuaWNhdGlvbnM7XG5cbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJzcGVha2VyLVwiKSAhPSAtMSkge1xuICAgICAgICBpZihjb21tdW5pY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICAgIHJldHVybiBvLmtpbmQuaW5kZXhPZignUGFyYWdyYXBoJykgIT0gLTE7XG4gICAgICAgIH0pLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgJHNjb3BlLmtpbmRzPVsnRW1haWwgVG8nLCAnRW1haWwgRnJvbScsICdNZWV0aW5nJywgJ1Bob25lIENhbGwnXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUua2luZHM9WydJbml0YWwgRW1haWwgUGFyYWdyYXBoJywnRW1haWwgVG8nLCAnRW1haWwgRnJvbScsICdNZWV0aW5nJywgJ1Bob25lIENhbGwnXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gICRzY29wZS5wb3N0Q29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoISRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS5raW5kIHx8ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS5raW5kPT0gXCJcIil7XG4gICAgICAkc2NvcGUuZW1wdHlDb21tdW5pY2F0aW9uID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCEkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEudGV4dCB8fCAkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEudGV4dD09IFwiXCIpe1xuICAgICAgJHNjb3BlLmVtcHR5Q29tbXVuaWNhdGlvbiA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGRhdGUgPSBEYXRlLm5vdygpO1xuXG4gICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5jcmVhdGUoe1xuICAgICAgdGhyZWFkOiAkc2NvcGUudGhyZWFkLFxuICAgICAgbWVtYmVyOiAkc2NvcGUubWUuaWQsXG4gICAgICBraW5kOiAkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEua2luZCxcbiAgICAgIHRleHQ6ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0LFxuICAgICAgcG9zdGVkOiBkYXRlLFxuICAgICAgdXBkYXRlZDogZGF0ZVxuICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgbG9hZENvbW11bmljYXRpb25zKCk7XG4gICAgfSk7XG4gIH1cblxuICAkc2NvcGUuc2F2ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgIGlmIChjb21tdW5pY2F0aW9uLmJ1ZmZlciA9PT0gXCJcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbW11bmljYXRpb24udGV4dCA9IGNvbW11bmljYXRpb24uYnVmZmVyO1xuICAgIGNvbW11bmljYXRpb24udXBkYXRlZCA9IERhdGUubm93KCk7XG5cbiAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLnVwZGF0ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgY29tbXVuaWNhdGlvbiwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBjb21tdW5pY2F0aW9uLmVkaXRpbmcgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS5kZWxldGVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLmRlbGV0ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgZnVuY3Rpb24gKCkge1xuICAgICAgbG9hZENvbW11bmljYXRpb25zKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmFwcHJvdmVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLmFwcHJvdmUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIG51bGwsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgbG9hZENvbW11bmljYXRpb25zKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmNoZWNrUGVybWlzc2lvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XG4gICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcbiAgICB9KTtcblxuICAgIGlmKHJvbGVzLmxlbmd0aCA9PSAwICYmIGNvbW11bmljYXRpb24ubWVtYmVyICE9ICRzY29wZS5tZS5pZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcbiAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgIHZhciBzdWZmaXggPSAnYWdvJztcbiAgICBpZihzZWNvbmRzIDwgMCl7XG4gICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICBzdWZmaXggPSAndG8gZ28nO1xuICAgIH1cblxuICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcblxuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgZGF5cyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcbiAgfTtcblxuICAkc2NvcGUuY29udmVydFVSTHMgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIHVybEV4cCA9IC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWc7XG5cbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIik7XG4gIH1cblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNvbW11bmljYXRpb25FbWJlZENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgQ29tbXVuaWNhdGlvbkZhY3RvcnkpIHtcblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5zdWNjZXNzICAgICA9IFwiXCI7XG4gICRzY29wZS5lcnJvciAgICAgICA9IFwiXCI7XG5cbiAgJHNjb3BlLmNvbW11bmljYXRpb24gPSBKU09OLnBhcnNlKCRzY29wZS5jb21tdW5pY2F0aW9uSnNvbik7XG4gICRzY29wZS5jb21tdW5pY2F0aW9uLmVkaXRpbmcgPSBmYWxzZTtcbiAgJHNjb3BlLmNvbW11bmljYXRpb24uZGVsZXRlZCA9IGZhbHNlO1xuXG4gICRzY29wZS5tZSA9IEpTT04ucGFyc2UoJHNjb3BlLm1lSnNvbik7XG4gICRzY29wZS5tZW1iZXJzID0gSlNPTi5wYXJzZSgkc2NvcGUubWVtYmVyc0pzb24pO1xuICAkc2NvcGUucm9sZXMgPSBKU09OLnBhcnNlKCRzY29wZS5yb2xlc0pzb24pO1xuXG5cbiAgJHNjb3BlLnNhdmVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICBpZiAoY29tbXVuaWNhdGlvbi5idWZmZXIgPT09IFwiXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb21tdW5pY2F0aW9uLnRleHQgPSBjb21tdW5pY2F0aW9uLmJ1ZmZlcjtcbiAgICBjb21tdW5pY2F0aW9uLnVwZGF0ZWQgPSBEYXRlLm5vdygpO1xuXG4gICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi51cGRhdGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIGNvbW11bmljYXRpb24sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgY29tbXVuaWNhdGlvbi5lZGl0aW5nID0gZmFsc2U7XG4gICAgICBjb21tdW5pY2F0aW9uLmFwcHJvdmVkID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICAkc2NvcGUuZGVsZXRlQ29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XG4gICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5kZWxldGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5jb21tdW5pY2F0aW9uLmRlbGV0ZWQgPSB0cnVlO1xuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5hcHByb3ZlQ29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XG4gICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5hcHByb3ZlKHtpZDogY29tbXVuaWNhdGlvbi5faWR9LCBudWxsLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5jb21tdW5pY2F0aW9uLmFwcHJvdmVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgcmV0dXJuICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICB9KVswXTtcbiAgfTtcblxuICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgIH0pO1xuXG4gICAgaWYocm9sZXMubGVuZ3RoID09IDAgJiYgY29tbXVuaWNhdGlvbi5tZW1iZXIgIT0gJHNjb3BlLm1lLmlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG4gICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgICByZXR1cm4gbmV3IERhdGUodGltZSkudG9VVENTdHJpbmcoKTtcbiAgfTtcblxuICAkc2NvcGUuY29udmVydFVSTHMgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIHVybEV4cCA9IC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWc7XG5cbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIik7XG4gIH1cbn0pO1xuIiwicmVxdWlyZSgnLi9hcmVhLmpzJyk7XG5yZXF1aXJlKCcuL2xpc3QuanMnKTtcbnJlcXVpcmUoJy4vZW1iZWQuanMnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXJcbiAgLmNvbnRyb2xsZXIoJ0NvbW11bmljYXRpb25zQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCBDb21tdW5pY2F0aW9uRmFjdG9yeSkge1xuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uZ2V0QWxsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgJHNjb3BlLmNvbW11bmljYXRpb25zID0gcmVzcG9uc2U7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc2hvd09wZW4gPSB0cnVlO1xuXG4gICAgJHNjb3BlLnNob3duQ29tbXVuaWNhdGlvbnMgPSBmdW5jdGlvbiAoc2hvd09wZW4pIHtcbiAgICAgIHJldHVybiAkc2NvcGUuY29tbXVuaWNhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgcmV0dXJuIChzaG93T3BlbiA/ICFvLmFwcHJvdmVkIDogby5hcHByb3ZlZCk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignQ29tcGFueUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCBDb21wYW55RmFjdG9yeSwgTWVtYmVyRmFjdG9yeSwgTm90aWZpY2F0aW9uRmFjdG9yeSkge1xuXG4gICAgJHNjb3BlLnRydXN0U3JjID0gZnVuY3Rpb24oc3JjKSB7XG4gICAgICByZXR1cm4gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoc3JjKycjcGFnZS1ib2R5Jyk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmNvbnZlcnRFbWFpbHMgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICB2YXIgbWFpbEV4cCA9IC9bXFx3XFwuXFwtXStcXEAoW1xcd1xcLV0rXFwuKStbXFx3XXsyLDR9KD8hW148XSo+KS9pZztcbiAgICAgIHZhciB0d2l0dGVyRXhwID0gLyhefFteQFxcd10pQChcXHd7MSwxNX0pXFxiL2c7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKG1haWxFeHAsXCI8YSBocmVmPScjL2NvbXBhbnkvXCIrJHJvdXRlUGFyYW1zLmlkK1wiL2NvbmZpcm0/ZW1haWw9JCYnPiQmPC9hPlwiKS5yZXBsYWNlKHR3aXR0ZXJFeHAsXCIkMTxhIGhyZWY9J2h0dHA6Ly90d2l0dGVyLmNvbS8kMicgdGFyZ2V0PSdfYmxhbmsnPiQyPC9hPlwiKVxuICAgIH1cblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb21wYW55RGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkudXBkYXRlKHsgaWQ6Y29tcGFueURhdGEuaWQgfSwgY29tcGFueURhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnQ29udGFjdGVkJywnSW4gQ29udmVyc2F0aW9ucycsJ0luIE5lZ290aWF0aW9ucycsJ0Nsb3NlZCBEZWFsJywnUmVqZWN0ZWQnLCdHaXZlIFVwJ107XG4gICAgJHNjb3BlLmxvZ29TaXplcyA9IFtudWxsLCAnUycsJ00nLCdMJ107XG4gICAgJHNjb3BlLnN0YW5kRGF5cyA9IFtudWxsLCAxLDIsMyw0LDVdO1xuICAgICRzY29wZS5wb3N0c051bWJlcnMgPSBbbnVsbCwgMSwyLDMsNCw1XTtcblxuICAgICRzY29wZS5jb21wYW55ID0gJHNjb3BlLmZvcm1EYXRhID0gJHNjb3BlLmdldENvbXBhbnkoJHJvdXRlUGFyYW1zLmlkKTtcblxuICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0KHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5jb21wYW55ID0gJHNjb3BlLmZvcm1EYXRhID0gcmVzcG9uc2U7XG5cbiAgICAgIE5vdGlmaWNhdGlvbkZhY3RvcnkuQ29tcGFueS5nZXRBbGwoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihnZXREYXRhKSB7XG4gICAgICAgICRzY29wZS5jb21wYW55Lm5vdGlmaWNhdGlvbnMgPSBnZXREYXRhO1xuXG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDb21wYW55RW1haWxDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgJGxvY2F0aW9uLCBFbWFpbEZhY3RvcnkpIHtcbiAgICAkc2NvcGUuZW1haWwgPSAkbG9jYXRpb24uc2VhcmNoKCkuZW1haWw7XG4gICAgJHNjb3BlLmNvbXBhbnlJZCA9ICRyb3V0ZVBhcmFtcy5pZDtcbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgJHNjb3BlLm1lc3NhZ2UgPSBudWxsO1xuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAgICRzY29wZS5tZXNzYWdlID0gbnVsbDtcblxuICAgICAgY29uc29sZS5sb2coXCJzZW5kIGVtYWlsIHRvIFwiLCAkc2NvcGUuZW1haWwsIFwiIGZyb20gXCIsICRzY29wZS5jb21wYW55SWQpO1xuXG4gICAgICBFbWFpbEZhY3RvcnkuQ29tcGFueS5zZW5kKHsgaWQ6ICRzY29wZS5jb21wYW55SWQgfSwgeyBlbWFpbDogJHNjb3BlLmVtYWlsIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbiBcbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDcmVhdGVDb21wYW55Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgQ29tcGFueUZhY3RvcnkpIHtcbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29tcGFueURhdGEgPSB0aGlzLmZvcm1EYXRhO1xuXG4gICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmNyZWF0ZShjb21wYW55RGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG4gICAgICAgICAgXG4gICAgICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS5nZXRBbGwoZnVuY3Rpb24gKGNvbXBhbmllcykge1xuICAgICAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IGNvbXBhbmllcztcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL2NvbXBhbnkvXCIgKyByZXNwb25zZS5pZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc3RhdHVzZXMgPSBbJ1N1Z2dlc3Rpb24nLCdDb250YWN0ZWQnLCdJbiBDb252ZXJzYXRpb25zJywnSW4gTmVnb3RpYXRpb25zJywnQ2xvc2VkIERlYWwnLCdSZWplY3RlZCcsJ0dpdmUgVXAnXTtcbiAgfSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJDb21wYW55RW1iZWRDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxuICAkc2NvcGUubWUgPSBKU09OLnBhcnNlKCRzY29wZS5tZUpzb24pO1xuICAkc2NvcGUubWVtYmVycyA9IEpTT04ucGFyc2UoJHNjb3BlLm1lbWJlcnNKc29uKTtcbiAgJHNjb3BlLnJvbGVzID0gSlNPTi5wYXJzZSgkc2NvcGUucm9sZXNKc29uKTtcblxuICBpZigkc2NvcGUuY29tbWVudHMpIHtcbiAgICAkc2NvcGUuY29tcGFueS5jb21tZW50cyA9ICRzY29wZS5jb21tZW50cy5maWx0ZXIoZnVuY3Rpb24oZSkge1xuICAgICAgcmV0dXJuIGUudGhyZWFkID09ICdjb21wYW55LScrJHNjb3BlLmNvbXBhbnkuaWQ7XG4gICAgfSlcbiAgfVxuXG4gICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICB2YXIgbWVtYmVyID0gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xuICAgIH0pO1xuXG4gICAgaWYobWVtYmVyLmxlbmd0aD4wKSB7XG4gICAgICByZXR1cm4gbWVtYmVyWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBcIk5vIG9uZVwiLFxuICAgICAgICBmYWNlYm9vazogXCIxMDAwMDA0NTYzMzU5NzJcIlxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG59KTtcbiIsInJlcXVpcmUoJy4vY29tcGFueS5qcycpO1xucmVxdWlyZSgnLi9saXN0LmpzJyk7XG5yZXF1aXJlKCcuL2NyZWF0ZS5qcycpO1xucmVxdWlyZSgnLi9jb25maXJtLmpzJyk7XG5yZXF1aXJlKCcuL2VtYmVkLmpzJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignQ29tcGFuaWVzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkc2NlLCBDb21wYW55RmFjdG9yeSwgTWVtYmVyRmFjdG9yeSkge1xuICAgICRzY29wZS5zYXZlU3RhdHVzID0gZnVuY3Rpb24oY29tcGFueSkge1xuICAgICAgdmFyIGNvbXBhbnlEYXRhID0gY29tcGFueTtcblxuICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS51cGRhdGUoeyBpZDpjb21wYW55LmlkIH0sIGNvbXBhbnlEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmdldENsYXNzRnJvbVBheW1lbnRTdGF0dXMgPSBmdW5jdGlvbihwYXJ0aWNpcGF0aW9uKSB7XG4gICAgICBpZighcGFydGljaXBhdGlvbikgeyByZXR1cm4gXCJncmV5XCI7IH1cbiAgICAgIGlmKCFwYXJ0aWNpcGF0aW9uLnBheW1lbnQpIHsgcmV0dXJuIFwiZ3JleVwiOyB9XG4gICAgICBpZighcGFydGljaXBhdGlvbi5wYXltZW50LnN0YXR1cykgeyByZXR1cm4gXCJncmV5XCI7IH1cbiAgICAgIHZhciBzdGF0dXMgPSBwYXJ0aWNpcGF0aW9uLnBheW1lbnQuc3RhdHVzLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIGlmKHN0YXR1cy5pbmRleE9mKFwicGFnb1wiKSAhPSAtMSB8fCBzdGF0dXMuaW5kZXhPZihcImVtaXRpZG9cIikgIT0gLTEgfHwgc3RhdHVzLmluZGV4T2YoXCJyZWNpYm8gZW52aWFkb1wiKSAhPSAtMSkgeyByZXR1cm4gXCJsaW1lXCI7IH0gXG4gICAgICBlbHNlIGlmKHN0YXR1cy5pbmRleE9mKFwiZW52aWFkb1wiKSAhPSAtMSkgeyByZXR1cm4gXCJvcmFuZ2VcIjsgfVxuICAgICAgZWxzZSB7IHJldHVybiBcImdyZXlcIjsgfVxuICAgIH1cblxuICAgICRzY29wZS5wYXltZW50U3RhdHVzZXMgPSBbJ0VtaXRpZG8nLCAnUmVjaWJvIEVudmlhZG8nLCAnUGFnbycsICdFbnZpYWRvJ107XG4gIFxuICAgICRzY29wZS5saW1pdCA9IDY7XG5cbiAgICAkc2NvcGUuc3RhdHVzZXMgPSBbJ1N1Z2dlc3Rpb24nLCdDb250YWN0ZWQnLCdJbiBDb252ZXJzYXRpb25zJywnSW4gTmVnb3RpYXRpb25zJywnQ2xvc2VkIERlYWwnLCdSZWplY3RlZCcsJ0dpdmUgVXAnXTtcbiAgICBcbiAgICAkc2NvcGUuY29tcGFueVByZWRpY2F0ZSA9ICd1cGRhdGVkJztcbiAgICAkc2NvcGUucmV2ZXJzZSA9ICd0cnVlJztcblxuICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUucHJlZGljYXRlID0gJ3VwZGF0ZWQnO1xuICAgICAgJHNjb3BlLnJldmVyc2UgPSB0cnVlO1xuICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IHJlc3BvbnNlO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCRzY29wZS5saW1pdCA8PSAkc2NvcGUuY29tcGFuaWVzLmxlbmd0aClcbiAgICAgICAgJHNjb3BlLmxpbWl0ICs9IDI7XG4gICAgfTtcbiAgICBcbiAgICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKG1lbWJlcikge1xuICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgICAgfSk7XG5cbiAgICAgIGlmKHJvbGVzLmxlbmd0aCA9PSAwICYmIG1lbWJlci5pZCAhPSAkc2NvcGUubWUuaWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmFkZENvbXBhbnkgPSBmdW5jdGlvbihtZW1iZXIsIG5ld0NvbXBhbnkpIHtcbiAgICAgIGNvbnNvbGUubG9nKG5ld0NvbXBhbnkpO1xuICAgICAgdmFyIGNvbXBhbnlEYXRhID0gbmV3Q29tcGFueTtcbiAgICAgIFxuICAgICAgaWYobmV3Q29tcGFueS5pZCkge1xuICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LnVwZGF0ZSh7IGlkOiBjb21wYW55RGF0YS5pZCB9LCB7IG1lbWJlcjogbWVtYmVyLmlkIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLnN1Y2Nlc3M7XG5cbiAgICAgICAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKGZ1bmN0aW9uIChjb21wYW5pZXMpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IGNvbXBhbmllcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21wYW55RGF0YS5zdGF0dXMgPSAnU2VsZWN0ZWQnO1xuICAgICAgICBjb21wYW55RGF0YS5tZW1iZXIgPSBtZW1iZXIuaWQ7XG5cbiAgICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS5jcmVhdGUoY29tcGFueURhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG5cbiAgICAgICAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKGZ1bmN0aW9uIChjb21wYW5pZXMpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IGNvbXBhbmllcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbn0pO1xuICAiLCJ0aGVUb29sQ29udHJvbGxlciA9IGFuZ3VsYXIubW9kdWxlKCd0aGVUb29sLmNvbnRyb2xsZXJzJywgW10pO1xuXG5yZXF1aXJlKCcuL2F1dGgnKTtcbnJlcXVpcmUoJy4vbWFpbicpO1xucmVxdWlyZSgnLi9jb21wYW55Jyk7XG5yZXF1aXJlKCcuL3NwZWFrZXInKTtcbnJlcXVpcmUoJy4vbWVtYmVyJyk7XG5yZXF1aXJlKCcuL2NvbW1lbnQnKTtcbnJlcXVpcmUoJy4vbWVldGluZycpO1xucmVxdWlyZSgnLi9jaGF0Jyk7XG5yZXF1aXJlKCcuL3RvcGljJyk7XG5yZXF1aXJlKCcuL2NvbW11bmljYXRpb24nKTtcbnJlcXVpcmUoJy4vdGFnJyk7XG5yZXF1aXJlKCcuL3N1YnNjcmlwdGlvbicpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJob21lXCIsIGZ1bmN0aW9uICgkc2NvcGUsIE5vdGlmaWNhdGlvbkZhY3RvcnkpIHtcblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICRzY29wZS5ub3RpZmljYXRpb25zID0gW107XG4gICRzY29wZS5saW1pdCA9IDEwO1xuXG4gIE5vdGlmaWNhdGlvbkZhY3RvcnkuTm90aWZpY2F0aW9uLmdldEFsbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAkc2NvcGUubm90aWZpY2F0aW9ucyA9IHJlc3BvbnNlO1xuICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gIH0pO1xuXG4gICRzY29wZS5zY3JvbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCRzY29wZS5saW1pdCA8ICRzY29wZS5ub3RpZmljYXRpb25zLmxlbmd0aCkge1xuICAgICAgJHNjb3BlLmxpbWl0ICs9IDEwO1xuICAgIH1cbiAgfTtcblxufSk7XG4iLCJyZXF1aXJlKCcuL21haW4uanMnKTtcbnJlcXVpcmUoJy4vaG9tZS5qcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsICRsb2NhdGlvbiwgJHdpbmRvdywgJHJvb3RTY29wZSwgTm90aWZpY2F0aW9uRmFjdG9yeSwgTWVtYmVyRmFjdG9yeSwgQ29tcGFueUZhY3RvcnksIFNwZWFrZXJGYWN0b3J5LCBUb3BpY0ZhY3RvcnksIFJvbGVGYWN0b3J5LCBUYWdGYWN0b3J5LCBDb21tZW50RmFjdG9yeSkge1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLnJlYWR5ID0gZmFsc2U7XG5cbiAgJHNjb3BlLmRpc3BsYXkgPSBmYWxzZTtcblxuICAkc2NvcGUuc2VhcmNoID0ge307XG4gICRzY29wZS5zZWFyY2hUb3BpY3MgPSB7fTtcbiAgJHNjb3BlLnNlYXJjaENvbXBhbmllcyA9IHt9O1xuICAkc2NvcGUuc2VhcmNoU3BlYWtlcnMgPSB7fTtcbiAgJHNjb3BlLnNlYXJjaE1lbWJlcnMgPSB7fTtcblxuICAkc2NvcGUubWUgPSB7fTtcbiAgJHNjb3BlLm1lbWJlcnMgPSBbXTtcbiAgJHNjb3BlLmNvbXBhbmllcyA9IFtdO1xuICAkc2NvcGUuc3BlYWtlcnMgPSBbXTtcbiAgJHNjb3BlLnRvcGljcyA9IFtdO1xuICAkc2NvcGUubm90aWZpY2F0aW9ucyA9IFtdO1xuXG4gICRzY29wZS5ub3RpZmljYXRpb25zSW5mbyA9IHtcbiAgICBudW1iZXI6IDAsXG4gICAgdGV4dDogXCIgTG9hZGluZy4uLlwiXG4gIH07XG5cbiAgdmFyIGZhY3Rvcmllc1JlYWR5ID0gMDtcblxuICBNZW1iZXJGYWN0b3J5Lk1lLmdldChmdW5jdGlvbiAobWUpIHtcbiAgICAkc2NvcGUubWUgPSBtZTtcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcblxuICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXRBbGwoZnVuY3Rpb24gKG1lbWJlcnMpIHtcbiAgICAkc2NvcGUubWVtYmVycyA9IG1lbWJlcnM7XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cbiAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS5nZXRBbGwoZnVuY3Rpb24gKGNvbXBhbmllcykge1xuICAgICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cbiAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXRBbGwoZnVuY3Rpb24gKHNwZWFrZXJzKSB7XG4gICAgJHNjb3BlLnNwZWFrZXJzID0gc3BlYWtlcnM7XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cbiAgVG9waWNGYWN0b3J5LlRvcGljLmdldEFsbChmdW5jdGlvbiAodG9waWNzKSB7XG4gICAgJHNjb3BlLnRvcGljcyA9IHRvcGljcztcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcblxuICBSb2xlRmFjdG9yeS5Sb2xlLmdldEFsbChmdW5jdGlvbiAocm9sZXMpIHtcbiAgICAkc2NvcGUucm9sZXMgPSByb2xlcztcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcblxuICBUYWdGYWN0b3J5LlRhZy5nZXRBbGwoZnVuY3Rpb24gKHRhZ3MpIHtcbiAgICAkc2NvcGUudG9waWNUYWdzID0gdGFncztcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcblxuICBDb21tZW50RmFjdG9yeS5Db21tZW50LmdldEFsbChmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAkc2NvcGUuY29tbWVudHMgPSBjb21tZW50cztcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIGNhbGxiYWNrKCkge1xuICAgIGlmICgrK2ZhY3Rvcmllc1JlYWR5ID09IDgpIHtcbiAgICAgICRzY29wZS5yZWFkeSA9IHRydWU7XG5cbiAgICAgICRzY29wZS51cGRhdGUoKTtcblxuICAgICAgc2V0SW50ZXJ2YWwoJHNjb3BlLnVwZGF0ZSwgMTAwMDApO1xuXG4gICAgICAkcm9vdFNjb3BlLiRvbihcIiRsb2NhdGlvbkNoYW5nZVN0YXJ0XCIsIGZ1bmN0aW9uIChldmVudCwgbmV4dCwgY3VycmVudCkge1xuICAgICAgICBzZXRUaW1lb3V0KCRzY29wZS51cGRhdGUsIDUwMCk7XG4gICAgICAgICRzY29wZS5zZWFyY2gubmFtZSA9ICcnO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U0NPUEUgRlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgTm90aWZpY2F0aW9uRmFjdG9yeS5Ob3RpZmljYXRpb24uZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLm5vdGlmaWNhdGlvbnMgPSBbXTtcbiAgICAgICRzY29wZS5ub3RpZmljYXRpb25zSW5mby5udW1iZXIgPSAwO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChyZXNwb25zZVtpXS50YXJnZXRzLmluZGV4T2YoJHNjb3BlLm1lLmlkKSAhPSAtMSkge1xuICAgICAgICAgIGlmIChyZXNwb25zZVtpXS51bnJlYWQuaW5kZXhPZigkc2NvcGUubWUuaWQpICE9IC0xKSB7XG4gICAgICAgICAgICAkc2NvcGUubm90aWZpY2F0aW9uc0luZm8ubnVtYmVyKys7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5ub3RpZmljYXRpb25zLnVuc2hpZnQocmVzcG9uc2VbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICgkc2NvcGUubm90aWZpY2F0aW9uc0luZm8ubnVtYmVyID09IDApIHtcbiAgICAgICAgJHNjb3BlLm5vdGlmaWNhdGlvbnNJbmZvLnRleHQgPSBcIiBObyBOb3RpZmljYXRpb25zXCI7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgJHNjb3BlLm5vdGlmaWNhdGlvbnNJbmZvLnRleHQgPSBcIiBcIiArICRzY29wZS5ub3RpZmljYXRpb25zSW5mby5udW1iZXIgKyBcIiBOb3RpZmljYXRpb25cIiArICgkc2NvcGUubm90aWZpY2F0aW9uc0luZm8ubnVtYmVyID4gMSA/IFwic1wiIDogXCJcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG4gICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgICByZXR1cm4gbmV3IERhdGUodGltZSkudG9VVENTdHJpbmcoKTtcbiAgfTtcblxuICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgdmFyIG1lbWJlciA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICB9KTtcblxuICAgIGlmKG1lbWJlci5sZW5ndGg+MCkge1xuICAgICAgcmV0dXJuIG1lbWJlclswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogXCJObyBvbmVcIixcbiAgICAgICAgZmFjZWJvb2s6IFwiMTAwMDAwNDU2MzM1OTcyXCJcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLmdldFNwZWFrZXIgPSBmdW5jdGlvbiAoc3BlYWtlcklkKSB7XG4gICAgcmV0dXJuICRzY29wZS5zcGVha2Vycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gc3BlYWtlcklkO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gICRzY29wZS5nZXRDb21wYW55ID0gZnVuY3Rpb24gKGNvbXBhbnlJZCkge1xuICAgIHJldHVybiAkc2NvcGUuY29tcGFuaWVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBjb21wYW55SWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmdldFRvcGljID0gZnVuY3Rpb24gKHRvcGljSWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uX2lkID09IHRvcGljSWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmdldE5vdGlmaWNhdGlvbnMgPSBmdW5jdGlvbiAodGhyZWFkKSB7XG4gICAgcmV0dXJuICRzY29wZS5ub3RpZmljYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby50aHJlYWQgPT0gdGhyZWFkO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gICRzY29wZS5nZXRVbnJlYWROb3RpZmljYXRpb25zID0gZnVuY3Rpb24gKHRocmVhZCkge1xuICAgIHJldHVybiAkc2NvcGUubm90aWZpY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8udGhyZWFkID09IHRocmVhZCAmJiBvLnVucmVhZC5pbmRleE9mKCRzY29wZS5tZS5pZCkgIT0gLTE7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLnNob3cgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuZGlzcGxheSA9ICgkc2NvcGUuc2VhcmNoLm5hbWUgPyB0cnVlIDogZmFsc2UpO1xuICB9O1xuXG4gICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLmRpc3BsYXkgPSBmYWxzZTtcbiAgfTtcblxuICAkc2NvcGUuY29udmVydFVSTHMgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIHVybEV4cCA9IC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWc7XG5cbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIik7XG4gIH1cblxuICAkc2NvcGUuY29udmVydE5ld0xpbmVzVG9IdG1sID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicrdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKSsnPC9kaXY+JztcbiAgfVxuXG4gICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgcmV0dXJuICc8ZGl2IGRhdGEtbWFya2Rvd24+JyArIHRleHQgKyAnPC9kaXY+JztcbiAgfVxuXG4gICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgJGh0dHAuZ2V0KHVybF9wcmVmaXggKyAnL2FwaS9sb2dvdXQnKS5cbiAgICAgIHN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oJy8nKTtcbiAgICAgIH0pLlxuICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUlwiLCBkYXRhKTtcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oJy8nKTtcbiAgICAgIH0pO1xuICB9XG5cblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIk1lZXRpbmdFbWJlZENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgTWVldGluZ0ZhY3RvcnkpIHtcblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICBNZWV0aW5nRmFjdG9yeS5nZXQoe2lkOiAkc2NvcGUubWVldGluZ0lkfSwgZnVuY3Rpb24gKG1lZXRpbmcpIHtcbiAgICAkc2NvcGUubWVldGluZyA9IG1lZXRpbmc7XG5cbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICB9KTtcblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PT0gbWVtYmVySWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbn0pO1xuIiwicmVxdWlyZShcIi4vZW1iZWRcIik7XG5yZXF1aXJlKFwiLi9saXN0XCIpO1xucmVxdWlyZShcIi4vbWVldGluZ1wiKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignTWVldGluZ3NDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2F0aW9uLCBNZWV0aW5nRmFjdG9yeSkge1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gIGluaXQoKTtcblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJHNjb3BlLmxvYWRpbmcpIHtcbiAgICAgICAgaW5pdCgpO1xuICAgICAgfVxuICAgIH0sIDEwMDApO1xuXG4gICAgTWVldGluZ0ZhY3RvcnkuZ2V0QWxsKGZ1bmN0aW9uIChtZWV0aW5ncykge1xuICAgICAgJHNjb3BlLm1lZXRpbmdzID0gbWVldGluZ3M7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLm1lZXRpbmdzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAkc2NvcGUubWVldGluZ3NbaV0uZmFjZWJvb2sgPSAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICAgIHJldHVybiAkc2NvcGUubWVldGluZ3NbaV0uYXV0aG9yID09IG8uaWQ7XG4gICAgICAgIH0pWzBdLmZhY2Vib29rO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUudGltZSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gJHNjb3BlLnRpbWVTaW5jZShuZXcgRGF0ZShkYXRlKSk7XG4gIH07XG5cbiAgJHNjb3BlLmNyZWF0ZU1lZXRpbmcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG5cbiAgICBNZWV0aW5nRmFjdG9yeS5jcmVhdGUoe1xuICAgICAgYXV0aG9yOiAkc2NvcGUubWUuaWQsXG4gICAgICB0aXRsZTogZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoXCJwdC1QVFwiKSArIFwiIC0gTWVldGluZ1wiLFxuICAgICAgZGF0ZTogZGF0ZVxuICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9tZWV0aW5nL1wiICsgcmVzcG9uc2UuaWQgKyBcIi9lZGl0XCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTWVldGluZ0NvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24sICR0aW1lb3V0LCBNZWV0aW5nRmFjdG9yeSwgVG9waWNGYWN0b3J5LCBUYWdGYWN0b3J5KSB7XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUlOSVRJQUxJWkFUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgJHNjb3BlLmtpbmRzID0gW1wiSW5mb1wiLCBcIlRvIGRvXCIsIFwiRGVjaXNpb25cIiwgXCJJZGVhXCJdO1xuXG4gIE1lZXRpbmdGYWN0b3J5LmdldCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uIChtZWV0aW5nKSB7XG4gICAgJHNjb3BlLm1lZXRpbmcgPSBtZWV0aW5nO1xuXG4gICAgU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCA9IGZ1bmN0aW9uIChzdWZmaXgpIHtcbiAgICAgIHJldHVybiB0aGlzLmluZGV4T2Yoc3VmZml4LCB0aGlzLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpICE9PSAtMTtcbiAgICB9O1xuXG4gICAgaWYgKCRsb2NhdGlvbi5wYXRoKCkuZW5kc1dpdGgoXCIvdGV4dFwiKSkge1xuICAgICAgdmFyIHRleHQgPSBtZWV0aW5nLnRpdGxlICsgXCJcXG5cXG5cIiArIChtZWV0aW5nLmRlc2NyaXB0aW9uID8gbWVldGluZy5kZXNjcmlwdGlvbiArIFwiXFxuXFxuXCIgOiBcIlwiKTtcblxuICAgICAgaWYgKG1lZXRpbmcuYXR0ZW5kYW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRleHQgKz0gXCJBdHRlbmRhbnRzOlxcblwiO1xuXG4gICAgICAgIG1lZXRpbmcuYXR0ZW5kYW50cy5zb3J0KCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZWV0aW5nLmF0dGVuZGFudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0ZXh0ICs9ICRzY29wZS5nZXRNZW1iZXIobWVldGluZy5hdHRlbmRhbnRzW2ldKS5uYW1lICsgKGkrMSA8IG1lZXRpbmcuYXR0ZW5kYW50cy5sZW5ndGggPyBcIiwgXCIgOiBcIlwiKTtcbiAgICAgICAgfVxuICAgICAgICB0ZXh0ICs9IFwiXFxuXFxuXCI7XG4gICAgICB9XG5cbiAgICAgIFRhZ0ZhY3RvcnkuVGFnLmdldEFsbChmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIHZhciB0YWdzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0YWdzLnB1c2gocmVzdWx0W2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRhZ3Muc29ydChmdW5jdGlvbiAobzEsIG8yKSB7XG4gICAgICAgICAgcmV0dXJuIG8xLm5hbWUubG9jYWxlQ29tcGFyZShvMi5uYW1lKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHRvcGljcyA9IG1lZXRpbmcudG9waWNzLmZpbHRlcihmdW5jdGlvbiAobykge1xuICAgICAgICAgICAgcmV0dXJuIG8udGFncy5pbmRleE9mKHRhZ3NbaV0uaWQpICE9IC0xO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKHRvcGljcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRleHQgKz0gdGFnc1tpXS5uYW1lICsgXCI6XFxuXCI7XG5cbiAgICAgICAgICB0b3BpY3Muc29ydChmdW5jdGlvbiAobzEsIG8yKSB7XG4gICAgICAgICAgICByZXR1cm4gbzEucG9zdGVkLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZShvMi5wb3N0ZWQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRvcGljcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdGV4dCArPSBcIiAgICAtIFwiICsgdG9waWNzW2pdLnRleHQucmVwbGFjZSgvXFxuL2csIFwiXFxuICAgICAgXCIpICsgXCJcXG5cIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0ZXh0ICs9IFwiXFxuXCI7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUubnVtYmVyT2ZMaW5lcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIG4gPSAwO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRleHRbaV0gPT09IFwiXFxuXCIpIHtcbiAgICAgICAgICAgICAgbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbiArIDI7XG4gICAgICAgIH0oKSk7XG5cbiAgICAgICAgJHNjb3BlLnRleHQgPSB0ZXh0O1xuXG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUudG9nZ2xlQXR0ZW5kYW50ID0gZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHZhciBpbmRleCA9ICRzY29wZS5tZWV0aW5nLmF0dGVuZGFudHMuaW5kZXhPZihtZW1iZXIpO1xuXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgJHNjb3BlLm1lZXRpbmcuYXR0ZW5kYW50cy5wdXNoKG1lbWJlcik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgJHNjb3BlLm1lZXRpbmcuYXR0ZW5kYW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUudG9nZ2xlQXR0ZW5kYW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS5tZW1iZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgJHNjb3BlLnRvZ2dsZUF0dGVuZGFudCgkc2NvcGUubWVtYmVyc1tpXS5pZCk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5nZXRBdHRlbmRhbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkc2NvcGUubWVldGluZy5hdHRlbmRhbnRzLm1hcChmdW5jdGlvbiAobykge1xuICAgICAgcmV0dXJuICRzY29wZS5nZXRNZW1iZXIobyk7XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmNyZWF0ZVRvcGljID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICB2YXIgdG9waWMgPSB7XG4gICAgICBlZGl0aW5nOiB0cnVlLFxuICAgICAgYXV0aG9yOiAkc2NvcGUubWUuaWQsXG4gICAgICB0ZXh0OiBcIlwiLFxuICAgICAgdGFyZ2V0czogW10sXG4gICAgICBraW5kOiBraW5kLFxuICAgICAgY2xvc2VkOiBmYWxzZSxcbiAgICAgIHJlc3VsdDogXCJcIixcbiAgICAgIHBvbGw6IHtcbiAgICAgICAga2luZDogXCJ0ZXh0XCIsXG4gICAgICAgIG9wdGlvbnM6IFtdXG4gICAgICB9LFxuICAgICAgZHVlZGF0ZTogbnVsbCxcbiAgICAgIG1lZXRpbmdzOiBbJHNjb3BlLm1lZXRpbmcuX2lkXSxcbiAgICAgIHJvb3Q6IG51bGwsXG4gICAgICB0YWdzOiBbXSxcbiAgICAgIHBvc3RlZDogbmV3IERhdGUoKVxuICAgIH07XG5cbiAgICBUb3BpY0ZhY3RvcnkuVG9waWMuY3JlYXRlKHRvcGljLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgIHRvcGljLl9pZCA9IHJlc3BvbnNlLmlkO1xuICAgICAgICAkc2NvcGUubWVldGluZy50b3BpY3MucHVzaCh0b3BpYyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmFkZFRvcGljID0gZnVuY3Rpb24gKHRvcGljSWQpIHtcbiAgICAkc2NvcGUuZGlzcGxheSA9IGZhbHNlO1xuXG4gICAgdmFyIHRvcGljID0gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiBvLl9pZCA9PT0gdG9waWNJZDtcbiAgICB9KVswXTtcblxuICAgICRzY29wZS5tZWV0aW5nLnRvcGljcy5wdXNoKHRvcGljKTtcblxuICAgIHRvcGljLm1lZXRpbmdzLnB1c2goJHNjb3BlLm1lZXRpbmcuX2lkKTtcbiAgICBUb3BpY0ZhY3RvcnkuVG9waWMudXBkYXRlKHtpZDogdG9waWMuX2lkfSwgdG9waWMpO1xuICB9O1xuXG4gICRzY29wZS5yZW1vdmVUb3BpYyA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgICRzY29wZS5tZWV0aW5nLnRvcGljcy5zcGxpY2UoJHNjb3BlLm1lZXRpbmcudG9waWNzLmluZGV4T2YodG9waWMpLCAxKTtcblxuICAgIHRvcGljLm1lZXRpbmdzLnNwbGljZSh0b3BpYy5tZWV0aW5ncy5pbmRleE9mKCRzY29wZS5tZWV0aW5nLl9pZCksIDEpO1xuICAgIFRvcGljRmFjdG9yeS5Ub3BpYy51cGRhdGUoe2lkOiB0b3BpYy5faWR9LCB0b3BpYyk7XG4gIH07XG5cbiAgJHNjb3BlLnNhdmVNZWV0aW5nID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5zdWNjZXNzID0gXCJcIjtcbiAgICAkc2NvcGUuZXJyb3IgICA9IFwiXCI7XG5cbiAgICBpZiAoISRzY29wZS5tZWV0aW5nLnRpdGxlKXtcbiAgICAgICRzY29wZS5lcnJvciA9IFwiUGxlYXNlIGVudGVyIGEgdGl0bGUuXCI7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgTWVldGluZ0ZhY3RvcnkudXBkYXRlKHtpZDogJHNjb3BlLm1lZXRpbmcuX2lkfSwgJHNjb3BlLm1lZXRpbmcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgJHNjb3BlLnN1Y2Nlc3MgPSBcIk1lZXRpbmcgc2F2ZWQuXCI7XG5cbiAgICAgICAgaWYgKCRzY29wZS50aW1lb3V0KSB7XG4gICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKCRzY29wZS50aW1lb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS50aW1lb3V0ID0gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRzY29wZS5zdWNjZXNzID0gXCJcIjtcbiAgICAgICAgfSwgMzAwMCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuZGVsZXRlTWVldGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBtZWV0aW5nP1wiKSkge1xuICAgICAgTWVldGluZ0ZhY3RvcnkuZGVsZXRlKHtpZDogJHNjb3BlLm1lZXRpbmcuX2lkfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9tZWV0aW5ncy9cIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAkc2NvcGUuZGlzcGxheSA9ICgkc2NvcGUuc2VhcmNoVG9waWMgPyB0cnVlIDogZmFsc2UpO1xuICB9O1xuXG4gICRzY29wZS5hbHJlYWR5SW5NZWV0aW5nRmlsdGVyID0gZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubWVldGluZy50b3BpY3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICgkc2NvcGUubWVldGluZy50b3BpY3NbaV0uX2lkID09PSB0b3BpYy5faWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNyZWF0ZU1lbWJlckNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCBNZW1iZXJGYWN0b3J5KSB7XG4gIFxuICAkc2NvcGUuZm9ybURhdGEgPSB7fTtcbiAgJHNjb3BlLmZvcm1EYXRhLnJvbGVzID0gW107XG4gICRzY29wZS5mb3JtRGF0YS5waG9uZXMgPSBbXTtcblxuICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1lbWJlckRhdGEgPSB0aGlzLmZvcm1EYXRhO1xuXG4gICAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuY3JlYXRlKG1lbWJlckRhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9tZW1iZXIvXCIgKyByZXNwb25zZS5pZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbn0pO1xuIiwicmVxdWlyZSgnLi9tZW1iZXIuanMnKTtcbnJlcXVpcmUoJy4vbGlzdC5qcycpO1xucmVxdWlyZSgnLi9jcmVhdGUuanMnKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIk1lbWJlcnNDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUsIE1lbWJlckZhY3RvcnkpIHtcbiAgJHNjb3BlLnNldFNlYXJjaFJvbGUgPSBmdW5jdGlvbiAocm9sZUlkKSB7XG4gICAgJHNjb3BlLnNlYXJjaFJvbGVzPXJvbGVJZDtcbiAgfTtcblxuICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgJHNjb3BlLm1lbWJlclByZWRpY2F0ZSA9IFwibmFtZVwiO1xuICAgICRzY29wZS5yZXZlcnNlID0gZmFsc2U7XG4gICAgJHNjb3BlLm1lbWJlcnMgPSByZXNwb25zZTtcbiAgfSk7XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTWVtYmVyQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCAkbG9jYXRpb24sIE1lbWJlckZhY3RvcnkpIHtcblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgaWYgKCRyb3V0ZVBhcmFtcy5pZCA9PT0gXCJtZVwiKSB7XG4gICAgJGxvY2F0aW9uLnBhdGgoXCIvbWVtYmVyL1wiICsgJHNjb3BlLm1lLmlkKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAkc2NvcGUubWVtYmVyID0gJHNjb3BlLmZvcm1EYXRhID0gJHNjb3BlLmdldE1lbWJlcigkcm91dGVQYXJhbXMuaWQpO1xuXG4gIE1lbWJlckZhY3RvcnkuTWVtYmVyLmdldCh7aWQ6JHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24ocmVzdWx0KSB7IFxuICAgIGlmKCFyZXN1bHQuZXJyb3IpIHtcbiAgICAgICRzY29wZS5tZW1iZXIgPSAkc2NvcGUuZm9ybURhdGEgPSByZXN1bHQ7XG4gICAgICBnZXRNZW1iZXJTdHVmZigpO1xuICAgIH0gXG4gIH0pO1xuXG4gIGdldE1lbWJlclN0dWZmKCk7XG5cbiAgZnVuY3Rpb24gZ2V0TWVtYmVyU3R1ZmYoKSB7XG4gICAgaWYoJHNjb3BlLmNvbXBhbmllcyAmJiAkc2NvcGUuc3BlYWtlcnMgJiYgJHNjb3BlLmNvbW1lbnRzICYmICRzY29wZS5jb21wYW5pZXMubGVuZ3RoID4gMCAmJiAkc2NvcGUuc3BlYWtlcnMubGVuZ3RoID4gMCAmJiAkc2NvcGUuY29tbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZ2V0TWVtYmVyU3R1ZmYsIDEwMDApO1xuICAgIH1cblxuICAgICRzY29wZS5tZW1iZXIuY29tcGFuaWVzID0gJHNjb3BlLmNvbXBhbmllcy5maWx0ZXIoZnVuY3Rpb24oZSkge1xuICAgICAgcmV0dXJuIGUubWVtYmVyID09ICRzY29wZS5tZW1iZXIuaWQ7XG4gICAgfSlcblxuICAgICRzY29wZS5tZW1iZXIuc3BlYWtlcnMgPSAkc2NvcGUuc3BlYWtlcnMuZmlsdGVyKGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiBlLm1lbWJlciA9PSAkc2NvcGUubWVtYmVyLmlkO1xuICAgIH0pXG5cbiAgICAkc2NvcGUubWVtYmVyLmNvbW1lbnRzID0gJHNjb3BlLmNvbW1lbnRzLmZpbHRlcihmdW5jdGlvbihlKSB7XG4gICAgICByZXR1cm4gZS5tZW1iZXIgPT0gJHNjb3BlLm1lbWJlci5pZDtcbiAgICB9KVxuICB9XG5cblxuICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1lbWJlckRhdGEgPSB0aGlzLmZvcm1EYXRhO1xuXG4gICAgTWVtYmVyRmFjdG9yeS5NZW1iZXIudXBkYXRlKHsgaWQ6bWVtYmVyRGF0YS5pZCB9LCBtZW1iZXJEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLnN1Y2Nlc3M7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignU3BlYWtlckVtYWlsQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsICRsb2NhdGlvbiwgRW1haWxGYWN0b3J5KSB7XG4gICAgJHNjb3BlLmVtYWlsID0gJGxvY2F0aW9uLnNlYXJjaCgpLmVtYWlsO1xuICAgICRzY29wZS5zcGVha2VySWQgPSAkcm91dGVQYXJhbXMuaWQ7XG4gICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuICAgICRzY29wZS5tZXNzYWdlID0gbnVsbDtcblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgICAkc2NvcGUubWVzc2FnZSA9IG51bGw7XG5cbiAgICAgIGNvbnNvbGUubG9nKFwic2VuZCBlbWFpbCB0byBcIiwgJHNjb3BlLmVtYWlsLCBcIiBmcm9tIFwiLCAkc2NvcGUuc3BlYWtlcklkKTtcblxuICAgICAgRW1haWxGYWN0b3J5LlNwZWFrZXIuc2VuZCh7IGlkOiAkc2NvcGUuc3BlYWtlcklkIH0sIHsgZW1haWw6ICRzY29wZS5lbWFpbCB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG4gXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignQ3JlYXRlU3BlYWtlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24sIFNwZWFrZXJGYWN0b3J5KSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNwZWFrZXJEYXRhID0gdGhpcy5mb3JtRGF0YTtcblxuICAgICAgc3BlYWtlckRhdGEuc3RhdHVzID0gJ1N1Z2dlc3Rpb24nO1xuXG4gICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmNyZWF0ZShzcGVha2VyRGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG5cbiAgICAgICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmdldEFsbChmdW5jdGlvbiAoc3BlYWtlcnMpIHtcbiAgICAgICAgICAgICRzY29wZS5zcGVha2VycyA9IHNwZWFrZXJzO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3NwZWFrZXIvXCIgKyByZXNwb25zZS5pZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiU3BlYWtlckVtYmVkQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbiAgJHNjb3BlLm1lID0gSlNPTi5wYXJzZSgkc2NvcGUubWVKc29uKTtcbiAgJHNjb3BlLm1lbWJlcnMgPSBKU09OLnBhcnNlKCRzY29wZS5tZW1iZXJzSnNvbik7XG4gICRzY29wZS5yb2xlcyA9IEpTT04ucGFyc2UoJHNjb3BlLnJvbGVzSnNvbik7XG5cbiAgaWYoJHNjb3BlLmNvbW1lbnRzKSB7XG4gICAgJHNjb3BlLnNwZWFrZXIuY29tbWVudHMgPSAkc2NvcGUuY29tbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiBlLnRocmVhZCA9PSAnc3BlYWtlci0nKyRzY29wZS5zcGVha2VyLmlkO1xuICAgIH0pXG4gIH1cblxuICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgdmFyIG1lbWJlciA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICB9KTtcblxuICAgIGlmKG1lbWJlci5sZW5ndGg+MCkge1xuICAgICAgcmV0dXJuIG1lbWJlclswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogXCJObyBvbmVcIixcbiAgICAgICAgZmFjZWJvb2s6IFwiMTAwMDAwNDU2MzM1OTcyXCJcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcbiAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgIHZhciBzdWZmaXggPSAnYWdvJztcbiAgICBpZihzZWNvbmRzIDwgMCl7XG4gICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICBzdWZmaXggPSAndG8gZ28nO1xuICAgIH1cblxuICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcblxuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgZGF5cyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcbiAgfTtcblxufSk7XG4iLCJyZXF1aXJlKCcuL3NwZWFrZXIuanMnKTtcbnJlcXVpcmUoJy4vbGlzdC5qcycpO1xucmVxdWlyZSgnLi9jcmVhdGUuanMnKTtcbnJlcXVpcmUoJy4vY29uZmlybS5qcycpO1xucmVxdWlyZSgnLi9lbWJlZC5qcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignU3BlYWtlcnNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRzY2UsIFNwZWFrZXJGYWN0b3J5LCBNZW1iZXJGYWN0b3J5KSB7XG4gIFxuICAgICRzY29wZS5saW1pdCA9IDEwO1xuXG4gICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnU2VsZWN0ZWQnLCdBcHByb3ZlZCcsJ0NvbnRhY3RlZCcsJ0luIENvbnZlcnNhdGlvbnMnLCdBY2NlcHRlZCcsJ1JlamVjdGVkJywnR2l2ZSBVcCddO1xuXG4gICAgJHNjb3BlLnNwZWFrZXJQcmVkaWNhdGUgPSAndXBkYXRlZCc7XG4gICAgJHNjb3BlLnJldmVyc2UgPSAndHJ1ZSc7XG4gICAgXG4gICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXRBbGwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5zcGVha2VycyA9IHJlc3BvbnNlO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCRzY29wZS5saW1pdCA8PSAkc2NvcGUuc3BlYWtlcnMubGVuZ3RoKVxuICAgICAgICAkc2NvcGUubGltaXQgKz0gMTA7XG4gICAgfTtcblxuICAgICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgcmV0dXJuIG8uaWQgPT0gJ2RldmVsb3BtZW50LXRlYW0nIHx8IG8uaWQgPT0gJ2Nvb3JkaW5hdGlvbic7XG4gICAgICB9KTtcblxuICAgICAgaWYocm9sZXMubGVuZ3RoID09IDAgJiYgbWVtYmVyLmlkICE9ICRzY29wZS5tZS5pZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICAkc2NvcGUuYWRkU3BlYWtlciA9IGZ1bmN0aW9uKG1lbWJlciwgbmV3U3BlYWtlcikge1xuICAgICAgY29uc29sZS5sb2cobmV3U3BlYWtlcik7XG4gICAgICB2YXIgc3BlYWtlckRhdGEgPSBuZXdTcGVha2VyO1xuICAgICAgXG4gICAgICBpZihuZXdTcGVha2VyLmlkKSB7XG4gICAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIudXBkYXRlKHsgaWQ6IHNwZWFrZXJEYXRhLmlkIH0sIHsgbWVtYmVyOiBtZW1iZXIuaWQgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2Uuc3VjY2VzcztcblxuICAgICAgICAgICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXRBbGwoZnVuY3Rpb24gKHNwZWFrZXJzKSB7XG4gICAgICAgICAgICAgICRzY29wZS5zcGVha2VycyA9IHNwZWFrZXJzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwZWFrZXJEYXRhLnN0YXR1cyA9ICdTZWxlY3RlZCc7XG4gICAgICAgIHNwZWFrZXJEYXRhLm1lbWJlciA9IG1lbWJlci5pZDtcblxuICAgICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmNyZWF0ZShzcGVha2VyRGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcblxuICAgICAgICAgICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXRBbGwoZnVuY3Rpb24gKHNwZWFrZXJzKSB7XG4gICAgICAgICAgICAgICRzY29wZS5zcGVha2VycyA9IHNwZWFrZXJzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbiAgIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignU3BlYWtlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkd2luZG93LCAkcm91dGVQYXJhbXMsICRzY2UsIFNwZWFrZXJGYWN0b3J5LCBNZW1iZXJGYWN0b3J5LCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XG4gICAgJHNjb3BlLnRydXN0U3JjID0gZnVuY3Rpb24oc3JjKSB7XG4gICAgICByZXR1cm4gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoc3JjKycjcGFnZS1ib2R5Jyk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmNvbnZlcnRFbWFpbHMgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICB2YXIgbWFpbEV4cCA9IC9bXFx3XFwuXFwtXStcXEAoW1xcd1xcLV0rXFwuKStbXFx3XXsyLDR9KD8hW148XSo+KS9pZztcbiAgICAgIHZhciB0d2l0dGVyRXhwID0gLyhefFteQFxcd10pQChcXHd7MSwxNX0pXFxiL2c7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKG1haWxFeHAsXCI8YSBocmVmPScjL2NvbXBhbnkvXCIrJHJvdXRlUGFyYW1zLmlkK1wiL2NvbmZpcm0/ZW1haWw9JCYnPiQmPC9hPlwiKS5yZXBsYWNlKHR3aXR0ZXJFeHAsXCIkMTxhIGhyZWY9J2h0dHA6Ly90d2l0dGVyLmNvbS8kMicgdGFyZ2V0PSdfYmxhbmsnPkAkMjwvYT5cIilcbiAgICB9XG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc3BlYWtlckRhdGEgPSB0aGlzLmZvcm1EYXRhO1xuXG4gICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLnVwZGF0ZSh7IGlkOnNwZWFrZXJEYXRhLmlkIH0sIHNwZWFrZXJEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2Uuc3VjY2VzcztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAoc3BlYWtlcikge1xuICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgICAgfSk7XG5cbiAgICAgIGlmKHJvbGVzLmxlbmd0aCA9PSAwICYmIChzcGVha2VyLnN0YXR1cyA9PSAnU3VnZ2VzdGlvbicgfHwgc3BlYWtlci5zdGF0dXMgPT0gJ1NlbGVjdGVkJykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnU2VsZWN0ZWQnLCdBcHByb3ZlZCcsJ0NvbnRhY3RlZCcsJ0luIENvbnZlcnNhdGlvbnMnLCdBY2NlcHRlZCcsJ1JlamVjdGVkJywnR2l2ZSBVcCddO1xuXG4gICAgJHNjb3BlLnNwZWFrZXIgPSAkc2NvcGUuZm9ybURhdGEgPSAkc2NvcGUuZ2V0U3BlYWtlcigkcm91dGVQYXJhbXMuaWQpO1xuXG4gICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXQoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLnNwZWFrZXIgPSAkc2NvcGUuZm9ybURhdGEgPSByZXNwb25zZTtcblxuICAgICAgTm90aWZpY2F0aW9uRmFjdG9yeS5TcGVha2VyLmdldEFsbCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKGdldERhdGEpIHtcbiAgICAgICAgJHNjb3BlLnNwZWFrZXIubm90aWZpY2F0aW9ucyA9IGdldERhdGE7XG5cbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdmFyIHdpbiA9ICR3aW5kb3c7XG4gICAgJHNjb3BlLiR3YXRjaCgnc3BlYWtlckZvcm0uJGRpcnR5JywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmKHZhbHVlKSB7XG4gICAgICAgIHdpbi5vbmJlZm9yZXVubG9hZCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuICdZb3UgaGF2ZSB1bnNhdmVkIGNoYW5nZXMnO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJTdWJzY3JpcHRpb25Db250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUsIFN1YnNjcmlwdGlvbkZhY3RvcnkpIHtcblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgdmFyIHRocmVhZElkID0gJHNjb3BlLnRocmVhZC5zdWJzdHJpbmcoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiLVwiKSArIDEpO1xuICB2YXIgdGhyZWFkS2luZCA9ICRzY29wZS50aHJlYWQuc3BsaXQoJy0nKVswXTtcblxuICB2YXIgRmFjdG9yeTtcblxuICBzd2l0Y2godGhyZWFkS2luZCkge1xuICAgIGNhc2UgJ2NvbXBhbnknOlxuICAgICAgRmFjdG9yeSA9IFN1YnNjcmlwdGlvbkZhY3RvcnkuQ29tcGFueTtcbiAgICBicmVhaztcbiAgICBjYXNlICdzcGVha2VyJzpcbiAgICAgIEZhY3RvcnkgPSBTdWJzY3JpcHRpb25GYWN0b3J5LlNwZWFrZXI7XG4gICAgYnJlYWs7XG4gICAgY2FzZSAndG9waWMnOlxuICAgICAgRmFjdG9yeSA9IFN1YnNjcmlwdGlvbkZhY3RvcnkuVG9waWM7XG4gICAgYnJlYWs7XG4gIH1cblxuICBjb25zb2xlLmxvZygnVEhSRUFEJywgJHNjb3BlLnRocmVhZCwgdGhyZWFkS2luZCwgdGhyZWFkSWQpO1xuICBjb25zb2xlLmxvZygnRkFDVE9SWVlZJywgU3Vic2NyaXB0aW9uRmFjdG9yeS5Db21wYW55LCBTdWJzY3JpcHRpb25GYWN0b3J5LlNwZWFrZXIsIFN1YnNjcmlwdGlvbkZhY3RvcnkuVG9waWMsIEZhY3RvcnkpO1xuXG4gICRzY29wZS5pc1N1YnNjcmliZWQgPSBmYWxzZTtcblxuICAkc2NvcGUuZ2V0U3RhdHVzID0gZnVuY3Rpb24gKCkge1xuICAgIEZhY3RvcnkuZ2V0KHtpZDogdGhyZWFkSWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2coJ1NUQVRVUycscmVzcG9uc2Uuc3VjY2VzcylcbiAgICAgIGlmKHJlc3BvbnNlLnN1Y2Nlc3MgPT0gJ3N1YnNjcmliZWQnKSB7XG4gICAgICAgICRzY29wZS5pc1N1YnNjcmliZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHNjb3BlLmlzU3Vic2NyaWJlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pXG4gIH07XG5cbiAgJHNjb3BlLnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZygnQURERCcsIHRocmVhZEtpbmQsIHRocmVhZElkKTtcbiAgICBGYWN0b3J5LmFkZCh7aWQ6IHRocmVhZElkfSwge30sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuZ2V0U3RhdHVzKCk7XG4gICAgfSlcbiAgfTtcblxuICAkc2NvcGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ0RFTEVURScsIHRocmVhZEtpbmQsIHRocmVhZElkKTtcbiAgICBGYWN0b3J5LnJlbW92ZSh7aWQ6IHRocmVhZElkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5nZXRTdGF0dXMoKTtcbiAgICB9KVxuICB9O1xuXG4gICRzY29wZS5nZXRTdGF0dXMoKTtcbn0pO1xuIiwicmVxdWlyZSgnLi9lbWJlZCcpOyIsInJlcXVpcmUoJy4vbWFuYWdlcicpOyIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiVGFnTWFuYWdlckNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgVGFnRmFjdG9yeSkge1xuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAkc2NvcGUudGFnID0ge307XG5cbiAgJHNjb3BlLmxpZ2h0Q29sb3JzID0gW1wiI2Y3YzZjN1wiLCBcIiNmYWQ4YzdcIiwgXCIjZmVmMmMwXCIsIFwiI2JmZTViZlwiLCBcIiNiZmRhZGNcIiwgXCIjYzdkZWY4XCIsIFwiI2JmZDRmMlwiLCBcIiNkNGM1ZjlcIl07XG4gICRzY29wZS5jb2xvcnMgPSBbXCIjZTExZDIxXCIsIFwiI2ViNjQyMFwiLCBcIiNmYmNhMDRcIiwgXCIjMDA5ODAwXCIsIFwiIzAwNmI3NVwiLCBcIiMyMDdkZTVcIiwgXCIjMDA1MmNjXCIsIFwiIzUzMTllN1wiXTtcblxuICAkc2NvcGUuY2hhbmdlQ29sb3IgPSBmdW5jdGlvbiAoY29sb3IpIHtcbiAgICAkc2NvcGUudGFnLmNvbG9yID0gY29sb3I7XG4gIH07XG5cbiAgJHNjb3BlLmNyZWF0ZVRhZyA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgICBUYWdGYWN0b3J5LlRhZy5jcmVhdGUodGFnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICRzY29wZS50YWdzLnB1c2gocmVzcG9uc2UudGFnKTtcbiAgICAgICAgJHNjb3BlLnRhZyA9IHt9O1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5zYXZlVGFnID0gZnVuY3Rpb24gKHRhZykge1xuICAgIFRhZ0ZhY3RvcnkuVGFnLnVwZGF0ZSh7aWQ6IHRhZy5pZH0sIHRhZywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICB0YWcuZWRpdGluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5kZWxldGVUYWcgPSBmdW5jdGlvbiAodGFnKSB7XG4gICAgVGFnRmFjdG9yeS5UYWcuZGVsZXRlKHtpZDogdGFnLmlkfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAkc2NvcGUudGFncy5zcGxpY2UoJHNjb3BlLnRhZ3MuaW5kZXhPZih0YWcpLCAxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIlRvcGljRW1iZWRDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUsIFRvcGljRmFjdG9yeSwgTm90aWZpY2F0aW9uRmFjdG9yeSkge1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICRzY29wZS5lcnJvciAgICAgICA9IFwiXCI7XG4gICRzY29wZS5zaG93VGFyZ2V0cyA9IGZhbHNlO1xuXG4gICRzY29wZS5wb2xsS2luZHMgPSBbXCJ0ZXh0XCIsIFwiaW1hZ2VzXCJdO1xuXG4gIGlmICgkc2NvcGUuY29tbWVudHMpIHtcbiAgICAkc2NvcGUudG9waWMuY29tbWVudHMgPSAkc2NvcGUuY29tbWVudHMuZmlsdGVyKGZ1bmN0aW9uIChlKSB7XG4gICAgICByZXR1cm4gZS50aHJlYWQgPT0gXCJ0b3BpYy1cIiArICRzY29wZS50b3BpYy5faWQ7XG4gICAgfSk7XG4gIH1cblxuICBzaG93KCRzY29wZS50b3BpYyk7XG5cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUFVWEZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBzaG93KHRvcGljKSB7XG4gICAgdG9waWMuc2hvdyA9IHtcbiAgICAgIHRleHQgICAgIDogdHJ1ZSxcbiAgICAgIHRhcmdldHMgIDogdHJ1ZSxcbiAgICAgIHBvbGwgICAgIDogZmFsc2UsXG4gICAgICBkdWVkYXRlICA6IGZhbHNlLFxuICAgICAgbWVldGluZyAgOiB0cnVlLFxuICAgICAgY2xvc2VkICAgOiBmYWxzZVxuICAgIH07XG5cbiAgICBpZiAodG9waWMua2luZCA9PT0gXCJUbyBkb1wiKSB7XG4gICAgICB0b3BpYy5zaG93LmR1ZWRhdGUgPSB0cnVlO1xuICAgICAgdG9waWMuc2hvdy5jbG9zZWQgID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAodG9waWMua2luZCA9PT0gXCJEZWNpc2lvblwiKSB7XG4gICAgICB0b3BpYy5zaG93LmR1ZWRhdGUgPSB0cnVlO1xuICAgICAgdG9waWMuc2hvdy5jbG9zZWQgID0gdHJ1ZTtcbiAgICAgIHRvcGljLnNob3cucG9sbCA9IHRydWU7XG4gICAgfVxuXG4gICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAodG9waWMpIHtcbiAgICBpZiAoISRzY29wZS5tZS5yb2xlcykgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgIHZhciByb2xlcyA9ICRzY29wZS5tZS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgIH0pO1xuXG4gICAgaWYgKHJvbGVzLmxlbmd0aCA9PSAwICYmIHRvcGljLmF1dGhvciAhPSAkc2NvcGUubWUuaWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLmRlbGV0ZVRvcGljID0gZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgaWYgKGNvbmZpcm0oXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgdG9waWM/XCIpKSB7XG4gICAgICBUb3BpY0ZhY3RvcnkuVG9waWMuZGVsZXRlKHtpZDogdG9waWMuX2lkfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICB0b3BpYy5kZWxldGVkID0gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUudG9nZ2xlVGFnID0gZnVuY3Rpb24gKHRhZykge1xuICAgIHZhciBpbmRleCA9ICRzY29wZS50b3BpYy50YWdzLmluZGV4T2YodGFnKTtcblxuICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgJHNjb3BlLnRvcGljLnRhZ3MucHVzaCh0YWcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICRzY29wZS50b3BpYy50YWdzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5nZXRUYWdJY29uID0gZnVuY3Rpb24gKHRhZykge1xuICAgIHJldHVybiAoJHNjb3BlLnRvcGljLnRhZ3MuaW5kZXhPZih0YWcuaWQpICE9PSAtMSA/IFwiY2hlY2tcIiA6IFwidGltZXNcIik7O1xuICB9O1xuXG4gICRzY29wZS50b2dnbGVUYXJnZXQgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgdmFyIGluZGV4ID0gJHNjb3BlLnRvcGljLnRhcmdldHMuaW5kZXhPZih0YXJnZXQpO1xuXG4gICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAkc2NvcGUudG9waWMudGFyZ2V0cy5wdXNoKHRhcmdldCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgJHNjb3BlLnRvcGljLnRhcmdldHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnRvZ2dsZUFsbFRhcmdldHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUubWVtYmVycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICRzY29wZS50b2dnbGVUYXJnZXQoJHNjb3BlLm1lbWJlcnNbaV0uaWQpO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUudG9nZ2xlUm9sZVRhcmdldHMgPSBmdW5jdGlvbiAocm9sZUlkKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUubWVtYmVycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgIGZvcih2YXIgbyA9IDA7IG8gPCAkc2NvcGUubWVtYmVyc1tpXS5yb2xlcy5sZW5ndGg7IG8rKykge1xuICAgICAgICBpZiAoJHNjb3BlLm1lbWJlcnNbaV0ucm9sZXNbb10uaWQgPT0gcm9sZUlkKSB7XG4gICAgICAgICAgJHNjb3BlLnRvZ2dsZVRhcmdldCgkc2NvcGUubWVtYmVyc1tpXS5pZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnRvZ2dsZVRhcmdldHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLnNob3dUYXJnZXRzID0gISRzY29wZS5zaG93VGFyZ2V0cztcbiAgfTtcblxuICAkc2NvcGUuZ2V0VGFyZ2V0Q29sb3IgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICByZXR1cm4gKCRzY29wZS50b3BpYy50YXJnZXRzLmluZGV4T2YobWVtYmVySWQpICE9PSAtMSA/IFwiYmx1ZVwiIDogXCJcIik7XG4gIH07XG5cbiAgJHNjb3BlLmZvY3VzT3B0aW9uID0gZnVuY3Rpb24gKG9wdGlvbikge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLnRvcGljLnBvbGwub3B0aW9ucy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnNbaV0uZWRpdGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIG9wdGlvbi5lZGl0aW5nID0gdHJ1ZTtcbiAgfTtcblxuICAkc2NvcGUuYWRkT3B0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb24gPSB7XG4gICAgICBvcHRpb25UeXBlOiBcIkluZm9cIixcbiAgICAgIHRhcmdldHM6IFtdXG4gICAgfTtcblxuICAgICRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnMucHVzaChvcHRpb24pO1xuXG4gICAgJHNjb3BlLmZvY3VzT3B0aW9uKG9wdGlvbik7XG4gIH07XG5cbiAgJHNjb3BlLnJlbW92ZU9wdGlvbiA9IGZ1bmN0aW9uIChvcHRpb24pIHtcbiAgICAkc2NvcGUudG9waWMucG9sbC5vcHRpb25zLnNwbGljZSgkc2NvcGUudG9waWMucG9sbC5vcHRpb25zLmluZGV4T2Yob3B0aW9uKSwgMSk7XG4gIH07XG5cbiAgJHNjb3BlLnNlbGVjdE9wdGlvbiA9IGZ1bmN0aW9uICh0b3BpYywgb3B0aW9uKSB7XG4gICAgdmFyIHVwZGF0ZWRUb3BpYyA9IHRvcGljO1xuXG4gICAgaWYgKG9wdGlvbi52b3Rlcy5pbmRleE9mKCRzY29wZS5tZS5pZCkgIT09IC0xKSB7XG4gICAgICB1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zW3VwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnMuaW5kZXhPZihvcHRpb24pXS52b3Rlcy5zcGxpY2UodXBkYXRlZFRvcGljLnBvbGwub3B0aW9uc1t1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zLmluZGV4T2Yob3B0aW9uKV0udm90ZXMuaW5kZXhPZigkc2NvcGUubWUuaWQpLCAxKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zW3VwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnMuaW5kZXhPZihvcHRpb24pXS52b3Rlcy5wdXNoKCRzY29wZS5tZS5pZCk7XG4gICAgfVxuXG4gICAgdXBkYXRlZFRvcGljLl92b3RpbmcgPSB0cnVlO1xuXG4gICAgVG9waWNGYWN0b3J5LlRvcGljLnVwZGF0ZSh7aWQ6IHVwZGF0ZWRUb3BpYy5faWR9LCB1cGRhdGVkVG9waWMsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVGhlcmUgd2FzIGFuIGVycm9yLiBQbGVhc2UgY29udGFjdCB0aGUgRGV2IFRlYW0gYW5kIGdpdmUgdGhlbSB0aGUgZGV0YWlscyBhYm91dCB0aGUgZXJyb3IuXCIpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlLnN1Y2Nlc3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5zYXZlID0gZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgJHNjb3BlLmVycm9yID0gXCJcIjtcblxuICAgIFRvcGljRmFjdG9yeS5Ub3BpYy51cGRhdGUoe2lkOiB0b3BpYy5faWR9LCB0b3BpYywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICB0b3BpYy5lZGl0aW5nID0gIXRvcGljLmVkaXRpbmc7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUucmVhZCA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgIGlmICghJHNjb3BlLm5vdGlmaWNhdGlvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkc2NvcGUubm90aWZpY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiBvLnRocmVhZCA9PT0gXCJ0b3BpYy1cIiArIHRvcGljLl9pZDtcbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcbiAgICAgIHZhciBpbmRleCA9IG5vdGlmaWNhdGlvbi51bnJlYWQuaW5kZXhPZigkc2NvcGUubWUuaWQpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICBub3RpZmljYXRpb24udW5yZWFkLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIE5vdGlmaWNhdGlvbkZhY3RvcnkuTm90aWZpY2F0aW9uLnVwZGF0ZSh7aWQ6IG5vdGlmaWNhdGlvbi5faWR9LCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICB2YXIgbWVtYmVyID0gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICB9KTtcblxuICAgIGlmIChtZW1iZXIgJiYgbWVtYmVyLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBtZW1iZXJbMF07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogXCJObyBvbmVcIixcbiAgICAgICAgZmFjZWJvb2s6IFwiMTAwMDAwNDU2MzM1OTcyXCJcbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5nZXRVbnJlYWROb3RpZmljYXRpb25zID0gZnVuY3Rpb24gKHRocmVhZCkge1xuICAgIHZhciBub3RpZmljYXRpb25zID0gJHNjb3BlLm5vdGlmaWNhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLnRocmVhZCA9PSB0aHJlYWQgJiYgby51bnJlYWQuaW5kZXhPZigkc2NvcGUubWUuaWQpICE9IC0xO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5vdGlmaWNhdGlvbnM7XG4gIH07XG5cbiAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcbiAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgIHZhciBzdWZmaXggPSBcImFnb1wiO1xuICAgIGlmIChzZWNvbmRzIDwgMCl7XG4gICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICBzdWZmaXggPSBcInRvIGdvXCI7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG4gICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgICByZXR1cm4gbmV3IERhdGUodGltZSkudG9VVENTdHJpbmcoKTtcbiAgfTtcblxufSk7XG4iLCJyZXF1aXJlKCcuL2xpc3QnKTtcbnJlcXVpcmUoJy4vdG9waWMnKTtcbnJlcXVpcmUoJy4vZW1iZWQnKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiVG9waWNzQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcywgVG9waWNGYWN0b3J5KSB7XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUlOSVRJQUxJWkFUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgJHNjb3BlLmtpbmRzID0gW1wiSW5mb1wiLCBcIlRvIGRvXCIsIFwiRGVjaXNpb25cIiwgXCJJZGVhXCJdO1xuXG4gICRzY29wZS5zZWFyY2hUb3BpY3MgPSB7fTtcblxuICBUb3BpY0ZhY3RvcnkuVG9waWMuZ2V0QWxsKGdvdFRvcGljcyk7XG5cbiAgZnVuY3Rpb24gZ290VG9waWNzICh0b3BpY3MpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgkc2NvcGUubG9hZGluZykge1xuICAgICAgICBnb3RUb3BpY3ModG9waWNzKTtcbiAgICAgIH1cbiAgICB9LCAxMDAwKTtcblxuICAgICRzY29wZS50b3BpY3MgPSB0b3BpY3M7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS50b3BpY3MubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAkc2NvcGUudG9waWNzW2ldLmZhY2Vib29rID0gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgICAgIHJldHVybiAkc2NvcGUudG9waWNzW2ldLmF1dGhvciA9PT0gby5pZDtcbiAgICAgIH0pWzBdLmZhY2Vib29rO1xuICAgIH1cblxuICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gIH1cblxuICAkc2NvcGUuc2hvd09wZW4gPSB0cnVlO1xuICAkc2NvcGUubGltaXQgPSA2O1xuXG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLnRpbWUgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuICRzY29wZS50aW1lU2luY2UobmV3IERhdGUoZGF0ZSkpO1xuICB9O1xuXG4gICRzY29wZS5jcmVhdGVUb3BpYyA9IGZ1bmN0aW9uKGtpbmQpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgVG9waWNGYWN0b3J5LlRvcGljLmNyZWF0ZSh7XG4gICAgICBhdXRob3I6ICRzY29wZS5tZS5pZCxcbiAgICAgIGtpbmQ6IGtpbmQsXG4gICAgICB0YWdzOiBbJHNjb3BlLnNlYXJjaFRvcGljcy50YWdzXVxuICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgVG9waWNGYWN0b3J5LlRvcGljLmdldEFsbChmdW5jdGlvbiAodG9waWNzKSB7XG4gICAgICAgICAgJHNjb3BlLnRvcGljcyA9IHRvcGljcztcbiAgICAgICAgICAkc2NvcGUudG9waWNzLmZpbHRlcihmdW5jdGlvbiAobykge1xuICAgICAgICAgICAgcmV0dXJuIG8uX2lkID09IHJlc3BvbnNlLmlkO1xuICAgICAgICAgIH0pWzBdLmVkaXRpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuY291bnQgPSBmdW5jdGlvbiAob3Blbikge1xuICAgIHJldHVybiAkc2NvcGUudG9waWNzLmZpbHRlcihmdW5jdGlvbiAobykge1xuICAgICAgcmV0dXJuIChvcGVuID8gIW8uY2xvc2VkIDogby5jbG9zZWQpO1xuICAgIH0pLmxlbmd0aDtcbiAgfTtcblxuICAkc2NvcGUuc2hvd25Ub3BpY3MgPSBmdW5jdGlvbiAob3Blbikge1xuICAgIHJldHVybiAkc2NvcGUudG9waWNzLmZpbHRlcihmdW5jdGlvbiAobykge1xuICAgICAgcmV0dXJuIG8uZWRpdGluZyB8fCAob3BlbiA/ICFvLmNsb3NlZCA6IG8uY2xvc2VkKSAmJiAoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJHNjb3BlLnNlYXJjaFRvcGljcy50YWdzICYmIG8udGFncy5pbmRleE9mKCRzY29wZS5zZWFyY2hUb3BpY3MudGFncykgPT09IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICgkc2NvcGUuc2VhcmNoVG9waWNzLnRhcmdldCAmJiBvLnRhcmdldHMuaW5kZXhPZigkc2NvcGUuc2VhcmNoVG9waWNzLnRhcmdldCkgPT09IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICgkc2NvcGUuc2VhcmNoVG9waWNzLmtpbmQgJiYgby5raW5kICE9PSAkc2NvcGUuc2VhcmNoVG9waWNzLmtpbmQpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9KCkpO1xuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5zY3JvbGwgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoJHNjb3BlLmxpbWl0IDwgJHNjb3BlLnRvcGljcy5sZW5ndGgpXG4gICAgICAkc2NvcGUubGltaXQgKz0gMztcbiAgfTtcblxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoJ1RvcGljQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uLCAkd2luZG93LCBUb3BpY0ZhY3RvcnksIE5vdGlmaWNhdGlvbkZhY3RvcnkpIHtcblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgVG9waWNGYWN0b3J5LlRvcGljLmdldCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICRzY29wZS50b3BpYyA9IHJlc3VsdDtcblxuICAgICRzY29wZS50b3BpYy5zaG93Q29tbWVudHMgPSB0cnVlO1xuXG4gICAgTm90aWZpY2F0aW9uRmFjdG9yeS5Ub3BpYy5nZXRBbGwoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihnZXREYXRhKSB7XG4gICAgICAkc2NvcGUudG9waWMubm90aWZpY2F0aW9ucyA9IGdldERhdGE7XG5cbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgfSk7XG4gIH0pO1xuXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgnY29tbWVudEFyZWEnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbW1lbnQvYXJlYS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDb21tZW50QXJlYUNvbnRyb2xsZXInLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgdGhyZWFkOiAnQCdcbiAgICAgIH1cbiAgICB9O1xuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgnZmlyc3RDb21tZW50JywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21tZW50L2ZpcnN0Lmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0ZpcnN0Q29tbWVudENvbnRyb2xsZXInLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgdGhyZWFkOiAnQCdcbiAgICAgIH1cbiAgICB9O1xuICB9KSIsInJlcXVpcmUoJy4vYXJlYScpO1xucmVxdWlyZSgnLi9maXJzdCcpOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgnY29tbXVuaWNhdGlvbkFyZWEnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbW11bmljYXRpb24vYXJlYS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDb21tdW5pY2F0aW9uQXJlYUNvbnRyb2xsZXInLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgdGhyZWFkOiAnQCcsXG4gICAgICAgIG1lbWJlcnNKc29uOiAnQG1lbWJlcnMnLFxuICAgICAgICBtZUpzb246ICdAbWUnLFxuICAgICAgICByb2xlc0pzb246ICdAcm9sZXMnXG4gICAgICB9XG4gICAgfTtcbiAgfSkiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoJ2NvbW11bmljYXRpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbW11bmljYXRpb24vY29tbXVuaWNhdGlvbi5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDb21tdW5pY2F0aW9uRW1iZWRDb250cm9sbGVyJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIGNvbW11bmljYXRpb25Kc29uOiAnQGNvbW11bmljYXRpb25PYmplY3QnLFxuICAgICAgICBtZW1iZXJzSnNvbjogJ0BtZW1iZXJzJyxcbiAgICAgICAgbWVKc29uOiAnQG1lJyxcbiAgICAgICAgcm9sZXNKc29uOiAnQHJvbGVzJ1xuICAgICAgfVxuICAgIH07XG4gIH0pIiwicmVxdWlyZSgnLi9hcmVhJyk7XG5yZXF1aXJlKCcuL2NvbW11bmljYXRpb24nKTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoJ2NvbXBhbnknLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBhbnkvY29tcGFueS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW55RW1iZWRDb250cm9sbGVyJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIGNvbXBhbnk6ICc9Y29tcGFueU9iamVjdCcsXG4gICAgICAgIG1lbWJlcnNKc29uOiAnQG1lbWJlcnMnLFxuICAgICAgICBtZUpzb246ICdAbWUnLFxuICAgICAgICByb2xlc0pzb246ICdAcm9sZXMnLFxuICAgICAgICBjb21tZW50czogJz1jb21tZW50c0FycmF5J1xuICAgICAgfVxuICAgIH07XG4gIH0pXG4iLCJyZXF1aXJlKCcuL2NvbXBhbnknKSIsInJlcXVpcmUoJy4vaW5wdXQnKSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZShcbiAgICAnZGF0ZUlucHV0JyxcbiAgICBmdW5jdGlvbihkYXRlRmlsdGVyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxpbnB1dCB0eXBlPVwiZGF0ZVwiPjwvaW5wdXQ+JyxcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxtLCBhdHRycywgbmdNb2RlbEN0cmwpIHtcbiAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kZm9ybWF0dGVycy51bnNoaWZ0KGZ1bmN0aW9uIChtb2RlbFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlRmlsdGVyKG1vZGVsVmFsdWUsICd5eXl5LU1NLWRkJyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kcGFyc2Vycy51bnNoaWZ0KGZ1bmN0aW9uKHZpZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUodmlld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gIH0pIiwidGhlVG9vbERpcmVjdGl2ZXMgPSBhbmd1bGFyLm1vZHVsZShcInRoZVRvb2wuZGlyZWN0aXZlc1wiLCBbXSk7XG5cbnJlcXVpcmUoXCIuL2NvbW1lbnRcIik7XG5yZXF1aXJlKFwiLi9jb21tdW5pY2F0aW9uXCIpO1xucmVxdWlyZShcIi4vY29tcGFueVwiKTtcbnJlcXVpcmUoXCIuL2RhdGVcIik7XG5yZXF1aXJlKFwiLi9tYXJrZG93blwiKTtcbnJlcXVpcmUoXCIuL21lZXRpbmdcIik7XG5yZXF1aXJlKFwiLi9zcGVha2VyXCIpO1xucmVxdWlyZShcIi4vdGFnXCIpO1xucmVxdWlyZShcIi4vdG9waWNcIik7XG5yZXF1aXJlKFwiLi9zY3JvbGxcIik7XG5yZXF1aXJlKFwiLi9zdWJzY3JpcHRpb25cIik7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdjb21waWxlJywgWyckY29tcGlsZScsIGZ1bmN0aW9uICgkY29tcGlsZSkge1xuICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgc2NvcGUuJHdhdGNoKFxuICAgICAgICAgIGZ1bmN0aW9uKHNjb3BlKSB7XG4gICAgICAgICAgICAgLy8gd2F0Y2ggdGhlICdjb21waWxlJyBleHByZXNzaW9uIGZvciBjaGFuZ2VzXG4gICAgICAgICAgICByZXR1cm4gc2NvcGUuJGV2YWwoYXR0cnMuY29tcGlsZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgLy8gd2hlbiB0aGUgJ2NvbXBpbGUnIGV4cHJlc3Npb24gY2hhbmdlc1xuICAgICAgICAgICAgLy8gYXNzaWduIGl0IGludG8gdGhlIGN1cnJlbnQgRE9NXG4gICAgICAgICAgICBlbGVtZW50Lmh0bWwodmFsdWUpO1xuXG4gICAgICAgICAgICAvLyBjb21waWxlIHRoZSBuZXcgRE9NIGFuZCBsaW5rIGl0IHRvIHRoZSBjdXJyZW50XG4gICAgICAgICAgICAvLyBzY29wZS5cbiAgICAgICAgICAgIC8vIE5PVEU6IHdlIG9ubHkgY29tcGlsZSAuY2hpbGROb2RlcyBzbyB0aGF0XG4gICAgICAgICAgICAvLyB3ZSBkb24ndCBnZXQgaW50byBpbmZpbml0ZSBsb29wIGNvbXBpbGluZyBvdXJzZWx2ZXNcbiAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoc2NvcGUpO1xuICAgICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICB9XSkiLCJyZXF1aXJlKCcuL2NvbXBpbGUnKTtcbnJlcXVpcmUoJy4vbWFya2Rvd24nKTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoJ21hcmtkb3duJywgWyckY29tcGlsZScsIGZ1bmN0aW9uICgkY29tcGlsZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIHZhciBodG1sVGV4dCA9IG1hcmtkb3duLnRvSFRNTChlbGVtZW50LnRleHQoKSk7XG4gICAgICAgICAgICBlbGVtZW50Lmh0bWwoaHRtbFRleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykpO1xuICAgICAgICB9XG4gICAgfTtcbiAgfV0pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xEaXJlY3RpdmVzLmRpcmVjdGl2ZShcImVtYmVkTWVldGluZ1wiLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy9lbWJlZC5odG1sXCIsXG4gICAgY29udHJvbGxlcjogXCJNZWV0aW5nRW1iZWRDb250cm9sbGVyXCIsXG4gICAgc2NvcGU6IHtcbiAgICAgIG1lZXRpbmdJZDogXCI9XCIsXG4gICAgICBtZW1iZXJzOiBcIj1cIlxuICAgIH1cbiAgfTtcbn0pO1xuIiwicmVxdWlyZShcIi4vZW1iZWRcIik7XG4iLCJyZXF1aXJlKFwiLi9wb3NpdGlvbi5qc1wiKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbERpcmVjdGl2ZXMuZGlyZWN0aXZlKFwic2Nyb2xsUG9zaXRpb25cIiwgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHNjb3BlOiB7XG4gICAgICBzY3JvbGw6ICc9c2Nyb2xsUG9zaXRpb24nXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbSwgYXR0cnMpIHtcbiAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNjb3BlLnNjcm9sbCA9IGVsZW0uc2Nyb2xsVG9wKCk7XG4gICAgICB9XG4gICAgICBlbGVtLm9uKCdzY3JvbGwnLCBzY29wZS4kYXBwbHkuYmluZChzY29wZSwgaGFuZGxlcikpO1xuICAgICAgaGFuZGxlcigpO1xuICAgIH1cbiAgfTtcbn0pOyIsInJlcXVpcmUoJy4vc3BlYWtlcicpOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgnc3BlYWtlcicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3Mvc3BlYWtlci9zcGVha2VyLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1NwZWFrZXJFbWJlZENvbnRyb2xsZXInLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgc3BlYWtlcjogJz1zcGVha2VyT2JqZWN0JyxcbiAgICAgICAgbWVtYmVyc0pzb246ICdAbWVtYmVycycsXG4gICAgICAgIG1lSnNvbjogJ0BtZScsXG4gICAgICAgIHJvbGVzSnNvbjogJ0Byb2xlcycsXG4gICAgICAgIGNvbW1lbnRzOiAnPWNvbW1lbnRzQXJyYXknXG4gICAgICB9XG4gICAgfTtcbiAgfSlcbiIsInJlcXVpcmUoJy4vc3Vic2NyaXB0aW9uJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdzdWJzY3JpcHRpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3N1YnNjcmlwdGlvbi9idXR0b24uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnU3Vic2NyaXB0aW9uQ29udHJvbGxlcicsXG4gICAgICBzY29wZToge1xuICAgICAgICB0aHJlYWQ6ICdAJ1xuICAgICAgfVxuICAgIH07XG4gIH0pIiwiYXJndW1lbnRzWzRdWzQxXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cykiLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZShcInRhZ01hbmFnZXJcIiwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogXCJFXCIsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdGFnL21hbmFnZXIuaHRtbFwiLFxuICAgICAgY29udHJvbGxlcjogXCJUYWdNYW5hZ2VyQ29udHJvbGxlclwiLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgdGFnczogXCI9dGFnc0FycmF5XCIsXG4gICAgICAgIHNlYXJjaDogXCI9XCJcbiAgICAgIH1cbiAgICB9O1xuICB9KVxuIiwicmVxdWlyZShcIi4vdG9waWNcIik7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbERpcmVjdGl2ZXMuZGlyZWN0aXZlKFwidG9waWNcIiwgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiBcIkVcIixcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3RvcGljL3RvcGljLmh0bWxcIixcbiAgICBjb250cm9sbGVyOiBcIlRvcGljRW1iZWRDb250cm9sbGVyXCIsXG4gICAgc2NvcGU6IHtcbiAgICAgIHRvcGljOiBcIj1cIixcbiAgICAgIG1lbWJlcnM6IFwiPVwiLFxuICAgICAgbWU6IFwiPVwiLFxuICAgICAgcm9sZXM6IFwiPVwiLFxuICAgICAgdGFnczogXCI9XCIsXG4gICAgICBjb21tZW50czogXCI9XCIsXG4gICAgICBub3RpZmljYXRpb25zOiBcIj1cIlxuICAgIH1cbiAgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5maWx0ZXJzJywgW10pXG4gIC5maWx0ZXIoJ2ludGVycG9sYXRlJywgWyd2ZXJzaW9uJywgZnVuY3Rpb24odmVyc2lvbikge1xuICAgIHJldHVybiBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nKHRleHQpLnJlcGxhY2UoL1xcJVZFUlNJT05cXCUvbWcsIHZlcnNpb24pO1xuICAgIH1cbiAgfV0pXG4gIC5maWx0ZXIoJ2ZpbHRlclJvbGUnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obWVtYmVycywgcm9sZSkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSBtZW1iZXJzO1xuICAgICAgICAgIGlmKHJvbGUpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IG1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG0ucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gci5pZCA9PSByb2xlO1xuICAgICAgICAgICAgICB9KS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuICB9KTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnQ2hhdEZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIENoYXQ6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NoYXQvOmlkJywgbnVsbCwge1xuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9XG4gICAgICB9KSxcbiAgICAgIE1lc3NhZ2U6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NoYXQvOmlkL21lc3NhZ2VzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsaXNBcnJheTp0cnVlfVxuICAgICAgfSlcbiAgICB9XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ0NvbW1lbnRGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBDb21tZW50OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21tZW50LzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgQ29tcGFueTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tcGFueS86aWQvY29tbWVudHMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgU3BlYWtlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvc3BlYWtlci86aWQvY29tbWVudHMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgVG9waWM6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3RvcGljLzppZC9jb21tZW50cycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSlcbiAgICB9XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ0NvbW11bmljYXRpb25GYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBDb21tdW5pY2F0aW9uOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21tdW5pY2F0aW9uLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ30sXG4gICAgICAgICdhcHByb3ZlJzoge21ldGhvZDogJ1BPU1QnfVxuICAgICAgfSksXG4gICAgICBDb21wYW55OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21wYW55LzppZC9jb21tdW5pY2F0aW9ucycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSksXG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9zcGVha2VyLzppZC9jb21tdW5pY2F0aW9ucycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSlcbiAgICB9O1xuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdDb21wYW55RmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgQ29tcGFueTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tcGFueS86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9tZW1iZXIvOmlkL2NvbXBhbmllcycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9XG4gICAgICB9KVxuICAgIH07XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ0VtYWlsRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgQ29tcGFueTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tcGFueS86aWQvc2VuZEluaXRpYWxFbWFpbCcsIG51bGwsIHtcbiAgICAgICAgJ3NlbmQnOiB7bWV0aG9kOiAnUE9TVCd9XG4gICAgICB9KSxcbiAgICAgIFNwZWFrZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3NwZWFrZXIvOmlkL3NlbmRJbml0aWFsRW1haWwnLCBudWxsLCB7XG4gICAgICAgICdzZW5kJzoge21ldGhvZDogJ1BPU1QnfVxuICAgICAgfSlcbiAgICB9XG4gIH0pIiwidGhlVG9vbFNlcnZpY2VzID0gYW5ndWxhci5tb2R1bGUoJ3RoZVRvb2wuc2VydmljZXMnLCBbJ25nUmVzb3VyY2UnXSk7XG5cbnJlcXVpcmUoJy4vY2hhdCcpO1xucmVxdWlyZSgnLi9jb21tZW50Jyk7XG5yZXF1aXJlKCcuL2NvbW11bmljYXRpb24nKTtcbnJlcXVpcmUoJy4vY29tcGFueScpO1xucmVxdWlyZSgnLi9lbWFpbCcpO1xucmVxdWlyZSgnLi9tZWV0aW5nJyk7XG5yZXF1aXJlKCcuL21lbWJlcicpO1xucmVxdWlyZSgnLi9tZXNzYWdlJyk7XG5yZXF1aXJlKCcuL25vdGlmaWNhdGlvbicpO1xucmVxdWlyZSgnLi9yb2xlJyk7XG5yZXF1aXJlKCcuL3Nlc3Npb24nKTtcbnJlcXVpcmUoJy4vc29ja2V0Jyk7XG5yZXF1aXJlKCcuL3NwZWFrZXInKTtcbnJlcXVpcmUoJy4vc3Vic2NyaXB0aW9uJyk7XG5yZXF1aXJlKCcuL3RhZycpO1xucmVxdWlyZSgnLi90b3BpYycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ01lZXRpbmdGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9tZWV0aW5nLzppZCcsIG51bGwsIHtcbiAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgfSk7XG4gIH0pXG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnTWVtYmVyRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9tZW1iZXIvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6dHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KSxcbiAgICAgIFJvbGU6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3JvbGUvOmlkL21lbWJlcnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgTWU6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL215c2VsZicsIG51bGwsIHtcbiAgICAgICAgJ2dldCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiBmYWxzZX1cbiAgICAgIH0pXG4gICAgfTtcbiAgfSkiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnTWVzc2FnZUZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL21lc3NhZ2UvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzogICAge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KVxuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzLmZhY3RvcnkoJ05vdGlmaWNhdGlvbkZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gIHJldHVybiB7XG4gICAgTm90aWZpY2F0aW9uOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9ub3RpZmljYXRpb24vOmlkJywgbnVsbCwge1xuICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ31cbiAgICB9KSxcbiAgICBDb21wYW55OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21wYW55LzppZC9ub3RpZmljYXRpb25zJywgbnVsbCwge1xuICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgIH0pLFxuICAgIFNwZWFrZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3NwZWFrZXIvOmlkL25vdGlmaWNhdGlvbnMnLCBudWxsLCB7XG4gICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgfSksXG4gICAgVG9waWM6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3RvcGljLzppZC9ub3RpZmljYXRpb25zJywgbnVsbCwge1xuICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgIH0pXG4gIH07XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdSb2xlRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgUm9sZTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvcm9sZS86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICB9KSxcbiAgICAgIE1lbWJlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvcm9sZS86aWQvbWVtYmVycycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSlcbiAgICB9O1xuICB9KVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ1Nlc3Npb25GYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBTZXNzaW9uOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9zZXNzaW9uLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgQ29tcGFueTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tcGFueS86aWQvc2Vzc2lvbnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgU3BlYWtlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvc3BlYWtlci86aWQvc2Vzc2lvbnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gICAgfVxuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdTb2NrZXRGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSwgJGxvY2F0aW9uLCAkcm9vdFNjb3BlKSB7XG4gICAgdmFyIHNvY2tldDtcbiAgICByZXR1cm4ge1xuICAgICAgY29ubmVjdDogZnVuY3Rpb24obnNwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHNvY2tldCk7XG4gICAgICAgIHNvY2tldCA9IGlvLmNvbm5lY3QobnNwLCB7bXVsdGlwbGV4OiBmYWxzZX0pO1xuICAgICAgfSxcbiAgICAgIG9uOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBzb2NrZXQub24oZXZlbnROYW1lLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoc29ja2V0LCBhcmdzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZW1pdDogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgc29ja2V0LmVtaXQoZXZlbnROYW1lLCBkYXRhLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHNvY2tldCwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGRpc2Nvbm5lY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc29ja2V0LmRpc2Nvbm5lY3QoKTtcbiAgICAgIH0sXG4gICAgICBzb2NrZXQ6IHNvY2tldFxuICAgIH07XG4gIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ1NwZWFrZXJGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9zcGVha2VyLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9LFxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfSksXG4gICAgICBNZW1iZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL21lbWJlci86aWQvc3BlYWtlcnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfVxuICAgICAgfSlcbiAgICB9O1xuICB9KSIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sU2VydmljZXMuZmFjdG9yeShcIlN1YnNjcmlwdGlvbkZhY3RvcnlcIiwgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICByZXR1cm4ge1xuICAgIENvbXBhbnk6ICRyZXNvdXJjZSh1cmxfcHJlZml4ICsgXCIvYXBpL2NvbXBhbnkvOmlkL3N1YnNjcmlwdGlvblwiLCBudWxsLCB7XG4gICAgICBcImdldFwiOiB7bWV0aG9kOiBcIkdFVFwifSxcbiAgICAgIFwiYWRkXCI6IHttZXRob2Q6IFwiUE9TVFwifSxcbiAgICAgIFwicmVtb3ZlXCI6IHttZXRob2Q6IFwiREVMRVRFXCJ9XG4gICAgfSksXG4gICAgU3BlYWtlcjogJHJlc291cmNlKHVybF9wcmVmaXggKyBcIi9hcGkvc3BlYWtlci86aWQvc3Vic2NyaXB0aW9uXCIsIG51bGwsIHtcbiAgICAgIFwiZ2V0XCI6IHttZXRob2Q6IFwiR0VUXCJ9LFxuICAgICAgXCJhZGRcIjoge21ldGhvZDogXCJQT1NUXCJ9LFxuICAgICAgXCJyZW1vdmVcIjoge21ldGhvZDogXCJERUxFVEVcIn1cbiAgICB9KSxcbiAgICBUb3BpYzogJHJlc291cmNlKHVybF9wcmVmaXggKyBcIi9hcGkvdG9waWMvOmlkL3N1YnNjcmlwdGlvblwiLCBudWxsLCB7XG4gICAgICBcImdldFwiOiB7bWV0aG9kOiBcIkdFVFwifSxcbiAgICAgIFwiYWRkXCI6IHttZXRob2Q6IFwiUE9TVFwifSxcbiAgICAgIFwicmVtb3ZlXCI6IHttZXRob2Q6IFwiREVMRVRFXCJ9XG4gICAgfSlcbiAgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ1RhZ0ZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFRhZzogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvdGFnLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgVG9waWM6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3RhZy86aWQvdG9waWNzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KVxuICAgIH07XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ1RvcGljRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgVG9waWM6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3RvcGljLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9tZW1iZXIvOmlkL3RvcGljcycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHsgbWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZSB9XG4gICAgICB9KVxuICAgIH07XG4gIH0pXG4iLCJ1cmxfcHJlZml4ID0gcmVxdWlyZSgnLi8uLi8uLi9jb25maWcnKS51cmw7XG5cbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9hcHAuanMnKTtcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9jb250cm9sbGVycycpO1xucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMnKTtcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9maWx0ZXJzJyk7XG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvc2VydmljZXMnKTsiLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwidXJsXCI6IFwiaHR0cHM6Ly90b29sLmJhbmFuYW1hcmtldC5ldVwiLFxuICBcImVtYWlsXCIgOiB7XG4gICAgXCJ1c2VyXCI6IFwidGhldG9vbHNpbmZvXCIsXG4gICAgXCJwYXNzd29yZFwiOiBcImRldnRlYW1mdHdcIixcbiAgICBcImhvc3RcIjogXCJzbXRwLmdtYWlsLmNvbVwiLFxuICAgIFwic3NsXCI6IHRydWVcbiAgfSxcbiAgXCJtYWlsZ3VuXCI6IHtcbiAgICBcImFwaVwiOiBcImtleS03am0xYzAwOWV6anY4NXBrbTFycWZ4ZXZ1ZmVvdmI0M1wiLFxuICAgIFwicHVibGljLWFwaVwiOiBcInB1YmtleS0wYmx2NmRyczYzNzQ1b3hydTNpdHZmZzF1cnA2NjJ5OFwiXG4gIH0sXG4gIFwiY29va2llXCI6IHtcbiAgICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICAgIFwicGFzc3dvcmRcIjogXCI0NG9KMUVvUDBmUjVCS29BbXRERDZDMW1DWnpIVEZZcTlMRHh0MEVnYVJRRkVQNmprRWl4MVhhNTFXcTU5MW5WT1E1ZDNYQWpaV3pJS2xFWUZaZjVWN1JyNTJpbEtQSHhjWkVEdnVwRW9QWTRKRzByZXlZU0tIUjIwNTZWRE12RFVGQ0gyc241NXVOQUtnR2hXZlFyT3RuSWV4Zk82M2ZlQ1lTZGN4R2NkQ0daejg2dlQzYmZKQ2JOWmdGZ1ZJa1RnMmdtM1lGVXh6emdVbURxa2lOZnYyblFjVmZOYVFQMFVhbkViTEtpRWVkcTVvMUI2V3pMWU52YzM3ZXljTXNCXCJcbiAgfSxcbiAgXCJmYWNlYm9va1wiOiB7XG4gICAgXCJhcHBJZFwiOiBcIjQ1NzIwNzUwNzc0NDE1OVwiLFxuICAgIFwiYXBwU2VjcmV0XCI6IFwiOWYwMjdjNTJlMDBiYzNhZGJhYmNkOTI2YTNjOTViOTdcIlxuICB9XG59Il19
