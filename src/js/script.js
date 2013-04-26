  /*
   * Core JS
   * 
   * ==|== Info =======================================================
   * -- Author: Bassem Dghaidy
   * -- http://bassemdy.com
   * 
   */
  (function( $ ) {
      
      var audioClip = $("#sfxClip")[0];

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
                  audioClip.play();
                  $(".lambaicon").toggleClass('on');
                  c++;

                  if (c == delays.length)
                    $(".status-text").html('The space is <strong>OPEN</strong>, join us!');
              }, delays[i]);
          }
      };

      // Turn off the lamba
      $.fn.TurnOffTheLamba = function(argErr)
      {
          var delays = [100, 200, 300, 400, 500, 600, 700, 800];
          var c = 0;
          for (var i = 0; i < delays.length; i++)
          {
              setTimeout(function () {
                  audioClip.play();
                  $(".lambaicon").toggleClass('on');
                  c++;

                  if (c == delays.length)
                    if ( argErr )
                      $(".status-text").html(argErr);
                    else
                      $(".status-text").html('The space is <strong>CLOSED</strong>');
              }, delays[i]);
          }
      };

      // Fetch the current LLBH Status
      $.fn.GetLambaStatus = function()
      {
          console.log( 'Request status...' );

          // Getting the lamba status
          var request = $.ajax({
              url: "status.php",
              cache: false,
              dataType: "json"
          });

          // callback handler that will be called on success
          request.done(function (response, textStatus, jqXHR)
          {
            if ( response )
            {
              console.log( 'Success.' );

              // Lamba is open
              if ( response.cv == 1 )
                $.fn.TurnOnTheLamba();
              else
                $.fn.TurnOffTheLamba();
            }
          });

          // callback handler that will be called on failure
          request.fail(function (jqXHR, textStatus, errorThrown)
          {
              console.log( 'Failed to connect to the source.' )
              // log the error to the console
              $.fn.TurnOffTheLamba('<strong>Failed</strong>. Try again in a moment.');
          });

        }
  })( jQuery );


  $(document).ready(function()
    {
      var ct = setInterval(timer, 1000);
      var c = 3;

      function timer()
      {
        c--;
        $(".status-text").html('Fetching Status in ' + c);
        if (c < 1)
        {
          $(".status-text").html('...');
          clearInterval(ct);
          $.fn.GetLambaStatus();
        }
      }
    });