const name = 'VisitCounter';

function doCookie() {
  var index = document.cookie ? document.cookie.indexOf(name) : -1;
  var expires = 'Monday, 15-Apr-2030 00:00:00 GMT';

  // Cookie not found
  if (index == -1) {
    document.cookie = name + '=1; expires=' + expires;
    return;
  }
  var low = document.cookie.indexOf('=', index) + 1;
  var high = document.cookie.indexOf(';', index);
  if (high == -1) {
    high = document.cookie.length;
  }
  var count = eval(document.cookie.substring(low, high)) + 1;
  document.cookie = name + '=' + count + '; expires' + expires;

  // Set the visits
  document.getElementsByClassName('Visits')[0].innerHTML = getVisits() + ' visit(s)';
}

function getVisits() {
  var index = document.cookie ? document.cookie.indexOf(name) : -1;
  if (index == -1) {
      return '0';
  }
  var low = document.cookie.indexOf("=", index) + 1;
  var high = document.cookie.indexOf(";", index);
  if (high == -1) {
    high = document.cookie.length;
  }
  return document.cookie.substring(low, high);
}