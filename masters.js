const mongoose = require('mongoose');

const mastersSchema = new mongoose.Schema({
    // _id:Object,
    masterid: Object,
    mastername: String,
    masterdesc: String,
    subMasterData:Array,
    status: String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})

const zeroLevelMaster=new mongoose.Schema({

})

const master = mongoose.model('masters', mastersSchema);
const ZeroLevelMaster =mongoose.model('zeroLevelMaster',zeroLevelMaster)

module.exports = {
    master,ZeroLevelMaster
}