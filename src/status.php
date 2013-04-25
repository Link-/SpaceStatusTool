<?php

include('libs/PachubeAPI.php');

define( "COSMAPIKEY", "60quPHrNGggy6peIYZzU12kcE7WSAKwwcTM4R1pCcGF6Zz0g" );
define( "FEEDID", 127436 );

// Define & Init the Object
$cosmFeed = new PachubeAPI(COSMAPIKEY);

// Get the feed
$jsonResult = json_decode( $cosmFeed->getFeed("json", FEEDID) );

// Get the current value and format output result
$currentValue = $jsonResult->datastreams[0]->current_value;

// print_r( $jsonResult );

// Output the result
header( 'Content-Type: application/json' );
echo json_encode( array( "cv" => $currentValue ) );

?>