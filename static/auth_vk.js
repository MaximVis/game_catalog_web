document.addEventListener('DOMContentLoaded', function() {
    if ('VKIDSDK' in window) {
        const VKID = window.VKIDSDK;
        const authMessage = document.getElementById('auth_message');

        // Инициализация конфигурации
        VKID.Config.init({
            app: 54358629,
            redirectUrl: 'https://game-catalog-ddgp.onrender.com/admin_page.php',
            responseMode: VKID.ConfigResponseMode.Callback,
            source: VKID.ConfigSource.LOWCODE,
            scope: 'email, first_name,last_name',
        });

        // Создание экземпляра OneTap
        const oneTap = new VKID.OneTap();

        // Рендеринг кнопки в контейнер
        oneTap.render({
            container: document.getElementById('vkid-container'),
            showAlternativeLogin: true
        })
        .on(VKID.WidgetEvents.ERROR, vkidOnError)
        .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, function (payload) {
            const code = payload.code;
            const deviceId = payload.device_id;

            VKID.Auth.exchangeCode(code, deviceId)
            .then(vkidOnSuccess)
            .catch(vkidOnError);
        });
        
        // Функция обработки успешной авторизации
       function vkidOnSuccess(data) {
            // Отправляем данные на сервер для создания сессии
            fetch('vk_auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token: data.access_token,
                    user_id: data.user_id,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name
                })
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    window.location.href = 'admin_page.php';
                } else {
                    authMessage.textContent = result.message || "Ошибка авторизации";
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                authMessage.textContent = "Ошибка соединения с сервером";
            });
        }
        
        // Функция обработки ошибок
        function vkidOnError(error) {
            console.error('Ошибка авторизации:', error);
            authMessage.textContent = "Ошибка авторизации";
        }
    } else {
        console.error('VKID SDK не загружен');
    }
});