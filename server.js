const express = require('express');
const app = express();
const { getImages, insertImage, getSingleImage } = require('./db');

const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3');
const { s3Url } = require('./config.json');

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152, //files over 2mb can't be uploaded
    },
});

app.use(express.static('public'));

app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    console.log('upload worked!');
    //inserting into database (title, desc, username and filename)
    console.log('req.body: ', req.body);
    console.log('req.file', req.file); //comes from multer

    if (req.file) {
        const { title, description, username } = req.body;
        const { filename } = req.file;
        var fullUrl = s3Url + filename;
        console.log('fullUrl: ', fullUrl);

        insertImage(title, description, username, fullUrl)
            .then((result) => {
                console.log('result.rows:', result.rows[0]);
                res.json(result.rows[0]);
            })
            .catch((error) => console.log('error', error));
        //send back a response to Vue using res.json
    } else {
        res.json({ success: false });
    }
});

app.get('/images', (req, res) => {
    getImages().then((result) => {
        res.json({ success: true, images: result.rows });
    });
});

app.get('/images/:imageId', (req, res) => {
    getSingleImage(req.params.imageId).then((result) => {
        res.json(result.rows[0]);
    });
});
app.listen(8080, () => console.log('Server is listening'));
