const express = require('express')

const router = express.Router()

// handler functions
const {
    zipLookup
} = require('../handlers/fmrZipHandlers')

router.route('/:zip_code').get(zipLookup)

module.exports = router