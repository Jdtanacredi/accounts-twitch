Template.configureLoginServiceDialogForTwitch.siteUrl = function () {
  return Meteor.absoluteUrl();
};

Template.configureLoginServiceDialogForTwitch.fields = function () {
  return [
    {property: 'clientId', label: 'Client ID'},
    {property: 'secret', label: 'Client secret'}
  ];
};