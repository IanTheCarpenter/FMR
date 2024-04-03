const app = require('express')()
const connectDB = require('./db/connect')
const zipCodeLookupRouter = require('./routes/fmrRoutes')
require('dotenv').config()

PORT = 3000 || process.env.PORT 

app.use('/api/v1/ziplookup', zipCodeLookupRouter)

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, console.log(`Server listening on port ${PORT}`))
    }
    catch (err) {
        console.log(err)
        console.log('***** UNABLE TO START SERVER *****')
    }
}
start()