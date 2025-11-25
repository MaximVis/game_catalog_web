<?php

    function query_base($query_name)
    {
        $queries = [
            "slider" => 'SELECT game.game_id, game.game_name from game LIMIT 5 offset 0;',
            "main_page_games" => 'SELECT game.game_id, game.game_name, 
                STRING_AGG(DISTINCT genre.genre_name, \', \') AS genres 
                FROM game_genre 
                JOIN game ON game.game_id = game_genre.gg_game_id 
                JOIN genre ON genre.genre_id = game_genre.gg_genre_id 
                GROUP BY game.game_id, game.game_name 
                LIMIT 10 offset 5;',
            "main_games" => 'SELECT game.game_id, game.game_name, 
                STRING_AGG(DISTINCT genre.genre_name, \', \') AS genres 
                FROM game_genre 
                JOIN game ON game.game_id = game_genre.gg_game_id 
                JOIN genre ON genre.genre_id = game_genre.gg_genre_id 
                GROUP BY game.game_id, game.game_name 
                LIMIT 10 offset 0;',
            "search_games" => 'SELECT game.game_id, game.game_name, 
                STRING_AGG(DISTINCT genre.genre_name, \', \') AS genres  
                FROM game_genre 
                JOIN game ON game.game_id = game_genre.gg_game_id  
                JOIN genre ON genre.genre_id = game_genre.gg_genre_id  
                WHERE lower(game.game_name) LIKE lower($1 || \'%\') 
                GROUP BY game.game_id, game.game_name  
                LIMIT 10 OFFSET 0',
            "genres" => 'SELECT genre_id, genre_name from genre;',
            "categories" => 'SELECT category_id, category_name from category;',
            "autors" => 'select * from autor limit 10 offset 0',
            "search_autors" => 'SELECT * FROM autor 
                WHERE lower(autor.autor_name) LIKE lower($1 || \'%\') 
                LIMIT 10 OFFSET 0',
            "developers_games" => 'SELECT autor_id, autor_name, game_id, game.game_name, 
                STRING_AGG(DISTINCT genre.genre_name, \', \') AS genres 
                FROM game_genre 
                JOIN game ON game.game_id = game_genre.gg_game_id 
                JOIN genre ON genre.genre_id = game_genre.gg_genre_id 
                join autor ON autor.autor_id = game.game_autor_id 
                WHERE LOWER(autor.autor_name) LIKE lower($1 || \'%\') 
                GROUP BY game_id, game.game_name, autor_id, autor_name 
                LIMIT 10 offset 0;',
            "game" => "SELECT game.game_id, game.game_name, game.game_description, autor.autor_name 
                FROM game 
                JOIN autor ON game.game_autor_id = autor.autor_id 
                WHERE game.game_name LIKE $1",
            "game_category_genre" => "SELECT 
                    game.game_id,
                    game.game_name,
                    game.game_description,
                    autor.autor_name,
                    (
                        SELECT STRING_AGG(genre.genre_name, ', ')
                        FROM game_genre
                        JOIN genre ON game_genre.gg_genre_id = genre.genre_id
                        WHERE game_genre.gg_game_id = game.game_id
                    ) as genres,
                    (
                        SELECT STRING_AGG(category.category_name, ', ')
                        FROM game_category
                        JOIN category ON game_category.gc_category_id = category.category_id
                        WHERE game_category.gc_game_id = game.game_id
                    ) as categories
                FROM game
                JOIN autor ON game.game_autor_id = autor.autor_id
                WHERE game.game_name = $1;",
            "auth" => "SELECT admin_password, admin_id from user_admin where admin_login = $1;",
            "author" => "SELECT autor_id, autor_name from autor where autor_name = $1;",
            "game_genres" => "SELECT gg_genre_id, genre_name
                FROM game_genre
                LEFT JOIN genre ON gg_genre_id = genre_id 
                WHERE gg_game_id = $1;",
            "game_categories" => "SELECT gc_category_id, category_name
                FROM game_category
                LEFT JOIN category ON gc_category_id = category_id 
                WHERE gc_game_id = $1;",
        ];

        return $queries[$query_name];
    }

    function get_query_answer($query_name, $query_param)
    {
        require_once 'config.php';
		$dbconn = get_db_connection();
		if (!$dbconn) {
			die('Ошибка соединения');
			exit();
		}

        $query = query_base($query_name);

        if ($query_param == 0)
        {
            $result_query = pg_query($dbconn, $query) or die('Ошибка соединения ');
        }
        else
        {
            $result_query = pg_query_params($dbconn, $query, array($query_param)) or die('Ошибка запроса');
        }

        if($query_name == 'game' || $query_name == 'auth' || $query_name == 'author' || $query_name == 'game_category_genre')
        {
            $get_all_result = pg_fetch_assoc($result_query);
        }
        else
        {
            $get_all_result = pg_fetch_all($result_query);
        }
        pg_free_result($result_query);
        pg_close($dbconn);

        return $get_all_result;

    }


?>