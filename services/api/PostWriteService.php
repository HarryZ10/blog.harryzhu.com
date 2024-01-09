<?php
require_once __DIR__.'/../DatabaseService.php';
require_once __DIR__.'/../../models/Post.php';

class PostWriteService {

    // Create a post
    // Authentication Check Needed
    public static function create_post($post_data) {
        $stmt = DatabaseService::database()->prepare(
            "INSERT INTO post (id, user_id, post_date, post_text, extra)
             VALUES (:id, :user_id, :post_date, :post_text, :extra);"
        );
        $stmt->execute($post_data);
        return "Success";
    }

    // Update a post
    // Authentication Check Needed
    public static function update_post($post_data) {
        $stmt = DatabaseService::database()->prepare(
            "UPDATE post (id, user_id, post_date, post_text, extra)
             VALUES (:id, :user_id, :post_date, :post_text, :extra);"
        );
        $stmt->execute($post_data);
        return "Success";
    }

    // Delete a post
    // Authentication Check Needed & user ids must match
    public static function delete_post($post_data) {
        $stmt = DatabaseService::database()->prepare(
            "DELETE post (id, user_id, post_date, post_text, extra)
             VALUES (:id, :user_id, :post_date, :post_text, :extra)"
        );
        $stmt->execute($post_data);
        return "Success";
    }
}
?>
