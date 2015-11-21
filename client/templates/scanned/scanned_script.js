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
  place: function () {
    return Places.findOne({_id: Session.get('placeId')});
  },
  userPoints: function () {
    var loyaltyCard = LoyaltyCards.findOne({placeId: Session.get('placeId'), userId: Session.get('customerId')});
    if (loyaltyCard) {
      return loyaltyCard.points || 0;
    }
    return 0;
  }
});

Template.scanned.events({
  'change #place': function (evt) {
    Session.set('placeId', evt.currentTarget.value);
  },
  'click #addOnePoint': function () {
    if (Session.get('placeId') && Session.get('customerId')) {
      Meteor.call('addOnePoint',  Session.get('placeId'), Session.get('customerId'), function (error, result) {
        if (error){
          console.error(error);
        }
        if (result){
          swal('Ajouté', '1 point à été ajouté à la carte de fidélité de votre client.', 'success');
        }
      });
    }
  }
});

Template.scanned.onRendered(function () {
  $('select').dropdown();
});

Template.scanned.onCreated(function () {
  var scanType = Router.current().params.type;
  var place = Places.findOne();
  if (place) {
    if (! Session.get('placeId')) {
      Session.set('placeId', place._id);
    }
    if (scanType === 'userId') {
      var userId = Router.current().params.id;
      Meteor.subscribe('UserPlaceLoyaltyCard', place._id, userId);
      Session.set('customerId', userId);
      Meteor.call('getCustomerEmail', Session.get('placeId'), Session.get('customerId'), function (error, result) {
        if (error) {
          console.error(error);
        }
        if (result) {
          Session.set('customerEmail', result);
        }
      });
    }
  }
});
