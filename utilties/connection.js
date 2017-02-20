var express = require('express');
var mongoose = require('mongoose');

mongoose.connect("mongodb://finding:1234@ds155028.mlab.com:55028/elihaidv", {
    server: {
        socketOptions: {
            socketTimeoutMS: 10000,
            connectionTimeout: 10000
        }
    }
});
var Schema = mongoose.Schema;
mongoose.model('profile', new Schema({
    email: String,
    password: String,
    profileKeys: [String],
    details: {
        fullName: String
    }
}, {
    collection: "finding"
}));

module.exports = mongoose.model('profile');