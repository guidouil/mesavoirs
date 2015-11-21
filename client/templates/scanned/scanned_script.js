Template.scanned.helpers({
  myPlaces: function () {
    return Places.find({}, {sort: {name: 1}}).fetch();
  },
  customerEmail: function () {
    return Session.get('customerEmail');
  },
  selectedPlace: function () {
    if (Session.equals('placeId', this._id)) {
      return 'selected';
    }
  },
  place: function () {
    return Places.findOne({_id: Session.get('placeId')});
  },
  userPoints: function () {
    var loyaltyCard = LoyaltyCards.findOne({placeId: Session.get('placeId'), userId: Session.get('customerId')});
    if (loyaltyCard) {
      return loyaltyCard.points || 0;
    }
    return 0;
  },
  vouchers: function () {
    return Vouchers.find({placeId: Session.get('placeId'), userId: Session.get('customerId')}).fetch();
  }
});

Template.scanned.events({
  'change #place': function (evt) {
    Session.set('placeId', evt.currentTarget.value);
  },
  'click #giveVoucher': function () {
    if (Session.get('placeId') && Session.get('customerId')) {
      var value = parseFloat($('#voucherValue').val());
      Meteor.call('giveVoucher',  Session.get('placeId'), Session.get('customerId'), value, function (error, result) {
        if (error){
          console.error(error);
        }
        if (result){
          swal('Excellent', 'Un avoir de ' + value + '€ à été remis votre client.', 'success');
        }
      });
    }
  },
  'click #useVoucher': function (evt) {
    var voucherValue = this.value;
    var voucherId = this._id;
    swal({
      title: 'Utiliser l\'avoir de ' + voucherValue + '€ ?',
      text: 'Il sera supprimé des avoirs de votre client.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      closeOnConfirm: true
    }, function () {
      Meteor.call('useVoucher', Session.get('placeId'), voucherId);
    });
  },
  'click #addOnePoint': function () {
    if (Session.get('placeId') && Session.get('customerId')) {
      Meteor.call('addOnePoint',  Session.get('placeId'), Session.get('customerId'), function (error, result) {
        if (error){
          console.error(error);
        }
        if (result){
          swal('C\'est fait', '1 point ajouté à la carte de fidélité de votre client.', 'success');
        }
      });
    }
  }
});

Template.scanned.onRendered(function () {
  $('select').dropdown();
  Tracker.autorun(function () {
    if (Session.get('placeId') && Session.get('customerId')) {
      Meteor.subscribe('UserPlaceVouchers', Session.get('placeId'), Session.get('customerId'));
      Meteor.subscribe('UserPlaceLoyaltyCard', Session.get('placeId'), Session.get('customerId'));
    }
  });
});

Template.scanned.onCreated(function () {
  var scanType = Router.current().params.type;
  var place = Places.findOne();
  if (place) {
    if (! Session.get('placeId')) {
      Session.set('placeId', place._id);
    }
    if (scanType === 'userId') {
      Session.set('customerId', Router.current().params.id);
      Meteor.call('getCustomerEmail', Session.get('placeId'), Session.get('customerId'), function (error, result) {
        if (error) {
          console.error(error);
        }
        if (result) {
          Session.set('customerEmail', result);
        }
      });
    }
  }
});
