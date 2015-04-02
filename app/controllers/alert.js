angular.module('alertModule', [])

.controller('AlertCtrl', function($scope, Alert) {

  $scope.alerts = function() {
    return Alert.get()
  }
  
});
