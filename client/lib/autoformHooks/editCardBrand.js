AutoForm.hooks({
  editCardBrand: {
    onSuccess: function (formType, result) {
      Router.go('cardsBrands');
    },
  }
});
