angular.module('navList', [])

.controller('navCtrl', ['$scope', '$location', 'User', function ($scope, $location, User) {
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

  $scope.navType = function() {
    if(User.get().id) return 'views/nav/nav-user.html'
    return 'views/nav/nav-guest.html'
  }

  $scope.user = function() {
    return User.get()
  }
  
}]);
