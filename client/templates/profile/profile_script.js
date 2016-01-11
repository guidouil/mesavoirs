Template.profile.helpers({
  user: function () {
    return Meteor.user();
  },
  qrText: function () {
    return 'userId:' + Meteor.userId();
  }
});

Template.profile.events({
  'click [data-action=logout]': function () {
    Meteor.logout();
    Router.go('home');
  }
});

Template.profile.onRendered(function () {

});
