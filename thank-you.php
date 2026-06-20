<?php
declare(strict_types=1);

$whatsapp = isset($_GET['whatsapp']) ? (string) $_GET['whatsapp'] : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You - Sohanur Travel</title>
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            font-family: Arial, sans-serif;
            color: #f8fafc;
            background:
                radial-gradient(circle at top left, rgba(124, 58, 237, 0.35), transparent 32%),
                radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.32), transparent 30%),
                linear-gradient(135deg, #0f172a, #1e1b4b);
        }

        .card {
            width: min(620px, calc(100% - 32px));
            padding: 38px;
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 26px;
            box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
            backdrop-filter: blur(16px);
        }

        h1 {
            margin: 0 0 12px;
            font-size: clamp(2rem, 6vw, 3.2rem);
        }

        p {
            color: #dbeafe;
            line-height: 1.7;
        }

        .actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px;
            margin-top: 28px;
        }

        a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 48px;
            padding: 0 20px;
            color: #fff;
            background: #2563eb;
            border-radius: 999px;
            font-weight: 800;
            text-decoration: none;
        }

        .whatsapp {
            background: #22c55e;
        }
    </style>
</head>
<body>
    <main class="card">
        <h1>Thank you!</h1>
        <p>Your query has been saved. Our team will review it from the admin dashboard and contact you soon.</p>

        <div class="actions">
            <a href="index.html">Back to Home</a>
            <?php if ($whatsapp !== ''): ?>
                <a class="whatsapp" href="https://wa.me/918167390267?text=<?= htmlspecialchars($whatsapp, ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noopener">Continue on WhatsApp</a>
            <?php endif; ?>
        </div>
    </main>
</body>
</html>
