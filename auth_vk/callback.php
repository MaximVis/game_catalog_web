<?php
require_once '../auth_func.php';

// Этот файл обрабатывает callback от VK ID
// В low-code режиме основная логика в process_vk_auth.php,
// но этот файл все равно нужен для завершения OAuth flow

?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Завершение авторизации</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
        }
        .container {
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .loading {
            color: #666;
        }
        .success {
            color: green;
        }
        .error {
            color: red;
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="status" class="loading">
            Завершение авторизации...
        </div>
    </div>

    <script>
        // Парсим URL параметры
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        if (error) {
            // Обработка ошибки
            document.getElementById('status').className = 'error';
            document.getElementById('status').textContent = 
                'Ошибка авторизации: ' + (errorDescription || error);
            
            // Через 3 секунды перенаправляем на страницу авторизации
            setTimeout(() => {
                window.location.href = '../auth_page.php?error=vk_' + error;
            }, 3000);
        } else if (code) {
            // Успешная авторизация - перенаправляем обратно в приложение
            document.getElementById('status').className = 'success';
            document.getElementById('status').textContent = 'Авторизация успешна! Перенаправление...';
            
            setTimeout(() => {
                window.location.href = 'index.php?code=' + code + '&state=' + state;
            }, 1000);
        } else {
            document.getElementById('status').className = 'error';
            document.getElementById('status').textContent = 'Неизвестная ошибка авторизации';
            
            setTimeout(() => {
                window.location.href = '../auth_page.php';
            }, 3000);
        }
    </script>
</body>
</html>