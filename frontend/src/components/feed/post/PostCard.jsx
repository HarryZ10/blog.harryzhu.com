import React, { useState, useEffect} from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Card from "react-bootstrap/Card";
import { Row, Col } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { getUsername } from "../../../api/UsersAPI";
import { getCommentsByPostId } from "../../../api/CommentsAPI";

import themes from "../../../styles/themes";
import CreateCommentForm from "../CreateCommentForm";

const StyledCard = styled(Card)`
    @media (max-width: 768px) {
        width: 80% !important;
    }
`;

const ActionButton = styled(Button)`
    color: ${props => props.theme.dark.colors.postText};

    @media (max-width: 1024px) { // For larger screens
        width: 150px !important;
    }

    @media (max-width: 480px) { // For mobile phones
        width: 100px !important;
    }
`;

const PostCard = ({ post_id, post_text, post_date, user_id, additional_info, onDelete }) => {

    // Post Card Other Info collapse/show toggle
    const [openAdditionalInfo, setOpenAdditionalInfo] = useState(false);
    const [openCommentForm, setOpenCommentForm] = useState(false); 

    // Get username info
    const [username, setUsername] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');

    // Comment data
    const [comments, setComments] = useState([]);
    
    useEffect(() => {
        const fetchCommentsAndUsernames = async () => {
            let resp = await getCommentsByPostId(post_id);

            // Create a new array to store comments with usernames
            let commentsWithUsernames = [];

            for (let comment of resp) {
                // Fetch the username for each comment
                let username = await fetchUsername(comment.user_id);

                // Create a new comment object including the username
                commentsWithUsernames.push({ ...comment, username });
            }

            setComments(commentsWithUsernames);
        }

        fetchCommentsAndUsernames();
    }, [post_id]);

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
        <StyledCard style={PostCardStyle}>
            <Card.Header style={CardBorderStyle}>Post from {username} on {post_date}</Card.Header>
            <Card.Body style={CardBorderStyle}>
                <Card.Title>Job Offer Details</Card.Title>
                <Card.Text>{post_text}</Card.Text>
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

                         <a href="#!" onClick={(e) => {
                                 e.preventDefault();
                                 setOpenAdditionalInfo(!openAdditionalInfo);
                             }}
                             style={{
                                 textDecoration: 'none',
                                 color: 'inherit',
                                 paddingTop: '20px',
                                 paddingBottom: '5px',
                                 cursor: 'pointer',
                                 display: 'inline-block'
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

                <Card.Footer style={CardBorderStyle}>
                    <Row>
                        <Col xs={6} md={9} style={{ padding: 0 }} className="d-flex justify-content-start">

                            {currentUserId === user_id && (
                                <ActionButton onClick={(e) => {
                                    // e.preventDefault();
                                    // setOpenCommentForm(!openCommentForm);
                                }} style={EditButtonStyle}>Edit</ActionButton>
                            )}
                        </Col>

                        <Col xs={6} md={3} style={{ padding: 0 }}
                            className="d-flex justify-content-end">

                            {/* {currentUserId === user_id && (
                                <ActionButton style={DeleteButtonStyle} onClick={handleDelete}>Delete</ActionButton>
                            )} */}
                        </Col>
                    </Row>
                    <Row>
                        <CreateCommentForm post_id={post_id} />
                    </Row>
                    
                     {comments && comments.map(comment => (
                         <Row className="align-items-center my-2">
                             <Col xs={4} sm={4} md={3} className="text-truncate">
                                 <strong>{comment.username}:</strong>
                             </Col>
                             <Col xs={8} sm={8} md={9} className="text-break">
                                 {comment.comment_text}
                             </Col>
                         </Row>
                     ))}

                </Card.Footer>
            </Card.Body>
        </StyledCard>
    )
}

export default PostCard;

const fetchUsername = async (user_id) => {
    const username = await getUsername(user_id);
    return username;
}

const PostCardStyle = {
    width: "50%",
    margin: "0 auto",
    marginBottom: "50px",
    marginTop: "50px",
    backgroundColor: themes.dark.colors.postBackground,
    color: themes.dark.colors.postText,
    borderRadius: '5px',
}

const CardBorderStyle = {
    borderColor: themes.dark.colors.cardBorder,
}

const DeleteButtonStyle = {
    backgroundColor: themes.dark.colors.danger,
    border: themes.dark.colors.danger,
    width: '100%'
}

const EditButtonStyle = {
    backgroundColor: themes.dark.colors.submission,
    border: themes.dark.colors.danger,
    width: '150px',
}
