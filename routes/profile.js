var express = require('express');
var router = express.Router();
var col = require('../utilties/connection.js')


router.get('/:id', (request, response) => {
    response.setHeader('Content-Type', 'application/json');

    if (request.session.record && request.session.record.profileKeys.indexOf(request.params.id) > -1) {
        response.send(JSON.stringify({
            details: request.session.record.details,
            isOwner: true
        }));
    } else {
        col.instance.findOne({
            profileKeys: {
                "$in": [request.params.id]
            }
        }, (err, item) => {
            if (!item) {
                response.status(404);
                response.send();
            } else {

                var dataRet = item.details;
                dataRet.email = item.email
                response.send(JSON.stringify({
                    details: dataRet
                }));
                response.status(200);
            }
        });
    }
});

module.exports = router;