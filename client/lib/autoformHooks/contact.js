AutoForm.hooks({
  contact: {
    onSuccess: function (formType, result) {
      Router.go('home');
    },
  }
});
