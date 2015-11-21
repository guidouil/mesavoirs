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
    check(placeId, String);
    check(customerId, String);
    if (isPlaceOwner(placeId, this.userId)) {
      var place = Places.findOne({_id: placeId});
      var loyaltyCard = LoyaltyCards.findOne({placeId: placeId, userId: customerId});
      var points = false;
      if (loyaltyCard) {
        if (loyaltyCard.points === (place.loyaltyCard.cardSize - 1)) {
          points = 0;
          var voucher = {
            'placeId': placeId,
            'name': place.name,
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
          points = loyaltyCard.points + 1;
        }
        return true;
      } else {
        points = 1;
        var newLoyaltyCard = {
          'placeId': placeId,
          'name': place.name,
          'userId': customerId,
          'points': points,
          'creatorId': this.userId
        };
        LoyaltyCards.insert(newLoyaltyCard);
      }
    }
    return points;
  },
  giveVoucher: function (placeId, customerId, value) {
    check(placeId, String);
    check(customerId, String);
    check(value, Number);
    if (isPlaceOwner(placeId, this.userId)) {
      var place = Places.findOne({_id: placeId});
      var voucher = {
        'placeId': placeId,
        'name': place.name,
        'userId': customerId,
        'creatorId': this.userId,
        'value': value,
        'available': true
      };
      Vouchers.insert(voucher);
    }
  },
  useVoucher: function (placeId, voucherId) {
    check(placeId, String);
    check(voucherId, String);
    if (isPlaceOwner(placeId, this.userId)) {
      Vouchers.remove({_id: voucherId});
    }
  },
  getCustomerEmail: function (placeId, customerId) {
    check(placeId, String);
    check(customerId, String);
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

isPlaceOwner = function (placeId, userId) {
  // check if current user is one of the place owners
  var place = Places.findOne({_id: placeId});
  if (place && place.owners && place.owners.length >= 1) {
    if (_.contains(place.owners, userId)) {
      return true;
    }
  }
  return false;
};
