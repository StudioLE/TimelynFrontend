'use strict';

angular.module('timelyn.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', function(Breadcrumb) {
  Breadcrumb.default()
});
