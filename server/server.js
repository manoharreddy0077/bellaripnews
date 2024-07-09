// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');

// const app = express();
// const PORT = 3001;

// const cors = require('cors');
// app.use(cors());



// app.get('/api/news', async (req, res) => {
//     try {
//         const response = await axios.get('https://www.prajavani.net/api/v1/collections/koppal-district');
//         console.log("into backend")
//         // console.log(response.data.items);
//         console.log("only first items",response.data.items[0].item.headline)
//         if (response.data && response.data.items) {
//             const bellariDistrictData = [];
//             for (const item of response.data.items) {
//                 const headline = Array.isArray(item.item.headline) ? item.item.headline[0] : item.item.headline;
//                 const title = headline || 'Title Not Available';
//                 const snippet = item.story.seo ? item.story.seo['meta-description'] || 'Snippet not available' : 'Snippet not available';
//                 const url = item.story.url || 'URL Not Available';
                
//                 try {
//                     const contentResponse = await axios.get(url);
//                     const $ = cheerio.load(contentResponse.data);
//                     const articleText = $('.story-cards').text();
                    
//                     bellariDistrictData.push({ title, snippet, url, content: articleText });
//                     // console.log(bellariDistrictData[0]);
//                 } catch (contentError) {
//                     console.log('Error processing article:', contentError.message);
//                 }
//             }
//             res.json(bellariDistrictData);
//         } else {
//             console.error('Error: Unexpected response format - missing "items" property');
//             res.status(500).json({ error: 'Internal server Error' });
//         }
//     } catch (error) {
//         console.error('Error fetching Ballari district data:', error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3001;

const cors = require('cors');
app.use(cors());

// Define district names
const districts = [
    'bagalkot',
    'ballari', // Changed from 'ballari' to 'ballari-district' as per your request
    'belagavi',
    'bengaluru-rural',
    'bengaluru-urban',
    'bidar',
    'chamarajanagar',
    'chikkballapur',
    'chikkamagaluru',
    'chitradurga',
    'dakshina-kannada',
    'davanagere',
    'dharwad',
    'gadag',
    'hassan',
    'haveri',
    'kalaburagi',
    'kodagu',
    'kolar',
    'koppal',
    'mandya',
    'mysuru',
    'raichur',
    'ramanagara',
    'shivamogga',
    'tumakuru',
    'udupi',
    'uttara-kannada',
    'vijayapura',
    'yadgir'
];

app.get('/api/news/:district', async (req, res) => {
    const { district } = req.params;

    if (!districts.includes(district)) {
        return res.status(400).json({ error: 'Invalid district name' });
    }

    try {
        const response = await axios.get(`https://www.prajavani.net/api/v1/collections/${district}-district`);
        console.log(`Fetching data for ${district}`);
        
        if (response.data && response.data.items) {
            const districtData = [];
            for (const item of response.data.items) {
                const headline = Array.isArray(item.item.headline) ? item.item.headline[0] : item.item.headline;
                const title = headline || 'Title Not Available';
                const snippet = item.story.seo ? item.story.seo['meta-description'] || 'Snippet not available' : 'Snippet not available';
                const url = item.story.url || 'URL Not Available';
                
                try {
                    const contentResponse = await axios.get(url);
                    const $ = cheerio.load(contentResponse.data);
                    const articleText = $('.story-cards').text();
                    
                    districtData.push({ title, snippet, url, content: articleText });
                } catch (contentError) {
                    console.log('Error processing article:', contentError.message);
                }
            }
            res.json(districtData);
        } else {
            console.error(`Error: Unexpected response format for ${district}`);
            res.status(500).json({ error: 'Internal server Error' });
        }
    } catch (error) {
        console.error(`Error fetching ${district} district data:`, error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const redis = require('redis');

// const app = express();
// const PORT = 3001;
// const REDIS_PORT = 6379;

// const cors = require('cors');
// app.use(cors());

// app.get('/api/news', async (req, res) => {
//     try {
//         const response = await axios.get('https://www.prajavani.net/api/v1/collections/ballari-district');
//         console.log("into backend")
//         // console.log(response.data.items);
//         console.log("only first items",response.data.items[0].item.headline)
//         if (response.data && response.data.items) {
//             const bellariDistrictData = [];
//             for (const item of response.data.items) {
//                 const headline = Array.isArray(item.item.headline) ? item.item.headline[0] : item.item.headline;
//                 const title = headline || 'Title Not Available';
//                 const snippet = item.story.seo ? item.story.seo['meta-description'] || 'Snippet not available' : 'Snippet not available';
//                 const url = item.story.url || 'URL Not Available';

//                 try {
//                     const contentResponse = await axios.get(url);
//                     const $ = cheerio.load(contentResponse.data);
//                     const articleText = $('.story-cards').text();

//                     bellariDistrictData.push({ title, snippet, url, content: articleText });
//                     // console.log(bellariDistrictData[0]);
//                 } catch (contentError) {
//                     console.log('Error processing article:', contentError.message);
//                 }
//             }
//             res.json(bellariDistrictData);
//         } else {
//             console.error('Error: Unexpected response format - missing "items" property');
//             res.status(500).json({ error: 'Internal server Error' });
//         }
//     } catch (error) {
//         console.error('Error fetching Ballari district data:', error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// const server = app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// const client = redis.createClient(REDIS_PORT);

// client.on('error', (err) => {
//     console.error('Redis error:', err);
// });

// // Close the Redis client when the server is shut down
// process.on('SIGINT', () => {
//     console.log('Closing Redis client and exiting server');
//     client.quit();
//     server.close(() => {
//         process.exit(0);
//     });
// });




// FETCHING article  image USING WEB SCRAPPING -- Not successful


// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');

// const app = express();
// const PORT = 3001;

// const cors = require('cors');
// app.use(cors());

// const fetchArticleContent = async (articleUrl) => {
//   try {
//     const { data } = await axios.get(articleUrl);
//     const $ = cheerio.load(data);
//     const articleText = $('.story-cards').text();
//     const imageSrc = $('.qt-image').attr('data-src'); // Change the selector based on your specific page structure
//     return { content: articleText, imageSrc };
//   } catch (error) {
//     console.error('Error fetching article content for', articleUrl, ':', error.message);
//     throw error;
//   }
// };

// app.get('/api/news', async (req, res) => {
//     try {
//         const response = await axios.get('https://www.prajavani.net/api/v1/collections/ballari-district');
//         console.log("into backend");

//         if (response.data && response.data.items) {
//             const bellariDistrictData = [];

//             for (const item of response.data.items) {
//                 const headline = Array.isArray(item.item.headline) ? item.item.headline[0] : item.item.headline;
//                 const title = headline || 'Title Not Available';
//                 const snippet = item.story.seo ? item.story.seo['meta-description'] || 'Snippet not available' : 'Snippet not available';
//                 const url = item.story.url || 'URL Not Available';

//                 try {
//                     const { content, imageSrc } = await fetchArticleContent(url);
//                     bellariDistrictData.push({ title, snippet, url, content, imageUrl: imageSrc });
//                 } catch (contentError) {
//                     console.log('Error processing article:', contentError.message);
//                 }
//             }

//             res.json(bellariDistrictData);
//         } else {
//             console.error('Error: Unexpected response format - missing "items" property');
//             res.status(500).json({ error: 'Internal server Error' });
//         }
//     } catch (error) {
//         console.error('Error fetching Ballari district data:', error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
