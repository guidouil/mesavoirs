Template.myPlaces.helpers({
  myPlaces: function () {
    return Places.find({owners: Meteor.userId()}).fetch();
  },
  currentPlace: function () {
    var user = Meteor.user();
    if (user.profile) {
      return user.profile.currentPlace === this._id;
    }
  }
});

Template.myPlaces.events({

});

Template.myPlaces.onRendered(function () {

});

Template.myPlaces.onCreated(function () {
  setDefaultCurrentPlace();
});
