// src/api/CommentsAPI.js
import Cookies from "js-cookie";
require('dotenv').config()

const API_BASE_URL = process.env.REACT_APP_API_ROOT;

// Add comment to post
export const addComment = async (post_id, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${post_id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Error creating post");
        } else {
            return await response.json();
        }

    } catch (err) {
        console.error("Error: ", err);
    }
};

// Get comments by post id
export const getCommentsByPostId = async (post_id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${post_id}/comments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('token')}`
            },
        });

        if (!response.ok) {
            throw new Error("Error getting post");
        } else {
            return await response.json();
        }

    } catch (err) {
        console.error("Error: ", err);
    }
};
