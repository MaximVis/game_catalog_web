<?php
	require_once 'config.php';
	require_once "query_func.php";
	$admin_search = false;
	if($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['search_game']))
	{
		$game_name = urldecode($_GET['search_game']);
		$games = get_query_answer("search_games", $game_name);
		if(isset($_GET['admin_search']))
		{
			require_once 'auth_func.php';
			
			if (!isUserLoggedIn()) {
				header('Location: auth_page.php');
				exit();
			}
			else
			{
				$admin_search = true;
			}

		}
	}
	else
	{
		if($_SERVER["REQUEST_METHOD"] == "GET")
		{
			$games = get_query_answer("main_games", 0);

			if(empty($games)){
				http_response_code(500);
				require_once 'page_500.php';
				exit;
			}
		}
		else
		{
			header("Location: main.php");
			exit();
		}
	}

	http_response_code(200);

	
	
?>


<?php
	require_once 'title_desc_keywords_func.php';

	$meta = set_meta(
		'ALLGAMES- поиск и обзор игр', 
		'Полный каталог компьютерных игр. Поиск игр по названию, жанру. Описания игр, категории, жанры',
		'игры, каталог игр, поиск игр, компьютерные игры, игровые новинки'
	);
?>

<!DOCTYPE html>
<html lang="ru">



<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php render_meta($meta); ?>
    <link rel="stylesheet" href="static/base_styles.css">
    <link rel="stylesheet" href="static/game_page_styles.css">
	<link rel="stylesheet" href="static/footer.css">
	<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
	
</head>



<body>

	<?php
		if($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['search_game']))
		{
			if($admin_search){
				echo '<script src="static/pagination.js" defer data-query="games_search_admin" data-query_param="' . htmlspecialchars($game_name, ENT_QUOTES | ENT_HTML5, 'UTF-8') . '%"></script>';
			}
			else
			{
				echo '<script src="static/pagination.js" defer data-query="games_search_post" data-query_param="' . htmlspecialchars($game_name, ENT_QUOTES | ENT_HTML5, 'UTF-8') . '%"></script>';
			}
		}
		else
		{
			if($_SERVER["REQUEST_METHOD"] == "GET")
			{
				echo '<script src="static/pagination.js" defer data-query="games_search_get"></script>';
			}
		}
	?>


	<?php require_once 'shapka.php';?>
	<div class="container"><!-- основной контент -->
		<?php require_once 'shapka_menu.php';?>
		<h1 class = "head_word">Список игр</h1>
		<?php
			if(empty($games)){
				echo '<label class = "center_word">Игры с названием <'.htmlspecialchars($game_name).'> не найдены</label>';
				exit;
			}
		?>
		<div class = container_main_page_content><!-- блоки игр -->
			<?php foreach ($games as $game): ?>
				<?php 
					$url = $admin_search 
						? '/game_admin.php?game=' 
						: '/game.php?game=';
					echo '<a href="' . $url . urlencode($game['game_name']) . '">';
				?>
					<div class="game_rectangle">
						<?php
							$images = glob('game_imgs/' . $game['game_id'] . '.{png,jpg,jpeg,gif,webp}', GLOB_BRACE);
							
							if (!empty($images)) {
								echo '<img class="img_game_main" src="' . $images[0] . '" alt="' . $game['game_name'] . '">';
							} else {
								echo '<img class="img_game_main" src="game_imgs/0.png" alt="' . $game['game_name'] . '">';
							}

							
						?>
						<div class="game_text_main"><?= htmlspecialchars($game['game_name']) ?>
							<div class="text_game_main_description"><?= $game['genres'] ?></div>
						</div>
					</div>
				</a>
			<?php endforeach; ?>
	</div>
	</div>
	<?php require_once 'footer.php';?>
</body>
</html>
