<?php
require_once __DIR__.'/../DatabaseService.php';
require_once __DIR__.'/../../models/Post.php';

class PostReadService {

    // Retrieve all posts
    // Unauthenticated OKAY
    public static function all_posts() {
        $stmt = DatabaseService::database()->query("SELECT * FROM post;");
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $result = [];
        foreach ($posts as $post) {
            $result[] = new Post($post['id'], $post['user_id'], $post['post_date'], $post['post_text'], $post['extra']);
        }

        return $result;
    }

    // Retrieve a post based on id
    // Authentication Check Needed
    public static function get_post($post_id) {
        $stmt = DatabaseService::database()->prepare("SELECT * FROM post WHERE id = :post_id;");
        $stmt->execute(['post_id' => $post_id]);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $post = $stmt->fetch();
        return $post;
    }
}
?>
