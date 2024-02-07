const mongoose = require('mongoose');

const taxGroupSchema = new mongoose.Schema({
    taxgrouptype: String,
    taxgroup:String,
    taxgroupcode: String,
    displayorder:String,
    status: String,   
    createdt: String,
    createby: String,
    modifydt: String,
    modifyby: String,
})

const taxSubGroupSchema = new mongoose.Schema({
    taxgroup: String,
    taxsubgroup:String,
    status: String,
    displayorder:String,
    taxrate:String,  
    validityStartDt:String,
    validityEndDt:String,
    taxrateexpression:String, 
    createdt: String,
    createby: String,
    modifydt: String,
    modifyby: String
})

const taxGroup = mongoose.model('taxGroup', taxGroupSchema);
const taxSubGroup = mongoose.model('taxSubGroup', taxSubGroupSchema);

module.exports = {
    taxGroup,taxSubGroup
}