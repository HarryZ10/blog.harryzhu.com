<?php
require_once __DIR__.'/../DatabaseService.php';
require_once __DIR__.'/../../models/Post.php';

class PostWriteService {

    // Create a post
    // Authentication Check Needed
    public static function createPost($postBodyData) {
        $stmt = DatabaseService::database()->prepare(
            "INSERT INTO post (id, user_id, post_date, post_text, extra)
             VALUES (:id, :user_id, :post_date, :post_text, :extra);"
        );
        $stmt->execute($postBodyData);
        return "Success";
    }

    // Update a post
    // Authentication Check Needed
    public static function updatePost($postBodyData) {
        $stmt = DatabaseService::database()->prepare(
             "UPDATE post
             SET user_id = :user_id,
                 post_date = :post_date,
                 post_text = :post_text,
                 extra = :extra
             WHERE id = :id;"
        );
        $stmt->bindParam(':user_id', $postBodyData['user_id']);
        $stmt->bindParam(':post_date', $postBodyData['post_date']);
        $stmt->bindParam(':post_text', $postBodyData['post_text']);
        $stmt->bindParam(':id', $postBodyData['id']);
        $stmt->bindParam(':extra', $postBodyData['extra']);
        $stmt->execute();
        return "Success";
    }

    // Delete a post
    // Authentication Check Needed & user ids must match
    public static function deletePost($postBodyData) {
        $stmt = DatabaseService::database()->prepare(
            "DELETE FROM post WHERE id = :id AND user_id = :user_id;"
        );
        $stmt->bindParam(':user_id', $postBodyData['user_id']);
        $stmt->bindParam(':id', $postBodyData['id']);
        $stmt->execute();
        return "Success";
    }
}
?>
