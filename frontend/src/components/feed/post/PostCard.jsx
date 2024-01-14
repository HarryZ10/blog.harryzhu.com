import React, { useState, useEffect} from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Card from "react-bootstrap/Card";
import { Row, Col } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { getUsername } from "../../../api/UsersAPI";
import themes from "../../../styles/themes";

const PostCardStyle = {
    width: "80%",
    margin: "0 auto",
    marginBottom: "50px",
    marginTop: "50px",
    backgroundColor: themes.dark.colors.postBackground,
    color: themes.dark.colors.postText,
}

const CardBorderStyle = {
    borderColor: themes.dark.colors.cardBorder,
}

const ActionButton = styled(Button)`
    background-color: ${props => props.theme.dark.colors.danger};
    border: ${props => props.theme.dark.colors.danger};
    color: ${props => props.theme.dark.colors.postText};
    width: 10%;

    @media (max-width: 1024px) { // For larger screens
        width: 20%;
    }

    @media (max-width: 480px) { // For mobile phones
        width: 50%;
    }
`;

const PostCard = ({ post_id, post_text, post_date, user_id, additional_info, onDelete }) => {

    // Post Card Other Info collapse/show toggle
    const [openAdditionalInfo, setOpenAdditionalInfo] = useState(false);

    // Get username info
    const [username, setUsername] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');

    useEffect(() => {
        const token = Cookies.get("token");
        const userid = jwtDecode(token).user_id
        setCurrentUserId(userid);
    }, [user_id])

    useEffect(() => {
        const fetchUsername = async () => {
            const resp = await getUsername(user_id);
            setUsername(resp);
        };

        fetchUsername();
    }, [user_id]);

    // Job offer info

    const jobOfferInfo = additional_info ? 
        (JSON.parse(additional_info)).jobOfferInfo : null;

    // Handles delete and updates

    const handleDelete = () => {
        onDelete({ id: post_id, post_text, post_date, user_id, additional_info });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    };

     return (
        <Card style={PostCardStyle}>
            <Card.Header style={CardBorderStyle}>Post from {username} on {post_date} </Card.Header>
            <Card.Body style={CardBorderStyle}>
                <Card.Title>Job Offer Details</Card.Title>
                <Card.Text>
                     {post_text}
                </Card.Text>

                <hr style={{ 
                    borderColor: themes.dark.colors.cardBorder,
                    borderTop: '0.5px solid' }} />

                {jobOfferInfo && (
                    <div style={{ paddingBottom: '20px' }}>
                        <Row>
                            <Col xs={6} sm={6} md={6}><strong>Base Salary:</strong></Col>
                            <Col xs={6} sm={6} md={6}>{formatCurrency(jobOfferInfo.baseSalary)}</Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6} md={6}><strong>Sign-on Bonus:</strong></Col>
                            <Col xs={6} sm={6} md={6}>{formatCurrency(jobOfferInfo.signOnBonus)}</Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6} md={6}><strong>Equity:</strong></Col>
                            <Col xs={6} sm={6} md={6}>{formatCurrency(jobOfferInfo.equity)}</Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6} md={6}><strong>Unlimited PTO:</strong></Col>
                            <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.unlimitedPTO ? 'Yes' : 'No'}</Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6} md={6}><strong>401k Available:</strong></Col>
                            <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.has401k ? 'Yes' : 'No'}</Col>
                        </Row>

                         <a
                             href="#!"
                             onClick={(e) => {
                                 e.preventDefault();
                                 setOpenAdditionalInfo(!openAdditionalInfo);
                             }}
                             style={{
                                 textDecoration: 'none',
                                 color: 'inherit',
                                 paddingTop: '20px',         // Some padding for clickable area
                                 paddingBottom: '5px',
                                 cursor: 'pointer',      // Changes cursor to indicate clickability
                                 display: 'inline-block' // Ensures padding is applied correctly
                             }}
                         >
                             {openAdditionalInfo ? 'Hide Details' : 'Show Details'}
                         </a>

                        <Collapse in={openAdditionalInfo}>
                            <div id="job-offer-info-collapse">
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Medical Insurance:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.healthInsurance.medical ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Dental Insurance:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.healthInsurance.dental ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Vision Insurance:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.healthInsurance.vision ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Flexible Work Hours:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.flexibleWorkHours ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Remote Work Options:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.remoteWorkOptions ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Relocation Assistance:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.relocationAssistance ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Maternity/Paternity Leave:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.maternityPaternityLeave ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Gym Membership:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.gymMembership ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}><strong>Tuition Assistance:</strong></Col>
                                    <Col xs={6} sm={6} md={6}>{jobOfferInfo.otherOptions.tuitionAssistance ? 'Yes' : 'No'}</Col>
                                </Row>
                            </div>
                        </Collapse>
                     </div>
                )}

                <Card.Footer style={{ display: "flex", justifyContent: "right", ...CardBorderStyle}}>
                     {currentUserId === user_id && (
                        <ActionButton variant="danger" onClick={handleDelete}>Delete</ActionButton>
                     )}
                </Card.Footer>
            </Card.Body>
        </Card>
    )
}

export default PostCard;