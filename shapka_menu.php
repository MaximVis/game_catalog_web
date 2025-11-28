<div class = "container_main_pages">
    <nav class = "header_links"><!-- шапка (меню) -->
        <ul>
            <li><a href="main.php">Главная</a></li>
            <li><a href="/games_search.php">Игры</a></li>
            <li><a href="/categories.php">Категории</a></li>
            <li><a href="/genre.php">Жанры</a></li>
            <li><a href="/developers.php">Разработчики</a></li>
            <li><a href="/auth_page.php">Войти</a></li>
        </ul>
    </nav>
    <form class = "main_search" action="games_search.php" method="GET">
        <input class = "input_main_search" type="text" id="search_game" name="search_game" placeholder="Поиск игры">
        <button type="submit" class="submit-button">
            <img class = "search_icon_main" src="imgs/srch.png" alt="Поиск">
        </button>
    </form>
</div>
