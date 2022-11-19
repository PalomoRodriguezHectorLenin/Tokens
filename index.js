const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
var server = require('http').createServer(app);

app.get('/', (req, res) => {
    res.json({
        text: 'api works!'
    });
});

app.post('/api/login', (req, res) => {
    const user = { id: 3 }
    const token = jwt.sign({ user }, 'my_secret_key')
    res.json({
        token
    });
});

app.get('/api/protected', ensureToken, (req, res) => {
    jwt.verify(req.token, 'my_secret_key', (err, data) => {
        if (err) {
            res.sendStatus(403)
        } else {
            res.json({
                text: 'protected',
                data
             });
        }
    })
});

function ensureToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split("");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), ()=>{
    console.log('server on port', app.get('port'));
});