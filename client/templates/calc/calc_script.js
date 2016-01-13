Template.calc.helpers({
  calcResult: function () {
    return Session.get('calcResult');
  }
});

Template.calc.events({
  'click .numberKey': function (evt) {
    if (! Session.get('calcResult')) {
      if ($(evt.currentTarget).data('value') > 0) {
        Session.set('calcResult', $(evt.currentTarget).data('value'));
      } else if ($(evt.currentTarget).data('value') === '.') {
        Session.set('calcResult', '0' + $(evt.currentTarget).data('value'));
      }
    } else {
      Session.set('calcResult', Session.get('calcResult').toString() + $(evt.currentTarget).data('value').toString());
    }
  },
  'click .operatorKey': function (evt) {
    if (! Session.get('calcPile')) {
      Session.set('operatorPile', $(evt.currentTarget).data('operator'));
      Session.set('calcPile', Session.get('calcResult'));
      Session.set('calcResult', '');
    }
  },
  'click #equal': function () {
    if (Session.get('operatorPile') && Session.get('calcPile')) {
      switch (Session.get('operatorPile')) {
      case '+':
        Session.set('calcResult', Number(Session.get('calcPile')) + Number(Session.get('calcResult')));
        break;
      case '-':
        Session.set('calcResult', Number(Session.get('calcPile')) - Number(Session.get('calcResult')));
        break;
      case '*':
        Session.set('calcResult', Number(Session.get('calcPile')) * Number(Session.get('calcResult')));
        break;
      case '/':
        Session.set('calcResult', Number(Session.get('calcPile')) / Number(Session.get('calcResult')));
        break;
      }
      Session.delete('operatorPile');
      Session.delete('calcPile');
    }
  },
  'click #cancel': function () {
    Session.set('calcResult', 0);
  },
  'click #toVoucher': function () {
    Session.set('voucher', Session.get('calcResult'));
    history.go(-1);
  }
});

Template.calc.onCreated(function () {
  Session.set('calcResult', 0);
  Session.delete('voucher');
  Session.delete('operatorPile');
  Session.delete('calcPile');
});
