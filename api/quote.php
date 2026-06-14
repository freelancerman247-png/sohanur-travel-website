<?php

declare(strict_types=1);

require_once __DIR__ . '/storage.php';

require_method('POST');

$payload = request_payload();
$brandName = sanitize_text($payload['brandName'] ?? '', 120);
$serviceBundle = sanitize_text($payload['serviceBundle'] ?? '', 160);
$launchMode = sanitize_text($payload['launchMode'] ?? '', 120);
$name = sanitize_text($payload['name'] ?? '', 80);
$phone = sanitize_text($payload['phone'] ?? '', 30);
$email = sanitize_text($payload['email'] ?? '', 120);
$message = sanitize_text($payload['message'] ?? '', 1000);

$errors = [];

if ($brandName === '') {
    $errors['brandName'] = 'Brand name is required.';
}

if ($serviceBundle === '') {
    $errors['serviceBundle'] = 'Select at least one service bundle.';
}

if ($name === '') {
    $errors['name'] = 'Contact person is required.';
}

if ($phone === '' || !preg_match('/^[0-9+\-\s()]{8,20}$/', $phone)) {
    $errors['phone'] = 'A valid phone number is required.';
}

if ($email !== '' && !validate_email($email)) {
    $errors['email'] = 'Email address is invalid.';
}

if ($errors !== []) {
    json_response([
        'ok' => false,
        'errors' => $errors,
    ], 422);
}

$leads = read_json_file('leads.json', []);
$lead = [
    'id' => 'quote_' . bin2hex(random_bytes(6)),
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'company' => $brandName,
    'service' => 'White-label quote',
    'message' => 'Bundle: ' . $serviceBundle . '. Launch mode: ' . ($launchMode !== '' ? $launchMode : 'Not specified') . '. Notes: ' . $message,
    'source' => 'white-label-builder',
    'status' => 'new',
    'ip' => client_ip(),
    'createdAt' => gmdate('c'),
];

$leads[] = $lead;
write_json_file('leads.json', $leads);

json_response([
    'ok' => true,
    'message' => 'White-label request received. We will prepare the launch discussion.',
    'data' => [
        'id' => $lead['id'],
        'createdAt' => $lead['createdAt'],
    ],
], 201);
