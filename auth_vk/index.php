<?php
require_once '../auth_func.php';

// Если пользователь уже авторизован, перенаправляем в админку
if (isUserLoggedIn()) {
    header('Location: ../admin_page.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Авторизация через VK ID</title>
    <link rel="stylesheet" href="../static/auth_styles.css">
    <style>
        .vkid-container {
            margin: 20px 0;
            text-align: center;
        }
        .back-link {
            display: block;
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <?php require_once '../shapka.php';?>

    <div class="container">
        <?php require_once '../shapka_menu.php';?>

        <h1 class="head_word">Авторизация через VK ID</h1>

        <div class="vkid-container">
            <div id="vk-id-container">
                <!-- Сюда встроится VK ID виджет -->
                <script src="https://unpkg.com/@vkid/sdk@2.0.0/dist/index.min.js"></script>
                <script type="text/javascript">
                    if ('VKIDSDK' in window) {
                        const VKID = window.VKIDSDK;

                        VKID.Config.init({
                            app: 54349334, // Ваш app_id
                            redirectUrl: 'https://game-catalog-ddgp.onrender.com/auth_vk/callback.php',
                            responseMode: VKID.ConfigResponseMode.Callback,
                            source: VKID.ConfigSource.LOWCODE,
                            scope: 'email', // Добавляем email для получения почты
                        });

                        const oneTap = new VKID.OneTap();

                        oneTap.render({
                            container: document.getElementById('vk-id-container'),
                            showAlternativeLogin: true,
                            style: {
                                height: 48, // Высота кнопки
                            }
                        })
                        .on(VKID.WidgetEvents.ERROR, vkidOnError)
                        .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, function (payload) {
                            console.log('Login success:', payload);
                            const code = payload.code;
                            const deviceId = payload.device_id;

                            // Обмениваем code на token
                            VKID.Auth.exchangeCode(code, deviceId)
                                .then(vkidOnSuccess)
                                .catch(vkidOnError);
                        });
                    
                        function vkidOnSuccess(data) {
                            console.log('Token exchange success:', data);
                            
                            // Отправляем данные на сервер
                            fetch('process_vk_auth.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    token: data.token,
                                    user: data.user,
                                    type: data.type,
                                    email: data.email
                                })
                            })
                            .then(response => response.json())
                            .then(result => {
                                if (result.success) {
                                    // Перенаправляем в админку
                                    window.location.href = '../admin_page.php';
                                } else {
                                    alert('Ошибка авторизации: ' + result.message);
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                alert('Ошибка связи с сервером');
                            });
                        }
                    
                        function vkidOnError(error) {
                            console.error('VK ID Error:', error);
                            let errorMessage = 'Произошла ошибка при авторизации';
                            
                            if (error.error === 'user_denied') {
                                errorMessage = 'Вы отменили авторизацию';
                            } else if (error.error === 'invalid_request') {
                                errorMessage = 'Неверный запрос';
                            }
                            
                            document.getElementById('error-message').textContent = errorMessage;
                        }
                    } else {
                        document.getElementById('vk-id-container').innerHTML = 
                            '<p>Не удалось загрузить VK ID. Проверьте подключение к интернету.</p>';
                    }
                </script>
            </div>
            
            <div id="error-message" style="color: red; margin: 10px 0;"></div>
        </div>

        <a href="../auth_page.php" class="back-link">← Назад к обычной авторизации</a>
    </div>

    <?php require_once '../footer.php';?>
</body>
</html>