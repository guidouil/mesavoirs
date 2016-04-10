Template.promotion.helpers({
  qrText: function () {
    return 'promoId:' + this._id;
  }
});

Template.promotion.events({
  'click [data-action=enablePromotion]': function (evt) {
    Meteor.call('enablePromotion', this._id, evt.currentTarget.checked);
  },
});

Template.promotion.onRendered(function ( ){
});
