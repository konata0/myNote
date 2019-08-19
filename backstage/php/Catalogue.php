<?php
	require "./functions.php";
	$catalogue = getItem("catalogue");
	$re = array(
		"code" => 0,
		"data" => $catalogue
	);
	returnJson($re);
?>