Template.addCard.helpers({
  cardCode: function () {
    return Session.get('cardCode');
  },
  cardFormat: function () {
    return Session.get('cardFormat');
  },
});

Template.addCard.events({
  'click #scanCard': function () {
    Session.set('scanCard', true);
    scan();
  }
});

Template.addCard.onRendered(function ( ){
})
