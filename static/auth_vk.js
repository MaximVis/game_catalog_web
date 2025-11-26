document.addEventListener('DOMContentLoaded', function() {
    if ('VKIDSDK' in window) {
        const VKID = window.VKIDSDK;

        // Инициализация конфигурации
        VKID.Config.init({
            app: 54355269,
            redirectUrl: 'https://game-catalog-ddgp.onrender.com/admin_page.php',
            responseMode: VKID.ConfigResponseMode.Callback,
            source: VKID.ConfigSource.LOWCODE,
            scope: 'mail',
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
            // Здесь можно добавить логику обработки успешной авторизации
            // Например, отправку данных на сервер или перенаправление
        }
        
        // Функция обработки ошибок
        function vkidOnError(error) {
            console.error('Ошибка авторизации:', error);
            // Здесь можно добавить логику обработки ошибок
            // Например, показ сообщения пользователю
        }
    } else {
        console.error('VKID SDK не загружен');
    }
});