<?php
class Post {

    public $id;
    public $user_id;
    public $post_date;
    public $post_text;
    public $project_id;
    public $extra;

    /**
     * Object/Model encompassing what makes up a post
     */
    public function __construct($id, $user_id, $project_id, $post_date, $post_text, $extra) {
        $this->id = $id;
        $this->user_id = $user_id;
        $this->project_id = $project_id;
        $this->post_date = $post_date;
        $this->post_text = $post_text;
        $this->extra = $extra;
    }
}

?>
