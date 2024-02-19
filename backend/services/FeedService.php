<?php

require_once __DIR__.'/../services/api/PostReadService.php';
require_once __DIR__.'/../services/api/PostWriteService.php';
require_once __DIR__.'/../services/api/CommentWriteService.php';
require_once __DIR__.'/AuthService.php';

class FeedService {

    private $authenticator; // Authentication Service

    // Constructor for the Feed Services that initializes the authentication service
    public function __construct() {
        $this->authenticator = new AuthService();
    }

    public function retrieveBlogFeed() {
        return json_encode(PostReadService::fetchAllPosts());
    }

    public function retrieveBlogPost($id) {
        $content = PostReadService::fetchPost($id);
        // If found, encode the post data in json
        if ($content) {
             return json_encode($content);
        } else {
            http_response_code(404);
            return json_encode([
                'status' => 'Post not found'
            ]);
        }
    }

    public function removeBlogPost($id, $requestorUserId) {
        $content = PostReadService::fetchPost($id);

        if ($this->isValidContentAndUser($content, $this->authenticator)) {
            PostWriteService::deletePost($content, $requestorUserId);
            return json_encode([
                'status' => 'Success'
            ]);
        } else {
            http_response_code(403);
            return json_encode([
                'status' => 'Unauthorized'
            ]);
        }
    }

    public function editBlogPost($id) {
        $content = json_decode(file_get_contents('php://input'), true);

        if ($this->isValidContentAndUser($content, $this->authenticator)) {
                PostWriteService::updatePost($content);
                return json_encode($content);
        } else {
            http_response_code(403);
            return json_encode([
                'status' => 'Unauthorized'
            ]);
        }
    }

    public function makeBlogPost() {
        $content = json_decode(file_get_contents('php://input'), true);

        // Initialize response array
        $response = [
            'status' => 'Unauthorized',
            'post_id' => ''
        ];

        if ($this->isValidContentAndUser($content, $this->authenticator)) {
            // Check if post text exists in the content
            if (isset($content["post_text"])) {
                // Check if post text length is within the limit
                if (strlen($content["post_text"]) <= 150) {
                    // Create post and prepare success response
                    $id = PostWriteService::createPost($content);
                    $response = [
                        'status' => 'Post created',
                        'post_id' => $id
                    ];
                } else {
                    http_response_code(403);
                    // Prepare error response for character limit exceeded
                    $response['status'] = 'Character limit exceeded';
                }
            }
        } else {
            http_response_code(403);
            $response['status'] = 'Unauthorized';
        }

        // Return the JSON-encoded response
        return json_encode($response);
    }

    // Comments Feed Service

    public function addComment() {
        $content = json_decode(file_get_contents('php://input'), true);
        $response = json_encode([
            'status' => 'Unauthorized'
        ]);

        if ($this->isValidContentAndUser($content, $this->authenticator)) {

            if ($content["comment_text"]) {
                if (strlen($content["comment_text"]) <= 150) {
                    // Add comment info to database
                    PostWriteService::addCommentOnPost($content);
                    $response = json_encode(['status' => 'Success']);
                } else {
                    http_response_code(403);
                    $response['status'] = 'Character limit exceeded';
                }
            }
        } else {
            http_response_code(403);
            $response['status'] = 'Unauthorized';
        }

        return $response;
    }

    public function listComments($post_id) {
        return json_encode(
            PostReadService::retrieveCommentsOnPost($post_id)
        );
    }

    public function editComment() {
        $content = json_decode(file_get_contents('php://input'), true);
        $response = json_encode([
            'status' => 'Unauthorized',
            'comment_id' => ''
        ]);

        if ($this->isValidContentAndUser($content, $this->authenticator)) {

            CommentWriteService::updateComment($content);
            $response = json_encode([
                'status' => "Success",
                'comment_id' => $content['id']
            ]);

        } else {
            http_response_code(403);
            $response['status'] = 'Unauthorized';
        }

        return $response;

    }

    public function deleteComment($id) {
        $content = PostReadService::fetchComment($id);
        // If found, encode the post data in json
        if ($this->isValidContentAndUser($content, $this->authenticator)) {
            CommentWriteService::deleteComment($content);
            return json_encode($content);
        } else {
            http_response_code(403);
            return json_encode([
                'status' => 'Unauthorized'
            ]);
        }
    }

    private function isValidContentAndUser($content, $authenticator) {
        $isValid = false;

        // if content exists and token is set
        if ($content && isset($content['token'])) {

            // Decode the token to get payload
            $decodedToken = $authenticator->decodeJWT($content["token"]);

            // Check if 'user_id' is set in the decoded token's payload and matches the user ID in the content
            if (isset($decodedToken['payload']['user_id']) 
                and $decodedToken['payload']['user_id'] == $content["user_id"]) {

                $isValid = true; // update result
            }
        }

        return $isValid;
    }

}

?>
