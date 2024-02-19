import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";

import { Post } from '../interfaces/post';

import CreatePostForm from '../components/feed/CreatePostForm';
import NavBar from '../components/layout/NavBar';
import PostCard from '../components/feed/post/PostCard';
import { getAllPosts, deletePost } from '../api/PostsAPI';


const BlogPage = () => {

    const [posts, setPosts] = useState<Array<Post>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {

            const fetchedPostData = await getAllPosts()
                .then(res => {
                    return res;
                })
                .catch(err => {
                    console.error(`Blog page can't load posts due to ${err}`);
                    setError(err);
                    setLoading(true);
                });
            
            console.log(fetchedPostData);
            if (fetchedPostData.error) {
                if (fetchedPostData.error === "Unauthorized") {
                    navigate("/login")
                }

            } else {
                setPosts(fetchedPostData);
                setLoading(false);
            }
        }
    
      fetchPosts();
    }, [navigate])

    
    const onDeleteHandler = async (post_id: string, user_id: string) => {
        const status: string = await deletePost(post_id, user_id)
            .then(res => {
                return res;
            })
            .catch(err => {
                setError(err.message);
                return err.status
            })

        if (status === "Success") {
            setPosts(posts.filter(post => post.id !== post_id));
        }
    };

    if (loading) {
        return <div>Loading posts...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    console.log(posts);

    return (
        <div>
            <NavBar />
            <PageTitle>
                Flexes for you.
            </PageTitle>
            {Array.isArray(posts) && posts
                .sort((a, b) => new Date(b.post_date).getTime() - new Date(a.post_date).getTime())
                .map(post => (
                    <PostCard
                        key={post.id}
                        post_id={post.id}
                        post_text={post.post_text}
                        post_date={post.post_date}
                        user_id={post.user_id}
                        additional_info={post.extra}
                        onDelete={() => onDeleteHandler(post.id, post.user_id)}
                    />
                ))
            }
            <CreatePostForm />
        </div>
    );
};

const PageTitle = styled.h1`
    font-weight: 800;
    font-family: 'Outfit';
    color: ${(props) => props.theme.dark.colors.skyblueHighlight };
    font-size: 82px;
    line-height: 72px;
    width: max-content;
    max-width: 100%;
    margin: 0 auto;
    margin-top: 5rem;
    padding: '28px 0 16px';
`;

export default BlogPage;
