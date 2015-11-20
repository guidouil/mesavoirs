Meteor.methods({
  addOwnersRole: function () {
    if (this.userId) {
      Roles.addUsersToRoles(this.userId, ['owners']);
    }
  },
  getCustomerEmail: function (placeId, customerId) {
    // check if current user is place owners
    var place = Places.findOne({_id: placeId});
    if (place && place.owners && place.owners.length >= 1) {
      if (_.contains(place.owners, this.userId)) {
        var customer = Meteor.users.findOne({_id: customerId});
        if (customer) {
          return contactEmail(customer);
        }
      }
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
  if (user.services && user.services.twitter && user.services.twitter.email) {
    return user.services.twitter.email;
  }
  return null;
};
