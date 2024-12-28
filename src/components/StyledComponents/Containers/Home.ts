import styled from 'styled-components';

export const HomeContainer = styled.div`
    text-align: center;
    display: flex;
    max-width: 1600px;
    background-color: #F0F2F5;
    position: relative;
    box-shadow: 0 2px 30px 0 rgba(11, 20, 26, 0.26), 0 2px 10px 0 rgba(11, 20, 26, 0.16);

    @media (max-width: 1600px) {
        margin-top: 0px;
        margin-bottom: 0px;
        width: 100vw;
        height: 100svh;
    }

    @media (min-width: 1600px) {
        height: calc(100vh - 50px);
        width: 1600px;
    }
`;
