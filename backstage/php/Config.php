<?php
	require "./functions.php";
	$config = getItem("config");
	$re = array(
		"code" => 0,
		"data" => $config
	);
	returnJson($re);
?>