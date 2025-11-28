<?php
// uploader.php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    header('Location: /page_403.php');
    exit();
}

umask(0000);

$query_list = 
[
    'add_autor' => 'INSERT INTO autor (autor_name) VALUES ($1) RETURNING autor_id;',
    'add_game' => 'INSERT INTO game (game_autor_id, game_name, game_description) 
        SELECT autor_id, $1, $2
        FROM autor 
        WHERE autor_name = $3
        RETURNING game_id;',
    'update_autor' => 'UPDATE autor SET autor_name = $1 WHERE autor_name = $2 RETURNING autor_id;',
    "game_categories_add" =>"INSERT INTO game_category (gc_game_id, gc_category_id) 
        SELECT $1, unnest($2::int[])
        WHERE NOT EXISTS (
            SELECT 1 FROM game_category 
            WHERE gc_game_id = $1 
            AND gc_category_id = ANY($2::int[]))",
    "game_categories_delete" => "DELETE FROM game_category 
        WHERE gc_game_id = $1 
        AND gc_category_id = ANY($2::int[]);",
    "game_genres_add" =>"INSERT INTO game_genre (gg_game_id, gg_genre_id) 
        SELECT $1, unnest($2::int[])
        WHERE NOT EXISTS (
            SELECT 1 FROM game_genre 
            WHERE gg_game_id = $1 
            AND gg_genre_id = ANY($2::int[]))",
    "game_genres_delete" => "DELETE FROM game_genre 
        WHERE gg_game_id = $1 
        AND gg_genre_id = ANY($2::int[]);",
    "delete_game" => "DELETE FROM game where game_id = $1",
    "create_genre" => "INSERT INTO genre (genre_name) VALUES ($1);",
    "update_genre" => "UPDATE genre SET genre_name = $1 WHERE genre_name = $2;",
    "delete_genre" => "WITH deleted_genres AS (
        DELETE FROM genre 
        WHERE genre_name = $1
        RETURNING genre_id
        )
        DELETE FROM game_genre 
        WHERE gg_genre_id IN (SELECT genre_id FROM deleted_genres);",
    "create_category" => "INSERT INTO category (category_name) VALUES ($1);",
    "update_category" => "UPDATE category SET category_name = $1 WHERE category_name = $2;",
    "delete_category" => "WITH deleted_categories AS (
        DELETE FROM category 
        WHERE category_name = $1
        RETURNING category_id
        )
        DELETE FROM game_category 
        WHERE gc_category_id IN (SELECT category_id FROM deleted_categories);",
    "get_game" => 'SELECT game_id FROM game WHERE game_autor_id = $1',
    "delete_game_by_autor" => "DELETE FROM game WHERE game_autor_id = $1",
    "delete_autor" => "DELETE FROM autor WHERE autor_id = $1",
    "select_autor" => "SELECT autor_id FROM autor WHERE autor_name = $1",
];

require_once 'config.php';
$dbconn = get_db_connection();
if (!$dbconn) {
    die('Ошибка соединения');
    exit();
}


$query = $_POST['query'];
pg_query($dbconn, "BEGIN");//начало транзакции
$success = true;

if ($query == 'add_game' || $query == 'update_game')//страница игр
{
    $serverPathDevelopers = '/var/www/html/game_imgs/';
    $array_data = array();

    if (isset($_POST['game_id'])) {//обновление данных игры update_game
        
        $update_fields = [];
        $params = [];
        $param_count = 1;
        
        if (isset($_POST['developer_name'])) {
            $update_fields[] = "game_autor_id = (SELECT autor_id FROM autor WHERE autor_name = $" . $param_count++ . ")";
            $params[] = $_POST['developer_name'];
        }
        if (isset($_POST['game_description'])) {//обновление данных игры
            $update_fields[] = "game_description = $" . $param_count++;
            $params[] = $_POST['game_description'];
        }
        if (isset($_POST['game_name'])) {//обновление данных игры
            $update_fields[] = "game_name = $" . $param_count++;
            $params[] = $_POST['game_name'];
        }
        
        // обновление информации об игре
        if(!empty($update_fields))
        {
            $params[] = $_POST['game_id'];

            $update_query = "UPDATE game SET " . implode(', ', $update_fields) . 
                            " WHERE game_id = $" . $param_count;
                
            $result = pg_query_params($dbconn, $update_query, $params);
            
            if (!$result) {
                $success = false;
            }
        }

        if($success){
            handleGameCategories('delete', 'del_categories', 'game_categories_delete', $dbconn, $query_list, $_POST['game_id'], $success);
        }

        if($success){
            handleGameCategories('add', 'add_categories', 'game_categories_add', $dbconn, $query_list, $_POST['game_id'], $success);
        }

        if($success){
            handleGameCategories('delete', 'del_genres', 'game_genres_delete', $dbconn, $query_list, $_POST['game_id'], $success);
        }

        if($success){
            handleGameCategories('add', 'add_genres', 'game_genres_add', $dbconn, $query_list, $_POST['game_id'], $success);
        }

    }
    else{//создание новой игры add_game

        $developer_name = $_POST['developer_name'];
        $game_desctiption = $_POST['game_description'];
        $game_name = $_POST['game_name'];

        $array_data = array(
            'game_name' => $_POST['game_name'],
            'game_description' => $_POST['game_description'],
            'developer_name' => $_POST['developer_name'],
        );

        $result = pg_query_params($dbconn, $query_list[$query], $array_data);

        if (!$result) {
            $success = false;
        } else {
            $massive_result = pg_fetch_assoc($result);
            $file_id = $massive_result['game_id'];
            
            if ($success) {
                handleGameCategories('add', 'add_categories', 'game_categories_add', $dbconn, $query_list, $file_id, $success);
            }
            
            if ($success) {
                handleGameCategories('add', 'add_genres', 'game_genres_add', $dbconn, $query_list, $file_id, $success);
            }
        }

    }

}
elseif($query == "delete_developer" || $query == "delete_game"){//удаление игр/разработчиков

    if ($query == "delete_game")//удаление игры
    {
        $serverPathGames = '/var/www/html/game_imgs/';
        
        $game_id = $_POST["game_id"];

        $array_data = array();
        $array_data["game_id"] = $game_id;
        $result = pg_query_params($dbconn, $query_list[$query], array($game_id));

        if (!$result){
            $success = false;
        }
        else{

            $file_pattern_game = $serverPathGames . $game_id . '.*';
            $existingFiles = glob($file_pattern_game);

            if (!empty($existingFiles)) {
                try
                {
                    $fileToDelete = $existingFiles[0];
                    if (file_exists($fileToDelete)) {
                        unlink($fileToDelete);
                    }
                }
                catch (Exception $e) {
                    $success = false;
                }
            }
        }


    }
    else//удаление разработчика(и его игр)
    {
        $serverPathGames = '/var/www/html/game_imgs/';//добавить удаление жанров и категрирй связанных с игрой!!!!!!
        $serverPathDevelopers = '/var/www/html/devs_imgs/';
        $developerName = $_POST["developer_name"]; // имя автора для удаления

        try {

            // получение autor_id по имени автора     
            $array_data = array($developerName);
            $result = pg_query_params($dbconn, $query_list["select_autor"], $array_data);

            if (pg_num_rows($result) == 0) {
                $success = false;
            }
            
            $row = pg_fetch_assoc($result);
            $autor_id = $row['autor_id'];
            
            // получение всех game_id связанных игр
            $array_data = array($autor_id);
            $result = pg_query_params($dbconn, $query_list["get_game"], $array_data);
            
            $game_ids = array();
            while ($row = pg_fetch_assoc($result)) {
                $game_ids[] = $row['game_id'];
            }
            
            // удаление картинки для всех найденных игр
            foreach ($game_ids as $gameId) {
                $pattern = $serverPathGames . $gameId . '.*';
                $existingFiles = glob($pattern);
                
                // удаление файлов для данного game_id
                if (!empty($existingFiles)) {
                    foreach ($existingFiles as $fileToDelete) {
                        if (file_exists($fileToDelete)) {
                            if (!unlink($fileToDelete)) {
                                throw new Exception("Не удалось удалить файл: $fileToDelete");
                            }
                        }
                    }
                }
            }
            
            // удаляение игры из БД
            $array_data = array($autor_id);
            $result = pg_query_params($dbconn, $query_list["delete_game_by_autor"], $array_data);
            
            if (!$result) {
                $success = false;
            }

            if (!$result){
                $success = false;
            }
            else{
                $file_pattern_dev = $serverPathDevelopers . $autor_id . '.*';//удаление изображения автора
                $existingFilesDev = glob($file_pattern_dev);

                if (!empty($existingFilesDev)) {
                    try
                    {
                        $fileToDelete = $existingFilesDev[0];
                        if (file_exists($fileToDelete)) {
                            unlink($fileToDelete);
                        }
                    }
                    catch (Exception $e) {
                        $success = false;
                    }
                }
            }
        
            
            // удаление автора из БД
            $array_data = array($autor_id);
            $result = pg_query_params($dbconn, $query_list["delete_autor"], $array_data);
            
            if (!$result) {
                $success = false;
            }
                        
        } catch (Exception $e) {
            $success = false;
        }

    }

}
elseif($query == "delete_genre" || $query == "update_genre" || $query == "create_genre" || //жанр/категория CRUD

    $query == "delete_category" || $query == "update_category" || $query == "create_category"){

    if ($query == "update_genre" || $query == "update_category")//2 аргумента
    {
        $based_input = $_POST["based_input"];
        $new_input = $_POST["new_input"];
        $result = pg_query_params($dbconn, $query_list[$query], array($new_input, $based_input));
    }
    else//1 аргумент
    {
        $based_input = $_POST["based_input"];
        $result = pg_query_params($dbconn, $query_list[$query], array($based_input));
    }

    if (!$result) {
        $success = false;
    }
}
else{//страница разрабочтиков

    $serverPathDevelopers = '/var/www/html/devs_imgs/';
    $array_data = array();

    if(isset($_POST['developer_name']))
    {
        $developer_name = $_POST['developer_name'];
        $array_data['developer_name'] = $developer_name;

        if (isset($_POST['based_developer_name']))
        {
            $array_data['based_developer_name'] = $_POST['based_developer_name'];
        }
    }

    $result = pg_query_params($dbconn, $query_list[$query], $array_data);

    if (!$result) {
        $success = false;
    }

    $massive_result = pg_fetch_assoc($result);
    $file_id = $massive_result['autor_id'];
    
}

if ($success && isset($_FILES['screensaver']) && $_FILES['screensaver']['error'] === UPLOAD_ERR_OK) {//загрузка картинок

    if($query == 'update_game' || $query == 'update_autor'){
        $pattern = $serverPathDevelopers . $file_id . '.*';
        $existingFiles = glob($pattern);

        foreach ($existingFiles as $existingFile) {
            if (is_file($existingFile)) {
                unlink($existingFile);
            }
        }
    }
    
    $originalFileName = $_FILES['screensaver']['name'];
    $fileExtension = pathinfo($originalFileName, PATHINFO_EXTENSION);
    
    $fileName = $file_id . '.' . $fileExtension;
    $uploadFile = $serverPathDevelopers . $fileName;
    
    if (!move_uploaded_file($_FILES['screensaver']['tmp_name'], $uploadFile)) {
        $success = false;
    } else {
        if (!file_exists($uploadFile) || !is_file($uploadFile)) {
            $success = false;
        }
    }
    
}




if ($success) {
    pg_query($dbconn, "COMMIT");
    $response['status'] = true;
} else {
    pg_query($dbconn, "ROLLBACK");
    $response['status'] = false;
}

echo json_encode($response);





function handleGameCategories($action_type, $post_key, $query_key, $dbconn, $query_list, $game_id, &$success) {
    if (isset($_POST[$post_key]) && !empty($_POST[$post_key])) {
        $categories_data = $_POST[$post_key];
        
        // Преобразуем в массив чисел
        if (is_array($categories_data)) {
            $categories_array = array_map('intval', $categories_data);
        } else {
            $categories_array = array_map('intval', explode(',', $categories_data));
        }
        
        // Для операции удаления не проверяем пустоту массива, для добавления - проверяем
        if ($action_type === 'add' && empty($categories_array)) {
            return $success;
        }
        
        $result = pg_query_params($dbconn, $query_list[$query_key], 
            [$game_id, "{" . implode(',', $categories_array) . "}"]);
        
        if (!$result) {
            $success = false;
        }
    }
    
    return $success;
}


?>
