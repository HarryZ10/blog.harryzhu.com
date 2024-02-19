// src/api/PostsAPI.js
import Cookies from "js-cookie";
import { CreatePostResponse, UpdateCommentResponse } from "../interfaces/apiResponses";
import { CreatePostData } from "../interfaces/post";

const API_BASE_URL = process.env['REACT_APP_API_ROOT'];

// Get all posts
export const getAllPosts = async () => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
    }).then(res => {
        return res.json();
    }).catch(err => {
        console.error(err);
    });

    return response;
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

    if (response.status !== "Success") {
        alert('Error creating post');
    }

    return response;
};

// Update an existing post
export const updatePost = async (id: string, updatedData: string): Promise<UpdateCommentResponse> => {

    const response: UpdateCommentResponse = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify(updatedData),
    }).then((res) => {
        return res.json();
    }).catch(err => {
        alert("Something went wrong");
    })
    
    if (response.status !== "Success") {
        alert("Something went wrong");
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
