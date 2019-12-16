const mongoose = require('mongoose')

const banSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    bannedUser: String,
    bannedUserID: String,
    reasons: String,
    banCount: Number
})

module.exports = mongoose.model('ban', banSchema)