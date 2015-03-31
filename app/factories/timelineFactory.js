'use strict';

angular.module('timelyn.timelineFactory', [])

/*****************************************************************
*
* Timeline factory
*
******************************************************************/
.factory('Timeline', function($resource, Config) {
  return $resource(Config.app('/timeline/:id'), {}, {
    edit: { method: 'PUT', params: {id: '@id'} }
  });
})
