Template.scanned.helpers({
  scanType: function () {
    return Router.current().params.type;
  },
  scanId: function () {
    return Router.current().params.id;
  },
  customerEmail: function () {
    return Session.get('customerEmail');
  },
  customerName: function () {
    return Session.get('customerName');
  },
  customerImageId: function () {
    return Session.get('customerImageId');
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
  voucher: function () {
    return Vouchers.findOne({placeId: Session.get('placeId'), userId: Session.get('customerId')});
  },
  voucherValue: function () {
    return Session.get('voucher');
  }
});

Template.scanned.events({
  'change #place': function (evt) {
    if (evt.currentTarget.value) {
      Session.set('placeId', evt.currentTarget.value);
      Session.set('placeName', $(evt.currentTarget).data('name'));
    }
  },
  'click #giveVoucher': function () {
    if (Session.get('placeId') && Session.get('customerId')) {
      var value = Math.abs(parseFloat($('#voucherValue').val()));
      if (value && _.isNumber(value)) {
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
      if (value && _.isNumber(value)) {
        Meteor.call('giveVoucher',  Session.get('placeId'), Session.get('customerId'), value, function (error, result) {
          if (error){
            console.error(error);
          }
          if (_.isNumber(result)){
            swal('Enregistré', 'L\'avoir de votre client est maintenant de ' + result + '€', 'success');
            $('#voucherValue').val('');
          } else if (result && result.maxValue) {
            swal('Négatif', 'L\'avoir disponible de votre client est de ' + result.maxValue + '€', 'error');
            $('#voucherValue').val(result.maxValue);
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
  'click #removeOnePoint': function () {
    if (Session.get('placeId') && Session.get('customerId')) {
      swal({
        title: 'Etes-vous sur ?',
        text: 'Normalement, vous ne devez pas enlever de points a un client.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
        closeOnConfirm: true
      }, function () {
        Meteor.call('removeOnePoint',  Session.get('placeId'), Session.get('customerId'), function (error, result) {
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
      });

    }
  },
  'click [data-action=voucherHistory]': function () {
    var voucher = Vouchers.findOne({userId: Session.get('customerId')});
    if (voucher.histories) {
      Session.set('histories', voucher.histories);
      Session.set('historyFormat', 'formatMoney');
      $('.histories-modal').modal('show');
    }
  },
  'click [data-action=loyaltyCardHistory]': function () {
    var loyaltyCard = LoyaltyCards.findOne({userId: Session.get('customerId')});
    if (loyaltyCard.histories) {
      Session.set('histories', loyaltyCard.histories);
      Session.set('historyFormat', 'formatPoint');
      $('.histories-modal').modal('show');
    }
  },
  'click #addThisCard': function () {
    Session.set('cardCode', Router.current().params.id);
    Session.set('cardFormat', Router.current().params.type);
    Router.go('addCard');
  }
});

Template.scanned.onRendered(function () {
  $('select').dropdown();
  Tracker.autorun(function () {
    if (Session.get('placeId') && Session.get('customerId')) {
      Meteor.subscribe('UserPlaceVouchers', Session.get('placeId'), Session.get('customerId'));
      Meteor.subscribe('UserPlaceLoyaltyCard', Session.get('placeId'), Session.get('customerId'));
      Meteor.call('getCustomerInfo', Session.get('placeId'), Session.get('customerId'), function (error, result) {
        if (error) {
          console.error(error);
        }
        if (result) {
          Session.set('customerEmail', result.email);
          Session.set('customerName', result.name);
          Session.set('customerImageId', result.imageId);
        }
      });
    }
  });
});

Template.scanned.onCreated(function () {
  var template = this;
  template.subscribe('MyPlaces');
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
  setDefaultCurrentPlace();
  var user = Meteor.user();
  if (user.profile && user.profile.currentPlace) {
    var place = Places.findOne({_id: user.profile.currentPlace, $or: [{owners: Meteor.userId()}, {sellers: Meteor.userId()}]});
    if (place) {
      Session.set('placeId', place._id);
      Session.set('placeName', place.name);
    }
  }
  if (scanType === 'userId' && Router.current().params.id) {
    Session.set('customerId', Router.current().params.id);
  }
});

Template.scanned.onDestroyed(function () {
  Session.set('placeId', null);
  Session.set('customerId', null);
  Session.set('customerEmail', null);
  Session.set('customerName', null);
  Session.set('customerImageId', null);
});
