<?php

include('libs/PachubeAPI.php');

define( "COSMAPIKEY", "60quPHrNGggy6peIYZzU12kcE7WSAKwwcTM4R1pCcGF6Zz0g" );
define( "FEEDID", 127436 );

// Define & Init the Object
$cosmFeed = new PachubeAPI(COSMAPIKEY);


// This is the stupidest way of doing this, needs to be
// fixed.
if ( isset( $_GET['q'] ) && !empty( $_GET['q'] ) )
{


	switch( $_GET['q'] )
	{
		// This is a grab current value call
		case 'cv':
			// Get the feed
			$jsonResult   = json_decode( $cosmFeed->getDatastream('json', FEEDID, 'sensor_reading') );
			
			// Get the current value and format output result
			$currentValue = $jsonResult->current_value;

			// Output the result
			header( 'Content-Type: application/json' );
			header( 'Cache-Control: no-cache' );
			echo json_encode( array( "cv" => $currentValue ) );
			break;


		// This is a grab log call
		case 'log':
			// Retrieve the log for the past 24 hours with
			// an interval of 30 minutes between each
			// datapoint
			$startTime  = date( 'Y-m-d\TG:i:s', strtotime('-24 hours') );
			$endTime    = date( 'Y-m-d\TG:i:s' );
			
			// Get the feed history
			$jsonResult = json_decode( $cosmFeed->getFeedHistory('json', FEEDID, $startTime, $endTime, 
																 $duration=false, $page=false, $per_page=false, $time=false, $find_previous=false, 
																 $interval_type='discrete', $interval=3600) );
			
			// Get the datapoints array from the result set only
			$datapoints = $jsonResult->datastreams[0]->datapoints;

			// BUG Here, that's why we need to revert back to UTC
			// needs to be fixed..
			date_default_timezone_set('Asia/Beirut');
			
			// Fix the time formatting
			foreach( $datapoints as &$dp )
			{	
				$dp->at = date( "c", strtotime( $dp->at ) );
			}

			header( 'Content-Type: application/json' );
			header( 'Access-Control-Allow-Origin: *' );
			header( 'Cache-Control: no-cache' );
			echo json_encode( array( "log" => $datapoints ) );
			break;

		// This is a grab debugging log call
		case 'debug':
			// Retrieve the log for the past 24 hours with
			// an interval of 30 minutes between each
			// datapoint
			$startTime  = date( 'Y-m-d\TG:i:s', strtotime('-24 hours') );
			$endTime    = date( 'Y-m-d\TG:i:s' );
			
			// Get the feed history
			$jsonResult = json_decode( $cosmFeed->getFeedHistory('json', FEEDID, $startTime, $endTime, 
																 $duration=false, $page=false, $per_page=false, $time=false, $find_previous=false, 
																 $interval_type='discrete', $interval=3600) );
			
			// Get the datapoints array from the result set only
			$datapoints = $jsonResult->datastreams[0]->datapoints;

			// BUG Here, that's why we need to revert back to UTC
			// needs to be fixed..
			date_default_timezone_set('Asia/Beirut');
			
			// Fix the time formatting
			foreach( $datapoints as &$dp )
			{	
				$dp->at = date( "c", strtotime( $dp->at ) );
			}

			echo '<pre>';
			print_r($datapoints);

			echo json_encode( array( "log" => $datapoints ) );
			break;
	}

}


?>