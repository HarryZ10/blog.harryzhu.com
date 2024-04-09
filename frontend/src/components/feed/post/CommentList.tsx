import React, { useState } from "react";
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-hot-toast';

import { updateComment, UpdateCommentData } from "../../../api/CommentsAPI";
import { getAllPosts } from "../../../api/PostsAPI";
import { DownOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Typography, Button, Menu, Dropdown, Space, Tooltip } from 'antd';
import { useAuth } from "../../../contexts/AuthContext";

interface Comment {
    id: string;
    user_id: string;
    post_id: string;
    comment_text: string;
    comment_date: string;
    username?: string;
}

interface CommentItemProps {
    comment: Comment;
    onDelete: (commentData: UpdateCommentData) => void;
    onUpdate: (commentData: UpdateCommentData) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete, onUpdate }) => {
    const { user, login , logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.comment_text);

    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        if (key === '1') {
            setIsEditing(true);
        } else if (key === '2') {
            handleDelete();
        }
    };

    const items: MenuProps['items'] = [
        {
            label: 'Delete',
            key: '2',
            icon: <DeleteOutlined />,
        },
    ];

    const menu = (
        <>
            <Menu onClick={handleMenuClick}>
                <Menu.Item danger key="2" icon={<DeleteOutlined />}>
                    Delete
                </Menu.Item>
            </Menu>
        </>
    );

    const handleDelete = () => {
        const commentData: UpdateCommentData = {
            id: comment.id,
            user_id: comment.user_id,
            post_id: comment.post_id,
            comment_text: comment.comment_text,
            comment_date: comment.comment_date,
        };

        onDelete(commentData);
    };

    const handleUpdate = (newComment: string) => {
        const commentData: UpdateCommentData = {
            id: comment.id,
            user_id: comment.user_id,
            post_id: comment.post_id,
            comment_text: newComment,
            comment_date: comment.comment_date,
        };
 
        onUpdate(commentData);
        setIsEditing(false);
  };

    return (
        <Row className="align-items-center my-2">
            <Row>
                <Col className="text-truncate">
                    <strong>{comment.username}:</strong>
                </Col>
            </Row>

            <Col className="text-break my-2">
                <Typography.Paragraph
                    ellipsis={true}
                    editable={!isEditing && (comment.user_id != user?.userId) ? false : {
                        onChange: (newComment: string) => {
                            handleUpdate(newComment);
                            setEditedComment(newComment);
                        },
                    }}
                    style={{
                        color: "#fff"
                    }}
                >
                    {editedComment ?
                        editedComment :
                        comment.comment_text
                    }
                </Typography.Paragraph>
            </Col>

            <Col style={{ textAlign: 'right' }}>
                {comment.user_id == user?.userId && (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button>
                            <Space>
                                Actions
                                <DownOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                )}
            </Col>
        </Row>
    );
};

interface CommentListProps {
    comments: Comment[];
}

// CommentList component

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
    const handleDeleteComment = (commentData: UpdateCommentData) => {

    };

    const handleUpdateComment = async (commentData: UpdateCommentData) => {
        await updateComment(commentData)
            .then((res) => {
                if (res?.message) {
                    toast.dismiss();
                    toast.success("Comment updated. Refresh to see changes.");
                }
            })
            .catch(err => {
                if (err?.code == "UPDATE_COMMENTS_FAILED") {
                    toast.dismiss();
                    toast.error(err?.message);
                } else {
                    toast.dismiss();
                    toast.error("Failed to update comment. Please try again.")
                }
            });
    };

    return (
        <>
            {comments.map(comment => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    onDelete={handleDeleteComment}
                    onUpdate={handleUpdateComment}
                />
            ))}
        </>
    );
};

export default CommentList;