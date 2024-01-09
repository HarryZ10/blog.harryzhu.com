<?php

require_once __DIR__.'/services/api/LoginService.php';

class LoginController {

    private $db = null;
    private $secret_key = "";

    public function __construct($db_conn) {
        $this->db = $db_conn;
    }

    public function login() {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';

        // todo validation logic


    }

    // Here, adds logic to validate and store the user's credentials
    // and verifying the provided password against the stored hash
    private function validate_user_credentials($username, $password) {
        $stmt = $this->db->prepare("SELECT id, username, password FROM blog_user WHERE username = ?");
        $stmt->execute([$username]);

        // gets the user data in a dictionary format in this mode FETCH_ASSOC
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // verifies the hash of the password stored in our database and provided password
        $user_or_validation = $user ? (isset($user) && password_verify($password, $user['password'])) : false;

        // Return user data or false if validation fail
        return $user_or_validation;
    }

    private function generate_user_token($user) {
        $token_issued_at = time();
        // token should be valid for 1 hour for security purposes
        $expiration_time = 3600 + $token_issued_at;
        $data_payload = array(
            'user_id' => $user['id'],
            'username' => $user['username'],
            'exp' => $expiration_time,
            'iat' => $token_issued_at
        );


        $token = null;

        // TODO JWT::encode($data_payload, $this->secretKey);
        return $token;
    }


}

?>
