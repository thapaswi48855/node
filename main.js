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
app.listen(1000);
console.log('Express')
const { Document, Module, ModuleDocument, Roles, AssigneByPermissions, newUser } = require('./model.js');
const Custmer = require('./custer.js')
// const url = 'mongodb://127.0.0.1:27017/projects' //testing ,projects
const url ='mongodb+srv://tapaswigangavarapu:05RJCCwPP5nq1YMv@cluster0.spvxgrd.mongodb.net/parma?retryWrites=true&w=majority'
const dbName = "test";
const currentDate = new Date();
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const newUuid = uuidv4();
// const payload = {
//     userId: 123,
//     username: 'exampleuser',
//   };
function connection() {
    const conMongo = mongoose.connect(url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
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

app.get('/tet',(req,res)=>{
    res.json({'oj':'ok'})
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

const { storeTypeMaster, storeMaster, uomCreation,
    addItemCategory, genericClassification, genericSubClassification,
    genericDetails, supplierCategory, manufacureCreation, supplierDetails, newItem, department } = require('./store.js');

const { master, ZeroLevelMaster } = require('./masters.js');
const { rasiePurchaseOrder, stockEntry } = require('./procurement.js');
const { sales, salesReturn, patientIndent, patientReturnIndent } = require('./sales.js');
const { serviceGroup, serviceSubGroup } = require('./service.js');
const { taxGroup, taxSubGroup } = require('./tax.js')

/* Documents GET & INSERT & UPDate */

app.get('/documents', async (req, res) => {

    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const Document = require('./model.js').Document;

        if (req.query) {
            const documents = await Document.find(req.query);
            console.log('documents', documents)
            res.json({ data: documents });
        } else {
            const documents = await Document.find();
            res.json({ data: documents });
        }

    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


app.post('/insertDocuments', async (req, res) => {
    onCommonPost(req, res, Document);
    // try {

    //     if (req.body[0] && req.body[0]._id) {
    //         const id = req.body[0]._id
    //         delete req.body[0]._id
    //         await Document.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //     } else {
    //         await Document.insertMany(req.body);
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    // }
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
    onCommonPost(req, res, storeTypeMaster);
    // try {
    //     if (req.body[0] && req.body[0]._id) {
    //         const id = req.body[0]._id
    //         delete req.body[0]._id
    //         req.body[0].modifydt = new Date();
    //         await storeTypeMaster.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //         res.json({ status: "200", message: 'Update Successfull' });
    //     } else {
    //         const currentdt = new Date();
    //         req.body[0].createdt = currentdt;
    //         await storeTypeMaster.insertMany(req.body);
    //         res.json({ status: "200", message: 'Create Successfull' });
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    //     res.status(500).json({ status: "500", message: 'Error', error: error.message });
    // }
})

app.get('/getStoreTypeMaster', async (req, res) => {
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const StoreTypeMaster = require('./store.js').storeTypeMaster;
        const Master = require('./masters.js').master;
        console.log('req.query', req.query)
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
    onCommonPost(req, res, storeMaster);
    // try {
    //     if (req.body[0] && req.body[0]._id) {
    //         const id = req.body[0]._id;
    //         delete req.body[0]._id;
    //         req.body[0].modifydt = new Date();
    //         await storeMaster.updateOne({ _id: { $eq: id } }, {
    //             $set: req.body[0]
    //         });
    //     } else {
    //         req.body[0].createdt = new Date();
    //         await storeMaster.insertMany(req.body);
    //         res.json({ status: "200", message: 'Succes' });
    //     }
    // } catch (error) {
    //     res.status(500).json({ status: "500", message: 'Error', error: error.message });
    // }
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
    onCommonPost(req, res, genericClassification);
    console.log('Insert Asigments')
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
                    if(sObject['serviceGroup'] != undefined){
                    const matchStore = servicegroup.find(obj => obj._id.toString() === sObject['serviceGroup'].toString());
                    if (matchStore) {
                        sObject['serviceGroup'] = matchStore.servicegroupname;
                    }                    
                } 
                if(sObject['serviceSubGroup'] != undefined){
                    const matchStore = serviceSubGroup.find(obj => obj._id.toString() === sObject['serviceSubGroup'].toString());
                    if (matchStore) {
                        sObject['serviceSubGroup'] = matchStore.servicesubgroupname;
                    }                    
                } 
                if(sObject['category'] != undefined){
                    const matchStore = itemCategory.find(obj => obj._id.toString() === sObject['category'].toString());
                    if (matchStore) {
                        sObject['category'] = matchStore.categoryName;
                    }                    
                } 
                if(sObject['packageUOM'] != undefined){
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
                const storeKeys = ['store','approvalStatus'];
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
                const storeKeys = ['store', 'poNumber','approvalStatus'];
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
            req.body[0].codeGen =on
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




