Template.placePromotions.helpers({
  promotions: function () {
    return Promotions.find({placeId: Router.current().params.placeId,  start: {$lte: new Date()}, stop: {$gte: new Date()}, enabled: true}, {sort: {start: -1, stop: -1}});
  },
  place: function () {
    return Places.findOne({_id: Router.current().params.placeId});
  }
});

Template.placePromotions.events({
});

Template.placePromotions.onRendered(function ( ){
});

Template.placePromotions.onCreated(function () {
  subs.subscribe('Place', Router.current().params.placeId);
  if (Meteor.userId()) {
    subs.subscribe('PlacePromotions', Router.current().params.placeId);
  }
});
