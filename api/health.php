<?php

declare(strict_types=1);

require_once __DIR__ . '/storage.php';

require_method('GET');

json_response([
    'ok' => true,
    'service' => 'Robotic API fintech backend',
    'domain' => $_SERVER['HTTP_HOST'] ?? 'localhost',
    'storageWritable' => is_writable(robotic_api_storage_dir()),
    'time' => gmdate('c'),
]);
