<?php
	require "./functions.php";
	$config = getItem("catalogue");
	$re = array(
		"code" => 0,
		"data" => $config
	);
	returnJson($re);
?>