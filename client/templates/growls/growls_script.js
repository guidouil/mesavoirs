Template.growls.helpers({
});

Template.growls.events({
});

Template.growls.onCreated(function () {
  var template = this;
  this.subscribe('Growls');
});

Template.growls.onRendered(function () {
  Tracker.autorun(function () {
    var growls = growls.find({'to': Meteor.userId()}, {sort: {createdAt: -1}});
    _.each( growls, function (growl) {
      toastr[growl.type](growl.message, growl.title);
      Growls.remove({_id: growl._id});
    });
  });
});
