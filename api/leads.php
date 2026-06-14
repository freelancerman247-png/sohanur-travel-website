<?php

declare(strict_types=1);

require_once __DIR__ . '/storage.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    require_admin_token();

    $leads = read_json_file('leads.json', []);
    usort($leads, static fn (array $a, array $b): int => strcmp($b['createdAt'] ?? '', $a['createdAt'] ?? ''));

    json_response([
        'ok' => true,
        'data' => $leads,
    ]);
}

require_method('POST');

$payload = request_payload();
$name = sanitize_text($payload['name'] ?? '', 80);
$phone = sanitize_text($payload['phone'] ?? '', 30);
$email = sanitize_text($payload['email'] ?? '', 120);
$company = sanitize_text($payload['company'] ?? '', 120);
$service = sanitize_text($payload['service'] ?? 'General inquiry', 80);
$message = sanitize_text($payload['message'] ?? '', 1000);
$source = sanitize_text($payload['source'] ?? 'website', 80);

$errors = [];

if ($name === '') {
    $errors['name'] = 'Name is required.';
}

if ($phone === '' || !preg_match('/^[0-9+\-\s()]{8,20}$/', $phone)) {
    $errors['phone'] = 'A valid phone number is required.';
}

if ($email !== '' && !validate_email($email)) {
    $errors['email'] = 'Email address is invalid.';
}

if ($message === '') {
    $errors['message'] = 'Please describe your requirement.';
}

if ($errors !== []) {
    json_response([
        'ok' => false,
        'errors' => $errors,
    ], 422);
}

$leads = read_json_file('leads.json', []);
$lead = [
    'id' => 'lead_' . bin2hex(random_bytes(6)),
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'company' => $company,
    'service' => $service,
    'message' => $message,
    'source' => $source,
    'status' => 'new',
    'ip' => client_ip(),
    'createdAt' => gmdate('c'),
];

$leads[] = $lead;
write_json_file('leads.json', $leads);

json_response([
    'ok' => true,
    'message' => 'Thank you. Our fintech software team will contact you shortly.',
    'data' => [
        'id' => $lead['id'],
        'createdAt' => $lead['createdAt'],
    ],
], 201);
