AutoForm.hooks({
  createPlace: {
    onSuccess: function (formType, result) {
      Meteor.call('addOwnersRole');
      setDefaultCurrentPlace();
      Router.go('myPlaces');
    },
  }
});
