const mongoose = require('mongoose')

const kickSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    kickedUser: String,
    kickedUserID: String,
    reasons: String,
    kickCount: Number
})

module.exports = mongoose.model('kick', kickSchema)