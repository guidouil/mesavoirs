Template.place.helpers({
  isOwner: function () {
    return _.contains( this.owners, Meteor.userId() );
  },
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
  'click [data-action=enablePlace]': function (evt, tmpl) {
    Meteor.call('enablePlace', this._id, evt.currentTarget.checked);
  }
});

Template.place.onRendered(function () {

});

Template.place.onCreated(function () {
  this.subscribe('UserPlaceVouchers', this.data._id, Meteor.userId());
  this.subscribe('UserPlaceLoyaltyCard', this.data._id, Meteor.userId());
});
