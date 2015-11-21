Router.configure({
  layoutTemplate: 'main',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading',
  templateNameConverter: 'camelCase',
  routeControllerNameConverter: 'camelCase'
});

Router.route('/', {
  name: 'home',
  title: 'Home'
});

Router.route('/vouchers', {
  name: 'vouchers',
  title: 'Avoirs',
  waitOn: function () {
    handle = Meteor.subscribe('UserVouchers');
  }
});

Router.route('/loyalty-cards', {
  name: 'loyaltyCards',
  title: 'Cartes de fidélité',
  waitOn: function () {
    handle = Meteor.subscribe('UserLoyaltyCards');
  }
});

Router.route('/profile', {
  name: 'profile',
  title: 'Profile'
});

Router.route('/scanned/:type?/:id?', {
  name: 'scanned',
  title: 'Scan',
  waitOn: function () {
    return Meteor.subscribe('MyPlaces');
  }
});

Router.route('/create-place', {
  name: 'createPlace',
  title: 'Ajouter un commerce'
});

Router.route('/my-places', {
  name: 'myPlaces',
  title: 'Mes commerces',
  waitOn: function () {
    return Meteor.subscribe('MyPlaces');
  }
});

Router.route('/place/:placeId', {
  name: 'place',
  title: 'Place',
  waitOn: function () {
    return Meteor.subscribe('Place', this.params.placeId);
  },
  data: function () {
    return Places.findOne({_id: this.params.placeId});
  }
});

Router.route('/place-edit/:placeId', {
  name: 'placeEdit',
  title: 'Edit Place',
  waitOn: function () {
    return Meteor.subscribe('MyPlace', this.params.placeId);
  },
  data: function () {
    return Places.findOne({_id: this.params.placeId});
  }
});

Router.route('/calc', {
  name: 'calc',
  title: 'Calculette'
});

Router.plugin('ensureSignedIn', {
  only: ['vouchers', 'loyaltyCards', 'profile', 'createPlace', 'scanned']
});

//Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');
