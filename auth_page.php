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
    <script src="static/auth.js" defer></script>
</head>

<body>
    <?php require_once 'shapka.php';?>

    <div class="container"><!-- основной контент -->
        <?php require_once 'shapka_menu.php';?>

        <h1 class = "head_word">Авторизация</h1>
        
        <?php if (isset($_GET['error'])): ?>
            <div class="error-message">
                <?php 
                switch($_GET['error']) {
                    case 'vk_auth_failed':
                        echo 'Ошибка авторизации через VK. Попробуйте снова.';
                        break;
                    case 'vk_access_denied':
                        echo 'Доступ к VK отменен.';
                        break;
                    default:
                        echo 'Произошла ошибка при авторизации.';
                }
                ?>
            </div>
        <?php endif; ?>
        
        <form class = "admin_form" id = "auth_form" method="POST">
            <label class="form_word">Логин:</label>
            <input class = "input_form" type="text" id="admin_name" name="admin_name" placeholder="Введите логин"><br>
            <label class = "form_word">Пароль:</label>
            <input class = "input_form" type="password" id="admin_password" name="admin_password" placeholder="Введите пароль"><br>
            <div class="auth_message" id="auth_message"></div>
            <button name = "auth" >Войти</button>
        </form>
    
        <div>
        <script src="https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js"></script>
        <script type="text/javascript">
            if ('VKIDSDK' in window) {
            const VKID = window.VKIDSDK;

            VKID.Config.init({
                app: 54355269,
                redirectUrl: 'https://game-catalog-ddgp.onrender.com/admin_page.php',
                responseMode: VKID.ConfigResponseMode.Callback,
                source: VKID.ConfigSource.LOWCODE,
                scope: '', // Заполните нужными доступами по необходимости
            });

            const oneTap = new VKID.OneTap();

            oneTap.render({
                container: document.currentScript.parentElement,
                showAlternativeLogin: true
            })
            .on(VKID.WidgetEvents.ERROR, vkidOnError)
            .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, function (payload) {
                const code = payload.code;
                const deviceId = payload.device_id;

                VKID.Auth.exchangeCode(code, deviceId)
                .then(vkidOnSuccess)
                .catch(vkidOnError);
            });
            
            function vkidOnSuccess(data) {
                // Обработка полученного результата
            }
            
            function vkidOnError(error) {
                // Обработка ошибки
            }
            }
        </script>
        </div>
    </div>

    

    <?php require_once 'footer.php';?>
</body>
</html>