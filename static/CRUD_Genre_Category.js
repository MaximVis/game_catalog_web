async function checkItemExists(item_name, query_param) {
    try {
        const checkItem = await $.post("pagination.php", {
            array_params: [item_name], 
            query: query_param
        });
        
        const data = typeof checkItem === 'string' ? JSON.parse(checkItem) : checkItem;
        
        return data && 
               data.gen_cat_name && 
               data.gen_cat_name.genre_name || data.gen_cat_name.category_name;
        
    } catch (error) {
        console.error("Error checking item:", error);
        return false;
    }
}

function handleFormSubmit(itemType, basedInputId, newInputId, messageElement) {
    return async function(event) {
        event.preventDefault();
        
        const submitter = event.submitter || document.activeElement;
        const basedName = document.getElementById(basedInputId).value;

        if (basedName.trim() === '') {
            if (itemType === "genre")
            {
                messageElement.textContent = "Введите название жанра, изменения не сохранены";
            }
            else
            {
                messageElement.textContent = "Введите название категории, изменения не сохранены";
            }
            return;
        }

        const queryExists = `${itemType}_exists`;
        const queryParam = itemType === 'genre' ? 'genre_exists' : 'category_exists';

        if (submitter.id === `update_${itemType}` || submitter.id === `delete_${itemType}`) {
            if(!await checkItemExists(basedName, queryParam)) {
                if (itemType === "genre")
                {
                    messageElement.textContent = "Введенный жанр не найден/не корректен, изменения не сохранены";
                }
                else
                {
                    messageElement.textContent = "Введенная категория не найдена/не корректена, изменения не сохранены";
                }
                return;
            }
        } else {
            if(await checkItemExists(basedName, queryParam)) {
                if (itemType === "genre")
                {
                    messageElement.textContent = "Введенный жанр уже существует, изменения не сохранены";
                }
                else
                {
                    messageElement.textContent = "Введенная категория уже существует, изменения не сохранены";
                }
               
                return;
            }
        }

        const formData = new FormData();

        switch(submitter.id) {
            case `create_${itemType}`:
                formData.append('query', `create_${itemType}`);        
                formData.append('based_input', basedName); 
                break;
            case `delete_${itemType}`:
                formData.append('query', `delete_${itemType}`);        
                formData.append('based_input', basedName); 
                break;
            case `update_${itemType}`:
                const newName = document.getElementById(newInputId).value;

                if (newName.trim() === '') {
                    if (itemType === "genre")
                    {
                        messageElement.textContent = "Введите новое название жанра, изменения не сохранены";
                    }
                    else
                    {
                        messageElement.textContent = "Введите новое название категории, изменения не сохранены";
                    }
                    //messageElement.textContent = `Введите новое название ${itemType}, изменения не сохранены`;
                    return;
                }

                if(await checkItemExists(newName, queryParam)) {
                    if (itemType === "genre")
                    {
                        messageElement.textContent = "Введенный жанр уже существует, изменения не сохранены";
                    }
                    else
                    {
                        messageElement.textContent = "Введенная категория уже существует, изменения не сохранены";
                    }
                    return;
                }

                formData.append('query', `update_${itemType}`);        
                formData.append('based_input', basedName); 
                formData.append('new_input', newName); 

                break;
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
                    messageElement.textContent = 'Данные сохранены';
                } else {
                    messageElement.textContent = "Ошибка сервера, сохранение не выполнено";
                }
            },
            error: function(xhr, status, error) {
                messageElement.textContent = "Ошибка сервера, сохранение не выполнено";
            }
        });
    };
}

document.getElementById('form_change_genre').addEventListener('submit', 
    handleFormSubmit('genre', 'based_name_genre', 'new_name_genre', genre_message));

document.getElementById('form_change_category').addEventListener('submit', 
    handleFormSubmit('category', 'based_name_category', 'new_name_category', category_message));


