Meteor.publish('Places', function (limit) {
  return Places.find({$or: [{enabled: true}, {owners: this.userId}]}, { reactive: true, sort: {createdAt: -1}, limit: limit });
});

Meteor.publish('MyPlaces', function (limit) {
  return Places.find({owners: this.userId}, { reactive: true, sort: {createdAt: -1}, limit: limit });
});

Meteor.publish('Place', function (placeId) {
  return Places.find({ _id: placeId, $or: [{enabled: true}, {owners: this.userId}] }, { reactive: true });
});

Meteor.publish('MyPlace', function (placeId) {
  return Places.find({ _id: placeId, owners: this.userId }, { reactive: true });
});

Meteor.publish('Image', function (imageId) {
  return Images.find({ _id: imageId }, { reactive: true });
});
