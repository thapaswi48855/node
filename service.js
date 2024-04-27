const mongoose = require('mongoose');

const serviceGroupSchema = new mongoose.Schema({
    serviceGrpId:BigInt,
    servicegroupname:String,
    displayorder:String,
    code:String,    
    status: String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})

const serviceSubGroupSchema = new mongoose.Schema({
    serviceSubGrpId:BigInt,
    servicegroupname:String,
    accounthead:String,
    servicesubgroupname:String,    
    displayorder:String,
    code:String,    
    status: String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})

const serviceGroup = mongoose.model('serviceGroup', serviceGroupSchema);
const serviceSubGroup = mongoose.model('serviceSubGroup', serviceSubGroupSchema);

module.exports = {
    serviceGroup,serviceSubGroup
}