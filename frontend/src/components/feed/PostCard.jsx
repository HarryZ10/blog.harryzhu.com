import React, { useState, useEffect} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Card from "react-bootstrap/Card";
import { Row, Col } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import { getUsername } from "../../api/UsersAPI";
import themes from "../../styles/themes";

const PostCardStyle = {
    width: "80%",
    margin: "0 auto",
    marginBottom: "50px",
    marginTop: "50px",
    backgroundColor: themes.dark.colors.postBackground,
    color: themes.dark.colors.postText,
}

const DeleteButtonStyle = {
    backgroundColor: themes.dark.colors.danger,
    border: themes.dark.colors.danger,
    color: themes.dark.colors.postText,
    width: "10%",
}

const CardBorderStyle = {
    borderColor: themes.dark.colors.cardBorder,
}

const PostCard = ({ post_id, post_text, post_date, user_id, additional_info, onDelete }) => {

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
                             <Col md={6}><strong>Base Salary:</strong></Col>
                             <Col md={6}>{formatCurrency(jobOfferInfo.baseSalary)}</Col>
                         </Row>
                         <Row>
                             <Col md={6}><strong>Bonus:</strong></Col>
                             <Col md={6}>{formatCurrency(jobOfferInfo.bonus)}</Col>
                         </Row>
                         <Row>
                             <Col md={6}><strong>Unlimited PTO:</strong></Col>
                             <Col md={6}>{jobOfferInfo.unlimitedPTO ? 'Yes' : 'No'}</Col>
                         </Row>
                         <Row>
                             <Col md={6}><strong>401k Available:</strong></Col>
                             <Col md={6}>{jobOfferInfo.has401k ? 'Yes' : 'No'}</Col>
                         </Row>
                     </div>
                )}
                <Card.Footer style={{ display: "flex", justifyContent: "right", ...CardBorderStyle}}>
                     {currentUserId === user_id && (
                        <Button
                            variant="danger"
                            style={DeleteButtonStyle}
                            onClick={handleDelete}>Delete</Button>
                     )}
                </Card.Footer>
            </Card.Body>
        </Card>
    )
}

export default PostCard;