Template.home.helpers({

});

Template.home.events({
  'click [data-action=signIn]': function () {
    Router.go('/sign-in');
  },
  'click [data-action=signUp]': function () {
    Router.go('/sign-up');
  }
});

Template.home.onRendered(function ( ){
});
