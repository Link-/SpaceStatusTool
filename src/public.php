<?php

	/**
	 * Public API to be used for implementing the Space Usage Tool
	 * on different platforms in addition to an intergration with
	 * http://hackerspaces.me/
	 **/

	include('libs/PachubeAPI.php');

	define( "COSMAPIKEY", "60quPHrNGggy6peIYZzU12kcE7WSAKwwcTM4R1pCcGF6Zz0g" );
	define( "FEEDID", 127436 );

	// Define & Init the Object
	$cosmFeed = new PachubeAPI(COSMAPIKEY);

	// Get the feed
	$jsonResult = json_decode( $cosmFeed->getDatastream('json', FEEDID, 'sensor_reading') );

	// Get the current value and format output result
	$currentValue = $jsonResult->current_value;

	$spaceStatus = ( $currentValue == "1.00" ) ? true : false;

	$jsonData = array(
		  "api" => "0.12",
		  "space" => "Lamba Labs",
		  "url" => "http://lambalabs.org",
		  "icon" => array( 
		    	"open" => "http://status.lambalabs.org/img/open-icon.png",
		    	"closed" => "https://status.lambalabs.org/img/closed-icon.png"
	  		),
		  "address" => "Lebanon, Beirut, Mar Mikhayel, Corniche el Nahr street, Past Electricite du Liban, Right after Banque BLC, first building on the right, Same building as the restaurant 3enab Geara (pink) building, first floor.",
		  "contact" => array( 
		  		"phone" => "+961 3 101121",
		    	"twitter" => "@LambaLabs",
		    	"ml" => "contact@lambalabs.org"
		  ),
		  "logo" => "http://status.lambalabs.org/img/logo.png",
		  "open" => $spaceStatus,
		  "lat" => 33.897341,
		  "lon" => 35.527767
	 );

	// Output the results
	header( 'Content-Type: application/json' );
	header( 'Access-Control-Allow-Origin: *' );
	header( 'Cache-Control: no-cache' );
	echo json_encode( $jsonData );

?>