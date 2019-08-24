<?php
    
    require './functions.php';

    $post = getJsonFromPost();
    $token = $post["token"];
    $note = $post["note"];
   
    tokenValidate($token);

    setNote($note);

    $re = array(
        "code" => 0
    );

    returnJson($re);

?>