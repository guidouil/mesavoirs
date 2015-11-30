Template.owners.helpers({
  owners: function () {
    return Session.get('owners');
  }
});

Template.owners.events({
  'click #remove': function () {
    if (this.userId === Meteor.userId()) {
      swal('Nope !', 'Vous ne pouvez pas vous retirer vous même.', 'error');
      return false;
    }
  }
});

Template.owners.onRendered(function () {
});

Template.owners.onCreated(function () {
  Meteor.call('getPlaceOwners', this.data._id, function (err, owners) {
    if (owners) {
      console.log(owners);
      Session.set('owners', owners);
    }
  });
});
