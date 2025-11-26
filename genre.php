<?php
    if($_SERVER["REQUEST_METHOD"] == "GET")
    {
        require_once 'config.php';
        require_once 'query_func.php';
        $list_genres = get_query_answer("genres", 0);
        $list_games = get_query_answer("main_games", 0);
    }
    else
    {
        header("Location: main.php");
        exit();
    }

     if(empty($list_genres) || empty($list_games)){
		http_response_code(500);
		require_once 'page_500.php';
		exit;
	}

	http_response_code(200);

?>

<?php
	require_once 'title_desc_keywords_func.php';

	$genre_names = [];
    if(is_array($list_genres)) {
        foreach($list_genres as $genre) {
            if(isset($genre["genre_name"])) {
                $genre_names[] = $genre["genre_name"];
            }
        }
    }

    $genre_string = !empty($genre_names) ? implode(', ', $genre_names) : "";

    $meta = set_meta(
        'ALLGAMES - жанры компьютерных игр', 
        'Подборка игр по жанрам. Игра в любимых жанрах - '. $genre_string,
        'жанры игр, подбор игр, '. $genre_string,
    );
?>



<!DOCTYPE html>
<html lang="ru">



<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php render_meta($meta); ?>
    <link rel="stylesheet" href="static/base_styles.css">
    <link rel="stylesheet" href="static/items_styles.css">
    <link rel="stylesheet" href="static/footer.css">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="static/search_items.js" defer data-query="genre"></script>
</head>



<body>

    <?php require_once 'shapka.php';?>
        <div class="container"><!-- основной контент -->
            <?php require_once 'shapka_menu.php';?>

            <h1 class = "head_word">Жанры игр</h1>

            <div class = "container_items_content">
            <div class = "item items_select">
            <ul class = "items_list" id="myList">

            <?php foreach ($list_genres as $genre): ?>
				<li class="selectable"><span class="square"></span><?= $genre['genre_name'] ?></li>
			<?php endforeach; ?>
            </ul>
            <input class = "input_items_search" type="text" id="input_items_search" placeholder="Найти жанр">
            </div>
            <div class = "item items_content">
                <?php foreach ($list_games as $game): ?>
                    <a href = "/game.php?game=<?= urlencode($game['game_name']) ?>">
                        <div class="item_rectangle">
                        <?php
                            $images = glob('game_imgs/' . $game['game_id'] . '.{png,jpg,jpeg}', GLOB_BRACE);
                            
                            if (!empty($images)) {
                                echo '<img class="img_game_main" src="' . $images[0] . '" alt="' . $game['game_name'] . '">';
                            } else {
                                echo '<img class="img_game_main" src="game_imgs/0.png" alt="' . $game['game_name'] . '">';
                            }
                        ?>
                                <div class="game_text_main">    <?= $game['game_name'] ?>
                                    <div class="text_game_main_description"> <?= $game['genres'] ?> </div>
                                </div>
                        </div>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    <?php require_once 'footer.php';?>
</body>
</html>
