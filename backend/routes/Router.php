<?php
require_once __DIR__.'/../services/FeedService.php';
require_once __DIR__.'/../services/AuthService.php';
require __DIR__ . '/../../vendor/autoload.php';

Dotenv\Dotenv::createUnsafeImmutable(__DIR__ . '/../../')->load();

/**
 * Router implementation that handles requests that uses an in-house feed and login service
 */
class Router {

    // Both instances are used to interact with the database,
    // and public interfaces should not.
    private $feed;                      // Blog Feed CRUD Service
    private $authenticator;             // Authentication Service

    // Constructor for the Router that initializes the blog controller service
    // that performs CRUD operations for posts and comments
    public function __construct() {
        $this->feed = new FeedService();
        $this->authenticator = new AuthService();
    }

    /**
     * Handles all GET, PUT, DELETE, and POST authenticated/all requests
     */
    public function handleRequest() {
        $uri = $_SERVER['REQUEST_URI'];
        $method = $_SERVER['REQUEST_METHOD'];
        $token = $this->getTokenFromReqBody();
        $uriArray = explode('/', $uri);

        $startingIndex = 1;

        if ($_ENV['CLASS_MODE'] !== 'false') {
            // Ensure URI starts with /api/v1
            if (substr($uri, 0, 15) !== '/~hzhu20/api/v1') {
                header('HTTP/1.1 400 Bad Request');
                echo json_encode([
                    'status' => 'Invalid endpoint'
                ]);
                exit;
            }

            $startingIndex = 4;

            // Skip past primary domain and "/~hzhu20/api/v1" and prepend '/'
            $base_uri = '/' . $uriArray[$startingIndex];

        } else {
            // Ensure URI starts with /api/v1
            if (substr($uri, 0, 7) !== '/api/v1') {
                header('HTTP/1.1 400 Bad Request');
                echo json_encode([
                    'status' => 'Invalid endpoint'
                ]);
                exit;
            }

            $startingIndex = 3;
            // Skip past primary domain and "/api/v1" and prepend '/'
            $base_uri = '/' . $uriArray[$startingIndex];;
        }

        // Secured endpoints
        $endpoints_to_gatekeep = ['/posts', '/comments', "/users", "/profile"];

        $is_secured = in_array($base_uri, $endpoints_to_gatekeep);

        // Check for token on secured endpoints
        if ($is_secured && !$this->authenticator->isAliveToken($token)) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized']);
            exit(1);
        }

        if ($method == "POST" && $base_uri == "/login") {
            echo $this->authenticator->login();
        }

        elseif ($method == "POST" && $base_uri == "/register") {
            echo $this->authenticator->register();
        }

        // Add comment to a post by identifier
        // POST /posts/:id/comments
        elseif ($method == 'POST' && $base_uri == "/posts" && is_numeric($uriArray[$startingIndex + 1])
            && $uriArray[$startingIndex + 2] == "comments"
        ) {
            echo $this->feed->addComment();
        }

        // Retrieve username from id
        // GET /users/:id
        elseif ($method == 'GET' && $base_uri == "/users" && is_numeric($uriArray[$startingIndex + 1])) {
            echo $this->authenticator->retrieveUsername($uriArray[$startingIndex + 1]);
        }

        // Retrieve all comments for a post.
        // GET /posts/:id/comments
        elseif ($method == 'GET' && $base_uri == "/posts" && is_numeric($uriArray[$startingIndex + 1])
            && $uriArray[$startingIndex + 2] == "comments"
        ) {
            echo $this->feed->listComments($uriArray[$startingIndex + 1]);
        }

        // Retrieve post by identifier
        // GET /posts/:id
        elseif ($method == 'GET' && $base_uri == "/posts" && is_numeric($uriArray[$startingIndex + 1])) {
            echo $this->feed->retrieveBlogPost($uriArray[$startingIndex + 1]);
        }

        // Creates a ost
        // POST /posts
        elseif ($method == 'POST' && $base_uri == '/posts') {
            echo $this->feed->makeBlogPost();
        }

        // Deletes a post
        // DELETE /posts/:id
        elseif ($method == 'DELETE'
            && $base_uri == "/posts"
            && is_numeric($uriArray[$startingIndex + 1])
        ) {
            echo $this->feed->removeBlogPost(
                $uriArray[$startingIndex + 1],
                $token
            );
        }

        // Edits/updates a post
        // PUT /posts/:id
        elseif ($method == 'PUT'
            && $base_uri == "/posts"
            && is_numeric($uriArray[$startingIndex + 1])
        ) {
            echo $this->feed->editBlogPost($uriArray[2]);
        }

        // Update a comment
        // PUT /comments/:id
        elseif ($method == 'PUT'
            && $base_uri == "/comments"
            && is_numeric($uriArray[$startingIndex + 1])
        ) {
            echo $this->feed->editComment();
        }

        // Delete a commenti
        // DELETE /comments/:id
        elseif ($method == 'DELETE'
            && $base_uri == "/comments"
            && is_numeric($uriArray[$startingIndex + 1])
        ) {
            echo $this->feed->deleteComment(
                $uriArray[$startingIndex + 1],
                $token
            );
        }

        // Retrieves all posts
        // GET /posts
        elseif ($method == 'GET' && $base_uri == '/posts') {
            echo $this->feed->retrieveBlogFeed();
        }

        // Retrieves profile feed
        // GET /profile/me
        elseif ($method == 'GET'
            && $base_uri == '/profile'
            && $uriArray[$startingIndex + 1] == "me") {

            $decoded = $this->authenticator->decodeJWT($token);
            $userId = $decoded['payload']['user_id'];
            echo $this->feed->retrieveUserPosts($userId);
        }

        else {
            http_response_code(404);
            echo json_encode([
                'error' => "Resource not found",
            ]);
            exit(1);
        }

        return "Success";
    }

    function getTokenFromReqBody() {
        $token = null;
        $authHeader = null;
        $headers = getallheaders();

        foreach ($headers as $key => $val) {
            if (strtolower($key) == 'authorization') {
                $authHeader = $val;
            }
        }

        // Given a auth header we can look for the bearer token
        if ($authHeader) {
            $header = $headers['Authorization'];

            // Split the Authorization header into 2 segments
            $parts = explode('Bearer', $header, 2);
            if (count($parts) === 2) $token = $parts[1];
        }
        return $token;
    }

}

?>
