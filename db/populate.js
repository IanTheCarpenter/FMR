require('dotenv').config()
const connectDB = require('./connect.js')
const ZipCode = require('../models/fmrZipCode')

const zipCodeData = require('../data/zipcodes_database_v2.json')


const main = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await ZipCode.deleteMany()
        await ZipCode.create(zipCodeData)
        console.log('successfully populated database')

        process.exit(0)
    }
    catch (err) {
        console.log(err)
        console.log(`unable to populate database!`)
        process.exit(1)
    }
}
main()