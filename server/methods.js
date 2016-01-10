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
      var place = Places.findOne({_id: placeId});
      if (place.customers && _.contains( place.customers, customerId )) {
        Meteor.call('addPlaceCustomer', placeId, customerId);
      }
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
          'imageId': place.imageId,
          'histories': [history]
        };
        LoyaltyCards.insert(newLoyaltyCard);
      }
      Growls.insert({
        placeId: place._id,
        from: this.userId,
        to: customerId,
        type: 'success',
        title: place.name,
        message: '+1 point sur votre carte fidélité'
      });
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
        Growls.insert({
          placeId: place._id,
          from: this.userId,
          to: customerId,
          type: 'warning',
          title: place.name,
          message: '-1 point sur votre carte fidélité'
        });
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
      var formatedValue = function () {
        if (value > 0) {
          return '+' + parseFloat(value).toMoney(2, ',', ' ') + ' € ajouté';
        } else {
          return parseFloat(value).toMoney(2, ',', ' ') + ' € retiré';
        };
      }
      if (voucher) {
        if (value > 0 || voucher.value >= Math.abs(value)) {
          Vouchers.update({_id: voucher._id}, {
            $inc: { value: value },
            $push: { histories: history }
          });
          Growls.insert({
            placeId: place._id,
            from: this.userId,
            to: customerId,
            type: 'info',
            title: place.name,
            message: formatedValue() + ' à votre avoir'
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
          'imageId': place.imageId,
          'histories': [history]
        };
        Vouchers.insert(voucher);
        Growls.insert({
          placeId: place._id,
          from: this.userId,
          to: customerId,
          type: 'info',
          title: place.name,
          message: formatedValue() + ' à votre avoir'
        });
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
        if (customer.profile) {
          return {'email': contactEmail(customer), 'name': customer.profile.name, 'imageId': customer.profile.imageId};
        } else {
          return {'email': contactEmail(customer), 'name': '', 'imageId': ''};
        }
      }
    }
    return false;
  },
  updateLoyaltyCards: function (placeId) {
    check(placeId, String);
    if (isPlaceOwner(placeId, this.userId)) {
      var place = Places.findOne({_id: placeId});
      if (place.loyaltyCard.enabled && place.loyaltyCard.size > 0) {
        LoyaltyCards.update({placeId: placeId}, {$set:{
          'name': place.name,
          'imageId': place.imageId,
          'size': place.loyaltyCard.size
        }}, {multi: true});
      }
    }
  },
  updateVouchers: function (placeId) {
    check(placeId, String);
    if (isPlaceOwner(placeId, this.userId)) {
      var place = Places.findOne({_id: placeId});
      Vouchers.update({placeId: placeId}, {$set:{
        'name': place.name,
        'imageId': place.imageId,
      }}, {multi: true});
    }
  },
  updatePrivateLoyaltyCards: function (cardBrandId) {
    check(cardBrandId, String);
    var cardBrand = CardsBrands.findOne({_id: cardBrandId});
    if (cardBrand) {
      PrivateLoyaltyCards.update({cardBrandId: cardBrand._id}, {$set:{
        'name': cardBrand.name,
        'note': cardBrand.baseline,
        'imageId': cardBrand.imageId
      }});
    }
  },
  addPlaceCustomer: function (placeId, customerId) {
    check(placeId, String);
    check(customerId, String);
    if (isPlaceOwner(placeId, this.userId) || isPlaceSeller(placeId, this.userId)) {
      var place = Places.findOne({_id: placeId});
      if (place.customers) {
        var existingCustomer = _.find( place.customers, function (placeCustomer) {
          return placeCustomer.customerId === customerId;
        });
      }
      var customerInfo = Meteor.call('getCustomerInfo', placeId, customerId);
      var customer = {
        customerId: customerId,
        email: customerInfo.email,
        name: customerInfo.name
      };
      if (existingCustomer) { // always get fresh customer info
        Places.update({_id: placeId}, {$pull: { customers: existingCustomer }});
      }
      Places.update({_id: placeId}, {$push: { customers: customer }});
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
  },
  deleteMe: function () {
    var userId = this.userId;
    if (userId) {
      var user = Meteor.users.findOne({_id: userId});
      if (! user.profile) {
        user.profile = {};
      }
      var customer = {
        customerId: userId,
        email: user.emails[0].address,
        name: user.profile.name
      };
      Places.update({}, {$pull: {customers: customer}}, {multi: true});
      Vouchers.remove({userId: userId});
      LoyaltyCards.remove({userId: userId});
      PrivateLoyaltyCards.remove({userId: userId});
      Meteor.users.remove({_id: userId});
      return true;
    } else {
      return false;
    }
  }
});
