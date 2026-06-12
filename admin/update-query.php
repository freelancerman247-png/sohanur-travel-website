<?php
declare(strict_types=1);

require __DIR__ . '/config.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: dashboard.php');
    exit;
}

$id = trim((string) ($_POST['id'] ?? ''));
$status = trim((string) ($_POST['status'] ?? 'New'));
$adminNote = trim((string) ($_POST['admin_note'] ?? ''));
$allowedStatuses = ['New', 'Contacted', 'Closed'];

if (!in_array($status, $allowedStatuses, true)) {
    $status = 'New';
}

$queries = read_queries();
$index = find_query_index($queries, $id);

if ($index !== null) {
    $queries[$index]['status'] = $status;
    $queries[$index]['admin_note'] = $adminNote;
    $queries[$index]['updated_at'] = date('Y-m-d H:i:s');
    save_queries($queries);
}

header('Location: dashboard.php');
exit;
