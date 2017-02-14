// index.js
const express = require('express')
var session = require('express-session');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var randomstring = require("randomstring");

const app = express()

app.use(session({
    secret: 'ssshhhhh'
}));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}))

// Connect to the db
MongoClient.connect("mongodb://finding:1234@ds155028.mlab.com:55028/elihaidv", function (err, db) {
    findCol = db.collection('finding');
});

app.get('/', (request, response) => {
    response.sendFile("public/views/index.html", {
        root: __dirname
    });
})
app.get('/assets/:folder/:file', (request, response) => {
    response.sendFile("public/" + request.params.folder + "/" + request.params.file, {
        root: __dirname
    });
})
app.get('/assets/:folder/libs/:file', (request, response) => {
    response.sendFile("public/" + request.params.folder + "/libs/" + request.params.file, {
        root: __dirname
    });
})
app.listen(9000)
    // Retrieve



app.post('/login', (request, response) => {
    if (request.body.password && request.body.email) {
        findCol.find({
            password: request.body.password,
            email: request.body.email
        }).toArray(function (err, items) {
            if (items.length == 0) {
                response.status(401);
                response.send();
            } else {
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
app.get('/profile/:id', (request, response) => {

    response.setHeader('Content-Type', 'application/json');

    if (request.session.record) {
        response.send(JSON.stringify({
            details: request.session.record.details,
            isOwner: true
        }));
    } else {
        findCol.find({
            profileKeys: {
                "$in": [request.params.id]
            }
        }).toArray(function (err, items) {
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

app.get('/fields', (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    if (!request.session.record) {
        response.sendFile("public/template.json", {
            root: __dirname
        });
    } else {
        response.send(JSON.stringify(request.session.record));
    }
    response.status(200);

});

app.post('/signup', (request, response) => {

    findCol.find({
        email: request.body.email
    }).toArray((err, items) => {
        if (items.length > 0 && (!request.session.record || request.body.email != request.session.record.email)) {
            response.status(400);
            response.send();
        } else {
            check((randStr) => {
                request.body.profileKeys = request.session.record ? request.session.record.profileKeys : [randStr];
                findCol.update({
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
    findCol.find({
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