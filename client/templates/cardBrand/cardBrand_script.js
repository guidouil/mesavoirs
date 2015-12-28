Template.cardBrand.helpers({
  cardBrand: function () {
    return CardsBrands.findOne({_id: Router.current().params.cardBrandId});
  },
  type: function () {
    if (Router.current().params.cardBrandId) {
      return 'update';
    } else {
      return 'insert';
    }
  }
});

Template.cardBrand.events({
});

Template.cardBrand.onCreated(function () {
  var template = this;
  template.subscribe('CardBrand', Router.current().params.cardBrandId);
});
