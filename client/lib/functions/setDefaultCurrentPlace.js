setDefaultCurrentPlace = function () {
  var user = Meteor.user();
  var myPlace = Places.findOne({ $or: [{owners: Meteor.userId()}, {sellers: Meteor.userId() }] });
  if (user && myPlace && (!user.profile || !user.profile.currentPlace)) {
    Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.currentPlace': myPlace._id }});
  }
};
