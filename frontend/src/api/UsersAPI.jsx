import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://web.cs.georgefox.edu/~hzhu20/api/v1';

export const getUsername = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('token')}`
            },
        });
        if (!response.ok) {
            throw new Error('No username found');
        }
        const resp = await response.json();
        return resp.username
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
};

// Login
export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        });
        if (!response.ok) {
            throw new Error('Error logging in');
        }
        const resp = await response.json();
        const token = resp.token;
        Cookies.set('token', token, {
            secure: false
        });

    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
};

export const Logout = () => {
    const navigate = useNavigate();
    Cookies.remove('token');
    
    // Wait for a short time before navigating
    setTimeout(() => {
        navigate("/~hzhu20/");
    }, 500); // delay in milliseconds
}

// Register
export const register = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        });
        if (!response.ok) {
            throw new Error('Error registering');
        }

        return await response.json();

    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
};
