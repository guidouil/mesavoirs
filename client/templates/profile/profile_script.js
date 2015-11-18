Template.profile.helpers({
  email: function () {
    return Meteor.user().emails[0].address;
  },
  myPlaces: function () {
    return Places.find({}).fetch();
  }
});

Template.profile.events({
  'click [data-action=logout]': function () {
    Meteor.logout();
  }
});

Template.profile.onRendered(function () {
  Meteor.subscribe('Images');
  if (! Session.get('myPlacesLimit')) {
    Session.set('myPlacesLimit', 10);
  }
  Meteor.subscribe('MyPlaces', Session.get('myPlacesLimit'));
});
