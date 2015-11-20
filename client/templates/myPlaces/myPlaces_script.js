Template.myPlaces.helpers({
  myPlaces: function () {
    return Places.find({}).fetch();
  }
});

Template.myPlaces.events({
});

Template.myPlaces.onRendered(function () {
});

Template.myPlaces.onCreated(function () {
  if (! Session.get('myPlacesLimit')) {
    Session.set('myPlacesLimit', 10);
  }
  Meteor.subscribe('MyPlaces', Session.get('myPlacesLimit'));
});
