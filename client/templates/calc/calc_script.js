Template.calc.helpers({
  vouncher: function () {
    return Session.get('vouncher') || 0;
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
    var vouncher =  ticketValue * ticketCount - total;
    if (vouncher >= 0) {
      Session.set('vouncher', vouncher);
    }
  }
});

Template.calc.onRendered(function () {
  Session.set('vouncher', 0);
  $('#ticketCount').dropdown();
});

Template.calc.onDestroyed(function () {
  Session.set('vouncher', 0);
});
