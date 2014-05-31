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
