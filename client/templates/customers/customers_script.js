Template.customers.helpers({
  foundCustomers: function () {
    return Session.get('foundCustomers');
  }
});

Template.customers.events({
  'submit #search': function (evt) {
    evt.preventDefault();
    var searchQuery = $('#searchQuery').val();
    console.log(searchQuery);
    if (searchQuery) {
      Meteor.call('searchCustomers', this._id, searchQuery, function (error, result) {
        if (error) {
          console.log(error);
        }
        if (result) {
          console.log();
          Session.set('foundCustomers', result);
        }
      });
    }
  },
});

Template.customers.onRendered(function () {
  var user = Meteor.user();
  if (user.profile && user.profile.currentPlace) {
    Router.go('customers', {placeId: user.profile.currentPlace});
  }
});

Template.customers.onCreated(function () {
  setDefaultCurrentPlace();
});
