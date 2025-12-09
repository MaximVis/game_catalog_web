// скрипт для предпросмотра на странице игры
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('screensaver');
    const gameNameInput = document.getElementById('game_name');
    const developerInput = document.getElementById('developer');
    const gameDescriptionInput = document.getElementById('game_description');
    const cancelBtn = document.getElementById('cancelUpload');
    
    // элементы предпросмотра карточек
    const previewImages = document.querySelectorAll('.img_game_main_max, .img_game_main_min');
    const previewTitles = document.querySelectorAll('.game_text_main');
    const previewGenresMax = document.getElementById('previewGenres');
    const previewGenresMin = document.getElementById('previewGenresMin');
    const selectedGenresContainer = document.getElementById('selectedGenres');
    
    // элементы предпросмотра страницы игры
    const previewGameName = document.getElementById('previewGameName');
    const previewDeveloper = document.getElementById('previewDeveloper');
    const previewGameImage = document.getElementById('previewGameImage');
    const previewGameDescription = document.getElementById('previewGameDescription');
    
    // сохранение исходного изображения для возможности отката
    previewImages.forEach(img => {
        img.setAttribute('data-original-src', img.src);
    });
    if (previewGameImage) {
        previewGameImage.setAttribute('data-original-src', previewGameImage.src);
    }
    
    // обновление картинки в превью при загрузке файла
    function previewImage(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // обновление превью изображений (карточки и страница)
                previewImages.forEach(img => {
                    img.src = e.target.result;
                });
                if (previewGameImage) {
                    previewGameImage.src = e.target.result;
                }
                
                // кнопка отмены
                if (cancelBtn) {
                    cancelBtn.style.display = 'inline-block';
                }
            }
            
            reader.readAsDataURL(input.files[0]);
        } else {
            // если файл не выбран (загрузчик закрыт без выбора)
            cancelImageUpload();
        }
    }
    
    // отмена загрузки картинки
    function cancelImageUpload() {
        const fileInput = document.getElementById('screensaver');
        const cancelBtn = document.getElementById('cancelUpload');
        const defaultImage = 'game_imgs/0.png';
        
        // сброс поля файла
        if (fileInput) {
            fileInput.value = '';
        }
        
        // исходные изображения для всех превью
        previewImages.forEach(img => {
            const originalImage = img.getAttribute('data-original-src') || defaultImage;
            img.src = originalImage;
        });
        
        if (previewGameImage) {
            const originalImage = previewGameImage.getAttribute('data-original-src') || defaultImage;
            previewGameImage.src = originalImage;
        }
        
        if (cancelBtn) {
            cancelBtn.style.display = 'none';
        }
    }
    
    // обновление названия в превью при вводе
    function updatePreviewTitle() {
        const previewTitles = document.querySelectorAll('.game_text_main');
        const gameName = gameNameInput.value || 'Название игры';
        
        // обновляем превью в карточках
        previewTitles.forEach(titleElement => {
            const titleText = titleElement.childNodes[0];
            if (titleText && titleText.nodeType === Node.TEXT_NODE) {
                titleText.textContent = gameName;
            } else {
                const existingText = titleElement.textContent.split('\n')[0];
                titleElement.innerHTML = gameName + titleElement.innerHTML.substring(existingText.length);
            }
        });
        
        // обновляем превью на странице игры
        if (previewGameName) {
            previewGameName.textContent = gameName;
        }
    }
    
    // обновление разработчика в превью
    function updatePreviewDeveloper() {
        const developer = developerInput.value || 'Имя разработчика';
        if (previewDeveloper) {
            previewDeveloper.textContent = developer;
        }
    }
    
    // обновление описания в превью
    function updatePreviewDescription() {
        const description = gameDescriptionInput.value || 'Описание игры';
        if (previewGameDescription) {
            previewGameDescription.innerHTML = description.replace(/\n/g, '<br>');
        }
    }
    
    // обновление жанров в превью
    function updatePreviewGenres() {
        const genreTags = selectedGenresContainer.querySelectorAll('.genre_tag');
        const genreNames = Array.from(genreTags).map(tag => {
            const clone = tag.cloneNode(true);
            const removeBtn = clone.querySelector('.remove_genre');
            if (removeBtn) {
                removeBtn.remove();
            }
            return clone.textContent.trim();
        });
        
        const genresText = genreNames.length > 0 ? genreNames.join(', ') : 'Жанры игры';
        
        if (previewGenresMax) {
            previewGenresMax.textContent = genresText;
        }
        if (previewGenresMin) {
            previewGenresMin.textContent = genresText;
        }
    }
    
    // инициализация обработчиков событий
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            previewImage(this);
        });
        
        fileInput.addEventListener('click', function() {
            previewImages.forEach(img => {
                if (!img.getAttribute('data-original-src')) {
                    img.setAttribute('data-original-src', img.src);
                }
            });
            if (previewGameImage && !previewGameImage.getAttribute('data-original-src')) {
                previewGameImage.setAttribute('data-original-src', previewGameImage.src);
            }
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelImageUpload);
    }
    
    if (gameNameInput) {
        gameNameInput.addEventListener('input', updatePreviewTitle);
    }
    
    if (developerInput) {
        developerInput.addEventListener('input', updatePreviewDeveloper);
    }
    
    if (gameDescriptionInput) {
        gameDescriptionInput.addEventListener('input', updatePreviewDescription);
    }
    
    // обновление жанров при изменении выбранных жанров
    if (selectedGenresContainer) {
        const observer = new MutationObserver(updatePreviewGenres);
        observer.observe(selectedGenresContainer, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    
    updatePreviewTitle();
    updatePreviewDeveloper();
    updatePreviewDescription();
    updatePreviewGenres();
});