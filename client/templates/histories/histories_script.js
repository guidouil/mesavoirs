Template.histories.helpers({
  histories: function () {
    return Session.get('histories');
  },
  plusSign: function (value) {
    var formatedValue = value;
    var historyFormat = Session.get('historyFormat');
    if (historyFormat === 'formatMoney') {
      formatedValue = parseFloat(value).toMoney(2, ',', ' ') + '€';
    } else {
      formatedValue = value + ' point';
      if (Math.abs(value) > 1 ) {
        formatedValue += 's';
      }
    }
    if (value > 0) {
      return '+' + formatedValue;
    } else {
      return formatedValue;
    }
  }
});

Template.histories.events({
});

Template.histories.onRendered(function ( ){
});
