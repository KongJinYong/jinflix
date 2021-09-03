import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import Loader from "../../Components/Loader";

const Container = styled.div`
height: calc(100vh);
width: 100%;
position: relative;
padding: 50px;
`;

const Content = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    background-color: rgba(45,45,45,0.3);
    border-radius: 10px;
`;

const Cover = styled.div`
    width: 30%;
    background-image: url(${props => props.bgImage});
background-position: center center;
background-size: cover;
height:100%;
border-radius: 5px;
`;


const Backdrop = styled.div`
position: absolute;
top: 0px;
left: 0;
width: 100%;
height: 100%;
background-image: url(${props => props.bgImage});
background-position: center center;
background-size: cover;
filter: blur(5px);
opacitiy: 0.5;
z-index: 0;
`

const Data = styled.div`
 width: 50%;
 margin: 30px 50px;
`;

const Title = styled.h3`
    font-size: 32px;
    margin: 10px 0px;
    font-weight: 600;
`;

const ItemContainer = styled.div`
    margin: 20px 0px;
`;

const Item = styled.span`
font-size: 18px;
`;

const Divider = styled.span`
margin: 0px 10px;
`;

const Overview = styled.p`
    font-size: 22px;
    font-weight: 700;
    opacity: 0.9;
    line-height: 1.5;
    width: 50%;
`;

const DefaultPresenter = ({ result, error, loading }) =>
    loading ? (
        <>
            <Helmet>
                <title>Loading | JinFlix</title>
            </Helmet>
            <Loader />
        </>
    ) : (
        <Container>
            <Helmet>
                <title> {result.original_title ? result.original_title : result.original_name} | JinFlix</title>
            </Helmet>
            <Backdrop
                bgImage={`https://image.tmdb.org/t/p/original${result.backdrop_path}`} />
            <Content>
                <Cover
                    bgImage={result.poster_path ?
                        `https://image.tmdb.org/t/p/original${result.poster_path}` :
                        require("../../assets/noPosterSmall.jpg").default} />
                <Data>
                    <Title>
                        {result.original_title ? result.original_title : result.original_name}
                    </Title>
                    <ItemContainer>
                        <Item>
                            {result.release_date ? result.release_date : result.first_air_date}
                        </Item>
                        <Divider>◾</Divider>
                        <Item>
                            {result.runtime ? result.runtime : result.episode_run_time} min
                        </Item>
                        <Divider>◾</Divider>
                        <Item>
                            {result.genres &&
                                result.genres.map((genre, index) =>
                                    index === result.genres.length - 1
                                        ? `${genre.name} `
                                        : `${genre.name} / `
                                )}
                        </Item>
                    </ItemContainer>
                    <Overview>{result.overview}</Overview>
                </Data>
            </Content>
        </Container>
    );


DefaultPresenter.propTypes = {
    result: PropTypes.object,
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired
};

export default DefaultPresenter;