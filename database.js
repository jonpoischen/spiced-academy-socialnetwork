var spicedPg = require('spiced-pg');
var bcrypt = require('bcryptjs');
var secrets = require('./secrets.json');
var dbUrl = 'postgres:' + secrets.dbUser + ':' + secrets.dbPassword + '@localhost:5432/social_network';
var db = spicedPg(dbUrl);

exports.registerUser = function (firstname, lastname, email, hashedpw) {
    return db.query (`
        INSERT INTO users
        (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
    [firstname, lastname, email, hashedpw]
    )
        .then(function (results) {
            return results.rows;
        });
};

exports.hashPassword = function(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
};

exports.showHashPw = function (email) {
    return db.query(`SELECT password FROM users WHERE email = $1`, [email])
        .then(function(result) {
            return result.rows[0] && result.rows[0].password;
        })
        .catch(function(err) {console.log(err);});
};

exports.checkPassword = function(textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
            if (err) {
                reject(err);
            } else {
                resolve(doesMatch);
            }
        });
    });
};

exports.getLoginId = function (email) {
    return db.query(`SELECT id FROM users WHERE email = $1`, [email])
        .then(function(result) {
            return result.rows[0].id;
        })
        .catch(err => {
            console.log(err);
        });
};

exports.uploadImages = function(url, id) {
    return db.query (
        `UPDATE users
        SET img_url = $1
        WHERE id = $2
        returning *;`,
        [url, id]
    )
        .then(function (results) {
            return results.rows;
        });
};

exports.getUserById = function(id) {
    return db.query(
        `SELECT first, last, img_url, bio, id
        FROM users
        WHERE id = $1;
        `,
        [id]
    );
};

exports.updateBio = function(bio, id) {
    return db.query(
        `UPDATE users
        SET bio = $1
        WHERE id = $2
        returning *;`,
        [bio, id]
    )
        .then(function (results) {
            return results.rows;
        });
};

exports.getOppById = function(id) {
    return db.query(
        `SELECT first, last, img_url, bio
        FROM users
        WHERE id = $1;
        `,
        [id]
    );
};
