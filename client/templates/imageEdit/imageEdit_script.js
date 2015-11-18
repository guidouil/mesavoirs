Template.imageEdit.events({
  'click [data-action=uploadImage]': function () {
    $('#imageFile').click();
  },
  'change #imageFile': function (event, tmpl) {
    var placeId = Router.current().params.placeId;
    FS.Utility.eachFile(event, function (file) {
      Images.insert(file, function (err, fileObj) {
        if (err){
           // handle error
        } else {
           // handle success depending what you need to do
          var imageId = {
            imageId: fileObj._id
          };
          Places.update(placeId, {$set: imageId});
          $(event.currentTarget).replaceWith($(event.currentTarget).clone());
        }
      });
    });
  },
  'click [data-action=deleteImage]': function (event, tmpl) {
    Images.remove({_id: tmpl.data.imageId});
    var placeId = Router.current().params.placeId;
    Places.update({_id: placeId}, {$unset: {imageId: ''}});
  }
});
