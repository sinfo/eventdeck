(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

angular.module('theTool', [
  'ng',
  'ngRoute',
  'ngSanitize',
  'infinite-scroll',
  'theTool.filters',
  'theTool.services',
  'theTool.directives',
  'theTool.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/'                         , {templateUrl: 'views/home.html',                  controller: 'home'});
  $routeProvider.when('/companies/'               , {templateUrl: 'views/company/list.html',          controller: 'CompaniesController'});
  $routeProvider.when('/companies/table/'         , {templateUrl: 'views/company/table.html',         controller: 'CompaniesController'});
  $routeProvider.when('/companies/budget/'        , {templateUrl: 'views/company/budget.html',        controller: 'CompaniesController'});
  $routeProvider.when('/company/'                 , {templateUrl: 'views/company/create.html',        controller: 'CreateCompanyController'});
  $routeProvider.when('/company/:id'              , {templateUrl: 'views/company/view.html',          controller: 'CompanyController'});
  $routeProvider.when('/company/:id/edit'         , {templateUrl: 'views/company/edit.html',          controller: 'CompanyController'});
  $routeProvider.when('/company/:id/participation', {templateUrl: 'views/company/participation.html', controller: 'CompanyController'});
  $routeProvider.when('/company/:id/confirm'      , {templateUrl: 'views/company/confirm.html',       controller: 'CompanyEmailController'});
  $routeProvider.when('/comment/:id/edit'         , {templateUrl: 'views/comment/edit.html',          controller: 'CommentController'});
  $routeProvider.when('/speakers/'                , {templateUrl: 'views/speaker/list.html',          controller: 'SpeakersController'});
  $routeProvider.when('/speakers/table/'          , {templateUrl: 'views/speaker/table.html',         controller: 'SpeakersController'});
  $routeProvider.when('/speaker/'                 , {templateUrl: 'views/speaker/create.html',        controller: 'CreateSpeakerController'});
  $routeProvider.when('/speaker/:id'              , {templateUrl: 'views/speaker/view.html',          controller: 'SpeakerController'});
  $routeProvider.when('/speaker/:id/edit'         , {templateUrl: 'views/speaker/edit.html',          controller: 'SpeakerController'});
  $routeProvider.when('/speaker/:id/confirm'      , {templateUrl: 'views/speaker/confirm.html',       controller: 'SpeakerEmailController'});
  $routeProvider.when('/members/'                 , {templateUrl: 'views/member/list.html',           controller: 'MembersController'});
  $routeProvider.when('/member/:id'               , {templateUrl: 'views/member/view.html',           controller: 'MemberController'});
  $routeProvider.when('/meetings'                 , {templateUrl: 'views/meeting/list.html',          controller: 'MeetingsController'});
  $routeProvider.when('/meeting/:id'              , {templateUrl: 'views/meeting/view.html',          controller: 'MeetingController'});
  $routeProvider.when('/meeting/:id/edit'         , {templateUrl: 'views/meeting/edit.html',          controller: 'MeetingController'});
  $routeProvider.when('/chats'                    , {templateUrl: 'views/chat/list.html',             controller: 'ChatController'});
  $routeProvider.when('/chat/:id'                 , {templateUrl: 'views/chat/view.html',             controller: 'MessageController'});
  $routeProvider.when('/topics'                   , {templateUrl: 'views/topic/list.html',            controller: 'TopicsController'});
  $routeProvider.when('/topic/:id'                , {templateUrl: 'views/topic/view.html',            controller: 'TopicController'});
  $routeProvider.when('/communications'           , {templateUrl: 'views/communication/list.html',    controller: 'CommunicationsController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);

},{}],2:[function(require,module,exports){
require('./list');
},{"./list":3}],3:[function(require,module,exports){
'use strict';

theToolController.controller('ChatController', function ($scope, ChatFactory) {

  $scope.loading = true;

  ChatFactory.Chats.getAll(function(chats) {
    $scope.chats = chats;
    $scope.loading = false;
  });

});

},{}],4:[function(require,module,exports){
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
    $scope.loading = true;

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

    console.log(comment);

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

},{}],5:[function(require,module,exports){
require('./area.js');

},{"./area.js":4}],6:[function(require,module,exports){
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
      console.log(response);
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

},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
require('./area.js');
require('./list.js');
require('./embed.js');

},{"./area.js":6,"./embed.js":7,"./list.js":9}],9:[function(require,module,exports){
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


},{}],10:[function(require,module,exports){
'use strict';

theToolController
  .controller('CompanyController', function ($scope, $http, $routeParams, $sce, CompanyFactory, MemberFactory, NotificationFactory) {

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src+'#page-body');
    }

    $scope.convertEmails = function(text) {
      var mailExp = /[\w\.\-]+\@([\w\-]+\.)+[\w]{2,4}(?![^<]*>)/ig;
      return text.replace(mailExp,"<a href='/#/company/"+$routeParams.id+"/confirm?email=$&'>$&</a>")
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

    $scope.statuses = ['SUGGESTION','CONTACTED','IN CONVERSATIONS','ACCEPTED/IN NEGOTIATIONS','CLOSED DEAL','REJECTED/GIVE UP'];
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

},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
'use strict';
 
theToolController
  .controller('CreateCompanyController', function ($scope, $http, $routeParams, $sce, CompanyFactory, MemberFactory) {
    $scope.submit = function() {
      var companyData = this.formData;

      CompanyFactory.Company.create(companyData, function(response) {
        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.message;
        }
      });
    };

    MemberFactory.Member.getAll( function(response) {
      $scope.members = response;
    });
  });
},{}],13:[function(require,module,exports){
require('./company.js');
require('./list.js');
require('./create.js');
require('./confirm.js');
},{"./company.js":10,"./confirm.js":11,"./create.js":12,"./list.js":14}],14:[function(require,module,exports){
'use strict';

theToolController
  .controller('CompaniesController', function ($scope, $http, $sce, CompanyFactory, MemberFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    $scope.getClassFromStatusAndKind = function(company) {
      if(!company.participation) { 
        var status = company.status.toUpperCase();
        
        if(status.indexOf("SUGESTÃO") != -1) { return "grey"; }
        else if(status.indexOf("CONTACTADO") != -1) { return "orange"; }
        else if(status.indexOf("EM CONVERSAÇÕES") != -1) { return "blue"; }
        else if(status.indexOf("ACEITOU/EM NEGOCIAÇÕES") != -1) { return "green"; }
        else if(status.indexOf("NEGOCIO FECHADO") != -1) { return "lime"; }
        else if(status.indexOf("REJEITOU/DESISTIR") != -1) { return "nope"; }
      }
      if(!company.participation.kind) { return "sponsor"; }
      var kind = company.participation.kind.toLowerCase();

      if(kind.indexOf("bronze") != -1) { return "bronze"; } 
      else if(kind.indexOf("prata") != -1) { return "silver"; }
      else { return "sponsor"; }
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

    $scope.statuses = ['Emitido', 'Recibo Enviado', 'Pago', 'Enviado'];

    CompanyFactory.Company.getAll(function(response) {
      $scope.predicate = 'participation.payment.price';
      $scope.reverse = true;
      $scope.companies = response;
    });
  });
  
},{}],15:[function(require,module,exports){
theToolController = angular.module('theTool.controllers', []);

require('./main');
require('./company');
require('./speaker');
require('./member');
require('./comment');
require('./meeting');
require('./chat');
require('./message');
require('./topic');
require('./communication');
require('./tag');

},{"./chat":2,"./comment":5,"./communication":8,"./company":13,"./main":17,"./meeting":19,"./member":22,"./message":26,"./speaker":29,"./tag":32,"./topic":35}],16:[function(require,module,exports){
'use strict';

theToolController.controller('home', function ($scope, $http, $sce,  $rootScope, NotificationFactory, MemberFactory) {


  function getImageFromThread (thread) {
    if(thread.indexOf('company-') != -1) {
      return $scope.companies.filter(function(o) {
        return thread.split('company-')[1] == o.id;
      })[0].img;
    }
    else if(thread.indexOf('speaker-') != -1) {
      return $scope.speakers.filter(function(o) {
        return thread.split('speaker-')[1] == o.id;
      })[0].img;
    }
    return undefined;
  }

  function getInfoFromTopic (thread) {
    if(thread.indexOf('topic-') != -1) {
      return $scope.topics.filter(function(o) {
        return thread.split('topic-')[1] == o._id;
      })[0];
    }
  }

  function validateDescription (thread, description) {
    if(thread.indexOf('topic-') != -1 && description.indexOf('comment') != -1) {
      description = description.split('[')[0];
    }
    return description;
  }

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
      for (var i = 0, j = response.length; i < j; i++) {
        //if (response[i].member != me.id){ //uncomment to hide self-events
        var date = new Date(response[i].posted);
        $scope.notifications.unshift({
          path: response[i].thread.replace("-", "/"),
          date: {
            data: date,
            full: date.toString()
          },
          description: validateDescription(response[i].thread, response[i].description),
          thread: response[i].thread,
          member: {
            id: response[i].member,
            name: $scope.members.filter(function(o) {
                    return response[i].member == o.id;
                  })[0].name,
            facebook: $scope.members.filter(function(o) {
                    return response[i].member == o.id;
                  })[0].facebook
          },
          color: (response[i].unread.indexOf($scope.me.id) != -1 ? "unread" : "read"),
          image: getImageFromThread(response[i].thread),
          topic: getInfoFromTopic(response[i].thread)
        });
        //}
      }
      $scope.loading = false;
    });
  }

  $scope.getImageFromThread = function (thread) {
    if(thread.indexOf('company-') != -1) {
      return  $scope.companies.filter(function(o) {
                return thread.split('company-')[1] == o.id;
              })[0].img;
    }
    else if(thread.indexOf('speaker-') != -1) {
      return $scope.speakers.filter(function(o) {
                return thread.split('speaker-')[1] == o.id;
              })[0].img;
    }
  };

  $scope.getInfoFromTopic = function (thread) {
    return $scope.topics.filter(function(o) {
      return thread.split('topic-')[1] == o.id;
    })[0];
  };

  $scope.scroll = function() {
    if ($scope.limit < $scope.notifications.length)
      $scope.limit += 10;
  };

});

},{}],17:[function(require,module,exports){
require('./main.js');
require('./home.js');

},{"./home.js":16,"./main.js":18}],18:[function(require,module,exports){
'use strict';

theToolController.controller('MainController', function ($scope, $http, $routeParams, $sce, $location, $rootScope, NotificationFactory, MemberFactory, CompanyFactory, SpeakerFactory, TopicFactory, RoleFactory, TagFactory, CommentFactory) {

  //================================INITIALIZATION================================

  $scope.ready = false;

  $scope.display = false;

  $scope.search = {};
  $scope.searchTopics = {};

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
        //if (response[i].member != $scope.me.id) { //uncomment to hide self-events
        if (response[i].unread.indexOf($scope.me.id) != -1) {
          $scope.notificationsInfo.number++;

          $scope.notifications.unshift({
            path: response[i].thread.replace("-", "/"),
            text: response[i].description + " (" + $scope.timeSince(new Date(response[i].posted))+")",
            member: $scope.members.filter(function(o) {
                      return response[i].member == o.id;
                    })[0].facebook,
            color: (response[i].unread.indexOf($scope.me.id) != -1 ? "LightSkyBlue" : "WhiteSmoke")
          });
        }
        //}
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
    return $scope.members.filter(function(o) {
      return o.id == memberId;
    })[0];
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

},{}],19:[function(require,module,exports){
require('./list');
require('./meeting');

},{"./list":20,"./meeting":21}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
"use strict";

theToolController.controller("MeetingController", function ($scope, $routeParams, $location, MeetingFactory, TopicFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.kinds = ["Info", "To do", "Decision", "Idea"];

  MeetingFactory.get({id: $routeParams.id}, function (meeting) {
    $scope.meeting = meeting;

    $scope.loading = false;
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
      if(response.error) {
        $scope.error = "There was an error. Please contact the Dev Team and give them the details about the error.";
      }
      else if (response.success) {
        $scope.success = response.success;
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

},{}],22:[function(require,module,exports){
require('./member.js');
require('./list.js');
},{"./list.js":23,"./member.js":24}],23:[function(require,module,exports){
'use strict';

theToolController
  .controller('MembersController', function ($scope, $http, $sce, MemberFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    MemberFactory.Member.getAll(function(response) {
      $scope.predicate = 'name';
      $scope.reverse = false;
      $scope.members = response;
    });
  });


},{}],24:[function(require,module,exports){
'use strict';
 
theToolController
  .controller('MemberController', function ($scope, $http, $routeParams, $sce, $location, MemberFactory) {
    $scope.getClassFromKind = function(participation) {
      if(!participation) { return "nope"; }
      if(!participation.kind) { return "sponsor"; }
      var kind = participation.kind.toLowerCase();

      if(kind.indexOf("bronze") != -1) { return "bronze"; } 
      else if(kind.indexOf("prata") != -1) { return "silver"; }
      else { return "sponsor"; }
    }

    $scope.loading = true;
    
    MemberFactory.Member.get({id: $routeParams.id}, function(response) {
      if($routeParams.id == "me") {
        var newPath = "/member/"+response.id;
        console.log("going to", newPath);
        $location.path(newPath);        
      }
      $scope.member = response;

      getMemberStuff();
    });

    
    function getMemberStuff() {
      $scope.member.companies = $scope.companies.filter(function(e) {
        return e.member == $scope.member.id;
      })

      $scope.member.speakers = $scope.speakers.filter(function(e) {
        return e.member == $scope.member.id;
      })

      $scope.member.comments = $scope.comments.filter(function(e) {
        return e.member == $scope.member.id;
      })

      if($scope.companies.length > 0 && $scope.speakers.length > 0) {
        $scope.loading = false;
      } else {
        setTimeout(getMemberStuff, 1000);
      }
    }

  });
},{}],25:[function(require,module,exports){
'use strict';

theToolController.controller('MessageController', function ($scope, $http, $routeParams, $sce, SocketFactory, MessageFactory, ChatFactory, MemberFactory) {

  $scope.error = {};

  $scope.loading = true;
  $scope.messages = [];

 /* setInterval(function(){
    ChatFactory.Messages.get({id: $routeParams.id}, function(response) {
      if(response.error) {
        $scope.error = response.error;
      } else {
        if($scope.messages.length < response.length){
          for(var i= $scope.messages.length; i < response.length; i++){
            $scope.messages[i] = response[i];
          }  
        } 
      }
    });
  },4000);*/

  SocketFactory.emit('auth', {id: $routeParams.id, user: $scope.me.id}, function (result) {
      console.log('Auth success');
      $scope.chat     = result.chatData;
      $scope.messages = result.messages;
      $scope.room     = result.room;
  });

  SocketFactory.on('message', function (message) {
    $scope.messages.push(message);
  });

  $scope.submit = function() {
    if ($scope.messageText == ""){
      //$scope.empty = true;
      return;
    }

    var messageData = {
      text   : $scope.text,
      chatId : $routeParams.id,
      member : $scope.me.id,
    }
    console.log(messageData);

    SocketFactory.emit('send', {room: $scope.room, message: messageData }, function() {console.log('emited')});
    /*MessageFactory.create(messageData, function(response){
      if(response.error) {
        $scope.error = response.error;
      } else {
        messageData.id = response.messageId;

        console.log(messageData.id);
        ChatFactory.Chat.update({ id:$routeParams.id }, {message:messageData.id}, function(response) {
          // if successful, we'll need to refresh the chat list
          console.log(response);

          if(response.error) {
            $scope.error = response.error;
          } else {
            $scope.chat = response.message;
          }
        });
      }
    });*/
  };
});

},{}],26:[function(require,module,exports){
require('./create');

},{"./create":25}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
'use strict';
 
theToolController
  .controller('CreateSpeakerController', function ($scope, $http, $routeParams, $sce, SpeakerFactory, MemberFactory) {
    $scope.submit = function() {
      var speakerData = this.formData;

      SpeakerFactory.Speaker.create(speakerData, function(response) {
        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.message;
        }
      });
    };

    MemberFactory.Member.getAll( function(response) {
      $scope.members = response;
    });
  });
},{}],29:[function(require,module,exports){
require('./speaker.js');
require('./list.js');
require('./create.js');
require('./confirm.js');

},{"./confirm.js":27,"./create.js":28,"./list.js":30,"./speaker.js":31}],30:[function(require,module,exports){
'use strict';

theToolController
  .controller('SpeakersController', function ($scope, $http, $sce, SpeakerFactory, MemberFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    $scope.getClassFromKind = function(status) {
      if(!status) { return "suggestion"; }
      var kind = status.toLowerCase();

      if(kind.indexOf("contactado") != -1) { return "contacted"; } 
      else if(kind.indexOf("aceitou") != -1) { return "accepted"; }
      else if(kind.indexOf("rejeitou") != -1) { return "rejected"; }
      else if(kind.indexOf("conversações") != -1) { return "conversations"; }
      else if(kind.indexOf("desistir") != -1) { return "giveup"; }
      else { return "suggestion"; }
    }

    SpeakerFactory.Speaker.getAll(function(response) {
      $scope.predicate = 'participation';
      $scope.reverse = false;
      $scope.speakers = response;
    });
  });
  
},{}],31:[function(require,module,exports){
'use strict';

theToolController
  .controller('SpeakerController', function ($scope, $http, $routeParams, $sce, SpeakerFactory, MemberFactory, NotificationFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src+'#page-body');
    }

    $scope.convertEmails = function(text) {
      var mailExp = /[\w\.\-]+\@([\w\-]+\.)+[\w]{2,4}(?![^<]*>)/ig;
      return text.replace(mailExp,"<a href='/api/speaker/"+$routeParams.id+"/sendInitialEmail' target='_blank'>$&</a>")
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

    $scope.statuses = ['SUGGESTION','CONTACTED','IN CONVERSATIONS','ACCEPTED','CLOSED DEAL','REJECTED/GIVE UP'];

    $scope.speaker = $scope.formData = $scope.getSpeaker($routeParams.id);

    SpeakerFactory.Speaker.get({id: $routeParams.id}, function(response) {
      $scope.speaker = $scope.formData = response;

      NotificationFactory.Speaker.getAll({id: $routeParams.id}, function(getData) {
        $scope.speaker.notifications = getData;

        $scope.loading = false;
      });
    });

  });

},{}],32:[function(require,module,exports){
require('./manager');
},{"./manager":33}],33:[function(require,module,exports){
"use strict";

theToolController.controller("TagManagerController", function ($scope, TagFactory) {

  $scope.loading = true;

  $scope.newTag = {};

  $scope.lightColors = ["#f7c6c7", "#fad8c7", "#fef2c0", "#bfe5bf", "#bfdadc", "#c7def8", "#bfd4f2", "#d4c5f9"];
  $scope.colors = ["#e11d21", "#eb6420", "#fbca04", "#009800", "#006b75", "#207de5", "#0052cc", "#5319e7"];

  $scope.changeColor = function (color) {
    $scope.newTag.color = color;
  };

  $scope.createTag = function (newTag) {

    TagFactory.Tag.create(newTag, function (response) {
      if (response.success) {
        $scope.tags.push(response.tag);
      }
    });
  };

  $scope.deleteTag = function (tag) {

    TagFactory.Tag.delete({id: tag.id}, function (response) {
      if (response.success) {
        var index = $scope.tags.indexOf(tag);
        $scope.tags.splice(index, 1);
      }
    });
  };

});

},{}],34:[function(require,module,exports){
"use strict";

theToolController.controller("TopicEmbedController", function ($scope, TopicFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.success     = "";
  $scope.error       = "";
  $scope.showTargets = false;

  $scope.pollKinds = ['text', 'images'];

  $scope.me = JSON.parse($scope.meJson);
  $scope.members = JSON.parse($scope.membersJson);
  $scope.roles = JSON.parse($scope.rolesJson);

  if($scope.comments) {
    $scope.topic.comments = $scope.comments.filter(function(e) {
      return e.thread == 'topic-'+$scope.topic._id;
    })
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

    if (topic.kind === 'To do') {
      topic.show.duedate = true;
      topic.show.closed  = true;
    }
    else if (topic.kind === 'Decision') {
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
    console.log($scope.showTargets);
    $scope.showTargets = !$scope.showTargets;
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

  $scope.save = function(topic) {
    $scope.success = "";
    $scope.error   = "";

    if(topic._id) {
      TopicFactory.Topic.update({id: topic._id}, $scope.topic, function(response) {
        if(response.error) {
          $scope.error = "There was an error. Please contact the Dev Team and give them the details about the error.";
        } else if (response.success) {
          $scope.success = response.success;
          $scope.topic.editing = false;
        }
      });
    } else {
      TopicFactory.Topic.create(topic, function(response) {
        if(response.error) {
          $scope.error = "There was an error. Please contact the Dev Team and give them the details about the error.";
        } else if (response.success) {
          $scope.success = response.success;
          $scope.topic.editing = false;
        }
      });
    }
  };

  $scope.getMember = function (memberId) {
    return $scope.members.filter(function(o) {
      return o.id == memberId;
    })[0];
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
    console.log($scope.showTargets);
    $scope.showTargets = !$scope.showTargets;
  };

  $scope.focusOption = function(option) {
    for (var i = 0, j = $scope.topic.poll.options.length; i < j; i++) {
      $scope.topic.poll.options[i].editing = false;
    }

    option.editing = true;
  };

  $scope.selectOption = function(topic, option) {
    console.log("Select", option);
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
require('./list');
require('./topic');
require('./embed');

},{"./embed":34,"./list":36,"./topic":37}],36:[function(require,module,exports){
'use strict';

theToolController.controller('TopicsController', function ($scope, $location, $routeParams, TopicFactory) {

  //================================INITIALIZATION================================

  if($location.path() != '/topics' && $routeParams.id == "me") {
    $location.path('/topics/' + $scope.me.id);
    return;
  }

  $scope.loading = true;

  $scope.kinds = ["Info", "To do", "Decision", "Idea"];

  if ($location.path() == '/topics') {
    TopicFactory.Topic.getAll(gotTopics);
  }
  else {
    TopicFactory.Member.getAll({id: $routeParams.id}, gotTopics);
  }

  function gotTopics (topics) {
    setTimeout(function () {
      if ($scope.loading)
        gotTopics(topics);
    }, 1000);

    $scope.topics = topics;

    for (var i = 0, j = $scope.topics.length; i < j; i++) {
      $scope.topics[i].facebook = $scope.members.filter(function(o) {
        return $scope.topics[i].author == o.id;
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
      //author: $scope.me.id,
      kind: kind
    }, function(response) {
      console.log(response);
      if (response.success) {
        $location.path("/topic/" + response.id);
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

},{}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
'use strict';

angular.module('theTool.directives', [])
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    }
  }])
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
  .directive('markdown', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var htmlText = markdown.toHTML(element.text());
            element.html(htmlText.replace(/\n/g, '<br>'));
        }
    };
  }])
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
  .directive('topic', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/topic/topic.html',
      controller: 'TopicEmbedController',
      scope: {
        topic: '=topicObject',
        membersJson: '@members',
        meJson: '@me',
        rolesJson: '@roles',
        tags: '=tagsArray',
        comments: '=commentsArray'
      }
    };
  })
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
  });

},{}],39:[function(require,module,exports){
'use strict';
 
 
angular.module('theTool.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);
},{}],40:[function(require,module,exports){
'use strict';

var theToolServices = angular.module('theTool.services', ['ngResource']);

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

  .factory('MeetingFactory', function ($resource) {
    return $resource('/api/meeting/:id', null, {
      'getAll': {method: 'GET', isArray: true},
      'create': {method: 'POST'},
      'update': {method: 'PUT'},
      'delete': {method: 'DELETE'}
    });
  })

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

  .factory('ChatFactory', function ($resource) {
    return {
      Chat: $resource('/api/chat/:id', null, {
        'update': {method: 'POST'},
        'get':    {method: 'GET'}
      }),
      Chats: $resource('/api/chat', null, {
        'getAll': {method: 'GET', isArray:true}
      }),
      Messages: $resource('/api/chat/:id/messages', null, {
        'get': {method: 'GET',isArray:true}
      })
    }
  })

  .factory('MessageFactory', function ($resource) {
    return $resource('/api/message/:id', null, {
        get:    {method: 'GET'},
        create: {method: 'POST'}
      })
  })

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

  .factory('SocketFactory', function ($resource, $location, $rootScope) {
    var socket = io.connect('/chat');
    return {
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
      }
    };
  });

},{}],41:[function(require,module,exports){
url_prefix = 'http://the-tool.franciscodias.net/';

require('./angularApp/app.js');
require('./angularApp/controllers');
require('./angularApp/directives');
require('./angularApp/filters');
require('./angularApp/services');
},{"./angularApp/app.js":1,"./angularApp/controllers":15,"./angularApp/directives":38,"./angularApp/filters":39,"./angularApp/services":40}]},{},[41])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvcm9vdC90aGUtdG9vbC9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvYXBwLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY2hhdC9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NoYXQvbGlzdC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW1lbnQvYXJlYS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW1lbnQvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tdW5pY2F0aW9uL2FyZWEuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21tdW5pY2F0aW9uL2VtYmVkLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tbXVuaWNhdGlvbi9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbW11bmljYXRpb24vbGlzdC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvY29tcGFueS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvY29uZmlybS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvY3JlYXRlLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2NvbXBhbnkvbGlzdC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWFpbi9ob21lLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWFpbi9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21haW4vbWFpbi5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lZXRpbmcvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZWV0aW5nL2xpc3QuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZWV0aW5nL21lZXRpbmcuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvbGlzdC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lbWJlci9tZW1iZXIuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZXNzYWdlL2NyZWF0ZS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lc3NhZ2UvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2NvbmZpcm0uanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2NyZWF0ZS5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3NwZWFrZXIvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL2xpc3QuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9zcGVha2VyL3NwZWFrZXIuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90YWcvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90YWcvbWFuYWdlci5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL3RvcGljL2VtYmVkLmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdG9waWMvaW5kZXguanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy90b3BpYy9saXN0LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvdG9waWMvdG9waWMuanMiLCIvcm9vdC90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvZmlsdGVycy9pbmRleC5qcyIsIi9yb290L3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2luZGV4LmpzIiwiL3Jvb3QvdGhlLXRvb2wvY2xpZW50QXBwL2pzL3RoZVRvb2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hNQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgndGhlVG9vbCcsIFtcbiAgJ25nJyxcbiAgJ25nUm91dGUnLFxuICAnbmdTYW5pdGl6ZScsXG4gICdpbmZpbml0ZS1zY3JvbGwnLFxuICAndGhlVG9vbC5maWx0ZXJzJyxcbiAgJ3RoZVRvb2wuc2VydmljZXMnLFxuICAndGhlVG9vbC5kaXJlY3RpdmVzJyxcbiAgJ3RoZVRvb2wuY29udHJvbGxlcnMnXG5dKS5cbmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbignLycgICAgICAgICAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6ICd2aWV3cy9ob21lLmh0bWwnLCAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdob21lJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvY29tcGFuaWVzLycgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBhbnkvbGlzdC5odG1sJywgICAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbmllc0NvbnRyb2xsZXInfSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9jb21wYW5pZXMvdGFibGUvJyAgICAgICAgICwge3RlbXBsYXRlVXJsOiAndmlld3MvY29tcGFueS90YWJsZS5odG1sJywgICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFuaWVzQ29udHJvbGxlcid9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbignL2NvbXBhbmllcy9idWRnZXQvJyAgICAgICAgLCB7dGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wYW55L2J1ZGdldC5odG1sJywgICAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW5pZXNDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvY29tcGFueS8nICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBhbnkvY3JlYXRlLmh0bWwnLCAgICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZUNvbXBhbnlDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvY29tcGFueS86aWQnICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBhbnkvdmlldy5odG1sJywgICAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbnlDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvY29tcGFueS86aWQvZWRpdCcgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBhbnkvZWRpdC5odG1sJywgICAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbnlDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvY29tcGFueS86aWQvcGFydGljaXBhdGlvbicsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBhbnkvcGFydGljaXBhdGlvbi5odG1sJywgY29udHJvbGxlcjogJ0NvbXBhbnlDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvY29tcGFueS86aWQvY29uZmlybScgICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBhbnkvY29uZmlybS5odG1sJywgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbnlFbWFpbENvbnRyb2xsZXInfSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9jb21tZW50LzppZC9lZGl0JyAgICAgICAgICwge3RlbXBsYXRlVXJsOiAndmlld3MvY29tbWVudC9lZGl0Lmh0bWwnLCAgICAgICAgICBjb250cm9sbGVyOiAnQ29tbWVudENvbnRyb2xsZXInfSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9zcGVha2Vycy8nICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiAndmlld3Mvc3BlYWtlci9saXN0Lmh0bWwnLCAgICAgICAgICBjb250cm9sbGVyOiAnU3BlYWtlcnNDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvc3BlYWtlcnMvdGFibGUvJyAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL3NwZWFrZXIvdGFibGUuaHRtbCcsICAgICAgICAgY29udHJvbGxlcjogJ1NwZWFrZXJzQ29udHJvbGxlcid9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbignL3NwZWFrZXIvJyAgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6ICd2aWV3cy9zcGVha2VyL2NyZWF0ZS5odG1sJywgICAgICAgIGNvbnRyb2xsZXI6ICdDcmVhdGVTcGVha2VyQ29udHJvbGxlcid9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbignL3NwZWFrZXIvOmlkJyAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6ICd2aWV3cy9zcGVha2VyL3ZpZXcuaHRtbCcsICAgICAgICAgIGNvbnRyb2xsZXI6ICdTcGVha2VyQ29udHJvbGxlcid9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbignL3NwZWFrZXIvOmlkL2VkaXQnICAgICAgICAgLCB7dGVtcGxhdGVVcmw6ICd2aWV3cy9zcGVha2VyL2VkaXQuaHRtbCcsICAgICAgICAgIGNvbnRyb2xsZXI6ICdTcGVha2VyQ29udHJvbGxlcid9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbignL3NwZWFrZXIvOmlkL2NvbmZpcm0nICAgICAgLCB7dGVtcGxhdGVVcmw6ICd2aWV3cy9zcGVha2VyL2NvbmZpcm0uaHRtbCcsICAgICAgIGNvbnRyb2xsZXI6ICdTcGVha2VyRW1haWxDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvbWVtYmVycy8nICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL21lbWJlci9saXN0Lmh0bWwnLCAgICAgICAgICAgY29udHJvbGxlcjogJ01lbWJlcnNDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvbWVtYmVyLzppZCcgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL21lbWJlci92aWV3Lmh0bWwnLCAgICAgICAgICAgY29udHJvbGxlcjogJ01lbWJlckNvbnRyb2xsZXInfSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9tZWV0aW5ncycgICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiAndmlld3MvbWVldGluZy9saXN0Lmh0bWwnLCAgICAgICAgICBjb250cm9sbGVyOiAnTWVldGluZ3NDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvbWVldGluZy86aWQnICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL21lZXRpbmcvdmlldy5odG1sJywgICAgICAgICAgY29udHJvbGxlcjogJ01lZXRpbmdDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvbWVldGluZy86aWQvZWRpdCcgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL21lZXRpbmcvZWRpdC5odG1sJywgICAgICAgICAgY29udHJvbGxlcjogJ01lZXRpbmdDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvY2hhdHMnICAgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NoYXQvbGlzdC5odG1sJywgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NoYXRDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvY2hhdC86aWQnICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NoYXQvdmlldy5odG1sJywgICAgICAgICAgICAgY29udHJvbGxlcjogJ01lc3NhZ2VDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvdG9waWNzJyAgICAgICAgICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL3RvcGljL2xpc3QuaHRtbCcsICAgICAgICAgICAgY29udHJvbGxlcjogJ1RvcGljc0NvbnRyb2xsZXInfSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oJy90b3BpYy86aWQnICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiAndmlld3MvdG9waWMvdmlldy5odG1sJywgICAgICAgICAgICBjb250cm9sbGVyOiAnVG9waWNDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvY29tbXVuaWNhdGlvbnMnICAgICAgICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbW11bmljYXRpb24vbGlzdC5odG1sJywgICAgY29udHJvbGxlcjogJ0NvbW11bmljYXRpb25zQ29udHJvbGxlcid9KTtcbiAgJHJvdXRlUHJvdmlkZXIub3RoZXJ3aXNlKHtyZWRpcmVjdFRvOiAnLyd9KTtcbn1dKTtcbiIsInJlcXVpcmUoJy4vbGlzdCcpOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignQ2hhdENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBDaGF0RmFjdG9yeSkge1xuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICBDaGF0RmFjdG9yeS5DaGF0cy5nZXRBbGwoZnVuY3Rpb24oY2hhdHMpIHtcbiAgICAkc2NvcGUuY2hhdHMgPSBjaGF0cztcbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICB9KTtcblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNvbW1lbnRBcmVhQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCBNZW1iZXJGYWN0b3J5LCBDb21tZW50RmFjdG9yeSkge1xuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAkc2NvcGUuY29tbWVudERhdGEgPSB7XG4gICAgbWFya2Rvd246IFwiXCJcbiAgfTtcblxuICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXQoe2lkOiBcIm1lXCJ9LCBmdW5jdGlvbiAobWUpIHtcbiAgICAkc2NvcGUubWUgPSBtZTtcbiAgfSk7XG5cbiAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuZ2V0QWxsKGZ1bmN0aW9uIChtZW1iZXJzKSB7XG4gICAgJHNjb3BlLm1lbWJlcnMgPSBtZW1iZXJzO1xuICB9KTtcblxuICBsb2FkQ29tbWVudHMoKTtcblxuICBmdW5jdGlvbiBsb2FkQ29tbWVudHMoKSB7XG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgaWYgKCRzY29wZS50aHJlYWQuc3BsaXQoXCItXCIpWzFdID09PSBcIlwiKSB7XG4gICAgICBzZXRUaW1lb3V0KGxvYWRDb21tZW50cywgNTAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcGFnZUlkID0gJHNjb3BlLnRocmVhZC5zdWJzdHJpbmcoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwiLVwiKSArIDEpO1xuXG4gICAgaWYgKCRzY29wZS50aHJlYWQuaW5kZXhPZihcImNvbXBhbnktXCIpICE9IC0xKSB7XG4gICAgICBDb21tZW50RmFjdG9yeS5Db21wYW55LmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwic3BlYWtlci1cIikgIT0gLTEpIHtcbiAgICAgIENvbW1lbnRGYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKHtpZDogcGFnZUlkfSwgZ290Q29tbWVudHMpO1xuICAgIH1cbiAgICBlbHNlIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJ0b3BpYy1cIikgIT0gLTEpIHtcbiAgICAgIENvbW1lbnRGYWN0b3J5LlRvcGljLmdldEFsbCh7aWQ6IHBhZ2VJZH0sIGdvdENvbW1lbnRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnb3RDb21tZW50cyhjb21tZW50cykge1xuICAgICAgJHNjb3BlLmNvbW1lbnRzID0gY29tbWVudHM7XG5cbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgJHNjb3BlLnBvc3RDb21tZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICgkc2NvcGUuY29tbWVudERhdGEubWFya2Rvd24gPT09IFwiXCIpe1xuICAgICAgJHNjb3BlLmVtcHR5Q29tbWVudCA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGRhdGUgPSBEYXRlLm5vdygpO1xuXG4gICAgQ29tbWVudEZhY3RvcnkuQ29tbWVudC5jcmVhdGUoe1xuICAgICAgdGhyZWFkOiAkc2NvcGUudGhyZWFkLFxuICAgICAgbWVtYmVyOiAkc2NvcGUubWUuaWQsXG4gICAgICBtYXJrZG93bjogJHNjb3BlLmNvbW1lbnREYXRhLm1hcmtkb3duLFxuICAgICAgaHRtbDogJHNjb3BlLmNvbnZlcnRNYXJrZG93blRvSHRtbCgkc2NvcGUuY29tbWVudERhdGEubWFya2Rvd24pLFxuICAgICAgcG9zdGVkOiBkYXRlLFxuICAgICAgdXBkYXRlZDogZGF0ZVxuICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgbG9hZENvbW1lbnRzKCk7XG4gICAgfSk7XG4gIH1cblxuICAkc2NvcGUuc2F2ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xuICAgIGlmIChjb21tZW50LmJ1ZmZlciA9PT0gXCJcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbW1lbnQubWFya2Rvd24gPSBjb21tZW50LmJ1ZmZlcjtcbiAgICBjb21tZW50Lmh0bWwgPSAkc2NvcGUuY29udmVydE1hcmtkb3duVG9IdG1sKGNvbW1lbnQubWFya2Rvd24pO1xuICAgIGNvbW1lbnQudXBkYXRlZCA9IERhdGUubm93KCk7XG5cbiAgICBDb21tZW50RmFjdG9yeS5Db21tZW50LnVwZGF0ZSh7aWQ6IGNvbW1lbnQuX2lkfSwgY29tbWVudCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBjb21tZW50LmVkaXRpbmcgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS5xdW90ZUNvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xuICAgICRzY29wZS5jb21tZW50RGF0YS5tYXJrZG93biA9IFwiPiAqKlwiICsgJHNjb3BlLmdldE1lbWJlcihjb21tZW50Lm1lbWJlcikubmFtZSArIFwiIHNhaWQ6KipcXG4+IFwiICsgY29tbWVudC5tYXJrZG93bi5zcGxpdChcIlxcblwiKS5qb2luKFwiXFxuPiBcIikgKyBcIlxcblxcblwiO1xuICB9O1xuXG4gICRzY29wZS5kZWxldGVDb21tZW50ID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgICBDb21tZW50RmFjdG9yeS5Db21tZW50LmRlbGV0ZSh7aWQ6IGNvbW1lbnQuX2lkfSwgZnVuY3Rpb24gKCkge1xuICAgICAgbG9hZENvbW1lbnRzKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmNvbnZlcnRUZXh0VG9IdG1sID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciB1cmxFeHAgPSAvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2lnO1xuICAgIHZhciBtYWlsRXhwID0gL1tcXHdcXC5cXC1dK1xcQChbXFx3XFwtXStcXC4pK1tcXHddezIsNH0oPyFbXjxdKj4pL2lnO1xuXG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykucmVwbGFjZSh1cmxFeHAsXCI8YSBocmVmPSckMSc+JDE8L2E+XCIpLnJlcGxhY2UobWFpbEV4cCxcIjxhIGhyZWY9Jy8jL2NvbXBhbnkvXCIrJHJvdXRlUGFyYW1zLmlkK1wiL2NvbmZpcm0/ZW1haWw9JCYnPiQmPC9hPlwiKTtcbiAgfTtcblxuICAkc2NvcGUuY29udmVydE5ld0xpbmVzVG9IdG1sID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicrdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKSsnPC9kaXY+JztcbiAgfTtcblxuICAkc2NvcGUuY29udmVydE1hcmtkb3duVG9IdG1sID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicgKyB0ZXh0ICsgJzwvZGl2Pic7XG4gIH07XG5cbiAgJHNjb3BlLmNoZWNrUGVybWlzc2lvbiA9IGZ1bmN0aW9uIChjb21tZW50KSB7XG4gICAgdmFyIHJvbGVzID0gJHNjb3BlLm1lLnJvbGVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSAnZGV2ZWxvcG1lbnQtdGVhbScgfHwgby5pZCA9PSAnY29vcmRpbmF0aW9uJztcbiAgICB9KTtcblxuICAgIGNvbnNvbGUubG9nKGNvbW1lbnQpO1xuXG4gICAgaWYocm9sZXMubGVuZ3RoID09IDAgJiYgY29tbWVudC5tZW1iZXIgIT0gJHNjb3BlLm1lLmlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG59KTtcbiIsInJlcXVpcmUoJy4vYXJlYS5qcycpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJDb21tdW5pY2F0aW9uQXJlYUNvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgQ29tbXVuaWNhdGlvbkZhY3RvcnkpIHtcblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgJHNjb3BlLmNvbW11bmljYXRpb25EYXRhID0ge1xuICAgIG1hcmtkb3duOiBcIlwiXG4gIH07XG5cbiAgJHNjb3BlLm1lID0gSlNPTi5wYXJzZSgkc2NvcGUubWVKc29uKTtcbiAgJHNjb3BlLm1lbWJlcnMgPSBKU09OLnBhcnNlKCRzY29wZS5tZW1iZXJzSnNvbik7XG4gICRzY29wZS5yb2xlcyA9IEpTT04ucGFyc2UoJHNjb3BlLnJvbGVzSnNvbik7XG5cbiAgbG9hZENvbW11bmljYXRpb25zKCk7XG5cbiAgZnVuY3Rpb24gbG9hZENvbW11bmljYXRpb25zKCkge1xuICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgIGlmICgkc2NvcGUudGhyZWFkLnNwbGl0KFwiLVwiKVsxXSA9PT0gXCJcIikge1xuICAgICAgc2V0VGltZW91dChsb2FkQ29tbXVuaWNhdGlvbnMsIDUwMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHBhZ2VJZCA9ICRzY29wZS50aHJlYWQuc3Vic3RyaW5nKCRzY29wZS50aHJlYWQuaW5kZXhPZihcIi1cIikgKyAxKTtcblxuICAgIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJjb21wYW55LVwiKSAhPSAtMSkge1xuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tcGFueS5nZXRBbGwoe2lkOiBwYWdlSWR9LCBnb3RDb21tdW5pY2F0aW9ucyk7XG4gICAgICAkc2NvcGUua2luZHM9WydFbWFpbCBUbycsICdFbWFpbCBGcm9tJywgJ01lZXRpbmcnLCAnUGhvbmUgQ2FsbCddO1xuICAgIH1cbiAgICBlbHNlIGlmICgkc2NvcGUudGhyZWFkLmluZGV4T2YoXCJzcGVha2VyLVwiKSAhPSAtMSkge1xuICAgICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuU3BlYWtlci5nZXRBbGwoe2lkOiBwYWdlSWR9LCBnb3RDb21tdW5pY2F0aW9ucyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ290Q29tbXVuaWNhdGlvbnMoY29tbXVuaWNhdGlvbnMpIHtcbiAgICAgICRzY29wZS5jb21tdW5pY2F0aW9ucyA9IGNvbW11bmljYXRpb25zO1xuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICBpZiAoJHNjb3BlLnRocmVhZC5pbmRleE9mKFwic3BlYWtlci1cIikgIT0gLTEpIHtcbiAgICAgICAgaWYoY29tbXVuaWNhdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICByZXR1cm4gby5raW5kLmluZGV4T2YoJ1BhcmFncmFwaCcpICE9IC0xO1xuICAgICAgICB9KS5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICRzY29wZS5raW5kcz1bJ0VtYWlsIFRvJywgJ0VtYWlsIEZyb20nLCAnTWVldGluZycsICdQaG9uZSBDYWxsJ107ICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5raW5kcz1bJ0luaXRhbCBFbWFpbCBQYXJhZ3JhcGgnLCdFbWFpbCBUbycsICdFbWFpbCBGcm9tJywgJ01lZXRpbmcnLCAnUGhvbmUgQ2FsbCddO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgJHNjb3BlLnBvc3RDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghJHNjb3BlLmNvbW11bmljYXRpb25EYXRhLmtpbmQgfHwgJHNjb3BlLmNvbW11bmljYXRpb25EYXRhLmtpbmQ9PSBcIlwiKXtcbiAgICAgICRzY29wZS5lbXB0eUNvbW11bmljYXRpb24gPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoISRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0IHx8ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS50ZXh0PT0gXCJcIil7XG4gICAgICAkc2NvcGUuZW1wdHlDb21tdW5pY2F0aW9uID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZGF0ZSA9IERhdGUubm93KCk7XG5cbiAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLmNyZWF0ZSh7XG4gICAgICB0aHJlYWQ6ICRzY29wZS50aHJlYWQsXG4gICAgICBtZW1iZXI6ICRzY29wZS5tZS5pZCxcbiAgICAgIGtpbmQ6ICRzY29wZS5jb21tdW5pY2F0aW9uRGF0YS5raW5kLFxuICAgICAgdGV4dDogJHNjb3BlLmNvbW11bmljYXRpb25EYXRhLnRleHQsXG4gICAgICBwb3N0ZWQ6IGRhdGUsXG4gICAgICB1cGRhdGVkOiBkYXRlXG4gICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBsb2FkQ29tbXVuaWNhdGlvbnMoKTtcbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS5zYXZlQ29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XG4gICAgaWYgKGNvbW11bmljYXRpb24uYnVmZmVyID09PSBcIlwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29tbXVuaWNhdGlvbi50ZXh0ID0gY29tbXVuaWNhdGlvbi5idWZmZXI7XG4gICAgY29tbXVuaWNhdGlvbi51cGRhdGVkID0gRGF0ZS5ub3coKTtcblxuICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24udXBkYXRlKHtpZDogY29tbXVuaWNhdGlvbi5faWR9LCBjb21tdW5pY2F0aW9uLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGNvbW11bmljYXRpb24uZWRpdGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLmRlbGV0ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uZGVsZXRlKHtpZDogY29tbXVuaWNhdGlvbi5faWR9LCBmdW5jdGlvbiAoKSB7XG4gICAgICBsb2FkQ29tbXVuaWNhdGlvbnMoKTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuYXBwcm92ZUNvbW11bmljYXRpb24gPSBmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xuICAgIENvbW11bmljYXRpb25GYWN0b3J5LkNvbW11bmljYXRpb24uYXBwcm92ZSh7aWQ6IGNvbW11bmljYXRpb24uX2lkfSwgbnVsbCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICBsb2FkQ29tbXVuaWNhdGlvbnMoKTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgcmV0dXJuICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICB9KVswXTtcbiAgfTtcblxuICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgIH0pO1xuXG4gICAgaWYocm9sZXMubGVuZ3RoID09IDAgJiYgY29tbXVuaWNhdGlvbi5tZW1iZXIgIT0gJHNjb3BlLm1lLmlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG4gICRzY29wZS5jb252ZXJ0VVJMcyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcbiAgICBcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIik7XG4gIH1cblxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIkNvbW11bmljYXRpb25FbWJlZENvbnRyb2xsZXJcIiwgZnVuY3Rpb24gKCRzY29wZSwgQ29tbXVuaWNhdGlvbkZhY3RvcnkpIHtcblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5zdWNjZXNzICAgICA9IFwiXCI7XG4gICRzY29wZS5lcnJvciAgICAgICA9IFwiXCI7XG5cbiAgJHNjb3BlLmNvbW11bmljYXRpb24gPSBKU09OLnBhcnNlKCRzY29wZS5jb21tdW5pY2F0aW9uSnNvbik7XG4gICRzY29wZS5jb21tdW5pY2F0aW9uLmVkaXRpbmcgPSBmYWxzZTtcbiAgJHNjb3BlLmNvbW11bmljYXRpb24uZGVsZXRlZCA9IGZhbHNlO1xuXG4gICRzY29wZS5tZSA9IEpTT04ucGFyc2UoJHNjb3BlLm1lSnNvbik7XG4gICRzY29wZS5tZW1iZXJzID0gSlNPTi5wYXJzZSgkc2NvcGUubWVtYmVyc0pzb24pO1xuICAkc2NvcGUucm9sZXMgPSBKU09OLnBhcnNlKCRzY29wZS5yb2xlc0pzb24pO1xuXG5cbiAgJHNjb3BlLnNhdmVDb21tdW5pY2F0aW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICBpZiAoY29tbXVuaWNhdGlvbi5idWZmZXIgPT09IFwiXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb21tdW5pY2F0aW9uLnRleHQgPSBjb21tdW5pY2F0aW9uLmJ1ZmZlcjtcbiAgICBjb21tdW5pY2F0aW9uLnVwZGF0ZWQgPSBEYXRlLm5vdygpO1xuXG4gICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi51cGRhdGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIGNvbW11bmljYXRpb24sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgY29tbXVuaWNhdGlvbi5lZGl0aW5nID0gZmFsc2U7XG4gICAgICBjb21tdW5pY2F0aW9uLmFwcHJvdmVkID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICAkc2NvcGUuZGVsZXRlQ29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XG4gICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5kZWxldGUoe2lkOiBjb21tdW5pY2F0aW9uLl9pZH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5jb21tdW5pY2F0aW9uLmRlbGV0ZWQgPSB0cnVlO1xuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5hcHByb3ZlQ29tbXVuaWNhdGlvbiA9IGZ1bmN0aW9uIChjb21tdW5pY2F0aW9uKSB7XG4gICAgQ29tbXVuaWNhdGlvbkZhY3RvcnkuQ29tbXVuaWNhdGlvbi5hcHByb3ZlKHtpZDogY29tbXVuaWNhdGlvbi5faWR9LCBudWxsLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5jb21tdW5pY2F0aW9uLmFwcHJvdmVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuZ2V0TWVtYmVyID0gZnVuY3Rpb24gKG1lbWJlcklkKSB7XG4gICAgcmV0dXJuICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBtZW1iZXJJZDtcbiAgICB9KVswXTtcbiAgfTtcblxuICAkc2NvcGUuY2hlY2tQZXJtaXNzaW9uID0gZnVuY3Rpb24gKGNvbW11bmljYXRpb24pIHtcbiAgICB2YXIgcm9sZXMgPSAkc2NvcGUubWUucm9sZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmlkID09ICdkZXZlbG9wbWVudC10ZWFtJyB8fCBvLmlkID09ICdjb29yZGluYXRpb24nO1xuICAgIH0pO1xuXG4gICAgaWYocm9sZXMubGVuZ3RoID09IDAgJiYgY29tbXVuaWNhdGlvbi5tZW1iZXIgIT0gJHNjb3BlLm1lLmlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAkc2NvcGUudGltZVNpbmNlID1mdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKERhdGUubm93KCkgLSBkYXRlKSAvIDEwMDApO1xuXG4gICAgdmFyIHN1ZmZpeCA9ICdhZ28nO1xuICAgIGlmKHNlY29uZHMgPCAwKXtcbiAgICAgIHNlY29uZHMgPSBNYXRoLmFicyhzZWNvbmRzKTtcbiAgICAgIHN1ZmZpeCA9ICd0byBnbyc7XG4gICAgfVxuXG4gICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzE1MzYwMDApO1xuXG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiB5ZWFycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAyNTkyMDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1vbnRocyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA4NjQwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBkYXlzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgaG91cnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbWludXRlcyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3Ioc2Vjb25kcykgKyBcIiBzZWNvbmRzIFwiICsgc3VmZml4O1xuICB9O1xuXG4gICRzY29wZS5jb252ZXJ0VVJMcyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcbiAgICBcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIik7XG4gIH1cbn0pOyIsInJlcXVpcmUoJy4vYXJlYS5qcycpO1xucmVxdWlyZSgnLi9saXN0LmpzJyk7XG5yZXF1aXJlKCcuL2VtYmVkLmpzJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDb21tdW5pY2F0aW9uc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgQ29tbXVuaWNhdGlvbkZhY3RvcnkpIHtcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICBDb21tdW5pY2F0aW9uRmFjdG9yeS5Db21tdW5pY2F0aW9uLmdldEFsbChmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICRzY29wZS5jb21tdW5pY2F0aW9ucyA9IHJlc3BvbnNlO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnNob3dPcGVuID0gdHJ1ZTtcblxuICAgICRzY29wZS5zaG93bkNvbW11bmljYXRpb25zID0gZnVuY3Rpb24gKHNob3dPcGVuKSB7XG4gICAgICByZXR1cm4gJHNjb3BlLmNvbW11bmljYXRpb25zLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgIHJldHVybiAoc2hvd09wZW4gPyAhby5hcHByb3ZlZCA6IG8uYXBwcm92ZWQpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXJcbiAgLmNvbnRyb2xsZXIoJ0NvbXBhbnlDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgQ29tcGFueUZhY3RvcnksIE1lbWJlckZhY3RvcnksIE5vdGlmaWNhdGlvbkZhY3RvcnkpIHtcblxuICAgICRzY29wZS50cnVzdFNyYyA9IGZ1bmN0aW9uKHNyYykge1xuICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKHNyYysnI3BhZ2UtYm9keScpO1xuICAgIH1cblxuICAgICRzY29wZS5jb252ZXJ0RW1haWxzID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgdmFyIG1haWxFeHAgPSAvW1xcd1xcLlxcLV0rXFxAKFtcXHdcXC1dK1xcLikrW1xcd117Miw0fSg/IVtePF0qPikvaWc7XG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKG1haWxFeHAsXCI8YSBocmVmPScvIy9jb21wYW55L1wiKyRyb3V0ZVBhcmFtcy5pZCtcIi9jb25maXJtP2VtYWlsPSQmJz4kJjwvYT5cIilcbiAgICB9XG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29tcGFueURhdGEgPSB0aGlzLmZvcm1EYXRhO1xuXG4gICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LnVwZGF0ZSh7IGlkOmNvbXBhbnlEYXRhLmlkIH0sIGNvbXBhbnlEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2Uuc3VjY2VzcztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zdGF0dXNlcyA9IFsnU1VHR0VTVElPTicsJ0NPTlRBQ1RFRCcsJ0lOIENPTlZFUlNBVElPTlMnLCdBQ0NFUFRFRC9JTiBORUdPVElBVElPTlMnLCdDTE9TRUQgREVBTCcsJ1JFSkVDVEVEL0dJVkUgVVAnXTtcbiAgICAkc2NvcGUubG9nb1NpemVzID0gW251bGwsICdTJywnTScsJ0wnXTtcbiAgICAkc2NvcGUuc3RhbmREYXlzID0gW251bGwsIDEsMiwzLDQsNV07XG4gICAgJHNjb3BlLnBvc3RzTnVtYmVycyA9IFtudWxsLCAxLDIsMyw0LDVdO1xuXG4gICAgJHNjb3BlLmNvbXBhbnkgPSAkc2NvcGUuZm9ybURhdGEgPSAkc2NvcGUuZ2V0Q29tcGFueSgkcm91dGVQYXJhbXMuaWQpO1xuXG4gICAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS5nZXQoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmNvbXBhbnkgPSAkc2NvcGUuZm9ybURhdGEgPSByZXNwb25zZTtcblxuICAgICAgTm90aWZpY2F0aW9uRmFjdG9yeS5Db21wYW55LmdldEFsbCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKGdldERhdGEpIHtcbiAgICAgICAgJHNjb3BlLmNvbXBhbnkubm90aWZpY2F0aW9ucyA9IGdldERhdGE7XG5cbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbiBcbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDb21wYW55RW1haWxDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgJGxvY2F0aW9uLCBFbWFpbEZhY3RvcnkpIHtcbiAgICAkc2NvcGUuZW1haWwgPSAkbG9jYXRpb24uc2VhcmNoKCkuZW1haWw7XG4gICAgJHNjb3BlLmNvbXBhbnlJZCA9ICRyb3V0ZVBhcmFtcy5pZDtcbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgJHNjb3BlLm1lc3NhZ2UgPSBudWxsO1xuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAgICRzY29wZS5tZXNzYWdlID0gbnVsbDtcblxuICAgICAgY29uc29sZS5sb2coXCJzZW5kIGVtYWlsIHRvIFwiLCAkc2NvcGUuZW1haWwsIFwiIGZyb20gXCIsICRzY29wZS5jb21wYW55SWQpO1xuXG4gICAgICBFbWFpbEZhY3RvcnkuQ29tcGFueS5zZW5kKHsgaWQ6ICRzY29wZS5jb21wYW55SWQgfSwgeyBlbWFpbDogJHNjb3BlLmVtYWlsIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTsiLCIndXNlIHN0cmljdCc7XG4gXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignQ3JlYXRlQ29tcGFueUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCBDb21wYW55RmFjdG9yeSwgTWVtYmVyRmFjdG9yeSkge1xuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb21wYW55RGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICAgIENvbXBhbnlGYWN0b3J5LkNvbXBhbnkuY3JlYXRlKGNvbXBhbnlEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIE1lbWJlckZhY3RvcnkuTWVtYmVyLmdldEFsbCggZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5tZW1iZXJzID0gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH0pOyIsInJlcXVpcmUoJy4vY29tcGFueS5qcycpO1xucmVxdWlyZSgnLi9saXN0LmpzJyk7XG5yZXF1aXJlKCcuL2NyZWF0ZS5qcycpO1xucmVxdWlyZSgnLi9jb25maXJtLmpzJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignQ29tcGFuaWVzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkc2NlLCBDb21wYW55RmFjdG9yeSwgTWVtYmVyRmFjdG9yeSkge1xuICAgICRzY29wZS50cnVzdFNyYyA9IGZ1bmN0aW9uKHNyYykge1xuICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKHNyYyk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmdldENsYXNzRnJvbVN0YXR1c0FuZEtpbmQgPSBmdW5jdGlvbihjb21wYW55KSB7XG4gICAgICBpZighY29tcGFueS5wYXJ0aWNpcGF0aW9uKSB7IFxuICAgICAgICB2YXIgc3RhdHVzID0gY29tcGFueS5zdGF0dXMudG9VcHBlckNhc2UoKTtcbiAgICAgICAgXG4gICAgICAgIGlmKHN0YXR1cy5pbmRleE9mKFwiU1VHRVNUw4NPXCIpICE9IC0xKSB7IHJldHVybiBcImdyZXlcIjsgfVxuICAgICAgICBlbHNlIGlmKHN0YXR1cy5pbmRleE9mKFwiQ09OVEFDVEFET1wiKSAhPSAtMSkgeyByZXR1cm4gXCJvcmFuZ2VcIjsgfVxuICAgICAgICBlbHNlIGlmKHN0YXR1cy5pbmRleE9mKFwiRU0gQ09OVkVSU0HDh8OVRVNcIikgIT0gLTEpIHsgcmV0dXJuIFwiYmx1ZVwiOyB9XG4gICAgICAgIGVsc2UgaWYoc3RhdHVzLmluZGV4T2YoXCJBQ0VJVE9VL0VNIE5FR09DSUHDh8OVRVNcIikgIT0gLTEpIHsgcmV0dXJuIFwiZ3JlZW5cIjsgfVxuICAgICAgICBlbHNlIGlmKHN0YXR1cy5pbmRleE9mKFwiTkVHT0NJTyBGRUNIQURPXCIpICE9IC0xKSB7IHJldHVybiBcImxpbWVcIjsgfVxuICAgICAgICBlbHNlIGlmKHN0YXR1cy5pbmRleE9mKFwiUkVKRUlUT1UvREVTSVNUSVJcIikgIT0gLTEpIHsgcmV0dXJuIFwibm9wZVwiOyB9XG4gICAgICB9XG4gICAgICBpZighY29tcGFueS5wYXJ0aWNpcGF0aW9uLmtpbmQpIHsgcmV0dXJuIFwic3BvbnNvclwiOyB9XG4gICAgICB2YXIga2luZCA9IGNvbXBhbnkucGFydGljaXBhdGlvbi5raW5kLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIGlmKGtpbmQuaW5kZXhPZihcImJyb256ZVwiKSAhPSAtMSkgeyByZXR1cm4gXCJicm9uemVcIjsgfSBcbiAgICAgIGVsc2UgaWYoa2luZC5pbmRleE9mKFwicHJhdGFcIikgIT0gLTEpIHsgcmV0dXJuIFwic2lsdmVyXCI7IH1cbiAgICAgIGVsc2UgeyByZXR1cm4gXCJzcG9uc29yXCI7IH1cbiAgICB9XG5cbiAgICAkc2NvcGUuZ2V0Q2xhc3NGcm9tUGF5bWVudFN0YXR1cyA9IGZ1bmN0aW9uKHBhcnRpY2lwYXRpb24pIHtcbiAgICAgIGlmKCFwYXJ0aWNpcGF0aW9uKSB7IHJldHVybiBcImdyZXlcIjsgfVxuICAgICAgaWYoIXBhcnRpY2lwYXRpb24ucGF5bWVudCkgeyByZXR1cm4gXCJncmV5XCI7IH1cbiAgICAgIGlmKCFwYXJ0aWNpcGF0aW9uLnBheW1lbnQuc3RhdHVzKSB7IHJldHVybiBcImdyZXlcIjsgfVxuICAgICAgdmFyIHN0YXR1cyA9IHBhcnRpY2lwYXRpb24ucGF5bWVudC5zdGF0dXMudG9Mb3dlckNhc2UoKTtcblxuICAgICAgaWYoc3RhdHVzLmluZGV4T2YoXCJwYWdvXCIpICE9IC0xIHx8IHN0YXR1cy5pbmRleE9mKFwiZW1pdGlkb1wiKSAhPSAtMSB8fCBzdGF0dXMuaW5kZXhPZihcInJlY2libyBlbnZpYWRvXCIpICE9IC0xKSB7IHJldHVybiBcImxpbWVcIjsgfSBcbiAgICAgIGVsc2UgaWYoc3RhdHVzLmluZGV4T2YoXCJlbnZpYWRvXCIpICE9IC0xKSB7IHJldHVybiBcIm9yYW5nZVwiOyB9XG4gICAgICBlbHNlIHsgcmV0dXJuIFwiZ3JleVwiOyB9XG4gICAgfVxuXG4gICAgJHNjb3BlLnNhdmVTdGF0dXMgPSBmdW5jdGlvbihjb21wYW55KSB7XG4gICAgICB2YXIgY29tcGFueURhdGEgPSBjb21wYW55O1xuXG4gICAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LnVwZGF0ZSh7IGlkOmNvbXBhbnkuaWQgfSwgY29tcGFueURhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkc2NvcGUuc3RhdHVzZXMgPSBbJ0VtaXRpZG8nLCAnUmVjaWJvIEVudmlhZG8nLCAnUGFnbycsICdFbnZpYWRvJ107XG5cbiAgICBDb21wYW55RmFjdG9yeS5Db21wYW55LmdldEFsbChmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLnByZWRpY2F0ZSA9ICdwYXJ0aWNpcGF0aW9uLnBheW1lbnQucHJpY2UnO1xuICAgICAgJHNjb3BlLnJldmVyc2UgPSB0cnVlO1xuICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IHJlc3BvbnNlO1xuICAgIH0pO1xuICB9KTtcbiAgIiwidGhlVG9vbENvbnRyb2xsZXIgPSBhbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5jb250cm9sbGVycycsIFtdKTtcblxucmVxdWlyZSgnLi9tYWluJyk7XG5yZXF1aXJlKCcuL2NvbXBhbnknKTtcbnJlcXVpcmUoJy4vc3BlYWtlcicpO1xucmVxdWlyZSgnLi9tZW1iZXInKTtcbnJlcXVpcmUoJy4vY29tbWVudCcpO1xucmVxdWlyZSgnLi9tZWV0aW5nJyk7XG5yZXF1aXJlKCcuL2NoYXQnKTtcbnJlcXVpcmUoJy4vbWVzc2FnZScpO1xucmVxdWlyZSgnLi90b3BpYycpO1xucmVxdWlyZSgnLi9jb21tdW5pY2F0aW9uJyk7XG5yZXF1aXJlKCcuL3RhZycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKCdob21lJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRzY2UsICAkcm9vdFNjb3BlLCBOb3RpZmljYXRpb25GYWN0b3J5LCBNZW1iZXJGYWN0b3J5KSB7XG5cblxuICBmdW5jdGlvbiBnZXRJbWFnZUZyb21UaHJlYWQgKHRocmVhZCkge1xuICAgIGlmKHRocmVhZC5pbmRleE9mKCdjb21wYW55LScpICE9IC0xKSB7XG4gICAgICByZXR1cm4gJHNjb3BlLmNvbXBhbmllcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICByZXR1cm4gdGhyZWFkLnNwbGl0KCdjb21wYW55LScpWzFdID09IG8uaWQ7XG4gICAgICB9KVswXS5pbWc7XG4gICAgfVxuICAgIGVsc2UgaWYodGhyZWFkLmluZGV4T2YoJ3NwZWFrZXItJykgIT0gLTEpIHtcbiAgICAgIHJldHVybiAkc2NvcGUuc3BlYWtlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgcmV0dXJuIHRocmVhZC5zcGxpdCgnc3BlYWtlci0nKVsxXSA9PSBvLmlkO1xuICAgICAgfSlbMF0uaW1nO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SW5mb0Zyb21Ub3BpYyAodGhyZWFkKSB7XG4gICAgaWYodGhyZWFkLmluZGV4T2YoJ3RvcGljLScpICE9IC0xKSB7XG4gICAgICByZXR1cm4gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICByZXR1cm4gdGhyZWFkLnNwbGl0KCd0b3BpYy0nKVsxXSA9PSBvLl9pZDtcbiAgICAgIH0pWzBdO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbGlkYXRlRGVzY3JpcHRpb24gKHRocmVhZCwgZGVzY3JpcHRpb24pIHtcbiAgICBpZih0aHJlYWQuaW5kZXhPZigndG9waWMtJykgIT0gLTEgJiYgZGVzY3JpcHRpb24uaW5kZXhPZignY29tbWVudCcpICE9IC0xKSB7XG4gICAgICBkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uLnNwbGl0KCdbJylbMF07XG4gICAgfVxuICAgIHJldHVybiBkZXNjcmlwdGlvbjtcbiAgfVxuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgJHNjb3BlLm5vdGlmaWNhdGlvbnMgPSBbXTtcbiAgJHNjb3BlLmxpbWl0ID0gMTA7XG5cbiAgaW5pdCgpO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGlmICgkc2NvcGUubG9hZGluZylcbiAgICAgICAgaW5pdCgpO1xuICAgIH0sIDEwMDApO1xuXG4gICAgTm90aWZpY2F0aW9uRmFjdG9yeS5Ob3RpZmljYXRpb24uZ2V0QWxsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgaiA9IHJlc3BvbnNlLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAvL2lmIChyZXNwb25zZVtpXS5tZW1iZXIgIT0gbWUuaWQpeyAvL3VuY29tbWVudCB0byBoaWRlIHNlbGYtZXZlbnRzXG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUocmVzcG9uc2VbaV0ucG9zdGVkKTtcbiAgICAgICAgJHNjb3BlLm5vdGlmaWNhdGlvbnMudW5zaGlmdCh7XG4gICAgICAgICAgcGF0aDogcmVzcG9uc2VbaV0udGhyZWFkLnJlcGxhY2UoXCItXCIsIFwiL1wiKSxcbiAgICAgICAgICBkYXRlOiB7XG4gICAgICAgICAgICBkYXRhOiBkYXRlLFxuICAgICAgICAgICAgZnVsbDogZGF0ZS50b1N0cmluZygpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogdmFsaWRhdGVEZXNjcmlwdGlvbihyZXNwb25zZVtpXS50aHJlYWQsIHJlc3BvbnNlW2ldLmRlc2NyaXB0aW9uKSxcbiAgICAgICAgICB0aHJlYWQ6IHJlc3BvbnNlW2ldLnRocmVhZCxcbiAgICAgICAgICBtZW1iZXI6IHtcbiAgICAgICAgICAgIGlkOiByZXNwb25zZVtpXS5tZW1iZXIsXG4gICAgICAgICAgICBuYW1lOiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VbaV0ubWVtYmVyID09IG8uaWQ7XG4gICAgICAgICAgICAgICAgICB9KVswXS5uYW1lLFxuICAgICAgICAgICAgZmFjZWJvb2s6ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZVtpXS5tZW1iZXIgPT0gby5pZDtcbiAgICAgICAgICAgICAgICAgIH0pWzBdLmZhY2Vib29rXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb2xvcjogKHJlc3BvbnNlW2ldLnVucmVhZC5pbmRleE9mKCRzY29wZS5tZS5pZCkgIT0gLTEgPyBcInVucmVhZFwiIDogXCJyZWFkXCIpLFxuICAgICAgICAgIGltYWdlOiBnZXRJbWFnZUZyb21UaHJlYWQocmVzcG9uc2VbaV0udGhyZWFkKSxcbiAgICAgICAgICB0b3BpYzogZ2V0SW5mb0Zyb21Ub3BpYyhyZXNwb25zZVtpXS50aHJlYWQpXG4gICAgICAgIH0pO1xuICAgICAgICAvL31cbiAgICAgIH1cbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICAkc2NvcGUuZ2V0SW1hZ2VGcm9tVGhyZWFkID0gZnVuY3Rpb24gKHRocmVhZCkge1xuICAgIGlmKHRocmVhZC5pbmRleE9mKCdjb21wYW55LScpICE9IC0xKSB7XG4gICAgICByZXR1cm4gICRzY29wZS5jb21wYW5pZXMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhyZWFkLnNwbGl0KCdjb21wYW55LScpWzFdID09IG8uaWQ7XG4gICAgICAgICAgICAgIH0pWzBdLmltZztcbiAgICB9XG4gICAgZWxzZSBpZih0aHJlYWQuaW5kZXhPZignc3BlYWtlci0nKSAhPSAtMSkge1xuICAgICAgcmV0dXJuICRzY29wZS5zcGVha2Vycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aHJlYWQuc3BsaXQoJ3NwZWFrZXItJylbMV0gPT0gby5pZDtcbiAgICAgICAgICAgICAgfSlbMF0uaW1nO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuZ2V0SW5mb0Zyb21Ub3BpYyA9IGZ1bmN0aW9uICh0aHJlYWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIHRocmVhZC5zcGxpdCgndG9waWMtJylbMV0gPT0gby5pZDtcbiAgICB9KVswXTtcbiAgfTtcblxuICAkc2NvcGUuc2Nyb2xsID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCRzY29wZS5saW1pdCA8ICRzY29wZS5ub3RpZmljYXRpb25zLmxlbmd0aClcbiAgICAgICRzY29wZS5saW1pdCArPSAxMDtcbiAgfTtcblxufSk7XG4iLCJyZXF1aXJlKCcuL21haW4uanMnKTtcbnJlcXVpcmUoJy4vaG9tZS5qcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsICRsb2NhdGlvbiwgJHJvb3RTY29wZSwgTm90aWZpY2F0aW9uRmFjdG9yeSwgTWVtYmVyRmFjdG9yeSwgQ29tcGFueUZhY3RvcnksIFNwZWFrZXJGYWN0b3J5LCBUb3BpY0ZhY3RvcnksIFJvbGVGYWN0b3J5LCBUYWdGYWN0b3J5LCBDb21tZW50RmFjdG9yeSkge1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLnJlYWR5ID0gZmFsc2U7XG5cbiAgJHNjb3BlLmRpc3BsYXkgPSBmYWxzZTtcblxuICAkc2NvcGUuc2VhcmNoID0ge307XG4gICRzY29wZS5zZWFyY2hUb3BpY3MgPSB7fTtcblxuICAkc2NvcGUubWUgPSB7fTtcbiAgJHNjb3BlLm1lbWJlcnMgPSBbXTtcbiAgJHNjb3BlLmNvbXBhbmllcyA9IFtdO1xuICAkc2NvcGUuc3BlYWtlcnMgPSBbXTtcbiAgJHNjb3BlLnRvcGljcyA9IFtdO1xuICAkc2NvcGUubm90aWZpY2F0aW9ucyA9IFtdO1xuXG4gICRzY29wZS5ub3RpZmljYXRpb25zSW5mbyA9IHtcbiAgICBudW1iZXI6IDAsXG4gICAgdGV4dDogXCIgTG9hZGluZy4uLlwiXG4gIH07XG5cbiAgdmFyIGZhY3Rvcmllc1JlYWR5ID0gMDtcblxuICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXQoe2lkOiBcIm1lXCJ9LCBmdW5jdGlvbiAobWUpIHtcbiAgICAkc2NvcGUubWUgPSBtZTtcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcblxuICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXRBbGwoZnVuY3Rpb24gKG1lbWJlcnMpIHtcbiAgICAkc2NvcGUubWVtYmVycyA9IG1lbWJlcnM7XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cbiAgQ29tcGFueUZhY3RvcnkuQ29tcGFueS5nZXRBbGwoZnVuY3Rpb24gKGNvbXBhbmllcykge1xuICAgICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cbiAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXRBbGwoZnVuY3Rpb24gKHNwZWFrZXJzKSB7XG4gICAgJHNjb3BlLnNwZWFrZXJzID0gc3BlYWtlcnM7XG4gICAgY2FsbGJhY2soKTtcbiAgfSk7XG5cbiAgVG9waWNGYWN0b3J5LlRvcGljLmdldEFsbChmdW5jdGlvbiAodG9waWNzKSB7XG4gICAgJHNjb3BlLnRvcGljcyA9IHRvcGljcztcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcblxuICBSb2xlRmFjdG9yeS5Sb2xlLmdldEFsbChmdW5jdGlvbiAocm9sZXMpIHtcbiAgICAkc2NvcGUucm9sZXMgPSByb2xlcztcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcblxuICBUYWdGYWN0b3J5LlRhZy5nZXRBbGwoZnVuY3Rpb24gKHRhZ3MpIHtcbiAgICAkc2NvcGUudG9waWNUYWdzID0gdGFncztcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcblxuICBDb21tZW50RmFjdG9yeS5Db21tZW50LmdldEFsbChmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAkc2NvcGUuY29tbWVudHMgPSBjb21tZW50cztcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIGNhbGxiYWNrKCkge1xuICAgIGlmICgrK2ZhY3Rvcmllc1JlYWR5ID09IDgpIHtcbiAgICAgICRzY29wZS5yZWFkeSA9IHRydWU7XG5cbiAgICAgICRzY29wZS51cGRhdGUoKTtcblxuICAgICAgc2V0SW50ZXJ2YWwoJHNjb3BlLnVwZGF0ZSwgMTAwMDApO1xuXG4gICAgICAkcm9vdFNjb3BlLiRvbihcIiRsb2NhdGlvbkNoYW5nZVN0YXJ0XCIsIGZ1bmN0aW9uIChldmVudCwgbmV4dCwgY3VycmVudCkge1xuICAgICAgICBzZXRUaW1lb3V0KCRzY29wZS51cGRhdGUsIDUwMCk7XG4gICAgICAgICRzY29wZS5zZWFyY2gubmFtZSA9ICcnO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U0NPUEUgRlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgTm90aWZpY2F0aW9uRmFjdG9yeS5Ob3RpZmljYXRpb24uZ2V0QWxsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLm5vdGlmaWNhdGlvbnMgPSBbXTtcbiAgICAgICRzY29wZS5ub3RpZmljYXRpb25zSW5mby5udW1iZXIgPSAwO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgaiA9IHJlc3BvbnNlLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAvL2lmIChyZXNwb25zZVtpXS5tZW1iZXIgIT0gJHNjb3BlLm1lLmlkKSB7IC8vdW5jb21tZW50IHRvIGhpZGUgc2VsZi1ldmVudHNcbiAgICAgICAgaWYgKHJlc3BvbnNlW2ldLnVucmVhZC5pbmRleE9mKCRzY29wZS5tZS5pZCkgIT0gLTEpIHtcbiAgICAgICAgICAkc2NvcGUubm90aWZpY2F0aW9uc0luZm8ubnVtYmVyKys7XG5cbiAgICAgICAgICAkc2NvcGUubm90aWZpY2F0aW9ucy51bnNoaWZ0KHtcbiAgICAgICAgICAgIHBhdGg6IHJlc3BvbnNlW2ldLnRocmVhZC5yZXBsYWNlKFwiLVwiLCBcIi9cIiksXG4gICAgICAgICAgICB0ZXh0OiByZXNwb25zZVtpXS5kZXNjcmlwdGlvbiArIFwiIChcIiArICRzY29wZS50aW1lU2luY2UobmV3IERhdGUocmVzcG9uc2VbaV0ucG9zdGVkKSkrXCIpXCIsXG4gICAgICAgICAgICBtZW1iZXI6ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlW2ldLm1lbWJlciA9PSBvLmlkO1xuICAgICAgICAgICAgICAgICAgICB9KVswXS5mYWNlYm9vayxcbiAgICAgICAgICAgIGNvbG9yOiAocmVzcG9uc2VbaV0udW5yZWFkLmluZGV4T2YoJHNjb3BlLm1lLmlkKSAhPSAtMSA/IFwiTGlnaHRTa3lCbHVlXCIgOiBcIldoaXRlU21va2VcIilcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvL31cbiAgICAgIH1cblxuICAgICAgaWYgKCRzY29wZS5ub3RpZmljYXRpb25zSW5mby5udW1iZXIgPT0gMCkge1xuICAgICAgICAkc2NvcGUubm90aWZpY2F0aW9uc0luZm8udGV4dCA9IFwiIE5vIE5vdGlmaWNhdGlvbnNcIjtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAkc2NvcGUubm90aWZpY2F0aW9uc0luZm8udGV4dCA9IFwiIFwiICsgJHNjb3BlLm5vdGlmaWNhdGlvbnNJbmZvLm51bWJlciArIFwiIE5vdGlmaWNhdGlvblwiICsgKCRzY29wZS5ub3RpZmljYXRpb25zSW5mby5udW1iZXIgPiAxID8gXCJzXCIgOiBcIlwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS50aW1lU2luY2UgPWZ1bmN0aW9uIChkYXRlKSB7XG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIGRhdGUpIC8gMTAwMCk7XG5cbiAgICB2YXIgc3VmZml4ID0gJ2Fnbyc7XG4gICAgaWYoc2Vjb25kcyA8IDApe1xuICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHNlY29uZHMpO1xuICAgICAgc3VmZml4ID0gJ3RvIGdvJztcbiAgICB9XG5cbiAgICB2YXIgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzMTUzNjAwMCk7XG5cbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIHllYXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDI1OTIwMDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgbW9udGhzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGRheXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBob3VycyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtaW51dGVzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzKSArIFwiIHNlY29uZHMgXCIgKyBzdWZmaXg7XG4gIH07XG5cbiAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmdldFNwZWFrZXIgPSBmdW5jdGlvbiAoc3BlYWtlcklkKSB7XG4gICAgcmV0dXJuICRzY29wZS5zcGVha2Vycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gc3BlYWtlcklkO1xuICAgIH0pWzBdO1xuICB9O1xuXG4gICRzY29wZS5nZXRDb21wYW55ID0gZnVuY3Rpb24gKGNvbXBhbnlJZCkge1xuICAgIHJldHVybiAkc2NvcGUuY29tcGFuaWVzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5pZCA9PSBjb21wYW55SWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLmdldFRvcGljID0gZnVuY3Rpb24gKHRvcGljSWQpIHtcbiAgICByZXR1cm4gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uX2lkID09IHRvcGljSWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLnNob3cgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuZGlzcGxheSA9ICgkc2NvcGUuc2VhcmNoLm5hbWUgPyB0cnVlIDogZmFsc2UpO1xuICB9O1xuXG4gICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLmRpc3BsYXkgPSBmYWxzZTtcbiAgfTtcblxuICAkc2NvcGUuY29udmVydFVSTHMgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIHVybEV4cCA9IC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWc7XG4gICAgXG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykucmVwbGFjZSh1cmxFeHAsXCI8YSBocmVmPSckMSc+JDE8L2E+XCIpO1xuICB9XG5cbiAgJHNjb3BlLmNvbnZlcnROZXdMaW5lc1RvSHRtbCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICByZXR1cm4gJzxkaXYgZGF0YS1tYXJrZG93bj4nK3RleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykrJzwvZGl2Pic7XG4gIH1cblxuICAkc2NvcGUuY29udmVydE1hcmtkb3duVG9IdG1sID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHJldHVybiAnPGRpdiBkYXRhLW1hcmtkb3duPicgKyB0ZXh0ICsgJzwvZGl2Pic7XG4gIH1cblxufSk7XG4iLCJyZXF1aXJlKCcuL2xpc3QnKTtcbnJlcXVpcmUoJy4vbWVldGluZycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlci5jb250cm9sbGVyKCdNZWV0aW5nc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYXRpb24sIE1lZXRpbmdGYWN0b3J5KSB7XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUlOSVRJQUxJWkFUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgaW5pdCgpO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGlmICgkc2NvcGUubG9hZGluZykge1xuICAgICAgICBpbml0KCk7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG5cbiAgICBNZWV0aW5nRmFjdG9yeS5nZXRBbGwoZnVuY3Rpb24gKG1lZXRpbmdzKSB7XG4gICAgICAkc2NvcGUubWVldGluZ3MgPSBtZWV0aW5ncztcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUubWVldGluZ3MubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICRzY29wZS5tZWV0aW5nc1tpXS5mYWNlYm9vayA9ICRzY29wZS5tZW1iZXJzLmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICAgICAgcmV0dXJuICRzY29wZS5tZWV0aW5nc1tpXS5hdXRob3IgPT0gby5pZDtcbiAgICAgICAgfSlbMF0uZmFjZWJvb2s7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS50aW1lID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiAkc2NvcGUudGltZVNpbmNlKG5ldyBEYXRlKGRhdGUpKTtcbiAgfTtcblxuICAkc2NvcGUuY3JlYXRlTWVldGluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcblxuICAgIE1lZXRpbmdGYWN0b3J5LmNyZWF0ZSh7XG4gICAgICBhdXRob3I6ICRzY29wZS5tZS5pZCxcbiAgICAgIHRpdGxlOiBkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LVBUXCIpICsgXCIgLSBNZWV0aW5nXCIsXG4gICAgICBkYXRlOiBkYXRlXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL21lZXRpbmcvXCIgKyByZXNwb25zZS5pZCArIFwiL2VkaXRcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJNZWV0aW5nQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgTWVldGluZ0ZhY3RvcnksIFRvcGljRmFjdG9yeSkge1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1JTklUSUFMSVpBVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICRzY29wZS5raW5kcyA9IFtcIkluZm9cIiwgXCJUbyBkb1wiLCBcIkRlY2lzaW9uXCIsIFwiSWRlYVwiXTtcblxuICBNZWV0aW5nRmFjdG9yeS5nZXQoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbiAobWVldGluZykge1xuICAgICRzY29wZS5tZWV0aW5nID0gbWVldGluZztcblxuICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gIH0pO1xuXG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUZVTkNUSU9OUz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJHNjb3BlLnRvZ2dsZUF0dGVuZGFudCA9IGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICB2YXIgaW5kZXggPSAkc2NvcGUubWVldGluZy5hdHRlbmRhbnRzLmluZGV4T2YobWVtYmVyKTtcblxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICRzY29wZS5tZWV0aW5nLmF0dGVuZGFudHMucHVzaChtZW1iZXIpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICRzY29wZS5tZWV0aW5nLmF0dGVuZGFudHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnRvZ2dsZUF0dGVuZGFudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUubWVtYmVycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICRzY29wZS50b2dnbGVBdHRlbmRhbnQoJHNjb3BlLm1lbWJlcnNbaV0uaWQpO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuY3JlYXRlVG9waWMgPSBmdW5jdGlvbiAoa2luZCkge1xuICAgIHZhciB0b3BpYyA9IHtcbiAgICAgIGVkaXRpbmc6IHRydWUsXG4gICAgICBhdXRob3I6ICRzY29wZS5tZS5pZCxcbiAgICAgIHRleHQ6IFwiXCIsXG4gICAgICB0YXJnZXRzOiBbXSxcbiAgICAgIGtpbmQ6IGtpbmQsXG4gICAgICBjbG9zZWQ6IGZhbHNlLFxuICAgICAgcmVzdWx0OiBcIlwiLFxuICAgICAgcG9sbDoge1xuICAgICAgICBraW5kOiBcInRleHRcIixcbiAgICAgICAgb3B0aW9uczogW11cbiAgICAgIH0sXG4gICAgICBkdWVkYXRlOiBudWxsLFxuICAgICAgbWVldGluZ3M6IFskc2NvcGUubWVldGluZy5faWRdLFxuICAgICAgcm9vdDogbnVsbCxcbiAgICAgIHBvc3RlZDogbmV3IERhdGUoKVxuICAgIH07XG5cbiAgICBUb3BpY0ZhY3RvcnkuVG9waWMuY3JlYXRlKHRvcGljLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgIHRvcGljLl9pZCA9IHJlc3BvbnNlLmlkO1xuICAgICAgICAkc2NvcGUubWVldGluZy50b3BpY3MucHVzaCh0b3BpYyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmFkZFRvcGljID0gZnVuY3Rpb24gKHRvcGljSWQpIHtcbiAgICAkc2NvcGUuZGlzcGxheSA9IGZhbHNlO1xuXG4gICAgdmFyIHRvcGljID0gJHNjb3BlLnRvcGljcy5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiBvLl9pZCA9PT0gdG9waWNJZDtcbiAgICB9KVswXTtcblxuICAgICRzY29wZS5tZWV0aW5nLnRvcGljcy5wdXNoKHRvcGljKTtcblxuICAgIHRvcGljLm1lZXRpbmdzLnB1c2goJHNjb3BlLm1lZXRpbmcuX2lkKTtcbiAgICBUb3BpY0ZhY3RvcnkuVG9waWMudXBkYXRlKHtpZDogdG9waWMuX2lkfSwgdG9waWMpO1xuICB9O1xuXG4gICRzY29wZS5yZW1vdmVUb3BpYyA9IGZ1bmN0aW9uICh0b3BpYykge1xuICAgICRzY29wZS5tZWV0aW5nLnRvcGljcy5zcGxpY2UoJHNjb3BlLm1lZXRpbmcudG9waWNzLmluZGV4T2YodG9waWMpLCAxKTtcblxuICAgIHRvcGljLm1lZXRpbmdzLnNwbGljZSh0b3BpYy5tZWV0aW5ncy5pbmRleE9mKCRzY29wZS5tZWV0aW5nLl9pZCksIDEpO1xuICAgIFRvcGljRmFjdG9yeS5Ub3BpYy51cGRhdGUoe2lkOiB0b3BpYy5faWR9LCB0b3BpYyk7XG4gIH07XG5cbiAgJHNjb3BlLnNhdmVNZWV0aW5nID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5zdWNjZXNzID0gXCJcIjtcbiAgICAkc2NvcGUuZXJyb3IgICA9IFwiXCI7XG5cbiAgICBpZiAoISRzY29wZS5tZWV0aW5nLnRpdGxlKXtcbiAgICAgICRzY29wZS5lcnJvciA9IFwiUGxlYXNlIGVudGVyIGEgdGl0bGUuXCI7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgTWVldGluZ0ZhY3RvcnkudXBkYXRlKHtpZDogJHNjb3BlLm1lZXRpbmcuX2lkfSwgJHNjb3BlLm1lZXRpbmcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIjtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgJHNjb3BlLnN1Y2Nlc3MgPSByZXNwb25zZS5zdWNjZXNzO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5kZWxldGVNZWV0aW5nID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIG1lZXRpbmc/XCIpKSB7XG4gICAgICBNZWV0aW5nRmFjdG9yeS5kZWxldGUoe2lkOiAkc2NvcGUubWVldGluZy5faWR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIlRoZXJlIHdhcyBhbiBlcnJvci4gUGxlYXNlIGNvbnRhY3QgdGhlIERldiBUZWFtIGFuZCBnaXZlIHRoZW0gdGhlIGRldGFpbHMgYWJvdXQgdGhlIGVycm9yLlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL21lZXRpbmdzL1wiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5kaXNwbGF5ID0gKCRzY29wZS5zZWFyY2hUb3BpYyA/IHRydWUgOiBmYWxzZSk7XG4gIH07XG5cbiAgJHNjb3BlLmFscmVhZHlJbk1lZXRpbmdGaWx0ZXIgPSBmdW5jdGlvbiAodG9waWMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5tZWV0aW5nLnRvcGljcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCRzY29wZS5tZWV0aW5nLnRvcGljc1tpXS5faWQgPT09IHRvcGljLl9pZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG59KTtcbiIsInJlcXVpcmUoJy4vbWVtYmVyLmpzJyk7XG5yZXF1aXJlKCcuL2xpc3QuanMnKTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdNZW1iZXJzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkc2NlLCBNZW1iZXJGYWN0b3J5KSB7XG4gICAgJHNjb3BlLnRydXN0U3JjID0gZnVuY3Rpb24oc3JjKSB7XG4gICAgICByZXR1cm4gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoc3JjKTtcbiAgICB9XG5cbiAgICBNZW1iZXJGYWN0b3J5Lk1lbWJlci5nZXRBbGwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5wcmVkaWNhdGUgPSAnbmFtZSc7XG4gICAgICAkc2NvcGUucmV2ZXJzZSA9IGZhbHNlO1xuICAgICAgJHNjb3BlLm1lbWJlcnMgPSByZXNwb25zZTtcbiAgICB9KTtcbiAgfSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcbiBcbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdNZW1iZXJDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgJGxvY2F0aW9uLCBNZW1iZXJGYWN0b3J5KSB7XG4gICAgJHNjb3BlLmdldENsYXNzRnJvbUtpbmQgPSBmdW5jdGlvbihwYXJ0aWNpcGF0aW9uKSB7XG4gICAgICBpZighcGFydGljaXBhdGlvbikgeyByZXR1cm4gXCJub3BlXCI7IH1cbiAgICAgIGlmKCFwYXJ0aWNpcGF0aW9uLmtpbmQpIHsgcmV0dXJuIFwic3BvbnNvclwiOyB9XG4gICAgICB2YXIga2luZCA9IHBhcnRpY2lwYXRpb24ua2luZC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZihraW5kLmluZGV4T2YoXCJicm9uemVcIikgIT0gLTEpIHsgcmV0dXJuIFwiYnJvbnplXCI7IH0gXG4gICAgICBlbHNlIGlmKGtpbmQuaW5kZXhPZihcInByYXRhXCIpICE9IC0xKSB7IHJldHVybiBcInNpbHZlclwiOyB9XG4gICAgICBlbHNlIHsgcmV0dXJuIFwic3BvbnNvclwiOyB9XG4gICAgfVxuXG4gICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgIFxuICAgIE1lbWJlckZhY3RvcnkuTWVtYmVyLmdldCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBpZigkcm91dGVQYXJhbXMuaWQgPT0gXCJtZVwiKSB7XG4gICAgICAgIHZhciBuZXdQYXRoID0gXCIvbWVtYmVyL1wiK3Jlc3BvbnNlLmlkO1xuICAgICAgICBjb25zb2xlLmxvZyhcImdvaW5nIHRvXCIsIG5ld1BhdGgpO1xuICAgICAgICAkbG9jYXRpb24ucGF0aChuZXdQYXRoKTsgICAgICAgIFxuICAgICAgfVxuICAgICAgJHNjb3BlLm1lbWJlciA9IHJlc3BvbnNlO1xuXG4gICAgICBnZXRNZW1iZXJTdHVmZigpO1xuICAgIH0pO1xuXG4gICAgXG4gICAgZnVuY3Rpb24gZ2V0TWVtYmVyU3R1ZmYoKSB7XG4gICAgICAkc2NvcGUubWVtYmVyLmNvbXBhbmllcyA9ICRzY29wZS5jb21wYW5pZXMuZmlsdGVyKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcmV0dXJuIGUubWVtYmVyID09ICRzY29wZS5tZW1iZXIuaWQ7XG4gICAgICB9KVxuXG4gICAgICAkc2NvcGUubWVtYmVyLnNwZWFrZXJzID0gJHNjb3BlLnNwZWFrZXJzLmZpbHRlcihmdW5jdGlvbihlKSB7XG4gICAgICAgIHJldHVybiBlLm1lbWJlciA9PSAkc2NvcGUubWVtYmVyLmlkO1xuICAgICAgfSlcblxuICAgICAgJHNjb3BlLm1lbWJlci5jb21tZW50cyA9ICRzY29wZS5jb21tZW50cy5maWx0ZXIoZnVuY3Rpb24oZSkge1xuICAgICAgICByZXR1cm4gZS5tZW1iZXIgPT0gJHNjb3BlLm1lbWJlci5pZDtcbiAgICAgIH0pXG5cbiAgICAgIGlmKCRzY29wZS5jb21wYW5pZXMubGVuZ3RoID4gMCAmJiAkc2NvcGUuc3BlYWtlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0VGltZW91dChnZXRNZW1iZXJTdHVmZiwgMTAwMCk7XG4gICAgICB9XG4gICAgfVxuXG4gIH0pOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignTWVzc2FnZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCBTb2NrZXRGYWN0b3J5LCBNZXNzYWdlRmFjdG9yeSwgQ2hhdEZhY3RvcnksIE1lbWJlckZhY3RvcnkpIHtcblxuICAkc2NvcGUuZXJyb3IgPSB7fTtcblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICRzY29wZS5tZXNzYWdlcyA9IFtdO1xuXG4gLyogc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICBDaGF0RmFjdG9yeS5NZXNzYWdlcy5nZXQoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZigkc2NvcGUubWVzc2FnZXMubGVuZ3RoIDwgcmVzcG9uc2UubGVuZ3RoKXtcbiAgICAgICAgICBmb3IodmFyIGk9ICRzY29wZS5tZXNzYWdlcy5sZW5ndGg7IGkgPCByZXNwb25zZS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZXNbaV0gPSByZXNwb25zZVtpXTtcbiAgICAgICAgICB9ICBcbiAgICAgICAgfSBcbiAgICAgIH1cbiAgICB9KTtcbiAgfSw0MDAwKTsqL1xuXG4gIFNvY2tldEZhY3RvcnkuZW1pdCgnYXV0aCcsIHtpZDogJHJvdXRlUGFyYW1zLmlkLCB1c2VyOiAkc2NvcGUubWUuaWR9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBjb25zb2xlLmxvZygnQXV0aCBzdWNjZXNzJyk7XG4gICAgICAkc2NvcGUuY2hhdCAgICAgPSByZXN1bHQuY2hhdERhdGE7XG4gICAgICAkc2NvcGUubWVzc2FnZXMgPSByZXN1bHQubWVzc2FnZXM7XG4gICAgICAkc2NvcGUucm9vbSAgICAgPSByZXN1bHQucm9vbTtcbiAgfSk7XG5cbiAgU29ja2V0RmFjdG9yeS5vbignbWVzc2FnZScsIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgJHNjb3BlLm1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG4gIH0pO1xuXG4gICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoJHNjb3BlLm1lc3NhZ2VUZXh0ID09IFwiXCIpe1xuICAgICAgLy8kc2NvcGUuZW1wdHkgPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBtZXNzYWdlRGF0YSA9IHtcbiAgICAgIHRleHQgICA6ICRzY29wZS50ZXh0LFxuICAgICAgY2hhdElkIDogJHJvdXRlUGFyYW1zLmlkLFxuICAgICAgbWVtYmVyIDogJHNjb3BlLm1lLmlkLFxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhtZXNzYWdlRGF0YSk7XG5cbiAgICBTb2NrZXRGYWN0b3J5LmVtaXQoJ3NlbmQnLCB7cm9vbTogJHNjb3BlLnJvb20sIG1lc3NhZ2U6IG1lc3NhZ2VEYXRhIH0sIGZ1bmN0aW9uKCkge2NvbnNvbGUubG9nKCdlbWl0ZWQnKX0pO1xuICAgIC8qTWVzc2FnZUZhY3RvcnkuY3JlYXRlKG1lc3NhZ2VEYXRhLCBmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lc3NhZ2VEYXRhLmlkID0gcmVzcG9uc2UubWVzc2FnZUlkO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2VEYXRhLmlkKTtcbiAgICAgICAgQ2hhdEZhY3RvcnkuQ2hhdC51cGRhdGUoeyBpZDokcm91dGVQYXJhbXMuaWQgfSwge21lc3NhZ2U6bWVzc2FnZURhdGEuaWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIC8vIGlmIHN1Y2Nlc3NmdWwsIHdlJ2xsIG5lZWQgdG8gcmVmcmVzaCB0aGUgY2hhdCBsaXN0XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuXG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUuY2hhdCA9IHJlc3BvbnNlLm1lc3NhZ2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTsqL1xuICB9O1xufSk7XG4iLCJyZXF1aXJlKCcuL2NyZWF0ZScpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignU3BlYWtlckVtYWlsQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsICRsb2NhdGlvbiwgRW1haWxGYWN0b3J5KSB7XG4gICAgJHNjb3BlLmVtYWlsID0gJGxvY2F0aW9uLnNlYXJjaCgpLmVtYWlsO1xuICAgICRzY29wZS5zcGVha2VySWQgPSAkcm91dGVQYXJhbXMuaWQ7XG4gICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuICAgICRzY29wZS5tZXNzYWdlID0gbnVsbDtcblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgICAkc2NvcGUubWVzc2FnZSA9IG51bGw7XG5cbiAgICAgIGNvbnNvbGUubG9nKFwic2VuZCBlbWFpbCB0byBcIiwgJHNjb3BlLmVtYWlsLCBcIiBmcm9tIFwiLCAkc2NvcGUuc3BlYWtlcklkKTtcblxuICAgICAgRW1haWxGYWN0b3J5LlNwZWFrZXIuc2VuZCh7IGlkOiAkc2NvcGUuc3BlYWtlcklkIH0sIHsgZW1haWw6ICRzY29wZS5lbWFpbCB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG4gXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignQ3JlYXRlU3BlYWtlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCBTcGVha2VyRmFjdG9yeSwgTWVtYmVyRmFjdG9yeSkge1xuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzcGVha2VyRGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIuY3JlYXRlKHNwZWFrZXJEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIE1lbWJlckZhY3RvcnkuTWVtYmVyLmdldEFsbCggZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5tZW1iZXJzID0gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH0pOyIsInJlcXVpcmUoJy4vc3BlYWtlci5qcycpO1xucmVxdWlyZSgnLi9saXN0LmpzJyk7XG5yZXF1aXJlKCcuL2NyZWF0ZS5qcycpO1xucmVxdWlyZSgnLi9jb25maXJtLmpzJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdTcGVha2Vyc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHNjZSwgU3BlYWtlckZhY3RvcnksIE1lbWJlckZhY3RvcnkpIHtcbiAgICAkc2NvcGUudHJ1c3RTcmMgPSBmdW5jdGlvbihzcmMpIHtcbiAgICAgIHJldHVybiAkc2NlLnRydXN0QXNSZXNvdXJjZVVybChzcmMpO1xuICAgIH1cblxuICAgICRzY29wZS5nZXRDbGFzc0Zyb21LaW5kID0gZnVuY3Rpb24oc3RhdHVzKSB7XG4gICAgICBpZighc3RhdHVzKSB7IHJldHVybiBcInN1Z2dlc3Rpb25cIjsgfVxuICAgICAgdmFyIGtpbmQgPSBzdGF0dXMudG9Mb3dlckNhc2UoKTtcblxuICAgICAgaWYoa2luZC5pbmRleE9mKFwiY29udGFjdGFkb1wiKSAhPSAtMSkgeyByZXR1cm4gXCJjb250YWN0ZWRcIjsgfSBcbiAgICAgIGVsc2UgaWYoa2luZC5pbmRleE9mKFwiYWNlaXRvdVwiKSAhPSAtMSkgeyByZXR1cm4gXCJhY2NlcHRlZFwiOyB9XG4gICAgICBlbHNlIGlmKGtpbmQuaW5kZXhPZihcInJlamVpdG91XCIpICE9IC0xKSB7IHJldHVybiBcInJlamVjdGVkXCI7IH1cbiAgICAgIGVsc2UgaWYoa2luZC5pbmRleE9mKFwiY29udmVyc2HDp8O1ZXNcIikgIT0gLTEpIHsgcmV0dXJuIFwiY29udmVyc2F0aW9uc1wiOyB9XG4gICAgICBlbHNlIGlmKGtpbmQuaW5kZXhPZihcImRlc2lzdGlyXCIpICE9IC0xKSB7IHJldHVybiBcImdpdmV1cFwiOyB9XG4gICAgICBlbHNlIHsgcmV0dXJuIFwic3VnZ2VzdGlvblwiOyB9XG4gICAgfVxuXG4gICAgU3BlYWtlckZhY3RvcnkuU3BlYWtlci5nZXRBbGwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5wcmVkaWNhdGUgPSAncGFydGljaXBhdGlvbic7XG4gICAgICAkc2NvcGUucmV2ZXJzZSA9IGZhbHNlO1xuICAgICAgJHNjb3BlLnNwZWFrZXJzID0gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH0pO1xuICAiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdTcGVha2VyQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsIFNwZWFrZXJGYWN0b3J5LCBNZW1iZXJGYWN0b3J5LCBOb3RpZmljYXRpb25GYWN0b3J5KSB7XG4gICAgJHNjb3BlLnRydXN0U3JjID0gZnVuY3Rpb24oc3JjKSB7XG4gICAgICByZXR1cm4gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoc3JjKycjcGFnZS1ib2R5Jyk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmNvbnZlcnRFbWFpbHMgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICB2YXIgbWFpbEV4cCA9IC9bXFx3XFwuXFwtXStcXEAoW1xcd1xcLV0rXFwuKStbXFx3XXsyLDR9KD8hW148XSo+KS9pZztcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UobWFpbEV4cCxcIjxhIGhyZWY9Jy9hcGkvc3BlYWtlci9cIiskcm91dGVQYXJhbXMuaWQrXCIvc2VuZEluaXRpYWxFbWFpbCcgdGFyZ2V0PSdfYmxhbmsnPiQmPC9hPlwiKVxuICAgIH1cblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzcGVha2VyRGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICAgIFNwZWFrZXJGYWN0b3J5LlNwZWFrZXIudXBkYXRlKHsgaWQ6c3BlYWtlckRhdGEuaWQgfSwgc3BlYWtlckRhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5zdWNjZXNzO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnN0YXR1c2VzID0gWydTVUdHRVNUSU9OJywnQ09OVEFDVEVEJywnSU4gQ09OVkVSU0FUSU9OUycsJ0FDQ0VQVEVEJywnQ0xPU0VEIERFQUwnLCdSRUpFQ1RFRC9HSVZFIFVQJ107XG5cbiAgICAkc2NvcGUuc3BlYWtlciA9ICRzY29wZS5mb3JtRGF0YSA9ICRzY29wZS5nZXRTcGVha2VyKCRyb3V0ZVBhcmFtcy5pZCk7XG5cbiAgICBTcGVha2VyRmFjdG9yeS5TcGVha2VyLmdldCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuc3BlYWtlciA9ICRzY29wZS5mb3JtRGF0YSA9IHJlc3BvbnNlO1xuXG4gICAgICBOb3RpZmljYXRpb25GYWN0b3J5LlNwZWFrZXIuZ2V0QWxsKHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24oZ2V0RGF0YSkge1xuICAgICAgICAkc2NvcGUuc3BlYWtlci5ub3RpZmljYXRpb25zID0gZ2V0RGF0YTtcblxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgfSk7XG4iLCJyZXF1aXJlKCcuL21hbmFnZXInKTsiLCJcInVzZSBzdHJpY3RcIjtcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcihcIlRhZ01hbmFnZXJDb250cm9sbGVyXCIsIGZ1bmN0aW9uICgkc2NvcGUsIFRhZ0ZhY3RvcnkpIHtcblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgJHNjb3BlLm5ld1RhZyA9IHt9O1xuXG4gICRzY29wZS5saWdodENvbG9ycyA9IFtcIiNmN2M2YzdcIiwgXCIjZmFkOGM3XCIsIFwiI2ZlZjJjMFwiLCBcIiNiZmU1YmZcIiwgXCIjYmZkYWRjXCIsIFwiI2M3ZGVmOFwiLCBcIiNiZmQ0ZjJcIiwgXCIjZDRjNWY5XCJdO1xuICAkc2NvcGUuY29sb3JzID0gW1wiI2UxMWQyMVwiLCBcIiNlYjY0MjBcIiwgXCIjZmJjYTA0XCIsIFwiIzAwOTgwMFwiLCBcIiMwMDZiNzVcIiwgXCIjMjA3ZGU1XCIsIFwiIzAwNTJjY1wiLCBcIiM1MzE5ZTdcIl07XG5cbiAgJHNjb3BlLmNoYW5nZUNvbG9yID0gZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgJHNjb3BlLm5ld1RhZy5jb2xvciA9IGNvbG9yO1xuICB9O1xuXG4gICRzY29wZS5jcmVhdGVUYWcgPSBmdW5jdGlvbiAobmV3VGFnKSB7XG5cbiAgICBUYWdGYWN0b3J5LlRhZy5jcmVhdGUobmV3VGFnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICRzY29wZS50YWdzLnB1c2gocmVzcG9uc2UudGFnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuZGVsZXRlVGFnID0gZnVuY3Rpb24gKHRhZykge1xuXG4gICAgVGFnRmFjdG9yeS5UYWcuZGVsZXRlKHtpZDogdGFnLmlkfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICB2YXIgaW5kZXggPSAkc2NvcGUudGFncy5pbmRleE9mKHRhZyk7XG4gICAgICAgICRzY29wZS50YWdzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnRoZVRvb2xDb250cm9sbGVyLmNvbnRyb2xsZXIoXCJUb3BpY0VtYmVkQ29udHJvbGxlclwiLCBmdW5jdGlvbiAoJHNjb3BlLCBUb3BpY0ZhY3RvcnkpIHtcblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAkc2NvcGUuc3VjY2VzcyAgICAgPSBcIlwiO1xuICAkc2NvcGUuZXJyb3IgICAgICAgPSBcIlwiO1xuICAkc2NvcGUuc2hvd1RhcmdldHMgPSBmYWxzZTtcblxuICAkc2NvcGUucG9sbEtpbmRzID0gWyd0ZXh0JywgJ2ltYWdlcyddO1xuXG4gICRzY29wZS5tZSA9IEpTT04ucGFyc2UoJHNjb3BlLm1lSnNvbik7XG4gICRzY29wZS5tZW1iZXJzID0gSlNPTi5wYXJzZSgkc2NvcGUubWVtYmVyc0pzb24pO1xuICAkc2NvcGUucm9sZXMgPSBKU09OLnBhcnNlKCRzY29wZS5yb2xlc0pzb24pO1xuXG4gIGlmKCRzY29wZS5jb21tZW50cykge1xuICAgICRzY29wZS50b3BpYy5jb21tZW50cyA9ICRzY29wZS5jb21tZW50cy5maWx0ZXIoZnVuY3Rpb24oZSkge1xuICAgICAgcmV0dXJuIGUudGhyZWFkID09ICd0b3BpYy0nKyRzY29wZS50b3BpYy5faWQ7XG4gICAgfSlcbiAgfVxuXG4gIHNob3coJHNjb3BlLnRvcGljKTtcblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09QVVYRlVOQ1RJT05TPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIHNob3codG9waWMpIHtcbiAgICB0b3BpYy5zaG93ID0ge1xuICAgICAgdGV4dCAgICAgOiB0cnVlLFxuICAgICAgdGFyZ2V0cyAgOiB0cnVlLFxuICAgICAgcG9sbCAgICAgOiBmYWxzZSxcbiAgICAgIGR1ZWRhdGUgIDogZmFsc2UsXG4gICAgICBtZWV0aW5nICA6IHRydWUsXG4gICAgICBjbG9zZWQgICA6IGZhbHNlXG4gICAgfTtcblxuICAgIGlmICh0b3BpYy5raW5kID09PSAnVG8gZG8nKSB7XG4gICAgICB0b3BpYy5zaG93LmR1ZWRhdGUgPSB0cnVlO1xuICAgICAgdG9waWMuc2hvdy5jbG9zZWQgID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAodG9waWMua2luZCA9PT0gJ0RlY2lzaW9uJykge1xuICAgICAgdG9waWMuc2hvdy5kdWVkYXRlID0gdHJ1ZTtcbiAgICAgIHRvcGljLnNob3cuY2xvc2VkICA9IHRydWU7XG4gICAgICB0b3BpYy5zaG93LnBvbGwgPSB0cnVlO1xuICAgIH1cblxuICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gIH1cblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS5kZWxldGVUb3BpYyA9IGZ1bmN0aW9uKHRvcGljKSB7XG4gICAgdmFyIGFuc3dlciA9IGNvbmZpcm0oXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgdG9waWM/XCIpO1xuICAgIGlmIChhbnN3ZXIpIHtcbiAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5kZWxldGUoe2lkOiB0b3BpYy5faWR9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRvcGljLmRlbGV0ZWQgPSB0cnVlO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS50b2dnbGVUYWcgPSBmdW5jdGlvbih0YWcpIHtcbiAgICB2YXIgaW5kZXggPSAkc2NvcGUudG9waWMudGFncy5pbmRleE9mKHRhZyk7XG5cbiAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICRzY29wZS50b3BpYy50YWdzLnB1c2godGFnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkc2NvcGUudG9waWMudGFncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUudG9nZ2xlVGFyZ2V0ID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgdmFyIGluZGV4ID0gJHNjb3BlLnRvcGljLnRhcmdldHMuaW5kZXhPZih0YXJnZXQpO1xuXG4gICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAkc2NvcGUudG9waWMudGFyZ2V0cy5wdXNoKHRhcmdldCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgJHNjb3BlLnRvcGljLnRhcmdldHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnRvZ2dsZUFsbFRhcmdldHMgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS5tZW1iZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgJHNjb3BlLnRvZ2dsZVRhcmdldCgkc2NvcGUubWVtYmVyc1tpXS5pZCk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS50b2dnbGVSb2xlVGFyZ2V0cyA9IGZ1bmN0aW9uKHJvbGVJZCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLm1lbWJlcnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICBmb3IodmFyIG8gPSAwOyBvIDwgJHNjb3BlLm1lbWJlcnNbaV0ucm9sZXMubGVuZ3RoOyBvKyspIHtcbiAgICAgICAgaWYoJHNjb3BlLm1lbWJlcnNbaV0ucm9sZXNbb10uaWQgPT0gcm9sZUlkKSB7XG4gICAgICAgICAgJHNjb3BlLnRvZ2dsZVRhcmdldCgkc2NvcGUubWVtYmVyc1tpXS5pZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLnRvZ2dsZVRhcmdldHMgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUuc2hvd1RhcmdldHMpO1xuICAgICRzY29wZS5zaG93VGFyZ2V0cyA9ICEkc2NvcGUuc2hvd1RhcmdldHM7XG4gIH07XG5cbiAgJHNjb3BlLmZvY3VzT3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUudG9waWMucG9sbC5vcHRpb25zLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgJHNjb3BlLnRvcGljLnBvbGwub3B0aW9uc1tpXS5lZGl0aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgb3B0aW9uLmVkaXRpbmcgPSB0cnVlO1xuICB9O1xuXG4gICRzY29wZS5hZGRPcHRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3B0aW9uID0ge1xuICAgICAgb3B0aW9uVHlwZTogXCJJbmZvXCIsXG4gICAgICB0YXJnZXRzOiBbXVxuICAgIH07XG5cbiAgICAkc2NvcGUudG9waWMucG9sbC5vcHRpb25zLnB1c2gob3B0aW9uKTtcblxuICAgICRzY29wZS5mb2N1c09wdGlvbihvcHRpb24pO1xuICB9O1xuXG4gICRzY29wZS5yZW1vdmVPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAkc2NvcGUudG9waWMucG9sbC5vcHRpb25zLnNwbGljZSgkc2NvcGUudG9waWMucG9sbC5vcHRpb25zLmluZGV4T2Yob3B0aW9uKSwgMSk7XG4gIH07XG5cbiAgdGhpcy5zZWxlY3RPcHRpb24gPSBmdW5jdGlvbih0b3BpYywgb3B0aW9uKSB7XG4gICAgdmFyIHVwZGF0ZWRUb3BpYyA9IHRvcGljO1xuXG4gICAgaWYob3B0aW9uLnZvdGVzLmluZGV4T2YoJHNjb3BlLm1lLmlkKSAhPSAtMSkge1xuICAgICAgdXBkYXRlZFRvcGljLnBvbGwub3B0aW9uc1t1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zLmluZGV4T2Yob3B0aW9uKV0udm90ZXMuc3BsaWNlKHVwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnNbdXBkYXRlZFRvcGljLnBvbGwub3B0aW9ucy5pbmRleE9mKG9wdGlvbildLnZvdGVzLmluZGV4T2YoJHNjb3BlLm1lLmlkKSwxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXBkYXRlZFRvcGljLnBvbGwub3B0aW9uc1t1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zLmluZGV4T2Yob3B0aW9uKV0udm90ZXMucHVzaCgkc2NvcGUubWUuaWQpO1xuICAgIH1cblxuICAgIFRvcGljRmFjdG9yeS5Ub3BpYy51cGRhdGUoe2lkOiB1cGRhdGVkVG9waWMuX2lkfSwgdXBkYXRlZFRvcGljLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIik7XG4gICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3VjY2Vzcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbih0b3BpYykge1xuICAgICRzY29wZS5zdWNjZXNzID0gXCJcIjtcbiAgICAkc2NvcGUuZXJyb3IgICA9IFwiXCI7XG5cbiAgICBpZih0b3BpYy5faWQpIHtcbiAgICAgIFRvcGljRmFjdG9yeS5Ub3BpYy51cGRhdGUoe2lkOiB0b3BpYy5faWR9LCAkc2NvcGUudG9waWMsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gXCJUaGVyZSB3YXMgYW4gZXJyb3IuIFBsZWFzZSBjb250YWN0IHRoZSBEZXYgVGVhbSBhbmQgZ2l2ZSB0aGVtIHRoZSBkZXRhaWxzIGFib3V0IHRoZSBlcnJvci5cIjtcbiAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgJHNjb3BlLnN1Y2Nlc3MgPSByZXNwb25zZS5zdWNjZXNzO1xuICAgICAgICAgICRzY29wZS50b3BpYy5lZGl0aW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBUb3BpY0ZhY3RvcnkuVG9waWMuY3JlYXRlKHRvcGljLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IFwiVGhlcmUgd2FzIGFuIGVycm9yLiBQbGVhc2UgY29udGFjdCB0aGUgRGV2IFRlYW0gYW5kIGdpdmUgdGhlbSB0aGUgZGV0YWlscyBhYm91dCB0aGUgZXJyb3IuXCI7XG4gICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICRzY29wZS5zdWNjZXNzID0gcmVzcG9uc2Uuc3VjY2VzcztcbiAgICAgICAgICAkc2NvcGUudG9waWMuZWRpdGluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLmdldE1lbWJlciA9IGZ1bmN0aW9uIChtZW1iZXJJZCkge1xuICAgIHJldHVybiAkc2NvcGUubWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uaWQgPT0gbWVtYmVySWQ7XG4gICAgfSlbMF07XG4gIH07XG5cbiAgJHNjb3BlLnRvZ2dsZVRhcmdldCA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgIHZhciBpbmRleCA9ICRzY29wZS50b3BpYy50YXJnZXRzLmluZGV4T2YodGFyZ2V0KTtcblxuICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgJHNjb3BlLnRvcGljLnRhcmdldHMucHVzaCh0YXJnZXQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICRzY29wZS50b3BpYy50YXJnZXRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS50b2dnbGVBbGxUYXJnZXRzID0gZnVuY3Rpb24oKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAkc2NvcGUubWVtYmVycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICRzY29wZS50b2dnbGVUYXJnZXQoJHNjb3BlLm1lbWJlcnNbaV0uaWQpO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUudG9nZ2xlUm9sZVRhcmdldHMgPSBmdW5jdGlvbihyb2xlSWQpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS5tZW1iZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgZm9yKHZhciBvID0gMDsgbyA8ICRzY29wZS5tZW1iZXJzW2ldLnJvbGVzLmxlbmd0aDsgbysrKSB7XG4gICAgICAgIGlmKCRzY29wZS5tZW1iZXJzW2ldLnJvbGVzW29dLmlkID09IHJvbGVJZCkge1xuICAgICAgICAgICRzY29wZS50b2dnbGVUYXJnZXQoJHNjb3BlLm1lbWJlcnNbaV0uaWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gICRzY29wZS50b2dnbGVUYXJnZXRzID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLnNob3dUYXJnZXRzKTtcbiAgICAkc2NvcGUuc2hvd1RhcmdldHMgPSAhJHNjb3BlLnNob3dUYXJnZXRzO1xuICB9O1xuXG4gICRzY29wZS5mb2N1c09wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gJHNjb3BlLnRvcGljLnBvbGwub3B0aW9ucy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICRzY29wZS50b3BpYy5wb2xsLm9wdGlvbnNbaV0uZWRpdGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIG9wdGlvbi5lZGl0aW5nID0gdHJ1ZTtcbiAgfTtcblxuICAkc2NvcGUuc2VsZWN0T3B0aW9uID0gZnVuY3Rpb24odG9waWMsIG9wdGlvbikge1xuICAgIGNvbnNvbGUubG9nKFwiU2VsZWN0XCIsIG9wdGlvbik7XG4gICAgdmFyIHVwZGF0ZWRUb3BpYyA9IHRvcGljO1xuXG4gICAgaWYob3B0aW9uLnZvdGVzLmluZGV4T2YoJHNjb3BlLm1lLmlkKSAhPSAtMSkge1xuICAgICAgdXBkYXRlZFRvcGljLnBvbGwub3B0aW9uc1t1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zLmluZGV4T2Yob3B0aW9uKV0udm90ZXMuc3BsaWNlKHVwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnNbdXBkYXRlZFRvcGljLnBvbGwub3B0aW9ucy5pbmRleE9mKG9wdGlvbildLnZvdGVzLmluZGV4T2YoJHNjb3BlLm1lLmlkKSwxKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB1cGRhdGVkVG9waWMucG9sbC5vcHRpb25zW3VwZGF0ZWRUb3BpYy5wb2xsLm9wdGlvbnMuaW5kZXhPZihvcHRpb24pXS52b3Rlcy5wdXNoKCRzY29wZS5tZS5pZCk7XG4gICAgfVxuXG4gICAgVG9waWNGYWN0b3J5LlRvcGljLnVwZGF0ZSh7aWQ6IHVwZGF0ZWRUb3BpYy5faWR9LCB1cGRhdGVkVG9waWMsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlRoZXJlIHdhcyBhbiBlcnJvci4gUGxlYXNlIGNvbnRhY3QgdGhlIERldiBUZWFtIGFuZCBnaXZlIHRoZW0gdGhlIGRldGFpbHMgYWJvdXQgdGhlIGVycm9yLlwiKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3VjY2Vzcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLnRpbWVTaW5jZSA9ZnVuY3Rpb24gKGRhdGUpIHtcbiAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgdmFyIHNlY29uZHMgPSBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gZGF0ZSkgLyAxMDAwKTtcblxuICAgIHZhciBzdWZmaXggPSAnYWdvJztcbiAgICBpZihzZWNvbmRzIDwgMCl7XG4gICAgICBzZWNvbmRzID0gTWF0aC5hYnMoc2Vjb25kcyk7XG4gICAgICBzdWZmaXggPSAndG8gZ28nO1xuICAgIH1cblxuICAgIHZhciBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDMxNTM2MDAwKTtcblxuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgeWVhcnMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMjU5MjAwMCk7XG4gICAgaWYgKGludGVydmFsID4gMSkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWwgKyBcIiBtb250aHMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIGludGVydmFsID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gODY0MDApO1xuICAgIGlmIChpbnRlcnZhbCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsICsgXCIgZGF5cyBcIiArIHN1ZmZpeDtcbiAgICB9XG4gICAgaW50ZXJ2YWwgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIGhvdXJzIFwiICsgc3VmZml4O1xuICAgIH1cbiAgICBpbnRlcnZhbCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICBpZiAoaW50ZXJ2YWwgPiAxKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCArIFwiIG1pbnV0ZXMgXCIgKyBzdWZmaXg7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLmZsb29yKHNlY29uZHMpICsgXCIgc2Vjb25kcyBcIiArIHN1ZmZpeDtcbiAgfTtcblxufSk7XG4iLCJyZXF1aXJlKCcuL2xpc3QnKTtcbnJlcXVpcmUoJy4vdG9waWMnKTtcbnJlcXVpcmUoJy4vZW1iZWQnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignVG9waWNzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCBUb3BpY0ZhY3RvcnkpIHtcblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09SU5JVElBTElaQVRJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGlmKCRsb2NhdGlvbi5wYXRoKCkgIT0gJy90b3BpY3MnICYmICRyb3V0ZVBhcmFtcy5pZCA9PSBcIm1lXCIpIHtcbiAgICAkbG9jYXRpb24ucGF0aCgnL3RvcGljcy8nICsgJHNjb3BlLm1lLmlkKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgJHNjb3BlLmtpbmRzID0gW1wiSW5mb1wiLCBcIlRvIGRvXCIsIFwiRGVjaXNpb25cIiwgXCJJZGVhXCJdO1xuXG4gIGlmICgkbG9jYXRpb24ucGF0aCgpID09ICcvdG9waWNzJykge1xuICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5nZXRBbGwoZ290VG9waWNzKTtcbiAgfVxuICBlbHNlIHtcbiAgICBUb3BpY0ZhY3RvcnkuTWVtYmVyLmdldEFsbCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGdvdFRvcGljcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnb3RUb3BpY3MgKHRvcGljcykge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCRzY29wZS5sb2FkaW5nKVxuICAgICAgICBnb3RUb3BpY3ModG9waWNzKTtcbiAgICB9LCAxMDAwKTtcblxuICAgICRzY29wZS50b3BpY3MgPSB0b3BpY3M7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaiA9ICRzY29wZS50b3BpY3MubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAkc2NvcGUudG9waWNzW2ldLmZhY2Vib29rID0gJHNjb3BlLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgcmV0dXJuICRzY29wZS50b3BpY3NbaV0uYXV0aG9yID09IG8uaWQ7XG4gICAgICB9KVswXS5mYWNlYm9vaztcbiAgICB9XG5cbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgJHNjb3BlLnNob3dPcGVuID0gdHJ1ZTtcbiAgJHNjb3BlLmxpbWl0ID0gNjtcblxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1GVU5DVElPTlM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICRzY29wZS50aW1lID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiAkc2NvcGUudGltZVNpbmNlKG5ldyBEYXRlKGRhdGUpKTtcbiAgfTtcblxuICAkc2NvcGUuY3JlYXRlVG9waWMgPSBmdW5jdGlvbihraW5kKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIFRvcGljRmFjdG9yeS5Ub3BpYy5jcmVhdGUoe1xuICAgICAgLy9hdXRob3I6ICRzY29wZS5tZS5pZCxcbiAgICAgIGtpbmQ6IGtpbmRcbiAgICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvdG9waWMvXCIgKyByZXNwb25zZS5pZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLnNob3duVG9waWNzID0gZnVuY3Rpb24gKHNob3dPcGVuKSB7XG4gICAgcmV0dXJuICRzY29wZS50b3BpY3MuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiAoc2hvd09wZW4gPyAhby5jbG9zZWQgOiBvLmNsb3NlZCk7XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICgkc2NvcGUubGltaXQgPCAkc2NvcGUudG9waWNzLmxlbmd0aClcbiAgICAgICRzY29wZS5saW1pdCArPSAzO1xuICB9O1xuXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXIuY29udHJvbGxlcignVG9waWNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24sICR3aW5kb3csIFRvcGljRmFjdG9yeSwgTm90aWZpY2F0aW9uRmFjdG9yeSkge1xuXG4gICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICBUb3BpY0ZhY3RvcnkuVG9waWMuZ2V0KHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgJHNjb3BlLnRvcGljID0gcmVzdWx0O1xuXG4gICAgJHNjb3BlLnRvcGljLnNob3dDb21tZW50cyA9IHRydWU7XG5cbiAgICBOb3RpZmljYXRpb25GYWN0b3J5LlRvcGljLmdldEFsbCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKGdldERhdGEpIHtcbiAgICAgICRzY29wZS50b3BpYy5ub3RpZmljYXRpb25zID0gZ2V0RGF0YTtcblxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB9KTtcbiAgfSk7XG5cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5kaXJlY3RpdmVzJywgW10pXG4gIC5kaXJlY3RpdmUoJ2FwcFZlcnNpb24nLCBbJ3ZlcnNpb24nLCBmdW5jdGlvbih2ZXJzaW9uKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbG0sIGF0dHJzKSB7XG4gICAgICBlbG0udGV4dCh2ZXJzaW9uKTtcbiAgICB9XG4gIH1dKVxuICAuZGlyZWN0aXZlKFxuICAgICdkYXRlSW5wdXQnLFxuICAgIGZ1bmN0aW9uKGRhdGVGaWx0ZXIpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGlucHV0IHR5cGU9XCJkYXRlXCI+PC9pbnB1dD4nLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbG0sIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRmb3JtYXR0ZXJzLnVuc2hpZnQoZnVuY3Rpb24gKG1vZGVsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGVGaWx0ZXIobW9kZWxWYWx1ZSwgJ3l5eXktTU0tZGQnKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRwYXJzZXJzLnVuc2hpZnQoZnVuY3Rpb24odmlld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh2aWV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgfSlcbiAgLmRpcmVjdGl2ZSgnbWFya2Rvd24nLCBbJyRjb21waWxlJywgZnVuY3Rpb24gKCRjb21waWxlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgdmFyIGh0bWxUZXh0ID0gbWFya2Rvd24udG9IVE1MKGVsZW1lbnQudGV4dCgpKTtcbiAgICAgICAgICAgIGVsZW1lbnQuaHRtbChodG1sVGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICB9XSlcbiAgLmRpcmVjdGl2ZSgnY29tcGlsZScsIFsnJGNvbXBpbGUnLCBmdW5jdGlvbiAoJGNvbXBpbGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIHNjb3BlLiR3YXRjaChcbiAgICAgICAgICBmdW5jdGlvbihzY29wZSkge1xuICAgICAgICAgICAgIC8vIHdhdGNoIHRoZSAnY29tcGlsZScgZXhwcmVzc2lvbiBmb3IgY2hhbmdlc1xuICAgICAgICAgICAgcmV0dXJuIHNjb3BlLiRldmFsKGF0dHJzLmNvbXBpbGUpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIC8vIHdoZW4gdGhlICdjb21waWxlJyBleHByZXNzaW9uIGNoYW5nZXNcbiAgICAgICAgICAgIC8vIGFzc2lnbiBpdCBpbnRvIHRoZSBjdXJyZW50IERPTVxuICAgICAgICAgICAgZWxlbWVudC5odG1sKHZhbHVlKTtcblxuICAgICAgICAgICAgLy8gY29tcGlsZSB0aGUgbmV3IERPTSBhbmQgbGluayBpdCB0byB0aGUgY3VycmVudFxuICAgICAgICAgICAgLy8gc2NvcGUuXG4gICAgICAgICAgICAvLyBOT1RFOiB3ZSBvbmx5IGNvbXBpbGUgLmNoaWxkTm9kZXMgc28gdGhhdFxuICAgICAgICAgICAgLy8gd2UgZG9uJ3QgZ2V0IGludG8gaW5maW5pdGUgbG9vcCBjb21waWxpbmcgb3Vyc2VsdmVzXG4gICAgICAgICAgICAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpKHNjb3BlKTtcbiAgICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgfV0pXG4gIC5kaXJlY3RpdmUoJ2NvbW1lbnRBcmVhJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21tZW50L2FyZWEuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQ29tbWVudEFyZWFDb250cm9sbGVyJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHRocmVhZDogJ0AnXG4gICAgICB9XG4gICAgfTtcbiAgfSlcbiAgLmRpcmVjdGl2ZSgnY29tbXVuaWNhdGlvbkFyZWEnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbW11bmljYXRpb24vYXJlYS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDb21tdW5pY2F0aW9uQXJlYUNvbnRyb2xsZXInLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgdGhyZWFkOiAnQCcsXG4gICAgICAgIG1lbWJlcnNKc29uOiAnQG1lbWJlcnMnLFxuICAgICAgICBtZUpzb246ICdAbWUnLFxuICAgICAgICByb2xlc0pzb246ICdAcm9sZXMnXG4gICAgICB9XG4gICAgfTtcbiAgfSlcbiAgLmRpcmVjdGl2ZSgnY29tbXVuaWNhdGlvbicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tbXVuaWNhdGlvbi9jb21tdW5pY2F0aW9uLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0NvbW11bmljYXRpb25FbWJlZENvbnRyb2xsZXInLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgY29tbXVuaWNhdGlvbkpzb246ICdAY29tbXVuaWNhdGlvbk9iamVjdCcsXG4gICAgICAgIG1lbWJlcnNKc29uOiAnQG1lbWJlcnMnLFxuICAgICAgICBtZUpzb246ICdAbWUnLFxuICAgICAgICByb2xlc0pzb246ICdAcm9sZXMnXG4gICAgICB9XG4gICAgfTtcbiAgfSlcbiAgLmRpcmVjdGl2ZSgndG9waWMnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUFDJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3RvcGljL3RvcGljLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1RvcGljRW1iZWRDb250cm9sbGVyJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHRvcGljOiAnPXRvcGljT2JqZWN0JyxcbiAgICAgICAgbWVtYmVyc0pzb246ICdAbWVtYmVycycsXG4gICAgICAgIG1lSnNvbjogJ0BtZScsXG4gICAgICAgIHJvbGVzSnNvbjogJ0Byb2xlcycsXG4gICAgICAgIHRhZ3M6ICc9dGFnc0FycmF5JyxcbiAgICAgICAgY29tbWVudHM6ICc9Y29tbWVudHNBcnJheSdcbiAgICAgIH1cbiAgICB9O1xuICB9KVxuICAuZGlyZWN0aXZlKCd0YWdNYW5hZ2VyJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBQycsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy90YWcvbWFuYWdlci5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdUYWdNYW5hZ2VyQ29udHJvbGxlcicsXG4gICAgICBzY29wZToge1xuICAgICAgICB0YWdzOiAnPXRhZ3NBcnJheScsXG4gICAgICAgIHNlYXJjaDogJz1zZWFyY2gnXG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG4gXG4gXG5hbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5maWx0ZXJzJywgW10pLlxuICBmaWx0ZXIoJ2ludGVycG9sYXRlJywgWyd2ZXJzaW9uJywgZnVuY3Rpb24odmVyc2lvbikge1xuICAgIHJldHVybiBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nKHRleHQpLnJlcGxhY2UoL1xcJVZFUlNJT05cXCUvbWcsIHZlcnNpb24pO1xuICAgIH1cbiAgfV0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRoZVRvb2xTZXJ2aWNlcyA9IGFuZ3VsYXIubW9kdWxlKCd0aGVUb29sLnNlcnZpY2VzJywgWyduZ1Jlc291cmNlJ10pO1xuXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ0NvbXBhbnlGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBDb21wYW55OiAkcmVzb3VyY2UoJy9hcGkvY29tcGFueS86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UoJy9hcGkvbWVtYmVyLzppZC9jb21wYW5pZXMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfVxuICAgICAgfSlcbiAgICB9O1xuICB9KVxuXG4gIC5mYWN0b3J5KCdTcGVha2VyRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgU3BlYWtlcjogJHJlc291cmNlKCcvYXBpL3NwZWFrZXIvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6dHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KSxcbiAgICAgIE1lbWJlcjogJHJlc291cmNlKCcvYXBpL21lbWJlci86aWQvc3BlYWtlcnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfVxuICAgICAgfSlcbiAgICB9O1xuICB9KVxuXG4gIC5mYWN0b3J5KCdNZW1iZXJGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBNZW1iZXI6ICRyZXNvdXJjZSgnL2FwaS9tZW1iZXIvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6dHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KSxcbiAgICAgIFJvbGU6ICRyZXNvdXJjZSgnL2FwaS9yb2xlLzppZC9tZW1iZXJzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KVxuICAgIH07XG4gIH0pXG5cbiAgLmZhY3RvcnkoJ0NvbW1lbnRGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBDb21tZW50OiAkcmVzb3VyY2UoJy9hcGkvY29tbWVudC86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUFVUJ30sXG4gICAgICAgICdjcmVhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZGVsZXRlJzoge21ldGhvZDogJ0RFTEVURSd9XG4gICAgICB9KSxcbiAgICAgIENvbXBhbnk6ICRyZXNvdXJjZSgnL2FwaS9jb21wYW55LzppZC9jb21tZW50cycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSksXG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UoJy9hcGkvc3BlYWtlci86aWQvY29tbWVudHMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pLFxuICAgICAgVG9waWM6ICRyZXNvdXJjZSgnL2FwaS90b3BpYy86aWQvY29tbWVudHMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gICAgfVxuICB9KVxuXG4gIC5mYWN0b3J5KCdFbWFpbEZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIENvbXBhbnk6ICRyZXNvdXJjZSgnL2FwaS9jb21wYW55LzppZC9zZW5kSW5pdGlhbEVtYWlsJywgbnVsbCwge1xuICAgICAgICAnc2VuZCc6IHttZXRob2Q6ICdQT1NUJ31cbiAgICAgIH0pLFxuICAgICAgU3BlYWtlcjogJHJlc291cmNlKCcvYXBpL3NwZWFrZXIvOmlkL3NlbmRJbml0aWFsRW1haWwnLCBudWxsLCB7XG4gICAgICAgICdzZW5kJzoge21ldGhvZDogJ1BPU1QnfVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG5cbiAgLmZhY3RvcnkoJ05vdGlmaWNhdGlvbkZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIE5vdGlmaWNhdGlvbjogJHJlc291cmNlKCcvYXBpL25vdGlmaWNhdGlvbi86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX0sXG4gICAgICB9KSxcbiAgICAgIENvbXBhbnk6ICRyZXNvdXJjZSgnL2FwaS9jb21wYW55LzppZC9ub3RpZmljYXRpb25zJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KSxcbiAgICAgIFNwZWFrZXI6ICRyZXNvdXJjZSgnL2FwaS9zcGVha2VyLzppZC9ub3RpZmljYXRpb25zJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KSxcbiAgICAgIFRvcGljOiAkcmVzb3VyY2UoJy9hcGkvdG9waWMvOmlkL25vdGlmaWNhdGlvbnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gICAgfVxuICB9KVxuXG4gIC5mYWN0b3J5KCdUb3BpY0ZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFRvcGljOiAkcmVzb3VyY2UoJy9hcGkvdG9waWMvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfSksXG4gICAgICBNZW1iZXI6ICRyZXNvdXJjZSgnL2FwaS9tZW1iZXIvOmlkL3RvcGljcycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHsgbWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZSB9XG4gICAgICB9KVxuICAgIH07XG4gIH0pXG5cbiAgLmZhY3RvcnkoJ01lZXRpbmdGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiAkcmVzb3VyY2UoJy9hcGkvbWVldGluZy86aWQnLCBudWxsLCB7XG4gICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxuICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgIH0pO1xuICB9KVxuXG4gIC5mYWN0b3J5KCdDb21tdW5pY2F0aW9uRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgQ29tbXVuaWNhdGlvbjogJHJlc291cmNlKCcvYXBpL2NvbW11bmljYXRpb24vOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfSxcbiAgICAgICAgJ2FwcHJvdmUnOiB7bWV0aG9kOiAnUE9TVCd9XG4gICAgICB9KSxcbiAgICAgIENvbXBhbnk6ICRyZXNvdXJjZSgnL2FwaS9jb21wYW55LzppZC9jb21tdW5pY2F0aW9ucycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSksXG4gICAgICBTcGVha2VyOiAkcmVzb3VyY2UoJy9hcGkvc3BlYWtlci86aWQvY29tbXVuaWNhdGlvbnMnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZX1cbiAgICAgIH0pXG4gICAgfTtcbiAgfSlcblxuICAuZmFjdG9yeSgnU2Vzc2lvbkZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFNlc3Npb246ICRyZXNvdXJjZSgnL2FwaS9zZXNzaW9uLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfSxcbiAgICAgICAgJ2NyZWF0ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdkZWxldGUnOiB7bWV0aG9kOiAnREVMRVRFJ31cbiAgICAgIH0pLFxuICAgICAgQ29tcGFueTogJHJlc291cmNlKCcvYXBpL2NvbXBhbnkvOmlkL3Nlc3Npb25zJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KSxcbiAgICAgIFNwZWFrZXI6ICRyZXNvdXJjZSgnL2FwaS9zcGVha2VyLzppZC9zZXNzaW9ucycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG5cbiAgLmZhY3RvcnkoJ0NoYXRGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBDaGF0OiAkcmVzb3VyY2UoJy9hcGkvY2hhdC86aWQnLCBudWxsLCB7XG4gICAgICAgICd1cGRhdGUnOiB7bWV0aG9kOiAnUE9TVCd9LFxuICAgICAgICAnZ2V0JzogICAge21ldGhvZDogJ0dFVCd9XG4gICAgICB9KSxcbiAgICAgIENoYXRzOiAkcmVzb3VyY2UoJy9hcGkvY2hhdCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9XG4gICAgICB9KSxcbiAgICAgIE1lc3NhZ2VzOiAkcmVzb3VyY2UoJy9hcGkvY2hhdC86aWQvbWVzc2FnZXMnLCBudWxsLCB7XG4gICAgICAgICdnZXQnOiB7bWV0aG9kOiAnR0VUJyxpc0FycmF5OnRydWV9XG4gICAgICB9KVxuICAgIH1cbiAgfSlcblxuICAuZmFjdG9yeSgnTWVzc2FnZUZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuICRyZXNvdXJjZSgnL2FwaS9tZXNzYWdlLzppZCcsIG51bGwsIHtcbiAgICAgICAgZ2V0OiAgICB7bWV0aG9kOiAnR0VUJ30sXG4gICAgICAgIGNyZWF0ZToge21ldGhvZDogJ1BPU1QnfVxuICAgICAgfSlcbiAgfSlcblxuICAuZmFjdG9yeSgnUm9sZUZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFJvbGU6ICRyZXNvdXJjZSgnL2FwaS9yb2xlLzppZCcsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgIH0pLFxuICAgICAgTWVtYmVyOiAkcmVzb3VyY2UoJy9hcGkvcm9sZS86aWQvbWVtYmVycycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfVxuICAgICAgfSlcbiAgICB9O1xuICB9KVxuXG4gIC5mYWN0b3J5KCdUYWdGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7XG4gICAgICBUYWc6ICRyZXNvdXJjZSgnL2FwaS90YWcvOmlkJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9LFxuICAgICAgICAndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9LFxuICAgICAgICAnY3JlYXRlJzoge21ldGhvZDogJ1BPU1QnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfSksXG4gICAgICBUb3BpYzogJHJlc291cmNlKCcvYXBpL3RhZy86aWQvdG9waWNzJywgbnVsbCwge1xuICAgICAgICAnZ2V0QWxsJzoge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWV9XG4gICAgICB9KVxuICAgIH07XG4gIH0pXG5cbiAgLmZhY3RvcnkoJ1NvY2tldEZhY3RvcnknLCBmdW5jdGlvbiAoJHJlc291cmNlLCAkbG9jYXRpb24sICRyb290U2NvcGUpIHtcbiAgICB2YXIgc29ja2V0ID0gaW8uY29ubmVjdCgnL2NoYXQnKTtcbiAgICByZXR1cm4ge1xuICAgICAgb246IGZ1bmN0aW9uIChldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHNvY2tldC5vbihldmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseShzb2NrZXQsIGFyZ3MpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBlbWl0OiBmdW5jdGlvbiAoZXZlbnROYW1lLCBkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICBzb2NrZXQuZW1pdChldmVudE5hbWUsIGRhdGEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoc29ja2V0LCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4iLCJ1cmxfcHJlZml4ID0gJ2h0dHA6Ly90aGUtdG9vbC5mcmFuY2lzY29kaWFzLm5ldC8nO1xuXG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvYXBwLmpzJyk7XG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMnKTtcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9kaXJlY3RpdmVzJyk7XG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvZmlsdGVycycpO1xucmVxdWlyZSgnLi9hbmd1bGFyQXBwL3NlcnZpY2VzJyk7Il19
