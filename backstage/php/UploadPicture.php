<?php
    
    require './functions.php';

    if($_SERVER["REQUEST_METHOD"] !== "POST"){
        exit("wrong method");
    }
   
    $token = $_POST["token"];
    tokenValidate($token);

    $file = $_FILES["picture"];
    if ($file["error"] > 0){
		exit($file["error"]);
    }
    
    $type = pathinfo($file["name"], PATHINFO_EXTENSION);

    $new_name = date("YmdHis", time()).".".$type;

    move_uploaded_file($file["tmp_name"],"./note/img/".$new_name);

    $re = array(
        "code" => 0,
        "content" => $new_name
    );

    returnJson($re);

?>