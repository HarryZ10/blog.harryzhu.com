import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { 
    RetrieveUsernameResponse,
    RegisterResponse,
    LoginResponse
} from '../interfaces/apiResponses';

const API_BASE_URL = process.env['REACT_APP_API_ROOT'];

export const getUsername = async (id: string): Promise<string> => {

    const response: RetrieveUsernameResponse = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
    }).then(resp => {
        return resp.json();
    }).catch(err => {
        console.error(err);
    });

    if (response.status === "Not found") {
        alert('No username found');
    }

    return response.username;
};

// Login
export const login = async (username: string, password: string): Promise<LoginResponse> => {

    const response: LoginResponse = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(resp => {
        return resp.json();
    }).catch(err => {
        console.error(err);
    });

    if (response.status !== "Success") {
        alert("Something went wrong");
    }

    const token = response.token;

    Cookies.set('token', token, {
        secure: false
    });

    return response;
};

export const Logout: React.FC  = () => {
    const navigate = useNavigate();
    Cookies.remove('token');

    // Wait for a short time before navigating
    setTimeout(() => {
        navigate("/");
    }, 500); // delay in milliseconds

    return null;
}

// Register
export const register = async (username: string, password: string): Promise<RegisterResponse> => {
    const response: RegisterResponse = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(resp => {
        return resp.json();
    }).catch(err => {
        console.error(err);
    });

    if (response.status !== "Success") {
        alert("Something went wrong.");
    }

    return response;
};
