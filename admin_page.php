<?php
    require_once 'auth_func.php';
    require_once "query_func.php";

    if (!isUserLoggedIn()) {
        header('Location: auth_page.php');
        exit();
    }

    if (isset($_GET['action']) && $_GET['action'] === 'logout') {
        logoutUser();
        header('Location: auth_page.php');
        exit;
    }

    require_once 'title_desc_keywords_func.php';

    $meta = set_meta(
        'Админ панель', 
        'Панель администратора, редактирование/удаление/создание новых игр, разработчиков, жанров и категорий',
        'Панель администратора, удаление, добавление, редактирование, игр, игры, жанры, категории, разработчики'
    );



    $games = get_query_answer("main_games", 0);
    $list_autors = get_query_answer("autors", 0);
    $list_categories = get_query_answer("main_categories_list", 0);
    $list_genres = get_query_answer("main_genres_list", 0);
?>

<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php render_meta($meta); ?>
    <link rel="stylesheet" href="static/developers_styles.css">
    <link rel="stylesheet" href="static/game_page_styles.css">
    <link rel="stylesheet" href="static/base_styles.css">
    <link rel="stylesheet" href="static/admin_styles.css">
    <link rel="stylesheet" href="static/admin_page_styles.css">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="static/admin_page_search.js" defer></script>
    <script src="static/CRUD_Genre_Category.js" defer></script>
    <script src="static/admin_page.js" defer></script>
</head>

<body>
    <?php require_once 'shapka.php';?>
    
    <div class="container"><!-- основной контент -->
        <?php require_once 'shapka_menu.php';?>

        <div class="header_">
            <span class="login">
                <?php 
                echo $_SESSION['user_login']; 
                if (isset($_SESSION['vk_user_name'])) {
                    echo ' (' . $_SESSION['vk_user_name'] . ')';
                }
                ?>
            </span>
            <a href="?action=logout" class="logout">Выход</a>
        </div>

        <h1 class = "head_word">Панель администратора</h1>


         <!-- Контейнер для табов -->
        <div class="admin_tabs_container">
            <!-- Кнопки переключения табов -->
            <div class="admin_tabs_header">
                <button class="tab_button active" data_tab="games">Игры</button>
                <button class="tab_button" data_tab="developers">Разработчики</button>
                <button class="tab_button" data_tab="categories">Категории</button>
                <button class="tab_button" data_tab="genres">Жанры</button>
            </div>

            <!-- Содержимое табов -->
            <div class="admin_tabs_content">
                <!-- Таб 1: Игры -->
                <div class="tab_content active" id="games_tab">
                    <!-- Форма поиска игры -->
                    <form action="game_admin.php" method="GET"><button class ="button_menu">Добавить новую игру</button></form>
                    <form class="admin_form" id="admin_form_game">
                        <label class="form_word">Поиск игры:</label>
                        <input class="input_form_search" type="text" id="admin_search_game" name="search_game" placeholder="Введите название игры" required>
                        <input type="hidden" name="admin_search" value="true">
                    </form>

                    <div class="games_container">
                        <?php foreach ($games as $game): ?>
                            <a href="/game_admin.php?game=<?php echo urlencode($game['game_name']); ?>">
                                <div class="game_rectangle">
                                    <?php
                                        $images = glob('game_imgs/' . $game['game_id'] . '.{png,jpg,jpeg}', GLOB_BRACE);
                                        
                                        if (!empty($images)) {
                                            echo '<img class="img_game_main" src="' . $images[0] . '" alt="' . $game['game_name'] . '">';
                                        } else {
                                            echo '<img class="img_game_main" src="game_imgs/0.png" alt="' . $game['game_name'] . '">';
                                        }   
                                    ?>
                                    <div class="game_text_main">
                                        <?= htmlspecialchars($game['game_name']) ?>
                                        <div class="text_game_main_description"><?= $game['genres'] ?></div>
                                    </div>
                                </div>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- Таб 2: Разработчики -->
                <div class="tab_content" id="developers_tab">
                    <!-- Форма поиска разработчика -->
                    <form action="admin_developers_page.php" method="GET"><button class ="button_menu">Добавить нового разработчика</button></br></form>
                    <form class="admin_form" id="admin_form_dev">
                        <label class="form_word">Поиск разработчика:</label>
                        <input class="input_form_search" type="text" id="admin_search_developers" name="input_items_search" placeholder="Введите разработчика" required>
                        <input type="hidden" name="admin_search" value="true">
                        <!-- <input type="submit" class="search_value_button" value="Поиск разработчика"> -->
                    </form>

                    <div class="developers_container">

                        <?php foreach ($list_autors as $autor): ?>
                        
                            <?php 
                                $image_path = null;
                                $extensions = ['png', 'jpg', 'jpeg'];

                                foreach ($extensions as $ext) {
                                    if (file_exists('devs_imgs/' . $autor['autor_id'] . '.' . $ext)) {
                                        $image_path = 'devs_imgs/' . $autor['autor_id'] . '.' . $ext;
                                        break;
                                    }
                                }

                                if (!$image_path) {
                                    $image_path = 'devs_imgs/0.png';
                                }
                            ?>
                            <a href="/admin_developers_page.php?input_items_search=' <?php echo urlencode($autor['autor_name']); ?>'">
                                <div class="item_rectangle">
                                    <img class="img_developer" src="<?= $image_path ?>" alt="<?= htmlspecialchars($autor['autor_name']) ?>">
                                    <div class = "developer_text_main"><?= htmlspecialchars($autor['autor_name']) ?></div>
                                </div>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- Таб 3: Категории -->
                <div class="tab_content" id="categories_tab">
                    <!-- Форма изменения категорий -->
                    <form class="admin_form" id="form_change_category" method="POST">
                        <label class="form_word">Управление категориями игр:</label>
                        <input class="input_form_search" type="text" id="based_name_category" name="based_name_category" placeholder="Введите категорию для добавления" required>
                        <div class="sub_message_a_pg" id="category_message"></div>
                        <input type="submit" class="search_value_button catgeory_genre" id="create_category" value="Добавить категорию">
                    </form>

                    <input class="input_form_search" type="text" id="admin_search_categories" name="input_items_search" placeholder="Поиск категории">
                    <div class="categories_container">
                        <?php foreach ($list_categories as $category): ?>
                            <div class="categy_rectangle" data-category-id="<?= $category['category_id'] ?>">
                                <div class="developer_text_main"><?= htmlspecialchars($category['category_name']) ?></div>

                                <div class="category-actions">
                                    <button type="button" class="action-btn edit-btn" title="Редактировать категорию">✏️</button>
                                    <button type="button" class="action-btn delete-btn" title="Удалить категорию">🗑️</button>
                                </div>

                            </div>
                        <?php endforeach; ?>
                    </div>

                    
                </div>

                <!-- Таб 4: Жанры -->
                <div class="tab_content" id="genres_tab">
                    <!-- Форма изменения жанров -->
                    <form class="admin_form" id="form_change_genre" method="POST">
                        <label class="form_word">Управление жанрами игр:</label>
                        <input class="input_form_search" type="text" id="based_name_genre" name="based_name_genre" placeholder="Введите жанр для добавления/удаления" required>
                        <div class="sub_message_a_pg" id="genre_message"></div>
                        
                        <div class="form_actions">
                            <input type="submit" class="search_value_button catgeory_genre" id="create_genre" value="Добавить жанр">
                            <input type="submit" class="search_value_button catgeory_genre" id="delete_genre" value="Удалить жанр">
                        </div>
                        
                        <div class="form_update">
                            <input class="input_form_search catgeory_genre_input" type="text" id="new_name_genre" name="new_name_genre" placeholder="Введите старое название жанра">
                            <input class="input_form_search catgeory_genre_input" type="text" id="new_name_genre" name="new_name_genre" placeholder="Введите новое название жанра">
                            <input type="submit" class="search_value_button catgeory_genre" id="update_genre" value="Изменить жанр">
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>