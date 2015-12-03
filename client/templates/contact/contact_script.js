Template.contact.helpers({
  email: function () {
    return contactEmail(Meteor.user());
  }
});

Template.contact.events({
});

Template.contact.onRendered(function ( ){
});
