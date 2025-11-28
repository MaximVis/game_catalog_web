<?php
    if($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['game']))
    {
        require_once 'query_func.php';
        $game_name = urldecode($_GET['game']);
        $result = get_query_answer("game_category_genre", $game_name);
        if (!$result)
        {
            http_response_code(404);
            require_once 'page_404.php';
            exit;
        }
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

$genre_names = [];
$category_names = [];

// Проверяем и обрабатываем жанры
if(isset($result['genres'])) {
    if(is_array($result['genres'])) {
        // Если это массив
        foreach($result['genres'] as $genre) {
            // В зависимости от структуры данных
            if(is_array($genre) && isset($genre['name'])) {
                $genre_names[] = $genre['name'];
            } else {
                $genre_names[] = $genre;
            }
        }
    } else {
        // Если это строка (например, "Action, Adventure, RPG")
        $genre_names = array_map('trim', explode(',', htmlspecialchars($result['genres'])));
    }
}

// Проверяем и обрабатываем категории
if(isset($result['categories'])) {
    if(is_array($result['categories'])) {
        // Если это массив
        foreach($result['categories'] as $category) {
            // В зависимости от структуры данных
            if(is_array($category) && isset($category['name'])) {
                $category_names[] = $category['name'];
            } else {
                $category_names[] = $category;
            }
        }
    } else {
        // Если это строка
        $category_names = array_map('trim', explode(',', htmlspecialchars($result['categories'])));
    }
}

$genre_string = !empty($genre_names) ? implode(', ', $genre_names) : "";
$category_string = !empty($category_names) ? implode(', ', $category_names) : "";

if(isset($game_name) && isset($result['game_description'])) {
    $sentences = preg_split('/(?<=[.!?])\s+/', nl2br(htmlspecialchars($result['game_description'])), -1, PREG_SPLIT_NO_EMPTY);
    $splsent = array_slice($sentences, 0, 5);
    $desc_str = implode(' ', $splsent);

    $meta = set_meta(
        $game_name, 
        'Игра '.$game_name.'. ' .$desc_str,
        'Игра '.$game_name.', описание игры, '.$category_string.', '.$genre_string
    );
}
?> 


<!DOCTYPE html>
<html lang="ru">



<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php render_meta($meta); ?>
    <link rel="stylesheet" href="static/base_styles.css">
    <link rel="stylesheet" href="static/game_styles.css">
    <link rel="stylesheet" href="static/bread_crumbs.css">
    <link rel="stylesheet" href="static/footer.css">
</head>



<body>

    <?php require_once 'shapka.php';?>
	<div class="container"><!-- основной контент -->
		<?php require_once 'shapka_menu.php';?>

        <?php

            $referer = $_SERVER['HTTP_REFERER'] ?? '';
            $currentPage = "игра ". htmlspecialchars($result["game_name"]); // Название страницы

            if($referer){
                $parsed = parse_url($referer);
        
                // Получаем путь с параметрами
                $path_with_query = $parsed['path'] ?? '';
                if (isset($parsed['query'])) {
                    $path_with_query .= '?' . $parsed['query'];
                }
            }

            if(!empty($referer)){

                echo '<div class="breadcrumbs">';
                echo '<a href="/" class="breadcrumb">Главная</a> <span class ="arrow">→</span> ';

                if (strpos($referer, '/games_search.php') !== false) {//открытие через поиск игр
                    echo '<a href="/games_search.php" class="breadcrumb">Список игр</a> <span class ="arrow">→</span> ';
                } elseif (strpos($referer, "/developers_games.php") !== false) {//открытие страницы через разработчика 
                    echo '<a href="/developers.php" class="breadcrumb">Разработчики</a> <span class ="arrow">→</span> ';
                    echo '<a href='.$path_with_query.' class="breadcrumb">Разработчик '.$result["autor_name"].'</a> <span class ="arrow">→</span> ';
                } elseif (strpos($referer, 'genre.php') !== false) {//открытие через жанры
                    echo '<a href="/genre.php" class="breadcrumb">Жанры игр</a> <span class ="arrow">→</span> ';
                } elseif (strpos($referer, '/categories.php') !== false) {//открытие через категории
                    echo '<a href="/categories.php" class="breadcrumb">Категории игр</a> <span class ="arrow">→</span> ';
                }
                elseif (strpos($referer, '/') !== false) {//открытие через главное меню
                    null;    
                }

                echo '<span class="breadcrumb current">' . $currentPage . '</span>';
                echo '</div>';
            }
        ?>



        <h1 class = "head_word">
            <?php echo htmlspecialchars($result['game_name']); ?> </br>
                Разработчик: <a href="/developers_games.php?input_items_search=<?php echo urlencode($result['autor_name']); ?>">
                <?php echo $result['autor_name']; ?></a>
        </h1>
        <div class = container_main_page_content><!-- блоки игр -->
            
            <?php 
                $image_path = null;
                $extensions = ['png', 'jpg', 'jpeg'];

                foreach ($extensions as $ext) {
                    if (file_exists('game_imgs/' . $result['game_id'] . '.' . $ext)) {
                        $image_path = 'game_imgs/' . $result['game_id'] . '.' . $ext;
                        break;
                    }
                }
			?>
        
            <?php if ($image_path): ?>
                <img class="img_game" src="<?= $image_path ?>" alt="<?= htmlspecialchars($result['game_name']) ?>">
            <?php endif; ?>
            <div class = "game_text_description_game">
                <h2>Описание игры:</h2>
                <?php echo nl2br($result['game_description']); ?>
            </div>



            <!-- Блок для отображения жанров и категорий -->
            <div class="game_info">
                <?php if (!empty($result['genres'])): ?>
                    <div class="genres_block">
                        <span class = "head_cat_gen">Жанры:</span>
                        <div class = "item_block">
                            <?php 
                                $genres_array = is_array($result['genres']) ? $result['genres'] : explode(',', $result['genres']);
                                foreach($genres_array as $genre): 
                                    $genre = trim($genre);
                                    if (!empty($genre)):
                            ?>
                                <span class = "item_game_info">
                                    <?php echo htmlspecialchars($genre); ?>
                                </span>
                            <?php 
                                    endif;
                                endforeach; 
                            ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>

            <div class="game_info">    
                <?php if (!empty($result['categories'])): ?>
                    <div class="categories_block">
                        <span class = "head_cat_gen">Категории:</span>
                        <div class = "item_block">
                            <?php 
                                $categories_array = is_array($result['categories']) ? $result['categories'] : explode(',', $result['categories']);
                                foreach($categories_array as $category): 
                                    $category = trim($category);
                                    if (!empty($category)):
                            ?>
                                <span class = "item_game_info">
                                    <?php echo htmlspecialchars($category); ?>
                                </span>
                            <?php 
                                    endif;
                                endforeach; 
                            ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <?php require_once 'footer.php';?>
</body>
</html>