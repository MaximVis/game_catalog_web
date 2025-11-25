<?php
        
        require_once 'query_func.php';

        $genres = get_query_answer("genres", 0);
        $selected_genre = [];

        $categories = get_query_answer("categories", 0);
        $selected_category = [];

        $bAdd_game = False;

        if($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['game']))
        {

            $game_name = urldecode($_GET['game']);

            $result = get_query_answer("game", $game_name);
            $text_dscrpt = str_replace('<br>', "\n", $result['game_description']);

            if (!$result)
            {
                die('Ошибка соединения');
                exit();
            }

            $game_genres = get_query_answer("game_genres", $result['game_id']);
            $game_categories = get_query_answer("game_categories", $result['game_id']);
        }
        else
        {
            $bAdd_game = True;
        }
	?>

<?php

    require_once 'auth_func.php';

    if (!isUserLoggedIn()) {
        header('Location: auth_page.php');
        exit();
    }

?>

<?php

	require_once 'title_desc_keywords_func.php';

    if($bAdd_game)
    {
        $meta = set_meta(
            'Добавление новой игры', 
            'Добавить новую игру в каталог, добавление информации к игре(разработчик, категории и жанры игры)',
            'Новая игра, разработчик, жанры, категории'
	    );
    }
    else
    {
        $meta = set_meta(
            'Изменение информации об игре '.htmlspecialchars($game_name), 
            'Изменить информацию об игре '.htmlspecialchars($game_name).'. Изменить категории, жанры у игры, удалить игру, изменить разработчика игры',
            'Изменение данных об игре, добавление категорий, добавление жанров, изменение разработчика, удалить игру'
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
    <link rel="stylesheet" href="static/admin_styles.css">
    <link rel="stylesheet" href="static/dev_game_admin_page.css">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="static/add_delete_genre_category.js" defer></script>
    <script src="static/preview_game_page.js" defer></script>
    <script src="static/create_object.js" defer></script>
</head>



<body>

    

    <div id="gameData" 
        data-game-id="<?php echo !$bAdd_game && isset($result['game_id']) ? $result['game_id'] : ''; ?>">
    </div>

    <?php require_once 'shapka.php';?>
	<div class="container"><!-- основной контент -->
		<?php require_once 'shapka_menu.php';?>

        <?php if ($bAdd_game): ?>
            <h1 class="head_word">Добавление новой игры</h1>
        <?php else: ?>
            <h1 class="head_word">Изменить данные о игре <?= htmlspecialchars($result['game_name']) ?></h1>
            <form method="POST" id="deleteForm">
                <button type="submit" class = "admin_but" id = delete_object name="delete_button">Удалить страницу игры</button>
            </form>
        <?php endif; ?>

        <div class = container_main_page_content><!-- блоки игр -->


            <div class = "game_text_description_game">

                <form method="post" id = create_object enctype="multipart/form-data">
                <div>

                    <div id="data-container" 
                        data-genres='<?php echo json_encode($genres); ?>'
                        data-categories='<?php echo json_encode($categories); ?>'
                        <?php if(!$bAdd_game): ?>
                            data-game-genres='<?php echo json_encode($game_genres); ?>'
                            data-game-categories='<?php echo json_encode($game_categories); ?>'>
                        <?php endif; ?>
                    </div>


                    <div class="uploader_container">
                        <label for="screensaver" class="uploader_but">Загрузить изображение</label>
                        <input type="file" name="screensaver" id="screensaver" accept=".png,.jpg,.jpeg,image/png,image/jpeg">
                    </div>

                    <button type="button" id="cancelUpload" class="admin_but cancel_but">Удалить изображение</button>
                    <input type="hidden" name="temp_avatar" value="<?php echo isset($_SESSION['game_screen']) ? $_SESSION['game_screen'] : ''; ?>">


                    <?php if(isset($_SESSION['game_screen']) && file_exists($_SESSION['game_screen'])): ?>
                        <img src="<?php echo $_SESSION['temp_avatar']; ?>" style="max-width: 200px; margin: 10px 0;">
                    <?php endif; ?>
                    
                    <div class="form_word"><label for="developer">Разработчик:</label></div>
                    <input class = "input_data" type="text" id="developer" name="developer" 
                        value="<?php 
                            if (!$bAdd_game && isset($result['autor_name'])) {
                                echo htmlspecialchars($result['autor_name']);
                            }
                        ?>"
                        data-based-autor="<?php 
                            if (!$bAdd_game && isset($result['autor_name'])) {
                                echo htmlspecialchars($result['autor_name']);
                            }
                        ?>">

                    <div class="form_word"><label for="game_name">Название игры:</label></div>
                    <input class = "input_data"  type="text" id="game_name" name="game_name" 
                        value="<?php 
                            if (!$bAdd_game && isset($result['game_name'])) {
                                echo htmlspecialchars($result['game_name']);
                            }
                        ?>"
                        data-based-name="<?php 
                            if (!$bAdd_game && isset($result['game_name'])) {
                                echo htmlspecialchars($result['game_name']);
                            }
                        ?>">

                    <div class="form_word"><label for="game_description">Описание игры:</label></div>
                    <textarea class = "input_data" id="game_description" name="game_description" rows="10" cols="100" 
                        data-based-description="<?php 
                            if (!$bAdd_game && isset($text_dscrpt)) {
                                echo htmlspecialchars($text_dscrpt);
                            }
                        ?>"><?php 
                        if (!$bAdd_game && isset($text_dscrpt)) {
                            echo htmlspecialchars($text_dscrpt);
                        }
                    ?></textarea>

                    <?php
                        if (!$bAdd_game){
                            $text = str_replace("\n", '<br>', $text_dscrpt);
                        }
                    ?>

                    <div class="form_word"><label for="game_genre">Добавить жанр игры</label></div>
                    <input class = "input_data" type="text" id="game_genre" name="game_genre" list="genreList">
                    <datalist id="genreList">
                        <?php foreach($genres as $genre): ?>
                            <option value="<?php echo htmlspecialchars($genre['genre_name']); ?>">
                        <?php endforeach; ?>
                    </datalist>
                    
                    <!-- Контейнер для отображения выбранных жанров -->
                    <div class = "game_info" id="selectedGenres">
                        <?php 
                            if (!$bAdd_game && isset($game_genres) && !empty($game_genres)) {
                                foreach($game_genres as $genre) {
                                    $genre_name = $genre['genre_name'];
                                    echo '<span class="genre_tag" data-value="' . htmlspecialchars($genre_name) . '">' 
                                        . htmlspecialchars($genre_name) 
                                        . '<button type="button" class="remove_genre">×</button></span>';
                                }
                            }
                        ?>
                    </div>

                    <!-- Скрытое поле для хранения выбранных жанров -->
                    <input type="hidden" id="genre_chose" name="genre_chose" value="">

                    <div class="form_word"><label for="game_category">Добавить категорию игры</label></div>
                    <input class = "input_data" type="text" id="game_category" name="game_category" list="categoryList">
                    <datalist id="categoryList">
                        <?php foreach($categories as $category): ?>
                            <option value="<?php echo htmlspecialchars($category['category_name']); ?>">
                        <?php endforeach; ?>
                    </datalist>
                    
                    <!-- Контейнер для отображения выбранных категорий -->
                    <div class = "game_info" id="selectedCategories">
                        <?php 
                            if (!$bAdd_game && isset($game_categories) && !empty($game_categories)) {
                                foreach($game_categories as $category) {
                                    $category_name = $category['category_name'];
                                    echo '<span class="category_tag" data-value="' . htmlspecialchars($category_name) . '">' 
                                        . htmlspecialchars($category_name) 
                                        . '<button type="button" class="remove_category">×</button></span>';
                                }
                            }
                        ?>
                    </div>

                    <!-- Скрытое поле для хранения выбранных категорий -->
                    <input type="hidden" id="category_chose" name="category_chose" value="">


                    <div class="form_word">Предпросмотр:</div>
                    <!-- Предпросмотр большого блока -->
                    <div class="game_rectangle_max">
                        <img class="img_game_main_max" src="<?php 
                            if (isset($_SESSION['temp_avatar']) && file_exists($_SESSION['temp_avatar'])) {
                                echo $_SESSION['temp_avatar'];
                            } elseif (!$bAdd_game && isset($result['game_id'])) {
                                $images = glob('game_imgs/' . $result['game_id'] . '.{png,jpg,jpeg}', GLOB_BRACE);
                                if (!empty($images)) {
                                    echo $images[0];
                                } else {
                                    echo 'game_imgs/0.png';
                                }
                            } else {
                                echo 'game_imgs/0.png';
                            }
                        ?>" alt="Preview">
                        <div class="game_text_main">
                            <?php 
                                // Используем введенное название если есть, иначе существующее
                                if (isset($_POST['game_name']) && !empty($_POST['game_name'])) {
                                    echo htmlspecialchars($_POST['game_name']);
                                } elseif (!$bAdd_game && isset($result['game_name'])) {
                                    echo htmlspecialchars($result['game_name']);
                                } else {
                                    echo 'Название игры';
                                }
                            ?>
                            <div class="text_game_main_description_max" id="previewGenres">
                                <?php 
                                    if (!$bAdd_game && isset($game_genres) && !empty($game_genres)) {
                                        $genre_names = array_map(function($genre) {
                                            return $genre['genre_name'];
                                        }, $game_genres);
                                        echo htmlspecialchars(implode(', ', $genre_names));
                                    } else {
                                        echo 'Жанры игры';
                                    }
                                ?>
                            </div>
                        </div>
                    </div>

                    </br>

                    <!-- Предпросмотр маленького блока -->
                    <div class="game_rectangle_min">
                        <img class="img_game_main_min" src="<?php 
                            if (isset($_SESSION['temp_avatar']) && file_exists($_SESSION['temp_avatar'])) {
                                echo $_SESSION['temp_avatar'];
                            } elseif (!$bAdd_game && isset($result['game_id'])) {
                                $images = glob('game_imgs/' . $result['game_id'] . '.{png,jpg,jpeg}', GLOB_BRACE);
                                if (!empty($images)) {
                                    echo $images[0];
                                } else {
                                    echo 'game_imgs/0.png';
                                }
                            } else {
                                echo 'game_imgs/0.png';
                            }
                        ?>" alt="Preview">
                        <div class="game_text_main">
                            <?php 
                                // Используем введенное название если есть, иначе существующее
                                if (isset($_POST['game_name']) && !empty($_POST['game_name'])) {
                                    echo htmlspecialchars($_POST['game_name']);
                                } elseif (!$bAdd_game && isset($result['game_name'])) {
                                    echo htmlspecialchars($result['game_name']);
                                } else {
                                    echo 'Название игры';
                                }
                            ?>
                            <div class="text_game_main_description_min" id="previewGenresMin">
                                <?php 
                                    if (!$bAdd_game && isset($game_genres) && !empty($game_genres)) {
                                        $genre_names = array_map(function($genre) {
                                            return $genre['genre_name'];
                                        }, $game_genres);
                                        echo htmlspecialchars(implode(', ', $genre_names));
                                    } else {
                                        echo 'Жанры игры';
                                    }
                                ?>
                            </div>
                        </div>
                    </div>

                    



                    <!-- Предпросмотр страницы игры -->
                    <div class="form_word">Предпросмотр страницы игры:</div>
                    

                    <!-- Заголовок с названием игры и автором -->
                    <div class="head_word_game">
                        <span id="previewGameName">
                            <?php 
                                if (isset($_POST['game_name']) && !empty($_POST['game_name'])) {
                                    echo htmlspecialchars($_POST['game_name']);
                                } elseif (!$bAdd_game && isset($result['game_name'])) {
                                    echo htmlspecialchars($result['game_name']);
                                } else {
                                    echo 'Название игры';
                                }
                            ?>
                        </span> 
                        <br>
                            Разработчик: <span id="previewDeveloper">
                            <?php 
                                if (isset($_POST['developer']) && !empty($_POST['developer'])) {
                                    echo htmlspecialchars($_POST['developer']);
                                } elseif (!$bAdd_game && isset($result['autor_name'])) {
                                    echo htmlspecialchars($result['autor_name']);
                                } else {
                                    echo 'Имя разработчика';
                                }
                            ?>
                        </span>
                    </div>

                    <!-- Изображение игры -->
                    <img class="img_game" id="previewGameImage" src="<?php 
                        if (isset($_SESSION['temp_avatar']) && file_exists($_SESSION['temp_avatar'])) {
                            echo $_SESSION['temp_avatar'];
                        } elseif (!$bAdd_game && isset($result['game_id'])) {
                            $images = glob('game_imgs/' . $result['game_id'] . '.{png,jpg,jpeg}', GLOB_BRACE);
                            if (!empty($images)) {
                                echo $images[0];
                            } else {
                                echo 'game_imgs/0.png';
                            }
                        } else {
                            echo 'game_imgs/0.png';
                        }
                    ?>" alt="Preview game image">

                    <!-- Описание игры -->
                    <div class="game_text_description_game"><br>
                        <span id="previewGameDescription">
                            <?php 
                                if (isset($_POST['game_description']) && !empty($_POST['game_description'])) {
                                    echo nl2br(htmlspecialchars($_POST['game_description']));
                                } elseif (!$bAdd_game && isset($text_dscrpt)) {
                                    echo nl2br(htmlspecialchars($text_dscrpt));
                                } else {
                                    echo 'Описание игры';
                                }
                            ?>
                        </span>
                    </div>










                    
                    <div class="sub_message" id="sub_message"></div>
                    <button type="submit" class = "admin_but" name="save">Сохранить игру</button>

                </div>
                </form>
            </div>
            
        </div>
    </div>
</body>
</html>