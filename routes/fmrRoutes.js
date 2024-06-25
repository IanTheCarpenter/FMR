const express = require('express')

const router = express.Router()

// handler functions
const { fmrDataLookup } = require('../handlers/fmrZipHandlers')

router.route('/:identifier').get(fmrDataLookup)

module.exports = router