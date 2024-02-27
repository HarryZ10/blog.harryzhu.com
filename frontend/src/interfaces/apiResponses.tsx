// src/interfaces/apiResponses.tsx
import { ExtraInfo, PreprocessedPost } from "./post";

export interface RegisterResponse {
    status: string;
}

export interface LoginResponse {
    status: string;
    token: string;
}

export interface RetrieveUsernameResponse {
    status: string;
    username: string;
}

export interface CreatePostResponse {
    status: string;
    post_id: string;
}

export interface UpdateCommentResponse {
    comment_id: string;
    status: string;
}

export interface PostsResponse {
    results: PreprocessedPost[],
    status: string;
}
