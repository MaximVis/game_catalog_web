$(document).ready(function() {
    // let selectedGenres = [];
    // let selectedCategories = [];

    window.selectedGenres = [];
    window.selectedCategories = [];

    window.based_selectedGenres = [];
    window.based_selectedCategories = [];
    
    // Инициализация массива выбранных жанров из уже существующих
    $('#selectedGenres .genre_tag').each(function() {
        const $tag = $(this);
        const genre = $tag.data('value'); // Получаем значение из data-атрибута
        
        if (genre && !selectedGenres.includes(genre)) {
            selectedGenres.push(genre);
            window.based_selectedGenres.push(genre)
        }
    });
    updateGenreHiddenField();

    // Инициализация массива выбранных категорий из уже существующих
    $('#selectedCategories .category_tag').each(function() {
        const $tag = $(this);
        const category = $tag.data('value'); // Получаем значение из data-атрибута
        
        if (category && !selectedCategories.includes(category)) {
            selectedCategories.push(category);
            window.based_selectedCategories.push(category);
        }
    });
    updateCategoryHiddenField();

    // Обработка выбора жанра из datalist
    $('#game_genre').on('input', function() {
        const input = $(this);
        const value = input.val().trim();
        
        // Проверяем, есть ли выбранное значение в datalist
        const options = $('#genreList option');
        let isValid = false;
        
        options.each(function() {
            if ($(this).val() === value) {
                isValid = true;
                return false; // break the loop
            }
        });
        
        if (isValid && value !== '' && !selectedGenres.includes(value)) {
            // Добавляем жанр в массив
            selectedGenres.push(value);
            
            // Добавляем визуальный тег
            addGenreTag(value);
            
            // Очищаем поле ввода
            input.val('');
            
            // Обновляем скрытое поле
            updateGenreHiddenField();
        }
    });

    // Обработка выбора категории из datalist
    $('#game_category').on('input', function() {
        const input = $(this);
        const value = input.val().trim();
        
        // Проверяем, есть ли выбранное значение в datalist
        const options = $('#categoryList option');
        let isValid = false;
        
        options.each(function() {
            if ($(this).val() === value) {
                isValid = true;
                return false; // break the loop
            }
        });
        
        if (isValid && value !== '' && !selectedCategories.includes(value)) {
            // Добавляем категорию в массив
            selectedCategories.push(value);
            
            // Добавляем визуальный тег
            addCategoryTag(value);
            
            // Очищаем поле ввода
            input.val('');
            
            // Обновляем скрытое поле
            updateCategoryHiddenField();
        }
    });

    // Обработка клика по кнопке удаления жанра
    $(document).on('click', '.remove_genre', function() {
        const $tag = $(this).parent();
        const genre = $tag.data('value');
        
        // Удаляем из массива
        selectedGenres = selectedGenres.filter(g => g !== genre);

        // Удаляем визуальный тег
        $tag.remove();
        
        // Обновляем скрытое поле
        updateGenreHiddenField();
    });

    // Обработка клика по кнопке удаления категории
    $(document).on('click', '.remove_category', function() {
        const $tag = $(this).parent();
        const category = $tag.data('value');
        
        // Удаляем из массива
        selectedCategories = selectedCategories.filter(c => c !== category);

        // Удаляем визуальный тег
        $tag.remove();
        
        // Обновляем скрытое поле
        updateCategoryHiddenField();
    });

    // Функция для добавления визуального тега жанра
    function addGenreTag(genre) {
        const tag = $('<span class="genre_tag" data-value="' + genre + '">' 
            + genre 
            + '<button type="button" class="remove_genre">X</button></span>');
        
        $('#selectedGenres').append(tag);
    }

    // Функция для добавления визуального тега категории
    function addCategoryTag(category) {
        const tag = $('<span class="category_tag" data-value="' + category + '">' 
            + category 
            + '<button type="button" class="remove_category">X</button></span>');
        
        $('#selectedCategories').append(tag);
    }

    // Функция для обновления скрытого поля жанров
    function updateGenreHiddenField() {
        $('#genre_chose').val(selectedGenres.join(', '));
    }

    // Функция для обновления скрытого поля категорий
    function updateCategoryHiddenField() {
        $('#category_chose').val(selectedCategories.join(', '));
    }
});




