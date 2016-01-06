Template.home.helpers({
  baseline: function () {
    var baselines = [
      'Pour ne plus collectionner les cartes, ni les tickets dans votre porte monnaie',
      'Fini le porte monnaie surchargé inutilement',
      'Une carte de fidélité pour les gouverner toutes',
      'Vous ne perdrez plus jamais l\'avoir de la boulangerie',
      'Simplement depuis votre smartphone et en temps-réel',
      'Parlez de loyali aux commerçants qui sont encore à l\'air du papier',
      'Vous n\'oublierez plus jamais une carte de fidélité'
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
  'submit #search': function (evt) {
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
