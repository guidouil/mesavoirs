Template.searchInput.helpers({
  searchQuery: function () {
    return Router.current().params.searchQuery;
  }
});

Template.searchInput.events({
  'submit #search, click #searchIcon': function (evt) {
    evt.preventDefault();
    var searchQuery = $('#searchQuery').val();
    if (searchQuery) {
      Session.set('searchQuery', searchQuery);
      Router.go('search', {'searchQuery': encodeURIComponent(searchQuery)});
    }
  },
});

Template.searchInput.onRendered(function ( ){
});
