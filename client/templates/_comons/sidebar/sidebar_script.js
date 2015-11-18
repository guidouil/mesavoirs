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
    Session.set('scanned', 'userId:FHGCCmkspM83uf2mq');
    Router.go('scanned');
  }
});

Template.sidebar.onRendered(function ( ){

});
