document.addEventListener('DOMContentLoaded', function() {
    if ('VKIDSDK' in window) {
        const VKID = window.VKIDSDK;
        const authMessage = document.getElementById('auth_message');

        // Инициализация конфигурации
        VKID.Config.init({
            app: 54363778,
            redirectUrl: 'https://game-catalog-ddgp.onrender.com/admin_page.php',
            responseMode: VKID.ConfigResponseMode.Callback,
            source: VKID.ConfigSource.LOWCODE,
            scope: '',
        });

        // Создание экземпляра OneTap
        const oneTap = new VKID.OneTap();

        // Рендеринг кнопки в контейнер
        oneTap.render({
            container: document.getElementById('vkid-container'),
            scheme: 'dark',
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

            console.log("uuser", data.user_id);
            
            $.post("auth.php", {login:data.user_id, is_vk_auth: true}, function(resp) {
            resp = JSON.parse(resp);
            if(resp['success'] == true){
                console.log("RED<TRUE");
                window.location.href = "admin_page.php";
            }
            else{//messege box
                const authMessage = document.getElementById('auth_message');
                authMessage.textContent = resp['message'];
            }
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