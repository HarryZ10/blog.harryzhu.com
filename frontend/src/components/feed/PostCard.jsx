import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const PostCardStyle = {
    width: "80%",
    margin: "0 auto",
    marginBottom: "50px",
    marginTop: "50px",
}

const PostCard = ({key, post_id, post_text, post_date, user_id, additional_info, onDelete }) => {

    const { title, TC, base, bonus } = {
        "title": "Sample",
        "totalcomp": "",
        "base": "",
        "bonus": ""
    };

    const handleDelete = () => {
        onDelete({ id: post_id, post_text, post_date, user_id, additional_info });
    };

     return (
         <Card style={PostCardStyle}>
            <Card.Header>Post from {post_date}</Card.Header>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                     {post_text}
                </Card.Text>
                <Card.Footer style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <Button variant="primary">Find out more</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Card.Footer>
            </Card.Body>
        </Card>
    )
}

export default PostCard;