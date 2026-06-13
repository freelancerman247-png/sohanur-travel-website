<?php
declare(strict_types=1);

require __DIR__ . '/admin/config.php';

const ADMIN_NOTIFICATION_EMAIL = 'sohanurtravels@gmail.com';
const WEBSITE_FROM_EMAIL = 'info@sohanurtravels.com';
const WEBSITE_FROM_NAME = 'Sohanur Travel';

function clean_mail_header(string $value): string
{
    return str_replace(["\r", "\n"], '', $value);
}

function send_plain_email(string $to, string $subject, string $message, ?string $replyTo = null): bool
{
    $to = clean_mail_header($to);
    $subject = clean_mail_header($subject);
    $fromName = clean_mail_header(WEBSITE_FROM_NAME);
    $fromEmail = clean_mail_header(WEBSITE_FROM_EMAIL);
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . $fromName . ' <' . $fromEmail . '>',
    ];

    if ($replyTo !== null && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
        $headers[] = 'Reply-To: ' . clean_mail_header($replyTo);
    } else {
        $headers[] = 'Reply-To: ' . $fromEmail;
    }

    return mail($to, $subject, $message, implode("\r\n", $headers));
}

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

$adminMessage =
    "New customer query received from Sohanur Travel website.\n\n" .
    "Name: {$query['name']}\n" .
    "Phone: {$query['phone']}\n" .
    "Email: {$query['email']}\n" .
    "Service: {$query['service']}\n" .
    "Source: {$query['source']}\n" .
    "Message:\n{$query['message']}\n\n" .
    "Admin dashboard:\nhttps://sohanurtravels.com/admin/login.php";

send_plain_email(
    ADMIN_NOTIFICATION_EMAIL,
    'New Customer Query - ' . $query['service'],
    $adminMessage,
    $query['email'] !== '' ? $query['email'] : null
);

if ($query['email'] !== '' && filter_var($query['email'], FILTER_VALIDATE_EMAIL)) {
    $customerMessage =
        "Dear {$query['name']},\n\n" .
        "Thank you for contacting Sohanur Travel. We received your query and our team will contact you soon.\n\n" .
        "Your submitted details:\n" .
        "Service: {$query['service']}\n" .
        "Phone: {$query['phone']}\n" .
        "Email: {$query['email']}\n" .
        "Message:\n{$query['message']}\n\n" .
        "For urgent support, you can contact us:\n" .
        "Phone / WhatsApp: +91 8167390267\n" .
        "Email: info@sohanurtravels.com\n\n" .
        "Regards,\n" .
        "Sohanur Travel";

    send_plain_email(
        $query['email'],
        'We received your query - Sohanur Travel',
        $customerMessage,
        WEBSITE_FROM_EMAIL
    );
}

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
