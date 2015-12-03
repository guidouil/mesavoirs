Template.home.helpers({

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
  }
});

Template.home.onRendered(function () {
  var homePhrases = [
    'Pour ne plus collectionner les cartes de fidelité, ni les petits papiers dans votre porte monnaie.',
    'Fini le porte monnaie surchargé',
    'Une seule carte de fidélité pour les gouverner toutes',
    'Vous ne perdrez plus jamais l\'avoir de la boulangerie de la pause du midi',
    'simplement et en temps-réel'
  ];
});
