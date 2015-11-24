Template.home.helpers({

});

Template.home.events({
  'click [data-action=createPlace]': function () {
    Router.go('/create-place');
  }
});

Template.home.onRendered(function ( ){
});
