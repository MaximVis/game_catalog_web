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

    console.log("data1", $user_id, $email, $first_name);
    
    // Дополнительная проверка токена через VK API (опционально)
    $vk_user_info = verifyVKToken($access_token, $user_id);
    
    // ПРАВИЛЬНАЯ проверка токена через VK API
    $vk_user_info = verifyVKToken($access_token);
    
    if ($vk_user_info && isset($vk_user_info['response'][0]['id'])) {
        $vk_id = $vk_user_info['response'][0]['id'];
        
        // Сравниваем ID из токена с ID от клиента
        if ($vk_id == $user_id) {
            // Успешная проверка - создаем сессию
            $vk_login = "vk_" . $user_id;
            
            loginUser($vk_login);
            $_SESSION['auth_type'] = 'vk';
            $_SESSION['vk_user_id'] = $user_id;
            $_SESSION['user_email'] = $email;
            $_SESSION['first_name'] = $first_name;
            $_SESSION['last_name'] = $last_name;
            
            echo json_encode([
                'success' => true, 
                'redirect' => 'admin_page.php'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Несоответствие ID пользователя']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Неверный токен VK']);
    }
    exit();
}

function verifyVKToken($access_token) {
    $url = "https://api.vk.com/method/users.get?access_token={$access_token}&v=5.131";
    
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
        ],
        'http' => [
            'timeout' => 10,
            'ignore_errors' => true
        ]
    ]);
    
    $response = @file_get_contents($url, false, $context);
    
    if ($response === FALSE) {
        return false;
    }
    
    $data = json_decode($response, true);
    
    // Логируем ответ для отладки
    error_log("VK API Response: " . print_r($data, true));
    
    return $data;
}
?>