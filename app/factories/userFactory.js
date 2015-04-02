'use strict';

angular.module('timelyn.userFactory', [])

/*****************************************************************
*
* User factory
*
******************************************************************/
.factory('User', function($http, localStorageService, Config, Alert) {
  var User = {

    /**
     * Current user
     */
    user: {},
    
    /**
     * User token class
     */
    token: {
      
      /**
       * User token getter
       *
       * @return {String} token
       */
      get: function() {
        return localStorageService.get('jwt')
      },

      /**
       * User token setter
       *
       * @return {String} token
       */
      set: function(token) {
        return localStorageService.set('jwt', token)
      },

      /**
       * User token unset
       */
      unset: function(token) {
        return localStorageService.remove('jwt')
      }
    },
    
    /**
     * Current user getter
     *
     * @return  {Object} user
     */
    get: function() {
      return this.user
    },
    
    /**
     * Current user setter
     *
     * @param {Object} user
     * @return {Object} user
     */
    set: function(user) {
      return this.user = user
    },

    /**
     * Set user to guest
     *
     * @param {string} route
     */
    guest: function() {
      return this.user = {
        id: null,
        name: 'Guest',
        username: null,
        email: null
      }
    },

    /**
     * Fetch user details
     */
    fetch: function(route) {
      if(route !== 'guest') route = 'current'

      $http.get(this.url(route))
        .success(function(data, status, headers, config) {
          User.user = data
        })
        .error(function(data, status, headers, config) {
          if(status === 403) {
            Alert.set('Request forbidden by application server', 'warning')
            console.error('Request forbidden by server')
            // console.error('JWT not accepted by server')
            console.error(status)
            console.error(data)
          }
          else {
            Alert.set('Could not connect to application server', 'danger')
            console.error('Could not connect to application server')
            console.error(status)
            console.error(data)
          }
        })
    },
    
    /**
     * User url getter
     *
     * @param {String} req
     * @return {String} url
     */
    url: function(req) {
      var path = Config.app_url
      if(req === 'current') {
        return path + '/user/current'
      }
      else if(req === 'guest') {
        return path + '/user/guest'
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
   * Init 
   *
   * Check whether a JSON Web Token is present in local storage
   * if it is then fetch the user data from the server
   * otherwise just check the server is online
   *
   * @return {Object} user 
   */
  var init = function() {
    if(User.token.get()) {
      User.fetch()
    } 
    else {
      User.fetch('guest')
    }
    return User
  }
  return init()
});
