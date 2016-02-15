Template.placeEdit.helpers({
  place: function () {
    return Places.findOne({_id: Router.current().params.placeId, owners: Meteor.userId()});
  }
});

Template.placeEdit.events({
  'click [data-action=deletePlace]': function (evt) {
    var placeId = this._id;
    swal({
      title: 'Êtes-vous sûr ?',
      text: 'Effacer un commerce est définitif, toutes les données seront effacées.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      closeOnConfirm: false
    }, function () {
      swal({
        title: 'Etes-vous vraiment sur ?',
        text: 'Effacer un commerce est définitif, toutes les cartes de fidélité et les avoirs de vos clients seront aussi effacés.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'J\'ai dis oui',
        cancelButtonText: 'Non',
        closeOnConfirm: false
      }, function () {
        var place = Places.findOne({_id: placeId});
        if (place.imageId) {
          Images.remove({_id: place.imageId});
        }
        Meteor.call('deleteLoyaltyCardsAndVouchers', placeId, function () {
          Meteor.call('removeProfilesCurrentPlace', placeId, function () {
            Places.remove({_id: placeId});
            swal('Effacé!', 'Le commerce à été supprimé.', 'success');
            Router.go('/my-places');
          });
        });
      });
    });
  }
});

Template.placeEdit.onRendered(function () {
  setTimeout(function () {
    setDefaultCurrentPlace();
  }, 1000);
});

Template.placeEdit.onCreated(function () {
  var template = this;
  subs.subscribe('MyPlace', Router.current().params.placeId);
});
