Template.image.helpers({
  imageUrl: function () {
    if (this.imageId) {
      var image = Images.findOne({_id: this.imageId});
      if (image && image.isUploaded()) {
        return Meteor.absoluteUrl() + 'cfs/files/images/' + this.imageId;
      }

    }
    return Meteor.absoluteUrl() + 'default-image.png';
  }
});

Template.image.onCreated(function () {
  if (this.data.imageId) {
    Meteor.subscribe('Image', this.data.imageId);
  }
});
