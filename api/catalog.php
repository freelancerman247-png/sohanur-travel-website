<?php

declare(strict_types=1);

require_once __DIR__ . '/storage.php';

require_method('GET');

$catalog = [
    'company' => [
        'name' => 'Robotic API',
        'domain' => 'roboticapi.in',
        'tagline' => 'Fintech software, recharge automation, and white-label platforms for digital businesses.',
    ],
    'services' => [
        [
            'id' => 'admin-software',
            'name' => 'Admin Software',
            'headline' => 'Control users, retailers, APIs, commissions, tickets, KYC, wallets, and reports from one secure console.',
            'features' => [
                'Role-based staff and distributor access',
                'Wallet ledger with credit/debit audit trail',
                'Commission slabs and service-wise margin controls',
                'KYC document workflow and ticket inbox',
                'Live transaction status and export-ready reports',
            ],
        ],
        [
            'id' => 'multi-recharge-software',
            'name' => 'Multi Recharge Software',
            'headline' => 'Offer mobile, DTH, data card, utility, FASTag, and bill payment services with operator routing.',
            'features' => [
                'Retailer, distributor, and master distributor hierarchy',
                'Operator-wise API switching and fallback routing',
                'Recharge status callback and dispute tracking',
                'Wallet top-up, refund, and settlement reports',
                'Responsive web panel for desktop and mobile agents',
            ],
        ],
        [
            'id' => 'whitelabel-software',
            'name' => 'White-label Software',
            'headline' => 'Launch your branded fintech platform with custom domain, logo, colors, pricing, and service bundle.',
            'features' => [
                'Custom brand theme and domain mapping',
                'Configurable service packages and menus',
                'Partner onboarding and lead management',
                'Admin dashboard with brand-specific reports',
                'Deployment-ready PHP frontend/backend package',
            ],
        ],
    ],
    'plans' => [
        [
            'name' => 'Starter',
            'bestFor' => 'New fintech operators validating a service bundle',
            'includes' => ['Landing website', 'Lead capture backend', 'Admin inquiry dashboard', 'Basic service catalog'],
        ],
        [
            'name' => 'Business',
            'bestFor' => 'Recharge and utility businesses onboarding agents',
            'includes' => ['Distributor hierarchy UI', 'Recharge demo workflow', 'Commission matrix design', 'Priority customization'],
        ],
        [
            'name' => 'White-label',
            'bestFor' => 'Brands launching under their own domain',
            'includes' => ['Custom theme', 'Domain-ready deployment', 'Partner pages', 'Launch support checklist'],
        ],
    ],
];

json_response([
    'ok' => true,
    'data' => $catalog,
]);
