<?php
declare(strict_types=1);

require __DIR__ . '/admin/config.php';

$posts = array_values(array_filter(read_blog_posts(), static function (array $post): bool {
    return ($post['status'] ?? '') === 'Published';
}));

usort($posts, static function (array $a, array $b): int {
    return strcmp((string) ($b['published_at'] ?? ''), (string) ($a['published_at'] ?? ''));
});

$search = trim((string) ($_GET['q'] ?? ''));
$category = trim((string) ($_GET['category'] ?? ''));
$categories = [];

foreach ($posts as $post) {
    $postCategory = trim((string) ($post['category'] ?? 'Travel'));
    if ($postCategory !== '' && !in_array($postCategory, $categories, true)) {
        $categories[] = $postCategory;
    }
}

if ($search !== '') {
    $needle = strtolower($search);
    $posts = array_values(array_filter($posts, static function (array $post) use ($needle): bool {
        $haystack = strtolower(implode(' ', [
            $post['title'] ?? '',
            $post['category'] ?? '',
            $post['excerpt'] ?? '',
            $post['content'] ?? '',
        ]));

        return strpos($haystack, $needle) !== false;
    }));
}

if ($category !== '') {
    $posts = array_values(array_filter($posts, static function (array $post) use ($category): bool {
        return ($post['category'] ?? '') === $category;
    }));
}

$featuredPost = $posts[0] ?? null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Travel Blog - Sohanur Travel</title>
    <meta name="description" content="Read Sohanur Travel blog posts about flights, hotels, visa, Umrah, immigration, and travel planning.">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #172033;
            background: #f8fafc;
        }
        a { color: inherit; text-decoration: none; }
        .blog-nav {
            padding: 14px 6%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
            background: #0f172a;
            border-bottom: 3px solid #22c55e;
        }
        .blog-nav img {
            width: 110px;
            height: auto;
        }
        .blog-nav-links {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .blog-nav-links a {
            padding: 11px 15px;
            color: #fff;
            background: #1e293b;
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 9px;
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
        }
        .blog-nav-links a.active {
            background: linear-gradient(135deg, #16a34a, #7c3aed);
        }
        .blog-hero {
            position: relative;
            overflow: hidden;
            padding: 90px 6% 80px;
            color: #fff;
            background:
                radial-gradient(circle at 12% 24%, rgba(34,197,94,0.34), transparent 30%),
                radial-gradient(circle at 86% 18%, rgba(124,58,237,0.38), transparent 32%),
                linear-gradient(135deg, #0f172a, #064e3b);
        }
        .blog-hero::after {
            position: absolute;
            right: -90px;
            bottom: -120px;
            width: 360px;
            height: 360px;
            content: "";
            background: rgba(255,255,255,0.08);
            border-radius: 50%;
        }
        .blog-hero-inner {
            position: relative;
            z-index: 1;
            max-width: 980px;
            margin: auto;
            text-align: center;
        }
        .eyebrow {
            display: inline-flex;
            margin-bottom: 14px;
            color: #fde68a;
            font-size: 13px;
            font-weight: 900;
            letter-spacing: 1.6px;
            text-transform: uppercase;
        }
        .blog-hero h1 {
            margin: 0;
            font-size: clamp(42px, 7vw, 76px);
            line-height: 1;
            letter-spacing: -0.06em;
        }
        .blog-hero p {
            max-width: 760px;
            margin: 22px auto 0;
            color: #dbeafe;
            font-size: 18px;
            line-height: 1.7;
        }
        .blog-shell {
            width: min(1180px, calc(100% - 32px));
            margin: -42px auto 70px;
            position: relative;
            z-index: 2;
        }
        .blog-filter {
            padding: 18px;
            display: grid;
            grid-template-columns: 1fr 220px auto;
            gap: 12px;
            align-items: end;
            background: rgba(255,255,255,0.92);
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(15,23,42,0.14);
            backdrop-filter: blur(16px);
        }
        .blog-filter label {
            display: block;
            color: #334155;
            font-weight: 900;
        }
        .blog-filter input,
        .blog-filter select {
            width: 100%;
            margin-top: 8px;
            padding: 13px 14px;
            border: 1px solid #dbe3ef;
            border-radius: 13px;
            outline: 0;
        }
        .blog-filter button {
            min-height: 45px;
            padding: 0 18px;
            color: #fff;
            background: linear-gradient(135deg, #16a34a, #7c3aed);
            border: 0;
            border-radius: 999px;
            font-weight: 900;
            cursor: pointer;
        }
        .featured-blog {
            margin-top: 28px;
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(320px, 0.78fr);
            overflow: hidden;
            background: #fff;
            border-radius: 30px;
            box-shadow: 0 18px 50px rgba(15,23,42,0.1);
        }
        .featured-blog-media {
            min-height: 340px;
            background: var(--image) center/cover no-repeat, linear-gradient(135deg, #0f172a, #064e3b);
        }
        .featured-blog-body {
            padding: 34px;
        }
        .category-pill {
            display: inline-flex;
            padding: 7px 11px;
            color: #166534;
            background: #dcfce7;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 900;
        }
        .featured-blog h2,
        .blog-card h2 {
            margin: 14px 0 10px;
            color: #0f172a;
            line-height: 1.15;
            letter-spacing: -0.04em;
        }
        .featured-blog h2 {
            font-size: clamp(30px, 4vw, 46px);
        }
        .featured-blog p,
        .blog-card p {
            color: #64748b;
            line-height: 1.7;
        }
        .read-more {
            display: inline-flex;
            margin-top: 16px;
            padding: 12px 18px;
            color: #fff;
            background: #0f172a;
            border-radius: 999px;
            font-weight: 900;
        }
        .blog-grid {
            margin-top: 28px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 22px;
        }
        .blog-card {
            overflow: hidden;
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            box-shadow: 0 16px 42px rgba(15,23,42,0.08);
            transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .blog-card:hover {
            transform: translateY(-7px);
            box-shadow: 0 24px 60px rgba(15,23,42,0.13);
        }
        .blog-card-media {
            min-height: 210px;
            background: var(--image) center/cover no-repeat, linear-gradient(135deg, #16a34a, #7c3aed);
        }
        .blog-card-body {
            padding: 24px;
        }
        .blog-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            color: #64748b;
            font-size: 13px;
            font-weight: 700;
        }
        .empty-state {
            margin-top: 28px;
            padding: 40px;
            text-align: center;
            background: #fff;
            border-radius: 24px;
        }
        .blog-footer {
            padding: 36px 6%;
            text-align: center;
            color: #cbd5e1;
            background: #0f172a;
        }
        @media (max-width: 900px) {
            .blog-nav { align-items: flex-start; flex-direction: column; }
            .blog-filter,
            .featured-blog,
            .blog-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <nav class="blog-nav">
        <a href="index.html"><img src="logo.png" alt="Sohanur Travel"></a>
        <div class="blog-nav-links">
            <a href="index.html">Home</a>
            <a href="flights.html">Flights</a>
            <a href="umrah.html">Umrah</a>
            <a class="active" href="blog.php">Blog</a>
            <a href="contact.html">Contact</a>
        </div>
    </nav>

    <header class="blog-hero">
        <div class="blog-hero-inner">
            <span class="eyebrow">Travel Guides & Updates</span>
            <h1>Sohanur Travel Blog</h1>
            <p>Helpful travel articles for flights, hotels, visa, Umrah, immigration, mobile recharge, and smarter journey planning.</p>
        </div>
    </header>

    <main class="blog-shell">
        <form class="blog-filter" method="get">
            <label>
                Search blog
                <input type="search" name="q" value="<?= e($search) ?>" placeholder="Search flights, Umrah, visa, hotels...">
            </label>
            <label>
                Category
                <select name="category">
                    <option value="">All categories</option>
                    <?php foreach ($categories as $item): ?>
                        <option value="<?= e($item) ?>" <?= $category === $item ? 'selected' : '' ?>><?= e($item) ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <button type="submit">Find Posts</button>
        </form>

        <?php if ($featuredPost !== null): ?>
            <article class="featured-blog">
                <a class="featured-blog-media" style="--image: url('<?= e((string) ($featuredPost['image'] ?? '')) ?>');" href="blog-post.php?slug=<?= e((string) $featuredPost['slug']) ?>" aria-label="<?= e((string) $featuredPost['title']) ?>"></a>
                <div class="featured-blog-body">
                    <span class="category-pill"><?= e((string) ($featuredPost['category'] ?? 'Travel')) ?></span>
                    <h2><?= e((string) $featuredPost['title']) ?></h2>
                    <div class="blog-meta">
                        <span><?= e((string) ($featuredPost['author'] ?? 'Sohanur Travel')) ?></span>
                        <span><?= e(date('d M Y', strtotime((string) ($featuredPost['published_at'] ?? 'now')))) ?></span>
                    </div>
                    <p><?= e((string) ($featuredPost['excerpt'] ?? '')) ?></p>
                    <a class="read-more" href="blog-post.php?slug=<?= e((string) $featuredPost['slug']) ?>">Read Featured Post</a>
                </div>
            </article>
        <?php endif; ?>

        <?php if ($posts === []): ?>
            <section class="empty-state">
                <h2>No blog posts found</h2>
                <p>Please try another search or category.</p>
            </section>
        <?php else: ?>
            <section class="blog-grid" aria-label="Blog posts">
                <?php foreach ($posts as $post): ?>
                    <article class="blog-card">
                        <a class="blog-card-media" style="--image: url('<?= e((string) ($post['image'] ?? '')) ?>');" href="blog-post.php?slug=<?= e((string) $post['slug']) ?>" aria-label="<?= e((string) $post['title']) ?>"></a>
                        <div class="blog-card-body">
                            <span class="category-pill"><?= e((string) ($post['category'] ?? 'Travel')) ?></span>
                            <h2><?= e((string) $post['title']) ?></h2>
                            <div class="blog-meta">
                                <span><?= e((string) ($post['author'] ?? 'Sohanur Travel')) ?></span>
                                <span><?= e(date('d M Y', strtotime((string) ($post['published_at'] ?? 'now')))) ?></span>
                            </div>
                            <p><?= e((string) ($post['excerpt'] ?? '')) ?></p>
                            <a class="read-more" href="blog-post.php?slug=<?= e((string) $post['slug']) ?>">Read More</a>
                        </div>
                    </article>
                <?php endforeach; ?>
            </section>
        <?php endif; ?>
    </main>

    <footer class="blog-footer">
        <strong>Sohanur Travel</strong>
        <p>Phone / WhatsApp: +91 8167390267 | Email: info@sohanurtravels.com</p>
    </footer>
</body>
</html>
