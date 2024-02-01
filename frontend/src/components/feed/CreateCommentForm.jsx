import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Row, Col, Form, Button } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";
import { addComment } from "../../api/CommentsAPI";
import themes from "../../styles/themes";

const CreateCommentForm = ({ post_id }) => {

    const [commentCreated, setCommentCreated] = useState(false);
    const [isPostable, setIsPostable] = useState(false);
    const [formStringData, setFormStringData] = useState('');

    useEffect(() => {
        if (formStringData.length <= 150) {
            setIsPostable(formStringData.trim() !== '');
        } else {
            setIsPostable(false);
        }
    }, [formStringData, formStringData.length]);

    useEffect(() => {
        if (commentCreated) {
            setTimeout(() => {
                alert("Comment created. Refresh to see comment.");
            }, 100);
        }
    }, [commentCreated])

    const handleInputChange = (e) => {
        const { value } = e.target;
        setFormStringData(value);
    };

    const getUserIdFromToken = () => {
        const token = Cookies.get('token');
        if (token) {
            const decoded = jwtDecode(token);
            return decoded.user_id;
        }
        return null;
    };

    const confirmPost = async (post_id) => {
        if (isPostable) {
            try {
                const user_id = getUserIdFromToken();

                const commentData = {
                    user_id: user_id,
                    post_id: post_id,
                    comment_text: formStringData,
                    token: Cookies.get('token')
                }

                if (user_id) {
                    const response = await addComment(post_id, commentData);

                    if (response.status == "Comment created") {
                        setCommentCreated(true);
                    } else {
                        if (response.error) {
                            if (response.error == "No comment content") {
                                alert("Must have content");
                            } else if (response.error == "Character limit exceeded") {
                                alert("Comment must be less than 150 characters.");
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Comment error: " + error);
            }
        }
    }

    const CharacterCount = styled.div`
        color: ${formStringData.length > 150 ? "#c9163a" : "#777"};
        font-size: 14px;
        margin-top: 5px;
        text-align: right;
    `

    const modalButtonStyle = {
        fontFamily: "Cabin",
        fontWeight: '400',
        fontSize: '16px',
        width: '100%',
        marginTop: '70px',
        marginLeft: '20px',
        backgroundColor: isPostable ? themes.dark.colors.submission : '#b193ca',
        color: themes.dark.colors.postText,
        borderColor: isPostable ? themes.dark.colors.submission : '#b193ca',
        borderRadius: '5px',
        transition: 'transform 0.3s, background-color 0.3s, border-color 0.3s'
    }

    return (
        <>
            <Form>
                <Form.Group as={Row}>
                    <Col sm={8} style={{ padding: 0, marginTop: '20px' }}>
                        <Form.Control
                            as="textarea"
                            name="commentContent"
                            className="comment-textarea"
                            value={formStringData}
                            onChange={handleInputChange}
                            placeholder="What's your counter flex?"
                            style={{
                                ...FormInputStyle, ...{
                                    border: 'none',
                                    fontSize: '17px',
                                }
                            }}
                            rows={3}
                        />
                        <CharacterCount>
                            {formStringData.length} characters
                        </CharacterCount>
                    </Col>
                    <Col sm={3} style={{ padding: 0 }}>
                        <StyledButton
                            style={{
                                ...modalButtonStyle,
                                cursor: !isPostable ? 'not-allowed' : 'pointer'
                            }}

                            className={isPostable ? "hover-effect-button" : ''}

                            variant="primary"
                            onClick={() => {
                                confirmPost(post_id);
                            }}>
                            Comment
                        </StyledButton>
                    </Col>
                </Form.Group>
            </Form>
        </>
    );
}

const StyledButton = styled(Button)`
    @media (max-width: 768px) {
        margin-top: 20px !important;
        margin-bottom: 20px !important;
        margin-left: 0 !important;
    }
`;

const FormInputStyle = {
    backgroundColor: themes.dark.colors.modalTextInput,
    border: '1px solid #3D3D42',
    color: themes.dark.colors.postText,
    marginBottom: '10px',
}

export default CreateCommentForm;
