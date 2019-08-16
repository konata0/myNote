<?php
	$config = array(
		"title" => "MyNote"
	);
	$re = array(
		"code" => 0,
		"data" => $config
	);
	header('Content-Type:application/json; charset=utf-8');
	exit(json_encode($re,JSON_UNESCAPED_UNICODE));
?>