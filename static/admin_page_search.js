document.addEventListener('DOMContentLoaded', function() {
    // Получаем поле ввода
    const searchInput = document.getElementById('search_game');
    
    // Проверяем, существует ли поле ввода
    if (!searchInput) {
        console.log('Поле поиска не найдено');
        return;
    }
    
    console.log('Скрипт поиска инициализирован');
    
    // Флаг для предотвращения слишком частых запросов
    let searchTimeout;
    
    // Обработчик события ввода
    searchInput.addEventListener('input', function(event) {
        // Очищаем предыдущий таймер
        clearTimeout(searchTimeout);
        
        // Получаем значение из поля ввода
        const searchValue = event.target.value.trim();
        
        console.log('Введено значение:', searchValue);
        
        // Если поле пустое, не отправляем запрос
        if (searchValue === '') {
            console.log('Поле поиска пустое - запрос не отправляется');
            return;
        }
        
        // Устанавливаем задержку перед отправкой запроса (500мс)
        searchTimeout = setTimeout(function() {
            console.log('Отправка запроса для поиска:', searchValue);
            
            // Отправляем AJAX запрос
            performSearch(searchValue);
        }, 500); // Задержка 500 мс
    });
    
    // Функция для выполнения поиска
    function performSearch(searchTerm) {
        // Создаем объект FormData для отправки данных формы
        const formData = new FormData();
        formData.append('search_game', searchTerm);
        formData.append('admin_search', 'true');
        
        // Отправляем AJAX запрос
        fetch('game_admin.php', {
            method: 'POST', // или 'GET' в зависимости от вашей логики
            body: formData
        })
        .then(response => {
            console.log('Ответ получен, статус:', response.status);
            return response.text();
        })
        .then(html => {
            console.log('HTML ответ получен, обработка...');
            
            // Обновляем содержимое контейнера с играми
            updateGamesContainer(html);
        })
        .catch(error => {
            console.error('Ошибка при выполнении запроса:', error);
        });
    }
    
    // Функция для обновления контейнера с играми
    function updateGamesContainer(html) {
        // Парсим полученный HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Находим контейнер с играми в полученном документе
        const newGamesContainer = doc.querySelector('.games_container');
        
        if (newGamesContainer) {
            // Получаем текущий контейнер на странице
            const currentContainer = document.querySelector('.games_container');
            
            if (currentContainer) {
                // Обновляем содержимое
                currentContainer.innerHTML = newGamesContainer.innerHTML;
                console.log('Контейнер с играми обновлен');
            } else {
                console.log('Контейнер .games_container не найден на странице');
            }
        } else {
            console.log('Контейнер с играми не найден в ответе сервера');
        }
    }
    
    // Для отладки: также отслеживаем другие события
    searchInput.addEventListener('focus', function() {
        console.log('Поле поиска получило фокус');
    });
    
    searchInput.addEventListener('blur', function() {
        console.log('Поле поиска потеряло фокус');
    });
});