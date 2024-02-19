// src/interfaces/apiResponses.tsx

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

