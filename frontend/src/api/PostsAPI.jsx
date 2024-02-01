// src/api/PostsAPI.js
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = 'http://10.10.10.25:80';

// Get all posts
export const getAllPosts = async () => {

    try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('token')}`
            },
        });
        return await response.json();
    } catch (err) {
        console.error('Error:', err);
     }
};

// Get a single post by ID
export const getPostById = async (id) => {
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
            throw new Error('Error fetching post');
        }
        return await response.json();
    } catch (err) {
        console.error('Error:', err);
    }
};

// Create a new post
export const createPost = async (data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Error creating post');
        }
        return await response.json();
    } catch (err) {
        console.error('Error: ', err);
    }
};

// Update an existing post
export const updatePost = async (id, updatedData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
            throw new Error('Error updating post');
        }
        return await response.json();
    } catch (err) {
        console.error('Error:', err);
    }
};    

// Delete an existing post
export const deletePost = async (id, userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('token')}`
            },
            body: {
                "user_id": userId,
                "id": id,
                "token": Cookies.get('token')
            }
        });
        if (!response.ok) {
            alert("Unauthorized");
            return "Error";
        }
        return await response.json();
    } catch (err) {
        console.error('Error:', err);
    }
};
