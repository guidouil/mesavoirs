Template.place.helpers({
  isOwner: function () {
    return _.contains( this.owners, Meteor.userId() );
  }
});

Template.place.events({
  'click [data-action=enablePlace]': function (evt, tmpl) {
    Meteor.call('enablePlace', this._id, evt.currentTarget.checked);
  }
});

Template.place.onRendered(function ( ){
});
