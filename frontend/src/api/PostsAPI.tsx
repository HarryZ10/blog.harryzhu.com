// src/api/PostsAPI.js
import Cookies from "js-cookie";
import { CreatePostResponse, UpdateCommentResponse, PostsResponse } from "../interfaces/apiResponses";
import { CreatePostData } from "../interfaces/post";

const API_BASE_URL = process.env.REACT_APP_API_ROOT|| 'http://10.10.10.25:80';

// Get all posts
export const getAllPosts = async (): Promise<PostsResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
        });

        const data: PostsResponse = await response.json();
        return data;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to fetch posts');
    }
};

// Get a single post by ID
export const getPostById = async (id: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${id}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                },
            }
        );
        if (!response.ok) {
            alert('Error fetching post');
        }

        return await response.json();

    } catch {
        console.error(`Something went wrong`);
    }
};

// Create a new post
export const createPost = async (data: CreatePostData): Promise<CreatePostResponse> => {

    const response: CreatePostResponse = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify(data),

    }).then(res => {
        return res.json();
    })
    .catch(err => console.error(err));

    if (response.status !== "Post created") {
        alert('Error creating post');
    }

    return response;
};

// Update an existing post
export const updatePost = async (data: CreatePostData): Promise<UpdateCommentResponse> => {

    const response: UpdateCommentResponse = await fetch(`${API_BASE_URL}/posts/${data.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({
            ...data,
            token: Cookies.get('token'),
        }), 
    }).then((res) => {
        return res.json();
    }).catch(err => {
        alert("Something went wrong");
    })
    
    if (response.status !== "Post updated") {
        alert("Something went wrong with updating post");
    }
    return response;
};

// Delete an existing post
export const deletePost = async (id: string, userId: string) => {

    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({
            "user_id": userId,
            "id": id,
            "token": Cookies.get('token')
        })

    }).then(res => {
        return res.json();
    }).catch(err => {
        console.error(err)
    })

    if (response.status !== "Success") {
        alert("Unauthorized");
    }

    return response;
};
