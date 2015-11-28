Template.scanned.helpers({
  scanType: function () {
    return Router.current().params.type;
  },
  scanId: function () {
    return Router.current().params.id;
  },
  myPlaces: function () {
    return Places.find({}, {sort: {name: 1}}).fetch();
  },
  customerEmail: function () {
    return Session.get('customerEmail');
  },
  selectedPlace: function () {
    if (this._id && Session.equals('placeId', this._id)) {
      return 'selected';
    }
  },
  selectedCustomer: function () {
    if (this._id && Session.equals('customerId', this._id)) {
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
  loyaltyCardDate: function () {
    var loyaltyCard = LoyaltyCards.findOne({placeId: Session.get('placeId'), userId: Session.get('customerId')});
    if (loyaltyCard) {
      return loyaltyCard.updatedAt || loyaltyCard.createdAt;
    }
  },
  vouchers: function () {
    return Vouchers.find({placeId: Session.get('placeId'), userId: Session.get('customerId')}).fetch();
  }
});

Template.scanned.events({
  'change #place': function (evt) {
    if (evt.currentTarget.value) {
      Session.set('placeId', evt.currentTarget.value);
    }
  },
  'change #customer': function (evt) {
    if (evt.currentTarget.value) {
      Session.set('customerId', evt.currentTarget.value);
      Router.go('/scanned/userId/' + evt.currentTarget.value);
    }
  },
  'click #giveVoucher': function () {
    if (Session.get('placeId') && Session.get('customerId')) {
      var value = Math.abs(parseFloat($('#voucherValue').val()));
      if (_.isNumber(value)) {
        Meteor.call('giveVoucher',  Session.get('placeId'), Session.get('customerId'), value, function (error, result) {
          if (error){
            console.error(error);
          }
          if (_.isNumber(result)){
            swal('Excellent', 'L\'avoir de votre client est maintenant de ' + result + '€', 'success');
            $('#voucherValue').val('');
          }
        });
      }
    }
  },
  'click #takeVoucher': function () {
    if (Session.get('placeId') && Session.get('customerId')) {
      var value = Math.abs(parseFloat($('#voucherValue').val())) * -1;
      if (_.isNumber(value)) {
        Meteor.call('giveVoucher',  Session.get('placeId'), Session.get('customerId'), value, function (error, result) {
          if (error){
            console.error(error);
          }
          if (_.isNumber(result)){
            swal('Splendide', 'L\'avoir de votre client est maintenant de ' + result + '€', 'success');
            $('#voucherValue').val('');
          }
        });
      }
    }
  },
  'click #addOnePoint': function () {
    if (Session.get('placeId') && Session.get('customerId')) {
      Meteor.call('addOnePoint',  Session.get('placeId'), Session.get('customerId'), function (error, result) {
        if (error){
          console.error(error);
        }
        if (_.isNumber(result)){
          var pointLabel = ' point';
          if (result > 1) {
            pointLabel = pointLabel + 's';
          }
          swal('C\'est fait', 'La carte de fidélité de votre client a maintenant ' + result + pointLabel, 'success');
        }
      });
    }
  },
  'click #addThisCard': function () {
    Session.set('cardCode', Router.current().params.id);
    Session.set('cardFormat', Router.current().params.type);
    Router.go('addCard');
  }
});

Template.scanned.onRendered(function () {
  var instance = this;
  $('select').dropdown();
  Tracker.autorun(function () {
    if (Session.get('placeId') && Session.get('customerId')) {
      instance.subscribe('UserPlaceVouchers', Session.get('placeId'), Session.get('customerId'));
      instance.subscribe('UserPlaceLoyaltyCard', Session.get('placeId'), Session.get('customerId'));
      Meteor.call('getCustomerEmail', Session.get('placeId'), Session.get('customerId'), function (error, result) {
        if (error) {
          console.error(error);
        }
        if (result) {
          Session.set('customerEmail', result);
        }
      });
    }
  });
});

Template.scanned.onCreated(function () {
  if (Session.equals('scanCard', true)) {
    Session.set('cardCode', Router.current().params.id);
    Session.set('cardFormat', Router.current().params.type);
    Session.set('scanCard', false);
    Router.go('addCard');
  }
  var scanType = Router.current().params.type;
  if (scanType === 'placeId' && Router.current().params.id) {
    Router.go('place', {placeId: Router.current().params.id});
  }
  var place = Places.findOne();
  if (place) {
    if (! Session.get('placeId')) {
      Session.set('placeId', place._id);
      if (place.customers && place.customers.length === 1 && scanType === 'userId' && !Router.current().params.id) {
        Session.set('customerId', place.customers[0].customerId);
      }
    }
    if (scanType === 'userId' && Router.current().params.id) {
      Session.set('customerId', Router.current().params.id);
    }
  }
});

Template.scanned.onDestroyed(function () {
  Session.set('placeId', null);
  Session.set('customerId', null);
  Session.set('customerEmail', null);
});
