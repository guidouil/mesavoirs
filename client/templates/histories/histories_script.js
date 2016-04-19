Template.histories.helpers({
  placeName: function () {
    return Session.get('placeName');
  },
  histories: function () {
    if (Session.get('histories')) {
      return Session.get('histories');
    }
  },
  historyTitle: function () {
    if (Session.get('historyFormat')) {
      if (Session.equals('historyFormat', 'formatMoney')) {
        return 'de l\'avoir';
      } else {
        return 'de la carte'
      }
    }
  },
  plusSign: function (value) {
    var formatedValue = value;
    var historyFormat = Session.get('historyFormat');
    if (historyFormat === 'formatMoney') {
      formatedValue = parseFloat(value).toMoney(2, ',', ' ') + Session.get('currency');
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

Template.histories.onRendered(function () {
  setTimeout(function () {
    $('html, body').animate({scrollTop: 0}, 'fast');
  }, 500);
});

Template.histories.onDestroyed(function () {
  Session.delete('histories');
  Session.delete('historyFormat');
});
