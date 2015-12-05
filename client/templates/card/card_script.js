Template.card.helpers({
  isQrCode: function () {
    return this.format === 'QR_CODE';
  }
});

Template.card.events({
});

Template.card.onRendered(function () {
  if (this.data.format !== 'QR_CODE') {
    var codeFormats = {
      'CODABAR': 'Codabar',
      'CODE_128': 'Code 128',
      'CODE_39': 'Code 39',
      'EAN_13': 'EAN-13',
      'EAN_8': 'EAN-8',
      'UPC_A': 'UPC-A',
      'ITF': 'ITF'
    };
    var format = codeFormats[this.data.format] || this.data.format;
    var canvas = document.getElementById('barcode-canvas');
    var options = {};
    options.type = format;
    var g = canvas.getContext('2d');
    if (this.data.format === 'EAN_13') {
      this.data.code = this.data.code.slice(0, -1);
    }
    drawBarcode(g, this.data.code, options);
  }
});
