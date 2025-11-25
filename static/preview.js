// Обновление картинки в превью при загрузке файла
function previewImage(input) {
    const mainPreview = document.querySelector('.img_game_main');
    const cancelBtn = document.getElementById('cancelUpload');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            if (mainPreview) {
                mainPreview.src = e.target.result;
            }
            // Показываем кнопку отмены
            if (cancelBtn) {
                cancelBtn.style.display = 'inline-block';
            }
        }
        
        reader.readAsDataURL(input.files[0]);
    } else {
        // Если файл не выбран (загрузчик закрыт без выбора)
        cancelImageUpload();
    }
}

// Отмена загрузки картинки
function cancelImageUpload() {
    const fileInput = document.getElementById('screensaver');
    const mainPreview = document.querySelector('.img_game_main');
    const cancelBtn = document.getElementById('cancelUpload');
    const defaultImage = 'devs_imgs/0.png';
    
    // Сбрасываем поле файла
    if (fileInput) {
        fileInput.value = '';
    }
    
    // Возвращаем исходное изображение
    if (mainPreview) {
        const originalImage = mainPreview.getAttribute('data-original-src') || defaultImage;
        mainPreview.src = originalImage;
    }
    
    // Скрываем кнопку отмены
    if (cancelBtn) {
        cancelBtn.style.display = 'none';
    }
}

// Обновление текста в превью при вводе
function updatePreview() {
    const nameInput = document.getElementById('developer_name');
    const previewText = document.querySelector('.game_text_main');
    
    if (nameInput && previewText) {
        previewText.textContent = nameInput.value || 'Название разработчика';
    }
}

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('screensaver');
    const textInput = document.getElementById('developer_name');
    const cancelBtn = document.getElementById('cancelUpload');
    const mainPreview = document.querySelector('.img_game_main');
    
    // Сохраняем исходный src изображения для возможности отката
    if (mainPreview) {
        mainPreview.setAttribute('data-original-src', mainPreview.src);
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            previewImage(this);
        });
        
        // Обработка клика вне файлового диалога
        fileInput.addEventListener('click', function() {
            // Сохраняем текущее состояние на случай отмены
            if (mainPreview && !mainPreview.getAttribute('data-original-src')) {
                mainPreview.setAttribute('data-original-src', mainPreview.src);
            }
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelImageUpload);
    }
    
    if (textInput) {
        textInput.addEventListener('input', updatePreview);
    }
});