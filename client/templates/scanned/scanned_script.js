Template.scanned.helpers({
  myPlaces: function () {
    return Places.find({}, {sort: {name: 1}}).fetch();
  },
  customerEmail: function () {
    return Session.get('customerEmail');
  },
  selectedPlace: function () {
    if (Session.equals('placeId', this._id)) {
      return 'selected';
    }
  },
  placeId: function () {
    return Session.get('placeId');
  }
});

Template.scanned.events({
});

Template.scanned.onRendered(function () {
  $('select').dropdown();
});

Template.scanned.onCreated(function () {
  if (! Session.get('myPlacesLimit')) {
    Session.set('myPlacesLimit', 10);
  }
  Meteor.subscribe('MyPlaces', Session.get('myPlacesLimit'));
  var placesCount = Places.find().count();
  if (placesCount >= 1) {
    var place = Places.findOne();
    Session.set('placeId', place._id);

  }
  var scanned = Session.get('scanned');
  if (scanned && scanned.search('userId:') === 0) {
    var temp = scanned.split(':');
    var customerId = temp[1];
    Session.set('customerId', customerId);
    Meteor.call('getCustomerEmail', Session.get('placeId'), Session.get('customerId'), function (error, result) {
      if (error) {
        console.error(error);
      }
      if (result) {
        Session.set('customerEmail', result);
      }
    });
  }
});
