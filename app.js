const app = require('express')()
const cors = require('cors')

const connectDB = require('./db/connect')
const zipCodeLookupRouter = require('./routes/fmrRoutes')
require('dotenv').config()

PORT = 3001 || process.env.PORT 
app.use(cors())

const test_router = express.router()
test_router.route('/').get((req, res) => {
    res.send('hi')
})

app.use('/', test_router)
app.use('/api/v1/ziplookup', zipCodeLookupRouter)

await connectDB(process.env.MONGO_URI)
app.listen(PORT, console.log(`Server listening on port ${PORT}`))
// const start = async () => {
//     try {
//     }
//     catch (err) {
//         console.log(err)
//         console.log('***** UNABLE TO START SERVER *****')
//     }
// }
// start()

module.exports = app