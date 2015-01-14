(function() {
  'use strict';

  angular
    .module('templates', []);

  angular
    .module('segue.submission',[
      'templates',
      'ui.router',
      'ui.router.compat',
      'restangular',

      'segue.submission.libs',
      'segue.submission.locale',
      'segue.submission.splash',
      'segue.submission.authenticate',
      'segue.submission.proposal',
    ])

    .controller('SubmissionController', function($scope, $state) {
      $scope.$on('$stateChangeSuccess', function(event, newState) {
        $scope.topState = newState.name.split('.')[0];
        $scope.state    = newState;
      });

      $scope.home = function() {
        $state.go('splash');
      };
    })

    .config(function(RestangularProvider, Config) {
      RestangularProvider.setBaseUrl(Config.API_HOST + Config.API_PATH);
    })
    .config(function($urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
    });

})();
