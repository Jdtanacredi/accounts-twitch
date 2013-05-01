Package.describe({
  summary: "Login service for Twitch.tv Accounts"
});

Package.on_use(function(api) {
  api.use('accounts-base', ['client', 'server']);
  api.use('accounts-oauth2-helper', ['client', 'server']);
  api.use('http', ['client', 'server']);
  api.use('templating', 'client');

  api.add_files(
    ['twitch_configure.html', 'twitch_configure.js'],
    'client');

  api.add_files('twitch_common.js', ['client', 'server']);
  api.add_files('twitch_server.js', 'server');
  api.add_files('twitch_client.js', 'client');
});
