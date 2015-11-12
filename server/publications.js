Meteor.publish('Products', function (limit) {
  return Products.find({ }, { reactive: true, sort: {createdAt: -1}, limit: limit });
});
Meteor.publish('Places', function (limit) {
  return Places.find({ }, { reactive: true, sort: {createdAt: -1}, limit: limit });
});

Meteor.publish('MyPlaces', function (limit) {
  return Places.find({owners: this.userId}, { reactive: true, sort: {createdAt: -1}, limit: limit });
});

Meteor.publish('Place', function (placeId) {
  return Places.find({ _id: placeId }, { reactive: true });
});


Meteor.publish('Product', function (productId) {
  return Products.find({ _id: productId }, { reactive: true });
});
