document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const searchInput = document.getElementById('admin_search_game');
    const gamesContainer = document.querySelector('.games_container');
    const gamesTab = document.getElementById('games_tab');
    
    // Переменная для хранения названия игры
    let searchedGameName = '';
    
    // Исходный HTML контейнера с играми (для сброса поиска)
    const originalGamesHTML = gamesContainer.innerHTML;
    
    // Дебаунс для оптимизации запросов
    let searchTimeout;
    
    // Обработчик ввода в поле поиска
    searchInput.addEventListener('input', function() {

        console.log("!!!!STAAAAAAAAAART!!!!");
        // Сохраняем значение поиска в переменную
        searchedGameName = this.value.trim();
        
        // Очищаем предыдущий таймаут
        clearTimeout(searchTimeout);
        
        // Если поле пустое, показываем все игры
        if (!searchedGameName) {
            console.log("STAAAAAAAAAART!!!!_ALLL");
            resetSearch();
            return;
        }
        
        // Дебаунс: выполняем поиск через 300мс после последнего ввода
        searchTimeout = setTimeout(() => {
            console.log("STAAAAAAAAAART!!!!");
            performSearch(searchedGameName);
        }, 300);
    });
    
    // Обработчик отправки формы (если нужен стандартный поиск)
    const searchForm = document.getElementById('admin_form_game');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        searchedGameName = searchInput.value.trim();
        
        if (searchedGameName) {
            performSearch(searchedGameName);
        }
    });
    
    function performSearch(gameName) {
        console.log(gameName);

        showLoadingIndicator();

        // Добавляем % для LIKE поиска: ищет вхождение текста в любом месте названия
        var searchPattern = '%' + gameName + '%';
        var array_params = [0, searchPattern]; // OFFSET, поисковый шаблон

        $.post("pagination.php", {
            array_params: array_params, 
            query: "games_search_post"
        }, function(data) {
            var response = JSON.parse(data);
            console.log(response);

            gamesContainer.innerHTML = '';
        });

        // $.post("pagination.php", {array_params:array_params, query:"games_search_post"}, function(data) {
        //     var response = JSON.parse(data);
        //     console.log(response);

        //     gamesContainer.innerHTML = '';
    
        //     // Проходим по всем играм в response
        //     response.forEach(game => {
        //         const gameElement = createGameElement(game);
        //         gamesContainer.appendChild(gameElement);
        //     });
        // });
        
    }
    
   
    
    // Функция сброса поиска
    function resetSearch() {
        gamesContainer.innerHTML = originalGamesHTML;
        hideLoadingIndicator();
        removeNoResultsMessage();
    }
    
    // Функция обновления списка игр (для использования с AJAX)
    function updateGamesList(games) {
        if (!games || games.length === 0) {
            showNoResultsMessage(searchedGameName);
            return;
        }
        
        // Очищаем контейнер
        gamesContainer.innerHTML = '';
        
        // Добавляем новые игры
        games.forEach(game => {
            const gameElement = createGameElement(game);
            gamesContainer.appendChild(gameElement);
        });
        
        hideLoadingIndicator();
    }
    
    // Функция создания HTML элемента игры
    function createGameElement(game) {
        const link = document.createElement('a');
        link.href = `/game_admin.php?game=${encodeURIComponent(game.game_name)}`;
        
        const gameDiv = document.createElement('div');
        gameDiv.className = 'game_rectangle';
        
        // Изображение игры
        const img = document.createElement('img');
        img.className = 'img_game_main';
        img.src = game.image_url || 'game_imgs/0.png';
        img.alt = game.game_name;
        
        // Текст игры
        const textDiv = document.createElement('div');
        textDiv.className = 'game_text_main';
        textDiv.textContent = game.game_name;
        
        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'text_game_main_description';
        descriptionDiv.textContent = game.genres || '';
        
        textDiv.appendChild(descriptionDiv);
        gameDiv.appendChild(img);
        gameDiv.appendChild(textDiv);
        link.appendChild(gameDiv);
        
        return link;
    }
    
    // Функция показа индикатора загрузки
    function showLoadingIndicator() {
        // Удаляем предыдущее сообщение об отсутствии результатов
        removeNoResultsMessage();
        
        // Создаем индикатор загрузки
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-indicator';
        loadingDiv.id = 'search-loading';
        loadingDiv.innerHTML = 'Поиск игр...';
        
        gamesContainer.appendChild(loadingDiv);
    }
    
    // Функция скрытия индикатора загрузки
    function hideLoadingIndicator() {
        const loadingIndicator = document.getElementById('search-loading');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }
    
    // Функция показа сообщения "нет результатов"
    function showNoResultsMessage(searchTerm) {
        removeNoResultsMessage();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'no-results-message';
        messageDiv.id = 'no-results-message';
        messageDiv.innerHTML = `Игры по запросу "<strong>${searchTerm}</strong>" не найдены`;
        
        gamesContainer.appendChild(messageDiv);
    }
    
    // Функция удаления сообщения "нет результатов"
    function removeNoResultsMessage() {
        const message = document.getElementById('no-results-message');
        if (message) {
            message.remove();
        }
    }
    
});