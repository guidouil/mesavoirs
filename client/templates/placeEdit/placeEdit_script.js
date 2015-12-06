Template.placeEdit.helpers({
});

Template.placeEdit.events({
  'click [data-action=deletePlace]': function (evt) {
    var placeId = this._id;
    swal({
      title: 'Etes-vous sur ?',
      text: 'Effacer un commerce est définitif.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      closeOnConfirm: true
    }, function () {
      // TODO delete image vouchers and loyaltyCards
      Places.remove({_id: placeId});
      swal('Effacé!', 'Le commerce à été supprimé.', 'success');
      Router.go('/my-places');
    });
  }
});

Template.placeEdit.onRendered(function ( ){
});
