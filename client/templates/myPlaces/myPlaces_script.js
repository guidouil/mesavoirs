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
  var template = this;
  template.subscribe('MyPlaces');
  Meteor.call('isStillOwnerOrSeller');
});

Template.myPlaces.onRendered(function () {
  var template = this;
  Tracker.autorun(function () {
    if (template.subscriptionsReady()) {
      setDefaultCurrentPlace();
    }
  });
});
