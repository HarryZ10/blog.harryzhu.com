<?php

require_once __DIR__.'/../services/api/PostReadService.php';
require_once __DIR__.'/../services/api/PostWriteService.php';
require_once __DIR__.'/../services/api/CommentWriteService.php';

class FeedService {

    // Posts Feed Service

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
                'error' => 'Post not found'
            ]);
        }
    }

    public function removeBlogPost($id, $requestorUserId) {
        $content = PostReadService::fetchPost($id);
        // If found, encode the post data in json
        if ($content) {
            PostWriteService::deletePost($content, $requestorUserId);
            return json_encode($content);
        } else {
            http_response_code(404);
            return json_encode([
                'status' => 'Post not found'
            ]);
        }
    }

    public function editBlogPost($id) {
        $content = json_decode(file_get_contents('php://input'), true);
        // If found, encode the post data in json
        if ($content) {
            PostWriteService::updatePost($content);
            return json_encode($content);
        } else {
            http_response_code(404);
            return json_encode([
                'error' => 'Post not found'
            ]);
        }
    }

    public function makeBlogPost() {
        $content = json_decode(file_get_contents('php://input'), true);

        if ($content["post_text"]) {

            if (strlen($content["post_text"]) <= 150) {
                $id = PostWriteService::createPost($content);

                return json_encode([
                    'status' => 'Post created',
                    'post_id' => $id
                ]);
            } else {
                return json_encode([
                    'error' => 'Character limit exceeded',
                ]);  
            }
        } else {
            return json_encode([
                'error' => 'No post content',
            ]); 
        }
    }

    // Comments Feed Service

    public function addComment() {
        $content = json_decode(file_get_contents('php://input'), true);
        $id = PostWriteService::addCommentOnPost($content);

        return json_encode([
            'status' => 'Comment created',
            'comment_id' => $id
        ]);
    }

    public function listComments() {
        return json_encode(
            PostReadService::retrieveCommentsOnPost()
        );
    }

    public function editComment() {
        $content = json_decode(file_get_contents('php://input'), true);
        // If found, encode the comment data in json
        if ($content) {
            CommentWriteService::updateComment($content);
            return json_encode($content);
        } else {
            http_response_code(404);
            return json_encode([
                'error' => 'Comment not found'
            ]);
        } 

    }

    public function deleteComment($id) {
        $content = PostReadService::fetchComment($id);
        // If found, encode the post data in json
        if ($content) {
            CommentWriteService::deleteComment($content);
            return json_encode($content);
        } else {
            http_response_code(404);
            return json_encode([
                'status' => 'Post not found'
            ]);
        }
    }

}

?>
