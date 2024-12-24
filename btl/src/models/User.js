const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number },
    birthdate: { type: Date },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    occupation: { type: String, default: '' },
    location: { type: String, default: '' },
    joinDate: { type: Date, default: Date.now },
    preferences: {
        currency: { type: String, default: 'VND' },
        language: { type: String, default: 'vi' },
        theme: { type: String, default: 'light' }
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
