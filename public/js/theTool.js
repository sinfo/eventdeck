(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

angular.module("theTool", [
  "ng",
  "ngRoute",
  "ngSanitize",
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

},{}],3:[function(require,module,exports){
require('./list');
require('./chat');
},{"./chat":2,"./list":4}],4:[function(require,module,exports){
'use strict';

theToolController.controller('ChatsController', function ($scope, ChatFactory) {

  $scope.loading = true;

  ChatFactory.Chat.getAll(function(chats) {
    $scope.chats = chats;
    $scope.loading = false;
  });

});

},{}],5:[function(require,module,exports){
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

    return text.replace(/\n/g, '<br>').replace(urlExp,"<a href='$1'>$1</a>").replace(mailExp,"<a href='/#/company/"+$routeParams.id+"/confirm?email=$&'>$&</a>");
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

},{}],6:[function(require,module,exports){
require('./area.js');

},{"./area.js":5}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
require('./area.js');
require('./list.js');
require('./embed.js');

},{"./area.js":7,"./embed.js":8,"./list.js":10}],10:[function(require,module,exports){
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


},{}],11:[function(require,module,exports){
'use strict';

theToolController
  .controller('CompanyController', function ($scope, $http, $routeParams, $sce, CompanyFactory, MemberFactory, NotificationFactory) {

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src+'#page-body');
    }

    $scope.convertEmails = function(text) {
      var mailExp = /[\w\.\-]+\@([\w\-]+\.)+[\w]{2,4}(?![^<]*>)/ig;
      var twitterExp = /(^|[^@\w])@(\w{1,15})\b/g;
      return text.replace(mailExp,"<a href='/#/company/"+$routeParams.id+"/confirm?email=$&'>$&</a>").replace(twitterExp,"$1<a href='http://twitter.com/$2' target='_blank'>$2</a>")
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
require('./company.js');
require('./list.js');
require('./create.js');
require('./confirm.js');
require('./embed.js');
},{"./company.js":11,"./confirm.js":12,"./create.js":13,"./embed.js":14,"./list.js":16}],16:[function(require,module,exports){
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
  
},{}],17:[function(require,module,exports){
theToolController = angular.module('theTool.controllers', []);

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

},{"./chat":3,"./comment":6,"./communication":9,"./company":15,"./main":19,"./meeting":22,"./member":26,"./speaker":32,"./tag":35,"./topic":38}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
require('./main.js');
require('./home.js');

},{"./home.js":18,"./main.js":20}],20:[function(require,module,exports){
'use strict';

theToolController.controller('MainController', function ($scope, $http, $routeParams, $sce, $location, $rootScope, NotificationFactory, MemberFactory, CompanyFactory, SpeakerFactory, TopicFactory, RoleFactory, TagFactory, CommentFactory) {

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

});

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
require("./embed");
require("./list");
require("./meeting");

},{"./embed":21,"./list":23,"./meeting":24}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
require('./member.js');
require('./list.js');
require('./create.js');
},{"./create.js":25,"./list.js":27,"./member.js":28}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
require('./speaker.js');
require('./list.js');
require('./create.js');
require('./confirm.js');
require('./embed.js');

},{"./confirm.js":29,"./create.js":30,"./embed.js":31,"./list.js":33,"./speaker.js":34}],33:[function(require,module,exports){
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
  
},{}],34:[function(require,module,exports){
'use strict';

theToolController
  .controller('SpeakerController', function ($scope, $http, $routeParams, $sce, SpeakerFactory, MemberFactory, NotificationFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src+'#page-body');
    }

    $scope.convertEmails = function(text) {
      var mailExp = /[\w\.\-]+\@([\w\-]+\.)+[\w]{2,4}(?![^<]*>)/ig;
      var twitterExp = /(^|[^@\w])@(\w{1,15})\b/g;
      return text.replace(mailExp,"<a href='/#/company/"+$routeParams.id+"/confirm?email=$&'>$&</a>").replace(twitterExp,"$1<a href='http://twitter.com/$2' target='_blank'>@$2</a>")
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

},{}],35:[function(require,module,exports){
require('./manager');
},{"./manager":36}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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
        topic.editing = false;
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

},{}],38:[function(require,module,exports){
require('./list');
require('./topic');
require('./embed');

},{"./embed":37,"./list":39,"./topic":40}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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
},{}],42:[function(require,module,exports){
require('./area');
},{"./area":41}],43:[function(require,module,exports){
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
},{}],44:[function(require,module,exports){
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
},{}],45:[function(require,module,exports){
require('./area');
require('./communication');
},{"./area":43,"./communication":44}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
require('./company')
},{"./company":46}],48:[function(require,module,exports){
require('./input')
},{"./input":49}],49:[function(require,module,exports){
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
},{}],50:[function(require,module,exports){
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

},{"./comment":42,"./communication":45,"./company":47,"./date":48,"./markdown":52,"./meeting":55,"./speaker":56,"./tag":58,"./topic":60}],51:[function(require,module,exports){
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
},{}],52:[function(require,module,exports){
require('./compile');
require('./markdown');
},{"./compile":51,"./markdown":53}],53:[function(require,module,exports){
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
},{}],54:[function(require,module,exports){
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

},{}],55:[function(require,module,exports){
require("./embed");

},{"./embed":54}],56:[function(require,module,exports){
require('./speaker');
},{"./speaker":57}],57:[function(require,module,exports){
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

},{}],58:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./manager":59}],59:[function(require,module,exports){
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

},{}],60:[function(require,module,exports){
require("./topic");

},{"./topic":61}],61:[function(require,module,exports){
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

},{}],62:[function(require,module,exports){
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
},{}],63:[function(require,module,exports){
'use strict';

theToolServices
  .factory('ChatFactory', function ($resource) {
    return {
      Chat: $resource('/api/chat/:id', null, {
        'update': {method: 'POST'},
        'getAll': {method: 'GET', isArray:true}
      }),
      Message: $resource('/api/chat/:id/messages', null, {
        'getAll': {method: 'GET',isArray:true}
      })
    }
  })
},{}],64:[function(require,module,exports){
'use strict';

theToolServices
  .factory('CommentFactory', function ($resource) {
    return {
      Comment: $resource('/api/comment/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Company: $resource('/api/company/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Speaker: $resource('/api/speaker/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Topic: $resource('/api/topic/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    }
  })
},{}],65:[function(require,module,exports){
'use strict';

theToolServices
  .factory('CommunicationFactory', function ($resource) {
    return {
      Communication: $resource('/api/communication/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'},
        'approve': {method: 'POST'}
      }),
      Company: $resource('/api/company/:id/communications', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Speaker: $resource('/api/speaker/:id/communications', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    };
  })
},{}],66:[function(require,module,exports){
'use strict';

theToolServices
  .factory('CompanyFactory', function ($resource) {
    return {
      Company: $resource('/api/company/:id', null, {
        'getAll': {method: 'GET', isArray:true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Member: $resource('/api/member/:id/companies', null, {
        'getAll': {method: 'GET', isArray:true}
      })
    };
  })
},{}],67:[function(require,module,exports){
'use strict';

theToolServices
  .factory('EmailFactory', function ($resource) {
    return {
      Company: $resource('/api/company/:id/sendInitialEmail', null, {
        'send': {method: 'POST'}
      }),
      Speaker: $resource('/api/speaker/:id/sendInitialEmail', null, {
        'send': {method: 'POST'}
      })
    }
  })
},{}],68:[function(require,module,exports){
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

},{"./chat":63,"./comment":64,"./communication":65,"./company":66,"./email":67,"./meeting":69,"./member":70,"./message":71,"./notification":72,"./role":73,"./session":74,"./socket":75,"./speaker":76,"./tag":77,"./topic":78}],69:[function(require,module,exports){
'use strict';

theToolServices
  .factory('MeetingFactory', function ($resource) {
    return $resource('/api/meeting/:id', null, {
      'getAll': {method: 'GET', isArray: true},
      'create': {method: 'POST'},
      'update': {method: 'PUT'},
      'delete': {method: 'DELETE'}
    });
  })

},{}],70:[function(require,module,exports){
'use strict';

theToolServices
  .factory('MemberFactory', function ($resource) {
    return {
      Member: $resource('/api/member/:id', null, {
        'getAll': {method: 'GET', isArray:true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Role: $resource('/api/role/:id/members', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Me: $resource('/api/myself', null, {
        'get': {method: 'GET', isArray: false}
      })
    };
  })
},{}],71:[function(require,module,exports){
'use strict';

theToolServices
  .factory('MessageFactory', function ($resource) {
    return $resource('/api/message/:id', null, {
        'getAll':    {method: 'GET', isArray: true}
      })
  })
},{}],72:[function(require,module,exports){
"use strict";

theToolServices.factory("NotificationFactory", function ($resource) {
  return {
    Notification: $resource("/api/notification/:id", null, {
      "getAll": {method: "GET", isArray: true},
      "update": {method: "PUT"}
    }),
    Company: $resource("/api/company/:id/notifications", null, {
      "getAll": {method: "GET", isArray: true}
    }),
    Speaker: $resource("/api/speaker/:id/notifications", null, {
      "getAll": {method: "GET", isArray: true}
    }),
    Topic: $resource("/api/topic/:id/notifications", null, {
      "getAll": {method: "GET", isArray: true}
    })
  };
});

},{}],73:[function(require,module,exports){
'use strict';

theToolServices
  .factory('RoleFactory', function ($resource) {
    return {
      Role: $resource('/api/role/:id', null, {
        'getAll': {method: 'GET', isArray: true},
      }),
      Member: $resource('/api/role/:id/members', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    };
  })

},{}],74:[function(require,module,exports){
'use strict';

theToolServices
  .factory('SessionFactory', function ($resource) {
    return {
      Session: $resource('/api/session/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Company: $resource('/api/company/:id/sessions', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Speaker: $resource('/api/speaker/:id/sessions', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    }
  })
},{}],75:[function(require,module,exports){
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

},{}],76:[function(require,module,exports){
'use strict';

theToolServices
  .factory('SpeakerFactory', function ($resource) {
    return {
      Speaker: $resource('/api/speaker/:id', null, {
        'getAll': {method: 'GET', isArray:true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Member: $resource('/api/member/:id/speakers', null, {
        'getAll': {method: 'GET', isArray:true}
      })
    };
  })
},{}],77:[function(require,module,exports){
'use strict';

theToolServices
  .factory('TagFactory', function ($resource) {
    return {
      Tag: $resource('/api/tag/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Topic: $resource('/api/tag/:id/topics', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    };
  })
},{}],78:[function(require,module,exports){
"use strict";

theToolServices
  .factory("TopicFactory", function ($resource) {
    return {
      Topic: $resource("/api/topic/:id", null, {
        "getAll": {method: "GET", isArray: true},
        "create": {method: "POST"},
        "update": {method: "PUT"},
        "delete": {method: "DELETE"}
      }),
      Member: $resource("/api/member/:id/topics", null, {
        "getAll": { method: "GET", isArray: true }
      })
    };
  })

},{}],79:[function(require,module,exports){
url_prefix = 'http://tool.bananamarket.eu/';

require('./angularApp/app.js');
require('./angularApp/controllers');
require('./angularApp/directives');
require('./angularApp/filters');
require('./angularApp/services');
},{"./angularApp/app.js":1,"./angularApp/controllers":17,"./angularApp/directives":50,"./angularApp/filters":62,"./angularApp/services":68}]},{},[79])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2FwcC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY2hhdC9jaGF0LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jaGF0L2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jaGF0L2xpc3QuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW1lbnQvYXJlYS5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbWVudC9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbXVuaWNhdGlvbi9hcmVhLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tdW5pY2F0aW9uL2VtYmVkLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tdW5pY2F0aW9uL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tdW5pY2F0aW9uL2xpc3QuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvY29tcGFueS5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9jb25maXJtLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21wYW55L2NyZWF0ZS5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9lbWJlZC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9saXN0LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWFpbi9ob21lLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tYWluL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tYWluL21haW4uanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lZXRpbmcvZW1iZWQuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lZXRpbmcvaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lZXRpbmcvbGlzdC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVldGluZy9tZWV0aW5nLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvY3JlYXRlLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lbWJlci9saXN0LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvbWVtYmVyLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2NvbmZpcm0uanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvY3JlYXRlLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2VtYmVkLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2xpc3QuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvc3BlYWtlci5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdGFnL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90YWcvbWFuYWdlci5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdG9waWMvZW1iZWQuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3RvcGljL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90b3BpYy9saXN0LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90b3BpYy90b3BpYy5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9jb21tZW50L2FyZWEuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbWVudC9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9jb21tdW5pY2F0aW9uL2FyZWEuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbXVuaWNhdGlvbi9jb21tdW5pY2F0aW9uLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbW11bmljYXRpb24vaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tcGFueS9jb21wYW55LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbXBhbnkvaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvZGF0ZS9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9kYXRlL2lucHV0LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21hcmtkb3duL2NvbXBpbGUuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWFya2Rvd24vaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWFya2Rvd24vbWFya2Rvd24uanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWVldGluZy9lbWJlZC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9tZWV0aW5nL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3NwZWFrZXIvaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvc3BlYWtlci9zcGVha2VyLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3RhZy9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy90YWcvbWFuYWdlci5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy90b3BpYy9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy90b3BpYy90b3BpYy5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZmlsdGVycy9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvY2hhdC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvY29tbWVudC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvY29tbXVuaWNhdGlvbi5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvY29tcGFueS5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvZW1haWwuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9tZWV0aW5nLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9tZW1iZXIuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL21lc3NhZ2UuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL25vdGlmaWNhdGlvbi5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvcm9sZS5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvc2Vzc2lvbi5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvc2luZm8vdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvc29ja2V0LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9zcGVha2VyLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy90YWcuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL3NpbmZvL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL3RvcGljLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9zaW5mby90aGUtdG9vbC9jbGllbnRBcHAvanMvdGhlVG9vbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelBBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTs7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBOztBQ0RBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyLm1vZHVsZShcInRoZVRvb2xcIiwgW1xuICBcIm5nXCIsXG4gIFwibmdSb3V0ZVwiLFxuICBcIm5nU2FuaXRpemVcIixcbiAgXCJpbmZpbml0ZS1zY3JvbGxcIixcbiAgXCJsdWVnZy5kaXJlY3RpdmVzXCIsXG4gIFwibmdBdWRpb1wiLFxuICBcInRoZVRvb2wuZmlsdGVyc1wiLFxuICBcInRoZVRvb2wuc2VydmljZXNcIixcbiAgXCJ0aGVUb29sLmRpcmVjdGl2ZXNcIixcbiAgXCJ0aGVUb29sLmNvbnRyb2xsZXJzXCJcbl0pLlxuY29uZmlnKFtcIiRyb3V0ZVByb3ZpZGVyXCIsIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvXCIgICAgICAgICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvaG9tZS5odG1sXCIsICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJob21lXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW5pZXMvXCIgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2xpc3QuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbmllc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbmllcy90YWJsZS9cIiAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbXBhbnkvdGFibGUuaHRtbFwiLCAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ29tcGFuaWVzQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tcGFuaWVzL2J1ZGdldC9cIiAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tcGFueS9idWRnZXQuaHRtbFwiLCAgICAgICAgY29udHJvbGxlcjogXCJDb21wYW5pZXNDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW55L1wiICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2NyZWF0ZS5odG1sXCIsICAgICAgICBjb250cm9sbGVyOiBcIkNyZWF0ZUNvbXBhbnlDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW55LzppZFwiICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L3ZpZXcuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbnlDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW55LzppZC9lZGl0XCIgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2VkaXQuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbnlDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW55LzppZC9wYXJ0aWNpcGF0aW9uXCIsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L3BhcnRpY2lwYXRpb24uaHRtbFwiLCBjb250cm9sbGVyOiBcIkNvbXBhbnlDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW55LzppZC9jb25maXJtXCIgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L2NvbmZpcm0uaHRtbFwiLCAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbnlFbWFpbENvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbW1lbnQvOmlkL2VkaXRcIiAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbW1lbnQvZWRpdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ29tbWVudENvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL3NwZWFrZXJzL1wiICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3NwZWFrZXIvbGlzdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiU3BlYWtlcnNDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2Vycy90YWJsZS9cIiAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zcGVha2VyL3RhYmxlLmh0bWxcIiwgICAgICAgICBjb250cm9sbGVyOiBcIlNwZWFrZXJzQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvc3BlYWtlci9cIiAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9jcmVhdGUuaHRtbFwiLCAgICAgICAgY29udHJvbGxlcjogXCJDcmVhdGVTcGVha2VyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvc3BlYWtlci86aWRcIiAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci92aWV3Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJTcGVha2VyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvc3BlYWtlci86aWQvZWRpdFwiICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9lZGl0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJTcGVha2VyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvc3BlYWtlci86aWQvY29uZmlybVwiICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci9jb25maXJtLmh0bWxcIiwgICAgICAgY29udHJvbGxlcjogXCJTcGVha2VyRW1haWxDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZW1iZXJzL1wiICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZW1iZXIvbGlzdC5odG1sXCIsICAgICAgICAgICBjb250cm9sbGVyOiBcIk1lbWJlcnNDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZW1iZXIvXCIgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZW1iZXIvY3JlYXRlLmh0bWxcIiwgICAgICAgICBjb250cm9sbGVyOiBcIkNyZWF0ZU1lbWJlckNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lbWJlci86aWRcIiAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lbWJlci92aWV3Lmh0bWxcIiwgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVtYmVyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVtYmVyLzppZC9lZGl0XCIgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVtYmVyL2VkaXQuaHRtbFwiLCAgICAgICAgICAgY29udHJvbGxlcjogXCJNZW1iZXJDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZWV0aW5nc1wiICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZWV0aW5nL2xpc3QuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIk1lZXRpbmdzQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVldGluZy86aWRcIiAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy92aWV3Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJNZWV0aW5nQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVldGluZy86aWQvdGV4dFwiICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy90ZXh0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJNZWV0aW5nQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVldGluZy86aWQvZWRpdFwiICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy9lZGl0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJNZWV0aW5nQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY2hhdHNcIiAgICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY2hhdC9saXN0Lmh0bWxcIiwgICAgICAgICAgICAgY29udHJvbGxlcjogXCJDaGF0c0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NoYXQvOmlkXCIgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NoYXQvdmlldy5odG1sXCIsICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ2hhdENvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL3RvcGljc1wiICAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3RvcGljL2xpc3QuaHRtbFwiLCAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiVG9waWNzQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvdG9waWMvOmlkXCIgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvdG9waWMvdmlldy5odG1sXCIsICAgICAgICAgICAgY29udHJvbGxlcjogXCJUb3BpY0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbW11bmljYXRpb25zXCIgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbW11bmljYXRpb24vbGlzdC5odG1sXCIsICAgIGNvbnRyb2xsZXI6IFwiQ29tbXVuaWNhdGlvbnNDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIub3RoZXJ3aXNlKHtyZWRpcmVjdFRvOiBcIi9cIn0pO1xufV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKCdDaGF0Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsIG5nQXVkaW8sIFNvY2tldEZhY3RvcnksIE1lc3NhZ2VGYWN0b3J5LCBDaGF0RmFjdG9yeSwgTWVtYmVyRmFjdG9yeSkge1xuXG4gICRzY29wZS5lcnJvciA9IHt9O1xuXG4gICRzY29wZS5sb2FkaW5nICA9IHRydWU7XG4gICRzY29wZS5tZXNzYWdlcyA9IFtdO1xuICAkc2NvcGUub25saW5lICAgPSBbXTtcblxuICBjb25zb2xlLmxvZyhcIkNvbm5lY3RpbmdcIik7XG5cbiAgaWYoU29ja2V0RmFjdG9yeS5zb2NrZXQpe1xuICAgIGNvbnNvbGUubG9nKCk7XG4gIH1cbiAgU29ja2V0RmFjdG9yeS5jb25uZWN0KCcvY2hhdCcpO1xuXG4gIC8qc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgIGlmKCFTb2NrZXRGYWN0b3J5LnNvY2tldC5jb25uZWN0ZWQpe1xuICAgICAgU29ja2V0RmFjdG9yeS5jb25uZWN0KCcvY2hhdCcpO1xuICAgIH1cbiAgfSwgMzAwMCk7Ki9cblxuICBTb2NrZXRGYWN0b3J5Lm9uKCdjb25uZWN0ZWQnLCBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIFNvY2tldEZhY3RvcnkuZW1pdCgnYXV0aCcsIHtpZDogJHJvdXRlUGFyYW1zLmlkLCB1c2VyOiAkc2NvcGUubWUuaWR9LCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZygnQXV0aCBzdWNjZXNzJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIFNvY2tldEZhY3Rvcnkub24oJ3ZhbGlkYXRpb24nLCBmdW5jdGlvbiAocmVzdWx0KXtcbiAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgIGlmKCFyZXN1bHQuZXJyKXtcbiAgICAgICRzY29wZS5jaGF0ICAgICA9IHJlc3VsdC5jaGF0RGF0YTtcbiAgICAgICRzY29wZS5tZXNzYWdlcyA9IHJlc3VsdC5tZXNzYWdlcztcbiAgICAgICRzY29wZS5yb29tICAgICA9IHJlc3VsdC5yb29tO1xuXG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmNoYXQubWVtYmVycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICRzY29wZS5vbmxpbmUucHVzaCh7bWVtYmVyOiAkc2NvcGUuY2hhdC5tZW1iZXJzW2ldLCBvbjogZmFsc2V9KTtcbiAgICAgICAgaWYocmVzdWx0Lm9ubGluZS5pbmRleE9mKCRzY29wZS5jaGF0Lm1lbWJlcnNbaV0pICE9IC0xKXtcbiAgICAgICAgICAkc2NvcGUub25saW5lW2ldLm9uID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUub25saW5lW2ldLm5hbWUgPSAkc2NvcGUuZ2V0TWVtYmVyKCRzY29wZS5vbmxpbmVbaV0ubWVtYmVyKS5uYW1lO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coJHNjb3BlLm9ubGluZSk7XG5cbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3VsdC5tZXNzYWdlKTtcbiAgICB9XG4gICAgJHNjb3BlLmxvYWRpbmcgID0gZmFsc2U7XG4gIH0pO1xuXG4gIFNvY2tldEZhY3Rvcnkub24oJ3VzZXI6Y29ubmVjdGVkJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBjb25zb2xlLmxvZyhcIlVzZXIgY29ubmVjdGVkOiBcIiArIGRhdGEuaWQpO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUub25saW5lLmxlbmd0aDsgaSsrKXtcbiAgICAgIGlmKCRzY29wZS5vbmxpbmVbaV0ubWVtYmVyID09PSBkYXRhLmlkKXtcbiAgICAgICAgJHNjb3BlLm9ubGluZVtpXS5vbiA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgU29ja2V0RmFjdG9yeS5vbigndXNlcjpkaXNjb25uZWN0ZWQnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGNvbnNvbGUubG9nKFwiVXNlciBjb25uZWN0ZWQ6IFwiICsgZGF0YS5pZCk7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5vbmxpbmUubGVuZ3RoOyBpKyspe1xuICAgICAgaWYoJHNjb3BlLm9ubGluZVtpXS5tZW1iZXIgPT09IGRhdGEuaWQpe1xuICAgICAgICAkc2NvcGUub25saW5lW2ldLm9uID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgU29ja2V0RmFjdG9yeS5vbignbWVzc2FnZScsIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgY29uc29sZS5sb2cobWVzc2FnZS5kYXRlKTtcbiAgICAkc2NvcGUubWVzc2FnZXMucHVzaChtZXNzYWdlKTtcblxuICAgIGlmKG1lc3NhZ2UubWVtYmVyICE9IG1lLmlkKSB7XG4gICAgICBuZ0F1ZGlvLnBsYXkoXCJhdWRpby9tZXNzYWdlLm1wM1wiKTtcbiAgICB9XG4gIH0pO1xuXG4gICRzY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZyhcIk9uIGxvY2F0aW9uIGNoYW5nZVwiKTtcbiAgICBjb25zb2xlLmxvZyhTb2NrZXRGYWN0b3J5KTtcbiAgICBTb2NrZXRGYWN0b3J5LmRpc2Nvbm5lY3QoKTtcbiAgICBkZWxldGUgU29ja2V0RmFjdG9yeS5zb2NrZXQ7XG4gIH0pO1xuXG4gICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoJHNjb3BlLnRleHQgPT0gXCJcIil7XG4gICAgICAvLyRzY29wZS5lbXB0eSA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG1lc3NhZ2VEYXRhID0ge1xuICAgICAgdGV4dCAgIDogJHNjb3BlLnRleHQsXG4gICAgICBjaGF0SWQgOiAkcm91dGVQYXJhbXMuaWQsXG4gICAgICBtZW1iZXIgOiAkc2NvcGUubWUuaWQsXG4gICAgfVxuICAgIGNvbnNvbGUubG9nKG1lc3NhZ2VEYXRhKTtcblxuICAgIFNvY2tldEZhY3RvcnkuZW1pdCgnc2VuZCcsIHtyb29tOiAkc2NvcGUucm9vbSwgbWVzc2FnZTogbWVzc2FnZURhdGEgfSwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZygnTWVzc2FnZSBzZW50Jyk7XG4gICAgICAkc2NvcGUudGV4dCA9IFwiXCI7XG4gICAgfSk7XG4gIH07XG59KTtcbiIsInJlcXVpcmUoJy4vbGlzdCcpO1xucmVxdWlyZSgnLi9jaGF0Jyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKCdDaGF0c0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBDaGF0RmFjdG9yeSkge1xuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICBDaGF0RmFjdG9yeS5DaGF0LmdldEFsbChmdW5jdGlvbihjaGF0cykge1xuICAgICRzY29wZS5jaGF0cyA9IGNoYXRzO1xuICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gIH0pO1xuXG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiQ29tbWVudEFyZWFDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsIE1lbWJlckZhY3RvcnksIENvbW1lbnRGYWN0b3J5KSB7XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICRzY29wZS5jb21tZW50RGF0YSA9IHtcbiAgICBtYXJrZG93bjogXCJcIlxuICB9O1xuXG4gIE1lbWJlckZhY3RvcnkuTWVtYmVyLmdldCh7aWQ6IFwibWVcIn0sIGZ1bmN0aW9uIChtZSkge1xuICAgICRzY29wZS5tZSA9IG1lO1xuICB9KTtcblxuICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXRBbGwoZnVuY3Rpb24gKG1lbWJlcnMpIHtcbiAgICAkc2NvcGUubWVtYmVycyA9IG1lbWJlcnM7XG4gIH0pO1xuXG4gIGxvYWRDb21tZW50cygpO1xuXG4gIGZ1bmN0aW9uIGxvYWRDb21tZW50cygpIHtcbiAgICBpZiAoJHNjb3BlLnRocmVhZC5zcGxpdChcIi1cIilbMV0gPT09IFwiXCIpIHtcbiAgICAgIHNldFRpbWVvdXQobG9hZENvbW1lbnRzLCA1MDApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBwYWdlSWQgPSAkc2NvcGUudGhyZWFkLnN1YnN0cmluZygkc2NvcGUudGhyZWFkLmluZGV4T2YoXCItXCIpICsgMSk7XG5cbiAgICBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiY29tcGFueS1cIikgIT0gLTEpIHtcbiAgICAgIENvbW1lbnRGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKHtpZDogcGFnZUlkfSwgZ290Q29tbWVudHMpO1xuICAgIH1cbiAgICBlbHNlIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJzcGVha2VyLVwiKSAhPSAtMSkge1xuICAgICAgQ29tbWVudEZhY3RvcnkuU3BlYWtlci5nZXRBbGwoe2lkOiBwYWdlSWR9LCBnb3RDb21tZW50cyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCRzY29wZS50aHJlYWQuaW5kZXhPZihcInRvcGljLVwiKSAhPSAtMSkge1xuICAgICAgQ29tbWVudEZhY3RvcnkuVG9waWMuZ2V0QWxsKHtpZDogcGFnZUlkfSwgZ290Q29tbWVudHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdvdENvbW1lbnRzKGNvbW1lbnRzKSB7XG4gICAgICAkc2NvcGUuY29tbWVudHMgPSBjb21tZW50cztcblxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAkc2NvcGUucG9zdENvbW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biA9PT0gXCJcIil7XG4gICAgICAkc2NvcGUuZW1wdHlDb21tZW50ID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZGF0ZSA9IERhdGUubm93KCk7XG4gICAgQ29tbWVudEZhY3RvcnkuQ29tbWVudC5jcmVhdGUoe1xuICAgICAgdGhyZWFkOiAkc2NvcGUudGhyZWFkLFxuICAgICAgbWVtYmVyOiAkc2NvcGUubWUuaWQsXG4gICAgICBtYXJrZG93bjogJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duLFxuICAgICAgaHRtbDogJHNjb3BlLmNvbnZlcnRNYXJrZG93blRvSHRtbCgkc2NvcGUuY29tbWVudERhdGEubWFya2Rvd24pLFxuICAgICAgcG9zdGVkOiBkYXRlLFxuICAgICAgdXBkYXRlZDogZGF0ZVxuICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duID0gXCJcIjtcbiAgICAgIGxvYWRDb21tZW50cygpO1xuICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLnNhdmVDb21tZW50ID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgICBpZiAoY29tbWVudC5idWZmZXIgPT09IFwiXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb21tZW50Lm1hcmtkb3duID0gY29tbWVudC5idWZmZXI7XG4gICAgY29tbWVudC5odG1sID0gJHNjb3BlLmNvbnZlcnRNYXJrZG93blRvSHRtbChjb21tZW50Lm1hcmtkb3duKTtcbiAgICBjb21tZW50LnVwZGF0ZWQgPSBEYXRlLm5vdygpO1xuXG4gICAgQ29tbWVudEZhY3RvcnkuQ29tbWVudC51cGRhdGUoe2lkOiBjb21tZW50Ll9pZH0sIGNvbW1lbnQsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgY29tbWVudC5lZGl0aW5nID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICAkc2NvcGUucXVvdGVDb21tZW50ID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgICAkc2NvcGUuY29tbWVudERhdGEubWFya2Rvd24gPSBcIj4gKipcIiArICRzY29wZS5nZXRNZW1iZXIoY29tbWVudC5tZW1iZXIpLm5hbWUgKyBcIiBzYWlkOioqXFxuPiBcIiArIGNvbW1lbnQubWFya2Rvd24uc3BsaXQoXCJcXG5cIikuam9pbihcIlxcbj4gXCIpICsgXCJcXG5cXG5cIjtcbiAgfTtcblxuICAkc2NvcGUuZGVsZXRlQ29tbWVudCA9IGZ1bmN0aW9uIChjb21tZW50KSB7XG4gICAgaWYgKGNvbmZpcm0oXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgY29tbWVudD9cIikpIHtcbiAgICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQuZGVsZXRlKHtpZDogY29tbWVudC5faWR9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxvYWRDb21tZW50cygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gICRzY29wZS5jb252ZXJ0VGV4dFRvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcbiAgICB2YXIgbWFpbEV4cCA9IC9bXFx3XFwuXFwtXStcXEAoW1xcd1xcLV0rXFwuKStbXFx3XXsyLDR9KD8hW148XSo+KS9pZztcblxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpLnJlcGxhY2UodXJsRXhwLFwiPGEgaHJlZj0nJDEnPiQxPC9hPlwiKS5yZXBsYWNlKG1haWxFeHAsXCI8YSBocmVmPScvIy9jb21wYW55L1wiKyRyb3V0ZVBhcmFtcy5pZCtcIi9jb25maXJtP2VtYWlsPSQmJz4kJjwvYT5cIik7XG4gIH07XG5cbiAgJHNjb3BlLmNvbnZlcnROZXdMaW5lc1RvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICByZXR1cm4gJzxkaXYgZGF0YS1tYXJrZG93bj4nK3RleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykrJzwvZGl2Pic7XG4gIH07XG5cbiAgJHNjb3BlLmNvbnZlcnRNYXJrZG93blRvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICByZXR1cm4gJzxkaXYgZGF0YS1tYXJrZG93bj4nICsgdGV4dCArICc8L2Rpdj4nO1xuICB9O1xuXG4gICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAoY29tbWVudCkge1xuICAgIGlmKCEkc2NvcGUubWUucm9sZXMpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgIH0pO1xuXG4gICAgaWYocm9sZXMubGVuZ3RoID09IDAgJiYgY29tbWVudC5tZW1iZXIgIT0gJHNjb3BlLm1lLmlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG4gICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgICByZXR1cm4gbmV3IERhdGUodGltZSkudG9VVENTdHJpbmcoKTtcbiAgfTtcblxufSk7XG4iLCJyZXF1aXJlKCcuL2FyZWEuanMnKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiQ29tbXVuaWNhdGlvbkFyZWFDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsIENvbW11bmljYXRpb25GYWN0b3J5KSB7XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YSA9IHtcbiAgICBtYXJrZG93bjogXCJcIlxuICB9O1xuXG4gICRzY29wZS5tZSA9IEpTT04ucGFyc2UoJHNjb3BlLm1lSnNvbik7XG4gICRzY29wZS5tZW1iZXJzID0gSlNPTi5wYXJzZSgkc2NvcGUubWVtYmVyc0pzb24pO1xuICAkc2NvcGUucm9sZXMgPSBKU09OLnBhcnNlKCRzY29wZS5yb2xlc0pzb24pO1xuXG4gIGxvYWRDb21tdW5pY2F0aW9ucygpO1xuXG4gIGZ1bmN0aW9uIGxvYWRDb21tdW5pY2F0aW9ucygpIHtcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICBpZiAoJHNjb3BlLnRocmVhZC5zcGxpdChcIi1cIilbMV0gPT09IFwiXCIpIHtcbiAgICAgIHNldFRpbWVvdXQobG9hZENvbW11bmljYXRpb25zLCA1MDApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBwYWdlSWQgPSAkc2NvcGUudGhyZWFkLnN1YnN0cmluZygkc2NvcGUudGhyZWFkLmluZGV4T2YoXCItXCIpICsgMSk7XG5cbiAgICBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiY29tcGFueS1cIikgIT0gLTEpIHtcbiAgICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKHtpZDogcGFnZUlkfSwgZ290Q29tbXVuaWNhdGlvbnMpO1xuICAgICAgJHNjb3BlLmtpbmRzPVsnRW1haWwgVG8nLCAnRW1haWwgRnJvbScsICdNZWV0aW5nJywgJ1Bob25lIENhbGwnXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwic3BlYWtlci1cIikgIT0gLTEpIHtcbiAgICAgIENvbW11bmljYXRpb25GYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKHtpZDogcGFnZUlkfSwgZ290Q29tbXVuaWNhdGlvbnMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdvdENvbW11bmljYXRpb25zKGNvbW11bmljYXRpb25zKSB7XG4gICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbnMgPSBjb21tdW5pY2F0aW9ucztcblxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgaWYgKCRzY29wZS50aHJlYWQuaW5kZXhPZihcInNwZWFrZXItXCIpICE9IC0xKSB7XG4gICAgICAgIGlmKGNvbW11bmljYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgICAgcmV0dXJuIG8ua2luZC5pbmRleE9mKCdQYXJhZ3JhcGgnKSAhPSAtMTtcbiAgICAgICAgfSkubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAkc2NvcGUua2luZHM9WydFbWFpbCBUbycsICdFbWFpbCBGcm9tJywgJ01lZXRpbmcnLCAnUGhvbmUgQ2FsbCddO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5raW5kcz1bJ0luaXRhbCBFbWFpbCBQYXJhZ3JhcGgnLCdFbWFpbCBUbycsICdFbWFpbCBGcm9tJywgJ01lZXRpbmcnLCAnUGhvbmUgQ2FsbCddO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgJHNjb3BlLnBvc3RDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghJHNjb3BlLmNvbW11bmljYXRpb25EYXRhLmtpbmQgfHwgJHNjb3BlLmNvbW11bmljYXRpb25EYXRhLmtpbmQ9PSBcIlwiKXtcbiAgICAgICRzY29wZS5lbXB0eUNvbW11bmljYXRpb24gPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoISRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0IHx8ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0PT0gXCJcIil7XG4gICAgICAkc2NvcGUuZW1wdHlDb21tdW5pY2F0aW9uID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZGF0ZSA9IERhdGUubm93KCk7XG5cbiAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLmNyZWF0ZSh7XG4gICAgICB0aHJlYWQ6ICRzY29wZS50aHJlYWQsXG4gICAgICBtZW1iZXI6ICRzY29wZS5tZS5pZCxcbiAgICAgIGtpbmQ6ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS5raW5kLFxuICAgICAgdGV4dDogJHNjb3BlLmNvbW11bmljYXRpb25EYXRhLnRleHQsXG4gICAgICBwb3N0ZWQ6IGRhdGUsXG4gICAgICB1cGRhdGVkOiBkYXRlXG4gICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBsb2FkQ29tbXVuaWNhdGlvbnMoKTtcbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS5zYXZlQ29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XG4gICAgaWYgKGNvbW11bmljYXRpb24uYnVmZmVyID09PSBcIlwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29tbXVuaWNhdGlvbi50ZXh0ID0gY29tbXVuaWNhdGlvbi5idWZmZXI7XG4gICAgY29tbXVuaWNhdGlvbi51cGRhdGVkID0gRGF0ZS5ub3coKTtcblxuICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24udXBkYXRlKHtpZDogY29tbXVuaWNhdGlvbi5faWR9LCBjb21tdW5pY2F0aW9uLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGNvbW11bmljYXRpb24uZWRpdGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLmRlbGV0ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uZGVsZXRlKHtpZDogY29tbXVuaWNhdGlvbi5faWR9LCBmdW5jdGlvbiAoKSB7XG4gICAgICBsb2FkQ29tbXVuaWNhdGlvbnMoKTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuYXBwcm92ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uYXBwcm92ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgbnVsbCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBsb2FkQ29tbXVuaWNhdGlvbnMoKTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgcmV0dXJuICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICB9KVswXTtcbiAgfTtcblxuICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgIH0pO1xuXG4gICAgaWYocm9sZXMubGVuZ3RoID09IDAgJiYgY29tbXVuaWNhdGlvbi5tZW1iZXIgIT0gJHNjb3BlLm1lLmlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG4gICRzY29wZS5jb252ZXJ0VVJMcyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcblxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpLnJlcGxhY2UodXJsRXhwLFwiPGEgaHJlZj0nJDEnPiQxPC9hPlwiKTtcbiAgfVxuXG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiQ29tbXVuaWNhdGlvbkVtYmVkQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCBDb21tdW5pY2F0aW9uRmFjdG9yeSkge1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLnN1Y2Nlc3MgICAgID0gXCJcIjtcbiAgJHNjb3BlLmVycm9yICAgICAgID0gXCJcIjtcblxuICAkc2NvcGUuY29tbXVuaWNhdGlvbiA9IEpTT04ucGFyc2UoJHNjb3BlLmNvbW11bmljYXRpb25Kc29uKTtcbiAgJHNjb3BlLmNvbW11bmljYXRpb24uZWRpdGluZyA9IGZhbHNlO1xuICAkc2NvcGUuY29tbXVuaWNhdGlvbi5kZWxldGVkID0gZmFsc2U7XG5cbiAgJHNjb3BlLm1lID0gSlNPTi5wYXJzZSgkc2NvcGUubWVKc29uKTtcbiAgJHNjb3BlLm1lbWJlcnMgPSBKU09OLnBhcnNlKCRzY29wZS5tZW1iZXJzSnNvbik7XG4gICRzY29wZS5yb2xlcyA9IEpTT04ucGFyc2UoJHNjb3BlLnJvbGVzSnNvbik7XG5cblxuICAkc2NvcGUuc2F2ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgIGlmIChjb21tdW5pY2F0aW9uLmJ1ZmZlciA9PT0gXCJcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbW11bmljYXRpb24udGV4dCA9IGNvbW11bmljYXRpb24uYnVmZmVyO1xuICAgIGNvbW11bmljYXRpb24udXBkYXRlZCA9IERhdGUubm93KCk7XG5cbiAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLnVwZGF0ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgY29tbXVuaWNhdGlvbiwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBjb21tdW5pY2F0aW9uLmVkaXRpbmcgPSBmYWxzZTtcbiAgICAgIGNvbW11bmljYXRpb24uYXBwcm92ZWQgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS5kZWxldGVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLmRlbGV0ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLmNvbW11bmljYXRpb24uZGVsZXRlZCA9IHRydWU7XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmFwcHJvdmVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLmFwcHJvdmUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIG51bGwsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmNvbW11bmljYXRpb24uYXBwcm92ZWQgPSB0cnVlO1xuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgIHZhciByb2xlcyA9ICRzY29wZS5tZS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gJ2RldmVsb3BtZW50LXRlYW0nIHx8IG8uaWQgPT0gJ2Nvb3JkaW5hdGlvbic7XG4gICAgfSk7XG5cbiAgICBpZihyb2xlcy5sZW5ndGggPT0gMCAmJiBjb21tdW5pY2F0aW9uLm1lbWJlciAhPSAkc2NvcGUubWUuaWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIGRhdGUpIC8gMTAwMCk7XG5cbiAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XG4gICAgaWYoc2Vjb25kcyA8IDApe1xuICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHNlY29uZHMpO1xuICAgICAgc3VmZml4ID0gJ3RvIGdvJztcbiAgICB9XG5cbiAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XG5cbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbW9udGhzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtaW51dGVzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XG4gIH07XG5cbiAgJHNjb3BlLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAodGltZSkge1xuICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lKS50b1VUQ1N0cmluZygpO1xuICB9O1xuXG4gICRzY29wZS5jb252ZXJ0VVJMcyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcblxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpLnJlcGxhY2UodXJsRXhwLFwiPGEgaHJlZj0nJDEnPiQxPC9hPlwiKTtcbiAgfVxufSk7XG4iLCJyZXF1aXJlKCcuL2FyZWEuanMnKTtcbnJlcXVpcmUoJy4vbGlzdC5qcycpO1xucmVxdWlyZSgnLi9lbWJlZC5qcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignQ29tbXVuaWNhdGlvbnNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsIENvbW11bmljYXRpb25GYWN0b3J5KSB7XG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5nZXRBbGwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbnMgPSByZXNwb25zZTtcbiAgICB9KTtcblxuICAgICRzY29wZS5zaG93T3BlbiA9IHRydWU7XG5cbiAgICAkc2NvcGUuc2hvd25Db21tdW5pY2F0aW9ucyA9IGZ1bmN0aW9uIChzaG93T3Blbikge1xuICAgICAgcmV0dXJuICRzY29wZS5jb21tdW5pY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICByZXR1cm4gKHNob3dPcGVuID8gIW8uYXBwcm92ZWQgOiBvLmFwcHJvdmVkKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDb21wYW55Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsIENvbXBhbnlGYWN0b3J5LCBNZW1iZXJGYWN0b3J5LCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XG5cbiAgICAkc2NvcGUudHJ1c3RTcmMgPSBmdW5jdGlvbihzcmMpIHtcbiAgICAgIHJldHVybiAkc2NlLnRydXN0QXNSZXNvdXJjZVVybChzcmMrJyNwYWdlLWJvZHknKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuY29udmVydEVtYWlscyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHZhciBtYWlsRXhwID0gL1tcXHdcXC5cXC1dK1xcQChbXFx3XFwtXStcXC4pK1tcXHddezIsNH0oPyFbXjxdKj4pL2lnO1xuICAgICAgdmFyIHR3aXR0ZXJFeHAgPSAvKF58W15AXFx3XSlAKFxcd3sxLDE1fSlcXGIvZztcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UobWFpbEV4cCxcIjxhIGhyZWY9Jy8jL2NvbXBhbnkvXCIrJHJvdXRlUGFyYW1zLmlkK1wiL2NvbmZpcm0/ZW1haWw9JCYnPiQmPC9hPlwiKS5yZXBsYWNlKHR3aXR0ZXJFeHAsXCIkMTxhIGhyZWY9J2h0dHA6Ly90d2l0dGVyLmNvbS8kMicgdGFyZ2V0PSdfYmxhbmsnPiQyPC9hPlwiKVxuICAgIH1cblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb21wYW55RGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkudXBkYXRlKHsgaWQ6Y29tcGFueURhdGEuaWQgfSwgY29tcGFueURhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnQ29udGFjdGVkJywnSW4gQ29udmVyc2F0aW9ucycsJ0luIE5lZ290aWF0aW9ucycsJ0Nsb3NlZCBEZWFsJywnUmVqZWN0ZWQnLCdHaXZlIFVwJ107XG4gICAgJHNjb3BlLmxvZ29TaXplcyA9IFtudWxsLCAnUycsJ00nLCdMJ107XG4gICAgJHNjb3BlLnN0YW5kRGF5cyA9IFtudWxsLCAxLDIsMyw0LDVdO1xuICAgICRzY29wZS5wb3N0c051bWJlcnMgPSBbbnVsbCwgMSwyLDMsNCw1XTtcblxuICAgICRzY29wZS5jb21wYW55ID0gJHNjb3BlLmZvcm1EYXRhID0gJHNjb3BlLmdldENvbXBhbnkoJHJvdXRlUGFyYW1zLmlkKTtcblxuICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0KHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5jb21wYW55ID0gJHNjb3BlLmZvcm1EYXRhID0gcmVzcG9uc2U7XG5cbiAgICAgIE5vdGlmaWNhdGlvbkZhY3RvcnkuQ29tcGFueS5nZXRBbGwoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihnZXREYXRhKSB7XG4gICAgICAgICRzY29wZS5jb21wYW55Lm5vdGlmaWNhdGlvbnMgPSBnZXREYXRhO1xuXG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDb21wYW55RW1haWxDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgJGxvY2F0aW9uLCBFbWFpbEZhY3RvcnkpIHtcbiAgICAkc2NvcGUuZW1haWwgPSAkbG9jYXRpb24uc2VhcmNoKCkuZW1haWw7XG4gICAgJHNjb3BlLmNvbXBhbnlJZCA9ICRyb3V0ZVBhcmFtcy5pZDtcbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgJHNjb3BlLm1lc3NhZ2UgPSBudWxsO1xuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAgICRzY29wZS5tZXNzYWdlID0gbnVsbDtcblxuICAgICAgY29uc29sZS5sb2coXCJzZW5kIGVtYWlsIHRvIFwiLCAkc2NvcGUuZW1haWwsIFwiIGZyb20gXCIsICRzY29wZS5jb21wYW55SWQpO1xuXG4gICAgICBFbWFpbEZhY3RvcnkuQ29tcGFueS5zZW5kKHsgaWQ6ICRzY29wZS5jb21wYW55SWQgfSwgeyBlbWFpbDogJHNjb3BlLmVtYWlsIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbiBcbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDcmVhdGVDb21wYW55Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgQ29tcGFueUZhY3RvcnkpIHtcbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29tcGFueURhdGEgPSB0aGlzLmZvcm1EYXRhO1xuXG4gICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmNyZWF0ZShjb21wYW55RGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG4gICAgICAgICAgXG4gICAgICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS5nZXRBbGwoZnVuY3Rpb24gKGNvbXBhbmllcykge1xuICAgICAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IGNvbXBhbmllcztcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL2NvbXBhbnkvXCIgKyByZXNwb25zZS5pZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc3RhdHVzZXMgPSBbJ1N1Z2dlc3Rpb24nLCdDb250YWN0ZWQnLCdJbiBDb252ZXJzYXRpb25zJywnSW4gTmVnb3RpYXRpb25zJywnQ2xvc2VkIERlYWwnLCdSZWplY3RlZCcsJ0dpdmUgVXAnXTtcbiAgfSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJDb21wYW55RW1iZWRDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxuICAkc2NvcGUubWUgPSBKU09OLnBhcnNlKCRzY29wZS5tZUpzb24pO1xuICAkc2NvcGUubWVtYmVycyA9IEpTT04ucGFyc2UoJHNjb3BlLm1lbWJlcnNKc29uKTtcbiAgJHNjb3BlLnJvbGVzID0gSlNPTi5wYXJzZSgkc2NvcGUucm9sZXNKc29uKTtcblxuICBpZigkc2NvcGUuY29tbWVudHMpIHtcbiAgICAkc2NvcGUuY29tcGFueS5jb21tZW50cyA9ICRzY29wZS5jb21tZW50cy5maWx0ZXIoZnVuY3Rpb24oZSkge1xuICAgICAgcmV0dXJuIGUudGhyZWFkID09ICdjb21wYW55LScrJHNjb3BlLmNvbXBhbnkuaWQ7XG4gICAgfSlcbiAgfVxuXG4gICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICB2YXIgbWVtYmVyID0gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xuICAgIH0pO1xuXG4gICAgaWYobWVtYmVyLmxlbmd0aD4wKSB7XG4gICAgICByZXR1cm4gbWVtYmVyWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBcIk5vIG9uZVwiLFxuICAgICAgICBmYWNlYm9vazogXCIxMDAwMDA0NTYzMzU5NzJcIlxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG59KTtcbiIsInJlcXVpcmUoJy4vY29tcGFueS5qcycpO1xucmVxdWlyZSgnLi9saXN0LmpzJyk7XG5yZXF1aXJlKCcuL2NyZWF0ZS5qcycpO1xucmVxdWlyZSgnLi9jb25maXJtLmpzJyk7XG5yZXF1aXJlKCcuL2VtYmVkLmpzJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignQ29tcGFuaWVzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkc2NlLCBDb21wYW55RmFjdG9yeSwgTWVtYmVyRmFjdG9yeSkge1xuICAgICRzY29wZS5zYXZlU3RhdHVzID0gZnVuY3Rpb24oY29tcGFueSkge1xuICAgICAgdmFyIGNvbXBhbnlEYXRhID0gY29tcGFueTtcblxuICAgICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS51cGRhdGUoeyBpZDpjb21wYW55LmlkIH0sIGNvbXBhbnlEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmdldENsYXNzRnJvbVBheW1lbnRTdGF0dXMgPSBmdW5jdGlvbihwYXJ0aWNpcGF0aW9uKSB7XG4gICAgICBpZighcGFydGljaXBhdGlvbikgeyByZXR1cm4gXCJncmV5XCI7IH1cbiAgICAgIGlmKCFwYXJ0aWNpcGF0aW9uLnBheW1lbnQpIHsgcmV0dXJuIFwiZ3JleVwiOyB9XG4gICAgICBpZighcGFydGljaXBhdGlvbi5wYXltZW50LnN0YXR1cykgeyByZXR1cm4gXCJncmV5XCI7IH1cbiAgICAgIHZhciBzdGF0dXMgPSBwYXJ0aWNpcGF0aW9uLnBheW1lbnQuc3RhdHVzLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIGlmKHN0YXR1cy5pbmRleE9mKFwicGFnb1wiKSAhPSAtMSB8fCBzdGF0dXMuaW5kZXhPZihcImVtaXRpZG9cIikgIT0gLTEgfHwgc3RhdHVzLmluZGV4T2YoXCJyZWNpYm8gZW52aWFkb1wiKSAhPSAtMSkgeyByZXR1cm4gXCJsaW1lXCI7IH0gXG4gICAgICBlbHNlIGlmKHN0YXR1cy5pbmRleE9mKFwiZW52aWFkb1wiKSAhPSAtMSkgeyByZXR1cm4gXCJvcmFuZ2VcIjsgfVxuICAgICAgZWxzZSB7IHJldHVybiBcImdyZXlcIjsgfVxuICAgIH1cblxuICAgICRzY29wZS5wYXltZW50U3RhdHVzZXMgPSBbJ0VtaXRpZG8nLCAnUmVjaWJvIEVudmlhZG8nLCAnUGFnbycsICdFbnZpYWRvJ107XG4gIFxuICAgICRzY29wZS5saW1pdCA9IDEwO1xuXG4gICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnQ29udGFjdGVkJywnSW4gQ29udmVyc2F0aW9ucycsJ0luIE5lZ290aWF0aW9ucycsJ0Nsb3NlZCBEZWFsJywnUmVqZWN0ZWQnLCdHaXZlIFVwJ107XG4gICAgXG4gICAgJHNjb3BlLmNvbXBhbnlQcmVkaWNhdGUgPSAndXBkYXRlZCc7XG4gICAgJHNjb3BlLnJldmVyc2UgPSAndHJ1ZSc7XG5cbiAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmdldEFsbChmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLnByZWRpY2F0ZSA9ICd1cGRhdGVkJztcbiAgICAgICRzY29wZS5yZXZlcnNlID0gdHJ1ZTtcbiAgICAgICRzY29wZS5jb21wYW5pZXMgPSByZXNwb25zZTtcbiAgICB9KTtcblxuICAgICRzY29wZS5zY3JvbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgkc2NvcGUubGltaXQgPD0gJHNjb3BlLmNvbXBhbmllcy5sZW5ndGgpXG4gICAgICAgICRzY29wZS5saW1pdCArPSAxMDtcbiAgICB9O1xuICB9KTtcbiAgIiwidGhlVG9vbENvbnRyb2xsZXIgPSBhbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5jb250cm9sbGVycycsIFtdKTtcblxucmVxdWlyZSgnLi9tYWluJyk7XG5yZXF1aXJlKCcuL2NvbXBhbnknKTtcbnJlcXVpcmUoJy4vc3BlYWtlcicpO1xucmVxdWlyZSgnLi9tZW1iZXInKTtcbnJlcXVpcmUoJy4vY29tbWVudCcpO1xucmVxdWlyZSgnLi9tZWV0aW5nJyk7XG5yZXF1aXJlKCcuL2NoYXQnKTtcbnJlcXVpcmUoJy4vdG9waWMnKTtcbnJlcXVpcmUoJy4vY29tbXVuaWNhdGlvbicpO1xucmVxdWlyZSgnLi90YWcnKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiaG9tZVwiLCBmdW5jdGlvbiAoJHNjb3BlLCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAkc2NvcGUubm90aWZpY2F0aW9ucyA9IFtdO1xuICAkc2NvcGUubGltaXQgPSAxMDtcblxuICBOb3RpZmljYXRpb25GYWN0b3J5Lk5vdGlmaWNhdGlvbi5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgJHNjb3BlLm5vdGlmaWNhdGlvbnMgPSByZXNwb25zZTtcbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICB9KTtcblxuICAkc2NvcGUuc2Nyb2xsID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICgkc2NvcGUubGltaXQgPCAkc2NvcGUubm90aWZpY2F0aW9ucy5sZW5ndGgpIHtcbiAgICAgICRzY29wZS5saW1pdCArPSAxMDtcbiAgICB9XG4gIH07XG5cbn0pO1xuIiwicmVxdWlyZSgnLi9tYWluLmpzJyk7XG5yZXF1aXJlKCcuL2hvbWUuanMnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCAkbG9jYXRpb24sICRyb290U2NvcGUsIE5vdGlmaWNhdGlvbkZhY3RvcnksIE1lbWJlckZhY3RvcnksIENvbXBhbnlGYWN0b3J5LCBTcGVha2VyRmFjdG9yeSwgVG9waWNGYWN0b3J5LCBSb2xlRmFjdG9yeSwgVGFnRmFjdG9yeSwgQ29tbWVudEZhY3RvcnkpIHtcblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5yZWFkeSA9IGZhbHNlO1xuXG4gICRzY29wZS5kaXNwbGF5ID0gZmFsc2U7XG5cbiAgJHNjb3BlLnNlYXJjaCA9IHt9O1xuICAkc2NvcGUuc2VhcmNoVG9waWNzID0ge307XG4gICRzY29wZS5zZWFyY2hDb21wYW5pZXMgPSB7fTtcbiAgJHNjb3BlLnNlYXJjaFNwZWFrZXJzID0ge307XG4gICRzY29wZS5zZWFyY2hNZW1iZXJzID0ge307XG5cbiAgJHNjb3BlLm1lID0ge307XG4gICRzY29wZS5tZW1iZXJzID0gW107XG4gICRzY29wZS5jb21wYW5pZXMgPSBbXTtcbiAgJHNjb3BlLnNwZWFrZXJzID0gW107XG4gICRzY29wZS50b3BpY3MgPSBbXTtcbiAgJHNjb3BlLm5vdGlmaWNhdGlvbnMgPSBbXTtcblxuICAkc2NvcGUubm90aWZpY2F0aW9uc0luZm8gPSB7XG4gICAgbnVtYmVyOiAwLFxuICAgIHRleHQ6IFwiIExvYWRpbmcuLi5cIlxuICB9O1xuXG4gIHZhciBmYWN0b3JpZXNSZWFkeSA9IDA7XG5cbiAgTWVtYmVyRmFjdG9yeS5NZS5nZXQoZnVuY3Rpb24gKG1lKSB7XG4gICAgJHNjb3BlLm1lID0gbWU7XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cbiAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuZ2V0QWxsKGZ1bmN0aW9uIChtZW1iZXJzKSB7XG4gICAgJHNjb3BlLm1lbWJlcnMgPSBtZW1iZXJzO1xuICAgIGNhbGxiYWNrKCk7XG4gIH0pO1xuXG4gIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKGZ1bmN0aW9uIChjb21wYW5pZXMpIHtcbiAgICAkc2NvcGUuY29tcGFuaWVzID0gY29tcGFuaWVzO1xuICAgIGNhbGxiYWNrKCk7XG4gIH0pO1xuXG4gIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKGZ1bmN0aW9uIChzcGVha2Vycykge1xuICAgICRzY29wZS5zcGVha2VycyA9IHNwZWFrZXJzO1xuICAgIGNhbGxiYWNrKCk7XG4gIH0pO1xuXG4gIFRvcGljRmFjdG9yeS5Ub3BpYy5nZXRBbGwoZnVuY3Rpb24gKHRvcGljcykge1xuICAgICRzY29wZS50b3BpY3MgPSB0b3BpY3M7XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cbiAgUm9sZUZhY3RvcnkuUm9sZS5nZXRBbGwoZnVuY3Rpb24gKHJvbGVzKSB7XG4gICAgJHNjb3BlLnJvbGVzID0gcm9sZXM7XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cbiAgVGFnRmFjdG9yeS5UYWcuZ2V0QWxsKGZ1bmN0aW9uICh0YWdzKSB7XG4gICAgJHNjb3BlLnRvcGljVGFncyA9IHRhZ3M7XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cbiAgQ29tbWVudEZhY3RvcnkuQ29tbWVudC5nZXRBbGwoZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgJHNjb3BlLmNvbW1lbnRzID0gY29tbWVudHM7XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBjYWxsYmFjaygpIHtcbiAgICBpZiAoKytmYWN0b3JpZXNSZWFkeSA9PSA4KSB7XG4gICAgICAkc2NvcGUucmVhZHkgPSB0cnVlO1xuXG4gICAgICAkc2NvcGUudXBkYXRlKCk7XG5cbiAgICAgIHNldEludGVydmFsKCRzY29wZS51cGRhdGUsIDEwMDAwKTtcblxuICAgICAgJHJvb3RTY29wZS4kb24oXCIkbG9jYXRpb25DaGFuZ2VTdGFydFwiLCBmdW5jdGlvbiAoZXZlbnQsIG5leHQsIGN1cnJlbnQpIHtcbiAgICAgICAgc2V0VGltZW91dCgkc2NvcGUudXBkYXRlLCA1MDApO1xuICAgICAgICAkc2NvcGUuc2VhcmNoLm5hbWUgPSAnJztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVNDT1BFIEZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIE5vdGlmaWNhdGlvbkZhY3RvcnkuTm90aWZpY2F0aW9uLmdldEFsbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5ub3RpZmljYXRpb25zID0gW107XG4gICAgICAkc2NvcGUubm90aWZpY2F0aW9uc0luZm8ubnVtYmVyID0gMDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb25zZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocmVzcG9uc2VbaV0udGFyZ2V0cy5pbmRleE9mKCRzY29wZS5tZS5pZCkgIT0gLTEpIHtcbiAgICAgICAgICBpZiAocmVzcG9uc2VbaV0udW5yZWFkLmluZGV4T2YoJHNjb3BlLm1lLmlkKSAhPSAtMSkge1xuICAgICAgICAgICAgJHNjb3BlLm5vdGlmaWNhdGlvbnNJbmZvLm51bWJlcisrO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkc2NvcGUubm90aWZpY2F0aW9ucy51bnNoaWZ0KHJlc3BvbnNlW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoJHNjb3BlLm5vdGlmaWNhdGlvbnNJbmZvLm51bWJlciA9PSAwKSB7XG4gICAgICAgICRzY29wZS5ub3RpZmljYXRpb25zSW5mby50ZXh0ID0gXCIgTm8gTm90aWZpY2F0aW9uc1wiO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICRzY29wZS5ub3RpZmljYXRpb25zSW5mby50ZXh0ID0gXCIgXCIgKyAkc2NvcGUubm90aWZpY2F0aW9uc0luZm8ubnVtYmVyICsgXCIgTm90aWZpY2F0aW9uXCIgKyAoJHNjb3BlLm5vdGlmaWNhdGlvbnNJbmZvLm51bWJlciA+IDEgPyBcInNcIiA6IFwiXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcbiAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgIHZhciBzdWZmaXggPSAnYWdvJztcbiAgICBpZihzZWNvbmRzIDwgMCl7XG4gICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICBzdWZmaXggPSAndG8gZ28nO1xuICAgIH1cblxuICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcblxuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgZGF5cyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcbiAgfTtcblxuICAkc2NvcGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uICh0aW1lKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHRpbWUpLnRvVVRDU3RyaW5nKCk7XG4gIH07XG5cbiAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgIHZhciBtZW1iZXIgPSAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XG4gICAgfSk7XG5cbiAgICBpZihtZW1iZXIubGVuZ3RoPjApIHtcbiAgICAgIHJldHVybiBtZW1iZXJbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IFwiTm8gb25lXCIsXG4gICAgICAgIGZhY2Vib29rOiBcIjEwMDAwMDQ1NjMzNTk3MlwiXG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5nZXRTcGVha2VyID0gZnVuY3Rpb24gKHNwZWFrZXJJZCkge1xuICAgIHJldHVybiAkc2NvcGUuc3BlYWtlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09IHNwZWFrZXJJZDtcbiAgICB9KVswXTtcbiAgfTtcblxuICAkc2NvcGUuZ2V0Q29tcGFueSA9IGZ1bmN0aW9uIChjb21wYW55SWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLmNvbXBhbmllcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gY29tcGFueUlkO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gICRzY29wZS5nZXRUb3BpYyA9IGZ1bmN0aW9uICh0b3BpY0lkKSB7XG4gICAgcmV0dXJuICRzY29wZS50b3BpY3MuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLl9pZCA9PSB0b3BpY0lkO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gICRzY29wZS5zaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLmRpc3BsYXkgPSAoJHNjb3BlLnNlYXJjaC5uYW1lID8gdHJ1ZSA6IGZhbHNlKTtcbiAgfTtcblxuICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5kaXNwbGF5ID0gZmFsc2U7XG4gIH07XG5cbiAgJHNjb3BlLmNvbnZlcnRVUkxzID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciB1cmxFeHAgPSAvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2lnO1xuXG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykucmVwbGFjZSh1cmxFeHAsXCI8YSBocmVmPSckMSc+JDE8L2E+XCIpO1xuICB9XG5cbiAgJHNjb3BlLmNvbnZlcnROZXdMaW5lc1RvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICByZXR1cm4gJzxkaXYgZGF0YS1tYXJrZG93bj4nK3RleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykrJzwvZGl2Pic7XG4gIH1cblxuICAkc2NvcGUuY29udmVydE1hcmtkb3duVG9IdG1sID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicgKyB0ZXh0ICsgJzwvZGl2Pic7XG4gIH1cblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIk1lZXRpbmdFbWJlZENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgTWVldGluZ0ZhY3RvcnkpIHtcblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICBNZWV0aW5nRmFjdG9yeS5nZXQoe2lkOiAkc2NvcGUubWVldGluZ0lkfSwgZnVuY3Rpb24gKG1lZXRpbmcpIHtcbiAgICAkc2NvcGUubWVldGluZyA9IG1lZXRpbmc7XG5cbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICB9KTtcblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PT0gbWVtYmVySWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbn0pO1xuIiwicmVxdWlyZShcIi4vZW1iZWRcIik7XG5yZXF1aXJlKFwiLi9saXN0XCIpO1xucmVxdWlyZShcIi4vbWVldGluZ1wiKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignTWVldGluZ3NDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2F0aW9uLCBNZWV0aW5nRmFjdG9yeSkge1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gIGluaXQoKTtcblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJHNjb3BlLmxvYWRpbmcpIHtcbiAgICAgICAgaW5pdCgpO1xuICAgICAgfVxuICAgIH0sIDEwMDApO1xuXG4gICAgTWVldGluZ0ZhY3RvcnkuZ2V0QWxsKGZ1bmN0aW9uIChtZWV0aW5ncykge1xuICAgICAgJHNjb3BlLm1lZXRpbmdzID0gbWVldGluZ3M7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLm1lZXRpbmdzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAkc2NvcGUubWVldGluZ3NbaV0uZmFjZWJvb2sgPSAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICAgIHJldHVybiAkc2NvcGUubWVldGluZ3NbaV0uYXV0aG9yID09IG8uaWQ7XG4gICAgICAgIH0pWzBdLmZhY2Vib29rO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUudGltZSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gJHNjb3BlLnRpbWVTaW5jZShuZXcgRGF0ZShkYXRlKSk7XG4gIH07XG5cbiAgJHNjb3BlLmNyZWF0ZU1lZXRpbmcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG5cbiAgICBNZWV0aW5nRmFjdG9yeS5jcmVhdGUoe1xuICAgICAgYXV0aG9yOiAkc2NvcGUubWUuaWQsXG4gICAgICB0aXRsZTogZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoXCJwdC1QVFwiKSArIFwiIC0gTWVldGluZ1wiLFxuICAgICAgZGF0ZTogZGF0ZVxuICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9tZWV0aW5nL1wiICsgcmVzcG9uc2UuaWQgKyBcIi9lZGl0XCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTWVldGluZ0NvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24sICR0aW1lb3V0LCBNZWV0aW5nRmFjdG9yeSwgVG9waWNGYWN0b3J5LCBUYWdGYWN0b3J5KSB7XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUlOSVRJQUxJWkFUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgJHNjb3BlLmtpbmRzID0gW1wiSW5mb1wiLCBcIlRvIGRvXCIsIFwiRGVjaXNpb25cIiwgXCJJZGVhXCJdO1xuXG4gIE1lZXRpbmdGYWN0b3J5LmdldCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uIChtZWV0aW5nKSB7XG4gICAgJHNjb3BlLm1lZXRpbmcgPSBtZWV0aW5nO1xuXG4gICAgU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCA9IGZ1bmN0aW9uIChzdWZmaXgpIHtcbiAgICAgIHJldHVybiB0aGlzLmluZGV4T2Yoc3VmZml4LCB0aGlzLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpICE9PSAtMTtcbiAgICB9O1xuXG4gICAgaWYgKCRsb2NhdGlvbi5wYXRoKCkuZW5kc1dpdGgoXCIvdGV4dFwiKSkge1xuICAgICAgdmFyIHRleHQgPSBtZWV0aW5nLnRpdGxlICsgXCJcXG5cXG5cIiArIChtZWV0aW5nLmRlc2NyaXB0aW9uID8gbWVldGluZy5kZXNjcmlwdGlvbiArIFwiXFxuXFxuXCIgOiBcIlwiKTtcblxuICAgICAgaWYgKG1lZXRpbmcuYXR0ZW5kYW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRleHQgKz0gXCJBdHRlbmRhbnRzOlxcblwiO1xuXG4gICAgICAgIG1lZXRpbmcuYXR0ZW5kYW50cy5zb3J0KCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZWV0aW5nLmF0dGVuZGFudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0ZXh0ICs9ICRzY29wZS5nZXRNZW1iZXIobWVldGluZy5hdHRlbmRhbnRzW2ldKS5uYW1lICsgKGkrMSA8IG1lZXRpbmcuYXR0ZW5kYW50cy5sZW5ndGggPyBcIiwgXCIgOiBcIlwiKTtcbiAgICAgICAgfVxuICAgICAgICB0ZXh0ICs9IFwiXFxuXFxuXCI7XG4gICAgICB9XG5cbiAgICAgIFRhZ0ZhY3RvcnkuVGFnLmdldEFsbChmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIHZhciB0YWdzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0YWdzLnB1c2gocmVzdWx0W2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRhZ3Muc29ydChmdW5jdGlvbiAobzEsIG8yKSB7XG4gICAgICAgICAgcmV0dXJuIG8xLm5hbWUubG9jYWxlQ29tcGFyZShvMi5uYW1lKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHRvcGljcyA9IG1lZXRpbmcudG9waWNzLmZpbHRlcihmdW5jdGlvbiAobykge1xuICAgICAgICAgICAgcmV0dXJuIG8udGFncy5pbmRleE9mKHRhZ3NbaV0uaWQpICE9IC0xO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKHRvcGljcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRleHQgKz0gdGFnc1tpXS5uYW1lICsgXCI6XFxuXCI7XG5cbiAgICAgICAgICB0b3BpY3Muc29ydChmdW5jdGlvbiAobzEsIG8yKSB7XG4gICAgICAgICAgICByZXR1cm4gbzEucG9zdGVkLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZShvMi5wb3N0ZWQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRvcGljcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdGV4dCArPSBcIiAgICAtIFwiICsgdG9waWNzW2pdLnRleHQucmVwbGFjZSgvXFxuL2csIFwiXFxuICAgICAgXCIpICsgXCJcXG5cIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0ZXh0ICs9IFwiXFxuXCI7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUubnVtYmVyT2ZMaW5lcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIG4gPSAwO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRleHRbaV0gPT09IFwiXFxuXCIpIHtcbiAgICAgICAgICAgICAgbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbiArIDI7XG4gICAgICAgIH0oKSk7XG5cbiAgICAgICAgJHNjb3BlLnRleHQgPSB0ZXh0O1xuXG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUudG9nZ2xlQXR0ZW5kYW50ID0gZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHZhciBpbmRleCA9ICRzY29wZS5tZWV0aW5nLmF0dGVuZGFudHMuaW5kZXhPZihtZW1iZXIpO1xuXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgJHNjb3BlLm1lZXRpbmcuYXR0ZW5kYW50cy5wdXNoKG1lbWJlcik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgJHNjb3BlLm1lZXRpbmcuYXR0ZW5kYW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUudG9nZ2xlQXR0ZW5kYW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS5tZW1iZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgJHNjb3BlLnRvZ2dsZUF0dGVuZGFudCgkc2NvcGUubWVtYmVyc1tpXS5pZCk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5nZXRBdHRlbmRhbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkc2NvcGUubWVldGluZy5hdHRlbmRhbnRzLm1hcChmdW5jdGlvbiAobykge1xuICAgICAgcmV0dXJuICRzY29wZS5nZXRNZW1iZXIobyk7XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmNyZWF0ZVRvcGljID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICB2YXIgdG9waWMgPSB7XG4gICAgICBlZGl0aW5nOiB0cnVlLFxuICAgICAgYXV0aG9yOiAkc2NvcGUubWUuaWQsXG4gICAgICB0ZXh0OiBcIlwiLFxuICAgICAgdGFyZ2V0czogW10sXG4gICAgICBraW5kOiBraW5kLFxuICAgICAgY2xvc2VkOiBmYWxzZSxcbiAgICAgIHJlc3VsdDogXCJcIixcbiAgICAgIHBvbGw6IHtcbiAgICAgICAga2luZDogXCJ0ZXh0XCIsXG4gICAgICAgIG9wdGlvbnM6IFtdXG4gICAgICB9LFxuICAgICAgZHVlZGF0ZTogbnVsbCxcbiAgICAgIG1lZXRpbmdzOiBbJHNjb3BlLm1lZXRpbmcuX2lkXSxcbiAgICAgIHJvb3Q6IG51bGwsXG4gICAgICB0YWdzOiBbXSxcbiAgICAgIHBvc3RlZDogbmV3IERhdGUoKVxuICAgIH07XG5cbiAgICBUb3BpY0ZhY3RvcnkuVG9waWMuY3JlYXRlKHRvcGljLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgIHRvcGljLl9pZCA9IHJlc3BvbnNlLmlkO1xuICAgICAgICAkc2NvcGUubWVldGluZy50b3BpY3MucHVzaCh0b3BpYyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmFkZFRvcGljID0gZnVuY3Rpb24gKHRvcGljSWQpIHtcbiAgICAkc2NvcGUuZGlzcGxheSA9IGZhbHNlO1xuXG4gICAgdmFyIHRvcGljID0gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiBvLl9pZCA9PT0gdG9waWNJZDtcbiAgICB9KVswXTtcblxuICAgICRzY29wZS5tZWV0aW5nLnRvcGljcy5wdXNoKHRvcGljKTtcblxuICAgIHRvcGljLm1lZXRpbmdzLnB1c2goJHNjb3BlLm1lZXRpbmcuX2lkKTtcbiAgICBUb3BpY0ZhY3RvcnkuVG9waWMudXBkYXRlKHtpZDogdG9waWMuX2lkfSwgdG9waWMpO1xuICB9O1xuXG4gICRzY29wZS5yZW1vdmVUb3BpYyA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgICRzY29wZS5tZWV0aW5nLnRvcGljcy5zcGxpY2UoJHNjb3BlLm1lZXRpbmcudG9waWNzLmluZGV4T2YodG9waWMpLCAxKTtcblxuICAgIHRvcGljLm1lZXRpbmdzLnNwbGljZSh0b3BpYy5tZWV0aW5ncy5pbmRleE9mKCRzY29wZS5tZWV0aW5nLl9pZCksIDEpO1xuICAgIFRvcGljRmFjdG9yeS5Ub3BpYy51cGRhdGUoe2lkOiB0b3BpYy5faWR9LCB0b3BpYyk7XG4gIH07XG5cbiAgJHNjb3BlLnNhdmVNZWV0aW5nID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5zdWNjZXNzID0gXCJcIjtcbiAgICAkc2NvcGUuZXJyb3IgICA9IFwiXCI7XG5cbiAgICBpZiAoISRzY29wZS5tZWV0aW5nLnRpdGxlKXtcbiAgICAgICRzY29wZS5lcnJvciA9IFwiUGxlYXNlIGVudGVyIGEgdGl0bGUuXCI7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgTWVldGluZ0ZhY3RvcnkudXBkYXRlKHtpZDogJHNjb3BlLm1lZXRpbmcuX2lkfSwgJHNjb3BlLm1lZXRpbmcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgJHNjb3BlLnN1Y2Nlc3MgPSBcIk1lZXRpbmcgc2F2ZWQuXCI7XG5cbiAgICAgICAgaWYgKCRzY29wZS50aW1lb3V0KSB7XG4gICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKCRzY29wZS50aW1lb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS50aW1lb3V0ID0gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRzY29wZS5zdWNjZXNzID0gXCJcIjtcbiAgICAgICAgfSwgMzAwMCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuZGVsZXRlTWVldGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBtZWV0aW5nP1wiKSkge1xuICAgICAgTWVldGluZ0ZhY3RvcnkuZGVsZXRlKHtpZDogJHNjb3BlLm1lZXRpbmcuX2lkfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9tZWV0aW5ncy9cIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAkc2NvcGUuZGlzcGxheSA9ICgkc2NvcGUuc2VhcmNoVG9waWMgPyB0cnVlIDogZmFsc2UpO1xuICB9O1xuXG4gICRzY29wZS5hbHJlYWR5SW5NZWV0aW5nRmlsdGVyID0gZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubWVldGluZy50b3BpY3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICgkc2NvcGUubWVldGluZy50b3BpY3NbaV0uX2lkID09PSB0b3BpYy5faWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNyZWF0ZU1lbWJlckNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCBNZW1iZXJGYWN0b3J5KSB7XG4gIFxuICAkc2NvcGUuZm9ybURhdGEgPSB7fTtcbiAgJHNjb3BlLmZvcm1EYXRhLnJvbGVzID0gW107XG4gICRzY29wZS5mb3JtRGF0YS5waG9uZXMgPSBbXTtcblxuICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1lbWJlckRhdGEgPSB0aGlzLmZvcm1EYXRhO1xuXG4gICAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuY3JlYXRlKG1lbWJlckRhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9tZW1iZXIvXCIgKyByZXNwb25zZS5pZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbn0pO1xuIiwicmVxdWlyZSgnLi9tZW1iZXIuanMnKTtcbnJlcXVpcmUoJy4vbGlzdC5qcycpO1xucmVxdWlyZSgnLi9jcmVhdGUuanMnKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIk1lbWJlcnNDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUsIE1lbWJlckZhY3RvcnkpIHtcbiAgJHNjb3BlLnNldFNlYXJjaFJvbGUgPSBmdW5jdGlvbiAocm9sZUlkKSB7XG4gICAgJHNjb3BlLnNlYXJjaFJvbGVzPXJvbGVJZDtcbiAgfTtcblxuICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXRBbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgJHNjb3BlLm1lbWJlclByZWRpY2F0ZSA9IFwibmFtZVwiO1xuICAgICRzY29wZS5yZXZlcnNlID0gZmFsc2U7XG4gICAgJHNjb3BlLm1lbWJlcnMgPSByZXNwb25zZTtcbiAgfSk7XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTWVtYmVyQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCAkbG9jYXRpb24sIE1lbWJlckZhY3RvcnkpIHtcblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgaWYgKCRyb3V0ZVBhcmFtcy5pZCA9PT0gXCJtZVwiKSB7XG4gICAgJGxvY2F0aW9uLnBhdGgoXCIvbWVtYmVyL1wiICsgJHNjb3BlLm1lLmlkKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAkc2NvcGUubWVtYmVyID0gJHNjb3BlLmZvcm1EYXRhID0gJHNjb3BlLmdldE1lbWJlcigkcm91dGVQYXJhbXMuaWQpO1xuXG4gIE1lbWJlckZhY3RvcnkuTWVtYmVyLmdldCh7aWQ6JHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24ocmVzdWx0KSB7IFxuICAgIGlmKCFyZXN1bHQuZXJyb3IpIHtcbiAgICAgICRzY29wZS5tZW1iZXIgPSAkc2NvcGUuZm9ybURhdGEgPSByZXN1bHQ7XG4gICAgICBnZXRNZW1iZXJTdHVmZigpO1xuICAgIH0gXG4gIH0pO1xuXG4gIGdldE1lbWJlclN0dWZmKCk7XG5cbiAgZnVuY3Rpb24gZ2V0TWVtYmVyU3R1ZmYoKSB7XG4gICAgaWYoJHNjb3BlLmNvbXBhbmllcyAmJiAkc2NvcGUuc3BlYWtlcnMgJiYgJHNjb3BlLmNvbW1lbnRzICYmICRzY29wZS5jb21wYW5pZXMubGVuZ3RoID4gMCAmJiAkc2NvcGUuc3BlYWtlcnMubGVuZ3RoID4gMCAmJiAkc2NvcGUuY29tbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZ2V0TWVtYmVyU3R1ZmYsIDEwMDApO1xuICAgIH1cblxuICAgICRzY29wZS5tZW1iZXIuY29tcGFuaWVzID0gJHNjb3BlLmNvbXBhbmllcy5maWx0ZXIoZnVuY3Rpb24oZSkge1xuICAgICAgcmV0dXJuIGUubWVtYmVyID09ICRzY29wZS5tZW1iZXIuaWQ7XG4gICAgfSlcblxuICAgICRzY29wZS5tZW1iZXIuc3BlYWtlcnMgPSAkc2NvcGUuc3BlYWtlcnMuZmlsdGVyKGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiBlLm1lbWJlciA9PSAkc2NvcGUubWVtYmVyLmlkO1xuICAgIH0pXG5cbiAgICAkc2NvcGUubWVtYmVyLmNvbW1lbnRzID0gJHNjb3BlLmNvbW1lbnRzLmZpbHRlcihmdW5jdGlvbihlKSB7XG4gICAgICByZXR1cm4gZS5tZW1iZXIgPT0gJHNjb3BlLm1lbWJlci5pZDtcbiAgICB9KVxuICB9XG5cblxuICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1lbWJlckRhdGEgPSB0aGlzLmZvcm1EYXRhO1xuXG4gICAgTWVtYmVyRmFjdG9yeS5NZW1iZXIudXBkYXRlKHsgaWQ6bWVtYmVyRGF0YS5pZCB9LCBtZW1iZXJEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLnN1Y2Nlc3M7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignU3BlYWtlckVtYWlsQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsICRsb2NhdGlvbiwgRW1haWxGYWN0b3J5KSB7XG4gICAgJHNjb3BlLmVtYWlsID0gJGxvY2F0aW9uLnNlYXJjaCgpLmVtYWlsO1xuICAgICRzY29wZS5zcGVha2VySWQgPSAkcm91dGVQYXJhbXMuaWQ7XG4gICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuICAgICRzY29wZS5tZXNzYWdlID0gbnVsbDtcblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgICAkc2NvcGUubWVzc2FnZSA9IG51bGw7XG5cbiAgICAgIGNvbnNvbGUubG9nKFwic2VuZCBlbWFpbCB0byBcIiwgJHNjb3BlLmVtYWlsLCBcIiBmcm9tIFwiLCAkc2NvcGUuc3BlYWtlcklkKTtcblxuICAgICAgRW1haWxGYWN0b3J5LlNwZWFrZXIuc2VuZCh7IGlkOiAkc2NvcGUuc3BlYWtlcklkIH0sIHsgZW1haWw6ICRzY29wZS5lbWFpbCB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG4gXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignQ3JlYXRlU3BlYWtlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24sIFNwZWFrZXJGYWN0b3J5KSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNwZWFrZXJEYXRhID0gdGhpcy5mb3JtRGF0YTtcblxuICAgICAgc3BlYWtlckRhdGEuc3RhdHVzID0gJ1N1Z2dlc3Rpb24nO1xuXG4gICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmNyZWF0ZShzcGVha2VyRGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG5cbiAgICAgICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmdldEFsbChmdW5jdGlvbiAoc3BlYWtlcnMpIHtcbiAgICAgICAgICAgICRzY29wZS5zcGVha2VycyA9IHNwZWFrZXJzO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3NwZWFrZXIvXCIgKyByZXNwb25zZS5pZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiU3BlYWtlckVtYmVkQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbiAgJHNjb3BlLm1lID0gSlNPTi5wYXJzZSgkc2NvcGUubWVKc29uKTtcbiAgJHNjb3BlLm1lbWJlcnMgPSBKU09OLnBhcnNlKCRzY29wZS5tZW1iZXJzSnNvbik7XG4gICRzY29wZS5yb2xlcyA9IEpTT04ucGFyc2UoJHNjb3BlLnJvbGVzSnNvbik7XG5cbiAgaWYoJHNjb3BlLmNvbW1lbnRzKSB7XG4gICAgJHNjb3BlLnNwZWFrZXIuY29tbWVudHMgPSAkc2NvcGUuY29tbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiBlLnRocmVhZCA9PSAnc3BlYWtlci0nKyRzY29wZS5zcGVha2VyLmlkO1xuICAgIH0pXG4gIH1cblxuICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgdmFyIG1lbWJlciA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICB9KTtcblxuICAgIGlmKG1lbWJlci5sZW5ndGg+MCkge1xuICAgICAgcmV0dXJuIG1lbWJlclswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogXCJObyBvbmVcIixcbiAgICAgICAgZmFjZWJvb2s6IFwiMTAwMDAwNDU2MzM1OTcyXCJcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcbiAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgIHZhciBzdWZmaXggPSAnYWdvJztcbiAgICBpZihzZWNvbmRzIDwgMCl7XG4gICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICBzdWZmaXggPSAndG8gZ28nO1xuICAgIH1cblxuICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcblxuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgZGF5cyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcbiAgfTtcblxufSk7XG4iLCJyZXF1aXJlKCcuL3NwZWFrZXIuanMnKTtcbnJlcXVpcmUoJy4vbGlzdC5qcycpO1xucmVxdWlyZSgnLi9jcmVhdGUuanMnKTtcbnJlcXVpcmUoJy4vY29uZmlybS5qcycpO1xucmVxdWlyZSgnLi9lbWJlZC5qcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignU3BlYWtlcnNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRzY2UsIFNwZWFrZXJGYWN0b3J5LCBNZW1iZXJGYWN0b3J5KSB7XG4gIFxuICAgICRzY29wZS5saW1pdCA9IDEwO1xuXG4gICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnU2VsZWN0ZWQnLCdBcHByb3ZlZCcsJ0NvbnRhY3RlZCcsJ0luIENvbnZlcnNhdGlvbnMnLCdBY2NlcHRlZCcsJ1JlamVjdGVkJywnR2l2ZSBVcCddO1xuXG4gICAgJHNjb3BlLnNwZWFrZXJQcmVkaWNhdGUgPSAndXBkYXRlZCc7XG4gICAgJHNjb3BlLnJldmVyc2UgPSAndHJ1ZSc7XG4gICAgXG4gICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXRBbGwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5zcGVha2VycyA9IHJlc3BvbnNlO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCRzY29wZS5saW1pdCA8PSAkc2NvcGUuc3BlYWtlcnMubGVuZ3RoKVxuICAgICAgICAkc2NvcGUubGltaXQgKz0gMTA7XG4gICAgfTtcbiAgfSk7XG4gICIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXJcbiAgLmNvbnRyb2xsZXIoJ1NwZWFrZXJDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgU3BlYWtlckZhY3RvcnksIE1lbWJlckZhY3RvcnksIE5vdGlmaWNhdGlvbkZhY3RvcnkpIHtcbiAgICAkc2NvcGUudHJ1c3RTcmMgPSBmdW5jdGlvbihzcmMpIHtcbiAgICAgIHJldHVybiAkc2NlLnRydXN0QXNSZXNvdXJjZVVybChzcmMrJyNwYWdlLWJvZHknKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuY29udmVydEVtYWlscyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHZhciBtYWlsRXhwID0gL1tcXHdcXC5cXC1dK1xcQChbXFx3XFwtXStcXC4pK1tcXHddezIsNH0oPyFbXjxdKj4pL2lnO1xuICAgICAgdmFyIHR3aXR0ZXJFeHAgPSAvKF58W15AXFx3XSlAKFxcd3sxLDE1fSlcXGIvZztcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UobWFpbEV4cCxcIjxhIGhyZWY9Jy8jL2NvbXBhbnkvXCIrJHJvdXRlUGFyYW1zLmlkK1wiL2NvbmZpcm0/ZW1haWw9JCYnPiQmPC9hPlwiKS5yZXBsYWNlKHR3aXR0ZXJFeHAsXCIkMTxhIGhyZWY9J2h0dHA6Ly90d2l0dGVyLmNvbS8kMicgdGFyZ2V0PSdfYmxhbmsnPkAkMjwvYT5cIilcbiAgICB9XG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc3BlYWtlckRhdGEgPSB0aGlzLmZvcm1EYXRhO1xuXG4gICAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLnVwZGF0ZSh7IGlkOnNwZWFrZXJEYXRhLmlkIH0sIHNwZWFrZXJEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2Uuc3VjY2VzcztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAoc3BlYWtlcikge1xuICAgICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgICAgfSk7XG5cbiAgICAgIGlmKHJvbGVzLmxlbmd0aCA9PSAwICYmIChzcGVha2VyLnN0YXR1cyA9PSAnU3VnZ2VzdGlvbicgfHwgc3BlYWtlci5zdGF0dXMgPT0gJ1NlbGVjdGVkJykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnU2VsZWN0ZWQnLCdBcHByb3ZlZCcsJ0NvbnRhY3RlZCcsJ0luIENvbnZlcnNhdGlvbnMnLCdBY2NlcHRlZCcsJ1JlamVjdGVkJywnR2l2ZSBVcCddO1xuXG4gICAgJHNjb3BlLnNwZWFrZXIgPSAkc2NvcGUuZm9ybURhdGEgPSAkc2NvcGUuZ2V0U3BlYWtlcigkcm91dGVQYXJhbXMuaWQpO1xuXG4gICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXQoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLnNwZWFrZXIgPSAkc2NvcGUuZm9ybURhdGEgPSByZXNwb25zZTtcblxuICAgICAgTm90aWZpY2F0aW9uRmFjdG9yeS5TcGVha2VyLmdldEFsbCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKGdldERhdGEpIHtcbiAgICAgICAgJHNjb3BlLnNwZWFrZXIubm90aWZpY2F0aW9ucyA9IGdldERhdGE7XG5cbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gIH0pO1xuIiwicmVxdWlyZSgnLi9tYW5hZ2VyJyk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJUYWdNYW5hZ2VyQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCBUYWdGYWN0b3J5KSB7XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICRzY29wZS50YWcgPSB7fTtcblxuICAkc2NvcGUubGlnaHRDb2xvcnMgPSBbXCIjZjdjNmM3XCIsIFwiI2ZhZDhjN1wiLCBcIiNmZWYyYzBcIiwgXCIjYmZlNWJmXCIsIFwiI2JmZGFkY1wiLCBcIiNjN2RlZjhcIiwgXCIjYmZkNGYyXCIsIFwiI2Q0YzVmOVwiXTtcbiAgJHNjb3BlLmNvbG9ycyA9IFtcIiNlMTFkMjFcIiwgXCIjZWI2NDIwXCIsIFwiI2ZiY2EwNFwiLCBcIiMwMDk4MDBcIiwgXCIjMDA2Yjc1XCIsIFwiIzIwN2RlNVwiLCBcIiMwMDUyY2NcIiwgXCIjNTMxOWU3XCJdO1xuXG4gICRzY29wZS5jaGFuZ2VDb2xvciA9IGZ1bmN0aW9uIChjb2xvcikge1xuICAgICRzY29wZS50YWcuY29sb3IgPSBjb2xvcjtcbiAgfTtcblxuICAkc2NvcGUuY3JlYXRlVGFnID0gZnVuY3Rpb24gKHRhZykge1xuICAgIFRhZ0ZhY3RvcnkuVGFnLmNyZWF0ZSh0YWcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgJHNjb3BlLnRhZ3MucHVzaChyZXNwb25zZS50YWcpO1xuICAgICAgICAkc2NvcGUudGFnID0ge307XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLnNhdmVUYWcgPSBmdW5jdGlvbiAodGFnKSB7XG4gICAgVGFnRmFjdG9yeS5UYWcudXBkYXRlKHtpZDogdGFnLmlkfSwgdGFnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgIHRhZy5lZGl0aW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmRlbGV0ZVRhZyA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgICBUYWdGYWN0b3J5LlRhZy5kZWxldGUoe2lkOiB0YWcuaWR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICRzY29wZS50YWdzLnNwbGljZSgkc2NvcGUudGFncy5pbmRleE9mKHRhZyksIDEpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiVG9waWNFbWJlZENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgVG9waWNGYWN0b3J5LCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUlOSVRJQUxJWkFUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgJHNjb3BlLmVycm9yICAgICAgID0gXCJcIjtcbiAgJHNjb3BlLnNob3dUYXJnZXRzID0gZmFsc2U7XG5cbiAgJHNjb3BlLnBvbGxLaW5kcyA9IFtcInRleHRcIiwgXCJpbWFnZXNcIl07XG5cbiAgaWYgKCRzY29wZS5jb21tZW50cykge1xuICAgICRzY29wZS50b3BpYy5jb21tZW50cyA9ICRzY29wZS5jb21tZW50cy5maWx0ZXIoZnVuY3Rpb24gKGUpIHtcbiAgICAgIHJldHVybiBlLnRocmVhZCA9PSBcInRvcGljLVwiICsgJHNjb3BlLnRvcGljLl9pZDtcbiAgICB9KTtcbiAgfVxuXG4gIHNob3coJHNjb3BlLnRvcGljKTtcblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09QVVYRlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIHNob3codG9waWMpIHtcbiAgICB0b3BpYy5zaG93ID0ge1xuICAgICAgdGV4dCAgICAgOiB0cnVlLFxuICAgICAgdGFyZ2V0cyAgOiB0cnVlLFxuICAgICAgcG9sbCAgICAgOiBmYWxzZSxcbiAgICAgIGR1ZWRhdGUgIDogZmFsc2UsXG4gICAgICBtZWV0aW5nICA6IHRydWUsXG4gICAgICBjbG9zZWQgICA6IGZhbHNlXG4gICAgfTtcblxuICAgIGlmICh0b3BpYy5raW5kID09PSBcIlRvIGRvXCIpIHtcbiAgICAgIHRvcGljLnNob3cuZHVlZGF0ZSA9IHRydWU7XG4gICAgICB0b3BpYy5zaG93LmNsb3NlZCAgPSB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmICh0b3BpYy5raW5kID09PSBcIkRlY2lzaW9uXCIpIHtcbiAgICAgIHRvcGljLnNob3cuZHVlZGF0ZSA9IHRydWU7XG4gICAgICB0b3BpYy5zaG93LmNsb3NlZCAgPSB0cnVlO1xuICAgICAgdG9waWMuc2hvdy5wb2xsID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgJHNjb3BlLmNoZWNrUGVybWlzc2lvbiA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgIGlmKCEkc2NvcGUubWUucm9sZXMpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgIH0pO1xuXG4gICAgaWYocm9sZXMubGVuZ3RoID09IDAgJiYgdG9waWMuYXV0aG9yICE9ICRzY29wZS5tZS5pZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUuZGVsZXRlVG9waWMgPSBmdW5jdGlvbih0b3BpYykge1xuICAgIGlmIChjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIHRvcGljP1wiKSkge1xuICAgICAgVG9waWNGYWN0b3J5LlRvcGljLmRlbGV0ZSh7aWQ6IHRvcGljLl9pZH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdG9waWMuZGVsZXRlZCA9IHRydWU7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnRvZ2dsZVRhZyA9IGZ1bmN0aW9uKHRhZykge1xuICAgIHZhciBpbmRleCA9ICRzY29wZS50b3BpYy50YWdzLmluZGV4T2YodGFnKTtcblxuICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgJHNjb3BlLnRvcGljLnRhZ3MucHVzaCh0YWcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICRzY29wZS50b3BpYy50YWdzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5nZXRUYWdJY29uID0gZnVuY3Rpb24gKHRhZykge1xuICAgIHJldHVybiAoJHNjb3BlLnRvcGljLnRhZ3MuaW5kZXhPZih0YWcuaWQpICE9PSAtMSA/IFwiY2hlY2tcIiA6IFwidGltZXNcIik7O1xuICB9O1xuXG4gICRzY29wZS50b2dnbGVUYXJnZXQgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICB2YXIgaW5kZXggPSAkc2NvcGUudG9waWMudGFyZ2V0cy5pbmRleE9mKHRhcmdldCk7XG5cbiAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICRzY29wZS50b3BpYy50YXJnZXRzLnB1c2godGFyZ2V0KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkc2NvcGUudG9waWMudGFyZ2V0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUudG9nZ2xlQWxsVGFyZ2V0cyA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLm1lbWJlcnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAkc2NvcGUudG9nZ2xlVGFyZ2V0KCRzY29wZS5tZW1iZXJzW2ldLmlkKTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnRvZ2dsZVJvbGVUYXJnZXRzID0gZnVuY3Rpb24ocm9sZUlkKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUubWVtYmVycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgIGZvcih2YXIgbyA9IDA7IG8gPCAkc2NvcGUubWVtYmVyc1tpXS5yb2xlcy5sZW5ndGg7IG8rKykge1xuICAgICAgICBpZigkc2NvcGUubWVtYmVyc1tpXS5yb2xlc1tvXS5pZCA9PSByb2xlSWQpIHtcbiAgICAgICAgICAkc2NvcGUudG9nZ2xlVGFyZ2V0KCRzY29wZS5tZW1iZXJzW2ldLmlkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAkc2NvcGUudG9nZ2xlVGFyZ2V0cyA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5zaG93VGFyZ2V0cyA9ICEkc2NvcGUuc2hvd1RhcmdldHM7XG4gIH07XG5cbiAgJHNjb3BlLmdldFRhcmdldENvbG9yID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgcmV0dXJuICgkc2NvcGUudG9waWMudGFyZ2V0cy5pbmRleE9mKG1lbWJlcklkKSAhPT0gLTEgPyBcImJsdWVcIiA6IFwiXCIpO1xuICB9O1xuXG4gICRzY29wZS5mb2N1c09wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLnRvcGljLnBvbGwub3B0aW9ucy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnNbaV0uZWRpdGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIG9wdGlvbi5lZGl0aW5nID0gdHJ1ZTtcbiAgfTtcblxuICAkc2NvcGUuYWRkT3B0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9wdGlvbiA9IHtcbiAgICAgIG9wdGlvblR5cGU6IFwiSW5mb1wiLFxuICAgICAgdGFyZ2V0czogW11cbiAgICB9O1xuXG4gICAgJHNjb3BlLnRvcGljLnBvbGwub3B0aW9ucy5wdXNoKG9wdGlvbik7XG5cbiAgICAkc2NvcGUuZm9jdXNPcHRpb24ob3B0aW9uKTtcbiAgfTtcblxuICAkc2NvcGUucmVtb3ZlT3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgJHNjb3BlLnRvcGljLnBvbGwub3B0aW9ucy5zcGxpY2UoJHNjb3BlLnRvcGljLnBvbGwub3B0aW9ucy5pbmRleE9mKG9wdGlvbiksIDEpO1xuICB9O1xuXG4gIHRoaXMuc2VsZWN0T3B0aW9uID0gZnVuY3Rpb24odG9waWMsIG9wdGlvbikge1xuICAgIHZhciB1cGRhdGVkVG9waWMgPSB0b3BpYztcblxuICAgIGlmKG9wdGlvbi52b3Rlcy5pbmRleE9mKCRzY29wZS5tZS5pZCkgIT0gLTEpIHtcbiAgICAgIHVwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnNbdXBkYXRlZFRvcGljLnBvbGwub3B0aW9ucy5pbmRleE9mKG9wdGlvbildLnZvdGVzLnNwbGljZSh1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zW3VwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnMuaW5kZXhPZihvcHRpb24pXS52b3Rlcy5pbmRleE9mKCRzY29wZS5tZS5pZCksMSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdXBkYXRlZFRvcGljLnBvbGwub3B0aW9uc1t1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zLmluZGV4T2Yob3B0aW9uKV0udm90ZXMucHVzaCgkc2NvcGUubWUuaWQpO1xuICAgIH1cblxuICAgIFRvcGljRmFjdG9yeS5Ub3BpYy51cGRhdGUoe2lkOiB1cGRhdGVkVG9waWMuX2lkfSwgdXBkYXRlZFRvcGljLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIik7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN1Y2Nlc3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5zYXZlID0gZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgJHNjb3BlLmVycm9yID0gXCJcIjtcblxuICAgIFRvcGljRmFjdG9yeS5Ub3BpYy51cGRhdGUoe2lkOiB0b3BpYy5faWR9LCB0b3BpYywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICB0b3BpYy5lZGl0aW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUucmVhZCA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgIGlmICghJHNjb3BlLm5vdGlmaWNhdGlvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkc2NvcGUubm90aWZpY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiBvLnRocmVhZCA9PT0gXCJ0b3BpYy1cIiArIHRvcGljLl9pZDtcbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcbiAgICAgIHZhciBpbmRleCA9IG5vdGlmaWNhdGlvbi51bnJlYWQuaW5kZXhPZigkc2NvcGUubWUuaWQpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICBub3RpZmljYXRpb24udW5yZWFkLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIE5vdGlmaWNhdGlvbkZhY3RvcnkuTm90aWZpY2F0aW9uLnVwZGF0ZSh7aWQ6IG5vdGlmaWNhdGlvbi5faWR9LCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICB2YXIgbWVtYmVyID0gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xuICAgIH0pO1xuXG4gICAgaWYobWVtYmVyICYmIG1lbWJlci5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gbWVtYmVyWzBdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IFwiTm8gb25lXCIsXG4gICAgICAgIGZhY2Vib29rOiBcIjEwMDAwMDQ1NjMzNTk3MlwiXG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgdmFyIHN1ZmZpeCA9IFwiYWdvXCI7XG4gICAgaWYoc2Vjb25kcyA8IDApe1xuICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHNlY29uZHMpO1xuICAgICAgc3VmZml4ID0gXCJ0byBnb1wiO1xuICAgIH1cblxuICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcblxuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgZGF5cyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcbiAgfTtcblxuICAkc2NvcGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uICh0aW1lKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHRpbWUpLnRvVVRDU3RyaW5nKCk7XG4gIH07XG5cbn0pO1xuIiwicmVxdWlyZSgnLi9saXN0Jyk7XG5yZXF1aXJlKCcuL3RvcGljJyk7XG5yZXF1aXJlKCcuL2VtYmVkJyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIlRvcGljc0NvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2F0aW9uLCAkcm91dGVQYXJhbXMsIFRvcGljRmFjdG9yeSkge1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICRzY29wZS5raW5kcyA9IFtcIkluZm9cIiwgXCJUbyBkb1wiLCBcIkRlY2lzaW9uXCIsIFwiSWRlYVwiXTtcblxuICAkc2NvcGUuc2VhcmNoVG9waWNzID0ge307XG5cbiAgVG9waWNGYWN0b3J5LlRvcGljLmdldEFsbChnb3RUb3BpY3MpO1xuXG4gIGZ1bmN0aW9uIGdvdFRvcGljcyAodG9waWNzKSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoJHNjb3BlLmxvYWRpbmcpIHtcbiAgICAgICAgZ290VG9waWNzKHRvcGljcyk7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG5cbiAgICAkc2NvcGUudG9waWNzID0gdG9waWNzO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUudG9waWNzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgJHNjb3BlLnRvcGljc1tpXS5mYWNlYm9vayA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbiAobykge1xuICAgICAgICByZXR1cm4gJHNjb3BlLnRvcGljc1tpXS5hdXRob3IgPT09IG8uaWQ7XG4gICAgICB9KVswXS5mYWNlYm9vaztcbiAgICB9XG5cbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgJHNjb3BlLnNob3dPcGVuID0gdHJ1ZTtcbiAgJHNjb3BlLmxpbWl0ID0gNjtcblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS50aW1lID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiAkc2NvcGUudGltZVNpbmNlKG5ldyBEYXRlKGRhdGUpKTtcbiAgfTtcblxuICAkc2NvcGUuY3JlYXRlVG9waWMgPSBmdW5jdGlvbihraW5kKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5jcmVhdGUoe1xuICAgICAgYXV0aG9yOiAkc2NvcGUubWUuaWQsXG4gICAgICBraW5kOiBraW5kLFxuICAgICAgdGFnczogWyRzY29wZS5zZWFyY2hUb3BpY3MudGFnc11cbiAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5nZXRBbGwoZnVuY3Rpb24gKHRvcGljcykge1xuICAgICAgICAgICRzY29wZS50b3BpY3MgPSB0b3BpY3M7XG4gICAgICAgICAgJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgICAgIHJldHVybiBvLl9pZCA9PSByZXNwb25zZS5pZDtcbiAgICAgICAgICB9KVswXS5lZGl0aW5nID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmNvdW50ID0gZnVuY3Rpb24gKG9wZW4pIHtcbiAgICByZXR1cm4gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiAob3BlbiA/ICFvLmNsb3NlZCA6IG8uY2xvc2VkKTtcbiAgICB9KS5sZW5ndGg7XG4gIH07XG5cbiAgJHNjb3BlLnNob3duVG9waWNzID0gZnVuY3Rpb24gKG9wZW4pIHtcbiAgICByZXR1cm4gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiBvLmVkaXRpbmcgfHwgKG9wZW4gPyAhby5jbG9zZWQgOiBvLmNsb3NlZCkgJiYgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCRzY29wZS5zZWFyY2hUb3BpY3MudGFncyAmJiBvLnRhZ3MuaW5kZXhPZigkc2NvcGUuc2VhcmNoVG9waWNzLnRhZ3MpID09PSAtMSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJHNjb3BlLnNlYXJjaFRvcGljcy50YXJnZXQgJiYgby50YXJnZXRzLmluZGV4T2YoJHNjb3BlLnNlYXJjaFRvcGljcy50YXJnZXQpID09PSAtMSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJHNjb3BlLnNlYXJjaFRvcGljcy5raW5kICYmIG8ua2luZCAhPT0gJHNjb3BlLnNlYXJjaFRvcGljcy5raW5kKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSgpKTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuc2Nyb2xsID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCRzY29wZS5saW1pdCA8ICRzY29wZS50b3BpY3MubGVuZ3RoKVxuICAgICAgJHNjb3BlLmxpbWl0ICs9IDM7XG4gIH07XG5cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKCdUb3BpY0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgJHdpbmRvdywgVG9waWNGYWN0b3J5LCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gIFRvcGljRmFjdG9yeS5Ub3BpYy5nZXQoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAkc2NvcGUudG9waWMgPSByZXN1bHQ7XG5cbiAgICAkc2NvcGUudG9waWMuc2hvd0NvbW1lbnRzID0gdHJ1ZTtcblxuICAgIE5vdGlmaWNhdGlvbkZhY3RvcnkuVG9waWMuZ2V0QWxsKHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24oZ2V0RGF0YSkge1xuICAgICAgJHNjb3BlLnRvcGljLm5vdGlmaWNhdGlvbnMgPSBnZXREYXRhO1xuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9KTtcblxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoJ2NvbW1lbnRBcmVhJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21tZW50L2FyZWEuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQ29tbWVudEFyZWFDb250cm9sbGVyJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHRocmVhZDogJ0AnXG4gICAgICB9XG4gICAgfTtcbiAgfSkiLCJyZXF1aXJlKCcuL2FyZWEnKTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoJ2NvbW11bmljYXRpb25BcmVhJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21tdW5pY2F0aW9uL2FyZWEuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQ29tbXVuaWNhdGlvbkFyZWFDb250cm9sbGVyJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHRocmVhZDogJ0AnLFxuICAgICAgICBtZW1iZXJzSnNvbjogJ0BtZW1iZXJzJyxcbiAgICAgICAgbWVKc29uOiAnQG1lJyxcbiAgICAgICAgcm9sZXNKc29uOiAnQHJvbGVzJ1xuICAgICAgfVxuICAgIH07XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdjb21tdW5pY2F0aW9uJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21tdW5pY2F0aW9uL2NvbW11bmljYXRpb24uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQ29tbXVuaWNhdGlvbkVtYmVkQ29udHJvbGxlcicsXG4gICAgICBzY29wZToge1xuICAgICAgICBjb21tdW5pY2F0aW9uSnNvbjogJ0Bjb21tdW5pY2F0aW9uT2JqZWN0JyxcbiAgICAgICAgbWVtYmVyc0pzb246ICdAbWVtYmVycycsXG4gICAgICAgIG1lSnNvbjogJ0BtZScsXG4gICAgICAgIHJvbGVzSnNvbjogJ0Byb2xlcydcbiAgICAgIH1cbiAgICB9O1xuICB9KSIsInJlcXVpcmUoJy4vYXJlYScpO1xucmVxdWlyZSgnLi9jb21tdW5pY2F0aW9uJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdjb21wYW55JywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wYW55L2NvbXBhbnkuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQ29tcGFueUVtYmVkQ29udHJvbGxlcicsXG4gICAgICBzY29wZToge1xuICAgICAgICBjb21wYW55OiAnPWNvbXBhbnlPYmplY3QnLFxuICAgICAgICBtZW1iZXJzSnNvbjogJ0BtZW1iZXJzJyxcbiAgICAgICAgbWVKc29uOiAnQG1lJyxcbiAgICAgICAgcm9sZXNKc29uOiAnQHJvbGVzJyxcbiAgICAgICAgY29tbWVudHM6ICc9Y29tbWVudHNBcnJheSdcbiAgICAgIH1cbiAgICB9O1xuICB9KVxuIiwicmVxdWlyZSgnLi9jb21wYW55JykiLCJyZXF1aXJlKCcuL2lucHV0JykiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoXG4gICAgJ2RhdGVJbnB1dCcsXG4gICAgZnVuY3Rpb24oZGF0ZUZpbHRlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8aW5wdXQgdHlwZT1cImRhdGVcIj48L2lucHV0PicsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsbSwgYXR0cnMsIG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJGZvcm1hdHRlcnMudW5zaGlmdChmdW5jdGlvbiAobW9kZWxWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZUZpbHRlcihtb2RlbFZhbHVlLCAneXl5eS1NTS1kZCcpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHBhcnNlcnMudW5zaGlmdChmdW5jdGlvbih2aWV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHZpZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICB9KSIsInRoZVRvb2xEaXJlY3RpdmVzID0gYW5ndWxhci5tb2R1bGUoXCJ0aGVUb29sLmRpcmVjdGl2ZXNcIiwgW10pO1xuXG5yZXF1aXJlKFwiLi9jb21tZW50XCIpO1xucmVxdWlyZShcIi4vY29tbXVuaWNhdGlvblwiKTtcbnJlcXVpcmUoXCIuL2NvbXBhbnlcIik7XG5yZXF1aXJlKFwiLi9kYXRlXCIpO1xucmVxdWlyZShcIi4vbWFya2Rvd25cIik7XG5yZXF1aXJlKFwiLi9tZWV0aW5nXCIpO1xucmVxdWlyZShcIi4vc3BlYWtlclwiKTtcbnJlcXVpcmUoXCIuL3RhZ1wiKTtcbnJlcXVpcmUoXCIuL3RvcGljXCIpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdjb21waWxlJywgWyckY29tcGlsZScsIGZ1bmN0aW9uICgkY29tcGlsZSkge1xuICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgc2NvcGUuJHdhdGNoKFxuICAgICAgICAgIGZ1bmN0aW9uKHNjb3BlKSB7XG4gICAgICAgICAgICAgLy8gd2F0Y2ggdGhlICdjb21waWxlJyBleHByZXNzaW9uIGZvciBjaGFuZ2VzXG4gICAgICAgICAgICByZXR1cm4gc2NvcGUuJGV2YWwoYXR0cnMuY29tcGlsZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgLy8gd2hlbiB0aGUgJ2NvbXBpbGUnIGV4cHJlc3Npb24gY2hhbmdlc1xuICAgICAgICAgICAgLy8gYXNzaWduIGl0IGludG8gdGhlIGN1cnJlbnQgRE9NXG4gICAgICAgICAgICBlbGVtZW50Lmh0bWwodmFsdWUpO1xuXG4gICAgICAgICAgICAvLyBjb21waWxlIHRoZSBuZXcgRE9NIGFuZCBsaW5rIGl0IHRvIHRoZSBjdXJyZW50XG4gICAgICAgICAgICAvLyBzY29wZS5cbiAgICAgICAgICAgIC8vIE5PVEU6IHdlIG9ubHkgY29tcGlsZSAuY2hpbGROb2RlcyBzbyB0aGF0XG4gICAgICAgICAgICAvLyB3ZSBkb24ndCBnZXQgaW50byBpbmZpbml0ZSBsb29wIGNvbXBpbGluZyBvdXJzZWx2ZXNcbiAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoc2NvcGUpO1xuICAgICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICB9XSkiLCJyZXF1aXJlKCcuL2NvbXBpbGUnKTtcbnJlcXVpcmUoJy4vbWFya2Rvd24nKTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoJ21hcmtkb3duJywgWyckY29tcGlsZScsIGZ1bmN0aW9uICgkY29tcGlsZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIHZhciBodG1sVGV4dCA9IG1hcmtkb3duLnRvSFRNTChlbGVtZW50LnRleHQoKSk7XG4gICAgICAgICAgICBlbGVtZW50Lmh0bWwoaHRtbFRleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykpO1xuICAgICAgICB9XG4gICAgfTtcbiAgfV0pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xEaXJlY3RpdmVzLmRpcmVjdGl2ZShcImVtYmVkTWVldGluZ1wiLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy9lbWJlZC5odG1sXCIsXG4gICAgY29udHJvbGxlcjogXCJNZWV0aW5nRW1iZWRDb250cm9sbGVyXCIsXG4gICAgc2NvcGU6IHtcbiAgICAgIG1lZXRpbmdJZDogXCI9XCIsXG4gICAgICBtZW1iZXJzOiBcIj1cIlxuICAgIH1cbiAgfTtcbn0pO1xuIiwicmVxdWlyZShcIi4vZW1iZWRcIik7XG4iLCJyZXF1aXJlKCcuL3NwZWFrZXInKTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoJ3NwZWFrZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3NwZWFrZXIvc3BlYWtlci5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdTcGVha2VyRW1iZWRDb250cm9sbGVyJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHNwZWFrZXI6ICc9c3BlYWtlck9iamVjdCcsXG4gICAgICAgIG1lbWJlcnNKc29uOiAnQG1lbWJlcnMnLFxuICAgICAgICBtZUpzb246ICdAbWUnLFxuICAgICAgICByb2xlc0pzb246ICdAcm9sZXMnLFxuICAgICAgICBjb21tZW50czogJz1jb21tZW50c0FycmF5J1xuICAgICAgfVxuICAgIH07XG4gIH0pXG4iLCJhcmd1bWVudHNbNF1bMzVdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKSIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKFwidGFnTWFuYWdlclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiBcIkVcIixcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy90YWcvbWFuYWdlci5odG1sXCIsXG4gICAgICBjb250cm9sbGVyOiBcIlRhZ01hbmFnZXJDb250cm9sbGVyXCIsXG4gICAgICBzY29wZToge1xuICAgICAgICB0YWdzOiBcIj10YWdzQXJyYXlcIixcbiAgICAgICAgc2VhcmNoOiBcIj1cIlxuICAgICAgfVxuICAgIH07XG4gIH0pXG4iLCJyZXF1aXJlKFwiLi90b3BpY1wiKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sRGlyZWN0aXZlcy5kaXJlY3RpdmUoXCJ0b3BpY1wiLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdG9waWMvdG9waWMuaHRtbFwiLFxuICAgIGNvbnRyb2xsZXI6IFwiVG9waWNFbWJlZENvbnRyb2xsZXJcIixcbiAgICBzY29wZToge1xuICAgICAgdG9waWM6IFwiPVwiLFxuICAgICAgbWVtYmVyczogXCI9XCIsXG4gICAgICBtZTogXCI9XCIsXG4gICAgICByb2xlczogXCI9XCIsXG4gICAgICB0YWdzOiBcIj1cIixcbiAgICAgIGNvbW1lbnRzOiBcIj1cIixcbiAgICAgIG5vdGlmaWNhdGlvbnM6IFwiPVwiXG4gICAgfVxuICB9O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCd0aGVUb29sLmZpbHRlcnMnLCBbXSlcbiAgLmZpbHRlcignaW50ZXJwb2xhdGUnLCBbJ3ZlcnNpb24nLCBmdW5jdGlvbih2ZXJzaW9uKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHJldHVybiBTdHJpbmcodGV4dCkucmVwbGFjZSgvXFwlVkVSU0lPTlxcJS9tZywgdmVyc2lvbik7XG4gICAgfVxuICB9XSlcbiAgLmZpbHRlcignZmlsdGVyUm9sZScsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jdGlvbihtZW1iZXJzLCByb2xlKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IG1lbWJlcnM7XG4gICAgICAgICAgaWYocm9sZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gbWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obSkge1xuICAgICAgICAgICAgICByZXR1cm4gbS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24ocikge1xuICAgICAgICAgICAgICAgIHJldHVybiByLmlkID09IHJvbGU7XG4gICAgICAgICAgICAgIH0pLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG4gIH0pOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdDaGF0RmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgQ2hhdDogJHJlc291cmNlKCcvYXBpL2NoYXQvOmlkJywgbnVsbCwge1xuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9XG4gICAgICB9KSxcbiAgICAgIE1lc3NhZ2U6ICRyZXNvdXJjZSgnL2FwaS9jaGF0LzppZC9tZXNzYWdlcycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLGlzQXJyYXk6dHJ1ZX1cbiAgICAgIH0pXG4gICAgfVxuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdDb21tZW50RmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgQ29tbWVudDogJHJlc291cmNlKCcvYXBpL2NvbW1lbnQvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfSksXG4gICAgICBDb21wYW55OiAkcmVzb3VyY2UoJy9hcGkvY29tcGFueS86aWQvY29tbWVudHMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgU3BlYWtlcjogJHJlc291cmNlKCcvYXBpL3NwZWFrZXIvOmlkL2NvbW1lbnRzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KSxcbiAgICAgIFRvcGljOiAkcmVzb3VyY2UoJy9hcGkvdG9waWMvOmlkL2NvbW1lbnRzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KVxuICAgIH1cbiAgfSkiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnQ29tbXVuaWNhdGlvbkZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIENvbW11bmljYXRpb246ICRyZXNvdXJjZSgnL2FwaS9jb21tdW5pY2F0aW9uLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ30sXG4gICAgICAgICdhcHByb3ZlJzoge21ldGhvZDogJ1BPU1QnfVxuICAgICAgfSksXG4gICAgICBDb21wYW55OiAkcmVzb3VyY2UoJy9hcGkvY29tcGFueS86aWQvY29tbXVuaWNhdGlvbnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgU3BlYWtlcjogJHJlc291cmNlKCcvYXBpL3NwZWFrZXIvOmlkL2NvbW11bmljYXRpb25zJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KVxuICAgIH07XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ0NvbXBhbnlGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBDb21wYW55OiAkcmVzb3VyY2UoJy9hcGkvY29tcGFueS86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UoJy9hcGkvbWVtYmVyLzppZC9jb21wYW5pZXMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfVxuICAgICAgfSlcbiAgICB9O1xuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdFbWFpbEZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIENvbXBhbnk6ICRyZXNvdXJjZSgnL2FwaS9jb21wYW55LzppZC9zZW5kSW5pdGlhbEVtYWlsJywgbnVsbCwge1xuICAgICAgICAnc2VuZCc6IHttZXRob2Q6ICdQT1NUJ31cbiAgICAgIH0pLFxuICAgICAgU3BlYWtlcjogJHJlc291cmNlKCcvYXBpL3NwZWFrZXIvOmlkL3NlbmRJbml0aWFsRW1haWwnLCBudWxsLCB7XG4gICAgICAgICdzZW5kJzoge21ldGhvZDogJ1BPU1QnfVxuICAgICAgfSlcbiAgICB9XG4gIH0pIiwidGhlVG9vbFNlcnZpY2VzID0gYW5ndWxhci5tb2R1bGUoJ3RoZVRvb2wuc2VydmljZXMnLCBbJ25nUmVzb3VyY2UnXSk7XG5cbnJlcXVpcmUoJy4vY2hhdCcpO1xucmVxdWlyZSgnLi9jb21tZW50Jyk7XG5yZXF1aXJlKCcuL2NvbW11bmljYXRpb24nKTtcbnJlcXVpcmUoJy4vY29tcGFueScpO1xucmVxdWlyZSgnLi9lbWFpbCcpO1xucmVxdWlyZSgnLi9tZWV0aW5nJyk7XG5yZXF1aXJlKCcuL21lbWJlcicpO1xucmVxdWlyZSgnLi9tZXNzYWdlJyk7XG5yZXF1aXJlKCcuL25vdGlmaWNhdGlvbicpO1xucmVxdWlyZSgnLi9yb2xlJyk7XG5yZXF1aXJlKCcuL3Nlc3Npb24nKTtcbnJlcXVpcmUoJy4vc29ja2V0Jyk7XG5yZXF1aXJlKCcuL3NwZWFrZXInKTtcbnJlcXVpcmUoJy4vdGFnJyk7XG5yZXF1aXJlKCcuL3RvcGljJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnTWVldGluZ0ZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuICRyZXNvdXJjZSgnL2FwaS9tZWV0aW5nLzppZCcsIG51bGwsIHtcbiAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgfSk7XG4gIH0pXG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnTWVtYmVyRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UoJy9hcGkvbWVtYmVyLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9LFxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfSksXG4gICAgICBSb2xlOiAkcmVzb3VyY2UoJy9hcGkvcm9sZS86aWQvbWVtYmVycycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSksXG4gICAgICBNZTogJHJlc291cmNlKCcvYXBpL215c2VsZicsIG51bGwsIHtcbiAgICAgICAgJ2dldCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiBmYWxzZX1cbiAgICAgIH0pXG4gICAgfTtcbiAgfSkiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnTWVzc2FnZUZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuICRyZXNvdXJjZSgnL2FwaS9tZXNzYWdlLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6ICAgIHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSlcbiAgfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbFNlcnZpY2VzLmZhY3RvcnkoXCJOb3RpZmljYXRpb25GYWN0b3J5XCIsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgcmV0dXJuIHtcbiAgICBOb3RpZmljYXRpb246ICRyZXNvdXJjZShcIi9hcGkvbm90aWZpY2F0aW9uLzppZFwiLCBudWxsLCB7XG4gICAgICBcImdldEFsbFwiOiB7bWV0aG9kOiBcIkdFVFwiLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgIFwidXBkYXRlXCI6IHttZXRob2Q6IFwiUFVUXCJ9XG4gICAgfSksXG4gICAgQ29tcGFueTogJHJlc291cmNlKFwiL2FwaS9jb21wYW55LzppZC9ub3RpZmljYXRpb25zXCIsIG51bGwsIHtcbiAgICAgIFwiZ2V0QWxsXCI6IHttZXRob2Q6IFwiR0VUXCIsIGlzQXJyYXk6IHRydWV9XG4gICAgfSksXG4gICAgU3BlYWtlcjogJHJlc291cmNlKFwiL2FwaS9zcGVha2VyLzppZC9ub3RpZmljYXRpb25zXCIsIG51bGwsIHtcbiAgICAgIFwiZ2V0QWxsXCI6IHttZXRob2Q6IFwiR0VUXCIsIGlzQXJyYXk6IHRydWV9XG4gICAgfSksXG4gICAgVG9waWM6ICRyZXNvdXJjZShcIi9hcGkvdG9waWMvOmlkL25vdGlmaWNhdGlvbnNcIiwgbnVsbCwge1xuICAgICAgXCJnZXRBbGxcIjoge21ldGhvZDogXCJHRVRcIiwgaXNBcnJheTogdHJ1ZX1cbiAgICB9KVxuICB9O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnUm9sZUZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFJvbGU6ICRyZXNvdXJjZSgnL2FwaS9yb2xlLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgIH0pLFxuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UoJy9hcGkvcm9sZS86aWQvbWVtYmVycycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSlcbiAgICB9O1xuICB9KVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ1Nlc3Npb25GYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBTZXNzaW9uOiAkcmVzb3VyY2UoJy9hcGkvc2Vzc2lvbi86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KSxcbiAgICAgIENvbXBhbnk6ICRyZXNvdXJjZSgnL2FwaS9jb21wYW55LzppZC9zZXNzaW9ucycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSksXG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UoJy9hcGkvc3BlYWtlci86aWQvc2Vzc2lvbnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gICAgfVxuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdTb2NrZXRGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSwgJGxvY2F0aW9uLCAkcm9vdFNjb3BlKSB7XG4gICAgdmFyIHNvY2tldDtcbiAgICByZXR1cm4ge1xuICAgICAgY29ubmVjdDogZnVuY3Rpb24obnNwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHNvY2tldCk7XG4gICAgICAgIHNvY2tldCA9IGlvLmNvbm5lY3QobnNwLCB7bXVsdGlwbGV4OiBmYWxzZX0pO1xuICAgICAgfSxcbiAgICAgIG9uOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBzb2NrZXQub24oZXZlbnROYW1lLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoc29ja2V0LCBhcmdzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZW1pdDogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgc29ja2V0LmVtaXQoZXZlbnROYW1lLCBkYXRhLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHNvY2tldCwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGRpc2Nvbm5lY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc29ja2V0LmRpc2Nvbm5lY3QoKTtcbiAgICAgIH0sXG4gICAgICBzb2NrZXQ6IHNvY2tldFxuICAgIH07XG4gIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ1NwZWFrZXJGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UoJy9hcGkvc3BlYWtlci86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UoJy9hcGkvbWVtYmVyLzppZC9zcGVha2VycycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9XG4gICAgICB9KVxuICAgIH07XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ1RhZ0ZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFRhZzogJHJlc291cmNlKCcvYXBpL3RhZy86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KSxcbiAgICAgIFRvcGljOiAkcmVzb3VyY2UoJy9hcGkvdGFnLzppZC90b3BpY3MnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gICAgfTtcbiAgfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KFwiVG9waWNGYWN0b3J5XCIsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgVG9waWM6ICRyZXNvdXJjZShcIi9hcGkvdG9waWMvOmlkXCIsIG51bGwsIHtcbiAgICAgICAgXCJnZXRBbGxcIjoge21ldGhvZDogXCJHRVRcIiwgaXNBcnJheTogdHJ1ZX0sXG4gICAgICAgIFwiY3JlYXRlXCI6IHttZXRob2Q6IFwiUE9TVFwifSxcbiAgICAgICAgXCJ1cGRhdGVcIjoge21ldGhvZDogXCJQVVRcIn0sXG4gICAgICAgIFwiZGVsZXRlXCI6IHttZXRob2Q6IFwiREVMRVRFXCJ9XG4gICAgICB9KSxcbiAgICAgIE1lbWJlcjogJHJlc291cmNlKFwiL2FwaS9tZW1iZXIvOmlkL3RvcGljc1wiLCBudWxsLCB7XG4gICAgICAgIFwiZ2V0QWxsXCI6IHsgbWV0aG9kOiBcIkdFVFwiLCBpc0FycmF5OiB0cnVlIH1cbiAgICAgIH0pXG4gICAgfTtcbiAgfSlcbiIsInVybF9wcmVmaXggPSAnaHR0cDovL3Rvb2wuYmFuYW5hbWFya2V0LmV1Lyc7XG5cbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9hcHAuanMnKTtcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9jb250cm9sbGVycycpO1xucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMnKTtcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9maWx0ZXJzJyk7XG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvc2VydmljZXMnKTsiXX0=
