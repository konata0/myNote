<?php
    require "./functions.php";
    
    $post = getJsonFromPost();
    $token = $post["token"];
    
    tokenValidate($token);

    $catalogue = getItem("catalogue");

    // 添加根节点
    $catalogue_new = array();
    for($x = 0; $x< count($catalogue); $x++) {
        if($catalogue[$x]["id"] === 0 && $catalogue[$x]["parentId"] === null){
            array_push($catalogue_new, $catalogue[$x]);
            break;
        }
    }

    // 搜索子节点
    $finished = 0;
    while($finished < count($catalogue_new)){
        $parentNode = $catalogue_new[$finished];
        for($x = 0; $x< count($catalogue); $x++) {
            if($catalogue[$x]["parentId"] === $parentNode["id"]){
                array_push($catalogue_new, $catalogue[$x]);
            }
        }
        $finished += 1;
    }

    // 保存目录
    $catalogue = $catalogue_new;
    setItem("catalogue", $catalogue);

    // 检查文章
    $noteFiles = scandir("./note"); 
    $noteIdList = array();
    for($x = 0; $x< count($noteFiles); $x++) {
        $fileName = $noteFiles[$x];
        $length = strlen($fileName);  
        if($length <= 5){
            continue;
        }
        if(substr($fileName, $length - 5, 5) === ".json"){     
            $noteId = (int)substr($fileName, 0, $length - 5);
            $found = false;
            for($y = 0; $y< count($catalogue); $y++){
                if($catalogue[$y]["id"] === $noteId && $catalogue[$y]["type"] === "file"){
                    $found = true;
                    break;
                }
            }
            if(!$found){
                unlink("./note/".$fileName);
            }else{
                array_push($noteIdList, $noteId);
            }
        }
    }

    // 删除多余图片
    $pictureList = array();
    for($x = 0; $x< count($noteIdList); $x++){
        $note = getNote($noteIdList[$x]);
        $data = $note["data"];
        for($y = 0; $y< count($data); $y++){
            if($data[$y]["type"] === "img"){
                array_push($pictureList, $data[$y]["content"]);
            }
        }   
    }
    $pictureFiles = scandir("./note/img"); 
    for($x = 0; $x< count($pictureFiles); $x++){
        $fileName = $pictureFiles[$x];
        if($fileName === "." || $fileName === ".."){
            continue;
        }
        $found = false;
        for($y = 0; $y< count($pictureList); $y++){
            if($pictureList[$y] === $fileName){
                $found = true;
                break;
            }
        }
        if(!$found){
            unlink("./note/img/".$fileName);
        }
    }

	$re = array(
		"code" => 0
    );

	returnJson($re);
?>