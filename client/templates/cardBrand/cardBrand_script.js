Template.cardBrand.helpers({
  type: function () {
    if (Router.current().params.cardBrandId) {
      return 'update';
    } else {
      return 'insert';
    }
  }
});

Template.cardBrand.events({
});

Template.cardBrand.onRendered(function ( ){
});
