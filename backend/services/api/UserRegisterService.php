<?php
require_once __DIR__.'/../DatabaseService.php';
require_once __DIR__.'/../../models/User.php';

class UserRegisterService {

    public static function addUser($username, $password) {
        $stmt = DatabaseService::database()->prepare(
            "INSERT INTO blog_user (username, password)
             VALUES ( :username, :password);"
        );
        $stmt->bindParam(":username", $username);
        $stmt->bindParam(":password", $password);
        $stmt->execute();

        return "Success";
    }

    public static function checkUsername($username) {
        $stmt = DatabaseService::database()->prepare(
            "SELECT id, username, password FROM blog_user WHERE username = :username;"
        );
        $stmt->bindParam(":username", $username);
        $stmt->execute();

        // Check if any rows are returned
        return $stmt->rowCount() > 0;
    }
}

?>