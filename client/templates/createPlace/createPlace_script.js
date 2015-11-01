Template.createPlace.helpers({
});

Template.createPlace.events({

});

Template.createPlace.onRendered(function () {
  var input = document.getElementById('autocomplete');
  var autocomplete = new google.maps.places.Autocomplete(input);

  // When the user selects an address from the dropdown,
  google.maps.event.addListener(autocomplete, 'place_changed', function () {

    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    console.log('place: ' + JSON.stringify(place) );
  });
});
