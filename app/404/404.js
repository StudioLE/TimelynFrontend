'use strict';

angular.module('myApp.404', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/404', {
    templateUrl: '404/404.html',
    controller: '404Ctrl'
  });
}])

.controller('404Ctrl', [function() {

}]);