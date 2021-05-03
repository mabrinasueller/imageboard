const spicedPg = require('spiced-pg');
const db = spicedPg(
    process.env.DATABASE_URL ||
        'postgres:postgres:postgres@localhost:5432/imageboard'
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY id DESC`);
};

module.exports.insertImage = (title, description, username, fullUrl) => {
    return db.query(
        `INSERT INTO images (title, description, username, url) VALUES ($1, $2, $3, $4) RETURNING *`,
        [title, description, username, fullUrl]
    );
};

module.exports.getSingleImage = (imageId) => {
    return db.query(`SELECT * FROM images WHERE id = $1`, [imageId]);
};
