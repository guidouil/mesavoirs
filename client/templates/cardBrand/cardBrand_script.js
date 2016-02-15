Template.cardBrand.helpers({
  cardBrand: function () {
    return CardsBrands.findOne({_id: Router.current().params.cardBrandId});
  },
  type: function () {
    if (Router.current().params.cardBrandId) {
      return 'update';
    } else {
      return 'insert';
    }
  }
});

Template.cardBrand.events({
  'click .deleteCardBrand': function () {
    swal({
      title: 'Êtes-vous sûr ?',
      text: 'Effacer un marque est définitif.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      closeOnConfirm: true
    }, function () {
      CardsBrands.remove({_id: Router.current().params.cardBrandId});
      Router.go('cardsBrands');
    });
  }
});

Template.cardBrand.onCreated(function () {
  var template = this;
  if (Router.current().params.cardBrandId) {
    subs.subscribe('CardBrand', Router.current().params.cardBrandId);
  }
});
