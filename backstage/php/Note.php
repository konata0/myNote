<?php
	require './functions.php';
	
	$re_error = array(
		"code" => -3
	);
	
	// 获取输入id
	$post = getJsonFromPost();
	$note_id = $post["id"];
	
	$note_path = "./note/".(string)$note_id.".json";	
	if(!file_exists($note_path)){
		returnJson($re_error);
	}
	
	$json_string = htmlspecialchars_decode(file_get_contents($note_path)); 	
	$note = json_decode($json_string, true); 
	
	$re = array(
		"code" => 0,
		"data" => $note
	);
	returnJson($re);
	
?>