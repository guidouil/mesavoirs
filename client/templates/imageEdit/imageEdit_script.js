Template.imageEdit.events({
  'click [data-action=uploadImage]': function () {
    $('#imageFile').click();
  },
  'change #imageFile': function (event, tmpl) {
    var placeId = Router.current().params.placeId;
    var cardId = Router.current().params.cardId;
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
            Router.go('place', {placeId: placeId});
          } else if (cardId) {
            PrivateLoyaltyCards.update(cardId, {$set: imageId});
            Router.go('card', {cardId: cardId});
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
    if (placeId) {
      Places.update({_id: placeId}, {$unset: {imageId: ''}});
    } else if (cardId) {
      PrivateLoyaltyCards.update({_id: cardId}, {$unset: {imageId: ''}});
    } else {
      Meteor.users.update( { _id: Meteor.userId() }, { $unset: { 'profile.imageId': '' }});
    }
  }
});
