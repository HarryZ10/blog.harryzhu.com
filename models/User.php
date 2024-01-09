<?php

class User {

    public $id;
    public $username;
    public $pw_hash;

    /**
     * Object/Model encompassing what makes up a user
     */
    public function __construct($id, $username, $pw_hash) {
        $this->id = $id;
        $this->username = $username;
        $this->pw_hash = $pw_hash;
    }
}

?>
