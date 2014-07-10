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

theToolController.factory('AuthInterceptor', function ($location, $window) {
  return {
    responseError: function (response) {
      if (response.status === 401) {
        if($location.path().indexOf('/login') == -1) {
          $location.path('/login');
        }
      }
    }
  };
});

},{}],4:[function(require,module,exports){
"use strict";

var facebookConfig = require('./../../../../../config').facebook;

theToolController.controller("LoginController", function ($scope, $routeParams, $location, $http, $window) {

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
          $window.location.assign('/');
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

},{"./../../../../../config":83}],5:[function(require,module,exports){
'use strict';

theToolController.controller('ChatController', function ($rootScope, $scope, $http, $routeParams, $sce, ngAudio, SocketFactory, MessageFactory, ChatFactory, MemberFactory) {

  $scope.error = {};

  $scope.loading  = true;
  $scope.messages = [];
  $scope.online   = [];

  console.log("Connecting");

  if(SocketFactory.socket){
    console.log();
  }
  SocketFactory.connect('/chat');

  /*setTimeout(function(){
    if(!SocketFactory.socket.connected){
      SocketFactory.connect('/chat');
    }
  }, 3000);*/

  SocketFactory.on('connected', function (message) {
    SocketFactory.emit('auth', {id: $routeParams.id, user: $scope.me.id}, function () {
      console.log('Auth success');
    });
  });

  SocketFactory.on('validation', function (result){
    console.log(result);
    if(!result.err){
      $scope.chat     = result.chatData;
      $scope.messages = result.messages;
      $scope.room     = result.room;

      for(var i = 0; i < $scope.chat.members.length; i++){
        $scope.online.push({member: $scope.chat.members[i], on: false});
        if(result.online.indexOf($scope.chat.members[i]) != -1){
          $scope.online[i].on = true;
        }
        $scope.online[i].name = $scope.getMember($scope.online[i].member).name;
      }
      console.log($scope.online);

    }
    else{
      console.log(result.message);
    }
    $scope.loading  = false;
  });

  SocketFactory.on('user:connected', function (data) {
    console.log("User connected: " + data.id);
    for(var i = 0; i < $scope.online.length; i++){
      if($scope.online[i].member === data.id){
        $scope.online[i].on = true;
        break;
      }
    }
  });

  SocketFactory.on('user:disconnected', function (data) {
    console.log("User connected: " + data.id);
    for(var i = 0; i < $scope.online.length; i++){
      if($scope.online[i].member === data.id){
        $scope.online[i].on = false;
        break;
      }
    }
  });

  SocketFactory.on('message', function (message) {
    console.log(message.date);
    $scope.messages.push(message);

    if(message.member != me.id) {
      ngAudio.play("audio/message.mp3");
    }
  });

  $scope.$on('$locationChangeStart', function(){
    console.log("On location change");
    console.log(SocketFactory);
    SocketFactory.disconnect();
    delete SocketFactory.socket;
  });

  $scope.submit = function() {
    if ($scope.text == ""){
      //$scope.empty = true;
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
require('./area.js');

},{"./area.js":8}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
require('./area.js');
require('./list.js');
require('./embed.js');

},{"./area.js":10,"./embed.js":11,"./list.js":13}],13:[function(require,module,exports){
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


},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
require('./company.js');
require('./list.js');
require('./create.js');
require('./confirm.js');
require('./embed.js');
},{"./company.js":14,"./confirm.js":15,"./create.js":16,"./embed.js":17,"./list.js":19}],19:[function(require,module,exports){
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
  
    $scope.limit = 10;

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
        $scope.limit += 10;
    };
  });
  
},{}],20:[function(require,module,exports){
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

},{"./auth":2,"./chat":6,"./comment":9,"./communication":12,"./company":18,"./main":22,"./meeting":25,"./member":29,"./speaker":35,"./tag":38,"./topic":41}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
require('./main.js');
require('./home.js');

},{"./home.js":21,"./main.js":23}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
require("./embed");
require("./list");
require("./meeting");

},{"./embed":24,"./list":26,"./meeting":27}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
require('./member.js');
require('./list.js');
require('./create.js');
},{"./create.js":28,"./list.js":30,"./member.js":31}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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
},{}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
require('./speaker.js');
require('./list.js');
require('./create.js');
require('./confirm.js');
require('./embed.js');

},{"./confirm.js":32,"./create.js":33,"./embed.js":34,"./list.js":36,"./speaker.js":37}],36:[function(require,module,exports){
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
  });
  
},{}],37:[function(require,module,exports){
'use strict';

theToolController
  .controller('SpeakerController', function ($scope, $http, $routeParams, $sce, SpeakerFactory, MemberFactory, NotificationFactory) {
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

  });

},{}],38:[function(require,module,exports){
require('./manager');
},{"./manager":39}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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
    if(!$scope.me.roles) { return false; }

    var roles = $scope.me.roles.filter(function(o) {
      return o.id == 'development-team' || o.id == 'coordination';
    });

    if(roles.length == 0 && topic.author != $scope.me.id) {
      return false;
    }

    return true;
  }


  //===================================FUNCTIONS===================================

  $scope.deleteTopic = function(topic) {
    if (confirm("Are you sure you want to delete this topic?")) {
      TopicFactory.Topic.delete({id: topic._id}, function () {
        topic.deleted = true;
      });
    }
  };

  $scope.toggleTag = function(tag) {
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

  $scope.toggleTarget = function(target) {
    var index = $scope.topic.targets.indexOf(target);

    if (index == -1) {
      $scope.topic.targets.push(target);
    }
    else {
      $scope.topic.targets.splice(index, 1);
    }
  };

  $scope.toggleAllTargets = function() {
    for (var i = 0, j = $scope.members.length; i < j; i++) {
      $scope.toggleTarget($scope.members[i].id);
    }
  };

  $scope.toggleRoleTargets = function(roleId) {
    for (var i = 0, j = $scope.members.length; i < j; i++) {
      for(var o = 0; o < $scope.members[i].roles.length; o++) {
        if($scope.members[i].roles[o].id == roleId) {
          $scope.toggleTarget($scope.members[i].id);
        }
      }
    }
  };

  $scope.toggleTargets = function() {
    $scope.showTargets = !$scope.showTargets;
  };

  $scope.getTargetColor = function (memberId) {
    return ($scope.topic.targets.indexOf(memberId) !== -1 ? "blue" : "");
  };

  $scope.focusOption = function(option) {
    for (var i = 0, j = $scope.topic.poll.options.length; i < j; i++) {
      $scope.topic.poll.options[i].editing = false;
    }

    option.editing = true;
  };

  $scope.addOption = function() {
    var option = {
      optionType: "Info",
      targets: []
    };

    $scope.topic.poll.options.push(option);

    $scope.focusOption(option);
  };

  $scope.removeOption = function(option) {
    $scope.topic.poll.options.splice($scope.topic.poll.options.indexOf(option), 1);
  };

  this.selectOption = function(topic, option) {
    var updatedTopic = topic;

    if(option.votes.indexOf($scope.me.id) != -1) {
      updatedTopic.poll.options[updatedTopic.poll.options.indexOf(option)].votes.splice(updatedTopic.poll.options[updatedTopic.poll.options.indexOf(option)].votes.indexOf($scope.me.id),1);
    }
    else {
      updatedTopic.poll.options[updatedTopic.poll.options.indexOf(option)].votes.push($scope.me.id);
    }

    TopicFactory.Topic.update({id: updatedTopic._id}, updatedTopic, function(response) {
      if(response.error) {
        console.log("There was an error. Please contact the Dev Team and give them the details about the error.");
      }
      else if (response.success) {
        console.log(response.success);
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
    var member = $scope.members.filter(function(o) {
      return o.id == memberId;
    });

    if(member && member.length > 0) {
      return member[0];
    }
    else {
      return {
        name: "No one",
        facebook: "100000456335972"
      };
    }
  };

  $scope.timeSince =function (date) {
    date = new Date(date);
    var seconds = Math.floor((Date.now() - date) / 1000);

    var suffix = "ago";
    if(seconds < 0){
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

},{}],41:[function(require,module,exports){
require('./list');
require('./topic');
require('./embed');

},{"./embed":40,"./list":42,"./topic":43}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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
},{}],45:[function(require,module,exports){
require('./area');
},{"./area":44}],46:[function(require,module,exports){
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
},{}],47:[function(require,module,exports){
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
},{}],48:[function(require,module,exports){
require('./area');
require('./communication');
},{"./area":46,"./communication":47}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
require('./company')
},{"./company":49}],51:[function(require,module,exports){
require('./input')
},{"./input":52}],52:[function(require,module,exports){
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
},{}],53:[function(require,module,exports){
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

},{"./comment":45,"./communication":48,"./company":50,"./date":51,"./markdown":55,"./meeting":58,"./speaker":59,"./tag":61,"./topic":63}],54:[function(require,module,exports){
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
},{}],55:[function(require,module,exports){
require('./compile');
require('./markdown');
},{"./compile":54,"./markdown":56}],56:[function(require,module,exports){
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
},{}],57:[function(require,module,exports){
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

},{}],58:[function(require,module,exports){
require("./embed");

},{"./embed":57}],59:[function(require,module,exports){
require('./speaker');
},{"./speaker":60}],60:[function(require,module,exports){
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

},{}],61:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"./manager":62}],62:[function(require,module,exports){
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

},{}],63:[function(require,module,exports){
require("./topic");

},{"./topic":64}],64:[function(require,module,exports){
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

},{}],65:[function(require,module,exports){
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
},{}],66:[function(require,module,exports){
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
},{}],67:[function(require,module,exports){
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
},{}],68:[function(require,module,exports){
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
},{}],69:[function(require,module,exports){
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
},{}],70:[function(require,module,exports){
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
},{}],71:[function(require,module,exports){
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
require('./tag');
require('./topic');

},{"./chat":66,"./comment":67,"./communication":68,"./company":69,"./email":70,"./meeting":72,"./member":73,"./message":74,"./notification":75,"./role":76,"./session":77,"./socket":78,"./speaker":79,"./tag":80,"./topic":81}],72:[function(require,module,exports){
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

},{}],73:[function(require,module,exports){
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
},{}],74:[function(require,module,exports){
'use strict';

theToolServices
  .factory('MessageFactory', function ($resource) {
    return $resource(url_prefix+'/api/message/:id', null, {
        'getAll':    {method: 'GET', isArray: true}
      })
  })
},{}],75:[function(require,module,exports){
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

},{}],76:[function(require,module,exports){
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

},{}],77:[function(require,module,exports){
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
},{}],78:[function(require,module,exports){
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

},{}],79:[function(require,module,exports){
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
},{}],80:[function(require,module,exports){
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
},{}],81:[function(require,module,exports){
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

},{}],82:[function(require,module,exports){
url_prefix = require('./../../config').url;

require('./angularApp/app.js');
require('./angularApp/controllers');
require('./angularApp/directives');
require('./angularApp/filters');
require('./angularApp/services');
},{"./../../config":83,"./angularApp/app.js":1,"./angularApp/controllers":20,"./angularApp/directives":53,"./angularApp/filters":65,"./angularApp/services":71}],83:[function(require,module,exports){
module.exports={
  "url": "http://dev.bananamarket.eu",
  "email" : {
    "user": "thetoolsinfo",
    "password": "devteamftw",
    "host": "smtp.gmail.com",
    "ssl": true
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
},{}]},{},[82])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvcm9vdC90aGUtdG9vbC9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvYXBwLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvYXV0aC9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2F1dGgvaW50ZXJjZXB0b3IuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9hdXRoL2xvZ2luLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY2hhdC9jaGF0LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY2hhdC9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NoYXQvbGlzdC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW1lbnQvYXJlYS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW1lbnQvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tdW5pY2F0aW9uL2FyZWEuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tdW5pY2F0aW9uL2VtYmVkLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbXVuaWNhdGlvbi9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW11bmljYXRpb24vbGlzdC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvY29tcGFueS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvY29uZmlybS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvY3JlYXRlLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9lbWJlZC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21wYW55L2xpc3QuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21haW4vaG9tZS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21haW4vaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tYWluL21haW4uanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZWV0aW5nL2VtYmVkLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVldGluZy9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lZXRpbmcvbGlzdC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lZXRpbmcvbWVldGluZy5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lbWJlci9jcmVhdGUuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvbGlzdC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lbWJlci9tZW1iZXIuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2NvbmZpcm0uanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2NyZWF0ZS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvZW1iZWQuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvc3BlYWtlci9saXN0LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvc3BlYWtlci9zcGVha2VyLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdGFnL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdGFnL21hbmFnZXIuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90b3BpYy9lbWJlZC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3RvcGljL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdG9waWMvbGlzdC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3RvcGljL3RvcGljLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9jb21tZW50L2FyZWEuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbW1lbnQvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbW11bmljYXRpb24vYXJlYS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbXVuaWNhdGlvbi9jb21tdW5pY2F0aW9uLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9jb21tdW5pY2F0aW9uL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9jb21wYW55L2NvbXBhbnkuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbXBhbnkvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2RhdGUvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2RhdGUvaW5wdXQuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9tYXJrZG93bi9jb21waWxlLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9tYXJrZG93bi9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWFya2Rvd24vbWFya2Rvd24uanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21lZXRpbmcvZW1iZWQuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21lZXRpbmcvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3NwZWFrZXIvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3NwZWFrZXIvc3BlYWtlci5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvdGFnL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy90YWcvbWFuYWdlci5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvdG9waWMvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3RvcGljL3RvcGljLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZmlsdGVycy9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2NoYXQuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9jb21tZW50LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvY29tbXVuaWNhdGlvbi5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2NvbXBhbnkuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9lbWFpbC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvbWVldGluZy5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL21lbWJlci5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL21lc3NhZ2UuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9ub3RpZmljYXRpb24uanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9yb2xlLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvc2Vzc2lvbi5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL3NvY2tldC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL3NwZWFrZXIuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy90YWcuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy90b3BpYy5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy90aGVUb29sLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY29uZmlnLmpzb24iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JLQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pQQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTs7QUNEQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyLm1vZHVsZShcInRoZVRvb2xcIiwgW1xuICBcIm5nXCIsXG4gIFwibmdSb3V0ZVwiLFxuICBcIm5nU2FuaXRpemVcIixcbiAgXCJuZ1RvdWNoXCIsXG4gIFwiaW5maW5pdGUtc2Nyb2xsXCIsXG4gIFwibHVlZ2cuZGlyZWN0aXZlc1wiLFxuICBcIm5nQXVkaW9cIixcbiAgXCJ0aGVUb29sLmZpbHRlcnNcIixcbiAgXCJ0aGVUb29sLnNlcnZpY2VzXCIsXG4gIFwidGhlVG9vbC5kaXJlY3RpdmVzXCIsXG4gIFwidGhlVG9vbC5jb250cm9sbGVyc1wiXG5dKS5cbmNvbmZpZyhbXCIkcm91dGVQcm92aWRlclwiLCBmdW5jdGlvbigkcm91dGVQcm92aWRlcikge1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL1wiICAgICAgICAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2hvbWUuaHRtbFwiLCAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiaG9tZVwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbG9naW5cIiAgICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvYXV0aC9sb2dpbi5odG1sXCIsICAgICAgICAgICAgY29udHJvbGxlcjogXCJMb2dpbkNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2xvZ2luLzppZC86Y29kZVwiICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2F1dGgvbG9naW4uaHRtbFwiLCAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTG9naW5Db250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW5pZXMvXCIgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2xpc3QuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbmllc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbmllcy90YWJsZS9cIiAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbXBhbnkvdGFibGUuaHRtbFwiLCAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ29tcGFuaWVzQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tcGFuaWVzL2J1ZGdldC9cIiAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tcGFueS9idWRnZXQuaHRtbFwiLCAgICAgICAgY29udHJvbGxlcjogXCJDb21wYW5pZXNDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW55L1wiICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2NyZWF0ZS5odG1sXCIsICAgICAgICBjb250cm9sbGVyOiBcIkNyZWF0ZUNvbXBhbnlDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW55LzppZFwiICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L3ZpZXcuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbnlDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW55LzppZC9lZGl0XCIgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2VkaXQuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbnlDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW55LzppZC9wYXJ0aWNpcGF0aW9uXCIsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L3BhcnRpY2lwYXRpb24uaHRtbFwiLCBjb250cm9sbGVyOiBcIkNvbXBhbnlDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW55LzppZC9jb25maXJtXCIgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2NvbmZpcm0uaHRtbFwiLCAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbnlFbWFpbENvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbW1lbnQvOmlkL2VkaXRcIiAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbW1lbnQvZWRpdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ29tbWVudENvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL3NwZWFrZXJzL1wiICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3NwZWFrZXIvbGlzdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiU3BlYWtlcnNDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2Vycy90YWJsZS9cIiAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zcGVha2VyL3RhYmxlLmh0bWxcIiwgICAgICAgICBjb250cm9sbGVyOiBcIlNwZWFrZXJzQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvc3BlYWtlci9cIiAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9jcmVhdGUuaHRtbFwiLCAgICAgICAgY29udHJvbGxlcjogXCJDcmVhdGVTcGVha2VyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvc3BlYWtlci86aWRcIiAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci92aWV3Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJTcGVha2VyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvc3BlYWtlci86aWQvZWRpdFwiICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9lZGl0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJTcGVha2VyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvc3BlYWtlci86aWQvY29uZmlybVwiICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9jb25maXJtLmh0bWxcIiwgICAgICAgY29udHJvbGxlcjogXCJTcGVha2VyRW1haWxDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZW1iZXJzL1wiICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZW1iZXIvbGlzdC5odG1sXCIsICAgICAgICAgICBjb250cm9sbGVyOiBcIk1lbWJlcnNDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZW1iZXIvXCIgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZW1iZXIvY3JlYXRlLmh0bWxcIiwgICAgICAgICBjb250cm9sbGVyOiBcIkNyZWF0ZU1lbWJlckNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lbWJlci86aWRcIiAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lbWJlci92aWV3Lmh0bWxcIiwgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVtYmVyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVtYmVyLzppZC9lZGl0XCIgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVtYmVyL2VkaXQuaHRtbFwiLCAgICAgICAgICAgY29udHJvbGxlcjogXCJNZW1iZXJDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZWV0aW5nc1wiICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZWV0aW5nL2xpc3QuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIk1lZXRpbmdzQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVldGluZy86aWRcIiAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy92aWV3Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJNZWV0aW5nQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVldGluZy86aWQvdGV4dFwiICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy90ZXh0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJNZWV0aW5nQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVldGluZy86aWQvZWRpdFwiICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy9lZGl0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJNZWV0aW5nQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY2hhdHNcIiAgICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY2hhdC9saXN0Lmh0bWxcIiwgICAgICAgICAgICAgY29udHJvbGxlcjogXCJDaGF0c0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NoYXQvOmlkXCIgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NoYXQvdmlldy5odG1sXCIsICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ2hhdENvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL3RvcGljc1wiICAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3RvcGljL2xpc3QuaHRtbFwiLCAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiVG9waWNzQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvdG9waWMvOmlkXCIgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvdG9waWMvdmlldy5odG1sXCIsICAgICAgICAgICAgY29udHJvbGxlcjogXCJUb3BpY0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbW11bmljYXRpb25zXCIgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbW11bmljYXRpb24vbGlzdC5odG1sXCIsICAgIGNvbnRyb2xsZXI6IFwiQ29tbXVuaWNhdGlvbnNDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIub3RoZXJ3aXNlKHtyZWRpcmVjdFRvOiBcIi9cIn0pO1xufV0pO1xuIiwicmVxdWlyZShcIi4vbG9naW5cIik7XG5yZXF1aXJlKCcuL2ludGVyY2VwdG9yJyk7XG4iLCJ0aGVUb29sQ29udHJvbGxlci5jb25maWcoZnVuY3Rpb24gKCRodHRwUHJvdmlkZXIpIHtcbiAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChbJyRpbmplY3RvcicsIGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcbiAgICByZXR1cm4gJGluamVjdG9yLmdldCgnQXV0aEludGVyY2VwdG9yJyk7XG4gIH1dKTtcbn0pO1xuXG50aGVUb29sQ29udHJvbGxlci5mYWN0b3J5KCdBdXRoSW50ZXJjZXB0b3InLCBmdW5jdGlvbiAoJGxvY2F0aW9uLCAkd2luZG93KSB7XG4gIHJldHVybiB7XG4gICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgaWYoJGxvY2F0aW9uLnBhdGgoKS5pbmRleE9mKCcvbG9naW4nKSA9PSAtMSkge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBmYWNlYm9va0NvbmZpZyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vLi4vLi4vY29uZmlnJykuZmFjZWJvb2s7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJMb2dpbkNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24sICRodHRwLCAkd2luZG93KSB7XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUlOSVRJQUxJWkFUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgJC5hamF4U2V0dXAoe2NhY2hlOiB0cnVlfSk7XG4gICQuZ2V0U2NyaXB0KFwiLy9jb25uZWN0LmZhY2Vib29rLm5ldC9wdF9QVC9hbGwuanNcIiwgZnVuY3Rpb24gKCkge1xuICAgIEZCLmluaXQoe2FwcElkOiBmYWNlYm9va0NvbmZpZy5hcHBJZH0pO1xuICB9KTtcblxuICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAkc2NvcGUuc2hvd0lkSW5wdXQgPSB0cnVlO1xuICAkc2NvcGUuc2hvd0NvZGVJbnB1dCA9IGZhbHNlO1xuICBcbiAgaWYoJHNjb3BlLm1lLmlkKSB7XG4gICAgLy8kbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICR3aW5kb3cubG9jYXRpb24uYXNzaWduKCcvJyk7XG4gIH1cblxuICB2YXIgbG9jayA9IGZhbHNlO1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5mYWNlYm9va0xvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5iYW5hbmEgPSB0cnVlO1xuXG4gIFx0aWYgKGxvY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsb2NrID0gdHJ1ZTtcblxuICAgIEZCLmdldExvZ2luU3RhdHVzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gXCJjb25uZWN0ZWRcIikge1xuICAgICAgICBjb25uZWN0ZWQocmVzcG9uc2UpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIEZCLmxvZ2luKGZ1bmN0aW9uICgpIHt9LCB7ZGlzcGxheTogXCJwb3B1cFwifSk7XG4gICAgICAgIEZCLkV2ZW50LnN1YnNjcmliZShcImF1dGguc3RhdHVzQ2hhbmdlXCIsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IFwiY29ubmVjdGVkXCIpIHtcbiAgICAgICAgICAgIGNvbm5lY3RlZChyZXNwb25zZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBsb2NrID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBjb25uZWN0ZWQocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5jb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgJHNjb3BlLmxvZ2luSW5mbyA9IFwiTG9nZ2luZyBpbi4uLlwiO1xuXG4gICAgICAkaHR0cC5nZXQodXJsX3ByZWZpeCArICcvYXBpL2xvZ2luL2ZhY2Vib29rP2lkPScrcmVzcG9uc2UuYXV0aFJlc3BvbnNlLnVzZXJJRCsnJnRva2VuPScrcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmFjY2Vzc1Rva2VuKS5cbiAgICAgICAgc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgIC8vJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmFzc2lnbignLycpO1xuICAgICAgICB9KS5cbiAgICAgICAgZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1JcIiwgZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuc2VuZEVtYWlsID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICRzY29wZS5sb2dpbkluZm8gPSBcIlNlbmRpbmcgZW1haWwuLi5cIjsgIFxuICAgICRzY29wZS5zaG93SWRJbnB1dCA9IGZhbHNlO1xuICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBlbWFpbC4uLlwiKTtcblxuICAgICRodHRwLmdldCh1cmxfcHJlZml4ICsgJy9hcGkvbG9naW4vJyArIG1lbWJlcklkKS5cbiAgICAgIHN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgaWYoZGF0YS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgc2V0SW5mbyhcIlRoZXJlIHdhcyBhbiBlcnJvci4uLlwiKTtcbiAgICAgICAgICAkc2NvcGUuc2hvd0lkSW5wdXQgPSB0cnVlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICBzZXRJbmZvKFwiRW1haWwgc2VudCFcIik7XG4gICAgICAgICRzY29wZS5zaG93Q29kZUlucHV0ID0gdHJ1ZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbCBzZW50IVwiKVxuICAgICAgfSkuXG4gICAgICBlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICBzZXRJbmZvKFwiVGhlcmUgd2FzIGFuIGVycm9yLi4uXCIpO1xuICAgICAgICAkc2NvcGUuc2hvd0lkSW5wdXQgPSB0cnVlO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SXCIsIGRhdGEpO1xuICAgICAgfSk7XG4gIH1cblxuICAkc2NvcGUuc3VibWl0Q29kZSA9IGZ1bmN0aW9uIChtZW1iZXJJZCwgbWVtYmVyQ29kZSkge1xuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAkc2NvcGUubG9naW5JbmZvID0gXCJWZXJpZnlpbmcgY29kZS4uLlwiOyAgXG4gICAgJHNjb3BlLnNob3dDb2RlSW5wdXQgPSBmYWxzZTtcblxuICAgICRodHRwLmdldCh1cmxfcHJlZml4ICsgJy9hcGkvbG9naW4vJyArIG1lbWJlcklkICsgJy8nICsgbWVtYmVyQ29kZSkuXG4gICAgICBzdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgIGlmKGRhdGEuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIHNldEluZm8oXCJUaGVyZSB3YXMgYW4gZXJyb3IuLi5cIik7XG4gICAgICAgICAgJHNjb3BlLnNob3dJZElucHV0ID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmxvZ2luSW5mbyA9IFwiU3VjY2VzcyFcIjtcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oJy8nKTtcbiAgICAgICAgLy8kbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgfSkuXG4gICAgICBlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICBzZXRJbmZvKFwiVGhlcmUgd2FzIGFuIGVycm9yLi4uXCIpO1xuICAgICAgICAkc2NvcGUuc2hvd0lkSW5wdXQgPSB0cnVlO1xuICAgICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRJbmZvKG1lc3NhZ2UpIHtcbiAgICAkc2NvcGUubG9naW5JbmZvID0gbWVzc2FnZTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7JHNjb3BlLmxvZ2luSW5mbz1cIlwifSwgMjAwMCk7XG4gIH1cblxuICBpZiAoJHJvdXRlUGFyYW1zLmlkICYmICRyb3V0ZVBhcmFtcy5jb2RlKSB7XG4gICAgJHNjb3BlLnN1Ym1pdENvZGUoJHJvdXRlUGFyYW1zLmlkLCAkcm91dGVQYXJhbXMuY29kZSlcbiAgfVxuXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignQ2hhdENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCBuZ0F1ZGlvLCBTb2NrZXRGYWN0b3J5LCBNZXNzYWdlRmFjdG9yeSwgQ2hhdEZhY3RvcnksIE1lbWJlckZhY3RvcnkpIHtcblxuICAkc2NvcGUuZXJyb3IgPSB7fTtcblxuICAkc2NvcGUubG9hZGluZyAgPSB0cnVlO1xuICAkc2NvcGUubWVzc2FnZXMgPSBbXTtcbiAgJHNjb3BlLm9ubGluZSAgID0gW107XG5cbiAgY29uc29sZS5sb2coXCJDb25uZWN0aW5nXCIpO1xuXG4gIGlmKFNvY2tldEZhY3Rvcnkuc29ja2V0KXtcbiAgICBjb25zb2xlLmxvZygpO1xuICB9XG4gIFNvY2tldEZhY3RvcnkuY29ubmVjdCgnL2NoYXQnKTtcblxuICAvKnNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICBpZighU29ja2V0RmFjdG9yeS5zb2NrZXQuY29ubmVjdGVkKXtcbiAgICAgIFNvY2tldEZhY3RvcnkuY29ubmVjdCgnL2NoYXQnKTtcbiAgICB9XG4gIH0sIDMwMDApOyovXG5cbiAgU29ja2V0RmFjdG9yeS5vbignY29ubmVjdGVkJywgZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBTb2NrZXRGYWN0b3J5LmVtaXQoJ2F1dGgnLCB7aWQ6ICRyb3V0ZVBhcmFtcy5pZCwgdXNlcjogJHNjb3BlLm1lLmlkfSwgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc29sZS5sb2coJ0F1dGggc3VjY2VzcycpO1xuICAgIH0pO1xuICB9KTtcblxuICBTb2NrZXRGYWN0b3J5Lm9uKCd2YWxpZGF0aW9uJywgZnVuY3Rpb24gKHJlc3VsdCl7XG4gICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICBpZighcmVzdWx0LmVycil7XG4gICAgICAkc2NvcGUuY2hhdCAgICAgPSByZXN1bHQuY2hhdERhdGE7XG4gICAgICAkc2NvcGUubWVzc2FnZXMgPSByZXN1bHQubWVzc2FnZXM7XG4gICAgICAkc2NvcGUucm9vbSAgICAgPSByZXN1bHQucm9vbTtcblxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5jaGF0Lm1lbWJlcnMubGVuZ3RoOyBpKyspe1xuICAgICAgICAkc2NvcGUub25saW5lLnB1c2goe21lbWJlcjogJHNjb3BlLmNoYXQubWVtYmVyc1tpXSwgb246IGZhbHNlfSk7XG4gICAgICAgIGlmKHJlc3VsdC5vbmxpbmUuaW5kZXhPZigkc2NvcGUuY2hhdC5tZW1iZXJzW2ldKSAhPSAtMSl7XG4gICAgICAgICAgJHNjb3BlLm9ubGluZVtpXS5vbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLm9ubGluZVtpXS5uYW1lID0gJHNjb3BlLmdldE1lbWJlcigkc2NvcGUub25saW5lW2ldLm1lbWJlcikubmFtZTtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5vbmxpbmUpO1xuXG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBjb25zb2xlLmxvZyhyZXN1bHQubWVzc2FnZSk7XG4gICAgfVxuICAgICRzY29wZS5sb2FkaW5nICA9IGZhbHNlO1xuICB9KTtcblxuICBTb2NrZXRGYWN0b3J5Lm9uKCd1c2VyOmNvbm5lY3RlZCcsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgY29uc29sZS5sb2coXCJVc2VyIGNvbm5lY3RlZDogXCIgKyBkYXRhLmlkKTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLm9ubGluZS5sZW5ndGg7IGkrKyl7XG4gICAgICBpZigkc2NvcGUub25saW5lW2ldLm1lbWJlciA9PT0gZGF0YS5pZCl7XG4gICAgICAgICRzY29wZS5vbmxpbmVbaV0ub24gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIFNvY2tldEZhY3Rvcnkub24oJ3VzZXI6ZGlzY29ubmVjdGVkJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBjb25zb2xlLmxvZyhcIlVzZXIgY29ubmVjdGVkOiBcIiArIGRhdGEuaWQpO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUub25saW5lLmxlbmd0aDsgaSsrKXtcbiAgICAgIGlmKCRzY29wZS5vbmxpbmVbaV0ubWVtYmVyID09PSBkYXRhLmlkKXtcbiAgICAgICAgJHNjb3BlLm9ubGluZVtpXS5vbiA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIFNvY2tldEZhY3Rvcnkub24oJ21lc3NhZ2UnLCBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UuZGF0ZSk7XG4gICAgJHNjb3BlLm1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG5cbiAgICBpZihtZXNzYWdlLm1lbWJlciAhPSBtZS5pZCkge1xuICAgICAgbmdBdWRpby5wbGF5KFwiYXVkaW8vbWVzc2FnZS5tcDNcIik7XG4gICAgfVxuICB9KTtcblxuICAkc2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKCl7XG4gICAgY29uc29sZS5sb2coXCJPbiBsb2NhdGlvbiBjaGFuZ2VcIik7XG4gICAgY29uc29sZS5sb2coU29ja2V0RmFjdG9yeSk7XG4gICAgU29ja2V0RmFjdG9yeS5kaXNjb25uZWN0KCk7XG4gICAgZGVsZXRlIFNvY2tldEZhY3Rvcnkuc29ja2V0O1xuICB9KTtcblxuICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCRzY29wZS50ZXh0ID09IFwiXCIpe1xuICAgICAgLy8kc2NvcGUuZW1wdHkgPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBtZXNzYWdlRGF0YSA9IHtcbiAgICAgIHRleHQgICA6ICRzY29wZS50ZXh0LFxuICAgICAgY2hhdElkIDogJHJvdXRlUGFyYW1zLmlkLFxuICAgICAgbWVtYmVyIDogJHNjb3BlLm1lLmlkLFxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhtZXNzYWdlRGF0YSk7XG5cbiAgICBTb2NrZXRGYWN0b3J5LmVtaXQoJ3NlbmQnLCB7cm9vbTogJHNjb3BlLnJvb20sIG1lc3NhZ2U6IG1lc3NhZ2VEYXRhIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc29sZS5sb2coJ01lc3NhZ2Ugc2VudCcpO1xuICAgICAgJHNjb3BlLnRleHQgPSBcIlwiO1xuICAgIH0pO1xuICB9O1xufSk7XG4iLCJyZXF1aXJlKCcuL2xpc3QnKTtcbnJlcXVpcmUoJy4vY2hhdCcpOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignQ2hhdHNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgQ2hhdEZhY3RvcnkpIHtcblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgQ2hhdEZhY3RvcnkuQ2hhdC5nZXRBbGwoZnVuY3Rpb24oY2hhdHMpIHtcbiAgICAkc2NvcGUuY2hhdHMgPSBjaGF0cztcbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICB9KTtcblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNvbW1lbnRBcmVhQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCBNZW1iZXJGYWN0b3J5LCBDb21tZW50RmFjdG9yeSkge1xuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAkc2NvcGUuY29tbWVudERhdGEgPSB7XG4gICAgbWFya2Rvd246IFwiXCJcbiAgfTtcblxuICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXQoe2lkOiBcIm1lXCJ9LCBmdW5jdGlvbiAobWUpIHtcbiAgICAkc2NvcGUubWUgPSBtZTtcbiAgfSk7XG5cbiAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuZ2V0QWxsKGZ1bmN0aW9uIChtZW1iZXJzKSB7XG4gICAgJHNjb3BlLm1lbWJlcnMgPSBtZW1iZXJzO1xuICB9KTtcblxuICBsb2FkQ29tbWVudHMoKTtcblxuICBmdW5jdGlvbiBsb2FkQ29tbWVudHMoKSB7XG4gICAgaWYgKCRzY29wZS50aHJlYWQuc3BsaXQoXCItXCIpWzFdID09PSBcIlwiKSB7XG4gICAgICBzZXRUaW1lb3V0KGxvYWRDb21tZW50cywgNTAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcGFnZUlkID0gJHNjb3BlLnRocmVhZC5zdWJzdHJpbmcoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiLVwiKSArIDEpO1xuXG4gICAgaWYgKCRzY29wZS50aHJlYWQuaW5kZXhPZihcImNvbXBhbnktXCIpICE9IC0xKSB7XG4gICAgICBDb21tZW50RmFjdG9yeS5Db21wYW55LmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwic3BlYWtlci1cIikgIT0gLTEpIHtcbiAgICAgIENvbW1lbnRGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKHtpZDogcGFnZUlkfSwgZ290Q29tbWVudHMpO1xuICAgIH1cbiAgICBlbHNlIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJ0b3BpYy1cIikgIT0gLTEpIHtcbiAgICAgIENvbW1lbnRGYWN0b3J5LlRvcGljLmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnb3RDb21tZW50cyhjb21tZW50cykge1xuICAgICAgJHNjb3BlLmNvbW1lbnRzID0gY29tbWVudHM7XG5cbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgJHNjb3BlLnBvc3RDb21tZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICgkc2NvcGUuY29tbWVudERhdGEubWFya2Rvd24gPT09IFwiXCIpe1xuICAgICAgJHNjb3BlLmVtcHR5Q29tbWVudCA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGRhdGUgPSBEYXRlLm5vdygpO1xuICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQuY3JlYXRlKHtcbiAgICAgIHRocmVhZDogJHNjb3BlLnRocmVhZCxcbiAgICAgIG1lbWJlcjogJHNjb3BlLm1lLmlkLFxuICAgICAgbWFya2Rvd246ICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93bixcbiAgICAgIGh0bWw6ICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwoJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duKSxcbiAgICAgIHBvc3RlZDogZGF0ZSxcbiAgICAgIHVwZGF0ZWQ6IGRhdGVcbiAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biA9IFwiXCI7XG4gICAgICBsb2FkQ29tbWVudHMoKTtcbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS5zYXZlQ29tbWVudCA9IGZ1bmN0aW9uIChjb21tZW50KSB7XG4gICAgaWYgKGNvbW1lbnQuYnVmZmVyID09PSBcIlwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29tbWVudC5tYXJrZG93biA9IGNvbW1lbnQuYnVmZmVyO1xuICAgIGNvbW1lbnQuaHRtbCA9ICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwoY29tbWVudC5tYXJrZG93bik7XG4gICAgY29tbWVudC51cGRhdGVkID0gRGF0ZS5ub3coKTtcblxuICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQudXBkYXRlKHtpZDogY29tbWVudC5faWR9LCBjb21tZW50LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGNvbW1lbnQuZWRpdGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLnF1b3RlQ29tbWVudCA9IGZ1bmN0aW9uIChjb21tZW50KSB7XG4gICAgJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duID0gXCI+ICoqXCIgKyAkc2NvcGUuZ2V0TWVtYmVyKGNvbW1lbnQubWVtYmVyKS5uYW1lICsgXCIgc2FpZDoqKlxcbj4gXCIgKyBjb21tZW50Lm1hcmtkb3duLnNwbGl0KFwiXFxuXCIpLmpvaW4oXCJcXG4+IFwiKSArIFwiXFxuXFxuXCI7XG4gIH07XG5cbiAgJHNjb3BlLmRlbGV0ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xuICAgIGlmIChjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGNvbW1lbnQ/XCIpKSB7XG4gICAgICBDb21tZW50RmFjdG9yeS5Db21tZW50LmRlbGV0ZSh7aWQ6IGNvbW1lbnQuX2lkfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICBsb2FkQ29tbWVudHMoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgcmV0dXJuICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICB9KVswXTtcbiAgfTtcblxuICAkc2NvcGUuY29udmVydFRleHRUb0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIHVybEV4cCA9IC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWc7XG4gICAgdmFyIG1haWxFeHAgPSAvW1xcd1xcLlxcLV0rXFxAKFtcXHdcXC1dK1xcLikrW1xcd117Miw0fSg/IVtePF0qPikvaWc7XG5cbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIikucmVwbGFjZShtYWlsRXhwLFwiPGEgaHJlZj0nIy9jb21wYW55L1wiKyRyb3V0ZVBhcmFtcy5pZCtcIi9jb25maXJtP2VtYWlsPSQmJz4kJjwvYT5cIik7XG4gIH07XG5cbiAgJHNjb3BlLmNvbnZlcnROZXdMaW5lc1RvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICByZXR1cm4gJzxkaXYgZGF0YS1tYXJrZG93bj4nK3RleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykrJzwvZGl2Pic7XG4gIH07XG5cbiAgJHNjb3BlLmNvbnZlcnRNYXJrZG93blRvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICByZXR1cm4gJzxkaXYgZGF0YS1tYXJrZG93bj4nICsgdGV4dCArICc8L2Rpdj4nO1xuICB9O1xuXG4gICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAoY29tbWVudCkge1xuICAgIGlmKCEkc2NvcGUubWUucm9sZXMpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgIH0pO1xuXG4gICAgaWYocm9sZXMubGVuZ3RoID09IDAgJiYgY29tbWVudC5tZW1iZXIgIT0gJHNjb3BlLm1lLmlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG4gICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgICByZXR1cm4gbmV3IERhdGUodGltZSkudG9VVENTdHJpbmcoKTtcbiAgfTtcblxufSk7XG4iLCJyZXF1aXJlKCcuL2FyZWEuanMnKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiQ29tbXVuaWNhdGlvbkFyZWFDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsIENvbW11bmljYXRpb25GYWN0b3J5KSB7XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YSA9IHtcbiAgICBtYXJrZG93bjogXCJcIlxuICB9O1xuXG4gICRzY29wZS5tZSA9IEpTT04ucGFyc2UoJHNjb3BlLm1lSnNvbik7XG4gICRzY29wZS5tZW1iZXJzID0gSlNPTi5wYXJzZSgkc2NvcGUubWVtYmVyc0pzb24pO1xuICAkc2NvcGUucm9sZXMgPSBKU09OLnBhcnNlKCRzY29wZS5yb2xlc0pzb24pO1xuXG4gIGxvYWRDb21tdW5pY2F0aW9ucygpO1xuXG4gIGZ1bmN0aW9uIGxvYWRDb21tdW5pY2F0aW9ucygpIHtcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICBpZiAoJHNjb3BlLnRocmVhZC5zcGxpdChcIi1cIilbMV0gPT09IFwiXCIpIHtcbiAgICAgIHNldFRpbWVvdXQobG9hZENvbW11bmljYXRpb25zLCA1MDApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBwYWdlSWQgPSAkc2NvcGUudGhyZWFkLnN1YnN0cmluZygkc2NvcGUudGhyZWFkLmluZGV4T2YoXCItXCIpICsgMSk7XG5cbiAgICBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiY29tcGFueS1cIikgIT0gLTEpIHtcbiAgICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKHtpZDogcGFnZUlkfSwgZ290Q29tbXVuaWNhdGlvbnMpO1xuICAgICAgJHNjb3BlLmtpbmRzPVsnRW1haWwgVG8nLCAnRW1haWwgRnJvbScsICdNZWV0aW5nJywgJ1Bob25lIENhbGwnXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwic3BlYWtlci1cIikgIT0gLTEpIHtcbiAgICAgIENvbW11bmljYXRpb25GYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKHtpZDogcGFnZUlkfSwgZ290Q29tbXVuaWNhdGlvbnMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdvdENvbW11bmljYXRpb25zKGNvbW11bmljYXRpb25zKSB7XG4gICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbnMgPSBjb21tdW5pY2F0aW9ucztcblxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgaWYgKCRzY29wZS50aHJlYWQuaW5kZXhPZihcInNwZWFrZXItXCIpICE9IC0xKSB7XG4gICAgICAgIGlmKGNvbW11bmljYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgICAgcmV0dXJuIG8ua2luZC5pbmRleE9mKCdQYXJhZ3JhcGgnKSAhPSAtMTtcbiAgICAgICAgfSkubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAkc2NvcGUua2luZHM9WydFbWFpbCBUbycsICdFbWFpbCBGcm9tJywgJ01lZXRpbmcnLCAnUGhvbmUgQ2FsbCddO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5raW5kcz1bJ0luaXRhbCBFbWFpbCBQYXJhZ3JhcGgnLCdFbWFpbCBUbycsICdFbWFpbCBGcm9tJywgJ01lZXRpbmcnLCAnUGhvbmUgQ2FsbCddO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgJHNjb3BlLnBvc3RDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghJHNjb3BlLmNvbW11bmljYXRpb25EYXRhLmtpbmQgfHwgJHNjb3BlLmNvbW11bmljYXRpb25EYXRhLmtpbmQ9PSBcIlwiKXtcbiAgICAgICRzY29wZS5lbXB0eUNvbW11bmljYXRpb24gPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoISRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0IHx8ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0PT0gXCJcIil7XG4gICAgICAkc2NvcGUuZW1wdHlDb21tdW5pY2F0aW9uID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZGF0ZSA9IERhdGUubm93KCk7XG5cbiAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLmNyZWF0ZSh7XG4gICAgICB0aHJlYWQ6ICRzY29wZS50aHJlYWQsXG4gICAgICBtZW1iZXI6ICRzY29wZS5tZS5pZCxcbiAgICAgIGtpbmQ6ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS5raW5kLFxuICAgICAgdGV4dDogJHNjb3BlLmNvbW11bmljYXRpb25EYXRhLnRleHQsXG4gICAgICBwb3N0ZWQ6IGRhdGUsXG4gICAgICB1cGRhdGVkOiBkYXRlXG4gICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBsb2FkQ29tbXVuaWNhdGlvbnMoKTtcbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS5zYXZlQ29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XG4gICAgaWYgKGNvbW11bmljYXRpb24uYnVmZmVyID09PSBcIlwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29tbXVuaWNhdGlvbi50ZXh0ID0gY29tbXVuaWNhdGlvbi5idWZmZXI7XG4gICAgY29tbXVuaWNhdGlvbi51cGRhdGVkID0gRGF0ZS5ub3coKTtcblxuICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24udXBkYXRlKHtpZDogY29tbXVuaWNhdGlvbi5faWR9LCBjb21tdW5pY2F0aW9uLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGNvbW11bmljYXRpb24uZWRpdGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLmRlbGV0ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uZGVsZXRlKHtpZDogY29tbXVuaWNhdGlvbi5faWR9LCBmdW5jdGlvbiAoKSB7XG4gICAgICBsb2FkQ29tbXVuaWNhdGlvbnMoKTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuYXBwcm92ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uYXBwcm92ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgbnVsbCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBsb2FkQ29tbXVuaWNhdGlvbnMoKTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgcmV0dXJuICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICB9KVswXTtcbiAgfTtcblxuICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgIH0pO1xuXG4gICAgaWYocm9sZXMubGVuZ3RoID09IDAgJiYgY29tbXVuaWNhdGlvbi5tZW1iZXIgIT0gJHNjb3BlLm1lLmlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG4gICRzY29wZS5jb252ZXJ0VVJMcyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcblxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpLnJlcGxhY2UodXJsRXhwLFwiPGEgaHJlZj0nJDEnPiQxPC9hPlwiKTtcbiAgfVxuXG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiQ29tbXVuaWNhdGlvbkVtYmVkQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCBDb21tdW5pY2F0aW9uRmFjdG9yeSkge1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLnN1Y2Nlc3MgICAgID0gXCJcIjtcbiAgJHNjb3BlLmVycm9yICAgICAgID0gXCJcIjtcblxuICAkc2NvcGUuY29tbXVuaWNhdGlvbiA9IEpTT04ucGFyc2UoJHNjb3BlLmNvbW11bmljYXRpb25Kc29uKTtcbiAgJHNjb3BlLmNvbW11bmljYXRpb24uZWRpdGluZyA9IGZhbHNlO1xuICAkc2NvcGUuY29tbXVuaWNhdGlvbi5kZWxldGVkID0gZmFsc2U7XG5cbiAgJHNjb3BlLm1lID0gSlNPTi5wYXJzZSgkc2NvcGUubWVKc29uKTtcbiAgJHNjb3BlLm1lbWJlcnMgPSBKU09OLnBhcnNlKCRzY29wZS5tZW1iZXJzSnNvbik7XG4gICRzY29wZS5yb2xlcyA9IEpTT04ucGFyc2UoJHNjb3BlLnJvbGVzSnNvbik7XG5cblxuICAkc2NvcGUuc2F2ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgIGlmIChjb21tdW5pY2F0aW9uLmJ1ZmZlciA9PT0gXCJcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbW11bmljYXRpb24udGV4dCA9IGNvbW11bmljYXRpb24uYnVmZmVyO1xuICAgIGNvbW11bmljYXRpb24udXBkYXRlZCA9IERhdGUubm93KCk7XG5cbiAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLnVwZGF0ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgY29tbXVuaWNhdGlvbiwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBjb21tdW5pY2F0aW9uLmVkaXRpbmcgPSBmYWxzZTtcbiAgICAgIGNvbW11bmljYXRpb24uYXBwcm92ZWQgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS5kZWxldGVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLmRlbGV0ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLmNvbW11bmljYXRpb24uZGVsZXRlZCA9IHRydWU7XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmFwcHJvdmVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLmFwcHJvdmUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIG51bGwsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmNvbW11bmljYXRpb24uYXBwcm92ZWQgPSB0cnVlO1xuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgIHZhciByb2xlcyA9ICRzY29wZS5tZS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gJ2RldmVsb3BtZW50LXRlYW0nIHx8IG8uaWQgPT0gJ2Nvb3JkaW5hdGlvbic7XG4gICAgfSk7XG5cbiAgICBpZihyb2xlcy5sZW5ndGggPT0gMCAmJiBjb21tdW5pY2F0aW9uLm1lbWJlciAhPSAkc2NvcGUubWUuaWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIGRhdGUpIC8gMTAwMCk7XG5cbiAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XG4gICAgaWYoc2Vjb25kcyA8IDApe1xuICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHNlY29uZHMpO1xuICAgICAgc3VmZml4ID0gJ3RvIGdvJztcbiAgICB9XG5cbiAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XG5cbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbW9udGhzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtaW51dGVzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XG4gIH07XG5cbiAgJHNjb3BlLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAodGltZSkge1xuICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lKS50b1VUQ1N0cmluZygpO1xuICB9O1xuXG4gICRzY29wZS5jb252ZXJ0VVJMcyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcblxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpLnJlcGxhY2UodXJsRXhwLFwiPGEgaHJlZj0nJDEnPiQxPC9hPlwiKTtcbiAgfVxufSk7XG4iLCJyZXF1aXJlKCcuL2FyZWEuanMnKTtcbnJlcXVpcmUoJy4vbGlzdC5qcycpO1xucmVxdWlyZSgnLi9lbWJlZC5qcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignQ29tbXVuaWNhdGlvbnNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsIENvbW11bmljYXRpb25GYWN0b3J5KSB7XG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5nZXRBbGwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbnMgPSByZXNwb25zZTtcbiAgICB9KTtcblxuICAgICRzY29wZS5zaG93T3BlbiA9IHRydWU7XG5cbiAgICAkc2NvcGUuc2hvd25Db21tdW5pY2F0aW9ucyA9IGZ1bmN0aW9uIChzaG93T3Blbikge1xuICAgICAgcmV0dXJuICRzY29wZS5jb21tdW5pY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICByZXR1cm4gKHNob3dPcGVuID8gIW8uYXBwcm92ZWQgOiBvLmFwcHJvdmVkKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDb21wYW55Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsIENvbXBhbnlGYWN0b3J5LCBNZW1iZXJGYWN0b3J5LCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XG5cbiAgICAkc2NvcGUudHJ1c3RTcmMgPSBmdW5jdGlvbihzcmMpIHtcbiAgICAgIHJldHVybiAkc2NlLnRydXN0QXNSZXNvdXJjZVVybChzcmMrJyNwYWdlLWJvZHknKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuY29udmVydEVtYWlscyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHZhciBtYWlsRXhwID0gL1tcXHdcXC5cXC1dK1xcQChbXFx3XFwtXStcXC4pK1tcXHddezIsNH0oPyFbXjxdKj4pL2lnO1xuICAgICAgdmFyIHR3aXR0ZXJFeHAgPSAvKF58W15AXFx3XSlAKFxcd3sxLDE1fSlcXGIvZztcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UobWFpbEV4cCxcIjxhIGhyZWY9JyMvY29tcGFueS9cIiskcm91dGVQYXJhbXMuaWQrXCIvY29uZmlybT9lbWFpbD0kJic+JCY8L2E+XCIpLnJlcGxhY2UodHdpdHRlckV4cCxcIiQxPGEgaHJlZj0naHR0cDovL3R3aXR0ZXIuY29tLyQyJyB0YXJnZXQ9J19ibGFuayc+JDI8L2E+XCIpXG4gICAgfVxuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbXBhbnlEYXRhID0gdGhpcy5mb3JtRGF0YTtcblxuICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS51cGRhdGUoeyBpZDpjb21wYW55RGF0YS5pZCB9LCBjb21wYW55RGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLnN1Y2Nlc3M7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc3RhdHVzZXMgPSBbJ1N1Z2dlc3Rpb24nLCdDb250YWN0ZWQnLCdJbiBDb252ZXJzYXRpb25zJywnSW4gTmVnb3RpYXRpb25zJywnQ2xvc2VkIERlYWwnLCdSZWplY3RlZCcsJ0dpdmUgVXAnXTtcbiAgICAkc2NvcGUubG9nb1NpemVzID0gW251bGwsICdTJywnTScsJ0wnXTtcbiAgICAkc2NvcGUuc3RhbmREYXlzID0gW251bGwsIDEsMiwzLDQsNV07XG4gICAgJHNjb3BlLnBvc3RzTnVtYmVycyA9IFtudWxsLCAxLDIsMyw0LDVdO1xuXG4gICAgJHNjb3BlLmNvbXBhbnkgPSAkc2NvcGUuZm9ybURhdGEgPSAkc2NvcGUuZ2V0Q29tcGFueSgkcm91dGVQYXJhbXMuaWQpO1xuXG4gICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS5nZXQoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmNvbXBhbnkgPSAkc2NvcGUuZm9ybURhdGEgPSByZXNwb25zZTtcblxuICAgICAgTm90aWZpY2F0aW9uRmFjdG9yeS5Db21wYW55LmdldEFsbCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKGdldERhdGEpIHtcbiAgICAgICAgJHNjb3BlLmNvbXBhbnkubm90aWZpY2F0aW9ucyA9IGdldERhdGE7XG5cbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXJcbiAgLmNvbnRyb2xsZXIoJ0NvbXBhbnlFbWFpbENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCAkbG9jYXRpb24sIEVtYWlsRmFjdG9yeSkge1xuICAgICRzY29wZS5lbWFpbCA9ICRsb2NhdGlvbi5zZWFyY2goKS5lbWFpbDtcbiAgICAkc2NvcGUuY29tcGFueUlkID0gJHJvdXRlUGFyYW1zLmlkO1xuICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAkc2NvcGUubWVzc2FnZSA9IG51bGw7XG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBudWxsO1xuXG4gICAgICBjb25zb2xlLmxvZyhcInNlbmQgZW1haWwgdG8gXCIsICRzY29wZS5lbWFpbCwgXCIgZnJvbSBcIiwgJHNjb3BlLmNvbXBhbnlJZCk7XG5cbiAgICAgIEVtYWlsRmFjdG9yeS5Db21wYW55LnNlbmQoeyBpZDogJHNjb3BlLmNvbXBhbnlJZCB9LCB7IGVtYWlsOiAkc2NvcGUuZW1haWwgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuIFxudGhlVG9vbENvbnRyb2xsZXJcbiAgLmNvbnRyb2xsZXIoJ0NyZWF0ZUNvbXBhbnlDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uLCBDb21wYW55RmFjdG9yeSkge1xuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb21wYW55RGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuY3JlYXRlKGNvbXBhbnlEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcbiAgICAgICAgICBcbiAgICAgICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmdldEFsbChmdW5jdGlvbiAoY29tcGFuaWVzKSB7XG4gICAgICAgICAgICAkc2NvcGUuY29tcGFuaWVzID0gY29tcGFuaWVzO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvY29tcGFueS9cIiArIHJlc3BvbnNlLmlkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zdGF0dXNlcyA9IFsnU3VnZ2VzdGlvbicsJ0NvbnRhY3RlZCcsJ0luIENvbnZlcnNhdGlvbnMnLCdJbiBOZWdvdGlhdGlvbnMnLCdDbG9zZWQgRGVhbCcsJ1JlamVjdGVkJywnR2l2ZSBVcCddO1xuICB9KTsiLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNvbXBhbnlFbWJlZENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSkge1xuXG4gICRzY29wZS5tZSA9IEpTT04ucGFyc2UoJHNjb3BlLm1lSnNvbik7XG4gICRzY29wZS5tZW1iZXJzID0gSlNPTi5wYXJzZSgkc2NvcGUubWVtYmVyc0pzb24pO1xuICAkc2NvcGUucm9sZXMgPSBKU09OLnBhcnNlKCRzY29wZS5yb2xlc0pzb24pO1xuXG4gIGlmKCRzY29wZS5jb21tZW50cykge1xuICAgICRzY29wZS5jb21wYW55LmNvbW1lbnRzID0gJHNjb3BlLmNvbW1lbnRzLmZpbHRlcihmdW5jdGlvbihlKSB7XG4gICAgICByZXR1cm4gZS50aHJlYWQgPT0gJ2NvbXBhbnktJyskc2NvcGUuY29tcGFueS5pZDtcbiAgICB9KVxuICB9XG5cbiAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgIHZhciBtZW1iZXIgPSAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XG4gICAgfSk7XG5cbiAgICBpZihtZW1iZXIubGVuZ3RoPjApIHtcbiAgICAgIHJldHVybiBtZW1iZXJbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IFwiTm8gb25lXCIsXG4gICAgICAgIGZhY2Vib29rOiBcIjEwMDAwMDQ1NjMzNTk3MlwiXG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIGRhdGUpIC8gMTAwMCk7XG5cbiAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XG4gICAgaWYoc2Vjb25kcyA8IDApe1xuICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHNlY29uZHMpO1xuICAgICAgc3VmZml4ID0gJ3RvIGdvJztcbiAgICB9XG5cbiAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XG5cbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbW9udGhzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtaW51dGVzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XG4gIH07XG5cbn0pO1xuIiwicmVxdWlyZSgnLi9jb21wYW55LmpzJyk7XG5yZXF1aXJlKCcuL2xpc3QuanMnKTtcbnJlcXVpcmUoJy4vY3JlYXRlLmpzJyk7XG5yZXF1aXJlKCcuL2NvbmZpcm0uanMnKTtcbnJlcXVpcmUoJy4vZW1iZWQuanMnKTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDb21wYW5pZXNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRzY2UsIENvbXBhbnlGYWN0b3J5LCBNZW1iZXJGYWN0b3J5KSB7XG4gICAgJHNjb3BlLnNhdmVTdGF0dXMgPSBmdW5jdGlvbihjb21wYW55KSB7XG4gICAgICB2YXIgY29tcGFueURhdGEgPSBjb21wYW55O1xuXG4gICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LnVwZGF0ZSh7IGlkOmNvbXBhbnkuaWQgfSwgY29tcGFueURhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkc2NvcGUuZ2V0Q2xhc3NGcm9tUGF5bWVudFN0YXR1cyA9IGZ1bmN0aW9uKHBhcnRpY2lwYXRpb24pIHtcbiAgICAgIGlmKCFwYXJ0aWNpcGF0aW9uKSB7IHJldHVybiBcImdyZXlcIjsgfVxuICAgICAgaWYoIXBhcnRpY2lwYXRpb24ucGF5bWVudCkgeyByZXR1cm4gXCJncmV5XCI7IH1cbiAgICAgIGlmKCFwYXJ0aWNpcGF0aW9uLnBheW1lbnQuc3RhdHVzKSB7IHJldHVybiBcImdyZXlcIjsgfVxuICAgICAgdmFyIHN0YXR1cyA9IHBhcnRpY2lwYXRpb24ucGF5bWVudC5zdGF0dXMudG9Mb3dlckNhc2UoKTtcblxuICAgICAgaWYoc3RhdHVzLmluZGV4T2YoXCJwYWdvXCIpICE9IC0xIHx8IHN0YXR1cy5pbmRleE9mKFwiZW1pdGlkb1wiKSAhPSAtMSB8fCBzdGF0dXMuaW5kZXhPZihcInJlY2libyBlbnZpYWRvXCIpICE9IC0xKSB7IHJldHVybiBcImxpbWVcIjsgfSBcbiAgICAgIGVsc2UgaWYoc3RhdHVzLmluZGV4T2YoXCJlbnZpYWRvXCIpICE9IC0xKSB7IHJldHVybiBcIm9yYW5nZVwiOyB9XG4gICAgICBlbHNlIHsgcmV0dXJuIFwiZ3JleVwiOyB9XG4gICAgfVxuXG4gICAgJHNjb3BlLnBheW1lbnRTdGF0dXNlcyA9IFsnRW1pdGlkbycsICdSZWNpYm8gRW52aWFkbycsICdQYWdvJywgJ0VudmlhZG8nXTtcbiAgXG4gICAgJHNjb3BlLmxpbWl0ID0gMTA7XG5cbiAgICAkc2NvcGUuc3RhdHVzZXMgPSBbJ1N1Z2dlc3Rpb24nLCdDb250YWN0ZWQnLCdJbiBDb252ZXJzYXRpb25zJywnSW4gTmVnb3RpYXRpb25zJywnQ2xvc2VkIERlYWwnLCdSZWplY3RlZCcsJ0dpdmUgVXAnXTtcbiAgICBcbiAgICAkc2NvcGUuY29tcGFueVByZWRpY2F0ZSA9ICd1cGRhdGVkJztcbiAgICAkc2NvcGUucmV2ZXJzZSA9ICd0cnVlJztcblxuICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUucHJlZGljYXRlID0gJ3VwZGF0ZWQnO1xuICAgICAgJHNjb3BlLnJldmVyc2UgPSB0cnVlO1xuICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IHJlc3BvbnNlO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCRzY29wZS5saW1pdCA8PSAkc2NvcGUuY29tcGFuaWVzLmxlbmd0aClcbiAgICAgICAgJHNjb3BlLmxpbWl0ICs9IDEwO1xuICAgIH07XG4gIH0pO1xuICAiLCJ0aGVUb29sQ29udHJvbGxlciA9IGFuZ3VsYXIubW9kdWxlKCd0aGVUb29sLmNvbnRyb2xsZXJzJywgW10pO1xuXG5yZXF1aXJlKCcuL2F1dGgnKTtcbnJlcXVpcmUoJy4vbWFpbicpO1xucmVxdWlyZSgnLi9jb21wYW55Jyk7XG5yZXF1aXJlKCcuL3NwZWFrZXInKTtcbnJlcXVpcmUoJy4vbWVtYmVyJyk7XG5yZXF1aXJlKCcuL2NvbW1lbnQnKTtcbnJlcXVpcmUoJy4vbWVldGluZycpO1xucmVxdWlyZSgnLi9jaGF0Jyk7XG5yZXF1aXJlKCcuL3RvcGljJyk7XG5yZXF1aXJlKCcuL2NvbW11bmljYXRpb24nKTtcbnJlcXVpcmUoJy4vdGFnJyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcImhvbWVcIiwgZnVuY3Rpb24gKCRzY29wZSwgTm90aWZpY2F0aW9uRmFjdG9yeSkge1xuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgJHNjb3BlLm5vdGlmaWNhdGlvbnMgPSBbXTtcbiAgJHNjb3BlLmxpbWl0ID0gMTA7XG5cbiAgTm90aWZpY2F0aW9uRmFjdG9yeS5Ob3RpZmljYXRpb24uZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICRzY29wZS5ub3RpZmljYXRpb25zID0gcmVzcG9uc2U7XG4gICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgfSk7XG5cbiAgJHNjb3BlLnNjcm9sbCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoJHNjb3BlLmxpbWl0IDwgJHNjb3BlLm5vdGlmaWNhdGlvbnMubGVuZ3RoKSB7XG4gICAgICAkc2NvcGUubGltaXQgKz0gMTA7XG4gICAgfVxuICB9O1xuXG59KTtcbiIsInJlcXVpcmUoJy4vbWFpbi5qcycpO1xucmVxdWlyZSgnLi9ob21lLmpzJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgJGxvY2F0aW9uLCAkd2luZG93LCAkcm9vdFNjb3BlLCBOb3RpZmljYXRpb25GYWN0b3J5LCBNZW1iZXJGYWN0b3J5LCBDb21wYW55RmFjdG9yeSwgU3BlYWtlckZhY3RvcnksIFRvcGljRmFjdG9yeSwgUm9sZUZhY3RvcnksIFRhZ0ZhY3RvcnksIENvbW1lbnRGYWN0b3J5KSB7XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUlOSVRJQUxJWkFUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUucmVhZHkgPSBmYWxzZTtcblxuICAkc2NvcGUuZGlzcGxheSA9IGZhbHNlO1xuXG4gICRzY29wZS5zZWFyY2ggPSB7fTtcbiAgJHNjb3BlLnNlYXJjaFRvcGljcyA9IHt9O1xuICAkc2NvcGUuc2VhcmNoQ29tcGFuaWVzID0ge307XG4gICRzY29wZS5zZWFyY2hTcGVha2VycyA9IHt9O1xuICAkc2NvcGUuc2VhcmNoTWVtYmVycyA9IHt9O1xuXG4gICRzY29wZS5tZSA9IHt9O1xuICAkc2NvcGUubWVtYmVycyA9IFtdO1xuICAkc2NvcGUuY29tcGFuaWVzID0gW107XG4gICRzY29wZS5zcGVha2VycyA9IFtdO1xuICAkc2NvcGUudG9waWNzID0gW107XG4gICRzY29wZS5ub3RpZmljYXRpb25zID0gW107XG5cbiAgJHNjb3BlLm5vdGlmaWNhdGlvbnNJbmZvID0ge1xuICAgIG51bWJlcjogMCxcbiAgICB0ZXh0OiBcIiBMb2FkaW5nLi4uXCJcbiAgfTtcblxuICB2YXIgZmFjdG9yaWVzUmVhZHkgPSAwO1xuXG4gIE1lbWJlckZhY3RvcnkuTWUuZ2V0KGZ1bmN0aW9uIChtZSkge1xuICAgICRzY29wZS5tZSA9IG1lO1xuICAgIGNhbGxiYWNrKCk7XG4gIH0pO1xuXG4gIE1lbWJlckZhY3RvcnkuTWVtYmVyLmdldEFsbChmdW5jdGlvbiAobWVtYmVycykge1xuICAgICRzY29wZS5tZW1iZXJzID0gbWVtYmVycztcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcblxuICBDb21wYW55RmFjdG9yeS5Db21wYW55LmdldEFsbChmdW5jdGlvbiAoY29tcGFuaWVzKSB7XG4gICAgJHNjb3BlLmNvbXBhbmllcyA9IGNvbXBhbmllcztcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcblxuICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmdldEFsbChmdW5jdGlvbiAoc3BlYWtlcnMpIHtcbiAgICAkc2NvcGUuc3BlYWtlcnMgPSBzcGVha2VycztcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcblxuICBUb3BpY0ZhY3RvcnkuVG9waWMuZ2V0QWxsKGZ1bmN0aW9uICh0b3BpY3MpIHtcbiAgICAkc2NvcGUudG9waWNzID0gdG9waWNzO1xuICAgIGNhbGxiYWNrKCk7XG4gIH0pO1xuXG4gIFJvbGVGYWN0b3J5LlJvbGUuZ2V0QWxsKGZ1bmN0aW9uIChyb2xlcykge1xuICAgICRzY29wZS5yb2xlcyA9IHJvbGVzO1xuICAgIGNhbGxiYWNrKCk7XG4gIH0pO1xuXG4gIFRhZ0ZhY3RvcnkuVGFnLmdldEFsbChmdW5jdGlvbiAodGFncykge1xuICAgICRzY29wZS50b3BpY1RhZ3MgPSB0YWdzO1xuICAgIGNhbGxiYWNrKCk7XG4gIH0pO1xuXG4gIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQuZ2V0QWxsKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICRzY29wZS5jb21tZW50cyA9IGNvbW1lbnRzO1xuICAgIGNhbGxiYWNrKCk7XG4gIH0pO1xuXG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gY2FsbGJhY2soKSB7XG4gICAgaWYgKCsrZmFjdG9yaWVzUmVhZHkgPT0gOCkge1xuICAgICAgJHNjb3BlLnJlYWR5ID0gdHJ1ZTtcblxuICAgICAgJHNjb3BlLnVwZGF0ZSgpO1xuXG4gICAgICBzZXRJbnRlcnZhbCgkc2NvcGUudXBkYXRlLCAxMDAwMCk7XG5cbiAgICAgICRyb290U2NvcGUuJG9uKFwiJGxvY2F0aW9uQ2hhbmdlU3RhcnRcIiwgZnVuY3Rpb24gKGV2ZW50LCBuZXh0LCBjdXJyZW50KSB7XG4gICAgICAgIHNldFRpbWVvdXQoJHNjb3BlLnVwZGF0ZSwgNTAwKTtcbiAgICAgICAgJHNjb3BlLnNlYXJjaC5uYW1lID0gJyc7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TQ09QRSBGVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBOb3RpZmljYXRpb25GYWN0b3J5Lk5vdGlmaWNhdGlvbi5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUubm90aWZpY2F0aW9ucyA9IFtdO1xuICAgICAgJHNjb3BlLm5vdGlmaWNhdGlvbnNJbmZvLm51bWJlciA9IDA7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlW2ldLnRhcmdldHMuaW5kZXhPZigkc2NvcGUubWUuaWQpICE9IC0xKSB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlW2ldLnVucmVhZC5pbmRleE9mKCRzY29wZS5tZS5pZCkgIT0gLTEpIHtcbiAgICAgICAgICAgICRzY29wZS5ub3RpZmljYXRpb25zSW5mby5udW1iZXIrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgJHNjb3BlLm5vdGlmaWNhdGlvbnMudW5zaGlmdChyZXNwb25zZVtpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCRzY29wZS5ub3RpZmljYXRpb25zSW5mby5udW1iZXIgPT0gMCkge1xuICAgICAgICAkc2NvcGUubm90aWZpY2F0aW9uc0luZm8udGV4dCA9IFwiIE5vIE5vdGlmaWNhdGlvbnNcIjtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAkc2NvcGUubm90aWZpY2F0aW9uc0luZm8udGV4dCA9IFwiIFwiICsgJHNjb3BlLm5vdGlmaWNhdGlvbnNJbmZvLm51bWJlciArIFwiIE5vdGlmaWNhdGlvblwiICsgKCRzY29wZS5ub3RpZmljYXRpb25zSW5mby5udW1iZXIgPiAxID8gXCJzXCIgOiBcIlwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIGRhdGUpIC8gMTAwMCk7XG5cbiAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XG4gICAgaWYoc2Vjb25kcyA8IDApe1xuICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHNlY29uZHMpO1xuICAgICAgc3VmZml4ID0gJ3RvIGdvJztcbiAgICB9XG5cbiAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XG5cbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbW9udGhzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtaW51dGVzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XG4gIH07XG5cbiAgJHNjb3BlLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAodGltZSkge1xuICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lKS50b1VUQ1N0cmluZygpO1xuICB9O1xuXG4gICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICB2YXIgbWVtYmVyID0gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xuICAgIH0pO1xuXG4gICAgaWYobWVtYmVyLmxlbmd0aD4wKSB7XG4gICAgICByZXR1cm4gbWVtYmVyWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBcIk5vIG9uZVwiLFxuICAgICAgICBmYWNlYm9vazogXCIxMDAwMDA0NTYzMzU5NzJcIlxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuZ2V0U3BlYWtlciA9IGZ1bmN0aW9uIChzcGVha2VySWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLnNwZWFrZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBzcGVha2VySWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmdldENvbXBhbnkgPSBmdW5jdGlvbiAoY29tcGFueUlkKSB7XG4gICAgcmV0dXJuICRzY29wZS5jb21wYW5pZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09IGNvbXBhbnlJZDtcbiAgICB9KVswXTtcbiAgfTtcblxuICAkc2NvcGUuZ2V0VG9waWMgPSBmdW5jdGlvbiAodG9waWNJZCkge1xuICAgIHJldHVybiAkc2NvcGUudG9waWNzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5faWQgPT0gdG9waWNJZDtcbiAgICB9KVswXTtcbiAgfTtcblxuICAkc2NvcGUuc2hvdyA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5kaXNwbGF5ID0gKCRzY29wZS5zZWFyY2gubmFtZSA/IHRydWUgOiBmYWxzZSk7XG4gIH07XG5cbiAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuZGlzcGxheSA9IGZhbHNlO1xuICB9O1xuXG4gICRzY29wZS5jb252ZXJ0VVJMcyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcblxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpLnJlcGxhY2UodXJsRXhwLFwiPGEgaHJlZj0nJDEnPiQxPC9hPlwiKTtcbiAgfVxuXG4gICRzY29wZS5jb252ZXJ0TmV3TGluZXNUb0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgcmV0dXJuICc8ZGl2IGRhdGEtbWFya2Rvd24+Jyt0ZXh0LnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpKyc8L2Rpdj4nO1xuICB9XG5cbiAgJHNjb3BlLmNvbnZlcnRNYXJrZG93blRvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICByZXR1cm4gJzxkaXYgZGF0YS1tYXJrZG93bj4nICsgdGV4dCArICc8L2Rpdj4nO1xuICB9XG5cbiAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkaHR0cC5nZXQodXJsX3ByZWZpeCArICcvYXBpL2xvZ291dCcpLlxuICAgICAgc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAkd2luZG93LmxvY2F0aW9uLmFzc2lnbignLycpO1xuICAgICAgfSkuXG4gICAgICBlcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SXCIsIGRhdGEpO1xuICAgICAgICAkd2luZG93LmxvY2F0aW9uLmFzc2lnbignLycpO1xuICAgICAgfSk7XG4gIH1cblxuXG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTWVldGluZ0VtYmVkQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCBNZWV0aW5nRmFjdG9yeSkge1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gIE1lZXRpbmdGYWN0b3J5LmdldCh7aWQ6ICRzY29wZS5tZWV0aW5nSWR9LCBmdW5jdGlvbiAobWVldGluZykge1xuICAgICRzY29wZS5tZWV0aW5nID0gbWVldGluZztcblxuICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gIH0pO1xuXG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09PSBtZW1iZXJJZDtcbiAgICB9KVswXTtcbiAgfTtcblxufSk7XG4iLCJyZXF1aXJlKFwiLi9lbWJlZFwiKTtcbnJlcXVpcmUoXCIuL2xpc3RcIik7XG5yZXF1aXJlKFwiLi9tZWV0aW5nXCIpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKCdNZWV0aW5nc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYXRpb24sIE1lZXRpbmdGYWN0b3J5KSB7XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUlOSVRJQUxJWkFUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgaW5pdCgpO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGlmICgkc2NvcGUubG9hZGluZykge1xuICAgICAgICBpbml0KCk7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG5cbiAgICBNZWV0aW5nRmFjdG9yeS5nZXRBbGwoZnVuY3Rpb24gKG1lZXRpbmdzKSB7XG4gICAgICAkc2NvcGUubWVldGluZ3MgPSBtZWV0aW5ncztcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUubWVldGluZ3MubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICRzY29wZS5tZWV0aW5nc1tpXS5mYWNlYm9vayA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgICAgcmV0dXJuICRzY29wZS5tZWV0aW5nc1tpXS5hdXRob3IgPT0gby5pZDtcbiAgICAgICAgfSlbMF0uZmFjZWJvb2s7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS50aW1lID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiAkc2NvcGUudGltZVNpbmNlKG5ldyBEYXRlKGRhdGUpKTtcbiAgfTtcblxuICAkc2NvcGUuY3JlYXRlTWVldGluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcblxuICAgIE1lZXRpbmdGYWN0b3J5LmNyZWF0ZSh7XG4gICAgICBhdXRob3I6ICRzY29wZS5tZS5pZCxcbiAgICAgIHRpdGxlOiBkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LVBUXCIpICsgXCIgLSBNZWV0aW5nXCIsXG4gICAgICBkYXRlOiBkYXRlXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL21lZXRpbmcvXCIgKyByZXNwb25zZS5pZCArIFwiL2VkaXRcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJNZWV0aW5nQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgJHRpbWVvdXQsIE1lZXRpbmdGYWN0b3J5LCBUb3BpY0ZhY3RvcnksIFRhZ0ZhY3RvcnkpIHtcblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAkc2NvcGUua2luZHMgPSBbXCJJbmZvXCIsIFwiVG8gZG9cIiwgXCJEZWNpc2lvblwiLCBcIklkZWFcIl07XG5cbiAgTWVldGluZ0ZhY3RvcnkuZ2V0KHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24gKG1lZXRpbmcpIHtcbiAgICAkc2NvcGUubWVldGluZyA9IG1lZXRpbmc7XG5cbiAgICBTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoID0gZnVuY3Rpb24gKHN1ZmZpeCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXhPZihzdWZmaXgsIHRoaXMubGVuZ3RoIC0gc3VmZml4Lmxlbmd0aCkgIT09IC0xO1xuICAgIH07XG5cbiAgICBpZiAoJGxvY2F0aW9uLnBhdGgoKS5lbmRzV2l0aChcIi90ZXh0XCIpKSB7XG4gICAgICB2YXIgdGV4dCA9IG1lZXRpbmcudGl0bGUgKyBcIlxcblxcblwiICsgKG1lZXRpbmcuZGVzY3JpcHRpb24gPyBtZWV0aW5nLmRlc2NyaXB0aW9uICsgXCJcXG5cXG5cIiA6IFwiXCIpO1xuXG4gICAgICBpZiAobWVldGluZy5hdHRlbmRhbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGV4dCArPSBcIkF0dGVuZGFudHM6XFxuXCI7XG5cbiAgICAgICAgbWVldGluZy5hdHRlbmRhbnRzLnNvcnQoKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1lZXRpbmcuYXR0ZW5kYW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRleHQgKz0gJHNjb3BlLmdldE1lbWJlcihtZWV0aW5nLmF0dGVuZGFudHNbaV0pLm5hbWUgKyAoaSsxIDwgbWVldGluZy5hdHRlbmRhbnRzLmxlbmd0aCA/IFwiLCBcIiA6IFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRleHQgKz0gXCJcXG5cXG5cIjtcbiAgICAgIH1cblxuICAgICAgVGFnRmFjdG9yeS5UYWcuZ2V0QWxsKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgdmFyIHRhZ3MgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRhZ3MucHVzaChyZXN1bHRbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGFncy5zb3J0KGZ1bmN0aW9uIChvMSwgbzIpIHtcbiAgICAgICAgICByZXR1cm4gbzEubmFtZS5sb2NhbGVDb21wYXJlKG8yLm5hbWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgdG9waWNzID0gbWVldGluZy50b3BpY3MuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgICByZXR1cm4gby50YWdzLmluZGV4T2YodGFnc1tpXS5pZCkgIT0gLTE7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAodG9waWNzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGV4dCArPSB0YWdzW2ldLm5hbWUgKyBcIjpcXG5cIjtcblxuICAgICAgICAgIHRvcGljcy5zb3J0KGZ1bmN0aW9uIChvMSwgbzIpIHtcbiAgICAgICAgICAgIHJldHVybiBvMS5wb3N0ZWQudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlKG8yLnBvc3RlZC50b1N0cmluZygpKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdG9waWNzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB0ZXh0ICs9IFwiICAgIC0gXCIgKyB0b3BpY3Nbal0udGV4dC5yZXBsYWNlKC9cXG4vZywgXCJcXG4gICAgICBcIikgKyBcIlxcblwiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRleHQgKz0gXCJcXG5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5udW1iZXJPZkxpbmVzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgbiA9IDA7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGV4dFtpXSA9PT0gXCJcXG5cIikge1xuICAgICAgICAgICAgICBuKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuICsgMjtcbiAgICAgICAgfSgpKTtcblxuICAgICAgICAkc2NvcGUudGV4dCA9IHRleHQ7XG5cbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgfVxuICB9KTtcblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS50b2dnbGVBdHRlbmRhbnQgPSBmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgdmFyIGluZGV4ID0gJHNjb3BlLm1lZXRpbmcuYXR0ZW5kYW50cy5pbmRleE9mKG1lbWJlcik7XG5cbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAkc2NvcGUubWVldGluZy5hdHRlbmRhbnRzLnB1c2gobWVtYmVyKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkc2NvcGUubWVldGluZy5hdHRlbmRhbnRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS50b2dnbGVBdHRlbmRhbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLm1lbWJlcnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAkc2NvcGUudG9nZ2xlQXR0ZW5kYW50KCRzY29wZS5tZW1iZXJzW2ldLmlkKTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLmdldEF0dGVuZGFudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICRzY29wZS5tZWV0aW5nLmF0dGVuZGFudHMubWFwKGZ1bmN0aW9uIChvKSB7XG4gICAgICByZXR1cm4gJHNjb3BlLmdldE1lbWJlcihvKTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuY3JlYXRlVG9waWMgPSBmdW5jdGlvbiAoa2luZCkge1xuICAgIHZhciB0b3BpYyA9IHtcbiAgICAgIGVkaXRpbmc6IHRydWUsXG4gICAgICBhdXRob3I6ICRzY29wZS5tZS5pZCxcbiAgICAgIHRleHQ6IFwiXCIsXG4gICAgICB0YXJnZXRzOiBbXSxcbiAgICAgIGtpbmQ6IGtpbmQsXG4gICAgICBjbG9zZWQ6IGZhbHNlLFxuICAgICAgcmVzdWx0OiBcIlwiLFxuICAgICAgcG9sbDoge1xuICAgICAgICBraW5kOiBcInRleHRcIixcbiAgICAgICAgb3B0aW9uczogW11cbiAgICAgIH0sXG4gICAgICBkdWVkYXRlOiBudWxsLFxuICAgICAgbWVldGluZ3M6IFskc2NvcGUubWVldGluZy5faWRdLFxuICAgICAgcm9vdDogbnVsbCxcbiAgICAgIHRhZ3M6IFtdLFxuICAgICAgcG9zdGVkOiBuZXcgRGF0ZSgpXG4gICAgfTtcblxuICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5jcmVhdGUodG9waWMsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgdG9waWMuX2lkID0gcmVzcG9uc2UuaWQ7XG4gICAgICAgICRzY29wZS5tZWV0aW5nLnRvcGljcy5wdXNoKHRvcGljKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuYWRkVG9waWMgPSBmdW5jdGlvbiAodG9waWNJZCkge1xuICAgICRzY29wZS5kaXNwbGF5ID0gZmFsc2U7XG5cbiAgICB2YXIgdG9waWMgPSAkc2NvcGUudG9waWNzLmZpbHRlcihmdW5jdGlvbiAobykge1xuICAgICAgcmV0dXJuIG8uX2lkID09PSB0b3BpY0lkO1xuICAgIH0pWzBdO1xuXG4gICAgJHNjb3BlLm1lZXRpbmcudG9waWNzLnB1c2godG9waWMpO1xuXG4gICAgdG9waWMubWVldGluZ3MucHVzaCgkc2NvcGUubWVldGluZy5faWQpO1xuICAgIFRvcGljRmFjdG9yeS5Ub3BpYy51cGRhdGUoe2lkOiB0b3BpYy5faWR9LCB0b3BpYyk7XG4gIH07XG5cbiAgJHNjb3BlLnJlbW92ZVRvcGljID0gZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgJHNjb3BlLm1lZXRpbmcudG9waWNzLnNwbGljZSgkc2NvcGUubWVldGluZy50b3BpY3MuaW5kZXhPZih0b3BpYyksIDEpO1xuXG4gICAgdG9waWMubWVldGluZ3Muc3BsaWNlKHRvcGljLm1lZXRpbmdzLmluZGV4T2YoJHNjb3BlLm1lZXRpbmcuX2lkKSwgMSk7XG4gICAgVG9waWNGYWN0b3J5LlRvcGljLnVwZGF0ZSh7aWQ6IHRvcGljLl9pZH0sIHRvcGljKTtcbiAgfTtcblxuICAkc2NvcGUuc2F2ZU1lZXRpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLnN1Y2Nlc3MgPSBcIlwiO1xuICAgICRzY29wZS5lcnJvciAgID0gXCJcIjtcblxuICAgIGlmICghJHNjb3BlLm1lZXRpbmcudGl0bGUpe1xuICAgICAgJHNjb3BlLmVycm9yID0gXCJQbGVhc2UgZW50ZXIgYSB0aXRsZS5cIjtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBNZWV0aW5nRmFjdG9yeS51cGRhdGUoe2lkOiAkc2NvcGUubWVldGluZy5faWR9LCAkc2NvcGUubWVldGluZywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAkc2NvcGUuc3VjY2VzcyA9IFwiTWVldGluZyBzYXZlZC5cIjtcblxuICAgICAgICBpZiAoJHNjb3BlLnRpbWVvdXQpIHtcbiAgICAgICAgICAkdGltZW91dC5jYW5jZWwoJHNjb3BlLnRpbWVvdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnRpbWVvdXQgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJHNjb3BlLnN1Y2Nlc3MgPSBcIlwiO1xuICAgICAgICB9LCAzMDAwKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIlRoZXJlIHdhcyBhbiBlcnJvci4gUGxlYXNlIGNvbnRhY3QgdGhlIERldiBUZWFtIGFuZCBnaXZlIHRoZW0gdGhlIGRldGFpbHMgYWJvdXQgdGhlIGVycm9yLlwiO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5kZWxldGVNZWV0aW5nID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIG1lZXRpbmc/XCIpKSB7XG4gICAgICBNZWV0aW5nRmFjdG9yeS5kZWxldGUoe2lkOiAkc2NvcGUubWVldGluZy5faWR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIlRoZXJlIHdhcyBhbiBlcnJvci4gUGxlYXNlIGNvbnRhY3QgdGhlIERldiBUZWFtIGFuZCBnaXZlIHRoZW0gdGhlIGRldGFpbHMgYWJvdXQgdGhlIGVycm9yLlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL21lZXRpbmdzL1wiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5kaXNwbGF5ID0gKCRzY29wZS5zZWFyY2hUb3BpYyA/IHRydWUgOiBmYWxzZSk7XG4gIH07XG5cbiAgJHNjb3BlLmFscmVhZHlJbk1lZXRpbmdGaWx0ZXIgPSBmdW5jdGlvbiAodG9waWMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5tZWV0aW5nLnRvcGljcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCRzY29wZS5tZWV0aW5nLnRvcGljc1tpXS5faWQgPT09IHRvcGljLl9pZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiQ3JlYXRlTWVtYmVyQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJGxvY2F0aW9uLCAkcm91dGVQYXJhbXMsIE1lbWJlckZhY3RvcnkpIHtcbiAgXG4gICRzY29wZS5mb3JtRGF0YSA9IHt9O1xuICAkc2NvcGUuZm9ybURhdGEucm9sZXMgPSBbXTtcbiAgJHNjb3BlLmZvcm1EYXRhLnBob25lcyA9IFtdO1xuXG4gICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbWVtYmVyRGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5jcmVhdGUobWVtYmVyRGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL21lbWJlci9cIiArIHJlc3BvbnNlLmlkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxufSk7XG4iLCJyZXF1aXJlKCcuL21lbWJlci5qcycpO1xucmVxdWlyZSgnLi9saXN0LmpzJyk7XG5yZXF1aXJlKCcuL2NyZWF0ZS5qcycpOyIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTWVtYmVyc0NvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgTWVtYmVyRmFjdG9yeSkge1xuICAkc2NvcGUuc2V0U2VhcmNoUm9sZSA9IGZ1bmN0aW9uIChyb2xlSWQpIHtcbiAgICAkc2NvcGUuc2VhcmNoUm9sZXM9cm9sZUlkO1xuICB9O1xuXG4gIE1lbWJlckZhY3RvcnkuTWVtYmVyLmdldEFsbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAkc2NvcGUubWVtYmVyUHJlZGljYXRlID0gXCJuYW1lXCI7XG4gICAgJHNjb3BlLnJldmVyc2UgPSBmYWxzZTtcbiAgICAkc2NvcGUubWVtYmVycyA9IHJlc3BvbnNlO1xuICB9KTtcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJNZW1iZXJDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsICRsb2NhdGlvbiwgTWVtYmVyRmFjdG9yeSkge1xuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICBpZiAoJHJvdXRlUGFyYW1zLmlkID09PSBcIm1lXCIpIHtcbiAgICAkbG9jYXRpb24ucGF0aChcIi9tZW1iZXIvXCIgKyAkc2NvcGUubWUuaWQpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gICRzY29wZS5tZW1iZXIgPSAkc2NvcGUuZm9ybURhdGEgPSAkc2NvcGUuZ2V0TWVtYmVyKCRyb3V0ZVBhcmFtcy5pZCk7XG5cbiAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuZ2V0KHtpZDokcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihyZXN1bHQpIHsgXG4gICAgaWYoIXJlc3VsdC5lcnJvcikge1xuICAgICAgJHNjb3BlLm1lbWJlciA9ICRzY29wZS5mb3JtRGF0YSA9IHJlc3VsdDtcbiAgICAgIGdldE1lbWJlclN0dWZmKCk7XG4gICAgfSBcbiAgfSk7XG5cbiAgZ2V0TWVtYmVyU3R1ZmYoKTtcblxuICBmdW5jdGlvbiBnZXRNZW1iZXJTdHVmZigpIHtcbiAgICBpZigkc2NvcGUuY29tcGFuaWVzICYmICRzY29wZS5zcGVha2VycyAmJiAkc2NvcGUuY29tbWVudHMgJiYgJHNjb3BlLmNvbXBhbmllcy5sZW5ndGggPiAwICYmICRzY29wZS5zcGVha2Vycy5sZW5ndGggPiAwICYmICRzY29wZS5jb21tZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2V0VGltZW91dChnZXRNZW1iZXJTdHVmZiwgMTAwMCk7XG4gICAgfVxuXG4gICAgJHNjb3BlLm1lbWJlci5jb21wYW5pZXMgPSAkc2NvcGUuY29tcGFuaWVzLmZpbHRlcihmdW5jdGlvbihlKSB7XG4gICAgICByZXR1cm4gZS5tZW1iZXIgPT0gJHNjb3BlLm1lbWJlci5pZDtcbiAgICB9KVxuXG4gICAgJHNjb3BlLm1lbWJlci5zcGVha2VycyA9ICRzY29wZS5zcGVha2Vycy5maWx0ZXIoZnVuY3Rpb24oZSkge1xuICAgICAgcmV0dXJuIGUubWVtYmVyID09ICRzY29wZS5tZW1iZXIuaWQ7XG4gICAgfSlcblxuICAgICRzY29wZS5tZW1iZXIuY29tbWVudHMgPSAkc2NvcGUuY29tbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiBlLm1lbWJlciA9PSAkc2NvcGUubWVtYmVyLmlkO1xuICAgIH0pXG4gIH1cblxuXG4gICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbWVtYmVyRGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICBNZW1iZXJGYWN0b3J5Lk1lbWJlci51cGRhdGUoeyBpZDptZW1iZXJEYXRhLmlkIH0sIG1lbWJlckRhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2Uuc3VjY2VzcztcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdTcGVha2VyRW1haWxDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgJGxvY2F0aW9uLCBFbWFpbEZhY3RvcnkpIHtcbiAgICAkc2NvcGUuZW1haWwgPSAkbG9jYXRpb24uc2VhcmNoKCkuZW1haWw7XG4gICAgJHNjb3BlLnNwZWFrZXJJZCA9ICRyb3V0ZVBhcmFtcy5pZDtcbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgJHNjb3BlLm1lc3NhZ2UgPSBudWxsO1xuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAgICRzY29wZS5tZXNzYWdlID0gbnVsbDtcblxuICAgICAgY29uc29sZS5sb2coXCJzZW5kIGVtYWlsIHRvIFwiLCAkc2NvcGUuZW1haWwsIFwiIGZyb20gXCIsICRzY29wZS5zcGVha2VySWQpO1xuXG4gICAgICBFbWFpbEZhY3RvcnkuU3BlYWtlci5zZW5kKHsgaWQ6ICRzY29wZS5zcGVha2VySWQgfSwgeyBlbWFpbDogJHNjb3BlLmVtYWlsIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbiBcbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDcmVhdGVTcGVha2VyQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgU3BlYWtlckZhY3RvcnkpIHtcbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc3BlYWtlckRhdGEgPSB0aGlzLmZvcm1EYXRhO1xuXG4gICAgICBzcGVha2VyRGF0YS5zdGF0dXMgPSAnU3VnZ2VzdGlvbic7XG5cbiAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuY3JlYXRlKHNwZWFrZXJEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcblxuICAgICAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKGZ1bmN0aW9uIChzcGVha2Vycykge1xuICAgICAgICAgICAgJHNjb3BlLnNwZWFrZXJzID0gc3BlYWtlcnM7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgXG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvc3BlYWtlci9cIiArIHJlc3BvbnNlLmlkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJTcGVha2VyRW1iZWRDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxuICAkc2NvcGUubWUgPSBKU09OLnBhcnNlKCRzY29wZS5tZUpzb24pO1xuICAkc2NvcGUubWVtYmVycyA9IEpTT04ucGFyc2UoJHNjb3BlLm1lbWJlcnNKc29uKTtcbiAgJHNjb3BlLnJvbGVzID0gSlNPTi5wYXJzZSgkc2NvcGUucm9sZXNKc29uKTtcblxuICBpZigkc2NvcGUuY29tbWVudHMpIHtcbiAgICAkc2NvcGUuc3BlYWtlci5jb21tZW50cyA9ICRzY29wZS5jb21tZW50cy5maWx0ZXIoZnVuY3Rpb24oZSkge1xuICAgICAgcmV0dXJuIGUudGhyZWFkID09ICdzcGVha2VyLScrJHNjb3BlLnNwZWFrZXIuaWQ7XG4gICAgfSlcbiAgfVxuXG4gICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICB2YXIgbWVtYmVyID0gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xuICAgIH0pO1xuXG4gICAgaWYobWVtYmVyLmxlbmd0aD4wKSB7XG4gICAgICByZXR1cm4gbWVtYmVyWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBcIk5vIG9uZVwiLFxuICAgICAgICBmYWNlYm9vazogXCIxMDAwMDA0NTYzMzU5NzJcIlxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG59KTtcbiIsInJlcXVpcmUoJy4vc3BlYWtlci5qcycpO1xucmVxdWlyZSgnLi9saXN0LmpzJyk7XG5yZXF1aXJlKCcuL2NyZWF0ZS5qcycpO1xucmVxdWlyZSgnLi9jb25maXJtLmpzJyk7XG5yZXF1aXJlKCcuL2VtYmVkLmpzJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdTcGVha2Vyc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHNjZSwgU3BlYWtlckZhY3RvcnksIE1lbWJlckZhY3RvcnkpIHtcbiAgXG4gICAgJHNjb3BlLmxpbWl0ID0gMTA7XG5cbiAgICAkc2NvcGUuc3RhdHVzZXMgPSBbJ1N1Z2dlc3Rpb24nLCdTZWxlY3RlZCcsJ0FwcHJvdmVkJywnQ29udGFjdGVkJywnSW4gQ29udmVyc2F0aW9ucycsJ0FjY2VwdGVkJywnUmVqZWN0ZWQnLCdHaXZlIFVwJ107XG5cbiAgICAkc2NvcGUuc3BlYWtlclByZWRpY2F0ZSA9ICd1cGRhdGVkJztcbiAgICAkc2NvcGUucmV2ZXJzZSA9ICd0cnVlJztcbiAgICBcbiAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmdldEFsbChmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLnNwZWFrZXJzID0gcmVzcG9uc2U7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc2Nyb2xsID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJHNjb3BlLmxpbWl0IDw9ICRzY29wZS5zcGVha2Vycy5sZW5ndGgpXG4gICAgICAgICRzY29wZS5saW1pdCArPSAxMDtcbiAgICB9O1xuICB9KTtcbiAgIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignU3BlYWtlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCBTcGVha2VyRmFjdG9yeSwgTWVtYmVyRmFjdG9yeSwgTm90aWZpY2F0aW9uRmFjdG9yeSkge1xuICAgICRzY29wZS50cnVzdFNyYyA9IGZ1bmN0aW9uKHNyYykge1xuICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKHNyYysnI3BhZ2UtYm9keScpO1xuICAgIH1cblxuICAgICRzY29wZS5jb252ZXJ0RW1haWxzID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgdmFyIG1haWxFeHAgPSAvW1xcd1xcLlxcLV0rXFxAKFtcXHdcXC1dK1xcLikrW1xcd117Miw0fSg/IVtePF0qPikvaWc7XG4gICAgICB2YXIgdHdpdHRlckV4cCA9IC8oXnxbXkBcXHddKUAoXFx3ezEsMTV9KVxcYi9nO1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShtYWlsRXhwLFwiPGEgaHJlZj0nIy9jb21wYW55L1wiKyRyb3V0ZVBhcmFtcy5pZCtcIi9jb25maXJtP2VtYWlsPSQmJz4kJjwvYT5cIikucmVwbGFjZSh0d2l0dGVyRXhwLFwiJDE8YSBocmVmPSdodHRwOi8vdHdpdHRlci5jb20vJDInIHRhcmdldD0nX2JsYW5rJz5AJDI8L2E+XCIpXG4gICAgfVxuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNwZWFrZXJEYXRhID0gdGhpcy5mb3JtRGF0YTtcblxuICAgICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci51cGRhdGUoeyBpZDpzcGVha2VyRGF0YS5pZCB9LCBzcGVha2VyRGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLnN1Y2Nlc3M7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKHNwZWFrZXIpIHtcbiAgICAgIHZhciByb2xlcyA9ICRzY29wZS5tZS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcbiAgICAgIH0pO1xuXG4gICAgICBpZihyb2xlcy5sZW5ndGggPT0gMCAmJiAoc3BlYWtlci5zdGF0dXMgPT0gJ1N1Z2dlc3Rpb24nIHx8IHNwZWFrZXIuc3RhdHVzID09ICdTZWxlY3RlZCcpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgICRzY29wZS5zdGF0dXNlcyA9IFsnU3VnZ2VzdGlvbicsJ1NlbGVjdGVkJywnQXBwcm92ZWQnLCdDb250YWN0ZWQnLCdJbiBDb252ZXJzYXRpb25zJywnQWNjZXB0ZWQnLCdSZWplY3RlZCcsJ0dpdmUgVXAnXTtcblxuICAgICRzY29wZS5zcGVha2VyID0gJHNjb3BlLmZvcm1EYXRhID0gJHNjb3BlLmdldFNwZWFrZXIoJHJvdXRlUGFyYW1zLmlkKTtcblxuICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuZ2V0KHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5zcGVha2VyID0gJHNjb3BlLmZvcm1EYXRhID0gcmVzcG9uc2U7XG5cbiAgICAgIE5vdGlmaWNhdGlvbkZhY3RvcnkuU3BlYWtlci5nZXRBbGwoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihnZXREYXRhKSB7XG4gICAgICAgICRzY29wZS5zcGVha2VyLm5vdGlmaWNhdGlvbnMgPSBnZXREYXRhO1xuXG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9KTtcbiIsInJlcXVpcmUoJy4vbWFuYWdlcicpOyIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiVGFnTWFuYWdlckNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgVGFnRmFjdG9yeSkge1xuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAkc2NvcGUudGFnID0ge307XG5cbiAgJHNjb3BlLmxpZ2h0Q29sb3JzID0gW1wiI2Y3YzZjN1wiLCBcIiNmYWQ4YzdcIiwgXCIjZmVmMmMwXCIsIFwiI2JmZTViZlwiLCBcIiNiZmRhZGNcIiwgXCIjYzdkZWY4XCIsIFwiI2JmZDRmMlwiLCBcIiNkNGM1ZjlcIl07XG4gICRzY29wZS5jb2xvcnMgPSBbXCIjZTExZDIxXCIsIFwiI2ViNjQyMFwiLCBcIiNmYmNhMDRcIiwgXCIjMDA5ODAwXCIsIFwiIzAwNmI3NVwiLCBcIiMyMDdkZTVcIiwgXCIjMDA1MmNjXCIsIFwiIzUzMTllN1wiXTtcblxuICAkc2NvcGUuY2hhbmdlQ29sb3IgPSBmdW5jdGlvbiAoY29sb3IpIHtcbiAgICAkc2NvcGUudGFnLmNvbG9yID0gY29sb3I7XG4gIH07XG5cbiAgJHNjb3BlLmNyZWF0ZVRhZyA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgICBUYWdGYWN0b3J5LlRhZy5jcmVhdGUodGFnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICRzY29wZS50YWdzLnB1c2gocmVzcG9uc2UudGFnKTtcbiAgICAgICAgJHNjb3BlLnRhZyA9IHt9O1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5zYXZlVGFnID0gZnVuY3Rpb24gKHRhZykge1xuICAgIFRhZ0ZhY3RvcnkuVGFnLnVwZGF0ZSh7aWQ6IHRhZy5pZH0sIHRhZywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICB0YWcuZWRpdGluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5kZWxldGVUYWcgPSBmdW5jdGlvbiAodGFnKSB7XG4gICAgVGFnRmFjdG9yeS5UYWcuZGVsZXRlKHtpZDogdGFnLmlkfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAkc2NvcGUudGFncy5zcGxpY2UoJHNjb3BlLnRhZ3MuaW5kZXhPZih0YWcpLCAxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIlRvcGljRW1iZWRDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUsIFRvcGljRmFjdG9yeSwgTm90aWZpY2F0aW9uRmFjdG9yeSkge1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICRzY29wZS5lcnJvciAgICAgICA9IFwiXCI7XG4gICRzY29wZS5zaG93VGFyZ2V0cyA9IGZhbHNlO1xuXG4gICRzY29wZS5wb2xsS2luZHMgPSBbXCJ0ZXh0XCIsIFwiaW1hZ2VzXCJdO1xuXG4gIGlmICgkc2NvcGUuY29tbWVudHMpIHtcbiAgICAkc2NvcGUudG9waWMuY29tbWVudHMgPSAkc2NvcGUuY29tbWVudHMuZmlsdGVyKGZ1bmN0aW9uIChlKSB7XG4gICAgICByZXR1cm4gZS50aHJlYWQgPT0gXCJ0b3BpYy1cIiArICRzY29wZS50b3BpYy5faWQ7XG4gICAgfSk7XG4gIH1cblxuICBzaG93KCRzY29wZS50b3BpYyk7XG5cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUFVWEZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBzaG93KHRvcGljKSB7XG4gICAgdG9waWMuc2hvdyA9IHtcbiAgICAgIHRleHQgICAgIDogdHJ1ZSxcbiAgICAgIHRhcmdldHMgIDogdHJ1ZSxcbiAgICAgIHBvbGwgICAgIDogZmFsc2UsXG4gICAgICBkdWVkYXRlICA6IGZhbHNlLFxuICAgICAgbWVldGluZyAgOiB0cnVlLFxuICAgICAgY2xvc2VkICAgOiBmYWxzZVxuICAgIH07XG5cbiAgICBpZiAodG9waWMua2luZCA9PT0gXCJUbyBkb1wiKSB7XG4gICAgICB0b3BpYy5zaG93LmR1ZWRhdGUgPSB0cnVlO1xuICAgICAgdG9waWMuc2hvdy5jbG9zZWQgID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAodG9waWMua2luZCA9PT0gXCJEZWNpc2lvblwiKSB7XG4gICAgICB0b3BpYy5zaG93LmR1ZWRhdGUgPSB0cnVlO1xuICAgICAgdG9waWMuc2hvdy5jbG9zZWQgID0gdHJ1ZTtcbiAgICAgIHRvcGljLnNob3cucG9sbCA9IHRydWU7XG4gICAgfVxuXG4gICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAodG9waWMpIHtcbiAgICBpZighJHNjb3BlLm1lLnJvbGVzKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcbiAgICB9KTtcblxuICAgIGlmKHJvbGVzLmxlbmd0aCA9PSAwICYmIHRvcGljLmF1dGhvciAhPSAkc2NvcGUubWUuaWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLmRlbGV0ZVRvcGljID0gZnVuY3Rpb24odG9waWMpIHtcbiAgICBpZiAoY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyB0b3BpYz9cIikpIHtcbiAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5kZWxldGUoe2lkOiB0b3BpYy5faWR9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRvcGljLmRlbGV0ZWQgPSB0cnVlO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS50b2dnbGVUYWcgPSBmdW5jdGlvbih0YWcpIHtcbiAgICB2YXIgaW5kZXggPSAkc2NvcGUudG9waWMudGFncy5pbmRleE9mKHRhZyk7XG5cbiAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICRzY29wZS50b3BpYy50YWdzLnB1c2godGFnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkc2NvcGUudG9waWMudGFncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuZ2V0VGFnSWNvbiA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgICByZXR1cm4gKCRzY29wZS50b3BpYy50YWdzLmluZGV4T2YodGFnLmlkKSAhPT0gLTEgPyBcImNoZWNrXCIgOiBcInRpbWVzXCIpOztcbiAgfTtcblxuICAkc2NvcGUudG9nZ2xlVGFyZ2V0ID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgdmFyIGluZGV4ID0gJHNjb3BlLnRvcGljLnRhcmdldHMuaW5kZXhPZih0YXJnZXQpO1xuXG4gICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAkc2NvcGUudG9waWMudGFyZ2V0cy5wdXNoKHRhcmdldCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgJHNjb3BlLnRvcGljLnRhcmdldHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnRvZ2dsZUFsbFRhcmdldHMgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS5tZW1iZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgJHNjb3BlLnRvZ2dsZVRhcmdldCgkc2NvcGUubWVtYmVyc1tpXS5pZCk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS50b2dnbGVSb2xlVGFyZ2V0cyA9IGZ1bmN0aW9uKHJvbGVJZCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLm1lbWJlcnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICBmb3IodmFyIG8gPSAwOyBvIDwgJHNjb3BlLm1lbWJlcnNbaV0ucm9sZXMubGVuZ3RoOyBvKyspIHtcbiAgICAgICAgaWYoJHNjb3BlLm1lbWJlcnNbaV0ucm9sZXNbb10uaWQgPT0gcm9sZUlkKSB7XG4gICAgICAgICAgJHNjb3BlLnRvZ2dsZVRhcmdldCgkc2NvcGUubWVtYmVyc1tpXS5pZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnRvZ2dsZVRhcmdldHMgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuc2hvd1RhcmdldHMgPSAhJHNjb3BlLnNob3dUYXJnZXRzO1xuICB9O1xuXG4gICRzY29wZS5nZXRUYXJnZXRDb2xvciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgIHJldHVybiAoJHNjb3BlLnRvcGljLnRhcmdldHMuaW5kZXhPZihtZW1iZXJJZCkgIT09IC0xID8gXCJibHVlXCIgOiBcIlwiKTtcbiAgfTtcblxuICAkc2NvcGUuZm9jdXNPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAkc2NvcGUudG9waWMucG9sbC5vcHRpb25zW2ldLmVkaXRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBvcHRpb24uZWRpdGluZyA9IHRydWU7XG4gIH07XG5cbiAgJHNjb3BlLmFkZE9wdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvcHRpb24gPSB7XG4gICAgICBvcHRpb25UeXBlOiBcIkluZm9cIixcbiAgICAgIHRhcmdldHM6IFtdXG4gICAgfTtcblxuICAgICRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnMucHVzaChvcHRpb24pO1xuXG4gICAgJHNjb3BlLmZvY3VzT3B0aW9uKG9wdGlvbik7XG4gIH07XG5cbiAgJHNjb3BlLnJlbW92ZU9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnMuc3BsaWNlKCRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnMuaW5kZXhPZihvcHRpb24pLCAxKTtcbiAgfTtcblxuICB0aGlzLnNlbGVjdE9wdGlvbiA9IGZ1bmN0aW9uKHRvcGljLCBvcHRpb24pIHtcbiAgICB2YXIgdXBkYXRlZFRvcGljID0gdG9waWM7XG5cbiAgICBpZihvcHRpb24udm90ZXMuaW5kZXhPZigkc2NvcGUubWUuaWQpICE9IC0xKSB7XG4gICAgICB1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zW3VwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnMuaW5kZXhPZihvcHRpb24pXS52b3Rlcy5zcGxpY2UodXBkYXRlZFRvcGljLnBvbGwub3B0aW9uc1t1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zLmluZGV4T2Yob3B0aW9uKV0udm90ZXMuaW5kZXhPZigkc2NvcGUubWUuaWQpLDEpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHVwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnNbdXBkYXRlZFRvcGljLnBvbGwub3B0aW9ucy5pbmRleE9mKG9wdGlvbildLnZvdGVzLnB1c2goJHNjb3BlLm1lLmlkKTtcbiAgICB9XG5cbiAgICBUb3BpY0ZhY3RvcnkuVG9waWMudXBkYXRlKHtpZDogdXBkYXRlZFRvcGljLl9pZH0sIHVwZGF0ZWRUb3BpYywgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVGhlcmUgd2FzIGFuIGVycm9yLiBQbGVhc2UgY29udGFjdCB0aGUgRGV2IFRlYW0gYW5kIGdpdmUgdGhlbSB0aGUgZGV0YWlscyBhYm91dCB0aGUgZXJyb3IuXCIpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdWNjZXNzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgICRzY29wZS5lcnJvciA9IFwiXCI7XG5cbiAgICBUb3BpY0ZhY3RvcnkuVG9waWMudXBkYXRlKHtpZDogdG9waWMuX2lkfSwgdG9waWMsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgdG9waWMuZWRpdGluZyA9ICF0b3BpYy5lZGl0aW5nO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICRzY29wZS5lcnJvciA9IFwiVGhlcmUgd2FzIGFuIGVycm9yLiBQbGVhc2UgY29udGFjdCB0aGUgRGV2IFRlYW0gYW5kIGdpdmUgdGhlbSB0aGUgZGV0YWlscyBhYm91dCB0aGUgZXJyb3IuXCI7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLnJlYWQgPSBmdW5jdGlvbiAodG9waWMpIHtcbiAgICBpZiAoISRzY29wZS5ub3RpZmljYXRpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJHNjb3BlLm5vdGlmaWNhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgICByZXR1cm4gby50aHJlYWQgPT09IFwidG9waWMtXCIgKyB0b3BpYy5faWQ7XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICB2YXIgaW5kZXggPSBub3RpZmljYXRpb24udW5yZWFkLmluZGV4T2YoJHNjb3BlLm1lLmlkKTtcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgbm90aWZpY2F0aW9uLnVucmVhZC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBOb3RpZmljYXRpb25GYWN0b3J5Lk5vdGlmaWNhdGlvbi51cGRhdGUoe2lkOiBub3RpZmljYXRpb24uX2lkfSwgbm90aWZpY2F0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgdmFyIG1lbWJlciA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICB9KTtcblxuICAgIGlmKG1lbWJlciAmJiBtZW1iZXIubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIG1lbWJlclswXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBcIk5vIG9uZVwiLFxuICAgICAgICBmYWNlYm9vazogXCIxMDAwMDA0NTYzMzU5NzJcIlxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcbiAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgIHZhciBzdWZmaXggPSBcImFnb1wiO1xuICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgIHN1ZmZpeCA9IFwidG8gZ29cIjtcbiAgICB9XG5cbiAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XG5cbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbW9udGhzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtaW51dGVzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XG4gIH07XG5cbiAgJHNjb3BlLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAodGltZSkge1xuICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lKS50b1VUQ1N0cmluZygpO1xuICB9O1xuXG59KTtcbiIsInJlcXVpcmUoJy4vbGlzdCcpO1xucmVxdWlyZSgnLi90b3BpYycpO1xucmVxdWlyZSgnLi9lbWJlZCcpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJUb3BpY3NDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCBUb3BpY0ZhY3RvcnkpIHtcblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAkc2NvcGUua2luZHMgPSBbXCJJbmZvXCIsIFwiVG8gZG9cIiwgXCJEZWNpc2lvblwiLCBcIklkZWFcIl07XG5cbiAgJHNjb3BlLnNlYXJjaFRvcGljcyA9IHt9O1xuXG4gIFRvcGljRmFjdG9yeS5Ub3BpYy5nZXRBbGwoZ290VG9waWNzKTtcblxuICBmdW5jdGlvbiBnb3RUb3BpY3MgKHRvcGljcykge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCRzY29wZS5sb2FkaW5nKSB7XG4gICAgICAgIGdvdFRvcGljcyh0b3BpY3MpO1xuICAgICAgfVxuICAgIH0sIDEwMDApO1xuXG4gICAgJHNjb3BlLnRvcGljcyA9IHRvcGljcztcblxuICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLnRvcGljcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICRzY29wZS50b3BpY3NbaV0uZmFjZWJvb2sgPSAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgcmV0dXJuICRzY29wZS50b3BpY3NbaV0uYXV0aG9yID09PSBvLmlkO1xuICAgICAgfSlbMF0uZmFjZWJvb2s7XG4gICAgfVxuXG4gICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gICRzY29wZS5zaG93T3BlbiA9IHRydWU7XG4gICRzY29wZS5saW1pdCA9IDY7XG5cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUudGltZSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gJHNjb3BlLnRpbWVTaW5jZShuZXcgRGF0ZShkYXRlKSk7XG4gIH07XG5cbiAgJHNjb3BlLmNyZWF0ZVRvcGljID0gZnVuY3Rpb24oa2luZCkge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICBUb3BpY0ZhY3RvcnkuVG9waWMuY3JlYXRlKHtcbiAgICAgIGF1dGhvcjogJHNjb3BlLm1lLmlkLFxuICAgICAga2luZDoga2luZCxcbiAgICAgIHRhZ3M6IFskc2NvcGUuc2VhcmNoVG9waWNzLnRhZ3NdXG4gICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICBUb3BpY0ZhY3RvcnkuVG9waWMuZ2V0QWxsKGZ1bmN0aW9uICh0b3BpY3MpIHtcbiAgICAgICAgICAkc2NvcGUudG9waWNzID0gdG9waWNzO1xuICAgICAgICAgICRzY29wZS50b3BpY3MuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgICByZXR1cm4gby5faWQgPT0gcmVzcG9uc2UuaWQ7XG4gICAgICAgICAgfSlbMF0uZWRpdGluZyA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5jb3VudCA9IGZ1bmN0aW9uIChvcGVuKSB7XG4gICAgcmV0dXJuICRzY29wZS50b3BpY3MuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgICByZXR1cm4gKG9wZW4gPyAhby5jbG9zZWQgOiBvLmNsb3NlZCk7XG4gICAgfSkubGVuZ3RoO1xuICB9O1xuXG4gICRzY29wZS5zaG93blRvcGljcyA9IGZ1bmN0aW9uIChvcGVuKSB7XG4gICAgcmV0dXJuICRzY29wZS50b3BpY3MuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgICByZXR1cm4gby5lZGl0aW5nIHx8IChvcGVuID8gIW8uY2xvc2VkIDogby5jbG9zZWQpICYmIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkc2NvcGUuc2VhcmNoVG9waWNzLnRhZ3MgJiYgby50YWdzLmluZGV4T2YoJHNjb3BlLnNlYXJjaFRvcGljcy50YWdzKSA9PT0gLTEpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCRzY29wZS5zZWFyY2hUb3BpY3MudGFyZ2V0ICYmIG8udGFyZ2V0cy5pbmRleE9mKCRzY29wZS5zZWFyY2hUb3BpY3MudGFyZ2V0KSA9PT0gLTEpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCRzY29wZS5zZWFyY2hUb3BpY3Mua2luZCAmJiBvLmtpbmQgIT09ICRzY29wZS5zZWFyY2hUb3BpY3Mua2luZCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0oKSk7XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICgkc2NvcGUubGltaXQgPCAkc2NvcGUudG9waWNzLmxlbmd0aClcbiAgICAgICRzY29wZS5saW1pdCArPSAzO1xuICB9O1xuXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignVG9waWNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24sICR3aW5kb3csIFRvcGljRmFjdG9yeSwgTm90aWZpY2F0aW9uRmFjdG9yeSkge1xuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICBUb3BpY0ZhY3RvcnkuVG9waWMuZ2V0KHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgJHNjb3BlLnRvcGljID0gcmVzdWx0O1xuXG4gICAgJHNjb3BlLnRvcGljLnNob3dDb21tZW50cyA9IHRydWU7XG5cbiAgICBOb3RpZmljYXRpb25GYWN0b3J5LlRvcGljLmdldEFsbCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKGdldERhdGEpIHtcbiAgICAgICRzY29wZS50b3BpYy5ub3RpZmljYXRpb25zID0gZ2V0RGF0YTtcblxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB9KTtcbiAgfSk7XG5cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdjb21tZW50QXJlYScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tbWVudC9hcmVhLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0NvbW1lbnRBcmVhQ29udHJvbGxlcicsXG4gICAgICBzY29wZToge1xuICAgICAgICB0aHJlYWQ6ICdAJ1xuICAgICAgfVxuICAgIH07XG4gIH0pIiwicmVxdWlyZSgnLi9hcmVhJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdjb21tdW5pY2F0aW9uQXJlYScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tbXVuaWNhdGlvbi9hcmVhLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0NvbW11bmljYXRpb25BcmVhQ29udHJvbGxlcicsXG4gICAgICBzY29wZToge1xuICAgICAgICB0aHJlYWQ6ICdAJyxcbiAgICAgICAgbWVtYmVyc0pzb246ICdAbWVtYmVycycsXG4gICAgICAgIG1lSnNvbjogJ0BtZScsXG4gICAgICAgIHJvbGVzSnNvbjogJ0Byb2xlcydcbiAgICAgIH1cbiAgICB9O1xuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgnY29tbXVuaWNhdGlvbicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tbXVuaWNhdGlvbi9jb21tdW5pY2F0aW9uLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0NvbW11bmljYXRpb25FbWJlZENvbnRyb2xsZXInLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgY29tbXVuaWNhdGlvbkpzb246ICdAY29tbXVuaWNhdGlvbk9iamVjdCcsXG4gICAgICAgIG1lbWJlcnNKc29uOiAnQG1lbWJlcnMnLFxuICAgICAgICBtZUpzb246ICdAbWUnLFxuICAgICAgICByb2xlc0pzb246ICdAcm9sZXMnXG4gICAgICB9XG4gICAgfTtcbiAgfSkiLCJyZXF1aXJlKCcuL2FyZWEnKTtcbnJlcXVpcmUoJy4vY29tbXVuaWNhdGlvbicpOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgnY29tcGFueScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcGFueS9jb21wYW55Lmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0NvbXBhbnlFbWJlZENvbnRyb2xsZXInLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgY29tcGFueTogJz1jb21wYW55T2JqZWN0JyxcbiAgICAgICAgbWVtYmVyc0pzb246ICdAbWVtYmVycycsXG4gICAgICAgIG1lSnNvbjogJ0BtZScsXG4gICAgICAgIHJvbGVzSnNvbjogJ0Byb2xlcycsXG4gICAgICAgIGNvbW1lbnRzOiAnPWNvbW1lbnRzQXJyYXknXG4gICAgICB9XG4gICAgfTtcbiAgfSlcbiIsInJlcXVpcmUoJy4vY29tcGFueScpIiwicmVxdWlyZSgnLi9pbnB1dCcpIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKFxuICAgICdkYXRlSW5wdXQnLFxuICAgIGZ1bmN0aW9uKGRhdGVGaWx0ZXIpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGlucHV0IHR5cGU9XCJkYXRlXCI+PC9pbnB1dD4nLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbG0sIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRmb3JtYXR0ZXJzLnVuc2hpZnQoZnVuY3Rpb24gKG1vZGVsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGVGaWx0ZXIobW9kZWxWYWx1ZSwgJ3l5eXktTU0tZGQnKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRwYXJzZXJzLnVuc2hpZnQoZnVuY3Rpb24odmlld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh2aWV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgfSkiLCJ0aGVUb29sRGlyZWN0aXZlcyA9IGFuZ3VsYXIubW9kdWxlKFwidGhlVG9vbC5kaXJlY3RpdmVzXCIsIFtdKTtcblxucmVxdWlyZShcIi4vY29tbWVudFwiKTtcbnJlcXVpcmUoXCIuL2NvbW11bmljYXRpb25cIik7XG5yZXF1aXJlKFwiLi9jb21wYW55XCIpO1xucmVxdWlyZShcIi4vZGF0ZVwiKTtcbnJlcXVpcmUoXCIuL21hcmtkb3duXCIpO1xucmVxdWlyZShcIi4vbWVldGluZ1wiKTtcbnJlcXVpcmUoXCIuL3NwZWFrZXJcIik7XG5yZXF1aXJlKFwiLi90YWdcIik7XG5yZXF1aXJlKFwiLi90b3BpY1wiKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgnY29tcGlsZScsIFsnJGNvbXBpbGUnLCBmdW5jdGlvbiAoJGNvbXBpbGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIHNjb3BlLiR3YXRjaChcbiAgICAgICAgICBmdW5jdGlvbihzY29wZSkge1xuICAgICAgICAgICAgIC8vIHdhdGNoIHRoZSAnY29tcGlsZScgZXhwcmVzc2lvbiBmb3IgY2hhbmdlc1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlLiRldmFsKGF0dHJzLmNvbXBpbGUpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIC8vIHdoZW4gdGhlICdjb21waWxlJyBleHByZXNzaW9uIGNoYW5nZXNcbiAgICAgICAgICAgIC8vIGFzc2lnbiBpdCBpbnRvIHRoZSBjdXJyZW50IERPTVxuICAgICAgICAgICAgZWxlbWVudC5odG1sKHZhbHVlKTtcblxuICAgICAgICAgICAgLy8gY29tcGlsZSB0aGUgbmV3IERPTSBhbmQgbGluayBpdCB0byB0aGUgY3VycmVudFxuICAgICAgICAgICAgLy8gc2NvcGUuXG4gICAgICAgICAgICAvLyBOT1RFOiB3ZSBvbmx5IGNvbXBpbGUgLmNoaWxkTm9kZXMgc28gdGhhdFxuICAgICAgICAgICAgLy8gd2UgZG9uJ3QgZ2V0IGludG8gaW5maW5pdGUgbG9vcCBjb21waWxpbmcgb3Vyc2VsdmVzXG4gICAgICAgICAgICAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpKHNjb3BlKTtcbiAgICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgfV0pIiwicmVxdWlyZSgnLi9jb21waWxlJyk7XG5yZXF1aXJlKCcuL21hcmtkb3duJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdtYXJrZG93bicsIFsnJGNvbXBpbGUnLCBmdW5jdGlvbiAoJGNvbXBpbGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICB2YXIgaHRtbFRleHQgPSBtYXJrZG93bi50b0hUTUwoZWxlbWVudC50ZXh0KCkpO1xuICAgICAgICAgICAgZWxlbWVudC5odG1sKGh0bWxUZXh0LnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpKTtcbiAgICAgICAgfVxuICAgIH07XG4gIH1dKSIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sRGlyZWN0aXZlcy5kaXJlY3RpdmUoXCJlbWJlZE1lZXRpbmdcIiwgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiBcIkVcIixcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL21lZXRpbmcvZW1iZWQuaHRtbFwiLFxuICAgIGNvbnRyb2xsZXI6IFwiTWVldGluZ0VtYmVkQ29udHJvbGxlclwiLFxuICAgIHNjb3BlOiB7XG4gICAgICBtZWV0aW5nSWQ6IFwiPVwiLFxuICAgICAgbWVtYmVyczogXCI9XCJcbiAgICB9XG4gIH07XG59KTtcbiIsInJlcXVpcmUoXCIuL2VtYmVkXCIpO1xuIiwicmVxdWlyZSgnLi9zcGVha2VyJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdzcGVha2VyJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9zcGVha2VyL3NwZWFrZXIuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnU3BlYWtlckVtYmVkQ29udHJvbGxlcicsXG4gICAgICBzY29wZToge1xuICAgICAgICBzcGVha2VyOiAnPXNwZWFrZXJPYmplY3QnLFxuICAgICAgICBtZW1iZXJzSnNvbjogJ0BtZW1iZXJzJyxcbiAgICAgICAgbWVKc29uOiAnQG1lJyxcbiAgICAgICAgcm9sZXNKc29uOiAnQHJvbGVzJyxcbiAgICAgICAgY29tbWVudHM6ICc9Y29tbWVudHNBcnJheSdcbiAgICAgIH1cbiAgICB9O1xuICB9KVxuIiwiYXJndW1lbnRzWzRdWzM4XVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cykiLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZShcInRhZ01hbmFnZXJcIiwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogXCJFXCIsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdGFnL21hbmFnZXIuaHRtbFwiLFxuICAgICAgY29udHJvbGxlcjogXCJUYWdNYW5hZ2VyQ29udHJvbGxlclwiLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgdGFnczogXCI9dGFnc0FycmF5XCIsXG4gICAgICAgIHNlYXJjaDogXCI9XCJcbiAgICAgIH1cbiAgICB9O1xuICB9KVxuIiwicmVxdWlyZShcIi4vdG9waWNcIik7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbERpcmVjdGl2ZXMuZGlyZWN0aXZlKFwidG9waWNcIiwgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiBcIkVcIixcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3RvcGljL3RvcGljLmh0bWxcIixcbiAgICBjb250cm9sbGVyOiBcIlRvcGljRW1iZWRDb250cm9sbGVyXCIsXG4gICAgc2NvcGU6IHtcbiAgICAgIHRvcGljOiBcIj1cIixcbiAgICAgIG1lbWJlcnM6IFwiPVwiLFxuICAgICAgbWU6IFwiPVwiLFxuICAgICAgcm9sZXM6IFwiPVwiLFxuICAgICAgdGFnczogXCI9XCIsXG4gICAgICBjb21tZW50czogXCI9XCIsXG4gICAgICBub3RpZmljYXRpb25zOiBcIj1cIlxuICAgIH1cbiAgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5maWx0ZXJzJywgW10pXG4gIC5maWx0ZXIoJ2ludGVycG9sYXRlJywgWyd2ZXJzaW9uJywgZnVuY3Rpb24odmVyc2lvbikge1xuICAgIHJldHVybiBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nKHRleHQpLnJlcGxhY2UoL1xcJVZFUlNJT05cXCUvbWcsIHZlcnNpb24pO1xuICAgIH1cbiAgfV0pXG4gIC5maWx0ZXIoJ2ZpbHRlclJvbGUnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obWVtYmVycywgcm9sZSkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSBtZW1iZXJzO1xuICAgICAgICAgIGlmKHJvbGUpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IG1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG0ucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gci5pZCA9PSByb2xlO1xuICAgICAgICAgICAgICB9KS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuICB9KTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnQ2hhdEZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIENoYXQ6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NoYXQvOmlkJywgbnVsbCwge1xuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9XG4gICAgICB9KSxcbiAgICAgIE1lc3NhZ2U6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NoYXQvOmlkL21lc3NhZ2VzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsaXNBcnJheTp0cnVlfVxuICAgICAgfSlcbiAgICB9XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ0NvbW1lbnRGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBDb21tZW50OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21tZW50LzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgQ29tcGFueTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tcGFueS86aWQvY29tbWVudHMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgU3BlYWtlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvc3BlYWtlci86aWQvY29tbWVudHMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgVG9waWM6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3RvcGljLzppZC9jb21tZW50cycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSlcbiAgICB9XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ0NvbW11bmljYXRpb25GYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBDb21tdW5pY2F0aW9uOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21tdW5pY2F0aW9uLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ30sXG4gICAgICAgICdhcHByb3ZlJzoge21ldGhvZDogJ1BPU1QnfVxuICAgICAgfSksXG4gICAgICBDb21wYW55OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21wYW55LzppZC9jb21tdW5pY2F0aW9ucycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSksXG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9zcGVha2VyLzppZC9jb21tdW5pY2F0aW9ucycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSlcbiAgICB9O1xuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdDb21wYW55RmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgQ29tcGFueTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tcGFueS86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9tZW1iZXIvOmlkL2NvbXBhbmllcycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9XG4gICAgICB9KVxuICAgIH07XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ0VtYWlsRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgQ29tcGFueTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvY29tcGFueS86aWQvc2VuZEluaXRpYWxFbWFpbCcsIG51bGwsIHtcbiAgICAgICAgJ3NlbmQnOiB7bWV0aG9kOiAnUE9TVCd9XG4gICAgICB9KSxcbiAgICAgIFNwZWFrZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3NwZWFrZXIvOmlkL3NlbmRJbml0aWFsRW1haWwnLCBudWxsLCB7XG4gICAgICAgICdzZW5kJzoge21ldGhvZDogJ1BPU1QnfVxuICAgICAgfSlcbiAgICB9XG4gIH0pIiwidGhlVG9vbFNlcnZpY2VzID0gYW5ndWxhci5tb2R1bGUoJ3RoZVRvb2wuc2VydmljZXMnLCBbJ25nUmVzb3VyY2UnXSk7XG5cbnJlcXVpcmUoJy4vY2hhdCcpO1xucmVxdWlyZSgnLi9jb21tZW50Jyk7XG5yZXF1aXJlKCcuL2NvbW11bmljYXRpb24nKTtcbnJlcXVpcmUoJy4vY29tcGFueScpO1xucmVxdWlyZSgnLi9lbWFpbCcpO1xucmVxdWlyZSgnLi9tZWV0aW5nJyk7XG5yZXF1aXJlKCcuL21lbWJlcicpO1xucmVxdWlyZSgnLi9tZXNzYWdlJyk7XG5yZXF1aXJlKCcuL25vdGlmaWNhdGlvbicpO1xucmVxdWlyZSgnLi9yb2xlJyk7XG5yZXF1aXJlKCcuL3Nlc3Npb24nKTtcbnJlcXVpcmUoJy4vc29ja2V0Jyk7XG5yZXF1aXJlKCcuL3NwZWFrZXInKTtcbnJlcXVpcmUoJy4vdGFnJyk7XG5yZXF1aXJlKCcuL3RvcGljJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnTWVldGluZ0ZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL21lZXRpbmcvOmlkJywgbnVsbCwge1xuICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICB9KTtcbiAgfSlcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdNZW1iZXJGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBNZW1iZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL21lbWJlci86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgUm9sZTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvcm9sZS86aWQvbWVtYmVycycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSksXG4gICAgICBNZTogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvbXlzZWxmJywgbnVsbCwge1xuICAgICAgICAnZ2V0Jzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IGZhbHNlfVxuICAgICAgfSlcbiAgICB9O1xuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdNZXNzYWdlRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4gJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvbWVzc2FnZS86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiAgICB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXMuZmFjdG9yeSgnTm90aWZpY2F0aW9uRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgcmV0dXJuIHtcbiAgICBOb3RpZmljYXRpb246ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL25vdGlmaWNhdGlvbi86aWQnLCBudWxsLCB7XG4gICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxuICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfVxuICAgIH0pLFxuICAgIENvbXBhbnk6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL2NvbXBhbnkvOmlkL25vdGlmaWNhdGlvbnMnLCBudWxsLCB7XG4gICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgfSksXG4gICAgU3BlYWtlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvc3BlYWtlci86aWQvbm90aWZpY2F0aW9ucycsIG51bGwsIHtcbiAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICB9KSxcbiAgICBUb3BpYzogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvdG9waWMvOmlkL25vdGlmaWNhdGlvbnMnLCBudWxsLCB7XG4gICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgfSlcbiAgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ1JvbGVGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBSb2xlOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9yb2xlLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgIH0pLFxuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9yb2xlLzppZC9tZW1iZXJzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KVxuICAgIH07XG4gIH0pXG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnU2Vzc2lvbkZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFNlc3Npb246ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3Nlc3Npb24vOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfSksXG4gICAgICBDb21wYW55OiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9jb21wYW55LzppZC9zZXNzaW9ucycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSksXG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9zcGVha2VyLzppZC9zZXNzaW9ucycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSlcbiAgICB9XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ1NvY2tldEZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlLCAkbG9jYXRpb24sICRyb290U2NvcGUpIHtcbiAgICB2YXIgc29ja2V0O1xuICAgIHJldHVybiB7XG4gICAgICBjb25uZWN0OiBmdW5jdGlvbihuc3ApIHtcbiAgICAgICAgY29uc29sZS5sb2coc29ja2V0KTtcbiAgICAgICAgc29ja2V0ID0gaW8uY29ubmVjdChuc3AsIHttdWx0aXBsZXg6IGZhbHNlfSk7XG4gICAgICB9LFxuICAgICAgb246IGZ1bmN0aW9uIChldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHNvY2tldC5vbihldmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseShzb2NrZXQsIGFyZ3MpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBlbWl0OiBmdW5jdGlvbiAoZXZlbnROYW1lLCBkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICBzb2NrZXQuZW1pdChldmVudE5hbWUsIGRhdGEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoc29ja2V0LCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZGlzY29ubmVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBzb2NrZXQuZGlzY29ubmVjdCgpO1xuICAgICAgfSxcbiAgICAgIHNvY2tldDogc29ja2V0XG4gICAgfTtcbiAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnU3BlYWtlckZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFNwZWFrZXI6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3NwZWFrZXIvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6dHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KSxcbiAgICAgIE1lbWJlcjogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvbWVtYmVyLzppZC9zcGVha2VycycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9XG4gICAgICB9KVxuICAgIH07XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ1RhZ0ZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFRhZzogJHJlc291cmNlKHVybF9wcmVmaXgrJy9hcGkvdGFnLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgVG9waWM6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3RhZy86aWQvdG9waWNzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KVxuICAgIH07XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ1RvcGljRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgVG9waWM6ICRyZXNvdXJjZSh1cmxfcHJlZml4KycvYXBpL3RvcGljLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UodXJsX3ByZWZpeCsnL2FwaS9tZW1iZXIvOmlkL3RvcGljcycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHsgbWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZSB9XG4gICAgICB9KVxuICAgIH07XG4gIH0pXG4iLCJ1cmxfcHJlZml4ID0gcmVxdWlyZSgnLi8uLi8uLi9jb25maWcnKS51cmw7XG5cbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9hcHAuanMnKTtcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9jb250cm9sbGVycycpO1xucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMnKTtcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9maWx0ZXJzJyk7XG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvc2VydmljZXMnKTsiLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwidXJsXCI6IFwiaHR0cDovL2Rldi5iYW5hbmFtYXJrZXQuZXVcIixcbiAgXCJlbWFpbFwiIDoge1xuICAgIFwidXNlclwiOiBcInRoZXRvb2xzaW5mb1wiLFxuICAgIFwicGFzc3dvcmRcIjogXCJkZXZ0ZWFtZnR3XCIsXG4gICAgXCJob3N0XCI6IFwic210cC5nbWFpbC5jb21cIixcbiAgICBcInNzbFwiOiB0cnVlXG4gIH0sXG4gIFwiY29va2llXCI6IHtcbiAgICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICAgIFwicGFzc3dvcmRcIjogXCI0NG9KMUVvUDBmUjVCS29BbXRERDZDMW1DWnpIVEZZcTlMRHh0MEVnYVJRRkVQNmprRWl4MVhhNTFXcTU5MW5WT1E1ZDNYQWpaV3pJS2xFWUZaZjVWN1JyNTJpbEtQSHhjWkVEdnVwRW9QWTRKRzByZXlZU0tIUjIwNTZWRE12RFVGQ0gyc241NXVOQUtnR2hXZlFyT3RuSWV4Zk82M2ZlQ1lTZGN4R2NkQ0daejg2dlQzYmZKQ2JOWmdGZ1ZJa1RnMmdtM1lGVXh6emdVbURxa2lOZnYyblFjVmZOYVFQMFVhbkViTEtpRWVkcTVvMUI2V3pMWU52YzM3ZXljTXNCXCJcbiAgfSxcbiAgXCJmYWNlYm9va1wiOiB7XG4gICAgXCJhcHBJZFwiOiBcIjQ1NzIwNzUwNzc0NDE1OVwiLFxuICAgIFwiYXBwU2VjcmV0XCI6IFwiOWYwMjdjNTJlMDBiYzNhZGJhYmNkOTI2YTNjOTViOTdcIlxuICB9XG59Il19
