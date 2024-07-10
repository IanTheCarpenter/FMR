const express = require('express')

const router = express.Router()

// handler functions
const { fmrDataLookup } = require('../handlers/fmrZipHandlers')

router.route('/:zipCode').get(fmrDataLookup)

module.exports = router