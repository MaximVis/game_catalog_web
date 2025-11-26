<?php
    if($_SERVER["REQUEST_METHOD"] == "GET")
    {
        require_once 'config.php';
        require_once 'query_func.php';
        $list_categories = get_query_answer("categories", 0);
        $list_games = get_query_answer("main_games", 0);
    }
    else
    {
        header("Location: main.php");
        exit();
    }

    if(empty($list_categories) || empty($list_games)){
		http_response_code(500);
		require_once 'page_500.php';
		exit;
	}

	http_response_code(200);
?>


<?php
	require_once 'title_desc_keywords_func.php';

    $category_names = [];
    if(is_array($list_categories)) {
        foreach($list_categories as $category) {
            if(isset($category["category_name"])) {
                $category_names[] = $category["category_name"];
            }
        }
    }

    $category_string = !empty($category_names) ? implode(', ', $category_names) : "";

    $meta = set_meta(
        'ALLGAMES - категории компьютерных игр', 
        'Подборка игр по категориям. Найдите идеальную игру по вкусу - '. $category_string,
        'категории игр, подбор игр, '. $category_string,
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
    <script src="static/search_items.js" defer data-query="category"></script>
</head>



<body>

    



    <?php require_once 'shapka.php';?>
        <div class="container"><!-- основной контент -->
            <?php require_once 'shapka_menu.php';?>

            <h1 class = "head_word">Категории игр</h1>

            <div class = "container_items_content">
            <div class = "item items_select">
            <ul class = "items_list" id="myList">

            <?php foreach ($list_categories as $category): ?>
				<li class="selectable"><span class="square"></span><?= htmlspecialchars($category['category_name']) ?></li>
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
                                echo '<img class="img_game_main" src="' . $images[0] . '" alt="' . htmlspecialchars($game['game_name']) . '">';
                            } else {
                                echo '<img class="img_game_main" src="game_imgs/0.png" alt="' . htmlspecialchars($game['game_name']) . '">';
                            }
                        ?>
                        <div class="game_text_main">    <?= htmlspecialchars($game['game_name']) ?>
                            <div class="text_game_main_description"> <?= htmlspecialchars($game['genres']) ?> </div>
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
