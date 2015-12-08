Template.map.helpers({
  exampleMapOptions: function () {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // get long lat fron Geocoder
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': Session.get('fullAdress')}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          Session.set('lat', results[0].geometry.location.lat());
          Session.set('lng', results[0].geometry.location.lng());
        }
      });
      // Map initialization options
      if (Session.get('lat') && Session.get('lng')) {
        return {
          center: new google.maps.LatLng(Session.get('lat'), Session.get('lng')),
          zoom: 15
        };
      }
    }
  }
});

Template.map.events({
  'click #back': function () {
    window.history.back();
  }
});

Template.map.onRendered(function () {
  GoogleMaps.load();
});

Template.map.onCreated(function () {
  GoogleMaps.ready('exampleMap', function (map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
});

Template.map.onDestroyed(function () {
  Session.set('fullAdress', '');
  Session.set('lat', '');
  Session.set('lng', '');
});
