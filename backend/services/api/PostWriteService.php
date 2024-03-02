<?php
require_once __DIR__.'/../DatabaseService.php';
require_once __DIR__.'/../../models/Post.php';

class PostWriteService {

    // Create a post
    // Authentication Check Needed
    public static function createPost($postBodyData) {
        try  {
            $stmt = DatabaseService::database()->prepare(
                "INSERT INTO post (user_id, project_id, post_date, post_text, extra)
                VALUES (:user_id, 3, :post_date, :post_text, :extra);"
            );
            $stmt->bindParam(":user_id", $postBodyData["user_id"]);
            $stmt->bindParam(":post_date", date('Y-m-d'));
            $stmt->bindParam(":post_text", $postBodyData["post_text"]);
        $stmt->bindParam(":extra", json_encode($postBodyData["extra"]));
            $stmt->execute();
        } catch (\PDOException $e) {
            return $e->getMessage();
        }

        return "Success";
    }

    // Add a comment to a post
    // Authentication Check Needed
    public static function addCommentOnPost($commentData) {
        $stmt = DatabaseService::database()->prepare(
            "INSERT INTO blog_comment (user_id, post_id, comment_date, comment_text)
             VALUES (:user_id, :post_id, :comment_date, :comment_text);"
        );
        $stmt->bindParam(':user_id', $commentData['user_id']);
        $stmt->bindParam(':post_id', $commentData['post_id']);
        $stmt->bindParam(':comment_date', date('Y-m-d'));
        $stmt->bindParam(':comment_text', $commentData['comment_text']);
        $stmt->execute();
        return "Success";
    }

    // Update a post
    // Authentication Check Needed
    public static function updatePost($postBodyData) {
        $stmt = DatabaseService::database()->prepare(
             "UPDATE post
             SET post_date = :post_date,
                 post_text = :post_text,
                 extra = :extra
             WHERE project_id = 3 AND id = :id;"
	);
        $stmt->bindParam(':post_date', date('m-d-Y', time()));

        $stmt->bindParam(':id', $postBodyData['id']);
        $stmt->bindParam(':post_text', $postBodyData['post_text']);
        $stmt->bindParam(':extra', json_encode($postBodyData['extra']));
        $stmt->execute();
        return "Success";
    }

    // Delete a post
    // Authentication Check Needed & user ids must match
    // This function should also take the user_id of the requestor as a parameter
    public static function deletePost($userInfo) {

        try  {
            $dbo = DatabaseService::database();
            $dbo->beginTransaction();

            // First delete the comments of the post
            $stmt = $dbo->prepare(
                "DELETE FROM blog_comment WHERE post_id = :post_id;"
            );

            $stmt->bindParam(':post_id', $userInfo['post_id']);
            $stmt->execute();

            $stmt = $dbo->prepare(
                "DELETE FROM post WHERE id = :id AND user_id = :user_id AND project_id = 3;"
            );
            $stmt->bindParam(':user_id', $userInfo['user_id']);
            $stmt->bindParam(':id', $userInfo['post_id']);
            $stmt->execute();

            $dbo->commit();

        } catch (\PDOException $e) {
            $dbo->rollBack();
            return $e;
        }
        return "Success";
    }
}
?>
