<?php
require_once '../auth_func.php';

// Если пользователь уже авторизован, перенаправляем в админку
if (isUserLoggedIn()) {
    header('Location: ../admin_page.php');
    exit();
}

// ID вашего приложения VK Mini Apps
$app_id = '54349334'; // Замените на ID вашего приложения

?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Авторизация через VK ID</title>
    <script src="https://unpkg.com/@vkid/sdk@2.0.0/dist/index.min.js"></script>
    <style>
        .container {
            max-width: 400px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
        }
        .vk-button {
            background-color: #4a76a8;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 0;
        }
        .loading {
            color: #666;
        }
        .error {
            color: red;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Авторизация через VK ID</h2>
        
        <div id="auth-container">
            <button class="vk-button" onclick="initVKAuth()">Войти через VK ID</button>
        </div>
        
        <div id="status"></div>
        
        <div style="margin-top: 20px;">
            <a href="../auth_page.php">← Назад к обычной авторизации</a>
        </div>
    </div>

    <script>
        let vkId;
        
        function initVKAuth() {
            const status = document.getElementById('status');
            status.innerHTML = '<div class="loading">Инициализация VK ID...</div>';
            
            try {
                // Инициализация VK ID
                vkId = new VKID({
                    app: <?php echo $app_id; ?>,
                    redirectUri: '<?php echo "http://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/callback.php"; ?>',
                    state: '<?php echo bin2hex(random_bytes(16)); ?>'
                });
                
                // Запуск авторизации
                vkId.auth({
                    onSuccess: function(response) {
                        status.innerHTML = '<div class="loading">Авторизация успешна, обработка...</div>';
                        
                        // Отправляем данные на сервер для проверки
                        processVKAuth(response);
                    },
                    onError: function(error) {
                        console.error('VK ID Auth Error:', error);
                        status.innerHTML = '<div class="error">Ошибка авторизации: ' + error.error_description + '</div>';
                    }
                });
            } catch (error) {
                console.error('VK ID Init Error:', error);
                status.innerHTML = '<div class="error">Ошибка инициализации VK ID</div>';
            }
        }
        
        function processVKAuth(authData) {
            // Отправляем данные на сервер для обработки
            fetch('process_vk_auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: authData.token,
                    user: authData.user,
                    type: authData.type
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    status.innerHTML = '<div style="color: green;">Авторизация успешна! Перенаправление...</div>';
                    setTimeout(() => {
                        window.location.href = '../admin_page.php';
                    }, 1000);
                } else {
                    status.innerHTML = '<div class="error">Ошибка: ' + data.message + '</div>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                status.innerHTML = '<div class="error">Ошибка связи с сервером</div>';
            });
        }
        
        // Альтернативный способ для старых версий VK ID
        function fallbackVKAuth() {
            const status = document.getElementById('status');
            status.innerHTML = '<div class="loading">Открывается окно авторизации VK...</div>';
            
            // Открываем окно авторизации VK
            const width = 600;
            const height = 500;
            const left = (screen.width - width) / 2;
            const top = (screen.height - height) / 2;
            
            window.open(
                `https://id.vk.com/auth?return_auth_hash=1&redirect_uri=${encodeURIComponent(window.location.origin + '/auth_vk/callback.php')}&response_type=code&v=1.0&app_id=<?php echo $app_id; ?>`,
                'VK Auth',
                `width=${width},height=${height},left=${left},top=${top}`
            );
        }
    </script>
</body>
</html>