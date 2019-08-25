<?php
    require "./functions.php";
    
    $post = getJsonFromPost();
    $token = $post["token"];
    $config = $post["config"];
    
    tokenValidate($token);

    setItem("config", $config);
	
	$re = array(
		"code" => 0
    );
    
	returnJson($re);
?>