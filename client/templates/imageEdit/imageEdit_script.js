Template.imageEdit.events({
  'click [data-action=uploadImage]': function () {
    if (Meteor.isCordova) {
      var placeId = Router.current().params.placeId;
      var cardId = Router.current().params.cardId;
      var cardBrandId = Router.current().params.cardBrandId;

      var cameraOptions = {
        width: 600,
        height: 600
      };
      MeteorCamera.getPicture(cameraOptions, function (error, data) {
        Session.set('imageTemp', data);
        if (placeId) {
          Session.set('imgType', 'place');
          Session.set('theId', placeId);
        } else if (cardId) {
          Session.set('imgType', 'card');
          Session.set('theId', cardId);
        } else if (cardBrandId) {
          Session.set('imgType', 'cardBrand');
          Session.set('theId', cardBrandId);
        } else {
          Session.set('imgType', 'profile');
        }
        Router.go('cropper');
      });
    } else {
      $('#imageFile').click();
    }
  },
  'change #imageFile': function (event, tmpl) {
    var placeId = Router.current().params.placeId;
    var cardId = Router.current().params.cardId;
    var cardBrandId = Router.current().params.cardBrandId;

    var file = tmpl.find('#imageFile').files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      Session.set('imageTemp', e.target.result);
      if (Session.get('imageTemp') !== '') {
        $(event.currentTarget).replaceWith($(event.currentTarget).clone()); // empty file form
        if (placeId) {
          Session.set('imgType', 'place');
          Session.set('theId', placeId);
        } else if (cardId) {
          Session.set('imgType', 'card');
          Session.set('theId', cardId);
        } else if (cardBrandId) {
          Session.set('imgType', 'cardBrand');
          Session.set('theId', cardBrandId);
        } else {
          Session.set('imgType', 'profile');
        }
        Router.go('cropper');
      }
    };
    reader.readAsDataURL(file);
  },
  'click [data-action=deleteImage]': function (event, tmpl) {
    var placeId = Router.current().params.placeId;
    var cardId = Router.current().params.cardId;
    var cardBrandId = Router.current().params.cardBrandId;
    if (! cardId) {
      Images.remove({_id: tmpl.data.imageId});
    } else {
      // TODO remove unlinked images
    }
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
