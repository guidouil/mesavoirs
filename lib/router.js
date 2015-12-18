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
  title: 'Avoirs',
  waitOn: function () {
    Meteor.subscribe('UserVouchers');
  }
});

Router.route('/loyalty-cards', {
  name: 'loyaltyCards',
  title: 'Cartes de fidélité',
  waitOn: function () {
    Meteor.subscribe('UserLoyaltyCards');
    Meteor.subscribe('PrivateLoyaltyCards');
  }
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
  onBeforeAction: function () {
    Meteor.subscribe('placeCounts', this.params.placeId);
    Meteor.subscribe('UserPlaceVouchers', this.params.placeId, Meteor.userId());
    Meteor.subscribe('UserPlaceLoyaltyCard', this.params.placeId, Meteor.userId());
    this.next();
  },
  data: function () {
    return Places.findOne({_id: this.params.placeId});
  }
});

Router.route('/customers/:placeId?', {
  name: 'customers',
  title: 'Vos clients',
  waitOn: function () {
    if (this.params.placeId) {
      return Meteor.subscribe('Place', this.params.placeId);
    } else {
      return Meteor.subscribe('MyPlaces');
    }
  },
  data: function () {
    if (this.params.placeId) {
      return Places.findOne({_id: this.params.placeId});
    }
  }
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

Router.route('/owners/:placeId', {
  name: 'owners',
  title: 'Propriétaires',
  waitOn: function () {
    return Meteor.subscribe('MyPlace', this.params.placeId);
  },
  data: function () {
    return Places.findOne({_id: this.params.placeId});
  }
});

Router.route('/addCard', {
  name: 'addCard',
  title: 'Ajouter une carte de fidélité',
  waitOn: function () {
    return Meteor.subscribe('CardsBrands');
  }
});

Router.route('/editCard/:cardId', {
  name: 'editCard',
  title: 'Editer votre carte de fidélité',
  waitOn: function () {
    Meteor.subscribe('CardsBrands');
    return Meteor.subscribe('PrivateLoyaltyCard', this.params.cardId);
  },
  data: function () {
    return PrivateLoyaltyCards.findOne({_id: this.params.cardId});
  }
});

Router.route('/card/:cardId', {
  name: 'card',
  title: 'Votre carte de fidélité',
  waitOn: function () {
    return Meteor.subscribe('PrivateLoyaltyCard', this.params.cardId);
  },
  data: function () {
    return PrivateLoyaltyCards.findOne({_id: this.params.cardId});
  }
});

Router.route('/contact', {
  name: 'contact',
  title: 'Contact'
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

Router.route('/allo', {
  name: 'allo',
  title: 'Allo'
});

Router.route('/cards-brands', {
  name: 'cardsBrands',
  title: 'Marques des cartes',
  waitOn: function () {
    return Meteor.subscribe('CardsBrands');
  }
});

Router.route('/card-brand/:cardBrandId?', {
  name: 'cardBrand',
  title: 'Marque de la carte',
  waitOn: function () {
    if (this.params.cardBrandId) {
      return Meteor.subscribe('CardBrand', this.params.cardBrandId);
    }
  },
  data: function () {
    if (this.params.cardBrandId) {
      return CardsBrands.findOne({_id: this.params.cardBrandId});
    }
  }
});

Router.plugin('ensureSignedIn', {
  only: ['profile', 'createPlace', 'placeEdit', 'myPlaces', 'admin', 'owners', 'customers', 'card', 'editCard', 'addCard', 'allo', 'cardsBrands', 'cardBrand']
});

//Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');
