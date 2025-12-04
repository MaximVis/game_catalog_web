document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('admin_search_game');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(event) {
            console.log('привет');
        });
        
        // Предотвращаем отправку формы при нажатии Enter
        const form = document.getElementById('admin_form_game');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
        });
    } else {
        console.log('Поле поиска не найдено');
    }
});