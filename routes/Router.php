<?php
require_once __DIR__.'/../services/FeedService.php';
require_once __DIR__.'/../services/AuthService.php';

class Router {

    // instance of a blog controller that will communicate with the database service
    private $feed;

    // auth service
    private $authenticator;

    // constructor for the Router that initializes the blog controller service
    // that performs CRUD operations for posts and comments
    public function __construct() {
        $this->feed = new FeedService();
        $this->authenticator = new AuthService();
    }

    public function handle_request() {
        $uri = $_SERVER['REQUEST_URI'];
        $method = $_SERVER['REQUEST_METHOD'];
        $token = $this->getTokenFromReqBody();

        // Secured endpoints
        $endpoints_to_gatekeep = ['/posts', '/comments'];
        
        // Extract the base endpoint from the URI
        // Skip past primary domain and prepend '/'
        $base_uri = '/' . explode('/', $uri)[1];
        $is_secured = in_array($base_uri, $endpoints_to_gatekeep);

        // Check for token on secured endpoints
        if ($is_secured && !$this->authenticator->isAliveToken($token)) {
            http_response_code(401);
            echo json_encode(['status' => 'Unauthorized']);
            return "Unauthorized";
        }

        if ($method == "POST" && $uri == "/login") {
            echo $this->authenticator->login();
        }

        // Retrieves all posts
        // GET /posts
        elseif ($method == 'GET' && $uri == '/posts') {
            if ($token !== null) {
                echo $this->feed->retrieveBlogFeed();
            }
        }

        // Retrieve post by identifier
        // GET /posts/:id
        elseif ($method == 'GET' && preg_match('/\/posts\/(\d+)/', $uri, $matches)) {
             echo $this->feed->retrieveBlogPost($matches[1]);
        }

        // Creates a post
        // POST /posts
        elseif ($method == 'POST' && $uri == '/posts') {
            echo $this->feed->makeBlogPost();
        }

        // Deletes a post
        // DELETE /posts/:id
        elseif ($method == 'DELETE' && preg_match('/\/posts\/(\d+)/', $uri, $matches)) {
            echo $this->feed->removeBlogPost($matches[1]);
        }

        // Edits/updates a post
        // PUT /posts/:id
        elseif ($method == 'PUT' && preg_match('/\/posts\/(\d+)/', $uri, $matches)) {
            echo $this->feed->editBlogPost($matches[1]);
        }

        // Add comment to a post by identifier
        // POST /posts/:id/comments
        elseif ($method == 'POST' && preg_match('\/posts\/(\d+)\/comments', $uri, $matches)) {
            // todo
        }

        // Retrieve all comments for a post.
        // GET /posts/:id/comments
        elseif ($method == 'GET' && preg_match('\/posts\/(\d+)\/comments', $uri, $matches)) {
            // todo
        }

        // Update a comment
        // PUT /comments/:id
        elseif ($method == 'GET' && preg_match('/\/comments\/(\d+)/', $uri, $matches)) {
            // todo
        }

        // Delete a comment
        // DELETE /comments/:id
        elseif ($method == 'GET' && preg_match('/\/comments\/(\d+)/', $uri, $matches)) {
            // todo
        }

        else {
            http_response_code(404);
            echo json_encode(['error' => 'Resource not found']);
            return "Failed";
        }

        return "Success";
    }

    function getTokenFromReqBody() {
        // Initialize the JWT variable
        $token = null;

        // ONLY if the Authorization header is present
        $headers = getallheaders();

        $authHeader = null;
        foreach ($headers as $key => $val) {
            // finds the authorization header
            if (strtolower($key) == 'authorization') {
                $authHeader = $val;
            }
        }

        // given a auth header we can look for the bearer token
        if ($authHeader) {
            $header = $headers['Authorization'];

            // Split the Authorization header into 2 segments
            $parts = explode('Bearer', $header, 2);

            // Must have 2 segments "Bearer <token>"
            if (count($parts) === 2) {
                $token = $parts[1];
            }
        }

        return $token;
    }
}

?>
