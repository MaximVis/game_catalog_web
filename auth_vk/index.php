<?php
// Подключаем функции аутентификации
require_once '../auth_func.php';

// Конфигурация VK App
$client_id = '54349334'; // Замените на ID вашего приложения VK
$client_secret = 'zVJ0tun5n2uxKo7PPKCB'; // Замените на защищенный ключ вашего приложения VK
$redirect_uri = 'https://game-catalog-ddgp.onrender.com/auth_vk/callback.php'; // Замените на ваш домен

// Если пользователь уже авторизован, перенаправляем в админку
if (isUserLoggedIn()) {
    header('Location: ../admin_page.php');
    exit();
}

// Если код авторизации получен
if (isset($_GET['code'])) {
    $code = $_GET['code'];
    
    // Получаем access token
    $token_url = "https://oauth.vk.com/access_token?" . http_build_query([
        'client_id' => $client_id,
        'client_secret' => $client_secret,
        'redirect_uri' => $redirect_uri,
        'code' => $code
    ]);
    
    $token_response = file_get_contents($token_url);
    $token_data = json_decode($token_response, true);
    
    if (isset($token_data['access_token'])) {
        $access_token = $token_data['access_token'];
        $user_id = $token_data['user_id'];
        
        // Получаем информацию о пользователе
        $user_url = "https://api.vk.com/method/users.get?" . http_build_query([
            'user_ids' => $user_id,
            'fields' => 'first_name,last_name',
            'access_token' => $access_token,
            'v' => '5.131'
        ]);
        
        $user_response = file_get_contents($user_url);
        $user_data = json_decode($user_response, true);
        
        if (isset($user_data['response'][0])) {
            $user_info = $user_data['response'][0];
            $login = "vk_" . $user_id; // Создаем уникальный логин
            
            // Авторизуем пользователя
            loginUser($login);
            
            // Сохраняем информацию VK в сессии
            $_SESSION['vk_user_id'] = $user_id;
            $_SESSION['vk_user_name'] = $user_info['first_name'] . ' ' . $user_info['last_name'];
            
            // Перенаправляем в админ-панель
            header('Location: ../admin_page.php');
            exit();
        }
    }
    
    // Если что-то пошло не так
    header('Location: ../auth_page.php?error=vk_auth_failed');
    exit();
}

// Если ошибка
if (isset($_GET['error'])) {
    header('Location: ../auth_page.php?error=vk_access_denied');
    exit();
}

// Первый шаг - перенаправление на авторизацию VK
$auth_url = "https://oauth.vk.com/authorize?" . http_build_query([
    'client_id' => $client_id,
    'redirect_uri' => $redirect_uri,
    'response_type' => 'code',
    'scope' => 'email', // Можно добавить другие права при необходимости
    'display' => 'page'
]);

header('Location: ' . $auth_url);
exit();
?>