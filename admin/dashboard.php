<?php
declare(strict_types=1);

require __DIR__ . '/config.php';
require_admin();

$queries = read_queries();
$statusFilter = trim((string) ($_GET['status'] ?? 'All'));
$search = trim((string) ($_GET['search'] ?? ''));

if ($statusFilter !== 'All') {
    $queries = array_values(array_filter($queries, static function (array $query) use ($statusFilter): bool {
        return ($query['status'] ?? '') === $statusFilter;
    }));
}

if ($search !== '') {
    $needle = strtolower($search);
    $queries = array_values(array_filter($queries, static function (array $query) use ($needle): bool {
        $haystack = strtolower(implode(' ', [
            $query['name'] ?? '',
            $query['phone'] ?? '',
            $query['email'] ?? '',
            $query['service'] ?? '',
            $query['message'] ?? '',
        ]));

        return strpos($haystack, $needle) !== false;
    }));
}

$allQueries = read_queries();
$totalCount = count($allQueries);
$newCount = count(array_filter($allQueries, static function (array $query): bool {
    return ($query['status'] ?? '') === 'New';
}));
$progressCount = count(array_filter($allQueries, static function (array $query): bool {
    return ($query['status'] ?? '') === 'Contacted';
}));
$closedCount = count(array_filter($allQueries, static function (array $query): bool {
    return ($query['status'] ?? '') === 'Closed';
}));

function whatsapp_link(array $query): string
{
    $phone = preg_replace('/\D+/', '', (string) ($query['phone'] ?? ''));
    $message = rawurlencode(
        "Hello {$query['name']},\n" .
        "This is Sohanur Travel. We received your query about {$query['service']}."
    );

    if ($phone === '') {
        return 'https://wa.me/918167390267?text=' . $message;
    }

    if (strpos($phone, '0') === 0) {
        $phone = '91' . ltrim($phone, '0');
    }

    if (strpos($phone, '91') !== 0 && strlen($phone) === 10) {
        $phone = '91' . $phone;
    }

    return 'https://wa.me/' . $phone . '?text=' . $message;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Sohanur Travel</title>
    <link rel="stylesheet" href="admin.css">
</head>
<body>
    <header class="admin-header">
        <div>
            <span class="eyebrow">Admin Dashboard</span>
            <h1>Customer Queries</h1>
        </div>
        <div class="header-actions">
            <a href="blog.php">Manage Blog</a>
            <a href="../index.html" target="_blank" rel="noopener">View Website</a>
            <a class="logout" href="logout.php">Logout</a>
        </div>
    </header>

    <main class="admin-shell">
        <section class="stats-grid" aria-label="Query summary">
            <article>
                <span>Total</span>
                <strong><?= $totalCount ?></strong>
            </article>
            <article>
                <span>New</span>
                <strong><?= $newCount ?></strong>
            </article>
            <article>
                <span>Contacted</span>
                <strong><?= $progressCount ?></strong>
            </article>
            <article>
                <span>Closed</span>
                <strong><?= $closedCount ?></strong>
            </article>
        </section>

        <form class="toolbar" method="get">
            <label>
                Search
                <input type="search" name="search" value="<?= e($search) ?>" placeholder="Name, phone, service, message">
            </label>
            <label>
                Status
                <select name="status">
                    <?php foreach (['All', 'New', 'Contacted', 'Closed'] as $status): ?>
                        <option value="<?= e($status) ?>" <?= $statusFilter === $status ? 'selected' : '' ?>><?= e($status) ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <button type="submit">Filter</button>
            <a class="clear-filter" href="dashboard.php">Clear</a>
        </form>

        <section class="query-list">
            <?php if ($queries === []): ?>
                <div class="empty-state">
                    <h2>No queries found</h2>
                    <p>New customer queries will appear here after website forms submit to <code>submit-query.php</code>.</p>
                </div>
            <?php endif; ?>

            <?php foreach ($queries as $query): ?>
                <article class="query-card">
                    <div class="query-topline">
                        <div>
                            <span class="service-pill"><?= e((string) ($query['service'] ?? 'General Query')) ?></span>
                            <h2><?= e((string) ($query['name'] ?? 'Unknown customer')) ?></h2>
                        </div>
                        <span class="status status-<?= e(strtolower((string) ($query['status'] ?? 'new'))) ?>">
                            <?= e((string) ($query['status'] ?? 'New')) ?>
                        </span>
                    </div>

                    <div class="query-meta">
                        <span>Created: <?= e((string) ($query['created_at'] ?? '')) ?></span>
                        <span>Updated: <?= e((string) ($query['updated_at'] ?? '')) ?></span>
                        <span>Source: <?= e((string) ($query['source'] ?? 'Website')) ?></span>
                    </div>

                    <p class="query-message"><?= nl2br(e((string) ($query['message'] ?? ''))) ?></p>

                    <div class="contact-row">
                        <?php if (($query['phone'] ?? '') !== ''): ?>
                            <a href="tel:<?= e((string) $query['phone']) ?>">Call: <?= e((string) $query['phone']) ?></a>
                            <a class="whatsapp" href="<?= e(whatsapp_link($query)) ?>" target="_blank" rel="noopener">WhatsApp</a>
                        <?php endif; ?>
                        <?php if (($query['email'] ?? '') !== ''): ?>
                            <a href="mailto:<?= e((string) $query['email']) ?>?subject=Sohanur Travel Query">Email: <?= e((string) $query['email']) ?></a>
                        <?php endif; ?>
                    </div>

                    <form class="query-update-form" method="post" action="update-query.php">
                        <input type="hidden" name="id" value="<?= e((string) ($query['id'] ?? '')) ?>">
                        <label>
                            Status
                            <select name="status">
                                <?php foreach (['New', 'Contacted', 'Closed'] as $status): ?>
                                    <option value="<?= e($status) ?>" <?= ($query['status'] ?? '') === $status ? 'selected' : '' ?>><?= e($status) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </label>
                        <label>
                            Admin note
                            <textarea name="admin_note" rows="2" placeholder="Example: Called customer, waiting for documents"><?= e((string) ($query['admin_note'] ?? '')) ?></textarea>
                        </label>
                        <button type="submit">Save Update</button>
                    </form>
                </article>
            <?php endforeach; ?>
        </section>
    </main>
</body>
</html>
