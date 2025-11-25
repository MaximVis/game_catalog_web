<?php

    require_once 'auth_func.php';
    if (!isUserLoggedIn()) {
        header('Location: auth_page.php');
        exit();
    }
?>

<?php
 
    $bAdd_author = False;

    if($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['input_items_search']))
    {
        require_once 'query_func.php';

        $author_name = htmlspecialchars($_GET['input_items_search']);
        $result = get_query_answer("author", $author_name);
        if (!$result)
        {
            die('Ошибка соединения');
            exit();
        }
    }
    else
    {
        $bAdd_author = True;
    }
?>

<?php
	require_once 'title_desc_keywords_func.php';

    if($bAdd_author)
    {
        $meta = set_meta(
            'Добавить разработчика игр в каталог', 
            'Добавление новой компании-разработчика в базу данных. Заполнение информации о списоке игр разработчика',
            'добавить разработчика, новая игровая студия, регистрация компании, каталог разработчиков, добавить студию'
        );
    }
    else
    {
        $meta = set_meta(
            'Редактирование '.$author_name.'', 
            'Изменение информации о разработчике '.$author_name.'. Редактирование данных компании, управление привязанными играми',
            'редактирование разработчика, изменить данные компании, управление играми студии, обновление разработчика'
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
    <link rel="stylesheet" href="static/admin_styles.css">
    <link rel="stylesheet" href="static/developers_styles.css">
    <link rel="stylesheet" href="static/dev_game_admin_page.css">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="static/create_object.js" defer></script>
    <script src="static/preview.js"></script>

</head>


<body>

    <?php require_once 'shapka.php';?>

    <div class="container"><!-- основной контент -->
        <?php require_once 'shapka_menu.php';?>
        <!-- 1)В бд добавляется разработчика 2) из бд запрашивается ид разработчика 3) картинка переименовывается в ид разработчика-->
        <?php if ($bAdd_author): ?>
            <h1 class = "head_word">Добавить нового разработчика</h1>
        <?php else: ?>
            <h1 class = "head_word">Изменить данные о разработчике <?= htmlspecialchars($result['autor_name']) ?></h1>
            <form method="POST" id="deleteForm">
                <br><button type="submit" class = "admin_but" name="delete_button">Удалить страницу разработчика</button>
            </form>
        <?php endif; ?>

        <form method="post" id = create_object enctype="multipart/form-data">

            <?php    
                if (!$bAdd_author) {
                    $images = glob('devs_imgs/' . $result['autor_id'] . '.{png,jpg,jpeg}', GLOB_BRACE);
                }
            ?>


            <label class="form_word">Загрузка аватарки:</label>

            <div class="uploader_container">
                <label for="screensaver" class="uploader_but">Загрузить изображение</label>
                <input type="file" name="screensaver" id="screensaver" accept=".png,.jpg,.jpeg,image/png,image/jpeg">
            </div>
            <button type="button" id="cancelUpload" class="admin_but cancel_but">Удалить изображение</button>
            <input type="hidden" name="temp_avatar" value="<?php echo isset($_SESSION['temp_avatar']) ? $_SESSION['temp_avatar'] : ''; ?>">

            <label class="form_word a_dev">Название разработчика:</label>
            <input class = "input_data" type="text" placeholder="Введите название разработчика" name="developer_name" id = "developer_name" value="<?php 
                            if (!$bAdd_author && isset($result['autor_name'])) {
                                echo htmlspecialchars($result['autor_name']);
                            }
                        ?>"
                        data-based-autor="<?php 
                            if (!$bAdd_author && isset($result['autor_name'])) {
                                echo htmlspecialchars($result['autor_name']);
                            }
                        ?>"></br>

            <label class="form_word a_dev">Предпросмотр:</label>
            <div class="item_rectangle">
                <img class="img_game_main" src="<?php 
                    if (isset($_SESSION['temp_avatar']) && file_exists($_SESSION['temp_avatar'])) {
                        echo $_SESSION['temp_avatar'];
                    } elseif (!$bAdd_author && !empty($images)) {
                        echo $images[0];
                    } else {
                        echo 'devs_imgs/0.png';
                    }
                ?>" alt="Preview">
                <div class="game_text_main"><?php 
                    if (isset($_POST['developer_name']) && !empty($_POST['developer_name'])) {
                        echo htmlspecialchars($_POST['developer_name']);
                    } elseif (!$bAdd_author && isset($result['autor_name'])) {
                        echo htmlspecialchars($result['autor_name']);
                    } else {
                        echo 'Название разработчика';
                    }
                ?></div>
            </div>
            
            <div class="sub_message" id="sub_message"></div>
            <button type="submit" class = "admin_but" name="save">Сохранить</button>
            

        </form>

    </div>

</body>

</html>