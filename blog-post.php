<?php
declare(strict_types=1);

require __DIR__ . '/admin/config.php';

$slug = trim((string) ($_GET['slug'] ?? ''));
$post = find_blog_by_slug(read_blog_posts(), $slug);

if ($post === null) {
    http_response_code(404);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $post !== null ? e((string) $post['title']) : 'Blog Post Not Found' ?> - Sohanur Travel</title>
    <meta name="description" content="<?= $post !== null ? e((string) ($post['excerpt'] ?? '')) : 'Sohanur Travel blog post not found.' ?>">
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #172033;
            background: #f8fafc;
        }
        a { color: inherit; text-decoration: none; }
        .post-nav {
            padding: 14px 6%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
            background: #0f172a;
            border-bottom: 3px solid #22c55e;
        }
        .post-nav img { width: 110px; height: auto; }
        .post-nav-links { display: flex; flex-wrap: wrap; gap: 8px; }
        .post-nav-links a {
            padding: 11px 15px;
            color: #fff;
            background: #1e293b;
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 9px;
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
        }
        .post-hero {
            min-height: 430px;
            padding: 90px 6%;
            display: flex;
            align-items: flex-end;
            color: #fff;
            background:
                linear-gradient(180deg, rgba(15,23,42,0.25), rgba(15,23,42,0.88)),
                var(--image) center/cover no-repeat,
                linear-gradient(135deg, #0f172a, #064e3b);
        }
        .post-hero-inner {
            width: min(920px, 100%);
            margin: 0 auto;
        }
        .category-pill {
            display: inline-flex;
            padding: 8px 12px;
            color: #111827;
            background: #fde68a;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 900;
        }
        .post-hero h1 {
            max-width: 900px;
            margin: 18px 0 12px;
            font-size: clamp(38px, 7vw, 72px);
            line-height: 1;
            letter-spacing: -0.06em;
        }
        .post-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            color: #dbeafe;
            font-weight: 800;
        }
        .post-shell {
            width: min(900px, calc(100% - 32px));
            margin: 42px auto 70px;
            padding: 38px;
            background: #fff;
            border-radius: 28px;
            box-shadow: 0 18px 50px rgba(15,23,42,0.09);
        }
        .post-content {
            color: #334155;
            font-size: 18px;
            line-height: 1.85;
        }
        .post-content p { margin: 0 0 20px; }
        .post-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 34px;
            padding-top: 26px;
            border-top: 1px solid #e2e8f0;
        }
        .post-actions a {
            display: inline-flex;
            min-height: 46px;
            align-items: center;
            justify-content: center;
            padding: 0 18px;
            color: #fff;
            background: #0f172a;
            border-radius: 999px;
            font-weight: 900;
        }
        .post-actions .whatsapp { background: #22c55e; }
        .not-found {
            width: min(720px, calc(100% - 32px));
            margin: 80px auto;
            padding: 42px;
            text-align: center;
            background: #fff;
            border-radius: 24px;
        }
        @media (max-width: 720px) {
            .post-nav { align-items: flex-start; flex-direction: column; }
            .post-shell { padding: 26px; }
        }
    </style>
</head>
<body>
    <nav class="post-nav">
        <a href="index.html"><img src="logo.png" alt="Sohanur Travel"></a>
        <div class="post-nav-links">
            <a href="index.html">Home</a>
            <a href="blog.php">Blog</a>
            <a href="contact.html">Contact</a>
        </div>
    </nav>

    <?php if ($post === null): ?>
        <main class="not-found">
            <h1>Blog post not found</h1>
            <p>The post may be unpublished or removed.</p>
            <p><a href="blog.php">Back to Blog</a></p>
        </main>
    <?php else: ?>
        <header class="post-hero" style="--image: url('<?= e((string) ($post['image'] ?? '')) ?>');">
            <div class="post-hero-inner">
                <span class="category-pill"><?= e((string) ($post['category'] ?? 'Travel')) ?></span>
                <h1><?= e((string) $post['title']) ?></h1>
                <div class="post-meta">
                    <span><?= e((string) ($post['author'] ?? 'Sohanur Travel')) ?></span>
                    <span><?= e(date('d M Y', strtotime((string) ($post['published_at'] ?? 'now')))) ?></span>
                </div>
            </div>
        </header>

        <main class="post-shell">
            <article class="post-content">
                <?php foreach (preg_split('/\n\s*\n/', (string) ($post['content'] ?? '')) as $paragraph): ?>
                    <?php if (trim($paragraph) !== ''): ?>
                        <p><?= nl2br(e(trim($paragraph))) ?></p>
                    <?php endif; ?>
                <?php endforeach; ?>
            </article>

            <div class="post-actions">
                <a href="blog.php">Back to Blog</a>
                <a class="whatsapp" href="https://wa.me/918167390267?text=<?= e(rawurlencode('Hello Sohanur Travel, I read your blog: ' . (string) $post['title'])) ?>" target="_blank" rel="noopener">Ask on WhatsApp</a>
            </div>
        </main>
    <?php endif; ?>
</body>
</html>
