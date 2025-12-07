document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const searchInputGames = document.getElementById('admin_search_game');
    const gamesContainer = document.querySelector('.games_container');

    const searchInputDevelopers = document.getElementById('admin_search_developers');
    const DevelopersContainer = document.querySelector('.developers_container');

    const searchInputCategories = document.getElementById('admin_search_categories');
    const CategoriesContainer = document.querySelector('.categories_container');
    
    const searchInputGenres = document.getElementById('admin_search_genres');
    const GenresContainer = document.querySelector('.genres_container');

    let isLoading = false; 
    
    let searchedGameName = '';//  название игры
    let searchedDevelopersName = '';
    let searchedCategoriesName = '';
    let searchedGenresName = '';

    let searchTimeout;
    
    var load_games = 0;
    var load_developers = 0;
    var load_categories = 0;
    var load_genres = 0;

    searchInputDevelopers.addEventListener('input', handleSearchInput);
    searchInputGames.addEventListener('input', handleSearchInput);
    searchInputCategories.addEventListener('input', handleSearchInput);
    searchInputGenres.addEventListener('input', handleSearchInput);

    const inputTypeMap = new Map();
    inputTypeMap.set(searchInputDevelopers, 'developers');
    inputTypeMap.set(searchInputGames, 'games');
    inputTypeMap.set(searchInputCategories, 'categories');
    inputTypeMap.set(searchInputGenres, 'genres');


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
        }
        else if(searchType === 'developers')
        {
            container = DevelopersContainer;
            searchedDevelopersName = searchedName;
        }
        else if(searchType === 'categories')
        {
            container = CategoriesContainer;
            searchedCategoriesName = searchedName;
        }
        else if(searchType === 'genres')
        {
            container = GenresContainer;
            searchedGenresName = searchedName;
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

        console.log("qad", searchType);

        if (!pagination) {
            showLoadingIndicator(container);

            if (searchType === 'games') {
                load_games = 0;
            } else if (searchType === 'developers') {
                load_developers = 0;
            } else if (searchType === 'categories') {
                load_categories = 0;
            } else if (searchType === 'genres') {
                load_genres = 0;
            }
        }
        else{
            if (searchType === 'games') {
                load_games += 10;
            } else if (searchType === 'developers') {
                load_developers += 10;
            } else if (searchType === 'categories') {
                load_categories += 10;
            } else if (searchType === 'genres') {
                load_genres += 10;
            }
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
        } else if (searchType === 'categories') {
            if (gameName === '') {
                query_bd = "categories_no_name";
                var array_params = [load_categories];
            } else {
                query_bd = "categories_name";
                var searchPattern = gameName + '%';
                var array_params = [load_categories, searchPattern];
            }
        } else if (searchType === 'genres') {
            if (gameName === '') {
                query_bd = "genres_no_name";
                var array_params = [load_genres];
            } else {
                query_bd = "genres_name";
                var searchPattern = gameName + '%';
                var array_params = [load_genres, searchPattern];
            }
        }

        console.log("search_param:", query_bd, array_params);


        $.post("pagination.php", {
            array_params: array_params,
            query: query_bd
        }, function(data) {
            var response = JSON.parse(data);
            console.log('resp', response);

            if (!pagination) {
                container.innerHTML = '';
            }

            const itemArray = [];
            const arrayKeys = Object.keys(response).filter(key => Array.isArray(response[key]));

            if (arrayKeys.length > 0) {
                for (let i = 0; i < response[arrayKeys[0]].length; i++) {
                    console.log("for");
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
                    } else if (searchType === 'categories') {
                        console.log("ADD_");
                        itemArray.push({
                            category_id: response.gen_cat_id[i],
                            category_name: response.gen_cat_name[i]
                        });
                    } else if (searchType === 'genres') {
                        console.log("ADD_GENRE");
                        itemArray.push({
                            genre_id: response.gen_cat_id[i],
                            genre_name: response.gen_cat_name[i]
                        });
                    }

                }
            }
            

            console.log(itemArray);

            if (itemArray.length > 0) {
                console.log("ARRAYY!", itemArray);
                itemArray.forEach(item => {
                    let element;
                    if (searchType === 'games') {
                        element = createGameElement(item);
                    } else if (searchType === 'developers') {
                        element = createDeveloperElement(item);
                    } else if (searchType === 'categories') {
                        element = createCategoryElement(item);
                    } else if (searchType === 'genres') {
                        element = createGenreElement(item);
                    }

                    if (element) {
                        container.appendChild(element);
                        console.log("ELEMT_ADD");
                    }

                });
            } else {
                if (!pagination) {
                    if (searchType === 'games') {
                        container.innerHTML = '<div class="no-games-message">Игры не найдены</div>';
                    } else if (searchType === 'developers') {
                        container.innerHTML = '<div class="no-games-message">Разработчики не найдены</div>';
                    } else if (searchType === 'categories') {
                         container.innerHTML = '<div class="no-games-message">Категории не найдены</div>';
                    } else if (searchType === 'genres') {
                         container.innerHTML = '<div class="no-games-message">Жанры не найдены</div>';
                    }
                    
                }
            }      
            
            if (searchType === 'categories') {
                setTimeout(initCategoryHandlers, 0);
            } else if (searchType === 'genres') {
                setTimeout(initGenreHandlers, 0);
            }
        
            
            isLoading = false; 
        }).fail(function() {
            console.error("Ошибка при выполнении запроса");
            isLoading = false; 
        });
    }

    function createDeveloperElement(developer) {
    
        const link = document.createElement('a');
        if (developer.autor_id) {
            link.href = `/admin_developers_page.php?developer_id=${developer.autor_id}&input_items_search=${encodeURIComponent(developer.autor_name)}`;
        } else {
            link.href = `/admin_developers_page.php?input_items_search=${encodeURIComponent(developer.autor_name)}`;
        }
        
        const developerDiv = document.createElement('div');
        developerDiv.className = 'categy_rectangle';
        
        const getImagePath = (developer) => {
            let defaultPath = 'devs_imgs/0.png';
            
            if (developer.autor_id && developer.extension) {
                return `devs_imgs/${developer.autor_id}${developer.extension}`;
            }
            
            if (developer.autor_id) {
                return `devs_imgs/${developer.autor_id}.png`;
            }
            
            return defaultPath;
        };
        
        const img = document.createElement('img');
        img.className = 'img_developer';
        img.src = getImagePath(developer);
        img.alt = developer.autor_name || 'Разработчик';
        
        img.onerror = function() {
            this.src = 'devs_imgs/0.png';
            console.warn(`Не удалось загрузить изображение для разработчика: ${developer.autor_name}`);
        };
        
        const textDiv = document.createElement('div');
        textDiv.className = 'developer_text_main';
        textDiv.textContent = developer.autor_name || 'Неизвестный разработчик';
        
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
        
        let imgSrc = 'game_imgs/0.png';
        
        if (game.extension && game.extension !== '') {
            imgSrc = 'game_imgs/' + game.game_id + game.extension;
        } else if (game.game_id) {
            imgSrc = 'game_imgs/' + game.game_id + '.png';
        }
        
        const img = document.createElement('img');
        img.className = 'img_game_main';
        img.src = imgSrc;
        img.alt = game.game_name;
        
        img.onerror = function() {
            this.src = 'game_imgs/0.png';
        };
        
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

    function createCategoryElement(category) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'categy_rectangle';
        categoryDiv.dataset.categoryId = category.category_id;
        
        const textDiv = document.createElement('div');
        textDiv.className = 'developer_text_main';
        textDiv.textContent = category.category_name || '';
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'category-actions';
        
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'action-btn edit-btn';
        editBtn.title = 'Редактировать категорию';
        editBtn.textContent = '✏️';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.title = 'Удалить категорию';
        deleteBtn.textContent = '🗑️';
        
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        
        categoryDiv.appendChild(textDiv);
        categoryDiv.appendChild(actionsDiv);
        
        return categoryDiv;
    }
    
    function createGenreElement(genre) {
        const genreDiv = document.createElement('div');
        genreDiv.className = 'genre_rectangle';
        genreDiv.dataset.genreId = genre.genre_id;
        
        const textDiv = document.createElement('div');
        textDiv.className = 'developer_text_main';
        textDiv.textContent = genre.genre_name || '';
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'genre-actions';
        
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'action-btn edit-btn';
        editBtn.title = 'Редактировать жанр';
        editBtn.textContent = '✏️';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.title = 'Удалить жанр';
        deleteBtn.textContent = '🗑️';
        
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        
        genreDiv.appendChild(textDiv);
        genreDiv.appendChild(actionsDiv);
        
        return genreDiv;
    }
    
    
    function showLoadingIndicator(container) {

        container.innerHTML = '';
    
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
                lastLoadTime = now;
                
                console.log("CALL_Func");
                queryAndDisplay(searchType, itemName, container, true);
                
                setTimeout(() => {
                }, 1000);
            }
        }, 100);
    }

    gamesContainer.addEventListener('scroll', () => {
        checkScrollBottomOnce('games', searchedGameName, gamesContainer);
    });

    DevelopersContainer.addEventListener('scroll', () => {
        checkScrollBottomOnce('developers', searchedDevelopersName, DevelopersContainer);
    });

    CategoriesContainer.addEventListener('scroll', () => {
        checkScrollBottomOnce('categories', searchedCategoriesName, CategoriesContainer);
    });

    GenresContainer.addEventListener('scroll', () => {
        checkScrollBottomOnce('genres', searchedGenresName, GenresContainer);
    });

    // Инициализация обработчиков при загрузке
    initCategoryHandlers();
    initGenreHandlers();
    
    // Функции для категорий
    function initCategoryHandlers() {
        const categoryItems = document.querySelectorAll('.categy_rectangle:not([data-initialized])');
        
        categoryItems.forEach(item => {
            const textElement = item.querySelector('.developer_text_main');
            if (!textElement) {
                return;
            }
            
            const categoryName = textElement.textContent.trim();
            
            const editBtn = item.querySelector('.edit-btn');
            const deleteBtn = item.querySelector('.delete-btn');
            
            if (!editBtn || !deleteBtn) {
                return;
            }
            
            editBtn.replaceWith(editBtn.cloneNode(true));
            deleteBtn.replaceWith(deleteBtn.cloneNode(true));
            
            const newEditBtn = item.querySelector('.edit-btn');
            const newDeleteBtn = item.querySelector('.delete-btn');
            
            newEditBtn.addEventListener('click', function() {
                const currentTextElement = item.querySelector('.developer_text_main');
                if (currentTextElement) {
                    enableCategoryEditing(item, currentTextElement, categoryName);
                }
            });
            
            newDeleteBtn.addEventListener('click', function() {
                console.log('Удаление категории: ' + categoryName);
                
                if (confirm('Вы уверены, что хотите удалить категорию "' + categoryName + '"?')) {
                    const formData = new FormData();
                    formData.append('query', 'delete_category');
                    formData.append('based_input', categoryName); 

                    $.ajax({
                        url: 'uploader.php',
                        type: 'POST',
                        data: formData, 
                        processData: false, 
                        contentType: false, 
                        dataType: 'json',
                        success: function(response) {
                            if (response.status === true) {
                                deleteCategory(item, categoryName);
                            } else {
                                const messageElement = document.getElementById('category_message');
                                if (messageElement) {
                                    messageElement.textContent = "Ошибка сервера, сохранение не выполнено";
                                }
                            }
                        },
                        error: function(xhr, status, error) {
                            const messageElement = document.getElementById('category_message');
                            if (messageElement) {
                                messageElement.textContent = "Ошибка сервера, сохранение не выполнено";
                            }
                        }
                    });
                }
            });
            
            item.dataset.initialized = 'true';
        });
    }

    function deleteCategory(item, categoryName) {
        console.log('Удаление категории:', categoryName, 'элемент:', item);
        
        item.style.opacity = '0.5';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.height = item.offsetHeight + 'px';
            
            setTimeout(() => {
                item.style.height = '0';
                item.style.padding = '0';
                item.style.margin = '0';
                item.style.opacity = '0';
                item.style.transform = 'translateX(100px)';
                item.style.overflow = 'hidden';
                
                setTimeout(() => {
                    if (item.parentNode) {
                        item.remove();
                        console.log('Элемент удален из DOM');
                    }
                    
                    const container = document.querySelector('.categories_container');
                    const remainingItems = container.querySelectorAll('.categy_rectangle');
                    
                    console.log('Осталось категорий:', remainingItems.length);
                    
                    if (remainingItems.length === 0) {
                        container.innerHTML = '<div class="empty-message">Нет категорий</div>';
                    }
                    
                }, 300);
                
            }, 10);
            
        }, 100);
    }

    function enableCategoryEditing(item, textElement, originalName) {
        const originalText = textElement.textContent;
        
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.className = 'edit-input fade-in';
        inputField.value = originalText;
        
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
        
        const actionsContainer = item.querySelector('.category-actions');
        if (!actionsContainer) {
            return;
        }
        
        textElement.replaceWith(inputField);
        
        actionsContainer.innerHTML = '';
        actionsContainer.appendChild(saveBtn);
        actionsContainer.appendChild(cancelBtn);
        
        inputField.focus();
        inputField.select();
        
        saveBtn.addEventListener('click', function() {
            saveCategoryChanges(item, inputField, originalName);
        });

        cancelBtn.addEventListener('click', function() {
            cancelCategoryEditing(item, inputField, originalText);
        });
        
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveCategoryChanges(item, inputField, originalName);
            }
        });
        
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
            cancelCategoryEditing(item, inputField, originalName);
            return;
        }

        const formData = new FormData();
        formData.append('query', 'update_category');
        formData.append('based_input', originalName); 
        formData.append('new_input', newName); 

        $.ajax({
            url: 'uploader.php',
            type: 'POST',
            data: formData, 
            processData: false, 
            contentType: false, 
            dataType: 'json',
            success: function(response) {
                if (response.status === true) {
                    updateCategoryUI(item, newName);
                } else {
                    const messageElement = document.getElementById('category_message');
                    if (messageElement) {
                        messageElement.textContent = "Ошибка сервера, сохранение не выполнено";
                    }
                }
            },
            error: function(xhr, status, error) {
                const messageElement = document.getElementById('category_message');
                if (messageElement) {
                    messageElement.textContent = "Ошибка сервера, сохранение не выполнено";
                }
            }
        });
    }

    function cancelCategoryEditing(item, inputField, originalName) {
        const textElement = document.createElement('div');
        textElement.className = 'developer_text_main';
        textElement.textContent = originalName;
        
        inputField.replaceWith(textElement);
        
        const actionsContainer = item.querySelector('.category-actions');
        actionsContainer.innerHTML = `
            <button type="button" class="action-btn edit-btn" title="Редактировать категорию">✏️</button>
            <button type="button" class="action-btn delete-btn" title="Удалить категорию">🗑️</button>
        `;
        
        delete item.dataset.initialized;
        
        initCategoryHandlers();
    }

    function updateCategoryUI(item, newName) {
        const textElement = document.createElement('div');
        textElement.className = 'developer_text_main fade-in';
        textElement.textContent = newName;
        
        const inputField = item.querySelector('.edit-input');
        inputField.replaceWith(textElement);
        
        const actionsContainer = item.querySelector('.category-actions');
        actionsContainer.innerHTML = `
            <button type="button" class="action-btn edit-btn" title="Редактировать категорию">✏️</button>
            <button type="button" class="action-btn delete-btn" title="Удалить категорию">🗑️</button>
        `;
        
        delete item.dataset.initialized;
        
        initCategoryHandlers();
        
        console.log('Категория обновлена на: ' + newName);
    }

    // Функции для жанров (по аналогии с категориями)
    function initGenreHandlers() {
        const genreItems = document.querySelectorAll('.genre_rectangle:not([data-initialized])');
        
        genreItems.forEach(item => {
            const textElement = item.querySelector('.developer_text_main');
            if (!textElement) {
                return;
            }
            
            const genreName = textElement.textContent.trim();
            
            const editBtn = item.querySelector('.edit-btn');
            const deleteBtn = item.querySelector('.delete-btn');
            
            if (!editBtn || !deleteBtn) {
                return;
            }
            
            editBtn.replaceWith(editBtn.cloneNode(true));
            deleteBtn.replaceWith(deleteBtn.cloneNode(true));
            
            const newEditBtn = item.querySelector('.edit-btn');
            const newDeleteBtn = item.querySelector('.delete-btn');
            
            newEditBtn.addEventListener('click', function() {
                const currentTextElement = item.querySelector('.developer_text_main');
                if (currentTextElement) {
                    enableGenreEditing(item, currentTextElement, genreName);
                }
            });
            
            newDeleteBtn.addEventListener('click', function() {
                console.log('Удаление жанра: ' + genreName);
                
                if (confirm('Вы уверены, что хотите удалить жанр "' + genreName + '"?')) {
                    const formData = new FormData();
                    formData.append('query', 'delete_genre');
                    formData.append('based_input', genreName); 

                    $.ajax({
                        url: 'uploader.php',
                        type: 'POST',
                        data: formData, 
                        processData: false, 
                        contentType: false, 
                        dataType: 'json',
                        success: function(response) {
                            if (response.status === true) {
                                deleteGenre(item, genreName);
                            } else {
                                const messageElement = document.getElementById('genre_message');
                                if (messageElement) {
                                    messageElement.textContent = "Ошибка сервера, сохранение не выполнено";
                                }
                            }
                        },
                        error: function(xhr, status, error) {
                            const messageElement = document.getElementById('genre_message');
                            if (messageElement) {
                                messageElement.textContent = "Ошибка сервера, сохранение не выполнено";
                            }
                        }
                    });
                }
            });
            
            item.dataset.initialized = 'true';
        });
    }

    function deleteGenre(item, genreName) {
        console.log('Удаление жанра:', genreName, 'элемент:', item);
        
        item.style.opacity = '0.5';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.height = item.offsetHeight + 'px';
            
            setTimeout(() => {
                item.style.height = '0';
                item.style.padding = '0';
                item.style.margin = '0';
                item.style.opacity = '0';
                item.style.transform = 'translateX(100px)';
                item.style.overflow = 'hidden';
                
                setTimeout(() => {
                    if (item.parentNode) {
                        item.remove();
                        console.log('Элемент удален из DOM');
                    }
                    
                    const container = document.querySelector('.genres_container');
                    const remainingItems = container.querySelectorAll('.genre_rectangle');
                    
                    console.log('Осталось жанров:', remainingItems.length);
                    
                    if (remainingItems.length === 0) {
                        container.innerHTML = '<div class="empty-message">Нет жанров</div>';
                    }
                    
                }, 300);
                
            }, 10);
            
        }, 100);
    }

    function enableGenreEditing(item, textElement, originalName) {
        const originalText = textElement.textContent;
        
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.className = 'edit-input fade-in';
        inputField.value = originalText;
        
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
        
        const actionsContainer = item.querySelector('.genre-actions');
        if (!actionsContainer) {
            return;
        }
        
        textElement.replaceWith(inputField);
        
        actionsContainer.innerHTML = '';
        actionsContainer.appendChild(saveBtn);
        actionsContainer.appendChild(cancelBtn);
        
        inputField.focus();
        inputField.select();
        
        saveBtn.addEventListener('click', function() {
            saveGenreChanges(item, inputField, originalName);
        });

        cancelBtn.addEventListener('click', function() {
            cancelGenreEditing(item, inputField, originalText);
        });
        
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveGenreChanges(item, inputField, originalName);
            }
        });
        
        inputField.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                cancelGenreEditing(item, inputField, originalText);
            }
        });
    }

    function saveGenreChanges(item, inputField, originalName) {
        const newName = inputField.value.trim();
        
        if (!newName) {
            alert('Название жанра не может быть пустым!');
            inputField.focus();
            return;
        }
        
        if (newName === originalName) {
            cancelGenreEditing(item, inputField, originalName);
            return;
        }

        const formData = new FormData();
        formData.append('query', 'update_genre');
        formData.append('based_input', originalName); 
        formData.append('new_input', newName); 

        $.ajax({
            url: 'uploader.php',
            type: 'POST',
            data: formData, 
            processData: false, 
            contentType: false, 
            dataType: 'json',
            success: function(response) {
                if (response.status === true) {
                    updateGenreUI(item, newName);
                } else {
                    const messageElement = document.getElementById('genre_message');
                    if (messageElement) {
                        messageElement.textContent = "Ошибка сервера, сохранение не выполнено";
                    }
                }
            },
            error: function(xhr, status, error) {
                const messageElement = document.getElementById('genre_message');
                if (messageElement) {
                    messageElement.textContent = "Ошибка сервера, сохранение не выполнено";
                }
            }
        });
    }

    function cancelGenreEditing(item, inputField, originalName) {
        const textElement = document.createElement('div');
        textElement.className = 'developer_text_main';
        textElement.textContent = originalName;
        
        inputField.replaceWith(textElement);
        
        const actionsContainer = item.querySelector('.genre-actions');
        actionsContainer.innerHTML = `
            <button type="button" class="action-btn edit-btn" title="Редактировать жанр">✏️</button>
            <button type="button" class="action-btn delete-btn" title="Удалить жанр">🗑️</button>
        `;
        
        delete item.dataset.initialized;
        
        initGenreHandlers();
    }

    function updateGenreUI(item, newName) {
        const textElement = document.createElement('div');
        textElement.className = 'developer_text_main fade-in';
        textElement.textContent = newName;
        
        const inputField = item.querySelector('.edit-input');
        inputField.replaceWith(textElement);
        
        const actionsContainer = item.querySelector('.genre-actions');
        actionsContainer.innerHTML = `
            <button type="button" class="action-btn edit-btn" title="Редактировать жанр">✏️</button>
            <button type="button" class="action-btn delete-btn" title="Удалить жанр">🗑️</button>
        `;
        
        delete item.dataset.initialized;
        
        initGenreHandlers();
        
        console.log('Жанр обновлен на: ' + newName);
    }

});