Template.sidebar.helpers({

});

Template.sidebar.events({
  'click a.item': function () {
    $('.ui.labeled.icon.sidebar').sidebar('toggle');
  },
  'click [data-action=scan]': function () {
    scan();
  },
  'click [data-action=fakeScan]': function () {
    Router.go('scanned', {type: 'userId'});
  }
});

Template.sidebar.onRendered(function ( ){

});
