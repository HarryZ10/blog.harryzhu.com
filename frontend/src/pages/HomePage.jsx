import React from 'react';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import NavBar from '../components/layout/NavBar';

// Styled components
const PageContainer = styled.div`
  // Your styles here
`;

const PageTitle = styled.h1`
    font-weight: 800;
    font-family: 'Outfit';
    color: #36382e;
    font-size: 82px;
    line-height: ${(props) => props.main ? '72px' : '56px'};
    width: max-content;
    max-width: 100%;
    margin: 0 auto;
    margin-top: 10rem;
    padding: ${(props) => props.main ? '28px 0 16px' : '0'};
`;

const PageSubTitle = styled.h1`
    font-weight: 100;
    font-family: 'Outfit';
    color: #36382e;
    font-size: '36px';
    line-height: ${(props) => props.main ? '62px' : '16px'};
    width: max-content;
    max-width: 100%;
    margin: 0 auto;
    margin-top: 70px;
    letter-spacing: 0.4rem;
    margin-bottom: ${(props) => props.projectHeading ? '52px' : '16px'};
    padding: ${(props) => props.main ? '28px 0 16px' : '0'};
`;

const Content = styled.main`
  // Styling for main content area
`;

// Home Page component
const HomePage = () => {

    return (
        <>
            <PageContainer>
                <NavBar />
                <Content>
                    <PageTitle>Flez.</PageTitle>
                    <PageSubTitle>flex, and take it easy</PageSubTitle>
                </Content>
            </PageContainer>
        </>
    );
};

export default HomePage;
