<?php

// Настройка параметров сессии перед session_start()
ini_set('session.gc_maxlifetime', 31536000); // 1 год в секундах
ini_set('session.cookie_lifetime', 31536000); // Время жизни cookie

session_start();

// После успешной аутентификации
function loginUser($login) {
    // Регенерация ID сессии 
    session_regenerate_id(true);

    //$_SESSION['user_id'] = $user_id;
    $_SESSION['user_login'] = $login;
    $_SESSION['logged_in'] = true;
    $_SESSION['login_time'] = time();
    $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
    $_SESSION['ip_address'] = $_SERVER['REMOTE_ADDR'];
}

// Проверка авторизации
function isUserLoggedIn() {
    return isset(
        $_SESSION['logged_in'],
        $_SESSION['user_login'],
        $_SESSION['login_time'],
        $_SESSION['user_agent'],
        $_SESSION['ip_address']
    ) 
    && $_SESSION['logged_in'] === true
    && $_SESSION['user_agent'] === $_SERVER['HTTP_USER_AGENT']
    && $_SESSION['ip_address'] === $_SERVER['REMOTE_ADDR']
    && (time() - $_SESSION['login_time']) < 31536000; // 1 год (31536000 секунд)
}

// Выход
function logoutUser() {
    // Очищаем все данные сессии
    $_SESSION = array();
    
    // Удаляем cookie сессии
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 86400,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    session_destroy();
}
?>