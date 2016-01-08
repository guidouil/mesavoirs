Template.growls.helpers({
});

Template.growls.events({
});

Template.growls.onCreated(function () {
  var template = this;
  template.subscribe('Growls');
});

Template.growls.onRendered(function () {
  toastr.options = {
    'closeButton': false,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-bottom-full-width',
    'preventDuplicates': false,
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
  };
  Tracker.autorun(function () {
    var growls = Growls.find({'to': Meteor.userId()}, {sort: {createdAt: -1}}).fetch();
    _.each( growls, function (growl) {
      toastr[growl.type](growl.message, growl.title);
      Growls.remove({_id: growl._id});
    });
  });
});
