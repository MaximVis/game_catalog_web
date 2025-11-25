<?php
require_once '../auth_func.php';

header('Content-Type: application/json');

// В реальном приложении добавьте проверку CSRF токена
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Получаем данные из POST запроса
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['token'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

try {
    $token = $input['token'];
    $user_data = $input['user'] ?? [];
    $email = $input['email'] ?? '';
    
    // Валидируем токен через VK API
    $validation_url = "https://api.vk.com/method/users.get?access_token=" . $token . "&v=5.131";
    $validation_response = @file_get_contents($validation_url);
    
    if (!$validation_response) {
        throw new Exception('Не удалось проверить токен');
    }
    
    $validation_data = json_decode($validation_response, true);
    
    if (isset($validation_data['error'])) {
        throw new Exception('Неверный токен: ' . $validation_data['error']['error_msg']);
    }
    
    if (!isset($validation_data['response'][0]['id'])) {
        throw new Exception('Не удалось получить ID пользователя');
    }
    
    $vk_user_id = $validation_data['response'][0]['id'];
    $user_info = $validation_data['response'][0];
    
    // Создаем логин для нашего приложения
    $login = "vk_" . $vk_user_id;
    
    // Авторизуем пользователя
    loginUser($login);
    
    // Сохраняем информацию VK в сессии
    $_SESSION['vk_user_id'] = $vk_user_id;
    $_SESSION['vk_user_name'] = $user_info['first_name'] . ' ' . $user_info['last_name'];
    $_SESSION['vk_screen_name'] = $user_info['screen_name'] ?? '';
    $_SESSION['vk_email'] = $email;
    $_SESSION['vk_access_token'] = $token;
    
    // Можно сохранить фото профиля если нужно
    if (isset($user_info['photo_200'])) {
        $_SESSION['vk_photo'] = $user_info['photo_200'];
    }
    
    echo json_encode([
        'success' => true, 
        'message' => 'Authentication successful',
        'user_id' => $vk_user_id
    ]);
    
} catch (Exception $e) {
    error_log('VK ID Auth Error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => $e->getMessage()
    ]);
}
?>