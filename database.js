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
        returning *;
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
