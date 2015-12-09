Template.cardsBrands.helpers({
  cardsBrands: function () {
    return CardsBrands.find({}, {$sort:{ name: 1}}).fetch();
  }
});

Template.cardsBrands.events({
});

Template.cardsBrands.onRendered(function ( ){
});
