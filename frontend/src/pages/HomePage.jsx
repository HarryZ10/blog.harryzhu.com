import React from 'react';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Styled components
const PageContainer = styled.div`
  // Your styles here
`;

const PageTitle = styled.h1`
    font-weight: 800;
    color: #36382e;
    font-size: ${(props) => props.main ? '65px' : '56px'};
    line-height: ${(props) => props.main ? '72px' : '56px'};
    width: max-content;
    max-width: 100%;
  
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
                <Content>
                    <PageTitle>Flez, lend a hand</PageTitle>
                </Content>
            </PageContainer>
        </>
    );
};

export default HomePage;
