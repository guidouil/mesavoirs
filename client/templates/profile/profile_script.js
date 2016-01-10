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
  },
  'click [data-action=deleteMe]': function () {
    swal({
      title: 'Etes-vous sur ?',
      text: 'Effacer votre compte est définitif.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Oui',
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
  }
});

Template.profile.onRendered(function () {

});
