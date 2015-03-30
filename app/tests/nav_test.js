'use strict';

describe('navList module', function() {
  var scope, $location, createController

  beforeEach(module('navCtrl'))

  beforeEach(inject(function($rootScope, $controller, _$location_) {
    $location = _$location_
    scope = $rootScope.$new()

    createController = function() {
      return $controller('navCtrl', {
        '$scope': scope
      })
    }
  }))

  describe('nav controller', function(){

    it('should ....', inject(function($rootScope, $controller) {
      var controller = createController()
      // var scope = $rootScope.$new()
      // var navCtrl = $controller('navCtrl', {$scope: scope});
      // expect(navCtrl).toBeDefined();
      $location.path('/timeline')
      expect($location.path()).toBe('/timeline')
      expect(scope.navClass('/timeline')).toBe('active')
      expect(scope.navClass('/')).toBe('')
    }));

  });
});