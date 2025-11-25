<?php

// Массив с метаданными по умолчанию
$default_meta = [
    'title' => 'ALLGAMES- Каталог игр',
    'description' => 'Ваш гид по миру видеоигр. Полный каталог компьютерных, консольных игр. Подробные описания,  жанры, категории. Найдите свою следующую любимую игру',
    'keywords' => 'каталог игр, игры каталог, описание игр, жанры игр, игры пк, игры на pc, консольные игры,  новые игры, популярные игры, обзор игр, игры по жанрам, топ игр'
];

// Функция для установки метаданных
function set_meta($title = '', $description = '', $keywords = '') {
    global $default_meta;
    
    $meta = $default_meta;
    
    if (!empty($title)) {
        $meta['title'] = $title . ' | ' . $default_meta['title'];
    }
    
    if (!empty($description)) {
        $meta['description'] = $description;
    }
    
    if (!empty($keywords)) {
        $meta['keywords'] = $keywords;
    }
    
    return $meta;
}

// Функция для вывода метатегов в HTML
function render_meta($meta) {
    echo '<title>' . htmlspecialchars($meta['title']) . '</title>' . "\n";
    echo '<meta name="description" content="' . htmlspecialchars($meta['description']) . '">' . "\n";
    echo '<meta name="keywords" content="' . htmlspecialchars($meta['keywords']) . '">' . "\n";
}
?>