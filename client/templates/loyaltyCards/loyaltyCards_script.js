Template.loyaltyCards.helpers({
  loyaltyCards: function () {
    return LoyaltyCards.find({}, {sort: {name: 1, updatedAt: -1}});
  }
});

Template.loyaltyCards.events({
});

Template.loyaltyCards.onRendered(function () {
});
