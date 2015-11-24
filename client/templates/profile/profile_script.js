Template.profile.helpers({
  email: function () {
    var user = Meteor.user();
    if (user.emails && user.emails.length) {
      return user.emails[0].address;
    }
    if (user.services && user.services.facebook && user.services.facebook.email) {
      return user.services.facebook.email;
    }
    if (user.services && user.services.google && user.services.google.email) {
      return user.services.google.email;
    }
    if (user.services && user.services.twitter && user.services.twitter.screenName) {
      return '@' + user.services.twitter.screenName;
    }
  },
  qrText: function () {
    return 'userId:' + Meteor.userId();
  }
});

Template.profile.events({
  'click [data-action=logout]': function () {
    Meteor.logout();
  }
});

Template.profile.onRendered(function () {

});
