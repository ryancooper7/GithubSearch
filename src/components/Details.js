import React, { useEffect, useState } from 'react';
import '../css/Details.css';

export default (props) => {
    const [languages, setLanguages] = useState({});
    const [contributors, setContributors] = useState([]);
    useEffect(() => {
        const fetchLanguages = async () => {
            console.log(repository.languages_url);
            const languages = await fetch(new URL(repository.languages_url));
            const languagesJSON = await languages.json();
            setLanguages(languagesJSON);
            console.log(languagesJSON);
        }
        const fetchContributors = async () => {
            console.log(repository.contributors_url);
            const contributors = await fetch(new URL(repository.contributors_url));
            const contributorsJSON = await contributors.json();
            setContributors(contributorsJSON.slice(0, 5));
            console.log(contributorsJSON);
        }
        fetchLanguages();
        fetchContributors();
    }, []);
    const repository = props.location.state.repository;
    let totalLinesOfCode = 0;
    if(Object.values(languages).length > 0) {
        totalLinesOfCode = Object.values(languages).reduce((sum, numberOfLines) => sum + numberOfLines);
    }
    return (
        <div className="Container">
            <div className="Title">{repository.full_name}</div>
            <div className="Content-container">
                <div className="Container-row">
                    <div className="Sub-container">
                        <div className="Container-title">
                            Project Details
                    </div>
                        <div style={{marginTop: 10, marginLeft: 10}}>
                            {repository.description}
                        </div>
                        {repository.license && (
                            <div className="License">{repository.license.name}</div>
                        )}
                    </div>
                    <div className="Sub-container">
                        <div className="Container-title">
                            Languages Used in This Project
                    </div>
                        {Object.keys(languages).map(language => {
                            return (
                                <div className="Language-percentage-container">
                                    <div className="Language-name">{language}</div>
                                    <div style={{ flex: 1 }}>{Math.round(languages[language] * 1000 / totalLinesOfCode) / 10}%</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="Container-row">
                    <div className="Sub-container">
                        <div className="Container-title">
                            Other Details
                        </div>
                        <div className="Language-percentage-container">
                            <div className="Language-name">Stars</div>
                            <div style={{ flex: 1 }}>{repository.stargazers_count}</div>
                        </div>
                        <div className="Language-percentage-container">
                            <div className="Language-name">Number of Forks</div>
                            <div style={{ flex: 1 }}>{repository.forks_count}</div>
                        </div>
                        <div className="Language-percentage-container">
                            <div className="Language-name">Number of Watcbers</div>
                            <div style={{ flex: 1 }}>{repository.watchers}</div>
                        </div>
                    </div>
                    <div className="Sub-container">
                        <div className="Container-title">
                            Top Contributors
                    </div>
                        {contributors.map(contributor => {
                            return (
                                <div className="Language-percentage-container">
                                    <div className="Language-name">{contributor.login}</div>
                                    <div style={{flex: 1}}>{contributor.contributions} lines of code</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}