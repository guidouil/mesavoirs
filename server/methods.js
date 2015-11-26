Meteor.methods({
  SearchPlaces: function (searchQuery, limit) {
    check(searchQuery, String);
    check(limit, Number);
    return Places.find({ enabled: true, $or: [
      {name: { $regex: searchQuery, $options: 'i' }},
      {'addresses.city': { $regex: searchQuery, $options: 'i' }},
      {'addresses.city': { $regex: searchQuery, $options: 'i' }},
      {'addresses.zip': { $regex: searchQuery, $options: 'i' }}
    ] }, { reactive: true, limit: limit }).fetch();
  },
  addOwnersRole: function () {
    if (this.userId) {
      Roles.addUsersToRoles(this.userId, ['owners']);
    }
  },
  enablePlace: function (placeId, enabled) {
    check(placeId, String);
    check(enabled, Boolean);
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
      Meteor.call('addPlaceCustomer', placeId, customerId);
      var place = Places.findOne({_id: placeId});
      var history = {what: 1, who: this.userId, when: new Date()};
      var loyaltyCard = LoyaltyCards.findOne({placeId: placeId, userId: customerId});
      var points = 0;
      if (loyaltyCard) {
        if (loyaltyCard.points === (place.loyaltyCard.size - 1)) {
          LoyaltyCards.update({_id:loyaltyCard._id}, {
            $set:{ points: points },
            $push:{ histories: history }
          });
          Meteor.call('giveVoucher', placeId, customerId, place.loyaltyCard.voucherValue);
        } else {
          LoyaltyCards.update({_id:loyaltyCard._id}, {
            $inc:{points: 1},
            $push:{ histories: history }
          });
          points = loyaltyCard.points + 1;
        }
      } else {
        points = 1;
        var newLoyaltyCard = {
          'placeId': placeId,
          'name': place.name,
          'userId': customerId,
          'points': points,
          'size': place.loyaltyCard.size,
          'creatorId': this.userId,
          'histories': [history]
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
      Meteor.call('addPlaceCustomer', placeId, customerId);
      var place = Places.findOne({_id: placeId});
      var history = {what: value, who: this.userId, when: new Date()};
      var voucher = Vouchers.findOne({ placeId: placeId, userId: customerId });
      if (voucher) {
        Vouchers.update({_id: voucher._id}, {
          $inc: { value: value },
          $push: { histories: history }
        });
        return voucher.value + value;
      } else {
        var voucher = {
          'placeId': placeId,
          'name': place.name,
          'userId': customerId,
          'creatorId': this.userId,
          'value': value,
          'available': true,
          'histories': [history]
        };
        Vouchers.insert(voucher);
        return value;
      }
    }
    return false;
  },
  useVoucher: function (placeId, voucherId, ammount) {
    check(placeId, String);
    check(voucherId, String);
    if (isPlaceOwner(placeId, this.userId)) {
      var history = {what: value, who: this.userId, when: new Date()};
      Vouchers.update({_id: voucherId}, {
        $inc: { value: ammount},
        $push: { histories: history }
      });
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
  },
  updateLoyaltyCards: function (placeId) {
    check(placeId, String);
    if (isPlaceOwner(placeId, this.userId)) {
      var place = Places.findOne({_id: placeId});
      if (place.loyaltyCard.size > 0) {
        LoyaltyCards.update({placeId: placeId}, {$set:{
          name: place.name,
          size: place.loyaltyCard.size
        }});
      }
    }
  },
  addPlaceCustomer: function (placeId, customerId) {
    check(placeId, String);
    check(customerId, String);
    if (isPlaceOwner(placeId, this.userId)) {
      var customerEmail = Meteor.call('getCustomerEmail', placeId, customerId);
      var customer = {
        customerId: customerId,
        email: customerEmail
      };
      Places.update({_id: placeId}, {$addToSet: { customers: customer }});
    }
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
  if (user.services && user.services.twitter && user.services.twitter.screenName) {
    return '@' + user.services.twitter.screenName;
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
