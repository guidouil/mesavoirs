Template.editCard.helpers({
  card: function () {
    return PrivateLoyaltyCards.findOne({_id: Router.current().params.cardId});
  }
});

Template.editCard.events({
});

Template.editCard.onCreated(function () {
  var template = this;
  template.subscribe('CardsBrands');
  template.subscribe('PrivateLoyaltyCard', Router.current().params.cardId);
});
