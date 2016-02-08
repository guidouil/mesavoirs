Template.contact.helpers({
  email: function () {
    if (Meteor.userId()) {
      return contactEmail(Meteor.user());
    }
  },
  name: function () {
    return Meteor.user().profile.name;
  }
});

Template.contact.events({
});

Template.contact.onRendered(function ( ){
});
