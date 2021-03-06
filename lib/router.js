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

Router.route('/search/:searchQuery?', {
  name: 'search',
  title: 'Search'
});

Router.route('/vouchers', {
  name: 'vouchers',
  title: 'Avoirs'
});

Router.route('/loyalty-cards', {
  name: 'loyaltyCards',
  title: 'Cartes de fidélité'
});

Router.route('/profile', {
  name: 'profile',
  title: 'Profile'
});

Router.route('/edit-profile', {
  name: 'editProfile',
  title: 'Editer votre profile'
});

Router.route('/scanned/:type?/:id?', {
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
  title: 'Place'
});

Router.route('/placeHistories/:placeId', {
  name: 'placeHistories',
  title: 'placeHistories'
});

Router.route('/placePromotions/:placeId', {
  name: 'placePromotions',
  title: 'placePromotions'
});

Router.route('/histories', {
  name: 'histories',
  title: 'Historiques'
});

Router.route('/customers/:placeId?', {
  name: 'customers',
  title: 'Vos clients'
});

Router.route('/promotions/:placeId?', {
  name: 'promotions',
  title: 'Les promotions',
  waitOn: function () {
    Meteor.subscribe('Promotions', this.params.placeId);
    return Meteor.subscribe('Place', this.params.placeId);
  },
  data: function () {
    return Places.findOne({_id: this.params.placeId});
  }
});

Router.route('/promotion/:promotionId', {
  name: 'promotion',
  title: 'Promotion',
  waitOn: function () {
    Meteor.subscribe('MyPlaces');
    return Meteor.subscribe('Promotion', this.params.promotionId);
  },
  data: function () {
    return Promotions.findOne({_id: this.params.promotionId});
  }
});

Router.route('/edit-promotion/:promotionId?', {
  name: 'editPromotion',
  title: 'Promotion',
  waitOn: function () {
    if (this.params.promotionId) {
      return Meteor.subscribe('Promotion', this.params.promotionId);
    }
  },
  data: function () {
    if (this.params.promotionId) {
      return Promotions.findOne({_id: this.params.promotionId});
    }
  }
});

Router.route('/use-promotion/:promotionId', {
  name: 'usePromotion',
  title: 'Use Promotion',
  waitOn: function () {
    if (this.params.promotionId) {
      return Meteor.subscribe('Promotion', this.params.promotionId);
    }
  },
  data: function () {
    return Promotions.findOne({_id: this.params.promotionId});
  }
});

Router.route('/place-edit/:placeId', {
  name: 'placeEdit',
  title: 'Edit Place'
});

Router.route('/owners/:placeId', {
  name: 'owners',
  title: 'Propriétaires'
});

Router.route('/magic-point', {
  name: 'magicPoint',
  title: 'magicPoint'
});

Router.route('/addCard', {
  name: 'addCard',
  title: 'Ajouter une carte de fidélité'
});

Router.route('/editCard/:cardId', {
  name: 'editCard',
  title: 'Editer votre carte de fidélité'
});

Router.route('/card/:cardId', {
  name: 'card',
  title: 'Votre carte de fidélité'
});

Router.route('/cropper', {
  name: 'cropper',
  title: 'Cropper'
});

Router.route('/contact', {
  name: 'contact',
  title: 'Contact'
});

Router.route('/contacts', {
  name: 'contacts',
  title: 'Contacts'
});

Router.route('/about', {
  name: 'about',
  title: 'À propos'
});

Router.route('/calc', {
  name: 'calc',
  title: 'Calculette'
});

Router.route('/map', {
  name: 'map',
  title: 'Carte'
});

Router.route('/promote', {
  name: 'promote',
  title: 'Inscrire votre commerce'
});

Router.route('/terms-of-use', {
  name: 'termsOfUse',
  title: 'C.G.U.'
});

Router.route('/bo', {
  name: 'bo',
  title: 'BO'
});

Router.route('/cards-brands', {
  name: 'cardsBrands',
  title: 'Marques des cartes'
});

Router.route('/card-brand/:cardBrandId?', {
  name: 'cardBrand',
  title: 'Marque de la carte'
});

Router.plugin('ensureSignedIn', {
  only: ['profile', 'createPlace', 'placeEdit', 'myPlaces', 'admin', 'owners', 'customers', 'card', 'editCard', 'addCard', 'bo', 'cardsBrands', 'cardBrand']
});

//Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');
