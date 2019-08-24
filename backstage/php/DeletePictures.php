<?php
    
    require './functions.php';

    $post = getJsonFromPost();
    $token = $post["token"];
    $pictureList = $post["pictureList"];
   
    tokenValidate($token);

    for($x = 0; $x < count($pictureList); $x++) {
        deletePicture($pictureList[$x]);
    }

    $re = array(
        "code" => 0
    );

    returnJson($re);

?>