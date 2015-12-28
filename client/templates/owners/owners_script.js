Template.owners.helpers({
  owners: function () {
    return Session.get('owners');
  },
  sellers: function () {
    return Session.get('sellers');
  },
  place: function () {
    return Places.findOne({_id: Router.current().params.placeId});
  }
});

Template.owners.events({
  'click #removeOwner': function () {
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
          Meteor.call('getPlaceOwnersAndSellers', placeId, function (err, result) {
            if (result.owners) {
              Session.set('owners', result.owners);
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
  },
  'click #removeSeller': function () {
    var placeId = Router.current().params.placeId;
    Meteor.call('removeSeller', this.userId, placeId, function (error, result) {
      if (error) {
        console.log(error);
      }
      if (result === true) {
        Meteor.call('getPlaceOwnersAndSellers', placeId, function (err, result) {
          if (result.sellers) {
            Session.set('sellers', result.sellers);
          }
        });
      }
    });
  },
  'keypress #sellerMail': function (evt) {
    $('#sellerMail').parent().removeClass('error');
    if (evt.which === 13) {
      addSeller(this._id);
    }
  },
  'click #searchSeller': function () {
    $('#sellerMail').parent().removeClass('error');
    addSeller(this._id);
  }
});

Template.owners.onRendered(function () {
});

Template.owners.onCreated(function () {
  var template = this;
  this.subscribe('MyPlace', Router.current().params.placeId);
  Meteor.call('getPlaceOwnersAndSellers', Router.current().params.placeId, function (err, result) {
    if (result.owners) {
      Session.set('owners', result.owners);
    }
    if (result.sellers) {
      Session.set('sellers', result.sellers);
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
        Meteor.call('getPlaceOwnersAndSellers', placeId, function (err, result) {
          if (result.owners) {
            Session.set('owners', result.owners);
          }
        });
        swal('Impec', 'L\'utilisateur peux maintenant gérer vos clients avec vous.', 'success');
      }
    });
  } else {
    $('#ownerMail').parent().addClass('error');
  }
};

var addSeller = function (placeId) {
  var email = $('#sellerMail').val();
  if (validateEmail(email)) {
    Meteor.call('addSeller', email, placeId, function (error, result){
      if (error) {
        console.log('error', error);
      }
      if (result === false) {
        swal('Qui ?', 'Aucun compte ne correspond cette adresse email.', 'error');
      }
      if (result === true) {
        Meteor.call('getPlaceOwnersAndSellers', placeId, function (err, result) {
          if (result.sellers) {
            Session.set('sellers', result.sellers);
          }
        });
        swal('Impec', 'L\'utilisateur peux maintenant gérer vos clients avec vous.', 'success');
      }
    });
  } else {
    $('#sellerMail').parent().addClass('error');
  }
};
