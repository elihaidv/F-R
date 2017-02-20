var express = require('express');
var session = require('express-session');
var router = express.Router();
var col = require('../utilties/connection.js')

router.post('/login', (request, response) => {
    if (request.body.password && request.body.email) {
        col.model('profile').find({
            password: request.body.password,
            email: request.body.email
        }, (err, items) => {
            if (items.length == 0) {
                response.status(401);
                response.send();
            } else {
                console.log(items[0].profileKeys);
                request.session.record = items[0];
                request.session.record.details.email = items[0].email;

                response.setHeader('Content-Type', 'application/json');


                response.send(JSON.stringify({
                    profileId: items[0].profileKeys[0]
                }));
                response.status(200);
            }
        });
    } else {
        response.status(400);
        response.send();
    }
});

module.exports = router;