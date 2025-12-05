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
                    //autor_id: Array(2), autor_name: Array(2), extension: Array(2)}
                }
            }
            
             if (itemArray.length > 0) {
                itemArray.forEach(game => {
                    const gameElement = createItemElement(game, searchType);
                    container.appendChild(gameElement);
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
    
    
    function createItemElement(item, type) {
    // type: 'game' или 'developer'
    
        const config = {
            game: {
                urlPrefix: '/game_admin.php?game=',
                nameField: 'game_name',
                idField: 'game_id',
                divClass: 'game_rectangle',
                imgClass: 'img_game_main',
                textClass: 'game_text_main',
                imgPath: 'game_imgs/',
                defaultImg: 'game_imgs/0.png',
                hasDescription: true,
                descriptionField: 'genres',
                descriptionClass: 'text_game_main_description'
            },
            developer: {
                urlPrefix: '/admin_developers_page.php?input_items_search=',
                nameField: 'autor_name',
                idField: 'autor_id',
                divClass: 'item_rectangle',
                imgClass: 'img_developer',
                textClass: 'developer_text_main',
                imgPath: 'admin_developers_imgs/',
                defaultImg: 'admin_developers_imgs/0.png',
                hasDescription: false
            }
        };
        
        const cfg = config[type];
        if (!cfg) {
            console.error('Неизвестный тип элемента:', type);
            return null;
        }
        
        // Создаем ссылку
        const link = document.createElement('a');
        link.href = `${cfg.urlPrefix}${encodeURIComponent(item[cfg.nameField])}`;
        
        // Создаем основной контейнер
        const itemDiv = document.createElement('div');
        itemDiv.className = cfg.divClass;
        
        // Определяем путь к изображению
        let imgSrc = cfg.defaultImg;
        if (item.extension && item.extension !== '' && item[cfg.idField]) {
            imgSrc = cfg.imgPath + item[cfg.idField] + item.extension;
        } else if (item[cfg.idField]) {
            imgSrc = cfg.imgPath + item[cfg.idField] + '.png';
        }
        
        // Создаем изображение
        const img = document.createElement('img');
        img.className = cfg.imgClass;
        img.src = imgSrc;
        img.alt = item[cfg.nameField];
        
        // Обработчик ошибки загрузки изображения
        img.onerror = function() {
            this.src = cfg.defaultImg;
        };
        
        // Создаем текстовый блок
        const textDiv = document.createElement('div');
        textDiv.className = cfg.textClass;
        textDiv.textContent = item[cfg.nameField];
        
        // Добавляем описание если нужно
        if (cfg.hasDescription && item[cfg.descriptionField]) {
            const descriptionDiv = document.createElement('div');
            descriptionDiv.className = cfg.descriptionClass;
            descriptionDiv.textContent = item[cfg.descriptionField];
            textDiv.appendChild(descriptionDiv);
        }
        
        // Собираем все вместе
        itemDiv.appendChild(img);
        itemDiv.appendChild(textDiv);
        link.appendChild(itemDiv);
        
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
                }, 1000); // На всякий случай
            }
        }, 100);
    }

    gamesContainer.addEventListener('scroll', checkScrollBottomOnce);
    
});