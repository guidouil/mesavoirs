setDefaultCurrentPlace = function () {
  var user = Meteor.user();
  var myPlace = Places.findOne({ $or: [{owners: Meteor.userId()}, {sellers: Meteor.userId() }] });
  if ((!user.profile || !user.profile.currentPlace) && myPlace) {
    Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.currentPlace': myPlace._id }});
  }
  // clean forgoten roles
  if (!myPlace && Roles.userIsInRole(Meteor.userId(), ['sellers', 'owners'])) {
    Meteor.call('removeOwnersRole');
    Meteor.call('removeSellersRole');
  }
};
