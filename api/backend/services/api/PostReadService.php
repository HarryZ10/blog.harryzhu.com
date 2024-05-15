<?php
require_once __DIR__.'/../DatabaseService.php';
require_once __DIR__.'/../../models/Post.php';
require_once __DIR__.'/../../models/Comment.php';

class PostReadService {

    // Retrieve all posts
    // Unauthenticated OKAY
    public static function fetchAllPosts() {
        $stmt = DatabaseService::database()->query("SELECT * FROM post WHERE project_id = 3 ORDER BY post_date DESC;");
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $result = [];
        foreach ($posts as $post) {
            $result[] = new Post(
                $post['id'],
                $post['user_id'],
                $post['project_id'],
                $post['post_date'],
                $post['post_text'],
                $post['extra']
            );
        }
        return $result;
    }

    public static function fetchAllUserPosts($userId) {
        $dbo = DatabaseService::database();
        $stmt = $dbo->prepare(
            "SELECT * FROM post WHERE project_id = 3 
            and user_id = :user_id ORDER BY post_date DESC;"
        );
        $stmt->execute(['user_id' => $userId]);
        
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $result = [];
        foreach ($posts as $post) {
            $result[] = new Post(
                $post['id'],
                $post['user_id'],
                $post['project_id'],
                $post['post_date'],
                $post['post_text'],
                $post['extra']
            );
        }
        return $result;
    }

    // Retrieve a post based on id
    // Authentication Check Needed
    public static function fetchPost($id) {
        $stmt = DatabaseService::database()->prepare("SELECT * FROM post WHERE id = :id;");
        $stmt->execute(['id' => $id]);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $post = $stmt->fetch();
        return $post;
    }

    // Retrieve a comment based on id
    // Authentication Check Needed
    public static function fetchComment($id) {
        $stmt = DatabaseService::database()->prepare("SELECT * FROM blog_comment WHERE id = :id;");
        $stmt->execute(['id' => $id]);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $post = $stmt->fetch();
        return $post;
    }

    // Retrieves comments on a post
    // Authentication Check Needed
    public static function retrieveCommentsOnPost($post_id) {
        $stmt = DatabaseService::database()->prepare("SELECT *
            FROM blog_comment
            WHERE post_id = :post_id;"
        );

        $stmt->bindParam(':post_id', $post_id);
        $stmt->execute();
        $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $result = [];
        foreach ($comments as $comment) {
            $result[] = new Comment(
                $comment['id'],
                $comment['post_id'],
                $comment['user_id'],
                $comment['comment_date'],
                $comment['comment_text']
            );
        }
        return $result;
    }
}
?>
