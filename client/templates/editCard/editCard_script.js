Template.editCard.helpers({
  card: function () {
    return PrivateLoyaltyCards.findOne({_id: Router.current().params.cardId});
  }
});

Template.editCard.events({
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
  template.subscribe('CardsBrands');
  template.subscribe('PrivateLoyaltyCard', Router.current().params.cardId);
});
