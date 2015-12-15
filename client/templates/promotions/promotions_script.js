Template.promotions.helpers({
  promotions: function () {
    return Promotions.find({placeId: this._id}, {sort: {start: -1, end: -1}});
  }
});

Template.promotions.events({
});

Template.promotions.onRendered(function ( ){
});
