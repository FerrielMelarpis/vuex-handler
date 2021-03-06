'use strict';

/**
 * Install this plugin on Vuex.Store.
 * @example ```js
 * new Vuex.Store({ plugins: [ handler ], ... })
 * ```
 * @param {Vuex.Store} store
 */
var install = function (store) {
  var original = store.dispatch;

  store.handler = {};

  store.dispatch = function (type) {
    var params = [], len = arguments.length - 1;
    while ( len-- > 0 ) params[ len ] = arguments[ len + 1 ];

    var action = original.apply(store, [ type ].concat( params ));
    var specific = store.handler[type] || {};
    var onFailure = specific.onFailure || store.handler.onFailure;
    var onSuccess = specific.onSuccess || store.handler.onSuccess;

    action
      .then(function (result) { return Promise.resolve(
        onSuccess
          ? onSuccess.apply(void 0, [ result, type ].concat( params ))
          : result
      ); })
      .catch(function (error) { return Promise.resolve(
        onFailure
          ? onFailure.apply(void 0, [ error, type ].concat( params ))
          : Promise.reject(error)
      ); });

    return action
  };
};

module.exports = install;
