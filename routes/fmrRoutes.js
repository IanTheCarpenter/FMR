const express = require('express')

const router = express.Router()

// handler functions
const {
    zipLookup
} = require('../handlers/fmrZipHandlers')

router.route('/:zip_code').get(zipLookup)

router.route('/').get((req, res) => {
    res.send('hi')
})
g
module.exports = router