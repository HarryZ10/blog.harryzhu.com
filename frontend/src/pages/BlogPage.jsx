import React, { useState, useEffect } from 'react';
import NavBar from '../components/layout/NavBar';
import { getAllPosts, deletePost } from '../api/PostsAPI';
import PostCard from '../components/feed/PostCard';
import styled from "styled-components";

const PageTitle = styled.h1`
    font-weight: 800;
    font-family: 'Outfit';
    color: #36382e;
    font-size: 82px;
    line-height: ${(props) => props.main ? '72px' : '56px'};
    width: max-content;
    max-width: 100%;
    margin: 0 auto;
    margin-top: 5rem;
    padding: ${(props) => props.main ? '28px 0 16px' : '0'};
`;
const BlogPage = () => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchPosts = async () => {
        try {
            const fetchedPostData = await getAllPosts();
            setPosts(fetchedPostData);
            setLoading(false);
        }
        catch (err) {

            setError(err);
            setLoading(true);
        }
      }
    
      fetchPosts();
    }, [])

    const onDeleteHandler = async (post_id, user_id) => {
        try {
            const status = await deletePost(post_id, user_id);
            if (status != "Error") {
                setPosts(posts.filter(post => post.id !== post_id));
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div>Loading posts...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <NavBar />
            <PageTitle>
                Flez Feed.
            </PageTitle>
            {posts.map(post => (
                <PostCard
                    key={post.id}
                    post_id={post.id}
                    post_text={post.post_text}
                    post_date={post.post_date}
                    user_id={post.user_id}
                    additional_info={post.extra}
                    onDelete={() => onDeleteHandler(post.id, post.user_id)}
                />
            ))}
        </div>
    );
};

export default BlogPage;
