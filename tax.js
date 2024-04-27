const mongoose = require('mongoose');

const taxGroupSchema = new mongoose.Schema({
    taxGrpId:BigInt,
    taxgrouptype: String,
    taxgroup:String,
    taxgrpcd:String,
    taxgroupcode: String,
    displayorder:String,
    status: String,   
    createdt: String,
    createby: String,
    modifydt: String,
    modifyby: String,
})

const taxSubGroupSchema = new mongoose.Schema({
    taxSubGrpId:BigInt,
    taxgroup: String,
    taxgrpcd:String,
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