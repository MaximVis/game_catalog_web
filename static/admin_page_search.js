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
        // Определяем параметры в зависимости от типа
        let url, divClass, imgClass, textClass, imgPath, defaultImg, name, id;
        
        if (type === 'game') {
            url = `/game_admin.php?game=${encodeURIComponent(item.game_name)}`;
            divClass = 'game_rectangle';
            imgClass = 'img_game_main';
            textClass = 'game_text_main';
            imgPath = 'game_imgs/';
            defaultImg = 'game_imgs/0.png';
            name = item.game_name;
            id = item.game_id;
        } else if (type === 'developer') {
            url = `/admin_developers_page.php?input_items_search=${encodeURIComponent(item.autor_name)}`;
            divClass = 'item_rectangle';
            imgClass = 'img_developer';
            textClass = 'developer_text_main';
            imgPath = 'admin_developers_imgs/';
            defaultImg = 'admin_developers_imgs/0.png';
            name = item.autor_name;
            id = item.autor_id;
        } else {
            return null;
        }
        
        // Создаем элементы
        const link = document.createElement('a');
        link.href = url;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = divClass;
        
        // Изображение
        let imgSrc = defaultImg;
        if (item.extension && item.extension !== '' && id) {
            imgSrc = imgPath + id + item.extension;
        } else if (id) {
            imgSrc = imgPath + id + '.png';
        }
        
        const img = document.createElement('img');
        img.className = imgClass;
        img.src = imgSrc;
        img.alt = name;
        img.onerror = () => { img.src = defaultImg; };
        
        // Текст
        const textDiv = document.createElement('div');
        textDiv.className = textClass;
        textDiv.textContent = name;
        
        // Описание для игр
        if (type === 'game' && item.genres) {
            const descDiv = document.createElement('div');
            descDiv.className = 'text_game_main_description';
            descDiv.textContent = item.genres;
            textDiv.appendChild(descDiv);
        }
        
        // Собираем
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