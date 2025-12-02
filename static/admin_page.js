// Функция для переключения табов
function switchTab(tabId) {
    // Скрыть все табы
    document.querySelectorAll('.tab_content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Удалить активный класс у всех кнопок
    document.querySelectorAll('.tab_button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Показать выбранный таб
    const selectedTab = document.getElementById(`${tabId}_tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Активировать соответствующую кнопку
    const selectedButton = document.querySelector(`.tab_button[data_tab="${tabId}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    // Сохранить выбранный таб в localStorage для сохранения состояния
    localStorage.setItem('adminActiveTab', tabId);
}

// Инициализация табов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Назначить обработчики на кнопки табов
    document.querySelectorAll('.tab_button').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data_tab');
            switchTab(tabId);
        });
    });
    
    // Восстановить активный таб из localStorage или установить первый
    const savedTab = localStorage.getItem('adminActiveTab');
    if (savedTab && document.getElementById(`${savedTab}_tab`)) {
        switchTab(savedTab);
    } else {
        // Активировать первый таб по умолчанию
        const firstTabButton = document.querySelector('.tab_button');
        if (firstTabButton) {
            const firstTabId = firstTabButton.getAttribute('data_tab');
            switchTab(firstTabId);
        }
    }
});