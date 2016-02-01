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
    template.find('#cardBrandId').value = doc._id;
    Session.set('cardBrand', doc);
  }
});

Template.addCard.onRendered(function () {
  if (Session.get('cardBrand')) {
    var doc = Session.get('cardBrand');
    $('#cardName').val(doc.name);
    if (doc.baseline) {
      $('#cardNotes').val(doc.baseline);
    }
    if (doc.imageId) {
      $('#imageId').val(doc.imageId);
    }
    $('#cardBrandId').val(doc._id);
  }
});

Template.addCard.onCreated(function () {
  var template = this;
  subs.subscribe('CardsBrands');
});
