Template.imageEdit.events({
  'click [data-action=uploadImage]': function () {
    if (Meteor.isCordova) {
      var cameraOptions = {
        width: 600,
        height: 600,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
      };
      mobileCropLoader(cameraOptions);
    } else {
      $('#imageFile').click();
    }
  },
  'click [data-action=takePicture]': function () {
    if (Meteor.isCordova) {
      var cameraOptions = {
        width: 600,
        height: 600,
        quality: 75
      };
      mobileCropLoader(cameraOptions);
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
    swal({
      title: 'Êtes-vous sûr ?',
      text: 'Effacer une image est définitif.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      closeOnConfirm: true
    }, function () {
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
    });
  }
});

var mobileCropLoader = function (cameraOptions) {
  var placeId = Router.current().params.placeId;
  var cardId = Router.current().params.cardId;
  var cardBrandId = Router.current().params.cardBrandId;

  MeteorCamera.getPicture(cameraOptions, function (error, data) {
    if (data) {
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
    }
  });
};
