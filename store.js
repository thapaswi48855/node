const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const storeTypeMasterSchema = new mongoose.Schema({
    storetypename: String,
    storedescription: String,
    status: String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})

const storeMasterSchema= new mongoose.Schema({
    store: String,
    counter: String,
    status:String,
    gstinno:String,
    drugLicenceNo:String,
    autoFillPrecription:String,
    accountGroup:String,
    salesAcountPrefix:String,
    purcheseAccountPrefix:String,
    storeType:String,
    isSuperStore:String,
    salesUnit:String,
    allowToRiseBill:String,
    precriptionPrintTemplate:String,
    precriptionLabelPrintTemplate:String,
    salesPrintTemplate:String,
    isSalesStore:String,
    autoFillIndent:String,
    isSterileStore:String,
    storesTariff:String,
    useSellingPriceFromItemBatch:String,
    grnPrintTemplate:String,
    allowAutoPOGeneration:String,
    pOGenerationFrequency:String,
    autoCancelPO:String,
    autoCancelPOFreuency:String,
    salesWebTemplate:String,
    salesWebPrinter:String,
    batchExpireThesholdForStockTake:String,
    createdt: String,
    createby: String,
    modifydt: String,
    modifyby: String,
})

const uomCreationSchema = new mongoose.Schema({
    packageUom: String,
    unitUom: String,
    pkgSize: String,
    integrationId:String,
    status:String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})

const addItemCategorySchema = new mongoose.Schema({
    categoryName: String,
    identification: String,
    issuseType:String,
    bilable:String,
    retilable:String,
    calmiable:String,
    validateExpireDate:Date,
    discount:String,
    prescribable:String,
    assestsTracking:String,
    status:String,
    drug:String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})

const genericClassificationSchema = new mongoose.Schema({
    clasificationName: String,
    clasificationDesc: String,
    status:String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})

const genericSubClassificationSchema = new mongoose.Schema({
    clasificationName:String,
    subClasificationName: String,
    subClasificationDesc: String,
    status:String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})

const genericDetailsSchema = new mongoose.Schema({
    genericName: String,
    clasificationName: String,
    subClassificationName:String,
    standrdAdultDose: String,
    crability: String,
    status:String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})

const supplierCategorySchema = new mongoose.Schema({
    categoryname: String,
    categorydescription: String,
    status:String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})

const manufacureCreationSchema = new mongoose.Schema({
    manufacturename: String,
    status: String,
    manufacturecode: String,
    regioncountry: String,
    regionstate: String,
    regioncity: String,
    contactaddress: String,
    contactphone1: String,
    contactphone2: String,
    contactpostalCode: String,
    contactfax: String,
    contactemail: String,
    contactwebsite:String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})

const supplierDetailsSchema = new mongoose.Schema({
    supplierName:String,
    suppliercode:String,
    status:String,
    registeredsupplier:String,
    supplierCategory:String,
    supplierGSTINNumber:String,
    suppliercreditPeriod:String,
    supplierdrugLicenseNo:String,
    supplierPANNo:String,
    suppliercorporteIdentificationNumber:String,
    supplierapplyTCSforPOStockEntry:String,
    regioncountry:String,
    regionstate:String,
    regioncity:String,
    contactaddress:String,
    contactphone1:String,
    contactphone2:String,
    contactpostalCode:String,
    contactfax:String,
    contactemail:String,
    contactwebsite:String,
    helpdeskname:String,
    helpdeskphno:String,
    helpdeskemail:String,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})

const newItemSchema = new mongoose.Schema({
    itemName:String,
    shortName:String,
    status:String,
    category:String,
    generateItemCode:String,
    customItemCode:String,
    manufacture:String,
    strength:String,
    strengthUnits:String,
    itemFrom:String,
    root:String,
    unitUOM:String,
    packageUOM:String,
    packageSize:String,
    packageType:String,
    consumptionUOM:String,
    consumptionCapacity:String,
    genericName:String,
    serviceGroup:String,
    serviceSubGroup:String,
    maxCostPrice:String,
    supplierName:String,
    preferredSupplier:String,
    invoiceDetails:String,
    controlType:String,
    insurenceCategory:String,
    preAuthRequired:String,
    billingGroup:String,
    taxBasis:String,
    tax:String,
    binRack:String,
    batchNumberApplicable:String,
    itemSellingPrice:String,
    highCostConsumables:String,
    allowZeroCalimAmnt:String,
    storeWise:Array,
    taxlist:Array,
    createdt:String,
    createby:String,
    modifydt:String,
    modifyby:String
})

const departmentSchema =new mongoose.Schema({
    department: String,
    departmentType: String,
    allowedGender: String,
    costCenterCode: String,
    referralDoctorAsOrderingClinician:String,
    status: String,
    createdt: String,
    createby: String,
    modifydt: String,
    modifyby: String,
})




const storeTypeMaster = mongoose.model('storetypemaster', storeTypeMasterSchema);
const storeMaster = mongoose.model('storemaster',storeMasterSchema);
const uomCreation =mongoose.model('uomcreation',uomCreationSchema);
const addItemCategory =mongoose.model('additemcategory',addItemCategorySchema);
const genericClassification =mongoose.model('genericclassification',genericClassificationSchema);
const genericSubClassification =mongoose.model('genericsubclassification',genericSubClassificationSchema);
const genericDetails =mongoose.model('genericdetails',genericDetailsSchema);
const supplierCategory =mongoose.model('suppliercategory',supplierCategorySchema);
const manufacureCreation =mongoose.model('manufacurecreation',manufacureCreationSchema);
const supplierDetails =mongoose.model('supplierdetails',supplierDetailsSchema);
const newItem = mongoose.model('newitem',newItemSchema);
const department = mongoose.model('department',departmentSchema);

module.exports = {
    storeTypeMaster,storeMaster,uomCreation,addItemCategory,genericClassification,
    genericSubClassification,genericDetails,supplierCategory,manufacureCreation,supplierDetails
    ,newItem,department
}