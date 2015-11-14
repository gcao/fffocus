var NUMBER_VISIBLE_TIME = 2000;
var WAIT_BASE           = 5000;
var WAIT_VARIANCE       = 4000;

var startTime;
var finished;
var sessionLength;
var generated     = [];
var timeoutRef    = null;
var numberElem    = document.querySelector('#number');
var recordingElem = document.querySelector('textarea');
var resultElem    = document.querySelector('#result');
var scoreElem     = document.querySelector('#score');
var durationElem  = document.querySelector('#duration');

function start() {
  stop();
  finished                 = false;
  startTime                = new Date();
  sessionLength            = Number(document.querySelector('select').value)*60;
  generated                = [];
  recordingElem.value      = "";
  resultElem.style.display = "none";
  recordingElem.focus();
  updateNumber();
}

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
  var recorded = recordingElem.value.trim().split(/[\s,]/);
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

function updateDuration() {
  setInterval(function() {
    if (!startTime) return;

    if (finished) return;

    var duration = sessionLength + (startTime - new Date())/1000;
    if (duration <= 0) {
      finished = true;
      finish();
      return;
    }

    var secs = Math.round(duration);
    var mins = Math.floor(secs / 60);
    secs -= mins * 60;

    if (secs < 10) secs = "0" + secs;

    durationElem.innerText = mins + ":" + secs;
  }, 500);
}

updateDuration();

