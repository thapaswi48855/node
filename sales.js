const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    
    patientType:String,
    date: String,
    store: String,
    mrNo: String,
    name: String,
    age: String,
    visitNo: String,
    dept: String,
    doctor: String,
    regdate: String,
    refferBy: String,
    sponsor: String,
    mobileNo: String,
    ipCreditLimit: String,
    govtIdproof: String,
    govtIdProofNo: String,
    bed: String,
    discountPlan: String,
    itemDiscounts:String,
    discountAuth: String,
    billDiscountAp: String,
    roundOffs: String,
    billedAmnt: String,
    billDiscount: String,
    patientAmnt: String,
    patientTax: String,
    grandTotal: String,
    itemDiscount: String,
    roundOff: String,
    priClaim: String,
    priClaimtax: String,
    itemTotal: String,
    billLevelTotal: String,
    secClaim: String,
    secClaimTax: String,
    billType: String,
    remarks: String,
    narration: String,
    patientItems:Array,
    status: String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String,
   
})

const salesReturnSchema =new mongoose.Schema({
    patientType: String,
    date: String,
    store: String,
    mrNo: String,
    name: String,
    age: String,
    visitNo: String,
    dept: String,
    doctor: String,
    regdate: String,
    refferBy: String,
    bed: String,
    billedAmnt: String,
    billDiscount: String,
    patientAmnt: String,
    patientTax: String,
    grandTotal: String,
    itemDiscount: String,
    roundOff: String,
    priClaim: String,
    priClaimtax: String,
    itemTotal: String,
    billLevelTotal: String,
    secClaim: String,
    secClaimTax: String,
    billType: String,
    remarks: String,
    narration: String,
    status: String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})

const patientIndentSchema=new mongoose.Schema({
    mrNo:String,
    name:String,
    age:String,
    visitNo:String,
    dept:String,
    doctor:String,
    ratePlan:String,
    raisedBy:String,
    indentStore:String,
    status:String,
    expectedDate:String,
    remarks:String,
    dispenseStatus:String,
    priortity:String,
    priscriptionDoctor:String,
    status: String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})

const patientReturnIndentSchema=new mongoose.Schema({
    mrNo:String,
    name:String,
    age:String,
    visitNo:String,
    dept:String,
    doctor:String,
    ratePlan:String,
    raisedBy:String,
    indentStore:String,
    status:String,
    expectedDate:String,
    remarks:String,
    dispenseStatus:String,
    priortity:String,
    priscriptionDoctor:String,
    status: String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})


const sales = mongoose.model('sales', salesSchema);
const salesReturn =mongoose.model('salesReturn',salesReturnSchema);
const patientIndent =mongoose.model('patientIndent',patientIndentSchema);
const patientReturnIndent =mongoose.model('patientReturnIndent',patientReturnIndentSchema)

module.exports = {
    sales,salesReturn,patientIndent,patientReturnIndent
}