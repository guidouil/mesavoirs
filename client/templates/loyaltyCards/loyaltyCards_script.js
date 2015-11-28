Template.loyaltyCards.helpers({
  loyaltyCards: function () {
    return LoyaltyCards.find({}, {sort: {name: 1, updatedAt: -1}});
  },
  privateLoyaltyCards: function () {
    return PrivateLoyaltyCards.find({}, {sort: {name: 1, updatedAt: -1}});
  },
  activeLoyaltyTab: function (tabName) {
    if (Session.equals('loyaltyTab', tabName)) {
      return 'active';
    }
  }
});

Template.loyaltyCards.events({
  'click .loyaltyTabHead': function (evt) {
    Session.set('loyaltyTab', $(evt.currentTarget).data('tab'));
  }
});

Template.loyaltyCards.onRendered(function () {
  if (! Session.get('loyaltyTab')) {
    Session.set('loyaltyTab', 'allofid');
  }
  $('#loyaltyTabs .item').tab();
});
