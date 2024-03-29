const Mongoose = require('mongoose')

const connectDB = (url) => {
    return Mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

module.exports = connectDB