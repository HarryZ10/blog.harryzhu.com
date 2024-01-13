import React, { useState, useEffect} from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { getUsername } from "../../api/UsersAPI";

const PostCardStyle = {
    width: "80%",
    margin: "0 auto",
    marginBottom: "50px",
    marginTop: "50px",
}

const PostCard = ({ post_id, post_text, post_date, user_id, additional_info, onDelete }) => {

    // Get username info
    const [username, setUsername] = useState('');

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
            <Card.Header>Post from {username} on {post_date} </Card.Header>
            <Card.Body>
                <Card.Title>Job Offer Details</Card.Title>
                <Card.Text>
                     {post_text}
                </Card.Text>
                {jobOfferInfo && (
                    <div>
                        <p>Base Salary: {formatCurrency(jobOfferInfo.baseSalary)}</p>
                        <p>Bonus: {formatCurrency(jobOfferInfo.bonus)}</p>
                        <p>Unlimited PTO: {jobOfferInfo.unlimitedPTO ? 'Yes' : 'No'}</p>
                        <p>401k Available: {jobOfferInfo.has401k ? 'Yes' : 'No'}</p>
                    </div>
                )}
                <Card.Footer style={{
                    display: "flex",
                    justifyContent: "right"
                }}>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Card.Footer>
            </Card.Body>
        </Card>
    )
}

export default PostCard;