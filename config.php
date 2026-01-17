<?php

// define('DB_HOST', 'localhost');
// define('DB_NAME', 'game_catalog_2');
// define('DB_USER', 'postgres');
// define('DB_PASS', '12345678');

// function get_db_connection() {
//     $connection_string = sprintf(
//         "host=%s dbname=%s user=%s password=%s",
//         DB_HOST, DB_NAME, DB_USER, DB_PASS
//     );
    
//     $dbconn = pg_connect($connection_string);
    
//     if (!$dbconn) {
//         return false;
//     }
    
//     return $dbconn;}

// define('DB_HOST', 'gamecatalog2-gamecatalog2.e.aivencloud.com');
// define('DB_NAME', 'defaultdb');
// define('DB_USER', 'avnadmin');
// define('DB_PASS', 'AVNS_YLSxC5mPPaAX7j5VkX6');
// define('DB_PORT', '26989');
// define('DB_SSLMODE', 'require');

// function get_db_connection() {
//     $connection_string = sprintf(
//         "host=%s port=%s dbname=%s user=%s password=%s sslmode=%s",
//         DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, DB_SSLMODE
//     );
    
//     $dbconn = pg_connect($connection_string);
    
//     if (!$dbconn) {
//         die("Ошибка подключения к базе данных");
//     }
    
//     return $dbconn;
// }


define('DB_HOST', 'dpg-d4hmosodl3ps739sqiog-a.frankfurt-postgres.render.com');
define('DB_NAME', 'gc_db_6xp1');
define('DB_USER', 'muser');
define('DB_PASS', 'XmwimDkkGWUrKFYQeKPjSszOgS4MDJ9w');
define('DB_PORT', '5432');
define('DB_SSLMODE', 'require');

function get_db_connection() {

    $old_error_reporting = error_reporting(0);

    $connection_string = sprintf(
        "host=%s port=%s dbname=%s user=%s password=%s sslmode=%s",
        DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, DB_SSLMODE
    );
    
    $dbconn = pg_connect($connection_string);

    error_reporting($old_error_reporting);
    
    if (!$dbconn) {
        // Проверяем, были ли отправлены заголовки
        if (!headers_sent()) {
            http_response_code(500);
        }
        
        // Очищаем любой вывод
        if (ob_get_length()) {
            ob_clean();
        }
        
        require_once 'page_500.php';
        exit();
    }
    
    return $dbconn;
}