import React, { useState } from 'react';
import moment from 'moment';

import '../css/Search.css';

function formatStars(num) {
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(1) + 'K';
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num < 1000) {
        return num;
    }
}

const ResultItem = ({ result }) => {
    console.log(result.stargazers_count);
    return (
        <div className="Result-container">
            <div className="Full-name-text">{result.full_name}</div>
            <div>{result.description}</div>
            <div className="Result-details-container">
                <div className="Result-detail">{formatStars(result.stargazers_count)}</div>
                <div className="Result-detail">{result.language}</div>
                {result.license && (
                    <div className="Result-detail">{result.license.name}</div>
                )}
                <div className="Result-detail">{`Updated on ${moment(result.updated_at).format('MMM Do, YYYY')}`}</div>
            </div>
        </div>
    )
}

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [fetchingResults, setFetchingResults] = useState(false);

    const handleQueryChange = (event) => {
        setQuery(event.target.value)
    }

    const handleSubmit = async (event) => {
        try {
            setFetchingResults(true);
            event.preventDefault();
            const url = new URL('https://api.github.com/search/repositories');
            url.searchParams.append('q', query);
            url.searchParams.append('per_page', 10);
            url.searchParams.append('order', 'desc')
            url.searchParams.append('sort', 'stars')
            const response = await fetch(url, {
                headers: {
                    Accept: 'application/vnd.github.v3+json'
                },
            });
            const responseJSON = await response.json();
            setResults(responseJSON.items);
            setTotalCount(responseJSON.total_count);
            setFetchingResults(false);
        } catch(err) {
            setFetchingResults(false);
            throw err;
        }
    }

    console.log(results);
    return (
        <div className="Container">
            <div className="Search-container">
                <h1>Search Github</h1>
                <form onSubmit={handleSubmit}>
                    <input className="Search-bar" type="text" name="query" onChange={handleQueryChange} />
                    <input type="submit" value="Submit" />
                </form>
            </div>
            {results.length > 0 && (
                <div className="Results-container">
                    <div className="Results-filters">
                        <div>Languages</div>
                        <div>Javascript</div>
                    </div>
                    <div className="Results-list">
                    <div className="Total-count-text">{totalCount}<span className="Total-results-sub-text"> repository results</span></div>
                        {results.map(result => <ResultItem key={result.id} result={result} />)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Search;