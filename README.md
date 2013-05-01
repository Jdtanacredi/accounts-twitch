# accounts-twitch

Meteor.js Accounts package for Twitch.tv accounts

## Installation
- Install [Meteorite](https://atmosphere.meteor.com/)
- Run `mrt add accounts-twitch` in a Meteor project.
- Run your app with `mrt`
- Alternatively clone the repo to your meteor packages folder,  `/usr/local/meteor/packages` by default on OSX.

## Features
- Really easy way to allow users to login to your app using their Twitch credentials. Just add `Meteor.loginWithTwitch()`.
- Make API calls with all the required headers.



## Usage
- Configure your app to include the application you have registered on Twitch or create a new one. The easiest way to do this is using the `{{loginButtons}}` helper from the accounts-ui package (remember to `meteor add accounts-ui`).
- Once your app is configured you can let people login either using the `{{loginButtons}}` helper or by calling `Meteor.loginWithTwitch();` directly. Permissions that are asked for can be included e.g. `Meteor.loginWithTwitch({ requestPermissions: ['channel_editor'] });`.
- A user's access token is available server side via `Meteor.user().services.twitch.accessToken`.
- API calls are done using `Accounts.twitch.apiCall(method, url, [options], [accessToken])`. e.g. to get a user's email address: `Accounts.twitch.apiCall("GET", "https://api.twitch.tv/kraken/user", Meteor.user().services.twitch.accessToken).data.email;`
