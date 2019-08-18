<?php
	// 获取设置"./security/data.json"中的数据
	function getItem($item_name){
		$json_string = htmlspecialchars_decode(file_get_contents("./security/data.json")); 
		$security_data = json_decode($json_string, true); 
		$item = $security_data[$item_name];
		return $item;
	}	
	function setItem($item_name, $value){
		$json_string = htmlspecialchars_decode(file_get_contents("./security/data.json")); 
		$security_data = json_decode($json_string, true); 
		$security_data[$item_name] = $value;
		$json_string = json_encode($security_data,JSON_UNESCAPED_UNICODE);
		$file = fopen("./security/data.json", "w");
		fwrite($file, $json_string);
		fclose($file);	
	}
	
	// 接收返回JSON
	function getJsonFromPost(){
		$json_string = htmlspecialchars_decode(file_get_contents('php://input'));
		$post = json_decode($json_string, true);
		return $post;
	}
	function returnJson($re){
		header('Content-Type:application/json; charset=utf-8-sig');
		exit(json_encode($re,JSON_UNESCAPED_UNICODE));
	}
	
	// token验证
	function tokenValidate($token){
		$token_local = getItem("token");
		if($token_local === $token){
			return;
		}else{
			$re = array(
				"code" => -2
			);
			returnJson($re);
		}
	}
?>