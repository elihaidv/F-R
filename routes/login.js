var express = require('express');
var session = require('express-session');
var router = express.Router();
var col = require('../utilties/connection.js')

router.post('/login', (request, response) => {
    if (request.body.password && request.body.email) {
        col.instance.findOne({
            password: request.body.password,
            email: request.body.email
        }, (err, items) => {
            if (!items) {
                response.status(401);
                response.send();
            } else {
                request.session.record = items;
                request.session.record.details.email = items.email;

                response.setHeader('Content-Type', 'application/json');


                response.send(JSON.stringify({
                    profileId: items.profileKeys[0]
                }));
                response.status(200);
            }
        });
    } else {
        response.status(400);
        response.send();
    }
});

router.get('/', (req, res) => {
    if (req.session.record) {
        res.send({
            isSession: true,
            profileKey: req.session.record.profileKeys[0]
        });
    } else {
        res.send({
            isSession: false
        });
    }
    res.status(200);
});

router.delete('/login', (req, res) => {
    req.session.record = undefined;
    res.status(200);
    res.send();
});

module.exports = router;