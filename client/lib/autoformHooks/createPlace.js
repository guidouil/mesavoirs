AutoForm.hooks({
  createPlace: {
    onSuccess: function (formType, result) {
      Meteor.call('addOwnersRole');
      Router.go('/place/'+this.docId);
    },
  }
});
