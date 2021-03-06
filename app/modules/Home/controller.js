(function() {
  "use strict";

  angular
    .module('segue.submission.home', [
      'segue.submission.authenticate.service',
      'segue.submission.proposal.service',
      'segue.submission.purchase.service',
      'segue.submission.home.controller'
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('home', {
          url: '^/home',
          views: {
            header: {                               templateUrl: 'modules/common/nav.html' },
            main:   { controller: 'HomeController', templateUrl: 'modules/Home/home.html'  }
          },
          resolve: {
            myProposals:     function(Proposals) { return Proposals.getOwnedByCredentials(); },
            myInvites:       function(Proposals) { return Proposals.getByCoAuthors(); },
            myPurchases:     function(Purchases) { return Purchases.getOwnedByCredentials(); },
            currentProposal: function(Proposals) { return Proposals.current(); },
            signup:          function(Account)   { return Account.get(); }
          }
        });

    });
  angular
    .module('segue.submission.home.controller', [])
    .controller('HomeController', function($scope, $state,
                                           Auth, Proposals, Purchases, myPurchases, myProposals, myInvites, currentProposal, signup, Account, Validator, FormErrors, ngToast) {
      if (!Auth.credentials()) { $state.go('splash'); }

      $scope.myPurchases     = myPurchases;
      $scope.myProposals     = myProposals;
      $scope.myInvites       = myInvites;
      $scope.currentProposal = (_.isEmpty(currentProposal))? null : currentProposal;
      $scope.lockEmail = true;
      $scope.signup = signup;

      $scope.signup[Account.getDocumentField($scope.signup.country)] = $scope.signup.document;

      $scope.removeCurrent = function(ev) {
        $scope.currentProposal = null;
        Proposals.localForget();
        ev.stopPropagation();
      };

      $scope.doPayment = function(purchaseObject) {
        purchaseObject.post('pay/pagseguro')
                      .then(Purchases.followPaymentInstructions);
      };

      $scope.submit = function() {
        Validator.validate($scope.signup, 'accounts/edit_account')
                 .then(Account.saveIt)
                 .then($scope.home)
                 .then(ngToast.create('alterações salvas com sucesso.'))
                 .catch(FormErrors.set);
      };

      $scope.$on('auth:changed', $scope.home);
    });
})();
