var express = require('express');
//var mongoose = require('mongoose');

//mongoose.connect("mongodb://finding:1234@ds155028.mlab.com:55028/elihaidv"); //mongoose.connect("mongodb://localhost:27017/elihaidv", {
//
//var Schema = mongoose.Schema;
//mongoose.model('profile', new Schema({
//    email: String,
//    password: String,
//    profileKeys: [String],
//    details: {}
//}, {
//    collection: "finding"
//}));
//mongoose.connection.once("open", function () {
//    console.log("Connect!");
//});
//
//module.exports = mongoose.model('profile');
require('mongodb').MongoClient.connect("mongodb://finding:1234@ds155028.mlab.com:55028/elihaidv", function (err, db) {
    module.exports.instance = db.collection("finding");
});