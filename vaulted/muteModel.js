const mongoose = require('mongoose')

const muteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    mutedUser: String,
    mutedUserID: String,
    reasons: String,
    muteCount: Number,
})

module.exports = mongoose.model('mute', muteSchema)