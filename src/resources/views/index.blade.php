<!doctype html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
    <title>Go bananas!</title>
    <link rel="stylesheet" type="text/css" href="/dist/css/bananas.css"/>
    <style>
        body {
            background-image: url('//cdn.joejiko.com/img/go-bananas/bg-banana-tile2r.png');
        }

        .bg-bad-banana {
            background-image: url('https://storage.googleapis.com/cdn.joejiko.com/img/go-bananas/bad-banana.png');
        }
    </style>
</head>
<body class="<?php if ($agent->isMobile()) {
  echo "mobile";
} ?>">
<div class="game-start" data-role="bananas.start">
    <div class="banana-trigger">
        <span class="banana-go">Go</span>
        <span class="banana-bananas">Bananas!</span>
        <button class="btn-banana"><div class="bg-btn-banana bg-banana-2"></div></button>
        <div class="helper-text"></div>
        <div class="helper-text-mobile">(Tap to start)</div>
    </div>
</div>
<script src="/dist/js/app-bananas.js" async></script>
</body>
</html>
