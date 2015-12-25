Template.loyaltyCards.helpers({
  loyaltyCards: function () {
    return LoyaltyCards.find({}, {sort: {name: 1, updatedAt: -1}});
  },
  privateLoyaltyCards: function () {
    return PrivateLoyaltyCards.find({}, {sort: {name: 1, updatedAt: -1}});
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
  }
});

Template.loyaltyCards.onRendered(function () {
  if (! Session.get('loyaltyTab')) {
    Session.set('loyaltyTab', 'allofid');
  }
  $('#loyaltyTabs .item').tab();
});

Template.loyaltyCards.onCreated(function () {
  var template = this;
  template.subscribe('UserLoyaltyCards');
  template.subscribe('PrivateLoyaltyCards');
});
