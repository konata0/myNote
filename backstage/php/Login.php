<?php
	$data = array(
		"token" => "0123456789"
	);
	$re = array(
		"code" => 0,
		"data" => $data
	);
	header('Content-Type:application/json; charset=utf-8');
	exit(json_encode($re));
?>