AutoForm.hooks({
  addCard: {
    onSuccess: function (formType, result) {
      Router.go('/card/'+this.docId);
    },
  }
});
