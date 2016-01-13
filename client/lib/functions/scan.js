scan = function () {
  cordova.plugins.barcodeScanner.scan(
    function (result) {
      if (result && result.text && result.format) {
        if (result.format === 'QR_CODE') {
          if (result.text.search('userId:') === 0 || result.text.search('placeId:') === 0) {
            var scanned = result.text.split(':');
            Router.go('scanned', {type: scanned[0], id: scanned[1]});
            return;
          }
        }
        Router.go('scanned', {type: result.format, id: encodeURI(result.text)});
      }
    },
    function (error) {
      alert('Scanning failed: ' + error);
    }
  );
};
