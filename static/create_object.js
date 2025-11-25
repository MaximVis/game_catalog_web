$(document).ready(function(){

    async function checkDeveloperExists(developerName, query_db) {
        try {
            const checkDeveloper = await $.post("pagination.php", {
                array_params: [developerName], 
                query: query_db
            });
            
            const response = JSON.parse(checkDeveloper);
            return response;
        } catch (error) {
            return false;
        }
    }

    $('#create_object').on('submit', async function(e) {

        e.preventDefault();

        const formData = new FormData();
        const isDeveloperPage = document.getElementById('developer_name');
        const isGamePage = document.getElementById('developer');
        const subMessage = document.getElementById('sub_message');

        if (isDeveloperPage) {//страница разработчика

            console.log("dev_pg");
            const developerInput = document.getElementById('developer_name');
            const screensaverFile = document.getElementById('screensaver').files[0];

            const developer = developerInput.value;

            const basedAuthor = developerInput.dataset.basedAutor;

            if(basedAuthor && basedAuthor !== '')//изменение разработчика
            {
                console.log("upd");
                if((developer == basedAuthor) && !screensaverFile)//нет изменений
                {
                    subMessage.textContent = "Нет изменений, сохранение не выполнено";
                    return;
                }

                if(developer != basedAuthor)//проверка существования разработчика
                {
                    response = await checkDeveloperExists(developer, "developer_search");

                    console.log("resp,", response);
                    if (response.autor_name && response.autor_name.toString().trim() !== '') {
                        subMessage.textContent = "Разработчик уже существует, сохранение не выполнено";
                        return;
                    }
                }

                formData.append('query', 'update_autor');
                formData.append('developer_name', developer);
                formData.append('based_developer_name', basedAuthor);
    
                if (screensaverFile) {
                    formData.append('screensaver', screensaverFile);
                }

            }
            else//добавление нового разработчика
            {
                
                if (!developer) {
                    subMessage.textContent = ('Введите разработчика, сохранение не выполнено');
                    return;
                }
                else{//проверка существования разработчика
                    response = await checkDeveloperExists(developer, "developer_search");
                
                    if (response.autor_name.length) {
                        subMessage.textContent = "Разработчик уже существует, сохранение не выполнено";
                        return;
                    }
                }

                formData.append('query', 'add_autor');
                formData.append('developer_name', developer);
    
                if (screensaverFile) {
                    formData.append('screensaver', screensaverFile);
                }
            }

        }
        else if (isGamePage) {//страница добавления игры

            bGame_update = true;

            console.log("game_pg")
            const developerInput = document.getElementById('developer');
            const descriptionInput = document.getElementById('game_description');
            const gameNameInput = document.getElementById('game_name');
            
            
            const developer = developerInput.value;
            const game_description = descriptionInput.value;
            const game_name = gameNameInput.value;
            const screensaverFile = document.getElementById('screensaver').files[0];
            
            const basedAutor = developerInput.dataset.basedAutor;
            const basedDescription = descriptionInput.dataset.basedDescription;
            const gameDataElement = document.getElementById('gameData');
            const game_id = gameDataElement?.dataset?.gameId || null;
            const Basedgame_name = gameNameInput.dataset.basedName;

            if (basedAutor != developer)//добавление новой игры или смена разработчика у существующей
            {

                response = await checkDeveloperExists(developer, "developer_search");
                
                if (response.autor_name.length === 0) {
                    subMessage.textContent = "Автор не найден, сохранение игры не выполнено";
                    return;
                }

                //если разработчик существует, то добавление информации
                if (!screensaverFile && !basedAutor)//создание новой игры, нет картинки
                {
                    subMessage.textContent = "Загрузите картинку, сохранение игры не выполнено";
                    return;
                }

                if(game_id)//изменение существующей игры
                {
                    console.log('update_author');
                    formData.append('query', 'update_game');
                    formData.append('game_id', game_id);
                    formData.append('developer_name', developer);
                    console.log('dev', developer);
                    if(screensaverFile)
                    {
                        formData.append('screensaver', screensaverFile);
                    }
                    if(game_description != basedDescription)
                    {
                        formData.append('game_description', game_description);
                    }
                    if(game_name != Basedgame_name)
                    {

                        response_game = await checkDeveloperExists(game_name, "game_search");

                        if (response_game.game_name && response_game.game_name.toString().trim() !== '') {
                            subMessage.textContent = "Игра уже существует, сохранение не выполнено";
                            return;
                        }

                        formData.append('game_name', game_name);
                    }
                }
                else//создание новой игры
                {
                    if(!screensaverFile || !developer || !game_description || !game_name)
                    {
                        subMessage.textContent = "Для создания игры необходимо заполнить все поля, сохранение игры не выполнено";
                        return;
                    }

                    response_game = await checkDeveloperExists(game_name, "game_search");
                    console.log(response_game);

                    if (response_game.game_name && response_game.game_name.toString().trim() !== '') {
                        subMessage.textContent = "Игра уже существует, сохранение не выполнено";
                        return;
                    }

                    bGame_update = false;

                    console.log('add_game');
                    formData.append('query', 'add_game');
                    formData.append('screensaver', screensaverFile);
                    formData.append('developer_name', developer);
                    formData.append('game_description', game_description);
                    formData.append('game_name', game_name);

                }
            }
            else//уже созданная игра
            {

                if(!screensaverFile && (basedDescription === game_description) && (basedAutor === developer) && (Basedgame_name === game_name) && JSON.stringify(window.selectedGenres) === JSON.stringify(window.based_selectedGenres) && 
                    JSON.stringify(window.selectedCategories) === JSON.stringify(window.based_selectedCategories))
                {
                    subMessage.textContent = "Поля не изменены, сохранение игры не выполнено";
                    return;
                }

                console.log('update_no_author');
                formData.append('query', 'update_game');
                formData.append('game_id', game_id);
                if (developer != basedAutor)
                {
                    formData.append('developer_name', developer);
                }
                if(screensaverFile)
                {
                    formData.append('screensaver', screensaverFile);
                }
                if(game_description != basedDescription)
                {
                    formData.append('game_description', game_description);
                }
                if(game_name != Basedgame_name)
                {
                    response_game = await checkDeveloperExists(game_name, "game_search");

                    if (response_game.game_name && response_game.game_name.toString().trim() !== '') {
                        subMessage.textContent = "Игра уже существует, сохранение не выполнено";
                        return;
                    }

                    formData.append('game_name', game_name);
                }
            }






            //функция добавление жанров категорий(добавление новой игры)
            const getIdsFromNames = (names, allItems, nameField = 'name', idField = 'id') => {
                return names.map(name => {
                    const foundItem = allItems.find(item => item[nameField] === name);
                    return foundItem ? foundItem[idField] : null;
                }).filter(id => id !== null).join(',');
                };


            // Данные с сервера
            const dataContainer = document.getElementById('data-container');
            const allGenres = JSON.parse(dataContainer.dataset.genres);
            const allCategories = JSON.parse(dataContainer.dataset.categories);

            
            // Получение выбранных значений из скрытых полей
            const selectedGenres = getSelectedValues('#genre_chose');
            const selectedCategories = getSelectedValues('#category_chose');

            if (selectedGenres.length === 0 || selectedCategories.length === 0){
                subMessage.textContent = "Заполните жанры и категории, сохранение игры не выполнено";
                return;
            }

            if (basedAutor != developer && !game_id)//добавление новой игры
            {
                const categoryIds = getIdsFromNames(selectedCategories, allCategories, 'category_name', 'category_id');
                const genreIds = getIdsFromNames(selectedGenres, allGenres, 'genre_name', 'genre_id');

                formData.append("add_genres", genreIds);
                formData.append("add_categories", categoryIds);
            }
            else//изменение существующей игры
            {
                const gameCategories = JSON.parse(dataContainer.dataset.gameCategories);
                const gameGenres = JSON.parse(dataContainer.dataset.gameGenres);
        
                // Вычисление изменений
                const genreChanges = calculateChanges(selectedGenres, gameGenres, allGenres, 'genre_name', 'gg_genre_id');
                const categoryChanges = calculateChanges(selectedCategories, gameCategories, allCategories, 'category_name', 'gc_category_id');
        
                console.log("Genres - add:", genreChanges.toAdd, "del:", genreChanges.toDelete);
                console.log("Categories - add:", categoryChanges.toAdd, "del:", categoryChanges.toDelete);
                
                formData.append("add_genres", genreChanges.toAdd);
                formData.append("del_genres", genreChanges.toDelete);
                formData.append("add_categories", categoryChanges.toAdd);
                formData.append("del_categories", categoryChanges.toDelete);

                console.log(formData.get("del_categories"));
            }
    

    
            //получение массива выбранных элементов
            function getSelectedValues(selector) {
                const hiddenValue = $(selector).val();
                return hiddenValue 
                    ? hiddenValue.split(',').map(item => item.trim()).filter(item => item !== '')
                    : [];
            }
        
            //массив элементов для удаления и добавления
            function calculateChanges(selectedItems, currentItems, allItems, nameKey, idKey) {
                const selectedSet = new Set(selectedItems);
                const currentSet = new Set(currentItems.map(item => item[nameKey]));
                const allItemsMap = new Map(allItems.map(item => [item[nameKey], item[`${nameKey.split('_')[0]}_id`]]));
        
                const toAdd = [];
                const toDelete = [];
        
                // Поиск элементов для добавления
                for (const itemName of selectedItems) {
                    if (!currentSet.has(itemName)) {
                        const itemId = allItemsMap.get(itemName);
                        if (itemId) toAdd.push(itemId);
                    }
                }
        
                // Поиск элементов для удаления
                for (const item of currentItems) {
                    if (!selectedSet.has(item[nameKey])) {
                        toDelete.push(item[idKey]);
                    }
                }
        
                return { toAdd, toDelete };
            }
        

        }



        $.ajax({
            url: 'uploader.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(response) {
                if (response.status === true) {
                    subMessage.textContent = "Сохрнение выполнено успешно";
                    //alert('Данные успешно сохранены!');
                } else {
                    //alert('Ошибка: ' + (response.error || response.message));
                    subMessage.textContent = "Ошибка сервера, сохранение не выполнено";
                }
            },
            error: function(xhr, status, error) {
                subMessage.textContent = "Ошибка сервера, сохранение не выполнено";
                //alert('Произошла ошибка при отправке данных');
            }
        });
        

    });

    $('#deleteForm').on('submit', function(e) {

        e.preventDefault();

        const isDeveloperPage = document.getElementById('developer_name');
        const formData = new FormData();

        if (isDeveloperPage)//удаление разработчика
        {
            const developerInput = document.getElementById('developer_name');
            const basedAuthor = developerInput.dataset.basedAutor;    

            formData.append("developer_name", basedAuthor);
            formData.append("query", "delete_developer");
            
        }
        else//удаление игры
        {

            console.log("del_game");
            // const gameNameInput = document.getElementById('game_name');
            // const Basedgame_name = gameNameInput.dataset.basedName;


            const gameDataElement = document.getElementById('gameData');
            const game_id = gameDataElement?.dataset?.gameId || null;

            formData.append("game_id", game_id);
            formData.append("query", "delete_game");

        }

        $.ajax({
            url: 'uploader.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(response) {
                if (response.status === true) {
                    window.location.href = "/admin_page.php";
                    alert('Данные сохранены');
                } else {
                    alert("Ошибка сервера, сохранение не выполнено");
                }
            },
            error: function(xhr, status, error) {
                alert("Ошибка сервера, сохранение не выполнено");
            }
        });

    });
});