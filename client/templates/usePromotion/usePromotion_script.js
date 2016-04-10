Template.usePromotion.helpers({
  place: function () {
    return Places.findOne({_id: this.placeId});
  }
});

Template.usePromotion.events({
  'change #customer': function (evt) {
    if (evt.currentTarget.value) {
      Session.set('customerId', evt.currentTarget.value);
      Router.go('/scanned/userId/' + evt.currentTarget.value);
    }
  }
});

Template.usePromotion.onRendered(function () {
});

Template.usePromotion.onCreated(function () {
  if (this.data && this.data.placeId) {
    subs.subscribe('Place', this.data.placeId);
    Session.set('promotionId', this.data._id);
  }
});
