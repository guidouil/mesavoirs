setDefaultCurrentPlace = function () {
  var user = Meteor.user();
  if (!user.profile || !user.profile.currentPlace) {
    var myPlace = Places.findOne({ $or: [{owners: Meteor.userId()}, {sellers: Meteor.userId() }] });
    if (myPlace) {
      Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.currentPlace': myPlace._id }});
    }
  }
};
