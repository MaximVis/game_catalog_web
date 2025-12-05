document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const searchInputGames = document.getElementById('admin_search_game');
    const gamesContainer = document.querySelector('.games_container');

    const searchInputDevelopers = document.getElementById('admin_search_developers');
    const DevelopersContainer = document.querySelector('.developers_container');
    
    let searchedGameName = '';//  название игры
    const originalGamesHTML = gamesContainer.innerHTML;// Исходный  контейнер с играми
    let searchTimeout;// Дебаунс для оптимизации запросов
    
    var load_games = 0;

    searchInputDevelopers.addEventListener('input', handleSearchInput);
    searchInputGames.addEventListener('input', handleSearchInput);

    const inputTypeMap = new Map();
    inputTypeMap.set(searchInputDevelopers, 'developers');
    inputTypeMap.set(searchInputGames, 'games');



    function handleSearchInput(event) {

        console.log(searchInputDevelopers, "||||", searchInputGames);

        const input = event.target;
        const searchType = inputTypeMap.get(input);

        console.log("search_type:", searchType);

        searchedGameName = event.target.value.trim();

        clearTimeout(searchTimeout);
        
        if (!searchedGameName) {
            console.log("clr");
            load_games = 0;
            performSearch(searchedGameName);
            return;
        }
        
        // 500мс после последнего ввода
        searchTimeout = setTimeout(() => {
            console.log("notclr");
            load_games = 0;
            performSearch(searchedGameName);
        }, 500);
    }


    // searchInputDevelopers.addEventListener('input', function() {// Обработчик ввода в поле поиска разработчика

    //     searchedGameName = this.value.trim();
    
    //     clearTimeout(searchTimeout);
        
    //     if (!searchedGameName) {
    //         console.log("clr");
    //         load_games = 0;
    //         performSearch(searchedGameName);
    //     }
        
    //     // 300мс после последнего ввода
    //     searchTimeout = setTimeout(() => {
    //         console.log("notclr");
    //         load_games = 0;
    //         performSearch(searchedGameName);
    //     }, 500);
    // });
    
    
    // searchInputGames.addEventListener('input', function() {// Обработчик ввода в поле поиска игры

    //     searchedGameName = this.value.trim();
    
    //     clearTimeout(searchTimeout);
        
    //     if (!searchedGameName) {
    //         console.log("clr");
    //         load_games = 0;
    //         performSearch(searchedGameName);
    //     }
        
    //     // 300мс после последнего ввода
    //     searchTimeout = setTimeout(() => {
    //         console.log("notclr");
    //         load_games = 0;
    //         performSearch(searchedGameName);
    //     }, 500);
    // });
    
    function performSearch(gameName) {

        console.log(gameName);

        //showLoadingIndicator();

        queryAndDisplay(gameName);

        //hideLoadingIndicator();

    }

    function queryAndDisplay(gameName, pagination = false){

        console.log("qad");

        if (!pagination)
        {
            showLoadingIndicator();
        }

        if (gameName === '')
        {
            query_bd = "games_search_get";
            var array_params = [load_games];
        }
        else
        {
            query_bd = "games_search_post";
            var searchPattern = gameName + '%';
            var array_params = [load_games, searchPattern];
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

        load_games += 10;
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
    const MIN_LOAD_INTERVAL = 500;
    let scrollTimeout;

    function checkScrollBottomOnce() {
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            // Проверяем все условия
            if (isLoading || !hasMore) return;
            
            const now = Date.now();
            if (now - lastLoadTime < MIN_LOAD_INTERVAL) return;
            
            const scrollHeight = gamesContainer.scrollHeight;
            const scrollTop = gamesContainer.scrollTop;
            const clientHeight = gamesContainer.clientHeight;
            
            // Увеличиваем порог до 100px
            if (Math.abs(scrollHeight - scrollTop - clientHeight) <= 100) {
                isLoading = true;
                lastLoadTime = now;
                
                // Вызываем без await
                queryAndDisplay(searchedGameName, true);
                
                // Автоматически сбрасываем isLoading через время
                setTimeout(() => {
                    isLoading = false;
                }, 1000); // На всякий случай
            }
        }, 100);
    }

    gamesContainer.addEventListener('scroll', checkScrollBottomOnce);
    
});