<?php
require_once 'auth_func.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    
    if (!empty($email)) {
        loginUser($result['admin_login']);

    //     // Проверяем, существует ли пользователь с таким email
    //     require_once 'query_func.php';
    //     $result = get_query_answer("auth_by_email", $email); // Нужно создать эту функцию
        
    //     if ($result) {
    //         // Пользователь найден - логиним
    //         loginUser($result['admin_login']); // Используем логин из БД
    //         echo json_encode(['success' => true, 'redirect' => 'admin_page.php']);
    //     } else {
    //         // Пользователь не найден - можно создать нового или показать ошибку
    //         echo json_encode(['success' => false, 'message' => 'Пользователь не найден в системе']);
    //     }
    // } else {
    //     echo json_encode(['success' => false, 'message' => 'Email не получен']);
    // }
    }
}
?>