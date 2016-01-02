Template.customers.helpers({
  foundCustomers: function () {
    return Session.get('foundCustomers');
  },
  place: function () {
    return Places.findOne({_id: Router.current().params.placeId});
  }
});

Template.customers.events({
  'change #customer': function (evt) {
    if (evt.currentTarget.value) {
      Session.set('customerId', evt.currentTarget.value);
      Router.go('/scanned/userId/' + evt.currentTarget.value);
    }
  },
  'submit #search': function (evt) {
    evt.preventDefault();
    var searchQuery = $('#searchQuery').val();
    if (searchQuery) {
      Meteor.call('searchCustomers', this._id, searchQuery, function (error, result) {
        if (error) {
          console.log(error);
        }
        if (result) {
          Session.set('foundCustomers', result);
        }
      });
    }
  },
});

Template.customers.onRendered(function () {
  // $('select').dropdown();
  var user = Meteor.user();
  if (user.profile && user.profile.currentPlace && !Router.current().params.placeId) {
    Router.go('customers', {placeId: user.profile.currentPlace});
  }
});

Template.customers.onCreated(function () {
  var template = this;
  template.subscribe('Place', Router.current().params.placeId);
});
