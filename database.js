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
        });
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
        });
};

exports.uploadImages = function(url, id) {
    return db.query (
        `UPDATE users
        SET img_url = $1
        WHERE id = $2
        RETURNING *;`,
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
        RETURNING *;`,
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

exports.getFriendship = function(user_id, potential_friend_id) {
    return db.query(
        `SELECT *
        FROM friendships
        WHERE (sender_id = $1 AND receiver_id = $2)
        OR (receiver_id = $1 AND sender_id = $2);
        `,
        [user_id, potential_friend_id]
    )
        .then(function (results) {
            return results.rows[0];
        });
};

exports.sendFriendRequest = function(sender_id, receiver_id) {
    return db.query(
        `INSERT INTO friendships
        (sender_id, receiver_id)
        VALUES ($1, $2)
        RETURNING *;
        `,
        [sender_id, receiver_id]
    )
        .then(function (results) {
            return results.rows[0];
        });
};

exports.acceptFriendRequest = function(sender_id, receiver_id) {
    return db.query(
        `UPDATE friendships
        SET accepted = true
        WHERE (receiver_id=$1 AND sender_id = $2)
        OR (sender_id=$1 AND receiver_id = $2)
        RETURNING receiver_id, sender_id, accepted, id;
        `,
        [sender_id, receiver_id]
    )
        .then(function (results) {
            return results.rows[0];
        });
};

exports.endFriendship = function(sender_id, receiver_id) {
    return db.query(
        `DELETE FROM friendships
        WHERE (receiver_id=$1 AND sender_id = $2)
        OR (sender_id=$1 AND receiver_id = $2);
        `,
        [sender_id, receiver_id]
    )
        .then(function (results) {
            return results.rows[0];
        });
};

exports.getFriendsAndWannabes = function(id) {
    return db.query(
        `SELECT users.id, first, last, img_url, accepted
       FROM friendships
       JOIN users
       ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
       OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
       OR (accepted = true AND sender_id = $1 AND receiver_id = users.id);
        `,
        [id]
    )
        .then(function (results) {
            return results.rows;
        });
};

exports.getUsersByIds = function(arrayOfIds) {
    const query = `SELECT id, first, last, img_url FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};
