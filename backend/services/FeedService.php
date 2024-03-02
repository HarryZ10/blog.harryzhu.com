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
        $status = [
            'status' => 'Success'
        ];

        return json_encode([
            ...$status,
            'results' => PostReadService::fetchAllPosts()
        ]);
    }

    public function retrieveUserPosts($userId) {
        $status = [
            'status' => 'Success'
        ];

        return json_encode([
            ...$status,
            'results' => PostReadService::fetchAllUserPosts($userId)
        ]);
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

    public function removeBlogPost($id, $token) {

        $decoded = $this->authenticator->decodeJWT($token);
        $payload = $decoded['payload'];
        $requestorUserId = $payload['user_id'];
        
        $userInfo = [
            'user_id' => $requestorUserId,
            'token' => $token,
            'post_id' => $id
        ];

        if ($this->isValidContentAndUser($userInfo, $this->authenticator)) {
            $status = PostWriteService::deletePost($userInfo);
            if ($status == "Success") {
                return json_encode([
                    'status' => 'Success'
                ]);
            }
        }
        
        http_response_code(403);
        return json_encode([
            'status' => 'Unauthorized'
        ]);
    }

    public function editBlogPost($id) {
        $status = [
            'status' => 'Post updated'
        ];

        $content = json_decode(file_get_contents('php://input'), true);

        if ($this->isValidContentAndUser($content, $this->authenticator)) {
            if (strlen($content["post_text"]) <= 150) {
                PostWriteService::updatePost($content);
                return json_encode([
                    ...$status,
                ]);
            } else {
                http_response_code(403);
                // Prepare error response for character limit exceeded
                $response['status'] = 'Character limit exceeded';
            }
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
        ];

        if ($this->isValidContentAndUser($content, $this->authenticator)) {
            // Check if post text exists in the content
            if (isset($content["post_text"])) {
                // Check if post text length is within the limit
                if (strlen($content["post_text"]) <= 150) {
                    // Create post and prepare success response
                    $result = PostWriteService::createPost($content);

                    if ($result == "Success") {
                        $response = [
                            'status' => 'Post created',
                        ];
                    } else {
                        $response = [
                            'status' => $result,
                        ];
                    }
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
