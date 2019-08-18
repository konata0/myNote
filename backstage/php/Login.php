<?php
	require './functions.php';
	
	// 获取输入密码
	$post = getJsonFromPost();
	$password = $post["password"];
	
	// 读取本地密码
	$password_validation = getItem("password");
	
	// 生成token
	$token = md5(uniqid(microtime(true),true));	
	
	// 判断
	if($password === null){
		$data = array(
			"token" => null
		);
		$re = array(
			"code" => 0,
			"data" => $data
		);
	}else if($password === $password_validation){
		$data = array(
			"token" => $token
		);
		$re = array(
			"code" => 0,
			"data" => $data
		);
		// token写入
		setItem("token", $token);
	}else{
		$re = array(
			"code" => -1
		);
	}
	
	returnJson($re);
?>