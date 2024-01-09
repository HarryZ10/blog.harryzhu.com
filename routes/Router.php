<?php
require_once 'BlogController.php';

class Router {
    // instance of the blog controller that will communicate with the database service
    private $blog;

    // constructor for the Router that initializes the blog controller service
    // that performs CRUD operations for posts and comments
    public function __construct() {
        $this->blog = new BlogController();
    }

    public function handle_request() {
        $uri = $_SERVER['REQUEST_URI'];
        $method = $_SERVER['REQUEST_METHOD'];

        // Retrieves all posts
        // GET /posts
        if ($method == 'GET' && $uri == '/posts') {
            echo $this->blog->retrieve_all_posts();
        }

        // Retrieve post by identifier
        // GET /posts/:id
        elseif ($method == 'GET' && preg_match('/\/posts\/(\d+)/', $uri, $matches)) {
             echo $this->blog->retrieve_post($matches[1]);
        }

        // Creates a post
        // POST /posts
        elseif ($method == 'POST' && $uri == '/posts') {
            echo $this->blog->create_new_post();
        }

        // Deletes a post
        // DELETE /posts/:id
        elseif ($method == 'DELETE' && preg_match('/\/posts\/(\d+)/', $uri, $matches)) {
            echo $this->blog->delete_post($matches[1]);
        }

         // Edits/updates a post
        // PUT /posts/:id
        elseif ($method == 'PUT' && preg_match('/\/posts\/(\d+)/', $uri, $matches)) {
            echo $this->blog->update_post($matches[1]);
        }

        else {
            http_response_code(404);
            echo json_encode(['error' => 'Resource not found']);
            return "Failed";
        }

        return "Success";
    }
}

?>
