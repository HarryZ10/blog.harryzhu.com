<?php
require_once __DIR__.'/../DatabaseService.php';
require_once __DIR__.'/../../models/Post.php';

class PostWriteService {

    // Create a post
    // Authentication Check Needed
    public static function createPost($postBodyData) {
        $stmt = DatabaseService::database()->prepare(
            "INSERT INTO post (user_id, post_date, post_text, extra)
             VALUES (:user_id, :post_date, :post_text, :extra);"
        );
        $stmt->bindParam(":user_id", $postBodyData["user_id"]);
        $stmt->bindParam(":post_date", $postBodyData["post_date"]);
        $stmt->bindParam(":post_text", $postBodyData["post_text"]);
        $stmt->bindParam(":extra", json_encode($postBodyData["extra"]));
        $stmt->execute();
        return "Success";
    }

    // Add a comment to a post
    // Authentication Check Needed
    public static function addCommentOnPost($commentData) {
        $stmt = DatabaseService::database()->prepare(
            "INSERT INTO blog_comment (id, user_id, post_id, comment_date, comment_text)
             VALUES (:id, :user_id, :post_id, :comment_date, :comment_text);"
        );
        $stmt->execute($commentData);
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
    // This function should also take the user_id of the requestor as a parameter
    public static function deletePost($postBodyData, $requestorUserId) {
        // First, verify if the post belongs to the user making the request
        if ($postBodyData['user_id'] != $requestorUserId) {
            throw new Exception("Unauthorized action.");
        }

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
