Template.magicPoint.helpers({
  iCanHasMagicPoint: function () {
    return Session.get('iCanHasMagicPoint');
  },
  places: function () {
    return Places.find({}, {sort: {name: 1}});
  }
});

Template.magicPoint.events({
  'click #giveMeMagicPoint': function () {
    var placeId = $('#places').val();
    check(placeId, String);
    if (placeId) {
      Meteor.call('giveMeMagicPoint', placeId, function () {
        Session.set('loyaltyTab', 'Loyali');
        Router.go('loyaltyCards');
      });
    }
  }
});

Template.magicPoint.onRendered(function () {
});

Template.magicPoint.onCreated(function () {
  if (Meteor.userId()) {
    Meteor.call('canIHasMagicPoint', function (error, result) {
      if (result) {
        Session.set('iCanHasMagicPoint', result);
      }
    });
    subs.subscribe('activePlaces');
  }
});
