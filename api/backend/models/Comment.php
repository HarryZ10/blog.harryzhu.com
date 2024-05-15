<?php
class Comment {

    public $id;
    public $post_id;
    public $user_id;
    public $comment_date;
    public $comment_text;

    /**
     * Object/Model encompassing what makes up a comment
     */
    public function __construct($id, $post_id, $user_id, $comment_date, $comment_text) {
        $this->id = $id;
        $this->post_id = $post_id;
        $this->user_id = $user_id;
        $this->comment_date = $comment_date;
        $this->comment_text = $comment_text;
    }
}

?>
