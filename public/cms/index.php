<?php
/**
 * Админка «Айтар» — точка входа.
 * Первый запуск: задать пароль. Затем: вход по паролю. Внутри — редактор контента.
 */
require __DIR__ . '/functions.php';

$error = '';

// --- Обработка форм входа/настройки -------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $action = $_POST['action'] ?? '';

  if ($action === 'logout') {
    cms_logout();
    header('Location: index.php'); exit;
  }

  if (!cms_check_csrf($_POST['csrf'] ?? null)) {
    $error = 'Сессия устарела, попробуйте ещё раз.';
  } elseif ($action === 'setpw' && !cms_is_setup()) {
    $pw = (string)($_POST['password'] ?? '');
    $pw2 = (string)($_POST['password2'] ?? '');
    if (strlen($pw) < 6) $error = 'Пароль слишком короткий (мин. 6 символов).';
    elseif ($pw !== $pw2) $error = 'Пароли не совпадают.';
    elseif (!cms_set_password($pw)) $error = 'Не удалось сохранить пароль (проблема с правами на сервере).';
    else { cms_login(); header('Location: index.php'); exit; }
  } elseif ($action === 'login') {
    if (cms_verify_password((string)($_POST['password'] ?? ''))) { cms_login(); header('Location: index.php'); exit; }
    else $error = 'Неверный пароль.';
  }
}

$csrf = cms_csrf_token();

// --- Экран: первый запуск (задать пароль) -------------------------------
if (!cms_is_setup()): ?>
<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Айтар — настройка админки</title><link rel="stylesheet" href="style.css"></head>
<body class="auth-page">
  <form class="auth-card" method="post" autocomplete="off">
    <div class="auth-logo">☀️ Айтар — админка</div>
    <p class="auth-sub">Первый запуск. Придумайте пароль для входа.</p>
    <?php if ($error): ?><div class="alert"><?=e($error)?></div><?php endif; ?>
    <input type="hidden" name="csrf" value="<?=e($csrf)?>">
    <input type="hidden" name="action" value="setpw">
    <label>Пароль</label>
    <input type="password" name="password" required minlength="6" autofocus>
    <label>Повторите пароль</label>
    <input type="password" name="password2" required minlength="6">
    <button type="submit">Сохранить и войти</button>
  </form>
</body></html>
<?php exit; endif; ?>

<?php
// --- Экран: вход --------------------------------------------------------
if (!cms_is_authed()): ?>
<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Айтар — вход в админку</title><link rel="stylesheet" href="style.css"></head>
<body class="auth-page">
  <form class="auth-card" method="post" autocomplete="off">
    <div class="auth-logo">☀️ Айтар — админка</div>
    <p class="auth-sub">Вход в панель управления сайтом</p>
    <?php if ($error): ?><div class="alert"><?=e($error)?></div><?php endif; ?>
    <input type="hidden" name="csrf" value="<?=e($csrf)?>">
    <input type="hidden" name="action" value="login">
    <label>Пароль</label>
    <input type="password" name="password" required autofocus>
    <button type="submit">Войти</button>
  </form>
</body></html>
<?php exit; endif; ?>

<?php
// --- Экран: приложение (редактор) ---------------------------------------
$schema = cms_schema();
$collections = [];
foreach ($schema as $key => $c) { $collections[] = ['key' => $key, 'label' => $c['label']]; }
?>
<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Айтар — управление сайтом</title>
<link rel="stylesheet" href="style.css">
</head>
<body class="app">
  <header class="topbar">
    <div class="brand">☀️ Айтар — управление сайтом</div>
    <div class="topbar-actions">
      <a class="btn-link" href="/" target="_blank" rel="noopener">Открыть сайт ↗</a>
      <form method="post" style="display:inline">
        <input type="hidden" name="csrf" value="<?=e($csrf)?>">
        <input type="hidden" name="action" value="logout">
        <button type="submit" class="btn-link">Выйти</button>
      </form>
    </div>
  </header>
  <div class="layout">
    <nav class="sidebar" id="sidebar"></nav>
    <main class="content" id="content">
      <div class="placeholder">← Выберите раздел слева, чтобы редактировать</div>
    </main>
  </div>

  <script>
    window.CMS = {
      api: 'api.php',
      csrf: <?=json_encode($csrf)?>,
      collections: <?=json_encode($collections, JSON_UNESCAPED_UNICODE)?>,
      schema: <?=json_encode($schema, JSON_UNESCAPED_UNICODE)?>
    };
  </script>
  <script src="app.js?v=1"></script>
</body></html>
