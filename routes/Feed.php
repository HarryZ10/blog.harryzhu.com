<?php

require_once __DIR__.'/../services/api/PostReadService.php';
require_once __DIR__.'/../services/api/PostWriteService.php';

class Feed {
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

    public function removeBlogPost($id) {
        $content = PostReadService::fetchPost($id);
        // If found, encode the post data in json
        if ($content) {
            PostWriteService::deletePost($content);
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
        $id = PostWriteService::createPost($content);

        return json_encode([
            'status' => 'Post created',
            'post_id' => $id
        ]);
    }
}

?>
