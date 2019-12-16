const mongoose = require('mongoose')

const afkSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    afkUserID: String,
    afkStatus: String
})

module.exports = mongoose.model('afk', afkSchema)