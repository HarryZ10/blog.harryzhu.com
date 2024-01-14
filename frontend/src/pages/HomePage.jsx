import React from 'react';
import styled from 'styled-components';
import NavBar from '../components/layout/NavBar';

const PageTitle = styled.h1`
    font-weight: 800;
    font-family: 'Outfit';
    color: ${(props) => props.theme.dark.colors.skyblueHighlight };
    letter-spacing: 0.7rem;
    font-size: 82px;
    line-height: ${(props) => props.main ? '72px' : '56px'};
    width: max-content;
    max-width: 100%;
    margin: 0 auto;
    margin-top: 10rem;
    padding: ${(props) => props.main ? '28px 0 16px' : '0'};
`;

export const PageSubTitle = styled.h1`
    font-weight: 100;
    font-family: 'Outfit';
    color: ${(props) => props.theme.dark.colors.text };
    font-size: '36px';
    line-height: ${(props) => props.main ? '62px' : '16px'};
    width: max-content;
    max-width: 100%;
    margin: 0 auto;
    margin-top: 70px;
    letter-spacing: 0;
    margin-bottom: ${(props) => props.projectHeading ? '52px' : '16px'};
    padding: ${(props) => props.main ? '28px 0 16px' : '0'};
`;

// Home Page component
const HomePage = () => {

    return (
        <>
            <NavBar />
            <section>
                <PageTitle>Flez it.</PageTitle>
                <PageSubTitle>flex and easy</PageSubTitle>
            </section>
        </>
    );
};

export default HomePage;
