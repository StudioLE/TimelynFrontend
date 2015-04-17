'use strict';

angular.module('timelyn.alertFactory', [])

/*****************************************************************
*
* User factory
*
******************************************************************/
.factory('Alert', function($http, localStorageService, Config) {
  return {

    alerts: [],
    
    /**
     * Alert getter
     *
     * @return  {Object} user
     */
    get: function() {
      return this.alerts
    },
    
    /**
     * Alert setter
     *
     * @param {String} msg
     * @param {String} status
     * @return {Object} user
     */
    set: function(msg, status) {
      if(status === undefined) status = 'info'
      this.alerts.push({ 
        status: status,
        message: msg,
        icon: this.icon(status)
      })
      // messageCenterService.add(status, msg, { html: true }) //{ status: messageCenterService.status.permanent })
      return this.alerts
    },
    
    /**
     * Alert seen
     *
     * @return  {Object} user
     */
    seen: function() {
      // Add seen = true to all elements we get
      _.each(this.alerts, function(element) { 
        element.seen = true
      })
      return this.alerts
    },

    /**
     * Clear seen alerts
     *
     * @return {Array} 
     */
    clear: function() {
      return this.alerts = _.reject(this.alerts, function(element) {
        return element.seen === true
      })
    },

    /**
     * Clear all Alerts
     *
     * @return {Array} empty
     */
    reset: function() {
      return this.alerts = []
    },
    
    /**
     * Icon switch
     *
     * Return an appropriate fa icon class for the status
     *
     * @param {String} status
     * @return {String} icon class
     */
    icon: function(status) {
      switch(status) {
        case 'info':
          return 'info-circle'
        break;
        case 'success':
          return 'check-circle'
        break;
        default:
          return 'exclamation-triangle'
      }
    },

    /**
     * Parse errors
     *
     * Call on failure of a factory method
     * It checks for a variety of errors and
     * alerts the user to them.
     *
     * @param {Object} response
     * @return {Object} error
     */
    error: function(response) {
      console.error(response)
      if(_.isString(response)) {
        this.set(response, 'danger')
      }
      else if( ! response || ! response.data)
        this.set('An unknown error occured. The app may be offline', 'danger')
      // Check if there is a nested validation error
      else if(response.status === 500 && response.data.error === 'E_UNKNOWN' && response.data.raw && response.data.raw[0].err.error === 'E_VALIDATION') {
        // console.log(response.data.raw[0].err.error)
        // Recurse..
        this.error({data: response.data.raw[0].err})
      }
      else if(response.data && response.data.error === 'E_VALIDATION') {
        var validation = []
        // For each input that is invalid
        _.each(response.data.invalidAttributes, function(rules, key) {
          // Check which rules it failed
          _.each(rules, function(error) {
            switch(error.rule) {
              case 'required':
                validation.push(key + ' is required')
              break;
              case 'string':
                validation.push(key + ' should contain text')
              break;
              case 'email':
                validation.push(key + ' should be an email address')
              break;
              default:
                validation.push(key + ' ' + error.message)
                console.error('Unknown validation error for: ' + key)
                console.error(error)
              break;
            }
          })
        })
        // Join and format validation errors
        validation = 'Validation Failed <ul><li>'+validation.join('</li><li>')+'</li></ul>'
        // Set an alert message
        this.set(validation, 'warning')
      }
      else {
        this.set('An unknown error occured', 'warning')
      }
    },

  }
})

/*****************************************************************
*
* Route Change
*
******************************************************************/
.run(function($rootScope, Alert) {
  $rootScope.$on('$locationChangeSuccess', function() {
    console.log('Route changed')
    console.log(Alert.get())
    console.log(Alert.clear())
    console.log(Alert.seen())
  })
})
