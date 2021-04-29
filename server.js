const express = require('express');
const app = express();

app.use(express.static('public'));

const { getImages } = require('./db');

app.get('/images', (req, res) => {
    getImages().then((result) => {
        // console.log('result', result);
        res.json({ success: true, images: result.rows });
    });
});

app.listen(8080, () => console.log('Server is listening'));
