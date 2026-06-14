<?php

declare(strict_types=1);

/*
 * Change this token after upload. It is used by /admin to read leads.
 * For better security on VPS/Node hosting, set ROBOTIC_API_ADMIN_TOKEN
 * as an environment variable and keep this fallback private.
 */
const ROBOTIC_API_DEFAULT_ADMIN_TOKEN = 'change-this-admin-token';

function robotic_api_admin_token(): string
{
    $token = getenv('ROBOTIC_API_ADMIN_TOKEN');

    return $token !== false && trim($token) !== ''
        ? trim($token)
        : ROBOTIC_API_DEFAULT_ADMIN_TOKEN;
}

function robotic_api_storage_dir(): string
{
    $dir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data';

    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    return $dir;
}
