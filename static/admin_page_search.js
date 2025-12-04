document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search_game');
    
    searchInput.addEventListener('input', function(event) {
        console.log('привет');
    });
    
    // Предотвращаем отправку формы при нажатии Enter
    const form = document.getElementById('admin_form_game');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
    });
});