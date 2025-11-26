document.addEventListener('DOMContentLoaded', function() {
    if ('VKIDSDK' in window) {
        const VKID = window.VKIDSDK;
        const authMessage = document.getElementById('auth_message');

        // Инициализация конфигурации
        VKID.Config.init({
            app: 54355269,
            redirectUrl: 'https://game-catalog-ddgp.onrender.com/admin_page.php',
            responseMode: VKID.ConfigResponseMode.Callback,
            source: VKID.ConfigSource.LOWCODE,
            scope: 'email',
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
            console.log('Авторизация успешна:', data);

            

            if (data.user && data.user.email) {
                const userEmail = data.user.email;
                
                // Отправляем email на сервер для создания сессии
                fetch('vk_auth.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: userEmail })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        // Сессия создана, перенаправляем
                        window.location.href = result.redirect;
                    } else {
                        authMessage.textContent = result.message;
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    authMessage.textContent = 'Ошибка авторизации';
                });
            } else {
                authMessage.textContent = "Ошибка получения email из VK";
            }


           
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