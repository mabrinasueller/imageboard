const spicedPg = require('spiced-pg');
const db = spicedPg(
    process.env.DATABASE_URL ||
        'postgres:postgres:postgres@localhost:5432/imageboard'
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 9`);
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

module.exports.addComment = (username, commentText, imageId) => {
    return db.query(
        `INSERT INTO comments (username, comment_text, image_id) VALUES ($1, $2, $3) RETURNING *`,
        [username, commentText, imageId]
    );
};

module.exports.selectComments = (imageId) => {
    return db.query(`SELECT * FROM comments WHERE image_id = $1`, [imageId]);
};

// module.exports.getMoreImages = (lowestId) => {
//     return db.query(
//         `SELECT * FROM images WHERE id < $1 ORDER BY id DESC LIMIT 9`,
//         [lowestId]
//     );
// };

module.exports.getMoreImages = (lowestId) => {
    return db.query(
        `SELECT url, title, id, (
SELECT id FROM images
ORDER BY id ASC
LIMIT 1
) AS "lowestId" FROM images
WHERE id < $1
ORDER BY id DESC
LIMIT 9;`,
        [lowestId]
    );
};

// module.exports.deleteImage = (imageId) => {
//     return db.query(`DELETE FROM images WHERE id = $1`, [imageId]);
// };
// module.exports.deleteComments = (imageId) => {
//     return db.query(`DELETE FROM comments WHERE id = $1`, [imageId]);
// };
