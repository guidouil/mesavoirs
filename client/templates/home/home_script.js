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
  }
});

Template.home.onRendered(function ( ){
});
