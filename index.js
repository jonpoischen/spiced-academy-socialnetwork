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

app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/welcome');
});

app.post('/upload', uploader.single('file'), s3.upload, function(req, res) {
    const imgUrl = s3Url + req.file.filename;
    db.uploadImages(imgUrl, req.session.userId)
        .then(results => {
            res.json(results);
        })
        .catch(err => {console.log(err);});
});

app.post('/feed', uploader.single('file'), s3.upload, function(req) {
    const imgUrl = s3Url + req.file.filename;
    db.uploadFeed(imgUrl, req.body.text, req.session.userId)
        .then(() => {})
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

app.get('/feed-posts', function(req, res) {
    db.getFeedPosts()
        .then(results => {
            res.json(results.rows.reverse());
        })
        .catch(err => {console.log(err);});
});

// "*" should be last one before 8080
// to match anything else (not found above)
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

// server-side socket code
let onlineUsers = [];

io.on('connection', function(socket) {
    console.log("io running. " + new Date().toString().split(" ")[4]);
    if (!socket.request.session || !socket.request.session.userId) {
        return socket.disconnect(true);
    }

    onlineUsers.push({
        userId: socket.request.session.userId,
        socketId: socket.id
    });

    let ids = onlineUsers.map(user => {
        return user.userId;
    });

    db.getUserById(socket.request.session.userId).then(results => {
        socket.broadcast.emit('userJoined', results.rows);
    });

    db.getUsersByIds(ids).then(results => {
        socket.emit('onlineUsers', results.rows);
    });

    db.getSavedMessages().then(results => {
        socket.emit('savedMessages', results.rows.reverse());
    }).catch(err => {console.log(err);});

    socket.on('disconnect', () => {
        io.sockets.emit('userLeft', socket.request.session.userId);
    });

    socket.on('newMessage', function(newMessage) {
        db.newChatPost(socket.request.session.userId, newMessage).then((result) => {
            let msg_time = result.rows[0].msg_created;
            db.getUserById(socket.request.session.userId).then(results => {
                let newMsg = {
                    first: results.rows[0].first,
                    last: results.rows[0].last,
                    img_url: results.rows[0].img_url,
                    message: newMessage,
                    msg_created: msg_time
                };
                io.sockets.emit('newMessage', newMsg);
            });
        }).catch(err => {console.log(err);});
    });
});
