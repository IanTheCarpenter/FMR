const zipCode = require('../models/fmrZipCode')
async function zipLookup(req, res) {
    const { zip_code } = req.params

    fmr_data = await zipCode.findOne({zip_code: zip_code})
    if (fmr_data) {
        res.status(201).send(fmr_data)
    }
    else {
        res.status(404).send()
    }

}

module.exports = {
    zipLookup
}