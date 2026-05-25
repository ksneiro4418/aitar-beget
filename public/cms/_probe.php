<?php
// ВРЕМЕННЫЙ диагностический файл — удалить после проверки.
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
header('Content-Type: text/plain; charset=utf-8');

echo 'PHP ' . PHP_VERSION . ' (' . PHP_VERSION_ID . ")\n";
echo 'session array param (>=70300): ' . (PHP_VERSION_ID >= 70300 ? 'yes' : 'NO') . "\n";
echo 'finfo: ' . (function_exists('finfo_open') ? 'yes' : 'NO') . "\n";
echo 'password_hash: ' . (function_exists('password_hash') ? 'yes' : 'NO') . "\n";
echo "--- require functions.php ---\n";
require __DIR__ . '/functions.php';
echo "functions.php OK\n";
echo 'schema: ' . count(cms_schema()) . " collections\n";
echo 'is_setup: ' . (cms_is_setup() ? 'yes' : 'no') . "\n";
echo 'DATA_DIR=' . DATA_DIR . "\n";
echo 'DATA_DIR parent writable: ' . (is_writable(dirname(DATA_DIR)) ? 'yes' : 'NO') . "\n";
echo 'CONTENT_DIR exists: ' . (is_dir(CONTENT_DIR) ? 'yes' : 'no') . ' writable: ' . (is_writable(CONTENT_DIR) ? 'yes' : 'NO') . "\n";
echo "ALL OK\n";
