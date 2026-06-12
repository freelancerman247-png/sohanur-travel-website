<?php
declare(strict_types=1);

require __DIR__ . '/admin/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

$query = create_query($_POST);
$errors = [];

if ($query['name'] === '') {
    $errors[] = 'Name is required.';
}

if ($query['phone'] === '' && $query['email'] === '') {
    $errors[] = 'Phone or email is required.';
}

if ($query['message'] === '') {
    $errors[] = 'Message is required.';
}

if ($errors !== []) {
    http_response_code(422);
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Query Error - Sohanur Travel</title>
        <style>
            body {
                margin: 0;
                min-height: 100vh;
                display: grid;
                place-items: center;
                font-family: Arial, sans-serif;
                background: #f8f5ff;
                color: #1f2937;
            }
            .card {
                width: min(520px, calc(100% - 32px));
                padding: 32px;
                background: #fff;
                border-radius: 18px;
                box-shadow: 0 18px 45px rgba(88, 28, 135, 0.16);
            }
            a {
                color: #7c3aed;
                font-weight: 700;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>Please check your details</h1>
            <ul>
                <?php foreach ($errors as $error): ?>
                    <li><?= e($error) ?></li>
                <?php endforeach; ?>
            </ul>
            <p><a href="contact.html">Go back to contact page</a></p>
        </div>
    </body>
    </html>
    <?php
    exit;
}

$queries = read_queries();
array_unshift($queries, $query);
save_queries($queries);

$whatsappText = rawurlencode(
    "Hello Sohanur Travel,\n\n" .
    "I submitted a website query.\n\n" .
    "Name: {$query['name']}\n" .
    "Phone: {$query['phone']}\n" .
    "Email: {$query['email']}\n" .
    "Service: {$query['service']}\n" .
    "Message: {$query['message']}"
);

header('Location: thank-you.php?whatsapp=' . $whatsappText);
exit;
