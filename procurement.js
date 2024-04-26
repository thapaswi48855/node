const mongoose = require('mongoose');

const rasiePurchaseOrderSchema = new mongoose.Schema({
    poNumId:BigInt,
    supplier: String,
    supplierAdderss: String,
    poallowedTo: String,
    poDate: String,
    poNumber:String,
    enquiryNo: String,
    enuiryDate: String,
    quotationNo: String,
    quotationDate: String,
    Reference: String,
    creditPeriod: String,
    purposeOfPurchase: String,
    uploadDocumment: String,
    expectedDeliveryDate: String,
    remarks: String,
    seletedItemList:String,
    purchuseItems:Array,
    cgst: String,
    sgst: String,
    gst: String,
    taxAmount: String,
    totalItemAmount: String,
    poDiscountType: String,
    poDiscountValue: String,
    poDiscontAmount: String,
    roundOff: String,
    transportationCharges: String,
    poTotal: String,
    status: String,
    approvalStatus:String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})

const stockEntrySchema =new mongoose.Schema({
    stockEntryId:BigInt,
    store: String,
    ponumber: String,
    quantityUom: String,
    supplier: String,
    supplieraddress: String,
    invoiceNo: String,
    invoiceDte: String,
    dueDate: String,
    status: String,
    stockType: String,
    cashPurchase: String,
    poReference: String,
    itemDiscountType: String,
    itemDiscountValue: String,
    remarks: String,
    paymentRemarks: String,
    uploadInvoiceCopy: String,
    purposeOfPurchase: String,
    companyname: String,
    meansTransport: String,
    consignmentNo: String,
    consignmentDate: String,
    seletedItemList:Array,
    totalItemSchDiscount: String,  
    cgst: String,
    sgst: String,
    gst: String,
    taxAmount: String,
    invDiscountType: String,
    invDiscountValue: String,
    transportCharges: String,
    invDiscountAmount: String,
    otherCharges: String,
    roundOff: String,
    debitAmount: String,
    invoiceTotal: String,
    approvalStatus:String,
    createdt: String,
    createby: String,
    modifydt: String,
    modifyby: String,
    totalcgst: String,
    totalsgst: String,
    tataltaxAmt: String,
    totalItemDiscount: String,
    totalItemAmount: String,
    sgsttaxrate: String,
    cgsttaxRate: String,
    InvDiscountType:String,
    InvDiscountValue:String,
    InvDiscontAmount:String,
    debitAmt:String,
    InvTotal:String
})

const rasiePurchaseOrder = mongoose.model('rasiePurchaseOrder', rasiePurchaseOrderSchema);
const stockEntry = mongoose.model('stockEntry', stockEntrySchema);

module.exports = {
    rasiePurchaseOrder,stockEntry
}