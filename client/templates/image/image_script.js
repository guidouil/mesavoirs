Template.image.helpers({
  imageUrl: function () {
    if (this.imageId) {
      var image = Images.findOne({_id: this.imageId});
      if (image && image.isUploaded()) {
        return Meteor.absoluteUrl() + 'cfs/files/images/' + this.imageId;
      }
      // return Meteor.absoluteUrl() + 'uploads/compressed/images-' + this.imageId + '-loyali.png';
    }
    return Meteor.absoluteUrl() + 'default-image.png';
  }
});

Template.image.onCreated(function () {
  var template = this;
  if (template.data.imageId) {
    subs.subscribe('Image', template.data.imageId);
  }
});
