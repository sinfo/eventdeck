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

      CompanyFactory.update({ id:company.id }, companyData, function(response) {
        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.message;
        }
      });
    }

    $scope.statuses = ['Emitido', 'Recibo Enviado', 'Pago', 'Enviado'];

    CompanyFactory.getAll(function(response) {
      $scope.predicate = 'participation.payment.price';
      $scope.reverse = true;
      $scope.companies = response;
    });

    MemberFactory.Member.getAll(function(response) {
      $scope.members = response;
    });
  });
  