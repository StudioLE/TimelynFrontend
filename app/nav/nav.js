angular.module('navList', [])

.controller('navCtrl', ['$scope', '$location', function ($scope, $location) {
  $scope.navClass = function (href) {
    return href === '#' + $location.path() ? 'active' : '';
  };

  $scope.nav = [{
    url: '#/',
    title: 'Home'
  }, {
    url: '#/timeline',
    title: 'Timelines'
  }]
  
}]);
