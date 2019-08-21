<?php
	require './functions.php';

	$post = getJsonFromPost();
	$note_id = $post["id"];
	$token = $post["token"];

	$note = getNote($note_id); 
	$re = array(
		"code" => 0,
		"data" => $note
	);

	if(!$note["private"]){
		returnJson($re);
	}else{
		tokenValidate($token);
		returnJson($re);
	}
?>