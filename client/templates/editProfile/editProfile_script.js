Template.editProfile.helpers({
  user: function () {
    return Meteor.user();
  }
});

Template.editProfile.events({
  'submit #editProfile': function (evt) {
    evt.preventDefault();
    var name = $('#name').val();
    if (name) {
      check(name, String);
      Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.name': name }});
    }
    var email = $('#email').val();
    var user = Meteor.user();
    var setedEmail = contactEmail(user);
    if (email && email !== setedEmail) {
      check(email, String);
      Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'emails.0.address': email }});
    }
  }
});

Template.editProfile.onRendered(function ( ){
});
