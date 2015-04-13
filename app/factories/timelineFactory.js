'use strict';

angular.module('timelyn.timelineFactory', [])

/*****************************************************************
*
* Timeline factory
*
******************************************************************/
.factory('Timeline', function($resource, Config) {
  return $resource(Config.app('/timeline/:id'), {}, {
    edit: { method: 'PUT', params: {id: '@id'} },
    // get: { method: 'GET', url: Config.app('/timeline/json/:id'), params: {id: '@id'} }
  });
})
