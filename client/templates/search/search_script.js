Template.search.helpers({
  searchQuery: function () {
    return Router.current().params.searchQuery;
  },
  places: function () {
    return Places.find({}).fetch();
  }
});

Template.search.events({
  'input #searchQuery, submit #search': function (evt) {
    evt.preventDefault();
    var searchQuery = $('#searchQuery').val();
    if (searchQuery) {
      Session.set('searchQuery', searchQuery);
    }
  }
});

Template.search.onRendered(function () {
  var instance = this;
  Tracker.autorun(function () {
    if (Session.get('searchQuery')) {
      instance.subscribe('SearchPlaces', Session.get('searchQuery'), 10);
    }
  });
});

Template.search.onCreated = function () {
  if (Router.current().params.searchQuery) {
    Session.set('searchQuery', Router.current().params.searchQuery);
    this.subscribe('SearchPlaces', Router.current().params.searchQuery, 10);
  }
};

Template.search.onDestroyed(function () {
  Session.set('searchQuery', '');
});
