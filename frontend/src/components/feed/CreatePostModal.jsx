import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Form, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import Cookies from 'js-cookie';
import styled from 'styled-components';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import ActionPlus from '../layout/ActionPlus';
import { createPost } from '../../api/PostsAPI';
import themes from '../../styles/themes';
import "../../styles/createPost.css"

const StyledModal = styled(Modal)`
  .modal-content {
    background: transparent;
    width: 100%;
  }
  .modal-dialog {
    width: 100%
  }
`;

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
                alert("Post created. Refresh to see post.")
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
            <StyledModal show={show} onHide={handleClose}>
                <div style={modalBackground}>
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
                                    style={FormInputStyle}
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
                                    style={FormInputStyle}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>Bonus</FormLabel>
                                <FormControl
                                    style={FormInputStyle}
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
                                    style={FormCheckboxStyle}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Form.Check
                                    type="checkbox"
                                    style={FormCheckboxStyle}
                                    label="401k matching"
                                    name="401K matching"
                                    value={has401k}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            style={modalButtonStyle}
                            className="hover-effect-button"
                            variant="primary"
                            onClick={confirmPost}>
                            Flez it
                        </Button>
                    </Modal.Footer>
                </div>
            </StyledModal>
        </>
    );

};

const FormInputStyle = {
    backgroundColor: themes.dark.colors.modalTextInput,
}

const FormCheckboxStyle = {
    paddingTop: '20px',
    color: themes.dark.colors.modalTextInput,
}


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

const modalBackground = {
    backgroundColor: themes.dark.colors.modalBackground,
    borderRadius: '20px',
    width: '100%',
}

const modalButtonStyle = {
    fontFamily: "Cabin",
    fontWeight: '400',
    fontSize: '16px',
    width: '70%',
    margin: '10px auto',
    backgroundColor: themes.dark.colors.submission,
    color: themes.dark.colors.postText,
    borderColor: themes.dark.colors.submission,
    borderRadius: '15px',
    transition: 'transform 0.3s, background-color 0.3s, border-color 0.3s'
}


export default CreatePostModal;