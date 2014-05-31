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
