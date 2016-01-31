AutoForm.hooks({
  createPlace: {
    onSuccess: function (formType, result) {
      Meteor.call('addOwnersRole');
      Router.go('placeEdit', {placeId: this.docId});
    },
  }
});
