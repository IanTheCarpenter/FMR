const zipCode = require('../models/fmrZipCode')

async function zipLookup(req, res) {
    const { zip_code } = req.params
    fmr_data = await zipCode.findOne({zip_code: zip_code})

    res.status(201).send(fmr_data)
}

module.exports = {
    zipLookup
}