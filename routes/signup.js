var express = require('express');
var router = express.Router();
var col = require('../utilties/connection.js')
var randomstring = require("randomstring");

router.post('/', (request, response) => {

    col.find({
        email: request.body.email
    }, (err, items) => {
        if (items.length > 0 && (!request.session.record || request.body.email != request.session.record.email)) {
            response.status(400);
            response.send();
        } else {
            check((randStr) => {
                request.body.profileKeys = request.session.record ? request.session.record.profileKeys : [randStr];
                col.update({
                    profileKeys: request.body.profileKeys
                }, request.body, {
                    upsert: true
                }, function (err, count, status) {

                    console.log(count);
                    if (!err) {

                        request.session.record = request.body;
                        request.session.record.details.email = request.body.email;

                        response.status(200);
                        response.send(randStr);
                    } else {
                        response.status(500);
                        response.send();
                    }
                });
            });
        }
    });

});


function check(collback) {
    var randStr = randomstring.generate(10);
    col.find({
        profileKeys: {
            "$in": [randStr]
        }
    }).count().then((i) => {
        if (i > 0) {
            check(collback);
        } else {
            collback(randStr);
        }

    });
}

module.exports = router;