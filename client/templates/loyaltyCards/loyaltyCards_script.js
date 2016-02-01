Template.loyaltyCards.helpers({
  loyaltyCards: function () {
    return LoyaltyCards.find({userId: Meteor.userId()}, {sort: {name: 1, updatedAt: -1}}).fetch();
  },
  privateLoyaltyCards: function () {
    return PrivateLoyaltyCards.find({owner: Meteor.userId()}, {sort: {name: 1, updatedAt: -1}});
  },
  activeLoyaltyTab: function (tabName) {
    if (Session.equals('loyaltyTab', tabName)) {
      return 'active';
    }
  },
  reFormat: function (format) {
    var codeFormats = {
      'QR_CODE': 'QR Code',
      'CODABAR': 'Codabar',
      'CODE_128': 'Code 128',
      'CODE_39': 'Code 39',
      'EAN_13': 'EAN-13',
      'EAN_8': 'EAN-8',
      'UPC_A': 'UPC-A',
      'ITF': 'ITF'
    };
    return codeFormats[format] || format;
  }
});

Template.loyaltyCards.events({
  'click .loyaltyTabHead': function (evt) {
    Session.set('loyaltyTab', $(evt.currentTarget).data('tab'));
  },
  'click .loyaltyCard': function () {
    Router.go('place', {placeId: this.placeId});
  },
  'click .privateLoyaltyCard': function () {
    Router.go('card', {cardId: this._id});
  },
  'click #intro': function () {
    introJs().goToStep(2).start();
  }
});

Template.loyaltyCards.onRendered(function () {
  if (! Session.get('loyaltyTab')) {
    Session.set('loyaltyTab', 'Loyali');
  }
  $('#loyaltyTabs .item').tab();
});

Template.loyaltyCards.onCreated(function () {
  var template = this;
  subs.subscribe('UserLoyaltyCards');
  subs.subscribe('PrivateLoyaltyCards');
});
