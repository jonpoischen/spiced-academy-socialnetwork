const express = require('express');
const app = express();
const compression = require('compression');
const csurf = require('csurf');
const cookieSession = require('cookie-session');
const db = require('./database.js');
const bodyParser = require('body-parser');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3.js');
const {s3Url} = require('./config.json');
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });

app.use(compression());

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(bodyParser.json());
app.use(require('body-parser').urlencoded({extended: false}));

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie('mytoken', req.csrfToken());
    next();
});

app.use(express.static('public'));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.get('/welcome', function(req, res) {
    if(req.session.userId) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

app.post('/register', function(req, res) {
    db.hashPassword(req.body.password)
        .then(hash => {
            return db.registerUser(req.body.firstname, req.body.lastname, req.body.email, hash)
                .then(results => {
                    req.session.userId = results[0].id;
                    res.json({success:true});
                })
                .catch(err => {
                    console.log(err);
                    res.json({success:false});
                });
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/login', (req, res) => {
    db.showHashPw(req.body.email)
        .then(userPw => {
            if (!userPw) {
                res.json({success:false});
            } else {
                return db.checkPassword(req.body.password, userPw);
            }
        })
        .then(doesMatch => {
            if(doesMatch) {
                db.getLoginId(req.body.email).then(id => {
                    req.session.userId = id;
                    res.json({success:true});
                });
            } else {
                res.json({success:false});
            }
        })
        .catch(err => {console.log(err);});
});

app.post('/upload', uploader.single('file'), s3.upload, function(req, res) {
    const imgUrl = s3Url + req.file.filename;
    db.uploadImages(imgUrl, req.session.userId)
        .then(results => {
            res.json(results);
        })
        .catch(err => {console.log(err);});
});

app.get('/user', async function (req, res) {
    const {rows} = await db.getUserById(req.session.userId);
    res.json(rows[0]);
});

app.post('/bio', function(req, res) {
    db.updateBio(req.body.bio, req.session.userId)
        .then(results => {
            res.json(results);
        })
        .catch(err => {console.log(err);});
});

app.get('/api-user/:id', function(req, res) {
    if(req.session.userId == req.params.id) {
        res.json({success:true});
    } else {
        db.getOppById(req.params.id)
            .then(results => {
                if(!results.rows) {
                    res.json({success:true});
                } else {
                    res.json(results.rows);
                }
            })
            .catch(err => {console.log(err);});
    }
});

app.get('/friendship-status', function(req, res) {
    db.getFriendship(req.session.userId, req.query.id)
        .then(results => {
            res.json(results);
        })
        .catch(err => {console.log(err);});
});

app.post('/send-friend-request', function(req, res) {
    db.sendFriendRequest(req.session.userId, req.body.id)
        .then(results => {
            res.json(results);
        })
        .catch(err => {console.log(err);});
});

app.post('/accept-friend-request', function(req, res) {
    db.acceptFriendRequest(req.session.userId, req.body.receiver_id)
        .then(results => {
            res.json(results);
        })
        .catch(err => {console.log(err);});
});

app.post('/end-friendship', function(req, res) {
    db.endFriendship(req.session.userId, req.body.receiver_id)
        .then(results => {
            res.json(results);
        })
        .catch(err => {console.log(err);});
});

app.get('/api-friends', function(req, res) {
    db.getFriendsAndWannabes(req.session.userId)
        .then(results => {
            res.json(results);
        })
        .catch(err => {console.log(err);});
});

// Should be last one before 8080
app.get('*', function(req, res) {
    if(!req.session.userId) {
        res.redirect('/welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

// // server-side socket code
// let onlineUsers = [];
//
// io.on('connection', function(socket) {
//     console.log("io running");
//     // list of everyone who is online
//     onlineUsers.push({
//         userId: socket.request.session.userId,
//         socketId: socket.id
//     });
//
//     let ids = onlineUsers.map(user => {
//         return user.userId;
//     });
//
//     db.getUsersByIds(ids).then(results => {
//         socket.emit('onlineUsers', results.rows);
//     });
//
//     // take newly connected user's userId and
//     // give to the db to get the user's data
//     // once we have that info, broadcast userJoined event
//     // and include response from db as message
//     socket.broadcast.emit('userJoined', somePayload);
//
//     // remove users when they disconnect to socket
//
//     socket.request.session.userId to get req.session.userId
//
//     // this event fires when a user disconnects
//     socket.on('disconnect', function() {
//         console.log(`socket with the id ${socket.id} is now disconnected`);
//         io.sockets.emit('userLeft', someMessage);
//     });
//
//     socket.on('thanks', function(data) {
//         console.log(data);
//     });
//
//     socket.emit('welcome', {
//         message: 'Welome. It is nice to see you'
//     });
// });
