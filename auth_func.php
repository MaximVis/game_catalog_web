<?php

// функция для инициализации сессии с настройками
function initSession() {
    ini_set('session.gc_maxlifetime', 31536000); 
    ini_set('session.cookie_lifetime', 31536000); 
    
    // запущена ли уже сессия
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

// успешная аутентификации
function loginUser($login) {

    session_regenerate_id(true);

    $_SESSION['user_login'] = $login;
    $_SESSION['logged_in'] = true;
    $_SESSION['login_time'] = time();
    $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
    $_SESSION['ip_address'] = $_SERVER['REMOTE_ADDR'];
}

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
    && (time() - $_SESSION['login_time']) < 31536000; // 1 год
}

// выход
function logoutUser() {

    $_SESSION = array();

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 86400,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    session_destroy();
}

// Инициализируем сессию при подключении файла
initSession();

?>