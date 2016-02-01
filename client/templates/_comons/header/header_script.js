Template.header.helpers({
  isNotHome: function () {
    return Router.current().route.getName() !== 'home';
  }
});

Template.header.events({
  'click [data-action=sidebar], menubutton': function () {
    if (! $('.sidebar').hasClass('visible')) {
      $('.ui.labeled.icon.sidebar')
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('toggle');
    }
  },
  'click [data-action=goHome]': function () {
    Router.go('home');
    $('html, body').animate({scrollTop: 0}, 'fast');
  },
  'click [data-action=goBack]': function () {
    window.history.back();
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
  },
  'click [data-action=profile]': function () {
    Router.go('profile');
  }
});

Template.header.onRendered(function (){

});
