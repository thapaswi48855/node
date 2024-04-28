console.log('Run')
const _ = require('lodash');
const express = require('express');
const app = express();
const bp = require('body-parser');
app.use(bp.json());
const cors = require("cors");
app.use(cors())
const mongoose = require('mongoose');

console.log('Express')
const { Document, Module, ModuleDocument, Roles, AssigneByPermissions, newUser } = require('./model.js');
const Custmer = require('./custer.js')
// const url = 'mongodb://127.0.0.1:27017/projects' //testing ,projects
const url = 'mongodb+srv://tapaswigangavarapu:tapas434@cluster0.spvxgrd.mongodb.net/projects?retryWrites=true&w=majority'
const dbName = "test";
const currentDate = new Date();
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';
const axios = require('axios');
const port = process.env.PORT || 1000;

const { storeTypeMaster, storeMaster, uomCreation,
    addItemCategory, genericClassification, genericSubClassification,
    genericDetails, supplierCategory, manufacureCreation, supplierDetails, newItem, department } = require('./store.js');

const { master, ZeroLevelMaster } = require('./masters.js');
const { rasiePurchaseOrder, stockEntry } = require('./procurement.js');
const { sales, salesReturn, patientIndent, patientReturnIndent } = require('./sales.js');
const { serviceGroup, serviceSubGroup } = require('./service.js');
const { taxGroup, taxSubGroup } = require('./tax.js')

async function connection() {
    await mongoose.connect(url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            minPoolSize: 6,
            maxPoolSize: 14
        },

    );
}
connection();
// Generate a JWT token

app.post('/userLogin', async (req, res) => {
    console.log('payload', req.body)
    const payload = req.body;
    const token = jwt.sign(payload, secretKey, { expiresIn: '24hr' });
    res.json({ data: token });
    console.log('Generated JWT token:', token);
})

app.get('/tet', (req, res) => {
    res.json({ 'oj': 'ok' })
})

/* Documents GET & INSERT & UPDate */

app.get('/documents', async (req, res) => {
    try {
        const Document = require('./model.js').Document;

        let query = req.query;
        if (query && query.documentid && typeof query.documentid === 'bigint') {
            query.documentid = query.documentid.toString();
        }

        const documents = await Document.find(query || {});

        // Custom serialization function to handle BigInt values
        const serialize = (data) => {
            return JSON.stringify(data, (key, value) => {
                if (typeof value === 'bigint') {
                    return value.toString();
                }
                return value;
            });
        };
        // Serialize the response data
        const serializedDocuments = serialize({ data: documents });
        res.send(serializedDocuments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertDocuments', async (req, res) => {
    try {
        if (req.body[0].documentid != 0) {
            req.body[0].modifydt = new Date();
            await Document.updateOne({ documentid: { $eq: req.body[0].documentid } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const result = await Document.aggregate([
                { $group: { _id: null, maxDocumentId: { $max: '$documentid' } } }
            ]).exec();

            let counter = (result[0] && result[0].maxDocumentId) ? result[0].maxDocumentId + 1 : 1;

            req.body[0].documentid = counter;
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await Document.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
})

/* Module GET & INSERT & UPDate */

app.get('/getModules', async (req, res) => {

    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const Module = require('./model.js').Module;

        let query = req.query;
        // Convert BigInt values to strings
        if (query && query.moduleid && typeof query.moduleid === 'bigint') {
            query.moduleid = query.moduleid.toString();
        }

        const modules = await Module.find(query || {});

        // Custom serialization function to handle BigInt values
        const serialize = (data) => {
            return JSON.stringify(data, (key, value) => {
                if (typeof value === 'bigint') {
                    return value.toString();
                }
                return value;
            });
        };

        // Serialize the response data
        const serializedModules = serialize({ data: modules });
        res.send(serializedModules);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertModule', async (req, res) => {
    try {
        if (req.body[0].moduleid !== 0) {

            req.body[0].modifydt = new Date();
            await Module.updateOne({ moduleid: req.body[0].moduleid }, { $set: req.body[0] });
            res.json({ status: "200", message: 'Update Successful' });
        } else {
            // Find the highest moduleid in the collection
            const result = await Module.aggregate([
                { $group: { _id: null, maxModuleId: { $max: '$moduleid' } } }
            ]).exec();

            let counter = (result[0] && result[0].maxModuleId) ? result[0].maxModuleId + 1 : 1;

            req.body[0].moduleid = counter;
            req.body[0].createdt = new Date();
            await Module.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successful' });
        }
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
})

/* Module-Document GET & INSERT & UPDate */

app.get('/getModuleDocuments', async (req, res) => {

    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const ModuleDocument = require('./model.js').ModuleDocument;
        let query = req.query;
        // Convert BigInt values to strings
        if (query && query.moduledocMapid && typeof query.moduledocMapid === 'bigint') {
            query.moduledocMapid = query.moduledocMapid.toString();
        }

        const moduleDocument = await ModuleDocument.find(query || {});

        // Custom serialization function to handle BigInt values
        const serialize = (data) => {
            return JSON.stringify(data, (key, value) => {
                if (typeof value === 'bigint') {
                    return value.toString();
                }
                return value;
            });
        };
        // Serialize the response data
        const serializedDocuments = serialize({ data: moduleDocument });
        res.send(serializedDocuments);

    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertModuleDocuments', async (req, res) => {
    try {
        if (req.body[0].moduledocMapid != 0) {
            req.body[0].modifydt = new Date();
            await ModuleDocument.updateOne({ moduledocMapid: { $eq: req.body[0].moduledocMapid } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const result = await ModuleDocument.aggregate([
                { $group: { _id: null, maxModuleDocMapId: { $max: '$moduledocMapid' } } }
            ]).exec();

            let counter = (result[0] && result[0].maxModuleDocMapId) ? result[0].maxModuleDocMapId + 1 : 1;

            req.body[0].moduledocMapid = counter;
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await ModuleDocument.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
})

/* Assigne By Permissions */

//Role
app.get('/getRoles', async (req, res) => {

    try {
        const roles = await Roles.find();
        res.json({ data: roles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/getAssigneByPermissions', async (req, res) => {

    const token = req.headers.authorization;
    console.log('token', token)
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err.message);
        } else {
            console.log('Decoded token data:', decoded);
        }
    });
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const AssigneByPermissions = require('./model.js').AssigneByPermissions;
        // try {
        if (req.query) {
            let query = req.query;
            // Convert BigInt values to strings
            if (query && query.assignepermissionid && typeof query.assignepermissionid === 'bigint') {
                query.assignepermissionid = query.assignepermissionid.toString();
            }

            const assigneByPermissions = await AssigneByPermissions.find(query || {});

            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };
            // Serialize the response data
            const serializedDocuments = serialize({ data: assigneByPermissions });
            res.send(serializedDocuments);
        }
    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertAssigneByPermissions', async (req, res) => {
    try {
        if (req.body[0].assignepermissionid != 0) {
            req.body[0].modifydt = new Date();
            await AssigneByPermissions.updateOne({ assignepermissionid: { $eq: req.body[0].assignepermissionid } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const result = await AssigneByPermissions.aggregate([
                { $group: { _id: null, maxAssignepermissionid: { $max: '$assignepermissionid' } } }
            ]).exec();

            let counter = (result[0] && result[0].maxAssignepermissionid) ? result[0].maxAssignepermissionid + 1 : 1;

            req.body[0].assignepermissionid = counter;
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await AssigneByPermissions.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
})


app.post('/insertNewUsers', async (req, res) => {
    try {
        if (req.body[0].userid != 0) {
            req.body[0].modifydt = new Date();
            await newUser.updateOne({ userid: { $eq: req.body[0].userid } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const result = await newUser.aggregate([
                { $group: { _id: null, maxUserid: { $max: '$userid' } } }
            ]).exec();

            let counter = (result[0] && result[0].maxUserid) ? result[0].maxUserid + 1 : 1;

            req.body[0].Userid = counter;
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await newUser.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
})

app.get('/getNewUsers', async (req, res) => {

    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const NewUser = require('./model.js').newUser;

        if (req.query) {
            let query = req.query;
            // Convert BigInt values to strings
            if (query && query.Userid && typeof query.Userid === 'bigint') {
                query.Userid = query.Userid.toString();
            }

            const newUsers = await NewUser.find(query || {});

            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };
            // Serialize the response data
            const serializedDocuments = serialize({ data: newUsers });
            res.send(serializedDocuments);

        } else {
            const newUser = await NewUser.find();
            res.json({ data: newUser, status: "200", message: 'Succes' });
        }

    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

/***************    Store   ******************/

app.post('/insertStoreTypeMaster', async (req, res) => {
    onComonInsert(req,res, storeTypeMaster, storetypeid)
})

app.get('/getStoreTypeMaster', async (req, res) => {
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const StoreTypeMaster = require('./store.js').storeTypeMaster;
        const Master = require('./masters.js').master;
        if (req.query) {
            let query = req.query;

            const master = await Master.find(query);
            const storeTypeMaster = await StoreTypeMaster.find(query || {});

            // Convert BigInt values to strings
            if (query && query.storetypeid && typeof query.storetypeid === 'bigint') {
                query.storetypeid = query.storetypeid.toString();
            }

            const result = storeTypeMaster.map(sObject => {
                const storeKeys = ['status'];
                const mergedObject = { ...sObject.toObject() };
                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);

                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName;
                    }
                });
                return sObject;
            });
            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };
            // Serialize the response data
            const serializedDocuments = serialize({ data: result });
            res.send(serializedDocuments);
        } else {
            const storeTypeMaster = await StoreMaster.find();
            res.json({ data: storeTypeMaster });
        }
    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertStoreMaster', async (req, res) => {
    onComonInsert(req,res, storeMaster, storemasterid)
})

app.get('/getStoreMaster', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const StoreMaster = require('./store.js').storeMaster;
        const Master = require('./masters.js').master;
        const StoreTypeMaster = require('./store.js').storeTypeMaster;

        if (req.query) {

            let query = req.query;

            const storeMaster = await StoreMaster.find(query);
            const master = await Master.find(query);
            const storeTypeMaster = await StoreTypeMaster.find(query || {});

            // Convert BigInt values to strings
            if (query && query.storemasterid && typeof query.storemasterid === 'bigint') {
                query.storemasterid = query.storemasterid.toString();
            }


            const result = storeMaster.map(sObject => {
                const storeKeys = ['counter', 'status', 'autoFillPrecription', 'accountGroup', 'salesUnit', 'isSuperStore',
                    'allowToRiseBill', 'precriptionPrintTemplate', 'precriptionLabelPrintTemplate', 'salesPrintTemplate',
                    'isSalesStore', 'autoFillIndent', 'isSterileStore', 'storesTariff', 'useSellingPriceFromItemBatch',
                    'grnPrintTemplate', 'allowAutoPOGeneration', 'autoCancelPO', 'autoCancelPOFreuency', 'salesWebTemplate',
                    'salesWebPrinter', 'storeType'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);
                    const matchStore = storeTypeMaster.find(obj => obj._id.toString() === sObject['storeType'].toString());
                    if (matchStore) {
                        console.log('matchStore.storetypename', matchStore.storetypename)
                        sObject['storeType'] = matchStore.storetypename;
                    }

                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName;
                    }
                });
                return sObject;
                // return mergedObject;
            });
            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: storeMaster });
            res.send(serializedDocuments);
            // res.json({ data: storeMaster });
        } else {

            const storeMaster = await StoreMaster.find();
            res.json({ data: storeMaster });
        }

    } catch (error) {
        // Handle any errors that may occur during the database query
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertUomCreation', async (req, res) => {
    onComonInsert(req,res, uomCreation, uomCreationId)
})

app.get('/getUomCreation', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        // const UomCreation = require('./store.js').uomCreation;
        // console.log('req.query', req.query)

        // if (req.query) {
        //     const uomCreation = await UomCreation.find(req.query);
        //     res.json({ data: uomCreation });
        // } else {
        //     console.log('GET')
        //     const uomCreation = await UomCreation.find();
        //     res.json({ data: uomCreation });
        // }
        const UomCreation = require('./store.js').uomCreation;
        const Master = require('./masters.js').master;
        // const StoreTypeMaster = require('./store.js').storeTypeMaster;

        if (req.query) {
            let query = req.query;
            // const UomCreation = require('./store.js').uomCreation;
            const uomCreation = await UomCreation.find(query);
            const master = await Master.find(query);
            // const storeTypeMaster = await StoreTypeMaster.find(req.query);

            // Convert BigInt values to strings
            if (query && query.uomCreationId && typeof query.uomCreationId === 'bigint') {
                query.uomCreationId = query.uomCreationId.toString();
            }

            const result = uomCreation.map(sObject => {
                const storeKeys = ['status', 'unitUom'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);
                    // const matchStore = storeTypeMaster.find(obj => obj._id.toString() === sObject['storeType'].toString());
                    // if (matchStore) {
                    //     console.log('matchStore.storetypename', matchStore.storetypename)
                    //     sObject['storeType'] = matchStore.storetypename;
                    // }

                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName;
                    }
                });
                return sObject;

                // return mergedObject;
            });
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: result });
            res.send(serializedDocuments);

            // res.json({ data: result });
        } else {

            const uomCreation = await UomCreation.find();
            res.json({ data: uomCreation });
        }

    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertAddItemCategory', async (req, res) => {
    onComonInsert(req,res, addItemCategory, addcategoryid)
})

app.get('/getAddItemCategory', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const AddItemCategory = require('./store.js').addItemCategory;
        const Master = require('./masters.js').master;

        if (req.query) {
            let query = req.query;
            const addItemCategory = await AddItemCategory.find(query || {});
            const master = await Master.find(query);

            // Convert BigInt values to strings
            if (query && query.addcategoryid && typeof query.addcategoryid === 'bigint') {
                query.addcategoryid = query.addcategoryid.toString();
            }

            const result = addItemCategory.map(sObject => {
                const storeKeys = ['identification', 'issuseType', 'bilable', 'retilable', 'calmiable', 'validateExpireDate',
                    'assestsTracking', 'prescribable',
                    'status', 'drug'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);

                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName;
                    }
                });
                return sObject;

                // return mergedObject;
            });
            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: result });
            res.send(serializedDocuments);
            // res.json({ data: result });
        }
        else {
            console.log('GET')
            const addItemCategory = await AddItemCategory.find();
            res.json({ data: addItemCategory });
        }

    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertGenericClassificationDetails', async (req, res) => {
    onComonInsert(req, res ,genericClassification, genericClassificationId)
})

app.get('/getGenericClassificationDetails', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const GenericClassification = require('./store.js').genericClassification;
        const Master = require('./masters.js').master;

        if (req.query) {

            let query = req.query;
            const genericClassification = await GenericClassification.find(query);
            const master = await Master.find(query);

            // Convert BigInt values to strings
            if (query && query.genericClassificationId && typeof query.genericClassificationId === 'bigint') {
                query.genericClassificationId = query.genericClassificationId.toString();
            }

            const result = genericClassification.map(sObject => {
                const storeKeys = [
                    'status',];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);

                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName;
                    }
                });
                return sObject;
            });
            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: result });
            res.send(serializedDocuments);
            // res.json({ data: result });
        }
        else {
            console.log('GET')
            const addItemCategory = await AddItemCategory.find();
            res.json({ data: addItemCategory });
        }

    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertGenericSubClassificationDetails', async (req, res) => {
    onComonInsert(req,res, genericSubClassification, genSubClasiId)
})

app.get('/getGenericSubClassificationDetails', async (req, res) => {
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const GenericSubClassification = require('./store.js').genericSubClassification;
        const Master = require('./masters.js').master;
        const GenericClassification = require('./store.js').genericClassification;

        if (req.query) {
            let query = req.query;
            const genericSubClassification = await GenericSubClassification.find(query);
            const master = await Master.find(query);
            const genericClassification = await GenericClassification.find(query);

            // Convert BigInt values to strings
            if (query && query.genSubClasiId && typeof query.genSubClasiId === 'bigint') {
                query.genSubClasiId = query.genSubClasiId.toString();
            }

            const result = genericSubClassification.map(sObject => {
                const storeKeys = ['clasificationName', 'status'];
                const mergedObject = { ...sObject.toObject() };
                // console.log('sObject',sObject)
                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);
                    // console.log('genericClassification', typeof genericClassification.genericClassificationId)
                    const genClass = genericClassification.find(obj => {
                        if (obj && obj.genericClassificationId) {
                            return obj.genericClassificationId.toString() === sObject['clasificationName'];
                        }
                        return false;
                    }
                    );

                    if (genClass) {
                        mergedObject['clasificationName'] = genClass.clasificationName;
                    }
                    if (matchingObject) {
                        mergedObject[status] = matchingObject.subMasterName
                    }
                });
                return mergedObject;
            });
            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: result });
            res.send(serializedDocuments);
        } else {
            const genericSubClassification = await GenericSubClassification.find();
            res.json({ data: genericSubClassification });
        }
    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/insertGenericDetails', async (req, res) => {
    onComonInsert(req,res, genericDetails, generDetId)
})


app.get('/getGenericDetails', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const GenericDetails = require('./store.js').genericDetails;
        const Master = require('./masters.js').master;
        const GenericClassification = require('./store.js').genericClassification;
        const GenericSubClassification = require('./store.js').genericSubClassification;

        if (req.query) {
            let query = req.query;
            const genericDetails = await GenericDetails.find(query);
            const master = await Master.find(query);
            const genericClassification = await GenericClassification.find(query);
            const genericSubClassification = await GenericSubClassification.find(query);


            // Convert BigInt values to strings
            if (query && query.generDetId && typeof query.generDetId === 'bigint') {
                query.generDetId = query.generDetId.toString();
            }

            const result = genericDetails.map(sObject => {
                const storeKeys = ['clasificationName', 'subClassificationName', 'status', 'crability'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);
                    const genClass = genericClassification.find(obj => {
                        if (obj && obj.genericClassificationId) {
                            return obj.genericClassificationId.toString() === sObject['clasificationName'];
                        }
                        return false;
                    }
                        // obj.genericClassificationId === sObject['clasificationName']
                    );
                    const genSubClass = genericSubClassification.find(obj => {

                        if (obj && obj.genSubClasiId) {
                            return obj.genSubClasiId.toString() === sObject['subClassificationName'];
                        }
                        return false;
                    }

                        // obj.genSubClasiId === sObject['subClassificationName']
                    )
                    // find(item => item._id.equals(sObject.subClassificationName));
                    console.log('genSubClass', genSubClass)
                    if (genSubClass) {
                        console.log('genSubClass.subClasificationName', genSubClass.subClasificationName)
                        mergedObject['subClassificationName'] = genSubClass.subClasificationName;
                        console.log('sObject1', mergedObject)
                    }
                    if (genClass) {
                        mergedObject['clasificationName'] = genClass.clasificationName;
                    }


                    if (matchingObject) {
                        mergedObject[status] = matchingObject.subMasterName
                    }
                    // console.log('matchingObject.mastername',matchingObject.mastername)
                });
                // console.log('sObject',mergedObject)
                return mergedObject;
            });
            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: result });
            res.send(serializedDocuments);
        } else {

            const genericDetails = await GenericDetails.find();
            res.json({ data: genericDetails });
        }

    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



app.post('/insertSupplierCategory', async (req, res) => {
    onComonInsert(req,res, supplierCategory, supplierCatId)
})

app.get('/getSupplierCategory', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const SupplierCategory = require('./store.js').supplierCategory;
        const Master = require('./masters.js').master;

        if (req.query) {
            let query = req.query;
            const supplierCategory = await SupplierCategory.find(query);
            const master = await Master.find(query);

            // Convert BigInt values to strings
            if (query && query.supplierCatId && typeof query.supplierCatId === 'bigint') {
                query.supplierCatId = query.supplierCatId.toString();
            }


            const result = supplierCategory.map(sObject => {
                const storeKeys = ['status'];
                const mergedObject = { ...sObject.toObject() };
                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);

                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName;
                    }
                });
                return sObject;
            });
            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: result });
            res.send(serializedDocuments);
        } else {
            const supplierCategory = await SupplierCategory.find();
            res.json({ data: supplierCategory });
        }


    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertManufacureCreation', async (req, res) => {
    onComonInsert(req,res, manufacureCreation, manufacureId)
})

app.get('/getManufacureCreation', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const ManufacureCreation = require('./store.js').manufacureCreation;
        const Master = require('./masters.js').master;

        if (req.query) {
            let query = req.query;
            const manufacureCreation = await ManufacureCreation.find(query);
            const master = await Master.find(query);

            // Convert BigInt values to strings
            if (query && query.manufacureId && typeof query.manufacureId === 'bigint') {
                query.manufacureId = query.manufacureId.toString();
            }
            const result = manufacureCreation.map(sObject => {
                const storeKeys = ['status'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);

                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName
                    }
                });
                return sObject;
            });
            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: manufacureCreation });
            res.send(serializedDocuments);

        } else {
            const manufacureCreation = await ManufacureCreation.find();
            res.json({ data: manufacureCreation });
        }

    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertSupplierDetails', async (req, res) => {
    onComonInsert(req,res, supplierDetails, supplierDetId)
})

app.get('/getSupplierDetails', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const SupplierDetails = require('./store.js').supplierDetails;
        const Master = require('./masters.js').master;
        const SupplierCategory = require('./store.js').supplierCategory;

        if (req.query) {
            let query = req.query;
            const supplierDetails = await SupplierDetails.find(query);
            const master = await Master.find(query);
            const supplierCategory = await SupplierCategory.find(query);

            // Convert BigInt values to strings
            if (query && query.supplierDetId && typeof query.supplierDetId === 'bigint') {
                query.supplierDetId = query.supplierDetId.toString();
            }
            const result = supplierDetails.map(sObject => {
                const storeKeys = ['supplierapplyTCSforPOStockEntry', 'status', 'registeredsupplier', 'supplierCategory'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);
                    const matchStore = supplierCategory.find(obj => obj._id.toString() === sObject['supplierCategory'].toString());
                    if (matchStore) {
                        sObject['supplierCategory'] = matchStore.categoryname;
                    }
                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName
                    }
                });
                return sObject;
            });
            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: supplierDetails });
            res.send(serializedDocuments);
            // res.json({ data: supplierDetails });
        }
        else {
            console.log('GET')
            const supplierDetails = await SupplierDetails.find();
            res.json({ data: supplierDetails });
        }

    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//Masters
app.post('/insertGeneralMaster', async (req, res) => {
    // onCommonPost(req, res, master)
    console.log('Insert Asigments')
    let sequenceNumber = 0;
    try {
        console.log('Insert Document', req.body)
        if (req.body[0] && req.body[0]._id) {
            console.log('Insert Document 1')
            const id = req.body[0]._id
            delete req.body[0]._id
            req.body[0].modifydt = new Date();
            await master.updateOne({ _id: { $eq: id } }, {
                $set: req.body[0]
            });
        } else {
            console.log('req.body', req.body)
            req.body[0].createdt = new Date();
            await master.insertMany(req.body);
        }
    } catch (error) {
        console.log('Update Error')
    }
})

app.get('/getGeneralMaster', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const Master = require('./masters.js').master;
        // console.log('req.query', req.query)
        let masters
        if (req.query) {
            masters = await Master.find(req.query);
            // console.log('masters', masters)
            res.json({ data: masters });
            // if (masters) {

            //     console.log('Found master:', master);
            //   } else {
            //     console.log('Master not found');
            //   }
            // res.json({ data: master });
        } else {
            // console.log('GET')
            masters = await Master.find();
            res.json({ data: masters });
            // res.json({ data: master });
        }


    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/zerolevelmaster', async (req, res) => {
    console.log('GET')
    try {
        console.log('GET1')
        const zerolevelmaster = await ZeroLevelMaster.find();
        res.json({ data: zerolevelmaster });


    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//newItem

app.post('/insertNewItem', async (req, res) => {
    onComonInsert(req, res,newItem, newItemId);
    console.log('newItemId',req)
    // try {
        
    //     if (req.body[0].newItemId != 0) {
    //         req.body[0].modifydt = new Date();
    //         await newItem.updateOne({ newItemId: { $eq: req.body[0].newItemId } }, {
    //             $set: req.body[0]
    //         });
    //         res.json({ status: "200", message: 'Update Successfull' });
    //     } else {
    //         const result = await newItem.aggregate([
    //             { $group: { _id: null, maxId: { $max: '$newItemId' } } }
    //         ]).exec();
    //         let counter = (result[0] && result[0].maxId) ? result[0].maxId + 1 : 1;
    //         req.body[0].newItemId = counter
    //         const currentdt = new Date();
    //         req.body[0].createdt = currentdt;
    //         await newItem.insertMany(req.body);
    //         res.json({ status: "200", message: 'Create Successfull' });
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    //     res.status(500).json({ status: "500", message: 'Error', error: error.message });
    // }
})

app.get('/getNewItem', async (req, res) => {

    try {
        const NewItem = require('./store.js').newItem;
        const serviceSubGrp = require('./service.js').serviceSubGroup;
        const Master = require('./masters.js').master;
        const serviceGroup = require('./service.js').serviceGroup;
        const AddItemCategory = require('./store.js').addItemCategory;
        const UomCreation = require('./store.js').uomCreation;
        if (req.query) {
            let query = req.query;
            const newItem = await NewItem.find(query)
            const serviceSubGroup = await serviceSubGrp.find(query);
            const master = await Master.find(query);
            const servicegroup = await serviceGroup.find(query);
            const itemCategory = await AddItemCategory.find(query);
            const uomcreation = await UomCreation.find(query);


            // Convert BigInt values to strings
            if (query && query.newItemId && typeof query.newItemId === 'bigint') {
                query.newItemId = query.newItemId.toString();
            }

            const result = newItem.map(sObject => {
                const storeKeys = ['status', 'category', 'strengthUnits', 'itemFrom', 'unitUOM', 'packageUOM', 'consumptionUOM',
                    'serviceGroup', 'serviceSubGroup', 'preferredSupplier', 'controlType', 'preAuthRequired',
                    'billingGroup', 'taxBasis', 'batchNumberApplicable', 'highCostConsumables', 'allowZeroCalimAmnt',
                    'accounthead', 'servicegroupname'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);
                    if (sObject['serviceGroup'] != undefined) {
                        const matchStore = servicegroup.find(obj => obj._id.toString() === sObject['serviceGroup'].toString());
                        if (matchStore) {
                            sObject['serviceGroup'] = matchStore.servicegroupname;
                        }
                    }
                    if (sObject['serviceSubGroup'] != undefined) {
                        const matchStore = serviceSubGroup.find(obj => obj._id.toString() === sObject['serviceSubGroup'].toString());
                        if (matchStore) {
                            sObject['serviceSubGroup'] = matchStore.servicesubgroupname;
                        }
                    }
                    if (sObject['category'] != undefined) {
                        const matchStore = itemCategory.find(obj => obj._id.toString() === sObject['category'].toString());
                        if (matchStore) {
                            sObject['category'] = matchStore.categoryName;
                        }
                    }
                    if (sObject['packageUOM'] != undefined) {
                        const matchStore = uomcreation.find(obj => obj._id.toString() === sObject['packageUOM'].toString());
                        if (matchStore) {
                            sObject['packageUOM'] = matchStore.packageUom;
                        }
                    }
                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName
                    }
                });
                return sObject;
            });
            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: result });
            res.send(serializedDocuments);
        }
        else {
            console.log('GET')
            const newItem = await NewItem.find();
            res.json({ data: newItem });
        }

    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// ****************             Purchase Order           *****************//

app.post('/insertRasiePurchaseOrderMaster', async (req, res) => {
    onComonInsert(req,res, rasiePurchaseOrder, poNumId);
})

app.get('/getRasiePurchaseOrderMaster', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const RasiePurchaseOrder = require('./procurement.js').rasiePurchaseOrder;
        const Master = require('./masters.js').master;
        const StoreMaster = require('./store.js').storeMaster;

        if (req.query) {
            let query = req.query;
            const rasiePurchaseOrder = await RasiePurchaseOrder.find(query);
            const master = await Master.find(query);
            const storeMaster = await StoreMaster.find(query);
            // const storeKeys = ['supplierapplyTCSforPOStockEntry', 'status', 'registeredsupplier', 'supplierCategory'];

            // Convert BigInt values to strings
            if (query && query.poNumId && typeof query.poNumId === 'bigint') {
                query.poNumId = query.poNumId.toString();
            }

            const result = rasiePurchaseOrder.map(sObject => {
                const storeKeys = ['store', 'approvalStatus'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);

                    const matchStore = storeMaster.find(obj => obj.store === sObject['store']);
                    if (matchStore) {
                        sObject['store'] = matchStore.store;
                    }
                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName
                    }
                });
                return sObject;
            });
            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: rasiePurchaseOrder });
            res.send(serializedDocuments);
            // res.json({ data: rasiePurchaseOrder });
        }
        else {
            console.log('GET')
            const rasiePurchaseOrder = await RasiePurchaseOrder.find();
            res.json({ data: rasiePurchaseOrder });
        }

    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertStockEntryMaster', async (req, res) => {
    try {

        if (req.body[0].stockEntryId != 0) {
            console.log('3')
            req.body[0].modifydt = new Date();
            await stockEntry.updateOne({ stockEntryId: { $eq: req.body[0].stockEntryId } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            console.log('Stock')
            const componentId = 'Add Item Category';
            const result = await stockEntry.aggregate([
                { $group: { _id: null, maxStockEntryId: { $max: '$stockEntryId' } } }
            ]).exec();
            console.log('genericClassificationId', result[0].maxPoNumId)
            let counter = (result[0] && result[0].maxStockEntryId) ? result[0].maxStockEntryId + 1 : 1;
            console.log('genericClassification', counter)
            // counters.set(componentId, counter);
            req.body[0].stockEntryId = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            // req.body[0]['poNumber'] = `POCS0${counter}`;
            await stockEntry.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
            console.log('req.body', req.body)
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
})

app.get('/getStockEntryMaster', async (req, res) => {
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const StockEntry = require('./procurement.js').stockEntry;
        const Master = require('./masters.js').master;
        const StoreMaster = require('./store.js').storeMaster;
        const rasiePurchase = require('./procurement.js').rasiePurchaseOrder;

        if (req.query) {
            let query = req.query;
            const stockEntry = await StockEntry.find(query);
            const master = await Master.find(query);
            const storeMaster = await StoreMaster.find(query);
            const rasiepurchase = await rasiePurchase.find(query);
            // const storeKeys = ['supplierapplyTCSforPOStockEntry', 'status', 'registeredsupplier', 'supplierCategory'];

            // Convert BigInt values to strings
            if (query && query.stockEntryId && typeof query.stockEntryId === 'bigint') {
                query.stockEntryId = query.stockEntryId.toString();
            }

            const result = stockEntry.map(sObject => {
                const storeKeys = ['store', 'poNumber', 'approvalStatus'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);
                    const matchStore = storeMaster.find(obj => obj.store === sObject['store']);

                    const matchpurchase = rasiepurchase.find(obj => obj.poNumber === sObject['ponumber']);
                    if (matchStore) {
                        sObject['store'] = matchStore.store;
                    }
                    console.log('raise', matchpurchase)
                    if (matchpurchase) {
                        sObject['poNumber'] = matchpurchase.poNumber;
                    }
                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName
                    }
                });
                return sObject;
            });
            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: stockEntry });
            res.send(serializedDocuments);
            // res.json({ data: stockEntry });
        }
        else {
            console.log('GET')
            const stockEntry = await StockEntry.find();
            res.json({ data: stockEntry });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertSalesMaster', async (req, res) => {
    // onCommonPost(req, res, sales)
    // console.log('common')
    try {
        if (req.body[0].salesId != 0) {
            console.log('3')
            req.body[0].modifydt = new Date();
            await sales.updateOne({ salesId: { $eq: req.body[0].salesId } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            console.log('Stock')
            const componentId = 'Add Item Category';
            const result = await sales.aggregate([
                { $group: { _id: null, maxSalesId: { $max: '$salesId' } } }
            ]).exec();
            console.log('genericClassificationId', result[0].maxPoNumId)
            let counter = (result[0] && result[0].maxSalesId) ? result[0].maxSalesId + 1 : 1;
            console.log('genericClassification', counter)
            // counters.set(componentId, counter);
            req.body[0].salesId = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            // req.body[0]['poNumber'] = `POCS0${counter}`;
            await sales.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
            console.log('req.body', req.body)
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
})

app.post('/insertSalesReturnMaster', async (req, res) => {
    onCommonPost(req, res, salesReturn)
})
app.post('/insertPatientIndentMaster', async (req, res) => {
    onCommonPost(req, res, patientIndent)
})
app.post('/insertPatientReturnIndentMaster', async (req, res) => {
    onCommonPost(req, res, patientReturnIndent)
})

//Service serviceSubGroup

app.post('/insertServiceGroupMaster', async (req, res) => {
    onComonInsert(req, res,serviceGroup, serviceGrpId)
})
app.get('/getServiceGroupMaster', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        // const serviceGroup = require('./service.js').serviceGroup;
        // onCommonGet(req, res, serviceGroup)
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const serviceGroup = require('./service.js').serviceGroup;
        const Master = require('./masters.js').master;

        if (req.query) {
            let query = req.query;
            const servicegroup = await serviceGroup.find(query);
            const master = await Master.find(query);

            // Convert BigInt values to strings
            if (query && query.serviceGrpId && typeof query.serviceGrpId === 'bigint') {
                query.serviceGrpId = query.serviceGrpId.toString();
            }


            const result = servicegroup.map(sObject => {
                const storeKeys = ['status'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);

                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName
                    }
                });
                return sObject;
            });

            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: servicegroup });
            res.send(serializedDocuments);
            // res.json({ data: servicegroup });
        }
        else {
            console.log('GET')
            const servicegroup = await serviceGroup.find();
            res.json({ data: servicegroup });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
app.post('/insertServiceSubGroupMaster', async (req, res) => {
    onComonInsert(req, res,serviceSubGroup, serviceSubGrpId)
})
app.get('/getServiceSubGroupMaster', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        // const serviceSubGroup = require('./service.js').serviceSubGroup;
        // onCommonGet(req, res, serviceSubGroup)
        const serviceSubGrp = require('./service.js').serviceSubGroup;
        const Master = require('./masters.js').master;
        const serviceGroup = require('./service.js').serviceGroup;
        if (req.query) {
            let query = req.query;
            const serviceSubGroup = await serviceSubGrp.find(req.query);
            const master = await Master.find(req.query);
            const servicegroup = await serviceGroup.find(req.query);

            // Convert BigInt values to strings
            if (query && query.serviceSubGrpId && typeof query.serviceSubGrpId === 'bigint') {
                query.serviceSubGrpId = query.serviceSubGrpId.toString();
            }

            const result = serviceSubGroup.map(sObject => {
                const storeKeys = ['status', 'accounthead', 'servicegroupname'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);
                    const matchStore = servicegroup.find(obj => obj._id.toString() === sObject['servicegroupname'].toString());
                    if (matchStore) {
                        sObject['servicegroupname'] = matchStore.servicegroupname;
                    }

                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName
                    }
                });
                return sObject;
            });
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: serviceSubGroup });
            res.send(serializedDocuments);
            // res.json({ data: serviceSubGroup });
        }
        else {
            console.log('GET')
            const serviceSubGroup = await serviceSubGroup.find();
            res.json({ data: serviceSubGroup });
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Tax  
app.post('/insertTaxGroup', async (req, res) => {
    onComonInsert(req, res,taxGroup, taxGrpId)
})
app.get('/getTaxGroup', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        // const taxgroup = require('./tax.js').taxGroup;
        // onCommonGet(req, res, taxgroup)
        const taxgroup = require('./tax.js').taxGroup;
        const Master = require('./masters.js').master;
        // const serviceGroup = require('./service.js').serviceGroup;
        if (req.query) {
            let query = req.query;
            const taxGroup = await taxgroup.find(query);
            const master = await Master.find(query);
            // const servicegroup = await serviceGroup.find(req.query);

            // Convert BigInt values to strings
            if (query && query.taxGrpId && typeof query.taxGrpId === 'bigint') {
                query.taxGrpId = query.taxGrpId.toString();
            }

            const result = taxGroup.map(sObject => {
                const storeKeys = ['status', 'taxgrouptype', 'taxgroupcode'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);
                    // const matchStore = servicegroup.find(obj => obj._id.toString() === sObject['servicegroupname'].toString());
                    // if (matchStore) {
                    //     sObject['servicegroupname'] = matchStore.servicegroupname;
                    // }

                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName
                    }
                });
                return sObject;
            });
            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: taxGroup });
            res.send(serializedDocuments);
            // res.json({ data: taxGroup });
        }
        else {
            console.log('GET')
            const taxGroup = await taxgroup.find();
            res.json({ data: taxGroup });
        }



    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
app.post('/insertTaxSubGroup', async (req, res) => {
    onComonInsert(req,res, taxSubGroup, taxSubGrpId)
})
app.get('/getTaxSubGroup', async (req, res) => {
    console.log('req', req)
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        // const taxsubgroup = require('./tax.js').taxSubGroup;
        // onCommonGet(req, res, taxsubgroup)
        const taxsubgroup = require('./tax.js').taxSubGroup;
        const taxgroup = require('./tax.js').taxGroup;
        const Master = require('./masters.js').master;
        // const serviceGroup = require('./service.js').serviceGroup;
        console.log('req.query', req.query)
        if (req.query) {
            let query = req.query;
            const taxsubGroup = await taxsubgroup.find(query);
            const taxGroup = await taxgroup.find(query);
            const master = await Master.find(query);

            // Convert BigInt values to strings
            if (query && query.taxSubGrpId && typeof query.taxSubGrpId === 'bigint') {
                query.taxSubGrpId = query.taxSubGrpId.toString();
            }

            const result = taxsubGroup.map(sObject => {
                const storeKeys = ['taxgroup', 'status'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);
                    const matchStore = taxGroup.find(obj => obj._id.toString() === sObject['taxgroup'].toString());
                    if (matchStore) {
                        sObject['taxgroup'] = matchStore.taxgroup;
                    }

                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName
                    }
                });
                return sObject;
            });

            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: taxsubGroup });
            res.send(serializedDocuments);
            // res.json({ data: taxsubGroup });
        }
        else {
            console.log('GET')
            const taxsubGroup = await taxsubgroup.find();
            res.json({ data: taxsubGroup });
        }



    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})//department

app.post('/insertDepartment', async (req, res) => {
    onComonInsert(req,res, department, departmentId)
})
app.get('/getDepartment', async (req, res) => {
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        // const department = require('./store.js').department;
        // onCommonGet(req, res, department);
        const Department = require('./store.js').department;
        const Master = require('./masters.js').master;
        // const StoreMaster = require('./store.js').storeMaster;
        // const rasiePurchase = require('./procurement.js').rasiePurchaseOrder;

        if (req.query) {
            let query = req.query;
            const department = await Department.find(query);
            const master = await Master.find(query);
            // const storeMaster = await StoreMaster.find(req.query);
            // const rasiepurchase = await rasiePurchase.find(req.query);
            // const storeKeys = ['supplierapplyTCSforPOStockEntry', 'status', 'registeredsupplier', 'supplierCategory'];

            // Convert BigInt values to strings
            if (query && query.departmentId && typeof query.departmentId === 'bigint') {
                query.departmentId = query.departmentId.toString();
            }

            const result = department.map(sObject => {
                const storeKeys = ['status', 'departmentType', 'allowedGender', 'referralDoctorAsOrderingClinician'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);
                    // const matchStore = storeMaster.find(obj => obj._id.toString() === sObject['store'].toString());
                    // console.log('sObject',rasiepurchase)
                    // const matchpurchase = rasiepurchase.find(obj => obj._id === sObject['ponumber']);
                    // if (matchStore) {
                    //     sObject['store'] = matchStore.store;
                    // }
                    // console.log('raise',matchpurchase)
                    // if (matchpurchase) {
                    //     sObject['poNumber'] = matchpurchase.poNumber;
                    // }
                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName
                    }
                });
                return sObject;
            });
            // Custom serialization function to handle BigInt values
            const serialize = (data) => {
                return JSON.stringify(data, (key, value) => {
                    if (typeof value === 'bigint') {
                        return value.toString();
                    }
                    return value;
                });
            };

            // Serialize the response data
            const serializedDocuments = serialize({ data: department });
            res.send(serializedDocuments);
            // res.json({ data: department });
        }
        else {
            console.log('GET')
            const department = await department.find();
            res.json({ data: department });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

async function onComonInsert(req, res,table_name, table_auto_id) {
    console.log('table_auto_id', table_auto_id)
    try {
        console.log('table_auto_id', table_auto_id)
        if (req.body[0].table_auto_id != 0) {
            req.body[0].modifydt = new Date();
            await table_name.updateOne({ table_auto_id: { $eq: req.body[0].table_auto_id } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const result = await table_name.aggregate([
                { $group: { _id: null, maxId: { $max: '$table_auto_id' } } }
            ]).exec();
            let counter = (result[0] && result[0].maxId) ? result[0].maxId + 1 : 1;
            req.body[0].table_auto_id = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await table_name.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
}

app.listen(port, () => {
    console.log(`Example app listening  port ${port}`)
})
