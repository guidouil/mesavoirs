AutoForm.hooks({
  contact: {
    onSuccess: function (formType, result) {
      Growls.insert({
        to: Meteor.userId(),
        type: 'success',
        message: 'Votre message à bien été envoyé'
      });
      Router.go('home');
    },
  }
});
