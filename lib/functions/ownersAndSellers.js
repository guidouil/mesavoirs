isPlaceOwner = function (placeId, userId) {
  // check if current user is one of the place owners
  var place = Places.findOne({_id: placeId});
  if (place && place.owners && place.owners.length >= 1) {
    if (_.contains(place.owners, userId)) {
      return true;
    }
  }
  return false;
};

isPlaceSeller = function (placeId, userId) {
  // check if current user is one of the place sellers
  var place = Places.findOne({_id: placeId});
  if (place && place.sellers && place.sellers.length >= 1) {
    if (_.contains(place.sellers, userId)) {
      return true;
    }
  }
  return false;
};
