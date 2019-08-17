<?php
	require './functions.php';
	$token = "8cc9e23d10b01ff2acbad8854ac051f5";	
	tokenValidate($token);
	$re = array(
		"code" => 0
	);
	returnJson($re);
?>