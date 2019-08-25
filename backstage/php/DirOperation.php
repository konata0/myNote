<?php

	require './functions.php';
	
	$post = getJsonFromPost();
	$token = $post["token"];

	$operation = $post["operation"];
	$name = $post["name"];
	$id = $post["id"];
	$parentId = $post["parentId"];
	$private = $post["private"];
	
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
			"parentId" => $parentId,
			"private" => true
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
			"parentId" => $parentId,
			"private" => true
		);
		array_push($catalogue, $newFileRecord);
		setItem("catalogue", $catalogue);
		$newItem = array(
			"id" => 0,
			"type" => "p",
			"content" => "this is a new file!",
			"size" => 1
		);
		$newFile = array(
			"id" => $newId,
			"name" => $name,
			"private" => true,
			"createTime" => date("Y-m-d H:i:s",time()),
			"updateTime" => date("Y-m-d H:i:s",time()),
			"data" => array($newItem)
		);
		setNote($newFile);
		returnJson($re_success);
	}

	// 隐藏公开文件夹
	if($operation === "changePrivate"){
		for($x = 0; $x< count($catalogue); $x++) {
			if($catalogue[$x]["id"] === $id){
				$catalogue[$x]["private"] = !$catalogue[$x]["private"];
				setItem("catalogue", $catalogue);
				returnJson($re_success);
			}
		}
	}

	// 删除文件夹
	if($operation === "delete"){
		deleteDir($id);
		returnJson($re_success);
	}

	// 剪切粘贴
	if($operation === "cut"){
		for($x = 0; $x< count($catalogue); $x++) {
			if($catalogue[$x]["id"] === $id){
				$catalogue[$x]["parentId"] = $parentId;
				setItem("catalogue", $catalogue);
				returnJson($re_success);
			}
		}
	}

	returnJson($re_error);
?>