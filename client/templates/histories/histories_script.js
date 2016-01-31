Template.histories.helpers({
  placeName: function () {
    return Session.get('placeName');
  },
  histories: function () {
    if (Session.get('histories')) {
      return Session.get('histories');
    }
  },
  plusSign: function (value) {
    var formatedValue = value;
    var historyFormat = Session.get('historyFormat');
    if (historyFormat === 'formatMoney') {
      formatedValue = parseFloat(value).toMoney(2, ',', ' ') + ' €';
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
  },
  feedIcon: function (value) {
    if (value < 0) {
      return 'minus red';
    }
    return 'plus green';
  }
});

Template.histories.onDestroyed(function () {
  Session.set('histories', '');
  Session.set('historyFormat', '');
});
