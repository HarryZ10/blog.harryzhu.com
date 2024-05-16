<?php
require_once __DIR__.'/../services/DatabaseService.php';
require_once __DIR__.'/api/UserRegisterService.php';
require_once __DIR__.'/api/UserReadService.php';
// require __DIR__ . '/../../../vendor/autoload.php';
// Dotenv\Dotenv::createUnsafeImmutable(__DIR__ . '/../../')->load();

class AuthService {

    private $secretKey;

    public function __construct() {
        $this->secretKey = "AVNS_eWZAyM34bR24zjgYhg3";
    }

    public function retrieveAllUsers() {
        $result = UserReadService::getAllUsersFromDB();
        if (isset($result)) {
            return json_encode([
                "results" => $result,
                "message" => "Success"
            ]);
        } else {
            return json_encode([
                "results" => null,
                "message" => "Failed"
            ]);
        }
    }

    public function retrieveUsername($id) {
        $result = null;
        // Check if 'id' is set
        if ($id) {
            $username = UserReadService::getUsername($id);
            http_response_code(200);
            $result = json_encode([
                "username" => $username,
                'message' => "Success"
            ]);
        } else {
            http_response_code(404);
            $result = json_encode([
                'message' => "Not found",
                "username" => ""
            ]);
        }

        return $result;
    }

    public function register() {
        $response = null;
        $json_str = file_get_contents('php://input');
        $data = json_decode($json_str, true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        if (!empty($username) and !empty($password)) {

            if (!UserRegisterService::checkUsername($username)) {
                // write to database
                http_response_code(200);

                $result = UserRegisterService::addUser($username, $password);
                if ($result == "Success") {
                    $response = json_encode(['message' => "Success"]);
                } else {
                    $response = json_encode([
                        'message' =>  $result,
                    ]);
                }
            } else {
                http_response_code(500);
                $response = json_encode(['message' => "Username already exists"]); 
            }

        } else {
            http_response_code(500);
            $response = json_encode(['message' => "Username invalid"]);
        }

        return $response;
    }

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
                $result = json_encode([
                    "token" => $token,
                    'message' => "Success"
                ]);
            } else {
                // we need to send a 401 error
                http_response_code(401);
                $result = json_encode(['message' => "Unauthorized"]);
            }
        } else {
            http_response_code(500);
            $result = json_encode(['message' => "Cannot leave fields blank"]);
        }

        return $result;
    }

    // Here, adds logic to validate and store the user's credentials
    // and verifying the provided password against the stored hash
    private function validateUserCredentials($username, $password) {
        $result = null;
        $stmt = DatabaseService::database()->prepare("SELECT id, username, password FROM blog_user WHERE username = ?");
        $stmt->execute([$username]);

        // gets the user data in a dictionary format in this mode FETCH_ASSOC
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // verifies the hash of the password stored in our database and provided password
        if (isset($user) && password_verify($password, $user['password'])) {
            $result = $user;
        } else {
            $result = false;
        }

        return $result;
    }

    // Generate a token based on the user information provided
    // and then return a token string
    private function generateJWTToken($user) {
        // Save current time
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

    public function decodeJWT($jwt) {
        // Split the JWT string into its three parts
        $parts = explode('.', $jwt);

        // Decode the segments for Header and Payload
        if(count($parts) === 3) {

            $header = json_decode(
                $this->base64UrlDecode($parts[0]), true
            );
            $payload = json_decode(
                $this->base64UrlDecode($parts[1]), true
            );

            return [
                'header' => $header,
                'payload' => $payload
            ];

        } else {
            return 'Invalid JWT';
        }
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
            $base64UrlHeader = $this->base64UrlEncode(json_encode($header));

            // Convert the given payload back into a json object, then URL encode it
            $base64UrlPayload = $this->base64UrlEncode(json_encode($payload));

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
                    $isValid = $payload;
                }
            }
        }

        return $isValid;
    }
}

?>
