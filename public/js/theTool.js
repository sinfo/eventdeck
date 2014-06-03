(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

angular.module("theTool", [
  "ng",
  "ngRoute",
  "ngSanitize",
  "infinite-scroll",
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

theToolController.controller('ChatController', function ($rootScope, $scope, $http, $routeParams, $sce, SocketFactory, MessageFactory, ChatFactory, MemberFactory) {

  $scope.error = {};

  $scope.loading  = true;
  $scope.messages = [];
  $scope.online   = [];

  SocketFactory.connect('/chat');

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
    CommentFactory.Comment.delete({id: comment._id}, function () {
      loadComments();
    });
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
'use strict';

theToolController.controller('home', function ($scope, $http, $sce,  $rootScope, NotificationFactory, MemberFactory) {

  $scope.loading = true;
  $scope.notifications = [];
  $scope.limit = 10;

  init();

  function init() {
    setTimeout(function() {
      if ($scope.loading)
        init();
    }, 1000);

    NotificationFactory.Notification.getAll(function(response) {
      $scope.notifications = response;
      $scope.loading = false;
    });
  }

  $scope.scroll = function() {
    if ($scope.limit < $scope.notifications.length)
      $scope.limit += 10;
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

  MemberFactory.Member.get({id: "me"}, function (me) {
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

      for (var i = 0, j = response.length; i < j; i++) {
        if (response[i].unread.indexOf($scope.me.id) != -1) {
          $scope.notificationsInfo.number++;

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
'use strict';

theToolController
  .controller('MembersController', function ($scope, $http, MemberFactory) {
    $scope.setSearchRole = function(roleId) {
      $scope.searchRoles=roleId;
    }

    MemberFactory.Member.getAll(function(response) {
      $scope.predicate = 'name';
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

      SpeakerFactory.Speaker.create(speakerData, function(response) {
        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.message;
          $location.path("/speaker/" + response.id);
        }
      });
    };

    $scope.statuses = ['Suggestion','Contacted','In Conversations','Accepted','Rejected','Give Up'];
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

    $scope.statuses = ['Suggestion','Contacted','In Conversations','Accepted','Rejected','Give Up'];

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

    $scope.statuses = ['Suggestion','Contacted','In Conversations','Accepted','Rejected','Give Up'];

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

theToolController.controller("TopicEmbedController", function ($scope, TopicFactory) {

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


  //===================================FUNCTIONS===================================

  $scope.deleteTopic = function(topic) {
    var answer = confirm("Are you sure you want to delete this topic?");
    if (answer) {
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
    } else {
      updatedTopic.poll.options[updatedTopic.poll.options.indexOf(option)].votes.push($scope.me.id);
    }

    TopicFactory.Topic.update({id: updatedTopic._id}, updatedTopic, function(response) {
      if(response.error) {
        console.log("There was an error. Please contact the Dev Team and give them the details about the error.");
      } else if (response.success) {
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
      kind: kind
    }, function (response) {
      if (response.success) {
        TopicFactory.Topic.getAll(function (topics) {
          $scope.topics = topics;
          $scope.topics.find(function (o) {
            return o._id == response.id;
          }).editing = true;
        });
      }
    });
  };

  $scope.shownTopics = function (showOpen) {
    return $scope.topics.filter(function(o) {
      return (showOpen ? !o.closed : o.closed);
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
'use strict';

theToolDirectives
  .directive('tagManager', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/tag/manager.html',
      controller: 'TagManagerController',
      scope: {
        tags: '=tagsArray',
        search: '=search'
      }
    };
  })

},{}],60:[function(require,module,exports){
require("./topic");

},{"./topic":61}],61:[function(require,module,exports){
"use strict";

theToolDirectives.directive("topic", function () {
  return {
    restrict: "EAC",
    replace: true,
    templateUrl: "views/topic/topic.html",
    controller: "TopicEmbedController",
    scope: {
      topic: "=topicObject",
      members: "=topicMembers",
      me: "=topicMe",
      roles: "=topicRoles",
      tags: "=topicTags",
      comments: "=topicComments"
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
'use strict';

theToolServices
  .factory('NotificationFactory', function ($resource) {
    return {
      Notification: $resource('/api/notification/:id', null, {
        'getAll': {method: 'GET', isArray: true},
      }),
      Company: $resource('/api/company/:id/notifications', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Speaker: $resource('/api/speaker/:id/notifications', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Topic: $resource('/api/topic/:id/notifications', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    }
  })

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
/*        console.log($rootScope.socket);
        if($rootScope.socket){
          console.log($rootScope.socket.connected);
          $rootScope.socket.disconnect();
        }
        $rootScope.socket = socket = io.connect(nsp);*/
        socket = io.connect(nsp);
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
      }
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
'use strict';

theToolServices
  .factory('TopicFactory', function ($resource) {
    return {
      Topic: $resource('/api/topic/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'create': {method: 'POST'},
        'update': {method: 'PUT'},
        'delete': {method: 'DELETE'}
      }),
      Member: $resource('/api/member/:id/topics', null, {
        'getAll': { method: 'GET', isArray: true }
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvcm9vdC90aGUtdG9vbC9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvYXBwLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY2hhdC9jaGF0LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY2hhdC9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NoYXQvbGlzdC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW1lbnQvYXJlYS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW1lbnQvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tdW5pY2F0aW9uL2FyZWEuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tdW5pY2F0aW9uL2VtYmVkLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbXVuaWNhdGlvbi9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW11bmljYXRpb24vbGlzdC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvY29tcGFueS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvY29uZmlybS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvY3JlYXRlLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9lbWJlZC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21wYW55L2xpc3QuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21haW4vaG9tZS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21haW4vaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tYWluL21haW4uanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZWV0aW5nL2VtYmVkLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWVldGluZy9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lZXRpbmcvbGlzdC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lZXRpbmcvbWVldGluZy5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lbWJlci9jcmVhdGUuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvbGlzdC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lbWJlci9tZW1iZXIuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2NvbmZpcm0uanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2NyZWF0ZS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvZW1iZWQuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvc3BlYWtlci9saXN0LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvc3BlYWtlci9zcGVha2VyLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdGFnL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdGFnL21hbmFnZXIuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90b3BpYy9lbWJlZC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3RvcGljL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdG9waWMvbGlzdC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3RvcGljL3RvcGljLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9jb21tZW50L2FyZWEuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbW1lbnQvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbW11bmljYXRpb24vYXJlYS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvY29tbXVuaWNhdGlvbi9jb21tdW5pY2F0aW9uLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9jb21tdW5pY2F0aW9uL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9jb21wYW55L2NvbXBhbnkuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2NvbXBhbnkvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2RhdGUvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2RhdGUvaW5wdXQuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9tYXJrZG93bi9jb21waWxlLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy9tYXJrZG93bi9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvbWFya2Rvd24vbWFya2Rvd24uanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21lZXRpbmcvZW1iZWQuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL21lZXRpbmcvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3NwZWFrZXIvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3NwZWFrZXIvc3BlYWtlci5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvdGFnL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcy90YWcvbWFuYWdlci5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvdG9waWMvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL3RvcGljL3RvcGljLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZmlsdGVycy9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2NoYXQuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9jb21tZW50LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvY29tbXVuaWNhdGlvbi5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2NvbXBhbnkuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9lbWFpbC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvbWVldGluZy5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL21lbWJlci5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL21lc3NhZ2UuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9ub3RpZmljYXRpb24uanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9yb2xlLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvc2VydmljZXMvc2Vzc2lvbi5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL3NvY2tldC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL3NwZWFrZXIuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy90YWcuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy90b3BpYy5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy90aGVUb29sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0pBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTs7QUNEQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyLm1vZHVsZShcInRoZVRvb2xcIiwgW1xuICBcIm5nXCIsXG4gIFwibmdSb3V0ZVwiLFxuICBcIm5nU2FuaXRpemVcIixcbiAgXCJpbmZpbml0ZS1zY3JvbGxcIixcbiAgXCJ0aGVUb29sLmZpbHRlcnNcIixcbiAgXCJ0aGVUb29sLnNlcnZpY2VzXCIsXG4gIFwidGhlVG9vbC5kaXJlY3RpdmVzXCIsXG4gIFwidGhlVG9vbC5jb250cm9sbGVyc1wiXG5dKS5cbmNvbmZpZyhbXCIkcm91dGVQcm92aWRlclwiLCBmdW5jdGlvbigkcm91dGVQcm92aWRlcikge1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL1wiICAgICAgICAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2hvbWUuaHRtbFwiLCAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiaG9tZVwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tcGFuaWVzL1wiICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tcGFueS9saXN0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJDb21wYW5pZXNDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21wYW5pZXMvdGFibGUvXCIgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21wYW55L3RhYmxlLmh0bWxcIiwgICAgICAgICBjb250cm9sbGVyOiBcIkNvbXBhbmllc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NvbXBhbmllcy9idWRnZXQvXCIgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NvbXBhbnkvYnVkZ2V0Lmh0bWxcIiwgICAgICAgIGNvbnRyb2xsZXI6IFwiQ29tcGFuaWVzQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tcGFueS9cIiAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tcGFueS9jcmVhdGUuaHRtbFwiLCAgICAgICAgY29udHJvbGxlcjogXCJDcmVhdGVDb21wYW55Q29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tcGFueS86aWRcIiAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tcGFueS92aWV3Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJDb21wYW55Q29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tcGFueS86aWQvZWRpdFwiICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tcGFueS9lZGl0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJDb21wYW55Q29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tcGFueS86aWQvcGFydGljaXBhdGlvblwiLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tcGFueS9wYXJ0aWNpcGF0aW9uLmh0bWxcIiwgY29udHJvbGxlcjogXCJDb21wYW55Q29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvY29tcGFueS86aWQvY29uZmlybVwiICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvY29tcGFueS9jb25maXJtLmh0bWxcIiwgICAgICAgY29udHJvbGxlcjogXCJDb21wYW55RW1haWxDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21tZW50LzppZC9lZGl0XCIgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21tZW50L2VkaXQuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIkNvbW1lbnRDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9zcGVha2Vycy9cIiAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zcGVha2VyL2xpc3QuaHRtbFwiLCAgICAgICAgICBjb250cm9sbGVyOiBcIlNwZWFrZXJzQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvc3BlYWtlcnMvdGFibGUvXCIgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3Mvc3BlYWtlci90YWJsZS5odG1sXCIsICAgICAgICAgY29udHJvbGxlcjogXCJTcGVha2Vyc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL3NwZWFrZXIvXCIgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3NwZWFrZXIvY3JlYXRlLmh0bWxcIiwgICAgICAgIGNvbnRyb2xsZXI6IFwiQ3JlYXRlU3BlYWtlckNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL3NwZWFrZXIvOmlkXCIgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3NwZWFrZXIvdmlldy5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiU3BlYWtlckNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL3NwZWFrZXIvOmlkL2VkaXRcIiAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3NwZWFrZXIvZWRpdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiU3BlYWtlckNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL3NwZWFrZXIvOmlkL2NvbmZpcm1cIiAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3NwZWFrZXIvY29uZmlybS5odG1sXCIsICAgICAgIGNvbnRyb2xsZXI6IFwiU3BlYWtlckVtYWlsQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVtYmVycy9cIiAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVtYmVyL2xpc3QuaHRtbFwiLCAgICAgICAgICAgY29udHJvbGxlcjogXCJNZW1iZXJzQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVtYmVyL1wiICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVtYmVyL2NyZWF0ZS5odG1sXCIsICAgICAgICAgY29udHJvbGxlcjogXCJDcmVhdGVNZW1iZXJDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9tZW1iZXIvOmlkXCIgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9tZW1iZXIvdmlldy5odG1sXCIsICAgICAgICAgICBjb250cm9sbGVyOiBcIk1lbWJlckNvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lbWJlci86aWQvZWRpdFwiICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lbWJlci9lZGl0Lmh0bWxcIiwgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVtYmVyQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oXCIvbWVldGluZ3NcIiAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy9saXN0Lmh0bWxcIiwgICAgICAgICAgY29udHJvbGxlcjogXCJNZWV0aW5nc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lZXRpbmcvOmlkXCIgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lZXRpbmcvdmlldy5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVldGluZ0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lZXRpbmcvOmlkL3RleHRcIiAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lZXRpbmcvdGV4dC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVldGluZ0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL21lZXRpbmcvOmlkL2VkaXRcIiAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL21lZXRpbmcvZWRpdC5odG1sXCIsICAgICAgICAgIGNvbnRyb2xsZXI6IFwiTWVldGluZ0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL2NoYXRzXCIgICAgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL2NoYXQvbGlzdC5odG1sXCIsICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiQ2hhdHNDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jaGF0LzppZFwiICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jaGF0L3ZpZXcuaHRtbFwiLCAgICAgICAgICAgICBjb250cm9sbGVyOiBcIkNoYXRDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi90b3BpY3NcIiAgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy90b3BpYy9saXN0Lmh0bWxcIiwgICAgICAgICAgICBjb250cm9sbGVyOiBcIlRvcGljc0NvbnRyb2xsZXJcIn0pO1xuICAkcm91dGVQcm92aWRlci53aGVuKFwiL3RvcGljLzppZFwiICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiBcInZpZXdzL3RvcGljL3ZpZXcuaHRtbFwiLCAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiVG9waWNDb250cm9sbGVyXCJ9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbihcIi9jb21tdW5pY2F0aW9uc1wiICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb21tdW5pY2F0aW9uL2xpc3QuaHRtbFwiLCAgICBjb250cm9sbGVyOiBcIkNvbW11bmljYXRpb25zQ29udHJvbGxlclwifSk7XG4gICRyb3V0ZVByb3ZpZGVyLm90aGVyd2lzZSh7cmVkaXJlY3RUbzogXCIvXCJ9KTtcbn1dKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignQ2hhdENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCBTb2NrZXRGYWN0b3J5LCBNZXNzYWdlRmFjdG9yeSwgQ2hhdEZhY3RvcnksIE1lbWJlckZhY3RvcnkpIHtcblxuICAkc2NvcGUuZXJyb3IgPSB7fTtcblxuICAkc2NvcGUubG9hZGluZyAgPSB0cnVlO1xuICAkc2NvcGUubWVzc2FnZXMgPSBbXTtcbiAgJHNjb3BlLm9ubGluZSAgID0gW107XG5cbiAgU29ja2V0RmFjdG9yeS5jb25uZWN0KCcvY2hhdCcpO1xuXG4gIFNvY2tldEZhY3Rvcnkub24oJ2Nvbm5lY3RlZCcsIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgU29ja2V0RmFjdG9yeS5lbWl0KCdhdXRoJywge2lkOiAkcm91dGVQYXJhbXMuaWQsIHVzZXI6ICRzY29wZS5tZS5pZH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdBdXRoIHN1Y2Nlc3MnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgU29ja2V0RmFjdG9yeS5vbigndmFsaWRhdGlvbicsIGZ1bmN0aW9uIChyZXN1bHQpe1xuICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgaWYoIXJlc3VsdC5lcnIpe1xuICAgICAgJHNjb3BlLmNoYXQgICAgID0gcmVzdWx0LmNoYXREYXRhO1xuICAgICAgJHNjb3BlLm1lc3NhZ2VzID0gcmVzdWx0Lm1lc3NhZ2VzO1xuICAgICAgJHNjb3BlLnJvb20gICAgID0gcmVzdWx0LnJvb207XG5cbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUuY2hhdC5tZW1iZXJzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgJHNjb3BlLm9ubGluZS5wdXNoKHttZW1iZXI6ICRzY29wZS5jaGF0Lm1lbWJlcnNbaV0sIG9uOiBmYWxzZX0pO1xuICAgICAgICBpZihyZXN1bHQub25saW5lLmluZGV4T2YoJHNjb3BlLmNoYXQubWVtYmVyc1tpXSkgIT0gLTEpe1xuICAgICAgICAgICRzY29wZS5vbmxpbmVbaV0ub24gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS5vbmxpbmVbaV0ubmFtZSA9ICRzY29wZS5nZXRNZW1iZXIoJHNjb3BlLm9ubGluZVtpXS5tZW1iZXIpLm5hbWU7XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZygkc2NvcGUub25saW5lKTtcblxuICAgIH1cbiAgICBlbHNle1xuICAgICAgY29uc29sZS5sb2cocmVzdWx0Lm1lc3NhZ2UpO1xuICAgIH1cbiAgICAkc2NvcGUubG9hZGluZyAgPSBmYWxzZTtcbiAgfSk7XG5cbiAgU29ja2V0RmFjdG9yeS5vbigndXNlcjpjb25uZWN0ZWQnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGNvbnNvbGUubG9nKFwiVXNlciBjb25uZWN0ZWQ6IFwiICsgZGF0YS5pZCk7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5vbmxpbmUubGVuZ3RoOyBpKyspe1xuICAgICAgaWYoJHNjb3BlLm9ubGluZVtpXS5tZW1iZXIgPT09IGRhdGEuaWQpe1xuICAgICAgICAkc2NvcGUub25saW5lW2ldLm9uID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBTb2NrZXRGYWN0b3J5Lm9uKCd1c2VyOmRpc2Nvbm5lY3RlZCcsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgY29uc29sZS5sb2coXCJVc2VyIGNvbm5lY3RlZDogXCIgKyBkYXRhLmlkKTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLm9ubGluZS5sZW5ndGg7IGkrKyl7XG4gICAgICBpZigkc2NvcGUub25saW5lW2ldLm1lbWJlciA9PT0gZGF0YS5pZCl7XG4gICAgICAgICRzY29wZS5vbmxpbmVbaV0ub24gPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBTb2NrZXRGYWN0b3J5Lm9uKCdtZXNzYWdlJywgZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBjb25zb2xlLmxvZyhtZXNzYWdlLmRhdGUpO1xuICAgICRzY29wZS5tZXNzYWdlcy5wdXNoKG1lc3NhZ2UpO1xuICB9KTtcblxuICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCRzY29wZS50ZXh0ID09IFwiXCIpe1xuICAgICAgLy8kc2NvcGUuZW1wdHkgPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBtZXNzYWdlRGF0YSA9IHtcbiAgICAgIHRleHQgICA6ICRzY29wZS50ZXh0LFxuICAgICAgY2hhdElkIDogJHJvdXRlUGFyYW1zLmlkLFxuICAgICAgbWVtYmVyIDogJHNjb3BlLm1lLmlkLFxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhtZXNzYWdlRGF0YSk7XG5cbiAgICBTb2NrZXRGYWN0b3J5LmVtaXQoJ3NlbmQnLCB7cm9vbTogJHNjb3BlLnJvb20sIG1lc3NhZ2U6IG1lc3NhZ2VEYXRhIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc29sZS5sb2coJ01lc3NhZ2Ugc2VudCcpO1xuICAgICAgJHNjb3BlLnRleHQgPSBcIlwiO1xuICAgIH0pO1xuICB9O1xufSk7XG4iLCJyZXF1aXJlKCcuL2xpc3QnKTtcbnJlcXVpcmUoJy4vY2hhdCcpOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignQ2hhdHNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgQ2hhdEZhY3RvcnkpIHtcblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgQ2hhdEZhY3RvcnkuQ2hhdC5nZXRBbGwoZnVuY3Rpb24oY2hhdHMpIHtcbiAgICAkc2NvcGUuY2hhdHMgPSBjaGF0cztcbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICB9KTtcblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNvbW1lbnRBcmVhQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCBNZW1iZXJGYWN0b3J5LCBDb21tZW50RmFjdG9yeSkge1xuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAkc2NvcGUuY29tbWVudERhdGEgPSB7XG4gICAgbWFya2Rvd246IFwiXCJcbiAgfTtcblxuICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXQoe2lkOiBcIm1lXCJ9LCBmdW5jdGlvbiAobWUpIHtcbiAgICAkc2NvcGUubWUgPSBtZTtcbiAgfSk7XG5cbiAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuZ2V0QWxsKGZ1bmN0aW9uIChtZW1iZXJzKSB7XG4gICAgJHNjb3BlLm1lbWJlcnMgPSBtZW1iZXJzO1xuICB9KTtcblxuICBsb2FkQ29tbWVudHMoKTtcblxuICBmdW5jdGlvbiBsb2FkQ29tbWVudHMoKSB7XG4gICAgaWYgKCRzY29wZS50aHJlYWQuc3BsaXQoXCItXCIpWzFdID09PSBcIlwiKSB7XG4gICAgICBzZXRUaW1lb3V0KGxvYWRDb21tZW50cywgNTAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcGFnZUlkID0gJHNjb3BlLnRocmVhZC5zdWJzdHJpbmcoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiLVwiKSArIDEpO1xuXG4gICAgaWYgKCRzY29wZS50aHJlYWQuaW5kZXhPZihcImNvbXBhbnktXCIpICE9IC0xKSB7XG4gICAgICBDb21tZW50RmFjdG9yeS5Db21wYW55LmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwic3BlYWtlci1cIikgIT0gLTEpIHtcbiAgICAgIENvbW1lbnRGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKHtpZDogcGFnZUlkfSwgZ290Q29tbWVudHMpO1xuICAgIH1cbiAgICBlbHNlIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJ0b3BpYy1cIikgIT0gLTEpIHtcbiAgICAgIENvbW1lbnRGYWN0b3J5LlRvcGljLmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnb3RDb21tZW50cyhjb21tZW50cykge1xuICAgICAgJHNjb3BlLmNvbW1lbnRzID0gY29tbWVudHM7XG5cbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgJHNjb3BlLnBvc3RDb21tZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICgkc2NvcGUuY29tbWVudERhdGEubWFya2Rvd24gPT09IFwiXCIpe1xuICAgICAgJHNjb3BlLmVtcHR5Q29tbWVudCA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGRhdGUgPSBEYXRlLm5vdygpO1xuICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQuY3JlYXRlKHtcbiAgICAgIHRocmVhZDogJHNjb3BlLnRocmVhZCxcbiAgICAgIG1lbWJlcjogJHNjb3BlLm1lLmlkLFxuICAgICAgbWFya2Rvd246ICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93bixcbiAgICAgIGh0bWw6ICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwoJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duKSxcbiAgICAgIHBvc3RlZDogZGF0ZSxcbiAgICAgIHVwZGF0ZWQ6IGRhdGVcbiAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biA9IFwiXCI7XG4gICAgICBsb2FkQ29tbWVudHMoKTtcbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS5zYXZlQ29tbWVudCA9IGZ1bmN0aW9uIChjb21tZW50KSB7XG4gICAgaWYgKGNvbW1lbnQuYnVmZmVyID09PSBcIlwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29tbWVudC5tYXJrZG93biA9IGNvbW1lbnQuYnVmZmVyO1xuICAgIGNvbW1lbnQuaHRtbCA9ICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwoY29tbWVudC5tYXJrZG93bik7XG4gICAgY29tbWVudC51cGRhdGVkID0gRGF0ZS5ub3coKTtcblxuICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQudXBkYXRlKHtpZDogY29tbWVudC5faWR9LCBjb21tZW50LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGNvbW1lbnQuZWRpdGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLnF1b3RlQ29tbWVudCA9IGZ1bmN0aW9uIChjb21tZW50KSB7XG4gICAgJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duID0gXCI+ICoqXCIgKyAkc2NvcGUuZ2V0TWVtYmVyKGNvbW1lbnQubWVtYmVyKS5uYW1lICsgXCIgc2FpZDoqKlxcbj4gXCIgKyBjb21tZW50Lm1hcmtkb3duLnNwbGl0KFwiXFxuXCIpLmpvaW4oXCJcXG4+IFwiKSArIFwiXFxuXFxuXCI7XG4gIH07XG5cbiAgJHNjb3BlLmRlbGV0ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xuICAgIENvbW1lbnRGYWN0b3J5LkNvbW1lbnQuZGVsZXRlKHtpZDogY29tbWVudC5faWR9LCBmdW5jdGlvbiAoKSB7XG4gICAgICBsb2FkQ29tbWVudHMoKTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgcmV0dXJuICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICB9KVswXTtcbiAgfTtcblxuICAkc2NvcGUuY29udmVydFRleHRUb0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIHVybEV4cCA9IC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWc7XG4gICAgdmFyIG1haWxFeHAgPSAvW1xcd1xcLlxcLV0rXFxAKFtcXHdcXC1dK1xcLikrW1xcd117Miw0fSg/IVtePF0qPikvaWc7XG5cbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIikucmVwbGFjZShtYWlsRXhwLFwiPGEgaHJlZj0nLyMvY29tcGFueS9cIiskcm91dGVQYXJhbXMuaWQrXCIvY29uZmlybT9lbWFpbD0kJic+JCY8L2E+XCIpO1xuICB9O1xuXG4gICRzY29wZS5jb252ZXJ0TmV3TGluZXNUb0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgcmV0dXJuICc8ZGl2IGRhdGEtbWFya2Rvd24+Jyt0ZXh0LnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpKyc8L2Rpdj4nO1xuICB9O1xuXG4gICRzY29wZS5jb252ZXJ0TWFya2Rvd25Ub0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgcmV0dXJuICc8ZGl2IGRhdGEtbWFya2Rvd24+JyArIHRleHQgKyAnPC9kaXY+JztcbiAgfTtcblxuICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgIH0pO1xuXG4gICAgaWYocm9sZXMubGVuZ3RoID09IDAgJiYgY29tbWVudC5tZW1iZXIgIT0gJHNjb3BlLm1lLmlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG59KTtcbiIsInJlcXVpcmUoJy4vYXJlYS5qcycpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJDb21tdW5pY2F0aW9uQXJlYUNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgQ29tbXVuaWNhdGlvbkZhY3RvcnkpIHtcblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgJHNjb3BlLmNvbW11bmljYXRpb25EYXRhID0ge1xuICAgIG1hcmtkb3duOiBcIlwiXG4gIH07XG5cbiAgJHNjb3BlLm1lID0gSlNPTi5wYXJzZSgkc2NvcGUubWVKc29uKTtcbiAgJHNjb3BlLm1lbWJlcnMgPSBKU09OLnBhcnNlKCRzY29wZS5tZW1iZXJzSnNvbik7XG4gICRzY29wZS5yb2xlcyA9IEpTT04ucGFyc2UoJHNjb3BlLnJvbGVzSnNvbik7XG5cbiAgbG9hZENvbW11bmljYXRpb25zKCk7XG5cbiAgZnVuY3Rpb24gbG9hZENvbW11bmljYXRpb25zKCkge1xuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgIGlmICgkc2NvcGUudGhyZWFkLnNwbGl0KFwiLVwiKVsxXSA9PT0gXCJcIikge1xuICAgICAgc2V0VGltZW91dChsb2FkQ29tbXVuaWNhdGlvbnMsIDUwMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHBhZ2VJZCA9ICRzY29wZS50aHJlYWQuc3Vic3RyaW5nKCRzY29wZS50aHJlYWQuaW5kZXhPZihcIi1cIikgKyAxKTtcblxuICAgIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJjb21wYW55LVwiKSAhPSAtMSkge1xuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tcGFueS5nZXRBbGwoe2lkOiBwYWdlSWR9LCBnb3RDb21tdW5pY2F0aW9ucyk7XG4gICAgICAkc2NvcGUua2luZHM9WydFbWFpbCBUbycsICdFbWFpbCBGcm9tJywgJ01lZXRpbmcnLCAnUGhvbmUgQ2FsbCddO1xuICAgIH1cbiAgICBlbHNlIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJzcGVha2VyLVwiKSAhPSAtMSkge1xuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuU3BlYWtlci5nZXRBbGwoe2lkOiBwYWdlSWR9LCBnb3RDb21tdW5pY2F0aW9ucyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ290Q29tbXVuaWNhdGlvbnMoY29tbXVuaWNhdGlvbnMpIHtcbiAgICAgICRzY29wZS5jb21tdW5pY2F0aW9ucyA9IGNvbW11bmljYXRpb25zO1xuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwic3BlYWtlci1cIikgIT0gLTEpIHtcbiAgICAgICAgaWYoY29tbXVuaWNhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICByZXR1cm4gby5raW5kLmluZGV4T2YoJ1BhcmFncmFwaCcpICE9IC0xO1xuICAgICAgICB9KS5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICRzY29wZS5raW5kcz1bJ0VtYWlsIFRvJywgJ0VtYWlsIEZyb20nLCAnTWVldGluZycsICdQaG9uZSBDYWxsJ107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLmtpbmRzPVsnSW5pdGFsIEVtYWlsIFBhcmFncmFwaCcsJ0VtYWlsIFRvJywgJ0VtYWlsIEZyb20nLCAnTWVldGluZycsICdQaG9uZSBDYWxsJ107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAkc2NvcGUucG9zdENvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCEkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEua2luZCB8fCAkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEua2luZD09IFwiXCIpe1xuICAgICAgJHNjb3BlLmVtcHR5Q29tbXVuaWNhdGlvbiA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghJHNjb3BlLmNvbW11bmljYXRpb25EYXRhLnRleHQgfHwgJHNjb3BlLmNvbW11bmljYXRpb25EYXRhLnRleHQ9PSBcIlwiKXtcbiAgICAgICRzY29wZS5lbXB0eUNvbW11bmljYXRpb24gPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBkYXRlID0gRGF0ZS5ub3coKTtcblxuICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uY3JlYXRlKHtcbiAgICAgIHRocmVhZDogJHNjb3BlLnRocmVhZCxcbiAgICAgIG1lbWJlcjogJHNjb3BlLm1lLmlkLFxuICAgICAga2luZDogJHNjb3BlLmNvbW11bmljYXRpb25EYXRhLmtpbmQsXG4gICAgICB0ZXh0OiAkc2NvcGUuY29tbXVuaWNhdGlvbkRhdGEudGV4dCxcbiAgICAgIHBvc3RlZDogZGF0ZSxcbiAgICAgIHVwZGF0ZWQ6IGRhdGVcbiAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGxvYWRDb21tdW5pY2F0aW9ucygpO1xuICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLnNhdmVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICBpZiAoY29tbXVuaWNhdGlvbi5idWZmZXIgPT09IFwiXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb21tdW5pY2F0aW9uLnRleHQgPSBjb21tdW5pY2F0aW9uLmJ1ZmZlcjtcbiAgICBjb21tdW5pY2F0aW9uLnVwZGF0ZWQgPSBEYXRlLm5vdygpO1xuXG4gICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi51cGRhdGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIGNvbW11bmljYXRpb24sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgY29tbXVuaWNhdGlvbi5lZGl0aW5nID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICAkc2NvcGUuZGVsZXRlQ29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XG4gICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5kZWxldGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIGxvYWRDb21tdW5pY2F0aW9ucygpO1xuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5hcHByb3ZlQ29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XG4gICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5hcHByb3ZlKHtpZDogY29tbXVuaWNhdGlvbi5faWR9LCBudWxsLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGxvYWRDb21tdW5pY2F0aW9ucygpO1xuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09IG1lbWJlcklkO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gICRzY29wZS5jaGVja1Blcm1pc3Npb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgIHZhciByb2xlcyA9ICRzY29wZS5tZS5yb2xlcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gJ2RldmVsb3BtZW50LXRlYW0nIHx8IG8uaWQgPT0gJ2Nvb3JkaW5hdGlvbic7XG4gICAgfSk7XG5cbiAgICBpZihyb2xlcy5sZW5ndGggPT0gMCAmJiBjb21tdW5pY2F0aW9uLm1lbWJlciAhPSAkc2NvcGUubWUuaWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIGRhdGUpIC8gMTAwMCk7XG5cbiAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XG4gICAgaWYoc2Vjb25kcyA8IDApe1xuICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHNlY29uZHMpO1xuICAgICAgc3VmZml4ID0gJ3RvIGdvJztcbiAgICB9XG5cbiAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XG5cbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbW9udGhzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtaW51dGVzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XG4gIH07XG5cbiAgJHNjb3BlLmNvbnZlcnRVUkxzID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciB1cmxFeHAgPSAvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2lnO1xuXG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykucmVwbGFjZSh1cmxFeHAsXCI8YSBocmVmPSckMSc+JDE8L2E+XCIpO1xuICB9XG5cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJDb21tdW5pY2F0aW9uRW1iZWRDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUsIENvbW11bmljYXRpb25GYWN0b3J5KSB7XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUlOSVRJQUxJWkFUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUuc3VjY2VzcyAgICAgPSBcIlwiO1xuICAkc2NvcGUuZXJyb3IgICAgICAgPSBcIlwiO1xuXG4gICRzY29wZS5jb21tdW5pY2F0aW9uID0gSlNPTi5wYXJzZSgkc2NvcGUuY29tbXVuaWNhdGlvbkpzb24pO1xuICAkc2NvcGUuY29tbXVuaWNhdGlvbi5lZGl0aW5nID0gZmFsc2U7XG4gICRzY29wZS5jb21tdW5pY2F0aW9uLmRlbGV0ZWQgPSBmYWxzZTtcblxuICAkc2NvcGUubWUgPSBKU09OLnBhcnNlKCRzY29wZS5tZUpzb24pO1xuICAkc2NvcGUubWVtYmVycyA9IEpTT04ucGFyc2UoJHNjb3BlLm1lbWJlcnNKc29uKTtcbiAgJHNjb3BlLnJvbGVzID0gSlNPTi5wYXJzZSgkc2NvcGUucm9sZXNKc29uKTtcblxuXG4gICRzY29wZS5zYXZlQ29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XG4gICAgaWYgKGNvbW11bmljYXRpb24uYnVmZmVyID09PSBcIlwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29tbXVuaWNhdGlvbi50ZXh0ID0gY29tbXVuaWNhdGlvbi5idWZmZXI7XG4gICAgY29tbXVuaWNhdGlvbi51cGRhdGVkID0gRGF0ZS5ub3coKTtcblxuICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24udXBkYXRlKHtpZDogY29tbXVuaWNhdGlvbi5faWR9LCBjb21tdW5pY2F0aW9uLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGNvbW11bmljYXRpb24uZWRpdGluZyA9IGZhbHNlO1xuICAgICAgY29tbXVuaWNhdGlvbi5hcHByb3ZlZCA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLmRlbGV0ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uZGVsZXRlKHtpZDogY29tbXVuaWNhdGlvbi5faWR9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbi5kZWxldGVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuYXBwcm92ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uYXBwcm92ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgbnVsbCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbi5hcHByb3ZlZCA9IHRydWU7XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmNoZWNrUGVybWlzc2lvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XG4gICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcbiAgICB9KTtcblxuICAgIGlmKHJvbGVzLmxlbmd0aCA9PSAwICYmIGNvbW11bmljYXRpb24ubWVtYmVyICE9ICRzY29wZS5tZS5pZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcbiAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgIHZhciBzdWZmaXggPSAnYWdvJztcbiAgICBpZihzZWNvbmRzIDwgMCl7XG4gICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICBzdWZmaXggPSAndG8gZ28nO1xuICAgIH1cblxuICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcblxuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgZGF5cyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcbiAgfTtcblxuICAkc2NvcGUuY29udmVydFVSTHMgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIHVybEV4cCA9IC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWc7XG4gICAgXG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykucmVwbGFjZSh1cmxFeHAsXCI8YSBocmVmPSckMSc+JDE8L2E+XCIpO1xuICB9XG59KTsiLCJyZXF1aXJlKCcuL2FyZWEuanMnKTtcbnJlcXVpcmUoJy4vbGlzdC5qcycpO1xucmVxdWlyZSgnLi9lbWJlZC5qcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignQ29tbXVuaWNhdGlvbnNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsIENvbW11bmljYXRpb25GYWN0b3J5KSB7XG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5nZXRBbGwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAkc2NvcGUuY29tbXVuaWNhdGlvbnMgPSByZXNwb25zZTtcbiAgICB9KTtcblxuICAgICRzY29wZS5zaG93T3BlbiA9IHRydWU7XG5cbiAgICAkc2NvcGUuc2hvd25Db21tdW5pY2F0aW9ucyA9IGZ1bmN0aW9uIChzaG93T3Blbikge1xuICAgICAgcmV0dXJuICRzY29wZS5jb21tdW5pY2F0aW9ucy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICByZXR1cm4gKHNob3dPcGVuID8gIW8uYXBwcm92ZWQgOiBvLmFwcHJvdmVkKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDb21wYW55Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsIENvbXBhbnlGYWN0b3J5LCBNZW1iZXJGYWN0b3J5LCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XG5cbiAgICAkc2NvcGUudHJ1c3RTcmMgPSBmdW5jdGlvbihzcmMpIHtcbiAgICAgIHJldHVybiAkc2NlLnRydXN0QXNSZXNvdXJjZVVybChzcmMrJyNwYWdlLWJvZHknKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuY29udmVydEVtYWlscyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIHZhciBtYWlsRXhwID0gL1tcXHdcXC5cXC1dK1xcQChbXFx3XFwtXStcXC4pK1tcXHddezIsNH0oPyFbXjxdKj4pL2lnO1xuICAgICAgdmFyIHR3aXR0ZXJFeHAgPSAvKF58W15AXFx3XSlAKFxcd3sxLDE1fSlcXGIvZztcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UobWFpbEV4cCxcIjxhIGhyZWY9Jy8jL2NvbXBhbnkvXCIrJHJvdXRlUGFyYW1zLmlkK1wiL2NvbmZpcm0/ZW1haWw9JCYnPiQmPC9hPlwiKS5yZXBsYWNlKHR3aXR0ZXJFeHAsXCIkMTxhIGhyZWY9J2h0dHA6Ly90d2l0dGVyLmNvbS8kMicgdGFyZ2V0PSdfYmxhbmsnPiQyPC9hPlwiKVxuICAgIH1cblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb21wYW55RGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkudXBkYXRlKHsgaWQ6Y29tcGFueURhdGEuaWQgfSwgY29tcGFueURhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnQ29udGFjdGVkJywnSW4gQ29udmVyc2F0aW9ucycsJ0luIE5lZ290aWF0aW9ucycsJ0Nsb3NlZCBEZWFsJywnUmVqZWN0ZWQnLCdHaXZlIFVwJ107XG4gICAgJHNjb3BlLmxvZ29TaXplcyA9IFtudWxsLCAnUycsJ00nLCdMJ107XG4gICAgJHNjb3BlLnN0YW5kRGF5cyA9IFtudWxsLCAxLDIsMyw0LDVdO1xuICAgICRzY29wZS5wb3N0c051bWJlcnMgPSBbbnVsbCwgMSwyLDMsNCw1XTtcblxuICAgICRzY29wZS5jb21wYW55ID0gJHNjb3BlLmZvcm1EYXRhID0gJHNjb3BlLmdldENvbXBhbnkoJHJvdXRlUGFyYW1zLmlkKTtcblxuICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0KHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5jb21wYW55ID0gJHNjb3BlLmZvcm1EYXRhID0gcmVzcG9uc2U7XG5cbiAgICAgIE5vdGlmaWNhdGlvbkZhY3RvcnkuQ29tcGFueS5nZXRBbGwoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihnZXREYXRhKSB7XG4gICAgICAgICRzY29wZS5jb21wYW55Lm5vdGlmaWNhdGlvbnMgPSBnZXREYXRhO1xuXG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDb21wYW55RW1haWxDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgJGxvY2F0aW9uLCBFbWFpbEZhY3RvcnkpIHtcbiAgICAkc2NvcGUuZW1haWwgPSAkbG9jYXRpb24uc2VhcmNoKCkuZW1haWw7XG4gICAgJHNjb3BlLmNvbXBhbnlJZCA9ICRyb3V0ZVBhcmFtcy5pZDtcbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgJHNjb3BlLm1lc3NhZ2UgPSBudWxsO1xuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAgICRzY29wZS5tZXNzYWdlID0gbnVsbDtcblxuICAgICAgY29uc29sZS5sb2coXCJzZW5kIGVtYWlsIHRvIFwiLCAkc2NvcGUuZW1haWwsIFwiIGZyb20gXCIsICRzY29wZS5jb21wYW55SWQpO1xuXG4gICAgICBFbWFpbEZhY3RvcnkuQ29tcGFueS5zZW5kKHsgaWQ6ICRzY29wZS5jb21wYW55SWQgfSwgeyBlbWFpbDogJHNjb3BlLmVtYWlsIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbiBcbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDcmVhdGVDb21wYW55Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgQ29tcGFueUZhY3RvcnkpIHtcbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29tcGFueURhdGEgPSB0aGlzLmZvcm1EYXRhO1xuXG4gICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmNyZWF0ZShjb21wYW55RGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvY29tcGFueS9cIiArIHJlc3BvbnNlLmlkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zdGF0dXNlcyA9IFsnU3VnZ2VzdGlvbicsJ0NvbnRhY3RlZCcsJ0luIENvbnZlcnNhdGlvbnMnLCdJbiBOZWdvdGlhdGlvbnMnLCdDbG9zZWQgRGVhbCcsJ1JlamVjdGVkJywnR2l2ZSBVcCddO1xuICB9KTsiLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNvbXBhbnlFbWJlZENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSkge1xuXG4gICRzY29wZS5tZSA9IEpTT04ucGFyc2UoJHNjb3BlLm1lSnNvbik7XG4gICRzY29wZS5tZW1iZXJzID0gSlNPTi5wYXJzZSgkc2NvcGUubWVtYmVyc0pzb24pO1xuICAkc2NvcGUucm9sZXMgPSBKU09OLnBhcnNlKCRzY29wZS5yb2xlc0pzb24pO1xuXG4gIGlmKCRzY29wZS5jb21tZW50cykge1xuICAgICRzY29wZS5jb21wYW55LmNvbW1lbnRzID0gJHNjb3BlLmNvbW1lbnRzLmZpbHRlcihmdW5jdGlvbihlKSB7XG4gICAgICByZXR1cm4gZS50aHJlYWQgPT0gJ2NvbXBhbnktJyskc2NvcGUuY29tcGFueS5pZDtcbiAgICB9KVxuICB9XG5cbiAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgIHZhciBtZW1iZXIgPSAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XG4gICAgfSk7XG5cbiAgICBpZihtZW1iZXIubGVuZ3RoPjApIHtcbiAgICAgIHJldHVybiBtZW1iZXJbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IFwiTm8gb25lXCIsXG4gICAgICAgIGZhY2Vib29rOiBcIjEwMDAwMDQ1NjMzNTk3MlwiXG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIGRhdGUpIC8gMTAwMCk7XG5cbiAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XG4gICAgaWYoc2Vjb25kcyA8IDApe1xuICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHNlY29uZHMpO1xuICAgICAgc3VmZml4ID0gJ3RvIGdvJztcbiAgICB9XG5cbiAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XG5cbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbW9udGhzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtaW51dGVzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XG4gIH07XG5cbn0pO1xuIiwicmVxdWlyZSgnLi9jb21wYW55LmpzJyk7XG5yZXF1aXJlKCcuL2xpc3QuanMnKTtcbnJlcXVpcmUoJy4vY3JlYXRlLmpzJyk7XG5yZXF1aXJlKCcuL2NvbmZpcm0uanMnKTtcbnJlcXVpcmUoJy4vZW1iZWQuanMnKTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDb21wYW5pZXNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRzY2UsIENvbXBhbnlGYWN0b3J5LCBNZW1iZXJGYWN0b3J5KSB7XG4gICAgJHNjb3BlLnNhdmVTdGF0dXMgPSBmdW5jdGlvbihjb21wYW55KSB7XG4gICAgICB2YXIgY29tcGFueURhdGEgPSBjb21wYW55O1xuXG4gICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LnVwZGF0ZSh7IGlkOmNvbXBhbnkuaWQgfSwgY29tcGFueURhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkc2NvcGUuZ2V0Q2xhc3NGcm9tUGF5bWVudFN0YXR1cyA9IGZ1bmN0aW9uKHBhcnRpY2lwYXRpb24pIHtcbiAgICAgIGlmKCFwYXJ0aWNpcGF0aW9uKSB7IHJldHVybiBcImdyZXlcIjsgfVxuICAgICAgaWYoIXBhcnRpY2lwYXRpb24ucGF5bWVudCkgeyByZXR1cm4gXCJncmV5XCI7IH1cbiAgICAgIGlmKCFwYXJ0aWNpcGF0aW9uLnBheW1lbnQuc3RhdHVzKSB7IHJldHVybiBcImdyZXlcIjsgfVxuICAgICAgdmFyIHN0YXR1cyA9IHBhcnRpY2lwYXRpb24ucGF5bWVudC5zdGF0dXMudG9Mb3dlckNhc2UoKTtcblxuICAgICAgaWYoc3RhdHVzLmluZGV4T2YoXCJwYWdvXCIpICE9IC0xIHx8IHN0YXR1cy5pbmRleE9mKFwiZW1pdGlkb1wiKSAhPSAtMSB8fCBzdGF0dXMuaW5kZXhPZihcInJlY2libyBlbnZpYWRvXCIpICE9IC0xKSB7IHJldHVybiBcImxpbWVcIjsgfSBcbiAgICAgIGVsc2UgaWYoc3RhdHVzLmluZGV4T2YoXCJlbnZpYWRvXCIpICE9IC0xKSB7IHJldHVybiBcIm9yYW5nZVwiOyB9XG4gICAgICBlbHNlIHsgcmV0dXJuIFwiZ3JleVwiOyB9XG4gICAgfVxuXG4gICAgJHNjb3BlLnBheW1lbnRTdGF0dXNlcyA9IFsnRW1pdGlkbycsICdSZWNpYm8gRW52aWFkbycsICdQYWdvJywgJ0VudmlhZG8nXTtcbiAgXG4gICAgJHNjb3BlLmxpbWl0ID0gMTA7XG5cbiAgICAkc2NvcGUuc3RhdHVzZXMgPSBbJ1N1Z2dlc3Rpb24nLCdDb250YWN0ZWQnLCdJbiBDb252ZXJzYXRpb25zJywnSW4gTmVnb3RpYXRpb25zJywnQ2xvc2VkIERlYWwnLCdSZWplY3RlZCcsJ0dpdmUgVXAnXTtcbiAgICBcbiAgICAkc2NvcGUuY29tcGFueVByZWRpY2F0ZSA9ICd1cGRhdGVkJztcbiAgICAkc2NvcGUucmV2ZXJzZSA9ICd0cnVlJztcblxuICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUucHJlZGljYXRlID0gJ3VwZGF0ZWQnO1xuICAgICAgJHNjb3BlLnJldmVyc2UgPSB0cnVlO1xuICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IHJlc3BvbnNlO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCRzY29wZS5saW1pdCA8PSAkc2NvcGUuY29tcGFuaWVzLmxlbmd0aClcbiAgICAgICAgJHNjb3BlLmxpbWl0ICs9IDEwO1xuICAgIH07XG4gIH0pO1xuICAiLCJ0aGVUb29sQ29udHJvbGxlciA9IGFuZ3VsYXIubW9kdWxlKCd0aGVUb29sLmNvbnRyb2xsZXJzJywgW10pO1xuXG5yZXF1aXJlKCcuL21haW4nKTtcbnJlcXVpcmUoJy4vY29tcGFueScpO1xucmVxdWlyZSgnLi9zcGVha2VyJyk7XG5yZXF1aXJlKCcuL21lbWJlcicpO1xucmVxdWlyZSgnLi9jb21tZW50Jyk7XG5yZXF1aXJlKCcuL21lZXRpbmcnKTtcbnJlcXVpcmUoJy4vY2hhdCcpO1xucmVxdWlyZSgnLi90b3BpYycpO1xucmVxdWlyZSgnLi9jb21tdW5pY2F0aW9uJyk7XG5yZXF1aXJlKCcuL3RhZycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKCdob21lJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRzY2UsICAkcm9vdFNjb3BlLCBOb3RpZmljYXRpb25GYWN0b3J5LCBNZW1iZXJGYWN0b3J5KSB7XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAkc2NvcGUubm90aWZpY2F0aW9ucyA9IFtdO1xuICAkc2NvcGUubGltaXQgPSAxMDtcblxuICBpbml0KCk7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCRzY29wZS5sb2FkaW5nKVxuICAgICAgICBpbml0KCk7XG4gICAgfSwgMTAwMCk7XG5cbiAgICBOb3RpZmljYXRpb25GYWN0b3J5Lk5vdGlmaWNhdGlvbi5nZXRBbGwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5ub3RpZmljYXRpb25zID0gcmVzcG9uc2U7XG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICgkc2NvcGUubGltaXQgPCAkc2NvcGUubm90aWZpY2F0aW9ucy5sZW5ndGgpXG4gICAgICAkc2NvcGUubGltaXQgKz0gMTA7XG4gIH07XG5cbn0pO1xuIiwicmVxdWlyZSgnLi9tYWluLmpzJyk7XG5yZXF1aXJlKCcuL2hvbWUuanMnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCAkbG9jYXRpb24sICRyb290U2NvcGUsIE5vdGlmaWNhdGlvbkZhY3RvcnksIE1lbWJlckZhY3RvcnksIENvbXBhbnlGYWN0b3J5LCBTcGVha2VyRmFjdG9yeSwgVG9waWNGYWN0b3J5LCBSb2xlRmFjdG9yeSwgVGFnRmFjdG9yeSwgQ29tbWVudEZhY3RvcnkpIHtcblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5yZWFkeSA9IGZhbHNlO1xuXG4gICRzY29wZS5kaXNwbGF5ID0gZmFsc2U7XG5cbiAgJHNjb3BlLnNlYXJjaCA9IHt9O1xuICAkc2NvcGUuc2VhcmNoVG9waWNzID0ge307XG4gICRzY29wZS5zZWFyY2hDb21wYW5pZXMgPSB7fTtcbiAgJHNjb3BlLnNlYXJjaFNwZWFrZXJzID0ge307XG4gICRzY29wZS5zZWFyY2hNZW1iZXJzID0ge307XG5cbiAgJHNjb3BlLm1lID0ge307XG4gICRzY29wZS5tZW1iZXJzID0gW107XG4gICRzY29wZS5jb21wYW5pZXMgPSBbXTtcbiAgJHNjb3BlLnNwZWFrZXJzID0gW107XG4gICRzY29wZS50b3BpY3MgPSBbXTtcbiAgJHNjb3BlLm5vdGlmaWNhdGlvbnMgPSBbXTtcblxuICAkc2NvcGUubm90aWZpY2F0aW9uc0luZm8gPSB7XG4gICAgbnVtYmVyOiAwLFxuICAgIHRleHQ6IFwiIExvYWRpbmcuLi5cIlxuICB9O1xuXG4gIHZhciBmYWN0b3JpZXNSZWFkeSA9IDA7XG5cbiAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuZ2V0KHtpZDogXCJtZVwifSwgZnVuY3Rpb24gKG1lKSB7XG4gICAgJHNjb3BlLm1lID0gbWU7XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cbiAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuZ2V0QWxsKGZ1bmN0aW9uIChtZW1iZXJzKSB7XG4gICAgJHNjb3BlLm1lbWJlcnMgPSBtZW1iZXJzO1xuICAgIGNhbGxiYWNrKCk7XG4gIH0pO1xuXG4gIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuZ2V0QWxsKGZ1bmN0aW9uIChjb21wYW5pZXMpIHtcbiAgICAkc2NvcGUuY29tcGFuaWVzID0gY29tcGFuaWVzO1xuICAgIGNhbGxiYWNrKCk7XG4gIH0pO1xuXG4gIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKGZ1bmN0aW9uIChzcGVha2Vycykge1xuICAgICRzY29wZS5zcGVha2VycyA9IHNwZWFrZXJzO1xuICAgIGNhbGxiYWNrKCk7XG4gIH0pO1xuXG4gIFRvcGljRmFjdG9yeS5Ub3BpYy5nZXRBbGwoZnVuY3Rpb24gKHRvcGljcykge1xuICAgICRzY29wZS50b3BpY3MgPSB0b3BpY3M7XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cbiAgUm9sZUZhY3RvcnkuUm9sZS5nZXRBbGwoZnVuY3Rpb24gKHJvbGVzKSB7XG4gICAgJHNjb3BlLnJvbGVzID0gcm9sZXM7XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cbiAgVGFnRmFjdG9yeS5UYWcuZ2V0QWxsKGZ1bmN0aW9uICh0YWdzKSB7XG4gICAgJHNjb3BlLnRvcGljVGFncyA9IHRhZ3M7XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cbiAgQ29tbWVudEZhY3RvcnkuQ29tbWVudC5nZXRBbGwoZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgJHNjb3BlLmNvbW1lbnRzID0gY29tbWVudHM7XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBjYWxsYmFjaygpIHtcbiAgICBpZiAoKytmYWN0b3JpZXNSZWFkeSA9PSA4KSB7XG4gICAgICAkc2NvcGUucmVhZHkgPSB0cnVlO1xuXG4gICAgICAkc2NvcGUudXBkYXRlKCk7XG5cbiAgICAgIHNldEludGVydmFsKCRzY29wZS51cGRhdGUsIDEwMDAwKTtcblxuICAgICAgJHJvb3RTY29wZS4kb24oXCIkbG9jYXRpb25DaGFuZ2VTdGFydFwiLCBmdW5jdGlvbiAoZXZlbnQsIG5leHQsIGN1cnJlbnQpIHtcbiAgICAgICAgc2V0VGltZW91dCgkc2NvcGUudXBkYXRlLCA1MDApO1xuICAgICAgICAkc2NvcGUuc2VhcmNoLm5hbWUgPSAnJztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVNDT1BFIEZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIE5vdGlmaWNhdGlvbkZhY3RvcnkuTm90aWZpY2F0aW9uLmdldEFsbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5ub3RpZmljYXRpb25zID0gW107XG4gICAgICAkc2NvcGUubm90aWZpY2F0aW9uc0luZm8ubnVtYmVyID0gMDtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSByZXNwb25zZS5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlW2ldLnVucmVhZC5pbmRleE9mKCRzY29wZS5tZS5pZCkgIT0gLTEpIHtcbiAgICAgICAgICAkc2NvcGUubm90aWZpY2F0aW9uc0luZm8ubnVtYmVyKys7XG5cbiAgICAgICAgICAkc2NvcGUubm90aWZpY2F0aW9ucy51bnNoaWZ0KHJlc3BvbnNlW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoJHNjb3BlLm5vdGlmaWNhdGlvbnNJbmZvLm51bWJlciA9PSAwKSB7XG4gICAgICAgICRzY29wZS5ub3RpZmljYXRpb25zSW5mby50ZXh0ID0gXCIgTm8gTm90aWZpY2F0aW9uc1wiO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICRzY29wZS5ub3RpZmljYXRpb25zSW5mby50ZXh0ID0gXCIgXCIgKyAkc2NvcGUubm90aWZpY2F0aW9uc0luZm8ubnVtYmVyICsgXCIgTm90aWZpY2F0aW9uXCIgKyAoJHNjb3BlLm5vdGlmaWNhdGlvbnNJbmZvLm51bWJlciA+IDEgPyBcInNcIiA6IFwiXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcbiAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgIHZhciBzdWZmaXggPSAnYWdvJztcbiAgICBpZihzZWNvbmRzIDwgMCl7XG4gICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICBzdWZmaXggPSAndG8gZ28nO1xuICAgIH1cblxuICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcblxuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgZGF5cyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcbiAgfTtcblxuICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgdmFyIG1lbWJlciA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICB9KTtcblxuICAgIGlmKG1lbWJlci5sZW5ndGg+MCkge1xuICAgICAgcmV0dXJuIG1lbWJlclswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogXCJObyBvbmVcIixcbiAgICAgICAgZmFjZWJvb2s6IFwiMTAwMDAwNDU2MzM1OTcyXCJcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLmdldFNwZWFrZXIgPSBmdW5jdGlvbiAoc3BlYWtlcklkKSB7XG4gICAgcmV0dXJuICRzY29wZS5zcGVha2Vycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gc3BlYWtlcklkO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gICRzY29wZS5nZXRDb21wYW55ID0gZnVuY3Rpb24gKGNvbXBhbnlJZCkge1xuICAgIHJldHVybiAkc2NvcGUuY29tcGFuaWVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBjb21wYW55SWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmdldFRvcGljID0gZnVuY3Rpb24gKHRvcGljSWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uX2lkID09IHRvcGljSWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLnNob3cgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuZGlzcGxheSA9ICgkc2NvcGUuc2VhcmNoLm5hbWUgPyB0cnVlIDogZmFsc2UpO1xuICB9O1xuXG4gICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLmRpc3BsYXkgPSBmYWxzZTtcbiAgfTtcblxuICAkc2NvcGUuY29udmVydFVSTHMgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIHVybEV4cCA9IC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWc7XG4gICAgXG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykucmVwbGFjZSh1cmxFeHAsXCI8YSBocmVmPSckMSc+JDE8L2E+XCIpO1xuICB9XG5cbiAgJHNjb3BlLmNvbnZlcnROZXdMaW5lc1RvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICByZXR1cm4gJzxkaXYgZGF0YS1tYXJrZG93bj4nK3RleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykrJzwvZGl2Pic7XG4gIH1cblxuICAkc2NvcGUuY29udmVydE1hcmtkb3duVG9IdG1sID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicgKyB0ZXh0ICsgJzwvZGl2Pic7XG4gIH1cblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIk1lZXRpbmdFbWJlZENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgTWVldGluZ0ZhY3RvcnkpIHtcblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICBNZWV0aW5nRmFjdG9yeS5nZXQoe2lkOiAkc2NvcGUubWVldGluZ0lkfSwgZnVuY3Rpb24gKG1lZXRpbmcpIHtcbiAgICAkc2NvcGUubWVldGluZyA9IG1lZXRpbmc7XG5cbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICB9KTtcblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5nZXRNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVySWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PT0gbWVtYmVySWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbn0pO1xuIiwicmVxdWlyZShcIi4vZW1iZWRcIik7XG5yZXF1aXJlKFwiLi9saXN0XCIpO1xucmVxdWlyZShcIi4vbWVldGluZ1wiKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignTWVldGluZ3NDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2F0aW9uLCBNZWV0aW5nRmFjdG9yeSkge1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gIGluaXQoKTtcblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJHNjb3BlLmxvYWRpbmcpIHtcbiAgICAgICAgaW5pdCgpO1xuICAgICAgfVxuICAgIH0sIDEwMDApO1xuXG4gICAgTWVldGluZ0ZhY3RvcnkuZ2V0QWxsKGZ1bmN0aW9uIChtZWV0aW5ncykge1xuICAgICAgJHNjb3BlLm1lZXRpbmdzID0gbWVldGluZ3M7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLm1lZXRpbmdzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAkc2NvcGUubWVldGluZ3NbaV0uZmFjZWJvb2sgPSAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICAgIHJldHVybiAkc2NvcGUubWVldGluZ3NbaV0uYXV0aG9yID09IG8uaWQ7XG4gICAgICAgIH0pWzBdLmZhY2Vib29rO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUudGltZSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gJHNjb3BlLnRpbWVTaW5jZShuZXcgRGF0ZShkYXRlKSk7XG4gIH07XG5cbiAgJHNjb3BlLmNyZWF0ZU1lZXRpbmcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG5cbiAgICBNZWV0aW5nRmFjdG9yeS5jcmVhdGUoe1xuICAgICAgYXV0aG9yOiAkc2NvcGUubWUuaWQsXG4gICAgICB0aXRsZTogZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoXCJwdC1QVFwiKSArIFwiIC0gTWVldGluZ1wiLFxuICAgICAgZGF0ZTogZGF0ZVxuICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9tZWV0aW5nL1wiICsgcmVzcG9uc2UuaWQgKyBcIi9lZGl0XCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiTWVldGluZ0NvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24sICR0aW1lb3V0LCBNZWV0aW5nRmFjdG9yeSwgVG9waWNGYWN0b3J5LCBUYWdGYWN0b3J5KSB7XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUlOSVRJQUxJWkFUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgJHNjb3BlLmtpbmRzID0gW1wiSW5mb1wiLCBcIlRvIGRvXCIsIFwiRGVjaXNpb25cIiwgXCJJZGVhXCJdO1xuXG4gIE1lZXRpbmdGYWN0b3J5LmdldCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uIChtZWV0aW5nKSB7XG4gICAgJHNjb3BlLm1lZXRpbmcgPSBtZWV0aW5nO1xuXG4gICAgU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCA9IGZ1bmN0aW9uIChzdWZmaXgpIHtcbiAgICAgIHJldHVybiB0aGlzLmluZGV4T2Yoc3VmZml4LCB0aGlzLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpICE9PSAtMTtcbiAgICB9O1xuXG4gICAgaWYgKCRsb2NhdGlvbi5wYXRoKCkuZW5kc1dpdGgoXCIvdGV4dFwiKSkge1xuICAgICAgdmFyIHRleHQgPSBtZWV0aW5nLnRpdGxlICsgXCJcXG5cXG5cIiArIChtZWV0aW5nLmRlc2NyaXB0aW9uID8gbWVldGluZy5kZXNjcmlwdGlvbiArIFwiXFxuXFxuXCIgOiBcIlwiKTtcblxuICAgICAgaWYgKG1lZXRpbmcuYXR0ZW5kYW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRleHQgKz0gXCJBdHRlbmRhbnRzOlxcblwiO1xuXG4gICAgICAgIG1lZXRpbmcuYXR0ZW5kYW50cy5zb3J0KCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZWV0aW5nLmF0dGVuZGFudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0ZXh0ICs9ICRzY29wZS5nZXRNZW1iZXIobWVldGluZy5hdHRlbmRhbnRzW2ldKS5uYW1lICsgKGkrMSA8IG1lZXRpbmcuYXR0ZW5kYW50cy5sZW5ndGggPyBcIiwgXCIgOiBcIlwiKTtcbiAgICAgICAgfVxuICAgICAgICB0ZXh0ICs9IFwiXFxuXFxuXCI7XG4gICAgICB9XG5cbiAgICAgIFRhZ0ZhY3RvcnkuVGFnLmdldEFsbChmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIHZhciB0YWdzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0YWdzLnB1c2gocmVzdWx0W2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRhZ3Muc29ydChmdW5jdGlvbiAobzEsIG8yKSB7XG4gICAgICAgICAgcmV0dXJuIG8xLm5hbWUubG9jYWxlQ29tcGFyZShvMi5uYW1lKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHRvcGljcyA9IG1lZXRpbmcudG9waWNzLmZpbHRlcihmdW5jdGlvbiAobykge1xuICAgICAgICAgICAgcmV0dXJuIG8udGFncy5pbmRleE9mKHRhZ3NbaV0uaWQpICE9IC0xO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKHRvcGljcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRleHQgKz0gdGFnc1tpXS5uYW1lICsgXCI6XFxuXCI7XG5cbiAgICAgICAgICB0b3BpY3Muc29ydChmdW5jdGlvbiAobzEsIG8yKSB7XG4gICAgICAgICAgICByZXR1cm4gbzEucG9zdGVkLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZShvMi5wb3N0ZWQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRvcGljcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdGV4dCArPSBcIiAgICAtIFwiICsgdG9waWNzW2pdLnRleHQucmVwbGFjZSgvXFxuL2csIFwiXFxuICAgICAgXCIpICsgXCJcXG5cIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0ZXh0ICs9IFwiXFxuXCI7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUubnVtYmVyT2ZMaW5lcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIG4gPSAwO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRleHRbaV0gPT09IFwiXFxuXCIpIHtcbiAgICAgICAgICAgICAgbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbiArIDI7XG4gICAgICAgIH0oKSk7XG5cbiAgICAgICAgJHNjb3BlLnRleHQgPSB0ZXh0O1xuXG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09RlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUudG9nZ2xlQXR0ZW5kYW50ID0gZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHZhciBpbmRleCA9ICRzY29wZS5tZWV0aW5nLmF0dGVuZGFudHMuaW5kZXhPZihtZW1iZXIpO1xuXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgJHNjb3BlLm1lZXRpbmcuYXR0ZW5kYW50cy5wdXNoKG1lbWJlcik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgJHNjb3BlLm1lZXRpbmcuYXR0ZW5kYW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUudG9nZ2xlQXR0ZW5kYW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS5tZW1iZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgJHNjb3BlLnRvZ2dsZUF0dGVuZGFudCgkc2NvcGUubWVtYmVyc1tpXS5pZCk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5nZXRBdHRlbmRhbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkc2NvcGUubWVldGluZy5hdHRlbmRhbnRzLm1hcChmdW5jdGlvbiAobykge1xuICAgICAgcmV0dXJuICRzY29wZS5nZXRNZW1iZXIobyk7XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmNyZWF0ZVRvcGljID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICB2YXIgdG9waWMgPSB7XG4gICAgICBlZGl0aW5nOiB0cnVlLFxuICAgICAgYXV0aG9yOiAkc2NvcGUubWUuaWQsXG4gICAgICB0ZXh0OiBcIlwiLFxuICAgICAgdGFyZ2V0czogW10sXG4gICAgICBraW5kOiBraW5kLFxuICAgICAgY2xvc2VkOiBmYWxzZSxcbiAgICAgIHJlc3VsdDogXCJcIixcbiAgICAgIHBvbGw6IHtcbiAgICAgICAga2luZDogXCJ0ZXh0XCIsXG4gICAgICAgIG9wdGlvbnM6IFtdXG4gICAgICB9LFxuICAgICAgZHVlZGF0ZTogbnVsbCxcbiAgICAgIG1lZXRpbmdzOiBbJHNjb3BlLm1lZXRpbmcuX2lkXSxcbiAgICAgIHJvb3Q6IG51bGwsXG4gICAgICB0YWdzOiBbXSxcbiAgICAgIHBvc3RlZDogbmV3IERhdGUoKVxuICAgIH07XG5cbiAgICBUb3BpY0ZhY3RvcnkuVG9waWMuY3JlYXRlKHRvcGljLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgIHRvcGljLl9pZCA9IHJlc3BvbnNlLmlkO1xuICAgICAgICAkc2NvcGUubWVldGluZy50b3BpY3MucHVzaCh0b3BpYyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmFkZFRvcGljID0gZnVuY3Rpb24gKHRvcGljSWQpIHtcbiAgICAkc2NvcGUuZGlzcGxheSA9IGZhbHNlO1xuXG4gICAgdmFyIHRvcGljID0gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiBvLl9pZCA9PT0gdG9waWNJZDtcbiAgICB9KVswXTtcblxuICAgICRzY29wZS5tZWV0aW5nLnRvcGljcy5wdXNoKHRvcGljKTtcblxuICAgIHRvcGljLm1lZXRpbmdzLnB1c2goJHNjb3BlLm1lZXRpbmcuX2lkKTtcbiAgICBUb3BpY0ZhY3RvcnkuVG9waWMudXBkYXRlKHtpZDogdG9waWMuX2lkfSwgdG9waWMpO1xuICB9O1xuXG4gICRzY29wZS5yZW1vdmVUb3BpYyA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgICRzY29wZS5tZWV0aW5nLnRvcGljcy5zcGxpY2UoJHNjb3BlLm1lZXRpbmcudG9waWNzLmluZGV4T2YodG9waWMpLCAxKTtcblxuICAgIHRvcGljLm1lZXRpbmdzLnNwbGljZSh0b3BpYy5tZWV0aW5ncy5pbmRleE9mKCRzY29wZS5tZWV0aW5nLl9pZCksIDEpO1xuICAgIFRvcGljRmFjdG9yeS5Ub3BpYy51cGRhdGUoe2lkOiB0b3BpYy5faWR9LCB0b3BpYyk7XG4gIH07XG5cbiAgJHNjb3BlLnNhdmVNZWV0aW5nID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5zdWNjZXNzID0gXCJcIjtcbiAgICAkc2NvcGUuZXJyb3IgICA9IFwiXCI7XG5cbiAgICBpZiAoISRzY29wZS5tZWV0aW5nLnRpdGxlKXtcbiAgICAgICRzY29wZS5lcnJvciA9IFwiUGxlYXNlIGVudGVyIGEgdGl0bGUuXCI7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgTWVldGluZ0ZhY3RvcnkudXBkYXRlKHtpZDogJHNjb3BlLm1lZXRpbmcuX2lkfSwgJHNjb3BlLm1lZXRpbmcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgJHNjb3BlLnN1Y2Nlc3MgPSBcIk1lZXRpbmcgc2F2ZWQuXCI7XG5cbiAgICAgICAgaWYgKCRzY29wZS50aW1lb3V0KSB7XG4gICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKCRzY29wZS50aW1lb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS50aW1lb3V0ID0gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRzY29wZS5zdWNjZXNzID0gXCJcIjtcbiAgICAgICAgfSwgMzAwMCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuZGVsZXRlTWVldGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBtZWV0aW5nP1wiKSkge1xuICAgICAgTWVldGluZ0ZhY3RvcnkuZGVsZXRlKHtpZDogJHNjb3BlLm1lZXRpbmcuX2lkfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9tZWV0aW5ncy9cIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAkc2NvcGUuZGlzcGxheSA9ICgkc2NvcGUuc2VhcmNoVG9waWMgPyB0cnVlIDogZmFsc2UpO1xuICB9O1xuXG4gICRzY29wZS5hbHJlYWR5SW5NZWV0aW5nRmlsdGVyID0gZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubWVldGluZy50b3BpY3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICgkc2NvcGUubWVldGluZy50b3BpY3NbaV0uX2lkID09PSB0b3BpYy5faWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNyZWF0ZU1lbWJlckNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCBNZW1iZXJGYWN0b3J5KSB7XG4gIFxuICAkc2NvcGUuZm9ybURhdGEgPSB7fTtcbiAgJHNjb3BlLmZvcm1EYXRhLnJvbGVzID0gW107XG4gICRzY29wZS5mb3JtRGF0YS5waG9uZXMgPSBbXTtcblxuICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1lbWJlckRhdGEgPSB0aGlzLmZvcm1EYXRhO1xuXG4gICAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuY3JlYXRlKG1lbWJlckRhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9tZW1iZXIvXCIgKyByZXNwb25zZS5pZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbn0pO1xuIiwicmVxdWlyZSgnLi9tZW1iZXIuanMnKTtcbnJlcXVpcmUoJy4vbGlzdC5qcycpO1xucmVxdWlyZSgnLi9jcmVhdGUuanMnKTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdNZW1iZXJzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCBNZW1iZXJGYWN0b3J5KSB7XG4gICAgJHNjb3BlLnNldFNlYXJjaFJvbGUgPSBmdW5jdGlvbihyb2xlSWQpIHtcbiAgICAgICRzY29wZS5zZWFyY2hSb2xlcz1yb2xlSWQ7XG4gICAgfVxuXG4gICAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuZ2V0QWxsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUucHJlZGljYXRlID0gJ25hbWUnO1xuICAgICAgJHNjb3BlLnJldmVyc2UgPSBmYWxzZTtcbiAgICAgICRzY29wZS5tZW1iZXJzID0gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH0pO1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIk1lbWJlckNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgJGxvY2F0aW9uLCBNZW1iZXJGYWN0b3J5KSB7XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gIGlmICgkcm91dGVQYXJhbXMuaWQgPT09IFwibWVcIikge1xuICAgICRsb2NhdGlvbi5wYXRoKFwiL21lbWJlci9cIiArICRzY29wZS5tZS5pZCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgJHNjb3BlLm1lbWJlciA9ICRzY29wZS5mb3JtRGF0YSA9ICRzY29wZS5nZXRNZW1iZXIoJHJvdXRlUGFyYW1zLmlkKTtcblxuICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXQoe2lkOiRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKHJlc3VsdCkgeyBcbiAgICBpZighcmVzdWx0LmVycm9yKSB7XG4gICAgICAkc2NvcGUubWVtYmVyID0gJHNjb3BlLmZvcm1EYXRhID0gcmVzdWx0O1xuICAgICAgZ2V0TWVtYmVyU3R1ZmYoKTtcbiAgICB9IFxuICB9KTtcblxuICBnZXRNZW1iZXJTdHVmZigpO1xuXG4gIGZ1bmN0aW9uIGdldE1lbWJlclN0dWZmKCkge1xuICAgIGlmKCRzY29wZS5jb21wYW5pZXMgJiYgJHNjb3BlLnNwZWFrZXJzICYmICRzY29wZS5jb21tZW50cyAmJiAkc2NvcGUuY29tcGFuaWVzLmxlbmd0aCA+IDAgJiYgJHNjb3BlLnNwZWFrZXJzLmxlbmd0aCA+IDAgJiYgJHNjb3BlLmNvbW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGdldE1lbWJlclN0dWZmLCAxMDAwKTtcbiAgICB9XG5cbiAgICAkc2NvcGUubWVtYmVyLmNvbXBhbmllcyA9ICRzY29wZS5jb21wYW5pZXMuZmlsdGVyKGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiBlLm1lbWJlciA9PSAkc2NvcGUubWVtYmVyLmlkO1xuICAgIH0pXG5cbiAgICAkc2NvcGUubWVtYmVyLnNwZWFrZXJzID0gJHNjb3BlLnNwZWFrZXJzLmZpbHRlcihmdW5jdGlvbihlKSB7XG4gICAgICByZXR1cm4gZS5tZW1iZXIgPT0gJHNjb3BlLm1lbWJlci5pZDtcbiAgICB9KVxuXG4gICAgJHNjb3BlLm1lbWJlci5jb21tZW50cyA9ICRzY29wZS5jb21tZW50cy5maWx0ZXIoZnVuY3Rpb24oZSkge1xuICAgICAgcmV0dXJuIGUubWVtYmVyID09ICRzY29wZS5tZW1iZXIuaWQ7XG4gICAgfSlcbiAgfVxuXG5cbiAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBtZW1iZXJEYXRhID0gdGhpcy5mb3JtRGF0YTtcblxuICAgIE1lbWJlckZhY3RvcnkuTWVtYmVyLnVwZGF0ZSh7IGlkOm1lbWJlckRhdGEuaWQgfSwgbWVtYmVyRGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXJcbiAgLmNvbnRyb2xsZXIoJ1NwZWFrZXJFbWFpbENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCAkbG9jYXRpb24sIEVtYWlsRmFjdG9yeSkge1xuICAgICRzY29wZS5lbWFpbCA9ICRsb2NhdGlvbi5zZWFyY2goKS5lbWFpbDtcbiAgICAkc2NvcGUuc3BlYWtlcklkID0gJHJvdXRlUGFyYW1zLmlkO1xuICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAkc2NvcGUubWVzc2FnZSA9IG51bGw7XG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBudWxsO1xuXG4gICAgICBjb25zb2xlLmxvZyhcInNlbmQgZW1haWwgdG8gXCIsICRzY29wZS5lbWFpbCwgXCIgZnJvbSBcIiwgJHNjb3BlLnNwZWFrZXJJZCk7XG5cbiAgICAgIEVtYWlsRmFjdG9yeS5TcGVha2VyLnNlbmQoeyBpZDogJHNjb3BlLnNwZWFrZXJJZCB9LCB7IGVtYWlsOiAkc2NvcGUuZW1haWwgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuIFxudGhlVG9vbENvbnRyb2xsZXJcbiAgLmNvbnRyb2xsZXIoJ0NyZWF0ZVNwZWFrZXJDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uLCBTcGVha2VyRmFjdG9yeSkge1xuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzcGVha2VyRGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuY3JlYXRlKHNwZWFrZXJEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9zcGVha2VyL1wiICsgcmVzcG9uc2UuaWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnQ29udGFjdGVkJywnSW4gQ29udmVyc2F0aW9ucycsJ0FjY2VwdGVkJywnUmVqZWN0ZWQnLCdHaXZlIFVwJ107XG4gIH0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKFwiU3BlYWtlckVtYmVkQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbiAgJHNjb3BlLm1lID0gSlNPTi5wYXJzZSgkc2NvcGUubWVKc29uKTtcbiAgJHNjb3BlLm1lbWJlcnMgPSBKU09OLnBhcnNlKCRzY29wZS5tZW1iZXJzSnNvbik7XG4gICRzY29wZS5yb2xlcyA9IEpTT04ucGFyc2UoJHNjb3BlLnJvbGVzSnNvbik7XG5cbiAgaWYoJHNjb3BlLmNvbW1lbnRzKSB7XG4gICAgJHNjb3BlLnNwZWFrZXIuY29tbWVudHMgPSAkc2NvcGUuY29tbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiBlLnRocmVhZCA9PSAnc3BlYWtlci0nKyRzY29wZS5zcGVha2VyLmlkO1xuICAgIH0pXG4gIH1cblxuICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgdmFyIG1lbWJlciA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICB9KTtcblxuICAgIGlmKG1lbWJlci5sZW5ndGg+MCkge1xuICAgICAgcmV0dXJuIG1lbWJlclswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogXCJObyBvbmVcIixcbiAgICAgICAgZmFjZWJvb2s6IFwiMTAwMDAwNDU2MzM1OTcyXCJcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcbiAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgIHZhciBzdWZmaXggPSAnYWdvJztcbiAgICBpZihzZWNvbmRzIDwgMCl7XG4gICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICBzdWZmaXggPSAndG8gZ28nO1xuICAgIH1cblxuICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcblxuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgZGF5cyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcbiAgfTtcblxufSk7XG4iLCJyZXF1aXJlKCcuL3NwZWFrZXIuanMnKTtcbnJlcXVpcmUoJy4vbGlzdC5qcycpO1xucmVxdWlyZSgnLi9jcmVhdGUuanMnKTtcbnJlcXVpcmUoJy4vY29uZmlybS5qcycpO1xucmVxdWlyZSgnLi9lbWJlZC5qcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignU3BlYWtlcnNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRzY2UsIFNwZWFrZXJGYWN0b3J5LCBNZW1iZXJGYWN0b3J5KSB7XG4gIFxuICAgICRzY29wZS5saW1pdCA9IDEwO1xuXG4gICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnQ29udGFjdGVkJywnSW4gQ29udmVyc2F0aW9ucycsJ0FjY2VwdGVkJywnUmVqZWN0ZWQnLCdHaXZlIFVwJ107XG5cbiAgICAkc2NvcGUuc3BlYWtlclByZWRpY2F0ZSA9ICd1cGRhdGVkJztcbiAgICAkc2NvcGUucmV2ZXJzZSA9ICd0cnVlJztcbiAgICBcbiAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmdldEFsbChmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLnNwZWFrZXJzID0gcmVzcG9uc2U7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc2Nyb2xsID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJHNjb3BlLmxpbWl0IDw9ICRzY29wZS5zcGVha2Vycy5sZW5ndGgpXG4gICAgICAgICRzY29wZS5saW1pdCArPSAxMDtcbiAgICB9O1xuICB9KTtcbiAgIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignU3BlYWtlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCBTcGVha2VyRmFjdG9yeSwgTWVtYmVyRmFjdG9yeSwgTm90aWZpY2F0aW9uRmFjdG9yeSkge1xuICAgICRzY29wZS50cnVzdFNyYyA9IGZ1bmN0aW9uKHNyYykge1xuICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKHNyYysnI3BhZ2UtYm9keScpO1xuICAgIH1cblxuICAgICRzY29wZS5jb252ZXJ0RW1haWxzID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgdmFyIG1haWxFeHAgPSAvW1xcd1xcLlxcLV0rXFxAKFtcXHdcXC1dK1xcLikrW1xcd117Miw0fSg/IVtePF0qPikvaWc7XG4gICAgICB2YXIgdHdpdHRlckV4cCA9IC8oXnxbXkBcXHddKUAoXFx3ezEsMTV9KVxcYi9nO1xuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShtYWlsRXhwLFwiPGEgaHJlZj0nLyMvY29tcGFueS9cIiskcm91dGVQYXJhbXMuaWQrXCIvY29uZmlybT9lbWFpbD0kJic+JCY8L2E+XCIpLnJlcGxhY2UodHdpdHRlckV4cCxcIiQxPGEgaHJlZj0naHR0cDovL3R3aXR0ZXIuY29tLyQyJyB0YXJnZXQ9J19ibGFuayc+QCQyPC9hPlwiKVxuICAgIH1cblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzcGVha2VyRGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIudXBkYXRlKHsgaWQ6c3BlYWtlckRhdGEuaWQgfSwgc3BlYWtlckRhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnN0YXR1c2VzID0gWydTdWdnZXN0aW9uJywnQ29udGFjdGVkJywnSW4gQ29udmVyc2F0aW9ucycsJ0FjY2VwdGVkJywnUmVqZWN0ZWQnLCdHaXZlIFVwJ107XG5cbiAgICAkc2NvcGUuc3BlYWtlciA9ICRzY29wZS5mb3JtRGF0YSA9ICRzY29wZS5nZXRTcGVha2VyKCRyb3V0ZVBhcmFtcy5pZCk7XG5cbiAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmdldCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuc3BlYWtlciA9ICRzY29wZS5mb3JtRGF0YSA9IHJlc3BvbnNlO1xuXG4gICAgICBOb3RpZmljYXRpb25GYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24oZ2V0RGF0YSkge1xuICAgICAgICAkc2NvcGUuc3BlYWtlci5ub3RpZmljYXRpb25zID0gZ2V0RGF0YTtcblxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgfSk7XG4iLCJyZXF1aXJlKCcuL21hbmFnZXInKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIlRhZ01hbmFnZXJDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUsIFRhZ0ZhY3RvcnkpIHtcblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgJHNjb3BlLnRhZyA9IHt9O1xuXG4gICRzY29wZS5saWdodENvbG9ycyA9IFtcIiNmN2M2YzdcIiwgXCIjZmFkOGM3XCIsIFwiI2ZlZjJjMFwiLCBcIiNiZmU1YmZcIiwgXCIjYmZkYWRjXCIsIFwiI2M3ZGVmOFwiLCBcIiNiZmQ0ZjJcIiwgXCIjZDRjNWY5XCJdO1xuICAkc2NvcGUuY29sb3JzID0gW1wiI2UxMWQyMVwiLCBcIiNlYjY0MjBcIiwgXCIjZmJjYTA0XCIsIFwiIzAwOTgwMFwiLCBcIiMwMDZiNzVcIiwgXCIjMjA3ZGU1XCIsIFwiIzAwNTJjY1wiLCBcIiM1MzE5ZTdcIl07XG5cbiAgJHNjb3BlLmNoYW5nZUNvbG9yID0gZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgJHNjb3BlLnRhZy5jb2xvciA9IGNvbG9yO1xuICB9O1xuXG4gICRzY29wZS5jcmVhdGVUYWcgPSBmdW5jdGlvbiAodGFnKSB7XG4gICAgVGFnRmFjdG9yeS5UYWcuY3JlYXRlKHRhZywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAkc2NvcGUudGFncy5wdXNoKHJlc3BvbnNlLnRhZyk7XG4gICAgICAgICRzY29wZS50YWcgPSB7fTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuc2F2ZVRhZyA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgICBUYWdGYWN0b3J5LlRhZy51cGRhdGUoe2lkOiB0YWcuaWR9LCB0YWcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgdGFnLmVkaXRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuZGVsZXRlVGFnID0gZnVuY3Rpb24gKHRhZykge1xuICAgIFRhZ0ZhY3RvcnkuVGFnLmRlbGV0ZSh7aWQ6IHRhZy5pZH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgJHNjb3BlLnRhZ3Muc3BsaWNlKCRzY29wZS50YWdzLmluZGV4T2YodGFnKSwgMSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJUb3BpY0VtYmVkQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCBUb3BpY0ZhY3RvcnkpIHtcblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAkc2NvcGUuZXJyb3IgICAgICAgPSBcIlwiO1xuICAkc2NvcGUuc2hvd1RhcmdldHMgPSBmYWxzZTtcblxuICAkc2NvcGUucG9sbEtpbmRzID0gW1widGV4dFwiLCBcImltYWdlc1wiXTtcblxuICBpZiAoJHNjb3BlLmNvbW1lbnRzKSB7XG4gICAgJHNjb3BlLnRvcGljLmNvbW1lbnRzID0gJHNjb3BlLmNvbW1lbnRzLmZpbHRlcihmdW5jdGlvbiAoZSkge1xuICAgICAgcmV0dXJuIGUudGhyZWFkID09IFwidG9waWMtXCIgKyAkc2NvcGUudG9waWMuX2lkO1xuICAgIH0pO1xuICB9XG5cbiAgc2hvdygkc2NvcGUudG9waWMpO1xuXG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1BVVhGVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gc2hvdyh0b3BpYykge1xuICAgIHRvcGljLnNob3cgPSB7XG4gICAgICB0ZXh0ICAgICA6IHRydWUsXG4gICAgICB0YXJnZXRzICA6IHRydWUsXG4gICAgICBwb2xsICAgICA6IGZhbHNlLFxuICAgICAgZHVlZGF0ZSAgOiBmYWxzZSxcbiAgICAgIG1lZXRpbmcgIDogdHJ1ZSxcbiAgICAgIGNsb3NlZCAgIDogZmFsc2VcbiAgICB9O1xuXG4gICAgaWYgKHRvcGljLmtpbmQgPT09IFwiVG8gZG9cIikge1xuICAgICAgdG9waWMuc2hvdy5kdWVkYXRlID0gdHJ1ZTtcbiAgICAgIHRvcGljLnNob3cuY2xvc2VkICA9IHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRvcGljLmtpbmQgPT09IFwiRGVjaXNpb25cIikge1xuICAgICAgdG9waWMuc2hvdy5kdWVkYXRlID0gdHJ1ZTtcbiAgICAgIHRvcGljLnNob3cuY2xvc2VkICA9IHRydWU7XG4gICAgICB0b3BpYy5zaG93LnBvbGwgPSB0cnVlO1xuICAgIH1cblxuICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gIH1cblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5kZWxldGVUb3BpYyA9IGZ1bmN0aW9uKHRvcGljKSB7XG4gICAgdmFyIGFuc3dlciA9IGNvbmZpcm0oXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgdG9waWM/XCIpO1xuICAgIGlmIChhbnN3ZXIpIHtcbiAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5kZWxldGUoe2lkOiB0b3BpYy5faWR9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRvcGljLmRlbGV0ZWQgPSB0cnVlO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS50b2dnbGVUYWcgPSBmdW5jdGlvbih0YWcpIHtcbiAgICB2YXIgaW5kZXggPSAkc2NvcGUudG9waWMudGFncy5pbmRleE9mKHRhZyk7XG5cbiAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICRzY29wZS50b3BpYy50YWdzLnB1c2godGFnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkc2NvcGUudG9waWMudGFncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuZ2V0VGFnSWNvbiA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgICByZXR1cm4gKCRzY29wZS50b3BpYy50YWdzLmluZGV4T2YodGFnLmlkKSAhPT0gLTEgPyBcImNoZWNrXCIgOiBcInRpbWVzXCIpOztcbiAgfTtcblxuICAkc2NvcGUudG9nZ2xlVGFyZ2V0ID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgdmFyIGluZGV4ID0gJHNjb3BlLnRvcGljLnRhcmdldHMuaW5kZXhPZih0YXJnZXQpO1xuXG4gICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAkc2NvcGUudG9waWMudGFyZ2V0cy5wdXNoKHRhcmdldCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgJHNjb3BlLnRvcGljLnRhcmdldHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnRvZ2dsZUFsbFRhcmdldHMgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS5tZW1iZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgJHNjb3BlLnRvZ2dsZVRhcmdldCgkc2NvcGUubWVtYmVyc1tpXS5pZCk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS50b2dnbGVSb2xlVGFyZ2V0cyA9IGZ1bmN0aW9uKHJvbGVJZCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLm1lbWJlcnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICBmb3IodmFyIG8gPSAwOyBvIDwgJHNjb3BlLm1lbWJlcnNbaV0ucm9sZXMubGVuZ3RoOyBvKyspIHtcbiAgICAgICAgaWYoJHNjb3BlLm1lbWJlcnNbaV0ucm9sZXNbb10uaWQgPT0gcm9sZUlkKSB7XG4gICAgICAgICAgJHNjb3BlLnRvZ2dsZVRhcmdldCgkc2NvcGUubWVtYmVyc1tpXS5pZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnRvZ2dsZVRhcmdldHMgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuc2hvd1RhcmdldHMgPSAhJHNjb3BlLnNob3dUYXJnZXRzO1xuICB9O1xuXG4gICRzY29wZS5nZXRUYXJnZXRDb2xvciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgIHJldHVybiAoJHNjb3BlLnRvcGljLnRhcmdldHMuaW5kZXhPZihtZW1iZXJJZCkgIT09IC0xID8gXCJibHVlXCIgOiBcIlwiKTtcbiAgfTtcblxuICAkc2NvcGUuZm9jdXNPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAkc2NvcGUudG9waWMucG9sbC5vcHRpb25zW2ldLmVkaXRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBvcHRpb24uZWRpdGluZyA9IHRydWU7XG4gIH07XG5cbiAgJHNjb3BlLmFkZE9wdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvcHRpb24gPSB7XG4gICAgICBvcHRpb25UeXBlOiBcIkluZm9cIixcbiAgICAgIHRhcmdldHM6IFtdXG4gICAgfTtcblxuICAgICRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnMucHVzaChvcHRpb24pO1xuXG4gICAgJHNjb3BlLmZvY3VzT3B0aW9uKG9wdGlvbik7XG4gIH07XG5cbiAgJHNjb3BlLnJlbW92ZU9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnMuc3BsaWNlKCRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnMuaW5kZXhPZihvcHRpb24pLCAxKTtcbiAgfTtcblxuICB0aGlzLnNlbGVjdE9wdGlvbiA9IGZ1bmN0aW9uKHRvcGljLCBvcHRpb24pIHtcbiAgICB2YXIgdXBkYXRlZFRvcGljID0gdG9waWM7XG5cbiAgICBpZihvcHRpb24udm90ZXMuaW5kZXhPZigkc2NvcGUubWUuaWQpICE9IC0xKSB7XG4gICAgICB1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zW3VwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnMuaW5kZXhPZihvcHRpb24pXS52b3Rlcy5zcGxpY2UodXBkYXRlZFRvcGljLnBvbGwub3B0aW9uc1t1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zLmluZGV4T2Yob3B0aW9uKV0udm90ZXMuaW5kZXhPZigkc2NvcGUubWUuaWQpLDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zW3VwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnMuaW5kZXhPZihvcHRpb24pXS52b3Rlcy5wdXNoKCRzY29wZS5tZS5pZCk7XG4gICAgfVxuXG4gICAgVG9waWNGYWN0b3J5LlRvcGljLnVwZGF0ZSh7aWQ6IHVwZGF0ZWRUb3BpYy5faWR9LCB1cGRhdGVkVG9waWMsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlRoZXJlIHdhcyBhbiBlcnJvci4gUGxlYXNlIGNvbnRhY3QgdGhlIERldiBUZWFtIGFuZCBnaXZlIHRoZW0gdGhlIGRldGFpbHMgYWJvdXQgdGhlIGVycm9yLlwiKTtcbiAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdWNjZXNzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgICRzY29wZS5lcnJvciA9IFwiXCI7XG5cbiAgICBUb3BpY0ZhY3RvcnkuVG9waWMudXBkYXRlKHtpZDogdG9waWMuX2lkfSwgdG9waWMsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgdG9waWMuZWRpdGluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICRzY29wZS5lcnJvciA9IFwiVGhlcmUgd2FzIGFuIGVycm9yLiBQbGVhc2UgY29udGFjdCB0aGUgRGV2IFRlYW0gYW5kIGdpdmUgdGhlbSB0aGUgZGV0YWlscyBhYm91dCB0aGUgZXJyb3IuXCI7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgIHZhciBtZW1iZXIgPSAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XG4gICAgfSk7XG5cbiAgICBpZihtZW1iZXIubGVuZ3RoPjApIHtcbiAgICAgIHJldHVybiBtZW1iZXJbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IFwiTm8gb25lXCIsXG4gICAgICAgIGZhY2Vib29rOiBcIjEwMDAwMDQ1NjMzNTk3MlwiXG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIGRhdGUpIC8gMTAwMCk7XG5cbiAgICB2YXIgc3VmZml4ID0gXCJhZ29cIjtcbiAgICBpZihzZWNvbmRzIDwgMCl7XG4gICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICBzdWZmaXggPSBcInRvIGdvXCI7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG59KTtcbiIsInJlcXVpcmUoJy4vbGlzdCcpO1xucmVxdWlyZSgnLi90b3BpYycpO1xucmVxdWlyZSgnLi9lbWJlZCcpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJUb3BpY3NDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCBUb3BpY0ZhY3RvcnkpIHtcblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAkc2NvcGUua2luZHMgPSBbXCJJbmZvXCIsIFwiVG8gZG9cIiwgXCJEZWNpc2lvblwiLCBcIklkZWFcIl07XG5cbiAgVG9waWNGYWN0b3J5LlRvcGljLmdldEFsbChnb3RUb3BpY3MpO1xuXG4gIGZ1bmN0aW9uIGdvdFRvcGljcyAodG9waWNzKSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoJHNjb3BlLmxvYWRpbmcpIHtcbiAgICAgICAgZ290VG9waWNzKHRvcGljcyk7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG5cbiAgICAkc2NvcGUudG9waWNzID0gdG9waWNzO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUudG9waWNzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgJHNjb3BlLnRvcGljc1tpXS5mYWNlYm9vayA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbiAobykge1xuICAgICAgICByZXR1cm4gJHNjb3BlLnRvcGljc1tpXS5hdXRob3IgPT09IG8uaWQ7XG4gICAgICB9KVswXS5mYWNlYm9vaztcbiAgICB9XG5cbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgJHNjb3BlLnNob3dPcGVuID0gdHJ1ZTtcbiAgJHNjb3BlLmxpbWl0ID0gNjtcblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS50aW1lID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiAkc2NvcGUudGltZVNpbmNlKG5ldyBEYXRlKGRhdGUpKTtcbiAgfTtcblxuICAkc2NvcGUuY3JlYXRlVG9waWMgPSBmdW5jdGlvbihraW5kKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5jcmVhdGUoe1xuICAgICAgYXV0aG9yOiAkc2NvcGUubWUuaWQsXG4gICAgICBraW5kOiBraW5kXG4gICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICBUb3BpY0ZhY3RvcnkuVG9waWMuZ2V0QWxsKGZ1bmN0aW9uICh0b3BpY3MpIHtcbiAgICAgICAgICAkc2NvcGUudG9waWNzID0gdG9waWNzO1xuICAgICAgICAgICRzY29wZS50b3BpY3MuZmluZChmdW5jdGlvbiAobykge1xuICAgICAgICAgICAgcmV0dXJuIG8uX2lkID09IHJlc3BvbnNlLmlkO1xuICAgICAgICAgIH0pLmVkaXRpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuc2hvd25Ub3BpY3MgPSBmdW5jdGlvbiAoc2hvd09wZW4pIHtcbiAgICByZXR1cm4gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIChzaG93T3BlbiA/ICFvLmNsb3NlZCA6IG8uY2xvc2VkKTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuc2Nyb2xsID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCRzY29wZS5saW1pdCA8ICRzY29wZS50b3BpY3MubGVuZ3RoKVxuICAgICAgJHNjb3BlLmxpbWl0ICs9IDM7XG4gIH07XG5cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKCdUb3BpY0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgJHdpbmRvdywgVG9waWNGYWN0b3J5LCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gIFRvcGljRmFjdG9yeS5Ub3BpYy5nZXQoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAkc2NvcGUudG9waWMgPSByZXN1bHQ7XG5cbiAgICAkc2NvcGUudG9waWMuc2hvd0NvbW1lbnRzID0gdHJ1ZTtcblxuICAgIE5vdGlmaWNhdGlvbkZhY3RvcnkuVG9waWMuZ2V0QWxsKHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24oZ2V0RGF0YSkge1xuICAgICAgJHNjb3BlLnRvcGljLm5vdGlmaWNhdGlvbnMgPSBnZXREYXRhO1xuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9KTtcblxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoJ2NvbW1lbnRBcmVhJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21tZW50L2FyZWEuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQ29tbWVudEFyZWFDb250cm9sbGVyJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHRocmVhZDogJ0AnXG4gICAgICB9XG4gICAgfTtcbiAgfSkiLCJyZXF1aXJlKCcuL2FyZWEnKTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoJ2NvbW11bmljYXRpb25BcmVhJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21tdW5pY2F0aW9uL2FyZWEuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQ29tbXVuaWNhdGlvbkFyZWFDb250cm9sbGVyJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHRocmVhZDogJ0AnLFxuICAgICAgICBtZW1iZXJzSnNvbjogJ0BtZW1iZXJzJyxcbiAgICAgICAgbWVKc29uOiAnQG1lJyxcbiAgICAgICAgcm9sZXNKc29uOiAnQHJvbGVzJ1xuICAgICAgfVxuICAgIH07XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdjb21tdW5pY2F0aW9uJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21tdW5pY2F0aW9uL2NvbW11bmljYXRpb24uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQ29tbXVuaWNhdGlvbkVtYmVkQ29udHJvbGxlcicsXG4gICAgICBzY29wZToge1xuICAgICAgICBjb21tdW5pY2F0aW9uSnNvbjogJ0Bjb21tdW5pY2F0aW9uT2JqZWN0JyxcbiAgICAgICAgbWVtYmVyc0pzb246ICdAbWVtYmVycycsXG4gICAgICAgIG1lSnNvbjogJ0BtZScsXG4gICAgICAgIHJvbGVzSnNvbjogJ0Byb2xlcydcbiAgICAgIH1cbiAgICB9O1xuICB9KSIsInJlcXVpcmUoJy4vYXJlYScpO1xucmVxdWlyZSgnLi9jb21tdW5pY2F0aW9uJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdjb21wYW55JywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wYW55L2NvbXBhbnkuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQ29tcGFueUVtYmVkQ29udHJvbGxlcicsXG4gICAgICBzY29wZToge1xuICAgICAgICBjb21wYW55OiAnPWNvbXBhbnlPYmplY3QnLFxuICAgICAgICBtZW1iZXJzSnNvbjogJ0BtZW1iZXJzJyxcbiAgICAgICAgbWVKc29uOiAnQG1lJyxcbiAgICAgICAgcm9sZXNKc29uOiAnQHJvbGVzJyxcbiAgICAgICAgY29tbWVudHM6ICc9Y29tbWVudHNBcnJheSdcbiAgICAgIH1cbiAgICB9O1xuICB9KVxuIiwicmVxdWlyZSgnLi9jb21wYW55JykiLCJyZXF1aXJlKCcuL2lucHV0JykiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoXG4gICAgJ2RhdGVJbnB1dCcsXG4gICAgZnVuY3Rpb24oZGF0ZUZpbHRlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8aW5wdXQgdHlwZT1cImRhdGVcIj48L2lucHV0PicsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsbSwgYXR0cnMsIG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJGZvcm1hdHRlcnMudW5zaGlmdChmdW5jdGlvbiAobW9kZWxWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZUZpbHRlcihtb2RlbFZhbHVlLCAneXl5eS1NTS1kZCcpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHBhcnNlcnMudW5zaGlmdChmdW5jdGlvbih2aWV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHZpZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICB9KSIsInRoZVRvb2xEaXJlY3RpdmVzID0gYW5ndWxhci5tb2R1bGUoXCJ0aGVUb29sLmRpcmVjdGl2ZXNcIiwgW10pO1xuXG5yZXF1aXJlKFwiLi9jb21tZW50XCIpO1xucmVxdWlyZShcIi4vY29tbXVuaWNhdGlvblwiKTtcbnJlcXVpcmUoXCIuL2NvbXBhbnlcIik7XG5yZXF1aXJlKFwiLi9kYXRlXCIpO1xucmVxdWlyZShcIi4vbWFya2Rvd25cIik7XG5yZXF1aXJlKFwiLi9tZWV0aW5nXCIpO1xucmVxdWlyZShcIi4vc3BlYWtlclwiKTtcbnJlcXVpcmUoXCIuL3RhZ1wiKTtcbnJlcXVpcmUoXCIuL3RvcGljXCIpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sRGlyZWN0aXZlc1xuICAuZGlyZWN0aXZlKCdjb21waWxlJywgWyckY29tcGlsZScsIGZ1bmN0aW9uICgkY29tcGlsZSkge1xuICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgc2NvcGUuJHdhdGNoKFxuICAgICAgICAgIGZ1bmN0aW9uKHNjb3BlKSB7XG4gICAgICAgICAgICAgLy8gd2F0Y2ggdGhlICdjb21waWxlJyBleHByZXNzaW9uIGZvciBjaGFuZ2VzXG4gICAgICAgICAgICByZXR1cm4gc2NvcGUuJGV2YWwoYXR0cnMuY29tcGlsZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgLy8gd2hlbiB0aGUgJ2NvbXBpbGUnIGV4cHJlc3Npb24gY2hhbmdlc1xuICAgICAgICAgICAgLy8gYXNzaWduIGl0IGludG8gdGhlIGN1cnJlbnQgRE9NXG4gICAgICAgICAgICBlbGVtZW50Lmh0bWwodmFsdWUpO1xuXG4gICAgICAgICAgICAvLyBjb21waWxlIHRoZSBuZXcgRE9NIGFuZCBsaW5rIGl0IHRvIHRoZSBjdXJyZW50XG4gICAgICAgICAgICAvLyBzY29wZS5cbiAgICAgICAgICAgIC8vIE5PVEU6IHdlIG9ubHkgY29tcGlsZSAuY2hpbGROb2RlcyBzbyB0aGF0XG4gICAgICAgICAgICAvLyB3ZSBkb24ndCBnZXQgaW50byBpbmZpbml0ZSBsb29wIGNvbXBpbGluZyBvdXJzZWx2ZXNcbiAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoc2NvcGUpO1xuICAgICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICB9XSkiLCJyZXF1aXJlKCcuL2NvbXBpbGUnKTtcbnJlcXVpcmUoJy4vbWFya2Rvd24nKTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoJ21hcmtkb3duJywgWyckY29tcGlsZScsIGZ1bmN0aW9uICgkY29tcGlsZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIHZhciBodG1sVGV4dCA9IG1hcmtkb3duLnRvSFRNTChlbGVtZW50LnRleHQoKSk7XG4gICAgICAgICAgICBlbGVtZW50Lmh0bWwoaHRtbFRleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykpO1xuICAgICAgICB9XG4gICAgfTtcbiAgfV0pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xEaXJlY3RpdmVzLmRpcmVjdGl2ZShcImVtYmVkTWVldGluZ1wiLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6IFwidmlld3MvbWVldGluZy9lbWJlZC5odG1sXCIsXG4gICAgY29udHJvbGxlcjogXCJNZWV0aW5nRW1iZWRDb250cm9sbGVyXCIsXG4gICAgc2NvcGU6IHtcbiAgICAgIG1lZXRpbmdJZDogXCI9XCIsXG4gICAgICBtZW1iZXJzOiBcIj1cIlxuICAgIH1cbiAgfTtcbn0pO1xuIiwicmVxdWlyZShcIi4vZW1iZWRcIik7XG4iLCJyZXF1aXJlKCcuL3NwZWFrZXInKTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xEaXJlY3RpdmVzXG4gIC5kaXJlY3RpdmUoJ3NwZWFrZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3NwZWFrZXIvc3BlYWtlci5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdTcGVha2VyRW1iZWRDb250cm9sbGVyJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHNwZWFrZXI6ICc9c3BlYWtlck9iamVjdCcsXG4gICAgICAgIG1lbWJlcnNKc29uOiAnQG1lbWJlcnMnLFxuICAgICAgICBtZUpzb246ICdAbWUnLFxuICAgICAgICByb2xlc0pzb246ICdAcm9sZXMnLFxuICAgICAgICBjb21tZW50czogJz1jb21tZW50c0FycmF5J1xuICAgICAgfVxuICAgIH07XG4gIH0pXG4iLCJhcmd1bWVudHNbNF1bMzVdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbERpcmVjdGl2ZXNcbiAgLmRpcmVjdGl2ZSgndGFnTWFuYWdlcicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvdGFnL21hbmFnZXIuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnVGFnTWFuYWdlckNvbnRyb2xsZXInLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgdGFnczogJz10YWdzQXJyYXknLFxuICAgICAgICBzZWFyY2g6ICc9c2VhcmNoJ1xuICAgICAgfVxuICAgIH07XG4gIH0pXG4iLCJyZXF1aXJlKFwiLi90b3BpY1wiKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG50aGVUb29sRGlyZWN0aXZlcy5kaXJlY3RpdmUoXCJ0b3BpY1wiLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6IFwiRUFDXCIsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy90b3BpYy90b3BpYy5odG1sXCIsXG4gICAgY29udHJvbGxlcjogXCJUb3BpY0VtYmVkQ29udHJvbGxlclwiLFxuICAgIHNjb3BlOiB7XG4gICAgICB0b3BpYzogXCI9dG9waWNPYmplY3RcIixcbiAgICAgIG1lbWJlcnM6IFwiPXRvcGljTWVtYmVyc1wiLFxuICAgICAgbWU6IFwiPXRvcGljTWVcIixcbiAgICAgIHJvbGVzOiBcIj10b3BpY1JvbGVzXCIsXG4gICAgICB0YWdzOiBcIj10b3BpY1RhZ3NcIixcbiAgICAgIGNvbW1lbnRzOiBcIj10b3BpY0NvbW1lbnRzXCJcbiAgICB9XG4gIH07XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ3RoZVRvb2wuZmlsdGVycycsIFtdKVxuICAuZmlsdGVyKCdpbnRlcnBvbGF0ZScsIFsndmVyc2lvbicsIGZ1bmN0aW9uKHZlcnNpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odGV4dCkge1xuICAgICAgcmV0dXJuIFN0cmluZyh0ZXh0KS5yZXBsYWNlKC9cXCVWRVJTSU9OXFwlL21nLCB2ZXJzaW9uKTtcbiAgICB9XG4gIH1dKVxuICAuZmlsdGVyKCdmaWx0ZXJSb2xlJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG1lbWJlcnMsIHJvbGUpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gbWVtYmVycztcbiAgICAgICAgICBpZihyb2xlKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBtZW1iZXJzLmZpbHRlcihmdW5jdGlvbihtKSB7XG4gICAgICAgICAgICAgIHJldHVybiBtLnJvbGVzLmZpbHRlcihmdW5jdGlvbihyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHIuaWQgPT0gcm9sZTtcbiAgICAgICAgICAgICAgfSkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfTtcbiAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ0NoYXRGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBDaGF0OiAkcmVzb3VyY2UoJy9hcGkvY2hhdC86aWQnLCBudWxsLCB7XG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6dHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgTWVzc2FnZTogJHJlc291cmNlKCcvYXBpL2NoYXQvOmlkL21lc3NhZ2VzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsaXNBcnJheTp0cnVlfVxuICAgICAgfSlcbiAgICB9XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ0NvbW1lbnRGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBDb21tZW50OiAkcmVzb3VyY2UoJy9hcGkvY29tbWVudC86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KSxcbiAgICAgIENvbXBhbnk6ICRyZXNvdXJjZSgnL2FwaS9jb21wYW55LzppZC9jb21tZW50cycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSksXG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UoJy9hcGkvc3BlYWtlci86aWQvY29tbWVudHMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgVG9waWM6ICRyZXNvdXJjZSgnL2FwaS90b3BpYy86aWQvY29tbWVudHMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gICAgfVxuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdDb21tdW5pY2F0aW9uRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgQ29tbXVuaWNhdGlvbjogJHJlc291cmNlKCcvYXBpL2NvbW11bmljYXRpb24vOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfSxcbiAgICAgICAgJ2FwcHJvdmUnOiB7bWV0aG9kOiAnUE9TVCd9XG4gICAgICB9KSxcbiAgICAgIENvbXBhbnk6ICRyZXNvdXJjZSgnL2FwaS9jb21wYW55LzppZC9jb21tdW5pY2F0aW9ucycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSksXG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UoJy9hcGkvc3BlYWtlci86aWQvY29tbXVuaWNhdGlvbnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gICAgfTtcbiAgfSkiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnQ29tcGFueUZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIENvbXBhbnk6ICRyZXNvdXJjZSgnL2FwaS9jb21wYW55LzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9LFxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfSksXG4gICAgICBNZW1iZXI6ICRyZXNvdXJjZSgnL2FwaS9tZW1iZXIvOmlkL2NvbXBhbmllcycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9XG4gICAgICB9KVxuICAgIH07XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ0VtYWlsRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgQ29tcGFueTogJHJlc291cmNlKCcvYXBpL2NvbXBhbnkvOmlkL3NlbmRJbml0aWFsRW1haWwnLCBudWxsLCB7XG4gICAgICAgICdzZW5kJzoge21ldGhvZDogJ1BPU1QnfVxuICAgICAgfSksXG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UoJy9hcGkvc3BlYWtlci86aWQvc2VuZEluaXRpYWxFbWFpbCcsIG51bGwsIHtcbiAgICAgICAgJ3NlbmQnOiB7bWV0aG9kOiAnUE9TVCd9XG4gICAgICB9KVxuICAgIH1cbiAgfSkiLCJ0aGVUb29sU2VydmljZXMgPSBhbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5zZXJ2aWNlcycsIFsnbmdSZXNvdXJjZSddKTtcblxucmVxdWlyZSgnLi9jaGF0Jyk7XG5yZXF1aXJlKCcuL2NvbW1lbnQnKTtcbnJlcXVpcmUoJy4vY29tbXVuaWNhdGlvbicpO1xucmVxdWlyZSgnLi9jb21wYW55Jyk7XG5yZXF1aXJlKCcuL2VtYWlsJyk7XG5yZXF1aXJlKCcuL21lZXRpbmcnKTtcbnJlcXVpcmUoJy4vbWVtYmVyJyk7XG5yZXF1aXJlKCcuL21lc3NhZ2UnKTtcbnJlcXVpcmUoJy4vbm90aWZpY2F0aW9uJyk7XG5yZXF1aXJlKCcuL3JvbGUnKTtcbnJlcXVpcmUoJy4vc2Vzc2lvbicpO1xucmVxdWlyZSgnLi9zb2NrZXQnKTtcbnJlcXVpcmUoJy4vc3BlYWtlcicpO1xucmVxdWlyZSgnLi90YWcnKTtcbnJlcXVpcmUoJy4vdG9waWMnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdNZWV0aW5nRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4gJHJlc291cmNlKCcvYXBpL21lZXRpbmcvOmlkJywgbnVsbCwge1xuICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICB9KTtcbiAgfSlcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdNZW1iZXJGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBNZW1iZXI6ICRyZXNvdXJjZSgnL2FwaS9tZW1iZXIvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6dHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KSxcbiAgICAgIFJvbGU6ICRyZXNvdXJjZSgnL2FwaS9yb2xlLzppZC9tZW1iZXJzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KVxuICAgIH07XG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ01lc3NhZ2VGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiAkcmVzb3VyY2UoJy9hcGkvbWVzc2FnZS86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiAgICB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gIH0pIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ05vdGlmaWNhdGlvbkZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIE5vdGlmaWNhdGlvbjogJHJlc291cmNlKCcvYXBpL25vdGlmaWNhdGlvbi86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICB9KSxcbiAgICAgIENvbXBhbnk6ICRyZXNvdXJjZSgnL2FwaS9jb21wYW55LzppZC9ub3RpZmljYXRpb25zJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KSxcbiAgICAgIFNwZWFrZXI6ICRyZXNvdXJjZSgnL2FwaS9zcGVha2VyLzppZC9ub3RpZmljYXRpb25zJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KSxcbiAgICAgIFRvcGljOiAkcmVzb3VyY2UoJy9hcGkvdG9waWMvOmlkL25vdGlmaWNhdGlvbnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gICAgfVxuICB9KVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ1JvbGVGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBSb2xlOiAkcmVzb3VyY2UoJy9hcGkvcm9sZS86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICB9KSxcbiAgICAgIE1lbWJlcjogJHJlc291cmNlKCcvYXBpL3JvbGUvOmlkL21lbWJlcnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gICAgfTtcbiAgfSlcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdTZXNzaW9uRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgU2Vzc2lvbjogJHJlc291cmNlKCcvYXBpL3Nlc3Npb24vOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfSksXG4gICAgICBDb21wYW55OiAkcmVzb3VyY2UoJy9hcGkvY29tcGFueS86aWQvc2Vzc2lvbnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgU3BlYWtlcjogJHJlc291cmNlKCcvYXBpL3NwZWFrZXIvOmlkL3Nlc3Npb25zJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KVxuICAgIH1cbiAgfSkiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnU29ja2V0RmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UsICRsb2NhdGlvbiwgJHJvb3RTY29wZSkge1xuICAgIHZhciBzb2NrZXQ7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbm5lY3Q6IGZ1bmN0aW9uKG5zcCkge1xuLyogICAgICAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUuc29ja2V0KTtcbiAgICAgICAgaWYoJHJvb3RTY29wZS5zb2NrZXQpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUuc29ja2V0LmNvbm5lY3RlZCk7XG4gICAgICAgICAgJHJvb3RTY29wZS5zb2NrZXQuZGlzY29ubmVjdCgpO1xuICAgICAgICB9XG4gICAgICAgICRyb290U2NvcGUuc29ja2V0ID0gc29ja2V0ID0gaW8uY29ubmVjdChuc3ApOyovXG4gICAgICAgIHNvY2tldCA9IGlvLmNvbm5lY3QobnNwKTtcbiAgICAgIH0sXG4gICAgICBvbjogZnVuY3Rpb24gKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgc29ja2V0Lm9uKGV2ZW50TmFtZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHNvY2tldCwgYXJncyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGVtaXQ6IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgIHNvY2tldC5lbWl0KGV2ZW50TmFtZSwgZGF0YSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShzb2NrZXQsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBkaXNjb25uZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNvY2tldC5kaXNjb25uZWN0KCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnU3BlYWtlckZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFNwZWFrZXI6ICRyZXNvdXJjZSgnL2FwaS9zcGVha2VyLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9LFxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfSksXG4gICAgICBNZW1iZXI6ICRyZXNvdXJjZSgnL2FwaS9tZW1iZXIvOmlkL3NwZWFrZXJzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6dHJ1ZX1cbiAgICAgIH0pXG4gICAgfTtcbiAgfSkiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnVGFnRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgVGFnOiAkcmVzb3VyY2UoJy9hcGkvdGFnLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgVG9waWM6ICRyZXNvdXJjZSgnL2FwaS90YWcvOmlkL3RvcGljcycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSlcbiAgICB9O1xuICB9KSIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbFNlcnZpY2VzXG4gIC5mYWN0b3J5KCdUb3BpY0ZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFRvcGljOiAkcmVzb3VyY2UoJy9hcGkvdG9waWMvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfSksXG4gICAgICBNZW1iZXI6ICRyZXNvdXJjZSgnL2FwaS9tZW1iZXIvOmlkL3RvcGljcycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHsgbWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZSB9XG4gICAgICB9KVxuICAgIH07XG4gIH0pIiwidXJsX3ByZWZpeCA9ICdodHRwOi8vdG9vbC5iYW5hbmFtYXJrZXQuZXUvJztcblxucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2FwcC5qcycpO1xucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzJyk7XG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcycpO1xucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2ZpbHRlcnMnKTtcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9zZXJ2aWNlcycpOyJdfQ==
