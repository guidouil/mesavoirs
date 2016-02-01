Template.place.helpers({
  myVoucher: function () {
    return Vouchers.findOne({userId: Meteor.userId()});
  },
  myLoyaltyCard: function () {
    return LoyaltyCards.findOne({userId: Meteor.userId()});
  },
  voucherCount: function () {
    return Counts.get('voucherCount');
  },
  loyaltyCardCount: function () {
    return Counts.get('loyaltyCardCount');
  },
  currentPlace: function () {
    var user = Meteor.user();
    if (user.profile && user.profile.currentPlace) {
      return user.profile.currentPlace === Router.current().params.placeId;
    }
  },
  place: function () {
    var place = Places.findOne({_id: Router.current().params.placeId});
    if (place) {
      Session.set('placeName', place.name);
      return place;
    }
  }
});

Template.place.events({
  'click [data-action=enablePlace]': function (evt) {
    Meteor.call('enablePlace', this._id, evt.currentTarget.checked);
  },
  'click [data-action=setCurrentPlace]': function () {
    Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.currentPlace': this._id }});
  },
  'click [data-action=voucherHistory]': function () {
    var voucher = Vouchers.findOne({userId: Meteor.userId()});
    if (voucher.histories) {
      Session.set('histories', voucher.histories);
      Session.set('historyFormat', 'formatMoney');
      $('.histories-modal').modal('show');
    }
  },
  'click [data-action=loyaltyCardHistory]': function () {
    var loyaltyCard = LoyaltyCards.findOne({userId: Meteor.userId()});
    if (loyaltyCard.histories) {
      Session.set('histories', loyaltyCard.histories);
      Session.set('historyFormat', 'formatPoint');
      $('.histories-modal').modal('show');
    }
  },
  'click .statistics': function () {
    Session.set('placeId', Router.current().params.placeId);
    Router.go('customers', {placeId: Router.current().params.placeId});
  },
  'click #toggleMyPlaceHeader': function () {
    $('#myPlaceHeader').slideToggle().toggleClass('up').toggleClass('down');
    $('#toggleMyPlaceHeader').toggleClass('up').toggleClass('down');
  },
  'click .placeMap': function () {
    Session.set('fullAdress', this.street + ', ' + this.zip + ' ' + this.city);
    Router.go('map');
  }
});

Template.place.onRendered(function () {
  setTimeout(function () {
    $('#loyaltyCardHelp').popup({
      inline: true
    });
    $('#voucherHelp').popup({
      inline: true
    });
  }, 1000);
});

Template.place.onCreated(function () {
  var template = this;
  subs.subscribe('Place', Router.current().params.placeId);
  if (Meteor.userId()) {
    subs.subscribe('placeCounts', Router.current().params.placeId);
    subs.subscribe('UserPlaceVouchers', Router.current().params.placeId, Meteor.userId());
    subs.subscribe('UserPlaceLoyaltyCard', Router.current().params.placeId, Meteor.userId());
  }
});
