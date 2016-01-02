Template.cropper.helpers({
  imageId: function () {
    return Session.get('imageId');
  }
});

Template.cropper.events({
  'click #rotate': function () {
    $('#cropping').cropper('rotate', 90);
  },
  'click #save': function () {
    var canvas = $('#cropping').cropper('getCroppedCanvas');
    var croppedImgData = canvas.toDataURL();
    Images.insert(croppedImgData, function (err, fileObj) {
      if (err){
        console.error(err);
      } else {
        var imageId = fileObj._id;
        var imgType = Session.get('imgType');
        var theId = Session.get('theId');
        if (imgType === 'place') {
          var placeId = Session.get('theId');
          Places.update(placeId, {$set: {imageId: imageId}});
          Meteor.call('updateLoyaltyCards', placeId);
          Meteor.call('updateVouchers', placeId);
          Router.go('place', {placeId: placeId});
        } else if (imgType === 'card') {
          var cardId = Session.get('theId');
          PrivateLoyaltyCards.update(cardId, {$set: {imageId: imageId}});
          Router.go('card', {cardId: cardId});
        } else if (imgType === 'cardBrand') {
          var cardBrandId = Session.get('theId');
          CardsBrands.update(cardBrandId, {$set: {imageId: imageId}});
          Meteor.call('updatePrivateLoyaltyCards', cardBrandId);
          Router.go('cardsBrands');
        } else if (imgType === 'profile') {
          Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.imageId': imageId }});
          Router.go('profile');
        }
      }
    });

  }
});

Template.cropper.onRendered(function () {
  $('#cropping').attr('src', Session.get('imageTemp'));
  $('#cropping').cropper({
    aspectRatio: 1,
    maxWidth: 420
  });
});
