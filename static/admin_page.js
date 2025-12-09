function switchTab(tabId) {
    // скрытие табов
    document.querySelectorAll('.tab_content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // удаление активного класса
    document.querySelectorAll('.tab_button').forEach(button => {
        button.classList.remove('active');
    });
    
    // показать таб
    const selectedTab = document.getElementById(`${tabId}_tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // активация кнопки
    const selectedButton = document.querySelector(`.tab_button[data_tab="${tabId}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    // сохранить выбранный таб
    localStorage.setItem('adminActiveTab', tabId);
}

// инициализация табов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll('.tab_button').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data_tab');
            switchTab(tabId);
        });
    });
    

    const savedTab = localStorage.getItem('adminActiveTab');
    if (savedTab && document.getElementById(`${savedTab}_tab`)) {
        switchTab(savedTab);
    } else {
        // активация первого таба по умолчанию
        const firstTabButton = document.querySelector('.tab_button');
        if (firstTabButton) {
            const firstTabId = firstTabButton.getAttribute('data_tab');
            switchTab(firstTabId);
        }
    }
});