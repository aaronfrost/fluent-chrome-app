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