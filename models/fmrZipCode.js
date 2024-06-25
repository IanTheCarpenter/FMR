const mongoose = require('mongoose')

const zipcodeSchema = mongoose.Schema({
    identifier: {
        type: String,
        required:[true, 'Must provide an identifier. Use either a zip code or CBSA code'],
    },
    data: {
        type: Object,
        required:[true, 'Zip codes must have data']
    }
})

module.exports = mongoose.model('ZipCode', zipcodeSchema)