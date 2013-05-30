// Open the serial port
var connectionId;
var port = '/dev/tty.usbserial-FTE4XQGH';
chrome.serial.open(port, {bitrate: 9600}, onOpen);

angular.module('app')
  .directive('troller', function troller(){
    return {
      restrict: 'E',
      scope: {
        highlight: '@'
      },
      link: function(scope, elem, attrs){
        console.log('linked');
        
        //add a div where we'll display the final text
        var recognized = $('<span id="recognized"></span>');
        elem.append(recognized);

        //add a div where we'll display the temp text
        var temp = $('<span id="temp"></span>');
        elem.append(temp);

        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.start();

        recognition.onstart = function() {
          
        };

        recognition.onerror = function(event) {
          console.log('onerror()', event);
        };

        recognition.onend = function() {
          console.log('onend()');
        };

        recognition.onresult = function(event) {
          var interim_transcript = '';
          var final_transcript = '';
          if (typeof(event.results) == 'undefined') {
            return;
          }
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final_transcript += event.results[i][0].transcript;
            } else {
              interim_transcript += event.results[i][0].transcript;
            }
          }

          //put temporary results into the DOM just to show
          temp.html(highlight(interim_transcript));

          //hide the temp text and put the actual highlighted result into the DOM
          if (final_transcript){
            temp.text('');
            var updated = highlight(final_transcript);
            recognized.append(updated);
            
            if (updated !== final_transcript){
               //moar goats
              playSound(screamingBuffer);
              //moar shocking
              writeSerial('s');
            }
           

            //replace quick-highlight class with full-highlight for effect
            setTimeout(function(){
              var span = recognized.find('.quick-highlight');
              span.addClass('full-highlight');
            });
          }

        };

        function highlight(all){
          var regexp = new RegExp('(\\b)('+scope.highlight+')(\\b)', 'g');
          return all.replace(regexp, '<span class="quick-highlight">$2</span>');
        }
        
      }
    };
  });

function onOpen(connectionInfo) {
   // The serial port has been opened. Save its id to use later.
  connectionId = connectionInfo.connectionId;
  console.log('onOpen()', 'connectionId', connectionId);
}

function onClose(result) {
  console.log('Serial port closed');
}

function writeSerial(str) {
  chrome.serial.write(connectionId, str2ab(str), onWrite);
}

function onWrite(){
  // console.log('ZAPPING');
}

/* Convert an ArrayBuffer to a String, using UTF-8 as the encoding scheme.
   This is consistent with how Arduino sends characters by default 
*/
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};


// Convert string to ArrayBuffer
function str2ab(str) {
  var buf=new ArrayBuffer(str.length);
  var bufView=new Uint8Array(buf);
  for (var i=0; i<str.length; i++) {
    bufView[i]=str.charCodeAt(i);
  }
  return buf;
}