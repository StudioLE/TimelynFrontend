'use strict';

angular.module('timelyn.404', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/404', {
    templateUrl: 'views/404/404.html',
    controller: '404Ctrl'
  });
}])

.controller('404Ctrl', function(Breadcrumb) {
  Breadcrumb.default()
});
