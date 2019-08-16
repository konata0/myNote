<?php

	$password_validation = "123456";

	$post = json_decode(file_get_contents('php://input'), true);
	$password = $post["password"];
	
	$data = array(
		"token" => "0123456789"
	);
	
	if($password == $password_validation){
		$re = array(
			"code" => 0,
			"data" => $data
		);
	}else{
		$re = array(
			"code" => -1
		);
	}
	
	
	header('Content-Type:application/json; charset=utf-8');
	exit(json_encode($re,JSON_UNESCAPED_UNICODE));
?>