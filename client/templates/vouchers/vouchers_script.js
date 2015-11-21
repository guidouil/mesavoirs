Template.vouchers.helpers({
  vouchers: function () {
    return Vouchers.find({}, {sort: {name: 1}});
  }
});

Template.vouchers.events({
});

Template.vouchers.onRendered(function () {
});
