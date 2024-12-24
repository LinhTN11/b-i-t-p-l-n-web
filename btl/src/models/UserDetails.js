const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
        unique: true
    },
    name: { type: String },
    age: { type: Number },
    birthdate: { type: Date },
    email: { type: String },
    phone: { type: String },
    hometown: { type: String, default: '' }, 
    avatar: { type: String, default: '' },
    totalIncome: { type: Number, default: 0 },
    totalExpense: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const UserDetails = mongoose.model('UserDetails', userDetailsSchema);
module.exports = UserDetails;
