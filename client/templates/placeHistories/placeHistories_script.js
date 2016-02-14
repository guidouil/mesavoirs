Template.placeHistories.helpers({
  myVoucher: function () {
    return Vouchers.findOne({placeId: Router.current().params.placeId, userId: Meteor.userId()});
  },
  myLoyaltyCard: function () {
    return LoyaltyCards.findOne({placeId: Router.current().params.placeId, userId: Meteor.userId()});
  },
  place: function () {
    return Places.findOne({_id: Router.current().params.placeId});
  },
  activeHistoryTab: function (tabName) {
    if (Session.equals('historyTab', tabName)) {
      return 'active';
    }
  },
  feedIcon: function (value) {
    if (value < 0) {
      return 'minus red';
    }
    return 'plus green';
  }
});

Template.placeHistories.events({
  'click .historyTabHead': function (evt) {
    Session.set('historyTab', $(evt.currentTarget).data('tab'));
  },
});

Template.placeHistories.onRendered(function () {
  if (! Session.get('historyTab')) {
    Session.set('historyTab', 'loyalty');
  }
  $('#historyTabs .item').tab();
});

Template.placeHistories.onCreated(function () {
  subs.subscribe('Place', Router.current().params.placeId);
  if (Meteor.userId()) {
    subs.subscribe('UserPlaceVouchers', Router.current().params.placeId, Meteor.userId());
    subs.subscribe('UserPlaceLoyaltyCard', Router.current().params.placeId, Meteor.userId());
  }
});
