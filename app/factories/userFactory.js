'use strict';

angular.module('timelyn.userFactory', [])

/*****************************************************************
*
* User factory
*
******************************************************************/
.factory('User', function($http, localStorageService, Config) {
  var User = {

    /**
     * Current user
     */
    user: {
      id: null,
      name: 'Guest',
      username: null,
      email: null
    },
    
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
   *
   * @return {Object} user 
   */
  var init = function() {
    if(User.token.get()) User.fetch()
    return User
  }
  return init()
});
