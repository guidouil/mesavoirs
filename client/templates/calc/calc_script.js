Template.calc.helpers({
  voucher: function () {
    return Session.get('voucher') || 0;
  }
});

Template.calc.events({
  'focusinput, blur input, click button, change select': function (evt, tmpl) {
    var total = parseFloat(tmpl.find('#total').value);
    var ticketValue = parseFloat(tmpl.find('#ticketValue').value);
    var ticketCount = parseInt(tmpl.find('#ticketCount').value);
    check(total, Number);
    check(ticketValue, Number);
    check(ticketCount, Number);
    var voucher =  ticketValue * ticketCount - total;
    if (voucher >= 0) {
      Session.set('voucher', voucher);
    }
  }
});

Template.calc.onRendered(function () {
  Session.set('voucher', 0);
});
