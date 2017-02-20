var express = require('express');
var router = express.Router();
var col = require('../utilties/connection.js')


router.get('/:id', (request, response) => {
    response.setHeader('Content-Type', 'application/json');

    if (request.session.record) {
        response.send(JSON.stringify({
            details: request.session.record.details,
            isOwner: true
        }));
    } else {
        col.find({
            profileKeys: {
                "$in": [request.params.id]
            }
        }, (err, items) => {
            if (items.length == 0) {
                response.status(404);
            } else {

                var dataRet = items[0].details;
                dataRet.email = items[0].email
                response.send(JSON.stringify({
                    details: dataRet
                }));
                response.status(200);
            }
        });
    }
});

module.exports = router;