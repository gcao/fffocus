var NUMBER_VISIBLE_TIME = 2000;
var WAIT_BASE           = 4000;
var WAIT_VARIANCE       = 7000;

var startTime;
var finished;
var sessionLength;
var timeLeft;
var generated     = [];
var timeoutRef    = null;
var numberElem    = document.querySelector('#number');
var recordedElem  = document.querySelector('#recorded');
var resultElem    = document.querySelector('#result');
var scoreElem     = document.querySelector('#score');
var timeLeftElem  = document.querySelector('#timeLeft');

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}

var session = getUrlVars()['session'];
if (session) {
  document.querySelector('#session').value = session;
}

function start() {
  stop();
  finished                 = false;
  startTime                = new Date();
  sessionLength            = Number(document.querySelector('select').value)*60;
  generated                = [];
  recordedElem.value      = "";
  resultElem.style.display = "none";
  recordedElem.focus();
  showTime();
  updateNumber();
}

// Pause / resume logic:
// * Hide both pause/resume when session has not started or has finished
// * Show pause when a session is going on
// * Hide pause and show resume if session is paused
//function pause() {
//  if (timeoutRef) {
//    clearTimeout(timeoutRef);
//  }
//}

//function resume() {
//  updateNumber();
//}

function stop() {
  clearTimeout(timeoutRef);
  numberElem.innerHTML = "";
}

function finish() {
  stop();
  checkResult();
}

function updateNumber() {
  timeoutRef = setTimeout(function() {
    if (finished) return;

    // Stop because there is not enough time to enter the number
    if (timeLeft <= 3) return;

    var number = Math.floor(Math.random()*100);
    // Avoid duplication
    while (number === generated[generated.length - 1]) {
      number = Math.floor(Math.random()*100);
    }

    generated.push(number);
    numberElem.innerHTML = String(number);

    timeoutRef = setTimeout(function() {
      if (finished) return;

      numberElem.innerHTML = "";
      updateNumber();
    }, NUMBER_VISIBLE_TIME);
  }, Math.random()*WAIT_VARIANCE + WAIT_BASE);
}

function checkResult() {
  var recorded = recordedElem.value.trim().split(/[\s,]/);
  var matched = 0;
  var indexInExpected = 0;

  recorded.forEach(function(item, i) {
    var number = Number(item);
    if (number === generated[indexInExpected]) {
      matched ++;
      indexInExpected ++;
    } else {
      while (recorded.length - i < generated.length - indexInExpected) {
        indexInExpected ++;
        if (number === generated[indexInExpected]) {
          matched ++;
          break;
        }
      }
    }
  });

  var score = Math.round((matched/generated.length)*1000)/10;

  scoreElem.innerHTML = matched + "/" + generated.length + " = " + score + "%";
  resultElem.style.display = "block";
}

function updateTimeLeft() {
  setInterval(function() {
    if (!startTime) return;

    if (finished) return;

    timeLeft = sessionLength - (new Date() - startTime)/1000;
    if (timeLeft <= 0) {
      finished = true;
      finish();
      return;
    }

    var secs = Math.round(timeLeft);
    var mins = Math.floor(secs / 60);
    secs -= mins * 60;

    if (secs < 10) secs = "0" + secs;

    timeLeftElem.innerText = mins + ":" + secs;
  }, 500);
}

function showTime() {
  document.getElementById('showTime').style.display = "none";
  document.getElementById('hideTime').style.display = "";
  document.getElementById('timeLeft').style.display = "";
}

function hideTime() {
  document.getElementById('showTime').style.display = "";
  document.getElementById('hideTime').style.display = "none";
  document.getElementById('timeLeft').style.display = "none";
}

updateTimeLeft();

