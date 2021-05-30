import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { FaRegStar } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { useNavigate } from '@reach/router';

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
    const navigate = useNavigate();
    console.log(result.stargazers_count);
    const handleClick = () => {
        navigate(`/details/${result.id}`, { state: {repository: result}});
    }

    return (
        <div className="Result-container">
            <div className="Full-name-text" onClick={handleClick}>{result.full_name}</div>
            <div className="Description-text">{result.description}</div>
            <div className="Result-details-container">
                <IconContext.Provider value={{ color: 'darkslategrey'}}>
                    <FaRegStar />
                </IconContext.Provider>
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
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [sortBy, setSortBy] = useState('stars');

    useEffect(() => {
        const reFetchData = async () => {
            try {
                let q = query;
                if(selectedLanguage) {
                     q += `language:${selectedLanguage}`
                }
                setFetchingResults(true);
                const url = new URL('https://api.github.com/search/repositories');
                url.searchParams.append('q', q);
                url.searchParams.append('per_page', 10);
                url.searchParams.append('order', 'desc');
                url.searchParams.append('sort', sortBy);
                const response = await fetch(url, {
                    headers: {
                        Accept: 'application/vnd.github.v3+json'
                    },
                });
                const responseJSON = await response.json();
                setResults(responseJSON.items);
                setTotalCount(responseJSON.total_count);
                setFetchingResults(false);
            } catch (err) {
                setFetchingResults(false);
                throw err;
            }
        }
        if(results.length > 0) {
            reFetchData();
        }
    }, [sortBy, selectedLanguage])

    const onLanguageSelect = (language) => {
        if(selectedLanguage === language) {
            setSelectedLanguage(null);
        } else {
            setSelectedLanguage(language);
        }
    };

    const handleQueryChange = (event) => {
        setQuery(event.target.value)
    }

    const handleSelectChange = (event) => {
        setSortBy(event.target.value);
    }

    const handleSubmit = async (event) => {
        try {
            setFetchingResults(true);
            event.preventDefault();
            const url = new URL('https://api.github.com/search/repositories');
            url.searchParams.append('q', query);
            url.searchParams.append('per_page', 10);
            url.searchParams.append('order', 'desc');
            url.searchParams.append('sort', sortBy);
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
            <div className="Header">
                <h1 style={{color: 'white', textAlign: 'center'}}>Search Github Repositories</h1>
            </div>
            <div className="Search-container">
                <form onSubmit={handleSubmit}>
                    <input placeholder="Search Github Repositories" className="Search-bar" type="text" name="query" onChange={handleQueryChange} />
                    <input type="submit" value="Search" />
                </form>
            </div>
            {results.length > 0 && (
                <div className="Results-container">
                    <div className="Results-filters">
                        <div className="Language-filters-title">Languages</div>
                        <div className="Language-item" 
                            style={{ backgroundColor: selectedLanguage === 'javascript' && 'blue', color: selectedLanguage === 'javascript' && 'white'}}
                            onClick={() => onLanguageSelect('javascript')}>Javascript</div>
                        <div className="Language-item"
                        style={{ backgroundColor: selectedLanguage === 'python' && 'blue', color: selectedLanguage === 'python' && 'white' }}
                        onClick={() => onLanguageSelect('python')}>Python</div>
                        <div className="Language-item"
                        style={{ backgroundColor: selectedLanguage === 'java' && 'blue', color: selectedLanguage === 'java' && 'white' }}
                        onClick={() => onLanguageSelect('java')}>Java</div>
                        <div className="Language-item" 
                            style={{ backgroundColor: selectedLanguage === 'typescript' && 'blue', color: selectedLanguage === 'typescript' && 'white' }}
                        onClick={() => onLanguageSelect('typescript')}>TypeScript</div>
                        <div className="Language-item"
                            style={{ backgroundColor: selectedLanguage === 'c#' && 'blue', color: selectedLanguage === 'c#' && 'white' }}
                        onClick={() => onLanguageSelect('c#')}>C#</div>
                        <div className="Language-item" 
                            style={{ backgroundColor: selectedLanguage === 'php' && 'blue', color: selectedLanguage === 'php' && 'white' }}
                        onClick={() => onLanguageSelect('php')}>PHP</div>
                        <div className="Language-item" 
                            style={{ backgroundColor: selectedLanguage === 'c++' && 'blue', color: selectedLanguage === 'c++' && 'white' }}
                        onClick={() => onLanguageSelect('c++')}>C++</div>
                        <div className="Language-item"
                            style={{ backgroundColor: selectedLanguage === 'c' && 'blue', color: selectedLanguage === 'c' && 'white' }}
                        onClick={() => onLanguageSelect('c')}>C</div>
                        <div className="Language-item"
                            style={{ backgroundColor: selectedLanguage === 'shell' && 'blue', color: selectedLanguage === 'shell' && 'white' }}
                        onClick={() => onLanguageSelect('shell')}>Shell</div>
                        <div className="Language-item"
                            style={{ backgroundColor: selectedLanguage === 'ruby' && 'blue', color: selectedLanguage === 'ruby' && 'white' }}
                        onClick={() => onLanguageSelect('ruby')}>Ruby</div>
                    </div>
                    <div className="Results-list">
                        <div className="Results-headers">
                            <div className="Total-count-text">{totalCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}<span className="Total-results-sub-text"> repository results</span></div>
                            <select onChange={handleSelectChange} value={sortBy} className="Filter-select">
                                <option value=''>Best Match</option>
                                <option value='stars'>Stars</option>
                            </select>
                        </div>
                        {results.map(result => <ResultItem key={result.id} result={result} />)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Search;