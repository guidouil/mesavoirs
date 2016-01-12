Meteor.startup(function () {
  AutoForm.setDefaultTemplate('semanticUI');

  // Ground DB
  Ground.Collection(Meteor.users);
  Ground.Collection(CardsBrands);
  Ground.Collection(Growls);
  Ground.Collection(LoyaltyCards);
  Ground.Collection(Places);
  Ground.Collection(PrivateLoyaltyCards);
  Ground.Collection(Vouchers);
});
