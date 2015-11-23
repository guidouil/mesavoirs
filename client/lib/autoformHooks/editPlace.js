AutoForm.hooks({
  editPlace: {
    onSuccess: function (formType, result) {
      Meteor.call('updateLoyaltyCards', this.docId);
      Router.go('/place/'+this.docId);
    },
  }
});
