$('.pusher').on('swipe', function () {
  console.log('swipe');
  $('.ui.labeled.icon.sidebar')
    .sidebar('setting', 'transition', 'overlay')
    .sidebar('toggle');
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

/*
decimal_sep: character used as deciaml separtor, it defaults to '.' when omitted
thousands_sep: char used as thousands separator, it defaults to ',' when omitted
*/
Number.prototype.toMoney = function (decimals, decimal_sep, thousands_sep) {
  var n = this,
    c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
    d = decimal_sep || '.', //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)

    /*
    according to [http://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
    the fastest way to check for not defined parameter is to use typeof value === 'undefined'
    rather than doing value === undefined.
    */
    t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, //if you don't want to use a thousands separator you can pass empty string as thousands_sep value

    sign = (n < 0) ? '-' : '',

    //extracting the absolute value of the integer part of the number and converting to string
    i = parseInt(n = Math.abs(n).toFixed(c)) + '',

    j = ((j = i.length) > 3) ? j % 3 : 0;
  return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + '<small>' + Math.abs(n - i).toFixed(c).slice(2) + '</small>' : '');
};

UI.registerHelper('formatDate', function (date) {
  if (date !== '') {
    return moment(date).format('DD/MM/YYYY HH:mm');
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

UI.registerHelper('contactEmail', contactEmail);
