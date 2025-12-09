function previewImage(input) {
    const mainPreview = document.querySelector('.img_game_main');
    const cancelBtn = document.getElementById('cancelUpload');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            if (mainPreview) {
                mainPreview.src = e.target.result;
            }
            if (cancelBtn) {
                cancelBtn.style.display = 'inline-block';
            }
        }
        
        reader.readAsDataURL(input.files[0]);
    } else {
        cancelImageUpload();
    }
}

function cancelImageUpload() {
    const fileInput = document.getElementById('screensaver');
    const mainPreview = document.querySelector('.img_game_main');
    const cancelBtn = document.getElementById('cancelUpload');
    const defaultImage = 'devs_imgs/0.png';
    
    if (fileInput) {
        fileInput.value = '';
    }
    
    if (mainPreview) {
        const originalImage = mainPreview.getAttribute('data-original-src') || defaultImage;
        mainPreview.src = originalImage;
    }
    
    if (cancelBtn) {
        cancelBtn.style.display = 'none';
    }
}

function updatePreview() {
    const nameInput = document.getElementById('developer_name');
    const previewText = document.querySelector('.game_text_main');
    
    if (nameInput && previewText) {
        previewText.textContent = nameInput.value || 'Название разработчика';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('screensaver');
    const textInput = document.getElementById('developer_name');
    const cancelBtn = document.getElementById('cancelUpload');
    const mainPreview = document.querySelector('.img_game_main');
    
    if (mainPreview) {
        mainPreview.setAttribute('data-original-src', mainPreview.src);
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            previewImage(this);
        });
        
        fileInput.addEventListener('click', function() {
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