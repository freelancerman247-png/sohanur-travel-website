<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

function require_method(string $method): void
{
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        json_response([
            'ok' => false,
            'error' => 'Method not allowed',
        ], 405);
    }
}

function request_payload(): array
{
    $raw = file_get_contents('php://input');

    if ($raw !== false && trim($raw) !== '') {
        $decoded = json_decode($raw, true);

        if (!is_array($decoded)) {
            json_response([
                'ok' => false,
                'error' => 'Invalid JSON body',
            ], 400);
        }

        return $decoded;
    }

    return $_POST;
}

function sanitize_text(mixed $value, int $maxLength = 160): string
{
    $text = trim((string) $value);
    $text = preg_replace('/\s+/', ' ', $text) ?? '';

    return substr(strip_tags($text), 0, $maxLength);
}

function validate_email(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function read_json_file(string $name, array $default = []): array
{
    $path = robotic_api_storage_dir() . DIRECTORY_SEPARATOR . $name;

    if (!file_exists($path)) {
        return $default;
    }

    $content = file_get_contents($path);
    if ($content === false || trim($content) === '') {
        return $default;
    }

    $decoded = json_decode($content, true);

    return is_array($decoded) ? $decoded : $default;
}

function write_json_file(string $name, array $data): void
{
    $dir = robotic_api_storage_dir();
    $path = $dir . DIRECTORY_SEPARATOR . $name;
    $lockPath = $dir . DIRECTORY_SEPARATOR . $name . '.lock';
    $lock = fopen($lockPath, 'c');

    if ($lock === false) {
        json_response([
            'ok' => false,
            'error' => 'Unable to open storage lock',
        ], 500);
    }

    try {
        if (!flock($lock, LOCK_EX)) {
            json_response([
                'ok' => false,
                'error' => 'Unable to lock storage',
            ], 500);
        }

        $encoded = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        if ($encoded === false || file_put_contents($path, $encoded) === false) {
            json_response([
                'ok' => false,
                'error' => 'Unable to write storage file',
            ], 500);
        }
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

function require_admin_token(): void
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = '';

    if (preg_match('/Bearer\s+(.+)/i', $header, $matches) === 1) {
        $token = trim($matches[1]);
    }

    if ($token === '' || !hash_equals(robotic_api_admin_token(), $token)) {
        json_response([
            'ok' => false,
            'error' => 'Unauthorized',
        ], 401);
    }
}

function client_ip(): string
{
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $key) {
        if (!empty($_SERVER[$key])) {
            $value = explode(',', (string) $_SERVER[$key])[0];
            return sanitize_text($value, 64);
        }
    }

    return 'unknown';
}
