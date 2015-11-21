Meteor.methods({
  addOwnersRole: function () {
    if (this.userId) {
      Roles.addUsersToRoles(this.userId, ['owners']);
    }
  },
  enablePlace: function (placeId, enabled) {
    if (isPlaceOwner(placeId, this.userId)) {
      Places.update({_id: placeId}, {$set:{
        enabled: enabled
      }});
      return true;
    }
    return false;
  },
  addOnePoint: function (placeId, customerId) {
    if (isPlaceOwner(placeId, this.userId)) {
      var place = Places.findOne({_id: placeId});
      var loyaltyCard = LoyaltyCards.findOne({placeId: placeId, userId: customerId});
      if (loyaltyCard) {
        if (loyaltyCard.points === (place.loyaltyCard.cardSize - 1)) {
          var voucher = {
            'placeId': placeId,
            'userId': customerId,
            'creatorId': this.userId,
            'value': place.loyaltyCard.voucherValue,
            'available': true
          };
          Vouchers.insert(voucher);
          LoyaltyCards.update({_id:loyaltyCard._id}, {$set:{
            points: 0
          }});
        } else {
          LoyaltyCards.update({_id:loyaltyCard._id}, {$inc:{
            points: 1
          }});
        }
        return true;
      } else {
        var newLoyaltyCard = {
          'placeId': placeId,
          'userId': customerId,
          'points': 1,
          'creatorId': this.userId,
          'name': place.name
        };
        LoyaltyCards.insert(newLoyaltyCard);
        return true;
      }
    }
    return false;
  },
  getCustomerEmail: function (placeId, customerId) {
    if (isPlaceOwner(placeId, this.userId)) {
      var customer = Meteor.users.findOne({_id: customerId});
      if (customer) {
        return contactEmail(customer);
      }
    }
    return false;
  }
});

var contactEmail = function (user) {
  if (user.emails && user.emails.length) {
    return user.emails[0].address;
  }
  if (user.services && user.services.facebook && user.services.facebook.email) {
    return user.services.facebook.email;
  }
  if (user.services && user.services.google && user.services.google.email) {
    return user.services.google.email;
  }
  if (user.services && user.services.twitter && user.services.twitter.email) {
    return user.services.twitter.email;
  }
  return null;
};

var isPlaceOwner = function (placeId, userId) {
  // check if current user is one of the place owners
  var place = Places.findOne({_id: placeId});
  if (place && place.owners && place.owners.length >= 1) {
    if (_.contains(place.owners, userId)) {
      return true;
    }
  }
  return false;
};
