Template.contacts.helpers({
  contacts: function () {
    return Contacts.find({}, {sort: {createdAt: -1}}).fetch();
  }
});

Template.contacts.events({
  'click #deleteContact': function () {
    var contactId = this._id;
    swal({
      title: 'Êtes-vous sûr ?',
      text: 'Effacer un contact est définitif.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      closeOnConfirm: true
    }, function () {
      Contacts.remove({_id: contactId});
    });
  }
});

Template.contacts.onCreated(function () {
  var template = this;
  subs.subscribe('Contacts');
});
