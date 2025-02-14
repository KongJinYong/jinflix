import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import Loader from "../../Components/Loader";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import "bootstrap/dist/css/bootstrap.min.css";
import YouTube from "react-youtube";
import SeasonDetail from "../../Components/SeasonDetail";
import { moviesApi, tvApi } from "../../api";
import { useParams } from "react-router";
import { withBaseIcon } from "react-icons-kit";
import { undo2 } from 'react-icons-kit/icomoon/undo2';
import {RouteComponentProps } from "react-router-dom";

const IconContainer = withBaseIcon({
    size: 28,
    style: { color: "black" }
});

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

const Cover = styled.div<{bgImage : string}>`
    width: 30%;
    background-image: url(${props => props.bgImage});
background-position: center center;
background-size: cover;
height:100%;
border-radius: 5px;
`;


const Backdrop = styled.div<{bgImage : string}>`
position: absolute;
top: 0px;
left: 0;
width: 100%;
height: 100%;
background-image: url(${props => props.bgImage});
background-position: center center;
background-size: cover;
filter: blur(5px);
opacitiy: 1;
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
    font-size: 18px;
    margin: 20px 0px;
    color: white;
    border-bottom: 1px solid white;
`;

const Item = styled.span`
font-size: 18px;
font-color: white;
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
    padding-bottom:32px;
`;

const PItem = styled.span`
font-size:32px`;


const Logo = styled.div<{bgImage : string}>`
  background-image: url(${(props) => props.bgImage});
  width: 200px;
  display:flex;
  height: 70px;
  background-size: 100% 100%;
  padding-bottom: 20px;
`;

const Produce = styled.div`
display: flex`;

const ALink = styled.a`
font-size: 18px;`;

const SeasonStyle = styled.div`
margin-top: 30px;
display: grid;
grid-template-columns:repeat(auto-fill, 125px);
grid-gap: 10px;`;

const BackButton = styled.div`
display: flex;
justify-content: center;
align-items: center;
border-radius: 50%;
position: absolute;
width: 60px;
height: 60px;
background-color: white;
top: -2%;
left: 97%;

`;

const ButtonContainer = styled.div``;

interface ResType {
    title?:string,
    name?: string,
    poster_path?:string,
    release_date?:string,
    first_air_date?:string,
    runtime?:number,
    episode_run_time?:number,
    genres: Array<string>,
    overview?:string,
    imdb_id?: number,
    production_countries?: any,
    production_companies?: any,
    videos?: any,
    seasons?:  Array<string>,
    backdrop_path?: string

}
const DefaultPresenter: React.FunctionComponent<RouteComponentProps> = ({ location: { pathname } }) => {
    const params = useParams<{id:string}>();
    const [result, setResult] = useState<ResType>({
        title: "",
        name: "",
        poster_path: "",
        release_date:"",
        first_air_date:"",
        runtime:0,
        episode_run_time:0,
        genres: [],
        overview:"",
        imdb_id: 0,
        production_countries: "",
        production_companies: "",
        videos: [],
        seasons: [],
        backdrop_path: ""});
    const [loading, setLoading] = useState(true);
    const [isMovie, setIsMovie] = useState(pathname.includes("/movie"));

    const getDetailDataFromApi = async () => {
        const parsedId = parseInt(params.id);
        /* if (isNaN(parsedId)) {
          return push("/");
        } */
        let result:ResType;
        try {
            if (isMovie) {
                ({ data: result } = await moviesApi.movieDetail(parsedId));
            } else {
                ({ data: result } = await tvApi.showDetail(parsedId));
            }
            setResult(result);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDetailDataFromApi();
    }, []);

    const opts:any = {
        height: "390",
        width: "640",
        playerVars: {
            autoplay: 0,
        },
    };

    return loading ? (
        <>
            <Helmet>
                <title>Loading | JinFlix</title>
            </Helmet>
            <Loader />
        </>
    ) : (
        <Container>
            <Helmet>
                <title> {result.title ? result.title : result.name} | JinFlix</title>
            </Helmet>
            <Backdrop
                bgImage={`https://image.tmdb.org/t/p/original${result.backdrop_path}`} />
            <Content>
                <Cover
                    bgImage={result.poster_path ?
                        `https://image.tmdb.org/t/p/original${result.poster_path}` :
                        require("../../assets/noPosterSmall.jpg").default} />
                <Data>
                    <ButtonContainer onMouseOver={((event) => { console.log("zzz") })}>
                        <a href="javascript:history.go(-1);"> <BackButton ><IconContainer icon={undo2} />
                        </BackButton> </a>
                    </ButtonContainer>
                    <Title>
                        {result.title ? result.title : result.name}
                    </Title>
                    <Tabs
                        defaultActiveKey="home"
                        transition={false}
                        id="noanim-tab-example">
                        <Tab eventKey="home" title="INFO">
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
                                        result.genres.map((genre:any, index:number) =>
                                            index === result.genres.length - 1
                                                ? `${genre.name} `
                                                : `${genre.name} / `
                                        )}
                                </Item>
                            </ItemContainer>
                            <Overview>{result.overview}</Overview>
                            <ALink href={`https://www.imdb.com/title/${result.imdb_id}/`}>https://www.imdb.com/title/{result.imdb_id}</ALink>

                        </Tab>
                        <Tab eventKey="profile" title="Producer">
                            <ItemContainer>
                                COUNTRY
                            </ItemContainer>
                            <PItem>
                                {    result?.production_countries.map((country:any, index:number, countries : any) =>
                                        countries.length !== index + 1
                                            ? `${country.name}, `
                                            : country.name
                                    )}
                            </PItem>
                            <ItemContainer>
                                Produce By
                            </ItemContainer>
                            <Produce>
                                {result?.production_companies.map((logopath:any) =>
                                    logopath.logo_path ? (
                                        <Logo
                                            bgImage={`https://image.tmdb.org/t/p/original${logopath.logo_path}`}
                                        />
                                    ) : (
                                        console.log("Not Logo")
                                    )
                                )}
                            </Produce>
                            <ItemContainer>
                                Clip
                            </ItemContainer>
                            {result.videos.results[0] ? (
                                <YouTube
                                    videoId={
                                        result.videos.results[0]
                                            ? result.videos.results[0].key
                                            : console.log(result.videos.results)
                                    }
                                    opts={opts}
                                />
                            ) : (
                                <h5>관련 영상클립이 없습니다 ! </h5>
                            )}
                        </Tab>
                        {result.seasons ?
                            <Tab eventKey="seasons" title="Season">
                                <SeasonStyle>
                                    {result.seasons.map((season:any) =>
                                        season.name ? (
                                            <SeasonDetail
                                                imageUrl={season.poster_path}
                                                name={season.name}
                                                character_name={
                                                    season.air_date && season.air_date.substring(0, 4)
                                                }
                                            />
                                        ) : (
                                            console.log(season.profile_path)
                                        )
                                    )}
                                </SeasonStyle>
                            </Tab> : (console.log("ERROR"))}

                    </Tabs>

                </Data>
            </Content>
        </Container >
    );
}

export default DefaultPresenter;