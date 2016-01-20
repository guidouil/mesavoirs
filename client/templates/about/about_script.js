Template.about.helpers({
});

Template.about.events({
});

Template.about.onRendered(function () {
  setTimeout(function () {
    $('html, body').animate({scrollTop: 0}, 'fast');
  }, 200);
});
