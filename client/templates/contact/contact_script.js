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

Template.contact.onRendered(function () {
  setTimeout(function () {
    $('html, body').animate({scrollTop: 0}, 'fast');
  }, 500);
});
