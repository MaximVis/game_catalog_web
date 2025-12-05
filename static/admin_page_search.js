document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const searchInputGames = document.getElementById('admin_search_game');
    const gamesContainer = document.querySelector('.games_container');

    const searchInputDevelopers = document.getElementById('admin_search_developers');
    const DevelopersContainer = document.querySelector('.developers_container');
    
    let searchedGameName = '';//  название игры
    let searchTimeout;
    
    var load_games = 0;

    searchInputDevelopers.addEventListener('input', handleSearchInput);
    searchInputGames.addEventListener('input', handleSearchInput);

    const inputTypeMap = new Map();
    inputTypeMap.set(searchInputDevelopers, 'developers');
    inputTypeMap.set(searchInputGames, 'games');



    function handleSearchInput(event) {

        const input = event.target;
        const searchType = inputTypeMap.get(input);

        console.log("search_type:", searchType);

        if (searchType === 'games'){
            container = gamesContainer;
        }
        else if(searchType === 'developers')
        {
            container = DevelopersContainer;
        }

        searchedGameName = event.target.value.trim();

        clearTimeout(searchTimeout);
        
        if (!searchedGameName) {
            console.log("clr");
            load_games = 0;
            performSearch(searchType, searchedGameName, container);
            return;
        }
        
        // 500мс после последнего ввода
        searchTimeout = setTimeout(() => {
            console.log("notclr");
            load_games = 0;
            performSearch(searchType, searchedGameName, container);
        }, 500);
    }

    
    function performSearch(search_type, itemName, container) {

        console.log(itemName);

        queryAndDisplay(search_type, itemName, container);

        //hideLoadingIndicator();

    }

    function queryAndDisplay(searchType, gameName, container, pagination = false){

        console.log("qad");

        if (!pagination)
        {
            showLoadingIndicator(searchType);
        }

        if(searchType === 'games')
        {
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
        }
        else if(searchType === 'developers')
        {
            if (gameName === '')
            {
                query_bd = "developers_get";
                var array_params = [load_games];
            }
            else
            {
                query_bd = "developers_post";
                var searchPattern = gameName + '%';
                var array_params = [load_games, searchPattern];
            }
        }

        $.post("pagination.php", {
            array_params: array_params, 
            query: query_bd
        }, function(data) {
            var response = JSON.parse(data);
            console.log(response);

            if (!pagination)
            {
                container.innerHTML = '';
            }

            const itemArray = [];
        
            if (response.game_id && response.game_id.length > 0) {
                for (let i = 0; i < response.game_id.length; i++) {
                    if (searchType === 'games')
                    {
                        itemArray.push({
                            game_id: response.game_id[i],
                            game_name: response.game_name[i],
                            genres: response.genres[i],
                            extension: response.extension[i]
                        });
                    }
                    else if (searchType === 'developers')
                    {
                        itemArray.push({
                            autor_id: response.autor_id[i],
                            autor_name: response.autor_name[i],
                            extension: response.extension[i] 
                        });
                    }
                }
            }
            
             if (itemArray.length > 0) {
                console.log("ARRAYY!", itemArray);
                itemArray.forEach(item => {
                    let element;
                    if (searchType === 'games') {
                        element = createGameElement(item);
                    } else if (searchType === 'developers') {
                        element = createDeveloperElement(item);
                    }
                    
                    if (element) {
                        container.appendChild(element);
                    }
                });
            } else {
                if (!pagination)
                {
                    container.innerHTML = '<div class="no-games-message">Игры не найдены</div>';
                }
            } 
            
        });

        load_games += 10;
    }

    function createDeveloperElement(developer) {
    
        const link = document.createElement('a');
        // Если у разработчика есть ID, можно добавить его в URL
        if (developer.autor_id) {
            link.href = `/admin_developers_page.php?developer_id=${developer.autor_id}&input_items_search=${encodeURIComponent(developer.autor_name)}`;
        } else {
            link.href = `/admin_developers_page.php?input_items_search=${encodeURIComponent(developer.autor_name)}`;
        }
        
        const developerDiv = document.createElement('div');
        developerDiv.className = 'item_rectangle';
        
        // Функция для получения пути к изображению
        const getImagePath = (developer) => {
            // Путь по умолчанию
            let defaultPath = 'admin_developers_imgs/0.png';
            
            // Если есть и ID, и расширение
            if (developer.autor_id && developer.extension) {
                return `admin_developers_imgs/${developer.autor_id}${developer.extension}`;
            }
            
            // Если есть только ID
            if (developer.autor_id) {
                return `admin_developers_imgs/${developer.autor_id}.png`;
            }
            
            return defaultPath;
        };
        
        // Изображение разработчика
        const img = document.createElement('img');
        img.className = 'img_developer';
        img.src = getImagePath(developer);
        img.alt = developer.autor_name || 'Разработчик';
        
        // Добавляем обработчик ошибок загрузки изображения
        img.onerror = function() {
            this.src = 'admin_developers_imgs/0.png';
            console.warn(`Не удалось загрузить изображение для разработчика: ${developer.autor_name}`);
        };
        
        // Основной текст разработчика
        const textDiv = document.createElement('div');
        textDiv.className = 'developer_text_main';
        textDiv.textContent = developer.autor_name || 'Неизвестный разработчик';
        
        // Если есть дополнительная информация (опционально)
        if (developer.games_count || developer.description) {
            const infoDiv = document.createElement('div');
            infoDiv.className = 'developer_additional_info';
            
            if (developer.games_count) {
                const gamesCount = document.createElement('span');
                gamesCount.className = 'games_count';
                gamesCount.textContent = `Игр: ${developer.games_count}`;
                infoDiv.appendChild(gamesCount);
            }
            
            if (developer.description) {
                const description = document.createElement('p');
                description.className = 'developer_description';
                description.textContent = developer.description.substring(0, 100) + '...';
                infoDiv.appendChild(description);
            }
            
            textDiv.appendChild(infoDiv);
        }
        
        // Собираем структуру
        developerDiv.appendChild(img);
        developerDiv.appendChild(textDiv);
        link.appendChild(developerDiv);
        
        return link;
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
    function showLoadingIndicator(searchType) {

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
                }, 1000);
            }
        }, 100);
    }

    gamesContainer.addEventListener('scroll', checkScrollBottomOnce);
    
});