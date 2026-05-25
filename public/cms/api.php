<?php
/**
 * AJAX-эндпоинт админки: load (получить раздел), save (сохранить), upload (картинка).
 * Все действия требуют авторизации; изменяющие — проверку CSRF.
 */
require __DIR__ . '/functions.php';

cms_require_auth();

$action = $_REQUEST['action'] ?? '';

// CSRF для изменяющих операций (токен из заголовка или поля формы)
function api_guard_csrf() {
  $t = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? ($_POST['csrf'] ?? null);
  if (!cms_check_csrf($t)) json_response(['ok' => false, 'error' => 'Недействительный CSRF-токен. Обновите страницу.'], 403);
}

switch ($action) {

  case 'load': {
    $collection = $_REQUEST['collection'] ?? '';
    $schema = cms_schema();
    if (!isset($schema[$collection])) json_response(['ok' => false, 'error' => 'Неизвестный раздел'], 404);
    $data = load_content($collection);
    if ($data === null) $data = new stdClass(); // файла нет — пустой объект
    json_response(['ok' => true, 'data' => $data]);
  }

  case 'save': {
    api_guard_csrf();
    $collection = $_POST['collection'] ?? '';
    $schema = cms_schema();
    if (!isset($schema[$collection])) json_response(['ok' => false, 'error' => 'Неизвестный раздел'], 404);
    $raw = $_POST['data'] ?? '';
    $data = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) json_response(['ok' => false, 'error' => 'Некорректные данные (JSON)'], 400);
    if (!save_content($collection, $data)) json_response(['ok' => false, 'error' => 'Не удалось записать файл (проверьте права на content/)'], 500);
    json_response(['ok' => true]);
  }

  case 'upload': {
    api_guard_csrf();
    if (empty($_FILES['file'])) json_response(['ok' => false, 'error' => 'Файл не передан'], 400);
    $res = handle_upload($_FILES['file']);
    json_response($res, $res['ok'] ? 200 : 400);
  }

  default:
    json_response(['ok' => false, 'error' => 'Неизвестное действие'], 400);
}
