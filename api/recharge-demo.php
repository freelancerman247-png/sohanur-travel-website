<?php

declare(strict_types=1);

require_once __DIR__ . '/storage.php';

require_method('POST');

$payload = request_payload();
$operator = sanitize_text($payload['operator'] ?? '', 80);
$circle = sanitize_text($payload['circle'] ?? '', 80);
$mobile = sanitize_text($payload['mobile'] ?? '', 20);
$amount = (float) ($payload['amount'] ?? 0);
$agentName = sanitize_text($payload['agentName'] ?? '', 80);
$agentPhone = sanitize_text($payload['agentPhone'] ?? '', 30);

$errors = [];

if ($operator === '') {
    $errors['operator'] = 'Operator is required.';
}

if ($mobile === '' || !preg_match('/^[0-9]{10}$/', $mobile)) {
    $errors['mobile'] = 'Enter a 10 digit mobile number.';
}

if ($amount < 10 || $amount > 5000) {
    $errors['amount'] = 'Amount must be between 10 and 5000.';
}

if ($agentName === '') {
    $errors['agentName'] = 'Agent name is required.';
}

if ($agentPhone === '' || !preg_match('/^[0-9+\-\s()]{8,20}$/', $agentPhone)) {
    $errors['agentPhone'] = 'Agent contact number is required.';
}

if ($errors !== []) {
    json_response([
        'ok' => false,
        'errors' => $errors,
    ], 422);
}

$reference = 'RAPI' . strtoupper(bin2hex(random_bytes(4)));
$commission = round($amount * 0.018, 2);

$leads = read_json_file('leads.json', []);
$leads[] = [
    'id' => 'demo_' . strtolower($reference),
    'name' => $agentName,
    'phone' => $agentPhone,
    'email' => '',
    'company' => 'Recharge demo agent',
    'service' => 'Multi recharge software demo',
    'message' => sprintf(
        'Demo recharge: %s %s for %s, amount %.2f, reference %s.',
        $operator,
        $circle !== '' ? '(' . $circle . ')' : '',
        $mobile,
        $amount,
        $reference
    ),
    'source' => 'recharge-demo',
    'status' => 'new',
    'ip' => client_ip(),
    'createdAt' => gmdate('c'),
];

write_json_file('leads.json', $leads);

json_response([
    'ok' => true,
    'message' => 'Demo transaction generated. Connect live operator APIs before production recharge processing.',
    'data' => [
        'reference' => $reference,
        'status' => 'demo-success',
        'commission' => $commission,
        'walletDebit' => $amount - $commission,
    ],
], 201);
