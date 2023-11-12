const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },

    itemName: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    itemType: {
        type: String,
        enum: ['lost', 'found'],
        required: true
    },

    question: {
        type: String,
        required: true,
        trim: true
    },

    itemStatus: {
        type: String,
        enum: ['Reported', 'Recovered'],
        default: 'Reported',
    },

    date: {
        type: Date,
        requied: true
    },

    itemImages: [
        {img: {type: String}}
    ],

    responses: [
        {
            resUserId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },

            response: {
                type: String
            },

            status: {
                type: String,
                enum: ['Pending', 'Accepted', 'Rejected'],
                default: 'Pending',
            }
        }
    ]
}, {timestamps: true})

module.exports = mongoose.model('Item', ItemSchema)