var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/:lang', (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    if (!request.session.record) {

        if (request.params.lang == 'true') {
            response.sendFile(path.join(__dirname, "../public/translates/template-he.json"));
        } else {
            response.sendFile(path.join(__dirname, "../public/translates/template-en.json"));
        }

    } else {
        response.send(JSON.stringify(request.session.record));
    }
    response.status(200);

});


module.exports = router;