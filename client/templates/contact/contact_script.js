Template.contact.helpers({
  email: function () {
    if (Meteor.userId()) {
      return contactEmail(Meteor.user());
    }
  }
});

Template.contact.events({
});

Template.contact.onRendered(function ( ){
});
