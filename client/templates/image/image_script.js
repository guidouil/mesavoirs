Template.image.helpers({
  imageUrl: function () {
    if (this.imageId) {
      return Meteor.absoluteUrl() + 'uploads/compressed/images-' + this.imageId + '-loyali.png';
    }
    return Meteor.absoluteUrl() + 'default-image.png';
  }
});
