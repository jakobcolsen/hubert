const mongoose = require('mongoose')

const commandSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    disabledCommands: Array
})

module.exports = mongoose.model('disabledCommands', commandSchema)