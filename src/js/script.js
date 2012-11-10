  /*
   * Core JS
   * 
   * ==|== Info =======================================================
   * -- Author: Bassem Dghaidy
   * -- http://bassemdy.com
   * 
   */
  (function( $ ) {
      
      // Turn on the lamba
      $.fn.TurnOnTheLamba = function()
      {
          // Odd to turn on
          // Even to turn off
          var delays = [100, 200, 300, 400, 500, 600, 700, 800, 820];
          var c = 0;
          for (var i = 0; i < delays.length; i++)
          {
              setTimeout(function () {
                  $(".lambaicon").toggleClass('on');
                  c++;

                  if (c == delays.length)
                    $(".status-text").html('The space is open, join us!');
              }, delays[i]);
          }
      };

      // Turn off the lamba
      $.fn.TurnOffTheLamba = function()
      {
          var delays = [100, 200, 300, 400, 500, 600, 700, 800];
          var c = 0;
          for (var i = 0; i < delays.length; i++)
          {
              setTimeout(function () {
                  $(".lambaicon").toggleClass('on');
                  c++;

                  if (c == delays.length)
                    $(".status-text").html('The space is closed, try again later :(');
              }, delays[i]);
          }
      };

  })( jQuery );

  $(document).ready(function()
  {
    var ct = setInterval(timer, 1000);
    var c = 8;

    function timer()
    {
      c--;
      $(".status-text").html('Updating Status in ' + c);
      if (c < 1)
      {
        $(".status-text").html('...');
        clearInterval(ct);
        $.fn.TurnOffTheLamba();
      }
    }
  });