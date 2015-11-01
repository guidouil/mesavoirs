Template.header.helpers({

});

Template.header.events({
  'click [data-action=sidebar]': function () {
    $('.ui.labeled.icon.sidebar')
      .sidebar('setting', 'transition', 'overlay')
      .sidebar('toggle');
  },
  'click [data-action=goHome]': function () {
    Router.go('home');
  },
  'click [data-action=addProduct]': function () {
    Meteor.call('insertFakeProduct');
    Router.go('list');
  },
  'click [data-action=signIn]': function () {
    Router.go('/sign-in');
  },
  'click [data-action=signOut]': function () {
    Meteor.logout();
    Router.go('/');
  }
});

Template.header.onRendered(function ( ) {
});
