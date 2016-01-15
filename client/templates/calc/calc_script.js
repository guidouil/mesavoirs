Template.calc.helpers({
  calcResult: function () {
    return Session.get('calcResult');
  }
});

Template.calc.events({
  'click .calcKey': function (evt, tmpl) {
    tmpl.find('#calcScreen').value += String($(evt.currentTarget).data('value'));
    Session.set('calcResult', tmpl.find('#calcScreen').value);
  },
  'click #equal': function (evt, tmpl) {
    var calcScreen = tmpl.find('#calcScreen').value;
    var re = /\d/;
    if (re.test(calcScreen.charAt(0)) && re.test(calcScreen.charAt(calcScreen.length - 1))) {
      tmpl.find('#calcScreen').value = eval(calcScreen);
      Session.set('calcResult', tmpl.find('#calcScreen').value);
    }
  },
  'click #cancel': function (evt, tmpl) {
    Session.delete('calcResult');
    tmpl.find('#calcScreen').value = '';
  },
  'click #toVoucher': function () {
    Session.set('voucher', Session.get('calcResult'));
    history.go(-1);
  }
});

Template.calc.onCreated(function () {
  Session.delete('calcResult');
  Session.delete('voucher');
});
