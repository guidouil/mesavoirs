AutoForm.hooks({
  createPlace: {
    onSuccess: function (formType, result) {
      Router.go('profile');
    },
  }
});
