const mongoose = require('mongoose')

const warningSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    reportedUser: String,
    reportedUserID: String, 
    reasons: String,
    warnCount: Number 
})

module.exports = mongoose.model('warning', warningSchema)