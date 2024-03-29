import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import { login, register } from "../../api/UsersAPI";
import themes from "../../styles/themes";

const PageStyles: { 
    registerLink: React.CSSProperties;
    container: React.CSSProperties;
    form: React.CSSProperties;
    button: React.CSSProperties;
    buttonHover: React.CSSProperties;
} = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '3rem',
        backgroundColor: '#1c1c1e',
    },
    form: {
        width: '400px',
        padding: '40px',
        borderRadius: '10px',
        backgroundColor: '#2c2c2e',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    button: {
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: '200% auto',
        color: 'white',
        border: 'none',
        borderRadius: '30px',
        transition: 'all 0.3s ease',
        marginTop: '30px',
        display: 'block',
        height: '50px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        fontWeight: 'bold',
        fontSize: '18px',
    },
    buttonHover: {
        transform: 'scale(1.05)',
        backgroundPosition: 'right center'
    },
    registerLink: {
        color: '#667eea',
        textDecoration: 'none',
        marginTop: '20px',
        display: 'block',
        textAlign: 'center',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

const LoginPanel: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and register
    const history = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);

    useEffect(() => {
        // Capture the current URL and store it as returnUri
        const currentUrl = window.location.href.replace("/login", "")
        localStorage.setItem('returnUri', currentUrl);
    }, []);

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    const onLoginHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await login(username, password)
        .then(res => {
            const token = res.token;
            Cookies.set('token', token, { secure: false });
            history("/")
            toast.success("User logged in successfully.")
        })
        .catch(err => {
            if (err?.code === "LOGIN_FAILED") {
                toast.error(err?.message);
            } else {
                toast.error("Failed to login: Please check console for more details.")
            }
        });
    };

    const onRegisterHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // Validate password and confirm password match
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        await register(username, password)
            .then(res => {
                if (res?.message === "Success") {
                    history("/");
                    toast.success("Account was registered successfully! Please log in again.")
                }
            })
            .catch(err => {
                if (err?.code === "REGISTER_USER_FAILED") {
                    toast.error(err?.message);
                } else {
                    toast.error("Failed to register: Please check console for more details.")
                }
            })
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setPasswordMatch(e.target.value === password);
    };

    return (
        <div style={PageStyles.container}>
            <Form style={PageStyles.form}>
                <Form.Group className="mb-4" controlId="formBasicUsername">
                    <Form.Label style={{ color: 'white', fontSize: '18px' }}>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Update username
                        style={{ height: '50px', fontSize: '16px' }}
                    />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label style={{ color: 'white', fontSize: '18px' }}>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password
                        style={{ height: '50px', fontSize: '16px' }}
                    />
                </Form.Group>

                {isRegistering && (
                    <Form.Group className="mb-4" controlId="formBasicConfirmPassword">
                        <Form.Label style={{ color: 'white', fontSize: '18px' }}>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange} // Update confirm password and check match
                            style={{ height: '50px', fontSize: '16px' }}
                        />

                        {!passwordMatch && (
                            <Form.Text style={{ color: 'red', fontSize: '14px' }}>Passwords do not match</Form.Text>
                        )}

                        {passwordMatch && confirmPassword && (
                            <Form.Text style={{ color: 'green', fontSize: '14px' }}>Passwords match</Form.Text>
                        )}
                    </Form.Group>
                )}

                <Button
                    style={{ ...PageStyles.button, ...(isHovered ? PageStyles.buttonHover : null) }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    variant="primary"
                    onClick={!isRegistering ? onLoginHandler : onRegisterHandler}
                    type="submit"
                >
                    {isRegistering ? "Register" : "Login"}
                </Button>

                <a href="#" style={PageStyles.registerLink} onClick={toggleForm}>
                    {isRegistering ? "or login" : "or register"}
                </a>
            </Form>
        </div>
    )
}

export default LoginPanel;
