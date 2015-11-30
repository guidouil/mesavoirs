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
  }
});

Template.place.events({
  'click [data-action=enablePlace]': function (evt) {
    Meteor.call('enablePlace', this._id, evt.currentTarget.checked);
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
    Router.go('/scanned/userId');
  }
});

Template.place.onRendered(function () {

});

Template.place.onCreated(function () {
  Session.set('placeName', this.data.name);
});
