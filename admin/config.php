<?php
declare(strict_types=1);

session_start();

date_default_timezone_set('Asia/Kolkata');

const ADMIN_USERNAME = 'admin';
// Default password is Admin@12345. Change this hash after first upload.
const ADMIN_PASSWORD_HASH = '6f2cb9dd8f4b65e24e1c3f3fa5bc57982349237f11abceacd45bbcb74d621c25';
const QUERY_DATA_FILE = __DIR__ . '/../data/queries.json';

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function is_admin_logged_in(): bool
{
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function require_admin(): void
{
    if (!is_admin_logged_in()) {
        header('Location: login.php');
        exit;
    }
}

function verify_admin_password(string $password): bool
{
    return hash_equals(ADMIN_PASSWORD_HASH, hash('sha256', $password));
}

function ensure_query_store(): void
{
    $directory = dirname(QUERY_DATA_FILE);

    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }

    if (!file_exists(QUERY_DATA_FILE)) {
        file_put_contents(QUERY_DATA_FILE, json_encode([], JSON_PRETTY_PRINT));
    }
}

function read_queries(): array
{
    ensure_query_store();

    $json = file_get_contents(QUERY_DATA_FILE);
    $queries = json_decode($json ?: '[]', true);

    return is_array($queries) ? $queries : [];
}

function save_queries(array $queries): void
{
    ensure_query_store();

    file_put_contents(
        QUERY_DATA_FILE,
        json_encode(array_values($queries), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
        LOCK_EX
    );
}

function find_query_index(array $queries, string $id): ?int
{
    foreach ($queries as $index => $query) {
        if (($query['id'] ?? '') === $id) {
            return $index;
        }
    }

    return null;
}

function normalize_query_value(?string $value): string
{
    return trim((string) $value);
}

function create_query(array $input): array
{
    $now = date('Y-m-d H:i:s');

    return [
        'id' => bin2hex(random_bytes(8)),
        'name' => normalize_query_value($input['name'] ?? ''),
        'phone' => normalize_query_value($input['phone'] ?? ''),
        'email' => normalize_query_value($input['email'] ?? ''),
        'service' => normalize_query_value($input['service'] ?? 'General Query'),
        'message' => normalize_query_value($input['message'] ?? ''),
        'source' => normalize_query_value($input['source'] ?? 'Website'),
        'status' => 'New',
        'created_at' => $now,
        'updated_at' => $now,
    ];
}
