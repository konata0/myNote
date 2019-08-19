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
	
	if($operation === "rename"){
		for($x = 0; $x< count($catalogue); $x++) {
			if($catalogue[$x]["id"] === $id){
				$catalogue[$x]["name"] = $name;
				setItem("catalogue", $catalogue);
				returnJson($re_success);
			}
		}
	}
	
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
	
	returnJson($re_error);
?>