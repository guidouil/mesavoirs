Template.home.helpers({

});

Template.home.events({
  'click [data-action=signIn]': function () {
    Router.go('/sign-in');
  },
  'click [data-action=signUp]': function () {
    Router.go('/sign-up');
  },
  'click [data-action=createPlace]': function () {
    Router.go('/create-place');
  }
});

Template.home.onRendered(function ( ){
});
