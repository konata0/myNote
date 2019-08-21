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
		"code" => -5
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
			}
        }
        $note = getNote($id);
        $note["name"] = $name;
        setNote($note);
        returnJson($re_success);
	}

	// 隐藏公开文件
	if($operation === "changePrivate"){
		$result = null;
		for($x = 0; $x< count($catalogue); $x++) {
			if($catalogue[$x]["id"] === $id){
				$result = !$catalogue[$x]["private"];
				$catalogue[$x]["private"] = $result;
				setItem("catalogue", $catalogue);
				break;
			}
		}
		$note = getNote($id);
        $note["private"] = $result;
        setNote($note);
        returnJson($re_success);
	}

	// 删除文件
	if($operation === "delete"){
		deleteFile($id);
		returnJson($re_success);
	}
	
	returnJson($re_error);
?>