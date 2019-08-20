<?php
	require './functions.php';
	// 获取输入id
	$post = getJsonFromPost();
	$note_id = $post["id"];
	$note = getNote($note_id); 
	$re = array(
		"code" => 0,
		"data" => $note
	);
	returnJson($re);
?>