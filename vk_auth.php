<?php
require_once 'auth_func.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $access_token = $input['access_token'] ?? '';
    $user_id = $input['user_id'] ?? '';
    $email = $input['email'] ?? '';
    $first_name = $input['first_name'] ?? '';
    $last_name = $input['last_name'] ?? '';
    
    // Валидация полученных данных
    if (empty($access_token) || empty($user_id)) {
        echo json_encode(['success' => false, 'message' => 'Недостаточно данных от VK']);
        exit();
    }
    
    // Дополнительная проверка токена через VK API (опционально)
    $vk_user_info = verifyVKToken($access_token, $user_id);
    
    if ($vk_user_info) {
        
        // Создаем сессию
        $login = "vk_" . $user_id; // Уникальный логин для VK пользователя
        loginUser($login);
        
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Ошибка проверки токена VK']);
    }
}

function verifyVKToken($access_token, $user_id) {
    // Проверяем токен через VK API
    $url = "https://api.vk.com/method/users.get?access_token={$access_token}&v=5.131";
    
    $response = file_get_contents($url);
    $data = json_decode($response, true);
    
    if (isset($data['response'][0]['id']) && $data['response'][0]['id'] == $user_id) {
        return $data['response'][0];
    }
    
    return false;
}
?>