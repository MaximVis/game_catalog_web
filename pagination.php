<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    header('Location: /page_403.php');
    exit();
}

$query = $_POST['query'];
$array_params = $_POST['array_params'];

$query_list = 
[
    'games_search_post' => 'SELECT game.game_id, game.game_name, 
                       STRING_AGG(DISTINCT genre.genre_name, \', \') AS genres 
                       FROM game_genre 
                       JOIN game ON game.game_id = game_genre.gg_game_id 
                       JOIN genre ON genre.genre_id = game_genre.gg_genre_id 
                       WHERE lower(game.game_name) like lower($2) 
                       GROUP BY game.game_id, game.game_name 
                       LIMIT 10 OFFSET $1;',

    'games_search_get' => 'SELECT game.game_id, game.game_name, 
                        STRING_AGG(DISTINCT genre.genre_name, \', \') AS genres 
                        FROM game_genre 
                        JOIN game ON game.game_id = game_genre.gg_game_id 
                        JOIN genre ON genre.genre_id = game_genre.gg_genre_id 
                        GROUP BY game.game_id, game.game_name 
                        LIMIT 10 OFFSET $1',

    'developers_games' => 'SELECT autor_id, autor_name, game_id, game.game_name, 
                        STRING_AGG(DISTINCT genre.genre_name, \', \') AS genres 
                        FROM game_genre 
                        JOIN game ON game.game_id = game_genre.gg_game_id 
                        JOIN genre ON genre.genre_id = game_genre.gg_genre_id 
                        JOIN autor ON autor.autor_id = game.game_autor_id 
                        WHERE LOWER(autor.autor_name) LIKE lower($2) 
                        GROUP BY game_id, game.game_name, autor_id, autor_name 
                        LIMIT 10 OFFSET $1;',

    'developers_get' => 'SELECT autor_id, autor_name 
                        FROM autor 
                        LIMIT 10 OFFSET $1;',

    'developers_post' => 'SELECT autor_id, autor_name 
                        FROM autor 
                        WHERE lower(autor.autor_name) LIKE lower($2) 
                        LIMIT 10 OFFSET $1;',

    'genre' => 'SELECT game_id, game_name, STRING_AGG(DISTINCT genre.genre_name, \', \') AS genres 
            FROM game_genre 
            JOIN game ON game.game_id = game_genre.gg_game_id 
            JOIN genre ON genre.genre_id = game_genre.gg_genre_id 
            WHERE EXISTS (
                SELECT 1 
                FROM game_genre 
                JOIN genre ON genre_id = gg_genre_id 
                WHERE gg_game_id = game.game_id 
                AND genre_name = ANY ($1) 
                GROUP BY gg_game_id 
                HAVING COUNT(DISTINCT genre_name) = $2
            ) 
            GROUP BY game_id, game_name 
            LIMIT 10 OFFSET $3;',

    'category' => 'SELECT game_id, game_name, STRING_AGG(DISTINCT genre.genre_name, \', \') AS genres 
               FROM game_genre 
               JOIN game ON game.game_id = game_genre.gg_game_id 
               JOIN genre ON genre.genre_id = game_genre.gg_genre_id 
               WHERE EXISTS (
                   SELECT 1 
                   FROM game_category 
                   JOIN category ON category_id = gc_category_id 
                   WHERE gc_game_id = game.game_id 
                   AND category_name = ANY ($1) 
                   GROUP BY gc_game_id 
                   HAVING COUNT(DISTINCT category_name) = $2
               ) 
               GROUP BY game_id, game_name 
               LIMIT 10 OFFSET $3;',

    "developer_search" => "SELECT autor_id, autor_name FROM autor WHERE lower(autor.autor_name) = lower($1)",

    "genre_exists" => "SELECT genre_name, genre_id from genre WHERE lower(genre_name) = lower($1)",

    "category_exists" => "SELECT category_name, category_id from category WHERE lower(category_name) = lower($1)",

    "game_search" => "SELECT game_id, game_name FROM game WHERE lower(game.game_name) = lower($1)",

    'categories_no_name' => 'SELECT category.category_id, category.category_name 
                        FROM category 
                        LIMIT 10 OFFSET $1;',

    'categories_name' => 'SELECT category.category_id, category.category_name 
                        FROM category 
                        WHERE lower(category.category_name) LIKE lower($2) 
                        LIMIT 10 OFFSET $1;',
];

require_once 'config.php';
$dbconn = get_db_connection();
if (!$dbconn) {
    die('Ошибка соединения');
    exit();
}

$allowed_extensions = ['png', 'jpg', 'jpeg'];

$result = pg_query_params($dbconn, $query_list[$query], $array_params);

$data = array();

if($query == 'developers_get' || $query == 'developers_post' || $query == 'developer_search')
{
    $autor_name_arr = [];
    $autor_id_arr = [];
    $autor_pic_extension_arr = [];
    

    while ($autor_str = pg_fetch_assoc($result))
    {
        // if(!file_exists('devs_imgs/' .$autor_str['autor_id'].'.png'))
        // {
        //     $autor_id_arr[] = 0;
        // }

        $extension_found = '';

        foreach ($allowed_extensions as $ext) {
            $file_path = 'devs_imgs/' . $autor_str['autor_id'] . '.' . $ext;
            if (file_exists($file_path)) {
                $extension_found = '.' . $ext;
                break;
            }
        }
        
        if ($extension_found == '')
        {
            $autor_id_arr[] = 0;
            $autor_pic_extension_arr[] = '.png';
        }
        else{
            $autor_id_arr[] = $autor_str['autor_id'];
            $autor_pic_extension_arr[] = $extension_found;
        }

        $autor_name_arr[] = $autor_str['autor_name'];
    }

    $data = array(
        'autor_id' => $autor_id_arr,
        'autor_name' => $autor_name_arr,
        'extension' => $autor_pic_extension_arr
    );
}
elseif($query == 'genre_exists' || $query == 'category_exists' || $query == 'categories_no_name' || $query == 'categories_name')
{
    if ($query == 'genre_exists' || $query == 'category_exists')
    {
        $name = pg_fetch_assoc($result);
        $data = array('gen_cat_name' => $name,);
    }
    else
    {
        $row = pg_fetch_assoc($result);

        if ($row) {
            
            if ($query == 'categories_no_name' || $query == 'categories_name')
            {
                $data = array(
                    'gen_cat_name' => $row['category_name'],
                    'gen_cat_id' => $row['category_id'] 
                );
            }
            else
            {
                $data = array(
                    'gen_cat_name' => $row['genre_name'], 
                    'gen_cat_id' => $row['genre_id']    
                );
            }

        } else {
            $data = array(
                'gen_cat_name' => '',
                'gen_cat_id' => null
            );
        }
    }

}
else
{
    $game_name_arr = [];
    $game_id_arr = [];
    $game_genre_arr = [];
    $game_pic_extension_arr = [];

    while ($game_str = pg_fetch_assoc($result))
    {
        $game_name_arr[] = $game_str['game_name'];
        $game_id_arr[] = $game_str['game_id'];
        $game_genre_arr[] = $game_str['genres'];

        $extension_found = '';
        foreach ($allowed_extensions as $ext) {
            $file_path = 'game_imgs/' . $game_str['game_id'] . '.' . $ext;
            if (file_exists($file_path)) {
                $extension_found = '.' . $ext;
                break;
            }
        }
    
        $game_pic_extension_arr[] = $extension_found;
    }

    $data = array(
        'game_id' => $game_id_arr,
        'game_name' => $game_name_arr,
        'genres' => $game_genre_arr,
        'extension' => $game_pic_extension_arr
    );
}


echo json_encode($data);


pg_free_result($result);
pg_close($dbconn);

?>

