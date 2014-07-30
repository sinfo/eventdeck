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
  