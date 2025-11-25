<?php
    //session_start();

    $login = $_POST['login'];
    $password = $_POST['password'];

    require_once 'query_func.php';
    $result = get_query_answer("auth", $login);

    if (!$result)//логин не найден
    {
        echo json_encode(['success' => false, 'message' => 'Пользователя не существует']);
        exit();
    }
    else
    {
        if ($password == $result['admin_password'])//успешный вход(логин, пароль найдены и совпадают)
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