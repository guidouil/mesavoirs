Template.search.helpers({
  places: function () {
    return Session.get('searchResults');
  }
});

Template.search.onRendered(function () {
  Tracker.autorun(function () {
    if (Session.get('searchQuery')) {
      Meteor.call('SearchPlaces', Session.get('searchQuery'), parseInt(Session.get('searchLimit')), function (error, results) {
        if (error) {
          console.error(error);
        }
        if (results ){
          Session.set('searchResults', results);
        }
      });
    }
  });
});

Template.search.onCreated = function () {
  Session.set('searchLimit', 12);
  if (Router.current().params.searchQuery) {
    Session.set('searchQuery', Router.current().params.searchQuery);
  }
};

Template.search.onDestroyed(function () {
  // Session.set('searchQuery', '');
  // Session.set('searchResults', '');
  // Session.set('searchLimit', '');
});
