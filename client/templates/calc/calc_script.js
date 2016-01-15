Template.calc.helpers({
  calcResult: function () {
    return Session.get('calcResult');
  },
  voucher: function () {
    return Session.get('voucher') || 0;
  }
});

Template.calc.events({
  'click .calcKey': function (evt, tmpl) {
    tmpl.find('#calcScreen').value += String($(evt.currentTarget).data('value'));
    Session.set('calcResult', tmpl.find('#calcScreen').value);
  },
  'click #equal': function (evt, tmpl) {
    var calcScreen = tmpl.find('#calcScreen').value;
    var re2 = /\d|\./;
    if (re2.test(calcScreen.charAt(0)) && re2.test(calcScreen.charAt(calcScreen.length - 1))) {
      tmpl.find('#calcScreen').value = eval(calcScreen);
    }
    var re1 = /\/0+$/;
    if (re1.test(calcScreen)) {
      tmpl.find('#calcScreen').value = 42;
    }
    Session.set('calcResult', tmpl.find('#calcScreen').value);
  },
  'click #cancel': function (evt, tmpl) {
    Session.delete('calcResult');
    tmpl.find('#calcScreen').value = '';
  },
  'click #toVoucher': function () {
    Session.set('voucher', Session.get('calcResult'));
    history.go(-1);
  },
  'focus input, blur input, change select, click .calcVoucher': function (evt, tmpl) {
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

Template.calc.onCreated(function () {
  Session.delete('calcResult');
  Session.delete('voucher');
});

Template.calc.onRendered(function () {
  $('#calcTabs .item').tab();
});
