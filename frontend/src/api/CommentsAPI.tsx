// src/api/CommentsAPI.js
import Cookies from "js-cookie";

interface CommentData {
  user_id: string;
  post_id: string;
  comment_text: string;
  token: string | undefined;
}

const API_BASE_URL = process.env['REACT_APP_API_ROOT'];

// Add comment to post
export const addComment = async (post_id: string, data: CommentData) => {
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
            alert("Error creating comment");
        } else {
            return await response.json();
        }

    } catch (err) {
        console.error("Error: ", err);
    }
};

// Get comments by post id
export const getCommentsByPostId = async (post_id: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${post_id}/comments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('token')}`
            },
        });

        if (!response.ok) {
            alert("Error getting post");
        } else {
            return await response.json();
        }

    } catch (err) {
        console.error("Error: ", err);
    }
};
