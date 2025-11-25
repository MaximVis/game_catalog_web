$(document).ready(function(){

    $('#auth_form').on('submit', function(e) {

        e.preventDefault();

        const login = document.getElementById('admin_name').value;
        const password = document.getElementById('admin_password').value;

        $.post("auth.php", {login:login, password:password}, function(data) {
            var response = JSON.parse(data);
            if(response['success'] == true){
                window.location.href = "admin_page.php";
            }
            else{//messege box
                const authMessage = document.getElementById('auth_message');
                authMessage.textContent = response['message'];
            }
        });

    });
    
});