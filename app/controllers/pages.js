'use strict';

angular.module('timelyn.pages', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/pages/home.html',
    controller: 'PageCtrl'
  });
  $routeProvider.when('/about', {
    templateUrl: 'views/pages/about.html',
    controller: 'PageCtrl'
  });
  $routeProvider.when('/pricing', {
    templateUrl: 'views/pages/pricing.html',
    controller: 'PageCtrl'
  });
  $routeProvider.when('/404', {
    templateUrl: 'views/pages/404.html',
    controller: 'PageCtrl'
  });
}])

.controller('PageCtrl', function(Breadcrumb) {
  Breadcrumb.default()
});
