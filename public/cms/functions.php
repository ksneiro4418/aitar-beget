<?php
/**
 * Ядро админки «Айтар»: сессия, авторизация, чтение/запись контента, загрузка картинок.
 * Работает прямо на Beget (PHP) — без GitHub и без VPN.
 */

if (session_status() === PHP_SESSION_NONE) {
  if (PHP_VERSION_ID >= 70300) {
    session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax']);
  }
  session_start();
}

// --- Пути ---------------------------------------------------------------
define('CMS_DIR', __DIR__);
// Данные админки (хэш пароля). Внутри cms/_data, но закрыто .htaccess (Deny) и хранится как .php.
define('DATA_DIR', __DIR__ . '/_data');
define('CONTENT_DIR', __DIR__ . '/../content');   // public_html/content на Beget
define('UPLOADS_DIR', __DIR__ . '/../uploads');   // public_html/uploads на Beget
define('UPLOADS_URL', '/uploads');                // URL-путь для картинок на сайте

function cms_schema(): array {
  return require __DIR__ . '/schema.php';
}

// --- Авторизация --------------------------------------------------------
function auth_file(): string { return DATA_DIR . '/auth.php'; }

/** Настроен ли пароль (был ли первый запуск). */
function cms_is_setup(): bool { return is_file(auth_file()); }

/** Сохранить новый пароль (хэш). */
function cms_set_password(string $pw): bool {
  if (!is_dir(DATA_DIR)) { @mkdir(DATA_DIR, 0700, true); }
  $hash = password_hash($pw, PASSWORD_DEFAULT);
  $php  = "<?php return " . var_export(['hash' => $hash], true) . ";\n";
  return (bool) @file_put_contents(auth_file(), $php, LOCK_EX);
}

/** Проверить пароль. */
function cms_verify_password(string $pw): bool {
  if (!cms_is_setup()) return false;
  $data = require auth_file();
  return isset($data['hash']) && password_verify($pw, $data['hash']);
}

function cms_is_authed(): bool { return !empty($_SESSION['cms_authed']); }
function cms_login(): void { $_SESSION['cms_authed'] = true; session_regenerate_id(true); }
function cms_logout(): void { $_SESSION = []; session_destroy(); }

/** Прервать выполнение, если не авторизован (для API). */
function cms_require_auth(): void {
  if (!cms_is_authed()) { json_response(['ok' => false, 'error' => 'Не авторизован'], 401); }
}

// --- CSRF ---------------------------------------------------------------
function cms_csrf_token(): string {
  if (empty($_SESSION['csrf'])) { $_SESSION['csrf'] = bin2hex(random_bytes(16)); }
  return $_SESSION['csrf'];
}
function cms_check_csrf(?string $t): bool {
  return !empty($_SESSION['csrf']) && is_string($t) && hash_equals($_SESSION['csrf'], $t);
}

// --- Контент (чтение/запись JSON) --------------------------------------
/** Имя файла коллекции из схемы (защита от подмены пути). */
function content_path(string $collection): ?string {
  $schema = cms_schema();
  if (!isset($schema[$collection]['file'])) return null;
  $file = basename($schema[$collection]['file']); // только имя файла, без traversal
  return CONTENT_DIR . '/' . $file;
}

function load_content(string $collection) {
  $path = content_path($collection);
  if (!$path || !is_file($path)) return null;
  $raw = file_get_contents($path);
  return json_decode($raw, true);
}

/** Записать контент. $data — массив (из JSON фронтенда). Возвращает true/false. */
function save_content(string $collection, $data): bool {
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
function handle_upload(array $file): array {
  if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
    return ['ok' => false, 'error' => 'Ошибка загрузки файла'];
  }
  if ($file['size'] > 8 * 1024 * 1024) {
    return ['ok' => false, 'error' => 'Файл больше 8 МБ'];
  }
  $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
  $finfo = finfo_open(FILEINFO_MIME_TYPE);
  $mime  = finfo_file($finfo, $file['tmp_name']);
  finfo_close($finfo);
  if (!isset($allowed[$mime])) {
    return ['ok' => false, 'error' => 'Только изображения (jpg, png, webp, gif)'];
  }
  if (!is_dir(UPLOADS_DIR)) { @mkdir(UPLOADS_DIR, 0755, true); }
  // Безопасное имя: транслит исходного + уникальный суффикс
  $base = pathinfo($file['name'], PATHINFO_FILENAME);
  $base = preg_replace('/[^A-Za-z0-9_-]+/', '-', $base);
  $base = trim($base, '-');
  if ($base === '') $base = 'image';
  $name = $base . '-' . substr(bin2hex(random_bytes(4)), 0, 8) . '.' . $allowed[$mime];
  $dest = UPLOADS_DIR . '/' . $name;
  if (!move_uploaded_file($file['tmp_name'], $dest)) {
    return ['ok' => false, 'error' => 'Не удалось сохранить файл'];
  }
  return ['ok' => true, 'path' => UPLOADS_URL . '/' . $name];
}

// --- Утилиты ------------------------------------------------------------
function json_response($data, int $code = 200): void {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

function e(?string $s): string { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
