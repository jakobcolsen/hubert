const mongoose = require('mongoose')

const softbanSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    softbannedUser: String,
    softbannedUserID: String,
    reasons: String,
    softbanCount: Number
})

module.exports = mongoose.model('softban', softbanSchema)