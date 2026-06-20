<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

header('Location: ' . (is_admin_logged_in() ? 'dashboard.php' : 'login.php'));
exit;
