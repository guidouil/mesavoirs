Meteor.publish('Places', function (limit) {
  check(limit, Number);
  return Places.find({$or: [{enabled: true}, {owners: this.userId}, {sellers: this.userId}]}, { reactive: true, sort: {createdAt: -1}, limit: limit });
});

Meteor.publish('activePlaces', function () {
  return Places.find({enabled: true}, {fields: {name: 1, 'addresses.city': 1}} );
});

Meteor.publish('MyPlaces', function () {
  return Places.find({$or: [{owners: this.userId}, {sellers: this.userId}]}, { reactive: true, sort: {createdAt: -1} });
});

Meteor.publish('Place', function (placeId) {
  check(placeId, String);
  return Places.find({ _id: placeId, $or: [{enabled: true}, {owners: this.userId}, {sellers: this.userId}] }, { reactive: true });
});

Meteor.publish('MyPlace', function (placeId) {
  check(placeId, String);
  return Places.find({ _id: placeId, $or: [{owners: this.userId}, {sellers: this.userId}] }, { reactive: true });
});

Meteor.publish('SearchPlaces', function (searchQuery, limit) {
  check(searchQuery, String);
  check(limit, Number);
  return Places.find({ enabled: true, $or: [
    {name: { $regex: searchQuery, $options: 'i' }},
    {'addresses.city': { $regex: searchQuery, $options: 'i' }},
    {'addresses.city': { $regex: searchQuery, $options: 'i' }},
    {'addresses.zip': { $regex: searchQuery, $options: 'i' }}
  ] }, { reactive: true, limit: limit });
});

Meteor.publish('Image', function (imageId) {
  check(imageId, String);
  return Images.find({ _id: imageId }, { reactive: true });
});

Meteor.publish('UserPlaceVouchers', function (placeId, userId) {
  check(placeId, String);
  check(userId, String);
  if (isPlaceOwner(placeId, this.userId) || isPlaceSeller(placeId, this.userId) || userId === this.userId) {
    return Vouchers.find({ placeId: placeId, userId: userId });
  }
});

Meteor.publish('PlaceVouchers', function (placeId) {
  check(placeId, String);
  if (isPlaceOwner(placeId, this.userId)) {
    return Vouchers.find({ placeId: placeId });
  }
});

Meteor.publish('UserVouchers', function () {
  return Vouchers.find({ userId: this.userId });
});

Meteor.publish('UserPlaceLoyaltyCard', function (placeId, userId) {
  check(placeId, String);
  check(userId, String);
  if (isPlaceOwner(placeId, this.userId) || isPlaceSeller(placeId, this.userId) || userId === this.userId) {
    return LoyaltyCards.find({ placeId: placeId, userId: userId });
  }
});

Meteor.publish('PlaceLoyaltyCards', function (placeId) {
  check(placeId, String);
  if (isPlaceOwner(placeId, this.userId)) {
    return LoyaltyCards.find({ placeId: placeId });
  }
});

Meteor.publish('UserLoyaltyCards', function () {
  return LoyaltyCards.find({ userId: this.userId });
});

Meteor.publish('PrivateLoyaltyCards', function () {
  return PrivateLoyaltyCards.find({ owner: this.userId });
});

Meteor.publish('PrivateLoyaltyCard', function (cardId) {
  check(cardId, String);
  return PrivateLoyaltyCards.find({ _id: cardId, owner: this.userId });
});

Meteor.publish('CardsBrands', function () {
  return CardsBrands.find({}, {sort: {name: 1}});
});

Meteor.publish('Contacts', function () {
  if (Roles.userIsInRole(this.userId, ['bo'])) {
    return Contacts.find({}, {sort: {name: 1}});
  }
});

Meteor.publish('CardBrand', function (cardBrandId) {
  check(cardBrandId, String);
  return CardsBrands.find({ _id: cardBrandId }, { reactive: true });
});

Meteor.publish('Promotions', function (placeId) {
  check(placeId, String);
  if (isPlaceOwner(placeId, this.userId) || isPlaceSeller(placeId, this.userId)) {
    return Promotions.find({placeId: placeId}, {sort: {start: -1, stop: -1}});
  }
});

Meteor.publish('PlacePromotions', function (placeId) {
  check(placeId, String);
  return Promotions.find({placeId: placeId,  start: {$lte: new Date()}, stop: {$gte: new Date()}, enabled: true}, {sort: {start: -1, stop: -1}});
});

Meteor.publish('Promotion', function (promotionId) {
  check(promotionId, String);
  return Promotions.find({ _id: promotionId }, { reactive: true });
});


Meteor.publish('Growls', function () {
  return Growls.find({ to: this.userId });
});
