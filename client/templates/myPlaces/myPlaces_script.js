Template.myPlaces.helpers({
  myPlaces: function () {
    return Places.find({$or: [{owners: Meteor.userId()}, {sellers: Meteor.userId()}]}).fetch();
  },
  currentPlace: function () {
    var user = Meteor.user();
    if (user.profile) {
      return user.profile.currentPlace === this._id;
    }
  }
});

Template.myPlaces.events({
  'click [data-action=createPlace]': function () {
    Router.go('createPlace');
  }
});

Template.myPlaces.onCreated(function () {
  subs.subscribe('MyPlaces');
  Meteor.call('isStillOwnerOrSeller');
});

Template.myPlaces.onRendered(function () {
  setTimeout(function () {
    $('#myPlacesHelp').popup({
      inline: true
    });
    setDefaultCurrentPlace();
  }, 1000);
});
