import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import Loader from "../../Components/Loader";
import Section from "../../Components/Section";
import Message from "../../Components/Message";
import Poster from "../../Components/Poster";
import { moviesApi, tvApi, multiSearchApi } from "../../api";

const Container = styled.div`
padding: 20px;`;

const Form = styled.form`
margin-bottom: 50px;`;

const Input = styled.input`
all: unset;
font-size: 28px;
width:100%;`;

const SearchPresenter = () => {

    const [movieResults, setMovieResults] = useState();
    const [tvResults, setTvResults] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState();
    const [loading, setLoading] = useState();
    const [results, setResults] = useState();


    const handlesubmit = (event) => {
        event.preventDefault();
        if (searchTerm !== "") {
            searchByTerm()
        }
    };

    const updateTerm = (event) => {
        const { target: { value } } = event;
        setSearchTerm(value);
    }


    const searchByTerm = async () => {
        setLoading(true);
        try {
            const { data: { results: movieResults } } = await moviesApi.search(searchTerm);
            const { data: { results: tvResults } } = await tvApi.search(searchTerm);
            const { data: { results: results } } = await multiSearchApi.multiSearch(searchTerm);
            setMovieResults(movieResults);
            setTvResults(tvResults);
            setResults(results);
        } catch {
            setError(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => { searchByTerm() }, []);

    // console.log(results);
    // results.filter();
    // result.title
    return (

        <Container>
            <Helmet>
                <title>Search | JinFlix</title>
            </Helmet>
            <Form onSubmit={handlesubmit}>
                <Input placeholder="TV 쇼와 영화를 검색하세요" type="text" value={searchTerm}
                    onChange={updateTerm}>
                </Input>
            </Form>
            {loading ? <Loader /> : <>

                {results && results.length > 0 && (
                    <Section title="Movie Results">
                        {results.map(movie => (
                            <Poster
                                key={movie.id}
                                id={movie.id}
                                imageUrl={movie.poster_path}
                                title={movie.title ? movie.title : movie.name}
                                rating={movie.vote_average}
                                isMovie={true}
                                year={movie.release_date}
                            // year={movie.release_date.substring(0,4)}
                            />
                        ))}
                    </Section>
                )}
                {results && results.length > 0 && (
                    <Section title="tv Results">
                        {results.map(show => (
                            <Poster
                                key={show.id}
                                id={show.id}
                                imageUrl={show.poster_path}
                                title={show.name}
                                rating={show.vote_average}
                                year={show.first_air_date}
                            // year={movie.release_date.substring(0,4)}
                            />
                        ))}
                    </Section>
                )}
            </>}
            {error && <Message color="#e74c3c" text={error} />}
            {tvResults &&
                movieResults &&
                tvResults.length === 0 &&
                movieResults.length === 0 && (
                    <Message text={`Nothing Found for: ${searchTerm}`} color="#e74c3c" />
                )}
        </Container>
    );
}

SearchPresenter.propTypes = {
    movieResults: PropTypes.array,
    tvResults: PropTypes.array,
    searchTerm: PropTypes.string,
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    handlesubmit: PropTypes.func.isRequired,
    updateTerm: PropTypes.func.isRequired
};

export default SearchPresenter;