Template.scanned.helpers({
  scanType: function () {
    return Router.current().params.type;
  },
  scanId: function () {
    return decodeURIComponent(Router.current().params.id);
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
    if (Session.get('placeId')) {
      return Places.findOne({_id: Session.get('placeId')});
    }
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
  },
  promotion: function () {
    if (Session.get('promotionId')) {
      return Promotions.findOne({_id: Session.get('promotionId')});
    }
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
            swal('Excellent', 'L\'avoir de votre client est maintenant de ' + result + Session.get('currency'), 'success');
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
            swal('Enregistré', 'L\'avoir de votre client est maintenant de ' + result + Session.get('currency'), 'success');
            $('#voucherValue').val('');
          } else if (result && result.maxValue) {
            swal('Négatif', 'L\'avoir disponible de votre client est de ' + result.maxValue + Session.get('currency'), 'error');
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
        title: 'Êtes-vous sûr ?',
        text: 'Normalement, vous ne devez pas enlever de points à un client.',
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
  'click #addMorePoint': function () {
    $('#morePointsInput').slideToggle('fast');
  },
  'click #givePoints': function () {
    if (Session.get('placeId') && Session.get('customerId')) {
      var value = Math.abs(parseFloat($('#numberPoints').val()));
      if (value && _.isNumber(value)) {
        Meteor.call('givePoints',  Session.get('placeId'), Session.get('customerId'), value, function (error, result) {
          if (error){
            console.error(error);
          }
          if (_.isNumber(result)){
            swal('Cool', 'La carte à maintenant ' + result + ' points', 'success');
            $('#numberPoints').val('');
            $('#morePointsInput').hide();
          } else if (result && result.maxValue) {
            swal('Négatif', result.maxValue + ' points au maximum', 'error');
            $('#numberPoints').val(result.maxValue);
          }
        });
      }
    }
  },
  'click #takePoints': function () {
    if (Session.get('placeId') && Session.get('customerId')) {
      var value = Math.abs(parseFloat($('#numberPoints').val())) * -1;
      if (value && _.isNumber(value)) {
        Meteor.call('givePoints',  Session.get('placeId'), Session.get('customerId'), value, function (error, result) {
          if (error){
            console.error(error);
          }
          if (_.isNumber(result)){
            swal('Ok', 'La carte à maintenant ' + result + ' points', 'success');
            $('#numberPoints').val('');
            $('#morePointsInput').hide();
          } else if (result && result.maxValue) {
            swal('Négatif', 'Seulement ' + result.maxValue + ' points disponibles', 'error');
            $('#numberPoints').val(result.maxValue);
          }
        });
      }
    }
  },
  'click [data-action=voucherHistory]': function () {
    var voucher = Vouchers.findOne({placeId: Session.get('placeId'), userId: Session.get('customerId')});
    if (voucher.histories) {
      Session.set('histories', voucher.histories);
      Session.set('historyFormat', 'formatMoney');
      Router.go('histories');
    }
  },
  'click [data-action=loyaltyCardHistory]': function () {
    var loyaltyCard = LoyaltyCards.findOne({placeId: Session.get('placeId'), userId: Session.get('customerId')});
    if (loyaltyCard.histories) {
      Session.set('histories', loyaltyCard.histories);
      Session.set('historyFormat', 'formatPoint');
      Router.go('histories');
    }
  },
  'click #addThisCard': function () {
    Session.set('cardCode', Router.current().params.id);
    Session.set('cardFormat', Router.current().params.type);
    Router.go('addCard');
  },
  'click #applyPromotion': function () {
    Meteor.call('applyPromotion', Session.get('promotionId'), Router.current().params.id, function (error, result) {
      if(error){
        console.log('error', error);
      }
      if(result){
        Session.delete('promotionId');
      }
    });
  }
});

Template.scanned.onRendered(function () {
  $('#morePointsInput').hide();
  Tracker.autorun(function () {
    if (Session.get('placeId') && Session.get('customerId')) {
      subs.subscribe('UserPlaceVouchers', Session.get('placeId'), Session.get('customerId'));
      subs.subscribe('UserPlaceLoyaltyCard', Session.get('placeId'), Session.get('customerId'));
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
  setTimeout(function () {
    $('#loyaltyCardHelp').popup({
      inline: true
    });
  }, 1000);
});

Template.scanned.onCreated(function () {
  var template = this;
  subs.subscribe('MyPlaces');
  if (Session.equals('scanCard', true)) {
    Session.set('cardCode', Router.current().params.id);
    Session.set('cardFormat', Router.current().params.type);
    Session.delete('scanCard');
    Router.go('addCard');
  }
  var scanType = Router.current().params.type;
  if (scanType === 'placeId' && Router.current().params.id) {
    Router.go('place', {placeId: Router.current().params.id});
  }
  setDefaultCurrentPlace();
  var user = Meteor.user();
  if (user.profile && user.profile.currentPlace) {
    Session.set('placeId', user.profile.currentPlace);
    subs.subscribe('MyPlace', user.profile.currentPlace);
    var place = Places.findOne({_id: user.profile.currentPlace, $or: [{owners: Meteor.userId()}, {sellers: Meteor.userId()}]});
    if (place) {
      Session.set('placeName', place.name);
    }
  }
  if (scanType === 'userId' && Router.current().params.id) {
    Session.set('customerId', Router.current().params.id);
  }
  if (Session.get('promotionId')) {
    subs.subscribe('Promotion', Session.get('promotionId'));
  }
});

Template.scanned.onDestroyed(function () {
  Session.delete('placeId');
  Session.delete('customerId');
  Session.delete('customerEmail');
  Session.delete('customerName');
  Session.delete('customerImageId');
  Session.delete('promotionId');
});
