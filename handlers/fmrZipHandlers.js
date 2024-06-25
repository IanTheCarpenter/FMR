const zipCode = require('../models/fmrZipCode')
async function fmrDataLookup(req, res) {
    const { identifier } = req.params

    fmr_data = await zipCode.findOne({identifier: identifier})
    if (fmr_data) {
        res.status(201).send(fmr_data)
    }
    else {
        res.status(404).send()
    }

}

module.exports = {
    fmrDataLookup
}