<?php
declare(strict_types=1);

session_start();

date_default_timezone_set('Asia/Kolkata');

const ADMIN_USERNAME = 'admin';
// Default password is Admin@12345. Change this hash after first upload.
const ADMIN_PASSWORD_HASH = '6f2cb9dd8f4b65e24e1c3f3fa5bc57982349237f11abceacd45bbcb74d621c25';
const QUERY_DATA_FILE = __DIR__ . '/../data/queries.json';
const BLOG_DATA_FILE = __DIR__ . '/../data/blog-posts.json';

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

function ensure_blog_store(): void
{
    $directory = dirname(BLOG_DATA_FILE);

    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }

    if (!file_exists(BLOG_DATA_FILE)) {
        file_put_contents(BLOG_DATA_FILE, json_encode(default_blog_posts(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    }
}

function default_blog_posts(): array
{
    $now = date('Y-m-d H:i:s');

    return [
        [
            'id' => 'blog_' . bin2hex(random_bytes(4)),
            'slug' => 'how-to-plan-a-smooth-umrah-journey',
            'title' => 'How to Plan a Smooth Umrah Journey',
            'category' => 'Umrah',
            'excerpt' => 'Simple preparation tips for Umrah travelers, including documents, hotel planning, and travel support.',
            'content' => "Planning Umrah becomes easier when you prepare your documents, travel dates, hotel preference, and budget before requesting a package.\n\nSohanur Travel can help with visa guidance, Makkah and Madinah hotel support, flight assistance, transport planning, and family package options.",
            'image' => 'images/makkah.jpg',
            'status' => 'Published',
            'author' => 'Sohanur Travel Team',
            'published_at' => $now,
            'created_at' => $now,
            'updated_at' => $now,
        ],
        [
            'id' => 'blog_' . bin2hex(random_bytes(4)),
            'slug' => 'flight-booking-tips-for-better-prices',
            'title' => 'Flight Booking Tips for Better Prices',
            'category' => 'Flights',
            'excerpt' => 'Learn how flexible dates, early planning, and route comparison can help you find better flight prices.',
            'content' => "Flight prices can change quickly. Travelers often save more by planning early, staying flexible with dates, and comparing multiple routes.\n\nFor urgent trips, share your route, date, passenger count, and preferred timing with our team so we can check suitable options.",
            'image' => 'images/banner2.jpg',
            'status' => 'Published',
            'author' => 'Sohanur Travel Team',
            'published_at' => $now,
            'created_at' => $now,
            'updated_at' => $now,
        ],
    ];
}

function read_blog_posts(): array
{
    ensure_blog_store();

    $json = file_get_contents(BLOG_DATA_FILE);
    $posts = json_decode($json ?: '[]', true);

    return is_array($posts) ? $posts : [];
}

function save_blog_posts(array $posts): void
{
    ensure_blog_store();

    file_put_contents(
        BLOG_DATA_FILE,
        json_encode(array_values($posts), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
        LOCK_EX
    );
}

function slugify(string $value): string
{
    $slug = strtolower(trim($value));
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?: '';
    $slug = trim($slug, '-');

    return $slug !== '' ? $slug : 'blog-post';
}

function unique_blog_slug(string $title, array $posts, ?string $currentId = null): string
{
    $base = slugify($title);
    $slug = $base;
    $counter = 2;

    while (true) {
        $exists = false;

        foreach ($posts as $post) {
            if (($post['id'] ?? '') !== $currentId && ($post['slug'] ?? '') === $slug) {
                $exists = true;
                break;
            }
        }

        if (!$exists) {
            return $slug;
        }

        $slug = $base . '-' . $counter;
        $counter++;
    }
}

function find_blog_index(array $posts, string $id): ?int
{
    foreach ($posts as $index => $post) {
        if (($post['id'] ?? '') === $id) {
            return $index;
        }
    }

    return null;
}

function find_blog_by_slug(array $posts, string $slug): ?array
{
    foreach ($posts as $post) {
        if (($post['slug'] ?? '') === $slug && ($post['status'] ?? '') === 'Published') {
            return $post;
        }
    }

    return null;
}
