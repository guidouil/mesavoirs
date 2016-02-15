Template.promote.helpers({
});

Template.promote.events({
});

Template.promote.onRendered(function () {
  setTimeout(function () {
    $('html, body').animate({scrollTop: 0}, 'fast');
  }, 500);
  setTimeout(function () {
    $('#createPlaceHelp').popup({
      inline: true
    });
  }, 200);
});
