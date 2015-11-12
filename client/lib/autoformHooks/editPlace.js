AutoForm.hooks({
  editPlace: {
    onSuccess: function (formType, result) {
      Router.go('/place/'+this.docId);
    },
  }
});
