AutoForm.hooks({
  editCardBrand: {
    onSuccess: function (formType, result) {
      Meteor.call('updatePrivateLoyaltyCards', this.docId);
      Router.go('cardsBrands');
    },
  }
});
