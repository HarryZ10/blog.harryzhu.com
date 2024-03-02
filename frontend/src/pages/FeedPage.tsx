import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";

import { Post, ExtraInfo } from '../interfaces/post';
import CreatePostForm from '../components/feed/CreatePostForm';
import NavBar from '../components/layout/NavBar';
import PostCard from '../components/feed/post/PostCard';
import { getAllPosts, deletePost, updatePost, getAllPostsByUser } from '../api/PostsAPI';
import ActionPlus from '../components/layout/ActionPlus';
import { PostsResponse } from '../interfaces/apiResponses';

interface FeedProps {
    isProfileMode: boolean,
}

const FeedPage: React.FC<FeedProps> = ( props ) => {

    const isProfileMode = props.isProfileMode;

    const [posts, setPosts] = useState<Array<Post>>([]);
    const [postId, setPostId] = useState('');
    const [formPostData, setFormPostData] = useState<Post>({
        id: '',
        user_id: '',
        project_id: '',
        post_text: '',
        post_date: '',
        extra: {
            jobOfferInfo: {
                baseSalary: '',
                equity: '',
                signOnBonus: '',
                otherOptions: {
                    unlimitedPTO: false,
                    has401k: false,
                    healthInsurance: {
                        medical: false,
                        dental: false,
                        vision: false
                    },
                    flexibleWorkHours: false,
                    remoteWorkOptions: false,
                    relocationAssistance: false,
                    maternityPaternityLeave: false,
                    gymMembership: false,
                    tuitionAssistance: false,
                }
            }
        }
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [show, setShow] = useState(false);

    const handleFormClose = () => {
        setShow(false);
        setPostId('');
        setFormPostData({
            id: '',
            user_id: '',
            project_id: '',
            post_text: '',
            post_date: '',
            extra: {
                jobOfferInfo: {
                    baseSalary: '',
                    equity: '',
                    signOnBonus: '',
                    otherOptions: {
                        unlimitedPTO: false,
                        has401k: false,
                        healthInsurance: {
                            medical: false,
                            dental: false,
                            vision: false
                        },
                        flexibleWorkHours: false,
                        remoteWorkOptions: false,
                        relocationAssistance: false,
                        maternityPaternityLeave: false,
                        gymMembership: false,
                        tuitionAssistance: false,
                    }
                }
            }
        });
    };

    const handleFormShow = () => setShow(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (!isProfileMode) {
                    const fetchedPostData: PostsResponse = await getAllPosts();
                    if (fetchedPostData.status === "Success") {
                        const postsWithParsedExtra: Post[] = fetchedPostData.results.map((post) => {
                            const extraInfo: ExtraInfo = JSON.parse(post.extra);
                            return {
                                ...post,
                                extra: extraInfo,
                            };
                        });

                        setPosts(postsWithParsedExtra);
                        setLoading(false);
                    } else {
                        navigate("/login");
                    }
                } else {

                    const fetchedPostData: PostsResponse = await getAllPostsByUser();

                    if (fetchedPostData.status === "Success") {
                        const postsWithParsedExtra: Post[] = fetchedPostData.results.map((post) => {
                            const extraInfo: ExtraInfo = JSON.parse(post.extra);
                            return {
                                ...post,
                                extra: extraInfo,
                            };
                        });

                        setPosts(postsWithParsedExtra);
                        setLoading(false);
                    } else {
                        navigate("/login");
                    }

                }
                
            } catch (err) {
                console.error(`Blog page can't load posts due to ${err}`);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [navigate]);

    const onDeleteHandler = async (post_id: string, user_id: string) => {
        const status: string = await deletePost(post_id, user_id)
            .then(res => {
                return res.status;
            })
            .catch(err => {
                setError(err.message);
                return err.status
            })

        if (status === "Success") {
            setPosts(posts.filter(post => post.id !== post_id));
        }
    };

    const onUpdateHandler = async (data: Post) => {
        setPostId(data.id);
        setFormPostData(data);
        setShow(!show);
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
                {!isProfileMode ? "Flexes for you." : "My Stuff"}
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
                        onUpdate={() => onUpdateHandler(post)}
                    />
                ))
            }
            { !isProfileMode ? <ActionPlus id="create-post" onClick={handleFormShow} /> : <>/</> }

            <CreatePostForm
                show={show}
                handleClose={handleFormClose}
                id={postId}
                initialFormData={formPostData}
            />

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

export default FeedPage;
