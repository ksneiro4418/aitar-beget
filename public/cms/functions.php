<?php
/**
 * Ядро админки «Айтар»: сессия, авторизация, чтение/запись контента, загрузка картинок.
 * Совместимо с PHP 5.6+ (работает и на 7.x/8.x). Без GitHub и без VPN.
 */

if (session_status() === PHP_SESSION_NONE) {
  $cms_https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
  if (PHP_VERSION_ID >= 70300) {
    session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax', 'secure' => $cms_https]);
  }
  session_start();
}

// --- Пути ---------------------------------------------------------------
define('CMS_DIR', __DIR__);
// Данные админки (хэш пароля). Внутри cms/_data, закрыто .htaccess и хранится как .php.
define('DATA_DIR', __DIR__ . '/_data');
define('CONTENT_DIR', __DIR__ . '/../content');   // public_html/content на Beget
define('UPLOADS_DIR', __DIR__ . '/../uploads');   // public_html/uploads на Beget
define('UPLOADS_URL', '/uploads');                // URL-путь для картинок на сайте

function cms_schema() {
  return require __DIR__ . '/schema.php';
}

/** Случайная hex-строка (random_bytes есть только в PHP 7+, поэтому с фолбэком). */
function cms_random_hex($bytes) {
  if (function_exists('random_bytes')) return bin2hex(random_bytes($bytes));
  if (function_exists('openssl_random_pseudo_bytes')) return bin2hex(openssl_random_pseudo_bytes($bytes));
  $s = '';
  for ($i = 0; $i < $bytes * 2; $i++) { $s .= dechex(mt_rand(0, 15)); }
  return $s;
}

// --- Авторизация --------------------------------------------------------
function auth_file() { return DATA_DIR . '/auth.php'; }

/** Настроен ли пароль (был ли первый запуск). */
function cms_is_setup() { return is_file(auth_file()); }

/** Сохранить новый пароль (хэш). */
function cms_set_password($pw) {
  if (!is_dir(DATA_DIR)) { @mkdir(DATA_DIR, 0700, true); }
  $hash = password_hash($pw, PASSWORD_DEFAULT);
  $php  = "<?php return " . var_export(['hash' => $hash], true) . ";\n";
  return (bool) @file_put_contents(auth_file(), $php, LOCK_EX);
}

/** Проверить пароль. */
function cms_verify_password($pw) {
  if (!cms_is_setup()) return false;
  $data = require auth_file();
  return isset($data['hash']) && password_verify($pw, $data['hash']);
}

function cms_is_authed() { return !empty($_SESSION['cms_authed']); }
function cms_login() { $_SESSION['cms_authed'] = true; session_regenerate_id(true); }
function cms_logout() { $_SESSION = []; session_destroy(); }

/** Прервать выполнение, если не авторизован (для API). */
function cms_require_auth() {
  if (!cms_is_authed()) { json_response(['ok' => false, 'error' => 'Не авторизован'], 401); }
}

// --- CSRF ---------------------------------------------------------------
function cms_csrf_token() {
  if (empty($_SESSION['csrf'])) { $_SESSION['csrf'] = cms_random_hex(16); }
  return $_SESSION['csrf'];
}
function cms_check_csrf($t) {
  return !empty($_SESSION['csrf']) && is_string($t) && hash_equals($_SESSION['csrf'], $t);
}

// --- Контент (чтение/запись JSON) --------------------------------------
/** Имя файла коллекции из схемы (защита от подмены пути). */
function content_path($collection) {
  $schema = cms_schema();
  if (!isset($schema[$collection]['file'])) return null;
  $file = basename($schema[$collection]['file']); // только имя файла, без traversal
  return CONTENT_DIR . '/' . $file;
}

function load_content($collection) {
  $path = content_path($collection);
  if (!$path || !is_file($path)) return null;
  $raw = file_get_contents($path);
  return json_decode($raw, true);
}

/** Записать контент. $data — массив (из JSON фронтенда). Возвращает true/false. */
function save_content($collection, $data) {
  $path = content_path($collection);
  if (!$path) return false;
  $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
  if ($json === false) return false;
  // Атомарная запись через временный файл
  $tmp = $path . '.tmp';
  if (@file_put_contents($tmp, $json, LOCK_EX) === false) return false;
  return @rename($tmp, $path);
}

// --- Загрузка картинок --------------------------------------------------
function handle_upload($file) {
  if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
    return ['ok' => false, 'error' => 'Ошибка загрузки файла'];
  }
  if ($file['size'] > 8 * 1024 * 1024) {
    return ['ok' => false, 'error' => 'Файл больше 8 МБ'];
  }
  $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
  $mime = '';
  if (function_exists('finfo_open')) {
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime  = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
  } else {
    $info = @getimagesize($file['tmp_name']);
    if ($info && isset($info['mime'])) $mime = $info['mime'];
  }
  if (!isset($allowed[$mime])) {
    return ['ok' => false, 'error' => 'Только изображения (jpg, png, webp, gif)'];
  }
  if (!is_dir(UPLOADS_DIR)) { @mkdir(UPLOADS_DIR, 0755, true); }
  // Безопасное имя: латиница из исходного + уникальный суффикс
  $base = pathinfo($file['name'], PATHINFO_FILENAME);
  $base = preg_replace('/[^A-Za-z0-9_-]+/', '-', $base);
  $base = trim($base, '-');
  if ($base === '') $base = 'image';
  $name = $base . '-' . substr(cms_random_hex(4), 0, 8) . '.' . $allowed[$mime];
  $dest = UPLOADS_DIR . '/' . $name;
  if (!move_uploaded_file($file['tmp_name'], $dest)) {
    return ['ok' => false, 'error' => 'Не удалось сохранить файл'];
  }
  return ['ok' => true, 'path' => UPLOADS_URL . '/' . $name];
}

// --- Утилиты ------------------------------------------------------------
function json_response($data, $code = 200) {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

function e($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
