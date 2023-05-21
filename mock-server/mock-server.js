import * as dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';


dotenv.config({
    path: './.env',
});

const app = express();
const baseUrl = process.env.BASE_URL || 'http://localhost';
const port = process.env.PORT || 3000;
const urlsToScrape = {};
const singleAdvFilenames = {};
const pageFilenames = {};
const __dirname = path.resolve();
const mockFilesPath = '/assets/mocks';

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);

    return Math.round(rand);
}

for (const key in process.env) {
    if (/^URL_[\d]+/.test(key)) {
        const urlPath = process.env[key];

        urlsToScrape[key] = urlPath;

        const fullPath = path.join(__dirname, mockFilesPath, urlPath);
        const files = fs.readdirSync(fullPath);

        singleAdvFilenames[urlPath] = files.filter(filename => /^adv\-[\d]+\.html$/.test(filename));
        pageFilenames[urlPath] = files.filter(filename => /^page\-[\d]+\.html$/.test(filename));
    }
}

/**
 * @param urlPath for example '/real-estate-to-rent/apartments-flats/'
 */
function getRandomAdvFile(urlPath) {
    const randomIndex = randomInteger(0, singleAdvFilenames[urlPath].length - 1);

    return urlPath + singleAdvFilenames[urlPath][randomIndex];
}

/**
 * @param urlPath for example '/real-estate-to-rent/apartments-flats/'
 */
function getRandomPageFile(urlPath) {
    const url = urlPath.charAt(urlPath.length - 1) === '/'
        ? urlPath
        : urlPath + '/';
    const randomIndex = randomInteger(0, pageFilenames[url].length - 1);

    return url + pageFilenames[url][randomIndex];
}

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

let lastUsedCategoryUrl = Object.values(urlsToScrape)[0];

app.use(allowCrossDomain);
app.use(morgan('tiny'));

app.listen(port, () => {
    console.log(`Listening on ${baseUrl}${port ? ':' + port : ''}`);
});

app.get('/', function(req, res) {
    res.status(200).send({
        state: 'Mock server is on',
    });
});

app.get('/real-estate-to-rent/:subcategory/', function(req, res) {
    lastUsedCategoryUrl = req.path;

    res.sendFile(path.join(__dirname, mockFilesPath, getRandomPageFile(lastUsedCategoryUrl)));
});

app.get('/adv/:adv/', function(req, res) {
    res.sendFile(path.join(__dirname, mockFilesPath, getRandomAdvFile(lastUsedCategoryUrl)));
});

app.get('/api/items/item_info/:id/', function(req, res) {
    res.send({
        status_slug: 'publish',
        status_text: 'Active',
        moderator_comment: '',
        is_admin: false,
        user_email: null,
        is_editable: false,
        available_top: false,
        available_update: false,
        is_authenticated: true,
        user_phone: '+35796264672',
        user_name: 'Mikhail',
    });
});
