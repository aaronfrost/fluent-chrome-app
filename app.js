angular.module('app',['ngResource']);

var context,
  screamingBuffer;
window.addEventListener('load', init, false);
function init() {
  try {
    screamingBuffer = null;
    context = new webkitAudioContext();

    function loadScreamingSound(url) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      // Decode asynchronously
      request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
          screamingBuffer = buffer;
        }, function(){
          console.log('error decoding audio data', arguments);
        });
      }
      request.send();
    }
    loadScreamingSound('screamingsheep.mp3');
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
}

function playSound(buffer) {
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = buffer;                    // tell the source which sound to play
  source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  source.noteOn(0);                          // play the source now
}
