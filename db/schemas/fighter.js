const mongoose = require('mongoose');

const fighterSchema = new mongoose.Schema({
    name: String,
    team: String,
    attacks: [String],
    stamina: Number,
    appeal: Number,
    str: Number,
    dex: Number
})

const Fighter = mongoose.model('Fighter', fighterSchema);

module.exports.Fighter = Fighter;