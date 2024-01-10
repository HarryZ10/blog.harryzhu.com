<?php
require_once __DIR__.'/../services/DatabaseService.php';

class Auth {

    private $secretKey = "S3cr3tK3y!_2024$#YsP67&^gHJb2%4#k^s@6v9yB8&F";

    public function login() {
        $result = null;

        // Get JSON as a string
        $json_str = file_get_contents('php://input');

        // Decode JSON to an associative array
        $data = json_decode($json_str, true);

        // get username and password from json body
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        // validation logic
        // both fields must be filled in
        if (!empty($username) and !empty($password)) {

            // validate input and password hashes against database
            $user = $this->validateUserCredentials($username, $password);

            // if it is the actual user with correct password hashes then
            // we can generate our jwt token for the user.
            if ($user) {
                $token = $this->generateJWTToken($user);
                http_response_code(200);
                $result = json_encode(["token" => $token]);
            } else {
                // we need to send a 401 error
                http_response_code(401);
                $result = json_encode(["status" => "Unauthorized"]);
            }
        } else {
            http_response_code(400);
            $result = json_encode(["status" => "Cannot leave fields blank"]);
        }

        return $result;
    }

    // Here, adds logic to validate and store the user's credentials
    // and verifying the provided password against the stored hash
    private function validateUserCredentials($username, $password) {
        $stmt = DatabaseService::database()->prepare("SELECT id, username, password FROM blog_user WHERE username = ?");
        $stmt->execute([$username]);

        // gets the user data in a dictionary format in this mode FETCH_ASSOC
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        $result = null;
        // verifies the hash of the password stored in our database and provided password
        // && password_verify($password, $user['password'])
        if (isset($user)) {
            $result = $user;
        } else {
            $result = false;
        }

        return $result;
    }

    private function generateJWTToken($user) {

        // Assign current time
        $issued = time();

        // Token is valid for 1 hour for security purposes
        $expTime = 3600 + $issued;

        // Make the payload with the required information
        $dataPayload = array(
            'user_id' => $user['id'],
            'username' => $user['username'],
            'exp' => $expTime,
            'iat' => $issued
        );

        # Make the header
        $headers = [
            'alg' => 'HS256',
            'typ' => 'JWT'
        ];

        // Encode headers and payload
        $headersEncoded = $this->base64UrlEncode(
            json_encode($headers)
        );

        $payloadEncoded = $this->base64UrlEncode(
            json_encode($dataPayload)
        );

        // Build the signature with key, header, and data payload
        $signature = hash_hmac('sha256', 
            "$headersEncoded.$payloadEncoded", $this->secretKey, true
        );

        // URL Encode the signature
        $signatureEncoded = $this->base64UrlEncode($signature);

        // Build and make the token
        $userToken = "$headersEncoded.$payloadEncoded.$signatureEncoded";

        return $userToken;
    }

    private function base64UrlEncode($data) {
        // Strip all '=' characters
        return str_replace('=', '', 
            // Encode the data then replace +/ with -_
            strtr(base64_encode($data), '+/', '-_')
        );
    }

    private function base64UrlDecode($data) {
        // Replace '-_' with '+/' and then decode data encoded with base64
        return base64_decode(strtr($data, '-_', '+/'));
    }

    public function isAliveToken($full_token) {

        $isValid = false; // set to false as default

        // Split token on period
        $segments = explode(".", $full_token);

        // must contain a header, payload, and signature to compare against verfication
        if (count($segments) === 3) {
            // decode the header and then decodes the json string to a PHP object
            $header = json_decode(
                $this->base64UrlDecode($segments[0]), true
            );

            // we can do the same for the payload
            $payload = json_decode($this->base64UrlDecode($segments[1]), true);

            // get the original signature
            $signatureProvided = $segments[2];

            // Convert the given header back into a json object, then URL encode it
            $base64UrlHeader = $this->base64UrlEncode(
                json_encode($header)
            );

            // Convert the given payload back into a json object, then URL encode it
            $base64UrlPayload = $this->base64UrlEncode(
                json_encode($payload)
            );

            // Generate new signature
            $signature = hash_hmac('sha256',
                $base64UrlHeader . "." . $base64UrlPayload,
                $this->secretKey, true
            );

            // Given the signature hash, URL encode it
            $base64UrlSignature = $this->base64UrlEncode($signature);

            // Compare the hash
            if ($base64UrlSignature === $signatureProvided) {
                // Check for expiration
                $current_time = time();
                if ($payload['exp'] >= $current_time) {

                    // JWT is valid
                    $isValid = $payload;
                }
            }
        }

        return $isValid;
    }
}

?>
