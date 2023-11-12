const express = require('express');
const router = express.Router();
const Items = require('../models/Items');
const { userMiddleware } = require('../middleware/userMiddleware');
const upload = require('../middleware/uploadMiddleware');
const fetchuser = require('../middleware/fetchuser');
const { default: mongoose, trusted } = require('mongoose');

router.post('/addItem', fetchuser, userMiddleware, upload.array('itemImages'), async (req, res) => {
    try
    {
        if(req.body)
        {
            const alreadyItem = await Items.findOne({itemName: req.body.itemName})
            if(alreadyItem) return res.status(400).json({message: "Item already reported!"})

            req.body.userId = req.user.id;
            req.body.date = Date.now();
    
            let itemImages = [];
    
            if(req.files.length > 0)
            {
                itemImages = req.files.map((file) => {
                    return {img: file.filename}
                })
            }

            req.body.itemImages = itemImages
    
            const item = await new Items(req.body);
            await item.save();
    
            return res.status(201).json(item);
        }
    
        else return res.status(400).json({message: "Please add required fields"})
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some time");    
    }
})

// get all items:
router.get('/getItems', fetchuser, userMiddleware, async (req, res) => {
    try
    {
        const allItems = await Items.find({}).populate("userId", "_id email contact");
        if(allItems) return res.status(200).json(allItems);
        else return res.status(400).json({message: "No Items!"});
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some time");    
    }
})

// get items of a particular user:
router.get('/user/getItems', fetchuser, userMiddleware, async (req, res) => {
    try
    {
        const userItems = await Items.find({userId: req.user.id});
        if(userItems) return res.status(200).json(userItems);
        else return res.status(400).json({message: "No Items!"});
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some time");    
    }
})

// get item by its id:
router.get('/getItem/:id', fetchuser, userMiddleware, async (req, res) => {
    try
    {
        const {id} = req.params;
        const _id = new mongoose.Types.ObjectId(id)
        const item = await Items.find({_id: _id}).populate("userId", "_id email contact");
        if(item) return res.status(200).json(item);
        else return res.status(400).json({message: "Oh! swap, something went wrong!"});
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some time");    
    }
})

// delete item:
router.delete('/deleteItem/:id', fetchuser, userMiddleware, async (req, res) => {
    try
    {
        const {id} = req.params;
        const _id = new mongoose.Types.ObjectId(id)
        const item = await Items.findOneAndDelete({_id: _id})
        if(item) return res.status(200).json(item);
        else return res.status(400).json({message: "Oh! swap, something went wrong!"});
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some time");    
    }
})

// update item:
router.post('/item/update', fetchuser, userMiddleware, upload.array('itemImages'), async (req, res) => {
    try
    {
        if(req.body)
        {
            const itemId = new mongoose.Types.ObjectId(req.body.id);
            const updateFields = {};

            if(req.body.itemName) updateFields.itemName = req.body.itemName;
            if(req.body.description) updateFields.description = req.body.description;
            if(req.body.itemType) updateFields.itemType = req.body.itemType;
            if(req.body.question) updateFields.question = req.body.question;

            // if images are also there for edit in request body:
            if(req.files.length > 0)
            {
                let itemImages = [];
                itemImages = req.files.map((image) => {
                    return {img: image.filename}
                })

                updateFields.itemImages = itemImages
            }

            const item = await Items.findOneAndUpdate({_id: itemId}, {
                "$set": updateFields
            }, {new: true})

            return res.status(200).json(item);
        }

        else return res.status(400).json({message: "No Update fields Provided"})
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some time");    
    }
})

// to add response of the user:
router.post('/item/response/add', fetchuser, userMiddleware, async (req, res) => {
    try
    {
        req.body.resUserId = req.user.id;
        const id = new mongoose.Types.ObjectId(req.body.itemId);


        const alreadyResponse = await Items.findOne({_id: id,"responses.resUserId": req.user.id})
        if(alreadyResponse) return res.status(400).json({message: "You Have already given a Response, Delete previous to give new one!"});

        else
        {
            const addResponse = await Items.findOneAndUpdate({_id: id}, {
                "$push": {
                    "responses": {
                        resUserId: req.user.id,
                        response: req.body.response
                    },
                }, 

                // "$set": {
                //     'itemStatus': "Claimed"
                // }

            }, {new: true})

            console.log(addResponse)

            return res.status(200).json(addResponse);
        }
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some time");    
    }
})

// to delete response:
router.post('/item/response/delete', fetchuser, userMiddleware, async (req, res) => {
    try
    {
        const deleteResponse = await Items.findOneAndUpdate({_id: req.body.itemId}, {
            "$pull": {
                responses: {_id: req.body.id}
            }
        }, {new: true});

        if(deleteResponse) return res.status(200).json(deleteResponse);
        else return res.status(400).json({message: "Oh Snap! Some Error Occured"})
    }

    catch (error)
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some time");    
    }
})

// API for replying to a response:
router.post('/item/response/reply', fetchuser, userMiddleware, async (req, res) => {
    try
    {
        const findResponse = await Items.findOneAndUpdate({_id: req.body.itemId, "responses._id": req.body.responseId}, {
            "$set": {
                "responses.$.status": req.body.reply === 'yes' ? "Accepted" : "Rejected",
                "itemStatus": req.body.reply === 'yes' ? "Recovered" : "Reported",
            }
        }, {new: true})

        if(findResponse) return res.status(200).json(findResponse)
        else return res.status(400).json({message: "Some Error Occured!"})
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some time");    
    }
})

module.exports = router;