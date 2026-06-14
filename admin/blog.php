<?php
declare(strict_types=1);

require __DIR__ . '/config.php';
require_admin();

$posts = read_blog_posts();
$message = '';
$editId = trim((string) ($_GET['edit'] ?? ''));
$editingPost = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = trim((string) ($_POST['action'] ?? 'save'));

    if ($action === 'delete') {
        $id = trim((string) ($_POST['id'] ?? ''));
        $posts = array_values(array_filter($posts, static function (array $post) use ($id): bool {
            return ($post['id'] ?? '') !== $id;
        }));
        save_blog_posts($posts);
        header('Location: blog.php?message=deleted');
        exit;
    }

    $id = trim((string) ($_POST['id'] ?? ''));
    $title = trim((string) ($_POST['title'] ?? ''));
    $category = trim((string) ($_POST['category'] ?? 'Travel'));
    $excerpt = trim((string) ($_POST['excerpt'] ?? ''));
    $content = trim((string) ($_POST['content'] ?? ''));
    $image = trim((string) ($_POST['image'] ?? ''));
    $status = trim((string) ($_POST['status'] ?? 'Draft'));
    $author = trim((string) ($_POST['author'] ?? 'Sohanur Travel Team'));
    $publishedAt = trim((string) ($_POST['published_at'] ?? ''));
    $now = date('Y-m-d H:i:s');

    if (!in_array($status, ['Draft', 'Published'], true)) {
        $status = 'Draft';
    }

    if ($title === '' || $content === '') {
        $message = 'Title and content are required.';
    } else {
        if ($excerpt === '') {
            $excerpt = substr(strip_tags($content), 0, 155);
        }

        if ($image === '') {
            $image = 'images/banner1.jpg';
        }

        if ($publishedAt === '') {
            $publishedAt = $status === 'Published' ? $now : '';
        }

        $index = $id !== '' ? find_blog_index($posts, $id) : null;
        $slug = unique_blog_slug($title, $posts, $id !== '' ? $id : null);

        $post = [
            'id' => $id !== '' ? $id : 'blog_' . bin2hex(random_bytes(8)),
            'slug' => $slug,
            'title' => $title,
            'category' => $category !== '' ? $category : 'Travel',
            'excerpt' => $excerpt,
            'content' => $content,
            'image' => $image,
            'status' => $status,
            'author' => $author !== '' ? $author : 'Sohanur Travel Team',
            'published_at' => $publishedAt,
            'created_at' => $index !== null ? (string) ($posts[$index]['created_at'] ?? $now) : $now,
            'updated_at' => $now,
        ];

        if ($index !== null) {
            $posts[$index] = $post;
        } else {
            array_unshift($posts, $post);
        }

        save_blog_posts($posts);
        header('Location: blog.php?message=saved');
        exit;
    }
}

if ($editId !== '') {
    $index = find_blog_index($posts, $editId);
    if ($index !== null) {
        $editingPost = $posts[$index];
    }
}

if (isset($_GET['message'])) {
    $message = $_GET['message'] === 'deleted' ? 'Blog post deleted.' : 'Blog post saved.';
}

usort($posts, static function (array $a, array $b): int {
    return strcmp((string) ($b['updated_at'] ?? ''), (string) ($a['updated_at'] ?? ''));
});

$draft = [
    'id' => '',
    'title' => '',
    'category' => 'Travel',
    'excerpt' => '',
    'content' => '',
    'image' => 'images/banner1.jpg',
    'status' => 'Draft',
    'author' => 'Sohanur Travel Team',
    'published_at' => '',
];
$formPost = $editingPost ?? $draft;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Blog - Sohanur Travel</title>
    <link rel="stylesheet" href="admin.css">
</head>
<body>
    <header class="admin-header">
        <div>
            <span class="eyebrow">Admin Dashboard</span>
            <h1>Manage Blog Posts</h1>
        </div>
        <div class="header-actions">
            <a href="dashboard.php">Queries</a>
            <a href="../blog.php" target="_blank" rel="noopener">View Blog</a>
            <a class="logout" href="logout.php">Logout</a>
        </div>
    </header>

    <main class="admin-shell blog-admin-shell">
        <?php if ($message !== ''): ?>
            <div class="alert alert-success"><?= e($message) ?></div>
        <?php endif; ?>

        <section class="blog-editor-card">
            <div class="editor-heading">
                <div>
                    <span class="eyebrow">Post Editor</span>
                    <h2><?= ($formPost['id'] ?? '') !== '' ? 'Edit Blog Post' : 'Create New Blog Post' ?></h2>
                </div>
                <?php if (($formPost['id'] ?? '') !== ''): ?>
                    <a class="clear-filter" href="blog.php">New Post</a>
                <?php endif; ?>
            </div>

            <form method="post" class="blog-editor-form">
                <input type="hidden" name="id" value="<?= e((string) ($formPost['id'] ?? '')) ?>">
                <input type="hidden" name="action" value="save">

                <label>
                    Title *
                    <input type="text" name="title" required value="<?= e((string) ($formPost['title'] ?? '')) ?>" placeholder="Example: Umrah travel checklist">
                </label>

                <div class="blog-editor-grid">
                    <label>
                        Category
                        <input type="text" name="category" value="<?= e((string) ($formPost['category'] ?? 'Travel')) ?>" placeholder="Flights, Umrah, Visa">
                    </label>
                    <label>
                        Author
                        <input type="text" name="author" value="<?= e((string) ($formPost['author'] ?? 'Sohanur Travel Team')) ?>">
                    </label>
                </div>

                <label>
                    Image URL
                    <input type="text" name="image" value="<?= e((string) ($formPost['image'] ?? '')) ?>" placeholder="images/banner1.jpg or https://...">
                </label>

                <label>
                    Short excerpt
                    <textarea name="excerpt" rows="3" placeholder="Short summary for blog cards"><?= e((string) ($formPost['excerpt'] ?? '')) ?></textarea>
                </label>

                <label>
                    Full content *
                    <textarea name="content" rows="12" required placeholder="Write the blog content. Use blank lines between paragraphs."><?= e((string) ($formPost['content'] ?? '')) ?></textarea>
                </label>

                <div class="blog-editor-grid">
                    <label>
                        Status
                        <select name="status">
                            <?php foreach (['Draft', 'Published'] as $status): ?>
                                <option value="<?= e($status) ?>" <?= ($formPost['status'] ?? '') === $status ? 'selected' : '' ?>><?= e($status) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </label>
                    <label>
                        Published date/time
                        <input type="text" name="published_at" value="<?= e((string) ($formPost['published_at'] ?? '')) ?>" placeholder="YYYY-MM-DD HH:MM:SS">
                    </label>
                </div>

                <button type="submit"><?= ($formPost['id'] ?? '') !== '' ? 'Update Blog Post' : 'Create Blog Post' ?></button>
            </form>
        </section>

        <section class="blog-admin-list">
            <div class="editor-heading">
                <div>
                    <span class="eyebrow">All Posts</span>
                    <h2>Blog Library</h2>
                </div>
            </div>

            <?php if ($posts === []): ?>
                <div class="empty-state">
                    <h2>No blog posts yet</h2>
                    <p>Create your first post using the editor above.</p>
                </div>
            <?php endif; ?>

            <?php foreach ($posts as $post): ?>
                <?php
                    $postImage = (string) ($post['image'] ?? '');
                    $adminImage = preg_match('/^https?:\/\//', $postImage) ? $postImage : '../' . ltrim($postImage, '/');
                ?>
                <article class="blog-admin-item">
                    <div class="blog-admin-thumb" style="background-image:url('<?= e($adminImage) ?>');"></div>
                    <div>
                        <span class="service-pill"><?= e((string) ($post['category'] ?? 'Travel')) ?></span>
                        <h3><?= e((string) ($post['title'] ?? 'Untitled')) ?></h3>
                        <p><?= e((string) ($post['excerpt'] ?? '')) ?></p>
                        <div class="query-meta">
                            <span>Status: <?= e((string) ($post['status'] ?? 'Draft')) ?></span>
                            <span>Slug: <?= e((string) ($post['slug'] ?? '')) ?></span>
                            <span>Updated: <?= e((string) ($post['updated_at'] ?? '')) ?></span>
                        </div>
                        <div class="blog-admin-actions">
                            <a class="clear-filter" href="blog.php?edit=<?= e((string) ($post['id'] ?? '')) ?>">Edit</a>
                            <?php if (($post['status'] ?? '') === 'Published'): ?>
                                <a class="clear-filter" href="../blog-post.php?slug=<?= e((string) ($post['slug'] ?? '')) ?>" target="_blank" rel="noopener">View</a>
                            <?php endif; ?>
                            <form method="post" onsubmit="return confirm('Delete this blog post?');">
                                <input type="hidden" name="action" value="delete">
                                <input type="hidden" name="id" value="<?= e((string) ($post['id'] ?? '')) ?>">
                                <button class="danger-button" type="submit">Delete</button>
                            </form>
                        </div>
                    </div>
                </article>
            <?php endforeach; ?>
        </section>
    </main>
</body>
</html>
