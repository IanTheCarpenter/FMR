const mongoose = require('mongoose')

const zipcodeSchema = mongoose.Schema({
    zip_code: {
        type: String,
        required:[true, 'Must provide a code'],
    },
    data: {
        type: Object,
        required:[true, 'Zip codes must have data']
    }
})

module.exports = mongoose.model('ZipCode', zipcodeSchema)