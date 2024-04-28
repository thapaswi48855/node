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
        const Document = require('./model.js').Document;
        // if (req.query) {

        //     const documents =await Document.find(req.query);
        //     console.log('documents', documents)           
        //     res.json({ data: documents });
        // } else {
        // console.log(await Document.find({}));
        // const documents = await Document.find({});
        // // res.json({ 'oj2': 'ok' })
        // res.json({ data: documents });
        // }
        // const modules = await Module.find(query || {});
        let query = req.query;
        // Convert BigInt values to strings
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
            const result = await Document.aggregate([
                { $group: { _id: null, maxDocumentId: { $max: '$documentid' } } }
            ]).exec();

            let counter = (result[0] && result[0].maxDocumentId) ? result[0].maxDocumentId + 1 : 1;

            // counters.set(componentId, counter);
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

        // if (req.query) {
        //     const module = await Module.find(req.query);
        //     res.json({ data: module });
        // } else {
        //     const module = await Module.find();
        //     // Send the fetched documents as a JSON response
        //     res.json({ data: module });
        // }

        // let query = req.query;
        // // Convert BigInt values to strings
        // if (query && query.moduleId && typeof query.moduleId === 'bigint') {
        //     query.moduleId = query.moduleId.toString();
        // }

        // // Clone the request query object to prevent modification of the original object
        // const query = { ...req.query };

        // // Convert BigInt values to strings in the cloned query object
        // if (query.moduleId && typeof query.moduleId === 'bigint') {
        //     query.moduleId = query.moduleId.toString();
        // }


        // const modules = await Module.find(query || {});
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
        console.log('serializedModules', serializedModules)
        // Send the serialized data as the response
        res.send(serializedModules);
        // res.json({ data: sanitizedModules });

    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/insertModule', async (req, res) => {
    // const componentId = 'Module';
    // let counter = counters.get(componentId) || 0;
    // counter += 1;
    // counters.set(componentId, counter);
    // // res.json(counter);
    // req.body[0].moduleid = counter
    // onCommonPost(req, res, Module);
    // try {
    //     if (req.body[0].moduleid != 0) {
    //         req.body[0].modifydt = new Date();
    //         await Module.updateOne({ moduleid: { $eq: req.body[0].moduleid } }, {
    //             $set: req.body[0]
    //         });
    //         res.json({ status: "200", message: 'Update Successfull' });
    //     } else {

    //         const componentId = 'Module';
    //         const result = await Module.aggregate([
    //             { $group: { _id: '$moduleid', maxModuleId: { $max: '$moduleid' } } }
    //         ]).exec();
    //         if (result.length > 0) {
    //             highestModuleId = result[0].maxModuleId || 0;
    //         } else {
    //             highestModuleId = 0;
    //         }
    //         let counter = Math.max(counters.get(componentId) || 0, highestModuleId) + 1;

    //         counters.set(componentId, counter);
    //         req.body[0].moduleid = counter;
    //         const currentdt = new Date();
    //         req.body[0].createdt = currentdt;
    //         await Module.insertMany(req.body);
    //         res.json({ status: "200", message: 'Create Successfull' });
    //     }
    // } catch (error) {
    //     console.log('Update Error')
    //     res.status(500).json({ status: "500", message: 'Error', error: error.message });
    // }
    try {
        if (req.body[0].moduleid !== 0) {
            // If moduleid is not 0, update the existing record
            req.body[0].modifydt = new Date();
            await Module.updateOne({ moduleid: req.body[0].moduleid }, { $set: req.body[0] });
            res.json({ status: "200", message: 'Update Successful' });
        } else {
            // If moduleid is 0, insert a new record
            const componentId = 'Module';

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
        console.log('req.query', req.query)

        // if (req.query) {
        //     const moduleDocument = await ModuleDocument.find(req.query);
        //     res.json({ data: moduleDocument });
        // } else {
        //     const moduleDocument = await ModuleDocument.find();
        //     res.json({ data: moduleDocument });
        // }

        // const modules = await Module.find(query || {});
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
    // const componentId = 'Module Document';
    // let counter = counters.get(componentId) || 0;
    // counter += 1;
    // counters.set(componentId, counter);
    // // res.json(counter);
    // req.body[0].moduledocMapid = counter
    // onCommonPost(req, res, ModuleDocument);
    try {
        if (req.body[0].moduledocMapid != 0) {
            req.body[0].modifydt = new Date();
            await ModuleDocument.updateOne({ moduledocMapid: { $eq: req.body[0].moduledocMapid } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {

            const componentId = 'Module Document';
            const result = await ModuleDocument.aggregate([
                { $group: { _id: null, maxModuleDocMapId: { $max: '$moduledocMapid' } } }
            ]).exec();

            let counter = (result[0] && result[0].maxModuleDocMapId) ? result[0].maxModuleDocMapId + 1 : 1;

            // counters.set(componentId, counter);
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
        // let query = req.query;
        // // Convert BigInt values to strings
        // if (query && query.roleid && typeof query.roleid === 'bigint') {
        //     query.roleid = query.roleid.toString();
        // }

        // const roles = await Roles.find(query || {});

        // // Custom serialization function to handle BigInt values
        // const serialize = (data) => {
        //     return JSON.stringify(data, (key, value) => {
        //         if (typeof value === 'bigint') {
        //             return value.toString();
        //         }
        //         return value;
        //     });
        // };
        // // Serialize the response data
        // const serializedDocuments = serialize({ data: roles });
        // res.send(serializedDocuments);

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
        // try {
        if (req.query) {
            //     const assigneByPermissions = await AssigneByPermissions.find(req.query);
            //     res.json({ data: assigneByPermissions, status: "200", message: 'Succes' });
            //     // res.json({ status: "200", message: 'Succes' });
            // } else {
            //     console.log('GET')
            //     const assigneByPermissions = await AssigneByPermissions.find();
            //     res.json({ data: assigneByPermissions, status: "200", message: 'Succes' });
            //     res.json({ status: "200", message: 'Succes' });
            // }
            // const modules = await Module.find(query || {});
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
    // const componentId = 'Assigne By Permissions';
    // let counter = counters.get(componentId) || 0;
    // counter += 1;
    // counters.set(componentId, counter);
    // // res.json(counter);
    // req.body[0].assignepermissionid = counter

    // onCommonPost(req, res, AssigneByPermissions);
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

    try {
        if (req.body[0].assignepermissionid != 0) {
            req.body[0].modifydt = new Date();
            await AssigneByPermissions.updateOne({ assignepermissionid: { $eq: req.body[0].assignepermissionid } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {

            const componentId = 'Assigne By Permissions';
            const result = await AssigneByPermissions.aggregate([
                { $group: { _id: null, maxAssignepermissionid: { $max: '$assignepermissionid' } } }
            ]).exec();

            let counter = (result[0] && result[0].maxAssignepermissionid) ? result[0].maxAssignepermissionid + 1 : 1;

            // counters.set(componentId, counter);
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
    // const componentId = 'New User';
    // let counter = counters.get(componentId) || 0;
    // counter += 1;
    // counters.set(componentId, counter);
    // // res.json(counter);
    // req.body[0].userid = counter
    // onCommonPost(req, res, newUser);
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

    try {
        if (req.body[0].userid != 0) {
            req.body[0].modifydt = new Date();
            await newUser.updateOne({ userid: { $eq: req.body[0].userid } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {

            const componentId = 'New User';
            const result = await newUser.aggregate([
                { $group: { _id: null, maxUserid: { $max: '$userid' } } }
            ]).exec();

            let counter = (result[0] && result[0].maxUserid) ? result[0].maxUserid + 1 : 1;

            // counters.set(componentId, counter);
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
    console.log('Get 1', req.query)
    try {
        // Assuming you have a "Teacher" model defined in your './model.js' file
        const NewUser = require('./model.js').newUser;
        console.log('req.query', req.query)

        if (req.query) {
            // const NewUser = await NewUser.find(req.query);
            // console.log('newUser', newUser)
            // if (newUser.length > 0) {
            //     res.json({ data: newUser, status: "200", message: 'Succes' });
            // } else {
            //     res.json({ data: newUser, status: "404", message: 'Unble to Login' });
            // }
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
        // if (req.body[0].storetypeid != 0) {
        //     req.body[0].modifydt = new Date();
        //     await storeTypeMaster.updateOne({ storetypeid: { $eq: req.body[0].storetypeid } }, {
        //         $set: req.body[0]
        //     });
        //     res.json({ status: "200", message: 'Update Successfull' });
        // } else {
        //     const componentId = 'Store Type Master';
        //     let counter = counters.get(componentId) || 0;
        //     counter += 1;
        //     counters.set(componentId, counter);
        //     req.body[0].storetypeid = counter
        //     const currentdt = new Date();
        //     req.body[0].createdt = currentdt;
        //     await storeTypeMaster.insertMany(req.body);
        //     res.json({ status: "200", message: 'Create Successfull' });
        // }
        try {
            if (req.body[0].storetypeid != 0) {
                req.body[0].modifydt = new Date();
                await storeTypeMaster.updateOne({ storetypeid: { $eq: req.body[0].storetypeid } }, {
                    $set: req.body[0]
                });
                res.json({ status: "200", message: 'Update Successfull' });
            } else {

                //             const componentId = 'Store Type';
                //             console.log('maxStoreTypeid','1')
                //             const result = await storeTypeMaster.aggregate([
                //                 { $group: { _id: null, maxStoreTypeid: { $max: '$storetypeid' } } }
                //             ]);
                // console.log('maxStoreTypeid',maxStoreTypeid)
                //             let counter = (result[0] && result[0].maxStoreTypeid) ? result[0].maxStoreTypeid + 1 : 1;

                const componentId = 'Store Type';
                const result = await storeTypeMaster.aggregate([
                    { $group: { _id: null, maxStoreTypeId: { $max: '$storetypeid' } } }
                ]).exec();

                let counter = (result[0] && result[0].maxStoreTypeId) ? result[0].maxStoreTypeId + 1 : 1;

                // counters.set(componentId, counter);
                req.body[0].storetypeid = counter;
                const currentdt = new Date();
                req.body[0].createdt = currentdt;
                await storeTypeMaster.insertMany(req.body);
                res.json({ status: "200", message: 'Create Successfull' });
            }
        } catch (error) {
            console.log('Update Error')
            res.status(500).json({ status: "500", message: 'Error', error: error.message });
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
            // res.json({ data: result });
            // const newUsers = await NewUser.find(query || {});




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
            const result = await storeMaster.aggregate([
                { $group: { _id: null, maxStoreMasterId: { $max: '$storemasterid' } } }
            ]).exec();

            let counter = (result[0] && result[0].maxStoreMasterId) ? result[0].maxStoreMasterId + 1 : 1;

            // counters.set(componentId, counter);
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
    // onCommonPost(req, res, uomCreation);
    // console.log('Insert Asigments')
    try {
        if (req.body[0].uomCreationId != 0) {
            req.body[0].modifydt = new Date();
            await uomCreation.updateOne({ uomCreationId: { $eq: req.body[0].uomCreationId } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const componentId = 'Add Item Category';
            const result = await uomCreation.aggregate([
                { $group: { _id: null, maxUomCreationId: { $max: '$uomCreationId' } } }
            ]).exec();
            console.log('uomCreationId', result[0].maxUomCreationId)
            let counter = (result[0] && result[0].maxUomCreationId) ? result[0].maxUomCreationId + 1 : 1;
            console.log('uomCreationId', counter)
            // counters.set(componentId, counter);
            req.body[0].uomCreationId = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await uomCreation.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
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
    // onCommonPost(req, res, addItemCategory);
    // console.log('Insert Asigments')
    try {
        if (req.body[0].addcategoryid != 0) {
            req.body[0].modifydt = new Date();
            await addItemCategory.updateOne({ addcategoryid: { $eq: req.body[0].addcategoryid } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const componentId = 'Add Item Category';
            const result = await addItemCategory.aggregate([
                { $group: { _id: null, maxAddCategoryId: { $max: '$addcategoryid' } } }
            ]).exec();

            let counter = (result[0] && result[0].maxAddCategoryId) ? result[0].maxAddCategoryId + 1 : 1;

            // counters.set(componentId, counter);
            req.body[0].addcategoryid = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await addItemCategory.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
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
    // const componentId = 'Generic Classification Details';
    // let counter = counters.get(componentId) || 0;
    // counter += 1;
    // counters.set(componentId, counter);
    // // res.json(counter);
    // req.body[0].clasificationid = counter
    // onCommonPost(req, res, genericClassification);
    // console.log('clasif', req.body)
    try {
        if (req.body[0].genericClassificationId != 0) {
            req.body[0].modifydt = new Date();
            await genericClassification.updateOne({ genericClassificationId: { $eq: req.body[0].genericClassificationId } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const componentId = 'Add Item Category';
            const result = await genericClassification.aggregate([
                { $group: { _id: null, maxGenericClassificationId: { $max: '$genericClassificationId' } } }
            ]).exec();
            console.log('genericClassificationId', result[0].maxUomCreationId)
            let counter = (result[0] && result[0].maxGenericClassificationId) ? result[0].maxGenericClassificationId + 1 : 1;
            console.log('genericClassification', counter)
            // counters.set(componentId, counter);
            req.body[0].genericClassificationId = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await genericClassification.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
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
    // onCommonPost(req, res, genericSubClassification);
    // console.log('Insert Asigments')
    try {
        if (req.body[0].genSubClasiId != 0) {
            req.body[0].modifydt = new Date();
            await genericSubClassification.updateOne({ genSubClasiId: { $eq: req.body[0].genSubClasiId } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const componentId = 'Add Item Category';
            const result = await genericSubClassification.aggregate([
                { $group: { _id: null, maxGenSubClasiId: { $max: '$genSubClasiId' } } }
            ]).exec();
            console.log('genericClassificationId', result[0].maxUomCreationId)
            let counter = (result[0] && result[0].maxGenSubClasiId) ? result[0].maxGenSubClasiId + 1 : 1;
            console.log('genericClassification', counter)
            // counters.set(componentId, counter);
            req.body[0].genSubClasiId = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await genericSubClassification.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
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
    // onCommonPost(req, res, genericDetails);
    // console.log('Insert Asigments')
    try {
        if (req.body[0].generDetId != 0) {
            req.body[0].modifydt = new Date();
            await genericDetails.updateOne({ generDetId: { $eq: req.body[0].generDetId } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const componentId = 'Add Item Category';
            const result = await genericDetails.aggregate([
                { $group: { _id: null, maxGenerDetId: { $max: '$generDetId' } } }
            ]).exec();
            console.log('genericClassificationId', result[0].maxUomCreationId)
            let counter = (result[0] && result[0].maxGenerDetId) ? result[0].maxGenerDetId + 1 : 1;
            console.log('genericClassification', counter)
            // counters.set(componentId, counter);
            req.body[0].generDetId = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await genericDetails.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
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
    // onCommonPost(req, res, supplierCategory)
    // console.log('Insert Asigments')
    try {
        if (req.body[0].supplierCatId != 0) {
            req.body[0].modifydt = new Date();
            await supplierCategory.updateOne({ supplierCatId: { $eq: req.body[0].supplierCatId } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const componentId = 'Add Item Category';
            const result = await supplierCategory.aggregate([
                { $group: { _id: null, maxSupplierCatId: { $max: '$supplierCatId' } } }
            ]).exec();
            console.log('genericClassificationId', result[0].maxUomCreationId)
            let counter = (result[0] && result[0].maxSupplierCatId) ? result[0].maxSupplierCatId + 1 : 1;
            console.log('genericClassification', counter)
            // counters.set(componentId, counter);
            req.body[0].supplierCatId = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await supplierCategory.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
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
    // onCommonPost(req, res, manufacureCreation)
    // console.log('Insert Asigments')
    try {
        if (req.body[0].manufacureId != 0) {
            req.body[0].modifydt = new Date();
            await manufacureCreation.updateOne({ manufacureId: { $eq: req.body[0].manufacureId } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const componentId = 'Add Item Category';
            const result = await manufacureCreation.aggregate([
                { $group: { _id: null, maxManufacureId: { $max: '$manufacureId' } } }
            ]).exec();
            console.log('genericClassificationId', result[0].maxUomCreationId)
            let counter = (result[0] && result[0].maxManufacureId) ? result[0].maxManufacureId + 1 : 1;
            console.log('genericClassification', counter)
            // counters.set(componentId, counter);
            req.body[0].manufacureId = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await manufacureCreation.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
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
    // onCommonPost(req, res, supplierDetails)
    // console.log('Insert Asigments')
    try {
        if (req.body[0].supplierDetId != 0) {
            req.body[0].modifydt = new Date();
            await supplierDetails.updateOne({ supplierDetId: { $eq: req.body[0].supplierDetId } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const componentId = 'Add Item Category';
            const result = await supplierDetails.aggregate([
                { $group: { _id: null, maxSupplierDetId: { $max: '$supplierDetId' } } }
            ]).exec();
            console.log('genericClassificationId', result[0].maxUomCreationId)
            let counter = (result[0] && result[0].maxSupplierDetId) ? result[0].maxSupplierDetId + 1 : 1;
            console.log('genericClassification', counter)
            // counters.set(componentId, counter);
            req.body[0].supplierDetId = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await supplierDetails.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
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
    // onCommonPost(req, res, newItem)
    try {
        if (req.body[0].newItemId != 0) {
            req.body[0].modifydt = new Date();
            await newItem.updateOne({ newItemId: { $eq: req.body[0].newItemId } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            const componentId = 'Add Item Category';
            const result = await newItem.aggregate([
                { $group: { _id: null, maxNewItemId: { $max: '$newItemId' } } }
            ]).exec();
            console.log('genericClassificationId', result[0].maxUomCreationId)
            let counter = (result[0] && result[0].maxNewItemId) ? result[0].maxNewItemId + 1 : 1;
            console.log('genericClassification', counter)
            // counters.set(componentId, counter);
            req.body[0].newItemId = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            await newItem.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
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
    console.log('1')
    try {
      
        console.log('req.body[0].poNumId', req.body[0].poNumId)
        if (req.body[0].poNumId != 0) {
            console.log('3')
            req.body[0].modifydt = new Date();
            await rasiePurchaseOrder.updateOne({ poNumId: { $eq: req.body[0].poNumId } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            console.log('2')
            const componentId = 'Add Item Category';
            const result = await rasiePurchaseOrder.aggregate([
                { $group: { _id: null, maxPoNumId: { $max: '$poNumId' } } }
            ]).exec();
            console.log('genericClassificationId', result[0].maxPoNumId)
            // let counter = (result[0] && result[0].maxPoNumId) ? result[0].maxPoNumId + 1 : 1;
            console.log('genericClassification', counter)

            if (result.length > 0) {
                console.log('genericClassificationId', result[0].maxPoNumId)
                let counter = (result[0].maxPoNumId) ? result[0].maxPoNumId + 1 : 1;
                console.log('genericClassification', counter)
                // counters.set(componentId, counter);
                req.body[0].poNumId = counter
            } else {
                console.log('No existing documents, setting counter to 1')
                req.body[0].poNumId = 1;
            }




            // counters.set(componentId, counter);
            req.body[0].poNumId = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            req.body[0]['poNumber'] = `POCS0${counter}`;
            await rasiePurchaseOrder.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
            console.log('req.body', req.body)
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
    // onCommonPost(req, res, serviceGroup)
    try {
        if (req.body[0].serviceGrpId != 0) {
            console.log('3')
            req.body[0].modifydt = new Date();
            await serviceGroup.updateOne({ serviceGrpId: { $eq: req.body[0].serviceGrpId } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            console.log('Stock')
            const componentId = 'Add Item Category';
            const result = await serviceGroup.aggregate([
                { $group: { _id: null, maxServiceGrpId: { $max: '$serviceGrpId' } } }
            ]).exec();
            console.log('genericClassificationId', result[0].maxPoNumId)
            let counter = (result[0] && result[0].maxServiceGrpId) ? result[0].maxServiceGrpId + 1 : 1;
            console.log('genericClassification', counter)
            // counters.set(componentId, counter);
            req.body[0].serviceGrpId = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            // req.body[0]['poNumber'] = `POCS0${counter}`;
            await serviceGroup.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
            console.log('req.body', req.body)
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
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
    // onCommonPost(req, res, serviceSubGroup)
    try {
        if (req.body[0].serviceSubGrpId != 0) {
            console.log('3')
            req.body[0].modifydt = new Date();
            await serviceSubGroup.updateOne({ serviceSubGrpId: { $eq: req.body[0].serviceSubGrpId } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            console.log('Stock')
            const componentId = 'Add Item Category';
            const result = await serviceSubGroup.aggregate([
                { $group: { _id: null, maxServiceSubGrpId: { $max: '$serviceSubGrpId' } } }
            ]).exec();
            console.log('genericClassificationId', result[0].maxPoNumId)
            let counter = (result[0] && result[0].maxServiceSubGrpId) ? result[0].maxServiceSubGrpId + 1 : 1;
            console.log('genericClassification', counter)
            // counters.set(componentId, counter);
            req.body[0].serviceSubGrpId = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            // req.body[0]['poNumber'] = `POCS0${counter}`;
            await serviceSubGroup.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
            console.log('req.body', req.body)
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
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
    // onCommonPost(req, res, taxGroup)
    try {
        if (req.body[0].taxGrpId != 0) {
            console.log('3')
            req.body[0].modifydt = new Date();
            await taxGroup.updateOne({ taxGrpId: { $eq: req.body[0].taxGrpId } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            console.log('Stock')
            const componentId = 'Add Item Category';
            const result = await taxGroup.aggregate([
                { $group: { _id: null, maxTaxGrpId: { $max: '$taxGrpId' } } }
            ]).exec();
            console.log('genericClassificationId', result[0].maxPoNumId)
            let counter = (result[0] && result[0].maxTaxGrpId) ? result[0].maxTaxGrpId + 1 : 1;
            console.log('genericClassification', counter)
            // counters.set(componentId, counter);
            req.body[0].taxGrpId = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            // req.body[0]['poNumber'] = `POCS0${counter}`;
            await taxGroup.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
            console.log('req.body', req.body)
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
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
    // onCommonPost(req, res, taxSubGroup)
    try {
        if (req.body[0].taxSubGrpId != 0) {
            console.log('3')
            req.body[0].modifydt = new Date();
            await taxSubGroup.updateOne({ taxSubGrpId: { $eq: req.body[0].taxSubGrpId } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            console.log('Stock')
            const componentId = 'Add Item Category';
            const result = await taxSubGroup.aggregate([
                { $group: { _id: null, maxTaxSubGrpId: { $max: '$taxSubGrpId' } } }
            ]).exec();
            console.log('genericClassificationId', result[0].maxPoNumId)
            let counter = (result[0] && result[0].maxTaxSubGrpId) ? result[0].maxTaxSubGrpId + 1 : 1;
            console.log('genericClassification', counter)
            // counters.set(componentId, counter);
            req.body[0].taxSubGrpId = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            // req.body[0]['poNumber'] = `POCS0${counter}`;
            await taxSubGroup.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
            console.log('req.body', req.body)
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }

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
    // onCommonPost(req, res, department)
    try {
        if (req.body[0].departmentId != 0) {
            console.log('3')
            req.body[0].modifydt = new Date();
            await department.updateOne({ departmentId: { $eq: req.body[0].departmentId } }, {
                $set: req.body[0]
            });
            res.json({ status: "200", message: 'Update Successfull' });
        } else {
            console.log('Stock')
            const componentId = 'Add Item Category';
            const result = await department.aggregate([
                { $group: { _id: null, maxDepartmentId: { $max: '$departmentId' } } }
            ]).exec();
            console.log('genericClassificationId', result[0].maxPoNumId)
            let counter = (result[0] && result[0].maxDepartmentId) ? result[0].maxDepartmentId + 1 : 1;
            console.log('genericClassification', counter)
            // counters.set(componentId, counter);
            req.body[0].departmentId = counter
            const currentdt = new Date();
            req.body[0].createdt = currentdt;
            // req.body[0]['poNumber'] = `POCS0${counter}`;
            await department.insertMany(req.body);
            res.json({ status: "200", message: 'Create Successfull' });
            console.log('req.body', req.body)
        }
    } catch (error) {
        console.log('Update Error')
        res.status(500).json({ status: "500", message: 'Error', error: error.message });
    }
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
