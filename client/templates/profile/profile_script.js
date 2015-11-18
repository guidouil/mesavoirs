Template.profile.helpers({
  email: function () {
    return Meteor.user().emails[0].address;
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
