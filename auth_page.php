<?php
    require_once 'auth_func.php';
    if (isUserLoggedIn()) {
        header('Location: admin_page.php');
        exit();
    }
?>

<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ALLGAMES- каталог игр</title>
    <link rel="stylesheet" href="static/base_styles.css">
    <link rel="stylesheet" href="static/auth_styles.css">
    <link rel="stylesheet" href="static/footer.css">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js"></script>
    <script src="static/auth.js" defer></script>
    <script src="static/auth_vk.js" defer></script> 
</head>

<body>
    <?php require_once 'shapka.php';?>

    <div class="container"><!-- основной контент -->
        <?php require_once 'shapka_menu.php';?>

        <h1 class = "head_word">Авторизация</h1>
        
        <form class = "admin_form" id = "auth_form" method="POST">
            <label class="form_word">Логин:</label>
            <input class = "input_form" type="text" id="admin_name" name="admin_name" placeholder="Введите логин"><br>
            <label class = "form_word">Пароль:</label>
            <input class = "input_form" type="password" id="admin_password" name="admin_password" placeholder="Введите пароль"><br>
            <div class="auth_message" id="auth_message"></div>
            <button name = "auth" >Войти</button>
        </form>

        <div id="vkid-container">
            <!-- Контейнер для кнопки VK ID -->
        </div>
    
        
    </div>

    

    <?php require_once 'footer.php';?>
</body>
</html>