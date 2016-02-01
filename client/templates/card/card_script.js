Template.card.helpers({
  card: function () {
    return PrivateLoyaltyCards.findOne({_id: Router.current().params.cardId});
  },
  isQrCode: function (format) {
    return format === 'QR_CODE';
  }
});

Template.card.onRendered(function () {
  var template = this;
  setTimeout(function () {
    var canvas = template.find('#barcodeCanvas');
    if (canvas) {
      var card = PrivateLoyaltyCards.findOne({_id: Router.current().params.cardId});
      if (card && card.format !== 'QR_CODE') {
        var codeFormats = {
          'CODABAR': 'Codabar',
          'CODE_128': 'Code 128',
          'CODE_39': 'Code 39',
          'EAN_13': 'EAN-13',
          'EAN_8': 'EAN-8',
          'UPC_A': 'UPC-A',
          'ITF': 'ITF'
        };
        var format = codeFormats[card.format] || card.format; // for uknown formats
        var options = {};
        options.type = format;
        options.height = 100;
        options.maxWidth = 300;
        var g = canvas.getContext('2d');
        if (card.format === 'EAN_8' || card.format === 'EAN_13' || card.format === 'UPC_A') {
          card.code = card.code.slice(0, -1); // removing EAN or UPC validation bit
        }
        drawBarcode(g, card.code, options);
      }
    }
  }, 700);
});

Template.card.onCreated(function () {
  var template = this;
  subs.subscribe('PrivateLoyaltyCard', Router.current().params.cardId);
});
