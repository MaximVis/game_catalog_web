<?php
	require_once 'query_func.php';
	$slider_games = get_query_answer("slider", 0);
	$games = get_query_answer("main_page_games", 0);
	
	if(empty($slider_games) || empty($games)){
		http_response_code(500);
		require_once 'page_500.php';
		exit;
	}

	http_response_code(200);
?>


<?php
	require_once 'title_desc_keywords_func.php';

	$meta = set_meta();
?>

<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php render_meta($meta); ?>
	<link rel="stylesheet" href="static/base_styles.css">
	<link rel="stylesheet" href="static/styles_main_pg.css">
	<link rel="stylesheet" href="static/footer.css">
    <script src="static/slider.js" defer></script>
</head>

<body>

    <?php require_once 'shapka.php';?>
	<div class="container"><!-- основной контент -->
		<?php require_once 'shapka_menu.php';?>
		<h2 class = "head_word">Популярные игры</h2>
		<div class="slider-container"><!-- слайдер (5 игр) -->
		<div class="slider">
			<?php foreach ($slider_games as $game): ?>
				<div class="slide">
					<a href="game.php?game=<?= urlencode($game['game_name']) ?>" class="slide-link">
            			<img src="game_imgs/<?= $game['game_id'] ?>.png" alt="<?= htmlspecialchars($game['game_name']) ?>">
        			</a>
				</div>
			<?php endforeach; ?>
		</div>
		<button class="prev-button" ><img src="imgs/prev_but.png"></button>
		<button class="next-button"><img src="imgs/next_but.png"></button>
		</div>

		<h2 class = "head_word">Новинки</h2>
		<div class = container_main_page_content><!-- блоки игр -->	
			<?php foreach ($games as $game): ?>
				<a href = "/game.php?game=<?= urlencode($game['game_name']) ?>">
					<div class="game_rectangle">
						<?php
							$images = glob('game_imgs/' . $game['game_id'] . '.{png,jpg,jpeg,gif,webp}', GLOB_BRACE);
							
							if (!empty($images)) {
								echo '<img class="img_game_main" src="' . $images[0] . '" alt="' . htmlspecialchars($game['game_name']) . '">';
							} else {
								echo '<img class="img_game_main" src="game_imgs/0.png" alt="' . htmlspecialchars($game['game_name']) . '">';
							}
						?>
						<div class="game_text_main"> <?= htmlspecialchars($game['game_name']) ?>
							<div class="text_game_main_description"><?= htmlspecialchars($game['genres']) ?></div>
						</div>
					</div>
				</a>
			<?php endforeach; ?>
		</div>
		
	</div>
	<?php require_once 'footer.php';?>
</body>
</html>
