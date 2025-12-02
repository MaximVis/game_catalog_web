// Функция для переключения табов
function switchTab(tabId) {
    console.log('Переключение на таб:', tabId);
    
    // Скрыть все табы
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        console.log('Скрыт таб:', tab.id);
    });
    
    // Удалить активный класс у всех кнопок
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Показать выбранный таб
    const selectedTab = document.getElementById(`${tabId}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
        console.log('Показан таб:', selectedTab.id);
    } else {
        console.error('Таб не найден:', `${tabId}-tab`);
    }
    
    // Активировать соответствующую кнопку
    const selectedButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    // Сохранить выбранный таб в localStorage для сохранения состояния
    localStorage.setItem('adminActiveTab', tabId);
}

// Инициализация табов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация табов...');
    
    // Проверим, есть ли элементы на странице
    const tabButtons = document.querySelectorAll('.tab-button');
    console.log('Найдено кнопок табов:', tabButtons.length);
    
    const tabContents = document.querySelectorAll('.tab-content');
    console.log('Найдено содержимого табов:', tabContents.length);
    
    // Назначить обработчики на кнопки табов
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            console.log('Клик по табу:', tabId);
            switchTab(tabId);
        });
    });
    
    // Восстановить активный таб из localStorage или установить первый
    const savedTab = localStorage.getItem('adminActiveTab');
    if (savedTab && document.getElementById(`${savedTab}-tab`)) {
        console.log('Восстановление сохраненного таба:', savedTab);
        switchTab(savedTab);
    } else {
        // Активировать первый таб по умолчанию
        const firstTabButton = document.querySelector('.tab-button');
        if (firstTabButton) {
            const firstTabId = firstTabButton.getAttribute('data-tab');
            console.log('Активация первого таба по умолчанию:', firstTabId);
            switchTab(firstTabId);
        } else {
            console.error('Не найдены кнопки табов!');
        }
    }
});