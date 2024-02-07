const mongoose = require('mongoose');

const custmerSchema = new mongoose.Schema({
    name:String,
    indrastry:String
})

module.exports = mongoose.model('custmerSch',custmerSchema)