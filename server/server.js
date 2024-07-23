const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
const PORT = 3001;

const cors = require('cors');
const { log, Console } = require('console');
app.use(cors());

const client = redis.createClient({
    url: 'redis://127.0.0.1:6379'
});

client.on('error', err => console.log('Redis client Error', err));

async function connectToRedis() {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.log('Error connecting to Redis:', error);
    }
}
connectToRedis();

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

const redisGetAsync = promisify(client.get).bind(client);
const redisSetAsync = promisify(client.set).bind(client);

const cacheMiddleware = async (req, res, next) => {
    const { district } = req.params;

    console.log(`Checking Redis for district ${district}`);
    try {
        console.log("in try")
        console.log(district);
        const cachedData = await redisGetAsync(district);
        console.log("after getting cached data");
        if (cachedData) {
            console.log(`Cache hit for ${district}`);
            res.json(JSON.parse(cachedData));
        } else {
            console.log(`Cache miss for ${district}`);
            next(); // Proceed to fetch data from API
        }
    } catch (error) {
        console.error('Error fetching Redis data', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

app.get('/news/:district', async (req, res) => {
    console.log("made http api call to server")
    const { district } = req.params;

    if (!districts.includes(district)) {
        console.log(`Invalid district name: ${district}`);
        return res.status(400).json({ error: 'Invalid district name' });
    }

    try {
        const response = await axios.get(`https://www.prajavani.net/api/v1/collections/${district}-district`);
        console.log(`Fetching data for ${district}`);
        
        if (response.data && response.data.items) {
            const districtData = [];
            for (const item of response.data.items) {
                console.log(item);
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

             // Save response data to Redis cache
            // await redisSetAsync(district, JSON.stringify(districtData), 'EX', 3600);
            res.json(districtData);
            console.log("data sent")
            
        } else {
            console.error(`Error: Unexpected response format for ${district}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    } catch (error) {
        console.error(`Error fetching ${district} district data:`, error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


