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

Router.route('/vounchers', {
  name: 'vounchers',
  title: 'Avoirs',
  waitOn: function () {
    handle = Meteor.subscribeWithPagination('Vounchers', 20);
  }
});

Router.route('/loyalty-cards', {
  name: 'loyaltyCards',
  title: 'Cartes de fidélité',
  waitOn: function () {
    handle = Meteor.subscribeWithPagination('LoyaltyCards', 20);
  }
});

Router.route('/profil', {
  name: 'profil',
  title: 'Profil'
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
  only: ['vounchers', 'loyaltyCards', 'profil']
});

//Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');
