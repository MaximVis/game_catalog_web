<?php
require_once '../auth_func.php';

// Обработка callback от VK ID
if (isset($_GET['payload'])) {
    $payload = json_decode($_GET['payload'], true);
    
    if ($payload && isset($payload['token'])) {
        // Авторизуем пользователя
        $user_id = 'vk_' . $payload['user']['id'];
        loginUser($user_id);
        
        // Сохраняем информацию VK
        $_SESSION['vk_user_id'] = $payload['user']['id'];
        $_SESSION['vk_user_name'] = $payload['user']['first_name'] . ' ' . $payload['user']['last_name'];
        
        header('Location: ../admin_page.php');
        exit;
    }
}

// Если что-то пошло не так
header('Location: ../auth_page.php?error=vk_auth_failed');
?>