'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//chat Schema
var userImageSchema = new Schema({
    imageId: String,
    imageData: String,
    userName: String,
    userSkill: String,
    date: Date
});

//building models
module.exports = mongoose.model("UserImages", userImageSchema);
