const mongoose = require('mongoose');

const documentsSchema = new mongoose.Schema({
    // _id:Object,
    // name: String,
    documentid:Integer,
    document: String,
    documentpageurl: String,
    documentgridUrl: String,
    documentdescription: String,
    status:String,
    createdt: String,
    createby: String,
    modifydt: String,
    modifyby: String,
})


const moduleSchema = new mongoose.Schema({
    moduleid:String,
    modulename: String,
    moduledesc: String,
    status: String,
    submodel: [{
        submoduleid:String,
        submodulename: String,
        submoduledesc: String,
        submodelstatus: String,
    }]
})

const moduleDocumentsSchema = new mongoose.Schema({
    moduledocMapid:String,
    moduleid: Object,
    modulename: String,
    submoduleid: Object,
    submodulename: String,
    documentid: Object,
    documentname: String,
    documentstatus: Boolean,
    documentpageurl: String,
    documentgridUrl: String
})

const roleSchema = new mongoose.Schema({
    role: String,
    roledesc: String,
    rolestatus: String
})

const assigneByPermissions = new mongoose.Schema({
    assignepermissionid:String,
    roleid: Object,
    rolename: String,
    moduleid: Object,
    modulename: String,
    submoduleid: Object,
    submodulename: String,
    documentid: Object,
    documentname: String,
    docAccAddNew: Boolean,
    docAccClear: Boolean,
    docAccEdit: Boolean,
    docAccExport: Boolean,
    docAccGridView: Boolean,
    docAccView: Boolean,
    docAccSubmit: Boolean,
    documentpageurl: String,
    documentgridUrl: String
})

const newUserSchema = new mongoose.Schema({
    userid:String,
    userRoleid: String,
    userName: String,
    userPhno: String,
    userEmail: String,
    userPwd: String,
    useraddress: String,
    userstatus: String,
    createdt: String,
    createby: String,
    modifydt: String,
    modifyby: String
})


// const tableArray =new mongoose.Schema({
//     table1:"daynamictable1",
//     table2:"daynamictable2",
// })

const Document = mongoose.model('document', documentsSchema);
const Module = mongoose.model('module', moduleSchema);
const ModuleDocument = mongoose.model('moduledocument', moduleDocumentsSchema);
const Roles = mongoose.model('role', roleSchema);
const AssigneByPermissions = mongoose.model('assigneByPermissions', assigneByPermissions)
const newUser = mongoose.model('newUser',newUserSchema)

module.exports = {
    Document, Module, ModuleDocument, Roles, AssigneByPermissions,newUser
}