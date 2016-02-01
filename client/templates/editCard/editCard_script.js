Template.editCard.helpers({
  card: function () {
    return PrivateLoyaltyCards.findOne({_id: Router.current().params.cardId});
  }
});

Template.editCard.events({
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
  },
  'click .deleteCard': function () {
    swal({
      title: 'Etes-vous sur ?',
      text: 'Effacer un carte de fidélité est définitif.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      closeOnConfirm: true
    }, function () {
      PrivateLoyaltyCards.remove({_id: Router.current().params.cardId});
      Router.go('loyaltyCards');
    });
  }
});

Template.editCard.onCreated(function () {
  var template = this;
  subs.subscribe('CardsBrands');
  subs.subscribe('PrivateLoyaltyCard', Router.current().params.cardId);
});
