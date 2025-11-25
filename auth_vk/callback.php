<?php
// Этот файл обрабатывает callback от VK
require_once '../auth_func.php';

$client_id = '54349334';
$client_secret = 'zVJ0tun5n2uxKo7PPKCB';
$redirect_uri = 'https://game-catalog-ddgp.onrender.com/auth_vk/callback.php';

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
    
    if (isset($token_data['access_token']) && isset($token_data['user_id'])) {
        $access_token = $token_data['access_token'];
        $user_id = $token_data['user_id'];
        
        // Получаем информацию о пользователе
        $user_url = "https://api.vk.com/method/users.get?" . http_build_query([
            'user_ids' => $user_id,
            'fields' => 'first_name,last_name,screen_name',
            'access_token' => $access_token,
            'v' => '5.131'
        ]);
        
        $user_response = file_get_contents($user_url);
        $user_data = json_decode($user_response, true);
        
        if (isset($user_data['response'][0])) {
            $user_info = $user_data['response'][0];
            
            // Создаем логин на основе VK ID
            $login = "vk_" . $user_id;
            $user_name = $user_info['first_name'] . ' ' . $user_info['last_name'];
            
            // Сохраняем дополнительную информацию в сессию (опционально)
            $_SESSION['vk_user_id'] = $user_id;
            $_SESSION['vk_user_name'] = $user_name;
            $_SESSION['vk_screen_name'] = $user_info['screen_name'] ?? '';
            
            // Авторизуем пользователя
            loginUser($login);
            
            header('Location: ../admin_page.php');
            exit();
        }
    }
}

// Если произошла ошибка
header('Location: ../auth_page.php?error=vk_auth_failed');
exit();
?>