document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const searchInputGames = document.getElementById('admin_search_game');
    const gamesContainer = document.querySelector('.games_container');

    const searchInputDevelopers = document.getElementById('admin_search_developers');
    const DevelopersContainer = document.querySelector('.developers_container');

    let isLoading = false; 
    
    let searchedGameName = '';//  название игры
    let searchTimeout;
    
    var load_games = 0;
    var load_developers = 0;

    let searchedDevelopersName = '';

    searchInputDevelopers.addEventListener('input', handleSearchInput);
    searchInputGames.addEventListener('input', handleSearchInput);

    const inputTypeMap = new Map();
    inputTypeMap.set(searchInputDevelopers, 'developers');
    inputTypeMap.set(searchInputGames, 'games');



    function handleSearchInput(event) {

        if (!isLoading) {
            isLoading = true;
        }

        const input = event.target;
        const searchType = inputTypeMap.get(input);
        searchedName = event.target.value.trim();

        console.log("search_type:", searchType);

        if (searchType === 'games'){
            container = gamesContainer;
            searchedGameName= searchedName;
            load_games = 0;
        }
        else if(searchType === 'developers')
        {
            container = DevelopersContainer;
            searchedDevelopersName = searchedName;
            load_developers = 0;
        }



        clearTimeout(searchTimeout);
        
        if (!searchedName) {
            console.log("clr");
            queryAndDisplay(searchType, searchedName, container);
            return;
        }
        
        searchTimeout = setTimeout(() => {
            console.log("notclr");
            queryAndDisplay(searchType, searchedName, container);
        }, 500);
    }

    function queryAndDisplay(searchType, gameName, container, pagination = false) {

        // if (isLoading) {
        //     return;
        // }
        // isLoading = true;

        console.log("qad", searchType);

        if (!pagination) {
            showLoadingIndicator(container);
        }

        if (searchType === 'games') {
            if (gameName === '') {
                query_bd = "games_search_get";
                var array_params = [load_games];
            } else {
                query_bd = "games_search_post";
                var searchPattern = gameName + '%';
                var array_params = [load_games, searchPattern];
            }
        } else if (searchType === 'developers') {
            if (gameName === '') {
                query_bd = "developers_get";
                var array_params = [load_developers];
            } else {
                query_bd = "developers_post";
                var searchPattern = gameName + '%';
                var array_params = [load_developers, searchPattern];
            }
        }

        $.post("pagination.php", {
            array_params: array_params,
            query: query_bd
        }, function(data) {
            var response = JSON.parse(data);
            console.log(response);

            if (!pagination) {
                container.innerHTML = '';
            }

            const itemArray = [];

            const arrayKeys = Object.keys(response).filter(key => Array.isArray(response[key]));

            if (arrayKeys.length > 0) {
                for (let i = 0; i < response[arrayKeys[0]].length; i++) {
                    console.log("i", i);
                    if (searchType === 'games') {
                        itemArray.push({
                            game_id: response.game_id[i],
                            game_name: response.game_name[i],
                            genres: response.genres[i],
                            extension: response.extension[i]
                        });
                    } else if (searchType === 'developers') {
                        itemArray.push({
                            autor_id: response.autor_id[i],
                            autor_name: response.autor_name[i],
                            extension: response.extension[i]
                        });
                        console.log("i2", i);
                    }
                }
            }
            console.log("MASSIVE<", itemArray);

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
                if (!pagination) {
                    container.innerHTML = '<div class="no-games-message">Игры не найдены</div>';
                }
            }

            if (searchType === 'games') {
                load_games += 10;
            } else if (searchType === 'developers') {
                load_developers += 10;
            }
            
            isLoading = false; 
        }).fail(function() {
            console.error("Ошибка при выполнении запроса");
            isLoading = false; 
        });
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
            let defaultPath = 'devs_imgs/0.png';
            
            // Если есть и ID, и расширение
            if (developer.autor_id && developer.extension) {
                return `devs_imgs/${developer.autor_id}${developer.extension}`;
            }
            
            // Если есть только ID
            if (developer.autor_id) {
                return `devs_imgs/${developer.autor_id}.png`;
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
            this.src = 'devs_imgs/0.png';
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
    
    
    // показ индикатора загрузки
    function showLoadingIndicator(container) {

        container.innerHTML = '';
    
        // индикатор загрузки
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-indicator';
        loadingDiv.id = 'search-loading';
        loadingDiv.innerHTML = 'Поиск игр...';
        
        container.prepend(loadingDiv);
    }

    


    let hasMore = true;
    let lastLoadTime = 0;
    const MIN_LOAD_INTERVAL = 500;
    let scrollTimeout;

    function checkScrollBottomOnce(searchType, itemName, container) {
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {

            if (isLoading || !hasMore) return;
            
            const now = Date.now();
            if (now - lastLoadTime < MIN_LOAD_INTERVAL) return;
            
            const scrollHeight = container.scrollHeight;
            const scrollTop = container.scrollTop;
            const clientHeight = container.clientHeight;
            
            if (Math.abs(scrollHeight - scrollTop - clientHeight) <= 100) {
                //isLoading = true;
                lastLoadTime = now;
                
                console.log("CALL_Func");
                queryAndDisplay(searchType, itemName, container, true);//queryAndDisplay(searchType, gameName, container, pagination = false)
                
                setTimeout(() => {
                    //isLoading = false;
                }, 1000);
            }
        }, 100);
    }

    gamesContainer.addEventListener('scroll', () => {
        checkScrollBottomOnce('games', searchedGameName, gamesContainer);
    });

    DevelopersContainer.addEventListener('scroll', () => {
        checkScrollBottomOnce('developers', searchedGameName, DevelopersContainer);
    });
























    

    // Находим все элементы категорий
    const categoryItems = document.querySelectorAll('.item_rectangle');
    
    categoryItems.forEach(item => {
        const textElement = item.querySelector('.developer_text_main');
        const categoryName = textElement.textContent.trim();
        
        // Находим уже существующие кнопки в HTML
        const editBtn = item.querySelector('.edit-btn');
        const deleteBtn = item.querySelector('.delete-btn');
        
        // Проверяем, что кнопки найдены
        if (!editBtn || !deleteBtn) {
            console.error('Кнопки не найдены в элементе:', item);
            return;
        }
        
        // Обработчик для кнопки редактирования
        editBtn.addEventListener('click', function() {
            enableCategoryEditing(item, textElement, categoryName);
        });
        
        // Обработчик для кнопки удаления
        deleteBtn.addEventListener('click', function() {
            // Выводим приветствие в консоль
            console.log('Привет! Категория: ' + categoryName);
            
            // Опционально: подтверждение удаления
            if (confirm('Вы уверены, что хотите удалить категорию "' + categoryName + '"?')) {
                // Здесь можно добавить логику удаления категории
                // Например, отправку AJAX-запроса на сервер
                // deleteCategory(categoryName, item);
            }
        });
    });


function enableCategoryEditing(item, textElement, originalName) {
    // Сохраняем оригинальное название
    const originalText = textElement.textContent;
    
    // Создаем поле ввода
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.className = 'edit-input fade-in';
    inputField.value = originalText;
    
    // Создаем кнопку сохранения
    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'action-btn save-btn';
    saveBtn.innerHTML = '✅';
    saveBtn.title = 'Сохранить изменения';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'action-btn cancel-btn';
    cancelBtn.innerHTML = '❌';
    cancelBtn.title = 'Отменить изменения';
    
    // Находим контейнер с кнопками
    const actionsContainer = item.querySelector('.category-actions');
    if (!actionsContainer) {
        console.error('Контейнер с кнопками не найден');
        return;
    }
    
    // Заменяем текстовый элемент на поле ввода
    textElement.replaceWith(inputField);
    
    // Очищаем контейнер и добавляем кнопку сохранения
    actionsContainer.innerHTML = '';
    actionsContainer.appendChild(saveBtn);
    actionsContainer.appendChild(cancelBtn);
    
    // Фокус на поле ввода
    inputField.focus();
    inputField.select();
    
    // Обработчик для кнопки сохранения
    saveBtn.addEventListener('click', function() {
        saveCategoryChanges(item, inputField, originalName);
    });

    // Обработчик для кнопки отмены
    cancelBtn.addEventListener('click', function() {
        cancelCategoryEditing(item, inputField, originalText);
    });
    
    // Сохранение при нажатии Enter
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveCategoryChanges(item, inputField, originalName);
        }
    });
    
    // Отмена редактирования при нажатии Escape
    inputField.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cancelCategoryEditing(item, inputField, originalText);
        }
    });
}

function saveCategoryChanges(item, inputField, originalName) {
    const newName = inputField.value.trim();
    
    if (!newName) {
        alert('Название категории не может быть пустым!');
        inputField.focus();
        return;
    }
    
    if (newName === originalName) {
        // Если название не изменилось, просто возвращаемся к обычному виду
        cancelCategoryEditing(item, inputField, originalName);
        return;
    }
    
    // Здесь можно добавить отправку данных на сервер через AJAX
    // Например:
    /*
    fetch('update_category.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            old_name: originalName,
            new_name: newName
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateCategoryUI(item, newName);
        } else {
            alert('Ошибка при обновлении категории: ' + data.message);
            cancelCategoryEditing(item, inputField, originalName);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Произошла ошибка при обновлении категории');
        cancelCategoryEditing(item, inputField, originalName);
    });
    */
    
    // Временная заглушка - просто обновляем интерфейс
    updateCategoryUI(item, newName);
}

function cancelCategoryEditing(item, inputField, originalName) {
    // Возвращаем текстовый элемент
    const textElement = document.createElement('div');
    textElement.className = 'developer_text_main';
    textElement.textContent = originalName;
    
    inputField.replaceWith(textElement);
    
    // Восстанавливаем оригинальные кнопки
    const actionsContainer = item.querySelector('.category-actions');
    actionsContainer.innerHTML = `
        <button type="button" class="action-btn edit-btn" title="Редактировать категорию">✏️</button>
        <button type="button" class="action-btn delete-btn" title="Удалить категорию">🗑️</button>
    `;
    
    // Повторно инициализируем обработчики для этой категории
    initCategoryItem(item, textElement);
}

function updateCategoryUI(item, newName) {
    // Создаем новый текстовый элемент
    const textElement = document.createElement('div');
    textElement.className = 'developer_text_main fade-in';
    textElement.textContent = newName;
    
    // Заменяем поле ввода на текстовый элемент
    const inputField = item.querySelector('.edit-input');
    inputField.replaceWith(textElement);
    
    // Восстанавливаем оригинальные кнопки
    const actionsContainer = item.querySelector('.category-actions');
    actionsContainer.innerHTML = `
        <button type="button" class="action-btn edit-btn" title="Редактировать категорию">✏️</button>
        <button type="button" class="action-btn delete-btn" title="Удалить категорию">🗑️</button>
    `;
    
    // Повторно инициализируем обработчики для обновленного элемента
    initCategoryItem(item, textElement);
    
    // Можно добавить уведомление об успешном сохранении
    console.log('Категория обновлена на: ' + newName);
}

function initCategoryItem(item, textElement) {
    const categoryName = textElement.textContent.trim();
    const editBtn = item.querySelector('.edit-btn');
    const deleteBtn = item.querySelector('.delete-btn');
    
    if (editBtn && deleteBtn) {
        // Назначаем обработчики для кнопок
        editBtn.addEventListener('click', function() {
            enableCategoryEditing(item, textElement, categoryName);
        });
        
        deleteBtn.addEventListener('click', function() {
            console.log('Привет! Категория: ' + categoryName);
        });
    }
}

// Функция для динамического добавления новой категории (если используется AJAX)
function addNewCategory(categoryName) {
    const container = document.querySelector('.categories_container');
    
    const newItem = document.createElement('div');
    newItem.className = 'item_rectangle fade-in';
    newItem.innerHTML = `
        <div class="developer_text_main">${categoryName}</div>
        <div class="category-actions">
            <button type="button" class="action-btn edit-btn" title="Редактировать категорию">✏️</button>
            <button type="button" class="action-btn delete-btn" title="Удалить категорию">🗑️</button>
        </div>
    `;
    
    container.appendChild(newItem);
    
    // Инициализируем обработчики для новой категории
    const textElement = newItem.querySelector('.developer_text_main');
    initCategoryItem(newItem, textElement);
}


});