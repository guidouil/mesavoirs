AutoForm.hooks({
  addCard: {
    onSuccess: function (formType, result) {
      Session.set('loyaltyTab', 'private');
      Router.go('/card/'+this.docId);
    },
  }
});
