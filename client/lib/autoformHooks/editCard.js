AutoForm.hooks({
  editCard: {
    onSuccess: function (formType, result) {
      Session.set('cardBrand', false);
      Router.go('/card/'+this.docId);
    },
  }
});
