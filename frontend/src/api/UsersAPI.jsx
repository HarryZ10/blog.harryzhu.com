import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://10.10.10.25:80';

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
    navigate("/");
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
