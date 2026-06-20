<?php
declare(strict_types=1);

require __DIR__ . '/admin/config.php';

const ADMIN_NOTIFICATION_EMAIL = 'sohanurtravels@gmail.com';
const WEBSITE_FROM_EMAIL = 'info@sohanurtravels.com';
const WEBSITE_FROM_NAME = 'Sohanur Travel';
const WEBSITE_LOGO_URL = 'https://sohanurtravels.com/logo.png';

function clean_mail_header(string $value): string
{
    return str_replace(["\r", "\n"], '', $value);
}

function build_email_template(string $title, string $intro, array $rows, string $footerText): string
{
    $rowHtml = '';

    foreach ($rows as $label => $value) {
        $rowHtml .=
            '<tr>' .
            '<td style="padding:10px 12px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;width:130px;">' . e((string) $label) . '</td>' .
            '<td style="padding:10px 12px;color:#0f172a;border-bottom:1px solid #e2e8f0;">' . nl2br(e((string) $value)) . '</td>' .
            '</tr>';
    }

    return '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>' . e($title) . '</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:22px;overflow:hidden;box-shadow:0 18px 45px rgba(15,23,42,0.12);">
          <tr>
            <td align="center" style="padding:28px 24px;background:linear-gradient(135deg,#0f172a,#064e3b);">
              <img src="' . e(WEBSITE_LOGO_URL) . '" alt="Sohanur Travel" width="130" style="display:block;width:130px;max-width:130px;height:auto;margin:0 auto 14px;">
              <div style="color:#fde68a;font-size:13px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">Sohanur Travel</div>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 26px;">
              <h1 style="margin:0 0 12px;color:#0f172a;font-size:28px;line-height:1.2;">' . e($title) . '</h1>
              <p style="margin:0 0 22px;color:#475569;font-size:16px;line-height:1.7;">' . e($intro) . '</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;border-collapse:separate;">
                ' . $rowHtml . '
              </table>
              <p style="margin:24px 0 0;color:#475569;font-size:15px;line-height:1.7;">' . nl2br(e($footerText)) . '</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:18px 24px;background:#f8fafc;color:#64748b;font-size:13px;">
              Phone / WhatsApp: +91 8167390267 | Email: info@sohanurtravels.com
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';
}

function send_html_email(string $to, string $subject, string $message, ?string $replyTo = null): bool
{
    $to = clean_mail_header($to);
    $subject = clean_mail_header($subject);
    $fromName = clean_mail_header(WEBSITE_FROM_NAME);
    $fromEmail = clean_mail_header(WEBSITE_FROM_EMAIL);
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
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

$adminMessage = build_email_template(
    'New Customer Query',
    'A customer submitted a new service query from the Sohanur Travel website.',
    [
        'Name' => $query['name'],
        'Phone' => $query['phone'],
        'Email' => $query['email'],
        'Service' => $query['service'],
        'Source' => $query['source'],
        'Message' => $query['message'],
    ],
    "View the admin dashboard:\nhttps://sohanurtravels.com/admin/login.php"
);

send_html_email(
    ADMIN_NOTIFICATION_EMAIL,
    'New Customer Query - ' . $query['service'],
    $adminMessage,
    $query['email'] !== '' ? $query['email'] : null
);

if ($query['email'] !== '' && filter_var($query['email'], FILTER_VALIDATE_EMAIL)) {
    $customerMessage = build_email_template(
        'We Received Your Query',
        'Thank you for contacting Sohanur Travel. We received your query and our team will contact you soon.',
        [
            'Name' => $query['name'],
            'Service' => $query['service'],
            'Phone' => $query['phone'],
            'Email' => $query['email'],
            'Message' => $query['message'],
        ],
        "For urgent support, contact us:\nPhone / WhatsApp: +91 8167390267\nEmail: info@sohanurtravels.com\n\nRegards,\nSohanur Travel"
    );

    send_html_email(
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
