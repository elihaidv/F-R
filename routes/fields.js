var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    if (!request.session.record) {
        response.sendFile(path.join(__dirname, "../public/template.json"));

    } else {
        response.send(JSON.stringify(request.session.record));
    }
    response.status(200);

});


module.exports = router;