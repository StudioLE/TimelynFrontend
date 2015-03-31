'use strict';

angular.module('timelyn.timelineFactory', [])

/*****************************************************************
*
* Timeline factory
*
******************************************************************/
.factory('Timeline', function($resource, Config) {
  return $resource(Config.url('/timeline/:id'), {}, {
    edit: { method: 'PUT', params: {id: '@id'} }
  });
})
