// Обработчик поиска игр с задержкой (debounce)
let searchTimeout;
let searchGameValue = ''; // Переменная для хранения названия игры

document.addEventListener('DOMContentLoaded', function() {
    console.log("start_search");

    const searchInput = document.getElementById('search_game');
    const gamesContainer = document.querySelector('.games_container');
    const adminForm = document.getElementById('admin_form_game');
    
    if (searchInput) {
        // Отключаем стандартную отправку формы
        if (adminForm) {
            adminForm.addEventListener('submit', function(e) {
                e.preventDefault();
                performSearch(searchInput.value);
            });
        }
        
        // Обработчик ввода с задержкой
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            const searchTerm = e.target.value.trim();
            searchGameValue = searchTerm; // Записываем в переменную
            
            // Если поле пустое, показываем все игры
            if (searchTerm === '') {
                console.log("ALL_GAMES!")
                loadAllGames();
                return;
            }
            
            // Задержка перед поиском (300ms)
            searchTimeout = setTimeout(() => {
                console.log("NOT! ALL_GAMES!")
                performSearch(searchTerm);
            }, 300);
        });
    }
});

// Функция для выполнения поиска
function performSearch(searchTerm) {
    if (!searchTerm) return;
    
    const gamesContainer = document.querySelector('.games_container');
    
    // Показываем индикатор загрузки
    gamesContainer.innerHTML = '<div class="loading">Поиск игр...</div>';


    
    // Отправляем AJAX запрос
    fetch(`games_search.php?search_game=${encodeURIComponent(searchTerm)}&admin_search=true`)
        .then(response => response.text())
        .then(html => {
            gamesContainer.innerHTML = html;
            
            // Добавляем обработчики событий для новых элементов
            addGameClickHandlers();
        })
        .catch(error => {
            console.error('Ошибка при поиске:', error);
            gamesContainer.innerHTML = '<div class="error">Произошла ошибка при поиске</div>';
        });
}

// Функция для загрузки всех игр
function loadAllGames() {
    
    const gamesContainer = document.querySelector('.games_container');

    console.log("SUCCESSS!");

    array_params = [10, searchGameValue];

    $.post("pagination.php", {array_params:array_params, query:"games_search_post"}, function(data) {
        var response = JSON.parse(data);
        console.log(response);
    });



    
    // <a href="/game_admin.php?game=<?php echo urlencode($game['game_name']); ?>">
    //                             <div class="game_rectangle">
    //                                 <?php
    //                                     $images = glob('game_imgs/' . $game['game_id'] . '.{png,jpg,jpeg,gif,webp}', GLOB_BRACE);
                                        
    //                                     if (!empty($images)) {
    //                                         echo '<img class="img_game_main" src="' . $images[0] . '" alt="' . $game['game_name'] . '">';
    //                                     } else {
    //                                         echo '<img class="img_game_main" src="game_imgs/0.png" alt="' . $game['game_name'] . '">';
    //                                     }   
    //                                 ?>
    //                                 <div class="game_text_main">
    //                                     <?= htmlspecialchars($game['game_name']) ?>
    //                                     <div class="text_game_main_description"><?= $game['genres'] ?></div>
    //                                 </div>
    //                             </div>
    //                         </a>
}

// Функция для добавления обработчиков клика на игры
function addGameClickHandlers() {
    const gameLinks = document.querySelectorAll('.game_rectangle, .game_rectangle a');
    gameLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Если нужно выполнить какие-то действия перед переходом
            console.log('Переход к игре');
        });
    });
}
