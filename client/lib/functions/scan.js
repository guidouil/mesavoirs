scan = function () {
  cordova.plugins.barcodeScanner.scan(
    function (result) {
      if (result && result.text && result.format) {
        if (result.format !== 'QR_CODE') {
          Session.set('scanned', result.text);
          Router.go('scanned');
        } else {
          scan();
        }
      }
    },
    function (error) {
      alert('Scanning failed: ' + error);
    }
  );
};
