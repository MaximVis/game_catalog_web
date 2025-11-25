<?php 
    if($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['input_items_search']))
    {
        require_once 'config.php';
        require_once 'query_func.php';
        $autor_name = urldecode($_GET['input_items_search']);
        $games = get_query_answer("developers_games", $autor_name);

    }
    else
    {
        header("Location: main.php");
        exit();
    } 
    
    http_response_code(200);
?>


<?php
	require_once 'title_desc_keywords_func.php';

    $dev_games = [];
    if(is_array($games)) {
        foreach($games as $dev_game) {
            if(isset($dev_game["game_name"])) {
                $dev_games[] = $dev_game["game_name"];
            }
        }
    }

    $games_string = !empty($dev_games) ? implode(', ', $dev_games) : "";


    $meta = set_meta(
        'ALLGAMES - Разработчик '.$autor_name, 
        'Все игры разработчика '.$autor_name,' - полный список проектов, описание игр. Каталог игр студии',
        'Разработчик '.$autor_name.', Игры разработчика '.$autor_name.'Подборка игр разработчика '.$games_string

    );
?>


<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php render_meta($meta); ?>
    <link rel="stylesheet" href="static/base_styles.css">
    <link rel="stylesheet" href="static/developers_games_styles.css">
    <link rel="stylesheet" href="static/items_styles.css">
    <link rel="stylesheet" href="static/footer.css">
    <script src="static/search_items.js" defer></script>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

</head>



<body>

    <?php 
        if($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['input_items_search']))
        {
            echo '<script src="static/pagination.js" defer data-query="developers_games" data-query_param="' . htmlspecialchars($autor_name, ENT_QUOTES | ENT_HTML5, 'UTF-8') . '"></script>';
        }
    ?>

    <?php require_once 'shapka.php';?>
        <div class="container"><!-- основной контент -->
            <?php require_once 'shapka_menu.php';?>
            <h1 class = "head_word">Игры разработчика <?= $autor_name ?></h1>
            <div class = "container_items_content">
            <form class = "item items_select" action="developers.php" method="GET"> <input class = "input_items_search" type="text" id="input_items_search" name="input_items_search" placeholder="Найти разработчика"> </form>
            <div class = "item items_content">
            <?php if(empty($games)): ?>
                <label class="center_word">Игр разработчика <?= htmlspecialchars($autor_name) ?> не найдено</label>
                <?php exit; ?>
            <?php endif; ?>
            <?php foreach ($games as $game): ?>
                <a href = "https://k0j268qj-80.inc1.devtunnels.ms/game.php?game=<?= urlencode($game['game_name']) ?>" >
                <div class="item_rectangle">
                    <?php
                        $images = glob('game_imgs/' . $game['game_id'] . '.{png,jpg,jpeg}', GLOB_BRACE);
                        
                        if (!empty($images)) {
                            echo '<img class="img_game_main" src="' . $images[0] . '" alt="' . htmlspecialchars($game['game_name']) . '">';
                        } else {
                            echo '<img class="img_game_main" src="game_imgs/0.png" alt="' . htmlspecialchars($game['game_name']) . '">';
                        }
                    ?>
                    <div class="game_text_main"><?= htmlspecialchars($game['game_name']) ?>
                        <div class="text_game_main_description"><?= htmlspecialchars($game['genres']) ?></div>
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

