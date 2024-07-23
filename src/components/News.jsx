import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './news.css';
import logo from './logo.jpg';
import { translate } from '@vitalets/google-translate-api';
import AdComponent from './AdComponent'; // Import the ad component

const News = () => {
    const [newsData, setNewsData] = useState([]);
    const [language, setLanguage] = useState('kn');
    const [translatedNews, setTranslatedNews] = useState([]);
    const [isTranslated, setIsTranslated] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState('ballari');
    const [theme, setTheme] = useState('light');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3001/news/${selectedDistrict}`);
                setNewsData(response.data);
                setTranslatedNews(response.data);
            } catch (error) {
                console.log('Error fetching data:', error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedDistrict]);

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

    const translateContent = async (content, targetLanguage) => {
        try {
            const translation = await translate(content, { to: targetLanguage });
            return translation.text;
        } catch (error) {
            console.log('Translation Error:', error.message);
            return content;
        }
    };

    const handleLanguageChange = async (selectedLanguage) => {
        setLanguage(selectedLanguage);
        if (selectedLanguage === 'en' && !isTranslated) {
            const translatedData = await Promise.all(newsData.map(async (news) => {
                const translatedTitle = await translateContent(news.title, 'en');
                const translatedSnippet = await translateContent(news.snippet, 'en');
                const translatedContent = await translateContent(removeImageTag(cleanContent(news.content)), 'en');
                return {
                    ...news,
                    title: translatedTitle,
                    snippet: translatedSnippet,
                    content: translatedContent,
                };
            }));
            setTranslatedNews(translatedData);
            setIsTranslated(true);
        } else if (selectedLanguage === 'kn') {
            setTranslatedNews(newsData);
            setIsTranslated(false);
        }
    };

    const handleDistrictChange = (e) => {
        setSelectedDistrict(e.target.value);
    };

    const cleanContent = (content) => {
        return content
            .replace(/ADVERTISEMENTADVERTISEMENTADVERTISEMENT/g, '')
            .replace(/&nbsp;/g, '')
            .replace(/\|/g, '')
            .replace(/ +/g, ' ')
            .trim();
    };

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <div className={`app ${theme}`}>
            <div className="header">
                <img src={logo} alt="Prajavani News Logo" className="prajavani-image" />
                <h1>Prajavani News {selectedDistrict.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h1>
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
                        <option value="koppal">Koppal</option>
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
            {loading ? (
                <AdComponent /> // Display the ad component while loading
            ) : (
                <ul>
                    {translatedNews.map((news, index) => (
                        <li key={news.url}>
                            <h2>{news.title}</h2>
                            <div className="article-container">
                                {news.content.includes('<img') && (
                                    <img src={extractImageSrc(news.content)} alt="news image" className='articleimage' />
                                )}
                                <p>{news.snippet}</p>
                                <button onClick={() => handleClick(index)}>Read Full Article</button>
                                <p id={`article-content-${index}`} className="article-content">
                                    {removeImageTag(cleanContent(news.content))}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default News;


// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import './news.css';
// import logo from './logo.jpg';
// import { translate } from '@vitalets/google-translate-api';
// import cheerio from 'cheerio';

// const News = () => {
//     const [newsData, setNewsData] = useState([]);
//     const [language, setLanguage] = useState('kn');
//     const [translatedNews, setTranslatedNews] = useState([]);
//     const [isTranslated, setIsTranslated] = useState(false);
//     const [selectedDistrict, setSelectedDistrict] = useState('ballari'); // Default district
//     const [theme, setTheme] = useState('light'); // State to manage theme

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get(`https://www.prajavani.net/api/v1/collections/ballari-district`);
//                 const districtData = [];
//                 for (const item of response.data.items) {
//                     const headline = Array.isArray(item.item.headline) ? item.item.headline[0] : item.item.headline;
//                     const title = headline || 'Title Not Available';
//                     const snippet = item.story.seo ? item.story.seo['meta-description'] || 'Snippet not available' : 'Snippet not available';
//                     const url = item.story.url || 'URL Not Available';

//                     try {
//                         const contentResponse = await axios.get(url);
//                         const $ = cheerio.load(contentResponse.data);
//                         const articleText = $('.story-cards').text();
//                         districtData.push({ title, snippet, url, content: articleText });
//                     } catch (contentError) {
//                         console.log('Error processing article:', contentError.message);
//                     }
//                 }
//                 setNewsData(districtData);
//                 setTranslatedNews(districtData); // Initialize translated news with the original data
//             } catch (error) {
//                 console.log('Error fetching data:', error.message);
//             }
//         };
//         fetchData();
//     }, [selectedDistrict]);

//     const handleClick = (index) => {
//         const articleContent = document.querySelector(`#article-content-${index}`);
//         if (articleContent) {
//             articleContent.classList.toggle('visible');
//         }
//     };

//     const extractImageSrc = (content) => {
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(content, 'text/html');
//         const imgElement = doc.querySelector('img');

//         if (imgElement) {
//             imgElement.remove();
//         }
//         return imgElement ? imgElement.src : null;
//     };

//     const removeImageTag = (content) => {
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(content, 'text/html');
//         const imgElement = doc.querySelector('img');

//         if (imgElement) {
//             imgElement.remove();
//         }
//         return doc.body.innerHTML;
//     };

//     const translateContent = async (content, targetLanguage) => {
//         try {
//             const translation = await translate(content, { to: targetLanguage });
//             return translation.text;
//         } catch (error) {
//             console.log('Translation Error:', error.message);
//             return content; // Fallback to original content in case of error
//         }
//     };

//     const handleLanguageChange = async (selectedLanguage) => {
//         setLanguage(selectedLanguage);
//         if (selectedLanguage === 'en' && !isTranslated) {
//             const translatedData = await Promise.all(newsData.map(async (news) => {
//                 const translatedTitle = await translateContent(news.title, 'en');
//                 const translatedSnippet = await translateContent(news.snippet, 'en');
//                 const translatedContent = await translateContent(removeImageTag(cleanContent(news.content)), 'en');
//                 return {
//                     ...news,
//                     title: translatedTitle,
//                     snippet: translatedSnippet,
//                     content: translatedContent,
//                 };
//             }));
//             setTranslatedNews(translatedData);
//             setIsTranslated(true);
//         } else if (selectedLanguage === 'kn') {
//             setTranslatedNews(newsData); // Switch back to original content
//             setIsTranslated(false);
//         }
//     };

//     const handleDistrictChange = (e) => {
//         setSelectedDistrict(e.target.value);
//     };

//     const cleanContent = (content) => {
//         return content
//             .replace(/ADVERTISEMENTADVERTISEMENTADVERTISEMENT/g, '')
//             .replace(/&nbsp;/g, '')
//             .replace(/\|/g, '')
//             .replace(/ +/g, ' ') // Remove extra spaces
//             .trim(); // Remove leading/trailing whitespace
//     };

//     const toggleTheme = () => {
//         setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
//     };

//     return (
//         <div className={`app ${theme}`}>
//             <div className="header">
//                 <img src={logo} alt="Prajavani News Logo" className="prajavani-image" />
//                 <h1>Prajavani News  {selectedDistrict.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h1>
//             </div>
//             <div className="top-right">
//                 <button className="theme-toggle" onClick={toggleTheme}>
//                     {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
//                 </button>
//                 <div className="language-dropdown">
//                     <label htmlFor="language">Select Language:</label>
//                     <select id="language" onChange={(e) => handleLanguageChange(e.target.value)} value={language}>
//                         <option value="kn">Kannada</option>
//                         <option value="en">English</option>
//                     </select>
//                 </div>
//                 <div className="district-dropdown">
//                     <label htmlFor="district">Select District:</label>
//                     <select id="district" onChange={handleDistrictChange} value={selectedDistrict}>
//                         <option value="ballari">Ballari District</option>
//                         <option value="bagalkot">Bagalkot</option>
//                         <option value="belagavi">Belagavi</option>
//                         <option value="bengaluru-city">Bengaluru City</option>
//                         <option value="bangaluru-rural">Bengaluru Rural</option>
//                         <option value="bidar">Bidar</option>
//                         <option value="chamarajanagara">Chamarajanagar</option>
//                         <option value="chikkballapur">Chikballapur</option>
//                         <option value="chikkamagaluru">Chikkamagaluru</option>
//                         <option value="chitradurga">Chitradurga</option>
//                         <option value="dakshina-kannada">Dakshina Kannada</option>
//                         <option value="davanagere">Davanagere</option>
//                         <option value="dharwad">Dharwad</option>
//                         <option value="gadaga">Gadag</option>
//                         <option value="hasana">Hassan</option>
//                         <option value="haveri">Haveri</option>
//                         <option value="kalaburagi">Kalaburagi</option>
//                         <option value="kodagu">Kodagu</option>
//                         <option value="kolar">Kolar</option>
//                         <option value="koppal">Koppal</option>
//                         <option value="mandya">Mandya</option>
//                         <option value="mysuru">Mysuru</option>
//                         <option value="raichur">Raichur</option>
//                         <option value="ramanagara">Ramanagara</option>
//                         <option value="shivamogga">Shivamogga</option>
//                         <option value="tumakuru">Tumakuru</option>
//                         <option value="udupi">Udupi</option>
//                         <option value="uttara-kannada">Uttara Kannada</option>
//                         <option value="vijayapura">Vijayapura</option>
//                         <option value="yadagiri">Yadgir</option>
//                     </select>
//                 </div>
//             </div>
//             <ul>
//                 {translatedNews.map((news, index) => (
//                     <li key={news.url}>
//                         <h2>{news.title}</h2>
//                         <div className="article-container">
//                             {news.content.includes('<img') && (
//                                 <img src={extractImageSrc(news.content)} alt="news image" className='articleimage' />
//                             )}
//                             <p>{news.snippet}</p>
//                             <button onClick={() => handleClick(index)}>Read Full Article</button>
//                             <p id={`article-content-${index}`} className="article-content">
//                                 {removeImageTag(cleanContent(news.content))}
//                             </p>
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default News;
