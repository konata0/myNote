<?php
	date_default_timezone_set('Asia/Shanghai');

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

	// 获取设置note数据
	function getNote($note_id){
		$re_error = array(
			"code" => -3
		);
		$note_path = "./note/".(string)$note_id.".json";	
		if(!file_exists($note_path)){
			returnJson($re_error);
		}
		$json_string = htmlspecialchars_decode(file_get_contents($note_path)); 	
		$note = json_decode($json_string, true); 
		return $note;
	}
	function setNote($note){
		$node_id = $note["id"];
		$json_string = json_encode($note, JSON_UNESCAPED_UNICODE);
		$file = fopen("./note/".(string)$node_id.".json", "w");
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
		header('Content-Type:application/json; charset=utf-8');
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
	
	// 新生成目录ID
	function getNewCatalogueId(){
		$catalogue = getItem("catalogue");
		$newId = 0;
		while(true){
			$exist = false;
			for($x = 0; $x< count($catalogue); $x++) {
				if($catalogue[$x]["id"] === $newId){
					$exist = true;
					break;
				}
			}
			if($exist){
				$newId ++;
			}else{
				break;
			}	
		}
		return $newId;
	}

	// 删除图片
	function deletePicture($picture_name){
		unlink("./note/img/".$picture_name);
	}

	// 删除文件
	function deleteFile($id){

		$note = getNote($id);
		$data = $note["data"];
		for($x = 0; $x < count($data); $x++) {
			if($data[$x]["type"] === "img"){
				deletePicture($data[$x]["content"]);
			}
		}

		unlink("./note/".(string)$id.".json");

		$catalogue = getItem("catalogue");
		$catalogue_new = array();
		for($x = 0; $x < count($catalogue); $x++) {
			if($catalogue[$x]["id"] !== $id){
				array_push($catalogue_new, $catalogue[$x]);
			}
		}
		$catalogue = $catalogue_new;
		setItem("catalogue", $catalogue);
	}

	// 删除文件夹
	function deleteDir($id){
		$catalogue = getItem("catalogue");
		$catalogue_new = array();
		for($x = 0; $x < count($catalogue); $x++) {
			if($catalogue[$x]["id"] !== $id){
				array_push($catalogue_new, $catalogue[$x]);
			}
		}
		$catalogue = $catalogue_new;
		setItem("catalogue", $catalogue);

		for($x = 0; $x < count($catalogue); $x++) {
			if($catalogue[$x]["parentId"] === $id){
				$child = $catalogue[$x];
				if($child["type"] === "file"){
					deleteFile($child["id"]);
				}else{
					deleteDir($child["id"]);
				}
			}
		}
	}


?>