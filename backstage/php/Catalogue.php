<?php
	require "./functions.php";
	$catalogue = getItem("catalogue");

	$post = getJsonFromPost();
	$token = $post["token"];

	function ifPublic($record){
		return(!$record["private"]);
	}


	if($token){
		tokenValidate($token);
	}else{
		$catalogue_filed = array();
		for($x = 0; $x< count($catalogue); $x++) {
			if(!$catalogue[$x]["private"]){
				array_push($catalogue_filed, $catalogue[$x]);
			}
		}
		$catalogue = $catalogue_filed;
	}

	$re = array(
		"code" => 0,
		"data" => $catalogue
	);
	returnJson($re);
?>