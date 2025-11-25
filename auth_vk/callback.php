<?php
// Просто перенаправляем обратно в index.php для обработки
header('Location: index.php?' . $_SERVER['QUERY_STRING']);
exit();
?>