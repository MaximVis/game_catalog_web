document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const searchInput = document.getElementById('admin_search_game');
    const gamesContainer = document.querySelector('.games_container');
    
    let searchedGameName = '';//  название игры
    const originalGamesHTML = gamesContainer.innerHTML;// Исходный  контейнер с играми
    let searchTimeout;// Дебаунс для оптимизации запросов
    
    var load_items = 0;
    
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
            load_items = 0;
            performSearch(searchedGameName, load_items);
        }
        
        // Дебаунс: выполняем поиск через 300мс после последнего ввода
        searchTimeout = setTimeout(() => {
            console.log("STAAAAAAAAAART!!!!");
            load_items = 0;
            performSearch(searchedGameName, load_items);
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

        queryAndDisplay(gameName);

        hideLoadingIndicator();

    }

    function queryAndDisplay(gameName, pagination = false){

        var searchPattern = gameName + '%';

        if (load_items === 0)
        {
            query_bd = "games_search_get";
            var array_params = [load_items];
        }
        else
        {
            query_bd = "games_search_post";
            var array_params = [load_items, searchPattern];
        }

        $.post("pagination.php", {
            array_params: array_params, 
            query: query_bd
        }, function(data) {
            var response = JSON.parse(data);
            console.log(response);

            if (!pagination)
            {
                gamesContainer.innerHTML = '';
            }

            const gamesArray = [];
        
            if (response.game_id && response.game_id.length > 0) {
                for (let i = 0; i < response.game_id.length; i++) {
                    gamesArray.push({
                        game_id: response.game_id[i],
                        game_name: response.game_name[i],
                        genres: response.genres[i],
                        extension: response.extension[i]
                    });
                }
            }
            
             if (gamesArray.length > 0) {
                gamesArray.forEach(game => {
                    const gameElement = createGameElement(game);
                    gamesContainer.appendChild(gameElement);
                });
            } else {
                if (!pagination)
                {
                    gamesContainer.innerHTML = '<div class="no-games-message">Игры не найдены</div>';
                }
            } 
            
        });

        load_items += 10;

    }
    
    
    function createGameElement(game) {
        const link = document.createElement('a');
        link.href = `/game_admin.php?game=${encodeURIComponent(game.game_name)}`;
        
        const gameDiv = document.createElement('div');
        gameDiv.className = 'game_rectangle';
        
        let imgSrc = 'game_imgs/0.png'; // изображение по умолчанию
        
        // Если в ответе есть extension, используем его
        if (game.extension && game.extension !== '') {
            imgSrc = 'game_imgs/' + game.game_id + game.extension;
        } else if (game.game_id) {
            imgSrc = 'game_imgs/' + game.game_id + '.png';
        }
        
        // Изображение игры
        const img = document.createElement('img');
        img.className = 'img_game_main';
        img.src = imgSrc;
        img.alt = game.game_name;
        
        // Добавляем обработчик ошибок загрузки изображения
        img.onerror = function() {
            this.src = 'game_imgs/0.png'; // Запасное изображение при ошибке
        };
        
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

        removeNoResultsMessage();
        
        // индикатор загрузки
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-indicator';
        loadingDiv.id = 'search-loading';
        loadingDiv.innerHTML = 'Поиск игр...';
        
        gamesContainer.prepend(loadingDiv);
    }
    
    // скрытие индикатора загрузки
    function hideLoadingIndicator() {
        const loadingIndicator = document.getElementById('search-loading');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }
    
    
    // удаление сообщения "нет результатов"
    function removeNoResultsMessage() {
        const message = document.getElementById('no-results-message');
        if (message) {
            message.remove();
        }
    }




    let isLoading = false;
    let hasMore = true;
    let lastLoadTime = 0;
    const MIN_LOAD_INTERVAL = 500; // Минимум 500мс между запросами

    function checkScrollBottomOnce() {
        // Если уже загружаем - выходим сразу
        if (isLoading) return;
        
        const now = Date.now();
        // Проверяем, прошло ли достаточно времени с последней загрузки
        if (now - lastLoadTime < MIN_LOAD_INTERVAL) return;
        
        const scrollHeight = gamesContainer.scrollHeight;
        const scrollTop = gamesContainer.scrollTop;
        const clientHeight = gamesContainer.clientHeight;
        
        // Увеличиваем допуск для более стабильной работы
        if (Math.abs(scrollHeight - scrollTop - clientHeight) <= 10 && 
            !isLoading && 
            hasMore) {
            
            isLoading = true;
            lastLoadTime = now;
            
            queryAndDisplay(searchedGameName, true)
                .then(() => {
                    isLoading = false;
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    isLoading = false;
                });
        }
    }

    // Добавляем throttle для производительности
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    const throttledCheck = throttle(checkScrollBottomOnce, 50);
    gamesContainer.addEventListener('scroll', throttledCheck);
});