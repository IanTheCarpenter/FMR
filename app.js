const app = require('express')()
const cors = require('cors')

const zipCodeLookupRouter = require('./routes/fmrRoutes')
require('dotenv').config()

PORT = 3001 || process.env.PORT 
app.use(cors())

app.use('/api/v1/ziplookup', zipCodeLookupRouter)

const start = async () => {
    try {
        app.listen(PORT, console.log(`Server listening on port ${PORT}`))
    }
    catch (err) {
        console.log(err)
        console.log('***** UNABLE TO START SERVER *****')
    }
}
start()

module.exports = app