<?php

require_once __DIR__.'/../services/api/PostReadService.php';
require_once __DIR__.'/../services/api/PostWriteService.php';

class BlogController {
    public function retrieve_all_posts() {
        return json_encode(PostReadService::all_posts());
    }

    public function retrieve_post($id) {
        $post = PostReadService::get_post($id);
        // If found, encode the post data in json
        if ($post) {
             return json_encode($post);
        } else {
            http_response_code(404);
            return json_encode([
                'error' => 'Post not found'
            ]);
        }
    }

    public function delete_post($id) {
        $post = PostReadService::get_post($id);
        // If found, encode the post data in json
        if ($post) {
            PostWriteService::delete_post($post);
            return json_encode($post);
        } else {
            http_response_code(404);
            return json_encode([
                'status' => 'Post not found'
            ]);
        }
    }

    public function update_post($id) {
        $post = PostReadService::get_post($id);
        // If found, encode the post data in json
        if ($post) {
            PostWriteService::update_post($post);
            return json_encode($post);
        } else {
            http_response_code(404);
            return json_encode([
                'error' => 'Post not found'
            ]);
        }
    }

    public function create_new_post() {
        $post_data = json_decode(file_get_contents('php://input'), true);
        $post_id = PostWriteService::create_post($post_data);

        return json_encode([
            'status' => 'Post created',
            'post_id' => $post_id
        ]);
    }
}

?>
