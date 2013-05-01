(function () {
  Accounts.oauth.registerService('twitch', 2, function(query) {
    var config = Accounts.loginServiceConfiguration.findOne({service: 'twitch'});
    if (!config)
      throw new Accounts.ConfigError("Twitch Service not configured");

    var accessToken = Accounts.twitch.apiCall("POST", "https://api.twitch.tv/kraken/oauth2/token", {
      data: {
        client_id: config.clientId,
        redirect_uri: Meteor.absoluteUrl("_oauth/twitch?close"),
        client_secret: config.secret,
        grant_type: "authorization_code",
        code: query.code
    }}).data.access_token;

    var identity = Accounts.twitch.apiCall("GET", "https://api.twitch.tv/kraken", accessToken).data.token;
    var username = identity.user_name;
    //meteor requires a id associated with the service
    var userId = Accounts.twitch.apiCall("GET", "https://api.twitch.tv/kraken/users/" + username, accessToken).data._id;
    var scope = identity.authorization.scopes;

    //supporting the ability for an already created user to add permissions
    var exists = Meteor.users.findOne({'profile.name': username});
    if (exists) {
      //this is pretty hacky. meteor doesn't really support the ability for a user to add scopes after
      //account creation. as far as it is concerned the user is kind of being created twice. This means
      //the user will get a new _id so do this at your own risk.
      //NOTE: if you want to give people the ability to do this you should log them out before giving them
      //the Meteor.loginWithTwitch with new permissions.
      scope = _.union(exists.profile.scope, scope);
      Meteor.users.update({'profile.name': username}, {'profile.scope': scope});
    }

    return {
      serviceData: {
        id: userId,
        accessToken: accessToken
      },
      options: {profile: {name: username, scope: scope}}
    };
  });

  Accounts.twitch.apiCall = function(method, url, options, accessToken) {
    var config = Accounts.loginServiceConfiguration.findOne({service: 'twitch'});
    if (!config)
      throw new Accounts.ConfigError("Twitch service not configured");

    //support both full URL and just endpoint
    //XX needs improved, for example if http:// is used instead of https:// urls will be appended
    //resulting in an ambiguous error message
    var base_url = "https://api.twitch.tv/kraken";
    if (url.substring(0, base_url.length) !== base_url)
      url = base_url + url;

    //options and accessToken are optional parameters so have to support call with only accessToken
    if (!accessToken && typeof options === 'string') {
      accessToken = options;
      options = {};
    }

    options = options || {};

    var defaultHeaders = {headers: {
      Accept: 'application/vnd.twitchtv.v2+json',
      'Client-ID': config.clientId
    }};

    if (accessToken)
      _.extend(defaultHeaders.headers, {Authorization: 'OAuth ' + accessToken});

    _.extend(options, defaultHeaders);

    var result = Meteor.http.call(method, url, options);

    //twitch api always returns an error parameter but it is null if there is no error
    if (result.error !== null)
      throw "Exception from Twitch API: " + result.data.message;

    return result;
  };

}) ();
