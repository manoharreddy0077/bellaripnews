


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './news.css';
// import translate from 'google-translate-api';
import logo from './logo.jpg'

const News = () => {
    const [newsData, setNewsData] = useState([]);
    const [language, setLanguage] = useState('kn');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/news');
                setNewsData(response.data);
            } catch (error) {
                console.log('Error fetching data:', error.message);
            }
        };
        fetchData();
    }, []);

    const handleClick = (index) => {
        const articleContent = document.querySelector(`#article-content-${index}`);
        if (articleContent) {
            articleContent.classList.toggle('visible');
        }
    };
    const extractImageSrc=(content)=>{
        const parser=new DOMParser();
        const doc=parser.parseFromString(content,'text/html');
        const imgElement=doc.querySelector('img');

        if(imgElement){
            imgElement.remove();
        }
        return imgElement ? imgElement.src:null;
    };
    // const translateContent=async(index)=>{
    //             try{
    //                 const articleContent=document.querySelector(`#article-content-${index}`);
    //                 const translatedContent=await translate(articleContent.innerText,{to:'en'});
    //                 articleContent.innerText=translateContent.text;
    //             }catch(error){
    //                 console.log('Error translating content:',error.message);
    //             }
    //         };

    const removeImageTag = (content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const imgElement = doc.querySelector('img');
    
        if (imgElement) {
            imgElement.remove();
        }
        // console.log(doc)
        return doc.body.innerHTML;
    };
    const handleLanguageChange=(selectedLanguage)=>{
        setLanguage(selectedLanguage);
    }
   
    return (
        <div>
        <div className="header">
        <img src={logo} alt="Prajavani News Logo" className="prajavani-image" />
            <h1>Prajavani News-Bellari District</h1>
        </div>
            <div className="top-right">
             <div className="language-dropdown">
                <label htmlFor="language">Select Language:</label>
                <select id="language" onChange={(e)=>handleLanguageChange(e.target.value)} value={language}>
                    <option value="kn">Kannada</option>
                    <option value="en">English</option>
                </select>
             </div>
            </div>
            {/* <div className="header-container">
                <img src={logo} alt="Prajavani News Logo" className="prajavani-image" />
                <h1>Prajavani News-Bellari District</h1>
            </div> */}
            <ul>
                {newsData.map((news, index) => (
                    <li key={news.url}>
                        <h2>{news.title}</h2>
                        <div className="article-container">
                        {news.content.includes('<img')&&(<img src={extractImageSrc(news.content)} alt="article image" className='articleimage'/>)}
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


