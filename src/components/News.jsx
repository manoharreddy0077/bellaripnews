import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './news.css';
import logo from './logo.jpg';

const News = () => {
    const [newsData, setNewsData] = useState([]);
    const [language, setLanguage] = useState('kn');
    const [selectedDistrict, setSelectedDistrict] = useState('ballari'); // Default district
    const [theme, setTheme] = useState('light'); // State to manage theme

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/news/${selectedDistrict}`);
                setNewsData(response.data);
            } catch (error) {
                console.log('Error fetching data:', error.message);
            }
        };
        fetchData();
    }, [selectedDistrict]); // Fetch data when selectedDistrict changes

    const handleClick = (index) => {
        const articleContent = document.querySelector(`#article-content-${index}`);
        if (articleContent) {
            articleContent.classList.toggle('visible');
        }
    };

    const extractImageSrc = (content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const imgElement = doc.querySelector('img');

        if (imgElement) {
            imgElement.remove();
        }
        return imgElement ? imgElement.src : null;
    };

    const removeImageTag = (content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const imgElement = doc.querySelector('img');

        if (imgElement) {
            imgElement.remove();
        }
        return doc.body.innerHTML;
    };

    const handleLanguageChange = (selectedLanguage) => {
        setLanguage(selectedLanguage);
    };

    const handleDistrictChange = (e) => {
        setSelectedDistrict(e.target.value);
    };

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <div className={`app ${theme}`}>
            <div className="header">
                <img src={logo} alt="Prajavani News Logo" className="prajavani-image" />
                <h1>Prajavani News  {selectedDistrict.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h1>
            </div>
            <div className="top-right">
            <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                </button>
                <div className="language-dropdown">
                    <label htmlFor="language">Select Language:</label>
                    <select id="language" onChange={(e) => handleLanguageChange(e.target.value)} value={language}>
                        <option value="kn">Kannada</option>
                        <option value="en">English</option>
                    </select>

                </div>
                <div className="district-dropdown">
                    <label htmlFor="district">Select District:</label>
                    <select id="district" onChange={handleDistrictChange} value={selectedDistrict}>
                        <option value="ballari">Ballari District</option>
                        <option value="bagalkot">Bagalkot</option>
                        <option value="belagavi">Belagavi</option>
                        <option value="bengaluru-city">Bengaluru City</option>
                        <option value="bangaluru-rural">Bengaluru Rural</option>
                        <option value="bidar">Bidar</option>
                        <option value="chamarajanagara">Chamarajanagar</option>
                        <option value="chikkballapur">Chikballapur</option>
                        <option value="chikkamagaluru">Chikkamagaluru</option>
                        <option value="chitradurga">Chitradurga</option>
                        <option value="dakshina-kannada">Dakshina Kannada</option>
                        <option value="davanagere">Davanagere</option>
                        <option value="dharwad">Dharwad</option>
                        <option value="gadaga">Gadag</option>
                        <option value="hasana">Hassan</option>
                        <option value="haveri">Haveri</option>
                        <option value="kalaburagi">Kalaburagi</option>
                        <option value="kodagu">Kodagu</option>
                        <option value="kolar">Kolar</option>
                        <option value="koppal">Koppal</                    option>
                        <option value="mandya">Mandya</option>
                        <option value="mysuru">Mysuru</option>
                        <option value="raichur">Raichur</option>
                        <option value="ramanagara">Ramanagara</option>
                        <option value="shivamogga">Shivamogga</option>
                        <option value="tumakuru">Tumakuru</option>
                        <option value="udupi">Udupi</option>
                        <option value="uttara-kannada">Uttara Kannada</option>
                        <option value="vijayapura">Vijayapura</option>
                        <option value="yadagiri">Yadgir</option>
                    </select>
                </div>
            </div>
            <ul>
                {newsData.map((news, index) => (
                    <li key={news.url}>
                        <h2>{news.title}</h2>
                        <div className="article-container">
                            {news.content.includes('<img') && (<img src={extractImageSrc(news.content)} alt="image" className='articleimage' />)}
                            <p>{news.snippet}</p>
                            <button onClick={() => handleClick(index)}>Read Full Article</button>
                            <p id={`article-content-${index}`} className="article-content">
                                {removeImageTag(news.content)}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default News;
