<?php

$configs = include($_SERVER['DOCUMENT_ROOT'].'/config.php');

//get location
$location = "";
$apiKey = $configs["locationApi"];
$ip = $_SERVER['REMOTE_ADDR'];
$response = @file_get_contents('https://api.ip2location.io/?key=' . $apiKey . '&ip=' . $ip . '&format=json');
if (($json = json_decode($response, true)) === null) {
	$json['statusCode'] = 'ERROR';
}
else {
	$json['statusCode'] = 'OK';
	if (!empty($json) && is_array($json)) {
        if ($json['country_code'] === "GB") {
            $location = $json['city_name'] . ", " . $json['region_name'] . ", UK";
        } else if ($json['country_code'] === "US") {
            $location = $json['city_name'] . ", " . $json['region_name'] . ", USA";
        } else {
            $location = $json['city_name'] . ", " . $json['region_name'] . ", " . $json['country_code'];
        }
	}
}
//get email, message and name
$email = $_REQUEST["email"];
$message = $_REQUEST["message"];
$name = $_REQUEST["name"];

//get date
date_default_timezone_set('Europe/London');
$date = date('l jS F Y, g:iA');

//get messages number
$messages = "0";
if (file_exists('messages.txt')) {
	$fil = fopen('messages.txt', 'r');
	$messages = fread($fil, filesize('messages.txt'));
	fclose($fil);
}
$messages = $messages + 1;

//save to file
$fil = fopen("messages.txt", "w");
if ($fil) {
	fwrite($fil, $messages);
	fclose($fil);
}

//send email
$msg = "Name: " . $name . "\r\nEmail: " . $email . "\r\nMessage: " . $message . "\r\n\r\nDate and Time: " . $date . "\r\nMessage#: " . $messages . "\r\nLocation: " . $location;
$msg = wordwrap($msg, 70, "\r\n");
$success = mail($configs["email"], 'Website Form', $msg);
if (!$success) {
    echo "Error";
} else {
	echo "Success";
}
?>
