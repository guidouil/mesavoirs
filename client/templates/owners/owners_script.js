Template.owners.helpers({
  owners: function () {
    return Session.get('owners');
  }
});

Template.owners.events({
  'click #remove': function () {
    if (this.userId === Meteor.userId()) {
      swal('Nope !', 'Vous ne pouvez pas vous retirer vous même.', 'error');
      return false;
    } else {
      var placeId = Router.current().params.placeId;
      Meteor.call('removeOwnership', this.userId, placeId, function (error, result) {
        if (error) {
          console.log(error);
        }
        if (result === true) {
          Meteor.call('getPlaceOwners', placeId, function (err, owners) {
            if (owners) {
              Session.set('owners', owners);
            }
          });
        }
      });
    }
  },
  'keypress #ownerMail': function (evt) {
    $('#ownerMail').parent().removeClass('error');
    if (evt.which === 13) {
      giveOrwnership(this._id);
    }
  },
  'click #searchOwner': function () {
    $('#ownerMail').parent().removeClass('error');
    giveOrwnership(this._id);
  }
});

Template.owners.onRendered(function () {
});

Template.owners.onCreated(function () {
  Meteor.call('getPlaceOwners', this.data._id, function (err, owners) {
    if (owners) {
      Session.set('owners', owners);
    }
  });
});

var giveOrwnership = function (placeId) {
  var email = $('#ownerMail').val();
  if (validateEmail(email)) {
    Meteor.call('giveOrwnership', email, placeId, function (error, result){
      if (error) {
        console.log('error', error);
      }
      if (result === false) {
        swal('Qui ?', 'Aucun compte ne correspond cette adresse email.', 'error');
      }
      if (result === true) {
        Meteor.call('getPlaceOwners', placeId, function (err, owners) {
          if (owners) {
            Session.set('owners', owners);
          }
        });
        swal('Impec', 'L\'utilisateur peux maintenant gérer vos clients avec vous.', 'success');
      }
    });
  } else {
    $('#ownerMail').parent().addClass('error');
  }
};
