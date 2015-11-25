Template.image.helpers({
  imageUrl: function () {
    if (this.imageId) {
      return Meteor.absoluteUrl() + 'cfs/files/images/' + this.imageId;
    } else {
      return Meteor.absoluteUrl() + 'default-image.png';
    }
  }
});

Template.image.onCreated(function () {
  if (this.data.imageId) {
    Meteor.subscribe('Image', this.data.imageId);
  }
});
