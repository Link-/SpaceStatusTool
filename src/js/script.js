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
              type: "GET",
              url: "status.php",
              data: {'q': 'cv'},
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


        // General purpose function to plot the status log
        // chart
        $.fn.PlotLogStatusChart = function()
        {
          // This is for all plots, change Date axis to local timezone
          Highcharts.setOptions({
              global : {
                  useUTC : true
              }
          });

          // Get the data and Plot the diagram
          $.get( "status.php?q=log", function( jsonData ) {
              
              // Parse the data
              newData = [];
              $.each(jsonData.log, function(key, value) 
              {
                newData.push( [ new Date( Date.parse(value.at) ).getTime(), parseInt(value.value) ] );
              });


              // Plot the chart
              $('#status-log-chart').highcharts({
                  chart: {
                      type: 'spline'
                  },
                  title: {
                      text: 'Space Status Log Chart'
                  },
                  subtitle: {
                      text: 'LLBH Status over the span of 24 hours (Beirut Time)'
                  },
                  xAxis: {
                      type: 'datetime',
                      labels: {
                      formatter: function() {
                           return Highcharts.dateFormat("%I:%M %p ", this.value);
                      }
                    }
                  },
                  yAxis: {
                      title: {
                          text: 'Space Status Value'
                      },
                      labels: {
                          formatter: function() {
                              return this.value;
                          }
                      }
                  },
                  tooltip: {
                      formatter: function() {
                        return 'The Space was: ' + ((this.y == 1) ? "Open" : "Closed") + '</b><br/> on ' + Highcharts.dateFormat("%I:%M %p ", this.x);
                      }
                  },
                  plotOptions: {
                      area: {
                          marker: {
                              enabled: false,
                              symbol: 'circle',
                              radius: 3,
                              states: {
                                  hover: {
                                      enabled: true
                                  }
                              }
                          }
                      }
                  },
                  series: [{
                      name: 'Status',
                      data: newData
                  }]
              });
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

    // Plot the chart
    $.fn.PlotLogStatusChart();
  });