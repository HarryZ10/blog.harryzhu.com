import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, FormCheck } from 'react-bootstrap';
import Cookies from 'js-cookie';
import styled from 'styled-components';
import { jwtDecode } from 'jwt-decode';
import { createPost } from '../../api/PostsAPI';
import ActionPlus from '../layout/ActionPlus';
import themes from '../../styles/themes';
import "../../styles/createPost.css"

const StyledModal = styled(Modal)`
  .modal-content {
    background: transparent;
    width: 100%;

     @media (max-width: 768px) { // For mobile phones
        width: 80%;
        margin-left: auto;
        margin-right: auto;
    }
  }
  .modal-header {
    border-bottom: 0.6px solid #8c8785 !important;
    button {
        margin-left: 0;
    }
  }
  
  .modal-footer {
    border-top: none !important;
  }
`;

const CreatePostModal = () => {

    const [show, setShow] = useState(false);
    const [postCreated, setPostCreated] = useState(false);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    const [formData, setFormData] = useState({
        postContent: '',
        baseSalary: '',
        signOnBonus: '',
        equity: '',
        unlimitedPTO: false,
        has401k: false,
        medicalInsurance: false,
        dentalInsurance: false,
        visionInsurance: false,
        flexibleWorkHours: false,
        remoteWorkOptions: false,
        relocationAssistance: false,
        maternityPaternityLeave: false,
        gymMembership: false,
        tuitionAssistance: false,
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        setIsButtonEnabled(formData.postContent.trim() !== '');
    }, [formData.postContent]);

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

        // If it is a checkbox, just get the value out of 'checked'
        if (type === 'checkbox') {
            // prevState refers to the current state of formData before the update is applied
            // and then we "spread" it to include it in the newly filled in input value
            setFormData(prevState => ({
                ...prevState,
                [name]: checked
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
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
                post_text: formData.postContent,
                extra: {
                    jobOfferInfo: {
                        baseSalary: formData.baseSalary,
                        equity: formData.equity,
                        signOnBonus: formData.signOnBonus,
                        otherOptions: {
                            unlimitedPTO: formData.unlimitedPTO,
                            has401k: formData.has401k,
                            healthInsurance: {
                                medical: formData.medicalInsurance,
                                dental: formData.dentalInsurance,
                                vision: formData.visionInsurance
                            },
                            flexibleWorkHours: formData.flexibleWorkHours,
                            remoteWorkOptions: formData.remoteWorkOptions,
                            relocationAssistance: formData.relocationAssistance,
                            maternityPaternityLeave: formData.maternityPaternityLeave,
                            gymMembership: formData.gymMembership,
                            tuitionAssistance: formData.tuitionAssistance,
                        }
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
                        <Modal.Title style={modalTitleStyle}>Create Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={modalTextStyle}>
                        <Form>
                            {/* Text fields */}
                            <Form.Group as={Row}>
                                <Col sm={12}>
                                    <Form.Control
                                        as="textarea"
                                        name="postContent"
                                        className="post-textarea"
                                        value={formData.postContent}
                                        onChange={handleInputChange}
                                        placeholder="What's your flez?"
                                        style={{...FormInputStyle, ...{
                                            border: 'none',
                                            fontSize: '20px',
                                        }}}
                                        rows={3}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm={3}>Base Salary</Form.Label>
                                <Col sm={12}>
                                    <Form.Control
                                        type="number"
                                        name="baseSalary"
                                        value={formData.baseSalary}
                                        onChange={handleInputChange}
                                        style={{
                                            ...FormInputStyle, ...{
                                                fontSize: '16px',
                                            }
                                        }}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm={4}>Sign-On Bonus</Form.Label>
                                <Col sm={12}>
                                    <Form.Control
                                        type="number"
                                        name="signOnBonus"
                                        value={formData.signOnBonus}
                                        onChange={handleInputChange}
                                        style={{
                                            ...FormInputStyle, ...{
                                                fontSize: '16px',
                                            }
                                        }}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm={3}>Equity</Form.Label>
                                <Col sm={12}>
                                    <Form.Control
                                        type="number"
                                        name="equity"
                                        value={formData.equity}
                                        onChange={handleInputChange}
                                        style={{
                                            ...FormInputStyle, ...{
                                                fontSize: '16px',
                                            }
                                        }}
                                    />
                                </Col>
                            </Form.Group>

                            {/* True/False Questions */}
                            <Row>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Unlimited PTO"
                                        name="unlimitedPTO"
                                        checked={formData.unlimitedPTO}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Has 401k"
                                        name="has401k"
                                        checked={formData.has401k}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Medical Insurance"
                                        name="medicalInsurance"
                                        checked={formData.medicalInsurance}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Dental Insurance"
                                        name="dentalInsurance"
                                        checked={formData.dentalInsurance}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Vision Insurance"
                                        name="visionInsurance"
                                        checked={formData.visionInsurance}
                                        style={FormCheckboxStyle}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Flexible Work Hours"
                                        name="flexibleWorkHours"
                                        checked={formData.flexibleWorkHours}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Remote Work Options"
                                        name="remoteWorkOptions"
                                        checked={formData.remoteWorkOptions}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Relocation Assistance"
                                        name="relocationAssistance"
                                        checked={formData.relocationAssistance}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Maternity/Paternity Leave"
                                        name="maternityPaternityLeave"
                                        checked={formData.maternityPaternityLeave}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Gym Membership"
                                        name="gymMembership"
                                        checked={formData.gymMembership}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                                <Col sm={6} md={6} xs={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Tuition Assistance"
                                        name="tuitionAssistance"
                                        checked={formData.tuitionAssistance}
                                        onChange={handleInputChange}
                                        style={FormCheckboxStyle}
                                    />
                                </Col>
                            </Row>
                         </Form>
                    </Modal.Body>
        
                    <Modal.Footer>
                        <Button
                            style={modalButtonStyle}
                            className="hover-effect-button"
                            variant="primary"
                            disabled={!isButtonEnabled}
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
    border: '1px solid #3D3D42',
    color: themes.dark.colors.postText,
    marginBottom: '10px',
}

const FormCheckboxStyle = {
    marginTop: '10px',
    color: '#fff'
}

const modalTitleStyle = {
    fontFamily: "Outfit",
    fontWeight: '300',
    letterSpacing: "0.05rem",
    marginLeft: '10px'
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