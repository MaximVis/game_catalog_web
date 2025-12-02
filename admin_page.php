<?php
    require_once 'auth_func.php';

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
?>

<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php render_meta($meta); ?>
    <link rel="stylesheet" href="static/base_styles.css">
    <link rel="stylesheet" href="static/admin_styles.css">
    <link rel="stylesheet" href="static/admin_page_styles.css">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
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
        <form action="admin_developers_page.php" method="GET"><button class ="button_menu">Добавить нового разработчика</button></br></form>
        <form action="game_admin.php" method="GET"><button class ="button_menu">Добавить новую игру</button></form>


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
                    123
                </div>

                <!-- Таб 2: Разработчики -->
                <div class="tab_content" id="developers_tab">
                    <!-- Форма поиска разработчика -->
                    <form class="admin_form" id="admin_form_dev" action="developers.php" method="GET">
                        <label class="form_word">Поиск разработчика:</label>
                        <input class="input_form_search" type="text" id="input_items_search" name="input_items_search" placeholder="Введите разработчика" required>
                        <input type="hidden" name="admin_search" value="true">
                        <div id="dev_suggestions" class="suggestions"></div>
                        <input type="submit" class="search_value_button" value="Поиск разработчика">
                    </form>
                </div>

                <!-- Таб 3: Категории -->
                <div class="tab_content" id="categories_tab">
                    <!-- Форма изменения категорий -->
                    <form class="admin_form" id="form_change_category" method="POST">
                        <label class="form_word">Управление категориями игр:</label>
                        <input class="input_form_search" type="text" id="based_name_category" name="based_name_category" placeholder="Введите категорию" required>
                        <div class="sub_message_a_pg" id="category_message"></div>
                        
                        <div class="form_actions">
                            <input type="submit" class="search_value_button catgeory_genre" id="create_category" value="Добавить категорию">
                            <input type="submit" class="search_value_button catgeory_genre" id="delete_category" value="Удалить категорию">
                        </div>
                        
                        <div class="form_update">
                            <input class="input_form_search catgeory_genre_input" type="text" id="new_name_category" name="new_name_category" placeholder="Введите новое название категории">
                            <input type="submit" class="search_value_button catgeory_genre" id="update_category" value="Изменить категорию">
                        </div>
                    </form>
                </div>

                <!-- Таб 4: Жанры -->
                <div class="tab_content" id="genres_tab">
                    <!-- Форма изменения жанров -->
                    <form class="admin_form" id="form_change_genre" method="POST">
                        <label class="form_word">Управление жанрами игр:</label>
                        <input class="input_form_search" type="text" id="based_name_genre" name="based_name_genre" placeholder="Введите жанр" required>
                        <div class="sub_message_a_pg" id="genre_message"></div>
                        
                        <div class="form_actions">
                            <input type="submit" class="search_value_button catgeory_genre" id="create_genre" value="Добавить жанр">
                            <input type="submit" class="search_value_button catgeory_genre" id="delete_genre" value="Удалить жанр">
                        </div>
                        
                        <div class="form_update">
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