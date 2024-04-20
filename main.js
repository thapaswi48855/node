console.log('Run')
// import * as _ from 
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
// const url = "mongodb+srv://tapaswigangavarapu:tapas434@cluster0.spvxgrd.mongodb.net/projects";
const dbName = "test";
const currentDate = new Date();
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const newUuid = uuidv4();
// Map to store sequence counters
const counters = new Map();
const port = process.env.PORT || 1000;
// const payload = {
//     userId: 123,
//     username: 'exampleuser',
//   };
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
    // var httpHeader =new httpHeader()

    console.log('Generated JWT token:', token);
    // jwt.verify(token, secretKey, (err, decoded) => {
    //     if (err) {
    //       console.error('Token verification failed:', err.message);
    //     } else {
    //       console.log('Decoded token data:', decoded);
    //     }
    //   });   

})

//   axios.get('/userLogin', { headers:headers })
//   .then(response => {
//     // Handle the response here
//     console.log('Response:', response.data);
//   })
//   .catch(error => {
//     // Handle any errors here
//     console.error('Error:', error);
//   });

// Verify and decode a JWT token

app.get('/tet', (req, res) => {
    res.json({ 'oj': 'ok' })
})

app.get('/', (req, res) => {
    // res.json({ data: currentDate });
    // console.log('newUuid', newUuid)

    const uuidStartingWith1 = generateUUIDStartingWith1();
    console.log(uuidStartingWith1);
    res.json({ data: uuidStartingWith1.toString() });
})
let sequenceNumber = 0;
function generateUUIDStartingWith1() {
    // Generate a UUID
    // const timestamp = Date.now().toString();
    // const randomPart = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    // const uniqueID =  randomPart;
    // return uniqueID;
    sequenceNumber += 1;
    return sequenceNumber;
}

// Endpoint to get the next sequence number for a component
app.post('componentId/next', (req, res) => {
    const componentId = req.params.componentId;
    let counter = counters.get(componentId) || 0;
    counter += 1;
    counters.set(componentId, counter);
    res.json(counter);
});



/* Documents GET & INSERT & UPDate */


app.get('/documents', async (req, res) => {
    console.log('doc')
    // res.json({ 'oj1': 'ok' })
    try {
        // console.log('documents', await Document.find({}))  
        // res.json({ 'oj2': 'ok' })
        // Assuming you have a "Teacher" model defined in your './model.js' file

        // if (req.query) {

        //     const documents =await Document.find(req.query);
        //     console.log('documents', documents)           
        //     res.json({ data: documents });
        // } else {
        // console.log(await Document.find({}));
        const documents = await Document.find({});
        // // res.json({ 'oj2': 'ok' })
        res.json({ data: documents });
        // }

    } catch (error) {
        // res.json({ 'oj3': 'ok' })
        // Handle any errors that may occur during the database query
        console.error(error);
        // res.status(500).json({ error: 'Internal Server Error' });
    }
})


app.post('/insertDocuments', async (req, res) => {
    // const componentId = 'Document';
    // let counter = counters.get(componentId) || 0;
    // counter += 1;
    // counters.set(componentId, counter);
    // // res.json(counter);
    // req.body[0].documentid = counter
    // onCommonPost(req, res, Document);
    try {
        if (req.body[0].documentid != 0) {
            req.body[0].modifydt = new Date();
            await Document.updateOne({ documentid: { $eq: req.body[0].documentid } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const componentId = 'Document';
            let counter = counters.get(componentId) || 0;
            counter += 1;
            counters.set(componentId, counter);
            req.body[0].documentid = counter
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

        if (req.query) {
            const module = await Module.find(req.query);
            res.json({ data: module });
        } else {
            const module = await Module.find();
            // Send the fetched documents as a JSON response
            res.json({ data: module });
        }

    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertModule', async (req, res) => {
    const componentId = 'Module';
    let counter = counters.get(componentId) || 0;
    counter += 1;
    counters.set(componentId, counter);
    // res.json(counter);
    req.body[0].moduleid = counter
    onCommonPost(req, res, Module);
    // try {
    //     if (req.body[0] && req.body[0]._id) {
    //         const id = req.body[0]._id
    //         delete req.body[0]._id
    //         console.log(id)
    //         console.log(req.body[0])
    //         await Module.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //     } else {
    //         await Module.insertMany(req.body);
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    // }
})


/* Module-Document GET & INSERT & UPDate */

app.get('/getModuleDocuments', async (req, res) => {

    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const ModuleDocument = require('./model.js').ModuleDocument;
        console.log('req.query', req.query)

        if (req.query) {
            const moduleDocument = await ModuleDocument.find(req.query);
            res.json({ data: moduleDocument });
        } else {
            const moduleDocument = await ModuleDocument.find();
            res.json({ data: moduleDocument });
        }

    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertModuleDocuments', async (req, res) => {
    const componentId = 'Module Document';
    let counter = counters.get(componentId) || 0;
    counter += 1;
    counters.set(componentId, counter);
    // res.json(counter);
    req.body[0].moduledocMapid = counter
    onCommonPost(req, res, ModuleDocument);
    // try {
    //     console.log('Insert Document')
    //     if (req.body[0] && req.body[0]._id) {
    //         console.log('Insert Document 1')
    //         const id = req.body[0]._id
    //         delete req.body[0]._id
    //         await ModuleDocument.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //     } else {
    //         console.log('req.body', req.body)
    //         await ModuleDocument.insertMany(req.body);
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    // }
})


/* Assigne By Permissions */


//Role
app.get('/getRoles', async (req, res) => {

    try {
        const roles = await Roles.find();
        res.json({ data: roles });

    } catch (error) {
        // Handle any errors that may occur during the database query
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
        console.log('req.query', req.query)

        if (req.query) {
            const assigneByPermissions = await AssigneByPermissions.find(req.query);
            res.json({ data: assigneByPermissions, status: "200", message: 'Succes' });
            // res.json({ status: "200", message: 'Succes' });
        } else {
            console.log('GET')
            const assigneByPermissions = await AssigneByPermissions.find();
            res.json({ data: assigneByPermissions, status: "200", message: 'Succes' });
            res.json({ status: "200", message: 'Succes' });
        }

    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertAssigneByPermissions', async (req, res) => {
    const componentId = 'Assigne By Permissions';
    let counter = counters.get(componentId) || 0;
    counter += 1;
    counters.set(componentId, counter);
    // res.json(counter);
    req.body[0].assignepermissionid = counter

    onCommonPost(req, res, AssigneByPermissions);
    // console.log('Insert Asigments')
    // try {
    //     console.log('Insert Document')
    //     if (req.body[0] && req.body[0]._id) {
    //         console.log('Insert Document 1')
    //         const id = req.body[0]._id
    //         delete req.body[0]._id
    //         await AssigneByPermissions.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //     } else {
    //         console.log('req.body', req.body)
    //         await AssigneByPermissions.insertMany(req.body);
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    // }
})


app.post('/insertNewUsers', async (req, res) => {
    const componentId = 'New User';
    let counter = counters.get(componentId) || 0;
    counter += 1;
    counters.set(componentId, counter);
    // res.json(counter);
    req.body[0].userid = counter
    onCommonPost(req, res, newUser);
    // try {
    //     if (req.body[0] && req.body[0]._id) {
    //         const id = req.body[0]._id
    //         delete req.body[0]._id
    //         req.body[0].modifydt = new Date();
    //         await newUser.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //         res.json({ status: "200", message: 'Update Successfull' });
    //     } else {
    //         const currentdt = new Date();
    //         req.body[0].createdt = currentdt;
    //         await newUser.insertMany(req.body);
    //         res.json({ status: "200", message: 'Create Successfull' });
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    //     res.status(500).json({ status: "500", message: 'Error', error: error.message });
    // }
})

app.get('/getNewUsers', async (req, res) => {
    console.log('Get 1', req.query)
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const NewUser = require('./model.js').newUser;
        console.log('req.query', req.query)

        if (req.query) {
            const newUser = await NewUser.find(req.query);
            console.log('newUser', newUser)
            if (newUser.length > 0) {
                res.json({ data: newUser, status: "200", message: 'Succes' });
            } else {
                res.json({ data: newUser, status: "404", message: 'Unble to Login' });
            }

        } else {
            console.log('GET')
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
    try {
        if (req.body[0].storetypeid != 0) {
            req.body[0].modifydt = new Date();
            await storeTypeMaster.updateOne({ storetypeid: { $eq: req.body[0].storetypeid } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const componentId = 'Store Type Master';
            let counter = counters.get(componentId) || 0;
            counter += 1;
            counters.set(componentId, counter);
            req.body[0].storetypeid = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await storeTypeMaster.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
})

app.get('/getStoreTypeMaster', async (req, res) => {
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const StoreTypeMaster = require('./store.js').storeTypeMaster;
        const Master = require('./masters.js').master;
        if (req.query) {
            const master = await Master.find(req.query);
            const storeTypeMaster = await StoreTypeMaster.find(req.query);

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
            res.json({ data: result });
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
    // onCommonPost(req, res, storeMaster);
    try {
        if (req.body[0].storemasterid != 0) {
            req.body[0].modifydt = new Date();
            await storeMaster.updateOne({ storemasterid: { $eq: req.body[0].storemasterid } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const componentId = 'Store Master';
            let counter = counters.get(componentId) || 0;
            counter += 1;
            counters.set(componentId, counter);
            req.body[0].storemasterid = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await storeMaster.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
})

app.get('/getStoreMaster', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const StoreMaster = require('./store.js').storeMaster;
        const Master = require('./masters.js').master;
        const StoreTypeMaster = require('./store.js').storeTypeMaster;

        if (req.query) {
            const storeMaster = await StoreMaster.find(req.query);
            const master = await Master.find(req.query);
            const storeTypeMaster = await StoreTypeMaster.find(req.query);

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
            res.json({ data: storeMaster });
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
    onCommonPost(req, res, uomCreation);
    console.log('Insert Asigments')
    // try {
    //     console.log('Insert Document', req.body)
    //     if (req.body[0] && req.body[0]._id) {
    //         console.log('Insert Document 1')
    //         const id = req.body[0]._id
    //         delete req.body[0]._id
    //         req.body[0].modifydt = new Date();
    //         await uomCreation.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //     } else {
    //         console.log('req.body', req.body)
    //         req.body[0].createdt = new Date();
    //         await uomCreation.insertMany(req.body);
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    // }
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
            // const UomCreation = require('./store.js').uomCreation;
            const uomCreation = await UomCreation.find(req.query);
            const master = await Master.find(req.query);
            // const storeTypeMaster = await StoreTypeMaster.find(req.query);

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
            res.json({ data: result });
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
    onCommonPost(req, res, addItemCategory);
    console.log('Insert Asigments')
    // try {
    //     console.log('Insert Document', req.body)
    //     if (req.body[0] && req.body[0]._id) {
    //         console.log('Insert Document 1')
    //         const id = req.body[0]._id
    //         delete req.body[0]._id
    //         req.body[0].modifydt = new Date();
    //         await addItemCategory.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //     } else {
    //         console.log('req.body', req.body)
    //         req.body[0].createdt = new Date();
    //         await addItemCategory.insertMany(req.body);
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    // }
})

app.get('/getAddItemCategory', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const AddItemCategory = require('./store.js').addItemCategory;
        const Master = require('./masters.js').master;

        if (req.query) {
            const addItemCategory = await AddItemCategory.find(req.query);

            const master = await Master.find(req.query);

            const result = addItemCategory.map(sObject => {
                const storeKeys = ['identification', 'issuseType', 'bilable', 'retilable', 'calmiable',
                    'assestsTracking', 'prescribable',
                    'status', 'drug'];
                const mergedObject = { ...sObject.toObject() };

                // _.forEach(storeKeys, (status) => {
                //     const matchingObject = master.find(obj => obj._id.toString() === sObject[status].toString());

                //     if (matchingObject) {
                //         sObject[status] = matchingObject.mastername
                //     }
                // });
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

            res.json({ data: result });
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
    const componentId = 'Generic Classification Details';
    let counter = counters.get(componentId) || 0;
    counter += 1;
    counters.set(componentId, counter);
    // res.json(counter);
    req.body[0].clasificationid = counter
    onCommonPost(req, res, genericClassification);
    console.log('clasif', req.body)
    // try {
    //     console.log('Insert Document', req.body)
    //     if (req.body[0] && req.body[0]._id) {
    //         console.log('Insert Document 1')
    //         const id = req.body[0]._id
    //         delete req.body[0]._id
    //         req.body[0].modifydt = new Date();
    //         await genericClassification.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //     } else {
    //         console.log('req.body', req.body)
    //         req.body[0].createdt = new Date();
    //         await genericClassification.insertMany(req.body);
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    // }
})

app.get('/getGenericClassificationDetails', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const GenericClassification = require('./store.js').genericClassification;
        // console.log('req.query', req.query)

        // if (req.query) {
        //     const genericClassification = await GenericClassification.find(req.query);
        //     res.json({ data: genericClassification });
        // } else {
        //     console.log('GET')
        //     const genericClassification = await GenericClassification.find();
        //     res.json({ data: genericClassification });
        // }
        const Master = require('./masters.js').master;

        if (req.query) {
            const genericClassification = await GenericClassification.find(req.query);

            const master = await Master.find(req.query);

            const result = genericClassification.map(sObject => {
                const storeKeys = [
                    'status',];
                const mergedObject = { ...sObject.toObject() };

                // _.forEach(storeKeys, (status) => {
                //     const matchingObject = master.find(obj => obj._id.toString() === sObject[status].toString());

                //     if (matchingObject) {
                //         sObject[status] = matchingObject.mastername
                //     }
                // });
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

            res.json({ data: result });
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
    onCommonPost(req, res, genericSubClassification);
    console.log('Insert Asigments')
    // try {
    //     console.log('Insert Document', req.body)
    //     if (req.body[0] && req.body[0]._id) {
    //         console.log('Insert Document 1')
    //         const id = req.body[0]._id
    //         delete req.body[0]._id
    //         req.body[0].modifydt = new Date();
    //         await genericSubClassification.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //     } else {
    //         console.log('req.body', req.body)
    //         req.body[0].createdt = new Date();
    //         await genericSubClassification.insertMany(req.body);
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    // }
})

app.get('/getGenericSubClassificationDetails', async (req, res) => {
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const GenericSubClassification = require('./store.js').genericSubClassification;
        const Master = require('./masters.js').master;
        const GenericClassification = require('./store.js').genericClassification;

        if (req.query) {
            const genericSubClassification = await GenericSubClassification.find(req.query);
            const master = await Master.find(req.query);
            const genericClassification = await GenericClassification.find(req.query);

            const result = genericSubClassification.map(sObject => {
                const storeKeys = ['clasificationName', 'status'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);
                    const genClass = genericClassification.find(obj => obj._id.toString() === sObject['clasificationName']);
                    if (genClass) {
                        mergedObject['clasificationName'] = genClass.clasificationName;
                    }
                    if (matchingObject) {
                        mergedObject[status] = matchingObject.subMasterName
                    }
                });
                return mergedObject;
            });
            res.json({ data: result });
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
    onCommonPost(req, res, genericDetails);
    console.log('Insert Asigments')
    // try {
    //     console.log('Insert Document', req.body)
    //     if (req.body[0] && req.body[0]._id) {
    //         console.log('Insert Document 1')
    //         const id = req.body[0]._id
    //         delete req.body[0]._id
    //         req.body[0].modifydt = new Date();
    //         await genericDetails.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //     } else {
    //         console.log('req.body', req.body)
    //         req.body[0].createdt = new Date();
    //         await genericDetails.insertMany(req.body);
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    // }
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
            const genericDetails = await GenericDetails.find(req.query);
            const master = await Master.find(req.query);
            const genericClassification = await GenericClassification.find(req.query);
            const genericSubClassification = await GenericSubClassification.find(req.query);

            const result = genericDetails.map(sObject => {
                const storeKeys = ['clasificationName', 'subClassificationName', 'status', 'crability'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);
                    const genClass = genericClassification.find(obj => obj._id.toString() === sObject['clasificationName']);
                    const genSubClass = genericSubClassification.find(obj => obj._id.toString() === sObject['subClassificationName'])
                    // find(item => item._id.equals(sObject.subClassificationName));
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
            res.json({ data: result });
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
    onCommonPost(req, res, supplierCategory)
    console.log('Insert Asigments')
    // try {
    //     console.log('Insert Document', req.body)
    //     if (req.body[0] && req.body[0]._id) {
    //         console.log('Insert Document 1')
    //         const id = req.body[0]._id
    //         delete req.body[0]._id
    //         req.body[0].modifydt = new Date();
    //         await supplierCategory.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //     } else {
    //         console.log('req.body', req.body)
    //         req.body[0].createdt = new Date();
    //         await supplierCategory.insertMany(req.body);
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    // }
})

app.get('/getSupplierCategory', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const SupplierCategory = require('./store.js').supplierCategory;
        const Master = require('./masters.js').master;
        // console.log('req.query', req.query)

        // if (req.query) {
        //     const supplierCategory = await SupplierCategory.find(req.query);
        //     res.json({ data: supplierCategory });
        // } else {
        //     console.log('GET')
        //     const supplierCategory = await SupplierCategory.find();
        //     res.json({ data: supplierCategory });
        // }
        if (req.query) {
            const supplierCategory = await SupplierCategory.find(req.query);
            const master = await Master.find(req.query);

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
            res.json({ data: supplierCategory });
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
    onCommonPost(req, res, manufacureCreation)
    console.log('Insert Asigments')
    // try {
    //     console.log('Insert Document', req.body)
    //     if (req.body[0] && req.body[0]._id) {
    //         console.log('Insert Document 1')
    //         const id = req.body[0]._id
    //         delete req.body[0]._id
    //         req.body[0].modifydt = new Date();
    //         await manufacureCreation.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //     } else {
    //         console.log('req.body', req.body)
    //         req.body[0].createdt = new Date();
    //         await manufacureCreation.insertMany(req.body);
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    // }
})

// app.get('/getManufacureCreation', async (req, res) => {
//     console.log('Get 1')
//     try {
//         // Assuming you have a "Teacher" model defined in your './model.js' file
//         const ManufacureCreation = require('./store.js').manufacureCreation;
//         const Master = require('./masters.js').master;

// //         if (req.query) {
// //             const manufacureCreation = await ManufacureCreation.find(req.query);
// //             const master = await Master.find(req.query);
// //             // const storeKeys = ['status'];
// //             // onCommonJoinGet(res, manufacureCreation, storeKeys, master)

// //             // const result = manufacureCreation.map(sObject => {
// //             //     const storeKeys = ['status'];
// //             //     const mergedObject = { ...sObject.toObject() };

// //             //     _.forEach(storeKeys,(status) => {
// //             //         const matchingObject = master.find(obj => obj._id.toString() === sObject[status]);

// //             //         if (matchingObject) {
// //             //             sObject[status] = matchingObject.mastername
// //             //         }
// //             //     });        

// //             //     return mergedObject;
// //             // });
// //             // res.json({ data: manufacureCreation });
// //             _.forEach(storeKeys, (status) => {
// //                 const matchingObject = master.reduce((found, subMaster) => {
// //                     const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
// //                     return found || subMatchingObject;
// //                 }, null);
// //                 const genClass = genericClassification.find(obj => obj._id.toString() === sObject['clasificationName']);
// //                 const genSubClass = genericSubClassification.find(obj => obj._id.toString() === sObject['subClassificationName'])
// //                 // find(item => item._id.equals(sObject.subClassificationName));
// //                 if (genSubClass) {
// //                     console.log('genSubClass.subClasificationName', genSubClass.subClasificationName)
// //                     mergedObject['subClassificationName'] = genSubClass.subClasificationName;
// //                     console.log('sObject1', mergedObject)
// //                 }
// //                 if (genClass) {
// //                     mergedObject['clasificationName'] = genClass.clasificationName;
// //                 }


// //                 if (matchingObject) {
// //                     mergedObject[status] = matchingObject.subMasterName
// //                 }
// //                 // console.log('matchingObject.mastername',matchingObject.mastername)
// //             });
// //             // console.log('sObject',mergedObject)
// //             return mergedObject;
// //         });
// //             res.json({ data: result });

// //         } else {

// //     const manufacureCreation = await ManufacureCreation.find();
// //     res.json({ data: manufacureCreation });
// // }

// //     }
//     // catch (error) {
// //     // Handle any errors that may occur during the database query
// //     console.error(error);
// //     res.status(500).json({ error: 'Internal Server Error' });
// }
// })

app.get('/getManufacureCreation', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const ManufacureCreation = require('./store.js').manufacureCreation;
        const Master = require('./masters.js').master;
        // const GenericClassification = require('./store.js').genericClassification;
        // const GenericSubClassification = require('./store.js').genericSubClassification;

        if (req.query) {
            const manufacureCreation = await ManufacureCreation.find(req.query);
            const master = await Master.find(req.query);
            // const genericClassification = await GenericClassification.find(req.query);
            // const genericSubClassification = await GenericSubClassification.find(req.query);

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
            res.json({ data: manufacureCreation });
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
    onCommonPost(req, res, supplierDetails)
    console.log('Insert Asigments')
    // try {
    //     console.log('Insert Document', req.body)
    //     if (req.body[0] && req.body[0]._id) {
    //         console.log('Insert Document 1')
    //         const id = req.body[0]._id
    //         delete req.body[0]._id
    //         req.body[0].modifydt = new Date();
    //         await supplierDetails.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //     } else {
    //         console.log('req.body', req.body)
    //         req.body[0].createdt = new Date();
    //         await supplierDetails.insertMany(req.body);
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    // }
})

app.get('/getSupplierDetails', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const SupplierDetails = require('./store.js').supplierDetails;
        const Master = require('./masters.js').master;
        const SupplierCategory = require('./store.js').supplierCategory;

        if (req.query) {
            const supplierDetails = await SupplierDetails.find(req.query);
            const master = await Master.find(req.query);
            const supplierCategory = await SupplierCategory.find(req.query);
            // const storeKeys = ['supplierapplyTCSforPOStockEntry', 'status', 'registeredsupplier', 'supplierCategory'];

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
            // onCommonJoinGet(res, supplierDetails, storeKeys, master, supplierCategory)
            // const result = supplierDetails.map(sObject => {
            //     const storeKeys = ['supplierapplyTCSforPOStockEntry', 'status','registeredsupplier','supplierCategory'];
            //     const mergedObject = { ...sObject.toObject() };

            //     _.forEach(storeKeys, (status) => {
            //         const matchingObject = master.find(obj => obj._id.toString() === sObject[status]);
            //         console.log('sObject[supplierCategory]', sObject['supplierCategory'])
            //         const matchStore = supplierCategory.find(obj => obj._id.toString() === sObject['supplierCategory'].toString());
            //         console.log('matchStore', matchStore)
            //         if (matchStore) {
            //             sObject['supplierCategory'] = matchStore.categoryname;
            //         }
            //         if (matchingObject) {
            //             sObject[status] = matchingObject.mastername
            //         }
            //     });

            //     return mergedObject;
            // });

            res.json({ data: supplierDetails });
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
    onCommonPost(req, res, newItem)
    // console.log('Insert newItem')
    // try {
    //     console.log('Insert newItem', req.body)
    //     if (req.body[0] && req.body[0]._id) {
    //         console.log('Insert newItem 1')
    //         const id = req.body[0]._id
    //         delete req.body[0]._id
    //         req.body[0].modifydt = new Date();
    //         await newItem.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //     } else {
    //         console.log('newItem', req.body)
    //         req.body[0].createdt = new Date();
    //         await newItem.insertMany(req.body);
    //     }
    // } catch (error) {
    //     console.log('Update Error newItem')
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
            const newItem = await NewItem.find(req.query)
            const serviceSubGroup = await serviceSubGrp.find(req.query);
            const master = await Master.find(req.query);
            const servicegroup = await serviceGroup.find(req.query);
            const itemCategory = await AddItemCategory.find(req.query);
            const uomcreation = await UomCreation.find(req.query);

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
            res.json({ data: result });
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
    // onCommonPost(req, res, rasiePurchaseOrder)
    try {
        if (req.body[0] && req.body[0]._id) {
            const id = req.body[0]._id
            delete req.body[0]._id
            req.body[0].modifydt = new Date();
            await rasiePurchaseOrder.updateOne({ _id: { $eq: id } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            req.body[0]['poNumber'] = "POCS02";
            console.log('req.body', req.body)
            await rasiePurchaseOrder.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
})

app.get('/getRasiePurchaseOrderMaster', async (req, res) => {
    console.log('Get 1')
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const RasiePurchaseOrder = require('./procurement.js').rasiePurchaseOrder;
        const Master = require('./masters.js').master;
        const StoreMaster = require('./store.js').storeMaster;
        console.log('req.query', req.query)

        // if (req.query) {
        //     console.log('GET1')
        //     const rasiePurchaseOrder = await RasiePurchaseOrder.find(req.query);
        //     res.json({ data: rasiePurchaseOrder });
        // } else {
        //     console.log('GET')
        //     const rasiePurchaseOrder = await RasiePurchaseOrder.find();
        //     res.json({ data: rasiePurchaseOrder });
        // }
        if (req.query) {
            const rasiePurchaseOrder = await RasiePurchaseOrder.find(req.query);
            const master = await Master.find(req.query);
            const storeMaster = await StoreMaster.find(req.query);
            // const storeKeys = ['supplierapplyTCSforPOStockEntry', 'status', 'registeredsupplier', 'supplierCategory'];

            const result = rasiePurchaseOrder.map(sObject => {
                const storeKeys = ['store', 'approvalStatus'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);
                    const matchStore = storeMaster.find(obj => obj._id.toString() === sObject['store'].toString());
                    if (matchStore) {
                        sObject['store'] = matchStore.store;
                    }
                    if (matchingObject) {
                        sObject[status] = matchingObject.subMasterName
                    }
                });
                return sObject;
            });
            res.json({ data: rasiePurchaseOrder });
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
    onCommonPost(req, res, stockEntry)
    // try {
    //     console.log('req.body', req.body)
    //     if (req.body[0] && req.body[0]._id) {
    //         const id = req.body[0]._id
    //         delete req.body[0]._id
    //         req.body[0].modifydt = new Date();
    //         await stockEntry.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //         res.json({ status: "200", message: 'Update Successfull' });
    //     } else {
    //         const currentdt = new Date();
    //         req.body[0].createdt = currentdt;
    //         await stockEntry.insertMany(req.body);
    //         console.log('req.body Insert', req.body)
    //         res.json({ status: "200", message: 'Create Successfull' });
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    //     res.status(500).json({ status: "500", message: 'Error', error: error.message });
    // }
})

app.get('/getStockEntryMaster', async (req, res) => {
    console.log('Get 1')
    // try {
    //     // Assuming you have a "Teacher" model defined in your './model.js' file
    //     const StockEntry = require('./procurement.js').stockEntry;
    //     // onCommonGet(req, res, StockEntry)
    //     // StockEntry
    //     // console.log('req.query', req.query)

    //     // if (req.query) {
    //     //     console.log('GET1')
    //     //     const stockEntry = await StockEntry.find(req.query);
    //     //     res.json({ data: stockEntry });
    //     // } else {
    //     //     console.log('GET')
    //     //     const stockEntry = await StockEntry.find();
    //     //     res.json({ data: stockEntry });
    //     // }

    // } catch (error) {
    //     // Handle any errors that may occur during the database query
    //     console.error(error);
    //     res.status(500).json({ error: 'Internal Server Error' });
    // }
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const StockEntry = require('./procurement.js').stockEntry;
        const Master = require('./masters.js').master;
        const StoreMaster = require('./store.js').storeMaster;
        const rasiePurchase = require('./procurement.js').rasiePurchaseOrder;

        if (req.query) {
            const stockEntry = await StockEntry.find(req.query);
            const master = await Master.find(req.query);
            const storeMaster = await StoreMaster.find(req.query);
            const rasiepurchase = await rasiePurchase.find(req.query);
            // const storeKeys = ['supplierapplyTCSforPOStockEntry', 'status', 'registeredsupplier', 'supplierCategory'];

            const result = stockEntry.map(sObject => {
                const storeKeys = ['store', 'poNumber', 'approvalStatus'];
                const mergedObject = { ...sObject.toObject() };

                _.forEach(storeKeys, (status) => {
                    const matchingObject = master.reduce((found, subMaster) => {
                        const subMatchingObject = subMaster.subMasterData.find(obj => obj.subMasterId === sObject[status]);
                        return found || subMatchingObject;
                    }, null);
                    const matchStore = storeMaster.find(obj => obj._id.toString() === sObject['store'].toString());
                    console.log('sObject', rasiepurchase)
                    const matchpurchase = rasiepurchase.find(obj => obj._id === sObject['ponumber']);
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
            res.json({ data: stockEntry });
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
    onCommonPost(req, res, sales)
    console.log('common')
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
    onCommonPost(req, res, serviceGroup)
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
            const servicegroup = await serviceGroup.find(req.query);
            const master = await Master.find(req.query);

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
            res.json({ data: servicegroup });
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
    onCommonPost(req, res, serviceSubGroup)
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
            const serviceSubGroup = await serviceSubGrp.find(req.query);
            const master = await Master.find(req.query);
            const servicegroup = await serviceGroup.find(req.query);

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
            res.json({ data: serviceSubGroup });
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
    onCommonPost(req, res, taxGroup)
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
            const taxGroup = await taxgroup.find(req.query);
            const master = await Master.find(req.query);
            // const servicegroup = await serviceGroup.find(req.query);

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
            res.json({ data: taxGroup });
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
    onCommonPost(req, res, taxSubGroup)
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
            const taxsubGroup = await taxsubgroup.find(req.query);
            const taxGroup = await taxgroup.find(req.query);
            const master = await Master.find(req.query);
            // const servicegroup = await serviceGroup.find(req.query);

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
            res.json({ data: taxsubGroup });
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
    onCommonPost(req, res, department)
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
            const department = await Department.find(req.query);
            const master = await Master.find(req.query);
            // const storeMaster = await StoreMaster.find(req.query);
            // const rasiepurchase = await rasiePurchase.find(req.query);
            // const storeKeys = ['supplierapplyTCSforPOStockEntry', 'status', 'registeredsupplier', 'supplierCategory'];

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
            res.json({ data: department });
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

async function onCommonPost(req, res, tableName) {
    try {
        if (req.body[0] && req.body[0]._id) {
            const id = req.body[0]._id
            delete req.body[0]._id
            req.body[0].modifydt = new Date();
            req.body[0].codeGen = on
            await tableName.updateOne({ _id: { $eq: id } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await tableName.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
}

async function onCommonGet(req, res, gettableName) {
    try {
        if (req.query) {
            console.log('GET1')
            const getData = await gettableName.find(req.query);
            res.json({ data: getData });
        } else {
            console.log('GET')
            const getData = await gettableName.find();
            res.json({ data: getData });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function onCommonJoinGet(res, maintable, columnsList, table1, table2, table3) {
    const result = maintable.map(sObject => {
        const mergedObject = { ...sObject.toObject() };

        _.forEach(columnsList, (status) => {
            const matchingObject = table1.find(obj => obj._id.toString() === sObject[status]);
            console.log('table2', table2)
            if (table2 != undefined) {
                const matchStore = table2.find(obj => obj._id.toString() === sObject['supplierCategory'].toString());
                // console.log('matchStore', matchStore)
                if (matchStore) {
                    sObject['supplierCategory'] = matchStore.categoryname;
                }
            }
            if (matchingObject) {
                sObject[status] = matchingObject.mastername
            }
        });

        return mergedObject;
    });

    res.json({ data: maintable });
}

app.get('/getpdf', async (req, res) => {
    onGeneratePdf()
})

async function onGeneratePdf() {


    // const PDFDocument = require('pdfkit');
    // const fs = require('fs');

    // // Create anew PDF document
    // const doc = new PDFDocument();

    // // Pipe the PDF into a writable stream (in this case, a file stream)
    // const writeStream = fs.createWriteStream('sample.pdf');
    // doc.pipe(writeStream);

    // const aaa = {
    //     companyName: 'Suvarna',
    //     id: 272,
    //     salary: '2k'
    // };

    // // Calculate the middle value of the page
    // const middle = doc.page.width / 2;
    // const cellWidth = (middle - 150) / 2;
    // const cellHeight = 20;

    // // Add content to the PDF
    // doc.fontSize(20).text('Sample PDF Document', { align: 'center' });
    // doc.moveDown();

    // // Create two sections on a single page
    // doc.rect(0, 0, middle, doc.page.height); // Left half
    // doc.rect(middle, 0, middle, doc.page.height); // Right half

    // const properties = Object.keys(aaa);
    // const startZ = 100;
    // const lineHeight = 10;
    // const spacing = 10;

    // properties.forEach((property, index) => {
    //     doc.fontSize(12)
    //         .text(`${property}: ${aaa[property]}`, 100 + (index < properties.length / 2 ? 0 : middle), startZ + (index % (properties.length / 2)) * (lineHeight + spacing), { align: 'left', width: middle - 100 });
    // console.log(`${property}: ${aaa[property]}`)
    //     });


    // // Calculate the position for the table
    // const tableStartY = startZ + Math.ceil(properties.length / 2) * (lineHeight + spacing) + 50; // 50 is padding

    // const data = [
    //     { id: 1, name: 'John', salary: 2000 },
    //     { id: 2, name: 'Jane', salary: 2500 }
    // ];

    // // Set up table parameters
    // const startX = 50;
    // const startY = tableStartY; //tableStartY
    // const rowHeight = 30;
    // const colWidth = 150;
    // const borderWidth = 1;

    // // Header row
    // doc.font('Helvetica').fontSize(12);
    // doc.text('ID', startX, startY).text('Name', startX + colWidth, startY).text('Salary', startX + 2 * colWidth, startY);

    // // Draw horizontal lines
    // for (let i = 0; i <= data.length; i++) {
    //     doc.moveTo(startX, startY + (i + 1) * rowHeight)
    //         .lineTo(startX + 3 * colWidth, startY + (i + 1) * rowHeight)
    //         .lineWidth(borderWidth)
    //         .stroke();
    // }

    // // Draw vertical lines
    // doc.moveTo(startX + colWidth, startY).lineTo(startX + colWidth, startY + (data.length + 1) * rowHeight).stroke();
    // doc.moveTo(startX + 2 * colWidth, startY).lineTo(startX + 2 * colWidth, startY + (data.length + 1) * rowHeight).stroke();

    // // Populate data
    // data.forEach((entry, index) => {
    //     const rowY = startY + (index + 1) * rowHeight;
    //     doc.text(entry.id.toString(), startX, rowY)
    //         .text(entry.name, startX + colWidth, rowY)
    //         .text(entry.salary.toString(), startX + 2 * colWidth, rowY);
    // });
    // doc.end();

    const PDFDocument = require('pdfkit');
    const fs = require('fs');

    // Create a new PDFDocument
    const doc = new PDFDocument();

    // Pipe the PDF content to a file
    doc.pipe(fs.createWriteStream('table.pdf'));

    // Add content to the PDF
    // doc.fontSize(20).text('Sample PDF Document', { align: 'center' });
    doc.font('Helvetica-Bold').fontSize(8).text('Purchase Order', { align: 'center' });
    doc.moveDown();
    // doc.fontSize(8)
    const aaa = {
        'Hospital GSTIN No': '36AABCU6403H1ZH',
        'Indent Process No': '',
        'Auth/Amnd Dt': '02-01-2024 10:56',
        'PO No': 'POCS2023000002',
        'Supplier Address': 'HIMALAYAPHARMA GROUND FLOORGHORI NAGAR COLON LOD BOWENPALLY SECUGHORI NAGAR COLON LOD BOWENPALLY SECU SECUNDERABAD TELANGANA India HIMALAYAPHARMA GROUND FLOORGHORI NAGAR COLON LOD BOWENPALLY SECUGHORI NAGAR COLON LOD BOWENPALLY SECU SECUNDERABAD TELANGANA India HIMALAYAPHARMA GROUND FLOORGHORI NAGAR COLON LOD BOWENPALLY',
        'Store Name': 'CENTRAL STORE',
        'Dept. Name': 'Anaesthesiology',
        'Credit Period': '0.00',
        'Delivery Date': '',
        'PO Date': '02-jan-24',
        'Delivery At': 'OMNI KUKATPALLY HOSPITAL No-20,21,22A,22B,22C,23&24 Balaji Nagar, Kukatpally,Hyderabad-500072, Telangana.'
    };

    // Calculate the middle value of the page
    const middle = doc.page.width / 2;
    const cellWidth = (middle - 150) / 2;
    const cellHeight = 20;



    // Create two sections on a single page
    // doc.rect(0, 0, middle, doc.page.height); // Left half
    //  doc.rect(middle, 0, middle, doc.page.height); // Right half

    const objproperties = Object.keys(aaa);
    const startZ = 100;
    let accumulatedHeight = startZ;
    let accumulatedHeight1 = startZ;
    const lineHeight = 10;
    const spacing = 10;
    const halfLength = Math.ceil(objproperties.length / 2);
    //   console.log('accumulatedHeight', accumulatedHeight)
    //     console.log('accumulatedHeight1', accumulatedHeight1)
    objproperties.forEach((property, index) => {

        const textWidth = doc.widthOfString(property) + doc.widthOfString(aaa[property]);
        const lineHeight1 = Math.ceil(textWidth / (middle - 50));
        // let accumulatedHeight =(index < halfLength ? accumulatedHeight + 10 : startZ );
        console.log('textWidth', textWidth)
        console.log('lineHeight1', lineHeight1)
        const xPos = (index < 6 ? 50 : middle);
        const zPos = (index < 6 ? accumulatedHeight + 10 : accumulatedHeight1 + 10)

        // doc.font('Helvetica').fontSize(8)
        //     .text(`${property}: ${aaa[property]}`, xPos, zPos, { align: 'left', width: middle - 50 })

        doc.moveTo(200, 200)       // this is your starting position of the line, from the left side of the screen 200 and from top 200
            // .lineTo(400, 200)       // this is the end point the line 
            .dash(5, { space: 10 }) // here we are formatting it to dash
            .text(`${property}: ${aaa[property]}`, xPos, zPos, { align: 'left', width: middle - 50 }) // the text and the position where the it should come
        doc.moveTo(500, 200)   //again we are giving a starting position for the text
            // .lineTo(800, 200)       //end point
            .dash(5, { space: 10 })   //adding dash
            .stroke()

        accumulatedHeight = (index < halfLength ? accumulatedHeight += lineHeight1 * 10 : accumulatedHeight1 += lineHeight1 * 10)

    });
    // for (const [key, value] of Object.entries(aaa)) {
    //     // Print key-value pair
    //     doc
    //         .font('Helvetica-Bold')
    //         .fontSize(12)
    //         // .text(`${key}:`, { continued: true })
    //         .font('Helvetica')
    //         .text(`${key}: ${value}`, middle, { align: 'left' })
    //         .moveDown();
    // }

    // for (const [key, value] of Object.entries(aaa)) {
    //     doc.text(`${key}: ${value}`, middle, { align: 'left' });
    //     doc.moveDown(0.5);
    // }

    // doc.on('pageAdded', () => {
    //     const middle = doc.page.width / 2;

    //     for (const [key, value] of Object.entries(aaa)) {
    //         doc.text(`${key}: ${value}`, middle, { align: 'left' });
    //         doc.moveDown(0.5);
    //     }

    //     doc.end();
    // });

    // doc.addPage();

    // const objproperties = Object.keys(aaa);
    // const startZ = 100;
    // const lineHeight = 10;
    // let yPos = startZ;

    // objproperties.forEach((property, index) => {
    //     const xPos = 50 + (index < objproperties.length / 2 ? 0 : middle);

    //     // Print the property and value
    //     doc.font('Helvetica').fontSize(9)
    //         .text(`${property}: ${aaa[property]}`, xPos, yPos, { align: 'left', width: middle - 50 });

    //     // Move the vertical position down
    //     yPos += lineHeight;

    //     // If the current property is 'Supplier Address', calculate its height and adjust the vertical position for the next property
    //     // if (property === 'Supplier Address') {
    //     //     const addressLines = doc.widthOfString(`${aaa[property]}`, { width: middle - 50 });
    //     //     // yPos += addressLines;
    //     // }
    // });


    // objproperties.forEach((property, index) => {
    //     const xPos = 100 + (index < objproperties.length / 2 ? 0 : middle);
    //     let yPos = startZ + (index % (objproperties.length / 2)) * (lineHeight + spacing);

    //     // If the current property is 'Store Name' and it follows 'Supplier Address', add extra spacing
    //     if (property === 'Store Name' && objproperties.indexOf('Supplier Address') !== -1 && objproperties.indexOf('Store Name') > objproperties.indexOf('Supplier Address')) {
    //         yPos += lineHeight + spacing;
    //     }

    //     doc.font('Helvetica').fontSize(9)
    //         .text(`${property}: ${aaa[property]}`, xPos, yPos, { align: 'left', width: middle - 100 });
    // });


    // Calculate the position for the table
    const tableStartY = startZ + Math.ceil(objproperties.length / 2) * (lineHeight + spacing) + 30; // 50 is padding
    console.log('tableStartY', tableStartY)

    const data = [
        { 'Sl No.': 1, 'Item Name': 'DOLOFAN InJ', 'HSN CODE': '', 'MFR': 'GEN', 'QTY': 1.00, 'RATE': 11.00, 'DISC': 1.00, 'TAX%': 12.00, 'CGST': 0.60, 'SGST': 0.60, 'IGST': 0.00, 'Amount': 11.20 },
        { 'Sl No.': 2, 'Item Name': 'DOLOPAR TAB', 'HSN CODE': '', 'MFR': 'GEN', 'QTY': 1.00, 'RATE': 11.00, 'DISC': 1.00, 'TAX%': 12.00, 'CGST': 0.60, 'SGST': 0.60, 'IGST': 0.00, 'Amount': 11.20 },

    ];


    // Set up table parameters
    const startX = 50;
    const tableEndX = 550; // End position of the table
    const startY = tableStartY; // Start drawing the table from startY
    const rowHeight = 30;
    const properties = Object.keys(data[0]);
    console.log(properties.length)
    //const colWidth = doc.page.width / properties.length ; //100
    const colWidth = (tableEndX - startX) / properties.length;
    console.log(doc.page.width)
    console.log(colWidth)
    const borderWidth = 1;

    // Define initial position
    let x = 50;
    let y = 50;

    // Header row
    // doc.font('Helvetica').fontSize(12);
    // doc.text('ID', startX, startY).text('Name', startX + colWidth, startY).text('Salary', startX + 2 * colWidth, startY).text('place', startX + 3 * colWidth, startY);
    doc.font('Helvetica-Bold').fontSize(9);
    Object.keys(data[0]).forEach((header, index) => {
        console.log('colWidth', colWidth)
        const x = startX + index * colWidth + colWidth / 2 - doc.widthOfString(header) / 2;
        console.log('x', x)
        doc.text(header, x, startY, {
            width: colWidth - borderWidth,
            align: 'center'
        });
    });


    // Draw horizontal lines
    for (let i = -1; i <= data.length; i++) {
        doc.moveTo(startX, startY + (i + 1) * rowHeight)
            .lineTo(startX + 12 * colWidth, startY + (i + 1) * rowHeight)
            .lineWidth(1)
            .stroke();
    }

    // Draw vertical lines
    for (let i = 0; i <= Object.keys(data[0]).length; i++) {
        doc.moveTo(startX + i * colWidth, startY)
            .lineTo(startX + i * colWidth, startY + 3 * rowHeight)
            .lineWidth(1)
            .stroke();
    }


    // Populate data
    doc.font('Helvetica').fontSize(8);
    data.forEach((entry, rowIndex) => {
        Object.keys(entry).forEach((key, colIndex) => {
            const value = entry[key].toString();
            const x = startX + colIndex * colWidth + colWidth / 2 - doc.widthOfString(value) / 2;
            const y = startY + (rowIndex + 1) * rowHeight + rowHeight / 2 - doc.currentLineHeight() / 2;
            doc.text(value, x, y, {
                width: colWidth - borderWidth,
                align: 'center'
            });
            // wrapText(value, x, y, colWidth, lineHeight)
        });
    });


    // Company name
    // const companyNameY = startY + (data.length + 1) * rowHeight + 20;
    // const companyNameX = startX + colWidth; // Aligning with the table
    // doc.fontSize(12).text('Company Name: Suvarna', companyNameX, companyNameY, { align: 'center' });


    const aaa1 = {
        companyName: 'Suvarna',
        id: 272,
        salary: '2k',
        place: 'Nellore',
        DOb: '25-july-1996'
    };
    // Set up table parameters
    const startX1 = 50;
    const startY1 = 50;
    const rowHeight1 = 30;
    const colWidth1 = 150;
    const borderWidth1 = 1;

    // Add content to the PDF
    doc.font('Helvetica').fontSize(12);

    // Populate data
    const keys = Object.keys(aaa1);
    const values = Object.values(aaa1);
    const numCols = 3; // Number of columns for each row
    const numRows = Math.ceil(keys.length / numCols); // Calculate number of rows

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const index = row * numCols + col;
            if (index < keys.length) {
                const x = startX1 + col * colWidth1;
                const y = (startY + (data.length + 1) * rowHeight + 20) + startY1 + row * rowHeight1; //startY1 + row * rowHeight1;
                doc.text(`${keys[index]}: ${values[index]}`, x, y, { width: colWidth1, align: 'left' });
            }
        }
    }
    doc.moveDown();
    // const companyNameY = startY + (data.length + 1) * rowHeight + 20;
    // const companyNameX = startX + colWidth; // Aligning with the table

    // Finalize PDF
    doc.end();

    console.log('PDF generated successfully.');
}

// Function to wrap text
function wrapText(text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';

    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + ' ';
        console.log('testLine', testLine)
        let testWidth = doc.widthOfString(testLine);
        if (testWidth > maxWidth && i > 0) {
            doc.text(line, x, y);
            line = words[i] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    doc.text(line, x, y);
}


app.get('/getsamplepdf', async (req, res) => {
    onGenerateSmplePdf()
})

async function onGenerateSmplePdf() {
    const PDFDocument = require('pdfkit');
    const fs = require('fs');

    const aaa = {
        'Hospital GSTIN No': '36AABCU6403H1ZH',
        'Indent Process No': '',
        'Auth/Amnd Dt': '02-01-2024 10:56',
        'PO No': 'POCS2023000002',
        'Supplier Address': 'HIMALAYAPHARMA GROUND FLOORGHORI NAGAR COLON LOD BOWENPALLY SECUGHORI NAGAR COLON LOD BOWENPALLY SECU SECUNDERABAD TELANGANA India',
        'Store Name': 'CENTRAL STORE',
        'Dept. Name': 'Anaesthesiology',
        'Credit Period': '0.00',
        'Delivery Date': '',
        'PO Date': '02-jan-24',
        'Delivery At': 'OMNI KUKATPALLY HOSPITAL No-20,21,22A,22B,22C,23&24 Balaji Nagar, Kukatpally,Hyderabad-500072, Telangana.'
    };

    const lorem = "Lorem ipsum dolor sit amet,    consectetur adipiscing elit. Etiam in    suscipit purus. Vestibulum ante ipsum primis in faucibus orci luctuset ultrices posuere cubilia Curae;Vivamus nec hendrerit felis. Morbialiquam facilisis risus eu lacinia. Sedeu leo in turpis fringilla hendrerit. Utnec accumsan nisl. Suspendisserhoncus nisl posuere tortor tempus etdapibus elit porta. Cras leo neque,elementum a rhoncus ut, vestibulum non nibh. Phasellus pretium justoturpis. Etiam vulputate, odio vitaetincidunt ultricies, eros odio dapibusnisi, ut tincidunt lacus arcu eu elit.Aenean velit erat, vehicula egetlacinia ut, dignissim non tellus.Aliquam nec lacus mi, sedvestibulum nunc. Suspendissepotenti. Curabitur vitae sem turpis.Vestibulum sed neque eget dolordapibus porttitor at sit amet sem.Fusce a turpis lorem. Vestibulumante ipsum primis in faucibus orciluctus et ultrices posuere cubiliaCurae;Mauris at ante tellus.Vestibulum a metus lectus. Praesenttempor purus a lacus blandit egetgravida ante hendrerit. Cras et erosmetus. Sed commodo malesuadaeros, vitae interdum augue semperquis. Fusce id magna nunc.Curabitur sollicitudin placeratsemper. Cras et mi neque, adignissim risus. Nulla venenatisporta lacus, vel rhoncus lectustempor vitae. Duis sagittis venenatisrutrum. Curabitur tempor massa…"

    // Create a new PDF document
    const doc = new PDFDocument(); // Setting width and height
    doc.pipe(fs.createWriteStream('output.pdf'));
    const middle = doc.page.width / 2;
    const startZ = 100;
    // let zPos =0 ;
    let accumulatedHeight = startZ;
    objproperties = Object.keys(aaa);
    const halfLength = Math.ceil(objproperties.length / 2);
    // const zPos =100;
    objproperties.forEach((property, index) => {
        // Print key-value pair
        const textWidth = doc.widthOfString(property) + doc.widthOfString(aaa[property]);
        const lineHeight = Math.ceil(textWidth / (middle - 100));
        const xPos = index < halfLength ? 50 : middle + 50;
        // zPos = lineHeight*10
        console.log(lineHeight)
        console.log('accumulatedHeight', accumulatedHeight)

        const yPos = accumulatedHeight;
        // const yPos = zPos + startZ + (index % halfLength) *  lineHeight*10;

        console.log('property', `${property}`)
        // console.log((index % halfLength) *  lineHeight*10)
        console.log('lineHeight', lineHeight)
        console.log('yPos', yPos)

        doc
            .font('Helvetica').fontSize(9)
            // .font('Helvetica').fontSize(10)
            .text(`${property}: ${aaa[property]}`, xPos, yPos,
                { align: 'left', width: middle - 50 });
        // .text(lorem, {
        //     width: 412,
        //     align: 'justify',
        //     indent: 30,
        //     columns: 2,
        //     height: 100,
        //     ellipsis: true
        // });

        accumulatedHeight += lineHeight * 10;
        console.log('accumulatedHeight1', accumulatedHeight)

        doc.moveDown();
    });

    // .text(`${property}: ${aaa[property]}`, 50 + (index < objproperties.length / 2 ? 0 : middle), startZ + (index % (objproperties.length / 2))* (lineHeight),{ align: 'left', width: middle - 50 })

    // Print page width divided by 2
    doc.font('Helvetica-Bold').text(`Page Width / 2: ${middle}`);
    doc
        .text('And here is some wrapped text...', 100, 300)
        .font('Times-Roman', 13)
        .moveDown()
        .text(lorem, {
            width: 412,
            align: 'justify',
            indent: 30,
            columns: 2,
            height: 100,
            ellipsis: true
        });

    doc.end();

}

app.get('/gethtmlpdf', async (req, res) => {
    onGeneratePdfCretor()
})

async function onGeneratePdfCretor() {
    //Required package
    var pdf = require("pdf-creator-node");
    var fs = require("fs");

    // Read HTML Template
    var html = fs.readFileSync("index.html", "utf8");
    // const middle = doc.page.width / 2;
    // console.log('middle',middle)
    var options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
        },
        footer: {
            height: "28mm",
            contents: {
                first: 'Cover page',
                // 2: 'Second page', // Any page number is working. 1-based index
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                last: 'Last Page'
            }
        }
    };

    var users = [
        {
            'HospitalGSTINNo': '36AABCU6403H1ZH',
            'IndentProcessNo': '',
            'Auth/AmndDt': '02-01-2024 10:56',
            'PONo': 'POCS2023000002',
            'SupplierAddress': 'HIMALAYAPHARMA GROUND FLOORGHORI NAGAR COLON LOD BOWENPALLY SECUGHORI NAGAR COLON LOD BOWENPALLY SECU SECUNDERABAD TELANGANA India',
            'StoreName': 'CENTRAL STORE',
            'DeptName': 'Anaesthesiology',
            'CreditPeriod': '0.00',
            'DeliveryDate': '',
            'PODate': '02-jan-24',
            'DeliveryAt': 'OMNI KUKATPALLY HOSPITAL No-20,21,22A,22B,22C,23&24 Balaji Nagar, Kukatpally,Hyderabad-500072, Telangana.'
        }
    ];
    var users1 = [
        { name: "Alice", age: 30, occupation: "Engineer" },
        { name: "Bob", age: 35, occupation: "Designer" },
        { name: "Charlie", age: 25, occupation: "Developer" }
    ];

    var document = {
        html: html,
        data: {
            users: users,
            users1: users1,

        },
        path: "./output.pdf",
        type: "",
    };
    pdf
        .create(document, options)
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.error(error);
        });

}
// app.listen(1000, () => console.log('ok'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
