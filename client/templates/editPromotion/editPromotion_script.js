Template.editPromotion.helpers({
  type: function () {
    if (Router.current().params.promotionId) {
      return 'update';
    } else {
      return 'insert';
    }
  }
});

Template.editPromotion.events({
});

Template.editPromotion.onRendered(function ( ){
});
