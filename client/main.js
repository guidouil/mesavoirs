Template.registerHelper('loyaliLogo', function () {
  return Meteor.absoluteUrl() + 'loyali_150.png';
});

UI.registerHelper('isConnected', function () {
  return Meteor.userId();
});

UI.registerHelper('isOwner', function () {
  return _.contains( this.owners, Meteor.userId() );
});

UI.registerHelper('isPlaceOwner', function (placeId) {
  var place = Places.findOne({_id: placeId});
  if (place) {
    return _.contains( place.owners, Meteor.userId() );
  }
});

UI.registerHelper('isSellerOrOwner', function () {
  return _.contains( this.owners, Meteor.userId() ) || _.contains( this.sellers, Meteor.userId() );
});

UI.registerHelper('isSellerOrOwnerRole', function () {
  return Roles.userIsInRole(Meteor.userId(), ['sellers', 'owners']);
});

UI.registerHelper('isMobile', function () {
  return Meteor.isCordova;
});

UI.registerHelper('getImage', function (imageUrl) {
  return imageUrl || '/default-image.png';
});

UI.registerHelper('formatMoney', function (value) {
  if (isNumeric(value)) {
    switch (Session.get('language')) {
    case 'en' :
      return '€' + parseFloat(value).toMoney(2, '.', ',');
      break;
    case 'fr' :
    default :
      return parseFloat(value).toMoney(2, ',', ' ') + ' €';
    }
  }
});

function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

UI.registerHelper('today', function () {
  return moment().unix();
});

UI.registerHelper('formatDate', function (date) {
  if (date !== '') {
    return moment(date).format('DD/MM/YYYY HH:mm');
  }
});

UI.registerHelper('longFormatDate', function (date) {
  if (date !== '') {
    return moment(date).format('LLLL');
  }
});

UI.registerHelper('calendarDate', function (date) {
  if (date !== '') {
    return moment(date).calendar();
  }
});

UI.registerHelper('fromNow', function (date) {
  if (date !== null) {
    moment.locale('fr');
    return moment(date).fromNow();
  }
});

UI.registerHelper('truncateString', function (stringToShorten, maxCharsAmount) {
  if (stringToShorten && stringToShorten.length > maxCharsAmount) {
    return stringToShorten.substring(0, maxCharsAmount) + '...';
  }
  return stringToShorten;
});

UI.registerHelper('greaterThan', function (a, b) {
  return a > b;
});

UI.registerHelper('equals', function (a, b) {
  return a === b;
});

UI.registerHelper('lte', function (a, b) {
  return a <= b;
});

UI.registerHelper('gte', function (a, b) {
  return a >= b;
});

UI.registerHelper('gt', function (a, b) {
  return a > b;
});

UI.registerHelper('or', function (a, b) {
  return a || b;
});

UI.registerHelper('sortArray', function (array, sortKey) {
  return _.sortBy( array, sortKey);
});

UI.registerHelper('reverseArray', function (array) {
  return array.reverse();
});

UI.registerHelper('trimProtocol', function (url) {
  if (url && url.search('') !== -1) {
    url = url.split('//');
    return url[1];
  }
});

UI.registerHelper('contactEmail', contactEmail);
