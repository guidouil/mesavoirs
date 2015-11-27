AutoForm.hooks({
  editCard: {
    onSuccess: function (formType, result) {
      Router.go('/card/'+this.docId);
    },
  }
});
