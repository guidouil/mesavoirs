AutoForm.hooks({
  editPromotion: {
    onSuccess: function (formType, result) {
      Router.go('promotion', {promotionId: this.docId});
    },
  }
});
