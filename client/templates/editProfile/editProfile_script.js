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
    Router.go('profile');
  },
  'click [data-action=deleteMe]': function () {
    swal({
      title: 'Êtes-vous sûr ?',
      text: 'Effacer votre compte est définitif.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#21BA45',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      closeOnConfirm: false
    }, function () {
      swal({
        title: 'Etes-vous vraiment sur ?',
        text: 'Effacer votre compte est VRAIMENT définitif.',
        type: 'error',
        showCancelButton: true,
        confirmButtonColor: '#21BA45',
        confirmButtonText: 'J\'ai dis oui',
        cancelButtonText: 'Non',
        closeOnConfirm: true
      }, function () {
        Meteor.call('deleteMe', function (error, result) {
          if (error) {
            console.log('error', error);
          }
          if (result) {
            Meteor.logout();
            swal('Effacé!', 'Le compte à été supprimé.', 'success');
            Router.go('home');
          }
        });
      });
    });
  }
});

Template.editProfile.onRendered(function ( ){
});
