<?php
require_once __DIR__.'/../DatabaseService.php';
require_once __DIR__.'/../../models/Comment.php';

class CommentWriteService {

    // Update a comment
    // Authentication Check Needed
    public static function updateComment($commentData) {
        $stmt = DatabaseService::database()->prepare(
             "UPDATE blog_comment
             SET user_id = :user_id,
                 comment_date = :comment_date,
                 comment_text = :comment_text,
             WHERE id = :id;"
        );

        $stmt->bindParam(':user_id', $commentData['user_id']);
        $stmt->bindParam(':comment_date', $commentData['comment_date']);
        $stmt->bindParam(':comment_text', $commentData['comment_text']);
        $stmt->bindParam(':id', $commentData['id']);
        $stmt->execute();
        return "Success";
    }

    // Delete a comment
    // Authentication Check Needed & user ids must match
    public static function deleteComment($commentData) {
        $stmt = DatabaseService::database()->prepare(
            "DELETE FROM blog_comment WHERE id = :id
                AND user_id = :user_id
                AND post_id = :post_id;"
        );

        $stmt->bindParam(':user_id', $commentData['user_id']);
        $stmt->bindParam(':post_id', $commentData['post_id']);
        $stmt->bindParam(':id', $commentData['id']);
        $stmt->execute();
        return "Success";
    }
}

?>
