Meteor.methods({
  uploadImage: function (base64EncodedImage) {
    Future = Npm.require('fibers/future');
    let future = new Future();
    let onComplete = future.resolver();
    let fsFile = new FS.File();
    fsFile.attachData(base64EncodedImage, function(error) {
      if (error) resolve(error, null);
      Images.insert(fsFile, function (err, fileObj) {
        onComplete(null, fileObj._id);
      });
    });
    return future.wait();
  },
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
    if (isPlaceOwner(placeId, this.userId) || isPlaceSeller(placeId, this.userId)) {
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
  removeOnePoint: function (placeId, customerId) {
    check(placeId, String);
    check(customerId, String);
    if (isPlaceOwner(placeId, this.userId) || isPlaceSeller(placeId, this.userId)) {
      var history = {what: -1, who: this.userId, when: new Date()};
      var loyaltyCard = LoyaltyCards.findOne({placeId: placeId, userId: customerId});
      if (loyaltyCard && loyaltyCard.points) {
        LoyaltyCards.update({_id:loyaltyCard._id}, {
          $inc:{points: -1},
          $push:{ histories: history }
        });
        return loyaltyCard.points - 1;
      }
    }
    return false;
  },
  giveVoucher: function (placeId, customerId, value) {
    check(placeId, String);
    check(customerId, String);
    check(value, Number);
    if (isPlaceOwner(placeId, this.userId) || isPlaceSeller(placeId, this.userId)) {
      Meteor.call('addPlaceCustomer', placeId, customerId);
      var place = Places.findOne({_id: placeId});
      var history = {what: value, who: this.userId, when: new Date()};
      var voucher = Vouchers.findOne({ placeId: placeId, userId: customerId });
      if (voucher) {
        if (value > 0 || voucher.value >= Math.abs(value)) {
          Vouchers.update({_id: voucher._id}, {
            $inc: { value: value },
            $push: { histories: history }
          });
          return voucher.value + value;
        } else {
          return {maxValue: voucher.value};
        }
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
  getCustomerInfo: function (placeId, customerId) {
    check(placeId, String);
    check(customerId, String);
    if (isPlaceOwner(placeId, this.userId) || isPlaceSeller(placeId, this.userId)) {
      var customer = Meteor.users.findOne({_id: customerId});
      if (customer) {
        return {'email': contactEmail(customer), 'name': customer.profile.name, 'imageId': customer.profile.imageId};
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
    if (isPlaceOwner(placeId, this.userId) || isPlaceSeller(placeId, this.userId)) {
      var customerInfo = Meteor.call('getCustomerInfo', placeId, customerId);
      var customer = {
        customerId: customerId,
        email: customerInfo.email,
        name: customerInfo.name
      };
      Places.update({_id: placeId}, {$addToSet: { customers: customer }});
      return true;
    }
    return false;
  },
  getPlaceOwnersAndSellers: function (placeId) {
    check(placeId, String);
    if (isPlaceOwner(placeId, this.userId)) {
      var place = Places.findOne({_id: placeId});
      var owners = [];
      _.each(place.owners, function (ownerId) {
        var owner = Meteor.users.findOne({_id: ownerId});
        owners.push({
          userId: ownerId,
          email: contactEmail(owner)
        });
      });
      var sellers = [];
      if (place.sellers) {
        _.each(place.sellers, function (sellerId) {
          var seller = Meteor.users.findOne({_id: sellerId});
          sellers.push({
            userId: sellerId,
            email: contactEmail(seller)
          });
        });
      }
      return {'owners': owners, 'sellers': sellers};
    }
    return false;
  },
  giveOrwnership: function (email, placeId) {
    check(email, String);
    check(placeId, String);
    if (isPlaceOwner(placeId, this.userId)) {
      var owner = Meteor.users.findOne({$or:[
        { 'emails.address': email },
        { 'user.services.facebook.email': email },
        { 'user.services.google.email': email }
      ]});
      if (owner) {
        Places.update({_id: placeId}, {$addToSet: {
          owners: owner._id
        }});
        Roles.addUsersToRoles(owner._id, ['owners']);
        return true;
      }
      return false;
    }
  },
  removeOwnership: function (ownerId, placeId) {
    check(ownerId, String);
    check(placeId, String);
    if (isPlaceOwner(placeId, this.userId)) {
      Places.update({_id: placeId}, {$pull: {
        owners: ownerId
      }});
      return true;
    }
    return false;
  },
  removeOwnersRole: function () {
    Roles.removeUsersFromRoles(this.userId, 'owners');
  },
  addSeller: function (email, placeId) {
    check(email, String);
    check(placeId, String);
    if (isPlaceOwner(placeId, this.userId)) {
      var seller = Meteor.users.findOne({$or:[
        { 'emails.address': email },
        { 'user.services.facebook.email': email },
        { 'user.services.google.email': email }
      ]});
      if (seller) {
        Places.update({_id: placeId}, {$addToSet: {
          sellers: seller._id
        }});
        Roles.addUsersToRoles(seller._id, ['sellers']);
        return true;
      }
      return false;
    }
  },
  removeSeller: function (sellerId, placeId) {
    check(sellerId, String);
    check(placeId, String);
    if (isPlaceOwner(placeId, this.userId)) {
      Places.update({_id: placeId}, {$pull: {
        sellers: sellerId
      }});
      return true;
    }
    return false;
  },
  removeSellersRole: function () {
    Roles.removeUsersFromRoles(this.userId, 'sellers');
  },
  searchCustomers: function (placeId, searchQuery) {
    check(placeId, String);
    check(searchQuery, String);
    if (isPlaceOwner(placeId, this.userId) || isPlaceSeller(placeId, this.userId)) {
      var place = Places.findOne({_id: placeId});
      if (place.customers) {
        var customerIds = [];
        _.each( place.customers, function (customer) {
          customerIds.push(customer.customerId);
        });
        return Meteor.users.find({ _id: { $in: customerIds }, $or: [
          {'profile.name': { $regex: searchQuery, $options: 'i' }},
          {'emails.0.address': { $regex: searchQuery, $options: 'i' }},
          {'services.facebook.email': { $regex: searchQuery, $options: 'i' }},
          {'services.google.email': { $regex: searchQuery, $options: 'i' }},
          {'services.twitter.screenName': { $regex: searchQuery, $options: 'i' }}
        ]}).fetch();
      }
    }
  },
  deleteLoyaltyCardsAndVouchers: function (placeId) {
    check(placeId, String);
    if (isPlaceOwner(placeId, this.userId)) {
      LoyaltyCards.remove({placeId: placeId}, {multi: true});
      Vouchers.remove({placeId: placeId}, {multi: true});
    }
  }
});

// global for publication
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

isPlaceSeller = function (placeId, userId) {
  // check if current user is one of the place sellers
  var place = Places.findOne({_id: placeId});
  if (place && place.sellers && place.sellers.length >= 1) {
    if (_.contains(place.sellers, userId)) {
      return true;
    }
  }
  return false;
};
