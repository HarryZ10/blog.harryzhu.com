<?php
require_once __DIR__.'/../DatabaseService.php';
require_once __DIR__.'/../../models/User.php';

class UserReadService {

    public static function getUsername($id) {
        $stmt = DatabaseService::database()->prepare(
            "SELECT username FROM blog_user WHERE id = :id;"
        );
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? $result['username'] : null;
    }
}

?>