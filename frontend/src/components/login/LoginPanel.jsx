import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import { login, register } from "../../api/UsersAPI";

const Styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '500px',
        backgroundColor: 'white'
    },
    form: {
        width: '300px',
        padding: '20px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow for the box effect
        borderRadius: '5px',
        backgroundColor: '#fff'
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        transition: 'background-color 0.3s, transform 0.3s',
        marginTop: '10px',
        display: 'block',
        marginLeft: 'auto', // Centers the button
        marginRight: 'auto', // Centers the button
        width: '100%' // Full width
    },
    buttonHover: {
        backgroundColor: '#0056b3', // Darker shade for hover
        transform: 'scale(1.05)'
    },
    registerLink: {
        color: '#007bff', // Blue color for the link
        textDecoration: 'none', // Optional: removes underline from the link
        marginTop: '10px', // Spacing above the link
        display: 'block', // Ensures the link is on a new line
        textAlign: 'center', // Centers the link
        textDecoration: 'none'
    }
};

const LoginPanel = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and register
    const history = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    useEffect(() => {
        // Capture the current URL and store it as returnUri
        const currentUrl = window.location.href;
        localStorage.setItem('returnUri', currentUrl);
    }, []);

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    const onLoginHandler = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);

            // Post-login success logic
            history("/"); // Redirect user to the saved URI or a default path

        } catch (error) {
            // Handle login error
            console.error("Login failed:", error);
        }
    };

    const onRegisterHandler = async (e) => {
        e.preventDefault();
        try {
            console.log(username, password);
            await register(username, password);

            // Post-login success logic
            toggleForm();

        } catch (error) {
            // Handle login error
            console.error("Register failed:", error);
        }
    };

    return (
        <div style={Styles.container}>
            <Form style={Styles.form}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Update username
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update username
                    />
                </Form.Group>

                <Button
                    style={{ ...Styles.button, ...(isHovered ? Styles.buttonHover : null) }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    variant="primary"
                    onClick={!isRegistering ? onLoginHandler : onRegisterHandler}
                    type="submit"
                >
                    {isRegistering ? "Register" : "Login"}
                </Button>

                <a style={Styles.registerLink} onClick={toggleForm}>
                    {isRegistering ? "or login" : "or register"}
                </a>
            </Form>
        </div>
    )
}

export default LoginPanel;
