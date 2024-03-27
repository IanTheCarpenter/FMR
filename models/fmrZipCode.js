const mongoose = require('mongoose')

const zipcodeSchema = mongoose.Schema({
    code: {
        type: String,
        required:[true, 'must provide a code'],
    }
})