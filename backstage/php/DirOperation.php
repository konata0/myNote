<?php

	require './functions.php';
	
	$post = getJsonFromPost();
	$token = $post["token"];
	$operation = $post["operation"];
	$name = $post["name"];
	$id = $post["id"];
	$parentId = $post["parentId"];
	
	// token验证
	tokenValidate($token);
	
	$catalogue = getItem("catalogue");
	$re_error = array(
		"code" => -4
	);
	$re_success = array(
		"code" => 0
	);

	// 重命名
	if($operation === "rename"){
		for($x = 0; $x< count($catalogue); $x++) {
			if($catalogue[$x]["id"] === $id){
				$catalogue[$x]["name"] = $name;
				setItem("catalogue", $catalogue);
				returnJson($re_success);
			}
		}
	}
	
	// 新建文件夹
	if($operation === "addDir"){
		$newDir = array(
			"id" => getNewCatalogueId(),
			"name" => $name,
			"type" => "dir",
			"parentId" => $parentId
		);
		array_push($catalogue, $newDir);
		setItem("catalogue", $catalogue);
		returnJson($re_success);
	}

	// 新建文件
	if($operation === "addFile"){
		$newId = getNewCatalogueId();
		$newFileRecord = array(
			"id" => $newId,
			"name" => $name,
			"type" => "file",
			"parentId" => $parentId
		);
		array_push($catalogue, $newFileRecord);
		setItem("catalogue", $catalogue);
		$newFile = array(
			"id" => $newId,
			"name" => $name,
			"createTime" => date("Y-m-d H:i:s",time()),
			"updateTime" => date("Y-m-d H:i:s",time()),
			"data" => array()
		);
		setNote($newFile);
		returnJson($re_success);
	}
	returnJson($re_error);
?>