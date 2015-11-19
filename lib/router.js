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

Router.route('/list', {
  name: 'list',
  title: 'List',
  waitOn: function () {
    handle = Meteor.subscribeWithPagination('Products', 20);
  }
});

Router.route('/vouchers', {
  name: 'vouchers',
  title: 'Avoirs',
  waitOn: function () {
    handle = Meteor.subscribeWithPagination('Vouchers', 20);
  }
});

Router.route('/loyalty-cards', {
  name: 'loyaltyCards',
  title: 'Cartes de fidélité',
  waitOn: function () {
    handle = Meteor.subscribeWithPagination('LoyaltyCards', 20);
  }
});

Router.route('/profile', {
  name: 'profile',
  title: 'Profile'
});

Router.route('/scanned', {
  name: 'scanned',
  title: 'Scan'
});

Router.route('/create-place', {
  name: 'createPlace',
  title: 'Ajouter un commerce'
});

Router.route('/my-places', {
  name: 'myPlaces',
  title: 'Mes commerces'
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
    return Meteor.subscribe('Place', this.params.placeId);
  },
  data: function () {
    return Places.findOne({_id: this.params.placeId});
  }
});

Router.route('/calc', {
  name: 'calc',
  title: 'Calculette'
});

Router.route('/edit/:productId', {
  name: 'edit',
  title: 'Edit',
  waitOn: function () {
    return Meteor.subscribe('Product', this.params.productId);
  },
  data: function () {
    return Products.findOne({_id: this.params.productId});
  }
});

Router.plugin('ensureSignedIn', {
  only: ['vouchers', 'loyaltyCards', 'profile', 'createPlace']
});

//Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');
