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

Template.search.onRendered(function ( ){
  Tracker.autorun(function(){
     if (Session.get('searchQuery')) {
       Meteor.subscribe('SearchPlaces', Session.get('searchQuery'), 10);
     }
  });
});

Template.search.onCreated = function(){
  if (Router.current().params.searchQuery) {
    Meteor.subscribe('SearchPlaces', Router.current().params.searchQuery, 10);
  }
};
