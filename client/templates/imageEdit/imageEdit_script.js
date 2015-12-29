Template.imageEdit.events({
  'click [data-action=uploadImage]': function () {
    if (Meteor.isCordova) {
      var cameraOptions = {
        width: 600,
        height: 600,
        quality: 80
      };
      MeteorCamera.getPicture(cameraOptions, function (error, data) {
        if (!error) {
          Meteor.call('uploadImage', data, function (error, imageId) {
            if (error) {
              alert('err: '+error);
            }
            if (imageId) {
              var placeId = Router.current().params.placeId;
              var cardId = Router.current().params.cardId;
              var cardBrandId = Router.current().params.cardBrandId;
              if (placeId) {
                Places.update(placeId, {$set: {imageId: imageId}});
                Router.go('place', {placeId: placeId});
              } else if (cardId) {
                PrivateLoyaltyCards.update(cardId, {$set: {imageId: imageId}});
                Router.go('card', {cardId: cardId});
              } else if (cardBrandId) {
                CardsBrands.update(cardBrandId, {$set: {imageId: imageId}});
                Router.go('cardsBrands');
              } else {
                Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.imageId': imageId }});
                Router.go('profile');
              }
            }
          });
        }
      });
    } else {
      $('#imageFile').click();
    }
  },
  'change #imageFile': function (event, tmpl) {
    var placeId = Router.current().params.placeId;
    var cardId = Router.current().params.cardId;
    var cardBrandId = Router.current().params.cardBrandId;
    FS.Utility.eachFile(event, function (file) {
      Images.insert(file, function (err, fileObj) {
        if (err){
          console.error(err);
        } else {
          var imageId = {
            imageId: fileObj._id
          };
          $(event.currentTarget).replaceWith($(event.currentTarget).clone()); // empty file form
          if (placeId) {
            Places.update(placeId, {$set: imageId});
            Meteor.call('updateLoyaltyCards', placeId);
            Meteor.call('updateVouchers', placeId);
            Router.go('place', {placeId: placeId});
          } else if (cardId) {
            PrivateLoyaltyCards.update(cardId, {$set: imageId});
            Router.go('card', {cardId: cardId});
          } else if (cardBrandId) {
            CardsBrands.update(cardBrandId, {$set: imageId});
            Meteor.call('updatePrivateLoyaltyCards', cardBrandId);
            Router.go('cardsBrands');
          } else {
            Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.imageId': fileObj._id }});
            Router.go('profile');
          }
        }
      });
    });
  },
  'click [data-action=deleteImage]': function (event, tmpl) {
    Images.remove({_id: tmpl.data.imageId});
    var placeId = Router.current().params.placeId;
    var cardId = Router.current().params.cardId;
    var cardBrandId = Router.current().params.cardBrandId;
    if (placeId) {
      Places.update({_id: placeId}, {$unset: {imageId: ''}});
    } else if (cardId) {
      PrivateLoyaltyCards.update({_id: cardId}, {$unset: {imageId: ''}});
    } else if (cardBrandId) {
      CardsBrands.update({_id: cardBrandId}, {$unset: {imageId: ''}});
    } else {
      Meteor.users.update( { _id: Meteor.userId() }, { $unset: { 'profile.imageId': '' }});
    }
  }
});
