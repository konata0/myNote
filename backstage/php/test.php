<?php
	require './functions.php';
	$string = "{'array':[1,2,3]}";
	
	$note = json_decode($string, true); 
	
	exit($note);

	returnJson($note);
?>