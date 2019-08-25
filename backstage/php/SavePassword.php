<?php
    require "./functions.php";
    
    $post = getJsonFromPost();
    $token = $post["token"];
    $password = $post["password"];
    
    tokenValidate($token);

    setItem("password", $password);
	
	$re = array(
		"code" => 0
    );
    
	returnJson($re);
?>