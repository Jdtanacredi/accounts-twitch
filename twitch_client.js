(function () {
  Meteor.loginWithTwitch = function (options, callback) {
    // support both (options, callback) and (callback).
    console.log('inside client');
    if (!callback && typeof options === 'function') {
      callback = options;
      options = {};
    }

    var config = Accounts.loginServiceConfiguration.findOne({service: 'twitch'});
    if (!config) {
      callback && callback(new Accounts.ConfigError("Twitch service not configured"));
      return;
    }

    var scope = (options && options.requestPermissions) || [];
    var flatScope = _.map(scope, encodeURIComponent).join('+');

    var state = Meteor.uuid();

    var loginUrl =
          'https://api.twitch.tv/kraken/oauth2/authorize?client_id=' + config.clientId +
          '&redirect_uri=' + Meteor.absoluteUrl('_oauth/twitch?close') +
          '&scope=' + flatScope +
          '&response_type=code' +
          '&state=' + state;

    var windowHeight = 500 + (scope.length * 25);
    Accounts.oauth.initiateLogin(state, loginUrl, callback, {height: windowHeight, width:600});
  };

})();




