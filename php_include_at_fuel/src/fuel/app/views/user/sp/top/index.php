<?php
	$webroot = $_SERVER['DOCUMENT_ROOT'] . '/fuel/app/views/user/sp/';
	$criticalCSS = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/public/assets/css/user/sp/common/critical.css');

?>

<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<title>Document</title>
	<meta name="description" content="">
	<meta name="format-detection" content="telephone=no">

	<style>
		<?= $criticalCSS; ?>
	</style>
	<link rel="stylesheet" href="../../../../../../public/assets/css/user/sp/top/index.css">
</head>
<body>
	<?php include($webroot.'common/header.php'); ?>
	<main class="l-mainContainer">












	</main>
	<?php include($webroot.'common/footer.php'); ?>


	<script defer src="../../../../../../public/assets/js/common/jquery-3.4.1.min.js"></script>
</body>
</html>