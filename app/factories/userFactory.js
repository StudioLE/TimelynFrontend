'use strict';

angular.module('timelyn.userFactory', [])

/*****************************************************************
*
* User factory
*
******************************************************************/
.factory('User', function($http, localStorageService, Config) {
  var User = {
    user: null,
    token: localStorageService.get('jwt'),
    get: function() {
      return this.user
    },
    set: function(user) {
      this.user = user
    },
    fetch: function() {
      $http.get(this.url('current'), {cache: true}).then(function(response) {
        if(response.status === 200) {
          User.user = response.data
        }
        else {
          console.error('JWT not accepted by server')
          console.error(response.data)
          User.user = false
        }
      })
    },
    url: function(req) {
      var path = Config.app_url
      if(req === 'current') {
        return path + '/user/current'
      }
      else if(req === 'register') {
        return path + '/user/register'
      }
      else if(req === 'login') {
        return path + '/auth/login'
      }
      else {
        console.error('Unknown request User.url("' + req + '")')
        return null
      }
    }
  }
  /**
   * Check to see whether a JWT is present in local storage
   * if it is then fetch the user data from the server
   * @return object User 
   */
  var init = function() {
    // If no token then user is not logged in
    if( ! User.token) {
      User.user = false
    }
    else {
      User.fetch()
    }
    return User
  }
  return init()
});
