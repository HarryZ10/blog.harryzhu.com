import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Form, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import ActionPlus from '../layout/ActionPlus';
import { createPost } from '../../api/PostsAPI';

const CreatePostModal = () => {

    const [show, setShow] = useState(false);
    const [postCreated, setPostCreated] = useState(false);

    const [postContent, setPostContent] = useState('');
    const [baseSalary, setBaseSalary] = useState('');
    const [bonus, setBonus] = useState('');
    const [unlimitedPTO, setUnlimitedPTO] = useState(false);
    const [has401k, setHas401k] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (postCreated) {
            setTimeout(() => {
                // TODO modal?
            }, 100);
        }
    }, [postCreated]);

    const getUserIdFromToken = () => {
        const token = Cookies.get('token');
        if (token) {
            const decoded = jwtDecode(token);
            return decoded.user_id;
        }
        return null;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        switch (name) {
            case 'postContent':
                setPostContent(value);
                break;
            case 'baseSalary':
                setBaseSalary(value);
                break;
            case 'bonus':
                setBonus(value);
                break;
            case 'unlimitedPTO':
                setUnlimitedPTO(checked);
                break;
            case 'has401k':
                setHas401k(checked);
                break;
            default:
                break;
        }
    };

    const confirmPost = async () => {
        try {
            const user_id = getUserIdFromToken();
            if (!user_id) {
                console.error('User ID not found in token');
                return;
            }

            const postData = {
                user_id,
                post_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
                post_text: postContent,
                extra: {
                    jobOfferInfo: {
                        baseSalary: baseSalary,
                        bonus: bonus,
                        unlimitedPTO: unlimitedPTO,
                        has401k: has401k
                    }
                }
            };

            const response = await createPost(postData);
            if (response.status == "Post created") {
                setPostCreated(true);
                handleClose();
            } else {
                if (response.error) {
                    if (response.error == "No post content") {
                        alert("Post must have content!");
                    }
                }
            }

        } catch (error) {
            console.error("Post error: " + error);
        }
    };

    return (
        <>
            <ActionPlus id="create-post" onClick={handleShow} />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={modalTitleStyle}>What's your Flez?</Modal.Title>
                </Modal.Header>
                <Modal.Body style={modalTextStyle}>
                    <Form>
                        <FormGroup>
                            <FormLabel>Your flezzy insights</FormLabel>
                            <FormControl
                                as="textarea"
                                label="Post"
                                value={postContent}
                                onChange={handleInputChange}
                                name="postContent"
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Base Salary</FormLabel>
                            <FormControl
                                type="number"
                                label="Base Salary"
                                value={baseSalary}
                                onChange={handleInputChange}
                                name="baseSalary"
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Bonus</FormLabel>
                            <FormControl
                                type="number"
                                label="Bonus"
                                value={bonus}
                                onChange={handleInputChange}
                                name="bonus"
                            // Add state management and onChange handler as needed
                            />
                        </FormGroup>

                        <FormGroup>
                            <Form.Check
                                type="checkbox"
                                label="Unlimited PTO"
                                value={unlimitedPTO}
                                onChange={handleInputChange}
                                name="Unlimited PTO"
                            />
                        </FormGroup>

                        <FormGroup>
                            <Form.Check
                                type="checkbox"
                                label="401k matching"
                                name="401K matching"
                                value={has401k}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={modalButtonStyle} variant="primary" onClick={confirmPost}>
                        Flez it
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

};

const modalTitleStyle = {
    fontFamily: "Outfit",
    fontWeight: '300',
    letterSpacing: "0.05rem",
    display: "flex",
    justifyContent: "center"
}

const modalTextStyle = {
    fontFamily: "Cabin",
    fontSize: '16px',
}

const modalButtonStyle = {
    fontFamily: "Cabin",
    fontWeight: '400',
    fontSize: '16px',
    width: '100%'
}


export default CreatePostModal;