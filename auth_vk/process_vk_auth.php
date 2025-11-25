<?php
require_once '../auth_func.php';

header('Content-Type: application/json');

// Разрешаем CORS если нужно
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Получаем данные из POST запроса
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['token'])) {
    echo json_encode(['success' => false, 'message' => 'No authentication data received']);
    exit;
}

try {
    // В реальном приложении здесь нужно проверить токен через VK API
    // Для демонстрации просто создаем пользователя на основе данных
    
    $user_id = 'vk_' . uniqid(); // В реальности нужно получить ID пользователя из токена
    
    // Проверяем токен через VK API (упрощенная версия)
    $vk_api_url = "https://api.vk.com/method/users.get?access_token=" . $input['token'] . "&v=5.131";
    $user_info = @file_get_contents($vk_api_url);
    
    if ($user_info) {
        $user_data = json_decode($user_info, true);
        if (isset($user_data['response'][0]['id'])) {
            $user_id = 'vk_' . $user_data['response'][0]['id'];
            $user_name = $user_data['response'][0]['first_name'] . ' ' . $user_data['response'][0]['last_name'];
            
            // Сохраняем информацию о пользователе VK
            $_SESSION['vk_user_id'] = $user_data['response'][0]['id'];
            $_SESSION['vk_user_name'] = $user_name;
        }
    }
    
    // Авторизуем пользователя
    loginUser($user_id);
    
    echo json_encode(['success' => true, 'message' => 'Authentication successful']);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Authentication failed: ' . $e->getMessage()]);
}
?>