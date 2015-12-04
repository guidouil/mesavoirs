Template.myPlaces.helpers({
  myPlaces: function () {
    return Places.find({owners: Meteor.userId()}).fetch();
  }
});

Template.myPlaces.events({

});

Template.myPlaces.onRendered(function () {

});

Template.myPlaces.onCreated(function () {
  setDefaultCurrentPlace();
});
