<?php

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(403);
        header('Location: /page_403.php');
        exit('');
    }

    $login = $_POST['login'];
    $password = isset($_POST['password']);
    $is_vk_auth = isset($_POST['is_vk_auth']);

    require_once 'query_func.php';
    $result = get_query_answer("auth", $login);

    if (!$result)//логин не найден
    {
        echo json_encode(['success' => false, 'message' => 'Пользователя не существует']);
        exit();
    }
    else
    {
        if ($password == $result['admin_password'] || $is_vk_auth)//успешный вход(логин, пароль найдены и совпадают)
        {
            //$_SESSION['login'] = $login;
            require_once 'auth_func.php';
            loginUser($login);
            echo json_encode(['success' => true, 'redirect' => 'admin_page.php']);
            exit();
        }
        else//пароль не совпадает
        {
            echo json_encode(['success' => false, 'message' => 'Неверный пароль']);
            exit();
        }
    }

?>