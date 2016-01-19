Template.home.helpers({
  baseline: function () {
    var baselines = [
      'Fini le porte monnaie surchargé inutilement.',
      'Simplement depuis votre smartphone et en temps-réel.',
      'Vous ne perdrez plus jamais l\'avoir de la boulangerie.',
      'Parlez de Loyali aux commerçants qui sont encore à l\'ère du papier.',
      'Vous n\'oublierez plus jamais une carte de fidélité.',
      'Pour ne plus collectionner les cartes, ni les tickets dans votre porte monnaie.'
    ];
    return _.sample(baselines);
  }
});

Template.home.events({
  'click [data-action=createPlace]': function () {
    Router.go('createPlace');
  },
  'click [data-action=vouchers]': function () {
    Router.go('vouchers');
  },
  'click [data-action=loyaltyCards]': function () {
    Router.go('loyaltyCards');
  },
  'submit #search, click #searchIcon': function (evt) {
    evt.preventDefault();
    var searchQuery = $('#searchQuery').val();
    if (searchQuery) {
      Session.set('searchQuery', searchQuery);
      Router.go('search', {'searchQuery': encodeURIComponent(searchQuery)});
    }
  },
  'click [data-action=scan]': function () {
    scan();
  },
  'click #intro': function () {
    introJs().start();
  }
});

Template.home.onCreated(function () {
  var template = this;
  template.subscribe('MyPlaces');
  setDefaultCurrentPlace();
});

Template.home.onRendered(function () {
  setTimeout(function () {
    $('html, body').animate({scrollTop: 0}, 'fast');
  }, 400);
  setTimeout(function () {
    $('#createPlaceHelp').popup({
      inline: true
    });
  }, 1000);
});
