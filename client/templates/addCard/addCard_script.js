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
  },
  'autocompleteselect input': function (event, template, doc) {
    if (doc.baseline) {
      template.find('#cardNotes').value = doc.baseline;
    }
    if (doc.imageId) {
      template.find('#imageId').value = doc.imageId;
    }
  }
});

Template.addCard.onRendered(function ( ){
});
